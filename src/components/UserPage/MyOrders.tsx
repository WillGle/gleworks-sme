import React, { useEffect, useState } from "react";
import "./MyOrders.css";
import OrderDetail from "./OrderDetail";

interface Service {
  name: string;
  description: string;
}

interface Order {
  createdAt: string; // Ngày tạo đơn hàng
  totalCost: number; // Tổng giá trị đơn hàng
  paymentStatus: string; // Trạng thái thanh toán
  status: string; // Trạng thái đơn hàng
  address: string; // Địa chỉ
  telephone: string; // Số điện thoại
  Service?: Service; // Thông tin dịch vụ
}

const MyOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = userData.token;
      const userId = userData.id;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        // console.log(data);

        // Map API data to fit frontend structure
        const transformedOrders = data.map((order: any) => ({
          ...order,
          createdAt: order.createdAt || order.created_at,
          totalCost: order.totalCost || order.total_cost,
          paymentStatus: order.paymentStatus || order.payment_status,
          status: order.status || order.order_status,
          address: order.address || order.address, // Đảm bảo lấy địa chỉ từ order
          telephone: order.telephone || order.telephone, // Lấy số điện thoại nếu cần
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle click to open order details
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  // Close popup
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
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order, index) => (
            <div
              className="table-row"
              key={index}
              onClick={() => handleOrderClick(order)}
            >
              <div>{order.Service?.name || "N/A"}</div>
              <div>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                {order.address || "N/A"}
              </div>
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
            order: selectedOrder.Service?.name || "N/A",
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
