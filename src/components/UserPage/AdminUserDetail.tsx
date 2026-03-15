// Admin profile editor for an individual user account.
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUser, isAuthenticated, updateUser } from "@api";
import type { UpdateUserPayload, UserProfile } from "@api/types";
import "./AdminUserDetail.css";

const emptyUserProfile: UserProfile = {
  id: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  dateOfBirth: "",
  address: "",
  city: "",
};

const AdminUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [formData, setFormData] = useState<UserProfile>(emptyUserProfile);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      if (!userId) {
        setMessage("User ID is missing.");
        return;
      }

      try {
        const savedUser = await getUser(userId);
        setFormData(savedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Không thể lấy thông tin người dùng.");
      }
    };

    void fetchUserData();
  }, [navigate, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload: UpdateUserPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
      };

      const updatedUser = await updateUser(formData.id, payload);
      setFormData(updatedUser);
      setMessage("Thông tin đã được cập nhật thành công!");
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
