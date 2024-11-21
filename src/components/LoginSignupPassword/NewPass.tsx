import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios"; // Import Axios for HTTP requests
import "./NewPass.css";

const NewPass: React.FC = () => {
  const [password, setPassword] = useState<string>(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // State for confirming password
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message
  const [successMessage, setSuccessMessage] = useState<string>(""); // State for success message
  const navigate = useNavigate(); // Hook to navigate between pages

  // Function to validate password
  const validatePassword = (password: string): boolean => {
    const specialCharPattern = /[@$#*!%&]/; // Regex for special characters
    return password.length >= 8 && specialCharPattern.test(password); // Minimum 8 chars and 1 special char
  };

  // Function to handle password submission
  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters and contain at least 1 special character (@, $, #, *, !, %, &)."
      );
      return;
    }

    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id; // Lấy ID người dùng

    // Gửi yêu cầu đổi mật khẩu đến máy chủ
    try {
      await Axios.post(`http://localhost:3001/auth/reset-password/${userId}`, {
        newPassword: password,
      });
      setSuccessMessage("Your password has been updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage(
        "An error occurred while changing the password. Please try again."
      );
    }
  };

  return (
    <div className="new-password-container">
      <div className="header">
        <h1>Reset Password</h1>
        <p>Please enter your new password</p>
      </div>
      <div className="form-container">
        {/* Password input */}
        <div className="input-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Confirm password input */}
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {/* Error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {/* Success message */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {/* Buttons */}
        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/user")}
          >
            Cancle
          </button>
          <button
            type="button"
            className="confirm-button"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
