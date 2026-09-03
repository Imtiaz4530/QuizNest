import { type FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import api from "../lib/axios";
import type {
  ApiErrorResponse,
  LoginRequest,
  LoginResponse,
} from "../types/auth";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post<LoginResponse>(
        "/users/auth/login",
        formData,
      );

      const { token, user, message } = response.data;

      // Store JWT + authenticated user
      login(token, user);

      toast.success(message || "Login successful!");

      // Redirect authenticated user
      navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Unable to login. Please try again.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-12 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:grid-cols-2">
        {/* Left branding section */}
        <div className="hidden flex-col justify-between bg-indigo-600 p-10 text-white lg:flex">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-indigo-600">
                Q
              </div>

              <span className="text-2xl font-bold">
                Quiz<span className="text-indigo-200">Nest</span>
              </span>
            </Link>

            <div className="mt-20">
              <h2 className="text-4xl font-black leading-tight">
                Welcome
                <br />
                back.
              </h2>

              <p className="mt-5 max-w-sm leading-7 text-indigo-100">
                Continue your preparation, challenge yourself, and get closer to
                your exam goals.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm leading-6 text-indigo-100">
              Your knowledge. Your progress. Your next achievement.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="p-7 sm:p-10">
          {/* Mobile logo */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              Q
            </div>

            <span className="text-xl font-bold">
              Quiz<span className="text-indigo-600">Nest</span>
            </span>
          </Link>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Login to your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Enter your credentials to continue to QuizNest.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold cursor-pointer text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition cursor-pointer hover:text-slate-600 disabled:cursor-not-allowed dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 cursor-pointer px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
