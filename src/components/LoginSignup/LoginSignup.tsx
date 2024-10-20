import { useState } from "react";
import "./LoginSignup.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import CSS for the phone input library
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for react-datepicker
// --- Backend--- 
import Axios from 'axios'

const LoginSignup: React.FC = () => {
  // --- Backend--- 
  //--API env--
  const apiUrl = import.meta.env.VITE_API_URL;
  //--API env--
  const [action, setAction] = useState<string>("Sign Up");
  // State to manage the phone number input value
  const [firstName, setFirstName] = useState<string>(""); // Store first name state
  const [lastName, setLastName] = useState<string>(""); // Store last name state
  // State to manage the current action (either 'Sign Up' or 'Login')
  const [dob, setDob] = useState<Date | null>(null);
  // State to manage the email input value
  const [phone, setPhone] = useState<string>("");
  // State to manage the selected date of birth
  const [email, setEmail] = useState<string>("");
  // State to manage email error messages
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // Store password state
  const [confirmationMessage, setConfirmationMessage] = useState<string>(""); // State for confirmation message
  
  // --- Backend--- 
  // Function to validate the email format using regex
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };
  
  const register = () => {
    Axios.post(`${apiUrl}/users`, {// Log the URL

      firstName,
      lastName,
      phoneNumber: `+${phone.replace(/^0/, '')}`, // Thêm mã quốc gia
      dateOfBirth: dob ? dob.toISOString().split('T')[0] : null, // Định dạng YYYY-MM-DD
      email,
      password
    })
    .then((response) => {
      console.log(response);
      if (response.data.isConfirmed === 1) {
        setConfirmationMessage("Registration successful! A confirmation email has been sent to your email address. Please check your inbox.");
      } else {
        setConfirmationMessage("A confirmation email has been sent to your email address. Please check your inbox.");
      }
    })
    .catch((error) => {
      console.error("Có lỗi xảy ra trong quá trình đăng ký:", error);

    });
  };

  return (
    <div className="container">
      {/* Header displaying either 'Sign Up' or 'Login' based on the state */}
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign Up" && (
          <>
            {/* First Name Input */}
            <div className="input-container">
              <label htmlFor="firstName" className="input-label">
                First Name
              </label>
              <input
                id="firstName"
                className="input"
                type="text"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name Input */}
            <div className="input-container">
              <label htmlFor="lastName" className="input-label">
                Last Name
              </label>
              <input
                id="lastName"
                className="input"
                type="text"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Date of Birth Input using DatePicker */}
            <div className="input-container">
              <label htmlFor="dateOfBirth" className="input-label">
                Date of Birth
              </label>
              <DatePicker
                id="dateOfBirth"
                className="input"
                selected={dob}
                onChange={(date: Date | null) => setDob(date)} // Update the state with the selected date
                dateFormat="dd/MM/yyyy" // Custom date format
                placeholderText="Select your date of birth" // Placeholder text for DatePicker
              />
            </div>

            {/* Phone Number Input using PhoneInput library */}
            <div className="input-container">
              <label htmlFor="phoneNumber" className="input-label">
                Phone Number
              </label>
              <PhoneInput
                country={"vn"} // Default country set to VN
                value={phone} // Phone number state
                onChange={setPhone} // Update the phone number state on change
                inputClass="phone-input"
                containerClass="phone-input-container"
              />
            </div>
          </>
        )}

        {/* Email Input with validation */}
        <div className="input-container">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            value={email} // Email state
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value); // Validate the email when input changes
            }}
            placeholder="Email"
          />
          {emailError && <span className="error-message">{emailError}</span>}{" "}
          {/* Display error message if email is invalid */}
        </div>

        {/* Password Input */}
        <div className="input-container">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>} {/* Show confirmation message */}

      {/* Toggle Link to switch between 'Sign Up' and 'Login' */}
      <div className="toggle-action">
        {action === "Sign Up" ? (
          <>
            Already have an account?{" "}
            <a href="#" onClick={() => setAction("Login")}>
              Click Here
            </a>
          </>
        ) : (
          <>
            Don't have an account yet?{" "}
            <a href="#" onClick={
                () => { setAction("Sign Up"); 
                        register();}}>
              Click Here
            </a>
          </>
        )}
      </div>

      {/* Forgot password link, visible only during 'Login' */}
      {action === "Login" && (
        <div className="forgot-password">
          Lost Password? <span>Click Here</span>
        </div>
      )}

      {/* Single Action Button for 'Sign Up' or 'Login' */}
      <div className="submit-container">
        <div
           className="submit"
           onClick={() => {
           if (action === "Sign Up") {
              register(); // Call register() when signing up
           } else {
              // Add login functionality here if needed
           }
           }}
        >
           {action}
        </div>
       </div>

    </div>
  );
};

export default LoginSignup;
