import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";

// Header component representing the top navigation bar
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-main">
        {/* Logo Section */}
        <div className="logo">
          <strong>GLE.WORK</strong>
        </div>

        {/* Navigation Links */}
        <nav className="navigation">
          <Link to="/blogs">Blogs</Link>
          <Link to="/services">Services</Link>
          <Link to="/archive">Archive</Link>
          <Link to="/login">Login</Link>
        </nav>

        {/* Icon Links */}
        <div className="icons">
          <FaSearch className="icon" />
          <FaUser className="icon" />
          <FaShoppingBag className="icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
