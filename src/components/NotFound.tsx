import React from "react";
import "./NotFound.css"; // Optional styling

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
    </div>
  );
};

export default NotFound;
