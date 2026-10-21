import * as THREE from "three";
import { freezeStaticGroup } from "../webgl/utils";
import { STREET_WORLD } from "../../domain/constants";
import {
  createTruckGroundShadowTexture,
  createHeroContainerFrontTexture,
  createHeroContainerRoofTexture,
  createBuildingFacadeTexture,
} from "../textures/proceduralTextures";

/**
 * Generates a high-contrast procedural texture with PURE WHITE (#FFFFFF) branding text
 * backed by a deep architectural slate band so the white text pops vividly in Light Mode.
 */
/**
 * Generates a high-contrast procedural texture with 100% PURE WHITE (#FFFFFF / #FFF) branding text.
 * Backed by an architectural midnight-slate band with pure white pin-stripes and accents.
 */
function createPureWhiteBrandingTexture(
  primaryText: string,
  subText: string,
  isRoofSign = false
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  // Container sign geometry: 7.56m x 1.08m (7.0:1 aspect ratio) -> 2688 x 384
  // Roof lightbox geometry: 1.80m x 0.28m (6.43:1 aspect ratio) -> 1440 x 224
  canvas.width = isRoofSign ? 1440 : 2688;
  canvas.height = isRoofSign ? 224 : 384;
  const ctx = canvas.getContext("2d");

  const renderContent = () => {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Deep high-contrast architectural midnight slate backing
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#080c14");
    grad.addColorStop(0.5, "#0f172a");
    grad.addColorStop(1, "#080c14");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Crisp pure-white (#FFFFFF) top & bottom architectural pin-stripes
    ctx.fillStyle = "#ffffff";
    const stripeH = isRoofSign ? 6 : 9;
    ctx.fillRect(0, 8, w, stripeH);
    ctx.fillRect(0, h - 8 - stripeH, w, stripeH);

    // Subtle pure-white (#FFFFFF) tech accent brackets on left and right edges
    ctx.fillStyle = "#ffffff";
    const accentW = isRoofSign ? 16 : 28;
    ctx.fillRect(16, 22, accentW, h - 44);
    ctx.fillRect(w - 16 - accentW, 22, accentW, h - 44);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Main Persian Title in 100% PURE WHITE (#FFFFFF / #FFF)
    const mainFontSize = isRoofSign ? 84 : 144;
    ctx.font = `900 ${mainFontSize}px "Vazirmatn", "IRANSans", "Tahoma", "Arial", sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(primaryText, w / 2, isRoofSign ? h * 0.52 : h * 0.42);

    // Subtitle / Technical Spec in 100% PURE WHITE (#FFFFFF / #FFF)
    if (!isRoofSign && subText) {
      const subFontSize = 44;
      ctx.font = `800 ${subFontSize}px "Inter", "Segoe UI", "Arial", sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(subText, w / 2, h * 0.76);
    }
  };

  renderContent();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  const refreshTexture = () => {
    renderContent();
    texture.needsUpdate = true;
  };

  if (typeof document !== "undefined") {
    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshTexture);
    }
    setTimeout(refreshTexture, 300);
    setTimeout(refreshTexture, 1000);
    setTimeout(refreshTexture, 2500);
  }

  return texture;
}

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
  const lineWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
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

    // Cross portal beams for structural crane realism
    for (const yCross of [12, 26]) {
      const crossBeam = new THREE.Mesh(
        new THREE.BoxGeometry(9.2, 0.9, 13.2),
        craneRedMat
      );
      crossBeam.position.set(1, yCross, 0);
      crane.add(crossBeam);
    }

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

  // Sandstone, cream stucco, terracotta and pale slate-blue facades
  const buildingColors = [0xd8c7a8, 0xe4ddd0, 0xc39a7c, 0xa9b6c9];
  const facadeTex = createBuildingFacadeTexture();
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0xb9bec7,
    roughness: 0.9,
    metalness: 0.0,
  });
  const parapetMat = new THREE.MeshStandardMaterial({
    color: 0xeef0f3,
    roughness: 0.7,
    metalness: 0.0,
  });
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

    const lampHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.18, 0.42),
      metalPoleMat
    );
    lampHead.position.set(13.1, 13.55, z);
    streetWorldGroup.add(lampHead);

    const bH = 22 + (Math.abs(i * 7) % 24);
    const bTex = facadeTex.clone();
    bTex.repeat.set(2, bH / 14);
    bTex.needsUpdate = true;
    const bMat = new THREE.MeshStandardMaterial({
      color: buildingColors[Math.abs(i) % buildingColors.length],
      map: bTex,
      roughness: 0.85,
      metalness: 0.0,
    });
    // BoxGeometry face order: +x, -x, +y (roof), -y, +z, -z
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(24, bH, 28), [
      bMat,
      bMat,
      roofMat,
      roofMat,
      bMat,
      bMat,
    ]);
    bldg.position.set(42, bH * 0.5, z);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    streetWorldGroup.add(bldg);

    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(24.6, 1.2, 28.6),
      parapetMat
    );
    parapet.position.set(42, bH + 0.6, z);
    parapet.castShadow = true;
    streetWorldGroup.add(parapet);
  }

  // ============================================================================
  // HEAVY TRACTOR CAB & 40FT CONTAINER TRAILER (ENGINEERED FOR LIGHT MODE DETAIL)
  // ============================================================================
  const truckRoot = new THREE.Group();
  truckRoot.position.set(
    STREET_WORLD.truckPosition.x,
    STREET_WORLD.truckPosition.y,
    STREET_WORLD.truckPosition.z
  );
  truckRoot.scale.setScalar(STREET_WORLD.truckScale);
  streetWorldGroup.add(truckRoot);

  // Ground Ambient Occlusion / Drop Shadow Plane
  const groundShadowTex = createTruckGroundShadowTexture();
  const groundShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 24.5),
    new THREE.MeshBasicMaterial({
      map: groundShadowTex,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    })
  );
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.set(0, 0.08, -1.2);
  truckRoot.add(groundShadow);

  // Pure White Cab Paint calibrated so it stays bright white in Light Mode
  const cabPaintMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  // Recessed Panel Seam & Architectural Trim Material (Crucial for Light Mode contrast on white body)
  const panelSeamMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
  });

  const cabSilverAccentMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.85,
  });

  const darkPlasticTrimMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.58,
    metalness: 0.2,
  });

  const grilleMeshMat = new THREE.MeshStandardMaterial({
    map: grilleMeshTex,
    color: 0x1e293b,
    roughness: 0.42,
    metalness: 0.55,
  });

  const chassisSteelMat = new THREE.MeshStandardMaterial({
    color: 0x181f29,
    roughness: 0.52,
    metalness: 0.58,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.96,
  });

  const brushedAluminumMat = new THREE.MeshStandardMaterial({
    color: 0xdbe4ef,
    roughness: 0.25,
    metalness: 0.85,
  });

  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    roughness: 0.86,
    metalness: 0.06,
  });

  const cabGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x091326,
    roughness: 0.04,
    metalness: 0.12,
    reflectivity: 1.0,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  const twistLockYellowMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.35,
    metalness: 0.25,
  });

  const amberLightMat = new THREE.MeshBasicMaterial({
    color: 0xffa000,
    toneMapped: false,
  });
  const headLightGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });
  const drlIceBlueMat = new THREE.MeshBasicMaterial({
    color: 0xe0f2fe,
    toneMapped: false,
  });
  const tailLightRedMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    toneMapped: false,
  });
  const pureWhiteUnlitMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });

  // High-Contrast Wheel & Truck Materials
  const highContrastTireMat = new THREE.MeshStandardMaterial({
    color: 0x1e2530,
    roughness: 0.8,
    metalness: 0.12,
  });

  const brightRimLipMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.04,
    metalness: 0.98,
  });

  const polishedWheelDiscMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.14,
    metalness: 0.92,
  });

  const whiteWheelAccentMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
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
    color: 0x141923,
    roughness: 0.62,
    metalness: 0.22,
  });

  const fenderReflectorMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false,
  });

  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
  });

  // Pure White Branding Textures (toneMapped: false guarantees #FFFFFF stays pure white)
  const containerBrandTex = createPureWhiteBrandingTexture(
    "جهان‌گستر",
    "JAHAN-GOSTAR  •  INTERNATIONAL TRADE & LOGISTICS",
    false
  );
  const containerBrandMat = new THREE.MeshBasicMaterial({
    map: containerBrandTex,
    toneMapped: false,
    side: THREE.DoubleSide,
  });

  const roofSignBrandTex = createPureWhiteBrandingTexture(
    "جهان‌گستر",
    "",
    true
  );
  const roofSignBrandMat = new THREE.MeshBasicMaterial({
    map: roofSignBrandTex,
    toneMapped: false,
    side: THREE.DoubleSide,
  });

  // ----------------------------------------------------------------------------
  // 2. TRACTOR CHASSIS, LADDER FRAME, FIFTH WHEEL & MECHANICAL DRIVETRAIN
  // ----------------------------------------------------------------------------
  for (const side of [-1, 1]) {
    const tractorRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.34, 8.2),
      chassisSteelMat
    );
    tractorRail.position.set(side * 0.48, 0.92, 4.3);
    tractorRail.castShadow = true;
    truckRoot.add(tractorRail);

    // Top flange highlight strip for Light Mode frame definition
    const railFlange = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.025, 8.2),
      cabSilverAccentMat
    );
    railFlange.position.set(side * 0.48, 1.09, 4.3);
    truckRoot.add(railFlange);
  }

  // Ladder Frame Cross-Members & Drivetrain Shaft
  for (const cz of [0.5, 1.85, 3.2, 4.8, 6.5]) {
    const crossMember = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.22, 0.14),
      chassisSteelMat
    );
    crossMember.position.set(0, 0.92, cz);
    truckRoot.add(crossMember);
  }

  const driveShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 5.4, 12),
    chassisSteelMat
  );
  driveShaft.rotation.x = Math.PI / 2;
  driveShaft.position.set(0, 0.72, 3.85);
  truckRoot.add(driveShaft);

  // Expanded Aluminum Catwalk Deck with Diamond-Plate Frame
  const catwalk = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.06, 2.35),
    brushedAluminumMat
  );
  catwalk.position.set(0, 1.11, 3.85);
  truckRoot.add(catwalk);

  const catwalkBorder = new THREE.Mesh(
    new THREE.BoxGeometry(1.52, 0.04, 2.39),
    chassisSteelMat
  );
  catwalkBorder.position.set(0, 1.09, 3.85);
  truckRoot.add(catwalkBorder);

  // Heavy Fifth-Wheel Coupling Assembly with Subframe & Locking Jaws
  const fifthWheelSubplate = new THREE.Mesh(
    new THREE.BoxGeometry(1.28, 0.08, 1.15),
    chassisSteelMat
  );
  fifthWheelSubplate.position.set(0, 1.15, 1.95);
  truckRoot.add(fifthWheelSubplate);

  const fifthWheelPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.6, 0.1, 24),
    darkPlasticTrimMat
  );
  fifthWheelPlate.position.set(0, 1.24, 1.95);
  fifthWheelPlate.rotation.x = 0.06;
  truckRoot.add(fifthWheelPlate);

  const fifthWheelReleaseArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.65, 8),
    chromeMat
  );
  fifthWheelReleaseArm.rotation.z = Math.PI / 2;
  fifthWheelReleaseArm.position.set(-0.68, 1.22, 1.95);
  truckRoot.add(fifthWheelReleaseArm);

  // Coiled Pneumatic Brake & ABS Hoses (Red Emergency, Blue Service, Yellow ABS)
  [
    { x: -0.24, col: 0xdc2626 },
    { x: 0.0, col: 0x2563eb },
    { x: 0.24, col: 0xeab308 },
  ].forEach((c) => {
    const hoseMat = new THREE.MeshStandardMaterial({
      color: c.col,
      roughness: 0.35,
      metalness: 0.1,
    });
    const hose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 1.48, 10),
      hoseMat
    );
    hose.position.set(c.x, 1.75, 4.25);
    hose.rotation.x = 0.42;
    truckRoot.add(hose);

    // Coiled spiral rings for realistic pneumatic hose detail in Light Mode
    for (let ring = 0; ring < 5; ring++) {
      const coil = new THREE.Mesh(
        new THREE.TorusGeometry(0.065, 0.018, 8, 16),
        hoseMat
      );
      coil.position.set(c.x, 1.45 + ring * 0.12, 4.12 + ring * 0.05);
      coil.rotation.x = 0.42;
      truckRoot.add(coil);
    }
  });

  // Fuel Tanks, Aerodynamic Side Skirts with Recessed Louvers & Chrome Trim
  for (const side of [-1, 1]) {
    const fuelTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 2.05, 24),
      brushedAluminumMat
    );
    fuelTank.rotation.x = Math.PI / 2;
    fuelTank.position.set(side * 0.94, 0.86, 4.15);
    fuelTank.castShadow = true;
    truckRoot.add(fuelTank);

    // Fuel Tank Chrome Mounting Straps & Dark Rubber Isolator Pads
    for (const strapZ of [-0.65, 0.65]) {
      const isolator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.37, 0.37, 0.07, 24),
        darkPlasticTrimMat
      );
      isolator.rotation.x = Math.PI / 2;
      isolator.position.set(side * 0.94, 0.86, 4.15 + strapZ);
      truckRoot.add(isolator);

      const strap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.045, 24),
        chromeMat
      );
      strap.rotation.x = Math.PI / 2;
      strap.position.set(side * 0.94, 0.86, 4.15 + strapZ);
      truckRoot.add(strap);
    }

    // White Aerodynamic Side Skirt
    const sideSkirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.64, 2.55),
      cabPaintMat
    );
    sideSkirt.position.set(side * 1.22, 0.82, 4.15);
    sideSkirt.castShadow = true;
    truckRoot.add(sideSkirt);

    // Dark recessed upper & lower shadow lines on side skirt so it pops in Light Mode
    const skirtShadowLineTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.025, 2.52),
      panelSeamMat
    );
    skirtShadowLineTop.position.set(side * 1.225, 1.12, 4.15);
    truckRoot.add(skirtShadowLineTop);

    // Recessed Step Pocket & Amber Side Marker LEDs on Side Skirt
    for (const sz of [3.25, 4.15, 5.05]) {
      const sideMarker = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.035, 0.14),
        amberLightMat
      );
      sideMarker.position.set(side * 1.22, 0.56, sz);
      truckRoot.add(sideMarker);
    }

    const skirtTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.045, 2.55),
      chromeMat
    );
    skirtTrim.position.set(side * 1.22, 0.52, 4.15);
    truckRoot.add(skirtTrim);
  }

  // Dual Aluminum Compressed Air Tanks under Chassis
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

  // Heavy Duty Battery Box on Driver Side with Chrome Latch Clamps
  const batteryBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.38, 0.65),
    darkPlasticTrimMat
  );
  batteryBox.position.set(-1.02, 0.8, 5.55);
  truckRoot.add(batteryBox);

  const batteryLidTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.03, 0.67),
    chromeMat
  );
  batteryLidTrim.position.set(-1.02, 0.99, 5.55);
  truckRoot.add(batteryLidTrim);

  // Vertical Chrome Exhaust Stacks with Perforated Shields & Angled Turn-Out Tips
  for (const side of [-1, 1]) {
    const stack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 3.55, 16),
      chromeMat
    );
    stack.position.set(side * 1.14, 2.75, 4.78);
    stack.castShadow = true;
    truckRoot.add(stack);

    const stackHeatShield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.85, 16),
      brushedAluminumMat
    );
    stackHeatShield.position.set(side * 1.14, 2.15, 4.78);
    truckRoot.add(stackHeatShield);

    for (const clampY of [1.35, 2.15, 2.95]) {
      const clamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.128, 0.128, 0.04, 16),
        darkPlasticTrimMat
      );
      clamp.position.set(side * 1.14, clampY, 4.78);
      truckRoot.add(clamp);
    }
  }

  // ----------------------------------------------------------------------------
  // 3. HIGH-DETAIL TRACTOR CAB (LIGHT-MODE PANEL SEAMS, INTERIOR & PURE WHITE SIGN)
  // ----------------------------------------------------------------------------
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

  // Cab Rear Wall Window & Structural Ribbing
  const rearCabWindow = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.48, 0.06),
    cabGlassMat
  );
  rearCabWindow.position.set(0, 3.15, 5.05);
  cabGroup.add(rearCabWindow);

  // Aerodynamic Side Fairing Extenders with Dark Edge Trim
  for (const side of [-1, 1]) {
    const sideExtender = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 3.08, 0.58),
      cabPaintMat
    );
    sideExtender.position.set(side * 1.21, 2.68, 4.82);
    sideExtender.castShadow = true;
    cabGroup.add(sideExtender);

    const extenderSeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 3.08, 0.03),
      panelSeamMat
    );
    extenderSeam.position.set(side * 1.215, 2.68, 5.1);
    cabGroup.add(extenderSeam);
  }

  // Roof Spoiler / Globetrotter Aerodynamic Fairing
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

  // GLOBETROTTER ROOF LIGHTBOX WITH PURE WHITE (#FFFFFF) BRANDING TEXT
  const roofLightboxFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 0.34, 0.12),
    darkPlasticTrimMat
  );
  roofLightboxFrame.position.set(0, 3.92, 7.82);
  roofLightboxFrame.rotation.x = -0.22;
  cabGroup.add(roofLightboxFrame);

  const roofLightboxSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.28),
    roofSignBrandMat
  );
  roofLightboxSign.position.set(0, 3.92, 7.89);
  roofLightboxSign.rotation.x = -0.22;
  cabGroup.add(roofLightboxSign);

  // CAB INTERIOR (Visible through Windshield & Side Windows in Light Mode)
  const dashBoard = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.42, 0.65),
    interiorMat
  );
  dashBoard.position.set(0, 2.35, 7.95);
  cabGroup.add(dashBoard);

  for (const seatX of [-0.58, 0.58]) {
    const seatBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.95, 0.16),
      interiorMat
    );
    seatBack.position.set(seatX, 2.48, 7.15);
    seatBack.rotation.x = -0.12;
    cabGroup.add(seatBack);
  }

  const steeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.028, 10, 20),
    darkPlasticTrimMat
  );
  steeringWheel.position.set(-0.58, 2.58, 7.62);
  steeringWheel.rotation.x = Math.PI / 3;
  cabGroup.add(steeringWheel);

  // Framed Panoramic Windshield with Rubber Gasket & A-Pillar Trim (Crucial for Light Mode)
  const windshieldGasket = new THREE.Mesh(
    new THREE.BoxGeometry(2.32, 1.16, 0.07),
    darkPlasticTrimMat
  );
  windshieldGasket.position.set(0, 2.94, 8.31);
  windshieldGasket.rotation.x = -0.27;
  cabGroup.add(windshieldGasket);

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.04, 0.08),
    cabGlassMat
  );
  windshield.position.set(0, 2.94, 8.33);
  windshield.rotation.x = -0.27;
  cabGroup.add(windshield);

  // Unified Side Windows, Door Cutlines, Air Intake Louvers, Fenders & Entry Steps
  for (const side of [-1, 1]) {
    // Black Rubber Side Window Frame (B-Pillar & Sill)
    const sideWinFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.98, 1.44),
      darkPlasticTrimMat
    );
    sideWinFrame.position.set(side * 1.21, 2.86, 7.36);
    cabGroup.add(sideWinFrame);

    const sideWin = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.88, 1.34),
      cabGlassMat
    );
    sideWin.position.set(side * 1.22, 2.86, 7.36);
    cabGroup.add(sideWin);

    const winSillChrome = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.04, 1.44),
      chromeMat
    );
    winSillChrome.position.set(side * 1.23, 2.36, 7.36);
    cabGroup.add(winSillChrome);

    // Sleeper Upper Window with Dark Frame
    const sleeperWinFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.62, 0.74),
      darkPlasticTrimMat
    );
    sleeperWinFrame.position.set(side * 1.21, 3.05, 5.85);
    cabGroup.add(sleeperWinFrame);

    const sleeperWin = new THREE.Mesh(
      new THREE.BoxGeometry(0.095, 0.54, 0.66),
      cabGlassMat
    );
    sleeperWin.position.set(side * 1.22, 3.05, 5.85);
    cabGroup.add(sleeperWin);

    // Lower Sleeper Storage Compartment Door Outline & Chrome Latch
    const storageOutline = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.68, 0.72),
      panelSeamMat
    );
    storageOutline.position.set(side * 1.21, 1.85, 5.85);
    cabGroup.add(storageOutline);

    const storagePanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.085, 0.62, 0.66),
      cabPaintMat
    );
    storagePanel.position.set(side * 1.215, 1.85, 5.85);
    cabGroup.add(storagePanel);

    // Aerodynamic Side Air Intake Grille with Louver Bars (High Light-Mode Contrast)
    const sideIntakeRecess = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.75, 0.24),
      darkPlasticTrimMat
    );
    sideIntakeRecess.position.set(side * 1.215, 2.95, 6.42);
    cabGroup.add(sideIntakeRecess);

    for (let lv = 0; lv < 4; lv++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(0.095, 0.03, 0.2),
        chromeMat
      );
      louver.position.set(side * 1.22, 2.72 + lv * 0.15, 6.42);
      cabGroup.add(louver);
    }

    // Complete Architectural Door Cutline Seams (Front, Rear, Bottom)
    const doorSeamRear = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.05, 0.025),
      panelSeamMat
    );
    doorSeamRear.position.set(side * 1.215, 2.28, 6.62);
    cabGroup.add(doorSeamRear);

    const doorSeamFront = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.05, 0.025),
      panelSeamMat
    );
    doorSeamFront.position.set(side * 1.215, 2.28, 8.1);
    cabGroup.add(doorSeamFront);

    const doorSeamBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.025, 1.48),
      panelSeamMat
    );
    doorSeamBottom.position.set(side * 1.215, 1.26, 7.36);
    cabGroup.add(doorSeamBottom);

    // Sculpted Door Handle & Recessed Pocket
    const doorPocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.13, 0.32),
      darkPlasticTrimMat
    );
    doorPocket.position.set(side * 1.22, 1.92, 6.88);
    cabGroup.add(doorPocket);

    const doorHandle = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.045, 0.28),
      chromeMat
    );
    doorHandle.position.set(side * 1.24, 1.92, 6.88);
    cabGroup.add(doorHandle);

    // Dark Inner Wheel Well Liner + Front Fender Arch (Prevents white-on-white washout behind front wheel)
    const wheelWellLiner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.68, 0.42, 20, 1, false, 0, Math.PI),
      panelSeamMat
    );
    wheelWellLiner.rotation.z = Math.PI / 2;
    wheelWellLiner.rotation.y = Math.PI / 2;
    wheelWellLiner.position.set(side * 1.02, 0.58, 6.55);
    cabGroup.add(wheelWellLiner);

    const fenderArch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 0.38, 24, 1, false, 0, Math.PI),
      darkPlasticTrimMat
    );
    fenderArch.rotation.z = Math.PI / 2;
    fenderArch.rotation.y = Math.PI / 2;
    fenderArch.position.set(side * 1.12, 0.58, 6.55);
    cabGroup.add(fenderArch);

    // 3-Tier Brushed Aluminum Driver Entry Steps (Positioned cleanly forward of front wheel arch)
    const stepBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.72, 0.58),
      darkPlasticTrimMat
    );
    stepBacking.position.set(side * 1.13, 0.85, 7.82);
    cabGroup.add(stepBacking);

    for (let st = 0; st < 3; st++) {
      const stepBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.048, 0.54),
        brushedAluminumMat
      );
      stepBox.position.set(side * 1.17, 0.6 + st * 0.24, 7.82);
      cabGroup.add(stepBox);
    }

    // Dual West-Coast Side Mirrors with Chrome Backs & Turn Signal Strips
    const mainMirrorShell = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.64, 0.24),
      cabPaintMat
    );
    mainMirrorShell.position.set(side * 1.48, 2.92, 7.92);
    mainMirrorShell.castShadow = true;
    cabGroup.add(mainMirrorShell);

    const mainMirrorBorder = new THREE.Mesh(
      new THREE.BoxGeometry(0.155, 0.66, 0.22),
      darkPlasticTrimMat
    );
    mainMirrorBorder.position.set(side * 1.48, 2.92, 7.9);
    cabGroup.add(mainMirrorBorder);

    const mainMirrorGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.58, 0.03),
      chromeMat
    );
    mainMirrorGlass.position.set(side * 1.48, 2.92, 7.78);
    cabGroup.add(mainMirrorGlass);

    const mirrorTurnLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.04, 0.03),
      amberLightMat
    );
    mirrorTurnLed.position.set(side * 1.49, 2.92, 8.05);
    cabGroup.add(mirrorTurnLed);

    const convexMirrorShell = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.24, 0.2),
      darkPlasticTrimMat
    );
    convexMirrorShell.position.set(side * 1.48, 2.44, 7.92);
    cabGroup.add(convexMirrorShell);

    const mirrorArmUpper = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.05, 0.055),
      darkPlasticTrimMat
    );
    mirrorArmUpper.position.set(side * 1.34, 3.18, 7.98);
    cabGroup.add(mirrorArmUpper);

    const mirrorArmLower = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.05, 0.055),
      darkPlasticTrimMat
    );
    mirrorArmLower.position.set(side * 1.34, 2.34, 7.98);
    cabGroup.add(mirrorArmLower);
  }

  // Windshield Wiper Cowl & Dual Pantograph Wipers
  const wiperCowl = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.18, 0.14),
    darkPlasticTrimMat
  );
  wiperCowl.position.set(0, 2.38, 8.48);
  cabGroup.add(wiperCowl);

  for (const wx of [-0.52, 0.45]) {
    const wiperBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.04, 0.045),
      darkPlasticTrimMat
    );
    wiperBlade.position.set(wx, 2.48, 8.54);
    wiperBlade.rotation.z = -0.09;
    cabGroup.add(wiperBlade);
  }

  // Sun Visor & 5 Roof Amber Marker LEDs
  const sunVisor = new THREE.Mesh(
    new THREE.BoxGeometry(2.44, 0.26, 0.19),
    darkPlasticTrimMat
  );
  sunVisor.position.set(0, 3.55, 8.18);
  sunVisor.rotation.x = 0.18;
  sunVisor.castShadow = true;
  cabGroup.add(sunVisor);

  const visorChrome = new THREE.Mesh(
    new THREE.BoxGeometry(2.46, 0.045, 0.2),
    chromeMat
  );
  visorChrome.position.set(0, 3.44, 8.2);
  cabGroup.add(visorChrome);

  for (let m = -2; m <= 2; m++) {
    const markerLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.055, 0.045),
      amberLightMat
    );
    markerLed.position.set(m * 0.46, 3.56, 8.28);
    cabGroup.add(markerLed);
  }

  // Roof Chrome Lightbar & 4 High-Intensity Rally Spotlights
  const lightBarPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 2.12, 12),
    chromeMat
  );
  lightBarPipe.rotation.z = Math.PI / 2;
  lightBarPipe.position.set(0, 4.22, 7.65);
  cabGroup.add(lightBarPipe);

  [-0.72, -0.25, 0.25, 0.72].forEach((lx) => {
    const spotHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.095, 0.15, 16),
      chromeMat
    );
    spotHousing.rotation.x = Math.PI / 2;
    spotHousing.position.set(lx, 4.3, 7.68);
    cabGroup.add(spotHousing);

    const spotRing = new THREE.Mesh(
      new THREE.RingGeometry(0.088, 0.112, 16),
      darkPlasticTrimMat
    );
    spotRing.position.set(lx, 4.3, 7.76);
    cabGroup.add(spotRing);

    const spotLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.088, 16),
      headLightGlowMat
    );
    spotLens.position.set(lx, 4.3, 7.765);
    cabGroup.add(spotLens);
  });

  // Dual Pneumatic Trumpet Air Horns
  for (const side of [-1, 1]) {
    const airHorn = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.74, 14),
      chromeMat
    );
    airHorn.rotation.x = -Math.PI / 2;
    airHorn.position.set(side * 0.96, 4.24, 7.25);
    cabGroup.add(airHorn);
  }

  // Front Radiator Grille with Deep Dark Recess & Multi-Tier Chrome Louvers
  const upperGrilleOuter = new THREE.Mesh(
    new THREE.BoxGeometry(1.94, 1.18, 0.09),
    chromeMat
  );
  upperGrilleOuter.position.set(0, 1.76, 8.5);
  cabGroup.add(upperGrilleOuter);

  const upperGrilleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.86, 1.1, 0.11),
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

  for (let r = 0; r < 5; r++) {
    const barW = 1.72 - r * 0.04;
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(barW, 0.065, 0.15),
      chromeMat
    );
    rib.position.set(0, 2.16 - r * 0.2, 8.535);
    cabGroup.add(rib);
  }

  // Diagonal Volvo/Euro-Style Grille Slash & Center Chrome Emblem
  const grilleSlash = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.055, 0.16),
    chromeMat
  );
  grilleSlash.position.set(0, 1.76, 8.545);
  grilleSlash.rotation.z = 0.48;
  cabGroup.add(grilleSlash);

  const centerBadge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.17, 6),
    chromeMat
  );
  centerBadge.rotation.x = Math.PI / 2;
  centerBadge.position.set(0, 1.76, 8.55);
  cabGroup.add(centerBadge);

  // Corner Aerodynamic Deflector Vanes with Dark Recessed Intakes
  for (const side of [-1, 1]) {
    const cornerVaneRecess = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.1, 0.15),
      panelSeamMat
    );
    cornerVaneRecess.position.set(side * 1.1, 1.76, 8.46);
    cornerVaneRecess.rotation.y = side * 0.25;
    cabGroup.add(cornerVaneRecess);

    const cornerVane = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.06, 0.16),
      cabPaintMat
    );
    cornerVane.position.set(side * 1.13, 1.76, 8.48);
    cornerVane.rotation.y = side * 0.25;
    cabGroup.add(cornerVane);
  }

  // Sculpted Front Bumper, Lower Radiator Intake, Tow Hooks & Skid Plate
  const bumperTopSeam = new THREE.Mesh(
    new THREE.BoxGeometry(2.52, 0.03, 0.44),
    panelSeamMat
  );
  bumperTopSeam.position.set(0, 1.18, 8.46);
  cabGroup.add(bumperTopSeam);

  const bumperCenter = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.64, 0.42),
    cabPaintMat
  );
  bumperCenter.position.set(0, 0.85, 8.46);
  bumperCenter.castShadow = true;
  cabGroup.add(bumperCenter);

  const lowerIntakeFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.58, 0.46, 0.09),
    darkPlasticTrimMat
  );
  lowerIntakeFrame.position.set(0, 0.84, 8.63);
  cabGroup.add(lowerIntakeFrame);

  const lowerIntake = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.4, 0.1),
    grilleMeshMat
  );
  lowerIntake.position.set(0, 0.84, 8.64);
  cabGroup.add(lowerIntake);

  for (const lr of [-0.09, 0.09]) {
    const lRib = new THREE.Mesh(
      new THREE.BoxGeometry(1.46, 0.05, 0.12),
      chromeMat
    );
    lRib.position.set(0, 0.84 + lr, 8.65);
    cabGroup.add(lRib);
  }

  const chinSkidPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.92, 0.12, 0.42),
    brushedAluminumMat
  );
  chinSkidPlate.position.set(0, 0.5, 8.48);
  cabGroup.add(chinSkidPlate);

  const licensePlateFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.15, 0.035),
    darkPlasticTrimMat
  );
  licensePlateFrame.position.set(0, 0.58, 8.675);
  cabGroup.add(licensePlateFrame);

  const licensePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.12, 0.04),
    pureWhiteUnlitMat
  );
  licensePlate.position.set(0, 0.58, 8.68);
  cabGroup.add(licensePlate);

  // Projector LED Headlights with Dark Bezels & C-Shaped DRL Signature
  for (const side of [-1, 1]) {
    const hlHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.3, 0.14),
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
      new THREE.BoxGeometry(0.42, 0.038, 0.07),
      drlIceBlueMat
    );
    drlBottom.position.set(side * 0.99, 0.82, 8.67);
    cabGroup.add(drlBottom);

    const drlOuter = new THREE.Mesh(
      new THREE.BoxGeometry(0.042, 0.25, 0.07),
      drlIceBlueMat
    );
    drlOuter.position.set(side * 1.18, 0.94, 8.67);
    cabGroup.add(drlOuter);

    const turnBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.038, 0.07),
      amberLightMat
    );
    turnBar.position.set(side * 0.96, 1.06, 8.67);
    cabGroup.add(turnBar);

    const fogLampBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.05, 14),
      darkPlasticTrimMat
    );
    fogLampBezel.rotation.x = Math.PI / 2;
    fogLampBezel.position.set(side * 0.96, 0.64, 8.65);
    cabGroup.add(fogLampBezel);

    const fogLamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.058, 0.058, 0.06, 14),
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

  // Curb Blind-Spot Mirror
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

  // ----------------------------------------------------------------------------
  // 4. SKELETAL CONTAINER TRAILER & HEAVY UNDERCARRIAGE
  // ----------------------------------------------------------------------------
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

    // Amber Side Clearance LEDs along Trailer Frame
    for (const lz of [1.8, -1.5, -4.8, -8.2, -9.8]) {
      const clearanceLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.045, 0.14),
        amberLightMat
      );
      clearanceLed.position.set(side * 1.24, 1.28, lz);
      trailerGroup.add(clearanceLed);
    }
  }

  [-9.95, -3.8, 2.35].forEach((zBolster) => {
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

  // Heavy Telescopic Landing Gear & Lateral Cyclist Underrun Guards
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

    // Vertical support posts for cyclist side-guards
    for (const postZ of [-1.4, -5.0]) {
      const guardPost = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.56, 0.08),
        chassisSteelMat
      );
      guardPost.position.set(side * 1.16, 0.92, postZ);
      trailerGroup.add(guardPost);
    }

    for (const barY of [0.68, 0.92]) {
      const sideGuard = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.08, 4.2),
        brushedAluminumMat
      );
      sideGuard.position.set(side * 1.18, barY, -3.2);
      trailerGroup.add(sideGuard);
    }
  }

  // Rear Underrun Bumper Bar, Multi-Chamber Tail Lights & Reflective Conspicuity Tape
  const rearBumper = new THREE.Mesh(
    new THREE.BoxGeometry(2.52, 0.24, 0.18),
    brushedAluminumMat
  );
  rearBumper.position.set(0, 0.62, -10.05);
  rearBumper.castShadow = true;
  trailerGroup.add(rearBumper);

  const rearPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.12, 0.04),
    pureWhiteUnlitMat
  );
  rearPlate.position.set(0, 0.62, -10.15);
  trailerGroup.add(rearPlate);

  for (const side of [-1, 1]) {
    const bumperPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.55, 0.14),
      chassisSteelMat
    );
    bumperPost.position.set(side * 0.95, 0.92, -10.02);
    trailerGroup.add(bumperPost);

    const tailLightHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.18, 0.08),
      darkPlasticTrimMat
    );
    tailLightHousing.position.set(side * 0.92, 0.62, -10.11);
    trailerGroup.add(tailLightHousing);

    const tailLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.13, 0.09),
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

    const rearMudflapWhiteBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.05, 0.045),
      pureWhiteUnlitMat
    );
    rearMudflapWhiteBar.position.set(side * 0.95, 0.2, -9.85);
    trailerGroup.add(rearMudflapWhiteBar);
  }

  // ----------------------------------------------------------------------------
  // 5. HIGH-DETAIL 40FT SHIPPING CONTAINER (3D CORRUGATION + PURE WHITE BRANDING)
  // ----------------------------------------------------------------------------
  const heroContainerGroup = new THREE.Group();
  heroContainerGroup.position.set(0, 2.72, -3.8);
  trailerGroup.add(heroContainerGroup);

  const heroFrontTex = createHeroContainerFrontTexture();
  const heroRoofTex = createHeroContainerRoofTexture();

  const heroSideMat = new THREE.MeshStandardMaterial({
    map: heroContainerTex,
    color: 0xffffff,
    bumpMap: corrugatedBump,
    bumpScale: 0.1,
    roughness: 0.36,
    metalness: 0.08,
  });
  const heroRoofMat = new THREE.MeshStandardMaterial({
    map: heroRoofTex,
    color: 0xffffff,
    bumpMap: corrugatedBump,
    bumpScale: 0.08,
    roughness: 0.32,
    metalness: 0.08,
  });
  const heroFrontMat = new THREE.MeshStandardMaterial({
    map: heroFrontTex,
    color: 0xffffff,
    bumpMap: corrugatedBump,
    bumpScale: 0.1,
    roughness: 0.4,
    metalness: 0.1,
  });
  const heroDoorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    bumpMap: corrugatedBump,
    bumpScale: 0.1,
    roughness: 0.35,
    metalness: 0.1,
  });
  const heroUnderMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.85,
    metalness: 0.1,
  });

  const containerMats = [
    heroSideMat,
    heroSideMat,
    heroRoofMat,
    heroUnderMat,
    heroFrontMat,
    heroDoorMat,
  ];
  const containerBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.54, 2.68, 12.38),
    containerMats
  );
  containerBody.castShadow = true;
  containerBody.receiveShadow = true;
  heroContainerGroup.add(containerBody);

  // 3D Physical Vertical Corrugation Ribs along both Flanks (Creates real 3D shadows in Light Mode)
  const ribCountPerSide = 28;
  const sideRibGeo = new THREE.BoxGeometry(0.028, 2.48, 0.14);
  const sideRibInst = new THREE.InstancedMesh(
    sideRibGeo,
    cabPaintMat,
    ribCountPerSide * 2
  );
  sideRibInst.castShadow = true;
  sideRibInst.receiveShadow = true;

  const ribDummy = new THREE.Object3D();
  let rIdx = 0;
  for (const sx of [-1, 1]) {
    for (let r = 0; r < ribCountPerSide; r++) {
      const rz = -5.75 + r * 0.425;
      ribDummy.position.set(sx * 1.275, 0, rz);
      ribDummy.updateMatrix();
      sideRibInst.setMatrixAt(rIdx++, ribDummy.matrix);
    }
  }
  heroContainerGroup.add(sideRibInst);

  // PURE WHITE (#FFFFFF) HIGH-CONTRAST BRANDING FASCIA PANELS ON BOTH CONTAINER FLANKS
  for (const sx of [-1, 1]) {
    // Structural dark metallic bezel around the branding sign
    const signFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.18, 7.68),
      darkPlasticTrimMat
    );
    signFrame.position.set(sx * 1.28, 0.12, 0.2);
    heroContainerGroup.add(signFrame);

    // Pure white text canvas panel (toneMapped: false)
    const signPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7.56, 1.08),
      containerBrandMat
    );
    signPlane.position.set(sx * 1.305, 0.12, 0.2);
    signPlane.rotation.y = sx === 1 ? Math.PI / 2 : -Math.PI / 2;
    heroContainerGroup.add(signPlane);
  }

  // 12 Structural Edge Beams Defining the Container Rectangular Prism
  const containerRailMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.42,
    metalness: 0.58,
  });

  // 4 Longitudinal Edge Rails
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const sideRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.09, 12.42),
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
        new THREE.BoxGeometry(0.1, 2.68, 0.1),
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
        new THREE.BoxGeometry(2.54, 0.09, 0.09),
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

  // 8 ISO Corner Castings with Twist-Lock Aperture Details
  const castingGeo = new THREE.BoxGeometry(0.25, 0.25, 0.27);
  const castingMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.48,
    metalness: 0.62,
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

  // Rear Cargo Doors with Rubber Gasket, 8 Hinges, 4 Chrome Lock Rods, Cam-Locks & Handles
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

    // 4 Heavy Door Hinges per side
    for (const hy of [-0.95, -0.32, 0.32, 0.95]) {
      const hinge = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.12, 0.08),
        containerRailMat
      );
      hinge.position.set(side * 1.19, hy, -6.23);
      heroContainerGroup.add(hinge);
    }
  }

  [-0.85, -0.32, 0.32, 0.85].forEach((lx) => {
    const lockRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 2.44, 10),
      chromeMat
    );
    lockRod.position.set(lx, 0, -6.26);
    heroContainerGroup.add(lockRod);

    // Top & Bottom Cam-Lock Keepers
    for (const ky of [-1.16, 1.16]) {
      const camKeeper = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.1, 0.08),
        containerRailMat
      );
      camKeeper.position.set(lx, ky, -6.25);
      heroContainerGroup.add(camKeeper);
    }

    // Locking Handle Lever & Retainer Catch
    const handleLever = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.045, 0.05),
      chromeMat
    );
    handleLever.position.set(lx + 0.1, -0.25, -6.28);
    heroContainerGroup.add(handleLever);
  });

  // ----------------------------------------------------------------------------
  // 6. WHEELS, FENDERS, AIR SUSPENSION & AXLE DRIVETRAIN
  // ----------------------------------------------------------------------------
  const tireRadius = 0.58;
  const tireWidth = 0.32;
  const tireGeo = new THREE.CylinderGeometry(
    tireRadius,
    tireRadius,
    tireWidth,
    32
  );
  tireGeo.rotateZ(Math.PI / 2);

  const sidewallGeo = new THREE.CylinderGeometry(
    tireRadius - 0.015,
    tireRadius - 0.015,
    tireWidth - 0.05,
    32
  );
  sidewallGeo.rotateZ(Math.PI / 2);

  const rimLipGeo = new THREE.TorusGeometry(0.36, 0.024, 12, 36);

  const rimBarrelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.33, 32);
  rimBarrelGeo.rotateZ(Math.PI / 2);

  const steerHubGeo = new THREE.ConeGeometry(0.12, 0.18, 18);
  steerHubGeo.rotateZ(-Math.PI / 2);

  const driveHubGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.36, 18);
  driveHubGeo.rotateZ(Math.PI / 2);

  const lugNutGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.36, 6);
  lugNutGeo.rotateZ(Math.PI / 2);

  const brakeRotorGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24);
  brakeRotorGeo.rotateZ(Math.PI / 2);

  const brakeCaliperGeo = new THREE.BoxGeometry(0.14, 0.18, 0.16);

  const sidewallRingGeo = new THREE.RingGeometry(0.435, 0.47, 36);
  sidewallRingGeo.rotateY(Math.PI / 2);

  function createRealisticWheelUnit(isDual: boolean) {
    const wheelGroup = new THREE.Group();
    const offsets = isDual ? [-0.17, 0.17] : [0];

    const rotor = new THREE.Mesh(brakeRotorGeo, brakeRotorMat);
    rotor.position.x = isDual ? -0.05 : 0;
    wheelGroup.add(rotor);

    const caliper = new THREE.Mesh(brakeCaliperGeo, brakeCaliperMat);
    caliper.position.set(isDual ? -0.05 : 0, 0.2, 0);
    wheelGroup.add(caliper);

    offsets.forEach((ox, idx) => {
      const tire = new THREE.Mesh(tireGeo, highContrastTireMat);
      tire.position.x = ox;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const bulge = new THREE.Mesh(sidewallGeo, highContrastTireMat);
      bulge.position.x = ox;
      wheelGroup.add(bulge);

      const rim = new THREE.Mesh(rimBarrelGeo, polishedWheelDiscMat);
      rim.position.x = ox;
      wheelGroup.add(rim);

      if (!isDual || idx === 1) {
        const rimLip = new THREE.Mesh(rimLipGeo, brightRimLipMat);
        rimLip.position.x = ox + 0.16;
        wheelGroup.add(rimLip);

        const sidewallRing = new THREE.Mesh(
          sidewallRingGeo,
          whiteWheelAccentMat
        );
        sidewallRing.position.x = ox + 0.165;
        wheelGroup.add(sidewallRing);
      }
    });

    const outerX = isDual ? 0.17 : 0;

    if (!isDual) {
      const steerHub = new THREE.Mesh(steerHubGeo, brightRimLipMat);
      steerHub.position.x = outerX + 0.16;
      wheelGroup.add(steerHub);
    } else {
      const driveHub = new THREE.Mesh(driveHubGeo, chassisSteelMat);
      driveHub.position.x = outerX;
      wheelGroup.add(driveHub);

      const oilPlug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.048, 0.38, 12),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
      );
      oilPlug.rotateZ(Math.PI / 2);
      oilPlug.position.x = outerX;
      wheelGroup.add(oilPlug);
    }

    for (let n = 0; n < 10; n++) {
      const ang = (n / 10) * Math.PI * 2;
      const lug = new THREE.Mesh(lugNutGeo, brightRimLipMat);
      lug.position.set(outerX, Math.cos(ang) * 0.24, Math.sin(ang) * 0.24);
      wheelGroup.add(lug);
    }

    return wheelGroup;
  }

  // Heavy Arched Fenders (Mudguards) over tractor drive axles and trailer axles
  for (const side of [-1, 1]) {
    [2.55, 1.22].forEach((fz) => {
      const fenderMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.72,
          0.72,
          0.76,
          24,
          1,
          true,
          -Math.PI / 2.3,
          Math.PI / 1.15
        ),
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

    [-6.45, -7.75, -9.05].forEach((fz) => {
      const trailerFender = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.72,
          0.72,
          0.76,
          24,
          1,
          true,
          -Math.PI / 2.3,
          Math.PI / 1.15
        ),
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

    // Differential Housing ("Pumpkin") & Air-Ride Suspension Bellows on Rear Axles
    if (ax.dual) {
      const diffHousing = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 14, 12),
        chassisSteelMat
      );
      diffHousing.position.set(0, 0.55, ax.z);
      truckRoot.add(diffHousing);

      for (const side of [-1, 1]) {
        const airBag = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.32, 14),
          tireRubberMat
        );
        airBag.position.set(side * 0.52, 0.78, ax.z);
        truckRoot.add(airBag);
      }
    }

    for (const side of [-1, 1]) {
      const wUnit = createRealisticWheelUnit(ax.dual);
      wUnit.position.set(side * (ax.dual ? 1.08 : 1.18), 0.55, ax.z);
      if (side === -1) wUnit.rotation.y = Math.PI;
      truckRoot.add(wUnit);
    }
  });

  freezeStaticGroup(streetWorldGroup);

  return streetWorldGroup;
}