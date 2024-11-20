import React from "react";
import { Link } from "react-router-dom";
import "./SidePanel.css";

const SidePanel: React.FC = () => {
  return (
    <div className="side-panel">
      <h1 className="logo">GLE.WORK</h1>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/user/my-account">My Account</Link>
          </li>
          <li>
            <Link to="/user/my-orders">My Orders</Link>
          </li>
          <li>
            <Link to="/user/notification">Policies</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidePanel;
