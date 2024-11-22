import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceSelect.css";

const Service: React.FC = () => {
  const navigate = useNavigate(); // Hook để điều hướng trang
  const [activeNote, setActiveNote] = useState<number | null>(null); // Trạng thái mở rộng dropdown

  // Dữ liệu FAQ (Frequently Asked Questions)
  const faqData = [
    {
      question: "Can you source my parts for me?",
      answer:
        "I can! But it will be limited to what's in stock. Payment for this will also need to be made up front.",
    },
    {
      question: "How quick is this process?",
      answer: "This depends on the complexity of the build.",
    },
    {
      question: "Can I ship parts from vendors to you?",
      answer: "Yes, you can ship parts directly from vendors to my address.",
    },
    {
      question: "Do I get photos of my board included?",
      answer: "Yes, photos of the finished build will be provided.",
    },
  ];

  // Hàm toggle trạng thái dropdown
  const toggleNote = (index: number) => {
    setActiveNote(activeNote === index ? null : index);
  };

  return (
    <div className="service-container">
      {/* Shortcut Services */}
      <div className="service-shortcuts">
        <div
          className="service-card"
          onClick={() => navigate("/service/switch-modding")}
        >
          <h3>Switch Modding Service</h3>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>
        <div
          className="service-card"
          onClick={() => navigate("/service/keyboard-build")}
        >
          <h3>Keyboard Build Service</h3>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="service-notes">
        <h1>
          Commission Status: <span style={{ color: "green" }}>Open</span>
        </h1>
        <h2>Notes:</h2>
        <p>
          Remember that all materials, with the exception of lubricant, solder
          and dielectric grease, must be provided by the owner unless discussed
          otherwise.
        </p>
        <p>
          All parts, like stabilizers, films etc are also to be provided if
          needed. Prices <strong>do not</strong> include return shipping and/or
          duties.
        </p>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeNote === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleNote(index)}>
                {faq.question}
              </div>
              {activeNote === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
