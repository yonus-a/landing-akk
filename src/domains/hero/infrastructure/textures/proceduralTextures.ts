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
  c.width = 2048;
  c.height = 512;
  const ctx = c.getContext("2d")!;

  // 1. Crisp Arctic Pure White Container Base
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 2048, 512);

  // 2. High-Definition Vertical Corrugations (48 Flutes across length)
  // Contrast-engineered for architectural graphite pencil hatching
  for (let x = 40; x < 2008; x += 40) {
    // Deep graphite shadow flute
    ctx.fillStyle = "#8a93a3";
    ctx.fillRect(x, 26, 9, 460);
    // Midtone lead transition
    ctx.fillStyle = "#c4cad5";
    ctx.fillRect(x + 9, 26, 7, 460);
    // Pure white face plate
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(x + 16, 26, 18, 460);
    // Specular highlight crest
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 34, 26, 4, 460);
  }

  // 3. Heavy Dark Structural Steel Perimeter Frame & Corner Rails
  ctx.fillStyle = "#5a6272";
  ctx.fillRect(0, 0, 2048, 28); // Top rail
  ctx.fillRect(0, 484, 2048, 28); // Bottom rail
  ctx.fillRect(0, 0, 42, 512); // Left corner post
  ctx.fillRect(2006, 0, 42, 512); // Right corner post

  // Inner dark pinstripe contour
  ctx.strokeStyle = "#8a93a3";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(40, 26, 1968, 460);

  // 4. ISO Twistlock Corner Castings (All 4 Corners)
  const corners = [
    { x: 4, y: 4 },
    { x: 1996, y: 4 },
    { x: 4, y: 460 },
    { x: 1996, y: 460 },
  ];
  corners.forEach(({ x, y }) => {
    ctx.fillStyle = "#3a4152";
    ctx.fillRect(x, y, 48, 48);
    // Silver contour rim
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, 44, 44);
    // Twistlock oval aperture hole
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(x + 24, y + 24, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. High-Visibility DOT-C2 Reflective Conspicuity Tape (Alternating Red/White along bottom rail)
  for (let rx = 42; rx < 2006; rx += 96) {
    ctx.fillStyle = "#dc2626"; // Red
    ctx.fillRect(rx, 488, 48, 20);
    ctx.fillStyle = "#ffffff"; // White
    ctx.fillRect(rx + 48, 488, 48, 20);
  }

  // 6. Central Corporate Branding Plaque on Pure White Container
  // Sleek, high-contrast Midnight Titanium plaque enabling pure white Persian typography
  ctx.save();
  // Realistic 3D drop shadow anchoring the corporate plaque to the white corrugated wall
  ctx.shadowColor = "rgba(30, 41, 90, 0.25)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Plaque Base Plate in Deep Midnight Charcoal Slate
  const plaqueGrad = ctx.createLinearGradient(304, 66, 304, 346);
  plaqueGrad.addColorStop(0, "#3f63a3");
  plaqueGrad.addColorStop(0.5, "#5079c2");
  plaqueGrad.addColorStop(1, "#3f63a3");
  ctx.fillStyle = plaqueGrad;
  ctx.beginPath();
  ctx.roundRect(304, 66, 1440, 280, 16);
  ctx.fill();
  ctx.restore();

  // Fine Platinum/White Perimeter Bezel
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(304, 66, 1440, 280, 16);
  ctx.stroke();

  // Inner subtle silver pinstripe
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(316, 76, 1416, 260);

  // Precision Industrial Corner Rivets in Pure White
  const plaqueRivets = [
    { x: 326, y: 86 },
    { x: 1722, y: 86 },
    { x: 326, y: 326 },
    { x: 1722, y: 326 },
  ];
  plaqueRivets.forEach(({ x, y }) => {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x - 1.5, y - 1.5, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Main Persian Headline: "جهان‌گستر" in 100% PURE WHITE (#FFFFFF / #FFF)
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 96px 'Estedad', Tahoma, sans-serif";
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff"; // Pure White Font #FFF
  ctx.fillText("جهان‌گستر", 1024, 150);
  ctx.restore();

  // Fine Pure White Micro-Rule under headline
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(700, 198, 648, 3.5);

  // English Subtitle: "JAHAN-GOSTAR" in 100% Pure White (#FFFFFF / #FFF)
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 38px 'Estedad', sans-serif";
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("JAHAN-GOSTAR", 1024, 238);
  ctx.restore();

  // Operational Subtitle in 100% Pure White (#FFFFFF / #FFF)
  ctx.textAlign = "center";
  ctx.font = "bold 20px 'Estedad', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("INTERNATIONAL TRADE • LOGISTICS • TIR CARNET", 1024, 290);

  // 7. Left Side Decals (Yellow Height Hazard & Customs TIR)
  ctx.fillStyle = "#eab308";
  ctx.fillRect(72, 80, 96, 140);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = "900 28px sans-serif";
  ctx.fillText("2.9m", 120, 126);
  ctx.fillText("9'6\"", 120, 168);
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("HIGH CUBE", 120, 196);

  // TIR Carnet Blue Badge
  ctx.fillStyle = "#1e40af";
  ctx.fillRect(72, 260, 96, 60);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 36px sans-serif";
  ctx.fillText("TIR", 120, 302);

  // 8. Right Side Decals (Container Specs & ISO Markings on Pure White)
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(1740, 80, 240, 265);

  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 24px 'Estedad', sans-serif";
  ctx.fillText("AKME  948210  5", 1755, 120);
  ctx.fillStyle = "#d97706";
  ctx.font = "bold 20px 'Estedad', sans-serif";
  ctx.fillText("45G1  HIGH CUBE", 1755, 155);

  ctx.fillStyle = "#334155";
  ctx.font = "16px 'Estedad', sans-serif";
  ctx.fillText("MAX GROSS  32,500 KG", 1755, 195);
  ctx.fillText("TARE        3,840 KG", 1755, 225);
  ctx.fillText("PAYLOAD    28,660 KG", 1755, 255);
  ctx.fillText("CUBE        76.4 CBM", 1755, 285);
  ctx.fillText("CUSTOMS SEAL #0984", 1755, 315);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHeroContainerFrontTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;

  // Shaded white base (oblique angle shadow)
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal corrugations (characteristic of front end of containers)
  for (let y = 30; y < 482; y += 32) {
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(24, y, 464, 8);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(24, y + 8, 464, 8);
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(24, y + 16, 464, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(24, y + 28, 464, 4);
  }

  // Steel perimeter frame
  ctx.fillStyle = "#5a6272";
  ctx.fillRect(0, 0, 512, 26);
  ctx.fillRect(0, 486, 512, 26);
  ctx.fillRect(0, 0, 26, 512);
  ctx.fillRect(486, 0, 26, 512);

  // Vertical center post
  ctx.fillStyle = "#8a93a3";
  ctx.fillRect(248, 24, 16, 464);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHeroContainerRoofTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1024;
  const ctx = c.getContext("2d")!;

  // Bright white roof base
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 1024);

  // Transverse roof corrugation flutes
  for (let y = 20; y < 1004; y += 28) {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(16, y, 480, 6);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(16, y + 6, 480, 8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(16, y + 14, 480, 14);
  }

  // Steel roof coamings
  ctx.fillStyle = "#5a6272";
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillRect(0, 1006, 512, 18);
  ctx.fillRect(0, 0, 18, 1024);
  ctx.fillRect(494, 0, 18, 1024);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createTruckGroundShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;

  ctx.clearRect(0, 0, 512, 256);

  // Soft feathered radial/elliptical ambient occlusion shadow gradient
  const grad = ctx.createRadialGradient(256, 128, 30, 256, 128, 120);
  grad.addColorStop(0, "rgba(30, 41, 90, 0.38)");
  grad.addColorStop(0.35, "rgba(30, 41, 90, 0.24)");
  grad.addColorStop(0.7, "rgba(30, 41, 90, 0.1)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export function createAsphaltTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#80848c";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 12000; i++) {
    const v = 108 + Math.floor(Math.random() * 40);
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
  ctx.fillStyle = "#4a5160";
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "#a3abb8";
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

export function createShipContainerTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;

  // 1. Off-white / light neutral base (so instance colors tint it vibrantly)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 512);

  // 2. High-contrast vertical corrugation flutes (trapezoidal shadow/highlight ribs)
  // 36 rhythmic flutes across the container side
  for (let x = 36; x < 988; x += 26) {
    // Soft shadow flute
    ctx.fillStyle = "#8a93a3";
    ctx.fillRect(x, 24, 7, 464);
    // Midtone transition
    ctx.fillStyle = "#c4cad5";
    ctx.fillRect(x + 7, 24, 5, 464);
    // Face plate
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(x + 12, 24, 11, 464);
    // Specular highlight crest
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 23, 24, 3, 464);
  }

  // 3. Heavy steel perimeter frame (corner posts, top/bottom rails)
  ctx.fillStyle = "#5a6272";
  ctx.fillRect(0, 0, 1024, 24); // Top rail
  ctx.fillRect(0, 488, 1024, 24); // Bottom rail
  ctx.fillRect(0, 0, 32, 512); // Left corner post
  ctx.fillRect(992, 0, 32, 512); // Right corner post

  // Silver inner bevel outline
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.0;
  ctx.strokeRect(30, 22, 964, 468);

  // 4. ISO Corner Castings (all 4 corners) with twistlock aperture holes
  const corners = [
    { x: 4, y: 4 },
    { x: 978, y: 4 },
    { x: 4, y: 468 },
    { x: 978, y: 468 },
  ];
  corners.forEach(({ x, y }) => {
    ctx.fillStyle = "#3a4152";
    ctx.fillRect(x, y, 42, 40);
    // Silver contour rim
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 2, y + 2, 38, 36);
    // Twistlock oval hole
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(x + 21, y + 20, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. High-Visibility DOT-C2 Reflective Conspicuity Tape (Alternating Red/White along bottom rail)
  for (let rx = 36; rx < 988; rx += 64) {
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(rx, 492, 32, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(rx + 32, 492, 32, 16);
  }

  // 6. Stenciled Shipping Line Markings (high-contrast black/white)
  // Branding plaque in upper-center
  ctx.fillStyle = "#2b3550";
  ctx.fillRect(340, 40, 344, 76);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(344, 44, 336, 68);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 36px 'Estedad', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("JAHAN 45G1", 512, 88);

  // Container specifications in upper right
  ctx.fillStyle = "#2b3550";
  ctx.fillRect(720, 40, 250, 150);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(724, 44, 242, 142);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Estedad', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("AKME  948210  5", 736, 75);
  ctx.fillStyle = "#facc15";
  ctx.font = "bold 17px 'Estedad', sans-serif";
  ctx.fillText("45G1  HIGH CUBE", 736, 105);
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px 'Estedad', sans-serif";
  ctx.fillText("MAX GROSS  32,500 KG", 736, 135);
  ctx.fillText("PAYLOAD    28,660 KG", 736, 160);

  // Height warning sticker (yellow patch on left)
  ctx.fillStyle = "#eab308";
  ctx.fillRect(52, 48, 76, 76);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(54, 50, 72, 72);
  ctx.fillStyle = "#000000";
  ctx.font = "900 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("2.9m", 90, 80);
  ctx.fillText("9'6\"", 90, 108);

  // Blue TIR Carnet Badge
  ctx.fillStyle = "#1e40af";
  ctx.fillRect(52, 140, 76, 44);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 24px sans-serif";
  ctx.fillText("TIR", 90, 172);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createShipHullDecalTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext("2d")!;

  // Navy background matching ship hull
  ctx.fillStyle = "#3b5b8f";
  ctx.fillRect(0, 0, 1024, 128);

  // Architectural crisp white company name
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 50px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("JAHAN-GOSTAR", 512, 60);

  // Subtitle
  ctx.font = "bold 16px 'Estedad', sans-serif";
  ctx.fillStyle = "#93c5fd";
  ctx.fillText("GLOBAL LOGISTICS & COMMERCIAL TRADING GROUP", 512, 92);

  // Nautical markings on left: Bulbous bow symbol & draft marks
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(60, 50, 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(40, 50);
  ctx.lineTo(80, 50);
  ctx.moveTo(60, 30);
  ctx.lineTo(60, 70);
  ctx.stroke();

  // Tug push marker
  ctx.fillStyle = "#facc15";
  ctx.fillRect(110, 38, 48, 24);
  ctx.fillStyle = "#000000";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TUG", 134, 54);

  // IMO Number on right
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 18px 'Estedad', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("IMO 9842105", 980, 60);
  ctx.font = "14px 'Estedad', sans-serif";
  ctx.fillText("PORT: BANDAR ABBAS", 980, 84);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createShipWakeTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;

  // Transparent background
  ctx.clearRect(0, 0, 512, 512);

  // Draw churning white foam wake gradient
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(0.35, "rgba(240, 248, 255, 0.75)");
  grad.addColorStop(0.7, "rgba(224, 242, 254, 0.3)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Foam bubbles / turbulence streaks
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const rad = 2 + Math.random() * 6;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Neutral building facade (white-based so the material color tints the wall):
 * floor slabs, framed glazing with mullions, sills and a roof parapet band.
 * One texture tile = 4 storeys; repeat vertically per building height.
 */
export function createBuildingFacadeTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle plaster grain
  for (let i = 0; i < 1800; i++) {
    const shade = 228 + Math.floor(Math.random() * 22);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.5)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const floors = 4;
  const floorH = 512 / floors;
  const cols = 5;
  const bayW = 512 / cols;

  for (let f = 0; f < floors; f++) {
    const y0 = f * floorH;

    // Floor slab band
    ctx.fillStyle = "#d9dbe0";
    ctx.fillRect(0, y0 + floorH - 10, 512, 10);

    for (let b = 0; b < cols; b++) {
      const wx = b * bayW + 16;
      const wy = y0 + 22;
      const ww = bayW - 32;
      const wh = floorH - 52;

      // Window reveal / frame
      ctx.fillStyle = "#c3c9d3";
      ctx.fillRect(wx - 4, wy - 4, ww + 8, wh + 8);

      // Sky-reflecting glass
      const glass = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh);
      glass.addColorStop(0, "#c6d6ea");
      glass.addColorStop(0.55, "#9fb4cf");
      glass.addColorStop(1, "#b5c7de");
      ctx.fillStyle = glass;
      ctx.fillRect(wx, wy, ww, wh);

      // Mullion and transom
      ctx.fillStyle = "#e9ecf1";
      ctx.fillRect(wx + ww / 2 - 2, wy, 4, wh);
      ctx.fillRect(wx, wy + wh * 0.32, ww, 3);

      // Sill
      ctx.fillStyle = "#f4f5f7";
      ctx.fillRect(wx - 7, wy + wh + 4, ww + 14, 5);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}


