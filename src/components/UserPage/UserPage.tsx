import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserPage.css";

interface User {
  fullName: string;
  gender: string;
  rank: string;
  tele: string;
  email: string;
  dob: string;
  address: string;
  city: string;
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Simulate fetching user data (e.g., from API or localStorage)
    const fetchUserData = () => {
      const savedUser = JSON.parse(localStorage.getItem("userData") || "{}");
      setUserData(savedUser);
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
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
            <li>Setting</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        <header className="profile-header">
          <div className="profile-details">
            <h2>{userData.fullName || "N/A"}</h2>
            <p>{userData.gender || "N/A"}</p>
            <p>{userData.rank || "Ranked Member"}</p>
          </div>
        </header>

        <section className="user-about-section">
          <h3>About</h3>
          <div className="user-about-info">
            <p>Tele: {userData.tele || "N/A"}</p>
            <p>Mail: {userData.email || "N/A"}</p>
            <p>D.O.B: {userData.dob || "N/A"}</p>
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
