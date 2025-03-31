// components/Designer/OptionsPanel.js
import { useState } from "react";

const OptionsPanel = ({ onOptionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    fabric: null,
    color: "#0066AA",
    sleeves: "3/4 fitted sleeves",
    neckline: "wide scoop décolleté",
    length: "knee length",
    fit: "flared",
    details: ["bust darts", "waist darts", "center front"],
    seams: ["front seam", "center back seam"],
    ruffles: "no ruffles",
  });

  const handleOptionSelect = (category, value) => {
    setSelectedOptions((prev) => {
      const updated = { ...prev, [category]: value };
      onOptionChange(updated);
      return updated;
    });
  };

  const handleDetailToggle = (detail) => {
    setSelectedOptions((prev) => {
      const details = prev.details.includes(detail)
        ? prev.details.filter((d) => d !== detail)
        : [...prev.details, detail];

      const updated = { ...prev, details };
      onOptionChange(updated);
      return updated;
    });
  };

  const handleSeamToggle = (seam) => {
    setSelectedOptions((prev) => {
      const seams = prev.seams.includes(seam)
        ? prev.seams.filter((s) => s !== seam)
        : [...prev.seams, seam];

      const updated = { ...prev, seams };
      onOptionChange(updated);
      return updated;
    });
  };

  const colorOptions = [
    { name: "Blue", value: "#0066AA" },
    { name: "Red", value: "#CC3333" },
    { name: "Green", value: "#339966" },
    { name: "Black", value: "#333333" },
    { name: "White", value: "#FFFFFF" },
  ];

  const fabricOptions = [
    { name: "Cotton", value: "cotton" },
    { name: "Silk", value: "silk" },
    { name: "Wool", value: "wool" },
    { name: "Linen", value: "linen" },
    { name: "Polyester", value: "polyester" },
  ];

  const ruffleOptions = [
    { name: "No Ruffles", value: "no ruffles" },
    { name: "Double Ruffle", value: "double ruffle" },
    { name: "Flounce", value: "flounce" },
  ];

  const sleeveOptions = [
    { name: "Sleeveless", value: "sleeveless" },
    { name: "Short Sleeves", value: "short sleeves" },
    { name: "3/4 Fitted Sleeves", value: "3/4 fitted sleeves" },
    { name: "Long Sleeves", value: "long sleeves" },
  ];

  return (
    <div className="options-panel">
      <div className="option-group">
        <h3 className="option-title">Fabric</h3>
        <div className="option-buttons">
          {fabricOptions.map((option) => (
            <button
              key={option.value}
              className={`option-button ${
                selectedOptions.fabric === option.value ? "active" : ""
              }`}
              onClick={() => handleOptionSelect("fabric", option.value)}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <h3 className="option-title">Color</h3>
        <div className="option-buttons">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              className="color-option"
              style={{ backgroundColor: option.value }}
              onClick={() => handleOptionSelect("color", option.value)}
            />
          ))}
        </div>
      </div>

      <div className="option-group">
        <h3 className="option-title">Sleeves</h3>
        <div className="option-buttons">
          {sleeveOptions.map((option) => (
            <button
              key={option.value}
              className={`option-button ${
                selectedOptions.sleeves === option.value ? "active" : ""
              }`}
              onClick={() => handleOptionSelect("sleeves", option.value)}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <h3 className="option-title">Ruffles</h3>
        <div className="option-buttons">
          {ruffleOptions.map((option) => (
            <button
              key={option.value}
              className={`option-button ${
                selectedOptions.ruffles === option.value ? "active" : ""
              }`}
              onClick={() => handleOptionSelect("ruffles", option.value)}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <h3 className="option-title">Features</h3>
        <div className="option-buttons">
          <button
            className={`option-button ${
              selectedOptions.fit === "flared" ? "active" : ""
            }`}
            onClick={() => handleOptionSelect("fit", "flared")}
          >
            FLARED
          </button>
          <button
            className={`option-button ${
              selectedOptions.length === "knee length" ? "active" : ""
            }`}
            onClick={() => handleOptionSelect("length", "knee length")}
          >
            KNEE LENGTH
          </button>
          <button
            className={`option-button ${
              selectedOptions.details.includes("bust darts") ? "active" : ""
            }`}
            onClick={() => handleDetailToggle("bust darts")}
          >
            BUST DARTS
          </button>
          <button
            className={`option-button ${
              selectedOptions.details.includes("waist darts") ? "active" : ""
            }`}
            onClick={() => handleDetailToggle("waist darts")}
          >
            WAIST DARTS
          </button>
          <button
            className={`option-button ${
              selectedOptions.seams.includes("front seam") ? "active" : ""
            }`}
            onClick={() => handleSeamToggle("front seam")}
          >
            FRONT SEAM
          </button>
          <button
            className={`option-button ${
              selectedOptions.seams.includes("center back seam") ? "active" : ""
            }`}
            onClick={() => handleSeamToggle("center back seam")}
          >
            CENTER BACK SEAM
          </button>
        </div>
      </div>

      <div className="option-actions">
        <button className="button-primary">DOWNLOAD PATTERN</button>
      </div>
    </div>
  );
};

export default OptionsPanel;
