import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LostPass.css";

const LostPass: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordReset = () => {
    if (emailError || !email) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    // Giả sử xử lý gửi yêu cầu đặt lại mật khẩu
    setMessage("A password reset link has been sent to your email.");
  };

  return (
    <div className="container">
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
