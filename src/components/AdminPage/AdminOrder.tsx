import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./AdminOrder.css";

// Định nghĩa interface Service
interface Service {
  id: number;
  name: string;
}

// Định nghĩa interface User
interface User {
  firstName: string;
  lastName: string;
}

// Định nghĩa interface Order
interface Order {
  orderId: string;
  user?: User; // Đối tượng user có thể không tồn tại
  service?: Service; // Đối tượng service có thể không tồn tại
  createdAt: string;
  address: string;
  totalCost: number;
  paymentStatus: string;
  status: string;
}

const AdminOrder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const navigate = useNavigate(); // Use navigate for routing

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/all`);
        const data: Order[] = await response.json();
        console.log(data); // Kiểm tra cấu trúc dữ liệu trả về

        // Ánh xạ dữ liệu để phù hợp với cấu trúc frontend
        const transformedOrders = data.map((order: any) => ({
          ...order,
          createdAt: order.createdAt || order.created_at,
          totalCost: order.totalCost || order.total_cost,
          paymentStatus: order.paymentStatus || order.payment_status,
          status: order.status || order.order_status,
          address: order.address || order.address,
          user: order.User, // Lấy thông tin người dùng từ đối tượng User
          service: order.Service, // Lấy thông tin dịch vụ từ đối tượng Service
        }));

        setFilteredOrders(transformedOrders); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []); // Chạy một lần khi component mount

  // Filter handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = filteredOrders.filter(
      (order) =>
        order.orderId.toString().toLowerCase().includes(term) ||
        (order.user && order.user.firstName.toLowerCase().includes(term)) || // Kiểm tra user trước khi truy cập
        (order.user && order.user.lastName.toLowerCase().includes(term)) || // Kiểm tra user trước khi truy cập
        (order.service && order.service.name.toLowerCase().includes(term)) || // Kiểm tra service trước khi truy cập
        order.address.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  const handleFilterByPaymentStatus = (status: string) => {
    const filtered = filteredOrders.filter(
      (order) => order.paymentStatus === status
    );
    setFilteredOrders(filtered);
  };

  const handleFilterByOrderStatus = (status: string) => {
    const filtered = filteredOrders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  // Navigate to order detail page
  const handleRowClick = (orderId: string) => {
    navigate(`order-detail/${orderId}`); // Pass orderId to the route
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
          <button onClick={() => setFilteredOrders([])}>Reset</button>
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
            <div>Client Name</div>
            <div>Service</div>
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
              onClick={() => handleRowClick(order.orderId)}
              style={{ cursor: "pointer" }}
            >
              <div>{order.orderId}</div>
              <div>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}</div> {/* Kiểm tra user trước khi truy cập */}
              <div>{order.service ? order.service.name : 'N/A'}</div> {/* Kiểm tra service trước khi truy cập */}
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div>{order.address}</div>
              <div>{order.totalCost.toLocaleString()} VND</div>
              <div>{order.paymentStatus}</div>
              <div>{order.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
