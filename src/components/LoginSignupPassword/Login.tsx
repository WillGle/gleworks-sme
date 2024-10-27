import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Axios from "axios"; // Import Axios for HTTP requests

// API URL imported from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

const Login: React.FC = () => {
  // State variables to manage form fields and errors
  const [email, setEmail] = useState<string>(""); // State to store email
  const [password, setPassword] = useState<string>(""); // State to store password
  const [emailError, setEmailError] = useState<string>(""); // State to store email validation error
  const [loginError, setLoginError] = useState<string>(""); // State to store login error
  const navigate = useNavigate(); // Hook to navigate between pages

  // Function to validate email input
  const validateEmail = (email: string) => {
    // Regular expression for validating an email address
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address"); // Set error if email is invalid
    } else {
      setEmailError(""); // Clear error if email is valid
    }
  };

  // Function to handle login action
  const handleLogin = async () => {
    // Validate form inputs before making a request
    if (emailError || !email || !password) {
      setLoginError("Please fill in all fields correctly.");
      return;
    }

    try {
      // Send a POST request to the server to log in the user
      const response = await Axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      });

      // Handle successful login
      console.log("Login successful:", response.data);
      // Redirect user to landing page after successful login
      navigate("/landingpage");
    } catch (error) {
      // Handle login error and set error message
      console.error("Login error:", error);
      setLoginError("Invalid email or password.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>

      {/* Input fields for email and password */}
      <div className="inputs">
        {/* Email input */}
        <div className="input-container">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value); // Validate email as user types
            }}
            placeholder="Email"
          />
          {emailError && <span className="error-message">{emailError}</span>}{" "}
          {/* Display email validation error */}
        </div>

        {/* Password input */}
        <div className="input-container">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
      </div>

      {/* Display login error messages if present */}
      {loginError && <div className="error-message">{loginError}</div>}

      {/* Link to Sign Up page */}

      <div className="toggle-action">
        Don't have an account yet?{" "}
        <span
          onClick={() => navigate("/signup")} // Redirect to Sign Up page
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Click Here
        </span>
      </div>

      {/* Link to Lost Password page */}
      <div className="forgot-password">
        Lost Password?{" "}
        <span
          onClick={() => navigate("/lost-password")} // Redirect to Lost Password page
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Click Here
        </span>
      </div>

      {/* Login button */}
      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          Login
        </div>
      </div>
    </div>
  );
};

export default Login;
