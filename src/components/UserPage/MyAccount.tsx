import React, { useState, useEffect } from "react";
import "./MyAccount.css"; // Add your styles

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
}

const MyAccount: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    city: "",
  });

  // State for success or error messages
  const [message, setMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = () => {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (savedUser) {
        setFormData({
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          phoneNumber: savedUser.phoneNumber,
          email: savedUser.email,
          dateOfBirth: savedUser.dateOfBirth,
          address: savedUser.address,
          city: savedUser.city,
        });
      }
      console.log("Retrieved user data:", savedUser);
    };
    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id; // Assuming the user ID is stored in localStorage

      // Send a PUT request to update user information
      const response = await fetch(
        `http://localhost:3001/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage("Thông tin đã được cập nhật thành công!");
      } else {
        setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
      }

      // Reset the message after a few seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating information:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="my-account">
      <h1>My Account</h1>
      <p>Manage profile information for account security</p>
      <div className="account-form-container">
        <div className="account-form-group">
          <label> First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Telephone</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} className="submit-btn">
          Xác nhận
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default MyAccount;
