import * as THREE from "three";

export function generateSoftCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const lobes = [
    { x: 128, y: 132, r: 92, a: 0.55 },
    { x: 90, y: 120, r: 68, a: 0.45 },
    { x: 166, y: 122, r: 72, a: 0.45 },
    { x: 128, y: 94, r: 64, a: 0.4 },
    { x: 112, y: 150, r: 62, a: 0.35 },
  ];
  lobes.forEach((l) => {
    const g = ctx.createRadialGradient(
      l.x,
      l.y - 10,
      l.r * 0.08,
      l.x,
      l.y,
      l.r
    );
    g.addColorStop(0, `rgba(255, 255, 255, ${l.a})`);
    g.addColorStop(0.55, `rgba(241, 245, 249, ${l.a * 0.65})`);
    g.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
    ctx.fill();
  });
  return new THREE.CanvasTexture(c);
}

// Simple seeded PRNG for consistent, deterministic cloud distribution
function createSeededRandom(seed = 12345) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function buildClouds(): THREE.Group {
  const cloudsContainer = new THREE.Group();
  const cloudTexture = generateSoftCloudTexture();
  const random = createSeededRandom(42);

  for (let i = 0; i < 150; i++) {
    const cMat = new THREE.SpriteMaterial({
      map: cloudTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.44 + random() * 0.35,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(cMat);
    const spread = i < 55 ? 900 : 4200;
    sprite.position.set(
      (random() - 0.5) * spread,
      430 + (random() - 0.5) * 180,
      -150 + (random() - 0.5) * spread
    );
    const s = 210 + random() * 320;
    sprite.scale.set(s * 1.7, s, 1);
    sprite.matrixAutoUpdate = false;
    sprite.updateMatrix();
    cloudsContainer.add(sprite);
  }

  return cloudsContainer;
}

