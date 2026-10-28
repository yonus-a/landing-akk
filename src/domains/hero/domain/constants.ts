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

/* ── Globe & parcel-handover act (rendered in its own small-scale scene) ── */
export const GLOBE_RADIUS = 10.4;
export const GLOBE_INITIAL_ROTATION = { x: 0.28, y: -2.05, z: -0.06 };
/** Tehran — hub of the supply corridors and the point the ground dive locks onto. */
export const GLOBE_HUB = { lat: 35.7, lon: 51.4 };
/**
 * Locked-on ground dive (end of Act I). The hub stays pinned on the camera axis while
 * apparent magnification grows at a constant rate, so the ground rushes in without the
 * sphere ever crossing the camera's near plane.
 */
export const GLOBE_DIVE = {
  /** Timeline time the dive begins (reveal rotation has settled). */
  start: 3.5,
  /** Globe scale at the start of the dive (matches the end of the reveal). */
  scaleFrom: 1.28,
  /**
   * Peak magnification. Kept gentle so supply corridors stay readable and don't
   * balloon into screen-filling arcs before the cloud handoff.
   */
  scaleTo: 2.15,
  /** Camera-to-surface distance at dive end — approaches the cloud deck, not the ground. */
  groundDistanceTo: 9.5,
  /** Fraction of the dive over which the hub glides from its reveal position onto the camera axis. */
  lockOnBlend: 0.45,
};
/** Photoreal Earth for Act I (maps come from `public/earth.usdz`). */
export const EARTH_LOOK = {
  usdzUrl: "/earth.usdz",
  /** World-space direction towards the sun: upper right, slightly in front, so a night crescent shows on the left limb. */
  sunDirection: [0.82, 0.36, 0.6] as const,
  sunIntensity: 2.0,
  /** The USDZ base colour is authored very dark; this lifts it to a natural daylight albedo. */
  albedoGain: 3.8,
  cityLightsIntensity: 2.6,
  cloudRadius: 1.012,
  atmosphereRadius: 1.05,
  /** Baseline cloud coverage added on top of the latitude bands. */
  cloudCover: 0.0,
  /** Brief cloud veil at the end of the dive — enough to hide ground, not a long stay inside. */
  diveCloudCover: 0.85,
  /** Corridor / traveler colour (display-referred, written straight into the render target). */
  corridorColor: [1.0, 0.71, 0.28] as const,
};
/**
 * Globe → airplane handoff: paper dissolve kicks in the instant the cloud veil peaks,
 * so scroll never idles inside an opaque cloud wall.
 */
export const GLOBE_TO_AIR_HANDOFF = {
  outLead: 0.95,
  outDuration: 0.35,
  inDuration: 0.65,
};
export const GLOBE_CAMERA = {
  fov: 42,
  near: 0.1,
  far: 2000,
  y: 1.2,
  zLandscape: 42,
  zPortrait: 48,
  /** Horizontal look offset so the globe sits left of the canvas centre on wide screens. */
  lookOffsetX: 2.5,
};
/** Paper dissolve bridging two acts: sketch fades to blank paper, render path swaps, sketch fades back in. */
export const ACT_HANDOFF = {
  /** Dissolve-out starts this many seconds before the swap. */
  outLead: 0.85,
  /** Length of the dissolve-out (ends with a short pure-paper beat before the swap). */
  outDuration: 0.7,
  /** Length of the dissolve-in after the swap. */
  inDuration: 1.1,
};
export const DELIVERY_SCENE = {
  position: { x: 0, y: -4.8, z: 0 },
  hiddenScale: 0.001,
  revealScale: 2.85,
};

/* ── Unified scroll timeline (seconds of GSAP timeline time) ─────────────
   Act I   (0 → 8.0)      Globe reveal → dive into cloud bank → paper dissolve
   Act II  (8.0 → 30.8)   Airplane → container ship → truck (stretched by LOGISTICS_TIME_SCALE)
   Act III (31.8 → 37.0)  Parcel handover at the client's door
   Acts are bridged by the in-shader paper dissolve (see ACT_HANDOFF /
   GLOBE_TO_AIR_HANDOFF).                                                */
/** Cloud-bank dive dissolves to paper; the airplane emerges from it. */
export const LOGISTICS_ACT_START = 8.0;
/**
 * Stretches the airplane → ship → truck choreography over more scroll distance, so a
 * touchpad flick doesn't race through it. The globe and handover acts keep their pace.
 */
export const LOGISTICS_TIME_SCALE = 2.0;
/** Maps a time authored at the act's base pace onto the stretched timeline. */
export const logisticsAt = (t: number) => LOGISTICS_ACT_START + t * LOGISTICS_TIME_SCALE;
/** Length of the airplane → ship → truck choreography. */
export const LOGISTICS_ACT_DURATION = 11.4 * LOGISTICS_TIME_SCALE;
export const LOGISTICS_ACT_END = LOGISTICS_ACT_START + LOGISTICS_ACT_DURATION;
/** Mist handoff from the truck completes; handover scene starts emerging. */
export const HANDOVER_ACT_START = LOGISTICS_ACT_END + 1.0;
/** Handover choreography (3.2s) plus a 2s rest on the final frame. */
export const HANDOVER_ACT_DURATION = 5.2;
export const HERO_TIMELINE_DURATION = HANDOVER_ACT_START + HANDOVER_ACT_DURATION;
/** Timeline seconds per 100vh of scroll. */
const TIMELINE_SECONDS_PER_VIEWPORT = 4.7;
/** Scroll distance of the hero wrapper, derived so every act keeps a consistent scroll pace. */
export const HERO_SCROLL_HEIGHT = `${Math.round(
  (HERO_TIMELINE_DURATION / TIMELINE_SECONDS_PER_VIEWPORT) * 100
)}vh`;

export type HeroPhase = 1 | 2 | 3 | 4 | 5 | 6;

/** Timeline times at which the copy switches to the next phase. */
export const HERO_PHASE_END_TIMES: readonly number[] = [
  3.3, // globe → customs (zoom into Iran)
  LOGISTICS_ACT_START - 0.5, // customs → air (during the paper dissolve)
  logisticsAt(3.6), // air → sea (right after the brief cloud punch)
  logisticsAt(7.6), // sea → land
  LOGISTICS_ACT_END + 0.5, // land → handover (during the paper dissolve)
];

export function getHeroPhase(timelineTime: number): HeroPhase {
  let phase = 1;
  for (const end of HERO_PHASE_END_TIMES) {
    if (timelineTime >= end) phase++;
  }
  return phase as HeroPhase;
}

/** Representative timeline time for each phase (used by programmatic scrolling). */
export const HERO_PHASE_FOCUS_TIMES: Record<HeroPhase, number> = {
  1: 1.5,
  2: 5.4,
  3: logisticsAt(0.8),
  4: logisticsAt(5.5),
  5: logisticsAt(10.0),
  6: HANDOVER_ACT_START + 2.2,
};
export const PALETTE_CONTAINERS = [
  new THREE.Color(0xf8fafc), // Stark White Reefer Container (High-contrast luma)
  new THREE.Color(0x0284c7), // Maersk / Ocean Sky Blue
  new THREE.Color(0xd97706), // MSC Warm Industrial Amber
  new THREE.Color(0x3b5b8f), // Brand-harmonized Navy Blue
  new THREE.Color(0xffffff), // Pure White High-Cube Reefer
  new THREE.Color(0xc2410c), // Hapag-Lloyd Rust Orange
  new THREE.Color(0x047857), // Evergreen Forest Emerald
  new THREE.Color(0xb91c1c), // Maritime Crimson Red
  new THREE.Color(0xfacc15), // Safety Marine Yellow
  new THREE.Color(0x7d8696), // Industrial Steel Grey
];
