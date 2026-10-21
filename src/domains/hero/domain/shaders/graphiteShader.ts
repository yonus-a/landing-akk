/**
 * Graphite Pencil Sketch Post-Processing Shader
 *
 * Implements a high-fidelity graphite drawing pipeline:
 *  1. Hand-drawn boil jitter (~10fps discrete displacement)
 *  2. Sobel edge detection with lead grain for pencil outlines
 *  3. Dynamic luminance-based 3-layer cross-hatching (45°, -45°, and deep shadow horizontal)
 *  4. Graphite powder smudge shading in mid-tones & shadows
 *  5. Authentic sketchbook paper texture (paper fiber noise)
 *  6. Seamless perimeter edge feathering to pure white (#ffffff) or obsidian (#09090b)
 *  7. Dual-Engine Light/Dark Mode:
 *     - Light Mode: Classic graphite pencil sketch on pure white archival paper
 *     - Dark Mode: Technical architectural blueprint with luminous platinum chalk lines
 *       and soft titanium-slate cross-hatching on deep obsidian paper
 */

export const graphiteVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const graphiteFragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2      uResolution;
  uniform float     uTime;
  uniform float     uEdgeWeight;
  uniform float     uShadeDensity;
  uniform float     uDark;
  varying vec2      vUv;

  /* ── Procedural Hash & Noise ──────────────────────────────── */

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /* ── Luminance ────────────────────────────────────────────── */

  float getLuma(vec2 uv) {
    vec3 col = texture2D(tDiffuse, clamp(uv, 0.001, 0.999)).rgb;
    return dot(col, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec2 texel = 1.0 / uResolution;

    // 1. Subtle hand-drawn jitter (~10 fps) to give a live sketched feel
    float sketchFrame = floor(uTime * 10.0);
    vec2 handBoil = vec2(
      noise(vUv * 22.0 + sketchFrame * 1.7) - 0.5,
      noise(vUv * 22.0 - sketchFrame * 2.3) - 0.5
    ) * texel * 1.15;

    vec2 uv = vUv + handBoil;

    // 2. Sobel 3x3 edge-detection convolution
    float tl = getLuma(uv + texel * vec2(-1.0,  1.0));
    float tm = getLuma(uv + texel * vec2( 0.0,  1.0));
    float tr = getLuma(uv + texel * vec2( 1.0,  1.0));
    float ml = getLuma(uv + texel * vec2(-1.0,  0.0));
    float mc = getLuma(uv);
    float mr = getLuma(uv + texel * vec2( 1.0,  0.0));
    float bl = getLuma(uv + texel * vec2(-1.0, -1.0));
    float bm = getLuma(uv + texel * vec2( 0.0, -1.0));
    float br = getLuma(uv + texel * vec2( 1.0, -1.0));

    float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
    float gy = -tl - 2.0 * tm - tr + bl + 2.0 * bm + br;
    float edgeGrad = sqrt(gx * gx + gy * gy);

    // Natural graphite grain along contour strokes
    float leadGrain = noise(vUv * uResolution * 0.42);
    float pencilOutline = smoothstep(
      0.08, 0.42,
      edgeGrad * uEdgeWeight * (0.78 + 0.45 * leadGrain)
    );

    // 3. Tonal brightness mapping for shading
    float luma = smoothstep(0.06, 0.94, mc);
    luma = pow(luma, uShadeDensity);

    // Aspect-ratio normalized pixel coords for cross-hatch strokes
    vec2 p = vUv * (uResolution / min(uResolution.x, uResolution.y)) * 480.0;
    float strokeWobble = noise(p * 0.09 + sketchFrame * 0.25) * 2.6;

    // Layer 1 — light pencil hatching at 45°
    float hatch1Pattern = sin((p.x + p.y) * 1.45 + strokeWobble);
    float hatch1 = 0.0;
    if (luma < 0.78) {
      float intensity1 = smoothstep(0.78, 0.30, luma);
      hatch1 = smoothstep(0.35, 0.85, hatch1Pattern) * intensity1 * 0.48;
    }

    // Layer 2 — cross-hatching at -45°
    float hatch2Pattern = sin((p.x - p.y) * 1.55 - strokeWobble);
    float hatch2 = 0.0;
    if (luma < 0.52) {
      float intensity2 = smoothstep(0.52, 0.14, luma);
      hatch2 = smoothstep(0.32, 0.85, hatch2Pattern) * intensity2 * 0.52;
    }

    // Layer 3 — dense near-horizontal hatching for deep shadow regions
    float hatch3Pattern = sin((p.y * 1.85 + p.x * 0.25) + strokeWobble);
    float hatch3 = 0.0;
    if (luma < 0.30) {
      float intensity3 = smoothstep(0.30, 0.0, luma);
      hatch3 = smoothstep(0.20, 0.80, hatch3Pattern) * intensity3 * 0.55;
    }

    // Soft graphite powder smudge
    float smudge = (1.0 - luma) * (0.32 + 0.28 * leadGrain);

    // ── 4A. LIGHT MODE SKETCHBOOK COMPOSITION ──────────────────
    float totalLightGraphite = clamp(
      smudge + hatch1 + hatch2 + hatch3 + pencilOutline * 0.92,
      0.0, 0.96
    );
    vec3 lightPaper = vec3(1.0, 1.0, 1.0);
    vec3 lightInk   = vec3(0.12, 0.115, 0.11);
    vec3 lightResult = mix(lightPaper, lightInk, totalLightGraphite);

    // ── 4B. DARK MODE ARCHITECTURAL BLUEPRINT COMPOSITION ──────
    // Base paper: Deep obsidian matching zinc-950 #09090b
    vec3 darkPaper  = vec3(0.035, 0.035, 0.045);
    // Soft titanium-slate pencil for hatching & shading (preserves ALL details without blinding glare)
    vec3 shadeChalk = vec3(0.22, 0.25, 0.30);
    // Brilliant platinum chalk for crisp edge contours (ship railings, container ridges, truck cabin, wheels)
    vec3 lineChalk  = vec3(0.90, 0.92, 0.96);

    float shadeFactor = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.85);

    // Clean highlight for bright white container, rims, wave crests
    float whiteHighlight = smoothstep(0.85, 0.99, mc) * 0.30;

    vec3 darkResult = mix(darkPaper, shadeChalk, shadeFactor);
    darkResult += vec3(whiteHighlight);
    darkResult = mix(darkResult, lineChalk, pencilOutline);

    // ── 5. SEAMLESS THEME BLEND & PERIMETER FEATHERING ─────────
    vec3 finalSketch = mix(lightResult, darkResult, uDark);

    vec3 edgePaper = mix(lightPaper, darkPaper, uDark);
    float edgeX = smoothstep(0.0, 0.12, vUv.x) * smoothstep(0.0, 0.12, 1.0 - vUv.x);
    float edgeY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(0.0, 0.12, 1.0 - vUv.y);
    float edgeFade = edgeX * edgeY;

    finalSketch = mix(edgePaper, finalSketch, edgeFade);

    gl_FragColor = vec4(finalSketch, 1.0);
  }
`;
