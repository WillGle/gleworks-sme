import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios"; // Import Axios for making API requests
import { DotLottie } from '@lottiefiles/dotlottie-web'; // Import DotLottie
import "./LostPass.css";

const LostPass: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL; // Use the apiUrl variable
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Reference to the canvas
  const [email, setEmail] = useState<string>(""); // Email address input
  const [message, setMessage] = useState<string>(""); // Success message for reset link
  const [emailError, setEmailError] = useState<string>(""); // Error message for invalid email
  const [loading, setLoading] = useState<boolean>(false); // State cho thanh tải
  const navigate = useNavigate(); // Hook to navigate between pages

  // Function to validate the email address input
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordReset = async () => {
    if (emailError || !email) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Hiện thanh tải khi bắt đầu gửi yêu cầu

    try {
      const response = await Axios.post(`${apiUrl}/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error sending reset password email:", error);
      setMessage("Failed to send reset password email. Please try again later.");
    } finally {
      setLoading(false); // Ẩn thanh tải khi hoàn tất
    }
  };

  // Sử dụng useEffect để khởi tạo hoạt ảnh DotLottie
  useEffect(() => {
    if (canvasRef.current) {
      const dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie", // Đường dẫn đến file .lottie
      });

      return () => {
        dotLottie.destroy(); // Dọn dẹp khi component unmount
      };
    }
  }, [loading]);

  return (
    <div className="container">
      {/* Hiện hình ảnh loading khi đang gửi yêu cầu */}
      {loading && (
        <div id="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <canvas id="dotlottie-canvas" ref={canvasRef} style={{ width: '300px', height: '300px' }}></canvas>
        </div>
      )}

      <div className="header">
        <div className="text">Forgot Password</div>
        <div className="underline"></div>
      </div>

      <div className="input-container">
        <label htmlFor="email" className="input-label">
          Enter your email address
        </label>
        <input
          id="email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          placeholder="Email"
        />
        {emailError && (
          <span style={{ color: "red", fontSize: "14px" }}>{emailError}</span>
        )}
      </div>

      <button
        className="submit"
        onClick={handlePasswordReset}
        style={{ marginTop: "20px" }}
      >
        Send Reset Link
      </button>

      {message && (
        <p style={{ color: "green", marginTop: "20px" }}>{message}</p>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <span
          onClick={() => navigate("/login")}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Back to Login
        </span>
      </div>
    </div>
  );
};

export default LostPass;
