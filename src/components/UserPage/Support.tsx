import React from "react";
import "./Support.css";

const Support: React.FC = () => {
  return (
    <div className="support-container">
      <header className="support-header">
        <div className="support-info">
          <h1>Support</h1>
          <h2>GLE.WORK</h2>
          <p>Tel: 0907193123</p>
          <p>Email: glework.sp@gmail.com</p>
        </div>
      </header>
      <hr className="divider" />
      <main className="support-form">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Full name" className="form-input" />
          <input type="email" placeholder="Email" className="form-input" />
          <input type="tel" placeholder="Telephone" className="form-input" />
          <input type="text" placeholder="Title" className="form-input" />
          <textarea
            placeholder="Support Content"
            className="form-textarea"
          ></textarea>
          <button type="submit" className="submit-button">
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Support;
