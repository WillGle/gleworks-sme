import React, { useState, useEffect } from "react";
import "./MyAccount.css"; // Add your styles

const MyAccount: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    tele: "",
    dob: "",
    address: "",
    city: "",
  });

  // State for success or error messages
  const [message, setMessage] = useState("");

  // Fetch user data on component mount (mocked or API call)
  useEffect(() => {
    // Simulate fetching user data
    const fetchData = async () => {
      const userData = {
        fullName: "Nguyen Chi Cuong",
        email: "ot*******@gmail.com",
        tele: "********23",
        dob: "1990-08-20",
        address: "123 Main St",
        city: "Hanoi",
      };
      setFormData(userData);
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Simulate sending a request to the backend
      console.log("Sending data to the backend:", formData);
      setMessage("Thông tin đã được cập nhật thành công!");
      // Reset the message after a few seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating information:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div className="my-account">
      <h1>Hồ Sơ Của Tôi</h1>
      <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <div className="form-container">
        <div className="form-group">
          <label>Tên đầy đủ</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="tele"
            value={formData.tele}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Thành phố</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} className="submit-btn">
          Xác nhận
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default MyAccount;
