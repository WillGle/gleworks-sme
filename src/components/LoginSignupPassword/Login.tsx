// Login form that stores the returned session before redirecting by role.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setSession } from "@api";
import "./LoginSignUpLostPassNewPass.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email
  const [password, setPassword] = useState<string>(""); // State for password
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message
  const [successMessage] = useState<string>(""); // State for success message
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator
  const navigate = useNavigate(); // Hook to navigate between pages
  // Function to validate email
  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Function to validate the form inputs
  const validateForm = (): boolean => {
    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address.");
      return false;
    }

    return true;
  };

  // Function to handle login action
  const handleLogin = async () => {
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setSession(user);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="style-bg">
      <div className="same-style-container">
        <div className="header">
          <h1>Login</h1>
        </div>
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
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
              Back
            </button>
            <button
              type="button"
              className="confirm-button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="toggle-action">
            <div>
              New here? <span onClick={() => navigate("/signup")}>Sign Up</span>
            </div>
            <div>
              Forgot Password?{" "}
              <span onClick={() => navigate("/lost-password")}>Reset Here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
