import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Trophy,
  ClipboardList,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import api from "../lib/axios";

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
  userId: string;
  examId: Exam;
  score: number;
  totalQuestions?: number;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

const QuizHistory = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/quiz-attempts/my");

        setAttempts(response.data.attempts || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load quiz history.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, []);

  const getPercentage = (score: number, totalQuestions: number) => {
    if (!totalQuestions) return 0;
    return Math.round((score / totalQuestions) * 100);
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
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <ClipboardList size={22} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Quiz History
            </h1>
          </div>

          <p className="text-gray-500 dark:text-gray-400">
            Review your previous quiz attempts and track your progress.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Attempts
              </p>

              <ClipboardList size={19} className="text-blue-500" />
            </div>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {attempts.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Best Score
              </p>

              <Trophy size={19} className="text-yellow-500" />
            </div>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {attempts.length
                ? Math.max(...attempts.map((attempt) => attempt.score))
                : 0}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Score
              </p>

              <Trophy size={19} className="text-green-500" />
            </div>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {attempts.length
                ? Math.round(
                    attempts.reduce(
                      (total, attempt) => total + attempt.score,
                      0,
                    ) / attempts.length,
                  )
                : 0}
            </p>
          </div>
        </div>

        {/* Empty */}
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <ClipboardList size={42} className="mx-auto mb-4 text-gray-400" />

            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No quiz attempts yet
            </h2>

            <p className="mb-6 text-gray-500 dark:text-gray-400">
              Complete a quiz to see your history here.
            </p>

            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Take a Quiz
              <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          /* History */
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const totalQuestions =
                attempt.totalQuestions || attempt.answers.length;

              const percentage = getPercentage(attempt.score, totalQuestions);

              return (
                <div
                  key={attempt._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Exam info */}
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                        {attempt.examId?.title || "Unknown Exam"}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={15} />
                          {formatDate(attempt.createdAt)}
                        </span>

                        <span>{totalQuestions} Questions</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Score
                        </p>

                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {attempt.score}/{totalQuestions}
                        </p>

                        <p
                          className={`text-sm font-medium ${
                            percentage >= 80
                              ? "text-green-600 dark:text-green-400"
                              : percentage >= 50
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {percentage}%
                        </p>
                      </div>

                      {/* View */}
                      <Link
                        to={`/quiz-history/${attempt._id}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        title="View attempt"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Performance</span>
                      <span>{percentage}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
