/**
 * Globe & Handover Graphite Post-Processing Shader
 *
 * Variant of the hero graphite pipeline tuned for the globe / parcel-handover act:
 *  - Pure white (#ffffff) backdrop pixels are kept as clean paper (no feathering)
 *  - Ocean pixels (flagged via render-target alpha by the globe shader) get brand-colored ink
 *  - Lighter hand-boil and finer hatching so the small anatomical characters stay legible
 */

export const globeGraphiteVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const globeGraphiteFragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2  uResolution;
  uniform float uTime;
  uniform float uDpr;
  uniform float uDark;
  /* 0 → full sketch, 1 → blank paper. Drives the act-to-act dissolve inside the render pass. */
  uniform float uPaperFade;
  varying vec2  vUv;

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

  float getLuma(vec2 uv) {
    vec3 col = texture2D(tDiffuse, clamp(uv, 0.001, 0.999)).rgb;
    return dot(col, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec2 texel = 1.0 / uResolution;

    float sketchFrame = floor(uTime * 10.0);
    vec2 handBoil = vec2(
      noise(vUv * 30.0 + sketchFrame * 1.7) - 0.5,
      noise(vUv * 30.0 - sketchFrame * 2.3) - 0.5
    ) * texel * 0.85;

    vec2 uv = vUv + handBoil;

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

    // The globe shader writes low alpha on ocean pixels; only those get brand-colored ink
    vec4 centerSample = texture2D(tDiffuse, vUv);
    float oceanMask = 1.0 - centerSample.a;

    vec3 paper = mix(vec3(1.0, 1.0, 1.0), vec3(0.118, 0.161, 0.353), uDark);

    if (mc > 0.990 && edgeGrad < 0.015 && oceanMask < 0.5) {
      gl_FragColor = vec4(paper, 1.0);
      return;
    }

    float leadGrain = noise(vUv * uResolution * 0.5);
    float pencilOutline = smoothstep(0.035, 0.26, edgeGrad * 1.3 * (0.82 + 0.38 * leadGrain));

    float luma = clamp(mc, 0.0, 1.0);
    vec2 p = vUv * uResolution / max(uDpr, 1.0);
    float strokeWobble = noise(p * 0.08 + sketchFrame * 0.2) * 2.1;

    float hatch1 = 0.0;
    if (luma < 0.88) {
      float i1 = smoothstep(0.88, 0.38, luma);
      float pat1 = sin((p.x + p.y) * 1.2 + strokeWobble);
      hatch1 = smoothstep(0.38, 0.86, pat1) * i1 * 0.42;
    }

    float hatch2 = 0.0;
    if (luma < 0.58) {
      float i2 = smoothstep(0.58, 0.18, luma);
      float pat2 = sin((p.x - p.y) * 1.3 - strokeWobble);
      hatch2 = smoothstep(0.34, 0.85, pat2) * i2 * 0.48;
    }

    float hatch3 = 0.0;
    if (luma < 0.32) {
      float i3 = smoothstep(0.32, 0.0, luma);
      float pat3 = sin(p.y * 1.6 + strokeWobble);
      hatch3 = smoothstep(0.24, 0.80, pat3) * i3 * 0.52;
    }

    float smudge = (1.0 - luma) * (0.24 + 0.22 * leadGrain);

    vec3 brandNavy   = vec3(0.118, 0.161, 0.353);
    vec3 brandAccent = vec3(0.165, 0.353, 0.878);

    // Watercolor wash: the scene's real colors, partially desaturated, with shadows leaning toward brand navy
    float centerLuma = dot(centerSample.rgb, vec3(0.299, 0.587, 0.114));
    vec3 muted = mix(vec3(centerLuma), centerSample.rgb, 0.65);
    muted = mix(muted, brandNavy, (1.0 - centerLuma) * 0.18);

    // Light Mode: graphite sketchbook over a soft color wash
    float totalLightGraphite = clamp(smudge + hatch1 + hatch2 + hatch3 + pencilOutline * 0.96, 0.0, 0.96);
    vec3 washPaper = mix(vec3(1.0, 1.0, 1.0), muted, 0.45);
    vec3 lightInk  = mix(vec3(0.10, 0.10, 0.11), muted * 0.6, 0.35);
    vec3 lightGraphite = mix(washPaper, lightInk, totalLightGraphite);

    // Ocean: brand accent #2a5ae0 hatching and brand navy #1e295a contours over a real-water wash
    float oceanShade = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.96);
    vec3 oceanWash = mix(brandAccent, muted, 0.35);
    vec3 lightOcean = mix(vec3(1.0, 1.0, 1.0), oceanWash, 0.18 + oceanShade * 0.7);
    lightOcean = mix(lightOcean, brandNavy, clamp(pencilOutline * 0.96 + oceanShade * 0.35, 0.0, 0.96));

    vec3 lightResult = mix(lightGraphite, lightOcean, oceanMask);

    // Dark Mode: Technical blueprint on brand navy with color-tinted titanium shading and platinum lines
    vec3 darkPaper  = brandNavy;
    vec3 shadeChalk = mix(vec3(0.24, 0.27, 0.33), muted, 0.45);
    shadeChalk = mix(shadeChalk, brandAccent, oceanMask);
    vec3 lineChalk  = mix(vec3(0.90, 0.92, 0.96), vec3(0.80, 0.87, 1.0), oceanMask);

    float shadeFactor = clamp(smudge + hatch1 + hatch2 + hatch3, 0.0, 0.85);

    float backdropFade = smoothstep(0.995, 0.96, centerLuma);
    vec3 darkResult = mix(darkPaper, muted, 0.30 * (1.0 - oceanMask) * backdropFade);
    darkResult = mix(darkResult, brandAccent, oceanMask * 0.12);
    darkResult = mix(darkResult, shadeChalk, shadeFactor);
    darkResult = mix(darkResult, lineChalk, pencilOutline);

    vec3 finalColor = mix(lightResult, darkResult, uDark);

    // Act dissolve: the whole drawing lifts off the page (theme-correct, no edge bleed)
    finalColor = mix(finalColor, paper, uPaperFade);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
