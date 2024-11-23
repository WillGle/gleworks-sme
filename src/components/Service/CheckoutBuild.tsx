import React from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutBuild.css";

// Mock data for Checkout
const mockFormData = {
  keyboardKitName: "Custom Keyboard Kit",
  switchesName: "Cherry MX Red",
  layout: "60 - 65%",
  withSwitches: "Yes, I have a Switch Mod order",
  switchQuantity: "70",
  stabilizerName: "Durock V2",
  plateChoice: "Aluminum",
  providingKeycap: "Yes",
  desoldering: "60 - 65%",
  assembly: "Less than 60 %",
  additionalNotes: "Please make sure the stabilizers are perfectly tuned.",
  termsAccepted: true,
};

const mockPrices = {
  desoldering: {
    "Less than 60 %": 150000,
    "60 - 65%": 200000,
    "75% - TKL": 250000,
    "TKL +": 300000,
    None: 0,
  },
  assembly: {
    "Less than 60 %": 350000,
    "60 - 65%": 400000,
    "75% - TKL": 500000,
    "TKL +": 600000,
    "Hotswap all size": 250000,
  },
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // Calculate the total price based on the mock data
  const desolderingCost =
    mockPrices.desoldering[
      mockFormData.desoldering as keyof typeof mockPrices.desoldering
    ] || 0;
  const assemblyCost =
    mockPrices.assembly[
      mockFormData.assembly as keyof typeof mockPrices.assembly
    ] || 0;

  const total = desolderingCost + assemblyCost;

  const handleProceed = () => {
    alert("Order confirmed successfully! Thank you for your purchase.");
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="customer-info">
        <h3>Customer Information</h3>
        <p>
          <strong>Customer:</strong> John Doe
        </p>
        <p>
          <strong>Mail:</strong> john.doe@example.com
        </p>
        <p>
          <strong>Tel:</strong> 0123456789
        </p>
        <p>
          <strong>Address:</strong> 123 ABC Street, City, Country
        </p>
      </div>

      <hr />

      <div className="service-details">
        <h3>Service Details</h3>
        <p>
          <strong>Keyboard Kit Name:</strong> {mockFormData.keyboardKitName}
        </p>
        <p>
          <strong>Switches:</strong> {mockFormData.switchesName}
        </p>
        <p>
          <strong>Layout:</strong> {mockFormData.layout}
        </p>
        <p>
          <strong>With Switches:</strong> {mockFormData.withSwitches}
        </p>
        <p>
          <strong>Stabilizer Name:</strong> {mockFormData.stabilizerName}
        </p>
        <p>
          <strong>Switch Quantity:</strong> {mockFormData.switchQuantity}
        </p>
        <p>
          <strong>Plate Choice:</strong> {mockFormData.plateChoice}
        </p>
        <p>
          <strong>Providing Keycap:</strong> {mockFormData.providingKeycap}
        </p>
        <p>
          <strong>Desoldering:</strong> {mockFormData.desoldering} (
          {desolderingCost.toLocaleString()} VND)
        </p>
        <p>
          <strong>Assembly:</strong> {mockFormData.assembly} (
          {assemblyCost.toLocaleString()} VND)
        </p>
        <p>
          <strong>Additional Notes:</strong> {mockFormData.additionalNotes}
        </p>
      </div>

      <hr />

      <div className="total">
        <h3>TOTAL</h3>
        <p>{total.toLocaleString()} VND</p>
      </div>

      <div className="button-group">
        <button className="return-button" onClick={() => navigate("/service")}>
          Return
        </button>
        <button className="proceed-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Checkout;
