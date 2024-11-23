import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
          <Link to="/">
            <strong>GLE.WORK</strong>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          <Link to="/about">About</Link>
          {/* <Link to="/blog">Blogs</Link> */}
          <Link to="/service">Service</Link>
          <Link to="/archive">Archive</Link>
        </nav>

        {/* Icon Links */}
        <div className="icons">
          <FaSearch className="icon" />
          {user ? (
            <>
              {/* Hiển thị thông tin người dùng với liên kết đến trang user */}
              <Link to="/user/my-account" className="user-info">
                {user.firstName} {user.lastName}
              </Link>
              {/* Nút Logout */}
              <button onClick={handleLogout}>Logout</button>
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