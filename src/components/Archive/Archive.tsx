import React from "react";
import "./Archive.css";

// Archive component representing the archive page
const Archive: React.FC = () => {
  const items = [
    {
      id: 1,
      description: "Short description for item 1",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      description: "Short description for item 2",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      description: "Short description for item 3",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      description: "Short description for item 4",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      description: "Short description for item 5",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      description: "Short description for item 6",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 7,
      description: "Short description for item 7",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 8,
      description: "Short description for item 8",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 9,
      description: "Short description for item 9",
      image: "https://via.placeholder.com/300",
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
              <div className="description-overlay">
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
