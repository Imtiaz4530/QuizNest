import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../lib/auth";

const AdminRoute = () => {
  const location = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
