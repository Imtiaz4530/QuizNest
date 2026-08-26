import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ExamCard from "../components/ExamCard";
import { getCategories } from "../api/categoryApi";
import {
  getExams,
  type Category,
  type Exam,
  type ExamPagination,
} from "../api/examApi";

const iconMap: Record<string, React.ReactNode> = {
  briefcase: <BookOpen size={24} />,
  graduation: <BookOpen size={24} />,
  book: <BookOpen size={24} />,
  calculator: <BookOpen size={24} />,
  trophy: <BookOpen size={24} />,
  moon: <BookOpen size={24} />,
  globe: <BookOpen size={24} />,
  flag: <BookOpen size={24} />,
};

const getCategoryIcon = (icon?: string) => {
  if (!icon) {
    return <BookOpen size={24} />;
  }

  return iconMap[icon.toLowerCase()] ?? <BookOpen size={24} />;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [pagination, setPagination] = useState<ExamPagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);

  const [categoryError, setCategoryError] = useState("");
  const [examError, setExamError] = useState("");

  /*
   * Fetch categories
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");

        const response = await getCategories();

        setCategories(response.categories ?? []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategoryError("Unable to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /*
   * Fetch exams
   *
   * Whenever the page or selected category changes,
   * the API is called again.
   */
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        setExamError("");

        const response = await getExams(
          pagination.page,
          pagination.limit,
          selectedCategory || undefined,
        );

        setExams(response.exams ?? []);

        setPagination((previous) => ({
          ...previous,
          ...(response.pagination ?? {}),
        }));
      } catch (error) {
        console.error("Failed to load exams:", error);
        setExamError("Unable to load exams. Please try again.");
        setExams([]);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [pagination.page, pagination.limit, selectedCategory]);

  /*
   * Change category
   *
   * Always return to page 1 when filtering.
   */
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  /*
   * Change page
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) {
      return;
    }

    setPagination((previous) => ({
      ...previous,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Generate a small pagination range.
   *
   * Example:
   * 1 2 3 ... 10
   */
  const paginationItems = useMemo(() => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    if (totalPages <= 1) {
      return [];
    }

    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }, [pagination.page, pagination.totalPages]);

  const activeCategoryName =
    categories.find((category) => category.slug === selectedCategory)?.name ??
    "All Exams";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="border-b border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400">
              <BookOpen size={14} />
              Explore QuizNest
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Choose your
              <span className="text-indigo-600"> challenge.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
              Explore exams and practice categories designed for Bangladeshi
              students, job seekers, and competitive exam candidates.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {/* =======================================================
            CATEGORIES
        ======================================================= */}
        <section>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Browse
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              Explore by category
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Choose a category to find the exams you want to practice.
            </p>
          </div>

          {categoryError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {categoryError}
            </div>
          ) : loadingCategories ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* All exams */}
              <button
                type="button"
                onClick={() => handleCategoryChange("")}
                className={`group rounded-2xl border p-5 text-left transition ${
                  selectedCategory === ""
                    ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    selectedCategory === ""
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  }`}
                >
                  <BookOpen size={24} />
                </div>

                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  All Exams
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Browse every available exam on QuizNest.
                </p>

                <div className="mt-4 flex items-center justify-end">
                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                  />
                </div>
              </button>

              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`group rounded-2xl border p-5 text-left transition ${
                    selectedCategory === category.slug
                      ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                      selectedCategory === category.slug
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                    }`}
                  >
                    {getCategoryIcon(category.icon)}
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                    {category.name}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {category.description || "Explore exams in this category."}
                  </p>

                  <div className="mt-4 flex items-center justify-end">
                    <ChevronRight
                      size={16}
                      className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* =======================================================
            EXAMS
        ======================================================= */}
        <section className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                Exams
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {activeCategoryName}
              </h2>

              {!loadingExams && !examError && pagination.total > 0 && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {Math.min(
                      (pagination.page - 1) * pagination.limit + 1,
                      pagination.total,
                    )}
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {pagination.total}
                  </span>{" "}
                  exams
                </p>
              )}
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {pagination.limit} per page
            </div>
          </div>

          {/* Error */}
          {examError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {examError}
            </div>
          )}

          {/* Loading */}
          {loadingExams && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loadingExams && !examError && exams.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Search size={26} />
              </div>

              <h3 className="mt-5 font-bold text-slate-900 dark:text-white">
                No exams found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                There are currently no active exams in this category. Try
                another category.
              </p>

              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  View all exams
                </button>
              )}
            </div>
          )}

          {/* Exams */}
          {!loadingExams && !examError && exams.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <ExamCard key={exam._id} exam={exam} />
              ))}
            </div>
          )}

          {/* =====================================================
              PAGINATION
          ===================================================== */}
          {!loadingExams && !examError && pagination.totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  type="button"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-10 w-10 items-center justify-center text-sm text-slate-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
                        pagination.page === item
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  type="button"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =======================================================
            CTA
        ======================================================= */}
        <section className="mt-14 overflow-hidden rounded-3xl bg-indigo-600 px-6 py-10 shadow-xl shadow-indigo-600/10 sm:px-10 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-100">
                <Users size={18} />

                <span className="text-sm font-semibold">
                  Learn. Practice. Improve.
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Ready to test your knowledge?
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Pick an exam and start a quick MCQ quiz. Challenge yourself and
                keep improving.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
              Start a Quiz
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Categories;
