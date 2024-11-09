import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

// Landing component representing the landing page
const Landing: React.FC = () => {
  return (
    <div className="landing">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Masterpiece comes with immaculate craftsmanship</h1>
          <p>
            Step into custom keyboard world, where creativity knows no bounds,
            and every mechanical keyboard transcends mere functionality to
            become a work of art.
          </p>
          <Link to="/about" className="learn-more-button">
            Learn More
          </Link>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">Picture</div>
        </div>
      </section>

      <section className="popular-blogs">
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
      </section>
    </div>
  );
};

export default Landing;
