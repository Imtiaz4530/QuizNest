import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Loader2,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "../lib/axios";

type OptionKey = "A" | "B" | "C" | "D";

interface Question {
  _id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: OptionKey;
}

interface AttemptAnswer {
  questionId: Question;
  selectedAnswer: OptionKey | null;
  isCorrect: boolean;
}

interface QuizAttempt {
  _id: string;
  examId: {
    _id: string;
    title: string;
    slug: string;
  };
  score: number;
  answers: AttemptAnswer[];
  createdAt: string;
}

const ResultDetails = () => {
  const { id } = useParams();

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempt = async () => {
      if (!id) {
        setError("Invalid result ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`/quiz-attempts/my/${id}`);

        setAttempt(response.data.attempt);
      } catch (error: any) {
        console.error("Fetch quiz result error:", error);

        setError(
          error?.response?.data?.message ||
            "Something went wrong while loading this result.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [id]);

  const statistics = useMemo(() => {
    if (!attempt) {
      return {
        correct: 0,
        wrong: 0,
        unanswered: 0,
        total: 0,
        percentage: 0,
      };
    }

    const correct = attempt.answers.filter((answer) => answer.isCorrect).length;

    const unanswered = attempt.answers.filter(
      (answer) => answer.selectedAnswer === null,
    ).length;

    const wrong = attempt.answers.filter(
      (answer) => answer.selectedAnswer !== null && !answer.isCorrect,
    ).length;

    const total = attempt.answers.length;

    const percentage =
      total > 0 ? Math.round((attempt.score / total) * 100) : 0;

    return {
      correct,
      wrong,
      unanswered,
      total,
      percentage,
    };
  }, [attempt]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPercentageStyle = (percentage: number) => {
    if (percentage >= 80) {
      return {
        wrapper:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
        ring: "border-emerald-500",
      };
    }

    if (percentage >= 50) {
      return {
        wrapper:
          "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
        ring: "border-amber-500",
      };
    }

    return {
      wrapper: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
      ring: "border-red-500",
    };
  };

  const getOptionStyle = (answer: AttemptAnswer, option: OptionKey) => {
    const isCorrectAnswer = option === answer.questionId.correctAnswer;

    const isSelectedAnswer = option === answer.selectedAnswer;

    if (isCorrectAnswer) {
      return "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/20";
    }

    if (isSelectedAnswer && !answer.isCorrect) {
      return "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20";
    }

    return "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";
  };

  const getOptionLabelStyle = (answer: AttemptAnswer, option: OptionKey) => {
    const isCorrectAnswer = option === answer.questionId.correctAnswer;

    const isSelectedAnswer = option === answer.selectedAnswer;

    if (isCorrectAnswer) {
      return "bg-emerald-600 text-white";
    }

    if (isSelectedAnswer && !answer.isCorrect) {
      return "bg-red-600 text-white";
    }

    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-5">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-medium">Loading your result...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-2xl items-center justify-center px-5">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <CircleAlert size={25} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Result not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {error || "We could not find this quiz result."}
            </p>

            <Link
              to="/results"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft size={16} />
              Back to Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const percentageStyle = getPercentageStyle(statistics.percentage);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/results"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back to Results
        </Link>

        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Quiz Result
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {attempt.examId?.title || "Quiz"}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {formatDate(attempt.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={15} />
                  {formatTime(attempt.createdAt)}
                </span>
              </div>
            </div>

            {/* Score */}
            <div
              className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-4 ${percentageStyle.ring}`}
            >
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {statistics.percentage}%
              </span>

              <span className="mt-0.5 text-xs font-semibold text-slate-400">
                Score
              </span>
            </div>
          </div>

          {/* Score line */}
          <div className="mt-7 border-t border-slate-100 pt-6 dark:border-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your score
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {attempt.score}{" "}
                  <span className="text-sm font-medium text-slate-400">
                    / {statistics.total}
                  </span>
                </p>
              </div>

              <div
                className={`inline-flex w-fit rounded-xl px-3 py-2 text-xs font-bold ${percentageStyle.wrapper}`}
              >
                {statistics.percentage >= 80
                  ? "Excellent performance"
                  : statistics.percentage >= 50
                    ? "Good effort"
                    : "Keep practicing"}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Correct</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {statistics.correct}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <XCircle size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Wrong</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {statistics.wrong}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <CircleAlert size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Unanswered</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {statistics.unanswered}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Question Review
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review your answers and compare them with the correct answers.
            </p>
          </div>

          <div className="space-y-5">
            {attempt.answers.map((answer, index) => {
              const question = answer.questionId;

              if (!question) {
                return null;
              }

              const options = Object.entries(question.options) as [
                OptionKey,
                string,
              ][];

              const unanswered = answer.selectedAnswer === null;

              return (
                <div
                  key={question._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Question {index + 1}
                    </span>

                    {unanswered ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <CircleAlert size={13} />
                        Unanswered
                      </span>
                    ) : answer.isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                        <CheckCircle2 size={13} />
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600 dark:bg-red-950/30 dark:text-red-400">
                        <XCircle size={13} />
                        Incorrect
                      </span>
                    )}
                  </div>

                  {/* Question body */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-base font-bold leading-7 text-slate-900 dark:text-white sm:text-lg">
                      {question.question}
                    </h3>

                    {/* Options */}
                    <div className="mt-6 space-y-3">
                      {options.map(([key, value]) => {
                        const isCorrect = key === question.correctAnswer;

                        const isSelected = key === answer.selectedAnswer;

                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-3 rounded-2xl border p-4 ${getOptionStyle(
                              answer,
                              key,
                            )}`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getOptionLabelStyle(
                                answer,
                                key,
                              )}`}
                            >
                              {key}
                            </span>

                            <span className="min-w-0 flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                              {value}
                            </span>

                            <div className="flex shrink-0 items-center gap-2">
                              {isSelected && (
                                <span
                                  className={`hidden text-[10px] font-bold uppercase tracking-wide sm:inline ${
                                    answer.isCorrect
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  Your answer
                                </span>
                              )}

                              {isCorrect && (
                                <span className="hidden text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:inline">
                                  Correct answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Answer summary */}
                    <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Your answer:{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {answer.selectedAnswer || "Not answered"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Correct answer:{" "}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {question.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 flex justify-center border-t border-slate-200 pt-7 dark:border-slate-800">
          <Link
            to="/results"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to Result History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;
