import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // Check token in localStorage
  const role = localStorage.getItem("role"); // Get role from localStorage
  const location = useLocation();

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" />;
  }

  if (location.pathname.startsWith("/admin") && role !== "admin") {
    // If accessing admin route and role is not admin, redirect to not authorized page
    return <Navigate to="/not-authorized" />;
  }

  if (location.pathname.startsWith("/user") && role !== "user") {
    // If accessing user route and role is not user, redirect to not authorized page
    return <Navigate to="/not-authorized" />;
  }

  return <>{children}</>; // If token and role are valid, render children
};

export default ProtectedRoute;
