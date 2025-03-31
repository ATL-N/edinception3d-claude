// components/Designer/DesignTools.js
"use client";

import { useState } from "react";

export default function DesignTools({
  garmentColor,
  setGarmentColor,
  garmentOptions,
  handleOptionChange,
  isVisible,
  setIsVisible,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(2);

  const ruffleOptions = [
    { id: "no-ruffles", label: "NO RUFFLES" },
    { id: "double-ruffle", label: "DOUBLE RUFFLE" },
    { id: "flounce", label: "FLOUNCE" },
  ];

  const colorOptions = [
    { id: "#1a6f99", label: "Teal Blue" },
    { id: "#e75d8f", label: "Hot Pink" },
    { id: "#333333", label: "Black" },
    { id: "#ffffff", label: "White" },
    { id: "#e63f3f", label: "Red" },
  ];

  const specifications = [
    { id: "woven", label: "WOVEN" },
    { id: "no-waist-seam", label: "NO WAIST SEAM" },
    { id: "knee-length", label: "KNEE LENGTH" },
    { id: "flared", label: "FLARED" },
    { id: "bust-darts", label: "BUST DARTS WAIST DARTS FRONT CENTER" },
    { id: "front-seam", label: "FRONT SEAM" },
    { id: "center-back-seam", label: "CENTER BACK SEAM" },
    { id: "3/4-fitted-sleeves", label: "3/4 FITTED SLEEVES" },
    { id: "wide-scoop", label: "WIDE SCOOP DÉCOLLETÉ" },
  ];

  // If not visible, show just the toggle button
  if (!isVisible) {
    return (
      <div className="tools-panel-collapsed">
        <button
          onClick={() => setIsVisible(true)}
          className="toggle-panel-button"
        >
          {/* Hamburger icon */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            
            <div
              style={{
                width: "20px",
                height: "2px",
                background: "var(--color-text)",
              }}
            ></div>
            <div
              style={{
                width: "20px",
                height: "2px",
                background: "var(--color-text)",
              }}
            ></div>
            <div
              style={{
                width: "20px",
                height: "2px",
                background: "var(--color-text)",
              }}
            ></div>
          </div>
          {/* <span style={{ marginLeft: "8px", fontSize: "14px" }}>
            Design Tools
          </span> */}
        </button>
      </div>
    );
  }

  return (
    <div className="tools-panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
          Design Tools
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
          }}
        >
          {/* X icon */}
          <div style={{ position: "relative", width: "18px", height: "18px" }}>
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "2px",
                background: "var(--color-text)",
                top: "50%",
                transform: "translateY(-50%) rotate(45deg)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "2px",
                background: "var(--color-text)",
                top: "50%",
                transform: "translateY(-50%) rotate(-45deg)",
              }}
            ></div>
          </div>
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "var(--color-text-light)",
          }}
        >
          {results} ITEMS FOUND
        </div>
      </div>

      <div className="option-group">
        <div className="option-title">RUFFLES</div>
        <div className="option-buttons">
          {ruffleOptions.map((option) => (
            <button
              key={option.id}
              className={`option-button ${
                garmentOptions?.ruffles === option.id ? "active" : ""
              }`}
              onClick={() => handleOptionChange("ruffles", option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <div className="option-title">COLOR</div>
        <div className="option-buttons" style={{ display: "flex", gap: "8px" }}>
          {colorOptions.map((color) => (
            <div
              key={color.id}
              className="color-option"
              style={{
                backgroundColor: color.id,
                border:
                  garmentColor === color.id
                    ? "2px solid var(--color-primary)"
                    : "1px solid var(--color-border)",
              }}
              onClick={() => setGarmentColor(color.id)}
            />
          ))}
        </div>
      </div>

      <div className="option-group">
        <div className="option-title">SPECIFICATIONS</div>
        <div
          className="option-buttons"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          {specifications.map((spec) => (
            <button
              key={spec.id}
              className={`option-button ${
                Object.values(garmentOptions).includes(spec.id) ? "active" : ""
              }`}
              onClick={() => {
                // Determine which category this spec belongs to
                const category = spec.id.includes("seam")
                  ? "waistline"
                  : spec.id.includes("sleeve")
                  ? "sleeves"
                  : spec.id.includes("scoop")
                  ? "neckline"
                  : spec.id.includes("length")
                  ? "length"
                  : "other";

                handleOptionChange(category, spec.id);
              }}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
