import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-bold">
            Quiz<span className="text-indigo-600">Nest</span>
          </Link>

          <p className="mt-2 text-md text-slate-500">
            Practice smarter. Perform better.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-md text-slate-500">
          <Link to="/categories" className="hover:text-indigo-600">
            Categories
          </Link>

          <Link to="/leaderboard" className="hover:text-indigo-600">
            Leaderboard
          </Link>

          <Link to="/about" className="hover:text-indigo-600">
            About
          </Link>

          <Link to="/login" className="hover:text-indigo-600">
            Login
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 px-5 py-5 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} QuizNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
