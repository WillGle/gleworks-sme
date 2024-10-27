import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios'; // Import Axios for HTTP requests

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [confirmationMessage, setConfirmationMessage] = useState<string>(""); // State for confirmation message
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL; // Use the API URL from environment variables

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const register = () => {
    Axios.post(`${apiUrl}/users`, {
      firstName,
      lastName,
      phoneNumber: `+${phone.replace(/^0/, '')}`,
      dateOfBirth: dob ? dob.toISOString().split('T')[0] : null,
      email,
      password
    })
    .then((response) => {
      console.log(response);
      if (response.data.isConfirmed === 1) {
        setConfirmationMessage("Registration successful! A confirmation email has been sent to your email address. Please check your inbox.");
      } else {
        setConfirmationMessage("Your registration is pending confirmation. Please check your email to confirm your account.");
      }
    })
    .catch((error) => {
      console.error("An error occurred during registration:", error);
      setConfirmationMessage("An error occurred during registration. Please try again later.");
    });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
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

        <div className="input-container">
          <label htmlFor="phoneNumber" className="input-label">
            Phone Number
          </label>
          <PhoneInput
            country={"vn"}
            value={phone}
            onChange={setPhone}
            inputClass="phone-input"
            containerClass="phone-input-container"
          />
        </div>

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
              validateEmail(e.target.value);
            }}
            placeholder="Email"
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>

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

      {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>} {/* Show confirmation message */}

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

      <div className="submit-container">
        <div className="submit" onClick={register}>
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default Signup;
