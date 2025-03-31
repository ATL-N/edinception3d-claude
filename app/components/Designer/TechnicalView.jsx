// components/Designer/TechnicalView.js
"use client";

import { useState } from "react";
import ModelViewer from "./ModelViewer";

export default function TechnicalView({
  activeView,
  setActiveView,
  garmentType,
  garmentColor,
  garmentOptions,
  modelConfig = { color: "#AE3E49" },
}) {
  const views = [
    { id: "technical", label: "TECHNICAL SKETCH" },
    { id: "3d", label: "3D VIEW", badge: "BETA" },
    { id: "pattern", label: "FLAT PATTERN" },
  ];

  const technicalViewOptions = [
    { id: "both", label: "BOTH" },
    { id: "front", label: "FRONT" },
    { id: "back", label: "BACK" },
  ];

  const [activeTechnicalView, setActiveTechnicalView] = useState("both");

  const renderViewContent = () => {
    switch (activeView) {
      case "technical":
        return (
          <div className="view-content">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <svg width="150" height="250" viewBox="0 0 150 250">
                  <path
                    d="M75,20 C50,20 40,40 40,80 L40,200 C40,220 50,230 75,230 C100,230 110,220 110,200 L110,80 C110,40 100,20 75,20"
                    fill={garmentColor}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <path
                    d="M75,20 C65,20 60,25 60,35 L90,35 C90,25 85,20 75,20"
                    fill={garmentColor}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <path
                    d="M60,35 L40,90 L40,80 C40,50 50,35 60,35"
                    fill={garmentColor}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <path
                    d="M90,35 L110,90 L110,80 C110,50 100,35 90,35"
                    fill={garmentColor}
                    stroke="#000"
                    strokeWidth="2"
                  />
                </svg>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "var(--color-text-light)",
                  }}
                >
                  FRONT
                </div>
              </div>

              {(activeTechnicalView === "both" ||
                activeTechnicalView === "back") && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginLeft: "40px",
                  }}
                >
                  <svg width="100" height="150" viewBox="0 0 100 150">
                    <path
                      d="M50,10 C35,10 30,20 30,50 L30,120 C30,140 35,140 50,140 C65,140 70,140 70,120 L70,50 C70,20 65,10 50,10"
                      fill={garmentColor}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <path
                      d="M50,10 C45,10 43,13 43,18 L57,18 C57,13 55,10 50,10"
                      fill={garmentColor}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <path
                      d="M43,18 L30,50 L30,50 C30,30 40,18 43,18"
                      fill={garmentColor}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <path
                      d="M57,18 L70,50 L70,50 C70,30 60,18 57,18"
                      fill={garmentColor}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </svg>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "var(--color-text-light)",
                    }}
                  >
                    BACK
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "3d":
        return (
          <div className="view-content model-viewer">
            <ModelViewer />
            {/* <img src="/api/placeholder/400/600" alt="3D Model" /> */}
          </div>
        );
      case "pattern":
        return (
          <div className="view-content">
            <div className="pattern-grid" style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <svg width="600" height="400" viewBox="0 0 600 400">
                  <path
                    d="M100,50 L300,50 L500,50 L500,350 L300,350 L100,350 Z"
                    fill="none"
                    stroke="#e63f3f"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M100,50 L300,20 L500,50 L500,350 L300,380 L100,350 Z"
                    fill="none"
                    stroke="#e63f3f"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="view-area">
      <div className="view-tabs">
        {views.map((view) => (
          <div
            key={view.id}
            className={`view-tab ${activeView === view.id ? "active" : ""}`}
            onClick={() => setActiveView(view.id)}
          >
            {view.label}
            {view.badge && (
              <span
                style={{
                  marginLeft: "5px",
                  fontSize: "10px",
                  background: "#ff80ab",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  color: "white",
                }}
              >
                {view.badge}
              </span>
            )}
          </div>
        ))}
        <div style={{ flex: 1 }}></div>
        {activeView === "technical" && (
          <div style={{ display: "flex" }}>
            {technicalViewOptions.map((option) => (
              <div
                key={option.id}
                className={`view-tab ${
                  activeTechnicalView === option.id ? "active" : ""
                }`}
                onClick={() => setActiveTechnicalView(option.id)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {renderViewContent()}
    </div>
  );
}
