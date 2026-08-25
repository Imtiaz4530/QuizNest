import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  ChevronRight,
  Flag,
  Globe,
  GraduationCap,
  Moon,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { Exam } from "../types/categories";
import ExamCard from "../components/ExamCard";

const exams: Exam[] = [
  {
    id: 1,
    title: "BCS",
    description:
      "Prepare for Bangladesh Civil Service examinations with practice MCQs.",
    category: "Competitive Exams",
    questions: 1250,
    participants: "12.5K",
    icon: <BriefcaseBusiness size={25} />,
    popular: true,
  },
  {
    id: 2,
    title: "University Admission",
    description:
      "Practice admission questions from major universities across Bangladesh.",
    category: "Admission",
    questions: 980,
    participants: "9.8K",
    icon: <GraduationCap size={25} />,
    popular: true,
  },
  {
    id: 3,
    title: "HSC",
    description:
      "Test your HSC preparation with subject-wise practice questions.",
    category: "Academic",
    questions: 1600,
    participants: "8.2K",
    icon: <BookOpen size={25} />,
    popular: true,
  },
  {
    id: 4,
    title: "SSC",
    description:
      "Strengthen your SSC preparation through quick practice quizzes.",
    category: "Academic",
    questions: 1350,
    participants: "7.4K",
    icon: <BookOpen size={25} />,
  },
  {
    id: 5,
    title: "Bank Job",
    description:
      "Practice questions designed for banking recruitment examinations.",
    category: "Job Exams",
    questions: 850,
    participants: "5.7K",
    icon: <BriefcaseBusiness size={25} />,
  },
  {
    id: 6,
    title: "Mathematics",
    description:
      "Sharpen your mathematical skills with topic-based MCQ quizzes.",
    category: "Subjects",
    questions: 720,
    participants: "6.1K",
    icon: <Calculator size={25} />,
  },
  {
    id: 7,
    title: "General Islamic Quiz",
    description:
      "Test your knowledge of the Quran, Hadith, Prophets, Islamic history and general Islamic facts.",
    category: "General Quiz",
    questions: 1200,
    participants: "8.7K",
    icon: <Moon size={25} />,
    popular: true,
  },
  {
    id: 8,
    title: "General Knowledge Quiz",
    description:
      "Challenge yourself with questions about Bangladesh, world affairs, history, geography, science and more.",
    category: "General Quiz",
    questions: 1800,
    participants: "11.2K",
    icon: <Globe size={25} />,
    popular: true,
  },
  {
    id: 9,
    title: "Bangladesh Quiz",
    description:
      "Test your knowledge of Bangladesh's history, culture, geography, liberation war and famous personalities.",
    category: "General Quiz",
    questions: 950,
    participants: "6.4K",
    icon: <Flag size={25} />,
  },
  {
    id: 10,
    title: "World Quiz",
    description:
      "Explore the world with questions about countries, capitals, landmarks, history and geography.",
    category: "General Quiz",
    questions: 1100,
    participants: "5.9K",
    icon: <Globe size={25} />,
  },
];

const categories = [
  {
    name: "Competitive Exams",
    description: "BCS, government and other competitive exams",
    count: 12,
    icon: <Trophy size={22} />,
  },
  {
    name: "University Admission",
    description: "Admission preparation for universities",
    count: 18,
    icon: <GraduationCap size={22} />,
  },
  {
    name: "Academic",
    description: "SSC, HSC and academic preparation",
    count: 24,
    icon: <BookOpen size={22} />,
  },
  {
    name: "Job Exams",
    description: "Banking and other recruitment exams",
    count: 15,
    icon: <BriefcaseBusiness size={22} />,
  },
];

const Categories = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || exam.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="border-b border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400">
              <BookOpen size={14} />
              Explore QuizNest
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Choose your
              <span className="text-indigo-600"> challenge.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
              Explore exams, subjects and practice categories. Pick a topic and
              test your knowledge with quick MCQ quizzes.
            </p>
          </div>

          {/* Search */}
          <div className="mt-9 max-w-2xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams, subjects..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Categories */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                Browse
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                Explore by category
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(category.name)}
                className={`group rounded-2xl border p-5 text-left transition ${
                  activeCategory === category.name
                    ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-500 dark:bg-indigo-950/30"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    activeCategory === category.name
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  }`}
                >
                  {category.icon}
                </div>

                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  {category.name}
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {category.count} exams
                  </span>

                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Filter */}
        <section className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                Exams
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {activeCategory === "All" ? "Popular exams" : activeCategory}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Competitive Exams",
                "Admission",
                "Academic",
                "Job Exams",
                "Subjects",
              ].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Exam cards */}
          {filteredExams.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <Search size={32} className="mx-auto text-slate-400" />

              <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                No exams found
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try searching for another exam or category.
              </p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-14 overflow-hidden rounded-3xl bg-indigo-600 px-6 py-10 shadow-xl shadow-indigo-600/10 sm:px-10 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-100">
                <Users size={18} />
                <span className="text-sm font-semibold">
                  Learn. Practice. Improve.
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Ready to test your knowledge?
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Pick an exam and start a quick quiz. Challenge yourself and keep
                improving.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
              Start a Quiz
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Categories;
