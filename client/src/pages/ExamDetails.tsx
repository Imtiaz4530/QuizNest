import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Loader2,
  Trophy,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Exam {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: Category;
  icon: string;
  isActive: boolean;
  isPopular: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const ExamDetails = () => {
  const { slug, examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`/exams/${examId}`);

        setExam(response.data.exam);
      } catch (error: any) {
        console.error("Fetch exam error:", error);

        setError(
          error.response?.data?.message || "Unable to load exam information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="animate-spin" size={22} />
          <span className="font-medium">Loading exam...</span>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30">
            <BookOpen size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Exam not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {error || "This exam could not be found."}
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
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft size={17} />
          Back to exams
        </Link>

        {/* Hero */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-7 sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              {/* Exam info */}
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {exam?.categoryId?.name}
                  </span>
                  {exam.isPopular && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                      Popular
                    </span>
                  )}
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                  {exam.title}
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
                  {exam.description}
                </p>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <FileQuestion
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    <p className="mt-3 text-xs text-slate-400">
                      Available Questions
                    </p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      {1578}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <Clock3
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    <p className="mt-3 text-xs text-slate-400">Time Limit</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      25 min
                    </p>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-slate-50 p-4 sm:col-span-1 dark:bg-slate-800/60">
                    <Trophy
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    <p className="mt-3 text-xs text-slate-400">Quiz Type</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      Multiple Choice
                    </p>
                  </div>
                </div>
              </div>
              {/* Icon */}
              <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 md:flex dark:bg-indigo-950/40 dark:text-indigo-400">
                <BookOpen size={40} />
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-slate-100 dark:bg-slate-800" />

            {/* Start section */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Ready to test yourself?
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Start the quiz and see how well you perform.
                </p>
              </div>

              <Link
                to={`/quiz/${exam.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Start Quiz
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Before you start
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              "The quiz contains 25 multiple-choice questions.",
              "You will have 25 minutes to complete the quiz.",
              "Each question has four options.",
              "Your result will be calculated after submission.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                />

                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
