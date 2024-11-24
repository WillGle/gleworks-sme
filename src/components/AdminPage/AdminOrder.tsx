import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./AdminOrder.css";

const mockOrders = [
  {
    id: "000001",
    name: "John Doe",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "350,000",
    paymentStatus: "Pending",
    orderStatus: "Pending",
  },
  {
    id: "000002",
    name: "Jane Smith",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "500,000",
    paymentStatus: "Canceled",
    orderStatus: "Canceled",
  },
  {
    id: "000003",
    name: "John Doe",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "450,000",
    paymentStatus: "Paid",
    orderStatus: "Finished",
  },
  {
    id: "000004",
    name: "Jane Smith",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "600,000",
    paymentStatus: "Paid",
    orderStatus: "Ongoing",
  },
  {
    id: "000005",
    name: "John Doe",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "250,000",
    paymentStatus: "Pending",
    orderStatus: "Paused",
  },
];

const AdminOrder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const navigate = useNavigate(); // Use navigate for routing

  // Filter handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = mockOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.name.toLowerCase().includes(term) ||
        order.orderType.toLowerCase().includes(term) ||
        order.address.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  const handleFilterByPaymentStatus = (status: string) => {
    const filtered = mockOrders.filter(
      (order) => order.paymentStatus === status
    );
    setFilteredOrders(filtered);
  };

  const handleFilterByOrderStatus = (status: string) => {
    const filtered = mockOrders.filter((order) => order.orderStatus === status);
    setFilteredOrders(filtered);
  };

  // Navigate to order detail page
  const handleRowClick = (orderId: string) => {
    navigate(`/my-orders/order-detail/${orderId}`); // Dynamic route
  };

  return (
    <div className="admin-dashboard">
      <h1>My Orders</h1>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <div className="filter-group">
          <h3>Orders</h3>
          <button onClick={() => setFilteredOrders(mockOrders)}>Reset</button>
        </div>

        <div className="filter-group">
          <h3>Payment Status</h3>
          {["Paid", "Pending", "Canceled"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterByPaymentStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <h3>Order Status</h3>
          {["Finished", "Ongoing", "Pending", "Paused", "Canceled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => handleFilterByOrderStatus(status)}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Order Table */}
      <div className="client-section">
        <h2>Client</h2>
        <div className="client-table">
          <div className="table-header">
            <div>ID</div>
            <div>Name</div>
            <div>Orders</div>
            <div>Date</div>
            <div>Address</div>
            <div>Value</div>
            <div>Payment Status</div>
            <div>Order Status</div>
          </div>
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="table-row"
              onClick={() => handleRowClick(order.id)}
              style={{ cursor: "pointer" }}
            >
              <div>{order.id}</div>
              <div>{order.name}</div>
              <div>{order.orderType}</div>
              <div>{order.date}</div>
              <div>{order.address}</div>
              <div>{order.value.toLocaleString()} VND</div>
              <div>{order.paymentStatus}</div>
              <div>{order.orderStatus}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
