import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const initials = user.name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage your QuizNest account information.
          </p>
        </div>

        {/* Main profile section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Profile card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-600 text-3xl font-black text-white shadow-lg shadow-indigo-600/20">
                {initials}
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>

              {/* Role */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold capitalize text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <ShieldCheck size={14} />
                {user.role}
              </div>
            </div>

            {/* Member information */}
            <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Member since
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal information */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your basic account information.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <UserRound size={17} className="text-slate-400" />

                  <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user.name}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <Mail size={17} className="text-slate-400" />

                  <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Account role */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Account Type
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <span className="text-sm font-medium capitalize text-slate-800 dark:text-slate-200">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* User ID */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  User ID
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <span className="block truncate font-mono text-xs text-slate-600 dark:text-slate-400">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quizzes Completed
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Questions Answered
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Average Score
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              0%
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
