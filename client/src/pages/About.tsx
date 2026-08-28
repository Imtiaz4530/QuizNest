import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: <BookOpen size={22} />,
      title: "Practice Questions",
      description:
        "Practice with carefully organized MCQs across competitive exams, academic subjects, admission preparation, and general knowledge.",
    },
    {
      icon: <Clock3 size={22} />,
      title: "Timed Quizzes",
      description:
        "Take focused quizzes with a simple time-based experience designed to help you practice under exam-like conditions.",
    },
    {
      icon: <Trophy size={22} />,
      title: "Track Your Progress",
      description:
        "Review your previous attempts, scores, correct answers, and overall performance from your profile.",
    },
    {
      icon: <Users size={22} />,
      title: "Leaderboard",
      description:
        "Compare your quiz performance with other learners and see where you stand on the leaderboard.",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950" />

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Target size={15} />
              About QuizNest
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Practice smarter.
              <span className="block text-indigo-600 dark:text-indigo-400">
                Prepare better.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              QuizNest is a simple quiz and exam-practice platform built to help
              learners prepare through quick MCQ-based practice, timed quizzes,
              performance tracking, and friendly competition.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Explore Exams
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/leaderboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View Leaderboard
                <Trophy size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Our goal
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Make exam practice simple and accessible.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            <p>
              Preparing for an exam often means going through large amounts of
              questions and trying to understand where you need more practice.
              QuizNest is designed to make that process more focused.
            </p>

            <p>
              Instead of making practice complicated, we focus on a clean
              experience where you can choose an exam, answer questions, see
              your result, review your attempts, and keep improving.
            </p>

            <p>
              Whether you are preparing for a competitive examination,
              university admission, academic studies, or simply testing your
              general knowledge, QuizNest gives you a place to practice.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              What you can do
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Everything you need for focused practice.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900 dark:hover:shadow-none"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why QuizNest */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <GraduationCap size={24} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                Built around your practice journey.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                QuizNest is designed around a simple cycle: practice, submit,
                review, and improve. Your quiz history gives you a clear view of
                the work you have already completed.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Choose an exam or quiz",
                "Complete a timed practice session",
                "Receive your score and review answers",
                "Keep practicing and improve your performance",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-indigo-600 dark:text-indigo-400"
                  />

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-indigo-600 px-6 py-12 text-center shadow-xl shadow-indigo-600/20 sm:px-10">
          <h2 className="text-3xl font-black tracking-tight text-white">
            Ready to start practicing?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Choose an exam, start a quiz, and put your knowledge to the test.
          </p>

          <Link
            to="/categories"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50"
          >
            Browse Exams
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
