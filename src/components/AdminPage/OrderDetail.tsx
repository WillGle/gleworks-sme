import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetail.css";

const paymentStatusOptions = ["Paid", "Pending", "Canceled"];
const orderStatusOptions = [
  "Finished",
  "Ongoing",
  "Pending",
  "Paused",
  "Canceled",
];

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderData, setOrderData] = useState<any>(null);

  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error("Order ID is undefined");
        return; // Ngừng thực hiện nếu orderId không hợp lệ
      }
      try {
        const response = await fetch(`http://localhost:3000/order-details/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        console.log("Fetched Order Data:", data);
        setOrderData(data);
        console.log("Order Data State:", orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handlers for updating the dropdown values
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  console.log("Current Order Data:", orderData);

  return (
    <div className="order-detail-container">
      {/* Status Selection */}
      <div className="status-section">
        <h1>My Orders - Detail</h1>
        <div className="admin-status-selection">
          <div className="status-form-group">
            <label>Order Status</label>
            <select
              name="orderStatus"
              value={orderData[0].Order?.status || ''}
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
              value={orderData[0]?.Order?.paymentStatus || ''}
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
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-info">
        <div className="order-form-group">
          <label>Order ID</label>
          <p>{orderData[0]?.orderId || 'N/A'}</p>
        </div>
        <div className="order-form-group">
          <label>Customer</label>
          <p>{`${orderData[0]?.Order?.User?.firstName || 'N/A'} ${orderData[0]?.Order?.User?.lastName || 'N/A'}`}</p>
        </div>
        <div className="order-form-group">
          <label>Mail</label>
          <p>{orderData[0]?.Order?.User?.email || 'N/A'}</p>
        </div>
        <div className="order-form-group">
          <label>Tel</label>
          <p>{orderData[0]?.Order?.telephone || 'N/A'}</p>
        </div>
        <div className="order-form-group">
          <label>Address</label>
          <p>{orderData[0]?.Order?.address || 'N/A'}</p>
        </div>
        <div className="order-form-group">
          <label>Order Date</label>
          <p>
            {orderData[0]?.Order?.createdAt 
              ? new Date(orderData[0].Order.createdAt).toLocaleDateString() 
              : 'N/A'}
          </p>
        </div>
      </div>

      <hr />

      {/* Order Information */}
      <div className="order-info">
        {Array.isArray(orderData) && orderData.map((field: { id: string; fieldName: string; fieldValue: string }) => (
          <div className="order-form-group" key={field.id}>
            <label>{field.fieldName}</label>
            <p>{field.fieldValue || 'N/A'}</p>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="admin-order-total-section">
        <h2>Total</h2>
        <p>{orderData[0]?.Order?.totalCost ? `${orderData[0].Order.totalCost.toLocaleString()} VND` : "N/A"}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
