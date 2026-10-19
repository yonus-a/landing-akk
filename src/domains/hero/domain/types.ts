import * as THREE from "three";

export interface AirplaneComponents {
  airplaneGroup: THREE.Group;
  currentAirplaneMesh: THREE.Group;
  engineFans: THREE.Group[];
  navLights: Array<{ mesh: THREE.Mesh; isBeacon?: boolean }>;
  exhaustGlows: THREE.Mesh[];
}

export interface HeroRefs {
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  sunGlowRef: React.RefObject<HTMLDivElement | null>;
  cloudMistRef: React.RefObject<HTMLDivElement | null>;
  scrollPromptRef: React.RefObject<HTMLDivElement | null>;
  loadingScreenRef: React.RefObject<HTMLDivElement | null>;
  scrollWrapperRef: React.RefObject<HTMLDivElement | null>;
}
