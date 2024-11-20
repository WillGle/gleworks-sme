import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserPage.css";

interface User {
  firstName: string;
  lastName: string;
  gender: string;
  rank: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const fetchUserData = () => {
      const savedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      setUserData(savedUser);
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // Hiển thị loading nếu chưa có dữ liệu
  }

  return (
    <div className="user-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Link to="/home">
            <strong>GLE.WORK</strong>
          </Link>
        </div>
        <nav>
          <ul className="settings-menu">
            <li>Setting</li>
            <li>Setting</li>
            <li>Setting</li>
            <li>
              <Link to="/new-password">Change Password</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        <header className="profile-header">
          <div className="profile-details">
            <h2>{`${userData.firstName} ${userData.lastName}` || "N/A"}</h2>
            <p>{userData.gender || "N/A"}</p>
            <p>{userData.rank || "Ranked Member"}</p>
          </div>
        </header>

        <section className="user-about-section">
          <h3>About</h3>
          <div className="user-about-info">
            <p>Tele: {userData.phoneNumber || "N/A"}</p>
            <p>Mail: {userData.email || "N/A"}</p>
            <p>D.O.B: {userData.dateOfBirth || "N/A"}</p>
            <p>Address: {userData.address || "N/A"}</p>
            <p>City: {userData.city || "N/A"}</p>
          </div>
        </section>

        <section className="order-tracking">
          <h3>Order Tracking</h3>
          <div className="order-tracking-placeholder">
            Order tracking details will appear here.
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserPage;
