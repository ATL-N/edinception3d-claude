// Remove the import that's causing the conflict
// import Ammo from "ammo.js";

let Ammo = null;
let physicsWorld = null;
let tempBtVec3_1;
let tempBtVec3_2;
let softBodyHelpers;

// Initialize Ammo.js physics
export const initPhysics = async () => {
  if (Ammo) return { Ammo, physicsWorld };

  return new Promise((resolve) => {
    // Load and initialize Ammo
    window.Ammo().then((AmmoLib) => {
      Ammo = AmmoLib;

      // Configure collision detection
      const collisionConfiguration =
        new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
      const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
      const broadphase = new Ammo.btDbvtBroadphase();
      const solver = new Ammo.btSequentialImpulseConstraintSolver();
      const softBodySolver = new Ammo.btDefaultSoftBodySolver();

      // Create physics world with soft body support
      physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
        dispatcher,
        broadphase,
        solver,
        collisionConfiguration,
        softBodySolver
      );

      // Set gravity
      physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));

      // Create temp working variables
      tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
      tempBtVec3_2 = new Ammo.btVector3(0, 0, 0);

      // Get the soft body helpers
      softBodyHelpers = new Ammo.btSoftBodyHelpers();

      resolve({ Ammo, physicsWorld });
    });
  });
};

// Update physics world
export const updatePhysics = (deltaTime) => {
  if (!physicsWorld) return;

  // Step simulation
  physicsWorld.stepSimulation(deltaTime, 10);
};

// Clean up physics
export const cleanupPhysics = () => {
  if (Ammo) {
    // Clean up Ammo.js objects
    Ammo.destroy(tempBtVec3_1);
    Ammo.destroy(tempBtVec3_2);
    Ammo.destroy(physicsWorld);
    physicsWorld = null;
  }
};
