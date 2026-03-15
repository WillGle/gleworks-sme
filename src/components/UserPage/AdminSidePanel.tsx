// Admin side navigation and logout actions.
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllSidePanel.css";
import { clearSession } from "@api";

const SidePanel: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    sessionStorage.clear();
    navigate("/login");
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
