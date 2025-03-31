// components/Designer/SizingPanel.js
"use client";

import { useState } from "react";

export default function SizingPanel() {
  const [selectedSize, setSelectedSize] = useState("18");
  const [measurements, setMeasurements] = useState({
    bust: 41,
    waist: 34,
    hips: 44,
    shoulder: 16,
    armLength: 24,
    height: 65,
  });

  const sizes = ["10", "12", "14", "16", "18", "20", "22"];

  const handleMeasurementChange = (measurement, value) => {
    setMeasurements({
      ...measurements,
      [measurement]: value,
    });
  };

  return (
    <div className="options-panel">
      <div className="option-group">
        <div className="option-title">SIZE</div>
        <div className="option-buttons">
          {sizes.map((size) => (
            <button
              key={size}
              className={`option-button ${
                selectedSize === size ? "active" : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              SIZE {size}
            </button>
          ))}
        </div>
        <div
          style={{ marginTop: "10px", fontSize: "14px", textAlign: "center" }}
        >
          SIZE {selectedSize} ADAPTED
        </div>
      </div>

      <div className="option-group">
        <div className="option-title">MEASUREMENTS</div>
        <div
          className="measurement-inputs"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {Object.entries(measurements).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label style={{ textTransform: "uppercase", fontSize: "12px" }}>
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}:
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  handleMeasurementChange(key, parseInt(e.target.value))
                }
                style={{
                  width: "60px",
                  padding: "4px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  textAlign: "right",
                }}
              />
              <span style={{ fontSize: "12px", marginLeft: "4px" }}>in</span>
            </div>
          ))}
        </div>
      </div>

      <div className="option-group">
        <button className="button-primary" style={{ width: "100%" }}>
          DOWNLOAD PATTERN
        </button>
      </div>
    </div>
  );
}
