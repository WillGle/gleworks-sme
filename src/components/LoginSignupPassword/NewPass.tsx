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
      setErrorMessage("Vui lòng nhập đầy đủ các trường.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu và Xác nhận mật khẩu không khớp.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 ký tự đặc biệt (@, $, #, *, !, %, &)."
      );
      return;
    }

    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id; // Lấy ID người dùng

    // Gửi yêu cầu đổi mật khẩu đến máy chủ
    try {
      const response = await Axios.post(`http://localhost:3001/auth/reset-password/${userId}`, {
        newPassword: password,
      });
      setSuccessMessage("Mật khẩu của bạn đã được cập nhật thành công!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="new-password-container">
      <div className="header">
        <h1>Đặt Lại Mật Khẩu</h1>
        <p>Vui lòng nhập mật khẩu mới của bạn.</p>
      </div>
      <div className="form-container">
        {/* Password input */}
        <div className="input-group">
          <label htmlFor="password">Mật Khẩu Mới</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Confirm password input */}
        <div className="input-group">
          <label htmlFor="confirm-password">Xác Nhận Mật Khẩu</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Xác nhận mật khẩu mới"
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
            onClick={() => navigate("/login")}
          >
            Hủy
          </button>
          <button
            type="button"
            className="confirm-button"
            onClick={handleSubmit}
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
