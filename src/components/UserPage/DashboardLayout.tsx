// Shared dashboard shell: a side-nav panel beside a scrollable content area.
import React from "react";
import SidePanel, { type SidePanelLink } from "./SidePanel";
import "./DashboardLayout.css";

interface DashboardLayoutProps {
  links: SidePanelLink[];
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  links,
  children,
}) => {
  return (
    <div className="dashboard-layout">
      <SidePanel links={links} />
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default DashboardLayout;
