import React, { useState } from "react";
import "./MyOrders.css";
import OrderDetail from "./OrderDetail";

const MyOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      order: "Keyboard build",
      date: "DD/MM/YY",
      address: "ABC Street",
      value: "xxx.xxx VND",
      paymentStatus: "Completed",
      orderStatus: "Finished",
    },
    {
      order: "Switch Modding",
      date: "DD/MM/YY",
      address: "XYZ Street",
      value: "xxx.xxx VND",
      paymentStatus: "Pending",
      orderStatus: "Ongoing",
    },
    {
      order: "Keyboard build",
      date: "DD/MM/YY",
      address: "CBD Street",
      value: "xxx.xxx VND",
      paymentStatus: "Canceled",
      orderStatus: "Canceled",
    },
    {
      order: "Switch Modding",
      date: "DD/MM/YY",
      address: "XYZ Street",
      value: "xxx.xxx VND",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    },
    {
      order: "Keyboard build",
      date: "DD/MM/YY",
      address: "CBD Street",
      value: "xxx.xxx VND",
      paymentStatus: "Canceled",
      orderStatus: "Paused",
    },
  ];

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
            <div>{order.order}</div>
            <div>{order.date}</div>
            <div>{order.address}</div>
            <div>{order.value}</div>
            <div>{order.paymentStatus}</div>
            <div>{order.orderStatus}</div>
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
