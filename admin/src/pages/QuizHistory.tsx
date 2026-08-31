import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Trophy,
  Users,
  X,
} from "lucide-react";
import api from "../lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Exam {
  _id: string;
  title: string;
  slug: string;
}

interface Answer {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  _id: string;
}

interface QuizAttempt {
  _id: string;
  userId: User;
  examId: Exam;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface QuizAttemptsResponse {
  success: boolean;
  count: number;
  attempts: QuizAttempt[];
  pagination: Pagination;
}

const QuizHistory = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(
    null,
  );

  const fetchAttempts = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<QuizAttemptsResponse>(
        `/quiz-attempts?page=${page}&limit=20`,
      );

      if (response.data.success) {
        setAttempts(response.data.attempts);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load quiz attempt history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts(1);
  }, []);

  const exams = useMemo(() => {
    const uniqueExams = new Map<string, Exam>();

    attempts.forEach((attempt) => {
      if (attempt.examId?._id) {
        uniqueExams.set(attempt.examId._id, attempt.examId);
      }
    });

    return Array.from(uniqueExams.values());
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attempts.filter((attempt) => {
      const matchesSearch =
        !query ||
        attempt.userId?.name?.toLowerCase().includes(query) ||
        attempt.userId?.email?.toLowerCase().includes(query) ||
        attempt.examId?.title?.toLowerCase().includes(query);

      const matchesExam =
        selectedExam === "all" || attempt.examId?._id === selectedExam;

      return matchesSearch && matchesExam;
    });
  }, [attempts, search, selectedExam]);

  const getPercentage = (score: number, total: number) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  const getScoreClass = (percentage: number) => {
    if (percentage >= 80) {
      return "text-emerald-600 dark:text-emerald-400";
    }

    if (percentage >= 50) {
      return "text-amber-600 dark:text-amber-400";
    }

    return "text-red-600 dark:text-red-400";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quiz History
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and monitor quiz attempts from all users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Attempts
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {pagination.total}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
              <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Attempts This Page
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {attempts.length}
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Exams</p>

              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {exams.length}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10">
              <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, email or exam..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {/* Exam filter */}
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">All Exams</option>

            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Exam
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Score
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Result
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-5">
                        <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <Trophy className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-700" />

                    <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                      No quiz attempts found
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAttempts.map((attempt) => {
                  const percentage = getPercentage(
                    attempt.score,
                    attempt.totalQuestions,
                  );

                  return (
                    <tr
                      key={attempt._id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {getInitials(attempt.userId?.name || "User")}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {attempt.userId?.name || "Unknown User"}
                            </p>

                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {attempt.userId?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Exam */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {attempt.examId?.title || "Unknown Exam"}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {attempt.examId?.slug || "-"}
                        </p>
                      </td>

                      {/* Score */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {attempt.score}/{attempt.totalQuestions}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-sm font-bold ${getScoreClass(
                            percentage,
                          )}`}
                        >
                          {percentage}%
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(attempt.createdAt)}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTime(attempt.createdAt)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedAttempt(attempt)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchAttempts(pagination.page - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchAttempts(pagination.page + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAttempt(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Quiz Attempt Details
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedAttempt.examId?.title}
                </p>
              </div>

              <button
                onClick={() => setSelectedAttempt(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-6">
              {/* User */}
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  User
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {selectedAttempt.userId?.name}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAttempt.userId?.email}
                </p>
              </div>

              {/* Score */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Score
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {selectedAttempt.score}/{selectedAttempt.totalQuestions}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Percentage
                  </p>

                  <p
                    className={`mt-1 text-xl font-bold ${getScoreClass(
                      getPercentage(
                        selectedAttempt.score,
                        selectedAttempt.totalQuestions,
                      ),
                    )}`}
                  >
                    {getPercentage(
                      selectedAttempt.score,
                      selectedAttempt.totalQuestions,
                    )}
                    %
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Questions
                  </p>

                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {selectedAttempt.totalQuestions}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Attempted
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(selectedAttempt.createdAt)} at{" "}
                  {formatTime(selectedAttempt.createdAt)}
                </p>
              </div>

              {/* Answers */}
              {selectedAttempt.answers?.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Answer Summary
                    </h3>

                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {
                        selectedAttempt.answers.filter(
                          (answer) => answer.isCorrect,
                        ).length
                      }{" "}
                      correct
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedAttempt.answers.map((answer, index) => (
                      <div
                        key={answer._id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Question {index + 1}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {answer.selectedAnswer || "Skipped"}
                          </span>

                          <span
                            className={`text-xs font-semibold ${
                              answer.isCorrect
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {answer.isCorrect ? "Correct" : "Wrong"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
