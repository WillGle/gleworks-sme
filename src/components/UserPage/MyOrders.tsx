import React, { useEffect, useState } from "react";
import "./MyOrders.css";
import OrderDetail from "./OrderDetail";

interface User {
  address?: string; // Optional address field
  // Add other user fields if necessary
}

interface Order {
  service_type: string;
  created_at: string; // or Date if you are converting it
  total_cost: number;
  paymentStatus?: string;
  order_status: string;
  payment_status: string;
  User?: User; // Include the User property
}

const MyOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData.token; // Assuming the token is stored in the user object
      const userId = userData.id; // Assuming the user ID is stored in the user object

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders?user_id=${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log(data); // Log the data to check the structure
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const closePopup = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      <div className="orders-table">
        <div className="table-header">
          <div>Orders</div>
          <div>Date</div>
          <div>Address</div>
          <div>Value</div>
          <div>Payment Status</div>
          <div>Order Status</div>
        </div>
        {orders.map((order, index) => (
          <div
            className="table-row"
            key={index}
            onClick={() => handleOrderClick(order)}
          >
            <div>{order.service_type || "N/A"}</div>
            <div>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</div>
            <div>{order.User?.address || "N/A"}</div>
            <div>{order.total_cost ? order.total_cost.toLocaleString() + " VND" : "N/A"}</div>
            <div>{order.payment_status || "N/A"}</div>
            <div>{order.order_status || "N/A"}</div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={closePopup} />
      )}
    </div>
  );
};

export default MyOrders;
