import {
  ChevronLeft,
  ChevronRight,
  Edit,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Landmark,
  Trophy,
  Users,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const categoryIcons: Record<string, React.ElementType> = {
  trophy: Trophy,
  book: BookOpen,
  graduation: GraduationCap,
  moon: Users,
  award: Award,
  briefcase: Briefcase,
  landmark: Landmark,
};

const getCategoryIcon = (icon: string) => {
  const Icon = categoryIcons[icon?.toLowerCase()];

  return Icon ? <Icon size={18} /> : <FolderOpen size={18} />;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get<CategoriesResponse>("/categories", {
        params: {
          page,
          limit: 10,
          search,
          isActive,
        },
      });

      setCategories(response.data.categories);

      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error("Fetch categories error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to fetch categories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, isActive]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setPage(1);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Category deleted successfully.");

      // If the current page becomes empty after deletion,
      // move to the previous page.
      if (categories.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Delete category error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to delete category.",
      );
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Content Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage quiz categories and their visibility.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </form>

          {/* Status */}
          <select
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setPage(1);
              fetchCategories();
            }}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total categories
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {pagination.total}
          </p>
        </div>

        <div className="text-right text-sm text-slate-500 dark:text-slate-400">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FolderOpen size={25} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No categories found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Try changing your search or status filter, or create a new
              category.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-950/40">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      {/* Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            {getCategoryIcon(category.icon)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {category.name}
                            </p>

                            {category.description && (
                              <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {category.slug}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            category.isActive
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {category.order}
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(category.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Edit category"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            title="Delete category"
                            onClick={() => handleDelete(category._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {categories.map((category) => (
                <div key={category._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {category.icon || <FolderOpen size={18} />}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {category.slug}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        category.isActive
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {category.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Order:{" "}
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {category.order}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category._id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            categories
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page === 1}
              onClick={() => setPage((previous) => previous - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1,
            )
              .filter((pageNumber) => {
                return (
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  Math.abs(pageNumber - pagination.page) <= 1
                );
              })
              .map((pageNumber, index, visiblePages) => {
                const previousPage = visiblePages[index - 1];

                return (
                  <div key={pageNumber} className="flex items-center gap-2">
                    {previousPage && pageNumber - previousPage > 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
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
              onClick={() => setPage((previous) => previous + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
