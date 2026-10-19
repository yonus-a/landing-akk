import * as THREE from "three";
import { SUN_DIRECTION } from "../constants";

export function createSkyMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x1a5fb8) },
      middleColor: { value: new THREE.Color(0x60a5fa) },
      bottomColor: { value: new THREE.Color(0xcfe4f3) },
      uSunDir: { value: SUN_DIRECTION.clone() },
      uSunColor: { value: new THREE.Color(0xfff2c4) },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
          vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 middleColor;
      uniform vec3 bottomColor;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      varying vec3 vWorldPosition;
      void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = dir.y;
          vec3 col = mix( bottomColor, middleColor, smoothstep( 0.0, 0.22, h ) );
          col = mix( col, topColor, smoothstep( 0.22, 0.75, h ) );

          float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
          float glow = pow(sunDot, 8.0) * 0.55;
          float core = pow(sunDot, 350.0) * 0.85;
          col += uSunColor * (glow + core);
          gl_FragColor = vec4( col, 1.0 );
      }
    `,
  });
}

