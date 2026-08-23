import { ArrowRight, CheckCircle2, Trophy, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const categories = [
    {
      title: "BCS Preparation",
      description:
        "Practice questions designed for Bangladesh Civil Service preparation.",
      icon: "🏛️",
      quizzes: 250,
    },
    {
      title: "University Admission",
      description:
        "Prepare for university admission tests with focused MCQ practice.",
      icon: "🎓",
      quizzes: 180,
    },
    {
      title: "Bank Jobs",
      description: "Sharpen your skills for banking recruitment examinations.",
      icon: "🏦",
      quizzes: 120,
    },
    {
      title: "General Knowledge",
      description:
        "Test yourself on Bangladesh and international general knowledge.",
      icon: "🌎",
      quizzes: 300,
    },
  ];

  const quizzes = [
    {
      title: "Bangladesh Affairs — Quick Test",
      category: "General Knowledge",
      questions: 20,
      duration: 10,
      attempts: "12.4K",
    },
    {
      title: "BCS Preliminary — Bangladesh Affairs",
      category: "BCS",
      questions: 25,
      duration: 15,
      attempts: "9.8K",
    },
    {
      title: "English Grammar Challenge",
      category: "English",
      questions: 20,
      duration: 10,
      attempts: "8.2K",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Bangladesh's smart quiz platform
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Learn more.
              <br />
              <span className="text-indigo-600">Score better.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
              Practice thousands of MCQs, challenge yourself with quick quizzes,
              and prepare smarter for your next exam.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Explore Quizzes
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/leaderboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Trophy size={18} />
                View Leaderboard
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-indigo-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Thousands of MCQs
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-indigo-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Instant results
                </span>
              </div>
            </div>
          </div>

          {/* Hero card */}
          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Quick Quiz
                  </p>
                  <h3 className="mt-1 text-xl font-bold">Bangladesh Affairs</h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                  <Brain className="text-indigo-600" size={22} />
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
                <span>Question 7 of 20</span>
                <span>35%</span>
              </div>

              <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-[35%] rounded-full bg-indigo-600" />
              </div>

              <p className="text-base font-semibold leading-7">
                Which is the national flower of Bangladesh?
              </p>

              <div className="mt-5 space-y-3">
                {["Water Lily", "Rose", "Sunflower", "Lotus"].map(
                  (option, index) => (
                    <div
                      key={option}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm ${
                        index === 0
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold dark:bg-slate-800">
                        {String.fromCharCode(65 + index)}
                      </span>

                      {option}

                      {index === 0 && (
                        <CheckCircle2
                          size={17}
                          className="ml-auto text-indigo-600"
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ["10K+", "Questions"],
            ["500+", "Quizzes"],
            ["25K+", "Students"],
            ["50K+", "Attempts"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="border-slate-200 px-5 text-center first:border-0 dark:border-slate-800 lg:border-l"
            >
              <p className="text-2xl font-black sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-600">
              Explore
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Find your category
            </h2>

            <p className="mt-3 max-w-xl text-slate-500 dark:text-slate-400">
              Choose a subject and start practicing with questions built for
              your goals.
            </p>
          </div>

          <Link
            to="/categories"
            className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))} */}
          <h1>CategoryCard CategoryCard CategoryCard</h1>
        </div>
      </section>

      {/* Popular quizzes */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-600">
              Start practicing
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Popular quizzes
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              See what other learners are practicing right now.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* {quizzes.map((quiz) => (
              <QuizCard key={quiz.title} {...quiz} />
            ))} */}
            <h1>QuizCard QuizCard QuizCard</h1>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-7 py-14 text-center text-white sm:px-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative">
            <Users className="mx-auto mb-5" size={32} />

            <h2 className="text-3xl font-black sm:text-4xl">
              Ready to test yourself?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-indigo-100">
              Join thousands of learners preparing for their next exam with
              QuizNest.
            </p>

            <Link
              to="/categories"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Start Practicing
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
