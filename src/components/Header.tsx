// Shared site header that also reflects the current auth state.
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaUser } from "react-icons/fa";
import { getStoredUser } from "@api";

const Header: React.FC = () => {
  const user = getStoredUser();
  const userLabel =
    [user?.lastName, user?.firstName].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "Account";

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="topHeader">
      <div className="header-main">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/">GLEWORKS</Link>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          <Link to="/service">Service</Link>
          <Link to="/archive">Archive</Link>
        </nav>

        {/* Icon Links */}
        <div className="header-icons">
          {user ? (
            <div className="user-nav-group">
              <Link
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/my-account"
                }
                className="user-info"
              >
                Hi, {userLabel}
              </Link>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <FaUser className="icon" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
