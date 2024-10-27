import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
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
        <div className="submit" onClick={() => {}}>
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default Signup;
