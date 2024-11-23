import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const CheckoutBuild: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderDate, setOrderDate] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        console.error("No userId or token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/auth/user/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error("Failed to fetch user info:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();

    const savedOrderData = sessionStorage.getItem("buildData");
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    }

    // Set order date to current date in DD/MM/YYYY format
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    setOrderDate(formattedDate);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo: any) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handleProceed = async () => {
    if (!orderData || !userInfo) {
      alert("Order data or user information is missing.");
      return;
    }

    const orderPayload = {
      userId: userInfo.id,
      serviceId: 2, // Assuming serviceId for build service
      totalCost: orderData.total,
      status: "Pending",
      paymentStatus: "Pending",
    };

    try {
      const response = await fetch("http://localhost:3000/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await response.json();
      alert("Order created successfully!");

      // Save order details to the database
      const orderDetailPayload = {
        orderId: createdOrder.orderId,
        fieldName: "Keyboard Kit",
        fieldValue: orderData.keyboardKitName,
      };

      await fetch("http://localhost:3000/order-details/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetailPayload),
      });

      // Additional fields to save
      const additionalDetails = [
        { fieldName: "Switches", fieldValue: orderData.switchesName },
        { fieldName: "With Switches", fieldValue: orderData.withSwitches },
        { fieldName: "Layout", fieldValue: orderData.layout },
        { fieldName: "Stabilizer Name", fieldValue: orderData.stabilizerName },
        { fieldName: "Switch Quantity", fieldValue: orderData.switchQuantity },
        { fieldName: "Plate Choice", fieldValue: orderData.plateChoice },
        { fieldName: "Desoldering", fieldValue: orderData.desoldering },
        { fieldName: "Are You Providing Keycap?", fieldValue: orderData.providingKeycap },
        { fieldName: "Assembly", fieldValue: orderData.assembly },
        { fieldName: "Additional Notes", fieldValue: orderData.additionalNotes },
      ];

      for (const detail of additionalDetails) {
        const detailPayload = {
          orderId: createdOrder.orderId,
          fieldName: detail.fieldName,
          fieldValue: detail.fieldValue,
        };

        await fetch("http://localhost:3000/order-details/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detailPayload),
        });
      }

      sessionStorage.clear();
      navigate("/service/checkout-success"); // Navigate to a success page or similar
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout - Build Service</h1>

      {/* Editable Customer Information */}
      <div className="customer-info">
        <h3>Customer Information</h3>
        {userInfo ? (
          <>
            <div className="form-group">
              <label>Customer</label>
              <input
                type="text"
                name="customer"
                className="input-field"
                value={`${userInfo.firstName} ${userInfo.lastName}`}
                onChange={handleInputChange}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="input-field"
                value={userInfo.email}
                onChange={handleInputChange}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                className="input-field"
                value={userInfo.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="input-field"
                value={userInfo.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Order Date</label>
              <input
                type="text"
                name="orderDate"
                className="input-field"
                value={orderDate}
                readOnly
              />
            </div>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>

      <hr />

      {/* Non-editable Order Details */}
      <div className="order-details">
        <div className="form-group">
          <label>Keyboard Kit Name</label>
          <span>{orderData?.keyboardKitName}</span>
        </div>

        <div className="form-group">
          <label>Switches</label>
          <span>{orderData?.switchesName}</span>
        </div>

        <div className="form-group">
          <label>Layout</label>
          <span>{orderData?.layout}</span>
        </div>

        <div className="form-group">
          <label>With Switches</label>
          <span>{orderData?.withSwitches}</span>
        </div>

        <div className="form-group">
          <label>Stabilizer Name</label>
          <span>{orderData?.stabilizerName}</span>
        </div>

        <div className="form-group">
          <label>Switch Quantity</label>
          <span>{orderData?.switchQuantity}</span>
        </div>

        <div className="form-group">
          <label>Plate Choice</label>
          <span>{orderData?.plateChoice}</span>
        </div>

        <div className="form-group">
          <label>Desoldering</label>
          <span>{orderData?.desoldering}</span>
        </div>

        <div className="form-group">
          <label>Are You Providing Keycap?</label>
          <span>{orderData?.providingKeycap}</span>
        </div>

        <div className="form-group">
          <label>Assembly</label>
          <span>{orderData?.assembly}</span>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <span>{orderData?.additionalNotes}</span>
        </div>
      </div>

      <hr />

      {/* Total Section */}
      <div className="checkout-total-section">
        <h2>TOTAL</h2>
        <p>{orderData?.total.toLocaleString()} VND</p>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button
          type="button"
          className="return-button"
          onClick={() => navigate("/service/build")}
        >
          Return
        </button>
        <button
          type="button"
          className="proceed-button"
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CheckoutBuild;
