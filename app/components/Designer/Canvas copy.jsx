// // components/Designer/Canvas.js
// 'use client';

// import { useEffect, useRef } from 'react';

// export default function Canvas({ garmentColor, garmentOptions }) {
//   const canvasRef = useRef(null);
  
//   useEffect(() => {
//     // This is where you would initialize Three.js
//     // The code below is just a placeholder
    
//     /*
//     // COMMENTED OUT - Actual Three.js implementation would go here
    
//     // Import required Three.js libraries
//     import * as THREE from 'three';
//     import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//     import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    
//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);
    
//     // Camera setup
//     const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0, 1, 5);
    
//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     canvasRef.current.appendChild(renderer.domElement);
    
//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);
    
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 7.5);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);
    
//     // Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
    
//     // Load model
//     const loader = new GLTFLoader();
//     loader.load(
//       '/models/dress.glb',
//       (gltf) => {
//         const model = gltf.scene;
        
//         // Apply material/color to model
//         model.traverse((node) => {
//           if (node.isMesh) {
//             node.material = new THREE.MeshStandardMaterial({
//               color: new THREE.Color(garmentColor),
//               roughness: 0.7,
//               metalness: 0.1
//             });
//           }
//         });
        
//         scene.add(model);
//       },
//       undefined,
//       (error) => {
//         console.error('An error occurred loading the model:', error);
//       }
//     );
    
//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
    
//     animate();
    
//     // Handle window resize
//     const handleResize = () => {
//       camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
//     };
    
//     window.addEventListener('resize', handleResize);
    
//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       // Clean up three.js resources
//       renderer.dispose();
//       // Remove canvas element
//       if (canvasRef.current && canvasRef.current.contains(renderer.domElement)) {
//         canvasRef.current.removeChild(renderer.domElement);
//       }
//     };
//     */
    
//     // Placeholder - just draw a simple representation on a 2D canvas
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext('2d');
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       // Draw a simple dress silhouette
//       ctx.fillStyle = garmentColor;
//       ctx.strokeStyle = '#000000';
//       ctx.lineWidth = 2;
      
//       // Draw the dress body
//       ctx.beginPath();
//       ctx.moveTo(150, 100);
//       ctx.bezierCurveTo(100, 100, 100, 150, 100, 200);
//       ctx.lineTo(100, 400);
//       ctx.bezierCurveTo(100, 450, 200, 450, 250, 450);
//       ctx.bezierCurveTo(300, 450, 400, 450, 400, 400);
//       ctx.lineTo(400, 200);
//       ctx.bezierCurveTo(400, 150, 400, 100, 350, 100);
//       ctx.closePath();
//       ctx.fill();
//       ctx.stroke();
      
//       // Draw neckline
//       ctx.beginPath();
//       ctx.moveTo(150, 100);
//       ctx.bezierCurveTo(200, 80, 300, 80, 350, 100);
//       ctx.stroke();
      
//       // Draw sleeves if they exist in the options
//       if (garmentOptions.sleeves === '3/4-fitted-sleeves') {
//         // Left sleeve
//         ctx.beginPath();
//         ctx.moveTo(100, 150);

// components/Designer/Canvas.js
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ModelViewer from './ModelViewer';

const Canvas = ({ selectedView = 'technical' }) => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState(selectedView);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="view-area">
      <div className="view-tabs">
        <button 
          className={`view-tab ${activeTab === 'technical' ? 'active' : ''}`}
          onClick={() => handleTabChange('technical')}
        >
          TECHNICAL SKETCH
        </button>
        <button 
          className={`view-tab ${activeTab === '3d' ? 'active' : ''}`}
          onClick={() => handleTabChange('3d')}
        >
          3D VIEW <span className="beta">BETA</span>
        </button>
        <button 
          className={`view-tab ${activeTab === 'pattern' ? 'active' : ''}`}
          onClick={() => handleTabChange('pattern')}
        >
          FLAT PATTERN
        </button>
      </div>
      
      <div className="view-content">
        {activeTab === 'technical' && (
          <div className="technical-view">
            <div className="view-options">
              <button className={`view-option active`}>BOTH</button>
              <button className={`view-option`}>FRONT</button>
              <button className={`view-option`}>BACK</button>
            </div>
            <div className="garment-preview">
              <img src="/images/dress-technical.png" alt="Technical drawing" />
            </div>
          </div>
        )}
        
        {activeTab === '3d' && (
          <div className="model-viewer">
            <ModelViewer />
          </div>
        )}
        
        {activeTab === 'pattern' && (
          <div className="pattern-view">
            <div className="pattern-grid">
              <img src="/images/flat-pattern.png" alt="Flat pattern" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;