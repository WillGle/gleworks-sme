// User dashboard layout: side nav + nested user routes.
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import type { SidePanelLink } from "./SidePanel";
import MyAccount from "./MyAccount";
import MyOrders from "./MyOrders";
import Support from "./Support";

const USER_LINKS: SidePanelLink[] = [
  { to: "/user/my-account", label: "My Account" },
  { to: "/user/my-orders", label: "My Orders" },
  { to: "/user/support", label: "Support" },
  { to: "/user/new-password", label: "Change Password" },
];

const UserPageLayout: React.FC = () => {
  return (
    <DashboardLayout links={USER_LINKS}>
      <Routes>
        <Route index element={<Navigate to="my-account" replace />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </DashboardLayout>
  );
};

export default UserPageLayout;
