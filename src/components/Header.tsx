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

  return (
    <header className="topHeader">
      <div className="header-main">
        {/* Logo Section */}
        <div className="logo">
          <a href="/">GLE.WORK</a>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          {/* <Link to="/about">About</Link> */}
          <Link to="/service">Service</Link>
          <Link to="/archive">Archive</Link>
        </nav>

        {/* Icon Links */}
        <div className="header-icons">
          {user ? (
            <>
              {/* Hiển thị thông tin người dùng với liên kết đến trang user hoặc admin */}
              <Link
                to={user.role === "admin" ? "/admin" : "/user"}
                className="user-info"
              >
                Hi, {userLabel}
              </Link>
              {/* Thêm nút logout */}
            </>
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
