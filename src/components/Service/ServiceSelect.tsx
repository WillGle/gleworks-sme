import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceSelect.css";

const Service: React.FC = () => {
  const navigate = useNavigate();
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/services`
        ); // Use the API URL from .env
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // FAQ data
  const faqData = [
    {
      question: "What is the purpose of this service",
      answer:
        "We tailor your keyboard to enhances typing performance, customizes keyboard feel, and saves time for enthusiasts who want professional, high-quality modifications without the hassle.",
    },
    {
      question: "Can you source my parts for me?",
      answer:
        "I can! But it will be limited to what’s in stock. Payment for this will also need to be made up front.",
    },
    {
      question: "Can I ship parts from vendors to you?",
      answer:
        "At this time, I take it on a case by case basis. I would prefer if you shipped the package as a single unit to avoid confusion with packages and excess duties. Let’s discuss this further.",
    },
    {
      question: "Do I get photos of my board included?",
      answer:
        "I typically try take fancy photos of everything, but it’s not a guarantee and any additional media wanted by the owner needs to be discussed. So please add that in the notes!",
    },
    {
      question: "I have more questions about a build!",
      answer:
        "If you’re looking to get a custom build, let’s discuss it further via my social.",
    },
  ];

  // Toggle the dropdown state
  const toggleNote = (index: number) => {
    setActiveNote(activeNote === index ? null : index);
  };

  return (
    <div className="service-container">
      {/* Shortcut Services */}
      <div className="service-shortcuts">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card"
            onClick={() =>
              navigate(
                `/service/${service.name.toLowerCase().replace(/\s+/g, "-")}`
              )
            }
          >
            <h3>{service.name} Service</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>

      <hr />

      <div className="note-and-faq">
        {/* Notes Section */}
        <div className="note-section">
          <h1>
            Commission Status: <span style={{ color: "green" }}>Open</span>
          </h1>
          <h2>Notes:</h2>
          <p>
            Remember that all materials, with the exception of lubricant, solder
            and dielectric grease, must be provided by the owner unless
            discussed otherwise.
          </p>
          <p>
            All parts, like stabilizers, films etc are also to be provided if
            needed for personal reference. Prices <strong>do not</strong>{" "}
            include return shipping and/or duties.
          </p>
          <p>
            The unit of measurement used in Switch Modding service form is 1
            (piece/item). <br /> Example: 1 switch, 1 LED, 1 socket.
          </p>
          <p>
            Orders for Lube will be completed within <strong>1-2 days</strong>.
            Build orders will be completed within <strong>4 days</strong> and
            will be kept for an <strong>additional 2 days</strong> for quality
            checks to ensure no issues arise upon delivery to the customer.
          </p>
        </div>

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
