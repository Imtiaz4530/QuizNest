import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Loader2,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

interface QuizAttempt {
  _id: string;
  examId: {
    _id: string;
    title: string;
    slug: string;
  };
  score: number;
  answers: {
    questionId: string;
    selectedAnswer: "A" | "B" | "C" | "D" | null;
    isCorrect: boolean;
  }[];
  createdAt: string;
}

const RESULTS_PER_PAGE = 10;

const Results = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get("/quiz-attempts/my");

        setAttempts(response.data.attempts || []);
      } catch (error: any) {
        console.error("Fetch quiz attempts error:", error);

        setError(
          error?.response?.data?.message ||
            "Something went wrong while loading your results.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const totalPages = Math.ceil(attempts.length / RESULTS_PER_PAGE);

  const paginatedAttempts = attempts.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE,
  );

  const getPercentage = (attempt: QuizAttempt) => {
    if (!attempt.answers.length) return 0;

    return Math.round((attempt.score / attempt.answers.length) * 100);
  };

  const getCorrectAnswers = (attempt: QuizAttempt) => {
    return attempt.answers.filter((answer) => answer.isCorrect).length;
  };

  const getWrongAnswers = (attempt: QuizAttempt) => {
    return attempt.answers.filter(
      (answer) => answer.selectedAnswer !== null && !answer.isCorrect,
    ).length;
  };

  const getUnanswered = (attempt: QuizAttempt) => {
    return attempt.answers.filter((answer) => answer.selectedAnswer === null)
      .length;
  };

  const getScoreStyle = (percentage: number) => {
    if (percentage >= 80) {
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400";
    }

    if (percentage >= 50) {
      return "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400";
    }

    return "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-5">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-medium">Loading your results...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <ClipboardCheck size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Quiz Results
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review your quiz history and track your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && attempts.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Trophy size={25} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              No quiz results yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Complete your first quiz and your result will appear here.
            </p>

            <Link
              to="/categories"
              className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Browse Exams
            </Link>
          </div>
        )}

        {/* Results */}
        {!error && attempts.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {attempts.length}{" "}
                {attempts.length === 1 ? "quiz attempt" : "quiz attempts"}
              </p>
            </div>

            <div className="space-y-4">
              {paginatedAttempts.map((attempt) => {
                const totalQuestions = attempt.answers.length;
                const correct = getCorrectAnswers(attempt);
                const wrong = getWrongAnswers(attempt);
                const unanswered = getUnanswered(attempt);
                const percentage = getPercentage(attempt);

                return (
                  <div
                    key={attempt._id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Exam */}
                      <div className="min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <Trophy size={20} />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                              {attempt.examId?.title || "Unknown Exam"}
                            </h2>

                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                              <CalendarDays size={14} />
                              {formatDate(attempt.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-xl px-4 py-2 text-center ${getScoreStyle(
                            percentage,
                          )}`}
                        >
                          <p className="text-xl font-bold">{percentage}%</p>

                          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                            Score
                          </p>
                        </div>

                        <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {attempt.score}/{totalQuestions}
                          </p>

                          <p className="text-xs text-slate-400">Points</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex sm:items-center sm:gap-6">
                      <div>
                        <p className="text-[11px] text-slate-400">Correct</p>
                        <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {correct}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400">Wrong</p>
                        <p className="mt-1 text-sm font-bold text-red-600 dark:text-red-400">
                          {wrong}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400">Unanswered</p>
                        <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                          {unanswered}
                        </p>
                      </div>

                      <div className="hidden flex-1 sm:block" />

                      <Link
                        to={`/results/${attempt._id}`}
                        className="col-span-3 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-200 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 sm:col-span-1"
                      >
                        <Eye size={16} />
                        View Result
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
