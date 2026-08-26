import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Flag, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";

type OptionKey = "A" | "B" | "C" | "D";

interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which is the national flower of Bangladesh?",
    options: {
      A: "Rose",
      B: "Water Lily",
      C: "Sunflower",
      D: "Marigold",
    },
  },
  {
    id: 2,
    question: "What is the capital city of Bangladesh?",
    options: {
      A: "Chittagong",
      B: "Rajshahi",
      C: "Dhaka",
      D: "Sylhet",
    },
  },
  {
    id: 3,
    question: "In which year did Bangladesh gain independence?",
    options: {
      A: "1947",
      B: "1952",
      C: "1971",
      D: "1975",
    },
  },
];

const TOTAL_QUESTIONS = 25;
const QUIZ_DURATION = 25 * 60;

const Quiz = () => {
  const { slug } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey | undefined>>(
    {},
  );
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);

  const question = questions[currentQuestion];

  const progress = useMemo(() => {
    return ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const selectAnswer = (option: OptionKey) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: option,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submit quiz", {
      slug,
      answers,
    });

    // Later:
    // POST /api/quiz/:examId/submit
  };

  const selectedAnswer = answers[question.id];

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
              Bangladesh General Knowledge
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              25 Questions · 25 Minutes
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
              Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
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
              className="hidden shrink-0 rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 sm:block dark:hover:bg-slate-800"
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
                    onClick={() => selectAnswer(key)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
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
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            {currentQuestion === TOTAL_QUESTIONS - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Submit Quiz
                <Send size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
