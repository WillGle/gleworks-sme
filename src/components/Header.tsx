import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaUser } from "react-icons/fa";

// Interface định nghĩa kiểu dữ liệu của người dùng
interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Add role to the User interface
}

const Header: React.FC = () => {
  // State lưu thông tin người dùng
  const [user, setUser] = useState<User | null>(null);
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
    <header className="topHeader">
      <div className="header-main">
        {/* Logo Section */}
        <div className="logo">
          <a href="/">
            <strong>GLE.WORK</strong>
          </a>
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
                Hi, {user.lastName} {user.firstName} {/* làm thành button*/}
              </Link>
              {/* Chữ Logout */}
              <span className="logout-button" onClick={handleLogout}>
                Logout
              </span>
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
