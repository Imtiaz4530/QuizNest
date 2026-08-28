import { BarChart3, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileStats = ({ statsLoading, quizStats }) => {
  return (
    <>
      {/* Quiz Statistics */}
      <div className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Your Progress
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              Quiz Statistics
            </h2>
          </div>

          <Link
            to="/results"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-900 dark:hover:text-indigo-400"
          >
            <BarChart3 size={16} />
            View History
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Quizzes Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Quizzes Completed
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {statsLoading ? "—" : quizStats.quizzesCompleted}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Trophy size={20} />
              </div>
            </div>
          </div>

          {/* Questions Answered */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Questions Answered
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {statsLoading
                    ? "—"
                    : quizStats.questionsAnswered.toLocaleString()}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Average Score
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {statsLoading ? "—" : `${quizStats.averageScore}%`}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Trophy size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileStats;
