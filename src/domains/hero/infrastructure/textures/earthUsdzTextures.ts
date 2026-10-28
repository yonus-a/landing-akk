import * as THREE from "three";
import { unzipSync } from "three/addons/libs/fflate.module.js";

export interface EarthMaps {
  albedo: THREE.Texture;
  /** Roughness map: land ≈ 1, water darker; doubles as the land/ocean mask. */
  mask: THREE.Texture;
  lights: THREE.Texture;
}

/** Texture name fragments inside the USDZ archive. */
const MAP_SUFFIXES: Record<keyof EarthMaps, string> = {
  albedo: "_baseColor",
  mask: "_metallicRoughness_rough",
  lights: "_emissive",
};

/** 1×1 stand-ins so the globe renders (as a plain ocean world) before or without the USDZ. */
export function createPlaceholderEarthMaps(): EarthMaps {
  const pixel = (r: number, g: number, b: number) => {
    const tex = new THREE.DataTexture(new Uint8Array([r, g, b, 255]), 1, 1);
    tex.needsUpdate = true;
    return tex;
  };
  return { albedo: pixel(0, 0, 0), mask: pixel(140, 140, 140), lights: pixel(0, 0, 0) };
}

async function decodeImage(bytes: Uint8Array, width: number): Promise<ImageBitmap> {
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/jpeg" });
  const raw = { colorSpaceConversion: "none", premultiplyAlpha: "none" } as const;
  try {
    return await createImageBitmap(blob, {
      ...raw,
      resizeWidth: width,
      resizeHeight: width / 2,
      resizeQuality: "high",
    });
  } catch {
    return createImageBitmap(blob, raw);
  }
}

/**
 * Pulls the day map, roughness (land mask) and city-light maps out of the Earth USDZ.
 * The maps are stored south-up (glTF convention), which lines up with SphereGeometry UVs
 * as long as the bitmaps are uploaded without flipping.
 */
export async function loadEarthUsdzMaps(
  url: string,
  options: { maxWidth: number; anisotropy: number; signal: AbortSignal }
): Promise<EarthMaps> {
  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  const archive = unzipSync(new Uint8Array(await response.arrayBuffer()), {
    filter: (file) => /\.(jpe?g|png)$/i.test(file.name),
  });

  const entries = Object.entries(archive);
  const keys = Object.keys(MAP_SUFFIXES) as (keyof EarthMaps)[];
  const bitmaps = await Promise.all(
    keys.map((key) => {
      const entry = entries.find(([name]) => name.includes(MAP_SUFFIXES[key]));
      if (!entry) throw new Error(`${url} has no ${MAP_SUFFIXES[key]} map`);
      return decodeImage(entry[1], options.maxWidth);
    })
  );

  if (options.signal.aborted) {
    bitmaps.forEach((bitmap) => bitmap.close());
    throw new DOMException("Aborted", "AbortError");
  }

  const maps = {} as EarthMaps;
  keys.forEach((key, i) => {
    const tex = new THREE.Texture(bitmaps[i]);
    tex.flipY = false;
    tex.colorSpace = THREE.NoColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = options.anisotropy;
    tex.needsUpdate = true;
    maps[key] = tex;
  });
  return maps;
}

export function disposeEarthMaps(maps: EarthMaps): void {
  for (const tex of Object.values(maps)) {
    const image = tex.image as ImageBitmap | undefined;
    tex.dispose();
    if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) image.close();
  }
}
