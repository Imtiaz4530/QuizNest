import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Quiz Management",
    items: [
      {
        name: "Categories",
        path: "/categories",
        icon: GraduationCap,
      },
      {
        name: "Exams",
        path: "/exams",
        icon: BookOpen,
      },
      {
        name: "Questions",
        path: "/questions",
        icon: FileQuestion,
      },
      {
        name: "Quiz Attempts",
        path: "/attempts",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "Users & Rankings",
    items: [
      {
        name: "Users",
        path: "/users",
        icon: Users,
      },
      {
        name: "Leaderboard",
        path: "/leaderboard",
        icon: Trophy,
      },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ mobileOpen = false, onClose }: AdminSidebarProps) => {
  const [desktopCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          dark:border-slate-800 dark:bg-slate-900
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${desktopCollapsed ? "lg:w-20" : ""}
        `}
      >
        {/* Logo */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                QuizNest
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Admin Panel
              </p>
            </div>
          </NavLink>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-7">
            {navigation.map((section) => (
              <div key={section.label}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  {section.label}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `
                          group flex items-center gap-3 rounded-xl px-3 py-2.5
                          text-sm font-semibold transition
                          ${
                            isActive
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          }
                          `
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={19}
                              className={
                                isActive
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                              }
                            />

                            <span className="flex-1">{item.name}</span>

                            {isActive && (
                              <ChevronRight
                                size={15}
                                className="text-indigo-500"
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Admin account */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                Admin
              </p>

              <p className="truncate text-xs text-slate-400">Administrator</p>
            </div>

            <button
              type="button"
              title="Logout"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500 dark:hover:bg-slate-700"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
