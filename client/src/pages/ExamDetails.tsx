import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Trophy,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ExamDetails = () => {
  const { slug } = useParams();

  // Temporary data.
  // Later this will come from GET /api/exams/:slug
  const exam = {
    title: "BCS",
    slug,
    description:
      "Prepare for Bangladesh Civil Service examinations with practice MCQs.",
    category: "Competitive Exams",
    questionCount: 1250,
    isPopular: true,
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back to Categories
        </Link>

        {/* Hero */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-7 sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              {/* Left */}
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {exam.category}
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
                      {exam.questionCount.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <Clock3
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    <p className="mt-3 text-xs text-slate-400">Quiz Time</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      25 min
                    </p>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-slate-50 p-4 sm:col-span-1 dark:bg-slate-800/60">
                    <Trophy
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    <p className="mt-3 text-xs text-slate-400">Question Type</p>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                      MCQ
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

        {/* Information */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                How it works
              </h3>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>• Answer multiple-choice questions.</li>
              <li>• Each question has four options.</li>
              <li>• Submit your answers when you're finished.</li>
              <li>• Your result will be saved to your account.</li>
              <li>• For 25 questions you have 25 minutes.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                <Trophy size={20} />
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Track your progress
              </h3>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your quiz attempts will be saved so you can review your
              performance and track your progress over time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ExamDetails;
