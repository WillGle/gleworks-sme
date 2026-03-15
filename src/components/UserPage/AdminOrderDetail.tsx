// Admin order detail view with status editing.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOrderDetails, updateOrderStatus } from "@api";
import type {
  OrderDetailsResponse,
  UpdateOrderStatusPayload,
} from "@api/types";
import "./AdminOrderDetail.css";

const paymentStatusOptions = ["Paid", "Pending", "Canceled"];
const orderStatusOptions = [
  "Finished",
  "Ongoing",
  "Pending",
  "Paused",
  "Canceled",
];

const emptyOrderDetails: OrderDetailsResponse = {
  orderId: "",
  status: "",
  paymentStatus: "",
  totalCost: 0,
  createdAt: "",
  address: "",
  telephone: "",
  user: null,
  fields: [],
};

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderData, setOrderData] = useState<OrderDetailsResponse | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setOrderData(emptyOrderDetails);
        return;
      }

      try {
        const data = await getOrderDetails(orderId);
        setOrderData(data);
        // Reuse the last fetched payload during refreshes on the same order page.
        sessionStorage.setItem(`order_${orderId}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching order details:", error);
        setOrderData(emptyOrderDetails);
      }
    };

    if (!orderId) {
      setOrderData(emptyOrderDetails);
      return;
    }

    const savedOrderData = sessionStorage.getItem(`order_${orderId}`);
    if (savedOrderData) {
      try {
        const parsed = JSON.parse(savedOrderData) as OrderDetailsResponse;
        setOrderData(parsed);
        return;
      } catch (error) {
        console.error("Error parsing saved order data:", error);
      }
    }

    void fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setOrderData((prev) => {
      if (!prev) {
        return prev;
      }

      const updatedOrderData =
        name === "status"
          ? { ...prev, status: value }
          : { ...prev, paymentStatus: value };

      if (orderId) {
        sessionStorage.setItem(
          `order_${orderId}`,
          JSON.stringify(updatedOrderData)
        );
      }

      return updatedOrderData;
    });
  };

  const handleSubmit = async () => {
    if (!orderId || !orderData?.orderId) {
      return;
    }

    try {
      const payload: UpdateOrderStatusPayload = {
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
      };

      const updatedOrder = await updateOrderStatus(orderId, payload);
      setOrderData((prev) =>
        prev
          ? {
              ...prev,
              status: updatedOrder.status,
              paymentStatus: updatedOrder.paymentStatus,
            }
          : prev
      );
      sessionStorage.removeItem(`order_${orderId}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  if (!orderData.orderId) {
    return <div>No order details found.</div>;
  }

  return (
    <div className="order-detail-container">
      <div className="status-section">
        <h1>My Orders - Detail</h1>
        <div className="admin-status-selection">
          <div className="status-form-group">
            <label>Order Status</label>
            <select
              name="status"
              value={orderData.status}
              onChange={handleStatusChange}
            >
              {orderStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="status-form-group">
            <label>Payment Status</label>
            <select
              name="paymentStatus"
              value={orderData.paymentStatus}
              onChange={handleStatusChange}
            >
              {paymentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="button-status-form">
            <button type="button" className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="customer-info">
        <div className="order-form-group">
          <label>Order ID</label>
          <p>{orderData.orderId || "N/A"}</p>
        </div>
        <div className="order-form-group">
          <label>Customer</label>
          <p>{`${orderData.user?.firstName || "N/A"} ${
            orderData.user?.lastName || "N/A"
          }`}</p>
        </div>
        <div className="order-form-group">
          <label>Mail</label>
          <p>{orderData.user?.email || "N/A"}</p>
        </div>
        <div className="order-form-group">
          <label>Tel</label>
          <p>{orderData.telephone || "N/A"}</p>
        </div>
        <div className="order-form-group">
          <label>Address</label>
          <p>{orderData.address || "N/A"}</p>
        </div>
        <div className="order-form-group">
          <label>Order Date</label>
          <p>
            {orderData.createdAt
              ? new Date(orderData.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <hr />

      <div className="order-info">
        {orderData.fields.map((field) => (
          <div className="order-form-group" key={field.id}>
            <label>{field.fieldName}</label>
            <p>{field.fieldValue || "N/A"}</p>
          </div>
        ))}
      </div>

      <div className="admin-order-total-section">
        <h2>Total</h2>
        <p>
          {orderData.totalCost
            ? `${orderData.totalCost.toLocaleString()} VND`
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
