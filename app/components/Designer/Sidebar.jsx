"use client";

import { useState } from "react";
import {
  Venus,
  Shirt,
  Scissors,
  Bookmark,
  Waves,
  Palette,
  Brush,
  X,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";

const categoryContents = {
  silhouettes: [
    {
      id: 1,
      name: "A-LINE SKIRT",
      modelPath: "/models/female/outfitmodels/femaleskirtwithwaist2.glb",
      color: "#FF0000",
      fit: "regular",
      icon: "/models/female/outfitmodels/skirt1.png",
      availableColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
      availablePatterns: [
        {
          id: "solid1",
          name: "Solid",
          path: "/patterns/floral/flower1.webp",
        },
        {
          id: "floral1",
          name: "Floral1",
          path: "/patterns/floral/flower2.jpg",
        },
        { id: "stripe", name: "Stripes", path: "/patterns/stripe.png" },
        { id: "polkadot", name: "Polka Dots", path: "/patterns/polkadot.png" },
      ],
    },
    {
      id: 2,
      name: "TRUMPET SKIRT",
      modelPath: "/models/female/outfitmodels/skirt2.glb",
      color: "#00FF00",
      fit: "regular",
      material: "cotton",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
      availablePatterns: [
        {
          id: "solid",
          name: "Solid",
          path: "/patterns/floral/flower1.webp",
        },
        {
          id: "floral",
          name: "Floral",
          path: "/patterns/floral/flower2.jpg",
        },
        { id: "floral12", name: "Floral12", path: "/patterns/floral.png" },
        { id: "stripe", name: "Stripes", path: "/patterns/stripe.png" },
        { id: "polkadot", name: "Polka Dots", path: "/patterns/polkadot.png" },
      ],
    },
  ],
  sleeves: [
    {
      id: 1,
      name: "3/4 FITTED SLEEVES",
      modelPath: "/models/female/outfitmodels/low_poly_jacket.glb",
      color: "#0000FF",
      fit: "slim",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
    {
      id: 2,
      name: "LONG LOOSE SLEEVES",
      modelPath: "/models/female/outfitmodels/sleeve2.glb",
      color: "#00FFFF",
      fit: "loose",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
  ],
  necklines: [
    {
      id: 1,
      name: "WIDE SCOOP NECK",
      modelPath: "/models/female/outfitmodels/neckline1.glb",
      color: "#FF00FF",
      fit: "regular",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
    {
      id: 2,
      name: "V-NECK",
      modelPath: "/models/female/outfitmodels/neckline2.glb",
      color: "#FFFF00",
      fit: "slim",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
  ],
  backClosure: [
    {
      id: 1,
      name: "ZIPPER BACK",
      modelPath: "/models/female/outfitmodels/backclosure1.glb",
      color: "#800080",
      fit: "regular",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#800080", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
    {
      id: 2,
      name: "BUTTON BACK",
      modelPath: "/models/female/outfitmodels/backclosure2.glb",
      color: "#008080",
      fit: "slim",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#008080", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
  ],
  ruffles: [
    {
      id: 1,
      name: "NO RUFFLES",
      modelPath: "/models/female/outfitmodels/ruffles1.glb",
      color: "#808080",
      fit: "regular",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#808080", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
    {
      id: 2,
      name: "SHOULDER RUFFLES",
      modelPath: "/models/female/outfitmodels/ruffles2.glb",
      color: "#C0C0C0",
      fit: "loose",
      icon: "/models/female/outfitmodels/skirt2.png",
      availableColors: ["#C0C0C0", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
      availableMaterials: ["cotton", "silk", "linen", "polyester"],
    },
  ],
};

const colorNames = {
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FF00FF": "Pink",
  "#00FFFF": "Cyan",
  "#800080": "Purple",
  "#008080": "Teal",
  "#808080": "Gray",
  "#C0C0C0": "Silver",
};

export default function Sidebar({ onModelSelect }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizedModel, setCustomizedModel] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [usePattern, setUsePattern] = useState(false);

  const categories = [
    { id: "silhouettes", label: "SILHOUETTES", icon: Venus },
    { id: "sleeves", label: "SLEEVES", icon: Shirt },
    { id: "necklines", label: "NECKLINES", icon: Scissors },
    { id: "backClosure", label: "BACK CLOSURE", icon: Bookmark },
    { id: "ruffles", label: "RUFFLES", icon: Waves },
  ];

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
    setShowCustomization(false);
    setSelectedModel(null);
    setCustomizedModel(null);
    setSelectedMaterial(null);
    setSelectedColor(null);
    setSelectedPattern(null);
    setUsePattern(false);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSelectedColor(model.color); // Set default color
    setSelectedMaterial(model.material || model.availableMaterials[0]); // Set default material
    setSelectedPattern(
      model.availablePatterns ? model.availablePatterns[0] : null
    );
    setUsePattern(false);
    setShowCustomization(true);
    setCustomizedModel({
      ...model,
      color: model.color,
      material: model.material || model.availableMaterials[0],
      pattern: null,
    });
    onModelSelect({
      type: activeCategory,
      modelDetails: model,
    });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setUsePattern(false);
    setCustomizedModel({
      ...customizedModel,
      color: color,
      pattern: null,
    });
    onModelSelect({
      type: activeCategory,
      modelDetails: {
        ...customizedModel,
        color: color,
        pattern: null,
      },
    });
  };

  const handlePatternChange = (pattern) => {
    setSelectedPattern(pattern);
    setUsePattern(true);
    setCustomizedModel({
      ...customizedModel,
      pattern: pattern,
    });
    onModelSelect({
      type: activeCategory,
      modelDetails: {
        ...customizedModel,
        pattern: pattern,
      },
    });
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material);
    setCustomizedModel({
      ...customizedModel,
      material: material,
    });
    onModelSelect({
      type: activeCategory,
      modelDetails: {
        ...customizedModel,
        material: material,
      },
    });
  };

  const filteredDesigns = activeCategory
    ? categoryContents[activeCategory].filter((design) =>
        design.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const backToResults = () => {
    setShowCustomization(false);
  };

  return (
    <div className="flex h-screen overflow-y-auto">
      {/* Vertical Sidebar Icons */}
      <div className="w-20 bg-white border-r flex flex-col items-center py-4 sidebar">
        <div className="mb-4">
          <img
            src="/tailornova-logo.png"
            alt="Tailornova"
            className="w-12 h-12"
          />
        </div>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`sidebar-item ${
              activeCategory === category.id ? "active" : ""
            }`}
          >
            <category.icon className="sidebar-icon" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Dropdown Content Area */}
      {activeCategory && (
        <div className="tools-panel w-64 overflow-y-auto">
          {!showCustomization ? (
            <>
              {/* Header with Close and Search */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold option-title">
                  {categories.find((c) => c.id === activeCategory)?.label}
                </h2>
                <button onClick={() => setActiveCategory(null)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Designs Grid */}
              <div className="grid grid-cols-2 gap-4">
                {filteredDesigns.map((design) => (
                  <div
                    key={design.id}
                    className={`border rounded hover:bg-gray-50 cursor-pointer option-button ${
                      selectedModel?.id === design.id ? "active" : ""
                    }`}
                    onClick={() => handleModelSelect(design)}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="aspect-square bg-gray-100 w-full"
                        style={{
                          // backgroundColor: design.color,
                          opacity: 0.5,
                        }}
                      >
                        {/* Icon display */}
                        <div className="flex justify-center items-center h-full">
                          <img
                            src={design.icon}
                            alt={design.name}
                            className="max-h-16 max-w-16 object-contain"
                          />
                        </div>
                      </div>
                      <p className="text-center text-sm py-2">{design.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Item Count */}
              <div className="mt-4 text-gray-500 text-sm">
                {filteredDesigns.length} ITEMS FOUND
              </div>
            </>
          ) : (
            <>
              {/* Customization Panel */}
              <div className="option-group">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={backToResults}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                  <h2 className="text-lg font-semibold option-title">
                    Customize {selectedModel?.name}
                  </h2>
                </div>

                {/* Selected item preview */}
                <div className="mb-6 border rounded p-2">
                  <div
                    className="aspect-square bg-gray-100 mb-2 relative"
                    style={{
                      backgroundColor: usePattern
                        ? "transparent"
                        : selectedColor,
                      opacity: usePattern ? 1 : 0.7,
                    }}
                  >
                    {usePattern && selectedPattern && (
                      <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${selectedPattern.path})`,
                        }}
                      ></div>
                    )}
                    <div className="flex justify-center items-center h-full relative z-10">
                      <img
                        src={selectedModel?.icon}
                        alt={selectedModel?.name}
                        className="max-h-24 max-w-24 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-center font-semibold">
                    {selectedModel?.name}
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    {usePattern
                      ? selectedPattern?.name
                      : colorNames[selectedColor] || selectedColor}{" "}
                    | {selectedMaterial}
                  </p>
                </div>

                {/* Pattern/Design selection */}
                {selectedModel?.availablePatterns && (
                  <div className="option-group mb-6">
                    <h3 className="option-title flex items-center justify-between">
                      <span>PATTERN/DESIGN</span>
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedModel.availablePatterns.map((pattern) => (
                        <button
                          key={pattern.id}
                          onClick={() => handlePatternChange(pattern)}
                          className={`relative p-1 border rounded h-12 overflow-hidden ${
                            usePattern && selectedPattern?.id === pattern.id
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          title={pattern.name}
                        >
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${pattern.path})` }}
                          ></div>
                          {usePattern && selectedPattern?.id === pattern.id && (
                            <Check className="absolute right-1 bottom-1 text-blue-500 drop-shadow-md bg-white rounded-full w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color selection */}
                <div className="option-group mb-6">
                  <h3 className="option-title flex items-center justify-between">
                    <span>COLOR</span>
                    <Palette className="w-5 h-5 text-gray-500" />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {customizedModel?.availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`relative color-option ${
                          !usePattern && selectedColor === color
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        title={colorNames[color] || color}
                      >
                        {!usePattern && selectedColor === color && (
                          <Check className="absolute inset-0 m-auto text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material selection */}
                <div className="option-group">
                  <h3 className="option-title flex items-center justify-between">
                    <span>MATERIAL</span>
                    <Brush className="w-5 h-5 text-gray-500" />
                  </h3>
                  <div className="option-buttons">
                    {customizedModel?.availableMaterials.map((material) => (
                      <button
                        key={material}
                        onClick={() => handleMaterialChange(material)}
                        className={`option-button ${
                          selectedMaterial === material ? "active" : ""
                        }`}
                      >
                        {material.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply button */}
                <button className="button-primary w-full mt-6">
                  APPLY CHANGES
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ChevronLeft component for back button
const ChevronLeft = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
