"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SUN_DIRECTION,
  INITIAL_CAMERA,
  OCEAN_CONFIG,
} from "../../domain/constants";
import { createSkyMaterial } from "../../domain/shaders/skyShader";
import { createOceanMaterial } from "../../domain/shaders/oceanShader";
import {
  createGlowTexture,
  createCorrugatedBumpTexture,
  createHeroContainerTexture,
  createAsphaltTexture,
  createGrilleMeshTexture,
} from "../../infrastructure/textures/proceduralTextures";
import { disposeObject3D } from "../../infrastructure/webgl/utils";
import { buildEnhancedAirplane } from "../../infrastructure/builders/buildAirplane";
import { buildClouds } from "../../infrastructure/builders/buildClouds";
import { buildContainerShip } from "../../infrastructure/builders/buildShip";
import { buildStaticStreetAndRealisticTruck } from "../../infrastructure/builders/buildStreetAndTruck";

export function useHeroScene() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sunGlowRef = useRef<HTMLDivElement | null>(null);
  const cloudMistRef = useRef<HTMLDivElement | null>(null);
  const scrollPromptRef = useRef<HTMLDivElement | null>(null);
  const loadingScreenRef = useRef<HTMLDivElement | null>(null);
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Clean up any existing canvas in container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const canvas = document.createElement("canvas");
    canvas.id = "webgl-canvas";
    canvas.className = "webgl-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "1";
    canvas.style.display = "block";
    container.appendChild(canvas);

    // Acquire and guard WebGL context
    const gl =
      (canvas.getContext("webgl2", {
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
      }) as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl", {
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
      }) as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL is not supported in this browser environment.");
      return;
    }

    // Defensive guard against null return from getShaderPrecisionFormat
    if (gl.getShaderPrecisionFormat) {
      const origPrecisionFormat = gl.getShaderPrecisionFormat.bind(gl);
      gl.getShaderPrecisionFormat = (
        shaderType: number,
        precisionType: number
      ) => {
        try {
          const res = origPrecisionFormat(shaderType, precisionType);
          if (res) return res;
        } catch {
          // ignore
        }
        return { rangeMin: 1, rangeMax: 1, precision: 1 } as WebGLShaderPrecisionFormat;
      };
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ============================================================
       SECTION 1 — RENDERER, SCENE, CAMERA, LIGHTING
       ============================================================ */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ec5ea);
    scene.fog = new THREE.FogExp2(0x8ec5ea, 0.0001);

    const camera = new THREE.PerspectiveCamera(
      INITIAL_CAMERA.fov,
      window.innerWidth / window.innerHeight,
      INITIAL_CAMERA.near,
      INITIAL_CAMERA.far
    );

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
      });
    } catch {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        stencil: false,
      });
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const hemiLight = new THREE.HemisphereLight(0xf0f9ff, 0x1e3a5f, 0.92);
    hemiLight.position.set(0, 2000, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e0, 2.6);
    sunLight.position.copy(SUN_DIRECTION.clone().multiplyScalar(1800));
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 200;
    sunLight.shadow.camera.far = 3500;
    const shadowBox = 300;
    sunLight.shadow.camera.left = -shadowBox;
    sunLight.shadow.camera.right = shadowBox;
    sunLight.shadow.camera.top = shadowBox;
    sunLight.shadow.camera.bottom = -shadowBox;
    sunLight.shadow.bias = -0.00015;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.55);
    rimLight.position.set(-SUN_DIRECTION.x, 0.35, -SUN_DIRECTION.z);
    scene.add(rimLight);

    /* ============================================================
       SECTION 2 — SKY DOME
       ============================================================ */
    const skyGeo = new THREE.SphereGeometry(15000, 32, 20);
    const skyMat = createSkyMaterial();
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    /* ============================================================
       SECTION 3 — OCEAN (Optimized Gerstner Shader)
       ============================================================ */
    const oceanGeo = new THREE.PlaneGeometry(
      OCEAN_CONFIG.size,
      OCEAN_CONFIG.size,
      OCEAN_CONFIG.segments,
      OCEAN_CONFIG.segments
    );
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = createOceanMaterial();
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.receiveShadow = true;
    oceanMesh.frustumCulled = false;
    scene.add(oceanMesh);

    /* ============================================================
       SHARED PROCEDURAL TEXTURES
       ============================================================ */
    const sharedGlowTex = createGlowTexture();
    const corrugatedBump = createCorrugatedBumpTexture();
    const heroContainerTex = createHeroContainerTexture();
    const asphaltTex = createAsphaltTexture();
    const grilleMeshTex = createGrilleMeshTexture();

    /* ============================================================
       SECTION 4 — REALISTIC AIRPLANE
       ============================================================ */
    const {
      airplaneGroup,
      currentAirplaneMesh,
      engineFans,
      exhaustGlows,
    } = buildEnhancedAirplane(sharedGlowTex);
    scene.add(airplaneGroup);

    /* ============================================================
       SECTION 5 — CLOUDS
       ============================================================ */
    const cloudsContainer = buildClouds();
    scene.add(cloudsContainer);

    /* ============================================================
       SECTION 6 — REALISTIC CONTAINER SHIP
       ============================================================ */
    const shipGroup = buildContainerShip(corrugatedBump);
    scene.add(shipGroup);

    /* ============================================================
       SECTION 6.5 — COASTAL PORT BOULEVARD & TRUCK
       ============================================================ */
    const streetWorldGroup = buildStaticStreetAndRealisticTruck(
      corrugatedBump,
      heroContainerTex,
      grilleMeshTex,
      asphaltTex,
      sharedGlowTex
    );
    scene.add(streetWorldGroup);

    /* ============================================================
       SECTION 7 — SMOOTH CONTINUOUS CAMERA CHOREOGRAPHY
       ============================================================ */
    const camLookTarget = {
      x: INITIAL_CAMERA.lookTarget.x,
      y: INITIAL_CAMERA.lookTarget.y,
      z: INITIAL_CAMERA.lookTarget.z,
    };
    camera.position.set(
      INITIAL_CAMERA.position.x,
      INITIAL_CAMERA.position.y,
      INITIAL_CAMERA.position.z
    );
    camera.lookAt(camLookTarget.x, camLookTarget.y, camLookTarget.z);

    const sunGlowEl = sunGlowRef.current;
    const cloudMistEl = cloudMistRef.current;
    const scrollPromptEl = scrollPromptRef.current;
    const scrollWrapperEl = scrollWrapperRef.current;
    const tmpSunVec = new THREE.Vector3().copy(SUN_DIRECTION).multiplyScalar(12000);

    function updateSunGlow() {
      if (!sunGlowEl) return;
      const projected = tmpSunVec.clone().project(camera);
      const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
      sunGlowEl.style.left = x + "px";
      sunGlowEl.style.top = y + "px";
      sunGlowEl.style.opacity = projected.y > -1 ? "0.9" : "0";
    }

    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperEl || ".scroll-wrapper",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
          onUpdate: (self) => {
            if (scrollPromptEl) {
              gsap.set(scrollPromptEl, {
                opacity: self.progress > 0.04 ? 0 : 1,
              });
            }
          },
        },
      });

      // STAGE 1: Airplane bank & initial descent
      tl.to(
        airplaneGroup.position,
        { x: -52, y: 770, z: -155, ease: "power1.inOut", duration: 3.5 },
        0
      )
        .to(
          airplaneGroup.rotation,
          { x: -0.26, y: 0.45, z: 0.55, ease: "power1.inOut", duration: 3.5 },
          0
        )
        .to(
          camera.position,
          { x: -22, y: 810, z: -35, ease: "power1.inOut", duration: 3.5 },
          0
        )
        .to(
          camLookTarget,
          { x: -35, y: 670, z: -175, ease: "power1.inOut", duration: 3.5 },
          0
        )

        // STAGE 2: Diving through the cloud deck toward the ocean
        .to(
          airplaneGroup.position,
          { x: -230, y: 410, z: -500, ease: "none", duration: 3.3 },
          3.5
        )
        .to(
          airplaneGroup.rotation,
          { x: -0.04, y: 0.72, z: 0.14, ease: "power1.out", duration: 3.3 },
          3.5
        )
        .to(
          camera.position,
          { x: 62, y: 230, z: -12, ease: "none", duration: 3.3 },
          3.5
        )
        .to(
          camLookTarget,
          { x: 10, y: 42, z: -140, ease: "none", duration: 3.3 },
          3.5
        )
        .to(
          cloudMistEl || "#cloud-mist",
          { opacity: 0.85, duration: 1.1, ease: "power2.in" },
          3.8
        )
        .to(
          cloudMistEl || "#cloud-mist",
          { opacity: 0, duration: 1.4, ease: "power2.out" },
          4.9
        )

        // STAGE 3: Showcasing the Container Ship on the ocean
        .to(
          airplaneGroup.position,
          { x: -520, y: 330, z: -1050, ease: "none", duration: 3.2 },
          6.8
        )
        .to(
          camera.position,
          { x: 68, y: 25, z: -60, ease: "power2.out", duration: 3.2 },
          6.8
        )
        .to(
          camLookTarget,
          { x: 0, y: 16, z: -140, ease: "power2.out", duration: 3.2 },
          6.8
        )

        // STAGE 4: Smooth Drone Arc rising slightly over the channel from Ship toward the Port Pier & Truck
        .to(
          camera.position,
          { x: 122, y: 31, z: -105, ease: "sine.inOut", duration: 2.3 },
          10.0
        )
        .to(
          camLookTarget,
          { x: 162, y: 22.5, z: -162, ease: "sine.inOut", duration: 2.3 },
          10.0
        )

        // STAGE 5: Seamless Glide onto the Boulevard into a Low-Angle 3/4 Front Hero Shot
        .to(
          camera.position,
          { x: 155.2, y: 21.3, z: -144.8, ease: "power2.out", duration: 2.8 },
          12.3
        )
        .to(
          camLookTarget,
          { x: 168.4, y: 21.1, z: -165.5, ease: "power2.out", duration: 2.8 },
          12.3
        );
    });

    /* ============================================================
       SECTION 8 — LIGHTWEIGHT RENDER LOOP
       ============================================================ */
    const clock = new THREE.Clock();
    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      oceanMat.uniforms.uTime.value = elapsed * OCEAN_CONFIG.timeMultiplier;
      oceanMat.uniforms.uCameraPos.value.copy(camera.position);

      if (camera.position.y > 120) {
        engineFans.forEach((fan) => {
          fan.rotation.z += delta * 28;
        });
        exhaustGlows.forEach((g, i) => {
          const mat = g.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.55 + 0.25 * Math.sin(elapsed * 18 + i * 1.5);
        });
        currentAirplaneMesh.position.y = Math.sin(elapsed * 1.6) * 0.35;
        currentAirplaneMesh.rotation.z = Math.cos(elapsed * 1.1) * 0.012;
      }

      shipGroup.position.y = Math.sin(elapsed * 1.0) * 0.22 - 0.25;
      shipGroup.rotation.z = Math.sin(elapsed * 0.6) * 0.01;

      skyDome.position.copy(camera.position);
      updateSunGlow();

      camera.lookAt(camLookTarget.x, camLookTarget.y, camLookTarget.z);
      renderer.render(scene, camera);
    }
    animate();

    /* ============================================================
       SECTION 9 — RESIZE & BOOTSTRAP
       ============================================================ */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const loadingTimeout1 = setTimeout(() => {
      const ls = loadingScreenRef.current;
      if (ls) {
        ls.classList.add("hidden");
        const loadingTimeout2 = setTimeout(() => {
          if (ls) ls.style.display = "none";
        }, 700);
        return () => clearTimeout(loadingTimeout2);
      }
    }, 400);

    /* ============================================================
       CLEANUP
       ============================================================ */
    return () => {
      clearTimeout(loadingTimeout1);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      gsapCtx.revert();

      disposeObject3D(scene);
      sharedGlowTex.dispose();
      corrugatedBump.dispose();
      heroContainerTex.dispose();
      asphaltTex.dispose();
      grilleMeshTex.dispose();

      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return {
    canvasContainerRef,
    sunGlowRef,
    cloudMistRef,
    scrollPromptRef,
    loadingScreenRef,
    scrollWrapperRef,
  };
}
