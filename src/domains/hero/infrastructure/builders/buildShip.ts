import * as THREE from "three";
import { freezeStaticGroup } from "../webgl/utils";
import { INITIAL_SHIP, PALETTE_CONTAINERS } from "../../domain/constants";
import {
  createShipContainerTexture,
  createShipHullDecalTexture,
  createShipWakeTexture,
} from "../textures/proceduralTextures";

export function buildContainerShip(corrugatedBump: THREE.Texture): THREE.Group {
  const shipGroup = new THREE.Group();
  const vessel = new THREE.Group();

  /* ============================================================
     1. MATERIALS & FINISHES (TUNED FOR GRAPHITE EDGE EXTRACTION)
     ============================================================ */
  const hullNavyMat = new THREE.MeshStandardMaterial({
    color: 0x3b5b8f,
    roughness: 0.55,
    metalness: 0.05,
  });

  const hullRedMat = new THREE.MeshStandardMaterial({
    color: 0xa8433f,
    roughness: 0.6,
    metalness: 0.05,
  });

  const bootStripeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1,
  });

  const deckMat = new THREE.MeshStandardMaterial({
    color: 0x7d8c74,
    roughness: 0.8,
    metalness: 0.05,
  });

  const bridgeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.28,
    metalness: 0.12,
  });

  const bridgeGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x3e5f82,
    roughness: 0.12,
    metalness: 0.2,
    clearcoat: 1.0,
  });

  const safetyOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.35,
    metalness: 0.15,
  });

  const safetyAmberMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.2,
  });

  const steelGreyMat = new THREE.MeshStandardMaterial({
    color: 0x8d98a8,
    roughness: 0.55,
    metalness: 0.2,
  });

  // High-contrast galvanized steel for lashing rods (creates crisp diagonal graphite strokes)
  const lashingRodMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.25,
    metalness: 0.75,
  });

  const machineryYellowMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.45,
    metalness: 0.3,
  });

  /* ============================================================
     2. HULL, BULBOUS BOW, WATERLINE & DECK
     ============================================================ */
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

  // Red underwater antifouling hull section
  const waterline = hullMesh.clone();
  waterline.material = hullRedMat;
  waterline.scale.set(1.006, 0.52, 1.005);
  waterline.position.y = 6.4;
  vessel.add(waterline);

  // Bulbous bow (reduces hydrodynamic drag & throws signature bow wave)
  const bulbGeo = new THREE.SphereGeometry(4.2, 20, 16);
  bulbGeo.scale(0.85, 0.95, 2.6);
  const bulbMesh = new THREE.Mesh(bulbGeo, hullRedMat);
  bulbMesh.position.set(0, 3.2, 92);
  vessel.add(bulbMesh);

  // High-contrast white bootstripe
  const bootStripe = hullMesh.clone();
  bootStripe.material = bootStripeMat;
  bootStripe.scale.set(1.009, 0.035, 1.007);
  bootStripe.position.y = 7.15;
  vessel.add(bootStripe);

  // Bow flare shield (sheer strake)
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

  // Main weather deck
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(30.5, 1.2, 154),
    deckMat
  );
  deck.position.set(0, 12.6, -2);
  deck.receiveShadow = true;
  vessel.add(deck);

  /* ============================================================
     3. "JAHAN-GOSTAR" HULL BRANDING & NAUTICAL MARKINGS
     ============================================================ */
  const hullDecalTex = createShipHullDecalTexture();
  const hullDecalMat = new THREE.MeshBasicMaterial({
    map: hullDecalTex,
    transparent: true,
  });

  // Starboard hull decal
  const hullDecalStarboard = new THREE.Mesh(
    new THREE.PlaneGeometry(74, 9.2),
    hullDecalMat
  );
  hullDecalStarboard.position.set(16.32, 9.5, -4);
  hullDecalStarboard.rotation.y = Math.PI / 2;
  vessel.add(hullDecalStarboard);

  // Port hull decal
  const hullDecalPort = new THREE.Mesh(
    new THREE.PlaneGeometry(74, 9.2),
    hullDecalMat
  );
  hullDecalPort.position.set(-16.32, 9.5, -4);
  hullDecalPort.rotation.y = -Math.PI / 2;
  vessel.add(hullDecalPort);

  // Bow Hawse Pipes and Heavy Bower Anchors
  for (const side of [-1, 1]) {
    // Hawse hole (recessed pocket)
    const hawseHole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 2.2, 12),
      deckMat
    );
    hawseHole.rotation.z = side * 0.45;
    hawseHole.position.set(side * 14.8, 9.6, 78);
    vessel.add(hawseHole);

    // Stockless anchor flukes
    const anchor = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.8, 0.6),
      steelGreyMat
    );
    anchor.rotation.y = side * 0.3;
    anchor.position.set(side * 15.3, 9.2, 77.8);
    vessel.add(anchor);
  }

  /* ============================================================
     4. FORECASTLE WAVE BREAKWATER & BOW MOORING GEAR
     ============================================================ */
  // V-Shaped Forecastle Breakwater (deflects sea spray away from Bay 1)
  const breakwaterGroup = new THREE.Group();
  const bwLeft = new THREE.Mesh(
    new THREE.BoxGeometry(14.8, 3.8, 0.6),
    hullNavyMat
  );
  bwLeft.position.set(-6.8, 14.5, 71.5);
  bwLeft.rotation.y = -0.52;
  breakwaterGroup.add(bwLeft);

  const bwRight = new THREE.Mesh(
    new THREE.BoxGeometry(14.8, 3.8, 0.6),
    hullNavyMat
  );
  bwRight.position.set(6.8, 14.5, 71.5);
  bwRight.rotation.y = 0.52;
  breakwaterGroup.add(bwRight);

  // Breakwater top rail cap in high-contrast white
  const bwCapL = new THREE.Mesh(
    new THREE.BoxGeometry(15.0, 0.4, 0.8),
    bridgeWhiteMat
  );
  bwCapL.position.set(-6.8, 16.4, 71.5);
  bwCapL.rotation.y = -0.52;
  breakwaterGroup.add(bwCapL);

  const bwCapR = new THREE.Mesh(
    new THREE.BoxGeometry(15.0, 0.4, 0.8),
    bridgeWhiteMat
  );
  bwCapR.position.set(6.8, 16.4, 71.5);
  bwCapR.rotation.y = 0.52;
  breakwaterGroup.add(bwCapR);

  // Vertical triangular stiffeners on the aft side of the breakwater
  for (let s = -4; s <= 4; s += 2) {
    const gusset = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 3.2, 1.8),
      steelGreyMat
    );
    gusset.position.set(s * 2.8, 14.2, 69.8);
    breakwaterGroup.add(gusset);
  }
  vessel.add(breakwaterGroup);

  // Bow Mooring Machinery (Anchor Windlasses & Cable Drums)
  for (const side of [-1, 1]) {
    const windlassBase = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.5, 4.2),
      machineryYellowMat
    );
    windlassBase.position.set(side * 6.5, 13.8, 80);
    vessel.add(windlassBase);

    const cableDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 2.8, 14),
      steelGreyMat
    );
    cableDrum.rotation.z = Math.PI / 2;
    cableDrum.position.set(side * 6.5, 14.8, 80);
    vessel.add(cableDrum);

    // Mooring bollards
    const bollard = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 1.4, 10),
      bridgeWhiteMat
    );
    bollard.position.set(side * 11.2, 13.8, 83);
    vessel.add(bollard);
  }

  // Bow Jackstaff (Flagpole)
  const jackstaff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.22, 6.5, 8),
    bridgeWhiteMat
  );
  jackstaff.position.set(0, 16.5, 88.5);
  vessel.add(jackstaff);

  /* ============================================================
     5. SUPERSTRUCTURE & NAVIGATION BRIDGE TOWER
     ============================================================ */
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

    // Horizontal panoramic accommodation window ribbons
    const winStrip = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.15, 0.65, d - 2.5),
      bridgeGlassMat
    );
    winStrip.position.set(0, 14.8 + f * 3.1, -53.2);
    tower.add(winStrip);

    // Exterior deck walkway handrails in crisp white
    const deckRailing = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.3, 0.4, d + 0.3),
      steelGreyMat
    );
    deckRailing.position.set(0, 13.1 + f * 3.1, -54);
    tower.add(deckRailing);
  }

  // Flying Bridge Wings (Extend beyond ship's beam for line-of-sight navigation)
  const bridgeWing = new THREE.Mesh(
    new THREE.BoxGeometry(37.5, 3.2, 8.4),
    bridgeWhiteMat
  );
  bridgeWing.position.set(0, 33.1, -51.5);
  bridgeWing.castShadow = true;
  tower.add(bridgeWing);

  // Enclosed navigation wheelhouse windows
  const bridgeWindows = new THREE.Mesh(
    new THREE.BoxGeometry(37.7, 1.45, 8.6),
    bridgeGlassMat
  );
  bridgeWindows.position.set(0, 33.4, -51.4);
  tower.add(bridgeWindows);

  // Navigation lights on wingtips (Port Red, Starboard Green)
  const portLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  portLight.position.set(-18.8, 33.5, -51.5);
  tower.add(portLight);

  const stbdLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x10b981 })
  );
  stbdLight.position.set(18.8, 33.5, -51.5);
  tower.add(stbdLight);

  // Main Radar & Communications Mast
  const mastPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.75, 11.5, 12),
    bridgeWhiteMat
  );
  mastPole.position.set(0, 40.4, -51.5);
  tower.add(mastPole);

  // S-Band Long-Range Radar Scanner Bar
  const radarScannerS = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 0.35, 0.65),
    bridgeWhiteMat
  );
  radarScannerS.position.set(0, 44.8, -51.5);
  tower.add(radarScannerS);

  // X-Band Compact Radar Scanner Bar
  const radarScannerX = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.28, 0.5),
    bridgeWhiteMat
  );
  radarScannerX.position.set(0, 42.4, -51.5);
  radarScannerX.rotation.y = 0.75;
  tower.add(radarScannerX);

  // Satellite Communications Radomes
  const satDomeL = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 14, 12),
    bridgeWhiteMat
  );
  satDomeL.position.set(-6.8, 35.8, -51.5);
  tower.add(satDomeL);

  const satDomeR = satDomeL.clone();
  satDomeR.position.x = 6.8;
  tower.add(satDomeR);

  // Engine Exhaust Funnel with Jahan-Gostar Brand Band
  const funnelBase = new THREE.Mesh(
    new THREE.BoxGeometry(7.8, 12.0, 9.8),
    safetyOrangeMat
  );
  funnelBase.position.set(0, 34.5, -62.5);
  funnelBase.castShadow = true;
  tower.add(funnelBase);

  // Warm Amber / Gold Corporate Band on Funnel
  const funnelBand = new THREE.Mesh(
    new THREE.BoxGeometry(8.0, 2.2, 10.0),
    safetyAmberMat
  );
  funnelBand.position.set(0, 35.0, -62.5);
  tower.add(funnelBand);

  // Dark Navy Funnel Cap
  const funnelCap = new THREE.Mesh(
    new THREE.BoxGeometry(8.1, 2.2, 10.1),
    hullNavyMat
  );
  funnelCap.position.set(0, 40.2, -62.5);
  tower.add(funnelCap);

  // Dual Enclosed Free-Fall Lifeboats in Orange Launch Cradles
  for (const side of [-1, 1]) {
    const lifeboat = new THREE.Mesh(
      new THREE.CapsuleGeometry(1.2, 3.8, 10, 12),
      safetyOrangeMat
    );
    lifeboat.rotation.x = Math.PI * 0.38;
    lifeboat.position.set(side * 14.2, 21.2, -56);
    tower.add(lifeboat);
  }

  vessel.add(tower);

  /* ============================================================
     6. CONTAINER CARGO BAYS, LASHING BRIDGES & X-RODS
     ============================================================ */
  const bays = [-72, -37, -23, -9, 5, 19, 33, 47, 61];

  // Elevated Lashing Bridges between Bays with Handrails
  bays.forEach((zPos) => {
    const bridgeGroup = new THREE.Group();

    // Catwalk platform
    const catwalk = new THREE.Mesh(
      new THREE.BoxGeometry(29.6, 5.8, 0.9),
      steelGreyMat
    );
    catwalk.position.set(0, 15.6, zPos - 6.8);
    bridgeGroup.add(catwalk);

    // Safety top rail in high-contrast silver
    const topRail = new THREE.Mesh(
      new THREE.BoxGeometry(29.8, 0.25, 0.25),
      bridgeWhiteMat
    );
    topRail.position.set(0, 18.6, zPos - 6.8);
    bridgeGroup.add(topRail);

    // Vertical structural cell-guide stanchions at stack corners
    for (const side of [-1, 1]) {
      const stanchion = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 16.0, 0.45),
        steelGreyMat
      );
      stanchion.position.set(side * 14.8, 20.6, zPos - 6.8);
      bridgeGroup.add(stanchion);
    }

    vessel.add(bridgeGroup);
  });

  // Dedicated High-Contrast Container Texture (Corrugations, ISO Corner Castings, Stencils)
  const shipContainerTex = createShipContainerTexture();
  const containerGeo = new THREE.BoxGeometry(2.36, 2.44, 12.0);
  const containerMat = new THREE.MeshStandardMaterial({
    map: shipContainerTex,
    color: 0xffffff,
    roughness: 0.46,
    metalness: 0.08,
    bumpMap: corrugatedBump,
    bumpScale: 0.08,
  });

  const transforms: Array<{
    x: number;
    y: number;
    z: number;
    color: THREE.Color;
  }> = [];

  // Generate realistic stepped container stacks across the 9 bays
  bays.forEach((zPos, bIdx) => {
    // Narrow stacks near the bow taper
    const maxCols = zPos > 55 ? 3 : zPos > 40 ? 4 : 5;

    for (let col = -maxCols; col <= maxCols; col++) {
      const xPos = col * 2.7;

      // Realistic tiered pyramid stacking (higher in midship, stepped at sides & bow)
      let maxTiers = 5;
      if (zPos > 50) {
        maxTiers = 3;
      } else if (zPos > 30) {
        maxTiers = 4;
      } else if (Math.abs(zPos) < 25) {
        maxTiers = 6;
      } else if (zPos === -72) {
        maxTiers = 4;
      }

      // Outer columns are 1 tier lower for stability & wind aerodynamics
      if (Math.abs(col) === maxCols && maxTiers > 3) {
        maxTiers -= 1;
      }

      for (let t = 0; t < maxTiers; t++) {
        // Natural varied container loading pattern
        if (t === maxTiers - 1 && Math.abs(col * 4 + bIdx * 3) % 5 === 0) {
          continue;
        }

        // Color selection prioritizing high luminance contrast between neighbors
        const cIdx =
          Math.abs(bIdx * 7 + col * 3 + t * 4) % PALETTE_CONTAINERS.length;

        transforms.push({
          x: xPos,
          y: 14.2 + t * 2.68,
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

  /* ============================================================
     6.5. ARCHITECTURAL 3D CONTAINER OUTLINE LINES & CORRUGATIONS
     Draws crisp, razor-sharp structural wireframe lines around EVERY
     individual container, plus transverse roof ribs, flank flutes,
     and end-door lock rods. Makes every container instantly readable.
     ============================================================ */
  const linePositions: number[] = [];
  const hw = 2.36 / 2; // 1.18
  const hh = 2.44 / 2; // 1.22
  const hl = 12.0 / 2; // 6.0

  transforms.forEach((tr) => {
    const { x, y, z } = tr;

    const addLine = (
      x1: number,
      y1: number,
      z1: number,
      x2: number,
      y2: number,
      z2: number
    ) => {
      linePositions.push(x1, y1, z1, x2, y2, z2);
    };

    // 1. 12 Outer Structural Edges of the Container Box
    // Bottom perimeter rail
    addLine(x - hw, y - hh, z - hl, x + hw, y - hh, z - hl);
    addLine(x + hw, y - hh, z - hl, x + hw, y - hh, z + hl);
    addLine(x + hw, y - hh, z + hl, x - hw, y - hh, z + hl);
    addLine(x - hw, y - hh, z + hl, x - hw, y - hh, z - hl);

    // Top perimeter rail (Roof edge)
    addLine(x - hw, y + hh, z - hl, x + hw, y + hh, z - hl);
    addLine(x + hw, y + hh, z - hl, x + hw, y + hh, z + hl);
    addLine(x + hw, y + hh, z + hl, x - hw, y + hh, z + hl);
    addLine(x - hw, y + hh, z + hl, x - hw, y + hh, z - hl);

    // 4 Vertical corner posts
    addLine(x - hw, y - hh, z - hl, x - hw, y + hh, z - hl);
    addLine(x + hw, y - hh, z - hl, x + hw, y + hh, z - hl);
    addLine(x + hw, y - hh, z + hl, x + hw, y + hh, z + hl);
    addLine(x - hw, y - hh, z + hl, x - hw, y + hh, z + hl);

    // 2. Transverse Roof Rib Lines (Prominent from elevated 3/4 aerial view)
    for (let r = 1; r <= 7; r++) {
      const rz = z - hl + (r * 12.0) / 8;
      addLine(x - hw + 0.04, y + hh + 0.015, rz, x + hw - 0.04, y + hh + 0.015, rz);
    }

    // 3. Side Corrugation Flutes (Vertical lines on container flanks)
    for (let r = 1; r <= 9; r++) {
      const rz = z - hl + (r * 12.0) / 10;
      // Right flank (+X)
      addLine(x + hw + 0.015, y - hh + 0.05, rz, x + hw + 0.015, y + hh - 0.05, rz);
      // Left flank (-X)
      addLine(x - hw - 0.015, y - hh + 0.05, rz, x - hw - 0.015, y + hh - 0.05, rz);
    }

    // 4. End Door Frame Lines & Vertical Lock Rods (Forward and Aft ends)
    for (const endZ of [z + hl + 0.015, z - hl - 0.015]) {
      // Center split seam between doors
      addLine(x, y - hh + 0.05, endZ, x, y + hh - 0.05, endZ);
      // Dual vertical lock rods
      addLine(x - 0.42, y - hh + 0.05, endZ, x - 0.42, y + hh - 0.05, endZ);
      addLine(x + 0.42, y - hh + 0.05, endZ, x + 0.42, y + hh - 0.05, endZ);
    }
  });

  const containerLinesGeo = new THREE.BufferGeometry();
  containerLinesGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3)
  );

  const containerLinesMat = new THREE.LineBasicMaterial({
    color: 0x090d16, // High-contrast deep architectural ink line
    transparent: true,
    opacity: 0.95,
  });

  const containerLinesMesh = new THREE.LineSegments(
    containerLinesGeo,
    containerLinesMat
  );
  vessel.add(containerLinesMesh);

  // 3D ISO 1161 Steel Corner Castings on all containers
  const castingGeo = new THREE.BoxGeometry(0.24, 0.24, 0.26);
  const castingMat = new THREE.MeshStandardMaterial({
    color: 0x4a5263,
    roughness: 0.45,
    metalness: 0.3,
  });

  const totalCastings = transforms.length * 8;
  const instancedCastings = new THREE.InstancedMesh(
    castingGeo,
    castingMat,
    totalCastings
  );
  instancedCastings.castShadow = true;
  instancedCastings.receiveShadow = true;

  const castingDummy = new THREE.Object3D();
  let castIdx = 0;
  transforms.forEach((tr) => {
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          castingDummy.position.set(
            tr.x + sx * (hw - 0.06),
            tr.y + sy * (hh - 0.06),
            tr.z + sz * (hl - 0.06)
          );
          castingDummy.updateMatrix();
          instancedCastings.setMatrixAt(castIdx++, castingDummy.matrix);
        }
      }
    }
  });
  instancedCastings.instanceMatrix.needsUpdate = true;
  vessel.add(instancedCastings);

  /* ============================================================
     7. ICONIC DIAGONAL CRISS-CROSS LASHING RODS ("X" BRACING)
     The universal visual hallmark of a modern container ship!
     ============================================================ */
  const lashingGroup = new THREE.Group();
  const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 5.8, 4);
  rodGeo.rotateZ(Math.PI / 4);

  // Add X-shaped lashing rods across all container bay faces
  bays.forEach((zPos) => {
    for (const endOffset of [-6.05, 6.05]) {
      const zFace = zPos + endOffset;
      const cols = [-4, -2, 0, 2, 4];
      cols.forEach((colX) => {
        const centerX = colX * 2.7;

        // Positive diagonal (\)
        const rod1 = new THREE.Mesh(rodGeo, lashingRodMat);
        rod1.position.set(centerX, 16.8, zFace);
        rod1.rotation.y = 0;
        lashingGroup.add(rod1);

        // Negative diagonal (/)
        const rod2 = new THREE.Mesh(rodGeo, lashingRodMat);
        rod2.position.set(centerX, 16.8, zFace);
        rod2.rotation.z = -Math.PI / 2;
        lashingGroup.add(rod2);
      });
    }
  });
  vessel.add(lashingGroup);

  /* ============================================================
     8. OCEAN FOAM BOW SPRAY & STERN PROPELLER WAKE
     ============================================================ */
  const wakeTex = createShipWakeTexture();
  const wakeMat = new THREE.MeshBasicMaterial({
    map: wakeTex,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });

  // Churning stern wake streaming astern
  const sternWake = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 120),
    wakeMat
  );
  sternWake.rotation.x = -Math.PI / 2;
  sternWake.position.set(0, 0.25, -145);
  vessel.add(sternWake);

  // Bow wave foam spray peeling from the bulbous bow
  const bowWake = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 46),
    wakeMat
  );
  bowWake.rotation.x = -Math.PI / 2;
  bowWake.position.set(0, 0.25, 82);
  vessel.add(bowWake);

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
