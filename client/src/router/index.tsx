import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFount";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      //   {
      //     path: "categories",
      //     element: <Categories />,
      //   },
      //   {
      //     path: "leaderboard",
      //     element: <Leaderboard />,
      //   },
      //   {
      //     path: "about",
      //     element: <About />,
      //   },
      //   {
      //     path: "login",
      //     element: <Login />,
      //   },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
