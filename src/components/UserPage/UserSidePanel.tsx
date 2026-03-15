// User side navigation and logout actions.
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
            <Link to="/user/my-account">My Account</Link>
          </li>
          <li>
            <Link to="/user/my-orders">My Orders</Link>
          </li>
          <li>
            <Link to="/user/support">Support</Link>
          </li>
          <li>
            <Link to="/user/new-password">Change Password</Link>
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
