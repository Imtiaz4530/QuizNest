import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./index.css";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  </StrictMode>,
);
