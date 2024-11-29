import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const CheckoutBuild: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderDate, setOrderDate] = useState<string>("");
  const [showQRCodePopup, setShowQRCodePopup] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        console.error("No userId or token found in localStorage");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/auth/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          setPhone(data.phoneNumber || "");
          setAddress(data.address || "");
          setCity(data.city || "");
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
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}/${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${currentDate.getFullYear()}`;
    setOrderDate(formattedDate);
  }, []);

  useEffect(() => {
    const combinedAddress = `${address}${city ? `, ${city}` : ""}`;
    setFullAddress(combinedAddress);
  }, [address, city]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "phone") {
      setPhone(value);
    } else if (name === "address") {
      setAddress(value);
    } else if (name === "city") {
      setCity(value);
    } else {
      setUserInfo((prevUserInfo: any) => ({
        ...prevUserInfo,
        [name]: value,
      }));
    }
  };

  const handleFullAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFullAddress(value);

    const [newAddress, newCity] = value.split(",").map((part) => part.trim());
    setAddress(newAddress || "");
    setCity(newCity || "");
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
      address: `${address}${city ? `, ${city}` : ""}`,
      telephone: phone,
    };

    // console.log("Order Payload:", orderPayload);

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
      //   console.log("Created Order:", createdOrder);
      alert("Order created successfully!");

      const orderDetailPayload = {
        orderId: createdOrder.orderId,
        fieldName: "Keyboard Kit",
        fieldValue: orderData.keyboardKitName,
      };

      const detailResponse = await fetch(
        "http://localhost:3000/order-details/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetailPayload),
        }
      );

      if (!detailResponse.ok) {
        throw new Error("Failed to save order details");
      }

      const additionalDetails = [
        { fieldName: "Switches", fieldValue: orderData.switchesName },
        { fieldName: "With Switches", fieldValue: orderData.withSwitches },
        { fieldName: "Layout", fieldValue: orderData.layout },
        { fieldName: "Stabilizer Name", fieldValue: orderData.stabilizerName },
        { fieldName: "Switch Quantity", fieldValue: orderData.switchQuantity },
        { fieldName: "Plate Choice", fieldValue: orderData.plateChoice },
        { fieldName: "Desoldering", fieldValue: orderData.desoldering },
        {
          fieldName: "Are You Providing Keycap?",
          fieldValue: orderData.providingKeycap,
        },
        { fieldName: "Assembly", fieldValue: orderData.assembly },
        {
          fieldName: "Additional Notes",
          fieldValue: orderData.additionalNotes,
        },
      ];

      for (const detail of additionalDetails) {
        const detailPayload = {
          orderId: createdOrder.orderId,
          fieldName: detail.fieldName,
          fieldValue: detail.fieldValue,
        };

        const detailResponse = await fetch(
          "http://localhost:3000/order-details/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(detailPayload),
          }
        );

        if (!detailResponse.ok) {
          throw new Error(`Failed to save ${detail.fieldName}`);
        }
      }

      sessionStorage.clear();

      // Show QR Code Popup
      setShowQRCodePopup(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order. Please try again.");
    }
  };

  const handleCloseQRCodePopup = () => {
    alert("Your payment will be processed later.");
    navigate("/user/my-orders");
  };

  return (
    <div className="checkout-container">
      <h1>Checkout - Keyboard Build Service</h1>

      {/* Editable Customer Information */}
      <div className="customer-info">
        <h3>Customer Information</h3>
        {userInfo ? (
          <>
            <div className="checkout-form-group">
              <label>Customer</label>
              <input
                type="text"
                name="customer"
                className="input-field"
                value={`${userInfo.lastName} ${userInfo.firstName}`}
                onChange={handleInputChange}
                readOnly
              />
            </div>

            <div className="checkout-form-group">
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

            <div className="checkout-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                className="input-field"
                value={phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="checkout-form-group">
              <label>Address</label>
              <input
                type="text"
                name="fullAddress"
                className="input-field"
                value={fullAddress}
                onChange={handleFullAddressChange}
              />
            </div>
            <div className="checkout-form-group">
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
        <div className="checkout-form-group">
          <label>Keyboard Kit Name</label>
          <p>{orderData?.keyboardKitName}</p>
        </div>

        <div className="checkout-form-group">
          <label>Switches</label>
          <p>{orderData?.switchesName}</p>
        </div>

        <div className="checkout-form-group">
          <label>Layout</label>
          <p>{orderData?.layout}</p>
        </div>

        <div className="checkout-form-group">
          <label>With Switches</label>
          <p>{orderData?.withSwitches}</p>
        </div>

        <div className="checkout-form-group">
          <label>Stabilizer Name</label>
          <p>{orderData?.stabilizerName}</p>
        </div>

        <div className="checkout-form-group">
          <label>Switch Quantity</label>
          <p>{orderData?.switchQuantity}</p>
        </div>

        <div className="checkout-form-group">
          <label>Plate Choice</label>
          <p>{orderData?.plateChoice}</p>
        </div>

        <div className="checkout-form-group">
          <label>Desoldering</label>
          <p>{orderData?.desoldering}</p>
        </div>

        <div className="checkout-form-group">
          <label>Are You Providing Keycap?</label>
          <p>{orderData?.providingKeycap}</p>
        </div>

        <div className="checkout-form-group">
          <label>Assembly</label>
          <p>{orderData?.assembly}</p>
        </div>

        <div className="checkout-form-group">
          <label>Additional Notes</label>
          <p>{orderData?.additionalNotes}</p>
        </div>
      </div>

      <hr />

      {/* Total Section */}
      <div className="checkout-total-section">
        <h2>TOTAL</h2>
        <p>{orderData?.total.toLocaleString()} VND</p>
      </div>

      {/* Buttons */}
      <div className="checkout-button-group">
        <button
          type="button"
          className="return-button"
          onClick={() => navigate("/service/keyboard-building")}
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

      {/* QR Code Popup */}
      {showQRCodePopup && (
        <div className="qr-popup">
          <div className="qr-popup-content">
            <img
              src="https://i.imgur.com/TRhD6Kv.png"
              alt="QR Code"
              style={{ width: "256px", height: "256px" }}
            />
            <button onClick={handleCloseQRCodePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutBuild;
