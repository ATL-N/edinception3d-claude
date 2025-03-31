import * as THREE from "three";
import { initPhysics } from "./ammoPhysics";

// Maps to track physics bodies to meshes
const clothMeshes = new Map();
const physicsBodies = new Map();

// Create a cloth simulation from a mesh
export const createClothFromMesh = async (mesh, config = {}) => {
  const { Ammo, physicsWorld } = await initPhysics();

  // Default config
  const clothConfig = {
    mass: 1.0,
    stiffness: 0.9,
    damping: 0.05,
    pressure: 0.0,
    margin: 0.05,
    vDamping: 0.0,
    ...config,
  };

  // Store original vertices for later use
  const originalGeometry = mesh.geometry.clone();

  // Create a cloth helper geometry (simplified if needed)
  const clothHelperGeometry = simplifyGeometryForCloth(originalGeometry);
  const vertices =
    clothHelperGeometry.vertices ||
    clothHelperGeometry.attributes.position.array;
  const indices = clothHelperGeometry.index
    ? clothHelperGeometry.index.array
    : generateIndices(clothHelperGeometry);

  // Create softbody
  const softBodyHelpers = new Ammo.btSoftBodyHelpers();
  const clothShape = createAmmoClothShape(
    Ammo,
    softBodyHelpers,
    vertices,
    indices
  );

  // Configure cloth physics properties
  clothShape.get_m_cfg().set_viterations(10);
  clothShape.get_m_cfg().set_piterations(10);
  clothShape.setTotalMass(clothConfig.mass, false);
  clothShape.get_m_cfg().set_kDF(clothConfig.damping);
  clothShape.get_m_cfg().set_kDP(clothConfig.damping);
  clothShape.get_m_cfg().set_kVCF(clothConfig.stiffness);
  clothShape.get_m_cfg().set_kPR(clothConfig.pressure);
  clothShape.get_m_materials().get(0).set_m_kLST(clothConfig.stiffness);
  clothShape.get_m_materials().get(0).set_m_kAST(clothConfig.stiffness);
  clothShape.get_m_materials().get(0).set_m_kVST(clothConfig.stiffness);
  clothShape.setMargin(clothConfig.margin);

  // Add to physics world
  physicsWorld.addSoftBody(clothShape, 1, -1);

  // Store the mapping between mesh and physics body
  clothMeshes.set(clothShape, mesh);
  physicsBodies.set(mesh.uuid, clothShape);

  return {
    mesh,
    body: clothShape,
    update: () => updateClothMesh(mesh, clothShape, originalGeometry),
  };
};

// Helper to create Ammo cloth shape from vertices and indices
const createAmmoClothShape = (Ammo, softBodyHelpers, vertices, indices) => {
  // Convert THREE.js geometry to Ammo triangles
  const numTriangles = indices.length / 3;
  const trianglesMesh = new Ammo.btTriangleMesh();

  const v0 = new Ammo.btVector3();
  const v1 = new Ammo.btVector3();
  const v2 = new Ammo.btVector3();

  for (let i = 0; i < numTriangles; i++) {
    const i3 = i * 3;

    const vIdx1 = indices[i3];
    const vIdx2 = indices[i3 + 1];
    const vIdx3 = indices[i3 + 2];

    const p1 = getVertexPosition(vertices, vIdx1);
    const p2 = getVertexPosition(vertices, vIdx2);
    const p3 = getVertexPosition(vertices, vIdx3);

    v0.setValue(p1.x, p1.y, p1.z);
    v1.setValue(p2.x, p2.y, p2.z);
    v2.setValue(p3.x, p3.y, p3.z);

    trianglesMesh.addTriangle(v0, v1, v2, true);
  }

  // Create cloth shape
  const clothShape = softBodyHelpers.CreateFromTriMesh(
    Ammo.getPointer(trianglesMesh),
    trianglesMesh.getNumTriangles(),
    false
  );

  // Clean up temporary vectors
  Ammo.destroy(v0);
  Ammo.destroy(v1);
  Ammo.destroy(v2);

  return clothShape;
};

// Helper to get vertex position from array or attribute
const getVertexPosition = (vertices, index) => {
  // If vertices is an array of Vector3 (old geometry format)
  if (vertices[index] && vertices[index].x !== undefined) {
    return vertices[index];
  }

  // If vertices is a Float32Array (BufferGeometry)
  const idx3 = index * 3;
  return {
    x: vertices[idx3],
    y: vertices[idx3 + 1],
    z: vertices[idx3 + 2],
  };
};

// Generate indices for non-indexed geometries
const generateIndices = (geometry) => {
  const vertCount = geometry.attributes.position.count;
  const indices = [];

  for (let i = 0; i < vertCount; i += 3) {
    indices.push(i, i + 1, i + 2);
  }

  return indices;
};

// Simplify geometry for cloth simulation if needed
const simplifyGeometryForCloth = (geometry) => {
  // For complex garment meshes, you might want to create a simplified version
  // This is just a placeholder - actual simplification would depend on your needs
  return geometry;
};

// Update mesh vertices based on physics simulation
const updateClothMesh = (mesh, softBody, originalGeometry) => {
  const vertices = mesh.geometry.attributes.position.array;
  const numVerts = vertices.length / 3;

  // Get the nodes from the soft body
  const nodes = softBody.get_m_nodes();

  // Update vertex positions
  for (let i = 0; i < numVerts; i++) {
    const node = nodes.at(i);
    const nodePos = node.get_m_x();

    const vertIdx = i * 3;
    vertices[vertIdx] = nodePos.x();
    vertices[vertIdx + 1] = nodePos.y();
    vertices[vertIdx + 2] = nodePos.z();
  }

  // Update the geometry
  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
};

// Pin specific vertices of the cloth to fixed points
export const pinClothVertex = (clothBody, vertexIndex, position) => {
  if (!clothBody) return;

  const node = clothBody.get_m_nodes().at(vertexIndex);
  node.m_im = 0; // Make node immovable (infinite mass)

  // Set position if provided
  if (position) {
    const nodePos = node.get_m_x();
    nodePos.setValue(position.x, position.y, position.z);
  }
};

// Add collision detection between cloth and another mesh
export const addClothCollider = async (clothBody, colliderMesh) => {
  const { Ammo, physicsWorld } = await initPhysics();

  // Create a rigid body for the collider
  const shape = createColliderShape(colliderMesh, Ammo);

  const mass = 0; // Static body
  const transform = new Ammo.btTransform();
  transform.setIdentity();

  // Set position from mesh
  const pos = colliderMesh.position;
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

  // Set rotation from mesh
  const quat = colliderMesh.quaternion;
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

  const motionState = new Ammo.btDefaultMotionState(transform);
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    shape,
    new Ammo.btVector3(0, 0, 0)
  );
  const body = new Ammo.btRigidBody(rbInfo);

  physicsWorld.addRigidBody(body);

  // Store body reference
  physicsBodies.set(colliderMesh.uuid, body);

  return body;
};

// Create a collider shape from a mesh
const createColliderShape = (mesh, Ammo) => {
  // Create a shape based on mesh bounding box for simplicity
  // More complex shapes could be used for better collisions
  const bbox = new THREE.Box3().setFromObject(mesh);
  const size = bbox.getSize(new THREE.Vector3());

  return new Ammo.btBoxShape(
    new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2)
  );
};

// Remove a cloth from simulation
export const removeCloth = (mesh) => {
  const body = physicsBodies.get(mesh.uuid);

  if (body) {
    clothMeshes.delete(body);
    physicsBodies.delete(mesh.uuid);

    // Remove from physics world
    if (window.Ammo && window.physicsWorld) {
      window.physicsWorld.removeSoftBody(body);
    }
  }
};
