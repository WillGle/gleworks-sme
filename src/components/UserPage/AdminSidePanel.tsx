import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllSidePanel.css";
import { useEffect, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Add role to the User interface
}

const SidePanel: React.FC = () => {
  // State lưu thông tin người dùng
  const [, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Kiểm tra thông tin người dùng trong localStorage khi component được mount
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Chuyển dữ liệu từ localStorage thành object
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
    sessionStorage.clear(); // Xóa toàn bộ sessionStorage
    localStorage.removeItem("token"); // Remove the token from local storage
    setUser(null); // Reset state user
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="side-panel">
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/my-orders">My Orders</Link>
          </li>
          <li>
            <Link to="/admin/user-list">Users Management</Link>
          </li>
          <li>
            <Link to="/new-password">Change Password</Link>
          </li>
        </ul>
      </nav>
      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
};

export default SidePanel;
