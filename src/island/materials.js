// Procedural textures + the shared material kit for the island.
// Textures are near-white detail maps (shingles, planks, bricks, plaster) that
// get tinted by each material's colour, so one texture serves every building.
import * as THREE from "three";

function canvas(w, h = w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}
function toTex(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
const rnd = (() => {
  let s = 1234567;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
})();

function shingles() {
  const [c, g] = canvas(256);
  g.fillStyle = "#bdbdbd";
  g.fillRect(0, 0, 256, 256);
  const rh = 32, tw = 32;
  for (let r = 7; r >= -1; r--) {
    const off = r % 2 ? tw / 2 : 0, y = r * rh;
    for (let i = -1; i <= 8; i++) {
      const x = i * tw + off, v = 228 + Math.floor(rnd() * 27);
      const grd = g.createLinearGradient(0, y, 0, y + rh + 8);
      grd.addColorStop(0, `rgb(${v - 30},${v - 30},${v - 30})`);
      grd.addColorStop(0.55, `rgb(${v},${v},${v})`);
      grd.addColorStop(1, `rgb(${v - 8},${v - 8},${v - 8})`);
      g.fillStyle = grd;
      g.beginPath();
      g.moveTo(x + 1, y);
      g.lineTo(x + tw - 1, y);
      g.lineTo(x + tw - 1, y + rh - 2);
      g.quadraticCurveTo(x + tw - 1, y + rh + 8, x + tw / 2, y + rh + 8);
      g.quadraticCurveTo(x + 1, y + rh + 8, x + 1, y + rh - 2);
      g.closePath();
      g.fill();
      g.strokeStyle = "rgba(0,0,0,0.22)";
      g.lineWidth = 2;
      g.stroke();
    }
  }
  return toTex(c);
}

function planks() {
  const [c, g] = canvas(256);
  for (let i = 0; i < 8; i++) {
    const v = 214 + Math.floor(rnd() * 40);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(i * 32, 0, 32, 256);
    g.strokeStyle = "rgba(0,0,0,0.07)";
    g.lineWidth = 1;
    for (let k = 0; k < 4; k++) {
      const x = i * 32 + 5 + rnd() * 22;
      g.beginPath();
      g.moveTo(x, 0);
      g.bezierCurveTo(x + 4, 80, x - 4, 170, x + 2, 256);
      g.stroke();
    }
    g.fillStyle = "rgba(0,0,0,0.28)";
    g.fillRect(i * 32, 0, 2, 256);
    g.fillStyle = "rgba(255,255,255,0.25)";
    g.fillRect(i * 32 + 2, 0, 1, 256);
    g.fillStyle = "rgba(0,0,0,0.3)";
    [24, 232].forEach((y) => g.fillRect(i * 32 + 15, y, 3, 3));
  }
  return toTex(c);
}

function bricks(irregular = false) {
  const [c, g] = canvas(256);
  g.fillStyle = "#b9b9b9";
  g.fillRect(0, 0, 256, 256);
  const rh = irregular ? 42.67 : 32;
  for (let r = 0; r < 256 / rh; r++) {
    let x = r % 2 ? -32 : 0;
    while (x < 256) {
      const w = irregular ? 40 + rnd() * 50 : 64;
      const v = 205 + Math.floor(rnd() * 45);
      g.fillStyle = `rgb(${v},${v},${v})`;
      const bx = x + 3, by = r * rh + 3, bw = w - 6, bh = rh - 6, rr = irregular ? 10 : 4;
      g.beginPath();
      g.roundRect ? g.roundRect(bx, by, bw, bh, rr) : g.rect(bx, by, bw, bh);
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.18)";
      g.fillRect(bx + 3, by + 2, bw - 6, 3);
      // wrap the brick that crosses the right edge
      if (x + w > 256) {
        g.fillStyle = `rgb(${v},${v},${v})`;
        g.beginPath();
        g.roundRect ? g.roundRect(bx - 256, by, bw, bh, rr) : g.rect(bx - 256, by, bw, bh);
        g.fill();
      }
      x += w;
    }
  }
  return toTex(c);
}

function plaster() {
  const [c, g] = canvas(256);
  g.fillStyle = "#f4f4f4";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1600; i++) {
    const v = rnd() > 0.5 ? 255 : 210;
    g.fillStyle = `rgba(${v},${v},${v},0.25)`;
    g.fillRect(rnd() * 256, rnd() * 256, 2, 2);
  }
  for (let i = 0; i < 14; i++) {
    const x = rnd() * 256, y = rnd() * 256, r = 18 + rnd() * 40;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(220,220,220,0.35)");
    grd.addColorStop(1, "rgba(220,220,220,0)");
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  return toTex(c);
}

/** Paved plaza: concentric rings of stones around a medallion. */
function paving() {
  const S = 1024, [c, g] = canvas(S), cx = S / 2;
  g.fillStyle = "#a99f8c";
  g.fillRect(0, 0, S, S);
  const ringW = S / 2 / 6.6;
  for (let k = 0; k < 7; k++) {
    const r0 = k === 0 ? 0 : k * ringW, r1 = (k + 1) * ringW;
    const n = k === 0 ? 1 : Math.round((2 * Math.PI * (r0 + r1)) / 2 / (ringW * 1.15));
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + k * 0.37, a1 = ((i + 1) / n) * Math.PI * 2 + k * 0.37;
      const v = 222 + Math.floor(rnd() * 28), warm = Math.floor(rnd() * 10);
      g.fillStyle = k === 6 ? `rgb(${v - 40},${v - 44},${v - 52})` : `rgb(${v},${v - 4 - warm},${v - 14 - warm})`;
      g.beginPath();
      if (k === 0) g.arc(cx, cx, r1 - 5, 0, Math.PI * 2);
      else {
        const gap = 5 / ((r0 + r1) / 2);
        g.arc(cx, cx, r1 - 4, a0 + gap, a1 - gap);
        g.arc(cx, cx, r0 + 4, a1 - gap, a0 + gap, true);
      }
      g.closePath();
      g.fill();
    }
  }
  return toTex(c);
}

function radial(inner = "rgba(255,255,255,1)", size = 128) {
  const [c, g] = canvas(size);
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.4, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function heart() {
  const [c, g] = canvas(64);
  g.fillStyle = "#ff5d7a";
  g.beginPath();
  g.moveTo(32, 54);
  g.bezierCurveTo(2, 34, 6, 8, 22, 8);
  g.bezierCurveTo(28, 8, 32, 14, 32, 18);
  g.bezierCurveTo(32, 14, 36, 8, 42, 8);
  g.bezierCurveTo(58, 8, 62, 34, 32, 54);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.beginPath();
  g.ellipse(21, 19, 5, 3.5, -0.6, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function sparkle() {
  const [c, g] = canvas(64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.2, "rgba(255,240,190,0.8)");
  grd.addColorStop(1, "rgba(255,220,120,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = "rgba(255,255,255,0.95)";
  g.beginPath();
  g.moveTo(32, 2); g.lineTo(35, 29); g.lineTo(62, 32); g.lineTo(35, 35);
  g.lineTo(32, 62); g.lineTo(29, 35); g.lineTo(2, 32); g.lineTo(29, 29);
  g.closePath();
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Text on a wooden board — signs above doors and on the signpost. */
export function signTexture(text, { bg = "#7a5233", fg = "#fff3dc", w = 512, h = 128, size = 64 } = {}) {
  const [c, g] = canvas(w, h);
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 5; i++) {
    g.fillStyle = `rgba(0,0,0,${0.05 + rnd() * 0.06})`;
    g.fillRect(0, (i * h) / 5, w, 2);
  }
  g.strokeStyle = "rgba(0,0,0,0.35)";
  g.lineWidth = 8;
  g.strokeRect(4, 4, w - 8, h - 8);
  g.font = `700 ${size}px "Segoe UI", system-ui, -apple-system, sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fillText(text, w / 2 + 2, h / 2 + 4);
  g.fillStyle = fg;
  g.fillText(text, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** A small abstract painting for the designer's easel. */
export function paintingTexture() {
  const [c, g] = canvas(256, 200);
  g.fillStyle = "#fbf6ec";
  g.fillRect(0, 0, 256, 200);
  [["#E07B6B", 70, 80, 52], ["#4FD1C5", 170, 70, 40], ["#D4A848", 140, 140, 46], ["#3b4a6b", 60, 160, 26]].forEach(([col, x, y, r]) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  });
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(20, 120);
  g.bezierCurveTo(80, 40, 160, 190, 236, 90);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---- Shader patches ----

/** Shared uniforms every patched material reads (updated once per frame). */
export const U = {
  uTime: { value: 0 },
  uPlayer: { value: new THREE.Vector3() },
  uCam: { value: new THREE.Vector3() },
};

const BAYER = /* glsl */ `
float kwBayer(vec2 p){
  vec4 r0 = vec4(0.,8.,2.,10.), r1 = vec4(12.,4.,14.,6.), r2 = vec4(3.,11.,1.,9.), r3 = vec4(15.,7.,13.,5.);
  vec4 row = p.y < 0.5 ? r0 : p.y < 1.5 ? r1 : p.y < 2.5 ? r2 : r3;
  float v = p.x < 0.5 ? row.x : p.x < 1.5 ? row.y : p.x < 2.5 ? row.z : row.w;
  return (v + 0.5) / 16.0;
}`;

/**
 * Patch a standard/lambert material with optional wind sway (vertex) and
 * "x-ray" occlusion: surfaces between the camera and the player dither away.
 */
export function patch(mat, { wind = 0, windBase = 1.2, occlude = true } = {}) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader =
      "uniform float uTime;\nvarying vec3 vKwWorld;\n" +
      sh.vertexShader
        .replace(
          "#include <begin_vertex>",
          wind
            ? `#include <begin_vertex>
          vec3 kwW = (modelMatrix * vec4(transformed, 1.0)).xyz;
          float kwS = sin(uTime * 1.5 + kwW.x * 0.33 + kwW.z * 0.21) + 0.45 * sin(uTime * 2.6 + kwW.z * 0.7);
          float kwK = max(kwW.y - ${windBase.toFixed(2)}, 0.0) * ${wind.toFixed(4)};
          transformed.x += kwS * kwK;
          transformed.z += kwS * kwK * 0.55;`
            : "#include <begin_vertex>"
        )
        .replace("#include <project_vertex>", "#include <project_vertex>\nvKwWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    if (occlude) {
      sh.fragmentShader =
        "uniform vec3 uCam;\nuniform vec3 uPlayer;\nvarying vec3 vKwWorld;\n" + BAYER + "\n" +
        sh.fragmentShader.replace(
          "void main() {",
          `void main() {
          {
            vec3 kwSeg = uPlayer + vec3(0.0, 0.9, 0.0) - uCam;
            float kwL = length(kwSeg);
            vec3 kwDir = kwSeg / kwL;
            vec3 kwRel = vKwWorld - uCam;
            float kwT = dot(kwRel, kwDir);
            if (kwT > 0.0 && kwT < kwL - 1.1) {
              float kwD = length(kwRel - kwDir * kwT);
              float kwF = (1.0 - smoothstep(1.3, 2.7, kwD)) * smoothstep(0.0, 3.0, kwL - 1.1 - kwT);
              if (kwF * 0.82 > kwBayer(mod(floor(gl_FragCoord.xy), 4.0))) discard;
            }
          }`
        );
    } else {
      sh.fragmentShader = "varying vec3 vKwWorld;\n" + sh.fragmentShader;
    }
  };
  mat.customProgramCacheKey = () => `kw-${wind}-${windBase}-${occlude}`;
  return mat;
}

// ---- The material kit ----
export function createKit() {
  const T = {
    shingle: shingles(),
    plank: planks(),
    brick: bricks(false),
    stone: bricks(true),
    plaster: plaster(),
    paving: paving(),
    pool: radial(),
    heart: heart(),
    sparkle: sparkle(),
    puff: radial("rgba(255,255,255,0.95)", 64),
  };
  const cache = new Map();
  const std = (color, map = null, rough = 0.85, extra = {}) => {
    const k = `${color}|${map ? map.uuid : ""}|${rough}|${JSON.stringify(extra)}`;
    if (!cache.has(k)) cache.set(k, patch(new THREE.MeshStandardMaterial({ color, map, roughness: rough, metalness: 0, ...extra })));
    return cache.get(k);
  };
  const K = {
    T,
    std,
    plaster: (c) => std(c, T.plaster, 0.95),
    roof: (c) => std(c, T.shingle, 0.78),
    wood: (c = "#a8754a") => std(c, T.plank, 0.85),
    brick: (c) => std(c, T.brick, 0.92),
    stone: (c = "#cfc7b9") => std(c, T.stone, 0.95),
    plain: (c, r = 0.8) => std(c, null, r),
    metal: (c = "#3a3f47") => std(c, null, 0.45, { metalness: 0.55 }),
    window: patch(new THREE.MeshStandardMaterial({ color: "#a8d3ee", roughness: 0.15, metalness: 0.2, emissive: "#ffae4d", emissiveIntensity: 0 })),
    lamp: new THREE.MeshStandardMaterial({ color: "#fff4d1", emissive: "#ffc66b", emissiveIntensity: 0.3, roughness: 0.4 }),
    ember: new THREE.MeshStandardMaterial({ color: "#ff7a1a", emissive: "#ff4d00", emissiveIntensity: 1.4, roughness: 0.6 }),
    led: new THREE.MeshStandardMaterial({ color: "#ff4a4a", emissive: "#ff2a2a", emissiveIntensity: 2, roughness: 0.5 }),
    rune: new THREE.MeshStandardMaterial({ color: "#c8fbff", emissive: "#4fd1c5", emissiveIntensity: 1.4, roughness: 0.4 }),
    pool: new THREE.MeshBasicMaterial({ map: T.pool, color: "#ffb766", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
  };
  return K;
}

const DAY_GLASS = new THREE.Color("#a8d3ee"), NIGHT_GLASS = new THREE.Color("#3b2c22");
/** Day → night response for every emissive surface. */
export function updateKit(K, night, t) {
  K.window.color.copy(DAY_GLASS).lerp(NIGHT_GLASS, night);
  K.window.emissiveIntensity = night * 2.4;
  K.lamp.emissiveIntensity = 0.15 + night * 3.6;
  K.ember.emissiveIntensity = 1.4 + Math.sin(t * 9) * 0.25 + Math.sin(t * 23) * 0.15 + night * 1.2;
  K.led.emissiveIntensity = (Math.sin(t * 3.2) > 0.6 ? 3 : 0.2) * (0.6 + night);
  K.rune.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.3 + night * 1.2;
  K.pool.opacity = night * 0.55;
}
