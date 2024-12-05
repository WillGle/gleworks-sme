import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios"; // Import Axios for HTTP requests
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./LoginSignUpLostPassNewPass.css";
import { DotLottie } from "@lottiefiles/dotlottie-web"; // Import DotLottie

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const canvasRef = useRef<HTMLCanvasElement>(null); // Thêm ref cho canvas

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage(""); // Clear error message on input change
      setter(e.target.value);
    };

  const validateForm = (): boolean => {
    if (!firstName || !lastName || !dob || !phone || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address.");
      return false;
    }

    if (password.length < 8 || !/[!@#$%^&*%]/.test(password)) {
      setErrorMessage("Password must be at least 8 characters and contain at least 1 special character (@, $, #, *, !, %, &).");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formattedDateOfBirth = dob ? dob.toISOString().split("T")[0] : null;

      await Axios.post(`${apiUrl}/auth/register`, {
        firstName,
        lastName,
        phoneNumber: `+${phone.replace(/^0/, "")}`,
        dateOfBirth: formattedDateOfBirth,
        email,
        password,
      });

      setSuccessMessage(
        "Registration successful! A confirmation email has been sent to your email address."
      );
      setErrorMessage("");
    } catch (error) {
      console.error("An error occurred during registration:", error);
      setErrorMessage(
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to handle loading animation
  useEffect(() => {
    if (isLoading && canvasRef.current) {
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
  }, [isLoading]);

  return (
    <div className="style-bg">
      <div className="same-style-container">
        <div className="header">
          <h1>Sign Up</h1>
        </div>
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your First name"
              value={firstName}
              onChange={handleInputChange(setFirstName)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your Last name"
              value={lastName}
              onChange={handleInputChange(setLastName)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <DatePicker
              id="dateOfBirth"
              selected={dob}
              onChange={(date: Date | null) => setDob(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Your Date of Birth (DD-MM-YYYY)"
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <PhoneInput
              country={"vn"}
              value={phone}
              onChange={setPhone}
              placeholder="Enter your phone number"
              inputClass="input"
              containerClass="phone-input-container"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Email"
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
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handleInputChange(setPassword)}
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <button
            type="button"
            className="confirm-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Sign Up"}
          </button>

          <div className="toggle-action">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in here</span>
          </div>
        </div>

        {/* Hiện hình ảnh loading khi đang gửi yêu cầu */}
        {isLoading && (
          <div
            id="loading"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <canvas
              ref={canvasRef}
              id="dotlottie-canvas"
              style={{ width: "300px", height: "300px" }}
            ></canvas>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
