import React, { useState } from "react";
import "./Blog.css";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  content: string;
  imageUrl: string; // URL cho hình ảnh
}

const blogs: BlogPost[] = [
  {
    id: 1,
    title: "Toronto Mechanical Keyboard Mini Meet",
    date: "June 3, 2024",
    content:
      "This was my first 'mechanical keyboard mini meet' here in Toronto and it was a blast. It took place at the North York Central Library...",
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    title: "Toronto Photo Walks with a Leica M11",
    date: "March 8, 2024",
    content:
      "This year is about learning something new, among other goals. One of those new things is to get back into bringing my camera with me...",
    imageUrl: "https://via.placeholder.com/300x200",
  },
];

const Blog: React.FC = () => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const handleBlogClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
  };

  const handleClosePopup = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="blog-container">
      <div className="blog-grid">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="blog-card"
            onClick={() => handleBlogClick(blog)}
          >
            <div className="blog-image">
              <img src={blog.imageUrl} alt={blog.title} />
            </div>
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p className="blog-date">{blog.date}</p>
              <p className="blog-snippet">{blog.content}</p>
              <span className="read-more">Read More</span>
            </div>
          </div>
        ))}
      </div>

      {selectedBlog && (
        <div className="blog-popup">
          <div className="blog-popup-content">
            <button className="close-button" onClick={handleClosePopup}>
              ×
            </button>
            <h2>{selectedBlog.title}</h2>
            <p>{selectedBlog.date}</p>
            <div className="blog-popup-body">{selectedBlog.content}</div>
          </div>
          <div className="popup-overlay" onClick={handleClosePopup}></div>
        </div>
      )}
    </div>
  );
};

export default Blog;
