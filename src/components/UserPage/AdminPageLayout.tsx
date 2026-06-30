// Admin dashboard layout: side nav + nested admin routes.
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import type { SidePanelLink } from "./SidePanel";
import AdminDashboard from "./AdminDashboard";
import AdminOrder from "./AdminOrder";
import OrderDetail from "./AdminOrderDetail";
import AdminUserList from "./AdminUserList";
import UserDetail from "./AdminUserDetail";

const ADMIN_LINKS: SidePanelLink[] = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/orders", label: "Orders Management" },
  { to: "/admin/user-list", label: "Users Management" },
  { to: "/admin/new-password", label: "Change Password" },
];

const AdminPageLayout: React.FC = () => {
  return (
    <DashboardLayout links={ADMIN_LINKS}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrder />} />
        <Route
          path="orders/order-detail/:orderId"
          element={<OrderDetail />}
        />
        <Route path="user-list" element={<AdminUserList />} />
        <Route path="user-list/user-detail/:userId" element={<UserDetail />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminPageLayout;
