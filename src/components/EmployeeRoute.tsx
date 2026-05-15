import { Navigate, Outlet } from "react-router";
import { useAuth } from "../stores/auth.store";

export function EmployeeRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = ["employee", "staff", "admin"];

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}