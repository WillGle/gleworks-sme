import React from "react";
import "./About.css";

// Landing component representing the landing page
const About: React.FC = () => {
  return (
    <div className="about">
      <section className="about-section">
        <div className="about-image">
          <div className="image-placeholder">Picture</div>
        </div>
        <div className="about-content">
          <h1>Masterpiece comes with immaculate craftsmanship</h1>
          <p>
            Step into custom keyboard world, where creativity knows no bounds,
            and every mechanical keyboard transcends mere functionality to
            become a work of art.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
