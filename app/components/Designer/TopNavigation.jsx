// components/Designer/TopNavigation.js
"use client";

import { useTheme } from "../../contexts/ThemeContext";

export default function TopNavigation({ toggleTheme }) {
  return (
    <div className="top-navigation">
      <div className="logo">tailornova</div>
      <span style={{ color: "#999", marginLeft: "8px" }}>{">"}</span>
      <span style={{ color: "#999", marginLeft: "8px" }}>UNTITLED DESIGN</span>
      <div style={{ flex: 1 }}></div>
      <div className="nav-actions">
        <button className="nav-button">
          <span className="material-icons">folder</span>
          DESIGN
        </button>
        <button className="nav-button">
          <span className="material-icons">undo</span>
          UNDO
        </button>
        <button className="nav-button">
          <span className="material-icons">redo</span>
          REDO
        </button>
        <button className="nav-button">
          <span className="material-icons">straighten</span>
          SPECS
        </button>
        <button className="nav-button">
          <span className="material-icons">pan_tool</span>
          EASE
        </button>
        <button className="nav-button">
          <span className="material-icons">content_cut</span>
          SEWING
        </button>
        <button className="nav-button">
          <span className="material-icons">calculate</span>
          YARDAGE
        </button>
        <button className="nav-button">
          <span className="material-icons">help_outline</span>
          HELP
        </button>
        <button className="nav-button">
          <span className="material-icons">file_download</span>
          DOWNLOAD
        </button>
        <button className="button-primary">CUSTOMIZE FIT</button>
        <button onClick={toggleTheme} className="nav-button">
          <span className="material-icons">
            {useTheme().theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>
      </div>
    </div>
  );
}
