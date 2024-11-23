import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// Mock API function to simulate fetching orders from the database
const fetchOrders = async () => {
  return [
    {
      id: 1,
      status: "Today",
      orders: "Keyboard Building",
      date: "20-11-2024",
      address: "ABC Street C, Sai Gon, Viet Nam",
      name: "John Doe",
      value: 500000,
      paymentStatus: "Paid",
      orderStatus: "Finished",
    },
    { id: 2, status: "Pending", name: "Jane Smith", value: 200000 },
    { id: 3, status: "Ongoing", name: "Mike Ross", value: 350000 },
    { id: 4, status: "Today", name: "Chris Adams", value: 450000 },
    { id: 5, status: "Pending", name: "Sarah Connor", value: 300000 },
    { id: 6, status: "Ongoing", name: "Kate Winslet", value: 400000 },
  ];
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<
    { id: number; status: string; name: string; value: number }[]
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
      const data = await fetchOrders();
      setOrders(data);

      // Calculate order counts based on statuses
      const todayCount = data.filter(
        (order) => order.status === "Today"
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
          {orders.map((order: any, index) => (
            <div key={index} className="table-row">
              <div>{order.id}</div>
              <div>{order.name}</div>
              <div>{order.orders}</div>
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

export default AdminDashboard;
