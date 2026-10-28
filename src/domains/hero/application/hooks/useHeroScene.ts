"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SUN_DIRECTION,
  INITIAL_CAMERA,
  OCEAN_CONFIG,
  GLOBE_CAMERA,
  GLOBE_RADIUS,
  GLOBE_DIVE,
  EARTH_LOOK,
  ACT_HANDOFF,
  GLOBE_TO_AIR_HANDOFF,
  DELIVERY_SCENE,
  LOGISTICS_ACT_START,
  LOGISTICS_TIME_SCALE,
  logisticsAt,
  HANDOVER_ACT_START,
  HERO_TIMELINE_DURATION,
  HERO_PHASE_FOCUS_TIMES,
  getHeroPhase,
  type HeroPhase,
} from "../../domain/constants";
import { createSkyMaterial } from "../../domain/shaders/skyShader";
import { createOceanMaterial } from "../../domain/shaders/oceanShader";
import {
  graphiteVertexShader,
  graphiteFragmentShader,
} from "../../domain/shaders/graphiteShader";
import {
  globeGraphiteVertexShader,
  globeGraphiteFragmentShader,
} from "../../domain/shaders/globeGraphiteShader";
import {
  earthCompositeVertexShader,
  earthCompositeFragmentShader,
} from "../../domain/shaders/earthShaders";
import {
  loadEarthUsdzMaps,
  disposeEarthMaps,
} from "../../infrastructure/textures/earthUsdzTextures";
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
import { buildGlobe } from "../../infrastructure/builders/buildGlobe";
import { buildDeliveryHandover } from "../../infrastructure/builders/buildDeliveryHandover";

export type PencilGrade = "HB" | "2B" | "6B";
export type { HeroPhase };

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
  const [activePhase, setActivePhase] = useState<HeroPhase>(1);
  // Read on demand instead of held in state so scrubbing never re-renders the Hero tree
  const scrollProgressRef = useRef<number>(0);

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

  const scrollToPhase = useCallback((phase: HeroPhase) => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const wrapperTop = rect.top + scrollTop;
    const scrollableDistance = wrapper.offsetHeight - window.innerHeight;

    const targetProgress =
      HERO_PHASE_FOCUS_TIMES[phase] / HERO_TIMELINE_DURATION;

    const targetY = wrapperTop + targetProgress * scrollableDistance;
    if (typeof window !== "undefined" && (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: Record<string, unknown>) => void } }).__lenis) {
      (window as unknown as { __lenis: { scrollTo: (y: number, opts?: Record<string, unknown>) => void } }).__lenis.scrollTo(targetY, { duration: 1.3 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
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

    // Acquire and guard WebGL context. The canvas only ever receives a fullscreen post quad,
    // so it skips MSAA; scene antialiasing comes from the multisampled render target.
    const gl =
      (canvas.getContext("webgl2", {
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
      }) as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl", {
        antialias: false,
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
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ============================================================
       SECTION 1 — RENDERER, SCENE, CAMERA, LIGHTING
       ============================================================ */
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbe3ec);
    scene.fog = new THREE.FogExp2(0xdbe3ec, 0.0001);

    // Responsive camera framing: adapts FOV on portrait screens so models don't get clipped
    const initialAspect = targetWidth / targetHeight;
    const initialFov =
      initialAspect < 1.0
        ? Math.min(62, 46 / Math.pow(initialAspect, 0.55))
        : 46;
    const camera = new THREE.PerspectiveCamera(
      initialFov,
      initialAspect,
      INITIAL_CAMERA.near,
      INITIAL_CAMERA.far
    );

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
        alpha: false,
      });
    } catch {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
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
    // Transparent clear lets the Earth pass composite its halo and clouds over the paper
    renderer.setClearColor(0x000000, 0);

    // Soft studio reflections so metallic parts (chrome, aluminium, steel) don't render black
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();
    scene.environment = envTexture;
    scene.environmentIntensity = 0.55;

    /* ============================================================
       SECTION 1.5 — GRAPHITE DRAWING POST-PROCESSING PIPELINE
       ============================================================ */
    let rtWidth = Math.floor(targetWidth * DPR);
    let rtHeight = Math.floor(targetHeight * DPR);

    const sceneRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      samples: 4,
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
        uPaperFade: { value: 0.0 },
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

    // Second graphite variant for the globe / handover act (ocean-aware, clean white paper).
    // Both post materials read the same render target; the active act swaps the quad's material.
    const globeGraphiteMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: sceneRenderTarget.texture },
        uResolution: { value: new THREE.Vector2(rtWidth, rtHeight) },
        uTime: { value: 0.0 },
        uDpr: { value: DPR },
        uDark: { value: isDarkInit ? 1.0 : 0.0 },
        uPaperFade: { value: 0.0 },
      },
      vertexShader: globeGraphiteVertexShader,
      fragmentShader: globeGraphiteFragmentShader,
      depthWrite: false,
      depthTest: false,
    });

    // Act I keeps the photoreal Earth out of the pencil pass and lays it straight onto the paper
    const earthCompositeMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: sceneRenderTarget.texture },
        uTime: { value: 0.0 },
        uDpr: { value: DPR },
        uDark: { value: isDarkInit ? 1.0 : 0.0 },
        uReady: { value: 0.0 },
        uPaperFade: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(rtWidth, rtHeight) },
        uGlobeCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uGlobeRadius: { value: 0.3 },
        uStarDrift: { value: new THREE.Vector2() },
      },
      vertexShader: earthCompositeVertexShader,
      fragmentShader: earthCompositeFragmentShader,
      depthWrite: false,
      depthTest: false,
    });

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
    const cloudSprites: Array<{ mat: THREE.SpriteMaterial; base: number }> = [];
    cloudsContainer.traverse((obj) => {
      if ((obj as THREE.Sprite).isSprite) {
        const mat = (obj as THREE.Sprite).material as THREE.SpriteMaterial;
        cloudSprites.push({ mat, base: mat.opacity });
      }
    });
    const cloudFade = { t: 1 };
    const applyCloudFade = () => {
      const v = cloudFade.t;
      for (const c of cloudSprites) c.mat.opacity = c.base * v;
      cloudsContainer.visible = v > 0.02;
    };

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
       SECTION 6.8 — GLOBE & PARCEL-HANDOVER ACT (separate small-scale scene)
       ============================================================ */
    const globeScene = new THREE.Scene();
    globeScene.background = new THREE.Color(0xffffff);

    globeScene.add(new THREE.HemisphereLight(0xffffff, 0x3f3f46, 0.92));
    const globeKeyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    globeKeyLight.position.set(26, 38, 34);
    globeScene.add(globeKeyLight);
    const globeRimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    globeRimLight.position.set(-22, 18, -16);
    globeScene.add(globeRimLight);

    const isPortraitCanvas = () => {
      const curContainer = canvasContainerRef.current;
      const w = curContainer?.clientWidth || targetWidth;
      const h = curContainer?.clientHeight || targetHeight;
      return w / h < 1.0;
    };
    const globeLookX = isPortraitCanvas() ? 0 : GLOBE_CAMERA.lookOffsetX;

    const globeCamera = new THREE.PerspectiveCamera(
      GLOBE_CAMERA.fov,
      initialAspect,
      GLOBE_CAMERA.near,
      GLOBE_CAMERA.far
    );
    const positionGlobeCamera = () => {
      globeCamera.position.set(
        globeLookX,
        GLOBE_CAMERA.y,
        isPortraitCanvas() ? GLOBE_CAMERA.zPortrait : GLOBE_CAMERA.zLandscape
      );
    };
    positionGlobeCamera();
    const globeLookTarget = new THREE.Vector3(globeLookX, 0, 0);

    const globe = buildGlobe();
    globeScene.add(globe.globeGroup);
    const globePaper = globeScene.background;
    const earthScreenPos = new THREE.Vector3();

    // The Earth fades in once its USDZ maps are decoded (or as a plain ocean world if they fail)
    let earthReady = false;
    const earthMapsAbort = new AbortController();
    loadEarthUsdzMaps(EARTH_LOOK.usdzUrl, {
      maxWidth: Math.min(
        renderer.capabilities.maxTextureSize,
        Math.min(window.innerWidth, window.innerHeight) < 700 ? 2048 : 4096
      ),
      anisotropy: Math.min(renderer.capabilities.getMaxAnisotropy(), 8),
      signal: earthMapsAbort.signal,
    })
      .then((maps) => {
        disposeEarthMaps(globe.setMaps(maps));
        renderer.initTexture(maps.albedo);
        renderer.initTexture(maps.mask);
        renderer.initTexture(maps.lights);
      })
      .catch((err: unknown) => {
        if (earthMapsAbort.signal.aborted) return;
        console.warn("Earth maps could not be loaded from the USDZ.", err);
      })
      .finally(() => {
        if (earthMapsAbort.signal.aborted) return;
        earthReady = true;
        hideLoadingScreen();
      });

    const handover = buildDeliveryHandover();
    globeScene.add(handover.deliverySceneGroup);

    // 1 → globe world (globe & handover scene), 0 → logistics world (airplane/ship/truck).
    // The story opens on the globe; the timeline flips this at each act handoff so it scrubs both ways.
    // `globeVisible` drops to 0 once the dive is over so the sphere can't occlude the handover act.
    const actState = { globe: 1, globeVisible: 1 };
    // Paper dissolve (0 → sketch, 1 → blank paper) applied inside both graphite passes, so the
    // swap always lands on a frame of pure paper regardless of DOM/WebGL update ordering.
    const handoffState = { paper: 0 };
    // FOV multiplier for the logistics camera; lets the airplane shot "settle" out of the dive
    // without fighting the responsive base FOV set in handleResize.
    const camFovState = { mult: 1 };
    let baseFov = initialFov;

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

    let lastPhase: HeroPhase | null = null;
    let promptHidden: boolean | null = null;

    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperEl || ".scroll-wrapper",
          start: "top top",
          end: "bottom bottom",
          // Higher smoothing absorbs touchpad momentum bursts so motion eases instead of jumping
          scrub: 1.8,
          onUpdate: (self) => {
            const p = self.progress;
            scrollProgressRef.current = p;

            // Fires every scrub tick: only touch React / the DOM when something actually changes
            const phase = getHeroPhase(p * HERO_TIMELINE_DURATION);
            if (phase !== lastPhase) {
              lastPhase = phase;
              setActivePhase(phase);
            }

            const hidePrompt = p > 0.05;
            if (scrollPromptEl && hidePrompt !== promptHidden) {
              promptHidden = hidePrompt;
              scrollPromptEl.style.opacity = hidePrompt ? "0" : "1";
            }
          },
        },
      });

      const globeGroup = globe.globeGroup;
      const deliveryGroup = handover.deliverySceneGroup;
      const { courier, client, parcelGroup } = handover;
      const mist = cloudMistEl || "#cloud-mist";
      const L = LOGISTICS_ACT_START; // ground dive dissolves; airplane act begins
      const H = HANDOVER_ACT_START; // handover act begins, 1s after the truck shot settles

      /** Paper dissolve between acts: sketch lifts to blank paper, render path swaps, next sketch draws in. */
      const addActHandoff = (
        swapAt: number,
        toGlobe: boolean,
        timing: { outLead: number; outDuration: number; inDuration: number } = ACT_HANDOFF
      ) => {
        tl.to(
          handoffState,
          { paper: 1, duration: timing.outDuration, ease: "power2.in" },
          swapAt - timing.outLead
        )
          .set(actState, { globe: toGlobe ? 1 : 0 }, swapAt)
          .to(
            handoffState,
            { paper: 0, duration: timing.inDuration, ease: "power2.out" },
            swapAt
          );
      };

      /* ============================================================
         ACT I — GLOBE (0 → 8.0)
         ============================================================ */
      // STAGE 1: Globe reveal — slow rotation, supply corridors converging on Iran
      tl.to(
        globeGroup.rotation,
        { x: 0.52, y: -2.42, z: 0.0, ease: "power1.inOut", duration: GLOBE_DIVE.start },
        0
      ).to(
        globeGroup.scale,
        {
          x: GLOBE_DIVE.scaleFrom,
          y: GLOBE_DIVE.scaleFrom,
          z: GLOBE_DIVE.scaleFrom,
          ease: "power1.inOut",
          duration: GLOBE_DIVE.start,
        },
        0
      );

      // STAGE 2: Locked-on ground dive — one continuous move from the reveal straight into the
      // paper dissolve. Tehran is held on the camera axis while magnification grows exponentially
      // (constant perceived zoom rate), and the surface always stays in front of the near plane,
      // so there is no clipping, no stop-start between stages and no dead frames before the swap.
      const diveState = { t: 0 };
      const hubLocal = globe.hubDirection;
      const camForward = new THREE.Vector3();
      const hubWorldDir = new THREE.Vector3();
      const hubTarget = new THREE.Vector3();
      const reveal = new THREE.Vector3();
      const lockOffset = new THREE.Vector3();
      const scratch = new THREE.Vector3();
      const scaleRatio = GLOBE_DIVE.scaleTo / GLOBE_DIVE.scaleFrom;

      const applyDive = () => {
        const t = diveState.t;
        camForward.subVectors(globeLookTarget, globeCamera.position).normalize();
        hubWorldDir.copy(hubLocal).applyEuler(globeGroup.rotation);

        // Where the hub sits at the end of the reveal (globe centred at the origin)
        reveal.copy(hubWorldDir).multiplyScalar(GLOBE_RADIUS * GLOBE_DIVE.scaleFrom);
        const d0 = scratch.subVectors(reveal, globeCamera.position).dot(camForward);
        // Lateral offset of the hub from the view axis at the start; eased out so the lock-on glides in
        hubTarget.copy(globeCamera.position).addScaledVector(camForward, d0);
        lockOffset.subVectors(reveal, hubTarget);
        const lockBlend = THREE.MathUtils.smoothstep(t, 0, GLOBE_DIVE.lockOnBlend);

        const scale = GLOBE_DIVE.scaleFrom * Math.pow(scaleRatio, t);
        const dist = d0 * Math.pow(GLOBE_DIVE.groundDistanceTo / d0, t);

        hubTarget
          .copy(globeCamera.position)
          .addScaledVector(camForward, dist)
          .addScaledVector(lockOffset, 1 - lockBlend);

        globeGroup.scale.setScalar(scale);
        globeGroup.position.copy(hubTarget).addScaledVector(hubWorldDir, -GLOBE_RADIUS * scale);
        globe.setDive(t);
      };

      tl.to(
        globeGroup.rotation,
        { x: 0.6, y: -2.52, ease: "power1.inOut", duration: 3.0 },
        GLOBE_DIVE.start
      ).to(
        diveState,
        // Ease in so most of the dive is a clear approach; the cloud punch is only a brief rush at the end
        { t: 1, ease: "power3.in", duration: L - GLOBE_DIVE.start, onUpdate: applyDive },
        GLOBE_DIVE.start
      );

      // HANDOFF: cloud bank dissolves to paper → airplane draws in quickly.
      // Starts while still inside the clouds so land never fills the frame as a brown plate.
      addActHandoff(L, false, GLOBE_TO_AIR_HANDOFF);
      tl.set(actState, { globeVisible: 0 }, L);

      // Airplane emerges with a gentle settle from a wider view, carrying the dive's momentum
      tl.fromTo(
        camFovState,
        { mult: 1.16 },
        { mult: 1, ease: "power3.out", duration: 1.8 },
        L
      );

      /* ============================================================
         ACT II — AIR → SEA → LAND (times authored at base pace, stretched by LOGISTICS_TIME_SCALE)
         ============================================================ */
      const at = logisticsAt;
      const dur = (seconds: number) => seconds * LOGISTICS_TIME_SCALE;

      // STAGE 4: Airplane bank above the deck (clear air — no lingering in clouds)
      tl.to(
        airplaneGroup.position,
        { x: -52, y: 770, z: -155, ease: "power1.inOut", duration: dur(2.6) },
        at(0)
      )
        .to(
          airplaneGroup.rotation,
          { x: -0.26, y: 0.45, z: 0.55, ease: "power1.inOut", duration: dur(2.6) },
          at(0)
        )
        .to(
          camera.position,
          { x: -22, y: 810, z: -35, ease: "power1.inOut", duration: dur(2.6) },
          at(0)
        )
        .to(
          camLookTarget,
          { x: -35, y: 670, z: -175, ease: "power1.inOut", duration: dur(2.6) },
          at(0)
        )

        // STAGE 5: Brief punch through the cloud deck — then clear ocean, no idle in the mist
        .to(
          airplaneGroup.position,
          { x: -230, y: 280, z: -500, ease: "power2.in", duration: dur(1.25) },
          at(2.6)
        )
        .to(
          airplaneGroup.rotation,
          { x: -0.04, y: 0.72, z: 0.14, ease: "power1.out", duration: dur(1.25) },
          at(2.6)
        )
        .to(
          camera.position,
          { x: 68, y: 88, z: -24, ease: "power2.in", duration: dur(1.25) },
          at(2.6)
        )
        .to(
          camLookTarget,
          { x: 6, y: 28, z: -136, ease: "power2.in", duration: dur(1.25) },
          at(2.6)
        )
        .to(mist, { opacity: 0.7, duration: dur(0.35), ease: "power2.in" }, at(2.7))
        .to(mist, { opacity: 0, duration: dur(0.7), ease: "power2.out" }, at(3.05))
        .to(
          cloudFade,
          {
            t: 0,
            duration: dur(1.1),
            ease: "power2.in",
            onUpdate: applyCloudFade,
          },
          at(2.65)
        )

        // STAGE 6: Clear ship showcase (clouds already gone)
        .to(
          airplaneGroup.position,
          { x: -520, y: 330, z: -1050, ease: "none", duration: dur(3.4) },
          at(3.85)
        )
        .to(
          camera.position,
          { x: 78, y: 46, z: -52, ease: "power2.out", duration: dur(3.4) },
          at(3.85)
        )
        .to(
          camLookTarget,
          { x: -4, y: 17, z: -136, ease: "power2.out", duration: dur(3.4) },
          at(3.85)
        )

        // STAGE 7: Smooth Drone Arc toward the Truck
        .to(
          camera.position,
          { x: 122, y: 31, z: -105, ease: "sine.inOut", duration: dur(1.5) },
          at(7.25)
        )
        .to(
          camLookTarget,
          { x: 162, y: 22.5, z: -162, ease: "sine.inOut", duration: dur(1.5) },
          at(7.25)
        )

        // STAGE 8: Boulevard hero shot (cab + Persian container branding)
        .to(
          camera.position,
          { x: 151.8, y: 21.9, z: -146.2, ease: "power2.out", duration: dur(2.4) },
          at(8.75)
        )
        .to(
          camLookTarget,
          { x: 167.0, y: 21.5, z: -168.5, ease: "power2.out", duration: dur(2.4) },
          at(8.75)
        );

      // HANDOFF: truck hero shot → paper → the client's door
      addActHandoff(H, true);

      /* ============================================================
         ACT III — PARCEL HANDOVER (24.1 → 29.3)
         ============================================================ */
      // STAGE 9: Handover scene emerges with articulated characters
      tl.to(
          deliveryGroup.scale,
          {
            x: DELIVERY_SCENE.revealScale,
            y: DELIVERY_SCENE.revealScale,
            z: DELIVERY_SCENE.revealScale,
            ease: "power2.out",
            duration: 2.8,
          },
          H
        )
        .fromTo(
          deliveryGroup.rotation,
          { y: -0.35 },
          { y: 0.14, ease: "power1.out", duration: 3.2 },
          H
        )

        // Both characters step toward the handover point
        .fromTo(
          courier.root.position,
          { x: -1.48 },
          { x: -1.04, ease: "power2.out", duration: 2.8 },
          H + 0.1
        )
        .fromTo(
          client.root.position,
          { x: 1.48 },
          { x: 1.04, ease: "power2.out", duration: 2.8 },
          H + 0.1
        )

        // Courier leans forward to present the parcel, then eases back upright
        .fromTo(
          courier.upperBody.rotation,
          { z: -0.02 },
          { z: -0.11, ease: "power1.inOut", duration: 1.5 },
          H + 0.1
        )
        .to(
          courier.upperBody.rotation,
          { z: -0.05, ease: "power1.out", duration: 1.5 },
          H + 1.6
        )

        // Client bows slightly to receive, then settles with the parcel's weight
        .fromTo(
          client.upperBody.rotation,
          { z: 0.02 },
          { z: 0.1, ease: "power1.inOut", duration: 1.5 },
          H + 0.1
        )
        .to(
          client.upperBody.rotation,
          { z: 0.04, ease: "power1.out", duration: 1.5 },
          H + 1.6
        )

        // Courier extends arms and forearms toward the client
        .fromTo(
          [courier.armL.rotation, courier.armR.rotation],
          { z: 0.36 },
          { z: 0.62, ease: "power2.inOut", duration: 2.6 },
          H + 0.2
        )
        .fromTo(
          [courier.foreArmL.rotation, courier.foreArmR.rotation],
          { z: 0.18 },
          { z: -0.08, ease: "power2.inOut", duration: 2.6 },
          H + 0.2
        )

        // Client raises arms to cradle the parcel from beneath
        .fromTo(
          [client.armL.rotation, client.armR.rotation],
          { z: -0.22 },
          { z: -0.58, ease: "power2.out", duration: 2.4 },
          H + 0.2
        )
        .fromTo(
          [client.foreArmL.rotation, client.foreArmR.rotation],
          { z: 0.35 },
          { z: 0.05, ease: "power2.out", duration: 2.4 },
          H + 0.2
        )

        // Parcel glides from courier to client along a soft arc
        .fromTo(
          parcelGroup.position,
          { x: -0.36, y: 2.1 },
          { x: 0.08, y: 2.18, ease: "power2.inOut", duration: 2.8 },
          H + 0.3
        )
        .fromTo(
          parcelGroup.rotation,
          { z: -0.06, y: -0.08 },
          { z: 0.03, y: 0.05, ease: "power1.inOut", duration: 2.8 },
          H + 0.3
        )

        // Mutual head nod at the moment of handover
        .fromTo(
          courier.headGroup.rotation,
          { z: 0.0 },
          { z: -0.1, ease: "power1.inOut", duration: 1.4, yoyo: true, repeat: 1 },
          H + 0.8
        )
        .fromTo(
          client.headGroup.rotation,
          { z: 0.0 },
          { z: 0.12, ease: "power1.inOut", duration: 1.4 },
          H + 0.9
        )

        // Rest beat at the end so the final frame holds before the page continues
        .to({}, { duration: 2.0 }, H + 3.2);
    });

    ScrollTrigger.refresh();
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    /* ============================================================
       SECTION 8 — TWO-PASS RENDER LOOP (Scene -> RT -> Graphite)
       ============================================================ */
    const clock = new THREE.Clock();
    let animationFrameId = 0;
    let inView = true;

    function animate() {
      if (!inView) {
        animationFrameId = 0;
        return;
      }
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

      // ── Globe / handover act: photoreal Earth composited onto paper; the handover goes through graphite ──
      if (actState.globe >= 0.5) {
        const showEarth = actState.globeVisible >= 0.5;
        globe.globeGroup.visible = showEarth;
        globeScene.background = showEarth ? null : globePaper;
        if (showEarth) globe.update(elapsed);
        globeCamera.lookAt(globeLookTarget);

        renderer.setRenderTarget(sceneRenderTarget);
        renderer.render(globeScene, globeCamera);

        const postMat = showEarth ? earthCompositeMat : globeGraphiteMat;
        if (showEarth) {
          const u = earthCompositeMat.uniforms;
          if (earthReady) u.uReady.value = Math.min(1, u.uReady.value + delta * 1.6);

          const group = globe.globeGroup;
          earthScreenPos.copy(group.position).project(globeCamera);
          u.uGlobeCenter.value.set(earthScreenPos.x * 0.5 + 0.5, earthScreenPos.y * 0.5 + 0.5);
          const camDist = globeCamera.position.distanceTo(group.position);
          const angular = Math.asin(Math.min((GLOBE_RADIUS * group.scale.x) / camDist, 0.999));
          u.uGlobeRadius.value =
            (0.5 * Math.tan(angular)) / Math.tan(THREE.MathUtils.degToRad(globeCamera.fov / 2));
          u.uStarDrift.value.set(group.rotation.y * 90, group.rotation.x * -60);
        }
        postMat.uniforms.uTime.value = elapsed;
        postMat.uniforms.uPaperFade.value = handoffState.paper;
        postQuad.material = postMat;
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
        return;
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

      const targetFov = baseFov * camFovState.mult;
      if (Math.abs(camera.fov - targetFov) > 1e-3) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      // Pass 1: Render 3D Scene into off-screen high-res render target
      renderer.setRenderTarget(sceneRenderTarget);
      renderer.render(scene, camera);

      // Pass 2: Apply Graphite Post-Processing Shader Quad to screen
      graphiteShaderMat.uniforms.uTime.value = elapsed;
      graphiteShaderMat.uniforms.uPaperFade.value = handoffState.paper;
      postQuad.material = graphiteShaderMat;
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    }
    animate();

    const visibilityTarget = scrollWrapperEl ?? canvasContainerRef.current;
    const visibilityObserver = visibilityTarget
      ? new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            if (inView && !animationFrameId) animate();
          },
          { rootMargin: "200px 0px" }
        )
      : null;
    if (visibilityTarget) visibilityObserver?.observe(visibilityTarget);

    /* ============================================================
       SECTION 9 — RESIZE & BOOTSTRAP
       ============================================================ */
    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 500;
    const handleResize = () => {
      const curContainer = canvasContainerRef.current;
      const w = curContainer?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 500);
      const h = curContainer?.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 500);

      const aspect = w / h;
      camera.aspect = aspect;

      // Adapt FOV on mobile/portrait screens so models (airplane, ship, truck) are fully framed without clipping
      baseFov = aspect < 1.0 ? Math.min(62, 46 / Math.pow(aspect, 0.55)) : 46;
      camera.fov = baseFov * camFovState.mult;
      camera.updateProjectionMatrix();

      globeCamera.aspect = aspect;
      positionGlobeCamera();
      globeCamera.updateProjectionMatrix();

      renderer.setSize(w, h);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      rtWidth = Math.floor(w * dpr);
      rtHeight = Math.floor(h * dpr);
      sceneRenderTarget.setSize(rtWidth, rtHeight);
      graphiteShaderMat.uniforms.uResolution.value.set(rtWidth, rtHeight);
      globeGraphiteMat.uniforms.uResolution.value.set(rtWidth, rtHeight);
      globeGraphiteMat.uniforms.uDpr.value = dpr;
      earthCompositeMat.uniforms.uDpr.value = dpr;
      earthCompositeMat.uniforms.uResolution.value.set(rtWidth, rtHeight);

      // Only refresh ScrollTrigger when width changes (rotation/resize), avoiding mobile URL bar jitter
      const curW = typeof window !== "undefined" ? window.innerWidth : w;
      if (Math.abs(curW - lastWidth) > 10) {
        lastWidth = curW;
        ScrollTrigger.refresh();
      }
    };

    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      graphiteShaderMat.uniforms.uDark.value = isDark ? 1.0 : 0.0;
      globeGraphiteMat.uniforms.uDark.value = isDark ? 1.0 : 0.0;
      earthCompositeMat.uniforms.uDark.value = isDark ? 1.0 : 0.0;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("themechange", handleThemeChange);
    handleResize();

    // Hidden once the Earth maps are ready; the fallback keeps a slow network from blocking the page
    let loadingHidden = false;
    let loadingRemoveTimer: ReturnType<typeof setTimeout> | undefined;
    function hideLoadingScreen() {
      if (loadingHidden) return;
      loadingHidden = true;
      const ls = loadingScreenRef.current;
      if (!ls) return;
      ls.classList.add("opacity-0", "invisible", "pointer-events-none");
      loadingRemoveTimer = setTimeout(() => {
        ls.style.display = "none";
      }, 700);
    }
    const loadingFallbackTimer = setTimeout(hideLoadingScreen, 6000);

    /* ============================================================
       CLEANUP
       ============================================================ */
    return () => {
      clearTimeout(loadingFallbackTimer);
      clearTimeout(loadingRemoveTimer);
      earthMapsAbort.abort();
      clearTimeout(refreshTimer);
      visibilityObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("themechange", handleThemeChange);
      cancelAnimationFrame(animationFrameId);
      gsapCtx.revert();

      disposeObject3D(scene);
      disposeObject3D(globeScene);
      disposeObject3D(postScene);
      globeGraphiteMat.dispose();
      earthCompositeMat.dispose();
      globe.dispose();
      handover.boxTexture.dispose();
      sceneRenderTarget.dispose();
      envTexture.dispose();
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
    scrollProgressRef,
    scrollToPhase,
  };
}
