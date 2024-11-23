import React, { useState } from "react";
import "./AdminOrder.css";

const mockOrders = [
  {
    id: "000001",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "350,000 VND",
    paymentStatus: "Pending",
    orderStatus: "Pending",
  },
  {
    id: "000002",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "500,000 VND",
    paymentStatus: "Canceled",
    orderStatus: "Canceled",
  },
  {
    id: "000003",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "450,000 VND",
    paymentStatus: "Paid",
    orderStatus: "Finished",
  },
  {
    id: "000004",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "600,000 VND",
    paymentStatus: "Paid",
    orderStatus: "Ongoing",
  },
  {
    id: "000005",
    orderType: "Keyboard build",
    date: "20/11/2024",
    address: "ABC Street",
    value: "250,000 VND",
    paymentStatus: "Pending",
    orderStatus: "Paused",
  },
];

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  // Filter handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = mockOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
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
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Orders</th>
              <th>Date</th>
              <th>Address</th>
              <th>Value</th>
              <th>Payment Status</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderType}</td>
                <td>{order.date}</td>
                <td>{order.address}</td>
                <td>{order.value}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
