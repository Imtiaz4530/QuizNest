import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Flag,
  Loader2,
  Send,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

type OptionKey = "A" | "B" | "C" | "D";

interface QuizQuestion {
  _id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface QuizExam {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface StartQuizResponse {
  success: boolean;
  exam: QuizExam;
  totalQuestions: number;
  questions: QuizQuestion[];
}

interface SubmitQuizResponse {
  success: boolean;
  message: string;
  result: {
    attemptId: string;
    examId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
  };
}

const QUIZ_DURATION = 2 * 60;

const Quiz = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<QuizExam | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<string, OptionKey | undefined>>(
    {},
  );

  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prevent submitQuiz from being called more than once.
  const hasSubmitted = useRef(false);

  /*
   * Load quiz questions from backend.
   *
   * Your route:
   * GET /api/quizzes/:examId/start
   *
   * IMPORTANT:
   * This route currently requires examId, while this page receives
   * the exam slug from /categories/:slug.
   *
   * Therefore, this assumes your categories/exam details page
   * navigates to Quiz with the actual exam ID available.
   *
   * If your current route only contains the slug, see the note
   * below the code.
   */
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * If your URL is /quiz/bcs and "bcs" is the slug,
         * you cannot send "bcs" to /start because your backend
         * expects examId.
         *
         * This first gets the exam using the slug:
         *
         * GET /api/exams?slug=bcs
         *
         * If your exam API doesn't support slug filtering yet,
         * I explain the small backend change below.
         */

        const examResponse = await api.get("/exams", {
          params: {
            slug,
          },
        });

        const exams = examResponse.data?.exams || [];

        const matchedExam = exams.find((item: QuizExam) => item.slug === slug);

        if (!matchedExam) {
          throw new Error("Exam not found");
        }

        setExam(matchedExam);

        const quizResponse = await api.get<StartQuizResponse>(
          `/quizzes/${matchedExam._id}/start`,
        );

        if (!quizResponse.data.success) {
          throw new Error("Unable to start quiz");
        }

        setQuestions(quizResponse.data.questions);
      } catch (err: any) {
        console.error("Load quiz error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong while starting the quiz.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadQuiz();
    }
  }, [slug]);

  const question = questions[currentQuestion];

  const totalQuestions = questions.length;

  const progress = useMemo(() => {
    if (!totalQuestions) return 0;

    return ((currentQuestion + 1) / totalQuestions) * 100;
  }, [currentQuestion, totalQuestions]);

  /*
   * Submit quiz
   *
   * This function is used by BOTH:
   *
   * 1. Manual submit
   * 2. Automatic submit when timer reaches 0
   */
  const handleSubmit = useCallback(async () => {
    if (!exam || !questions.length) return;

    // Prevent duplicate requests.
    if (hasSubmitted.current || submitting) return;

    hasSubmitted.current = true;
    setSubmitting(true);

    try {
      /*
       * Backend expects:
       *
       * {
       *   examId,
       *   answers: [
       *     {
       *       questionId,
       *       selectedAnswer
       *     }
       *   ]
       * }
       */

      const formattedAnswers = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || null,
      }));

      const response = await api.post<SubmitQuizResponse>(
        `/quizzes/${exam._id}/submit`,
        {
          answers: formattedAnswers,
        },
      );

      if (!response.data.success) {
        throw new Error("Quiz submission failed");
      }

      /*
       * Navigate to result page.
       *
       * Example:
       * /quiz-result/665abc123
       */
      navigate(`/quiz-result/${response.data.result.attemptId}`, {
        replace: true,
        state: {
          result: response.data.result,
          exam,
        },
      });
    } catch (err: any) {
      console.error("Submit quiz error:", err);

      /*
       * Submission failed, so allow the user to try again.
       */
      hasSubmitted.current = false;
      setSubmitting(false);

      setError(
        err?.response?.data?.message ||
          "Something went wrong while submitting the quiz.",
      );
    }
  }, [exam, questions, answers, navigate, submitting]);

  /*
   * Timer
   *
   * When it reaches 0:
   * -> automatically submit
   * -> no more answers
   * -> no more navigation
   * -> redirect after successful submission
   */
  useEffect(() => {
    if (loading || submitting || hasSubmitted.current) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft, loading, submitting, handleSubmit]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const selectAnswer = (option: OptionKey) => {
    if (submitting || hasSubmitted.current || !question) return;

    setAnswers((previous) => ({
      ...previous,
      [question._id]: option,
    }));
  };

  const handlePrevious = () => {
    if (submitting || hasSubmitted.current) return;

    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (submitting || hasSubmitted.current) return;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <Loader2
              size={32}
              className="animate-spin text-indigo-600 dark:text-indigo-400"
            />

            <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
              Preparing your quiz...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error || !exam || !question) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-5 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Unable to start quiz
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {error || "Quiz data could not be loaded."}
            </p>

            <Link
              to="/categories"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft size={17} />
              Back to exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedAnswer = answers[question._id];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/categories"
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400"
            >
              <ArrowLeft size={16} />
              Back to exams
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {exam.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalQuestions} Questions · 25 Minutes
            </p>
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${
              timeLeft <= 300
                ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            <Clock3 size={19} />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                Time left
              </p>

              <p className="text-lg font-bold tabular-nums">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>

            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                Question {currentQuestion + 1}
              </span>

              <h2 className="mt-5 text-xl font-bold leading-8 text-slate-900 sm:text-2xl dark:text-white">
                {question.question}
              </h2>
            </div>

            <button
              type="button"
              disabled={submitting}
              className="hidden shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed sm:block dark:hover:bg-slate-800"
              title="Flag question"
            >
              <Flag size={19} />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(Object.entries(question.options) as [OptionKey, string][]).map(
              ([key, value]) => {
                const isSelected = selectedAnswer === key;

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={submitting}
                    onClick={() => selectAnswer(key)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400"
                      }`}
                    >
                      {key}
                    </span>

                    <span
                      className={`text-sm font-medium sm:text-base ${
                        isSelected
                          ? "text-indigo-900 dark:text-indigo-200"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {value}
                    </span>
                  </button>
                );
              },
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <Send size={16} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Next
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
