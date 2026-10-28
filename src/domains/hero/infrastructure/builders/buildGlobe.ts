import * as THREE from "three";
import {
  GLOBE_RADIUS,
  GLOBE_INITIAL_ROTATION,
  GLOBE_HUB,
  EARTH_LOOK,
} from "../../domain/constants";
import {
  createEarthSurfaceMaterial,
  createEarthCloudMaterial,
  createEarthAtmosphereMaterial,
} from "../../domain/shaders/earthShaders";
import {
  createPlaceholderEarthMaps,
  disposeEarthMaps,
  type EarthMaps,
} from "../textures/earthUsdzTextures";

export interface GlobeTraveler {
  mesh: THREE.Mesh;
  curve: THREE.CubicBezierCurve3;
  offset: number;
}

export interface GlobeComponents {
  globeGroup: THREE.Group;
  travelers: GlobeTraveler[];
  /** Unit vector (globe-local space) pointing at the corridor hub; the ground dive locks onto it. */
  hubDirection: THREE.Vector3;
  /** Swaps in the USDZ maps; returns the previous maps so the caller can dispose them. */
  setMaps: (maps: EarthMaps) => EarthMaps;
  /** Dive progress 0 → 1: rolls in a cloud bank, fades the terrain, then the halo as we enter the air. */
  setDive: (t: number) => void;
  update: (elapsed: number) => void;
  dispose: () => void;
}

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Photoreal Earth (USDZ day map, land mask and city lights) with procedural weather, an
 * atmospheric halo, glowing supply corridors converging on Tehran and animated travelers.
 */
export function buildGlobe(): GlobeComponents {
  const globeGroup = new THREE.Group();
  globeGroup.position.set(0, 0, 0);

  const hubDirection = latLonToVec3(GLOBE_HUB.lat, GLOBE_HUB.lon, 1).normalize();

  let maps = createPlaceholderEarthMaps();
  const surfaceMaterial = createEarthSurfaceMaterial(maps, hubDirection);
  const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 160, 120), surfaceMaterial);
  globeGroup.add(earthMesh);

  const atmosphereMaterial = createEarthAtmosphereMaterial(GLOBE_RADIUS);
  const atmosphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * EARTH_LOOK.atmosphereRadius, 96, 64),
    atmosphereMaterial
  );
  atmosphereMesh.renderOrder = 1;
  globeGroup.add(atmosphereMesh);

  const cloudMaterial = createEarthCloudMaterial(hubDirection);
  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * EARTH_LOOK.cloudRadius, 160, 120),
    cloudMaterial
  );
  cloudMesh.renderOrder = 2;
  globeGroup.add(cloudMesh);

  // Written straight into the render target, so the colour is already display-referred
  const corridorMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setRGB(...EARTH_LOOK.corridorColor, THREE.LinearSRGBColorSpace),
    transparent: true,
    depthWrite: false,
  });
  const corridorGroup = new THREE.Group();
  corridorGroup.renderOrder = 3;
  globeGroup.add(corridorGroup);
  const travelers: GlobeTraveler[] = [];

  function addCorridor(
    fromCoord: { lat: number; lon: number },
    toCoord: { lat: number; lon: number },
    arcHeightFactor = 0.3
  ) {
    const surfaceR = GLOBE_RADIUS * 1.014;
    const startVec = latLonToVec3(fromCoord.lat, fromCoord.lon, surfaceR);
    const endVec = latLonToVec3(toCoord.lat, toCoord.lon, surfaceR);

    const dist = startVec.distanceTo(endVec);
    const midVec = startVec.clone().add(endVec).multiplyScalar(0.5);
    midVec.normalize().multiplyScalar(surfaceR + dist * arcHeightFactor);

    const ctrl1 = startVec
      .clone()
      .lerp(midVec, 0.65)
      .normalize()
      .multiplyScalar(surfaceR + dist * arcHeightFactor * 0.78);
    const ctrl2 = endVec
      .clone()
      .lerp(midVec, 0.65)
      .normalize()
      .multiplyScalar(surfaceR + dist * arcHeightFactor * 0.78);

    const fullCurve = new THREE.CubicBezierCurve3(startVec, ctrl1, ctrl2, endVec);

    [startVec, endVec].forEach((pt) => {
      const norm = pt.clone().normalize();
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), corridorMat);
      dot.position.copy(pt.clone().add(norm.clone().multiplyScalar(0.03)));
      dot.lookAt(pt.clone().add(norm));
      corridorGroup.add(dot);
    });

    const subPoints = fullCurve.getPoints(50).slice(0, 49);
    const bodyCurve = new THREE.CatmullRomCurve3(subPoints);
    const arcMesh = new THREE.Mesh(new THREE.TubeGeometry(bodyCurve, 48, 0.022, 6, false), corridorMat);
    corridorGroup.add(arcMesh);

    const tipPos = fullCurve.getPoint(0.985);
    const tipDir = endVec.clone().sub(fullCurve.getPoint(0.94)).normalize();

    const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.28, 12), corridorMat);
    arrowHead.position.copy(tipPos);
    arrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipDir);
    corridorGroup.add(arrowHead);

    const travelerMesh = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.24, 10), corridorMat);
    corridorGroup.add(travelerMesh);
    travelers.push({
      mesh: travelerMesh,
      curve: fullCurve,
      offset: Math.random(),
    });
  }

  // Single hub; origins chosen from continents that stay on the camera-facing hemisphere
  const TEHRAN = GLOBE_HUB;

  const corridors = [
    { from: { lat: 53.5, lon: 10.0 }, to: TEHRAN, h: 0.24 }, // Europe — Hamburg
    { from: { lat: -26.2, lon: 28.0 }, to: TEHRAN, h: 0.24 }, // Africa — Johannesburg
    { from: { lat: 31.2, lon: 121.5 }, to: TEHRAN, h: 0.26 }, // East Asia — Shanghai
    { from: { lat: -31.95, lon: 115.9 }, to: TEHRAN, h: 0.28 }, // Oceania — Perth
  ];

  corridors.forEach((r) => addCorridor(r.from, r.to, r.h));

  // Hub marker where all corridors converge, with a beacon pulse rippling out of it
  const hubPos = hubDirection.clone().multiplyScalar(GLOBE_RADIUS * 1.016);
  const hubRing = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 32), corridorMat);
  hubRing.position.copy(hubPos);
  hubRing.lookAt(hubPos.clone().add(hubDirection));
  corridorGroup.add(hubRing);

  const pulseMat = new THREE.MeshBasicMaterial({
    color: corridorMat.color,
    transparent: true,
    depthWrite: false,
  });
  const hubPulse = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.24, 48), pulseMat);
  hubPulse.position.copy(hubPos);
  hubPulse.quaternion.copy(hubRing.quaternion);
  hubPulse.renderOrder = 4;
  corridorGroup.add(hubPulse);

  globeGroup.rotation.set(
    GLOBE_INITIAL_ROTATION.x,
    GLOBE_INITIAL_ROTATION.y,
    GLOBE_INITIAL_ROTATION.z
  );

  const weatherMaterials = [surfaceMaterial, cloudMaterial];
  const up = new THREE.Vector3(0, 1, 0);
  let markerVisibility = 1;

  return {
    globeGroup,
    travelers,
    hubDirection: hubDirection.clone(),
    setMaps(next) {
      const previous = maps;
      maps = next;
      surfaceMaterial.uniforms.uAlbedo.value = next.albedo;
      surfaceMaterial.uniforms.uMask.value = next.mask;
      surfaceMaterial.uniforms.uLights.value = next.lights;
      return previous;
    },
    setDive(t) {
      // Approach stays clear; a short cloud veil only at the end, then the airplane cut
      const weatherIn = THREE.MathUtils.smoothstep(t, 0.55, 0.82);
      const bank = THREE.MathUtils.smoothstep(t, 0.72, 0.9);
      for (const mat of weatherMaterials) {
        mat.uniforms.uCloudCover.value =
          EARTH_LOOK.cloudCover + EARTH_LOOK.diveCloudCover * weatherIn;
        mat.uniforms.uHubClear.value = 1 - THREE.MathUtils.smoothstep(t, 0.5, 0.78);
        mat.uniforms.uDiveFade.value = bank;
      }
      surfaceMaterial.uniforms.uDetail.value =
        THREE.MathUtils.smoothstep(t, 0.25, 0.55) * (1 - bank);
      atmosphereMaterial.uniforms.uIntensity.value =
        1 - THREE.MathUtils.smoothstep(t, 0.55, 0.85);
      // Soften corridors at the first hint of zoom — never let them balloon then vanish
      markerVisibility = 1 - THREE.MathUtils.smoothstep(t, 0.02, 0.22);
      corridorMat.opacity = markerVisibility;
      corridorGroup.visible = markerVisibility > 0.02;
    },
    update(elapsed) {
      for (const mat of weatherMaterials) mat.uniforms.uTime.value = elapsed;

      travelers.forEach((tr) => {
        const t = ((elapsed * 0.25 + tr.offset) % 1.0) * 0.92 + 0.03;
        tr.mesh.position.copy(tr.curve.getPoint(t));
        tr.mesh.quaternion.setFromUnitVectors(up, tr.curve.getTangent(t).normalize());
      });

      const pulse = (elapsed * 0.6) % 1;
      hubPulse.scale.setScalar(1 + pulse * 3.2);
      pulseMat.opacity = (1 - pulse) * 0.85 * markerVisibility;
    },
    dispose() {
      disposeEarthMaps(maps);
    },
  };
}
