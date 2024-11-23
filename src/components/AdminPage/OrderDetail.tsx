import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetail.css";

// Mock data for orders (replace with actual API or state data)
const mockOrders = [
  {
    orderId: "000001",
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "0123456789",
    address: "123 ABC Street, City, Country",
    orderDate: "20/11/2024",
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
    total: "350,000 VND",
    paymentStatus: "Pending",
    orderStatus: "Pending",
  },
  {
    orderId: "000002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "0987654321",
    address: "456 XYZ Street, City, Country",
    orderDate: "21/11/2024",
    switchesName: "Gateron Brown",
    withSwitches: "No, I will include mine",
    keyboardKitName: "Advanced Keyboard Kit",
    layout: "TKL",
    stabilizerName: "Everglide Panda",
    switchQuantity: "87",
    plateChoice: "Brass",
    desoldering: "None",
    providingKeycap: "No",
    assembly: "TKL +",
    total: "600,000 VND",
    paymentStatus: "Paid",
    orderStatus: "Finished",
  },
];

// Options for statuses
const paymentStatusOptions = ["Paid", "Pending", "Canceled"];
const orderStatusOptions = [
  "Finished",
  "Ongoing",
  "Pending",
  "Paused",
  "Canceled",
];

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>(); // Extract orderId from URL
  const [orderData, setOrderData] = useState<(typeof mockOrders)[0] | null>(
    null
  );

  useEffect(() => {
    // Fetch order data based on orderId
    const order = mockOrders.find((order) => order.orderId === orderId);
    if (order) {
      setOrderData(order);
    } else {
      console.error(`Order with ID ${orderId} not found.`);
    }
  }, [orderId]);

  if (!orderData) {
    return <p>Loading order details...</p>;
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => (prev ? { ...prev, [name]: value } : null));
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
