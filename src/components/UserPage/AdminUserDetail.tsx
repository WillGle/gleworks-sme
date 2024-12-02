import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate for redirection and useParams for URL params
import "./AdminUserDetail.css"; // Add your styles
// API URL imported from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
  city: string;
}

const AdminUserDetail: React.FC = () => {
  const { userId } = useParams(); // Lấy userId từ URL params

  // State for form data
  const [formData, setFormData] = useState<User>({
    id: "",
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
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if token is not found
      navigate("/login");
    } else {
      fetchUserData(); // Gọi trực tiếp fetchUserData
    }
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    
    if (token && userId) { // Sử dụng userId từ params
      try {
        const response = await fetch(`${apiUrl}/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const savedUser = await response.json();
        setFormData({
          id: savedUser.id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          phoneNumber: savedUser.phoneNumber,
          email: savedUser.email,
          dateOfBirth: savedUser.dateOfBirth,
          address: savedUser.address,
          city: savedUser.city,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Không thể lấy thông tin người dùng.");
      }
    } else {
      setMessage("Token or User ID is missing.");
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      // Send a PUT request to update user information
      const response = await fetch(
        `${apiUrl}/users/${formData.id}`, // Use user ID for the update
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token for authorization
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage("Thông tin đã được cập nhật thành công!");
        fetchUserData(); // Fetch updated user data
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
      <h1>
        {formData.firstName} {formData.lastName}'s Account
      </h1>
      <p>Manage profile information for account security</p>
      <div className="account-form-container">
        <div className="account-form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Your First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Your Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="account-form-group">
          <label>Telephone</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Your Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Your Date of Birth (DD-MM-YYYY)"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Your Default Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="account-form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="Your City"
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

export default AdminUserDetail;
