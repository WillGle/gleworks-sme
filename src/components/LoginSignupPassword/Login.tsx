import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios"; // Import Axios for HTTP requests
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading status
  const navigate = useNavigate(); // Hook to navigate between pages
  const apiUrl = import.meta.env.VITE_API_URL;

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Handle login submission
  const handleSubmit = async () => {
    setErrorMessage(""); // Clear previous errors
    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
      const user = response.data;

      // Save user information in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User data saved to localStorage:", user);

      navigate("/home"); // Navigate to the home page after successful login
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-password-container">
      <div className="header">
        <h1>Login</h1>
        <p>Welcome back! Please enter your login details.</p>
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
        {/* Password input */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {/* Links for signup and password recovery */}
        <div className="toggle-action">
          First time?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Create an account now!
          </span>
        </div>
        <div className="toggle-action">
          Forgot Password?{" "}
          <span
            onClick={() => navigate("/lost-password")}
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Click Here
          </span>
        </div>
        {/* Buttons */}
        <div className="button-group">
          <button
            type="button"
            className="confirm-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
