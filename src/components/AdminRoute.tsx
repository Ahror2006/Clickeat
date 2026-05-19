import { Navigate, Outlet } from "react-router";
import { useAuth } from "../stores/auth.store";

export default function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}