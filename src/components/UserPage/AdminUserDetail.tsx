import React, { useState } from "react";
import "./AdminUserDetail.css";

const AdminUserDetail: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "Will",
    lastName: "Kenason",
    email: "otakunguyen283@gmail.com",
    telephone: "+84907139123",
    dateOfBirth: "2003-08-01",
    address: "",
    city: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDeactivate = () => {
    // Deactivate logic here
    alert("User deactivated!");
  };

  const handleConfirm = () => {
    // Save or confirm changes logic here
    alert("Changes confirmed!");
  };

  return (
    <div className="user-detail-container">
      <h1>Users - Detail</h1>
      <form className="user-detail-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={userDetails.telephone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userDetails.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={userDetails.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={userDetails.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn-deactivate"
            onClick={handleDeactivate}
          >
            Deactivate
          </button>
          <button type="button" className="btn-confirm" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserDetail;
