import * as THREE from "three";
import { GLOBE_RADIUS, GLOBE_INITIAL_ROTATION, GLOBE_HUB } from "../../domain/constants";
import {
  createGlobeSurfaceMaterial,
  createGlobeCloudMaterial,
} from "../../domain/shaders/globeShader";
import { createGlobeMapTexture } from "../textures/globeMapTexture";

export interface GlobeTraveler {
  mesh: THREE.Mesh;
  curve: THREE.CubicBezierCurve3;
  offset: number;
}

export interface GlobeComponents {
  globeGroup: THREE.Group;
  surfaceMaterial: THREE.ShaderMaterial;
  cloudMaterial: THREE.ShaderMaterial;
  travelers: GlobeTraveler[];
  mapTexture: THREE.CanvasTexture;
  /** Unit vector (globe-local space) pointing at the corridor hub; the ground dive locks onto it. */
  hubDirection: THREE.Vector3;
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
 * Sketch-style 3D globe with procedural clouds, hairline supply corridors
 * converging on Tehran and small animated "travelers" moving along each arc.
 */
export function buildGlobe(maxAnisotropy: number): GlobeComponents {
  const globeGroup = new THREE.Group();
  globeGroup.position.set(0, 0, 0);

  const mapTexture = createGlobeMapTexture(maxAnisotropy);
  const surfaceMaterial = createGlobeSurfaceMaterial(mapTexture);

  const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
  const earthMesh = new THREE.Mesh(earthGeo, surfaceMaterial);
  globeGroup.add(earthMesh);

  const cloudMaterial = createGlobeCloudMaterial();
  const cloudGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMaterial);
  globeGroup.add(cloudMesh);

  const arrowInkMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
  const travelers: GlobeTraveler[] = [];

  function addHairlinePointToPointArrow(
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
      const microDot = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), arrowInkMat);
      microDot.position.copy(pt.clone().add(norm.clone().multiplyScalar(0.03)));
      microDot.lookAt(pt.clone().add(norm));
      globeGroup.add(microDot);
    });

    const subPoints = fullCurve.getPoints(50).slice(0, 49);
    const bodyCurve = new THREE.CatmullRomCurve3(subPoints);
    const hairlineArcGeo = new THREE.TubeGeometry(bodyCurve, 48, 0.022, 6, false);
    const hairlineArcMesh = new THREE.Mesh(hairlineArcGeo, arrowInkMat);
    globeGroup.add(hairlineArcMesh);

    const tipPos = fullCurve.getPoint(0.985);
    const tipDir = endVec.clone().sub(fullCurve.getPoint(0.94)).normalize();

    const microArrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.28, 12), arrowInkMat);
    microArrowHead.position.copy(tipPos);
    microArrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipDir);
    globeGroup.add(microArrowHead);

    const travelerMesh = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.24, 10), arrowInkMat);
    globeGroup.add(travelerMesh);
    travelers.push({
      mesh: travelerMesh,
      curve: fullCurve,
      offset: Math.random(),
    });
  }

  // Single hub; origins chosen from continents that stay on the camera-facing hemisphere
  const TEHRAN = GLOBE_HUB;

  const pointToPointRoutes = [
    { from: { lat: 53.5, lon: 10.0 }, to: TEHRAN, h: 0.24 }, // Europe — Hamburg
    { from: { lat: -26.2, lon: 28.0 }, to: TEHRAN, h: 0.24 }, // Africa — Johannesburg
    { from: { lat: 31.2, lon: 121.5 }, to: TEHRAN, h: 0.26 }, // East Asia — Shanghai
    { from: { lat: -31.95, lon: 115.9 }, to: TEHRAN, h: 0.28 }, // Oceania — Perth
  ];

  pointToPointRoutes.forEach((r) => addHairlinePointToPointArrow(r.from, r.to, r.h));

  // Hub marker where all corridors converge
  const hubPos = latLonToVec3(TEHRAN.lat, TEHRAN.lon, GLOBE_RADIUS * 1.016);
  const hubNormal = hubPos.clone().normalize();
  const hubRing = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 32), arrowInkMat);
  hubRing.position.copy(hubPos);
  hubRing.lookAt(hubPos.clone().add(hubNormal));
  globeGroup.add(hubRing);

  globeGroup.rotation.set(
    GLOBE_INITIAL_ROTATION.x,
    GLOBE_INITIAL_ROTATION.y,
    GLOBE_INITIAL_ROTATION.z
  );

  return {
    globeGroup,
    surfaceMaterial,
    cloudMaterial,
    travelers,
    mapTexture,
    hubDirection: hubNormal.clone(),
  };
}

/** Advances the corridor travelers along their arcs. */
export function updateGlobeTravelers(travelers: GlobeTraveler[], elapsed: number): void {
  const up = new THREE.Vector3(0, 1, 0);
  travelers.forEach((tr) => {
    const t = ((elapsed * 0.25 + tr.offset) % 1.0) * 0.92 + 0.03;
    const pos = tr.curve.getPoint(t);
    const tangent = tr.curve.getTangent(t).normalize();
    tr.mesh.position.copy(pos);
    tr.mesh.quaternion.setFromUnitVectors(up, tangent);
  });
}
