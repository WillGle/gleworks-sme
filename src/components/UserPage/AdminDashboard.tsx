// Admin dashboard summary fed by the normalized orders API.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listOrders } from "@api";
import type { OrderSummary } from "@api/types";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [overview, setOverview] = useState({
    todayOrder: 0,
    pendingOrder: 0,
    ongoingOrder: 0,
    totalOrder: 0,
  });

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await listOrders();
        setOrders(data);

        const todayCount = data.filter(
          (order) =>
            new Date(order.createdAt).toDateString() ===
            new Date().toDateString()
        ).length;

        const pendingCount = data.filter(
          (order) => order.status === "Pending"
        ).length;

        const ongoingCount = data.filter(
          (order) => order.status === "Ongoing"
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

    void getOrders();
  }, []);

  const handleCardClick = (status: string) => {
    navigate(`/admin/my-orders?status=${status}`);
  };

  return (
    <div className="admin-dashboard-container">
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
              <div>{order.orderId || order.id || "N/A"}</div>
              <div>{order.userId || "N/A"}</div>
              <div>{order.serviceId || "N/A"}</div>
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
