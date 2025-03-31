// // app/designer/page.js
// "use client";

// import { useState } from "react";
// import TopNavigation from "./components/Designer/TopNavigation";
// import Sidebar from "./components/Designer/Sidebar";
// import DesignTools from "./components/Designer/DesignTools";
// import Canvas from "./components/Designer/Canvas";
// import OptionsPanel from "./components/Designer/OptionsPanel";
// import SizingPanel from "./components/Designer/SizingPanel";

// export default function DesignerPage() {
//   const [activeDesignView, setActiveDesignView] = useState("technical");
//   const [showSizingPanel, setShowSizingPanel] = useState(false);
//   const [garmentColor, setGarmentColor] = useState("#1a6f99");
//   const [garmentOptions, setGarmentOptions] = useState({
//     ruffles: "no-ruffles",
//     sleeves: "3/4-fitted-sleeves",
//     waistline: "no-waist-seam",
//     length: "knee-length",
//     neckline: "wide-scoop",
//   });


//   const [designOptions, setDesignOptions] = useState({
//     color: "#0066AA",
//     fabric: "cotton",
//     sleeves: "3/4 fitted sleeves",
//     ruffles: "no ruffles",
//   });

//   const handleViewChange = (view) => {
//     setActiveDesignView(view);
//   };

//   const toggleSizingPanel = () => {
//     setShowSizingPanel((prev) => !prev);
//   };

//   const handleOptionChange = (options) => {
//     setDesignOptions(options);
//   };
//     const handleOptionChange1 = (category, value) => {
//       setGarmentOptions({
//         ...garmentOptions,
//         [category]: value,
//       });
//     };

//   return (
//     <div className="designer-container">
//       <Sidebar />
//       <div className="main-content">
//         <TopNavigation onSizeClick={toggleSizingPanel} />
//         <div className="design-area">
//           {/* <DesignTools
//             garmentColor={garmentColor}
//             setGarmentColor={setGarmentColor}
//             garmentOptions={garmentOptions}
//             handleOptionChange={handleOptionChange}
//           /> */}

          
//           <Canvas
//             selectedView={activeDesignView}
//             designOptions={designOptions}
//             onViewChange={handleViewChange}
//           />
//           <OptionsPanel onOptionChange={handleOptionChange} />
//         </div>
//       </div>
//       {showSizingPanel && <SizingPanel onClose={toggleSizingPanel} />}
//     </div>
//   );
// }

// app/designer/page.js
"use client";

import { useState } from "react";
import { useTheme } from "./contexts/ThemeContext";
import TopNavigation from "./components/Designer/TopNavigation";
import Sidebar from "./components/Designer/Sidebar";
import DesignTools from "./components/Designer/DesignTools";
import TechnicalView from "./components/Designer/TechnicalView";
import OptionsPanel from "./components/Designer/OptionsPanel";

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

  const handleOptionChange = (category, value) => {
    setGarmentOptions({
      ...garmentOptions,
      [category]: value,
    });
  };

  const handleOptionChange1 = (options) => {
    setDesignOptions(options);
  };
//     const handleOptionChange1 = (category, value) => {
//       setGarmentOptions({
//         ...garmentOptions,
//         [category]: value,
//       });
//     };

  return (
    <div className="designer-container">
      <Sidebar />
      <div className="main-content">
        <TopNavigation toggleTheme={toggleTheme} />
        <div className="design-area">
          <DesignTools
            garmentColor={garmentColor}
            setGarmentColor={setGarmentColor}
            garmentOptions={garmentOptions}
            handleOptionChange={handleOptionChange}
          />
          <TechnicalView
            activeView={activeView}
            setActiveView={setActiveView}
            garmentType={garmentType}
            garmentColor={garmentColor}
            garmentOptions={garmentOptions}
          />
         {/* <OptionsPanel onOptionChange={handleOptionChange1} /> */}
        </div>
      </div>
    </div>
  );
}
