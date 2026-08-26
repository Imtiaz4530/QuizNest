import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import type { ExamCardProps } from "../types/categories";

const ExamCard = ({ exam }: ExamCardProps) => {
  return (
    <Link
      to={`/categories/${exam.slug}`}
      className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900 dark:hover:shadow-none"
    >
      {exam.isPopular && (
        <div className="absolute right-5 top-5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
          Popular
        </div>
      )}

      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/40 dark:text-indigo-400">
        <BookOpen size={25} />
      </div>

      {/* Content */}
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {exam.categoryId?.name ?? "Exam"}
        </p>

        <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {exam.title}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500 dark:text-slate-400">
          {exam.description ||
            "Practice with MCQ questions and improve your preparation."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-400">Start Quiz</p>

          <p className="mt-0.5 text-sm font-bold text-slate-700 dark:text-slate-200">
            Practice MCQs
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800">
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;
