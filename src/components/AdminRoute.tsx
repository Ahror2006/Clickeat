import { Navigate } from "react-router";
import AdminPage from "../pages/admin/page";
import { getAuthUser, getToken } from "../lib/auth";

export default function AdminRoute() {
  const token = getToken();
  const user = getAuthUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <AdminPage />;
}