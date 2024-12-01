import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllSidePanel.css";
import { useEffect } from "react";

const SidePanel: React.FC = () => {
  // State lưu thông tin người dùng

  const navigate = useNavigate();

  // Kiểm tra thông tin người dùng trong localStorage khi component được mount
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        JSON.parse(userData); // Just parse it if needed, no need to store it
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user information from localStorage
    sessionStorage.clear(); // Clear all sessionStorage
    localStorage.removeItem("token"); // Remove the token from local storage
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
            <Link to="/admin/new-password">Change Password</Link>
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
