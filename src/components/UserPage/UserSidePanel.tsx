import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AllSidePanel.css";
import { useEffect } from "react";

const SidePanel: React.FC = () => {
  const navigate = useNavigate();

  // Check user information in localStorage when the component mounts
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
