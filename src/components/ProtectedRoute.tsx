// Blocks guests and role mismatches before protected pages render.
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getRole, isAuthenticated } from "@api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const role = getRole();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (location.pathname.startsWith("/admin") && role !== "admin") {
    return <Navigate to="/not-authorized" />;
  }

  if (location.pathname.startsWith("/user") && role !== "user") {
    return <Navigate to="/not-authorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
