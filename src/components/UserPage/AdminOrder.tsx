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
  const [orders, setOrders] = useState<Order[]>([]); // State để lưu trữ tất cả đơn hàng
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const navigate = useNavigate(); // Use navigate for routing

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
        const data: Order[] = await response.json();
        // console.log(data); // Kiểm tra cấu trúc dữ liệu trả về
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
        setOrders(transformedOrders); // Cập nhật state với dữ liệu nhận được
        setFilteredOrders(transformedOrders); // Cập nhật filteredOrders với dữ liệu ban đầu
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []); // Chạy một lần khi component mount

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter(
      // Sử dụng orders thay vì filteredOrders
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
    setFilteredOrders(orders.filter((order) => order.paymentStatus === status));
  };

  const handleFilterByOrderStatus = (status: string) => {
    setFilteredOrders(orders.filter((order) => order.status === status));
  };

  const handleRowClick = (orderId: string) => {
    navigate(`order-detail/${orderId}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredOrders(orders);
  };

  if (!orders.length) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>My Orders</h1>

      <div className="search-container">
        <h3>Search: </h3>
        <input
          type="text"
          placeholder="Search by user info"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button className="reset-filter-btn" onClick={handleReset}>
          Reset
        </button>{" "}
      </div>

      <div className="filter-container">
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
            <div>Order</div>
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
              <div>
                {order.user
                  ? `${order.user.lastName} ${order.user.firstName}`
                  : "N/A"}
              </div>{" "}
              {/* Kiểm tra user trước khi truy cập */}
              <div>{order.service ? order.service.name : "N/A"}</div>{" "}
              {/* Kiểm tra service trước khi truy cập */}
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
