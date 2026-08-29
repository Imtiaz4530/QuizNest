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
import { useEffect, useState } from "react";
import api from "../lib/axios";

interface DashboardStats {
  totalUsers: number;
  totalCategories: number;
  totalExams: number;
  activeExams: number;
  totalQuestions: number;
  totalAttempts: number;
}

interface RecentAttempt {
  _id: string;
  user?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  exam?: {
    _id: string;
    title: string;
    slug: string;
  };
  score: number;
  totalQuestions?: number;
  createdAt?: string;
  attemptedAt?: string;
}

interface RecentUser {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
}

interface ExamStat {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  attempts?: number;
  questions?: number;
}

interface AttemptActivity {
  date?: string;
  attempts?: number;
  count?: number;
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentAttempts: RecentAttempt[];
  recentUsers: RecentUser[];
  examStats: ExamStat[];
  attemptActivity: AttemptActivity[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<DashboardResponse>("/admin/dashboard");

        setData(response.data);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);

        setError(
          error?.response?.data?.message || "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatTime = (date?: string) => {
    if (!date) return "";

    const created = new Date(date);
    const now = new Date();

    const difference = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (difference < 60) {
      return "Just now";
    }

    const minutes = Math.floor(difference / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";

    return name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-10 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:col-span-2" />
          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <h2 className="font-bold text-red-700 dark:text-red-400">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error || "Something went wrong while loading dashboard data."}
          </p>
        </div>
      </div>
    );
  }

  const { stats, recentAttempts, examStats } = data;

  const statCards = [
    {
      title: "Total Users",
      value: formatNumber(stats.totalUsers),
      icon: Users,
    },
    {
      title: "Total Exams",
      value: formatNumber(stats.totalExams),
      icon: BookOpen,
    },
    {
      title: "Total Questions",
      value: formatNumber(stats.totalQuestions),
      icon: FileQuestion,
    },
    {
      title: "Quiz Attempts",
      value: formatNumber(stats.totalAttempts),
      icon: ClipboardCheck,
    },
  ];

  const recentData = recentAttempts?.slice(0, 5) ?? [];
  const examData = examStats?.slice(0, 5) ?? [];

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
        {statCards.map((stat) => {
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
            </div>
          );
        })}
      </div>

      {/* Additional stats */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Categories
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {formatNumber(stats.totalCategories)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <GraduationCap size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Active Exams
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {formatNumber(stats.activeExams)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <TrendingUp size={21} />
            </div>
          </div>
        </div>
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

            {recentAttempts.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center px-5 py-10 text-center">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <ClipboardCheck size={21} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No quiz attempts yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Recent user activity will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentData.map((attempt) => {
                  const total = attempt.totalQuestions || 25;
                  const percentage = Math.round((attempt.score / total) * 100);

                  const userName = attempt.user?.name || "Unknown User";
                  const examTitle = attempt.exam?.title || "Unknown Exam";

                  return (
                    <div
                      key={attempt._id}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        {getInitials(userName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                          {userName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {examTitle}
                        </p>
                      </div>

                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-slate-400">
                          {formatTime(attempt.attemptedAt || attempt.createdAt)}
                        </p>
                      </div>

                      <div className="w-16 text-right">
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                          {attempt.score}/{total}
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
            )}
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

            {examStats.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center px-5 py-10 text-center">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <BookOpen size={21} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No exam statistics yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Exam activity will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {examData.slice(0, 4).map((exam, index) => (
                  <div
                    key={exam._id}
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
                        {exam.category || "Exam"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {formatNumber(exam.attempts || 0)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        attempts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
