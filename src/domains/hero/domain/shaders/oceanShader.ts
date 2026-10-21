import * as THREE from "three";
import { SUN_DIRECTION } from "../constants";

export function createOceanMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uSunDirection: { value: SUN_DIRECTION.clone() },
      uSunColor: { value: new THREE.Color(0xfff3c4) },
      uDeepColor: { value: new THREE.Color(0x041e42) },
      uShallowColor: { value: new THREE.Color(0x0c6e9e) },
      uSkyColor: { value: new THREE.Color(0xa9d3ef) },
      uHorizonColor: { value: new THREE.Color(0xb8d6e8) },
      uCameraPos: { value: new THREE.Vector3() },
      uWaveAmp: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uWaveAmp;
      uniform vec3  uCameraPos;

      varying vec3  vWorldPos;
      varying vec3  vNormal;
      varying float vCrest;
      varying float vDist;

      vec3 gerstner(
          vec2 dir, float wavelength, float steepness,
          vec2 pos, inout vec3 tang, inout vec3 binorm, float t
      ) {
          float k = 6.28318530718 / wavelength;
          float c = sqrt(9.8 / k);
          vec2  d = normalize(dir);
          float f = k * (dot(d, pos) - c * t);
          float a = steepness / k;

          tang.x   += -d.x * d.x * steepness * sin(f);
          tang.y   +=  d.x * steepness * cos(f);
          tang.z   += -d.x * d.y * steepness * sin(f);

          binorm.x += -d.x * d.y * steepness * sin(f);
          binorm.y +=  d.y * steepness * cos(f);
          binorm.z += -d.y * d.y * steepness * sin(f);

          return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
      }

      void main() {
          vec3 pos = position;
          vec3 tangent  = vec3(1.0, 0.0, 0.0);
          vec3 binormal = vec3(0.0, 0.0, 1.0);

          vec3 disp = vec3(0.0);
          disp += gerstner(vec2( 1.0,  0.25), 900.0, 0.085, pos.xz, tangent, binormal, uTime);
          disp += gerstner(vec2(-0.45, 1.0),  480.0, 0.055, pos.xz, tangent, binormal, uTime);
          disp += gerstner(vec2( 0.75,-0.7),  240.0, 0.030, pos.xz, tangent, binormal, uTime);
          disp += gerstner(vec2( 0.2,  0.95), 120.0, 0.015, pos.xz, tangent, binormal, uTime);

          disp *= uWaveAmp;
          pos += disp;

          vNormal = normalize(cross(binormal, tangent));
          vCrest  = clamp((disp.y - 7.0) / 9.0, 0.0, 1.0);

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;
          vDist = length(worldPos.xyz - uCameraPos);

          gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3  uSunDirection;
      uniform vec3  uSunColor;
      uniform vec3  uDeepColor;
      uniform vec3  uShallowColor;
      uniform vec3  uSkyColor;
      uniform vec3  uHorizonColor;
      uniform vec3  uCameraPos;
      uniform float uTime;

      varying vec3  vWorldPos;
      varying vec3  vNormal;
      varying float vCrest;
      varying float vDist;

      float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
          vec3 viewDir = normalize(uCameraPos - vWorldPos);
          vec3 n = normalize(vNormal);

          float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 4.0);
          fresnel = mix(0.04, 1.0, fresnel);

          float facing = clamp(dot(n, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
          vec3 waterColor = mix(uDeepColor, uShallowColor, pow(facing, 2.0));

          vec3 halfDir = normalize(uSunDirection + viewDir);
          float specSharp = pow(max(dot(n, halfDir), 0.0), 220.0);

          float specBroad = pow(max(dot(n, halfDir), 0.0), 24.0);
          float sparkleNoise = hash(floor(vWorldPos.xz * 0.5 + uTime * 0.3));
          float sparkle = specBroad * step(0.72, sparkleNoise) * 0.7;

          vec3 color = waterColor * (1.0 - fresnel);
          color += uSkyColor * fresnel;
          color += uSunColor * specSharp * 2.8;
          color += uSunColor * sparkle * 1.5;

          float foam = smoothstep(0.55, 1.0, vCrest);
          color = mix(color, vec3(0.96, 0.98, 1.0), foam * 0.65);

          float fogFactor = clamp(1.0 - exp(-vDist * 0.00045), 0.0, 0.92);
          color = mix(color, uHorizonColor, fogFactor);

          // Alpha marks ocean pixels for the graphite post-pass (0 = ocean, fading out with distance fog)
          gl_FragColor = vec4(color, fogFactor);
      }
    `,
  });
}

