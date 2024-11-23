import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

// Mock data for customer
const customerInfo = {
  customer: "John Doe",
  email: "john.doe@example.com",
  phone: "0123456789",
  address: "123 ABC Street, City, Country",
};

// Mock order data for Switch Modding
const mockOrderData = {
  switchName: "Cherry MX Red",
  amount: "70",
  preferences: ["Lube (5,000 VND)", "Films (3,000 VND)"],
  springPreference: "Payson (3,000 VND)",
  additionalNotes: "Please handle with care!",
  total: 350000,
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // State for customer information (editable)
  const [customerData, setCustomerData] = useState(customerInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceed = () => {
    alert("Order confirmed successfully! Thank you for your purchase.");
  };

  return (
    <div className="checkout-container">
      <h1>Checkout - Switch Modding Service</h1>

      {/* Editable Customer Information */}
      <div className="customer-info">
        <div className="order-form-group">
          <label>Customer</label>
          <input
            type="text"
            name="customer"
            className="input-field"
            value={customerData.customer}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="input-field"
            value={customerData.email}
            onChange={handleInputChange}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            className="input-field"
            value={customerData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            className="input-field"
            value={customerData.address}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <hr />

      {/* Non-editable Order Details */}
      <div className="order-details">
        <div className="order-form-group">
          <label>Switch Name</label>
          <p>{mockOrderData.switchName}</p>
        </div>

        <div className="order-form-group">
          <label>Amount</label>
          <p>{mockOrderData.amount}</p>
        </div>

        <div className="order-form-group">
          <label>Switch Modding Preference</label>
          <p>{mockOrderData.preferences.join(", ")}</p>
        </div>

        <div className="order-form-group">
          <label>My Spring Preference</label>
          <p>{mockOrderData.springPreference}</p>
        </div>

        <div className="order-form-group">
          <label>Additional Notes</label>
          <p>{mockOrderData.additionalNotes}</p>
        </div>
      </div>

      <hr />

      {/* Total Section */}
      <div className="checkout-total-section">
        <h2>TOTAL</h2>
        <p>{mockOrderData.total.toLocaleString()} VND</p>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button
          type="button"
          className="return-button"
          onClick={() => navigate("/service/switch-modding")}
        >
          Return
        </button>
        <button
          type="button"
          className="proceed-button"
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Checkout;
