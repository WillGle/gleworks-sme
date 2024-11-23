import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);

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
      userId: userInfo.id, // Assuming userInfo contains the user's ID
      serviceId: 1, // Assuming you have this in orderData
      totalCost: orderData.total, // Total cost from orderData
      status: "Pending", // Default status
      paymentStatus: "Pending", // Default payment status
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
      console.log("Created Order:", createdOrder);
      alert("Order created successfully!");

      // Save order details to the database
      const orderDetailPayload = {
        orderId: createdOrder.orderId, // Use the orderId from the created order
        fieldName: "Switches",
        fieldValue: orderData.switchName, // Assuming switchName is the name of the switch
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

      // Additional fields to save
      const additionalDetails = [
        { fieldName: "Amount", fieldValue: orderData.amount.toString() }, // Assuming amount is a number
        { 
          fieldName: "Switch Modding Preference", 
          fieldValue: Array.isArray(orderData.moddingPreferences) 
            ? orderData.moddingPreferences.join(", ") 
            : "N/A" // Default value if not an array
        },
        { fieldName: "My Spring Preference", fieldValue: orderData.springPreference },
        { fieldName: "Additional Notes", fieldValue: orderData.additionalNotes },
      ];

      // Save additional details
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

      // Clear session storage
      sessionStorage.clear(); // This will remove all items from session storage

      // Optionally, you can navigate to another page or perform additional actions here
      navigate("/service/switch-modding");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

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
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>

      <hr />

      {/* Non-editable Order Details */}
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

      {/* Total Section */}
      <div className="checkout-total-section">
        <h2>TOTAL</h2>
        <p>{orderData ? orderData.total.toLocaleString() : "Loading..."} VND</p>
      </div>

      {/* Buttons */}
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

