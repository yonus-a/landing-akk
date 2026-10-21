import * as THREE from "three";
import { freezeStaticGroup } from "../webgl/utils";
import { STREET_WORLD } from "../../domain/constants";
import {
  createTruckGroundShadowTexture,
  createHeroContainerFrontTexture,
  createHeroContainerRoofTexture,
} from "../textures/proceduralTextures";

export function buildStaticStreetAndRealisticTruck(
  corrugatedBump: THREE.Texture,
  heroContainerTex: THREE.Texture,
  grilleMeshTex: THREE.Texture,
  asphaltTex: THREE.Texture,
  sharedGlowTex: THREE.Texture
): THREE.Group {
  const streetWorldGroup = new THREE.Group();
  streetWorldGroup.position.set(
    STREET_WORLD.position.x,
    STREET_WORLD.position.y,
    STREET_WORLD.position.z
  );

  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.85,
    metalness: 0.08,
  });
  const darkConcreteMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.9,
    metalness: 0.1,
  });
  const asphaltMat = new THREE.MeshStandardMaterial({
    map: asphaltTex,
    roughness: 0.82,
    metalness: 0.08,
  });
  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.75,
    metalness: 0.05,
  });
  const lineWhiteMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
  const lineYellowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const curbRedMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.6,
  });
  const metalPoleMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.35,
    metalness: 0.8,
  });
  const craneRedMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.42,
    metalness: 0.38,
  });

  // 1. Seawall Quay & Coastal Boulevard Roadbed
  const seawall = new THREE.Mesh(
    new THREE.BoxGeometry(52, 38, 720),
    darkConcreteMat
  );
  seawall.position.set(5, -19, 0);
  seawall.receiveShadow = true;
  streetWorldGroup.add(seawall);

  const urbanGround = new THREE.Mesh(
    new THREE.BoxGeometry(280, 38, 720),
    concreteMat
  );
  urbanGround.position.set(170, -19.05, 0);
  urbanGround.receiveShadow = true;
  streetWorldGroup.add(urbanGround);

  const roadDeck = new THREE.Mesh(
    new THREE.BoxGeometry(32, 0.3, 720),
    asphaltMat
  );
  roadDeck.receiveShadow = true;
  streetWorldGroup.add(roadDeck);

  const yellowLine1 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.24, 720),
    lineYellowMat
  );
  yellowLine1.rotation.x = -Math.PI / 2;
  yellowLine1.position.set(-0.3, 0.18, 0);
  streetWorldGroup.add(yellowLine1);

  const yellowLine2 = yellowLine1.clone();
  yellowLine2.position.x = 0.3;
  streetWorldGroup.add(yellowLine2);

  const edgeLineL = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 720),
    lineWhiteMat
  );
  edgeLineL.rotation.x = -Math.PI / 2;
  edgeLineL.position.set(-14.6, 0.18, 0);
  streetWorldGroup.add(edgeLineL);

  const edgeLineR = edgeLineL.clone();
  edgeLineR.position.x = 14.6;
  streetWorldGroup.add(edgeLineR);

  const leftSidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.65, 720),
    sidewalkMat
  );
  leftSidewalk.position.set(-18.4, 0.32, 0);
  leftSidewalk.receiveShadow = true;
  streetWorldGroup.add(leftSidewalk);

  const rightSidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 0.65, 720),
    sidewalkMat
  );
  rightSidewalk.position.set(20.7, 0.32, 0);
  rightSidewalk.receiveShadow = true;
  streetWorldGroup.add(rightSidewalk);

  const seaParapet = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 1.35, 720),
    concreteMat
  );
  seaParapet.position.set(-20.2, 0.9, 0);
  seaParapet.castShadow = true;
  streetWorldGroup.add(seaParapet);

  // Instanced Lane Dashes & Curbs
  const dashCount = 28;
  const dashInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.28, 0.04, 6.0),
    lineWhiteMat,
    dashCount * 2
  );
  const curbRedInst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.55, 0.7, 4.5),
    curbRedMat,
    dashCount * 2
  );
  const dummy = new THREE.Object3D();
  let dIdx = 0;
  for (let i = 0; i < dashCount; i++) {
    const z = -240 + i * 18;
    dummy.position.set(-7.4, 0.17, z);
    dummy.updateMatrix();
    dashInst.setMatrixAt(dIdx, dummy.matrix);

    dummy.position.set(-15.7, 0.35, z);
    dummy.updateMatrix();
    curbRedInst.setMatrixAt(dIdx++, dummy.matrix);

    dummy.position.set(7.4, 0.17, z);
    dummy.updateMatrix();
    dashInst.setMatrixAt(dIdx, dummy.matrix);

    dummy.position.set(15.7, 0.35, z);
    dummy.updateMatrix();
    curbRedInst.setMatrixAt(dIdx++, dummy.matrix);
  }
  streetWorldGroup.add(dashInst);
  streetWorldGroup.add(curbRedInst);

  // Port Cranes
  function createPortCrane(zPos: number) {
    const crane = new THREE.Group();
    crane.position.set(-16, 0, zPos);
    const legGeo = new THREE.BoxGeometry(1.3, 38, 1.3);
    [
      [-3, -6],
      [-3, 6],
      [5, -6],
      [5, 6],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, craneRedMat);
      leg.position.set(lx, 19, lz);
      leg.castShadow = true;
      crane.add(leg);
    });
    const boom = new THREE.Mesh(
      new THREE.BoxGeometry(58, 2.1, 3.0),
      craneRedMat
    );
    boom.position.set(-18, 36, 0);
    boom.castShadow = true;
    crane.add(boom);

    const topHouse = new THREE.Mesh(
      new THREE.BoxGeometry(8, 3.4, 13),
      concreteMat
    );
    topHouse.position.set(1, 38.4, 0);
    crane.add(topHouse);
    return crane;
  }
  streetWorldGroup.add(createPortCrane(-52));
  streetWorldGroup.add(createPortCrane(-125));

  const buildingColors = [0x334155, 0x1e293b, 0x475569, 0x0f172a];
  for (let i = -5; i <= 5; i++) {
    const z = i * 36;
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.24, 13.5, 10),
      metalPoleMat
    );
    pole.position.set(17.2, 7.0, z);
    pole.castShadow = true;
    streetWorldGroup.add(pole);

    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.2, 0.2),
      metalPoleMat
    );
    arm.position.set(15.1, 13.6, z);
    streetWorldGroup.add(arm);

    const bH = 22 + (Math.abs(i * 7) % 24);
    const bMat = new THREE.MeshStandardMaterial({
      color: buildingColors[Math.abs(i) % buildingColors.length],
      roughness: 0.5,
      metalness: 0.3,
    });
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(24, bH, 28), bMat);
    bldg.position.set(42, bH * 0.5, z);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    streetWorldGroup.add(bldg);
  }

  // Heavy Tractor Cab & Trailer
  const truckRoot = new THREE.Group();
  truckRoot.position.set(
    STREET_WORLD.truckPosition.x,
    STREET_WORLD.truckPosition.y,
    STREET_WORLD.truckPosition.z
  );
  truckRoot.scale.setScalar(STREET_WORLD.truckScale);
  streetWorldGroup.add(truckRoot);

  // Ground Ambient Occlusion / Drop Shadow Plane (Anchors Truck & Container to Road)
  const groundShadowTex = createTruckGroundShadowTexture();
  const groundShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 24.5),
    new THREE.MeshBasicMaterial({
      map: groundShadowTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    })
  );
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.set(0, 0.08, -1.2);
  truckRoot.add(groundShadow);

  const cabPaintMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc, // High-contrast Arctic White / Technical Silver
    roughness: 0.22,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  });

  const cabSilverAccentMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.85,
  });

  const darkPlasticTrimMat = new THREE.MeshStandardMaterial({
    color: 0x151921,
    roughness: 0.62,
    metalness: 0.18,
  });

  const grilleMeshMat = new THREE.MeshStandardMaterial({
    map: grilleMeshTex,
    roughness: 0.45,
    metalness: 0.5,
  });

  const chassisSteelMat = new THREE.MeshStandardMaterial({
    color: 0x1e242d,
    roughness: 0.58,
    metalness: 0.52,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.06,
    metalness: 0.98,
  });

  const brushedAluminumMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.28,
    metalness: 0.88,
  });

  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.86,
    metalness: 0.06,
  });

  const cabGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x040a14,
    roughness: 0.03,
    metalness: 0.15,
    reflectivity: 1.0,
    clearcoat: 1.0,
  });

  const twistLockYellowMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.4,
    metalness: 0.3,
  });
  const amberLightMat = new THREE.MeshBasicMaterial({ color: 0xffa000 });
  const headLightGlowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const drlIceBlueMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
  const tailLightRedMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });

  // High-Contrast Wheel & Truck Materials engineered for Graphite Pencil Sketch & 3D Realism
  const highContrastTireMat = new THREE.MeshStandardMaterial({
    color: 0x222a36, // Deep graphite rubber - strong contrast against asphalt & ground shadow
    roughness: 0.82,
    metalness: 0.1,
  });

  const brightRimLipMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pure white/chrome outer rim lip for razor-sharp circular pencil contours
    roughness: 0.05,
    metalness: 0.98,
  });

  const polishedWheelDiscMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Polished Alcoa aluminum dished wheel face
    roughness: 0.15,
    metalness: 0.92,
  });

  const whiteWheelAccentMat = new THREE.MeshBasicMaterial({
    color: 0xffffff, // High-visibility sidewall contour ring
  });

  const brakeRotorMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.45,
    metalness: 0.65,
  });

  const brakeCaliperMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.38,
  });

  const fenderMat = new THREE.MeshStandardMaterial({
    color: 0x181e28, // Heavy-duty composite thermoplastic mudguards
    roughness: 0.65,
    metalness: 0.2,
  });

  const fenderReflectorMat = new THREE.MeshBasicMaterial({
    color: 0xf8fafc, // High-visibility white reflective contour stripe
  });

  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
  });

  // Chassis rails
  for (const side of [-1, 1]) {
    const tractorRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.34, 8.2),
      chassisSteelMat
    );
    tractorRail.position.set(side * 0.48, 0.92, 4.3);
    tractorRail.castShadow = true;
    truckRoot.add(tractorRail);
  }

  const catwalk = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 2.3),
    brushedAluminumMat
  );
  catwalk.position.set(0, 1.11, 3.85);
  truckRoot.add(catwalk);

  const fifthWheelPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.58, 0.1, 20),
    darkPlasticTrimMat
  );
  fifthWheelPlate.position.set(0, 1.24, 1.95);
  fifthWheelPlate.rotation.x = 0.05;
  truckRoot.add(fifthWheelPlate);

  // Hoses
  [
    { x: -0.22, col: 0xdc2626 },
    { x: 0.0, col: 0x2563eb },
    { x: 0.22, col: 0xeab308 },
  ].forEach((c) => {
    const hose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 1.45, 8),
      new THREE.MeshStandardMaterial({ color: c.col, roughness: 0.4 })
    );
    hose.position.set(c.x, 1.75, 4.25);
    hose.rotation.x = 0.42;
    truckRoot.add(hose);
  });

  // Fuel tanks & skirts & Pneumatic Equipment
  for (const side of [-1, 1]) {
    const fuelTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 2.05, 24),
      brushedAluminumMat
    );
    fuelTank.rotation.x = Math.PI / 2;
    fuelTank.position.set(side * 0.94, 0.86, 4.15);
    fuelTank.castShadow = true;
    truckRoot.add(fuelTank);

    // Fuel Tank Chrome Mounting Straps
    for (const strapZ of [-0.65, 0.65]) {
      const strap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.375, 0.375, 0.05, 24),
        chromeMat
      );
      strap.rotation.x = Math.PI / 2;
      strap.position.set(side * 0.94, 0.86, 4.15 + strapZ);
      truckRoot.add(strap);
    }

    const sideSkirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.64, 2.55),
      cabPaintMat
    );
    sideSkirt.position.set(side * 1.22, 0.82, 4.15);
    sideSkirt.castShadow = true;
    truckRoot.add(sideSkirt);

    const skirtTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.045, 2.5),
      chromeMat
    );
    skirtTrim.position.set(side * 1.22, 0.56, 4.15);
    truckRoot.add(skirtTrim);
  }

  // Dual Aluminum Compressed Air Tanks under Chassis (Brake Reservoirs)
  for (const side of [-1, 1]) {
    for (let t = 0; t < 2; t++) {
      const airTank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.88, 16),
        brushedAluminumMat
      );
      airTank.rotation.x = Math.PI / 2;
      airTank.position.set(side * 0.58, 0.72 + t * 0.24, 3.1);
      truckRoot.add(airTank);
    }
  }

  // DEF (AdBlue) Emissions Tank with Signature Blue Cap
  const defTank = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.44, 0.52),
    darkPlasticTrimMat
  );
  defTank.position.set(1.02, 0.82, 5.55);
  truckRoot.add(defTank);

  const defCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.05, 14),
    new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 })
  );
  defCap.position.set(1.12, 1.06, 5.55);
  truckRoot.add(defCap);

  // Heavy Duty Battery Box on Driver Side
  const batteryBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.38, 0.65),
    darkPlasticTrimMat
  );
  batteryBox.position.set(-1.02, 0.8, 5.55);
  truckRoot.add(batteryBox);

  // Exhaust stacks
  for (const side of [-1, 1]) {
    const stack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 3.55, 16),
      chromeMat
    );
    stack.position.set(side * 1.14, 2.75, 4.78);
    stack.castShadow = true;
    truckRoot.add(stack);

    const stackHeatShield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.115, 1.8, 16),
      brushedAluminumMat
    );
    stackHeatShield.position.set(side * 1.14, 2.15, 4.78);
    truckRoot.add(stackHeatShield);
  }

  // Cab group
  const cabGroup = new THREE.Group();
  truckRoot.add(cabGroup);

  const cabShape = new THREE.Shape();
  cabShape.moveTo(-1.68, 0.0);
  cabShape.lineTo(1.72, 0.0);
  cabShape.lineTo(1.76, 1.18);
  cabShape.lineTo(1.44, 2.34);
  cabShape.quadraticCurveTo(1.22, 2.98, 0.45, 3.12);
  cabShape.lineTo(-1.62, 3.06);
  cabShape.lineTo(-1.68, 2.7);
  cabShape.closePath();

  const cabWidth = 2.34;
  const cabGeo = new THREE.ExtrudeGeometry(cabShape, {
    depth: cabWidth,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  cabGeo.translate(0, 0, -cabWidth / 2);
  cabGeo.rotateY(-Math.PI / 2);

  const cabShell = new THREE.Mesh(cabGeo, cabPaintMat);
  cabShell.position.set(0, 1.15, 6.75);
  cabShell.castShadow = true;
  cabShell.receiveShadow = true;
  cabGroup.add(cabShell);

  for (const side of [-1, 1]) {
    const sideExtender = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 3.08, 0.58),
      cabPaintMat
    );
    sideExtender.position.set(side * 1.21, 2.68, 4.82);
    sideExtender.castShadow = true;
    cabGroup.add(sideExtender);
  }

  const spoilerShape = new THREE.Shape();
  spoilerShape.moveTo(-1.62, 3.04);
  spoilerShape.lineTo(0.25, 3.08);
  spoilerShape.quadraticCurveTo(-0.55, 3.55, -1.68, 3.65);
  spoilerShape.closePath();

  const spoilerGeo = new THREE.ExtrudeGeometry(spoilerShape, {
    depth: 2.26,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  });
  spoilerGeo.translate(0, 0, -1.13);
  spoilerGeo.rotateY(-Math.PI / 2);
  const roofSpoiler = new THREE.Mesh(spoilerGeo, cabPaintMat);
  roofSpoiler.position.set(0, 1.15, 6.75);
  roofSpoiler.castShadow = true;
  cabGroup.add(roofSpoiler);

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(2.24, 1.08, 0.08),
    cabGlassMat
  );
  windshield.position.set(0, 2.94, 8.33);
  windshield.rotation.x = -0.27;
  cabGroup.add(windshield);

  // Side Windows (Driver & Passenger) with Black Rubber Weatherstripping
  for (const side of [-1, 1]) {
    const sideWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.82, 1.25),
      cabGlassMat
    );
    sideWindow.position.set(side * 1.20, 2.88, 6.45);
    cabGroup.add(sideWindow);

    const sideWindowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.88, 1.31),
      darkPlasticTrimMat
    );
    sideWindowFrame.position.set(side * 1.19, 2.88, 6.45);
    cabGroup.add(sideWindowFrame);

    // Architectural Door Cutline Seam
    const doorSeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 2.1, 0.04),
      darkPlasticTrimMat
    );
    doorSeam.position.set(side * 1.21, 2.2, 5.75);
    cabGroup.add(doorSeam);

    // Driver Cab Grab Handle
    const doorHandle = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.28),
      chromeMat
    );
    doorHandle.position.set(side * 1.23, 2.25, 6.1);
    cabGroup.add(doorHandle);

    // 3-Tier Driver Entry Steps
    for (let st = 0; st < 3; st++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.52),
        brushedAluminumMat
      );
      step.position.set(side * 1.16, 0.62 + st * 0.28, 6.75);
      cabGroup.add(step);
    }
  }

  const wiperCowl = new THREE.Mesh(
    new THREE.BoxGeometry(2.28, 0.16, 0.12),
    darkPlasticTrimMat
  );
  wiperCowl.position.set(0, 2.38, 8.48);
  cabGroup.add(wiperCowl);

  for (const wx of [-0.52, 0.45]) {
    const wiperBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.035, 0.04),
      darkPlasticTrimMat
    );
    wiperBlade.position.set(wx, 2.48, 8.53);
    wiperBlade.rotation.z = -0.09;
    cabGroup.add(wiperBlade);
  }

  const sunVisor = new THREE.Mesh(
    new THREE.BoxGeometry(2.42, 0.25, 0.18),
    darkPlasticTrimMat
  );
  sunVisor.position.set(0, 3.55, 8.18);
  sunVisor.rotation.x = 0.18;
  sunVisor.castShadow = true;
  cabGroup.add(sunVisor);

  const visorChrome = new THREE.Mesh(
    new THREE.BoxGeometry(2.44, 0.04, 0.19),
    chromeMat
  );
  visorChrome.position.set(0, 3.44, 8.2);
  cabGroup.add(visorChrome);

  for (let m = -2; m <= 2; m++) {
    const markerLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 0.04),
      amberLightMat
    );
    markerLed.position.set(m * 0.46, 3.56, 8.27);
    cabGroup.add(markerLed);
  }

  const lightBarPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 2.1, 12),
    chromeMat
  );
  lightBarPipe.rotation.z = Math.PI / 2;
  lightBarPipe.position.set(0, 4.18, 7.65);
  cabGroup.add(lightBarPipe);

  [-0.72, -0.25, 0.25, 0.72].forEach((lx) => {
    const spotHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.09, 0.14, 16),
      chromeMat
    );
    spotHousing.rotation.x = Math.PI / 2;
    spotHousing.position.set(lx, 4.26, 7.68);
    cabGroup.add(spotHousing);

    const spotLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.095, 14),
      headLightGlowMat
    );
    spotLens.position.set(lx, 4.26, 7.76);
    cabGroup.add(spotLens);
  });

  for (const side of [-1, 1]) {
    const airHorn = new THREE.Mesh(
      new THREE.ConeGeometry(0.075, 0.72, 14),
      chromeMat
    );
    airHorn.rotation.x = -Math.PI / 2;
    airHorn.position.set(side * 0.96, 4.24, 7.25);
    cabGroup.add(airHorn);
  }

  const upperGrilleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 1.12, 0.1),
    darkPlasticTrimMat
  );
  upperGrilleFrame.position.set(0, 1.76, 8.51);
  cabGroup.add(upperGrilleFrame);

  const upperGrilleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.76, 1.02, 0.12),
    grilleMeshMat
  );
  upperGrilleMesh.position.set(0, 1.76, 8.52);
  cabGroup.add(upperGrilleMesh);

  for (let r = 0; r < 4; r++) {
    const barW = 1.72 - r * 0.06;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(barW, 0.075, 0.15),
      chromeMat
    );
    rib.position.set(0, 2.12 - r * 0.24, 8.53);
    cabGroup.add(rib);
  }

  const centerBadge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.16, 6),
    chromeMat
  );
  centerBadge.rotation.x = Math.PI / 2;
  centerBadge.position.set(0, 2.02, 8.54);
  cabGroup.add(centerBadge);

  for (const side of [-1, 1]) {
    const cornerVane = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 1.08, 0.16),
      cabPaintMat
    );
    cornerVane.position.set(side * 1.12, 1.76, 8.48);
    cornerVane.rotation.y = side * 0.25;
    cabGroup.add(cornerVane);
  }

  const bumperCenter = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.64, 0.42),
    cabPaintMat
  );
  bumperCenter.position.set(0, 0.85, 8.46);
  bumperCenter.castShadow = true;
  cabGroup.add(bumperCenter);

  const lowerIntake = new THREE.Mesh(
    new THREE.BoxGeometry(1.52, 0.42, 0.1),
    grilleMeshMat
  );
  lowerIntake.position.set(0, 0.84, 8.64);
  cabGroup.add(lowerIntake);

  for (const lr of [-0.08, 0.1]) {
    const lRib = new THREE.Mesh(
      new THREE.BoxGeometry(1.46, 0.055, 0.12),
      chromeMat
    );
    lRib.position.set(0, 0.84 + lr, 8.65);
    cabGroup.add(lRib);
  }

  const chinSkidPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.12, 0.4),
    brushedAluminumMat
  );
  chinSkidPlate.position.set(0, 0.5, 8.48);
  cabGroup.add(chinSkidPlate);

  const licensePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.12, 0.04),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  licensePlate.position.set(0, 0.58, 8.68);
  cabGroup.add(licensePlate);

  for (const side of [-1, 1]) {
    const hlHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.28, 0.14),
      darkPlasticTrimMat
    );
    hlHousing.position.set(side * 0.99, 0.94, 8.62);
    cabGroup.add(hlHousing);

    const hlLens = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.15, 0.06),
      headLightGlowMat
    );
    hlLens.position.set(side * 0.96, 0.95, 8.67);
    cabGroup.add(hlLens);

    const drlBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.035, 0.07),
      drlIceBlueMat
    );
    drlBottom.position.set(side * 0.99, 0.83, 8.67);
    cabGroup.add(drlBottom);

    const drlOuter = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.24, 0.07),
      drlIceBlueMat
    );
    drlOuter.position.set(side * 1.18, 0.94, 8.67);
    cabGroup.add(drlOuter);

    const turnBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.035, 0.07),
      amberLightMat
    );
    turnBar.position.set(side * 0.96, 1.05, 8.67);
    cabGroup.add(turnBar);

    const fogLamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.06, 14),
      headLightGlowMat
    );
    fogLamp.rotation.x = Math.PI / 2;
    fogLamp.position.set(side * 0.96, 0.64, 8.66);
    cabGroup.add(fogLamp);

    const hlHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sharedGlowTex,
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    hlHalo.position.set(side * 0.98, 0.92, 8.78);
    hlHalo.scale.set(1.8, 1.8, 1.8);
    cabGroup.add(hlHalo);
  }

  for (const side of [-1, 1]) {
    const sideWin = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.92, 1.38),
      cabGlassMat
    );
    sideWin.position.set(side * 1.22, 2.86, 7.38);
    cabGroup.add(sideWin);

    const winSillChrome = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.04, 1.44),
      chromeMat
    );
    winSillChrome.position.set(side * 1.23, 2.38, 7.36);
    cabGroup.add(winSillChrome);

    const sleeperWin = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.55, 0.68),
      cabGlassMat
    );
    sleeperWin.position.set(side * 1.22, 3.05, 5.85);
    cabGroup.add(sleeperWin);

    const doorPocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.12, 0.3),
      darkPlasticTrimMat
    );
    doorPocket.position.set(side * 1.24, 1.92, 6.85);
    cabGroup.add(doorPocket);

    const doorHandle = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.045, 0.26),
      chromeMat
    );
    doorHandle.position.set(side * 1.26, 1.92, 6.85);
    cabGroup.add(doorHandle);

    const fenderArch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.74, 0.74, 0.36, 20, 1, false, 0, Math.PI),
      darkPlasticTrimMat
    );
    fenderArch.rotation.z = Math.PI / 2;
    fenderArch.rotation.y = Math.PI / 2;
    fenderArch.position.set(side * 1.12, 0.58, 6.55);
    cabGroup.add(fenderArch);

    for (let st = 0; st < 3; st++) {
      const stepBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.045, 0.52),
        brushedAluminumMat
      );
      stepBox.position.set(side * 1.16, 0.62 + st * 0.24, 7.75);
      cabGroup.add(stepBox);
    }

    const mainMirrorShell = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.62, 0.24),
      cabPaintMat
    );
    mainMirrorShell.position.set(side * 1.48, 2.92, 7.92);
    mainMirrorShell.castShadow = true;
    cabGroup.add(mainMirrorShell);

    const mainMirrorGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.56, 0.03),
      chromeMat
    );
    mainMirrorGlass.position.set(side * 1.48, 2.92, 7.8);
    cabGroup.add(mainMirrorGlass);

    const convexMirrorShell = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.24, 0.2),
      darkPlasticTrimMat
    );
    convexMirrorShell.position.set(side * 1.48, 2.44, 7.92);
    cabGroup.add(convexMirrorShell);

    const mirrorArmUpper = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.045, 0.05),
      darkPlasticTrimMat
    );
    mirrorArmUpper.position.set(side * 1.34, 3.18, 7.98);
    cabGroup.add(mirrorArmUpper);

    const mirrorArmLower = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.045, 0.05),
      darkPlasticTrimMat
    );
    mirrorArmLower.position.set(side * 1.34, 2.34, 7.98);
    cabGroup.add(mirrorArmLower);
  }

  const blindSpotArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8),
    darkPlasticTrimMat
  );
  blindSpotArm.rotation.x = Math.PI / 3;
  blindSpotArm.position.set(-0.92, 3.55, 8.35);
  cabGroup.add(blindSpotArm);

  const blindSpotMirror = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 10),
    darkPlasticTrimMat
  );
  blindSpotMirror.scale.set(1.2, 0.8, 0.6);
  blindSpotMirror.position.set(-0.92, 3.48, 8.52);
  cabGroup.add(blindSpotMirror);

  // Skeletal Trailer
  const trailerGroup = new THREE.Group();
  truckRoot.add(trailerGroup);

  for (const side of [-1, 1]) {
    const trailerBeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.36, 12.6),
      chassisSteelMat
    );
    trailerBeam.position.set(side * 0.52, 1.18, -3.8);
    trailerBeam.castShadow = true;
    trailerGroup.add(trailerBeam);
  }

  [-9.95, 2.35].forEach((zBolster) => {
    const bolster = new THREE.Mesh(
      new THREE.BoxGeometry(2.58, 0.18, 0.26),
      chassisSteelMat
    );
    bolster.position.set(0, 1.28, zBolster);
    bolster.castShadow = true;
    trailerGroup.add(bolster);

    for (const side of [-1, 1]) {
      const twistLockHousing = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.22, 0.28),
        twistLockYellowMat
      );
      twistLockHousing.position.set(side * 1.18, 1.3, zBolster);
      trailerGroup.add(twistLockHousing);
    }
  });

  for (const side of [-1, 1]) {
    const legUpper = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.78, 0.18),
      chassisSteelMat
    );
    legUpper.position.set(side * 0.82, 0.78, -0.35);
    legUpper.castShadow = true;
    trailerGroup.add(legUpper);

    const footPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.06, 0.38),
      chassisSteelMat
    );
    footPad.position.set(side * 0.82, 0.38, -0.35);
    trailerGroup.add(footPad);

    for (const barY of [0.68, 0.92]) {
      const sideGuard = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.08, 4.2),
        brushedAluminumMat
      );
      sideGuard.position.set(side * 1.18, barY, -3.2);
      trailerGroup.add(sideGuard);
    }
  }

  const rearBumper = new THREE.Mesh(
    new THREE.BoxGeometry(2.52, 0.24, 0.18),
    brushedAluminumMat
  );
  rearBumper.position.set(0, 0.62, -10.05);
  rearBumper.castShadow = true;
  trailerGroup.add(rearBumper);

  for (const side of [-1, 1]) {
    const bumperPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.55, 0.14),
      chassisSteelMat
    );
    bumperPost.position.set(side * 0.95, 0.92, -10.02);
    trailerGroup.add(bumperPost);

    const tailLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.14, 0.08),
      tailLightRedMat
    );
    tailLight.position.set(side * 0.92, 0.62, -10.12);
    trailerGroup.add(tailLight);

    const mudflap = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.65, 0.04),
      tireRubberMat
    );
    mudflap.position.set(side * 0.95, 0.48, -9.85);
    trailerGroup.add(mudflap);
  }

  // High-Detail 40ft Shipping Container
  const heroContainerGroup = new THREE.Group();
  heroContainerGroup.position.set(0, 2.72, -3.8);
  trailerGroup.add(heroContainerGroup);

  const heroFrontTex = createHeroContainerFrontTexture();
  const heroRoofTex = createHeroContainerRoofTexture();

  const heroSideMat = new THREE.MeshStandardMaterial({
    map: heroContainerTex,
    bumpMap: corrugatedBump,
    bumpScale: 0.08,
    roughness: 0.42,
    metalness: 0.22,
  });
  const heroRoofMat = new THREE.MeshStandardMaterial({
    map: heroRoofTex,
    bumpMap: corrugatedBump,
    bumpScale: 0.06,
    roughness: 0.35,
    metalness: 0.15,
  });
  const heroFrontMat = new THREE.MeshStandardMaterial({
    map: heroFrontTex,
    bumpMap: corrugatedBump,
    bumpScale: 0.08,
    roughness: 0.48,
    metalness: 0.18,
  });
  const heroDoorMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    bumpMap: corrugatedBump,
    bumpScale: 0.08,
    roughness: 0.4,
    metalness: 0.16,
  });
  const heroUnderMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.85,
    metalness: 0.1,
  });

  // 6 Face materials: Right, Left, Top, Bottom, Front, Rear
  const containerMats = [
    heroSideMat,  // +X: Right flank (White with corrugation & branding)
    heroSideMat,  // -X: Left flank facing camera (White with corrugation & "آریان خودرو خاورمیانه")
    heroRoofMat,  // +Y: Top roof (Bright white with transverse corrugation ribs)
    heroUnderMat, // -Y: Bottom face (Deep shadow)
    heroFrontMat, // +Z: Front end facing cab (Shaded white with horizontal ribs)
    heroDoorMat,  // -Z: Rear doors (White with door seals & lock rods)
  ];
  const containerBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.54, 2.68, 12.38),
    containerMats
  );
  containerBody.castShadow = true;
  containerBody.receiveShadow = true;
  heroContainerGroup.add(containerBody);

  // 12 Structural Edge Beams Defining the Rectangular Prism (Architectural Shading & Edge Definition)
  const containerRailMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.55,
  });

  // 4 Longitudinal Edge Rails
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const sideRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 12.42),
        containerRailMat
      );
      sideRail.position.set(sx * 1.27, sy * 1.34, 0);
      heroContainerGroup.add(sideRail);
    }
  }

  // 4 Vertical Corner Posts
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerPost = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 2.68, 0.09),
        containerRailMat
      );
      cornerPost.position.set(sx * 1.27, 0, sz * 6.19);
      heroContainerGroup.add(cornerPost);
    }
  }

  // 4 Transverse End Headers & Sills
  for (const sz of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const endHeader = new THREE.Mesh(
        new THREE.BoxGeometry(2.54, 0.08, 0.08),
        containerRailMat
      );
      endHeader.position.set(0, sy * 1.34, sz * 6.19);
      heroContainerGroup.add(endHeader);
    }
  }

  // Dark contact shadow directly beneath container
  const containerUnderShadow = new THREE.Mesh(
    new THREE.BoxGeometry(2.62, 0.14, 12.46),
    new THREE.MeshBasicMaterial({ color: 0x070b12 })
  );
  containerUnderShadow.position.set(0, -1.38, 0);
  heroContainerGroup.add(containerUnderShadow);

  const castingGeo = new THREE.BoxGeometry(0.24, 0.24, 0.26);
  const castingMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.6,
  });
  for (const cx of [-1.18, 1.18]) {
    for (const cy of [-1.25, 1.25]) {
      for (const cz of [-6.08, 6.08]) {
        const casting = new THREE.Mesh(castingGeo, castingMat);
        casting.position.set(cx, cy, cz);
        heroContainerGroup.add(casting);
      }
    }
  }

  const doorGasket = new THREE.Mesh(
    new THREE.BoxGeometry(2.42, 2.48, 0.04),
    tireRubberMat
  );
  doorGasket.position.set(0, 0, -6.19);
  heroContainerGroup.add(doorGasket);

  for (const side of [-1, 1]) {
    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 2.4, 0.06),
      heroDoorMat
    );
    doorPanel.position.set(side * 0.59, 0, -6.21);
    heroContainerGroup.add(doorPanel);
  }

  [-0.85, -0.32, 0.32, 0.85].forEach((lx) => {
    const lockRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 2.44, 10),
      chromeMat
    );
    lockRod.position.set(lx, 0, -6.26);
    heroContainerGroup.add(lockRod);
  });

  // Wheels - High-definition, high-contrast assembly engineered for Pencil Sketch shader & 3D realism
  const tireRadius = 0.58;
  const tireWidth = 0.32;
  const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 32);
  tireGeo.rotateZ(Math.PI / 2);

  const sidewallGeo = new THREE.CylinderGeometry(tireRadius - 0.015, tireRadius - 0.015, tireWidth - 0.05, 32);
  sidewallGeo.rotateZ(Math.PI / 2);

  // Pure white/chrome outer rim lip (generates high-contrast Sobel edge gradients for pencil shader)
  const rimLipGeo = new THREE.TorusGeometry(0.36, 0.022, 12, 36);

  // Polished Alcoa aluminum wheel barrel
  const rimBarrelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.33, 32);
  rimBarrelGeo.rotateZ(Math.PI / 2);

  // Steer pointed bullet hub cap
  const steerHubGeo = new THREE.ConeGeometry(0.12, 0.18, 18);
  steerHubGeo.rotateZ(-Math.PI / 2);

  // Rear heavy oil-bath hub
  const driveHubGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.36, 18);
  driveHubGeo.rotateZ(Math.PI / 2);

  const lugNutGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.36, 6);
  lugNutGeo.rotateZ(Math.PI / 2);

  const brakeRotorGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24);
  brakeRotorGeo.rotateZ(Math.PI / 2);

  const brakeCaliperGeo = new THREE.BoxGeometry(0.14, 0.18, 0.16);

  // White circular contour ring on outer sidewall face for razor-sharp circular pencil contours
  const sidewallRingGeo = new THREE.RingGeometry(0.44, 0.47, 36);
  sidewallRingGeo.rotateY(Math.PI / 2);

  function createRealisticWheelUnit(isDual: boolean) {
    const wheelGroup = new THREE.Group();
    const offsets = isDual ? [-0.17, 0.17] : [0];

    // Brake rotor & caliper inside the wheel assembly
    const rotor = new THREE.Mesh(brakeRotorGeo, brakeRotorMat);
    rotor.position.x = isDual ? -0.05 : 0;
    wheelGroup.add(rotor);

    const caliper = new THREE.Mesh(brakeCaliperGeo, brakeCaliperMat);
    caliper.position.set(isDual ? -0.05 : 0, 0.2, 0);
    wheelGroup.add(caliper);

    offsets.forEach((ox, idx) => {
      // 1. Heavy Rubber Tire
      const tire = new THREE.Mesh(tireGeo, highContrastTireMat);
      tire.position.x = ox;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // 2. Sidewall curvature bulge
      const bulge = new THREE.Mesh(sidewallGeo, highContrastTireMat);
      bulge.position.x = ox;
      wheelGroup.add(bulge);

      // 3. Polished Alcoa Aluminum Rim Face
      const rim = new THREE.Mesh(rimBarrelGeo, polishedWheelDiscMat);
      rim.position.x = ox;
      wheelGroup.add(rim);

      // 4. Brilliant White/Chrome Outer Rim Ring (outer face)
      if (!isDual || idx === 1) {
        const rimLip = new THREE.Mesh(rimLipGeo, brightRimLipMat);
        rimLip.position.x = ox + (isDual ? 0.16 : 0.16);
        wheelGroup.add(rimLip);

        // 5. White sidewall branding contour ring
        const sidewallRing = new THREE.Mesh(sidewallRingGeo, whiteWheelAccentMat);
        sidewallRing.position.x = ox + 0.165;
        wheelGroup.add(sidewallRing);
      }
    });

    const outerX = isDual ? 0.17 : 0;

    // 6. Center Hub Assembly
    if (!isDual) {
      // Front steer pointed chrome bullet hub
      const steerHub = new THREE.Mesh(steerHubGeo, brightRimLipMat);
      steerHub.position.x = outerX + 0.16;
      wheelGroup.add(steerHub);
    } else {
      // Rear heavy drive / trailer hub with red center oil plug
      const driveHub = new THREE.Mesh(driveHubGeo, chassisSteelMat);
      driveHub.position.x = outerX;
      wheelGroup.add(driveHub);

      const oilPlug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.38, 12),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
      );
      oilPlug.rotateZ(Math.PI / 2);
      oilPlug.position.x = outerX;
      wheelGroup.add(oilPlug);
    }

    // 7. 10 High-Contrast Chrome Lug Nuts around 0.24m radius circle
    for (let n = 0; n < 10; n++) {
      const ang = (n / 10) * Math.PI * 2;
      const lug = new THREE.Mesh(lugNutGeo, brightRimLipMat);
      lug.position.set(
        outerX,
        Math.cos(ang) * 0.24,
        Math.sin(ang) * 0.24
      );
      wheelGroup.add(lug);
    }

    return wheelGroup;
  }

  // Heavy Arched Fenders (Mudguards) over tractor drive axles and trailer axles
  for (const side of [-1, 1]) {
    // Tractor tandem drive axle arched mudguards (z: 2.55, 1.22)
    [2.55, 1.22].forEach((fz) => {
      const fenderMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 0.76, 24, 1, true, -Math.PI / 2.3, Math.PI / 1.15),
        fenderMat
      );
      fenderMesh.position.set(side * 1.08, 0.55, fz);
      fenderMesh.rotation.y = side === 1 ? 0 : Math.PI;
      fenderMesh.castShadow = true;
      truckRoot.add(fenderMesh);

      const fenderRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.022, 8, 24, Math.PI / 1.15),
        fenderReflectorMat
      );
      fenderRim.position.set(side * 1.46, 0.55, fz);
      fenderRim.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;
      fenderRim.rotation.z = -Math.PI / 2.3;
      truckRoot.add(fenderRim);
    });

    // Trailer triple-axle arched mudguards (z: -6.45, -7.75, -9.05)
    [-6.45, -7.75, -9.05].forEach((fz) => {
      const trailerFender = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 0.76, 24, 1, true, -Math.PI / 2.3, Math.PI / 1.15),
        fenderMat
      );
      trailerFender.position.set(side * 1.08, 0.55, fz);
      trailerFender.rotation.y = side === 1 ? 0 : Math.PI;
      trailerFender.castShadow = true;
      truckRoot.add(trailerFender);

      const trFenderRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.022, 8, 24, Math.PI / 1.15),
        fenderReflectorMat
      );
      trFenderRim.position.set(side * 1.46, 0.55, fz);
      trFenderRim.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;
      trFenderRim.rotation.z = -Math.PI / 2.3;
      truckRoot.add(trFenderRim);

      // Heavy mudflap behind each trailer wheel
      const axleMudflap = new THREE.Mesh(
        new THREE.BoxGeometry(0.66, 0.42, 0.035),
        fenderMat
      );
      axleMudflap.position.set(side * 1.08, 0.38, fz - 0.65);
      truckRoot.add(axleMudflap);

      const mudflapStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.05, 0.04),
        fenderReflectorMat
      );
      mudflapStripe.position.set(side * 1.08, 0.22, fz - 0.66);
      truckRoot.add(mudflapStripe);
    });
  }

  const axleSpecs = [
    { z: 6.55, dual: false },
    { z: 2.55, dual: true },
    { z: 1.22, dual: true },
    { z: -6.45, dual: true },
    { z: -7.75, dual: true },
    { z: -9.05, dual: true },
  ];

  axleSpecs.forEach((ax) => {
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.3, 14),
      chassisSteelMat
    );
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, 0.55, ax.z);
    truckRoot.add(shaft);

    for (const side of [-1, 1]) {
      const wUnit = createRealisticWheelUnit(ax.dual);
      // Track width calibrated so wheels are boldly visible and flush with container profile
      wUnit.position.set(side * (ax.dual ? 1.08 : 1.18), 0.55, ax.z);
      if (side === -1) wUnit.rotation.y = Math.PI;
      truckRoot.add(wUnit);
    }
  });

  freezeStaticGroup(streetWorldGroup);

  return streetWorldGroup;
}

