import * as THREE from "three";

export const SUN_DIRECTION = new THREE.Vector3(0.55, 0.62, -0.55).normalize();

export const INITIAL_CAMERA = {
  fov: 40,
  near: 1.0,
  far: 18000,
  position: { x: 24, y: 1162, z: 38 },
  lookTarget: { x: 0, y: 1142, z: -45 },
};

export const OCEAN_CONFIG = {
  size: 26000,
  segments: 240,
  waveAmp: 1.0,
  timeMultiplier: 1.45,
};

export const INITIAL_AIRPLANE = {
  position: { x: 0, y: 1150, z: 0 },
  rotation: { x: 0.02, y: -0.28, z: -0.06 },
};

export const INITIAL_SHIP = {
  position: { x: 0, y: 0, z: -140 },
  rotationY: 0.36,
};

export const STREET_WORLD = {
  position: { x: 175, y: 18, z: -170 },
  truckPosition: { x: -6.8, y: 0.15, z: 0 },
  truckScale: 1.38,
};

export const SCENE_SECTION_HEIGHTS = ["130vh", "160vh", "160vh", "190vh", "220vh"];
export const TOTAL_SCROLL_HEIGHT = "860vh";

export const PALETTE_CONTAINERS = [
  new THREE.Color(0xb91c1c),
  new THREE.Color(0x1e3a8a),
  new THREE.Color(0x047857),
  new THREE.Color(0xd97706),
  new THREE.Color(0x0284c7),
  new THREE.Color(0x475569),
  new THREE.Color(0xc2410c),
];

