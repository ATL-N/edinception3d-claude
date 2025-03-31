import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as CANNON from "cannon-es";

const ModelViewer = ({
  modelConfig = { color: "#AE3E49" },
  bodyType = "average",
  customMeasurements = null,
  enableClothSimulation = true,
  garmentConfig = {
    type: "tshirt",
    color: "#FFFFFF",
    fit: "regular", // "slim", "regular", "loose"
    texture: null,
  },
}) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const modelRef = useRef(null);
  const tshirtRef = useRef(null);
  const sceneRef = useRef(null);
  const physicsWorldRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const clothBonesRef = useRef([]);
  const bodyColliderRef = useRef(null);
  const animationRef = useRef(null);
  const [tshirtLoading, setTshirtLoading] = useState(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const isDraggingRef = useRef(false);
  const selectedObjectRef = useRef(null);
  const dragOffsetRef = useRef(new THREE.Vector3());
  const dragPlaneRef = useRef(new THREE.Plane());

  // Function to adjust body proportions
  const adjustBodyType = (model, type) => {
    // Pre-defined body types with scale factors
    const bodyTypes = {
      slim: { overall: 0.9, chest: 0.85, waist: 0.8, hips: 0.85 },
      average: { overall: 1.0, chest: 1.0, waist: 1.0, hips: 1.0 },
      athletic: { overall: 1.0, chest: 1.1, waist: 0.9, hips: 1.0 },
      heavy: { overall: 1.2, chest: 1.25, waist: 1.3, hips: 1.2 },
    };

    // Get scale factors based on body type
    const factors = bodyTypes[type] || bodyTypes.average;

    // Apply overall scaling to the entire model
    model.scale.set(factors.overall, factors.overall, factors.overall);

    // Find specific body parts
    model.traverse((object) => {
      if (!object.isMesh) {
        return;
      }

      // Scale specific body parts based on name
      if (object.name.includes("Chest") || object.name.includes("torso")) {
        object.scale.x *= factors.chest;
        object.scale.z *= factors.chest;
      } else if (
        object.name.includes("Waist") ||
        object.name.includes("Abdomen")
      ) {
        object.scale.x *= factors.waist;
        object.scale.z *= factors.waist;
      } else if (
        object.name.includes("Hip") ||
        object.name.includes("Pelvis")
      ) {
        object.scale.x *= factors.hips;
        object.scale.z *= factors.hips;
      }
    });
  };

  // Function to apply custom measurements
  const applyCustomMeasurements = (model, measurements) => {
    // Default measurements
    const defaults = {
      height: 1.0,
      chest: 1.0,
      waist: 1.0,
      hips: 1.0,
    };

    // Merge provided measurements with defaults
    const params = { ...defaults, ...measurements };

    // Apply height scaling to entire model
    model.scale.y = params.height;

    // Find specific body parts
    model.traverse((object) => {
      if (!object.isMesh) return;

      if (object.name.includes("Chest") || object.name.includes("torso")) {
        object.scale.x = params.chest;
        object.scale.z = params.chest;
      } else if (
        object.name.includes("Waist") ||
        object.name.includes("Abdomen")
      ) {
        object.scale.x = params.waist;
        object.scale.z = params.waist;
      } else if (
        object.name.includes("Hip") ||
        object.name.includes("Pelvis")
      ) {
        object.scale.x = params.hips;
        object.scale.z = params.hips;
      }
    });
  };

  // Create simplified collision model from the human model
  const createBodyCollider = (humanModel) => {
    const colliders = [];
    const colliderGroup = new THREE.Group();
    sceneRef.current.add(colliderGroup);

    // Body part mapping for collision detection
    const bodyParts = {
      torso: {
        regex: /(Torso|Chest|Upper_Body)/i,
        scale: [1.1, 1.0, 1.1],
        position: [0, 0, 0],
      },
      waist: {
        regex: /(Waist|Abdomen|Lower_Torso)/i,
        scale: [1.1, 1.0, 1.1],
        position: [0, -0.2, 0],
      },
      pelvis: {
        regex: /(Hip|Pelvis)/i,
        scale: [1.1, 1.0, 1.1],
        position: [0, -0.4, 0],
      },
      neck: { regex: /Neck/i, scale: [0.8, 1.0, 0.8], position: [0, 0.4, 0] },
      arm_left: {
        regex: /(Arm.*Left|Left.*Arm)/i,
        scale: [0.5, 1.0, 0.5],
        position: [-0.25, 0.1, 0],
      },
      arm_right: {
        regex: /(Arm.*Right|Right.*Arm)/i,
        scale: [0.5, 1.0, 0.5],
        position: [0.25, 0.1, 0],
      },
    };

    // Create basic collision body
    let bbox = new THREE.Box3().setFromObject(humanModel);
    let size = new THREE.Vector3();
    bbox.getSize(size);

    // Create colliders for different body parts
    Object.entries(bodyParts).forEach(
      ([partName, { regex, scale, position }]) => {
        let partFound = false;

        // Try to find the specific body part
        humanModel.traverse((obj) => {
          if (obj.isMesh && regex.test(obj.name) && !partFound) {
            partFound = true;
            const partBbox = new THREE.Box3().setFromObject(obj);
            const partSize = new THREE.Vector3();
            partBbox.getSize(partSize);
            const partCenter = new THREE.Vector3();
            partBbox.getCenter(partCenter);

            // Create collider for this part
            const collider = new THREE.Mesh(
              new THREE.BoxGeometry(
                partSize.x * scale[0],
                partSize.y * scale[1],
                partSize.z * scale[2]
              ),
              new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
            );

            collider.position.copy(partCenter);
            // Apply additional position adjustment
            collider.position.x += position[0];
            collider.position.y += position[1];
            collider.position.z += position[2];

            collider.name = `collider_${partName}`;
            colliderGroup.add(collider);
            colliders.push(collider);
          }
        });

        // If specific part not found, create approximate collider
        if (!partFound && partName === "torso") {
          const torsoCollider = new THREE.Mesh(
            new THREE.BoxGeometry(size.x * 0.5, size.y * 0.3, size.z * 0.5),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
          );
          // torsoCollider.position.y = size.y * 0.1; // Upper torso
          torsoCollider.name = "collider_torso_approx";
          colliderGroup.add(torsoCollider);
          colliders.push(torsoCollider);
        }
      }
    );

    return colliderGroup;
  };

  // Modify the loadTshirt function
  const loadTshirt = (scene, humanModel) => {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous loads
      if (tshirtLoading) {
        reject(new Error("Skirt is already loading"));
        return;
      }

      setTshirtLoading(true);

      // Properly clean up the previous Skirt
      if (tshirtRef.current) {
        // Remove from scene
        scene.remove(tshirtRef.current);

        // Dispose of geometries and materials
        tshirtRef.current.traverse((node) => {
          if (node.isMesh) {
            if (node.geometry) node.geometry.dispose();
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach((material) => material.dispose());
              } else {
                node.material.dispose();
              }
            }

            // Clear any userData that might contain references
            if (node.userData && node.userData.clothParticles) {
              delete node.userData.clothParticles;
            }
            if (node.userData && node.userData.updateFunction) {
              delete node.userData.updateFunction;
            }
          }
        });

        // Clear the reference
        tshirtRef.current = null;
      }

      // Load the Skirt model
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);

      const tshirtPath = "/models/female/outfitmodels/skirt2.glb";

      loader.load(
        tshirtPath,
        (gltf) => {
          const tshirt = gltf.scene;
          tshirtRef.current = tshirt;

          // Add draggable property to the Skirt
          tshirt.userData.isDraggable = true;

          // Apply Skirt material
          tshirt.traverse((node) => {
            if (node.isMesh) {
              // Apply material and mark as draggable for raycasting
              node.userData.isDraggable = true;

              // Add a highlight material for hover effect
              node.userData.originalMaterial = node.material.clone();
              node.userData.highlightMaterial = node.material.clone();
              node.userData.highlightMaterial.emissive = new THREE.Color(
                0x222222
              );
              node.userData.highlightMaterial.emissiveIntensity = 0.3;
            }
          });

          // Position the Skirt properly
          positionTshirtOnBody(tshirt, humanModel, garmentConfig.fit);

          // Add the Skirt to the scene
          scene.add(tshirt);

          // Disable cloth physics when dragging is enabled
          if (enableClothSimulation && false) {
            // Disabling cloth physics for drag functionality
            setupClothPhysics(tshirt, humanModel);
          }

          setTshirtLoading(false);
          resolve(tshirt);
        },
        (xhr) => {
          console.log(
            "Skirt loading: " + (xhr.loaded / xhr.total) * 100 + "% loaded"
          );
        },
        (error) => {
          console.error("Error loading Skirt model:", error);
          setTshirtLoading(false);
          reject(error);
        }
      );
    });
  };

  // Position the Skirt on the human body
  const positionTshirtOnBody = (tshirt, humanModel, fitType = "regular") => {
    // Get human model dimensions
    const humanBbox = new THREE.Box3().setFromObject(humanModel);
    const humanCenter = new THREE.Vector3();
    humanBbox.getCenter(humanCenter);

    // IMPORTANT: Get the world center, considering the model's final position
    humanModel.getWorldPosition(humanCenter); // Use world position as a base reference

    // Reset Skirt rotation and scale
    tshirt.rotation.set(0, 0, 0);

    // Apply different fits based on the fitType
    const fitScaleFactors = {
      slim: 0.95,
      regular: 1.01,
      loose: 1.15,
    };

    const scaleFactor = fitScaleFactors[fitType] || fitScaleFactors.regular;

    // Scale the Skirt according to the human model and fit type
    tshirt.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Position the Skirt - typically needs to be aligned properly
    let tshirtOffset = 0;

    // Look for a torso part in the human model for better positioning
    humanModel.traverse((obj) => {
      if (
        obj.isMesh &&
        (obj.name.includes("torso") || obj.name.includes("Chest"))
      ) {
        const torsoBbox = new THREE.Box3().setFromObject(obj);
        const torsoCenter = new THREE.Vector3();
        torsoBbox.getCenter(torsoCenter);
        tshirtOffset = torsoCenter.y - humanCenter.y;
      }
    });

    // Position the Skirt on the torso
    tshirt.position.set(
      // 0.0002,0.02, 0.0000
      humanCenter.x,
      humanCenter.y,
      humanCenter.z
    );

    // Apply slight offset based on the human model specifics
    tshirt.position.y += 0.0;
    console.log("Skirt Position (after initial placement):", tshirt.position);
  };

  // Set up basic cloth physics for the Skirt
  const setupClothPhysics = (tshirt, humanModel) => {
    // This is now disabled for the draggable Skirt
    // Implementation kept for reference
  };

  // Handle mouse down for drag start
  const handleMouseDown = (event) => {
    // Check if orbit controls are active
    if (!controlsRef.current) return;

    // Only act on left mouse button
    if (event.button !== 0) return;

    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = event.target.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Find intersections with the Skirt
    const intersects = raycasterRef.current.intersectObjects(
      tshirtRef.current ? [tshirtRef.current] : [],
      true
    );

    if (intersects.length > 0) {
      // Check if the intersected object is part of the Skirt
      const object = intersects[0].object;
      if (
        object.userData.isDraggable ||
        (object.parent &&
          object.parent.userData &&
          object.parent.userData.isDraggable)
      ) {
        // Disable the orbit controls
        controlsRef.current.enabled = false;

        // Set dragging state
        isDraggingRef.current = true;
        selectedObjectRef.current = tshirtRef.current;

        // Calculate the offset from the center of the object
        const intersectionPoint = intersects[0].point;
        const objectWorldPos = new THREE.Vector3();
        tshirtRef.current.getWorldPosition(objectWorldPos);
        dragOffsetRef.current.subVectors(objectWorldPos, intersectionPoint);

        // Create a plane perpendicular to the camera for dragging
        const planeNormal = new THREE.Vector3();
        cameraRef.current.getWorldDirection(planeNormal);
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(
          planeNormal,
          intersectionPoint
        );

        // Add a visual highlight to show it's selected
        tshirtRef.current.traverse((node) => {
          if (node.isMesh && node.userData.highlightMaterial) {
            node.material = node.userData.highlightMaterial;
          }
        });

        // Stop event propagation
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (event) => {
    if (!isDraggingRef.current || !selectedObjectRef.current) return;

    // Calculate mouse position
    const rect = event.target.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create a ray from the camera through the mouse position
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Find where the ray intersects the drag plane
    const intersectionPoint = new THREE.Vector3();
    raycasterRef.current.ray.intersectPlane(
      dragPlaneRef.current,
      intersectionPoint
    );

    // Apply the original offset to the new position
    intersectionPoint.add(dragOffsetRef.current);

    // Update the Skirt position
    selectedObjectRef.current.position.copy(intersectionPoint);
    if (selectedObjectRef.current) {
      // Log less frequently if needed, e.g., using a counter or throttle function
      console.log(
        "Skirt Position (during drag):",
        selectedObjectRef.current.position
      );
    }

    event.preventDefault();
  };

  // Handle mouse up to end dragging
  const handleMouseUp = (event) => {
    if (isDraggingRef.current && selectedObjectRef.current) {
      // Re-enable orbit controls
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }

      // Reset the dragging state
      isDraggingRef.current = false;

      // Remove highlight
      if (selectedObjectRef.current) {
        selectedObjectRef.current.traverse((node) => {
          if (node.isMesh && node.userData.originalMaterial) {
            node.material = node.userData.originalMaterial;
          }
        });
      }

      selectedObjectRef.current = null;
    }
  };

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    camera.position.y = 1;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add event listeners for drag and drop functionality
    renderer.domElement.addEventListener("mousedown", handleMouseDown, false);
    renderer.domElement.addEventListener("mousemove", handleMouseMove, false);
    renderer.domElement.addEventListener("mouseup", handleMouseUp, false);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp, false);

    // Lighting
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

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.target.set(0, 1, 0); // Focus at the center of the body
    controlsRef.current = controls;

    // Load human model
    const loader = new GLTFLoader();
    const modelPath = "/models/female/femalerig2withskirt.glb"; // Path to your model in public folder

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Stop any animations on the human model
        if (gltf.animations && gltf.animations.length > 0) {
          // Just don't create an AnimationMixer or start any animations
          console.log("Animations found but not applied to prevent movement");
        }

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()); // Get the size

        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += size.y / 2; // Move the model up so its bottom is at Y=0
        model.position.x = 0; // Place the model on the ground
        model.position.z = 0; // Place the model on the ground
        console.log(
          "Human Model Position (after centering):",
          modelRef.current.position
        );
        // Apply body type or custom measurements
        // if (customMeasurements) {
        //   applyCustomMeasurements(model, customMeasurements);
        // } else {
        //   adjustBodyType(model, bodyType);
        // }

        // Apply material or color if provided in modelConfig
        if (modelConfig?.color) {
          model.traverse((node) => {
            if (node.isMesh) {
              node.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(modelConfig?.color),
                roughness: 0.7,
                metalness: 0.3,
              });

              // Enable shadows
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
        }

        scene.add(model);

        // Create body collider for physics
        bodyColliderRef.current = createBodyCollider(model);

        // Now load the Skirt
        loadTshirt(scene, model)
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to load Skirt:", error);
            setLoading(false);
          });
      },
      // Progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // Error callback
      (error) => {
        console.error("Error loading model:", error);
        setLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      animationRef.current = animationId;

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      // Remove event listeners
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("mouseup", handleMouseUp);
        renderer.domElement.removeEventListener("mouseleave", handleMouseUp);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Cancel animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up physics world
      if (physicsWorldRef.current) {
        // Remove all constraints
        while (physicsWorldRef.current.constraints.length) {
          physicsWorldRef.current.removeConstraint(
            physicsWorldRef.current.constraints[0]
          );
        }

        // Remove all bodies
        while (physicsWorldRef.current.bodies.length) {
          physicsWorldRef.current.removeBody(physicsWorldRef.current.bodies[0]);
        }
      }

      renderer.dispose();
    };
  }, []);

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
          Click and drag to move the Skirt
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
