import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

import api from "../lib/axios";

interface Exam {
  _id: string;
  title: string;
  slug: string;
}

interface Question {
  _id: string;
  examId: Exam;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  createdAt: string;
  updatedAt: string;
}

interface QuestionsResponse {
  success: boolean;
  count: number;
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ExamsResponse {
  success: boolean;
  count: number;
  exams: Exam[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface QuestionFormData {
  examId: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}

const initialFormData: QuestionFormData = {
  examId: "",
  question: "",
  options: {
    A: "",
    B: "",
    C: "",
    D: "",
  },
  correctAnswer: "A",
};

const optionLabels = ["A", "B", "C", "D"] as const;

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Add / Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteQuestion, setDeleteQuestion] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState(false);

  /*
   * Fetch questions
   */
  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await api.get<QuestionsResponse>("/admin/questions", {
        params: {
          page,
          limit: 10,
          search,
          exam: examFilter,
        },
      });

      setQuestions(response.data.questions || []);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error("Fetch questions error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to fetch questions.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch exams for filter + form
   */
  const fetchExams = async () => {
    try {
      setExamsLoading(true);

      const response = await api.get<ExamsResponse>("/exams", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      setExams(response.data.exams || []);
    } catch (error: any) {
      console.error("Fetch exams error:", error);

      toast.error(error?.response?.data?.message || "Unable to fetch exams.");
    } finally {
      setExamsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, examFilter]);

  useEffect(() => {
    fetchExams();
  }, []);

  /*
   * Search
   */
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPage(1);
    fetchQuestions();
  };

  /*
   * Search input
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  /*
   * Exam filter
   */
  const handleExamFilterChange = (value: string) => {
    setExamFilter(value);
    setPage(1);
  };

  /*
   * Open Add modal
   */
  const openAddModal = () => {
    setEditingQuestion(null);

    setFormData({
      ...initialFormData,
      examId: examFilter || "",
    });

    setShowFormModal(true);
  };

  /*
   * Open Edit modal
   */
  const openEditModal = (question: Question) => {
    setEditingQuestion(question);

    setFormData({
      examId: question.examId?._id || "",
      question: question.question,
      options: {
        A: question.options?.A || "",
        B: question.options?.B || "",
        C: question.options?.C || "",
        D: question.options?.D || "",
      },
      correctAnswer: question.correctAnswer,
    });

    setShowFormModal(true);
  };

  /*
   * Close Add / Edit modal
   */
  const closeFormModal = () => {
    if (saving) return;

    setShowFormModal(false);
    setEditingQuestion(null);
    setFormData(initialFormData);
  };

  /*
   * Update normal field
   */
  const updateField = (field: keyof QuestionFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * Update option
   */
  const updateOption = (
    option: keyof QuestionFormData["options"],
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      options: {
        ...previous.options,
        [option]: value,
      },
    }));
  };

  /*
   * Submit Add / Edit
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.examId) {
      toast.error("Please select an exam.");
      return;
    }

    if (!formData.question.trim()) {
      toast.error("Question is required.");
      return;
    }

    const hasEmptyOption = optionLabels.some(
      (option) => !formData.options[option].trim(),
    );

    if (hasEmptyOption) {
      toast.error("All four options are required.");
      return;
    }

    if (!formData.correctAnswer) {
      toast.error("Please select the correct answer.");
      return;
    }

    const payload = {
      examId: formData.examId,
      question: formData.question.trim(),
      options: {
        A: formData.options.A.trim(),
        B: formData.options.B.trim(),
        C: formData.options.C.trim(),
        D: formData.options.D.trim(),
      },
      correctAnswer: formData.correctAnswer,
    };

    try {
      setSaving(true);

      if (editingQuestion) {
        const response = await api.patch(
          `/admin/questions/${editingQuestion._id}`,
          payload,
        );

        toast.success(
          response.data.message || "Question updated successfully.",
        );
      } else {
        const response = await api.post("/admin/questions", payload);

        toast.success(
          response.data.message || "Question created successfully.",
        );
      }

      setShowFormModal(false);
      setEditingQuestion(null);
      setFormData(initialFormData);

      await fetchQuestions();
    } catch (error: any) {
      console.error("Save question error:", error);

      toast.error(
        error?.response?.data?.message ||
          `Unable to ${editingQuestion ? "update" : "create"} question.`,
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Open delete modal
   */
  const openDeleteModal = (question: Question) => {
    setDeleteQuestion(question);
  };

  /*
   * Close delete modal
   */
  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteQuestion(null);
  };

  /*
   * Delete question
   */
  const handleDelete = async () => {
    if (!deleteQuestion) return;

    try {
      setDeleting(true);

      const response = await api.delete(
        `/admin/questions/${deleteQuestion._id}`,
      );

      toast.success(response.data.message || "Question deleted successfully.");

      setDeleteQuestion(null);

      /*
       * If deleting the last question on a page,
       * move to the previous page.
       */
      if (questions.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await fetchQuestions();
      }
    } catch (error: any) {
      console.error("Delete question error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to delete question.",
      );
    } finally {
      setDeleting(false);
    }
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

  /*
   * Truncate question for table
   */
  const truncateQuestion = (question: string, length = 75) => {
    if (question.length <= length) return question;

    return `${question.slice(0, length)}...`;
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
            Questions
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage quiz questions and their correct answers.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={17} />
          Add Question
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
              placeholder="Search questions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </form>

          {/* Exam */}

          <select
            value={examFilter}
            onChange={(event) => handleExamFilterChange(event.target.value)}
            disabled={examsLoading}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Exams</option>

            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>

          {/* Search button */}

          <button
            type="button"
            onClick={() => {
              setPage(1);
              fetchQuestions();
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
            Total questions
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
      {/* QUESTIONS */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          </div>
        ) : questions.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <BookOpen size={25} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No questions found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Try changing your search or exam filter, or create a new question.
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
                      Question
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Exam
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Correct
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
                  {questions.map((question) => (
                    <tr
                      key={question._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      {/* Question */}

                      <td className="max-w-md px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {truncateQuestion(question.question)}
                        </p>

                        <div className="mt-2 flex gap-2">
                          {optionLabels.map((option) => (
                            <span
                              key={option}
                              className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-bold ${
                                question.correctAnswer === option
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                              title={question.options[option]}
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Exam */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <BookOpen size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {question.examId?.title || "Unknown exam"}
                            </p>

                            {question.examId?.slug && (
                              <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                                {question.examId.slug}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Correct answer */}

                      <td className="px-6 py-4">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg bg-emerald-50 px-2.5 text-sm font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <Check size={14} />
                          {question.correctAnswer}
                        </span>
                      </td>

                      {/* Created */}

                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(question.createdAt)}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(question)}
                            title="Edit question"
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(question)}
                            title="Delete question"
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
              {questions.map((question) => (
                <div key={question._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <BookOpen size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold leading-6 text-slate-900 dark:text-white">
                          {question.question}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {question.examId?.title || "Unknown exam"}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 px-2 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {question.correctAnswer}
                    </span>
                  </div>

                  {/* Options */}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {optionLabels.map((option) => (
                      <div
                        key={option}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          question.correctAnswer === option
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <span className="mr-1.5 font-bold">{option}.</span>

                        {question.options[option]}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {formatDate(question.createdAt)}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(question)}
                        title="Edit question"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(question)}
                        title="Delete question"
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
              questions
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingQuestion ? "Edit Question" : "Add Question"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editingQuestion
                    ? "Update the question and its answers."
                    : "Create a new multiple-choice question."}
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
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                {/* Exam */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Exam
                  </label>

                  <select
                    value={formData.examId}
                    onChange={(event) =>
                      updateField("examId", event.target.value)
                    }
                    disabled={examsLoading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">
                      {examsLoading ? "Loading exams..." : "Select an exam"}
                    </option>

                    {exams.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Question
                  </label>

                  <textarea
                    value={formData.question}
                    onChange={(event) =>
                      updateField("question", event.target.value)
                    }
                    rows={4}
                    placeholder="e.g. What is 2 + 7?"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Options */}

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Options
                    </label>

                    <span className="text-xs text-slate-400">
                      Select the correct answer
                    </span>
                  </div>

                  <div className="space-y-3">
                    {optionLabels.map((option) => {
                      const isCorrect = formData.correctAnswer === option;

                      return (
                        <div
                          key={option}
                          className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                            isCorrect
                              ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                              : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((previous) => ({
                                ...previous,
                                correctAnswer: option,
                              }))
                            }
                            title={`Mark option ${option} as correct`}
                            className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-bold transition ${
                              isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700"
                            }`}
                          >
                            {isCorrect ? <Check size={17} /> : option}
                          </button>

                          <input
                            type="text"
                            value={formData.options[option]}
                            onChange={(event) =>
                              updateOption(option, event.target.value)
                            }
                            placeholder={`Option ${option}`}
                            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                          />

                          {isCorrect && (
                            <span className="hidden text-xs font-bold text-emerald-600 sm:block dark:text-emerald-400">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
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
                    : editingQuestion
                      ? "Save Changes"
                      : "Create Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ===================================================== */}

      {deleteQuestion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6">
              {/* Warning icon */}

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle size={23} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Delete question?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this question from{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {deleteQuestion.examId?.title || "this exam"}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">
                  {truncateQuestion(deleteQuestion.question, 120)}
                </p>
              </div>

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

                  {deleting ? "Deleting..." : "Delete Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
