"use client";

import { useState } from "react";
import Panel from "../ui/Panel";
import Button from "../ui/Button";

export default function SizingPanel({
  garmentOptions,
  updateGarmentOptions,
  isVisible,
  setIsVisible,
}) {
  const [measurements, setMeasurements] = useState({
    bust: 36,
    waist: 28,
    hips: 38,
    shoulderWidth: 15,
    armLength: 24,
    height: 65,
  });

  const [selectedSize, setSelectedSize] = useState("custom");

  const standardSizes = {
    xs: {
      bust: 32,
      waist: 24,
      hips: 34,
      shoulderWidth: 14,
      armLength: 22,
      height: 64,
    },
    s: {
      bust: 34,
      waist: 26,
      hips: 36,
      shoulderWidth: 14.5,
      armLength: 23,
      height: 64.5,
    },
    m: {
      bust: 36,
      waist: 28,
      hips: 38,
      shoulderWidth: 15,
      armLength: 24,
      height: 65,
    },
    l: {
      bust: 38,
      waist: 30,
      hips: 40,
      shoulderWidth: 15.5,
      armLength: 24.5,
      height: 65.5,
    },
    xl: {
      bust: 40,
      waist: 32,
      hips: 42,
      shoulderWidth: 16,
      armLength: 25,
      height: 66,
    },
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    if (size !== "custom") {
      setMeasurements(standardSizes[size]);
    }
  };

  const handleMeasurementChange = (measurement, value) => {
    setMeasurements((prev) => {
      const newMeasurements = { ...prev, [measurement]: value };
      // If measurements change, we're in custom mode
      setSelectedSize("custom");
      return newMeasurements;
    });
  };

  const handleApplyMeasurements = () => {
    // Apply measurements to the garment
    updateGarmentOptions({ measurements });
  };

  if (!isVisible) {
    return (
      <div className="options-panel-collapsed">
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
    <div className="options-panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 className="text-lg font-medium mb-4">Sizing Options</h3>
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
      <Panel title="Standard Sizes" className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(standardSizes).map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "primary" : "outline"}
              className="uppercase"
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </Panel>

      <Panel title="Custom Measurements" className="mb-4" collapsible>
        <div className="space-y-4">
          {Object.entries(measurements).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm capitalize">{key} (inches)</label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={key === "height" ? 60 : 20}
                  max={key === "height" ? 75 : 50}
                  value={value}
                  onChange={(e) =>
                    handleMeasurementChange(key, parseFloat(e.target.value))
                  }
                  className="flex-1"
                />
                <span className="w-8 text-center">{value}</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={handleApplyMeasurements}
        >
          Apply Measurements
        </Button>
      </Panel>

      <Panel title="Fit Preferences">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fitted"
              checked={garmentOptions.fitPreference === "fitted"}
              onChange={() => updateGarmentOptions({ fitPreference: "fitted" })}
            />
            <label htmlFor="fitted">Fitted</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="loose"
              checked={garmentOptions.fitPreference === "loose"}
              onChange={() => updateGarmentOptions({ fitPreference: "loose" })}
            />
            <label htmlFor="loose">Loose</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="relaxed"
              checked={garmentOptions.fitPreference === "relaxed"}
              onChange={() =>
                updateGarmentOptions({ fitPreference: "relaxed" })
              }
            />
            <label htmlFor="relaxed">Relaxed</label>
          </div>
        </div>
      </Panel>
    </div>
  );
}
