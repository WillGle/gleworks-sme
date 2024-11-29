import React from "react";
import "./Landing.css";

import image1 from "../../assets/landing.jpg";
import about from "../../assets/about.jpg";

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
          {/* <Link to="/about" className="learn-more-button">
            Learn More
          </Link> */}
        </div>
        <div className="hero-image">
          <img
            src={image1}
            alt="A beautiful custom keyboard"
            className="hero-image"
          />
        </div>
      </section>

      <section className="about-section">
        <div className="about-image">
          <img src={about} alt="Chí-Cường Nguyễn" className="about-image" />
        </div>
        <div className="about-content">
          <h1>Chí-Cường Nguyễn</h1>
          <h2>
            <i>
              <span>Gleammy</span>
            </i>
          </h2>
          <p>
            Have you ever experienced the joy and motivation that come from
            creating something with your own hands?
          </p>
          <p>
            Since childhood, I have been deeply fascinated by intricate
            mechanical devices. As I grew older, this passion drove me to
            explore and immerse myself in the world of mechanical keyboards,
            where I could blend my skills with my personal interests
          </p>

          <p>
            Here, my passions and hobbies intersect, inspiring the creation of
            vibrant and innovative works of art.
          </p>
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
