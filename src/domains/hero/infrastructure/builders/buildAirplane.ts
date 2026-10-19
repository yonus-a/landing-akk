import * as THREE from "three";
import { AirplaneComponents } from "../../domain/types";
import { INITIAL_AIRPLANE } from "../../domain/constants";

export function buildEnhancedAirplane(
  sharedGlowTex: THREE.Texture
): AirplaneComponents {
  void sharedGlowTex;

  const airplaneGroup = new THREE.Group();
  const engineFans: THREE.Group[] = [];
  const navLights: Array<{ mesh: THREE.Mesh; isBeacon?: boolean }> = [];
  const exhaustGlows: THREE.Mesh[] = [];

  const plane = new THREE.Group();

  const bodyWhiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.26,
    metalness: 0.08,
    clearcoat: 0.85,
    clearcoatRoughness: 0.14,
    side: THREE.DoubleSide,
  });

  const radomeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.6,
  });

  const wingCompositeMat = new THREE.MeshStandardMaterial({
    color: 0xe5eaf0,
    roughness: 0.45,
    metalness: 0.18,
    side: THREE.DoubleSide,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xdbe4ee,
    roughness: 0.12,
    metalness: 0.95,
  });

  const darkChamberMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.35,
    metalness: 0.6,
    side: THREE.DoubleSide,
  });

  const exhaustMetalMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.28,
    metalness: 0.88,
    side: THREE.DoubleSide,
  });

  const titaniumBladeMat = new THREE.MeshPhysicalMaterial({
    color: 0x94a3b8,
    roughness: 0.22,
    metalness: 0.95,
    clearcoat: 0.4,
  });

  const cockpitGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x071324,
    emissive: 0x0b1d36,
    emissiveIntensity: 0.25,
    roughness: 0.05,
    metalness: 0.25,
    reflectivity: 1.0,
    clearcoat: 1.0,
    side: THREE.DoubleSide,
  });

  const windowFrameMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.5,
    side: THREE.DoubleSide,
  });

  // تابع کمکی برای محاسبه دقیق ابعاد مقطع بدنه در هر نقطه از طول (Z)
  function getFuselageCrossSection(z: number) {
    let rx = 2.16;
    let ry = 2.28;
    let centerY = 0;

    if (z < -10.5) {
      const nt = THREE.MathUtils.clamp((z + 17.2) / 6.7, 0.001, 1.0);
      const profile = Math.pow(Math.sin(nt * Math.PI * 0.5), 0.68);
      rx = 2.16 * profile;
      ry = 2.28 * profile;
      centerY = -0.52 * Math.pow(1.0 - nt, 1.75);
    } else if (z > 6.5) {
      const tt = THREE.MathUtils.clamp((z - 6.5) / 12.7, 0.0, 1.0);
      const taper = Math.cos(tt * Math.PI * 0.48);
      rx = 2.16 * Math.pow(taper, 1.15);
      ry = 2.28 * Math.pow(taper, 0.92);
      centerY = 0.88 * Math.pow(tt, 1.65);
    }

    return { rx, ry, centerY };
  }

  function createFuselageGeometry() {
    const lengthSegments = 72;
    const radialSegments = 48;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= lengthSegments; i++) {
      const t = i / lengthSegments;
      const z = -17.2 + t * 36.4;
      const { rx, ry, centerY } = getFuselageCrossSection(z);

      for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments;
        const theta = v * Math.PI * 2;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        let x = rx * cosT;
        let y = ry * sinT + centerY;

        if (z > -6.5 && z < 4.8 && sinT < -0.15) {
          const bellyFactor = Math.cos(((z + 0.8) / 5.6) * Math.PI * 0.5);
          if (bellyFactor > 0) {
            y -= 0.38 * bellyFactor * Math.pow(Math.abs(sinT), 1.5);
            x *= 1.0 + 0.09 * bellyFactor;
          }
        }

        positions.push(x, y, z);
        uvs.push(v, t);
      }
    }

    for (let i = 0; i < lengthSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);
        indices.push(a, b, d, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  const fuselageMesh = new THREE.Mesh(createFuselageGeometry(), bodyWhiteMat);
  fuselageMesh.castShadow = true;
  fuselageMesh.receiveShadow = true;
  plane.add(fuselageMesh);

  const apuCone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.28, 0.9, 16),
    exhaustMetalMat
  );
  apuCone.rotation.x = Math.PI / 2;
  apuCone.position.set(0, 0.88, 19.3);
  plane.add(apuCone);

  // ساخت پنل‌های شیشه جلو و کناری کابین خلبان منطبق بر انحنای دماغه
  function createCurvedCockpitPanel(
    side: number,
    zBotIn: number,
    zTopIn: number,
    phiBotIn: number,
    phiTopIn: number,
    zBotOut: number,
    zTopOut: number,
    phiBotOut: number,
    phiTopOut: number,
    surfaceOffset: number
  ) {
    const uSegs = 10;
    const vSegs = 6;
    const positions: number[] = [];
    const indices: number[] = [];

    for (let iu = 0; iu <= uSegs; iu++) {
      const u = iu / uSegs;
      const zBot = THREE.MathUtils.lerp(zBotIn, zBotOut, u);
      const zTop = THREE.MathUtils.lerp(zTopIn, zTopOut, u);
      const phiBot = THREE.MathUtils.lerp(phiBotIn, phiBotOut, u);
      const phiTop = THREE.MathUtils.lerp(phiTopIn, phiTopOut, u);

      for (let iv = 0; iv <= vSegs; iv++) {
        const v = iv / vSegs;
        const z = THREE.MathUtils.lerp(zBot, zTop, v);
        const phi = THREE.MathUtils.lerp(phiBot, phiTop, v);
        const { rx, ry, centerY } = getFuselageCrossSection(z);

        const x = side * (rx + surfaceOffset) * Math.sin(phi);
        const y = centerY + (ry + surfaceOffset) * Math.cos(phi);
        positions.push(x, y, z);
      }
    }

    for (let iu = 0; iu < uSegs; iu++) {
      for (let iv = 0; iv < vSegs; iv++) {
        const a = iu * (vSegs + 1) + iv;
        const b = (iu + 1) * (vSegs + 1) + iv;
        const c = (iu + 1) * (vSegs + 1) + (iv + 1);
        const d = iu * (vSegs + 1) + (iv + 1);
        if (side === 1) {
          indices.push(a, b, d, b, c, d);
        } else {
          indices.push(a, d, b, b, d, c);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  const cockpitGroup = new THREE.Group();
  const paneSpecs = [
    // شیشه اصلی روبه‌رو (Front Windshield)
    {
      zBotIn: -15.75,
      zTopIn: -14.95,
      phiBotIn: 0.06,
      phiTopIn: 0.05,
      zBotOut: -14.8,
      zTopOut: -14.25,
      phiBotOut: 0.88,
      phiTopOut: 0.62,
    },
    // شیشه میانی کابین خلبان
    {
      zBotIn: -14.68,
      zTopIn: -14.15,
      phiBotIn: 0.91,
      phiTopIn: 0.65,
      zBotOut: -13.65,
      zTopOut: -13.38,
      phiBotOut: 1.08,
      phiTopOut: 0.82,
    },
    // شیشه عقبی کابین خلبان (با برش مورب رو به بالا به سبک بوئینگ)
    {
      zBotIn: -13.52,
      zTopIn: -13.26,
      phiBotIn: 1.1,
      phiTopIn: 0.84,
      zBotOut: -12.45,
      zTopOut: -12.4,
      phiBotOut: 1.12,
      phiTopOut: 0.92,
    },
  ];

  for (const side of [-1, 1]) {
    for (const p of paneSpecs) {
      // قاب تیره دور شیشه کابین
      const frameGeo = createCurvedCockpitPanel(
        side,
        p.zBotIn - 0.06,
        p.zTopIn + 0.06,
        Math.max(0.01, p.phiBotIn - 0.03),
        Math.max(0.01, p.phiTopIn - 0.03),
        p.zBotOut + 0.06,
        p.zTopOut + 0.06,
        p.phiBotOut + 0.03,
        p.phiTopOut - 0.03,
        0.022
      );
      cockpitGroup.add(new THREE.Mesh(frameGeo, windowFrameMat));

      // شیشه اصلی کابین
      const glassGeo = createCurvedCockpitPanel(
        side,
        p.zBotIn,
        p.zTopIn,
        p.phiBotIn,
        p.phiTopIn,
        p.zBotOut,
        p.zTopOut,
        p.phiBotOut,
        p.phiTopOut,
        0.032
      );
      cockpitGroup.add(new THREE.Mesh(glassGeo, cockpitGlassMat));
    }
  }
  plane.add(cockpitGroup);

  // تابع کمکی ساخت شکل کپسولی (بیضی عمودی) استاندارد پنجره هواپیما
  function createCapsuleWindowGeo(width: number, height: number, depth: number) {
    const r = width / 2;
    const halfH = Math.max(0.01, height / 2 - r);
    const shape = new THREE.Shape();
    shape.absarc(0, halfH, r, 0, Math.PI, false);
    shape.absarc(0, -halfH, r, Math.PI, Math.PI * 2, false);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
      curveSegments: 16,
    });
  }

  // پنجره‌های کابین مسافران: با قاب و شیشه تیره و ابعاد واقعی‌تر، بالاتر از بال
  const winFrameGeo = createCapsuleWindowGeo(0.28, 0.4, 0.04);
  const winGlassGeo = createCapsuleWindowGeo(0.21, 0.33, 0.052);
  const winCountPerSide = 24;

  const winFrameInstanced = new THREE.InstancedMesh(
    winFrameGeo,
    windowFrameMat,
    winCountPerSide * 2
  );
  const winGlassInstanced = new THREE.InstancedMesh(
    winGlassGeo,
    cockpitGlassMat,
    winCountPerSide * 2
  );

  const dummy = new THREE.Object3D();
  let wIdx = 0;
  const elevAngle = 0.28; // ارتفاع پنجره‌ها بالاتر از بال و هم‌راستا با شیشه جلو

  for (const side of [-1, 1]) {
    for (let i = 0; i < winCountPerSide; i++) {
      const t = i / (winCountPerSide - 1);
      const z = -10.2 + t * 15.0;
      const { rx, ry, centerY } = getFuselageCrossSection(z);

      const x = side * Math.cos(elevAngle) * (rx - 0.01);
      const y = centerY + Math.sin(elevAngle) * (ry - 0.01);

      dummy.position.set(x, y, z);
      const nx = x / (rx * rx);
      const ny = (y - centerY) / (ry * ry);
      dummy.lookAt(x + nx, y + ny, z);
      dummy.updateMatrix();

      winFrameInstanced.setMatrixAt(wIdx, dummy.matrix);
      winGlassInstanced.setMatrixAt(wIdx, dummy.matrix);
      wIdx++;
    }
  }
  winFrameInstanced.instanceMatrix.needsUpdate = true;
  winGlassInstanced.instanceMatrix.needsUpdate = true;
  plane.add(winFrameInstanced);
  plane.add(winGlassInstanced);

  const antGeo = new THREE.BoxGeometry(0.05, 0.42, 0.65);
  const ant1 = new THREE.Mesh(antGeo, radomeMat);
  ant1.position.set(0, 2.38, -5.5);
  ant1.rotation.x = -0.35;
  plane.add(ant1);
  const ant2 = ant1.clone();
  ant2.position.z = 2.5;
  plane.add(ant2);

  // طراحی بال صاف به سبک بوئینگ بدون خمیدگی رو به بالا در انتهای بال
  function createAirfoilWingGeometry(side: number) {
    const spanSegments = 36;
    const chordSegments = 28;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    function getAirfoilPoint(s: number, thickness: number) {
      const angle = s * Math.PI * 2;
      const xLocal = 0.5 * (1 - Math.cos(angle));
      const yt =
        5 *
        thickness *
        (0.2969 * Math.sqrt(xLocal) -
          0.126 * xLocal -
          0.3516 * Math.pow(xLocal, 2) +
          0.2843 * Math.pow(xLocal, 3) -
          0.1015 * Math.pow(xLocal, 4));
      const camber = 0.025 * (1 - xLocal) * xLocal * 4;
      const yLocal = (s < 0.5 ? yt : -yt * 0.65) + camber;
      return { x: xLocal, y: yLocal };
    }

    for (let i = 0; i <= spanSegments; i++) {
      const u = i / spanSegments;
      const spanX = side * (1.85 + u * 20.35);
      const dihedralY = -0.55 + u * 1.45;

      let sweepZ: number,
        chordLen: number,
        thickness: number,
        twist: number;

      if (u <= 0.88) {
        const wt = u / 0.88;
        sweepZ = -4.8 + wt * 8.2;
        chordLen =
          wt < 0.32 ? 7.2 - wt * 6.5 : 5.12 - (wt - 0.32) * 5.2;
        thickness = 0.14 - wt * 0.045;
        twist = -wt * 0.04;
      } else {
        const lt = (u - 0.88) / 0.12;
        sweepZ = 3.4 + lt * 1.45;
        chordLen = 1.584 * (1.0 - lt * 0.65);
        thickness = 0.095 * (1.0 - lt * 0.4);
        twist = -0.04;
      }

      for (let j = 0; j <= chordSegments; j++) {
        const v = j / chordSegments;
        const pt = getAirfoilPoint(v, thickness);
        const localZ = pt.x * chordLen;
        const localY = pt.y * chordLen;
        const rotatedY =
          localY * Math.cos(twist) - localZ * Math.sin(twist);
        const rotatedZ =
          localY * Math.sin(twist) + localZ * Math.cos(twist);

        positions.push(spanX, dihedralY + rotatedY, sweepZ + rotatedZ);
        uvs.push(u, v);
      }
    }

    for (let i = 0; i < spanSegments; i++) {
      for (let j = 0; j < chordSegments; j++) {
        const a = i * (chordSegments + 1) + j;
        const b = (i + 1) * (chordSegments + 1) + j;
        const c = (i + 1) * (chordSegments + 1) + (j + 1);
        const d = i * (chordSegments + 1) + (j + 1);
        if (side === 1) {
          indices.push(a, b, d, b, c, d);
        } else {
          indices.push(a, d, b, b, d, c);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  const rightWing = new THREE.Mesh(
    createAirfoilWingGeometry(1),
    wingCompositeMat
  );
  rightWing.castShadow = true;
  rightWing.receiveShadow = true;
  plane.add(rightWing);

  const leftWing = new THREE.Mesh(
    createAirfoilWingGeometry(-1),
    wingCompositeMat
  );
  leftWing.castShadow = true;
  leftWing.receiveShadow = true;
  plane.add(leftWing);

  const canoeGeo = new THREE.ConeGeometry(0.18, 2.1, 12);
  canoeGeo.rotateX(Math.PI / 2);
  const flapOffsets = [
    { x: 4.8, y: -0.35, z: 1.5 },
    { x: 9.2, y: 0.05, z: 2.3 },
    { x: 13.5, y: 0.35, z: 3.1 },
  ];
  for (const side of [-1, 1]) {
    flapOffsets.forEach((fo) => {
      const canoe = new THREE.Mesh(canoeGeo, wingCompositeMat);
      canoe.position.set(side * fo.x, fo.y, fo.z);
      canoe.scale.set(0.85, 1.0, 1.0);
      plane.add(canoe);
    });
  }

  function createModernTurbofanEngine(side: number) {
    const engineAssembly = new THREE.Group();
    engineAssembly.position.set(side * 7.2, -1.35, -3.1);

    const nacelleProfile = [
      new THREE.Vector2(0.95, -0.8),
      new THREE.Vector2(1.02, -2.05),
      new THREE.Vector2(1.16, -2.35),
      new THREE.Vector2(1.34, -1.75),
      new THREE.Vector2(1.42, -0.4),
      new THREE.Vector2(1.36, 1.1),
      new THREE.Vector2(1.14, 2.45),
      new THREE.Vector2(0.98, 2.45),
      new THREE.Vector2(0.98, 1.5),
    ];
    const nacelleGeo = new THREE.LatheGeometry(nacelleProfile, 44);
    nacelleGeo.rotateX(Math.PI / 2);

    const nacelleGroup = new THREE.Group();
    nacelleGroup.rotation.x = 0.03;

    const nacelleMesh = new THREE.Mesh(nacelleGeo, bodyWhiteMat);
    nacelleMesh.castShadow = true;
    nacelleMesh.receiveShadow = true;
    nacelleGroup.add(nacelleMesh);

    const lipProfile = [
      new THREE.Vector2(0.98, -1.65),
      new THREE.Vector2(1.03, -2.18),
      new THREE.Vector2(1.15, -2.38),
      new THREE.Vector2(1.26, -2.15),
      new THREE.Vector2(1.32, -1.75),
    ];
    const lipGeo = new THREE.LatheGeometry(lipProfile, 44);
    lipGeo.rotateX(Math.PI / 2);
    nacelleGroup.add(new THREE.Mesh(lipGeo, chromeMat));

    const innerTunnelGeo = new THREE.CylinderGeometry(0.96, 0.96, 2.8, 32);
    innerTunnelGeo.rotateX(Math.PI / 2);
    const innerTunnel = new THREE.Mesh(innerTunnelGeo, darkChamberMat);
    innerTunnel.position.z = -0.3;
    nacelleGroup.add(innerTunnel);

    const fanRotor = new THREE.Group();
    fanRotor.position.z = -1.15;

    const spinnerGeo = new THREE.ConeGeometry(0.42, 1.1, 24);
    spinnerGeo.rotateX(-Math.PI / 2);
    fanRotor.add(new THREE.Mesh(spinnerGeo, darkChamberMat));

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.04);
    bladeShape.quadraticCurveTo(0.55, 0.0, 0.88, 0.05);
    bladeShape.quadraticCurveTo(0.62, 0.1, 0.0, 0.06);
    bladeShape.closePath();
    const bladeGeoBase = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.018,
      bevelEnabled: false,
    });
    bladeGeoBase.translate(0, 0, -0.009);

    const bladeCount = 24;
    for (let b = 0; b < bladeCount; b++) {
      const blade = new THREE.Mesh(bladeGeoBase, titaniumBladeMat);
      const angle = (b / bladeCount) * Math.PI * 2;
      blade.position.set(
        Math.cos(angle) * 0.48,
        Math.sin(angle) * 0.48,
        0
      );
      blade.rotation.set(0.18 * Math.sin(angle), 0.62, angle);
      fanRotor.add(blade);
    }
    nacelleGroup.add(fanRotor);
    engineFans.push(fanRotor);

    const bypassSleeveGeo = new THREE.CylinderGeometry(0.84, 1.02, 1.35, 32);
    bypassSleeveGeo.rotateX(Math.PI / 2);
    const bypassSleeve = new THREE.Mesh(bypassSleeveGeo, exhaustMetalMat);
    bypassSleeve.position.z = 2.65;
    nacelleGroup.add(bypassSleeve);

    const corePlugGeo = new THREE.ConeGeometry(0.52, 1.6, 24);
    corePlugGeo.rotateX(Math.PI / 2);
    const corePlug = new THREE.Mesh(corePlugGeo, darkChamberMat);
    corePlug.position.z = 3.45;
    nacelleGroup.add(corePlug);

    const exhaustGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.55, 24),
      new THREE.MeshBasicMaterial({
        color: 0xff7a18,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    exhaustGlow.position.z = 3.7;
    exhaustGlow.rotation.x = Math.PI / 2;
    nacelleGroup.add(exhaustGlow);
    exhaustGlows.push(exhaustGlow);

    engineAssembly.add(nacelleGroup);

    const strutGeo = new THREE.BoxGeometry(0.32, 0.95, 3.8);
    const strutMesh = new THREE.Mesh(strutGeo, wingCompositeMat);
    strutMesh.position.set(0, 1.05, 0.65);
    strutMesh.castShadow = true;
    engineAssembly.add(strutMesh);

    return engineAssembly;
  }

  plane.add(createModernTurbofanEngine(1));
  plane.add(createModernTurbofanEngine(-1));

  const tailGroup = new THREE.Group();
  const vShape = new THREE.Shape();
  vShape.moveTo(0, 0);
  vShape.quadraticCurveTo(2.2, 0.4, 3.5, 1.8);
  vShape.lineTo(7.8, 7.6);
  vShape.lineTo(10.4, 7.6);
  vShape.lineTo(8.8, 0);
  vShape.closePath();

  const vGeo = new THREE.ExtrudeGeometry(vShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.12,
    bevelThickness: 0.12,
  });
  vGeo.rotateY(-Math.PI / 2);
  const vFin = new THREE.Mesh(vGeo, bodyWhiteMat);
  vFin.position.set(0.12, 1.25, 8.8);
  vFin.castShadow = true;
  tailGroup.add(vFin);

  for (const side of [-1, 1]) {
    const hShape = new THREE.Shape();
    hShape.moveTo(0, 0);
    hShape.lineTo(side * 7.2, 2.8);
    hShape.lineTo(side * 7.4, 3.9);
    hShape.lineTo(0, 3.1);
    hShape.closePath();

    const hGeo = new THREE.ExtrudeGeometry(hShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    hGeo.rotateX(Math.PI / 2);
    const hFin = new THREE.Mesh(hGeo, wingCompositeMat);
    hFin.position.set(side * 0.85, 1.15, 14.2);
    hFin.rotation.z = side * 0.075;
    hFin.castShadow = true;
    tailGroup.add(hFin);
  }

  plane.add(tailGroup);

  airplaneGroup.add(plane);
  airplaneGroup.position.set(
    INITIAL_AIRPLANE.position.x,
    INITIAL_AIRPLANE.position.y,
    INITIAL_AIRPLANE.position.z
  );
  airplaneGroup.rotation.set(
    INITIAL_AIRPLANE.rotation.x,
    INITIAL_AIRPLANE.rotation.y,
    INITIAL_AIRPLANE.rotation.z
  );

  return {
    airplaneGroup,
    currentAirplaneMesh: plane,
    engineFans,
    navLights,
    exhaustGlows,
  };
}