import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderDate, setOrderDate] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in localStorage");
        return;
      }

      const token = localStorage.getItem("token");
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
          setPhone(data.phoneNumber || "");
          setAddress(data.address || "");
        } else {
          console.error("Failed to fetch user info:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();

    const savedOrderData = sessionStorage.getItem("switchModdingData");
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    }

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    setOrderDate(formattedDate);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "phone") {
      setPhone(value);
    } else if (name === "address") {
      setAddress(value);
    } else {
      setUserInfo((prevUserInfo: any) => ({
        ...prevUserInfo,
        [name]: value,
      }));
    }
  };

  const handleProceed = async () => {
    if (!orderData || !userInfo) {
      alert("Order data or user information is missing.");
      return;
    }

    const orderPayload = {
      userId: userInfo.id,
      serviceId: 1,
      totalCost: orderData.total,
      status: "Pending",
      paymentStatus: "Pending",
      address: address,
      telephone: phone,
    };

    console.log("Order Payload:", orderPayload);

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
      console.log("Created Order:", createdOrder);
      alert("Order created successfully!");

      const orderDetailPayload = {
        orderId: createdOrder.orderId,
        fieldName: "Switches",
        fieldValue: orderData.switchName,
      };

      const detailResponse = await fetch("http://localhost:3000/order-details/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetailPayload),
      });

      if (!detailResponse.ok) {
        throw new Error("Failed to save order details");
      }

      const additionalDetails = [
        { fieldName: "Amount", fieldValue: orderData.amount.toString() },
        { 
          fieldName: "Switch Modding Preference", 
          fieldValue: Object.keys(orderData.moddingPreferences).filter(key => orderData.moddingPreferences[key]).length > 0
            ? Object.keys(orderData.moddingPreferences).filter(key => orderData.moddingPreferences[key]).join(", ") 
            : null
        },
        { fieldName: "My Spring Preference", fieldValue: orderData.springPreference },
        { fieldName: "Additional Notes", fieldValue: orderData.additionalNotes },
      ];

      for (const detail of additionalDetails) {
        const detailPayload = {
          orderId: createdOrder.orderId,
          fieldName: detail.fieldName,
          fieldValue: detail.fieldValue,
        };

        const detailResponse = await fetch("http://localhost:3000/order-details/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detailPayload),
        });

        if (!detailResponse.ok) {
          throw new Error(`Failed to save ${detail.fieldName}`);
        }
      }

      sessionStorage.clear();

      navigate("/service/switch-modding");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

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
                value={phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="input-field"
                value={address}
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

      <div className="order-details">
        <div className="form-group">
          <label>Switches</label>
          <p>{orderData ? orderData.switchName : "Loading..."}</p>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <p>{orderData ? orderData.amount : "Loading..."}</p>
        </div>

        <div className="form-group">
          <label>Switch Modding Preference</label>
          <p>{orderData ? Object.keys(orderData.moddingPreferences).filter(key => orderData.moddingPreferences[key]).join(", ") : "Loading..."}</p>
        </div>

        <div className="form-group">
          <label>My Spring Preference</label>
          <p>{orderData ? orderData.springPreference : "Loading..."}</p>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <p>{orderData ? orderData.additionalNotes : "Loading..."}</p>
        </div>
      </div>

      <hr />

      <div className="checkout-total-section">
        <h2>TOTAL</h2>
        <p>{orderData ? orderData.total.toLocaleString() : "Loading..."} VND</p>
      </div>

      <div className="button-group">
        <button
          type="button"
          className="return-button"
          onClick={() => navigate("/service/switch-modding")}
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

export default Checkout;

