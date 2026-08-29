import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    description: "from last month",
    icon: Users,
  },
  {
    title: "Total Exams",
    value: "69",
    change: "+8.2%",
    description: "from last month",
    icon: BookOpen,
  },
  {
    title: "Total Questions",
    value: "8,420",
    change: "+15.4%",
    description: "from last month",
    icon: FileQuestion,
  },
  {
    title: "Quiz Attempts",
    value: "12,584",
    change: "+18.7%",
    description: "from last month",
    icon: ClipboardCheck,
  },
];

const recentAttempts = [
  {
    id: 1,
    name: "Rahim Ahmed",
    exam: "BCS Preliminary",
    score: 24,
    total: 25,
    time: "2 minutes ago",
  },
  {
    id: 2,
    name: "Karim Hasan",
    exam: "University Admission",
    score: 21,
    total: 25,
    time: "8 minutes ago",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    exam: "HSC Mathematics",
    score: 23,
    total: 25,
    time: "15 minutes ago",
  },
  {
    id: 4,
    name: "Sakib Rahman",
    exam: "General Knowledge",
    score: 18,
    total: 25,
    time: "22 minutes ago",
  },
  {
    id: 5,
    name: "Ayesha Akter",
    exam: "Bank Job",
    score: 20,
    total: 25,
    time: "31 minutes ago",
  },
];

const popularExams = [
  {
    title: "BCS",
    category: "Competitive Exams",
    attempts: "3,842",
    questions: "1,250",
  },
  {
    title: "University Admission",
    category: "Admission",
    attempts: "2,976",
    questions: "980",
  },
  {
    title: "HSC",
    category: "Academic",
    attempts: "2,415",
    questions: "1,600",
  },
  {
    title: "General Knowledge",
    category: "General Quiz",
    attempts: "1,984",
    questions: "1,800",
  },
];

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Page heading */}
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Monitor your QuizNest platform and manage everything from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Icon size={21} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={13} />
                  {stat.change}
                </span>

                <span className="text-slate-400">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main dashboard grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Recent attempts */}
        <div className="xl:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Recent Quiz Attempts
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest activity from users
                </p>
              </div>

              <Link
                to="/attempts"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAttempts.map((attempt) => {
                const percentage = Math.round(
                  (attempt.score / attempt.total) * 100,
                );

                return (
                  <div
                    key={attempt.id}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      {attempt.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                        {attempt.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {attempt.exam}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-slate-400">{attempt.time}</p>
                    </div>

                    <div className="w-16 text-right">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {attempt.score}/{attempt.total}
                      </p>

                      <p
                        className={`mt-0.5 text-[11px] font-bold ${
                          percentage >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : percentage >= 60
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-500"
                        }`}
                      >
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular exams */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Popular Exams
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Most attempted exams
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {popularExams.map((exam, index) => (
                <div
                  key={exam.title}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      {exam.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {exam.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {exam.attempts}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      attempts
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <Link
                to="/exams"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
              >
                Manage Exams
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Frequently used management actions
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/categories"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <GraduationCap size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Categories
                </p>

                <p className="text-xs text-slate-400">Manage categories</p>
              </div>
            </Link>

            <Link
              to="/exams"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Exams
                </p>

                <p className="text-xs text-slate-400">Manage exams</p>
              </div>
            </Link>

            <Link
              to="/questions"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <FileQuestion size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Questions
                </p>

                <p className="text-xs text-slate-400">Manage questions</p>
              </div>
            </Link>

            <Link
              to="/users"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-indigo-900/40 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Users size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Users
                </p>

                <p className="text-xs text-slate-400">Manage users</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
