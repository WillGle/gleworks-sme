import React from "react";
import "./OrderDetail.css";

interface OrderDetailProps {
  order: {
    order: string;
    date: string;
    address: string;
    value: string;
    paymentStatus: string;
    orderStatus: string;
  } | null;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="order-detail-overlay">
      <div className="order-detail-popup">
        <h2>Order Detail</h2>
        <div className="order-detail-content">
          <p>
            <strong>Order:</strong> {order.order}
          </p>
          <p>
            <strong>Date:</strong> {order.date}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Value:</strong> {order.value}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Order Status:</strong> {order.orderStatus}
          </p>
        </div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
