import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios"; // Import Axios for HTTP requests
import { DotLottie } from '@lottiefiles/dotlottie-web'; // Import DotLottie

const Signup: React.FC = () => {
  // State variables to manage form fields
  const [firstName, setFirstName] = useState<string>(""); // State for first name
  const [lastName, setLastName] = useState<string>(""); // State for last name
  const [dob, setDob] = useState<Date | null>(null); // State for date of birth
  const [phone, setPhone] = useState<string>(""); // State for phone number
  const [email, setEmail] = useState<string>(""); // State for email
  const [password, setPassword] = useState<string>(""); // State for password
  const [emailError, setEmailError] = useState<string>(""); // State for email validation error
  const [confirmationMessage, setConfirmationMessage] = useState<string>(""); // State for registration confirmation message
  const [loading, setLoading] = useState<boolean>(false); // State cho thanh tải

  const navigate = useNavigate(); // Hook to navigate between pages

  // Get the API URL from environment variables
  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to validate the email address input
  const validateEmail = (email: string) => {
    // Regular expression for validating email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address"); // Set error if email is invalid
    } else {
      setEmailError(""); // Clear error if email is valid
    }
  };

  // Function to handle user registration
  const register = () => {
    setLoading(true); // Hiện thanh tải khi bắt đầu đăng ký
    // Make a POST request to the server using Axios to register a new user
    Axios.post(`${apiUrl}/auth/register`, {
      firstName,
      lastName,
      phoneNumber: `+${phone.replace(/^0/, "")}`, // Format phone number
      dateOfBirth: dob ? dob.toISOString().split("T")[0] : null, // Format date of birth as YYYY-MM-DD
      email,
      password,
    })
      .then((response) => {
        setLoading(false); // Ẩn thanh tải khi hoàn tất
        // Handle successful response
        console.log(response);
        if (response.data.isConfirmed === 1) {
          // If registration is confirmed, show a success message
          setConfirmationMessage(
            "Registration successful! A confirmation email has been sent to your email address. Please check your inbox."
          );
        } else {
          // If registration is pending, show a pending message
          setConfirmationMessage(
            "Your registration is pending confirmation. Please check your email to confirm your account."
          );
        }
      })
      .catch((error) => {
        setLoading(false); // Ẩn thanh tải khi hoàn tất
        // Handle errors during registration
        console.error("An error occurred during registration:", error);
        setConfirmationMessage(
          "An error occurred during registration. Please try again later."
        );
      });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (loading && canvasRef.current) {
      const dotLottie = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: "https://lottie.host/d558d016-47eb-4dee-841d-4c414066909e/neo2e3YEP5.lottie",
        speed: 2.5,
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
          <canvas ref={canvasRef} id="dotlottie-canvas" style={{ width: '500px', height: '500px' }}></canvas>
        </div>
      )}

      {/* Header for the Signup page */}
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      {/* Form fields for signup */}
      <div className="inputs">
        {/* First name input field */}
        <div className="input-container">
          <label htmlFor="firstName" className="input-label">
            First Name
          </label>
          <input
            id="firstName"
            className="input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>

        {/* Last name input field */}
        <div className="input-container">
          <label htmlFor="lastName" className="input-label">
            Last Name
          </label>
          <input
            id="lastName"
            className="input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        {/* Date of birth input field */}
        <div className="input-container">
          <label htmlFor="dateOfBirth" className="input-label">
            Date of Birth
          </label>
          <DatePicker
            id="dateOfBirth"
            className="input"
            selected={dob}
            onChange={(date: Date | null) => setDob(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select your date of birth"
          />
        </div>

        {/* Phone number input field */}
        <div className="input-container">
          <label htmlFor="phoneNumber" className="input-label">
            Phone Number
          </label>
          <PhoneInput
            country={"vn"} // Default country set to Vietnam
            value={phone}
            onChange={setPhone}
            inputClass="phone-input"
            containerClass="phone-input-container"
          />
        </div>

        {/* Email input field */}
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
          {/* Display email validation error if present */}
          {emailError && <span className="error-message">{emailError}</span>}
        </div>

        {/* Password input field */}
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

      {/* Show confirmation message if available */}
      {confirmationMessage && (
        <div className="confirmation-message">{confirmationMessage}</div>
      )}

      {/* Link to navigate to the login page */}
      <div className="toggle-action">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Click Here
        </span>
      </div>

      {/* Button to register new account */}
      <div className="submit-container">
        <div className="submit" onClick={register}>
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default Signup;
