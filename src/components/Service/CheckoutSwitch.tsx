import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutSwitch.css";

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

  const handleProceed = () => {
    alert("Order confirmed successfully! Thank you for your purchase.");
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
