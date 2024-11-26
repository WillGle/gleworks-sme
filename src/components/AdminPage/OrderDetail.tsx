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
        // Lưu dữ liệu vào sessionStorage
        sessionStorage.setItem(`order_${orderId}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    // Kiểm tra sessionStorage để lấy dữ liệu đã lưu
    const savedOrderData = sessionStorage.getItem(`order_${orderId}`);
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Handlers for updating the dropdown values
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setOrderData((prev: any) => {
      const updatedOrderData = prev.map((item: any, index: number) => {
        if (index === 0) {
          return {
            ...item,
            Order: {
              ...item.Order,
              [name]: value, // Cập nhật trường status hoặc paymentStatus
            },
          };
        }
        return item; // Giữ nguyên các phần tử khác
      });
  
      // Lưu vào sessionStorage
      sessionStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrderData));
      return updatedOrderData;
    });
  };
  

  const handleSubmit = async () => {
    if (!orderData) return;

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: orderData[0].Order.status,
          paymentStatus: orderData[0].Order.paymentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      console.log("Updated Order:", updatedOrder);
      // Cập nhật lại orderData với dữ liệu mới
      setOrderData((prev: any) => {
        const newOrderData = [...prev];
        newOrderData[0] = {
          ...newOrderData[0],
          Order: {
            ...newOrderData[0].Order,
            status: updatedOrder.status, // Cập nhật trạng thái
            paymentStatus: updatedOrder.paymentStatus, // Cập nhật trạng thái thanh toán
          },
        };
        return newOrderData;
      });

      // Xóa dữ liệu trong sessionStorage
      sessionStorage.removeItem(`order_${orderId}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
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
              name="status" // Đặt tên cho trường status
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
              name="paymentStatus" // Đặt tên cho trường paymentStatus
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
            <button type="button" className="submit-btn" onClick={handleSubmit}>
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
