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
    </div>
  );
};

export default About;
