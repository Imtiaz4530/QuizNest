import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="text-7xl font-black text-indigo-600">404</p>

      <h1 className="mt-4 text-3xl font-black">Page not found</h1>

      <p className="mt-3 text-slate-500">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
