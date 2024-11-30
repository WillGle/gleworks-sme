import React from "react";
import "./Footer.css";
import { FaArrowRight, FaFacebook, FaInstagram } from "react-icons/fa";

// Footer component representing the bottom section of the application
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Newsletter Signup Section */}
        <div className="footer-section">
          <h3>STAY IN THE LOOP</h3>
          <p>Sign up with your email address to receive news and updates.</p>
          <div className="email-signup">
            <input type="email" placeholder="Email" />
            <button>
              <FaArrowRight /> {/*Xử lý gửi mail */}
            </button>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="footer-section">
          <div className="logo">GLE.WORK</div>
          <p>Ho Chi Minh, Vietnam</p>
          <p>glework.sp@gmail.com</p>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <ul>
            <li>
              <a href="/policies">Term of Service</a>
            </li>
            <li>
              <a href="/policies">Privacy Policy</a>
            </li>
            <li>
              <a href="/policies">Return Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
