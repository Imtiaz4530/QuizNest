import { useEffect, useState } from "react";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  Medal,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../lib/axios";

interface LeaderboardUser {
  _id: string;
  name: string;
  avatar: string;
}

interface LeaderboardExam {
  _id: string;
  title: string;
  slug: string;
}

interface LeaderboardEntry {
  rank: number;
  user: LeaderboardUser;
  exam: LeaderboardExam;
  score: number;
  attemptId: string;
  attemptedAt: string;
}

interface LeaderboardPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  pagination: LeaderboardPagination;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pagination, setPagination] = useState<LeaderboardPagination | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (page = 1) => {
    try {
      setLoading(true);

      const response = await api.get<LeaderboardResponse>(
        `/leaderboard?page=${page}&limit=20`,
      );

      setLeaderboard(response.data.leaderboard);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);

      toast.error("Unable to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(1);
  }, []);

  const handlePrevious = () => {
    if (!pagination || pagination.page <= 1) return;

    fetchLeaderboard(pagination.page - 1);
  };

  const handleNext = () => {
    if (!pagination || pagination.page >= pagination.totalPages) return;

    fetchLeaderboard(pagination.page + 1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) {
      return {
        wrapper:
          "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20",
        icon: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      };
    }

    if (rank === 2) {
      return {
        wrapper:
          "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50",
        icon: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
      };
    }

    return {
      wrapper:
        "border-orange-200 bg-orange-50 dark:border-orange-900/40 dark:bg-orange-950/20",
      icon: "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
    };
  };

  /*
   * Loading
   */
  if (loading && leaderboard.length === 0) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={30} className="animate-spin text-indigo-600" />
      </main>
    );
  }

  /*
   * Empty
   */
  if (!loading && leaderboard.length === 0) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-5 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Trophy size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
              No leaderboard data yet
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Complete a quiz and be the first one to appear on the leaderboard.
            </p>

            <Link
              to="/categories"
              className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Exams
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remainingEntries = leaderboard.slice(3);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Trophy size={26} />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Top Performers
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Leaderboard
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            See how you rank against other quiz participants and challenge
            yourself to reach the top.
          </p>
        </div>

        {/* Top Three */}
        {pagination?.page === 1 && topThree.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {topThree.map((entry) => {
              const rankStyle = getRankStyle(entry.rank);

              return (
                <div
                  key={entry.attemptId}
                  className={`group relative rounded-3xl border p-6 text-center transition duration-200 hover:-translate-y-1 hover:shadow-lg ${rankStyle.wrapper}`}
                >
                  {/* Crown */}
                  {entry.rank === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-white shadow-md">
                        <Crown size={18} />
                      </div>
                    </div>
                  )}

                  {/* Rank */}
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${rankStyle.icon}`}
                  >
                    {entry.rank === 1 ? (
                      <Trophy size={22} />
                    ) : entry.rank === 2 ? (
                      <Medal size={22} />
                    ) : (
                      <Award size={22} />
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 ring-4 ring-white dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-slate-900">
                    {entry.user.avatar ? (
                      <img
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(entry.user.name)
                    )}
                  </div>

                  <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                    {entry.user.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {entry.exam.title}
                  </p>

                  <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Score
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      {entry.score}
                      <span className="ml-1 text-sm font-semibold text-slate-400">
                        pts
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard List */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Rankings
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {pagination?.total || 0} total attempts
                </p>
              </div>

              {loading && (
                <Loader2 size={18} className="animate-spin text-indigo-600" />
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden grid-cols-[80px_1fr_220px_120px_140px] items-center gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-950/40 sm:grid">
            <span>Rank</span>
            <span>Participant</span>
            <span>Exam</span>
            <span>Score</span>
            <span>Date</span>
          </div>

          <div>
            {remainingEntries.map((entry) => (
              <div
                key={entry.attemptId}
                className="group grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 sm:grid-cols-[80px_1fr_220px_120px_140px] sm:gap-4 sm:px-6 dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                {/* Rank */}
                <div className="flex items-center sm:block">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    #{entry.rank}
                  </span>
                </div>

                {/* User */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {entry.user.avatar ? (
                      <img
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(entry.user.name)
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                      {entry.user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400 sm:hidden">
                      {entry.exam.title}
                    </p>
                  </div>
                </div>

                {/* Exam */}
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {entry.exam.title}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right sm:text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {entry.score}
                    <span className="ml-1 text-xs font-medium text-slate-400">
                      pts
                    </span>
                  </p>
                </div>

                {/* Date */}
                <div className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                  {formatDate(entry.attemptedAt)}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={pagination.page === 1 || loading}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-900 dark:hover:text-indigo-400"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    pagination.page === pagination.totalPages || loading
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-900 dark:hover:text-indigo-400"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
