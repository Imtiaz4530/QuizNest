import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Medal,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  attemptId: string;
  attemptedAt: string;
  user: LeaderboardUser;
  exam: LeaderboardExam;
  score: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  pagination: Pagination;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchLeaderboard = useCallback(async (page = 1, isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get<LeaderboardResponse>(
        `/leaderboard?page=${page}&limit=20`,
      );

      if (response.data.success) {
        setEntries(response.data.leaderboard);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to load leaderboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(1);
  }, [fetchLeaderboard]);

  const stats = useMemo(() => {
    if (!entries.length) {
      return {
        highestScore: 0,
        averageScore: 0,
        participants: 0,
      };
    }

    const highestScore = Math.max(...entries.map((entry) => entry.score));

    const averageScore =
      entries.reduce((total, entry) => total + entry.score, 0) / entries.length;

    const participants = new Set(entries.map((entry) => entry.user._id)).size;

    return {
      highestScore,
      averageScore: Number(averageScore.toFixed(1)),
      participants,
    };
  }, [entries]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return (
      name
        .trim()
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"
    );
  };

  const getScoreClass = (score: number) => {
    if (score >= 20) {
      return "text-emerald-600 dark:text-emerald-400";
    }

    if (score >= 10) {
      return "text-indigo-600 dark:text-indigo-400";
    }

    return "text-slate-700 dark:text-slate-300";
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) {
      return;
    }

    fetchLeaderboard(page);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Trophy
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Leaderboard
            </h1>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor quiz performance and ranking activity across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchLeaderboard(pagination.page, true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Ranked Attempts"
          value={pagination.total}
          icon={Trophy}
          description="All leaderboard entries"
        />

        <StatCard
          title="Highest Score"
          value={stats.highestScore}
          icon={Medal}
          description="From current page"
        />

        <StatCard
          title="Average Score"
          value={stats.averageScore}
          icon={CalendarDays}
          description="From current page"
        />

        <StatCard
          title="Participants"
          value={stats.participants}
          icon={Users}
          description="Unique users on page"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-500" />

            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchLeaderboard(pagination.page)}
            className="shrink-0 text-sm font-bold text-red-600 hover:underline dark:text-red-400"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header */}
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Ranking Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Latest ranked quiz attempts
              </p>
            </div>

            {!loading && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {pagination.total} total
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <LeaderboardSkeleton />
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                    <th className="w-20 px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Rank
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      User
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Exam
                    </th>

                    <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Score
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Attempted At
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Attempt ID
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {entries.map((entry) => (
                    <tr
                      key={entry.attemptId}
                      className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* Rank */}
                      <td className="px-5 py-4">
                        <RankBadge rank={entry.rank} />
                      </td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {entry.user.avatar ? (
                            <img
                              src={entry.user.avatar}
                              alt={entry.user.name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                              {getInitials(entry.user.name)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                              {entry.user.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              User ID: {entry.user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Exam */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {entry.exam.title}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {entry.exam.slug}
                        </p>
                      </td>

                      {/* Score */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`text-sm font-black ${getScoreClass(
                            entry.score,
                          )}`}
                        >
                          {entry.score}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {formatDate(entry.attemptedAt)}
                        </p>
                      </td>

                      {/* Attempt ID */}
                      <td className="px-5 py-4">
                        <code className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {entry.attemptId.slice(0, 8)}...
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
              {entries.map((entry) => (
                <div
                  key={entry.attemptId}
                  className="space-y-4 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {entry.user.avatar ? (
                        <img
                          src={entry.user.avatar}
                          alt={entry.user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                          {getInitials(entry.user.name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                          {entry.user.name}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {entry.exam.title}
                        </p>
                      </div>
                    </div>

                    <RankBadge rank={entry.rank} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Score
                      </p>

                      <p
                        className={`mt-1 text-lg font-black ${getScoreClass(
                          entry.score,
                        )}`}
                      >
                        {entry.score}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Attempted
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {formatDate(entry.attemptedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">Attempt ID</span>

                    <code className="truncate rounded-lg bg-slate-100 px-2 py-1 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {entry.attemptId}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && entries.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <p className="text-xs font-medium text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-600 dark:text-slate-300">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-600 dark:text-slate-300">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600 dark:text-slate-300">
                {pagination.total}
              </span>{" "}
              attempts
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-bold text-white">
                {pagination.page}
              </div>

              <button
                type="button"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}

const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  return (
    <span
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-black ${
        rank === 1
          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
          : rank === 2
            ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            : rank === 3
              ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
              : "bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400"
      }`}
    >
      #{rank}
    </span>
  );
};

const LeaderboardSkeleton = () => {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-5 px-5 py-5"
        >
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="flex flex-1 items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <div className="hidden h-3 w-28 rounded bg-slate-200 dark:bg-slate-800 sm:block" />
          <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="hidden h-3 w-28 rounded bg-slate-200 dark:bg-slate-800 lg:block" />
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Trophy size={25} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
        No leaderboard data
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        There are no ranked quiz attempts available yet.
      </p>
    </div>
  );
};

export default Leaderboard;
