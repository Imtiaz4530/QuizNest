import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldAlert,
  UserCheck,
  UserCog,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "restricted" | "blocked";
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Action modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"role" | "status" | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [updating, setUpdating] = useState(false);

  /*
   * Fetch users
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get<UsersResponse>("/users", {
        params: {
          page,
          limit: 10,
          role: roleFilter,
          status: statusFilter,
        },
      });

      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error("Fetch users error:", error);

      toast.error(error?.response?.data?.message || "Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  /*
   * Format date
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /*
   * Open role change modal
   */
  const openRoleModal = (user: User) => {
    // Admins cannot be changed back to user.
    if (user.role === "admin") {
      toast.info("Admin accounts cannot be changed to user.");
      return;
    }

    setSelectedUser(user);
    setActionType("role");
    setActionValue("admin");
  };

  /*
   * Open status change modal
   */
  const openStatusModal = (user: User) => {
    // Admin accounts cannot be restricted or blocked.
    if (user.role === "admin") {
      toast.info("Admin status cannot be changed.");
      return;
    }

    setSelectedUser(user);
    setActionType("status");
    setActionValue(user.status);
  };

  /*
   * Close modal
   */
  const closeModal = () => {
    if (updating) return;

    setSelectedUser(null);
    setActionType(null);
    setActionValue("");
  };

  /*
   * Update role/status
   */
  const handleUpdate = async () => {
    if (!selectedUser || !actionType || !actionValue) return;

    try {
      setUpdating(true);

      const payload =
        actionType === "role" ? { role: actionValue } : { status: actionValue };

      const response = await api.patch(`/users/${selectedUser._id}`, payload);

      toast.success(
        response.data.message ||
          `${actionType === "role" ? "Role" : "Status"} updated successfully.`,
      );

      closeModal();
      await fetchUsers();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Unable to update ${actionType === "role" ? "role" : "status"}.`,
      );
    } finally {
      setUpdating(false);
    }
  };

  /*
   * Status styles
   */
  const getStatusStyle = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400";

      case "restricted":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";

      case "blocked":
        return "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400";

      default:
        return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  /*
   * Status icon
   */
  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 size={14} />;

      case "restricted":
        return <ShieldAlert size={14} />;

      case "blocked":
        return <AlertTriangle size={14} />;

      default:
        return null;
    }
  };

  /*
   * Page change
   */
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6">
      {/* ===================================================== */}
      {/* PAGE HEADER */}
      {/* ===================================================== */}

      <div>
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          User Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage users, roles, and account access.
        </p>
      </div>

      {/* ===================================================== */}
      {/* FILTERS */}
      {/* ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Role */}
          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="restricted">Restricted</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total users
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {pagination.total}
          </p>
        </div>

        <div className="text-right text-sm text-slate-500 dark:text-slate-400">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>

      {/* ===================================================== */}
      {/* USERS */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <UsersIcon size={25} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No users found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Try changing your role or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-950/40">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const initials = user.name
                      .trim()
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0 dark:border-slate-800 dark:hover:bg-slate-800/40"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-full w-full rounded-xl object-cover"
                                />
                              ) : (
                                initials
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 dark:text-white">
                                {user.name}
                              </p>

                              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <Shield size={13} />
                            ) : (
                              <UserCheck size={13} />
                            )}

                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusStyle(
                              user.status,
                            )}`}
                          >
                            {getStatusIcon(user.status)}
                            {user.status}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(user.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {user.role === "user" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openRoleModal(user)}
                                  title="Make admin"
                                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                                >
                                  <UserCog size={16} />
                                  Make Admin
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openStatusModal(user)}
                                  title="Change status"
                                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                >
                                  <ShieldAlert size={16} />
                                  Status
                                </button>
                              </>
                            )}

                            {user.role === "admin" && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400">
                                <Shield size={15} />
                                Protected
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================================================= */}
            {/* MOBILE CARDS */}
            {/* ================================================= */}

            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {users.map((user) => {
                const initials = user.name
                  .trim()
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div key={user._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full rounded-xl object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          user.status,
                        )}`}
                      >
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                            user.role === "admin"
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <Shield size={12} />
                          ) : (
                            <UserCheck size={12} />
                          )}

                          {user.role === "admin" ? "Admin" : "User"}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>

                      {user.role === "user" && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => openRoleModal(user)}
                            title="Make admin"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                          >
                            <UserCog size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openStatusModal(user)}
                            title="Change status"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          >
                            <ShieldAlert size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===================================================== */}
        {/* PAGINATION */}
        {/* ===================================================== */}

        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {pagination.total}
              </span>{" "}
              users
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              )
                .filter(
                  (pageNumber) =>
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages ||
                    Math.abs(pageNumber - pagination.page) <= 1,
                )
                .map((pageNumber, index, visiblePages) => {
                  const previousPage = visiblePages[index - 1];

                  return (
                    <div key={pageNumber} className="flex items-center gap-2">
                      {previousPage && pageNumber - previousPage > 1 && (
                        <span className="px-1 text-slate-400">...</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`h-9 min-w-9 cursor-pointer rounded-lg px-2 text-sm font-semibold transition ${
                          pagination.page === pageNumber
                            ? "bg-indigo-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  );
                })}

              <button
                type="button"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* ROLE / STATUS MODAL */}
      {/* ===================================================== */}

      {selectedUser && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {actionType === "role"
                    ? "Make User Admin"
                    : "Change User Status"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedUser.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={updating}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6">
              {actionType === "role" ? (
                <>
                  <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
                    <Shield className="mt-0.5 shrink-0" size={19} />

                    <p className="text-sm leading-6">
                      This will give{" "}
                      <span className="font-bold">{selectedUser.name}</span>{" "}
                      admin privileges. Admin accounts have access to the
                      administration panel.
                    </p>
                  </div>

                  <div className="mt-5">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      New Role
                    </label>

                    <select
                      value={actionValue}
                      onChange={(event) => setActionValue(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    <ShieldAlert className="mt-0.5 shrink-0" size={19} />

                    <p className="text-sm leading-6">
                      Changing the status affects what this user can do in the
                      application.
                    </p>
                  </div>

                  <div className="mt-5">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Account Status
                    </label>

                    <select
                      value={actionValue}
                      onChange={(event) => setActionValue(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="active">Active</option>
                      <option value="restricted">Restricted</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={closeModal}
                disabled={updating}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  updating ||
                  (actionType === "status" &&
                    actionValue === selectedUser.status)
                }
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
