// Dashboard side navigation, driven by a list of links.
import React from "react";
import { NavLink } from "react-router-dom";
import "./AllSidePanel.css";

export interface SidePanelLink {
  to: string;
  label: string;
}

interface SidePanelProps {
  links: SidePanelLink[];
}

const SidePanel: React.FC<SidePanelProps> = ({ links }) => {
  return (
    <div className="side-panel">
      <nav>
        <ul className="nav-list">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidePanel;
