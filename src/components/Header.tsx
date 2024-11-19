import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";

// Header component representing the top navigation bar
const Header: React.FC = () => {
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
          <Link to="/services">Service</Link>
          <Link to="/archive">Archive</Link>
        </nav>

        {/* Icon Links */}
        <div className="icons">
          <FaSearch className="icon" />
          <Link to="/login">
            <FaUser className="icon" />
          </Link>
          <FaShoppingBag className="icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
