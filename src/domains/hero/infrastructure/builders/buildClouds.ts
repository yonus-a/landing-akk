import * as THREE from "three";

/**
 * Generates an organic, volumetric cloud texture designed specifically
 * for the Graphite Pencil Sketch effect.
 *
 * It features:
 *  - Multiple varied organic cumulus puffs (lobes)
 *  - Bright top highlights (paper white)
 *  - Delicate underside graphite shading for depth & volume
 *  - Soft perimeter contour lines that the Sobel edge filter catches
 *  - Hand-drawn subtle pencil hatch strokes on the cloud shadows
 */
export function generateGraphiteCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 512);

  // Varied cloud lobes for an organic, billowy cumulus structure
  const lobes = [
    { x: 256, y: 280, r: 138, a: 0.88, shadowY: 34 },
    { x: 168, y: 270, r: 104, a: 0.82, shadowY: 28 },
    { x: 346, y: 264, r: 114, a: 0.82, shadowY: 30 },
    { x: 256, y: 204, r: 108, a: 0.80, shadowY: 22 },
    { x: 194, y: 224, r: 84,  a: 0.76, shadowY: 18 },
    { x: 322, y: 214, r: 90,  a: 0.76, shadowY: 20 },
    { x: 128, y: 294, r: 76,  a: 0.68, shadowY: 20 },
    { x: 386, y: 290, r: 80,  a: 0.68, shadowY: 22 },
  ];

  // 1. Soft volumetric cloud body with bright top highlight & shaded underside
  lobes.forEach((l) => {
    // Upper highlight
    const gTop = ctx.createRadialGradient(
      l.x,
      l.y - l.r * 0.32,
      l.r * 0.08,
      l.x,
      l.y,
      l.r
    );
    gTop.addColorStop(0, `rgba(255, 255, 255, ${l.a})`);
    gTop.addColorStop(0.55, `rgba(240, 242, 246, ${l.a * 0.75})`);
    gTop.addColorStop(0.85, `rgba(215, 220, 228, ${l.a * 0.38})`);
    gTop.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gTop;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
    ctx.fill();

    // Underside shading (graphite shadow for dimensional realism)
    const gBottom = ctx.createRadialGradient(
      l.x,
      l.y + l.shadowY,
      l.r * 0.08,
      l.x,
      l.y + l.shadowY * 0.6,
      l.r * 0.82
    );
    gBottom.addColorStop(0, "rgba(105, 110, 120, 0.45)");
    gBottom.addColorStop(0.5, "rgba(155, 160, 172, 0.24)");
    gBottom.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gBottom;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Delicate graphite contour strokes along the billowy lobe crests
  ctx.strokeStyle = "rgba(70, 75, 85, 0.26)";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  lobes.forEach((l) => {
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r - 2, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3. Fine pencil cross-hatching in underside shadow pockets
  ctx.strokeStyle = "rgba(65, 70, 80, 0.16)";
  ctx.lineWidth = 1.0;
  for (let y = 235; y < 380; y += 7) {
    ctx.beginPath();
    for (let x = 110; x < 410; x += 18) {
      const inShadow = lobes.some((l) => {
        const dx = x - l.x;
        const dy = y - (l.y + 12);
        return dx * dx + dy * dy < l.r * l.r * 0.68;
      });
      if (inShadow) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y - 5);
      }
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(c);
  texture.generateMipmaps = true;
  return texture;
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
  const cloudTexture = generateGraphiteCloudTexture();
  const random = createSeededRandom(42);

  for (let i = 0; i < 150; i++) {
    const cMat = new THREE.SpriteMaterial({
      map: cloudTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.62 + random() * 0.32,
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
