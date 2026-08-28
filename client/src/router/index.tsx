import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Categories from "../pages/Categories";
import ExamDetails from "../pages/ExamDetails";
import Quiz from "../pages/Quiz";
import Results from "../pages/Results";
import ResultDetails from "../pages/ResultDetails";
import Leaderboard from "../pages/Leaderboard";

import NotFound from "../pages/NotFount";

import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
import About from "../pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/:slug/:examId",
        element: <ExamDetails />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "about",
        element: <About />,
      },

      // Guest-only routes
      {
        element: <GuestRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/quiz/:slug/:examId",
            element: <Quiz />,
          },
          { path: "/results", element: <Results /> },
          { path: "/results/:id", element: <ResultDetails /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
