import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // Kiểm tra token trong localStorage
  const role = localStorage.getItem("role"); // Lấy role từ localStorage

  if (!token || role !== 'user') {
    // Nếu không có token hoặc role không phải là 'user', chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // Nếu có token và role là 'user', hiển thị nội dung con
};

export default ProtectedRoute;