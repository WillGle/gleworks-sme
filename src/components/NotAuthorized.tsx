import React from "react";
import "./NotAuthorized.css"; // Optional styling

const NotAuth: React.FC = () => {
  return (
    <div className="not-auth-container">
      <h1>Not Authorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default NotAuth;
