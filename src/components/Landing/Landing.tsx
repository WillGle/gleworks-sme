import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import image1 from "../../assets/landing.jpg";

// Landing component representing the landing page
const Landing: React.FC = () => {
  return (
    <div className="landing">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Simplifying service management for small businesses</h1>
          <p>
          GleWork is an integrated service website that enables customers to interact quickly and efficiently through their browsers. It also optimizes small business operational processes, helping reduce management costs and prevent financial losses.
          </p>
          <Link to="/about" className="learn-more-button">
            Learn More
          </Link>
        </div>
        <div className="hero-image">
          <img
            src={image1}
            alt="A beautiful custom keyboard"
            className="hero-image"
          />
        </div>
      </section>

      {/* <section className="popular-blogs">
        <h2>Popular Blogs</h2>
        <div className="blog-list">
          <Link to="/blogs" className="blog-item">
            <div className="image-placeholder">Picture</div>
            <p>Blog title 1</p>
          </Link>
          <Link to="/blogs" className="blog-item">
            <div className="image-placeholder">Picture</div>
            <p>Blog title 2</p>
          </Link>
          <Link to="/blogs" className="blog-item">
            <div className="image-placeholder">Picture</div>
            <p>Blog title 3</p>
          </Link>
        </div>
      </section> */}
    </div>
  );
};

export default Landing;
