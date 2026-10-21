"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpLeft, Globe2, ShieldCheck, PackageCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function GlobalDeliverySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    /* ============================================================
       SECTION 1 — RENDERER, CAMERA & GRAPHITE SHADER (#FFFFFF)
       ============================================================ */
    const isDarkInit = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const isMobile = () => window.innerWidth < 900;
    const getStageOffsetX = () => (isMobile() ? 0 : 10.5);

    const initW = section.clientWidth || window.innerWidth;
    const initH = section.clientHeight || (window.innerWidth < 900 ? 640 : 750);

    const camera = new THREE.PerspectiveCamera(
      42,
      initW / initH,
      0.1,
      2000
    );
    camera.position.set(getStageOffsetX(), 1.2, isMobile() ? 48 : 42);
    const camLookTarget = { x: getStageOffsetX(), y: 0.0, z: 0 };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(initW, initH);
    renderer.setPixelRatio(DPR);

    let renderTarget = new THREE.WebGLRenderTarget(
      initW * DPR,
      initH * DPR,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const graphiteMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uResolution: {
          value: new THREE.Vector2(
            initW * DPR,
            initH * DPR
          ),
        },
        uTime: { value: 0.0 },
        uDpr: { value: DPR },
        uDark: { value: isDarkInit ? 1.0 : 0.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform vec2  uResolution;
        uniform float uTime;
        uniform float uDpr;
        uniform float uDark;
        varying vec2  vUv;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float getLuma(vec2 uv) {
            vec3 col = texture2D(tDiffuse, clamp(uv, 0.001, 0.999)).rgb;
            return dot(col, vec3(0.299, 0.587, 0.114));
        }

        void main() {
            vec2 texel = 1.0 / uResolution;

            float sketchFrame = floor(uTime * 10.0);
            vec2 handBoil = vec2(
                noise(vUv * 30.0 + sketchFrame * 1.7) - 0.5,
                noise(vUv * 30.0 - sketchFrame * 2.3) - 0.5
            ) * texel * 0.85;

            vec2 uv = vUv + handBoil;

            float tl = getLuma(uv + texel * vec2(-1.0,  1.0));
            float tm = getLuma(uv + texel * vec2( 0.0,  1.0));
            float tr = getLuma(uv + texel * vec2( 1.0,  1.0));
            float ml = getLuma(uv + texel * vec2(-1.0,  0.0));
            float mc = getLuma(uv);
            float mr = getLuma(uv + texel * vec2( 1.0,  0.0));
            float bl = getLuma(uv + texel * vec2(-1.0, -1.0));
            float bm = getLuma(uv + texel * vec2( 0.0, -1.0));
            float br = getLuma(uv + texel * vec2( 1.0, -1.0));

            float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
            float gy = -tl - 2.0 * tm - tr + bl + 2.0 * bm + br;
            float edgeGrad = sqrt(gx * gx + gy * gy);

            if (mc > 0.990 && edgeGrad < 0.015) {
                vec3 bgPure = mix(vec3(1.0, 1.0, 1.0), vec3(0.035, 0.035, 0.045), uDark);
                gl_FragColor = vec4(bgPure, 1.0);
                return;
            }

            float leadGrain = noise(vUv * uResolution * 0.5);
            float pencilOutline = smoothstep(0.04, 0.28, edgeGrad * 1.25 * (0.82 + 0.38 * leadGrain));

            float luma = clamp(mc, 0.0, 1.0);
            vec2 p = vUv * uResolution / max(uDpr, 1.0);
            float strokeWobble = noise(p * 0.08 + sketchFrame * 0.2) * 2.1;

            float hatch1 = 0.0;
            if (luma < 0.88) {
                float i1 = smoothstep(0.88, 0.38, luma);
                float pat1 = sin((p.x + p.y) * 1.2 + strokeWobble);
                hatch1 = smoothstep(0.38, 0.86, pat1) * i1 * 0.42;
            }

            float hatch2 = 0.0;
            if (luma < 0.58) {
                float i2 = smoothstep(0.58, 0.18, luma);
                float pat2 = sin((p.x - p.y) * 1.3 - strokeWobble);
                hatch2 = smoothstep(0.34, 0.85, pat2) * i2 * 0.48;
            }

            float hatch3 = 0.0;
            if (luma < 0.32) {
                float i3 = smoothstep(0.32, 0.0, luma);
                float pat3 = sin(p.y * 1.6 + strokeWobble);
                hatch3 = smoothstep(0.24, 0.80, pat3) * i3 * 0.52;
            }

            float smudge = (1.0 - luma) * (0.24 + 0.22 * leadGrain);

            // Light Mode: Authentic graphite sketchbook on pure white
            float totalLightGraphite = clamp(smudge + hatch1 + hatch2 + hatch3 + pencilOutline * 0.96, 0.0, 0.96);
            vec3 lightResult = mix(vec3(1.0, 1.0, 1.0), vec3(0.10, 0.10, 0.11), totalLightGraphite);

            // Dark Mode: Technical blueprint on obsidian with titanium shading and platinum lines
            vec3 darkPaper  = vec3(0.035, 0.035, 0.045);
            vec3 shadeChalk = vec3(0.24, 0.27, 0.33);
            vec3 lineChalk  = vec3(0.90, 0.92, 0.96);

            float shadeFactor = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.85);

            vec3 darkResult = mix(darkPaper, shadeChalk, shadeFactor);
            darkResult = mix(darkResult, lineChalk, pencilOutline);

            vec3 finalColor = mix(lightResult, darkResult, uDark);
            gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), graphiteMat);
    postScene.add(postQuad);

    /* ============================================================
       LIGHTING
       ============================================================ */
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3f3f46, 0.92));

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(26, 38, 34);
    scene.add(dirLight);

    /* ============================================================
       SECTION 2 — DETAILED 3D GLOBE & ULTRA-THIN ARROWS
       ============================================================ */
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0, 0);
    scene.add(globeGroup);

    function createDetailedGlobeTexture() {
      const c = document.createElement("canvas");
      c.width = 2048;
      c.height = 1024;
      const ctx = c.getContext("2d")!;

      ctx.fillStyle = "#dce2ea";
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2.0;
      for (let x = 0; x <= c.width; x += c.width / 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c.height);
        ctx.stroke();
      }
      for (let y = 0; y <= c.height; y += c.height / 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(c.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(0, c.height / 2);
      ctx.lineTo(c.width, c.height / 2);
      ctx.stroke();

      function drawLand(coords: number[][], fillHex: string) {
        ctx.fillStyle = fillHex;
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        coords.forEach(([lon, lat], idx) => {
          const x = ((lon + 180) / 360) * c.width;
          const y = ((90 - lat) / 180) * c.height;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Eurasia
      drawLand(
        [
          [-9, 37],
          [-9, 43],
          [-2, 44],
          [3, 51],
          [10, 58],
          [20, 70],
          [60, 72],
          [105, 73],
          [140, 65],
          [142, 48],
          [130, 35],
          [122, 23],
          [108, 18],
          [102, 4],
          [96, 16],
          [88, 22],
          [78, 8],
          [70, 22],
          [62, 25],
          [56, 27],
          [50, 30],
          [48, 29],
          [55, 22],
          [44, 13],
          [35, 30],
          [36, 37],
          [27, 38],
          [26, 41],
          [15, 38],
          [10, 44],
          [3, 42],
        ],
        "#64748b"
      );

      // Iran Highlighted in Darker Slate
      drawLand(
        [
          [44, 39],
          [48, 38],
          [54, 37],
          [61, 36],
          [62, 26],
          [56, 27],
          [50, 30],
          [46, 34],
        ],
        "#334155"
      );

      // Africa
      drawLand(
        [
          [-17, 15],
          [-6, 35],
          [10, 37],
          [32, 31],
          [43, 12],
          [51, 11],
          [40, -10],
          [34, -25],
          [20, -34],
          [14, -22],
          [9, 4],
          [-8, 5],
        ],
        "#64748b"
      );

      // North America
      drawLand(
        [
          [-165, 65],
          [-130, 70],
          [-80, 65],
          [-60, 50],
          [-75, 35],
          [-82, 25],
          [-90, 18],
          [-84, 9],
          [-105, 20],
          [-122, 37],
          [-140, 58],
        ],
        "#64748b"
      );

      // South America
      drawLand(
        [
          [-80, 10],
          [-60, 5],
          [-35, -6],
          [-42, -23],
          [-55, -35],
          [-68, -54],
          [-74, -45],
          [-71, -18],
          [-81, -4],
        ],
        "#64748b"
      );

      // Australia
      drawLand(
        [
          [114, -22],
          [132, -12],
          [148, -18],
          [153, -28],
          [145, -38],
          [130, -33],
          [115, -34],
        ],
        "#64748b"
      );

      return new THREE.CanvasTexture(c);
    }

    const GLOBE_RADIUS = 10.4;

    const globeShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: createDetailedGlobeTexture() },
        uLightDir: { value: new THREE.Vector3(0.6, 0.7, 0.8).normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormalView;
        varying vec3 vNormalWorld;
        void main() {
            vUv = uv;
            vNormalView  = normalize(normalMatrix * normal);
            vNormalWorld = normalize(mat3(modelMatrix) * normal);
            gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform vec3 uLightDir;
        varying vec2 vUv;
        varying vec3 vNormalView;
        varying vec3 vNormalWorld;

        void main() {
            vec3 texCol = texture2D(uMap, vUv).rgb;
            float diff = dot(vNormalWorld, uLightDir) * 0.5 + 0.5;
            float shading = mix(0.52, 0.94, diff);

            float viewDot = abs(vNormalView.z);
            float rimOutline = smoothstep(0.0, 0.26, viewDot);

            vec3 col = texCol * shading;
            col = mix(vec3(0.08), col, rimOutline);

            gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS, 72, 72),
      globeShaderMat
    );
    globeGroup.add(earthMesh);

    function latLonToVec3(lat: number, lon: number, radius: number) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    const arrowInkMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const animatedTravelers: Array<{
      mesh: THREE.Mesh;
      curve: THREE.CubicBezierCurve3;
      offset: number;
    }> = [];

    function addHairlinePointToPointArrow(
      fromCoord: { lat: number; lon: number },
      toCoord: { lat: number; lon: number },
      arcHeightFactor = 0.3
    ) {
      const startVec = latLonToVec3(fromCoord.lat, fromCoord.lon, GLOBE_RADIUS);
      const endVec = latLonToVec3(toCoord.lat, toCoord.lon, GLOBE_RADIUS);

      const dist = startVec.distanceTo(endVec);
      const midVec = startVec.clone().add(endVec).multiplyScalar(0.5);
      midVec.normalize().multiplyScalar(GLOBE_RADIUS + dist * arcHeightFactor);

      const ctrl1 = startVec
        .clone()
        .lerp(midVec, 0.65)
        .normalize()
        .multiplyScalar(GLOBE_RADIUS + dist * arcHeightFactor * 0.78);
      const ctrl2 = endVec
        .clone()
        .lerp(midVec, 0.65)
        .normalize()
        .multiplyScalar(GLOBE_RADIUS + dist * arcHeightFactor * 0.78);

      const fullCurve = new THREE.CubicBezierCurve3(
        startVec,
        ctrl1,
        ctrl2,
        endVec
      );

      [startVec, endVec].forEach((pt) => {
        const norm = pt.clone().normalize();
        const microDot = new THREE.Mesh(
          new THREE.CircleGeometry(0.08, 12),
          arrowInkMat
        );
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

      const microArrowHeadGeo = new THREE.ConeGeometry(0.065, 0.28, 12);
      const microArrowHead = new THREE.Mesh(microArrowHeadGeo, arrowInkMat);
      microArrowHead.position.copy(tipPos);
      microArrowHead.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        tipDir
      );
      globeGroup.add(microArrowHead);

      const travelerMesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.055, 0.24, 10),
        arrowInkMat
      );
      globeGroup.add(travelerMesh);
      animatedTravelers.push({
        mesh: travelerMesh,
        curve: fullCurve,
        offset: Math.random(),
      });
    }

    const pointToPointRoutes = [
      { from: { lat: 31.2, lon: 121.5 }, to: { lat: 35.7, lon: 51.4 }, h: 0.32 },
      { from: { lat: 22.5, lon: 114.1 }, to: { lat: 25.2, lon: 55.3 }, h: 0.28 },
      { from: { lat: 25.2, lon: 55.3 }, to: { lat: 35.7, lon: 51.4 }, h: 0.22 },
      { from: { lat: 53.5, lon: 10.0 }, to: { lat: 41.0, lon: 29.0 }, h: 0.25 },
      { from: { lat: 41.0, lon: 29.0 }, to: { lat: 35.7, lon: 51.4 }, h: 0.22 },
      { from: { lat: 35.6, lon: 139.7 }, to: { lat: 1.3, lon: 103.8 }, h: 0.3 },
      { from: { lat: 1.3, lon: 103.8 }, to: { lat: 25.2, lon: 55.3 }, h: 0.3 },
      { from: { lat: 40.7, lon: -74.0 }, to: { lat: 51.5, lon: -0.1 }, h: 0.34 },
      { from: { lat: 51.5, lon: -0.1 }, to: { lat: 35.7, lon: 51.4 }, h: 0.3 },
      { from: { lat: -23.5, lon: -46.6 }, to: { lat: 38.7, lon: -9.1 }, h: 0.34 },
      { from: { lat: -33.8, lon: 151.2 }, to: { lat: 22.5, lon: 114.1 }, h: 0.32 },
    ];

    pointToPointRoutes.forEach((r) =>
      addHairlinePointToPointArrow(r.from, r.to, r.h)
    );

    globeGroup.rotation.set(0.28, -2.05, -0.06);

    /* ============================================================
       SECTION 3 — PACKAGE HANDOVER SCENE (AT EXACT GLOBE POSITION)
       ============================================================ */
    const deliverySceneGroup = new THREE.Group();
    deliverySceneGroup.position.set(0, -4.8, 0);
    deliverySceneGroup.scale.setScalar(0.001);
    scene.add(deliverySceneGroup);

    const suitDarkMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.55,
    });
    const jacketMidMat = new THREE.MeshStandardMaterial({
      color: 0x52525b,
      roughness: 0.5,
    });
    const shirtLightMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.45,
    });
    const skinSketchMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      roughness: 0.6,
    });

    function buildDeliveryCharacters() {
      const floorLine = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 3.5, 0.06, 48),
        shirtLightMat
      );
      floorLine.position.y = -0.03;
      deliverySceneGroup.add(floorLine);

      const floorRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.025, 8, 64),
        suitDarkMat
      );
      floorRing.rotation.x = Math.PI / 2;
      deliverySceneGroup.add(floorRing);

      function createCharacter(isCourier: boolean) {
        const person = new THREE.Group();
        const coatMat = isCourier ? suitDarkMat : jacketMidMat;
        const pantsMat = isCourier ? jacketMidMat : suitDarkMat;

        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.34, 24, 20),
          skinSketchMat
        );
        head.scale.set(0.92, 1.08, 0.95);
        head.position.y = 3.18;
        person.add(head);

        const neck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.15, 0.25, 14),
          skinSketchMat
        );
        neck.position.y = 2.82;
        person.add(neck);

        if (isCourier) {
          const capCrown = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.35, 0.22, 20),
            suitDarkMat
          );
          capCrown.position.set(0, 3.42, 0);
          capCrown.rotation.z = 0.08;
          person.add(capCrown);

          const capVisor = new THREE.Mesh(
            new THREE.BoxGeometry(0.38, 0.05, 0.35),
            suitDarkMat
          );
          capVisor.position.set(0.18, 3.32, 0);
          capVisor.rotation.z = -0.12;
          person.add(capVisor);
        } else {
          const hair = new THREE.Mesh(
            new THREE.SphereGeometry(
              0.35,
              18,
              14,
              0,
              Math.PI * 2,
              0,
              Math.PI * 0.55
            ),
            suitDarkMat
          );
          hair.position.set(-0.03, 3.22, 0);
          hair.rotation.z = 0.2;
          person.add(hair);
        }

        const torso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.33, 1.32, 20),
          coatMat
        );
        torso.scale.set(0.75, 1.0, 1.15);
        torso.position.y = 2.08;
        person.add(torso);

        const shirtV = new THREE.Mesh(
          new THREE.BoxGeometry(0.58, 0.55, 0.32),
          shirtLightMat
        );
        shirtV.position.set(0, 2.42, 0);
        person.add(shirtV);

        for (const side of [-1, 1]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.17, 0.13, 1.38, 16),
            pantsMat
          );
          leg.position.set(isCourier ? side * 0.12 : 0, 0.74, side * 0.2);
          leg.rotation.z = isCourier ? side * 0.07 : 0;
          person.add(leg);

          const shoe = new THREE.Mesh(
            new THREE.BoxGeometry(0.44, 0.16, 0.22),
            suitDarkMat
          );
          shoe.position.set(
            (isCourier ? side * 0.12 : 0) + (isCourier ? 0.1 : -0.1),
            0.08,
            side * 0.2
          );
          person.add(shoe);
        }

        const dirX = isCourier ? 1 : -1;
        for (const side of [-1, 1]) {
          const upperArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.13, 0.11, 0.72, 14),
            coatMat
          );
          upperArm.position.set(dirX * 0.22, 2.28, side * 0.44);
          upperArm.rotation.z = -dirX * 0.68;
          person.add(upperArm);

          const foreArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.095, 0.7, 14),
            coatMat
          );
          foreArm.position.set(dirX * 0.68, 2.02, side * 0.36);
          foreArm.rotation.z = -dirX * 1.32;
          foreArm.rotation.y = -side * dirX * 0.18;
          person.add(foreArm);

          const hand = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 12, 12),
            skinSketchMat
          );
          hand.position.set(dirX * 1.04, 1.96, side * 0.28);
          person.add(hand);
        }

        return person;
      }

      const courier = createCharacter(true);
      courier.position.set(-1.35, 0, 0);
      deliverySceneGroup.add(courier);

      const client = createCharacter(false);
      client.position.set(1.35, 0, 0);
      deliverySceneGroup.add(client);

      const boxC = document.createElement("canvas");
      boxC.width = 512;
      boxC.height = 512;
      const bCtx = boxC.getContext("2d")!;
      bCtx.fillStyle = "#d4d4d8";
      bCtx.fillRect(0, 0, 512, 512);
      bCtx.strokeStyle = "#18181b";
      bCtx.lineWidth = 14;
      bCtx.strokeRect(12, 12, 488, 488);
      bCtx.fillStyle = "#3f3f46";
      bCtx.fillRect(0, 230, 512, 52);

      const parcelGroup = new THREE.Group();
      const parcelBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.92, 0.68, 0.78),
        new THREE.MeshStandardMaterial({
          map: new THREE.CanvasTexture(boxC),
          roughness: 0.5,
        })
      );
      parcelGroup.add(parcelBox);
      parcelGroup.position.set(-0.32, 2.02, 0);
      deliverySceneGroup.add(parcelGroup);

      return { courier, client, parcelGroup };
    }

    const actors = buildDeliveryCharacters();

    /* ============================================================
       SECTION 4 — GSAP TIMELINE & SCROLLTRIGGER (FLUID SCROLL CONTROL)
       ============================================================ */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * 2.8, 2800)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2, // تأخیر نرم و شناور ۱.۲ ثانیه‌ای برای از بین بردن پرش‌های ماوس‌ویل و حرکت ابریشمی
        invalidateOnRefresh: true,
      },
    });

    // ۱. چرخش آرام، ملایم و نمایش اولیه کره زمین و خطوط ارتباطی
    tl.to(
      globeGroup.rotation,
      {
        x: 0.52,
        y: -2.42,
        z: 0.0,
        ease: "power1.inOut",
        duration: 3.5,
      },
      0
    )
      .to(
        globeGroup.scale,
        {
          x: 1.28,
          y: 1.28,
          z: 1.28,
          ease: "power1.inOut",
          duration: 3.5,
        },
        0
      )

      // ۲. بزرگ‌نمایی پیوسته و ورود تدریجی و عمیق به قطب تجاری خاورمیانه
      .to(
        globeGroup.rotation,
        {
          x: 0.60,
          y: -2.52,
          ease: "power2.inOut",
          duration: 3.5,
        },
        3.5
      )
      .to(
        globeGroup.scale,
        {
          x: 9.0,
          y: 9.0,
          z: 9.0,
          ease: "power2.inOut",
          duration: 3.5,
        },
        3.5
      )
      .to(
        globeGroup.position,
        {
          x: () => (isMobile() ? 0 : 5.2),
          y: -4.0,
          z: 24.0,
          ease: "power2.inOut",
          duration: 3.5,
        },
        3.5
      )

      // ۳. عبور نرم کره زمین از کنار دید ناظر و ظهور صحنه تحویل نهایی کالا
      .to(
        globeGroup.position,
        {
          z: 65.0,
          y: -7.0,
          ease: "power2.in",
          duration: 2.2,
        },
        6.8
      )
      .to(
        globeGroup.scale,
        {
          x: 14.0,
          y: 14.0,
          z: 14.0,
          ease: "power2.in",
          duration: 2.2,
        },
        6.8
      )
      .to(
        deliverySceneGroup.scale,
        {
          x: 2.85,
          y: 2.85,
          z: 2.85,
          ease: "power2.out",
          duration: 2.8,
        },
        7.0
      )
      .fromTo(
        deliverySceneGroup.rotation,
        { y: -0.38 },
        { y: 0.12, ease: "power1.out", duration: 3.0 },
        7.0
      )
      .fromTo(
        actors.courier.position,
        { x: -1.75 },
        { x: -1.1, ease: "power1.out", duration: 2.8 },
        7.2
      )
      .fromTo(
        actors.client.position,
        { x: 1.75 },
        { x: 1.1, ease: "power1.out", duration: 2.8 },
        7.2
      )
      .fromTo(
        actors.parcelGroup.position,
        { x: -0.45, y: 1.96 },
        { x: 0.06, y: 2.05, ease: "power1.inOut", duration: 2.8 },
        7.4
      )

      // ۴. زمان استراحت (Buffer / Hold) در پایان انیمیشن تا کاربر صحنه تکمیل‌شده تحویل را با آرامش مشاهده کند
      .to({}, { duration: 2.0 });

    /* ============================================================
       SECTION 5 — RENDER LOOP & RESIZE
       ============================================================ */
    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      graphiteMat.uniforms.uTime.value = elapsed;

      animatedTravelers.forEach((tr) => {
        const t = ((elapsed * 0.25 + tr.offset) % 1.0) * 0.92 + 0.03;
        const pos = tr.curve.getPoint(t);
        const tangent = tr.curve.getTangent(t).normalize();
        tr.mesh.position.copy(pos);
        tr.mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          tangent
        );
      });

      camera.lookAt(camLookTarget.x, camLookTarget.y, camLookTarget.z);

      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    }
    animate();

    const onResize = () => {
      if (!section) return;
      const w = section.clientWidth || window.innerWidth;
      const h = section.clientHeight || (window.innerWidth < 900 ? 640 : 750);
      camera.aspect = w / h;
      camera.position.set(getStageOffsetX(), 1.2, isMobile() ? 48 : 42);
      camLookTarget.x = getStageOffsetX();
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderTarget.setSize(w * DPR, h * DPR);
      graphiteMat.uniforms.uResolution.value.set(w * DPR, h * DPR);
    };

    const onThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      graphiteMat.uniforms.uDark.value = isDark ? 1.0 : 0.0;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("themechange", onThemeChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("themechange", onThemeChange);
      tl.scrollTrigger?.kill();
      tl.kill();
      renderer.dispose();
      renderTarget.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global-delivery"
      className="relative w-full h-screen flex items-center overflow-hidden bg-white dark:bg-zinc-950 select-none py-6 transition-colors duration-300"
      dir="rtl"
      lang="fa"
    >
      {/* 3D Graphite Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Structured Content Container matching site design system */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 pointer-events-none">
        
        {/* Right Column: Text Content with exact site typography hierarchy */}
        <div className="max-w-xl pointer-events-auto space-y-4 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-zinc-100/80 dark:border-zinc-800/80">
          {/* Badge Tag */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-amber-400" />
            <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 tracking-wider">
              {"// 02.5 — GLOBAL REACH TO FINAL DELIVERY"}
            </span>
          </div>

          {/* Main Title matching Services & Workflow sections */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
            از هر نقطه‌ای در جهان تا دستان شما
          </h2>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            اتصال مستقیم به قطب‌های تجاری دنیا، حمل‌ونقل بین‌المللی و ترخیص
            سریع گمرکی تا تحویل نهایی کالا در مقصد شما.
          </p>

          {/* Value Badges (بدون نمایش فاز) */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-zinc-700 dark:text-amber-400" strokeWidth={1.75} />
              <span>پوشش ترانزیت هوایی و دریایی</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-emerald-400" strokeWidth={1.75} />
              <span>ترخیص مستقیم و سریع گمرک</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
              <PackageCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-blue-400" strokeWidth={1.75} />
              <span>تحویل تضمینی درب انبار</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 flex items-center gap-3">
            <a
              href="#estimator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>استعلام آنلاین هزینه ترخیص</span>
              <ArrowUpLeft className="w-4 h-4" strokeWidth={1.75} />
            </a>

            <a
              href="#hubs"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-all"
            >
              <span>مشاهده دفاتر خارجی</span>
            </a>
          </div>
        </div>

        {/* Left Column: Animation Space for 3D Globe & Delivery Scene */}
        <div className="w-full lg:w-[480px] h-[320px] lg:h-[480px] shrink-0 pointer-events-none" />
      </div>
    </section>
  );
}

export default GlobalDeliverySection;
