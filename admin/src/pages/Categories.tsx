import {
  AlertTriangle,
  Briefcase,
  BriefcaseBusiness,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Edit,
  FolderOpen,
  GraduationCap,
  Landmark,
  Plus,
  Search,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
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

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

const initialFormData: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  order: 0,
};

const categoryIcons: Record<string, React.ElementType> = {
  trophy: Trophy,
  book: BookOpen,
  graduation: GraduationCap,
  briefcase: Briefcase,
  "briefcase-business": BriefcaseBusiness,
  landmark: Landmark,
  "folder-open": FolderOpen,
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

  // Add / Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const [deleting, setDeleting] = useState(false);

  /*
   * Fetch categories
   */
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

      setCategories(response.data.categories || []);
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
  }, [page, search, isActive]);

  /*
   * Open Add modal
   */
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData(initialFormData);
    setShowFormModal(true);
  };

  /*
   * Open Edit modal
   */
  const openEditModal = (category: Category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      order: category.order ?? 0,
    });

    setShowFormModal(true);
  };

  /*
   * Close Add / Edit modal
   */
  const closeFormModal = () => {
    if (saving) return;

    setShowFormModal(false);
    setEditingCategory(null);
    setFormData(initialFormData);
  };

  /*
   * Update form field
   */
  const updateField = (
    field: keyof CategoryFormData,
    value: string | number,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * Submit Add / Edit
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Category slug is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        const response = await api.patch(`/categories/${editingCategory._id}`, {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          icon: formData.icon.trim(),
          order: Number(formData.order),
        });

        toast.success(
          response.data.message || "Category updated successfully.",
        );
      } else {
        const response = await api.post("/categories", {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          icon: formData.icon.trim(),
          order: Number(formData.order),
        });

        toast.success(
          response.data.message || "Category created successfully.",
        );
      }

      // Don't call closeFormModal() here because saving is still true.
      setShowFormModal(false);
      setEditingCategory(null);
      setFormData(initialFormData);

      await fetchCategories();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Unable to ${editingCategory ? "update" : "create"} category.`,
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Open delete confirmation
   */
  const openDeleteModal = (category: Category) => {
    setDeleteCategory(category);
  };

  /*
   * Close delete confirmation
   */
  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteCategory(null);
  };

  /*
   * Delete category
   */
  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      setDeleting(true);

      const response = await api.delete(`/categories/${deleteCategory._id}`);

      toast.success(response.data.message || "Category deleted successfully.");

      setDeleteCategory(null);

      /*
       * If deleting the last category
       * on a page, move to previous page.
       */
      if (categories.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await fetchCategories();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to delete category.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
   * Search
   */
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPage(1);

    /*
     * Because search is already in the dependency array,
     * changing page/search will fetch automatically.
     */
    fetchCategories();
  };

  /*
   * Search input
   *
   * Don't fetch on every keystroke.
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  /*
   * Status filter
   */
  const handleActiveChange = (value: string) => {
    setIsActive(value);
    setPage(1);
  };

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
          onClick={openAddModal}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={17} />
          Add Category
        </button>
      </div>

      {/* ===================================================== */}
      {/* FILTERS */}
      {/* ===================================================== */}

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
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </form>

          {/* Status */}
          <select
            value={isActive}
            onChange={(event) => handleActiveChange(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Search button */}
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

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

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

      {/* ===================================================== */}
      {/* CATEGORIES */}
      {/* ===================================================== */}

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
            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

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
                            onClick={() => openEditModal(category)}
                            title="Edit category"
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(category)}
                            title="Delete category"
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================================================= */}
            {/* MOBILE CARDS */}
            {/* ================================================= */}

            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {categories.map((category) => (
                <div key={category._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {getCategoryIcon(category.icon)}
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
                        onClick={() => openEditModal(category)}
                        title="Edit category"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(category)}
                        title="Delete category"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
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
              categories
            </p>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                type="button"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={17} />
              </button>

              {/* Page numbers */}
              {Array.from(
                {
                  length: pagination.totalPages,
                },
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

              {/* Next */}
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
      {/* ADD / EDIT MODAL */}
      {/* ===================================================== */}

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editingCategory
                    ? "Update the category information."
                    : "Create a new quiz category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={saving}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-6">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="e.g. Job Exams"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Slug
                  </label>

                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", event.target.value)
                    }
                    placeholder="e.g. job-exams"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    rows={3}
                    placeholder="Describe this category..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Icon + Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Icon
                    </label>

                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(event) =>
                        updateField("icon", event.target.value)
                      }
                      placeholder="briefcase-business"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Order
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={formData.order}
                      onChange={(event) =>
                        updateField("order", Number(event.target.value))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={saving}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ===================================================== */}

      {deleteCategory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6">
              {/* Warning icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle size={23} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Delete category?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {deleteCategory.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />

                  {deleting ? "Deleting..." : "Delete Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
