/**
 * Graphite Pencil Sketch Post-Processing Shader
 *
 * Implements a high-fidelity graphite drawing pipeline:
 *  1. Hand-drawn boil jitter (~10fps discrete displacement)
 *  2. Sobel edge detection with lead grain for pencil outlines
 *  3. Dynamic luminance-based 3-layer cross-hatching (45°, -45°, and deep shadow horizontal)
 *  4. Graphite powder smudge shading in mid-tones & shadows
 *  5. Authentic sketchbook paper texture (paper fiber noise)
 *  6. Seamless perimeter edge feathering to pure white (#ffffff) or brand navy (#1e295a)
 *  7. Dual-Engine Light/Dark Mode:
 *     - Light Mode: Classic graphite pencil sketch on pure white archival paper
 *     - Dark Mode: Technical architectural blueprint with luminous platinum chalk lines,
 *       soft titanium-slate cross-hatching and muted slate fills for bright surfaces on brand-navy paper
 *  8. Muted watercolor wash of the scene's real colors beneath the pencil work
 *  9. Ocean pixels (flagged via render-target alpha) are inked in the brand colors
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
    // Lift the deepest tones so dark surfaces read as shaded detail, not solid fill
    luma = mix(0.14, 1.0, luma);

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
    float smudge = (1.0 - luma) * (0.22 + 0.20 * leadGrain);

    // ── 4A. LIGHT MODE SKETCHBOOK COMPOSITION ──────────────────
    // Sample un-jittered center pixel from tDiffuse to protect branding text & specular highlights (#ffffff)
    vec4 centerSample = texture2D(tDiffuse, vUv);
    vec3 centerCol = centerSample.rgb;
    float centerLuma = dot(centerCol, vec3(0.299, 0.587, 0.114));
    float whiteMask = smoothstep(0.65, 0.88, centerLuma);
    float lightOutline = pencilOutline * (1.0 - whiteMask);

    // The ocean shader writes low alpha; only those pixels get brand-colored ink
    float oceanMask = 1.0 - centerSample.a;

    float totalLightGraphite = clamp(
      smudge + hatch1 + hatch2 + hatch3 + lightOutline * 0.92,
      0.0, 0.86
    );
    totalLightGraphite *= (1.0 - whiteMask);

    vec3 brandNavy   = vec3(0.118, 0.161, 0.353);
    vec3 brandAccent = vec3(0.165, 0.353, 0.878);

    // Watercolor wash: the scene's real colors, partially desaturated, with shadows leaning toward brand navy
    vec3 muted = mix(vec3(centerLuma), centerCol, 0.65);
    muted = mix(muted, brandNavy, (1.0 - centerLuma) * 0.18);

    vec3 lightPaper = vec3(1.0, 1.0, 1.0);
    vec3 washPaper  = mix(lightPaper, muted, 0.45);
    vec3 lightInk   = mix(vec3(0.12, 0.115, 0.11), muted * 0.6, 0.35);
    vec3 lightGraphite = mix(washPaper, lightInk, totalLightGraphite);

    // Ocean: brand accent #2a5ae0 hatching and brand navy #1e295a contours over a real-water wash
    float oceanShade = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.96) * (1.0 - whiteMask);
    vec3 oceanWash = mix(brandAccent, muted, 0.35);
    vec3 lightOcean = mix(lightPaper, oceanWash, 0.18 + oceanShade * 0.7);
    lightOcean = mix(lightOcean, brandNavy, clamp(lightOutline * 0.92 + oceanShade * 0.35, 0.0, 0.96));

    vec3 lightResult = mix(lightGraphite, lightOcean, oceanMask);
    lightResult = mix(lightResult, mix(lightPaper, muted, 0.25), whiteMask);

    // ── 4B. DARK MODE ARCHITECTURAL BLUEPRINT COMPOSITION ──────
    // Base paper: brand navy #1e295a (matches zinc-950 page background)
    vec3 darkPaper  = brandNavy;
    // Soft titanium-slate pencil for hatching & shading (preserves ALL details without blinding glare)
    vec3 shadeChalk = vec3(0.22, 0.25, 0.30);
    // Brilliant platinum chalk for crisp edge contours (ship railings, container ridges, truck cabin, wheels)
    vec3 lineChalk  = vec3(0.90, 0.92, 0.96);

    shadeChalk = mix(shadeChalk, muted, 0.45);
    shadeChalk = mix(shadeChalk, brandAccent, oceanMask);
    lineChalk  = mix(lineChalk, vec3(0.80, 0.87, 1.0), oceanMask);

    float shadeFactor = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.85);

    // Bright surfaces (white cabs, containers, sunlit roads, pale facades) become a muted slate
    // fill that keeps their hue, instead of pure white glaring against the navy paper
    vec3 darkBright = mix(darkPaper, centerCol, 0.42);
    // Faint sparkle reserved for true specular hits (rims, wave crests)
    float whiteHighlight = smoothstep(0.93, 1.0, centerLuma) * 0.08;

    vec3 darkResult = mix(darkPaper, muted, 0.30 * (1.0 - oceanMask));
    darkResult = mix(darkResult, brandAccent, oceanMask * 0.12);
    darkResult = mix(darkResult, shadeChalk, shadeFactor);
    darkResult = mix(darkResult, darkBright, whiteMask);
    darkResult += vec3(whiteHighlight);
    darkResult = mix(darkResult, lineChalk, pencilOutline * mix(1.0, 0.75, whiteMask));

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
