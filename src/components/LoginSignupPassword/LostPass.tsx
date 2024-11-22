import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios"; // Import Axios for making API requests
import { DotLottie } from "@lottiefiles/dotlottie-web"; // Import DotLottie
import "./LostPass.css";

const LostPass: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL; // Use the API URL from environment variables
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Reference to the canvas
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
      const response = await Axios.post(`${apiUrl}/auth/forgot-password`, {
        email,
      });
      setSuccessMessage(
        response.data.message || "Reset link sent successfully!"
      );
    } catch (error) {
      console.error("Error sending reset link:", error);
      setErrorMessage("Failed to send reset password email. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  // Initialize DotLottie animation
  useEffect(() => {
    if (isLoading && canvasRef.current) {
      const dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie",
      });

      return () => {
        dotLottie.destroy(); // Clean up when component unmounts
      };
    }
  }, [isLoading]);

  return (
    <div className="new-password-container">
      {/* Loading animation */}
      {isLoading && (
        <div id="loading">
          <canvas
            ref={canvasRef}
            style={{ width: "300px", height: "300px" }}
          ></canvas>
        </div>
      )}

      <div className="header">
        <h1>Forgot Password</h1>
        <p>Enter your email address to reset your password</p>
      </div>

      <div className="form-container">
        {/* Email input */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
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
        <div className="button-group">
          <button
            type="button"
            className="confirm-button"
            onClick={handlePasswordReset}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>

        {/* Navigation links */}
        <div className="toggle-action">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in here</span>
        </div>
      </div>
    </div>
  );
};

export default LostPass;
