import React, { useState } from "react";
import "./OrderDetail.css";

const paymentStatusOptions = ["Paid", "Pending", "Canceled"];
const orderStatusOptions = [
  "Finished",
  "Ongoing",
  "Pending",
  "Paused",
  "Canceled",
];

const OrderDetail: React.FC = () => {
  // Mock data for order detail
  const [orderData, setOrderData] = useState({
    orderId: "123456",
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "0123456789",
    address: "123 ABC Street, City, Country",
    orderDate: "DD/MM/YYYY",
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
    total: "xxx.xxx VND",
    paymentStatus: "Pending",
    orderStatus: "Ongoing",
  });

  // Handlers for updating the dropdown values
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="order-detail-container">
      <h1>My Orders - Detail</h1>

      {/* Customer Information */}
      <div className="customer-info">
        <div className="form-group">
          <label>Order ID</label>
          <p>{orderData.orderId}</p>
        </div>
        <div className="form-group">
          <label>Customer</label>
          <p>{orderData.customer}</p>
        </div>
        <div className="form-group">
          <label>Mail</label>
          <p>{orderData.email}</p>
        </div>
        <div className="form-group">
          <label>Tel</label>
          <p>{orderData.phone}</p>
        </div>
        <div className="form-group">
          <label>Address</label>
          <p>{orderData.address}</p>
        </div>
        <div className="form-group">
          <label>Order Date</label>
          <p>{orderData.orderDate}</p>
        </div>
      </div>

      <hr />

      {/* Order Information */}
      <div className="order-info">
        <div className="form-group">
          <label>Switches</label>
          <p>{orderData.switchesName}</p>
        </div>
        <div className="form-group">
          <label>With Switches</label>
          <p>{orderData.withSwitches}</p>
        </div>
        <div className="form-group">
          <label>Keyboard Kit Name</label>
          <p>{orderData.keyboardKitName}</p>
        </div>
        <div className="form-group">
          <label>Layout</label>
          <p>{orderData.layout}</p>
        </div>
        <div className="form-group">
          <label>Stabilizer Name</label>
          <p>{orderData.stabilizerName}</p>
        </div>
        <div className="form-group">
          <label>Switch Quantity</label>
          <p>{orderData.switchQuantity}</p>
        </div>
        <div className="form-group">
          <label>Plate Choice</label>
          <p>{orderData.plateChoice}</p>
        </div>
        <div className="form-group">
          <label>Desoldering</label>
          <p>{orderData.desoldering}</p>
        </div>
        <div className="form-group">
          <label>Are You Providing Keycap?</label>
          <p>{orderData.providingKeycap}</p>
        </div>
        <div className="form-group">
          <label>Assembly</label>
          <p>{orderData.assembly}</p>
        </div>
      </div>

      <hr />

      {/* Total Section */}
      <div className="total-section">
        <h2>Total</h2>
        <p>{orderData.total}</p>
      </div>

      {/* Status Selection */}
      <div className="status-section">
        <div className="form-group">
          <label>Order Status</label>
          <select
            name="orderStatus"
            value={orderData.orderStatus}
            onChange={handleStatusChange}
          >
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Payment Status</label>
          <select
            name="paymentStatus"
            value={orderData.paymentStatus}
            onChange={handleStatusChange}
          >
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
