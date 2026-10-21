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
    const isDarkInit =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const isMobile = () => window.innerWidth < 900;
    const getStageOffsetX = () => (isMobile() ? 0 : 10.5);

    const initW = section.clientWidth || window.innerWidth;
    const initH = section.clientHeight || (window.innerWidth < 900 ? 640 : 750);

    const camera = new THREE.PerspectiveCamera(42, initW / initH, 0.1, 2000);
    camera.position.set(getStageOffsetX(), 1.2, isMobile() ? 48 : 42);
    const camLookTarget = { x: getStageOffsetX(), y: 0.0, z: 0 };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(initW, initH);
    renderer.setPixelRatio(DPR);

    const renderTarget = new THREE.WebGLRenderTarget(
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
          value: new THREE.Vector2(initW * DPR, initH * DPR),
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

            // The globe shader writes low alpha on ocean pixels; only those get brand-colored ink
            vec4 centerSample = texture2D(tDiffuse, vUv);
            float oceanMask = 1.0 - centerSample.a;

            if (mc > 0.990 && edgeGrad < 0.015 && oceanMask < 0.5) {
                vec3 bgPure = mix(vec3(1.0, 1.0, 1.0), vec3(0.118, 0.161, 0.353), uDark);
                gl_FragColor = vec4(bgPure, 1.0);
                return;
            }

            float leadGrain = noise(vUv * uResolution * 0.5);
            float pencilOutline = smoothstep(0.035, 0.26, edgeGrad * 1.3 * (0.82 + 0.38 * leadGrain));

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

            vec3 brandNavy   = vec3(0.118, 0.161, 0.353);
            vec3 brandAccent = vec3(0.165, 0.353, 0.878);

            // Watercolor wash: the scene's real colors, partially desaturated, with shadows leaning toward brand navy
            float centerLuma = dot(centerSample.rgb, vec3(0.299, 0.587, 0.114));
            vec3 muted = mix(vec3(centerLuma), centerSample.rgb, 0.65);
            muted = mix(muted, brandNavy, (1.0 - centerLuma) * 0.18);

            // Light Mode: graphite sketchbook over a soft color wash
            float totalLightGraphite = clamp(smudge + hatch1 + hatch2 + hatch3 + pencilOutline * 0.96, 0.0, 0.96);
            vec3 washPaper = mix(vec3(1.0, 1.0, 1.0), muted, 0.45);
            vec3 lightInk  = mix(vec3(0.10, 0.10, 0.11), muted * 0.6, 0.35);
            vec3 lightGraphite = mix(washPaper, lightInk, totalLightGraphite);

            // Ocean: brand accent #2a5ae0 hatching and brand navy #1e295a contours over a real-water wash
            float oceanShade = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.96);
            vec3 oceanWash = mix(brandAccent, muted, 0.35);
            vec3 lightOcean = mix(vec3(1.0, 1.0, 1.0), oceanWash, 0.18 + oceanShade * 0.7);
            lightOcean = mix(lightOcean, brandNavy, clamp(pencilOutline * 0.96 + oceanShade * 0.35, 0.0, 0.96));

            vec3 lightResult = mix(lightGraphite, lightOcean, oceanMask);

            // Dark Mode: Technical blueprint on brand navy with color-tinted titanium shading and platinum lines
            vec3 darkPaper  = brandNavy;
            vec3 shadeChalk = mix(vec3(0.24, 0.27, 0.33), muted, 0.45);
            shadeChalk = mix(shadeChalk, brandAccent, oceanMask);
            vec3 lineChalk  = mix(vec3(0.90, 0.92, 0.96), vec3(0.80, 0.87, 1.0), oceanMask);

            float shadeFactor = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.85);

            float backdropFade = smoothstep(0.995, 0.96, centerLuma);
            vec3 darkResult = mix(darkPaper, muted, 0.30 * (1.0 - oceanMask) * backdropFade);
            darkResult = mix(darkResult, brandAccent, oceanMask * 0.12);
            darkResult = mix(darkResult, shadeChalk, shadeFactor);
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

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(-22, 18, -16);
    scene.add(rimLight);

    /* ============================================================
       SECTION 2 — ULTRA-REALISTIC 3D GLOBE & HAIRLINE ARROWS
       ============================================================ */
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0, 0);
    scene.add(globeGroup);

    function createRealisticGlobeTextures() {
      const W = 4096;
      const H = 2048;

      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;

      const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
      oceanGrad.addColorStop(0.0, "#cbd5e1");
      oceanGrad.addColorStop(0.2, "#e2e8f0");
      oceanGrad.addColorStop(0.5, "#ebeff5");
      oceanGrad.addColorStop(0.8, "#e2e8f0");
      oceanGrad.addColorStop(1.0, "#cbd5e1");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.42)";
      ctx.lineWidth = 1.5;
      for (let lon = -180; lon <= 180; lon += 10) {
        const x = ((lon + 180) / 360) * W;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let lat = -80; lat <= 80; lat += 10) {
        const y = ((90 - lat) / 180) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(71, 85, 105, 0.65)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      ctx.setLineDash([10, 10]);
      ctx.lineWidth = 1.6;
      [23.43, -23.43, 66.56, -66.56].forEach((lat) => {
        const y = ((90 - lat) / 180) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      function traceFractalPath(coords: number[][], jitterAmount = 0.35) {
        ctx.beginPath();
        const pts: Array<[number, number]> = [];

        for (let i = 0; i < coords.length; i++) {
          const [lon1, lat1] = coords[i];
          const [lon2, lat2] = coords[(i + 1) % coords.length];
          const dist = Math.hypot(lon2 - lon1, lat2 - lat1);
          const steps = Math.max(1, Math.min(18, Math.floor(dist / 1.4)));

          for (let s = 0; s < steps; s++) {
            const t = s / steps;
            const lon = lon1 + (lon2 - lon1) * t;
            const lat = lat1 + (lat2 - lat1) * t;
            const seed = Math.sin(lon * 12.9898 + lat * 78.233) * 43758.5453;
            const n = (seed - Math.floor(seed) - 0.5) * 2.0;
            const perpLon = -(lat2 - lat1) / (dist || 1);
            const perpLat = (lon2 - lon1) / (dist || 1);
            const fade = Math.sin(t * Math.PI);
            const fLon = lon + perpLon * n * jitterAmount * fade;
            const fLat = lat + perpLat * n * jitterAmount * fade;

            const x = ((fLon + 180) / 360) * W;
            const y = ((90 - fLat) / 180) * H;
            pts.push([x, y]);
          }
        }

        pts.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }

      function drawContinent(
        coords: number[][],
        fillHex = "#8492a6",
        strokeHex = "#0f172a",
        lineWidth = 4.2,
        jitter = 0.38
      ) {
        traceFractalPath(coords, jitter);

        ctx.save();
        ctx.strokeStyle = "rgba(100, 116, 139, 0.35)";
        ctx.lineWidth = lineWidth * 3.2;
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = fillHex;
        ctx.fill();

        ctx.strokeStyle = strokeHex;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      function drawWaterBody(coords: number[][], jitter = 0.22) {
        traceFractalPath(coords, jitter);
        ctx.fillStyle = "#e5ebf3";
        ctx.fill();
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 3.5;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      function drawMountainRange(
        peaks: number[][],
        widthDeg = 3.5,
        intensity = 0.45
      ) {
        for (let i = 0; i < peaks.length - 1; i++) {
          const [lon1, lat1] = peaks[i];
          const [lon2, lat2] = peaks[i + 1];
          const steps = 28;
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const lon = lon1 + (lon2 - lon1) * t;
            const lat = lat1 + (lat2 - lat1) * t;
            const x = ((lon + 180) / 360) * W;
            const y = ((90 - lat) / 180) * H;
            const r = (widthDeg / 360) * W * (0.7 + 0.5 * Math.sin(s * 1.9));

            const grad = ctx.createRadialGradient(x, y, r * 0.08, x, y, r);
            grad.addColorStop(0, `rgba(15, 23, 42, ${intensity})`);
            grad.addColorStop(0.5, `rgba(51, 65, 85, ${intensity * 0.45})`);
            grad.addColorStop(1, "rgba(51, 65, 85, 0.0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(15, 23, 42, ${intensity * 0.7})`;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(x - r * 0.35, y - r * 0.2);
            ctx.lineTo(x, y - r * 0.05);
            ctx.lineTo(x + r * 0.3, y + r * 0.25);
            ctx.stroke();
          }
        }
      }

      // اوراسیا
      drawContinent([
        [-9.5, 37.0], [-9.2, 43.0], [-1.8, 43.4], [-4.5, 48.4], [1.8, 51.0],
        [5.5, 53.5], [8.5, 54.0], [8.2, 57.0], [10.5, 57.7], [12.0, 54.5],
        [14.5, 54.0], [18.6, 54.4], [21.0, 55.5], [24.0, 57.0], [28.0, 59.8],
        [30.2, 60.0], [21.5, 61.0], [22.0, 65.5], [25.5, 65.0], [18.0, 68.5],
        [20.5, 70.2], [28.0, 71.1], [33.5, 69.3], [40.0, 66.5], [43.5, 68.5],
        [54.0, 68.2], [60.0, 70.0], [68.5, 73.2], [73.0, 72.5], [82.0, 73.8],
        [95.0, 76.2], [105.0, 77.5], [114.0, 73.5], [128.0, 72.0], [140.0, 72.5],
        [160.0, 70.0], [178.0, 66.5], [170.0, 60.5], [163.0, 59.5], [156.5, 51.0],
        [160.0, 55.0], [150.0, 59.5], [142.0, 59.0], [140.5, 51.5], [135.5, 44.0],
        [131.0, 42.5], [129.5, 35.2], [126.5, 37.5], [124.2, 40.0], [121.5, 38.8],
        [119.5, 39.8], [122.5, 37.0], [119.5, 34.5], [121.8, 31.2], [121.5, 28.0],
        [117.0, 23.5], [114.1, 22.3], [109.8, 20.2], [108.0, 21.5], [105.8, 19.5],
        [109.2, 13.0], [105.0, 8.6], [103.5, 10.5], [100.5, 13.5], [99.2, 8.0],
        [103.8, 1.3], [101.0, 3.0], [98.5, 8.0], [97.5, 16.5], [94.2, 16.0],
        [92.0, 21.5], [89.0, 22.0], [87.0, 20.8], [80.2, 13.0], [77.5, 8.1],
        [75.0, 12.5], [72.8, 19.0], [69.0, 22.5], [67.0, 24.8], [61.6, 25.2],
        [57.2, 25.8], [56.3, 26.5], [54.0, 26.8], [50.2, 30.0], [48.5, 29.9],
        [49.8, 27.0], [51.5, 25.3], [54.5, 24.4], [56.2, 26.1], [59.8, 22.5],
        [55.0, 17.0], [45.0, 12.8], [43.3, 12.6], [42.5, 16.5], [39.1, 21.5],
        [36.5, 26.0], [34.5, 28.0], [32.5, 29.9], [34.5, 31.5], [35.8, 35.8],
        [36.1, 36.8], [32.5, 36.2], [27.2, 36.8], [26.2, 40.0], [29.0, 41.0],
        [27.8, 42.5], [28.6, 44.2], [30.8, 46.4], [33.5, 45.0], [36.5, 45.2],
        [39.8, 43.4], [41.6, 41.6], [36.0, 41.2], [29.0, 41.0], [24.0, 40.2],
        [23.8, 38.0], [22.5, 36.5], [20.0, 39.5], [19.2, 42.0], [13.8, 45.5],
        [12.3, 45.4], [14.0, 42.5], [18.4, 40.1], [16.0, 38.0], [15.6, 38.2],
        [12.4, 41.8], [9.0, 44.4], [7.2, 43.7], [3.2, 43.3], [3.0, 41.8],
        [-0.5, 38.5], [-5.4, 36.0]
      ], "#7c8ba1", "#0f172a", 4.0, 0.32);

      // شبه‌جزیره اسکاندیناوی
      drawContinent([
        [5.0, 59.0], [5.2, 62.0], [10.0, 64.0], [15.0, 68.5], [20.5, 70.2],
        [24.0, 66.0], [21.5, 63.5], [18.0, 59.3], [16.0, 56.2], [12.8, 55.5],
        [11.8, 58.0], [10.5, 59.8], [7.5, 58.0]
      ], "#7c8ba1", "#0f172a", 3.8, 0.3);

      // دریای خزر
      drawWaterBody([
        [49.8, 40.4], [48.8, 41.8], [47.5, 43.0], [47.0, 44.8], [49.2, 46.4],
        [51.8, 47.1], [53.4, 46.2], [51.2, 44.5], [52.5, 42.5], [52.8, 41.2],
        [54.0, 39.5], [53.9, 37.0], [51.5, 36.7], [49.5, 37.4], [48.9, 38.8]
      ], 0.12);

      // ایران (هایلایت ویژه)
      drawContinent([
        [44.1, 39.4], [44.8, 39.7], [46.5, 38.9], [48.0, 39.5], [48.9, 38.4],
        [49.5, 37.4], [51.5, 36.7], [53.9, 37.0], [54.8, 37.9], [56.5, 38.2],
        [59.2, 37.5], [61.2, 35.8], [60.8, 33.5], [61.8, 31.0], [63.2, 27.2],
        [61.6, 25.2], [57.2, 25.8], [56.3, 26.5], [54.8, 26.6], [52.6, 27.5],
        [50.8, 28.9], [50.2, 30.0], [48.5, 29.9], [48.0, 31.0], [47.7, 32.8],
        [45.5, 33.8], [45.8, 35.2], [44.8, 37.0]
      ], "#475569", "#09090b", 5.2, 0.15);

      // آفریقا
      drawContinent([
        [-5.8, 35.8], [0.0, 35.8], [5.0, 36.8], [10.2, 37.2], [11.5, 33.2],
        [15.2, 32.0], [20.0, 32.8], [25.0, 31.6], [32.3, 31.2], [33.8, 28.0],
        [35.5, 24.0], [37.3, 21.0], [39.0, 18.0], [43.2, 12.0], [45.0, 10.8],
        [51.4, 11.9], [49.0, 6.0], [45.3, 2.0], [41.0, -1.5], [39.5, -6.8],
        [40.6, -10.5], [40.5, -15.0], [36.5, -18.5], [35.4, -23.5], [32.8, -26.0],
        [31.0, -29.8], [28.0, -32.8], [25.5, -34.0], [20.0, -34.8], [18.4, -33.9],
        [17.8, -29.0], [15.0, -26.0], [14.5, -22.8], [11.8, -17.0], [13.2, -8.8],
        [12.2, -6.0], [9.4, 0.4], [9.7, 4.0], [5.5, 4.5], [3.4, 6.4],
        [-0.2, 5.5], [-4.0, 5.2], [-7.7, 4.4], [-10.8, 6.3], [-13.3, 8.5],
        [-16.6, 12.3], [-17.5, 14.7], [-16.5, 19.5], [-17.1, 21.0], [-14.5, 26.2],
        [-10.0, 29.8], [-9.3, 32.3]
      ], "#7c8ba1", "#0f172a", 4.0, 0.32);

      // آمریکای شمالی و مرکزی
      drawContinent([
        [-168.0, 65.6], [-162.0, 66.5], [-156.5, 71.3], [-140.0, 69.6], [-128.0, 70.5],
        [-115.0, 68.0], [-95.0, 70.0], [-82.0, 68.5], [-78.0, 63.0], [-83.0, 55.0],
        [-79.0, 51.5], [-78.0, 58.5], [-72.0, 61.5], [-64.5, 60.2], [-55.6, 52.0],
        [-64.5, 49.0], [-69.0, 47.5], [-60.5, 46.0], [-66.0, 43.8], [-70.0, 43.5],
        [-70.8, 41.5], [-74.0, 40.7], [-75.5, 35.2], [-80.0, 32.8], [-81.4, 30.5],
        [-80.1, 25.8], [-81.8, 24.6], [-82.8, 28.0], [-84.2, 30.0], [-89.0, 29.2],
        [-94.8, 29.3], [-97.2, 26.0], [-97.8, 22.2], [-96.1, 19.2], [-92.0, 18.5],
        [-90.5, 19.8], [-89.6, 21.3], [-86.8, 21.2], [-88.2, 18.5], [-88.5, 15.8],
        [-83.2, 15.0], [-83.7, 10.5], [-82.5, 9.4], [-79.5, 9.0], [-77.5, 7.8],
        [-80.5, 7.5], [-83.0, 8.5], [-85.8, 10.5], [-87.8, 13.3], [-92.2, 14.5],
        [-95.2, 16.2], [-100.0, 16.8], [-105.5, 20.5], [-109.5, 25.5], [-114.5, 31.5],
        [-114.8, 30.0], [-110.0, 23.0], [-112.5, 26.5], [-117.1, 32.5], [-120.5, 34.5],
        [-122.4, 37.8], [-124.4, 40.4], [-124.7, 48.4], [-128.0, 51.0], [-133.0, 55.5],
        [-140.0, 59.8], [-147.0, 61.0], [-152.0, 59.0], [-162.0, 55.0], [-165.0, 60.0],
        [-162.0, 63.5]
      ], "#7c8ba1", "#0f172a", 4.0, 0.35);

      // آمریکای جنوبی
      drawContinent([
        [-77.5, 8.5], [-75.5, 10.4], [-72.0, 12.2], [-68.0, 10.5], [-62.0, 10.6],
        [-60.0, 8.5], [-54.0, 5.8], [-50.0, 1.5], [-48.5, -1.5], [-44.2, -2.5],
        [-38.5, -3.7], [-35.2, -5.8], [-34.8, -8.0], [-38.5, -13.0], [-39.0, -18.0],
        [-41.0, -22.0], [-43.2, -23.0], [-48.5, -26.0], [-52.0, -32.0], [-53.5, -34.0],
        [-58.0, -36.0], [-57.5, -38.0], [-62.0, -39.0], [-65.0, -41.0], [-65.5, -45.0],
        [-67.5, -46.0], [-66.0, -48.0], [-69.0, -51.5], [-68.4, -52.6], [-65.2, -54.8],
        [-71.0, -54.0], [-74.5, -52.5], [-75.5, -47.0], [-73.8, -42.0], [-73.2, -37.0],
        [-71.6, -33.0], [-71.5, -29.0], [-70.5, -23.5], [-70.2, -18.5], [-75.5, -15.0],
        [-77.1, -12.0], [-79.2, -8.0], [-81.3, -4.7], [-80.0, -2.2], [-80.8, -0.5],
        [-79.0, 1.5], [-77.3, 4.0]
      ], "#7c8ba1", "#0f172a", 4.0, 0.32);

      // استرالیا
      drawContinent([
        [114.1, -21.8], [122.2, -18.0], [126.5, -14.0], [130.8, -12.4], [136.8, -12.2],
        [136.0, -15.0], [140.8, -17.5], [142.5, -10.7], [145.5, -15.0], [149.2, -21.0],
        [153.2, -25.2], [153.6, -28.6], [151.2, -33.8], [150.0, -37.5], [146.5, -39.0],
        [144.8, -38.0], [141.0, -38.0], [138.6, -35.0], [135.8, -34.8], [131.5, -31.5],
        [124.0, -33.8], [118.0, -35.0], [115.0, -34.2], [115.8, -32.0], [114.0, -26.0]
      ], "#7c8ba1", "#0f172a", 3.8, 0.3);

      const islands: Array<{ coords: number[][]; lw?: number }> = [
        { coords: [[-5.2, 50.0], [-3.0, 51.4], [-5.0, 51.8], [-3.1, 53.4], [-4.8, 55.0], [-5.8, 57.5], [-3.1, 58.6], [-2.0, 57.6], [-1.5, 55.0], [0.1, 53.5], [1.7, 52.5], [1.4, 51.2], [-1.2, 50.7]] },
        { coords: [[-9.8, 51.6], [-10.2, 53.5], [-8.2, 55.2], [-5.5, 54.5], [-6.2, 52.2]] },
        { coords: [[-24.0, 65.5], [-21.8, 66.4], [-14.5, 66.2], [-13.8, 64.5], [-19.0, 63.4], [-22.5, 63.9]] },
        { coords: [[130.8, 33.8], [133.5, 35.5], [136.8, 37.2], [139.8, 39.8], [140.8, 41.4], [142.0, 39.6], [140.8, 35.8], [138.5, 34.6], [135.2, 33.5]] },
        { coords: [[140.0, 41.5], [141.6, 45.4], [145.5, 43.4], [143.2, 42.0]] },
        { coords: [[129.6, 33.2], [131.6, 33.5], [131.2, 31.2], [130.2, 31.3]] },
        { coords: [[120.2, 22.8], [121.0, 25.1], [121.9, 24.8], [120.8, 22.0]], lw: 2.8 },
        { coords: [[108.8, 18.5], [110.5, 20.0], [111.0, 19.2], [109.5, 18.2]], lw: 2.5 },
        { coords: [[79.8, 9.6], [81.8, 7.5], [81.2, 6.0], [79.9, 6.8]], lw: 2.8 },
        { coords: [[49.2, -12.0], [50.4, -15.5], [49.5, -19.0], [47.0, -25.0], [44.2, -25.2], [43.5, -21.0], [44.5, -16.2], [47.5, -13.5]] },
        { coords: [[95.3, 5.5], [99.5, 3.2], [104.5, -1.5], [105.8, -5.8], [102.0, -4.0], [98.0, 1.0]] },
        { coords: [[105.5, -6.2], [110.5, -6.8], [114.5, -7.8], [114.0, -8.6], [108.0, -7.8], [105.5, -6.8]] },
        { coords: [[109.0, 1.2], [115.2, 5.2], [118.8, 4.8], [117.5, 0.5], [116.2, -3.5], [111.8, -3.2], [109.2, -0.5]] },
        { coords: [[119.5, 1.0], [124.8, 1.5], [121.5, -1.5], [123.0, -4.5], [119.5, -5.2], [118.8, -2.5]] },
        { coords: [[131.0, -1.2], [136.0, -2.0], [141.0, -2.6], [147.5, -6.0], [150.5, -10.2], [146.5, -8.5], [141.0, -9.0], [138.0, -8.2], [134.5, -4.2]] },
        { coords: [[120.0, 18.2], [122.2, 17.5], [124.0, 13.0], [121.0, 13.5], [119.8, 16.0]], lw: 2.8 },
        { coords: [[122.0, 8.2], [126.2, 9.5], [126.5, 6.5], [124.0, 6.0]], lw: 2.8 },
        { coords: [[172.6, -34.5], [175.8, -37.0], [178.4, -37.8], [175.2, -41.5], [173.8, -39.2]], lw: 3.0 },
        { coords: [[172.8, -40.6], [174.2, -41.6], [170.5, -45.8], [167.2, -46.5], [166.5, -45.2], [170.2, -42.5]], lw: 3.0 },
        { coords: [[144.8, -40.8], [148.2, -41.0], [147.5, -43.5], [145.5, -43.2]], lw: 2.8 },
        { coords: [[-72.0, 78.0], [-52.0, 82.5], [-18.0, 81.5], [-20.0, 74.0], [-25.0, 70.0], [-36.0, 65.5], [-44.0, 60.0], [-50.0, 62.5], [-54.0, 68.0], [-58.0, 74.5]] },
        { coords: [[-84.9, 21.8], [-82.0, 23.1], [-77.5, 21.5], [-74.2, 20.1], [-77.5, 19.8], [-82.5, 22.2]], lw: 2.8 },
        { coords: [[-74.4, 18.4], [-71.2, 19.8], [-68.4, 18.5], [-71.8, 17.8]], lw: 2.6 },
        { coords: [[12.5, 38.0], [15.6, 38.2], [15.1, 36.7]], lw: 2.4 },
        { coords: [[8.2, 41.2], [9.8, 41.0], [9.5, 39.0], [8.4, 39.0]], lw: 2.4 },
        { coords: [[8.6, 42.8], [9.5, 43.0], [9.2, 41.4]], lw: 2.2 },
        { coords: [[32.4, 35.1], [34.5, 35.6], [33.0, 34.6]], lw: 2.4 },
      ];

      islands.forEach((isl) =>
        drawContinent(isl.coords, "#7c8ba1", "#0f172a", isl.lw || 3.2, 0.22)
      );

      drawMountainRange([[44.8, 38.2], [47.2, 35.5], [50.2, 32.5], [53.2, 29.5], [56.8, 27.5]], 2.2, 0.55);
      drawMountainRange([[48.8, 37.5], [51.5, 36.0], [54.5, 36.8], [58.5, 37.2]], 1.8, 0.52);
      drawMountainRange([[68.0, 35.5], [74.5, 36.0], [80.0, 31.0], [87.0, 28.0], [95.0, 28.5], [100.0, 26.0]], 4.2, 0.52);
      drawMountainRange([[74.0, 40.5], [82.0, 42.5], [90.0, 43.0]], 3.5, 0.4);
      drawMountainRange([[40.0, 43.2], [44.5, 42.5], [48.5, 41.0]], 2.0, 0.45);
      drawMountainRange([[29.0, 37.5], [35.0, 38.0], [41.5, 39.5]], 2.2, 0.38);
      drawMountainRange([[6.0, 45.5], [10.5, 46.8], [15.5, 47.2], [22.0, 47.5], [25.5, 45.5]], 2.2, 0.44);
      drawMountainRange([[59.5, 65.0], [59.0, 58.0], [58.5, 52.0]], 2.0, 0.35);
      drawMountainRange([[-145.0, 62.0], [-128.0, 56.0], [-116.0, 49.0], [-109.0, 41.0], [-105.5, 35.0], [-102.0, 24.0]], 3.8, 0.45);
      drawMountainRange([[-76.0, 5.0], [-78.5, -2.0], [-75.0, -11.0], [-68.0, -18.0], [-69.5, -28.0], [-70.5, -38.0], [-72.5, -48.0]], 2.8, 0.52);
      drawMountainRange([[-7.5, 31.5], [-2.0, 34.0], [6.0, 35.5]], 2.2, 0.42);
      drawMountainRange([[38.0, 11.0], [36.5, 0.0], [34.0, -10.0]], 2.8, 0.4);

      const mapTex = new THREE.CanvasTexture(c);
      mapTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      mapTex.wrapS = THREE.RepeatWrapping;
      mapTex.wrapT = THREE.ClampToEdgeWrapping;
      return mapTex;
    }

    const GLOBE_RADIUS = 10.4;
    const proceduralGlobeTex = createRealisticGlobeTextures();

    const globeShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: proceduralGlobeTex },
        uLightDir: { value: new THREE.Vector3(0.65, 0.72, 0.82).normalize() },
        uTime: { value: 0.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormalView;
        varying vec3 vNormalWorld;
        varying vec3 vPosObj;
        varying vec3 vViewDir;

        void main() {
            vUv = uv;
            vPosObj = normalize(position);
            vNormalView  = normalize(normalMatrix * normal);
            vNormalWorld = normalize(mat3(modelMatrix) * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vViewDir = normalize(cameraPosition - worldPos.xyz);
            gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform vec3 uLightDir;
        uniform float uTime;

        varying vec2 vUv;
        varying vec3 vNormalView;
        varying vec3 vNormalWorld;
        varying vec3 vPosObj;
        varying vec3 vViewDir;

        float hash3(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise3(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
                mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x),
                    mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
                mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
                    mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
                f.z
            );
        }

        float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
                v += a * noise3(p);
                p = p * 2.15 + vec3(13.7, 29.3, 7.1);
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec3 texCol = texture2D(uMap, vUv).rgb;
            float baseLuma = dot(texCol, vec3(0.299, 0.587, 0.114));

            float isLand = smoothstep(0.84, 0.62, baseLuma);

            vec3 sampleP = vPosObj * 18.0;
            float hCenter = fbm(sampleP);

            // Earthy land tones: arid sand blending into muted vegetation
            vec3 sandTint = vec3(1.16, 1.04, 0.80);
            vec3 sageTint = vec3(0.94, 1.08, 0.86);
            vec3 landTint = mix(sandTint, sageTint, smoothstep(0.38, 0.62, hCenter));
            texCol = mix(texCol, texCol * landTint, isLand);
            float hX = fbm(sampleP + vec3(0.03, 0.0, 0.0));
            float hY = fbm(sampleP + vec3(0.0, 0.03, 0.0));

            vec3 bumpOffset = vec3(hCenter - hX, hCenter - hY, 0.0) * mix(0.35, 2.2, isLand);
            vec3 perturbedNormal = normalize(vNormalWorld + bumpOffset);

            float diff = dot(perturbedNormal, uLightDir) * 0.5 + 0.5;
            float shading = mix(0.38, 1.04, smoothstep(0.08, 0.95, diff));

            float contourLines = sin(hCenter * 38.0) * 0.5 + 0.5;
            float topoDetail = mix(1.0, 0.90 + 0.14 * smoothstep(0.75, 0.95, contourLines), isLand);

            vec3 halfVec = normalize(uLightDir + vViewDir);
            float spec = pow(max(dot(perturbedNormal, halfVec), 0.0), 22.0) * (1.0 - isLand) * 0.18;

            float viewDot = abs(vNormalView.z);
            float rimOutline = smoothstep(0.0, 0.25, viewDot);
            float innerAtmos = smoothstep(0.45, 0.12, viewDot) * 0.14;

            vec3 col = texCol * shading * topoDetail + vec3(spec) - vec3(innerAtmos);
            col = mix(vec3(0.06), col, rimOutline);

            // Alpha marks ocean pixels for the graphite post-pass (0 = ocean)
            float oceanFlag = (1.0 - isLand) * rimOutline;
            gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0 - oceanFlag);
        }
      `,
    });

    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const earthMesh = new THREE.Mesh(earthGeo, globeShaderMat);
    globeGroup.add(earthMesh);

    const cloudShaderMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0.0 },
        uLightDir: { value: new THREE.Vector3(0.65, 0.72, 0.82).normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vPos;
        varying vec3 vNormalWorld;
        varying vec3 vNormalView;
        void main() {
            vPos = normalize(position);
            vNormalWorld = normalize(mat3(modelMatrix) * normal);
            vNormalView = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uLightDir;
        varying vec3 vPos;
        varying vec3 vNormalWorld;
        varying vec3 vNormalView;

        float hash3(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise3(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
                mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x),
                    mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
                mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
                    mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
                f.z
            );
        }

        float fbmClouds(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
                v += a * noise3(p);
                p = p * 2.1 + vec3(4.2, -3.1, 8.5);
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec3 p = vec3(vPos.x * 3.8 + uTime * 0.015, vPos.y * 7.2, vPos.z * 3.8 - uTime * 0.012);
            float swirl = fbmClouds(p * 1.4);
            float c = fbmClouds(p + vec3(swirl * 1.3));

            float cloudMask = smoothstep(0.56, 0.76, c);
            float clearMiddleEast = 1.0 - smoothstep(0.2, 0.65, vPos.y) * 0.55;
            cloudMask *= clearMiddleEast;

            float diff = dot(vNormalWorld, uLightDir) * 0.5 + 0.5;
            float edgeFade = smoothstep(0.05, 0.35, abs(vNormalView.z));

            float alpha = cloudMask * edgeFade * 0.42;
            vec3 cloudCol = mix(vec3(0.42), vec3(0.98), diff);

            gl_FragColor = vec4(cloudCol, alpha);
        }
      `,
    });

    const cloudGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudShaderMat);
    globeGroup.add(cloudMesh);

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
      const hairlineArcGeo = new THREE.TubeGeometry(
        bodyCurve,
        48,
        0.022,
        6,
        false
      );
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

    const TEHRAN = { lat: 35.7, lon: 51.4 };
    const BANDAR_ABBAS = { lat: 27.2, lon: 56.3 };

    const pointToPointRoutes = [
      { from: { lat: 31.2, lon: 121.5 }, to: TEHRAN, h: 0.3 },
      { from: { lat: 22.5, lon: 114.1 }, to: BANDAR_ABBAS, h: 0.28 },
      { from: { lat: 25.2, lon: 55.3 }, to: BANDAR_ABBAS, h: 0.16 },
      { from: { lat: 41.0, lon: 29.0 }, to: TEHRAN, h: 0.2 },
      { from: { lat: 53.5, lon: 10.0 }, to: TEHRAN, h: 0.26 },
    ];

    pointToPointRoutes.forEach((r) =>
      addHairlinePointToPointArrow(r.from, r.to, r.h)
    );

    globeGroup.rotation.set(0.28, -2.05, -0.06);

    /* ============================================================
       SECTION 3 — REALISTIC ANATOMICAL CHARACTERS & PARCEL HANDOVER
       ============================================================ */
    const deliverySceneGroup = new THREE.Group();
    deliverySceneGroup.position.set(0, -4.8, 0);
    deliverySceneGroup.scale.setScalar(0.001);
    scene.add(deliverySceneGroup);

    // پالت متریال‌های کالیبره‌شده برای ایجاد سایه‌روشن، خطوط یقه، چروک لباس و انگشتان در شیدر مدادی
    const inkBlackMat = new THREE.MeshStandardMaterial({
      color: 0x141417,
      roughness: 0.65,
    });
    const suitDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1f2748,
      roughness: 0.55,
    });
    const charcoalMat = new THREE.MeshStandardMaterial({
      color: 0x4a4034,
      roughness: 0.55,
    });
    const jacketMidMat = new THREE.MeshStandardMaterial({
      color: 0x4b5670,
      roughness: 0.5,
    });
    const vestSlateMat = new THREE.MeshStandardMaterial({
      color: 0x857057,
      roughness: 0.48,
    });
    const trouserMidMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.52,
    });
    const skinSketchMat = new THREE.MeshStandardMaterial({
      color: 0xf0d5bf,
      roughness: 0.58,
    });
    const shirtLightMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.45,
    });

    interface ArticulatedCharacter {
      root: THREE.Group;
      upperBody: THREE.Group;
      headGroup: THREE.Group;
      armL: THREE.Group;
      foreArmL: THREE.Group;
      handL: THREE.Group;
      armR: THREE.Group;
      foreArmR: THREE.Group;
      handR: THREE.Group;
    }

    function buildDeliveryCharacters() {
      // ۱. سکوی معماری با خطوط تراز مهندسی
      const floorBase = new THREE.Mesh(
        new THREE.CylinderGeometry(3.65, 3.8, 0.08, 64),
        shirtLightMat
      );
      floorBase.position.y = -0.04;
      deliverySceneGroup.add(floorBase);

      const floorOuterRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.65, 0.024, 10, 96),
        inkBlackMat
      );
      floorOuterRing.rotation.x = Math.PI / 2;
      deliverySceneGroup.add(floorOuterRing);

      const floorInnerRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.65, 0.014, 8, 72),
        jacketMidMat
      );
      floorInnerRing.rotation.x = Math.PI / 2;
      floorInnerRing.position.y = 0.005;
      deliverySceneGroup.add(floorInnerRing);

      // تابع ساخت دست کامل با کف دست، شست و ۴ انگشت مفصل‌دار
      function createArticulatedHand(dirX: number, side: number) {
        const handGroup = new THREE.Group();

        // مچ دست
        const wrist = new THREE.Mesh(
          new THREE.CylinderGeometry(0.068, 0.075, 0.1, 12),
          skinSketchMat
        );
        wrist.rotation.z = -dirX * (Math.PI / 2);
        handGroup.add(wrist);

        // کف دست (کمی زاویه‌دار به سمت داخل برای گرفتن جعبه)
        const palm = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.14, 0.065),
          skinSketchMat
        );
        palm.position.set(dirX * 0.1, 0.01, -side * 0.015);
        palm.rotation.y = side * dirX * 0.28;
        palm.rotation.x = side * 0.15;
        handGroup.add(palm);

        // انگشت شست (رو به بالا برای مهار دیواره جعبه)
        const thumbBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.028, 0.1, 8),
          skinSketchMat
        );
        thumbBase.position.set(dirX * 0.12, 0.085, -side * 0.035);
        thumbBase.rotation.z = -dirX * 0.75;
        thumbBase.rotation.x = -side * 0.25;
        handGroup.add(thumbBase);

        const thumbTip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.023, 0.07, 8),
          skinSketchMat
        );
        thumbTip.position.set(dirX * 0.165, 0.125, -side * 0.045);
        thumbTip.rotation.z = -dirX * 1.1;
        handGroup.add(thumbTip);

        // ۴ انگشت دست که زیر و کنار جعبه خم شده‌اند
        for (let f = 0; f < 4; f++) {
          const yOff = 0.042 - f * 0.032;
          const lenFactor = f === 1 ? 1.08 : f === 3 ? 0.85 : 0.98;

          // بند اول انگشت
          const knuckle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.019, 0.022, 0.085 * lenFactor, 8),
            skinSketchMat
          );
          knuckle.position.set(dirX * 0.21, yOff, -side * 0.032);
          knuckle.rotation.z = -dirX * (Math.PI / 2);
          knuckle.rotation.y = side * dirX * 0.48;
          handGroup.add(knuckle);

          // بند دوم (خمیده به سمت جعبه)
          const fingerTip = new THREE.Mesh(
            new THREE.CylinderGeometry(0.016, 0.019, 0.07 * lenFactor, 8),
            skinSketchMat
          );
          fingerTip.position.set(dirX * 0.265, yOff + 0.012, -side * 0.068);
          fingerTip.rotation.z = -dirX * 1.25;
          fingerTip.rotation.y = side * dirX * 0.95;
          handGroup.add(fingerTip);
        }

        return handGroup;
      }

      // تابع ساخت کاراکتر انسان با تناسبات آناتومیک ۸ سر و جزئیات لباس
      function createHumanCharacter(isCourier: boolean): ArticulatedCharacter {
        const root = new THREE.Group();
        const dirX = isCourier ? 1 : -1;

        const mainCoatMat = isCourier ? charcoalMat : suitDarkMat;
        const secondaryMat = isCourier ? vestSlateMat : jacketMidMat;
        const pantsMat = isCourier ? suitDarkMat : trouserMidMat;

        /* ----------------------------------------------------------
           ۱. پایین‌تنه: لگن، کمربند، ران، زانو، ساق پا و کفش‌های واقعی
           ---------------------------------------------------------- */
        const pelvis = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.25, 0.3, 20),
          pantsMat
        );
        pelvis.scale.set(0.82, 1.0, 1.18);
        pelvis.position.y = 1.62;
        root.add(pelvis);

        // کمربند و سگک برای ایجاد خط تفکیک واضح کمر در شیدر
        const belt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.286, 0.286, 0.075, 20),
          inkBlackMat
        );
        belt.scale.set(0.83, 1.0, 1.19);
        belt.position.y = 1.75;
        root.add(belt);

        const buckle = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.09, 0.12),
          shirtLightMat
        );
        buckle.position.set(dirX * 0.23, 1.75, 0);
        root.add(buckle);

        // پاها با حالت ایستادن طبیعی (یک پا کمی جلوتر برای انتقال وزن واقعی)
        for (const side of [-1, 1]) {
          const isLeadLeg = (isCourier && side === 1) || (!isCourier && side === -1);
          const strideX = isLeadLeg ? dirX * 0.14 : -dirX * 0.09;
          const thighAngle = isLeadLeg ? -dirX * 0.11 : dirX * 0.07;
          const calfAngle = isLeadLeg ? dirX * 0.04 : dirX * 0.12;
          const hipZ = side * 0.175;

          // مفصل ران
          const hipJoint = new THREE.Mesh(
            new THREE.SphereGeometry(0.145, 14, 14),
            pantsMat
          );
          hipJoint.position.set(0, 1.54, hipZ);
          root.add(hipJoint);

          // ران پا
          const thigh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.155, 0.122, 0.74, 16),
            pantsMat
          );
          thigh.scale.set(1.05, 1.0, 0.94);
          thigh.position.set(strideX * 0.45, 1.19, hipZ);
          thigh.rotation.z = thighAngle;
          root.add(thigh);

          // مفصل زانو
          const knee = new THREE.Mesh(
            new THREE.SphereGeometry(0.118, 14, 12),
            pantsMat
          );
          knee.position.set(strideX * 0.85, 0.82, hipZ);
          root.add(knee);

          // ساق پا
          const calf = new THREE.Mesh(
            new THREE.CylinderGeometry(0.118, 0.092, 0.7, 16),
            pantsMat
          );
          calf.position.set(strideX * 0.92, 0.47, hipZ);
          calf.rotation.z = calfAngle;
          root.add(calf);

          // پاچه شلوار (ایجاد خط لبه روی مچ پا)
          const trouserCuff = new THREE.Mesh(
            new THREE.CylinderGeometry(0.102, 0.105, 0.06, 16),
            pantsMat
          );
          trouserCuff.position.set(strideX * 0.95, 0.16, hipZ);
          root.add(trouserCuff);

          // کفش آناتومیک (پاشنه، بدنه، پنجه گرد و زیره)
          const shoeGroup = new THREE.Group();
          shoeGroup.position.set(strideX * 0.96, 0, hipZ);
          shoeGroup.rotation.y = -side * dirX * 0.08;

          const sole = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.035, 0.175),
            inkBlackMat
          );
          sole.position.set(dirX * 0.07, 0.018, 0);
          shoeGroup.add(sole);

          const heel = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.11, 0.165),
            suitDarkMat
          );
          heel.position.set(-dirX * 0.06, 0.075, 0);
          shoeGroup.add(heel);

          const vamp = new THREE.Mesh(
            new THREE.CylinderGeometry(0.075, 0.095, 0.24, 14),
            isCourier ? charcoalMat : inkBlackMat
          );
          vamp.rotation.z = -dirX * 1.35;
          vamp.position.set(dirX * 0.06, 0.085, 0);
          shoeGroup.add(vamp);

          const toeCap = new THREE.Mesh(
            new THREE.SphereGeometry(0.082, 14, 12),
            inkBlackMat
          );
          toeCap.scale.set(1.35, 0.68, 1.0);
          toeCap.position.set(dirX * 0.19, 0.058, 0);
          shoeGroup.add(toeCap);

          root.add(shoeGroup);
        }

        /* ----------------------------------------------------------
           ۲. بالاتنه مفصل‌دار (قفسه سینه، یقه، جلیقه/کت، کراوات/کارت)
           ---------------------------------------------------------- */
        const upperBody = new THREE.Group();
        upperBody.position.set(0, 1.75, 0);
        root.add(upperBody);

        // شکم و کمر
        const abdomen = new THREE.Mesh(
          new THREE.CylinderGeometry(0.31, 0.27, 0.44, 20),
          mainCoatMat
        );
        abdomen.scale.set(0.78, 1.0, 1.15);
        abdomen.position.y = 0.22;
        upperBody.add(abdomen);

        // قفسه سینه و سرشانه پهن‌تر
        const chest = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.31, 0.62, 24),
          mainCoatMat
        );
        chest.scale.set(0.78, 1.0, 1.22);
        chest.position.y = 0.68;
        upperBody.add(chest);

        // پیراهن روشن زیر کت/جلیقه
        const innerShirt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.22, 0.56, 16),
          shirtLightMat
        );
        innerShirt.scale.set(0.84, 1.0, 0.85);
        innerShirt.position.set(dirX * 0.08, 0.72, 0);
        upperBody.add(innerShirt);

        // حلقه یقه پیراهن
        const collarBand = new THREE.Mesh(
          new THREE.CylinderGeometry(0.145, 0.165, 0.12, 16),
          shirtLightMat
        );
        collarBand.position.set(dirX * 0.02, 1.03, 0);
        upperBody.add(collarBand);

        if (isCourier) {
          // جلیقه لجستیک دو لایه روی لباس مامور تحویل
          const vestPanel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.392, 0.325, 0.78, 20),
            secondaryMat
          );
          vestPanel.scale.set(0.8, 1.0, 1.18);
          vestPanel.position.y = 0.56;
          upperBody.add(vestPanel);

          // نوارهای عمودی و افقی جلیقه کار (ایجاد خطوط گرافیکی عالی در شیدر)
          const vestStripeH = new THREE.Mesh(
            new THREE.CylinderGeometry(0.398, 0.385, 0.07, 20),
            shirtLightMat
          );
          vestStripeH.scale.set(0.81, 1.0, 1.19);
          vestStripeH.position.y = 0.38;
          upperBody.add(vestStripeH);

          // جیب سینه و کارت شناسایی مامور
          const idBadge = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.14, 0.1),
            shirtLightMat
          );
          idBadge.position.set(dirX * 0.3, 0.74, 0.16);
          idBadge.rotation.y = 0.25;
          upperBody.add(idBadge);

          const badgeClip = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.035, 0.06),
            inkBlackMat
          );
          badgeClip.position.set(dirX * 0.305, 0.81, 0.16);
          badgeClip.rotation.y = 0.25;
          upperBody.add(badgeClip);
        } else {
          // یقه‌های انگلیسی کت رسمی (Lapels) و کراوات برای مشتری/مدیر
          for (const side of [-1, 1]) {
            const lapel = new THREE.Mesh(
              new THREE.BoxGeometry(0.06, 0.48, 0.11),
              charcoalMat
            );
            lapel.position.set(dirX * 0.27, 0.74, side * 0.11);
            lapel.rotation.x = side * 0.26;
            lapel.rotation.z = dirX * 0.12;
            upperBody.add(lapel);
          }

          // گره و بدنه کراوات
          const tieKnot = new THREE.Mesh(
            new THREE.SphereGeometry(0.042, 10, 10),
            inkBlackMat
          );
          tieKnot.position.set(dirX * 0.26, 0.94, 0);
          upperBody.add(tieKnot);

          const tieBlade = new THREE.Mesh(
            new THREE.BoxGeometry(0.035, 0.42, 0.065),
            inkBlackMat
          );
          tieBlade.position.set(dirX * 0.285, 0.71, 0);
          tieBlade.rotation.z = dirX * 0.08;
          upperBody.add(tieBlade);

          // دستمال جیب کت
          const pocketSquare = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.06, 0.11),
            shirtLightMat
          );
          pocketSquare.position.set(dirX * 0.28, 0.76, -0.19);
          pocketSquare.rotation.y = -0.25;
          upperBody.add(pocketSquare);
        }

        /* ----------------------------------------------------------
           ۳. گردن، سر، فک، بینی، گوش، مو/کلاه و عینک
           ---------------------------------------------------------- */
        const headGroup = new THREE.Group();
        headGroup.position.set(dirX * 0.03, 1.06, 0);
        upperBody.add(headGroup);

        // گردن آناتومیک با زاویه طبیعی رو به جلو
        const neck = new THREE.Mesh(
          new THREE.CylinderGeometry(0.115, 0.135, 0.22, 16),
          skinSketchMat
        );
        neck.position.set(0, 0.08, 0);
        neck.rotation.z = -dirX * 0.08;
        headGroup.add(neck);

        // جمجمه
        const cranium = new THREE.Mesh(
          new THREE.SphereGeometry(0.26, 24, 20),
          skinSketchMat
        );
        cranium.scale.set(1.02, 1.08, 0.92);
        cranium.position.set(dirX * 0.02, 0.38, 0);
        headGroup.add(cranium);

        // فک و چانه زاویه‌دار برای ایجاد سایه طبیعی زیر صورت
        const jaw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.21, 0.135, 0.22, 16),
          skinSketchMat
        );
        jaw.scale.set(1.08, 1.0, 0.88);
        jaw.position.set(dirX * 0.055, 0.26, 0);
        jaw.rotation.z = -dirX * 0.12;
        headGroup.add(jaw);

        // تیغه بینی
        const nose = new THREE.Mesh(
          new THREE.ConeGeometry(0.042, 0.13, 8),
          skinSketchMat
        );
        nose.position.set(dirX * 0.275, 0.35, 0);
        nose.rotation.z = -dirX * 1.25;
        headGroup.add(nose);

        // برجستگی ابروها (ایجاد خط چشم در شیدر مدادی)
        for (const side of [-1, 1]) {
          const brow = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.022, 0.065),
            charcoalMat
          );
          brow.position.set(dirX * 0.245, 0.425, side * 0.075);
          brow.rotation.y = side * dirX * 0.22;
          headGroup.add(brow);

          // گوش‌ها
          const ear = new THREE.Mesh(
            new THREE.SphereGeometry(0.052, 10, 10),
            skinSketchMat
          );
          ear.scale.set(0.55, 1.15, 0.42);
          ear.position.set(-dirX * 0.02, 0.35, side * 0.235);
          headGroup.add(ear);
        }

        if (isCourier) {
          // کلاه کپ لجستیک با کاسه، نوار دور سر و نقاب خمیده
          const capCrown = new THREE.Mesh(
            new THREE.SphereGeometry(
              0.272,
              20,
              16,
              0,
              Math.PI * 2,
              0,
              Math.PI * 0.56
            ),
            inkBlackMat
          );
          capCrown.scale.set(1.06, 0.96, 0.95);
          capCrown.position.set(dirX * 0.015, 0.41, 0);
          capCrown.rotation.z = -dirX * 0.06;
          headGroup.add(capCrown);

          const capBand = new THREE.Mesh(
            new THREE.CylinderGeometry(0.274, 0.274, 0.055, 24),
            suitDarkMat
          );
          capBand.scale.set(1.06, 1.0, 0.95);
          capBand.position.set(dirX * 0.015, 0.43, 0);
          capBand.rotation.z = -dirX * 0.06;
          headGroup.add(capBand);

          const capVisor = new THREE.Mesh(
            new THREE.CylinderGeometry(
              0.27,
              0.27,
              0.032,
              20,
              1,
              false,
              -Math.PI * 0.38,
              Math.PI * 0.76
            ),
            inkBlackMat
          );
          capVisor.scale.set(1.35, 1.0, 0.92);
          capVisor.position.set(dirX * 0.14, 0.415, 0);
          capVisor.rotation.y = Math.PI / 2;
          capVisor.rotation.z = -dirX * 0.18;
          headGroup.add(capVisor);
        } else {
          // مدل موی کلاسیک و پرحجم برای مشتری + عینک فریم‌دار
          const hairTop = new THREE.Mesh(
            new THREE.SphereGeometry(
              0.275,
              20,
              16,
              0,
              Math.PI * 2,
              0,
              Math.PI * 0.58
            ),
            inkBlackMat
          );
          hairTop.scale.set(1.08, 1.02, 0.96);
          hairTop.position.set(-dirX * 0.01, 0.41, 0);
          hairTop.rotation.z = dirX * 0.16;
          headGroup.add(hairTop);

          const hairFrontSweep = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 14, 12),
            inkBlackMat
          );
          hairFrontSweep.scale.set(1.1, 0.65, 1.45);
          hairFrontSweep.position.set(dirX * 0.16, 0.53, 0.02);
          hairFrontSweep.rotation.z = -dirX * 0.25;
          headGroup.add(hairFrontSweep);

          const hairBack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.18, 0.24, 16),
            inkBlackMat
          );
          hairBack.scale.set(0.85, 1.0, 0.94);
          hairBack.position.set(-dirX * 0.09, 0.34, 0);
          headGroup.add(hairBack);

          // عینک طبی برای جزئیات واقع‌گرایانه صورت
          for (const side of [-1, 1]) {
            const glassFrame = new THREE.Mesh(
              new THREE.TorusGeometry(0.048, 0.009, 8, 16),
              inkBlackMat
            );
            glassFrame.position.set(dirX * 0.255, 0.38, side * 0.075);
            glassFrame.rotation.y = Math.PI / 2;
            headGroup.add(glassFrame);
          }
        }

        /* ----------------------------------------------------------
           ۴. بازوها، آرنج، ساعد، سردست پیراهن و دست‌های مفصل‌دار
           ---------------------------------------------------------- */
        const arms: {
          armL?: THREE.Group;
          foreArmL?: THREE.Group;
          handL?: THREE.Group;
          armR?: THREE.Group;
          foreArmR?: THREE.Group;
          handR?: THREE.Group;
        } = {};

        for (const side of [-1, 1]) {
          // مفصل سرشانه
          const shoulderGroup = new THREE.Group();
          shoulderGroup.position.set(0, 0.92, side * 0.42);
          upperBody.add(shoulderGroup);

          const deltoid = new THREE.Mesh(
            new THREE.SphereGeometry(0.135, 16, 14),
            mainCoatMat
          );
          deltoid.scale.set(1.05, 1.1, 0.95);
          shoulderGroup.add(deltoid);

          // بازو
          const upperArmMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.118, 0.098, 0.56, 16),
            mainCoatMat
          );
          upperArmMesh.position.set(0, -0.26, 0);
          shoulderGroup.add(upperArmMesh);

          // مفصل آرنج
          const elbowJoint = new THREE.Mesh(
            new THREE.SphereGeometry(0.096, 14, 12),
            mainCoatMat
          );
          elbowJoint.position.set(0, -0.54, 0);
          shoulderGroup.add(elbowJoint);

          // گروه ساعد (متصل به آرنج برای چرخش طبیعی)
          const foreArmGroup = new THREE.Group();
          foreArmGroup.position.set(0, -0.54, 0);
          shoulderGroup.add(foreArmGroup);

          const foreArmMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.096, 0.078, 0.52, 16),
            mainCoatMat
          );
          foreArmMesh.position.set(dirX * 0.24, 0, -side * 0.04);
          foreArmMesh.rotation.z = -dirX * (Math.PI / 2);
          foreArmMesh.rotation.y = side * dirX * 0.16;
          foreArmGroup.add(foreArmMesh);

          // سرآستین سفید پیراهن بیرون‌زده از آستین کت
          const shirtCuff = new THREE.Mesh(
            new THREE.CylinderGeometry(0.081, 0.081, 0.055, 16),
            shirtLightMat
          );
          shirtCuff.position.set(dirX * 0.5, 0, -side * 0.082);
          shirtCuff.rotation.z = -dirX * (Math.PI / 2);
          shirtCuff.rotation.y = side * dirX * 0.16;
          foreArmGroup.add(shirtCuff);

          // دست و انگشتان
          const handGroup = createArticulatedHand(dirX, side);
          handGroup.position.set(dirX * 0.54, 0, -side * 0.09);
          foreArmGroup.add(handGroup);

          if (side === -1) {
            arms.armL = shoulderGroup;
            arms.foreArmL = foreArmGroup;
            arms.handL = handGroup;
          } else {
            arms.armR = shoulderGroup;
            arms.foreArmR = foreArmGroup;
            arms.handR = handGroup;
          }
        }

        return {
          root,
          upperBody,
          headGroup,
          armL: arms.armL!,
          foreArmL: arms.foreArmL!,
          handL: arms.handL!,
          armR: arms.armR!,
          foreArmR: arms.foreArmR!,
          handR: arms.handR!,
        };
      }

      const courier = createHumanCharacter(true);
      courier.root.position.set(-1.18, 0, 0);
      deliverySceneGroup.add(courier.root);

      const client = createHumanCharacter(false);
      client.root.position.set(1.18, 0, 0);
      deliverySceneGroup.add(client.root);

      /* ----------------------------------------------------------
         ۵. جعبه صنعتی/تجاری با درز درپوش، نوار چسب، لیبل بارکد و تسمه
         ---------------------------------------------------------- */
      const boxC = document.createElement("canvas");
      boxC.width = 512;
      boxC.height = 512;
      const bCtx = boxC.getContext("2d")!;

      // بافت مقوایی روشن با کادرهای استاندارد حمل‌ونقل
      bCtx.fillStyle = "#e2cfae";
      bCtx.fillRect(0, 0, 512, 512);
      bCtx.strokeStyle = "#18181b";
      bCtx.lineWidth = 10;
      bCtx.strokeRect(10, 10, 492, 492);

      // برچسب بارنامه و بارکد
      bCtx.fillStyle = "#fafafa";
      bCtx.fillRect(48, 64, 220, 150);
      bCtx.strokeStyle = "#18181b";
      bCtx.lineWidth = 5;
      bCtx.strokeRect(48, 64, 220, 150);

      // خطوط بارکد روی لیبل
      bCtx.fillStyle = "#09090b";
      for (let bx = 66; bx < 248; bx += 11) {
        const bw = (bx % 3 === 0) ? 6 : 3;
        bCtx.fillRect(bx, 84, bw, 68);
      }
      bCtx.fillRect(66, 168, 140, 12);
      bCtx.fillRect(66, 188, 95, 10);

      // آیکون‌های حمل‌ونقل (فلش رو به بالا در گوشه پایین)
      bCtx.strokeStyle = "#27272a";
      bCtx.lineWidth = 6;
      bCtx.strokeRect(360, 340, 104, 110);
      bCtx.beginPath();
      bCtx.moveTo(392, 425);
      bCtx.lineTo(392, 365);
      bCtx.moveTo(378, 382);
      bCtx.lineTo(392, 362);
      bCtx.lineTo(406, 382);
      bCtx.moveTo(432, 425);
      bCtx.lineTo(432, 365);
      bCtx.moveTo(418, 382);
      bCtx.lineTo(432, 362);
      bCtx.lineTo(446, 382);
      bCtx.stroke();

      const parcelGroup = new THREE.Group();
      const boxTex = new THREE.CanvasTexture(boxC);

      const parcelBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.62, 0.72),
        new THREE.MeshStandardMaterial({
          map: boxTex,
          roughness: 0.52,
        })
      );
      parcelGroup.add(parcelBox);

      // نوار چسب وسط درپوش کارتن
      const topTape = new THREE.Mesh(
        new THREE.BoxGeometry(0.875, 0.08, 0.14),
        jacketMidMat
      );
      topTape.position.y = 0.28;
      parcelGroup.add(topTape);

      // دو تسمه پلاستیکی بسته‌بندی دور کارتن برای خطوط سه‌بعدی واقعی
      for (const strapX of [-0.24, 0.24]) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.032, 0.635, 0.735),
          inkBlackMat
        );
        strap.position.x = strapX;
        parcelGroup.add(strap);
      }

      parcelGroup.position.set(-0.18, 2.15, 0);
      deliverySceneGroup.add(parcelGroup);

      return { courier, client, parcelGroup, boxTex };
    }

    const actors = buildDeliveryCharacters();

    /* ============================================================
       SECTION 4 — GSAP TIMELINE & SCROLLTRIGGER (FLUID HANDOVER)
       ============================================================ */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * 2.8, 2800)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // ۱. چرخش آرام و نمایش اولیه کره زمین و خطوط ارتباطی
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

      // ۲. بزرگ‌نمایی پیوسته و ورود تدریجی و عمیق به ایران
      .to(
        globeGroup.rotation,
        {
          x: 0.6,
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

      // ۳. عبور نرم کره زمین و ظهور صحنه تحویل نهایی کالا با حرکت مفاصل
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
        { y: -0.35 },
        { y: 0.14, ease: "power1.out", duration: 3.2 },
        7.0
      )

      // گام برداشتن و نزدیک شدن دو کاراکتر به نقطه تحویل
      .fromTo(
        actors.courier.root.position,
        { x: -1.48 },
        { x: -1.04, ease: "power2.out", duration: 2.8 },
        7.1
      )
      .fromTo(
        actors.client.root.position,
        { x: 1.48 },
        { x: 1.04, ease: "power2.out", duration: 2.8 },
        7.1
      )

      // خم شدن طبیعی کمر مامور به جلو هنگام تقدیم بسته و صاف شدن ملایم پس از تحویل
      .fromTo(
        actors.courier.upperBody.rotation,
        { z: -0.02 },
        { z: -0.11, ease: "power1.inOut", duration: 1.5 },
        7.1
      )
      .to(
        actors.courier.upperBody.rotation,
        { z: -0.05, ease: "power1.out", duration: 1.5 },
        8.6
      )

      // خم شدن محترمانه مشتری به جلو برای دریافت بسته و سپس به آغوش کشیدن وزن جعبه
      .fromTo(
        actors.client.upperBody.rotation,
        { z: 0.02 },
        { z: 0.1, ease: "power1.inOut", duration: 1.5 },
        7.1
      )
      .to(
        actors.client.upperBody.rotation,
        { z: 0.04, ease: "power1.out", duration: 1.5 },
        8.6
      )

      // حرکت بازوها و ساعدهای مامور (دراز کردن دست‌ها به سمت مشتری)
      .fromTo(
        [actors.courier.armL.rotation, actors.courier.armR.rotation],
        { z: 0.36 },
        { z: 0.62, ease: "power2.inOut", duration: 2.6 },
        7.2
      )
      .fromTo(
        [actors.courier.foreArmL.rotation, actors.courier.foreArmR.rotation],
        { z: 0.18 },
        { z: -0.08, ease: "power2.inOut", duration: 2.6 },
        7.2
      )

      // بالا آمدن دست‌ها و ساعدهای مشتری برای گرفتن زیر و کنار جعبه
      .fromTo(
        [actors.client.armL.rotation, actors.client.armR.rotation],
        { z: -0.22 },
        { z: -0.58, ease: "power2.out", duration: 2.4 },
        7.2
      )
      .fromTo(
        [actors.client.foreArmL.rotation, actors.client.foreArmR.rotation],
        { z: 0.35 },
        { z: 0.05, ease: "power2.out", duration: 2.4 },
        7.2
      )

      // انتقال نرم جعبه از دست مامور به دستان مشتری با یک قوس طبیعی
      .fromTo(
        actors.parcelGroup.position,
        { x: -0.36, y: 2.1 },
        { x: 0.08, y: 2.18, ease: "power2.inOut", duration: 2.8 },
        7.3
      )
      .fromTo(
        actors.parcelGroup.rotation,
        { z: -0.06, y: -0.08 },
        { z: 0.03, y: 0.05, ease: "power1.inOut", duration: 2.8 },
        7.3
      )

      // تکان ظریف و محترمانه سر (Head Nod) بین مامور و مشتری در لحظه تحویل
      .fromTo(
        actors.courier.headGroup.rotation,
        { z: 0.0 },
        { z: -0.1, ease: "power1.inOut", duration: 1.4, yoyo: true, repeat: 1 },
        7.8
      )
      .fromTo(
        actors.client.headGroup.rotation,
        { z: 0.0 },
        { z: 0.12, ease: "power1.inOut", duration: 1.4 },
        7.9
      )

      // ۴. زمان استراحت در پایان انیمیشن
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
      globeShaderMat.uniforms.uTime.value = elapsed;
      cloudShaderMat.uniforms.uTime.value = elapsed;

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
      earthGeo.dispose();
      cloudGeo.dispose();
      proceduralGlobeTex.dispose();
      actors.boxTex.dispose();
      globeShaderMat.dispose();
      cloudShaderMat.dispose();
      graphiteMat.dispose();
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
        <div className="max-w-xl pointer-events-auto space-y-4 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgba(15,21,48,0.03)] dark:shadow-[0_8px_30px_rgba(15,21,48,0.4)] border border-zinc-100/80 dark:border-zinc-800/80">
        

          {/* Main Title matching Services & Workflow sections */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
            از هر نقطه‌ای در جهان تا دستان شما
          </h2>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            اتصال مستقیم به قطب‌های تجاری دنیا، حمل‌ونقل بین‌المللی و ترخیص
            سریع گمرکی تا تحویل نهایی کالا در مقصد شما.
          </p>

          {/* Value Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
              <Globe2
                className="w-3.5 h-3.5 text-zinc-700 dark:text-amber-400"
                strokeWidth={1.75}
              />
              <span>پوشش ترانزیت هوایی و دریایی</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
              <ShieldCheck
                className="w-3.5 h-3.5 text-zinc-700 dark:text-emerald-400"
                strokeWidth={1.75}
              />
              <span>ترخیص مستقیم و سریع گمرک</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
              <PackageCheck
                className="w-3.5 h-3.5 text-zinc-700 dark:text-blue-400"
                strokeWidth={1.75}
              />
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