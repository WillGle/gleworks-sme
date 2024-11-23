import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

// Mock data to display in checkout
const customerInfo = {
  customer: "John Doe",
  email: "john.doe@example.com",
  phone: "0123456789",
  address: "123 ABC Street, City, Country",
};

// Mock order data
const mockOrderData = {
  switchesName: "Cherry MX Red",
  withSwitches: "Yes, I have a Switch Mod order",
  keyboardKitName: "Custom Keyboard Kit",
  layout: "60 - 65%",
  stabilizerName: "Durock V2",
  switchQuantity: "70",
  plateChoice: "Aluminum",
  desoldering: "60 - 65%",
  providingKeycap: "Yes",
  assembly: "Less than 60 %",
  additionalNotes: "Please handle with care!",
  total: 550000,
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // State for editable customer information
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
      <h1>Checkout - Keyboard Building Service</h1>

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

        <div className="order-form-group">
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

        <div className="order-form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            className="input-field"
            value={customerData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="order-form-group">
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
          <label>Switches</label>
          <p>{mockOrderData.switchesName}</p>
        </div>

        <div className="order-form-group">
          <label>With Switches</label>
          <p>{mockOrderData.withSwitches}</p>
        </div>

        <div className="order-form-group">
          <label>Keyboard Kit Name</label>
          <p>{mockOrderData.keyboardKitName}</p>
        </div>

        <div className="order-form-group">
          <label>Layout</label>
          <p>{mockOrderData.layout}</p>
        </div>

        <div className="order-form-group">
          <label>Stabilizer Name</label>
          <p>{mockOrderData.stabilizerName}</p>
        </div>

        <div className="order-form-group">
          <label>Switch Quantity</label>
          <p>{mockOrderData.switchQuantity}</p>
        </div>

        <div className="order-form-group">
          <label>Plate Choice</label>
          <p>{mockOrderData.plateChoice}</p>
        </div>

        <div className="order-form-group">
          <label>Desoldering</label>
          <p>{mockOrderData.desoldering}</p>
        </div>

        <div className="order-form-group">
          <label>Are You Providing Keycap?</label>
          <p>{mockOrderData.providingKeycap}</p>
        </div>

        <div className="order-form-group">
          <label>Assembly</label>
          <p>{mockOrderData.assembly}</p>
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
          onClick={() => navigate("/service")}
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
