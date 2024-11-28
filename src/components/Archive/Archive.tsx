import React from "react";
import "./Archive.css";
import image1 from "../../assets/a3.jpeg";
import image2 from "../../assets/98plastic.png";
import image3 from "../../assets/sams46_promo.png";
import image4 from "../../assets/sams46.png";
import image5 from "../../assets/keychron_promo.jpg";
import image6 from "../../assets/keychron2.jpeg";

// Archive component representing the archive page
const Archive: React.FC = () => {
  const items = [
    {
      id: 1,
      description: "Donkey A3 custom WHITE spray coated ",
      image: image1,
    },
    {
      id: 2,
      description: "Akko 3098 solder franken modded + stab (stock) modded",
      image: image2,
    },
    {
      id: 3,
      description: "Sam48 assem Virus lubed + ping fixed + MLv2 modded",
      image: image3,
    },
    {
      id: 4,
      description: "Sam48 assem Virus lubed + ping fixed + MLv2 modded",
      image: image4,
    },
    {
      id: 5,
      description:
        "Keychron K4 case modded + assem Gateron brown Lubed + stab (stock) modded",
      image: image5,
    },
    {
      id: 6,
      description:
        "Keychron K4 case modded + assem Gateron brown Lubed + stab (stock) modded",
      image: image6,
    },
  ];

  return (
    <div className="archive">
      <h1>Archive</h1>
      <div className="archive-list">
        {items.map((item) => (
          <div key={item.id} className="archive-item">
            <div className="image-container">
              <img src={item.image} alt={`Item ${item.id}`} />
              {/* <div className="description-overlay">
                <p>{item.description}</p>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
