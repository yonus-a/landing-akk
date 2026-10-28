import * as THREE from "three";
import { EARTH_LOOK } from "../constants";

/**
 * Photoreal Earth for the opening act.
 *
 * All globe materials output display-referred colour (own ACES tone map + gamma) with
 * premultiplied-style alpha, so the composite pass can lay them straight onto the paper.
 */

const sunDirection = () => new THREE.Vector3(...EARTH_LOOK.sunDirection).normalize();

const commonChunk = /* glsl */ `
  float hash13(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash13(i + vec3(0, 0, 0)), hash13(i + vec3(1, 0, 0)), f.x),
          mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x),
          mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  float fbm3(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + vec3(17.1, 9.7, 3.3);
      a *= 0.5;
    }
    return v;
  }

  float fbm5(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + vec3(17.1, 9.7, 3.3);
      a *= 0.5;
    }
    return v;
  }

  vec3 acesFilm(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  vec3 toDisplay(vec3 linearColor) {
    return pow(acesFilm(linearColor), vec3(1.0 / 2.2));
  }
`;

/** Weather shared by the cloud shell and the surface (for cloud shadows); p is a unit vector in globe space. */
const cloudChunk = /* glsl */ `
  uniform float uTime;
  uniform float uCloudCover;
  uniform float uHubClear;
  uniform vec3 uHubDir;

  float cloudDensity(vec3 p) {
    float hubDist = distance(p, uHubDir);

    float a = uTime * 0.006;
    float ca = cos(a);
    float sa = sin(a);
    p = vec3(ca * p.x - sa * p.z, p.y, sa * p.x + ca * p.z);

    // Squashed in latitude so weather streams along the zonal winds
    vec3 q = vec3(p.x, p.y * 1.7, p.z) * 3.2;
    vec3 warp = vec3(
      fbm3(q + vec3(1.7, 9.2, 3.1)),
      fbm3(q + vec3(8.3, 2.8, 5.6)),
      fbm3(q + vec3(4.1, 6.6, 1.9))
    );
    float n = fbm5(q * 1.35 + (warp - 0.5) * 2.6);

    // Circulation bands: ITCZ at the equator, dry subtropical highs, stormy mid-latitudes
    float lat = p.y;
    float band = 0.40
      + 0.16 * exp(-pow(lat / 0.10, 2.0))
      - 0.20 * exp(-pow((abs(lat) - 0.45) / 0.13, 2.0))
      + 0.22 * exp(-pow((abs(lat) - 0.80) / 0.14, 2.0));
    float cover = clamp(band + uCloudCover, 0.0, 1.0);

    float threshold = 0.62 - 0.30 * cover;
    float d = smoothstep(threshold, threshold + 0.11, n);
    d *= 0.68 + 0.32 * vnoise(q * 9.0 + warp * 3.0);

    // Clear skies over the hub until the dive rolls the weather in
    d *= mix(1.0, smoothstep(0.05, 0.22, hubDist), uHubClear);
    return clamp(d, 0.0, 1.0);
  }
`;

/* ───────────────────────── Surface ───────────────────────── */

const surfaceVertexShader = /* glsl */ `
  uniform vec3 uSunDir;
  varying vec2 vUv;
  varying vec3 vPosObj;
  varying vec3 vPosW;
  varying vec3 vNormalW;
  varying vec3 vSunObj;

  void main() {
    vUv = uv;
    vPosObj = normalize(position);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vSunObj = normalize(transpose(mat3(modelMatrix)) * uSunDir);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const surfaceFragmentShader = /* glsl */ `
  uniform sampler2D uAlbedo;
  uniform sampler2D uMask;
  uniform sampler2D uLights;
  uniform vec3 uSunDir;
  uniform float uSunIntensity;
  uniform float uAlbedoGain;
  uniform float uLightsIntensity;
  uniform float uDetail;
  /* 0 → normal Earth; 1 → terrain lifts into bright cloud fog (no brown ground fill). */
  uniform float uDiveFade;

  varying vec2 vUv;
  varying vec3 vPosObj;
  varying vec3 vPosW;
  varying vec3 vNormalW;
  varying vec3 vSunObj;

  ${commonChunk}
  ${cloudChunk}

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vPosW);
    vec3 L = normalize(uSunDir);
    float NdL = dot(N, L);
    float NdV = max(dot(N, V), 0.0);

    // Roughness map doubles as the land mask (land ≈ 1, water ≈ 0.35–0.9)
    float rough = texture2D(uMask, vUv).r;
    float land = smoothstep(0.90, 0.955, rough);

    vec3 landLin = pow(clamp(texture2D(uAlbedo, vUv).rgb * uAlbedoGain, 0.0, 1.0), vec3(2.2));
    float landLuma = dot(landLin, vec3(0.2126, 0.7152, 0.0722));
    landLin = max(mix(vec3(landLuma), landLin, 1.15), 0.0);
    if (uDetail > 0.0) {
      landLin *= 1.0 + (fbm3(vPosObj * 540.0) - 0.5) * 0.6 * uDetail;
    }

    float shelf = smoothstep(0.55, 0.88, rough) * (1.0 - land);
    vec3 ocean = mix(vec3(0.0035, 0.014, 0.040), vec3(0.006, 0.040, 0.068), shelf * 0.6);
    vec3 albedo = mix(ocean, landLin, land);

    // Cloud shadows: weather sampled a little towards the sun
    float shadow = cloudDensity(normalize(vPosObj + normalize(vSunObj) * 0.012));

    float day = smoothstep(-0.10, 0.25, NdL);
    float diffuse = mix(max(NdL, 0.0), smoothstep(-0.1, 1.0, NdL), 0.25);
    // Cool daylight only — no warm terminator tint that reads as a brownish rim
    vec3 sunColor = vec3(0.98, 0.99, 1.0);
    vec3 col = albedo * sunColor * diffuse * uSunIntensity * (1.0 - shadow * 0.55);
    col += albedo * vec3(0.03, 0.05, 0.09) * day;

    // Sun glint on open water
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float fresnelH = 0.02 + 0.98 * pow(1.0 - max(dot(H, V), 0.0), 5.0);
    float glint = fresnelH * (pow(NdH, 700.0) * 30.0 + pow(NdH, 60.0) * 1.5);
    col += sunColor * glint * max(NdL, 0.0) * (1.0 - land) * (1.0 - shadow * 0.85) * uSunIntensity;

    // City lights on the night side, dimmed under cloud
    vec3 lights = texture2D(uLights, vUv).rgb;
    float night = 1.0 - smoothstep(-0.18, 0.06, NdL);
    col += lights * lights * uLightsIntensity * night * (1.0 - shadow * 0.7);

    // Cool blue limb only (no orange twilight band)
    float fres = pow(1.0 - NdV, 2.5);
    float atmDay = smoothstep(-0.25, 0.4, NdL);
    col = mix(col, vec3(0.05, 0.09, 0.16) * uSunIntensity, 0.10 * atmDay);
    col += vec3(0.28, 0.55, 1.0) * fres * atmDay * 0.85;

    // Dive: wash terrain into bright cloud fog so land never becomes a brown screen fill
    float dive = clamp(uDiveFade, 0.0, 1.0);
    float fogLit = 0.62 + 0.38 * smoothstep(-0.1, 0.55, NdL);
    vec3 cloudFog = vec3(0.94, 0.96, 0.99) * fogLit;
    col = mix(col, cloudFog, dive);

    gl_FragColor = vec4(toDisplay(col), 1.0);
  }
`;

/* ───────────────────────── Clouds ───────────────────────── */

const shellVertexShader = /* glsl */ `
  varying vec3 vPosObj;
  varying vec3 vPosW;
  varying vec3 vNormalW;

  void main() {
    vPosObj = normalize(position);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const cloudFragmentShader = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uSunIntensity;
  /* 0 → wispy shell; 1 → opaque bank the camera flies into before the airplane cut. */
  uniform float uDiveFade;

  varying vec3 vPosObj;
  varying vec3 vPosW;
  varying vec3 vNormalW;

  ${commonChunk}
  ${cloudChunk}

  void main() {
    float dive = clamp(uDiveFade, 0.0, 1.0);
    float d = cloudDensity(vPosObj);
    // Brief veil — thicken a little, but never become a solid white chamber
    d = mix(d, max(d, 0.35 + 0.55 * d), dive);
    if (d < 0.004) discard;

    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vPosW);
    float NdL = dot(N, normalize(uSunDir));
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.0);

    // Cool white daylight — avoid warm sunset tint on the cloud rim
    float lit = smoothstep(-0.15, 0.6, NdL);
    vec3 sunColor = vec3(0.98, 0.99, 1.0);
    vec3 col = vec3(0.92) * sunColor * (0.03 + 0.97 * lit) * uSunIntensity;
    col = mix(col, col * vec3(0.78, 0.86, 1.0), fres * 0.6);
    col = mix(col, vec3(0.97, 0.98, 1.0), dive * 0.35);

    float alpha = clamp(d * 0.94 * (1.0 + fres * 0.3), 0.0, 1.0);
    alpha = mix(alpha, min(alpha + 0.25, 0.78), dive);
    gl_FragColor = vec4(toDisplay(col), alpha);
  }
`;

/* ───────────────────────── Atmosphere halo ───────────────────────── */

const atmosphereVertexShader = /* glsl */ `
  varying vec3 vPosW;
  varying vec3 vCenter;
  varying float vScale;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    vCenter = modelMatrix[3].xyz;
    vScale = length(modelMatrix[0].xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  uniform float uIntensity;

  varying vec3 vPosW;
  varying vec3 vCenter;
  varying float vScale;

  void main() {
    vec3 rd = normalize(vPosW - cameraPosition);
    vec3 closest = cameraPosition + rd * dot(vCenter - cameraPosition, rd);
    float b = length(closest - vCenter);

    float inner = uInnerRadius * vScale;
    float outer = uOuterRadius * vScale;
    float h = clamp((b - inner) / (outer - inner), 0.0, 1.0);
    float glow = exp(-h * 4.5) * (1.0 - h);

    vec3 n = normalize(closest - vCenter);
    float sunDot = dot(n, normalize(uSunDir));
    float sunFacing = smoothstep(-0.45, 0.55, sunDot);

    // Pure cool blue halo — no orange/brown twilight rim
    vec3 col = vec3(0.34, 0.62, 1.0);
    float alpha = glow * (0.12 + 0.88 * sunFacing) * uIntensity;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

/* ───────────────────────── Composite onto paper ───────────────────────── */

export const earthCompositeVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Lays the Earth onto pure white paper. Stars are ink/graphite sparkles on the page
 * (not a dark night-sky pocket), with a few brighter jewels and the odd meteor streak.
 */
export const earthCompositeFragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uDpr;
  uniform float uDark;
  uniform float uReady;
  /* 0 → scene, 1 → blank paper. Same act dissolve as the graphite passes. */
  uniform float uPaperFade;
  /* Globe silhouette on screen: centre in UV, radius in units of screen height. */
  uniform vec2 uGlobeCenter;
  uniform float uGlobeRadius;
  /* Star parallax in CSS pixels, driven by the globe's rotation. */
  uniform vec2 uStarDrift;
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  /** Soft ink tint for marks on white paper (graphite → brand blue). */
  vec3 starTint(float t) {
    if (t < 0.2) return vec3(0.42, 0.48, 0.58);
    if (t > 0.78) return vec3(0.22, 0.42, 0.78);
    return vec3(0.28, 0.34, 0.48);
  }

  /** One star per occupied cell, kept away from the cell border so it never clips. */
  float starLayer(vec2 px, float cell, float density, float size, float seed) {
    vec2 id = floor(px / cell);
    float h = hash12(id + seed);
    if (h > density) return 0.0;
    vec2 d = (fract(px / cell) - (0.18 + 0.64 * hash22(id + seed * 1.7))) * cell;
    float b = pow(hash12(id + seed + 3.1), 2.8);
    float r = size * (0.55 + 0.9 * b);
    float core = exp(-dot(d, d) / (r * r));
    float twinkle = 0.72 + 0.28 * sin(uTime * (0.7 + 3.2 * h) + h * 90.0);
    return core * (0.35 + 1.4 * b) * twinkle;
  }

  vec3 brightStars(vec2 px) {
    float cell = 140.0;
    vec2 id = floor(px / cell);
    float h = hash12(id + 41.0);
    if (h > 0.22) return vec3(0.0);
    vec2 d = (fract(px / cell) - (0.22 + 0.56 * hash22(id + 5.0))) * cell;
    float glow = exp(-dot(d, d) / 2.2) + 0.2 * exp(-length(d) / 5.5);
    float spikes = exp(-abs(d.y) * 1.45) * exp(-abs(d.x) / 12.0)
                 + exp(-abs(d.x) * 1.45) * exp(-abs(d.y) / 12.0);
    float twinkle = 0.78 + 0.22 * sin(uTime * 1.4 + h * 60.0);
    return starTint(hash12(id + 2.3))
         * (glow + spikes * 0.45)
         * twinkle
         * (0.55 + 0.7 * hash12(id + 8.0));
  }

  /** Short meteor streaks sketched across the paper. */
  vec3 meteors(vec2 px) {
    vec3 col = vec3(0.0);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float cycle = 5.6 + fi * 1.8;
      float phase = fract(uTime / cycle + hash12(vec2(fi * 13.1, 2.4)));
      float life = smoothstep(0.0, 0.04, phase) * (1.0 - smoothstep(0.16, 0.28, phase));
      if (life > 0.001) {
        vec2 origin = hash22(vec2(fi * 7.3, floor(uTime / cycle + fi))) * vec2(uResolution.x, uResolution.y) / max(uDpr, 1.0);
        origin = origin * 0.85 + 0.08 * vec2(uResolution.x, uResolution.y) / max(uDpr, 1.0);
        vec2 dir = normalize(vec2(0.82 + 0.2 * hash12(vec2(fi, 1.1)), -0.55 - 0.25 * hash12(vec2(fi, 4.2))));
        float travel = phase * (220.0 + 160.0 * hash12(vec2(fi, 9.0)));
        vec2 head = origin + dir * travel;
        vec2 d = px - head;
        float along = clamp(dot(d, -dir), 0.0, 38.0);
        vec2 closest = d + dir * along;
        float shaft = exp(-dot(closest, closest) / 1.0) * exp(-along * 0.08);
        float tip = exp(-dot(d, d) / 2.4);
        col += vec3(0.25, 0.40, 0.72) * (shaft * 0.8 + tip) * life;
      }
    }
    return col;
  }

  void main() {
    vec4 scene = texture2D(tDiffuse, vUv);
    vec3 paper = mix(vec3(1.0), vec3(0.09, 0.11, 0.16), uDark);

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 q = (vUv - uGlobeCenter) * aspect;
    float dist = length(q) / max(uGlobeRadius, 1e-3);

    // Stars live on the white page around the globe; fall off before the paper edge
    float field = smoothstep(2.65, 1.05, dist) * smoothstep(0.92, 1.08, dist);

    vec2 px = gl_FragCoord.xy / max(uDpr, 1.0) + uStarDrift;
    float dust = starLayer(px, 6.0, 0.12, 0.5, 1.0)
               + starLayer(px + 371.0, 14.0, 0.26, 0.72, 17.0)
               + starLayer(px * 0.997 + 913.0, 32.0, 0.4, 0.95, 31.0)
               + starLayer(px * 1.003 + 204.0, 58.0, 0.5, 1.15, 47.0);

    vec3 ink = starTint(0.45) * dust
             + brightStars(px + 157.0)
             + meteors(px);

    // Subtract ink from white paper (or add light sparkles in dark mode)
    vec3 backdrop = paper;
    backdrop = mix(backdrop, backdrop - ink * 0.85, field * (1.0 - uDark));
    backdrop += ink * field * uDark * 0.9;

    vec3 col = scene.rgb + backdrop * (1.0 - scene.a);
    col = mix(paper, col, uReady);
    col = mix(col, paper, uPaperFade);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ───────────────────────── Factories ───────────────────────── */

function cloudUniforms(hubDirection: THREE.Vector3) {
  return {
    uTime: { value: 0 },
    uCloudCover: { value: EARTH_LOOK.cloudCover },
    uHubClear: { value: 1 },
    uHubDir: { value: hubDirection.clone() },
    uDiveFade: { value: 0 },
  };
}

export function createEarthSurfaceMaterial(
  maps: { albedo: THREE.Texture; mask: THREE.Texture; lights: THREE.Texture },
  hubDirection: THREE.Vector3
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...cloudUniforms(hubDirection),
      uAlbedo: { value: maps.albedo },
      uMask: { value: maps.mask },
      uLights: { value: maps.lights },
      uSunDir: { value: sunDirection() },
      uSunIntensity: { value: EARTH_LOOK.sunIntensity },
      uAlbedoGain: { value: EARTH_LOOK.albedoGain },
      uLightsIntensity: { value: EARTH_LOOK.cityLightsIntensity },
      uDetail: { value: 0 },
    },
    vertexShader: surfaceVertexShader,
    fragmentShader: surfaceFragmentShader,
  });
}

export function createEarthCloudMaterial(hubDirection: THREE.Vector3): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      ...cloudUniforms(hubDirection),
      uSunDir: { value: sunDirection() },
      uSunIntensity: { value: EARTH_LOOK.sunIntensity },
    },
    vertexShader: shellVertexShader,
    fragmentShader: cloudFragmentShader,
  });
}

export function createEarthAtmosphereMaterial(innerRadius: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: {
      uSunDir: { value: sunDirection() },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: innerRadius * EARTH_LOOK.atmosphereRadius },
      uIntensity: { value: 1 },
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
  });
}
