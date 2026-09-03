import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

import { getUser } from "../lib/auth";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  const user = getUser();
  const toggleTheme = () => {
    setDarkMode((previous) => !previous);

    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onMenuClick()}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Menu size={21} />
            </button>

            <div className="hidden min-w-0 sm:block">
              <p className="text-xs font-medium text-slate-400">Welcome back</p>

              <h1 className="truncate text-sm font-bold text-slate-800 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              type="button"
              className="hidden rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:block dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Search"
            >
              <Search size={19} />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Notifications"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Divider */}
            <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-800" />

            {/* Avatar */}
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="hidden text-left lg:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {user?.name || "Admin"}
                </p>

                <p className="text-[10px] text-slate-400">
                  {user?.email || "Administrator"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar controller event */}
      {/* {mobileOpen && (
        the div will be here
      )} */}
      <div className="lg:hidden">
        {/* This state will be moved into AdminLayout when we connect the
              sidebar and header together. */}
      </div>
    </>
  );
};

export default AdminHeader;
