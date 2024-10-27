import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/LoginSignupPassword/Login";
import Signup from "./components/LoginSignupPassword/Signup";
import LostPass from "./components/LoginSignupPassword/LostPass";
import ConfirmationSuccess from './components/ConfirmationSuccess';
import AccountConfirmation from './components/AccountConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lost-password" element={<LostPass />} />
        <Route path="/confirmation-success" element={<ConfirmationSuccess />} />
        <Route path="/" element={<AccountConfirmation />} />
        {/* Thêm tuyến đường mặc định để điều hướng tới /login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
