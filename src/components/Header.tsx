import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";

// Interface định nghĩa kiểu dữ liệu của người dùng
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const Header: React.FC = () => {
  // State lưu thông tin người dùng
  const [user, setUser] = useState<User | null>(null);

  // Kiểm tra thông tin người dùng trong localStorage khi component được mount
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        setUser(JSON.parse(userData)); // Chuyển dữ liệu từ localStorage thành object
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  return (
    <header className="topHeader">
      <div className="header-main">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/">
            <strong>GLE.WORK</strong>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          <Link to="/about">About</Link>
          <Link to="/blog">Blogs</Link>
          <Link to="/service">Service</Link>
          <Link to="/archive">Archive</Link>
        </nav>

        {/* Icon Links */}
        <div className="icons">
          <FaSearch className="icon" />
          {user ? (
            <>
              {/* Hiển thị thông tin người dùng với liên kết đến trang user */}
              <Link to="/user" className="user-info">
                {user.firstName} {user.lastName}
              </Link>
              {/* Nút Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
                  setUser(null); // Reset state user
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: "10px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <FaUser className="icon" />
            </Link>
          )}
          <FaShoppingBag className="icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
