import * as THREE from "three";

/**
 * 2D Value Noise generator with cubic interpolation
 */
function createNoise2D(seed = 1337) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;

  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (let i = 255; i > 0; i--) {
    const r = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[r];
    p[r] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t: number) => t * t * (3 - 2 * t);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);

  return function (x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y] / 255;
    const ab = perm[perm[X] + Y + 1] / 255;
    const ba = perm[perm[X + 1] + Y] / 255;
    const bb = perm[perm[X + 1] + Y + 1] / 255;

    return lerp(lerp(aa, ba, u), lerp(ab, bb, u), v);
  };
}

/**
 * Multi-octave Fractional Brownian Motion (fBm)
 */
function fbm(
  noise: (x: number, y: number) => number,
  x: number,
  y: number,
  octaves = 5
): number {
  let val = 0;
  let amp = 0.52;
  let freq = 1.0;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise(x * freq, y * freq) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2.08;
  }
  return val / max;
}

/**
 * Generates an organic, billowy cumulus cloud texture using procedural fractal noise.
 * Eliminates artificial circular outlines and creates authentic graphite sketchbook clouds:
 *  - Flat, shaded cloud condensation base (lifting condensation level)
 *  - Billowy, turbulent multi-lobed cauliflower cumulus crests
 *  - Soft wispy vapor tendrils that feather naturally into pure white
 *  - Delicate graphite pencil shading & subtle horizontal cross-hatching
 */
export function generateOrganicCloudTexture(variant = 0): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const noise1 = createNoise2D(1234 + variant * 777);
  const noise2 = createNoise2D(5678 + variant * 999);

  // Varied aspect ratio and flatness based on variant
  const flatness = variant === 1 ? 2.4 : variant === 2 ? 1.8 : 2.1;
  const yCenter = variant === 1 ? 148 : 138;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Normalized coordinates from cloud center (-1 to 1)
      const nx = (x - 256) / 225;
      const ny = (y - yCenter) / 95;

      // Realistic cumulus profile: flat condensation base on bottom, billowy puffs on top
      const baseDistance =
        nx * nx + (ny > 0 ? Math.pow(ny * flatness, 2) : Math.pow(ny * 1.15, 2));

      // Domain warping for natural swirling vapor turbulence
      const warpX = fbm(noise2, x * 0.007, y * 0.007, 3) * 0.35;
      const warpY = fbm(noise2, (x + 80) * 0.007, (y + 80) * 0.007, 3) * 0.35;

      const turb = fbm(
        noise1,
        (x + warpX * 90) * 0.012,
        (y + warpY * 90) * 0.014,
        5
      );

      // Cloud density thresholding
      const density = 1.0 - baseDistance + (turb - 0.48) * 1.1;

      if (density <= 0.08) {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 0;
        continue;
      }

      // Smooth feathered alpha at wispy edges (dissolves naturally without circular rings)
      const alpha = Math.min(Math.max((density - 0.08) / 0.52, 0), 0.94);

      // Graphite Tonal Modeling:
      // - Top/sun-facing peaks: pure bright white
      // - Underside base & deep folds: warm pencil graphite lead gray
      const sunHeight = Math.min(Math.max((-ny + 0.4) * 0.7 + turb * 0.3, 0), 1);
      const graphiteTone = Math.floor(135 + sunHeight * 120);

      data[idx] = graphiteTone;
      data[idx + 1] = graphiteTone + 2;
      data[idx + 2] = graphiteTone + 5;
      data[idx + 3] = Math.floor(alpha * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Add subtle architectural graphite pencil hatching in the cloud shadow base
  ctx.strokeStyle = "rgba(75, 80, 92, 0.14)";
  ctx.lineWidth = 0.9;
  ctx.lineCap = "round";

  const hatchStart = yCenter - 10;
  const hatchEnd = yCenter + 65;

  for (let hy = hatchStart; hy < hatchEnd; hy += 6) {
    ctx.beginPath();
    for (let hx = 90; hx < 420; hx += 16) {
      // Check pixel alpha at this location
      const pIdx = (Math.floor(hy) * width + Math.floor(hx)) * 4;
      if (data[pIdx + 3] > 70 && data[pIdx] < 210) {
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + 8, hy - 4);
      }
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(c);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
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

  // Create 3 organic cloud variants (Cumulus, Stratus-deck, Wispy-veil)
  const cloudTextures = [
    generateOrganicCloudTexture(0),
    generateOrganicCloudTexture(1),
    generateOrganicCloudTexture(2),
  ];

  const random = createSeededRandom(42);

  // 120 strategically layered clouds forming a natural atmospheric deck
  for (let i = 0; i < 120; i++) {
    const variantIdx = i % 3;
    const tex = cloudTextures[variantIdx];

    const cMat = new THREE.SpriteMaterial({
      map: tex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.55 + random() * 0.35,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(cMat);

    // Spread along flight corridor
    const spread = i < 45 ? 1000 : 4400;
    const x = (random() - 0.5) * spread;
    const y = 420 + (random() - 0.5) * 160;
    const z = -200 + (random() - 0.5) * spread;

    sprite.position.set(x, y, z);

    // Varied horizontal aspect ratio (wide horizontal clouds instead of circular balls)
    const baseScale = 260 + random() * 380;
    const aspect = 1.9 + random() * 0.8; // 1.9x to 2.7x wider than tall!

    // Random horizontal flip to break repetition
    const flipX = random() > 0.5 ? 1 : -1;
    sprite.scale.set(baseScale * aspect * flipX, baseScale, 1);

    sprite.matrixAutoUpdate = false;
    sprite.updateMatrix();
    cloudsContainer.add(sprite);
  }

  return cloudsContainer;
}
