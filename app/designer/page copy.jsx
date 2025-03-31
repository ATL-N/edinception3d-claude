// // "use client";

// // import { useState } from "react";
// // import Sidebar from "../components/Designer/Sidebar";
// // import TopNavigation from "../components/Designer/TopNavigation";
// // import DesignTools from "../components/Designer/DesignTools";
// // import Canvas from "../components/Designer/Canvas";
// // import TechnicalView from "../components/Designer/TechnicalView";
// // import SizingPanel from "../components/Designer/SizingPanel";
// // import {
// //   Tabs,
// //   TabsList,
// //   TabsTrigger,
// //   TabsContent,
// // } from "../components/ui/Tabs";

// // export default function Designer() {
// //       const [activeView, setActiveView] = useState("technical");

// //   // State for garment options
// //   const [garmentOptions, setGarmentOptions] = useState({
// //     type: "dress",
// //     sleeves: "sleeveless",
// //     neckline: "scoop",
// //     waistSeam: true,
// //     hemStyle: "flared",
// //     ruffleStyle: "none",
// //   });

// //   // State for current color
// //   const [garmentColor, setGarmentColor] = useState("#4a90e2");

// //   // State for active tab
// //   const [activeTab, setActiveTab] = useState("design");

// //   // Function to update garment options
// //   const updateGarmentOptions = (options) => {
// //     setGarmentOptions((prev) => ({ ...prev, ...options }));
// //   };

// //   return (
// //     <div className="designer-container">
// //       <Sidebar />

// //       <div className="main-content">
// //         <TopNavigation />

// //         <div className="design-area">
// //           <DesignTools
// //             garmentOptions={garmentOptions}
// //             updateGarmentOptions={updateGarmentOptions}
// //             garmentColor={garmentColor}
// //             setGarmentColor={setGarmentColor}
// //           />

// //           {/* <div className="view-area">
// //             <Tabs
// //               defaultValue="design"
// //               className="w-full"
// //               onChange={setActiveTab}
// //             >
// //               <TabsList>
// //                 <TabsTrigger value="design">Design</TabsTrigger>
// //                 <TabsTrigger value="technical">Technical View</TabsTrigger>
// //                 <TabsTrigger value="pattern">Pattern</TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="design" className="flex-1">
// //                 <Canvas
// //                   garmentColor={garmentColor}
// //                   garmentOptions={garmentOptions}
// //                 />
// //               </TabsContent>

// //               <TabsContent value="technical" className="flex-1">
// //                 <TechnicalView
// //                   garmentOptions={garmentOptions}
// //                   setActiveView={setActiveView}
// //                 />
// //               </TabsContent>

// //               <TabsContent value="pattern" className="flex-1">
// //                 <div className="w-full h-full flex items-center justify-center">
// //                   <div className="pattern-grid w-full h-full">
// //                     <div className="flex items-center justify-center h-full text-[var(--color-text-light)]">
// //                       Pattern view is under development
// //                     </div>
// //                   </div>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div> */}

// //           <div className="view-area">
// //             <TechnicalView
// //               activeView={activeView}
// //               setActiveView={setActiveView}
// //               // garmentType={garmentType}
// //               // garmentColor={garmentColor}
// //               // garmentOptions={garmentOptions}
// //             />
// //           </div>

// //           <SizingPanel
// //             garmentOptions={garmentOptions}
// //             updateGarmentOptions={updateGarmentOptions}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // app/designer/page.js
// "use client";

// import { useState } from "react";
// import { useTheme } from "../../contexts/ThemeContext";
// import TopNavigation from "../../components/Designer/TopNavigation";
// import Sidebar from "../../components/Designer/Sidebar";
// import DesignTools from "../../components/Designer/DesignTools";
// import TechnicalView from "../../components/Designer/TechnicalView";

// export default function DesignerPage() {
//   const { theme, toggleTheme } = useTheme();
//   const [activeView, setActiveView] = useState("technical");
//   const [garmentType, setGarmentType] = useState("dress");
//   const [garmentColor, setGarmentColor] = useState("#1a6f99");
//   const [garmentOptions, setGarmentOptions] = useState({
//     ruffles: "no-ruffles",
//     sleeves: "3/4-fitted-sleeves",
//     waistline: "no-waist-seam",
//     length: "knee-length",
//     neckline: "wide-scoop",
//   });

//   const handleOptionChange = (category, value) => {
//     setGarmentOptions({
//       ...garmentOptions,
//       [category]: value,
//     });
//   };

//   return (
//     <div className="designer-container">
//       <Sidebar />
//       <div className="main-content">
//         <TopNavigation toggleTheme={toggleTheme} />
//         <div className="design-area">
//           <DesignTools
//             garmentColor={garmentColor}
//             setGarmentColor={setGarmentColor}
//             garmentOptions={garmentOptions}
//             handleOptionChange={handleOptionChange}
//           />
//           <TechnicalView
//             activeView={activeView}
//             setActiveView={setActiveView}
//             garmentType={garmentType}
//             garmentColor={garmentColor}
//             garmentOptions={garmentOptions}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


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
  const [garmentType, setGarmentType] = useState("dress");
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
            <ModelViewer
              garments={{
                skirt: {
                  type: "skirt",
                  color: "#00FF00",
                  fit: "regular",
                  path: "/models/female/outfitmodels/skirt2.glb",
                },
                tshirt: {
                  type: "tshirt",
                  color: "#FF0000",
                  fit: "slim",
                  path: "/models/female/outfitmodels/low_poly_jacket.glb",
                },
                jacket: {
                  type: "jacket",
                  color: "#FFFFFFFF",
                  fit: "slim",
                  path: "/models/female/outfitmodels/low_poly_jacket.glb",
                },
              }}
            />
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
    <div
      className="designer-container"
      style={{ display: "flex", height: "100vh" }}
    >
      <Sidebar />
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