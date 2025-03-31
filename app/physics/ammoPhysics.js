import * as THREE from "three";

let Ammo;
let physicsWorld;
let tmpBtVec3_1;
let tmpBtVec3_2;

export const initPhysics = async () => {
  // Import and initialize Ammo.js
  return new Promise((resolve) => {
    if (typeof Ammo === "function") {
      Ammo()().then((AmmoLib) => {
        Ammo = AmmoLib;
        setupPhysicsWorld();
        resolve(Ammo);
      });
    } else {
      // If not a function, it's already initialized
      setupPhysicsWorld();
      resolve(Ammo);
    }
  });
};

const setupPhysicsWorld = () => {
  // Configure physics world
  const collisionConfiguration =
    new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const broadphase = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();
  const softBodySolver = new Ammo.btDefaultSoftBodySolver();

  physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration,
    softBodySolver
  );

  physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

  // Set up temporary working variables
  tmpBtVec3_1 = new Ammo.btVector3(0, 0, 0);
  tmpBtVec3_2 = new Ammo.btVector3(0, 0, 0);

  // Configure soft body world info
  const worldInfo = new Ammo.btSoftBodyWorldInfo();
  worldInfo.set_m_dispatcher(dispatcher);
  worldInfo.set_m_broadphase(broadphase);
  worldInfo.set_m_gravity(physicsWorld.getGravity());
  worldInfo.set_m_sparsesdf(new Ammo.btSparseSdf3());

  return { physicsWorld, worldInfo };
};

export const createSoftBody = (
  geometry,
  worldInfo,
  mass = 1,
  pressure = 10,
  margin = 0.2
) => {
  // Create array of vertices
  const vertices = geometry.attributes.position.array;
  const numVerts = vertices.length / 3;

  // Create triangles array
  const indices = [];
  if (geometry.index) {
    const indexArray = geometry.index.array;
    for (let i = 0; i < indexArray.length; i++) {
      indices.push(indexArray[i]);
    }
  } else {
    // If non-indexed, create indices
    for (let i = 0; i < numVerts; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
  }

  // Create softbody helper vectors
  const softBodyHelpers = new Ammo.btSoftBodyHelpers();

  // Create ammo vectors for vertices
  const btVerts = [];
  for (let i = 0; i < numVerts; i++) {
    const btVert = new Ammo.btVector3(
      vertices[i * 3],
      vertices[i * 3 + 1],
      vertices[i * 3 + 2]
    );
    btVerts.push(btVert);
  }

  // Create softbody
  const softBody = softBodyHelpers.CreateFromTriMesh(
    worldInfo,
    btVerts[0], // This will be replaced in the loop
    indices,
    indices.length / 3
  );

  // Clean up temporary btVectors
  btVerts.forEach((v) => Ammo.destroy(v));

  // Set softbody parameters
  softBody.get_m_cfg().set_viterations(40); // Velocity iterations
  softBody.get_m_cfg().set_piterations(40); // Position iterations
  softBody.get_m_cfg().set_kDF(0.1); // Dynamic friction
  softBody.get_m_cfg().set_kDP(0.01); // Damping
  softBody.get_m_cfg().set_kPR(pressure); // Pressure

  softBody.setTotalMass(mass, false);
  softBody.getCollisionShape().setMargin(margin);

  // Add softbody to world
  physicsWorld.addSoftBody(softBody, 1, -1);

  return softBody;
};

export const updateSoftBody = (mesh, softBody) => {
  const vertices = mesh.geometry.attributes.position.array;
  const numVerts = vertices.length / 3;

  // Update vertices based on softbody nodes
  for (let i = 0; i < numVerts; i++) {
    const nodePos = softBody.get_m_nodes().at(i).get_m_x();
    vertices[i * 3] = nodePos.x();
    vertices[i * 3 + 1] = nodePos.y();
    vertices[i * 3 + 2] = nodePos.z();
  }

  // Update the geometry
  mesh.geometry.attributes.position.needsUpdate = true;

  // Update normals if needed
  if (mesh.geometry.attributes.normal) {
    mesh.geometry.computeVertexNormals();
  }
};

export const updatePhysics = (deltaTime) => {
  if (physicsWorld) {
    physicsWorld.stepSimulation(deltaTime, 10);
  }
};

export const createRigidBody = (
  mesh,
  mass = 0,
  restitution = 0.2,
  friction = 0.5
) => {
  // Create collision shape
  let shape;

  // Create a bounding box for the mesh
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());

  // Create a box collision shape
  shape = new Ammo.btBoxShape(
    new Ammo.btVector3(size.x / 2, size.y / 2, size.z / 2)
  );

  // Set margin for collision shape
  shape.setMargin(0.05);

  // Create transform
  const transform = new Ammo.btTransform();
  transform.setIdentity();

  // Set position
  const pos = mesh.position;
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

  // Set rotation
  const quat = mesh.quaternion;
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

  // Create motion state
  const motionState = new Ammo.btDefaultMotionState(transform);

  // Calculate inertia
  const localInertia = new Ammo.btVector3(0, 0, 0);
  if (mass > 0) {
    shape.calculateLocalInertia(mass, localInertia);
  }

  // Create rigid body info
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    shape,
    localInertia
  );

  // Set restitution and friction
  rbInfo.set_m_restitution(restitution);
  rbInfo.set_m_friction(friction);

  // Create rigid body
  const body = new Ammo.btRigidBody(rbInfo);

  // Add to physics world
  physicsWorld.addRigidBody(body);

  // Store reference to the body on the mesh for later use
  mesh.userData.physicsBody = body;

  return body;
};

export const updateRigidBody = (mesh) => {
  if (!mesh.userData.physicsBody) return;

  const body = mesh.userData.physicsBody;
  const motionState = body.getMotionState();

  if (motionState) {
    // Get world transform from motion state
    const transform = new Ammo.btTransform();
    motionState.getWorldTransform(transform);

    // Get position and rotation from transform
    const pos = transform.getOrigin();
    const quat = transform.getRotation();

    // Update mesh position and rotation
    mesh.position.set(pos.x(), pos.y(), pos.z());
    mesh.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
  }
};

export const cleanup = () => {
  // Clean up Ammo.js objects
  if (tmpBtVec3_1) Ammo.destroy(tmpBtVec3_1);
  if (tmpBtVec3_2) Ammo.destroy(tmpBtVec3_2);

  // Cleanup physics world
  if (physicsWorld) {
    // Additional cleanup code for soft bodies, rigid bodies, etc.
    // ...
  }
};
