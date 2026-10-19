import * as THREE from "three";
import { freezeStaticGroup } from "../webgl/utils";
import { INITIAL_SHIP, PALETTE_CONTAINERS } from "../../domain/constants";

export function buildContainerShip(corrugatedBump: THREE.Texture): THREE.Group {
  const shipGroup = new THREE.Group();
  const vessel = new THREE.Group();

  const hullNavyMat = new THREE.MeshStandardMaterial({
    color: 0x0f294a,
    roughness: 0.42,
    metalness: 0.3,
  });
  const hullRedMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.55,
    metalness: 0.2,
  });
  const bootStripeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
    metalness: 0.1,
  });
  const deckMat = new THREE.MeshStandardMaterial({
    color: 0x273549,
    roughness: 0.72,
    metalness: 0.3,
  });
  const bridgeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.32,
    metalness: 0.12,
  });
  const bridgeGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x061526,
    roughness: 0.08,
    metalness: 0.25,
    clearcoat: 1.0,
  });
  const safetyOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.35,
    metalness: 0.15,
  });
  const steelGreyMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.5,
    metalness: 0.6,
  });

  const hullShape = new THREE.Shape();
  hullShape.moveTo(-15.0, -82);
  hullShape.lineTo(15.0, -82);
  hullShape.lineTo(16.0, 48);
  hullShape.quadraticCurveTo(16.0, 74, 0, 92);
  hullShape.quadraticCurveTo(-16.0, 74, -16.0, 48);
  hullShape.closePath();

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 12.2,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 1.6,
    bevelThickness: 2.2,
  });
  hullGeo.rotateX(Math.PI / 2);

  const hullMesh = new THREE.Mesh(hullGeo, hullNavyMat);
  hullMesh.position.y = 11.4;
  hullMesh.castShadow = true;
  hullMesh.receiveShadow = true;
  vessel.add(hullMesh);

  const waterline = hullMesh.clone();
  waterline.material = hullRedMat;
  waterline.scale.set(1.006, 0.52, 1.005);
  waterline.position.y = 6.4;
  vessel.add(waterline);

  const bulbGeo = new THREE.SphereGeometry(4.2, 20, 16);
  bulbGeo.scale(0.85, 0.95, 2.6);
  const bulbMesh = new THREE.Mesh(bulbGeo, hullRedMat);
  bulbMesh.position.set(0, 3.2, 92);
  vessel.add(bulbMesh);

  const bootStripe = hullMesh.clone();
  bootStripe.material = bootStripeMat;
  bootStripe.scale.set(1.009, 0.035, 1.007);
  bootStripe.position.y = 7.15;
  vessel.add(bootStripe);

  const bowShield = new THREE.Mesh(
    new THREE.CylinderGeometry(
      14.5,
      15.8,
      3.4,
      24,
      1,
      true,
      -Math.PI * 0.35,
      Math.PI * 0.7
    ),
    hullNavyMat
  );
  bowShield.position.set(0, 14.2, 72);
  vessel.add(bowShield);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(30.5, 1.2, 154),
    deckMat
  );
  deck.position.set(0, 12.6, -2);
  deck.receiveShadow = true;
  vessel.add(deck);

  const tower = new THREE.Group();
  for (let f = 0; f < 6; f++) {
    const w = 26 - f * 0.9;
    const d = 14.5 - f * 0.5;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(w, 3.1, d),
      bridgeWhiteMat
    );
    block.position.set(0, 14.5 + f * 3.1, -54);
    block.castShadow = true;
    block.receiveShadow = true;
    tower.add(block);

    const winStrip = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.15, 0.65, d - 2.5),
      bridgeGlassMat
    );
    winStrip.position.set(0, 14.8 + f * 3.1, -53.2);
    tower.add(winStrip);
  }

  const bridgeWing = new THREE.Mesh(
    new THREE.BoxGeometry(36.5, 3.2, 8.2),
    bridgeWhiteMat
  );
  bridgeWing.position.set(0, 33.1, -51.5);
  bridgeWing.castShadow = true;
  tower.add(bridgeWing);

  const bridgeWindows = new THREE.Mesh(
    new THREE.BoxGeometry(36.7, 1.35, 8.4),
    bridgeGlassMat
  );
  bridgeWindows.position.set(0, 33.4, -51.4);
  tower.add(bridgeWindows);

  const mastPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.7, 11, 12),
    bridgeWhiteMat
  );
  mastPole.position.set(0, 40.2, -51.5);
  tower.add(mastPole);

  const radarScanner = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.35, 0.6),
    bridgeWhiteMat
  );
  radarScanner.position.set(0, 44.5, -51.5);
  tower.add(radarScanner);

  const satDomeL = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 14, 12),
    bridgeWhiteMat
  );
  satDomeL.position.set(-6.5, 35.8, -51.5);
  tower.add(satDomeL);
  const satDomeR = satDomeL.clone();
  satDomeR.position.x = 6.5;
  tower.add(satDomeR);

  const funnelBase = new THREE.Mesh(
    new THREE.BoxGeometry(7.5, 11.5, 9.5),
    safetyOrangeMat
  );
  funnelBase.position.set(0, 34.5, -62.5);
  funnelBase.castShadow = true;
  tower.add(funnelBase);

  const funnelCap = new THREE.Mesh(
    new THREE.BoxGeometry(7.7, 2.2, 9.7),
    hullNavyMat
  );
  funnelCap.position.set(0, 39.8, -62.5);
  tower.add(funnelCap);

  for (const side of [-1, 1]) {
    const lifeboat = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 5.2, 12),
      safetyOrangeMat
    );
    lifeboat.rotation.x = Math.PI * 0.35;
    lifeboat.position.set(side * 14.2, 20.5, -56);
    tower.add(lifeboat);
  }

  vessel.add(tower);

  const bays = [-72, -37, -23, -9, 5, 19, 33, 47, 61];
  bays.forEach((zPos) => {
    const lashingBridge = new THREE.Mesh(
      new THREE.BoxGeometry(30.0, 5.5, 0.8),
      steelGreyMat
    );
    lashingBridge.position.set(0, 15.5, zPos - 6.8);
    vessel.add(lashingBridge);
  });

  const containerGeo = new THREE.BoxGeometry(2.55, 2.65, 12.4);
  const containerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.54,
    metalness: 0.32,
    bumpMap: corrugatedBump,
    bumpScale: 0.09,
  });

  const transforms: Array<{
    x: number;
    y: number;
    z: number;
    color: THREE.Color;
  }> = [];

  bays.forEach((zPos, bIdx) => {
    for (let col = -5; col <= 5; col++) {
      if (zPos > 55 && Math.abs(col) > 3) continue;
      const xPos = col * 2.68;
      const maxTiers = zPos > 45 ? 4 : bIdx % 2 === 0 ? 6 : 5;
      for (let t = 0; t < maxTiers; t++) {
        if (t === maxTiers - 1 && Math.abs(col * 3 + bIdx) % 4 === 0) continue;
        const cIdx =
          Math.abs(bIdx * 5 + col * 3 + t * 2) % PALETTE_CONTAINERS.length;
        transforms.push({
          x: xPos,
          y: 14.5 + t * 2.68,
          z: zPos,
          color: PALETTE_CONTAINERS[cIdx],
        });
      }
    }
  });

  const instancedContainers = new THREE.InstancedMesh(
    containerGeo,
    containerMat,
    transforms.length
  );
  instancedContainers.castShadow = true;
  instancedContainers.receiveShadow = true;

  const dummy = new THREE.Object3D();
  transforms.forEach((tr, i) => {
    dummy.position.set(tr.x, tr.y, tr.z);
    dummy.updateMatrix();
    instancedContainers.setMatrixAt(i, dummy.matrix);
    instancedContainers.setColorAt(i, tr.color);
  });
  instancedContainers.instanceMatrix.needsUpdate = true;
  if (instancedContainers.instanceColor) {
    instancedContainers.instanceColor.needsUpdate = true;
  }
  vessel.add(instancedContainers);

  freezeStaticGroup(vessel);

  shipGroup.add(vessel);
  shipGroup.position.set(
    INITIAL_SHIP.position.x,
    INITIAL_SHIP.position.y,
    INITIAL_SHIP.position.z
  );
  shipGroup.rotation.y = INITIAL_SHIP.rotationY;

  return shipGroup;
}

