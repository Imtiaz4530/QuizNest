import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import Exams from "../pages/Exams";
import Questions from "../pages/Questions";
import Users from "../pages/Users";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "exams",
        element: <Exams />,
      },
      {
        path: "questions",
        element: <Questions />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);
