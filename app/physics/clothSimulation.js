import * as THREE from "three";
import { createSoftBody, updateSoftBody } from "./physicsUtils";

export class ClothSimulation {
  constructor(mesh, worldInfo, physicsWorld) {
    this.mesh = mesh;
    this.worldInfo = worldInfo;
    this.physicsWorld = physicsWorld;
    this.softBody = null;
    this.anchors = [];
    this.initialized = false;
  }

  init(mass = 1, pressure = 10, fixedPoints = []) {
    if (this.initialized) return;

    // Clone the original geometry to avoid modifying it
    this.mesh.geometry = this.mesh.geometry.clone();

    // Create the soft body from the mesh geometry
    this.softBody = createSoftBody(
      this.mesh.geometry,
      this.worldInfo,
      mass,
      pressure
    );

    // Configure simulation parameters specifically for cloth
    this.softBody.get_m_cfg().set_kDF(0.1); // Dynamic friction
    this.softBody.get_m_cfg().set_kDP(0.01); // Damping
    this.softBody.get_m_cfg().set_kPR(pressure); // Pressure (lower for cloth)

    // Disable cluster collision to improve performance for cloth
    this.softBody.get_m_cfg().set_kCHR(0.0);

    // Set bending constraints
    this.softBody.get_m_cfg().set_kSHR(1.0); // Structural/shearing resistance
    this.softBody.get_m_cfg().set_kDF(0.2); // Dynamic friction

    // Adjust air drag coefficient for more realistic cloth behavior
    this.softBody.get_m_cfg().set_kLF(0.05);

    // Add fixed points (anchors) if any are specified
    this.createAnchors(fixedPoints);

    this.initialized = true;
  }

  createAnchors(fixedPointIndices) {
    if (!this.softBody) return;

    const nodes = this.softBody.get_m_nodes();
    const numNodes = nodes.size();

    // If no specific points are given, fix the top row of the cloth
    if (fixedPointIndices.length === 0) {
      // Assume cloth is oriented with top row having highest y value
      let maxY = -Infinity;
      let topPoints = [];

      // Find max Y coordinate
      for (let i = 0; i < numNodes; i++) {
        const node = nodes.at(i);
        const y = node.get_m_x().y();
        if (y > maxY) maxY = y;
      }

      // Find nodes at or near max Y
      const threshold = 0.1; // Tolerance
      for (let i = 0; i < numNodes; i++) {
        const node = nodes.at(i);
        if (Math.abs(node.get_m_x().y() - maxY) < threshold) {
          topPoints.push(i);
        }
      }

      fixedPointIndices = topPoints;
    }

    // Set specified nodes as fixed (anchors)
    for (let i = 0; i < fixedPointIndices.length; i++) {
      const nodeIndex = fixedPointIndices[i];
      if (nodeIndex < numNodes) {
        const node = nodes.at(nodeIndex);
        node.set_m_im(0); // Set inverse mass to 0 to make it fixed
        this.anchors.push(nodeIndex);
      }
    }
  }

  moveAnchor(anchorIndex, position) {
    if (!this.softBody || anchorIndex >= this.anchors.length) return;

    const nodeIndex = this.anchors[anchorIndex];
    const nodes = this.softBody.get_m_nodes();
    const node = nodes.at(nodeIndex);

    // Convert THREE.Vector3 to Ammo.btVector3
    const posAmmo = new Ammo.btVector3(position.x, position.y, position.z);

    // Set the position of the node
    node.set_m_x(posAmmo);
    node.set_m_q(posAmmo);

    // Clean up
    Ammo.destroy(posAmmo);
  }

  update() {
    if (!this.softBody || !this.mesh) return;

    // Update the mesh vertices based on softbody simulation
    updateSoftBody(this.mesh, this.softBody);
  }

  applyWind(direction, strength = 1.0) {
    if (!this.softBody) return;

    const windVec = new Ammo.btVector3(
      direction.x * strength,
      direction.y * strength,
      direction.z * strength
    );

    // Apply wind force to all nodes
    const nodes = this.softBody.get_m_nodes();
    const numNodes = nodes.size();

    for (let i = 0; i < numNodes; i++) {
      const node = nodes.at(i);
      node.m_f.setAdd(windVec);
    }

    // Clean up
    Ammo.destroy(windVec);
  }

  setMass(mass) {
    if (!this.softBody) return;
    this.softBody.setTotalMass(mass, false);
  }

  setPressure(pressure) {
    if (!this.softBody) return;
    this.softBody.get_m_cfg().set_kPR(pressure);
  }

  setStiffness(stiffness) {
    if (!this.softBody) return;
    this.softBody.get_m_cfg().set_kSHR(stiffness);
  }

  dispose() {
    // Remove the soft body from the physics world
    if (this.softBody && this.physicsWorld) {
      this.physicsWorld.removeSoftBody(this.softBody);
    }

    // Reset references
    this.softBody = null;
    this.anchors = [];
    this.initialized = false;
  }
}
