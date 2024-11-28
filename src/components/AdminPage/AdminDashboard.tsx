import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// Fetch orders from the backend
const fetchOrders = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<
    {
      orderId: number;
      status: string;
      userId: number;
      serviceId: number;
      totalCost: number;
      paymentStatus: string;
      address: string;
      telephone: string;
      createdAt: string;
    }[]
  >([]);
  const [overview, setOverview] = useState({
    todayOrder: 0,
    pendingOrder: 0,
    ongoingOrder: 0,
    totalOrder: 0,
  });

  useEffect(() => {
    // Fetch orders and update overview data
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
        console.log(data);

        // Calculate order counts based on statuses
        const todayCount = data.filter(
          (order: {
            orderId: number;
            status: string;
            userId: number;
            serviceId: number;
            totalCost: number;
            paymentStatus: string;
            address: string;
            telephone: string;
            createdAt: string;
          }) => {
            const orderDate = new Date(order.createdAt);
            console.log(orderDate);
            return orderDate.toDateString() === new Date().toDateString();
          }
        ).length;

        const pendingCount = data.filter(
          (order: {
            orderId: number;
            status: string;
            userId: number;
            serviceId: number;
            totalCost: number;
            paymentStatus: string;
            address: string;
            telephone: string;
            createdAt: string;
          }) => order.status === "Pending"
        ).length;

        const ongoingCount = data.filter(
          (order: {
            orderId: number;
            status: string;
            userId: number;
            serviceId: number;
            totalCost: number;
            paymentStatus: string;
            address: string;
            telephone: string;
            createdAt: string;
          }) => order.status === "Ongoing"
        ).length;

        setOverview({
          todayOrder: todayCount,
          pendingOrder: pendingCount,
          ongoingOrder: ongoingCount,
          totalOrder: data.length,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, []);

  const handleCardClick = (status: string) => {
    navigate(`/my-orders?status=${status}`);
  };

  return (
    <div className="admin-dashboard-container">
      {/* Overview Section */}
      <div className="overview-section">
        <h1>Admin Dashboard</h1>
        <h2>Overview</h2>
        <div className="overview-cards">
          <div
            className="overview-card"
            onClick={() => handleCardClick("Today")}
          >
            <h3>Today Order</h3>
            <p>{overview.todayOrder}</p>
          </div>
          <div
            className="overview-card"
            onClick={() => handleCardClick("Pending")}
          >
            <h3>Pending Order</h3>
            <p>{overview.pendingOrder}</p>
          </div>
          <div
            className="overview-card"
            onClick={() => handleCardClick("Ongoing")}
          >
            <h3>Ongoing Order</h3>
            <p>{overview.ongoingOrder}</p>
          </div>
          <div className="overview-card">
            <h3>Total Order</h3>
            <p>{overview.totalOrder}</p>
          </div>
        </div>
      </div>

      {/* Client Table Section */}
      <div className="client-section">
        <h2>Orders</h2>
        <div className="client-table">
          <div className="table-header">
            <div>ID</div>
            <div>User ID</div>
            <div>Service ID</div>
            <div>Date</div>
            <div>Address</div>
            <div>Value</div>
            <div>Payment Status</div>
            <div>Order Status</div>
          </div>
          {orders.map((order, index) => (
            <div key={index} className="table-row">
              <div>{order.orderId}</div>
              <div>{order.userId}</div>
              <div>{order.serviceId}</div>
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

export default AdminDashboard;
