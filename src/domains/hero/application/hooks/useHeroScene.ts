"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  graphiteVertexShader,
  graphiteFragmentShader,
} from "../../domain/shaders/graphiteShader";
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

export type PencilGrade = "HB" | "2B" | "6B";

export function useHeroScene() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const sunGlowRef = useRef<HTMLDivElement | null>(null);
  const cloudMistRef = useRef<HTMLDivElement | null>(null);
  const scrollPromptRef = useRef<HTMLDivElement | null>(null);
  const loadingScreenRef = useRef<HTMLDivElement | null>(null);
  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);

  const [pencilGrade, setPencilGradeState] = useState<PencilGrade>("2B");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // References to graphite shader material and auto-play state for animation callbacks
  const graphiteMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const autoPlayRef = useRef<boolean>(false);

  const setPencilGrade = useCallback((grade: PencilGrade) => {
    setPencilGradeState(grade);
    const mat = graphiteMatRef.current;
    if (!mat) return;
    if (grade === "HB") {
      mat.uniforms.uEdgeWeight.value = 0.75;
      mat.uniforms.uShadeDensity.value = 0.85;
    } else if (grade === "2B") {
      mat.uniforms.uEdgeWeight.value = 1.0;
      mat.uniforms.uShadeDensity.value = 1.0;
    } else if (grade === "6B") {
      mat.uniforms.uEdgeWeight.value = 1.38;
      mat.uniforms.uShadeDensity.value = 1.28;
    }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => {
      const next = !prev;
      autoPlayRef.current = next;
      return next;
    });
  }, []);

  const scrollToPhase = useCallback((phase: 1 | 2 | 3) => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const wrapperTop = rect.top + scrollTop;
    const scrollableDistance = wrapper.offsetHeight - window.innerHeight;

    let targetProgress = 0.05;
    if (phase === 2) targetProgress = 0.52;
    if (phase === 3) targetProgress = 0.88;

    const targetY = wrapperTop + targetProgress * scrollableDistance;
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Clean up any existing canvas in container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 500x500 box dimensions with responsive support
    const targetWidth = container.clientWidth || 500;
    const targetHeight = container.clientHeight || 500;

    const canvas = document.createElement("canvas");
    canvas.id = "webgl-canvas";
    canvas.className = "webgl-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
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
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbe3ec);
    scene.fog = new THREE.FogExp2(0xdbe3ec, 0.0001);

    // Camera calibrated for 1:1 500x500 square framing
    const camera = new THREE.PerspectiveCamera(
      46,
      targetWidth / targetHeight,
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
        alpha: false,
      });
    } catch {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        stencil: false,
      });
    }

    renderer.setSize(targetWidth, targetHeight);
    renderer.setPixelRatio(DPR);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* ============================================================
       SECTION 1.5 — GRAPHITE DRAWING POST-PROCESSING PIPELINE
       ============================================================ */
    let rtWidth = Math.floor(targetWidth * DPR);
    let rtHeight = Math.floor(targetHeight * DPR);

    const sceneRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const isDarkInit = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

    const graphiteShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: sceneRenderTarget.texture },
        uResolution: { value: new THREE.Vector2(rtWidth, rtHeight) },
        uTime: { value: 0.0 },
        uEdgeWeight: { value: 1.0 },
        uShadeDensity: { value: 1.0 },
        uDark: { value: isDarkInit ? 1.0 : 0.0 },
      },
      vertexShader: graphiteVertexShader,
      fragmentShader: graphiteFragmentShader,
      depthWrite: false,
      depthTest: false,
    });
    graphiteMatRef.current = graphiteShaderMat;

    const postQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      graphiteShaderMat
    );
    postScene.add(postQuad);

    /* ============================================================
       LIGHTING (Clean high-contrast lighting for crisp pencil strokes)
       ============================================================ */
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.95);
    hemiLight.position.set(0, 2000, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
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

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.65);
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
       SECTION 5 — ORGANIC GRAPHITE-SHADED CLOUDS
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
       SECTION 7 — SMOOTH CAMERA CHOREOGRAPHY VIA GSAP
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

    const cloudMistEl = cloudMistRef.current;
    const scrollPromptEl = scrollPromptRef.current;
    const scrollWrapperEl = scrollWrapperRef.current;

    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperEl || ".scroll-wrapper",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            if (p < 0.36) {
              setActivePhase(1);
            } else if (p < 0.68) {
              setActivePhase(2);
            } else {
              setActivePhase(3);
            }

            if (scrollPromptEl) {
              gsap.set(scrollPromptEl, {
                opacity: p > 0.05 ? 0 : 1,
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

        // STAGE 3: Showcasing the Container Ship on the ocean (Elevated 3/4 perspective revealing full container stacks, bays, and lashing)
        .to(
          airplaneGroup.position,
          { x: -520, y: 330, z: -1050, ease: "none", duration: 3.2 },
          6.8
        )
        .to(
          camera.position,
          { x: 78, y: 46, z: -52, ease: "power2.out", duration: 3.2 },
          6.8
        )
        .to(
          camLookTarget,
          { x: -4, y: 17, z: -136, ease: "power2.out", duration: 3.2 },
          6.8
        )

        // STAGE 4: Smooth Drone Arc rising slightly over the channel toward the Truck
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

        // STAGE 5: Seamless Glide onto the Boulevard into a Low-Angle Hero Shot (Showcasing Cab Face & Persian Container Branding)
        .to(
          camera.position,
          { x: 151.8, y: 21.9, z: -146.2, ease: "power2.out", duration: 2.8 },
          12.3
        )
        .to(
          camLookTarget,
          { x: 167.0, y: 21.5, z: -168.5, ease: "power2.out", duration: 2.8 },
          12.3
        );
    });

    ScrollTrigger.refresh();
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    /* ============================================================
       SECTION 8 — TWO-PASS RENDER LOOP (Scene -> RT -> Graphite)
       ============================================================ */
    const clock = new THREE.Clock();
    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Auto-play scroll progress when enabled (within the Hero section)
      if (autoPlayRef.current && scrollWrapperRef.current) {
        const wrapper = scrollWrapperRef.current;
        const rect = wrapper.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const wrapperTop = rect.top + scrollTop;
        const maxHeroScroll = wrapperTop + wrapper.offsetHeight - window.innerHeight;

        if (window.scrollY >= maxHeroScroll - 8) {
          window.scrollTo({ top: wrapperTop, behavior: "auto" });
        } else {
          window.scrollBy(0, 3.2);
        }
      }

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
      camera.lookAt(camLookTarget.x, camLookTarget.y, camLookTarget.z);

      // Pass 1: Render 3D Scene into off-screen high-res render target
      renderer.setRenderTarget(sceneRenderTarget);
      renderer.render(scene, camera);

      // Pass 2: Apply Graphite Post-Processing Shader Quad to screen
      graphiteShaderMat.uniforms.uTime.value = elapsed;
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    }
    animate();

    /* ============================================================
       SECTION 9 — RESIZE & BOOTSTRAP
       ============================================================ */
    const handleResize = () => {
      const curContainer = canvasContainerRef.current;
      const w = curContainer?.clientWidth || 500;
      const h = curContainer?.clientHeight || 500;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      rtWidth = Math.floor(w * dpr);
      rtHeight = Math.floor(h * dpr);
      sceneRenderTarget.setSize(rtWidth, rtHeight);
      graphiteShaderMat.uniforms.uResolution.value.set(rtWidth, rtHeight);

      ScrollTrigger.refresh();
    };

    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      graphiteShaderMat.uniforms.uDark.value = isDark ? 1.0 : 0.0;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("themechange", handleThemeChange);
    handleResize();

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
      clearTimeout(refreshTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("themechange", handleThemeChange);
      cancelAnimationFrame(animationFrameId);
      gsapCtx.revert();

      disposeObject3D(scene);
      disposeObject3D(postScene);
      sceneRenderTarget.dispose();
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
    heroStageRef,
    sunGlowRef,
    cloudMistRef,
    scrollPromptRef,
    loadingScreenRef,
    scrollWrapperRef,
    pencilGrade,
    setPencilGrade,
    isAutoPlaying,
    toggleAutoPlay,
    activePhase,
    scrollProgress,
    scrollToPhase,
  };
}
