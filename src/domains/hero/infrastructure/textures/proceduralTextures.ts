import * as THREE from "three";

export function createGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function createCorrugatedBumpTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  for (let x = 0; x < 256; x += 8) {
    ctx.fillStyle = x % 16 === 0 ? "#ffffff" : "#334155";
    ctx.fillRect(x, 0, 6, 64);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(x + 6, 0, 2, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 1);
  return t;
}

export function createHeroContainerTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#c2410c";
  ctx.fillRect(0, 0, 1024, 256);

  for (let x = 32; x < 992; x += 24) {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(x, 18, 10, 220);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(x + 10, 18, 6, 220);
  }

  ctx.fillStyle = "#9a3412";
  ctx.fillRect(0, 0, 1024, 18);
  ctx.fillRect(0, 238, 1024, 18);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText("OCEAN LINE", 150, 145);

  ctx.font = "bold 22px monospace";
  ctx.fillText("MSCU  948210  5", 740, 65);
  ctx.fillText("45G1", 740, 95);
  ctx.font = "15px monospace";
  ctx.fillText("MAX GROSS  32,500 KG", 740, 130);
  ctx.fillText("TARE        3,780 KG", 740, 150);
  ctx.fillText("NET        28,720 KG", 740, 170);

  ctx.fillStyle = "#facc15";
  ctx.fillRect(48, 40, 42, 65);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("2.9m", 52, 65);
  ctx.fillText("9'6\"", 52, 88);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createAsphaltTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 12000; i++) {
    const v = 22 + Math.floor(Math.random() * 26);
    ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 50);
  return tex;
}

export function createGrilleMeshTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#070a10";
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "#263040";
  ctx.lineWidth = 2;
  for (let y = 0; y < 128; y += 8) {
    for (let x = 0; x < 128; x += 12) {
      const ox = y % 16 === 0 ? 0 : 6;
      ctx.strokeRect(x + ox, y, 8, 6);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

