// User order history list backed by normalized order data.
import React, { useEffect, useState } from "react";

import { getStoredUser, getUserId, listUserOrders } from "@api";
import type { OrderSummary } from "@api/types";
import "./MyOrders.css";
import OrderDetail from "./OrderDetail";

const MyOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUserId = getUserId() || getStoredUser()?.id;
      if (!storedUserId) {
        console.error("Missing user ID.");
        return;
      }

      try {
        const data = await listUserOrders(storedUserId);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    void fetchOrders();
  }, []);

  const handleOrderClick = (order: OrderSummary) => {
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
          <div>Order</div>
          <div>Date</div>
          <div>Address</div>
          <div>Value</div>
          <div>Payment Status</div>
          <div>Order Status</div>
        </div>
        {orders
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((order, index) => (
            <div
              className="table-row"
              key={index}
              onClick={() => handleOrderClick(order)}
            >
              <div>{order.serviceName || order.service?.name || "N/A"}</div>
              <div>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>{order.address || "N/A"}</div>
              <div>
                {order.totalCost
                  ? order.totalCost.toLocaleString() + " VND"
                  : "N/A"}
              </div>
              <div>{order.paymentStatus || "N/A"}</div>
              <div>{order.status || "N/A"}</div>
            </div>
          ))}
      </div>
      {selectedOrder && (
        <OrderDetail
          order={{
            order:
              selectedOrder.serviceName || selectedOrder.service?.name || "N/A",
            date: selectedOrder.createdAt
              ? new Date(selectedOrder.createdAt).toLocaleDateString()
              : "N/A",
            address: selectedOrder.address || "N/A",
            value: selectedOrder.totalCost
              ? selectedOrder.totalCost.toLocaleString() + " VND"
              : "N/A",
            paymentStatus: selectedOrder.paymentStatus || "N/A",
            orderStatus: selectedOrder.status || "N/A",
          }}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default MyOrders;
