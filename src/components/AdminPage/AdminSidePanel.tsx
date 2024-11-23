import React from "react";
import { Link } from "react-router-dom";
import "./AdminSidePanel.css";

const SidePanel: React.FC = () => {
  return (
    <div className="admin-side-panel">
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/my-orders">My Orders</Link>
          </li>
          <li>
            <Link to="/admin/user-list">Users</Link>
          </li>
          <li>
            <Link to="/new-password">Change Password</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidePanel;
