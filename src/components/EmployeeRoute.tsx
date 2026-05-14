import { Navigate } from "react-router";
import { getAuthUser, getToken } from "../lib/auth";
import { EmployeePage } from "../pages/employee/page";

export function EmployeeRoute() {
  const token = getToken();
  const user = getAuthUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "employee" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <EmployeePage />;
}