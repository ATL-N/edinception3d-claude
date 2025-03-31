"use client";

import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import TopNavigation from "../components/Designer/TopNavigation";
import Sidebar from "../components/Designer/Sidebar";
import SizingPanel from "../components/Designer/SizingPanel";
import ModelViewer from "../components/Designer/ModelViewer";

export default function DesignerPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState("technical");
  const [garmentColor, setGarmentColor] = useState("#1a6f99");
  const [garmentOptions, setGarmentOptions] = useState({
    ruffles: "no-ruffles",
    sleeves: "3/4-fitted-sleeves",
    waistline: "no-waist-seam",
    length: "knee-length",
    neckline: "wide-scoop",
  });
  const [showSizingPanel, setShowSizingPanel] = useState(true);
  const [activeTechnicalView, setActiveTechnicalView] = useState("both");
  
  // Comprehensive model selection state
  const [selectedModels, setSelectedModels] = useState({
    skirt: null,
    tshirt: null,
    jacket: null,
    neckline: null,
    backClosure: null,
    ruffles: null,
    color: null,
    fabric: null
  });

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

  const updateGarmentOptions = (options) => {
    setGarmentOptions((prev) => ({ ...prev, ...options }));
  };

  // Mapping sidebar categories to garment types
  const categoryToType = {
    silhouettes: 'skirt',
    sleeves: 'tshirt',
    necklines: 'neckline',
    backClosure: 'backClosure',
    ruffles: 'ruffles',
    color: 'color',
    fabric: 'fabric'
  };

  const handleModelSelect = (selection) => {
    const garmentType = categoryToType[selection.type] || selection.type;

    setSelectedModels((prev) => ({
      ...prev,
      [garmentType]: {
        type: garmentType,
        color: selection.modelDetails.color,
        fit: selection.modelDetails.fit,
        path: selection.modelDetails.modelPath,
        pattern: selection.modelDetails?.pattern,
        isCloth: true, // Enable cloth simulation
        physicsParams: { // Optional custom physics parameters
          mass: 0.5,
          pressure: 2.0,
          stiffness: 0.8
          }},
    }));
  };

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
            </div>
          </div>
        );
      case "3d":
        return (
          <div className="view-content model-viewer">
            <ModelViewer garments={selectedModels} />
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
    <div
      className="designer-container"
      style={{ display: "flex", height: "100vh" }}
    >
      <Sidebar onModelSelect={handleModelSelect} />
      <div
        className="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopNavigation toggleTheme={toggleTheme} />
        <div
          className="design-area"
          style={{
            flex: 1,
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <div className="view-tabs">
              {views.map((view) => (
                <div
                  key={view.id}
                  className={`view-tab ${
                    activeView === view.id ? "active" : ""
                  }`}
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
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "auto",
              }}
            >
              {renderViewContent()}
            </div>
          </div>

          <SizingPanel
            garmentOptions={garmentOptions}
            updateGarmentOptions={updateGarmentOptions}
            isVisible={showSizingPanel}
            setIsVisible={setShowSizingPanel}
          />
        </div>
      </div>
    </div>
  );
}