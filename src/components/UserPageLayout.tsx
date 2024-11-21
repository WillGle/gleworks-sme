import React from "react";
import { Routes, Route } from "react-router-dom";
import SidePanel from "./UserPage/UserSidePanel";
import "./UserPageLayout.css";
import MyAccount from "./UserPage/MyAccount";
import MyOrders from "./UserPage/MyOrders";
import Support from "./UserPage/Support";

const UserPageLayout: React.FC = () => {
  return (
    <div className="user-layout">
      {/* Side Panel for Navigation */}
      <SidePanel />

      {/* User Content Section */}
      <div className="user-content">
        <Routes>
          <Route path="my-account" element={<MyAccount />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="support" element={<Support />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserPageLayout;
