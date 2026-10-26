import * as THREE from "three";

/**
 * Globe surface & cloud-layer shaders for the "global reach" act.
 *
 * The surface shader marks ocean pixels through the alpha channel (0 = ocean) so the
 * globe graphite post-pass can ink them in brand colors.
 */

const GLOBE_LIGHT_DIR = new THREE.Vector3(0.65, 0.72, 0.82).normalize();

const noiseChunk = /* glsl */ `
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
`;

export const globeSurfaceVertexShader = /* glsl */ `
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
`;

export const globeSurfaceFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uLightDir;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vNormalWorld;
  varying vec3 vPosObj;
  varying vec3 vViewDir;

  ${noiseChunk}

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
`;

export const globeCloudVertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormalWorld;
  varying vec3 vNormalView;
  void main() {
    vPos = normalize(position);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const globeCloudFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uLightDir;
  varying vec3 vPos;
  varying vec3 vNormalWorld;
  varying vec3 vNormalView;

  ${noiseChunk}

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
`;

export function createGlobeSurfaceMaterial(map: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uLightDir: { value: GLOBE_LIGHT_DIR.clone() },
      uTime: { value: 0.0 },
    },
    vertexShader: globeSurfaceVertexShader,
    fragmentShader: globeSurfaceFragmentShader,
  });
}

export function createGlobeCloudMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0.0 },
      uLightDir: { value: GLOBE_LIGHT_DIR.clone() },
    },
    vertexShader: globeCloudVertexShader,
    fragmentShader: globeCloudFragmentShader,
  });
}
