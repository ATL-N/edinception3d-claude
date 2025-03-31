import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const ModelViewer = ({
  modelConfig = { color: "#835F63" },
  bodyType = "average",
  customMeasurements = null,
  garments = {},
}) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const modelRef = useRef(null);
  const garmentsRef = useRef({});
  const sceneRef = useRef(null);
  const [garmentLoading, setGarmentLoading] = useState({});
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const isDraggingRef = useRef(false);
  const selectedObjectRef = useRef(null);
  const dragOffsetRef = useRef(new THREE.Vector3());
  const dragPlaneRef = useRef(new THREE.Plane());
  const textureLoaderRef = useRef(new THREE.TextureLoader());

  const loadGarment = (scene, humanModel, garmentConfig, garmentType) => {
    return new Promise((resolve, reject) => {
      if (garmentLoading[garmentType]) {
        reject(new Error(`${garmentType} is already loading`));
        return;
      }

      setGarmentLoading((prev) => ({ ...prev, [garmentType]: true }));

      if (garmentsRef.current[garmentType]) {
        scene.remove(garmentsRef.current[garmentType]);

        garmentsRef.current[garmentType].traverse((node) => {
          if (node.isMesh) {
            if (node.geometry) node.geometry.dispose();
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach((material) => material.dispose());
              } else {
                node.material.dispose();
              }
            }
          }
        });

        garmentsRef.current[garmentType] = null;
      }

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);

      loader?.load(
        garmentConfig?.path,
        (gltf) => {
          const garment = gltf.scene;
          garmentsRef.current[garmentType] = garment;

          garment.userData.type = garmentType;
          garment.userData.isDraggable = true;

          // Apply material based on pattern or color
          applyMaterialToGarment(garment, garmentConfig);

          positionGarmentOnBody(
            garment,
            humanModel,
            garmentConfig.fit,
            garmentType
          );
          scene.add(garment);

          setGarmentLoading((prev) => ({ ...prev, [garmentType]: false }));
          resolve(garment);
        },
        (xhr) => {
          console.log(
            `${garmentType} loading: ` +
              (xhr.loaded / xhr.total) * 100 +
              "% loaded"
          );
        },
        (error) => {
          console.error(`Error loading ${garmentType} model:`, error);
          setGarmentLoading((prev) => ({ ...prev, [garmentType]: false }));
          reject(error);
        }
      );
    });
  };

  const applyMaterialToGarment = (garment, garmentConfig) => {
    // Check if a pattern is provided
    if (garmentConfig.pattern && garmentConfig.pattern.path) {
      // Load the pattern texture
      const texture = textureLoaderRef.current.load(garmentConfig.pattern.path);

      // Configure texture settings
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2); // Adjust the repeat to control pattern scale

      // Create a material with the pattern texture
      const patternMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.3,
      });

      // Apply the material to all meshes in the garment
      garment.traverse((node) => {
        if (node.isMesh) {
          node.material = patternMaterial.clone();
          node.userData.isDraggable = true;
          node.userData.parentGarment = garment;
          node.userData.originalMaterial = node.material.clone();
          node.userData.highlightMaterial = node.material.clone();
          node.userData.highlightMaterial.emissive = new THREE.Color(0x222222);
          node.userData.highlightMaterial.emissiveIntensity = 0.3;
        }
      });
    } else if (garmentConfig.color) {
      // Fallback to solid color if no pattern is provided
      garment.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(garmentConfig.color),
            roughness: 0.7,
            metalness: 0.3,
          });

          node.userData.isDraggable = true;
          node.userData.parentGarment = garment;
          node.userData.originalMaterial = node.material.clone();
          node.userData.highlightMaterial = node.material.clone();
          node.userData.highlightMaterial.emissive = new THREE.Color(0x222222);
          node.userData.highlightMaterial.emissiveIntensity = 0.3;
        }
      });
    }
  };

  const positionGarmentOnBody = (
    garment,
    humanModel,
    fitType = "regular",
    garmentType
  ) => {
    const humanBbox = new THREE.Box3().setFromObject(humanModel);
    const humanCenter = new THREE.Vector3();
    humanBbox.getCenter(humanCenter);

    humanModel.getWorldPosition(humanCenter);

    garment.rotation.set(0, 0, 0);

    const fitScaleFactors = {
      slim: 0.95,
      regular: 1.01,
      loose: 1.15,
    };

    const scaleFactor = fitScaleFactors[fitType] || fitScaleFactors.regular;
    garment.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const positionOffsets = {
      skirt: 0.0,
      tshirt: 1.0,
      jacket: 1.5,
      pants: 0.5,
      dress: 0.0,
    };

    garment.position.set(humanCenter.x, humanCenter.y, humanCenter.z);
  };

  const handleMouseDown = (event) => {
    if (!controlsRef.current) return;
    if (event.button !== 0) return;

    const rect = event.target.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const intersectableGarments = Object.values(garmentsRef.current).filter(
      (garment) => garment !== null
    );

    const intersects = raycasterRef.current.intersectObjects(
      intersectableGarments,
      true
    );

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const parentGarment =
        object.userData.parentGarment ||
        (object.userData.isDraggable ? object : null);

      if (parentGarment) {
        controlsRef.current.enabled = false;
        isDraggingRef.current = true;
        selectedObjectRef.current = parentGarment;

        const intersectionPoint = intersects[0].point;
        const objectWorldPos = new THREE.Vector3();
        parentGarment.getWorldPosition(objectWorldPos);
        dragOffsetRef.current.subVectors(objectWorldPos, intersectionPoint);

        const planeNormal = new THREE.Vector3();
        cameraRef.current.getWorldDirection(planeNormal);
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(
          planeNormal,
          intersectionPoint
        );

        parentGarment.traverse((node) => {
          if (node.isMesh && node.userData.highlightMaterial) {
            node.material = node.userData.highlightMaterial;
          }
        });

        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!isDraggingRef.current || !selectedObjectRef.current) return;

    const rect = event.target.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const intersectionPoint = new THREE.Vector3();
    raycasterRef.current.ray.intersectPlane(
      dragPlaneRef.current,
      intersectionPoint
    );

    intersectionPoint.add(dragOffsetRef.current);
    selectedObjectRef.current.position.copy(intersectionPoint);

    event.preventDefault();
  };

  const handleMouseUp = (event) => {
    if (isDraggingRef.current && selectedObjectRef.current) {
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }

      isDraggingRef.current = false;

      selectedObjectRef.current.traverse((node) => {
        if (node.isMesh && node.userData.originalMaterial) {
          node.material = node.userData.originalMaterial;
        }
      });

      selectedObjectRef.current = null;
    }
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    camera.position.y = 1;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    renderer.domElement.addEventListener("mousedown", handleMouseDown, false);
    renderer.domElement.addEventListener("mousemove", handleMouseMove, false);
    renderer.domElement.addEventListener("mouseup", handleMouseUp, false);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp, false);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    const loader = new GLTFLoader();
    const modelPath = "/models/female/femalerig2withskirt.glb";

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += size.y / 2;
        model.position.x = 0;
        model.position.z = 0;

        if (modelConfig?.color) {
          model.traverse((node) => {
            if (node.isMesh) {
              node.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(modelConfig?.color),
                roughness: 0.7,
                metalness: 0.3,
              });

              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
        }

        scene.add(model);

        const garmentPromises = Object.entries(garments).map(([type, config]) =>
          loadGarment(scene, model, config, type)
        );

        Promise.all(garmentPromises)
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to load garments:", error);
            setLoading(false);
          });
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading model:", error);
        setLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [garments]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }}>
      {loading && <div className="loading-indicator">Loading model...</div>}
      {!loading && (
        <div
          className="instructions"
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            background: "rgba(255,255,255,0.7)",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          Click and drag to move garments
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
