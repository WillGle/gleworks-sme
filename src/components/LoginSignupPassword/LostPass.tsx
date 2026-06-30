// Forgot-password form that triggers the reset flow.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@api";
import "./LoginSignUpLostPassNewPass.css";

const LostPass: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string>(""); // State for success messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading status
  const navigate = useNavigate(); // Hook to navigate between pages

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    setErrorMessage(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address.");
      return;
    }

    setIsLoading(true); // Show loading animation

    try {
      const response = await forgotPassword(email);
      setSuccessMessage(response?.message || "Reset link sent successfully!");
    } catch (error) {
      console.error("Error sending reset link:", error);
      setErrorMessage("Failed to send reset password email. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  return (
    <div className="style-bg">
      <div className="same-style-container">
        {/* Loading overlay shown while the request is in flight */}
        {isLoading && (
          <div id="loading">
            <div className="spinner"></div>
          </div>
        )}

        <div className="header">
          <h1>Forgot Password</h1>
          <p>Enter your email address to reset your password</p>
        </div>

        <div className="form-container">
          {/* Email input */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Error message */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Success message */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {/* Reset password button */}
          <button
            type="button"
            className="confirm-button"
            onClick={handlePasswordReset}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
          {/* Navigation links */}
          <div className="toggle-action">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostPass;
