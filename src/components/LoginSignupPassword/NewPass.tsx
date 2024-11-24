import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./NewPass.css";

const NewPass: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    const specialCharPattern = /[@$#*!%&]/;
    return password.length >= 8 && specialCharPattern.test(password);
  };

  const handleSubmit = async () => {
    if (isLoading) return;

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

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !user.id) {
      setErrorMessage("User information is missing. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      await Axios.post(`http://localhost:3000/auth/reset-password/${user.id}`, {
        newPassword: password,
      });
      setSuccessMessage("Your password has been updated successfully!");
      setErrorMessage("");
      setTimeout(() => navigate("/home"), 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage(
        "An error occurred while changing the password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("");
      setter(e.target.value);
    };

  return (
    <div className="new-password-container">
      <div className="header">
        <h1>Reset Password</h1>
        <p>Please enter your new password</p>
      </div>
      <div className="form-container">
        <div className="input-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter new password"
            value={password}
            onChange={handleInputChange(setPassword)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword)}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </div>
      {isLoading && <div className="loading-spinner">Loading...</div>}
    </div>
  );
};

export default NewPass;
