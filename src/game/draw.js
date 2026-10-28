// ============================================================
// Pixel-art renderer — EVERYTHING drawn in code (no images).
// Tiles, hero, buildings, props are procedural; cached to
// offscreen canvases once, then blitted scaled by the engine.
//
// Art resolution is 1 art-px == 1 canvas px here; the engine
// scales each cached canvas up with imageSmoothing off.
// ============================================================

export const TILE = 16;

// ---- Palette (bright, cozy farm-RPG) ----
export const C = {
  // ground
  grass1: "#66a94a", grass2: "#5a9b42", grass3: "#80c15d", grassDark: "#4d8a38",
  tuft: "#86c862", tuftHi: "#a4dc7c", tuftDark: "#4a8637",
  blade: "#5da23a",
  dirt1: "#cda968", dirt2: "#b88f4e", dirtEdge: "#9a743f",
  cobble1: "#dcc595", cobble2: "#ccb17c", cobbleDark: "#a3855a", cobbleHi: "#efdfb8", cobbleMortar: "#b49a6c", cobbleMoss: "#a3b26a",
  water1: "#469fdb", water2: "#8fd4f3", waterDeep: "#3a86c8", waterShallow: "#6cc0ea", waterFoam: "#dff5ff", sandWet: "#d5bf86",
  sand: "#e8d6a0",
  // wood / stone / plaster
  wall: "#f4e8d0", wallShade: "#dcc8a2", wallLine: "#cdb88f",
  plaster: "#efe3c8", plasterShade: "#d8c7a0",
  stone: "#9b9aa6", stoneShade: "#7d7c8a", stoneDark: "#5d5c6c", stoneHi: "#b6b5c0",
  brick1: "#a85a44", brick2: "#8c4733", brickMortar: "#caa98a", brickHi: "#c47a5e",
  wood: "#9a6437", woodDark: "#5f3c1f", woodLight: "#b67c46", woodHi: "#c98f57", beam: "#553414",
  door: "#6b3f22", doorDark: "#4a2a16", doorHi: "#8a5530",
  glass: "#bfe7f6", glassHi: "#e7f7ff", glassFrame: "#5f3c1f",
  // foliage
  leaf1: "#3f9e4d", leaf2: "#2f7d3a", leaf3: "#57b85f", leafHi: "#84d76d", leafDark: "#256030",
  pine1: "#2f6e3e", pine2: "#245833", pineHi: "#3f8a4d",
  blossom: "#f6abc6", blossomHi: "#ffd3e3", fruit: "#e0542f", fruitHi: "#ff7a4d",
  trunk: "#7a4d28", trunkDark: "#553414", trunkHi: "#946238",
  // accents
  outline: "#2a2230",
  white: "#ffffff", black: "#1a1420",
  gold: "#e6bb52", goldDark: "#bb8f30", goldHi: "#ffe39a",
  cyan: "#54cfc2", cyanDark: "#349a90", cyanHi: "#9bf0e6",
  rose: "#e88a78", roseDark: "#c4604d", roseHi: "#ffb9a6",
  furnace: "#ff8a3c", furnaceHot: "#ffd980", furnaceCore: "#fff3cf", ember: "#ff6a2c",
  smoke: "#d7d2c9",
  metal: "#c2c8d2", metalDark: "#7e8696", metalHi: "#eef1f6", rivet: "#5a606e",
  screen: "#163b3a", screenLine: "#54cfc2", led: "#7dff8e",
  // hero
  jeans: "#3c4868", jeansDark: "#2a3248", shoe: "#eef0f4", shoeShade: "#b9bcc8",
  flag: "#e6bb52",
};

// ---- low-level canvas helpers ----
export function makeCanvas(w, h) {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.round(w));
  cv.height = Math.max(1, Math.round(h));
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return { cv, ctx };
}
const r = (ctx, x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); };
const px = (ctx, x, y, color) => { ctx.fillStyle = color; ctx.fillRect(x | 0, y | 0, 1, 1); };
// pixel-perfect disc: whole-pixel runs per row, so edges stay crisp when scaled
const disc = (ctx, cx, cy, rad, color) => {
  ctx.fillStyle = color;
  for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++) {
    const dy = y + 0.5 - cy, h = rad * rad - dy * dy;
    if (h < 0) continue;
    const w = Math.sqrt(h), xa = Math.round(cx - w), xb = Math.round(cx + w);
    if (xb > xa) ctx.fillRect(xa, y, xb - xa, 1);
  }
};
function flipH(cv) {
  const o = makeCanvas(cv.width, cv.height);
  o.ctx.translate(cv.width, 0); o.ctx.scale(-1, 1);
  o.ctx.drawImage(cv, 0, 0);
  return o.cv;
}
function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

// ============================================================ PIXEL FONT (3x5)
// Compact uppercase font used for crisp in-world storefront signs.
const GLYPHS = {
  A: ["###", "#.#", "###", "#.#", "#.#"], B: ["##.", "#.#", "##.", "#.#", "##."],
  C: ["###", "#..", "#..", "#..", "###"], D: ["##.", "#.#", "#.#", "#.#", "##."],
  E: ["###", "#..", "##.", "#..", "###"], F: ["###", "#..", "##.", "#..", "#.."],
  G: ["###", "#..", "#.#", "#.#", "###"], H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"], J: ["..#", "..#", "..#", "#.#", "###"],
  K: ["#.#", "#.#", "##.", "#.#", "#.#"], L: ["#..", "#..", "#..", "#..", "###"],
  M: ["#.#", "###", "###", "#.#", "#.#"], N: ["##.", "#.#", "#.#", "#.#", "#.#"],
  O: ["###", "#.#", "#.#", "#.#", "###"], P: ["##.", "#.#", "##.", "#..", "#.."],
  Q: ["###", "#.#", "#.#", "###", "..#"], R: ["##.", "#.#", "##.", "#.#", "#.#"],
  S: ["###", "#..", "###", "..#", "###"], T: ["###", ".#.", ".#.", ".#.", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"], V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  W: ["#.#", "#.#", "###", "###", "#.#"], X: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."], Z: ["###", "..#", ".#.", "#..", "###"],
  0: ["###", "#.#", "#.#", "#.#", "###"], 1: [".#.", "##.", ".#.", ".#.", "###"],
  2: ["###", "..#", "###", "#..", "###"], 3: ["###", "..#", "###", "..#", "###"],
  4: ["#.#", "#.#", "###", "..#", "..#"], 5: ["###", "#..", "###", "..#", "###"],
  6: ["###", "#..", "###", "#.#", "###"], 7: ["###", "..#", ".#.", ".#.", ".#."],
  8: ["###", "#.#", "###", "#.#", "###"], 9: ["###", "#.#", "###", "..#", "###"],
  " ": ["...", "...", "...", "...", "..."], "'": [".#.", ".#.", "...", "...", "..."],
  "-": ["...", "...", "###", "...", "..."], ".": ["...", "...", "...", "...", ".#."],
  "&": [".#.", "#.#", ".#.", "#.#", "###"], "!": [".#.", ".#.", ".#.", "...", ".#."],
};
const GW = 3, GH = 5, GSP = 1;
export function textWidth(text) {
  return text.length * (GW + GSP) - GSP;
}
// Render text at 1 art-px scale. `align`: "left" | "center" (centered in width `w`).
export function drawText(ctx, text, x, y, color, opts = {}) {
  const t = String(text).toUpperCase();
  let ox = x;
  if (opts.align === "center" && opts.w != null) ox = x + Math.floor((opts.w - textWidth(t)) / 2);
  for (const ch of t) {
    const g = GLYPHS[ch] || GLYPHS[" "];
    if (opts.shadow) {
      ctx.fillStyle = opts.shadow;
      for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) if (g[gy][gx] === "#") ctx.fillRect(ox + gx, y + gy + 1, 1, 1);
    }
    ctx.fillStyle = color;
    for (let gy = 0; gy < GH; gy++) for (let gx = 0; gx < GW; gx++) if (g[gy][gx] === "#") ctx.fillRect(ox + gx, y + gy, 1, 1);
    ox += GW + GSP;
  }
  return ox - GSP - x;
}

// 1px dark outline around every opaque shape. `expand` grows the canvas by
// 1px per side so shapes touching the edge still get a full outline.
export function outlineSprite(cv, expand = true, rgba = [42, 34, 48, 215]) {
  const p = expand ? 1 : 0, w = cv.width + p * 2, h = cv.height + p * 2;
  const o = makeCanvas(w, h);
  o.ctx.drawImage(cv, p, p);
  const im = o.ctx.getImageData(0, 0, w, h), d = im.data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[(y * w + x) * 4 + 3]);
  const add = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y) > 40) continue;
    if (a(x - 1, y) > 150 || a(x + 1, y) > 150 || a(x, y - 1) > 150 || a(x, y + 1) > 150) add.push((y * w + x) * 4);
  }
  for (const k of add) { d[k] = rgba[0]; d[k + 1] = rgba[1]; d[k + 2] = rgba[2]; d[k + 3] = rgba[3]; }
  o.ctx.putImageData(im, 0, 0);
  return o.cv;
}

// Build a crisp offscreen canvas from a pixel-map (rows of palette keys).
export function paintMap(ctx, rows, palette, dx = 0, dy = 0) {
  for (let y = 0; y < rows.length; y++) {
    const line = rows[y];
    for (let x = 0; x < line.length; x++) {
      const c = palette[line[x]];
      if (c) { ctx.fillStyle = c; ctx.fillRect(dx + x, dy + y, 1, 1); }
    }
  }
}
export function buildSpriteCanvas(rows, palette) {
  const o = makeCanvas(rows[0].length, rows.length);
  if (!o) return null;
  paintMap(o.ctx, rows, palette);
  return o.cv;
}

// ============================================================ TILES
// Terrain is painted per pixel (ImageData) so grass can have soft dithered
// patches, roads can fray into the grass, and the pond can have a round
// shore that ignores the tile grid. `nb(dx, dy)` returns neighbour types.
export const POND = { cx: 144, cy: 64, rx: 56, ry: 31 };
export function pondDepth(x, y) {
  const dx = (x - POND.cx) / POND.rx, dy = (y - POND.cy) / POND.ry;
  const a = Math.atan2(dy, dx);
  const wob = 1 + 0.07 * Math.sin(a * 3 + 0.6) + 0.04 * Math.sin(a * 5 + 2.1);
  return Math.hypot(dx, dy) / wob; // < 1 water, ≈ 1 shoreline
}
const LILIES = [[106, 60, 4.2, true], [186, 55, 3.4, false], [152, 86, 3, false], [122, 44, 2.6, false]];

function vnoise(x, y, cell) {
  const gx = Math.floor(x / cell), gy = Math.floor(y / cell);
  const fx = x / cell - gx, fy = y / cell - gy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(gx, gy), b = hash(gx + 1, gy), c = hash(gx, gy + 1), d = hash(gx + 1, gy + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const dither = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 - 0.5;
const RGB = new Map();
function rgb(hex) {
  let v = RGB.get(hex);
  if (!v) { const n = parseInt(hex.slice(1), 16); v = [n >> 16, (n >> 8) & 255, n & 255]; RGB.set(hex, v); }
  return v;
}
function pixelTile(ctx, fn) {
  const im = ctx.createImageData(TILE, TILE), d = im.data;
  for (let j = 0; j < TILE; j++) for (let i = 0; i < TILE; i++) {
    const c = rgb(fn(i, j)), k = (j * TILE + i) * 4;
    d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
  }
  ctx.putImageData(im, 0, 0);
}
const GRASS = ["#5e9f45", "#6aad4d", "#77ba57", "#86c662"]; // dark → light
export function grassAt(wx, wy) {
  const n = vnoise(wx, wy, 46) * 0.72 + vnoise(wx + 311, wy + 97, 14) * 0.28 + dither(wx, wy) * 0.14;
  return GRASS[n < 0.34 ? 0 : n < 0.5 ? 1 : n < 0.67 ? 2 : 3];
}
const isGreen = (t) => t === "grass" || t === "flower" || t === "hedge" || t === "pond" || t === "picnic";

function grassTile(ctx, tx, ty, nb) {
  pixelTile(ctx, (i, j) => grassAt(tx * TILE + i, ty * TILE + j));
  // soft shade where the lawn meets the hedge wall
  ctx.fillStyle = "rgba(22,58,30,0.2)";
  if (nb(0, -1) === "hedge") { ctx.fillRect(0, 0, TILE, 3); ctx.fillRect(0, 0, TILE, 1); }
  if (nb(-1, 0) === "hedge") ctx.fillRect(0, 0, 2, TILE);
  if (nb(1, 0) === "hedge") ctx.fillRect(TILE - 2, 0, 2, TILE);
  // tufts
  for (let k = 0; k < 3; k++) {
    if (hash(tx * 3 + k, ty * 5 - k) < 0.58) continue;
    const x = 2 + Math.floor(hash(tx + k * 7, ty) * 12), y = 3 + Math.floor(hash(tx, ty + k * 11) * 11);
    px(ctx, x, y, C.tuftDark); px(ctx, x - 1, y - 1, C.tuftDark); px(ctx, x + 1, y - 1, C.tuftDark);
    px(ctx, x, y - 1, C.tuft); px(ctx, x - 1, y - 2, C.tuftHi); px(ctx, x + 1, y - 2, C.tuft); px(ctx, x, y - 2, C.tuft);
  }
  if (hash(tx * 13, ty * 17) > 0.94) { // pebble
    const x = 3 + Math.floor(hash(tx, ty * 3) * 10), y = 4 + Math.floor(hash(tx * 5, ty) * 9);
    r(ctx, x, y, 3, 2, "#9d9c90"); r(ctx, x, y, 2, 1, "#c9c8bc"); r(ctx, x, y + 2, 3, 1, "#4f8a3a");
  }
}
const PETALS = [["#ff8fa3", "#e0607a"], ["#ffd84a", "#e3a51e"], ["#ffffff", "#d6d6e2"], ["#8fd3ff", "#5aa6e0"], ["#ffb3d9", "#e07fb0"], ["#ffa65c", "#e07b2e"]];
function flowerTile(ctx, tx, ty, nb) {
  grassTile(ctx, tx, ty, nb);
  const n = 3 + (hash(tx, ty * 9) > 0.5 ? 1 : 0);
  for (let k = 0; k < n; k++) {
    const x = 2 + Math.floor(hash(tx * 7 + k, ty * 3) * 12), y = 2 + Math.floor(hash(tx * 3, ty * 7 + k) * 10);
    const [c, d] = PETALS[Math.floor(hash(tx + k * 5, ty + k) * PETALS.length)];
    px(ctx, x, y + 2, "#3f7f34"); px(ctx, x - 1, y + 3, "#56a046"); px(ctx, x, y + 3, "#3f7f34");
    px(ctx, x, y - 1, c); px(ctx, x - 1, y, c); px(ctx, x + 1, y, d); px(ctx, x, y + 1, d);
    px(ctx, x, y, "#f6c02c");
  }
}
function pathTile(ctx, tx, ty, nb) {
  // warm packed-earth road with rounded cobbles (2 layouts to break the grid)
  pixelTile(ctx, (i, j) => (hash(tx * 16 + i + 11, ty * 16 + j + 5) > 0.965 ? C.cobbleDark : C.cobbleMortar));
  const layouts = [
    [[1, 1, 6, 5], [8, 0, 6, 6], [0, 7, 5, 5], [6, 7, 5, 6], [11, 7, 5, 5], [1, 12, 6, 4], [8, 12, 6, 4], [12, 1, 4, 5]],
    [[0, 0, 5, 6], [6, 1, 5, 5], [12, 0, 4, 5], [2, 7, 6, 5], [9, 7, 6, 4], [0, 12, 4, 4], [5, 12, 6, 4], [12, 6, 4, 6]],
  ];
  layouts[hash(tx, ty) > 0.5 ? 1 : 0].forEach(([sx, sy, sw, sh], i) => {
    const v = hash(tx * 7 + i, ty * 5 + i);
    const col = v > 0.55 ? C.cobble1 : v > 0.07 ? C.cobble2 : C.cobbleMoss;
    r(ctx, sx + 1, sy, sw - 2, sh, col); r(ctx, sx, sy + 1, sw, sh - 2, col);   // rounded stone
    r(ctx, sx + 1, sy + sh - 1, sw - 2, 1, C.cobbleDark);
    r(ctx, sx + 1, sy, sw - 2, 1, C.cobbleHi);
  });
  // grass frays over the road edges; corners round off
  const g = (i, j) => px(ctx, i, j, grassAt(tx * TILE + i, ty * TILE + j));
  const edge = (side) => {
    for (let k = 0; k < TILE; k++) {
      const depth = 1 + Math.floor(hash(tx * 31 + k + side * 7, ty * 17 + side) * 2.4);
      for (let d = 0; d < depth; d++) {
        if (side === 0) g(k, d); else if (side === 1) g(k, TILE - 1 - d); else if (side === 2) g(d, k); else g(TILE - 1 - d, k);
      }
      ctx.fillStyle = "rgba(70,48,22,0.28)";
      if (side === 0) ctx.fillRect(k, depth, 1, 1);
      else if (side === 2) ctx.fillRect(depth, k, 1, 1);
      else if (side === 3) ctx.fillRect(TILE - 1 - depth, k, 1, 1);
      else { ctx.fillStyle = "rgba(255,248,226,0.2)"; ctx.fillRect(k, TILE - 1 - depth, 1, 1); }
    }
  };
  const up = isGreen(nb(0, -1)), dn = isGreen(nb(0, 1)), lf = isGreen(nb(-1, 0)), rt = isGreen(nb(1, 0));
  if (up) edge(0);
  if (dn) edge(1);
  if (lf) edge(2);
  if (rt) edge(3);
  const R = 5;
  const corner = (fx, fy) => {
    for (let j = 0; j < R; j++) for (let i = 0; i < R; i++) {
      const x = fx ? TILE - 1 - i : i, y = fy ? TILE - 1 - j : j;
      if ((R - i - 0.5) ** 2 + (R - j - 0.5) ** 2 > R * R) g(x, y);
    }
  };
  if (up && lf) corner(false, false);
  if (up && rt) corner(true, false);
  if (dn && lf) corner(false, true);
  if (dn && rt) corner(true, true);
  // inner corners: a little grass nub where two roads meet a lawn diagonally
  const nub = (x, y) => { g(x, y); g(x + (x ? -1 : 1), y); g(x, y + (y ? -1 : 1)); };
  if (!up && !lf && isGreen(nb(-1, -1))) nub(0, 0);
  if (!up && !rt && isGreen(nb(1, -1))) nub(TILE - 1, 0);
  if (!dn && !lf && isGreen(nb(-1, 1))) nub(0, TILE - 1);
  if (!dn && !rt && isGreen(nb(1, 1))) nub(TILE - 1, TILE - 1);
}
function pondTile(ctx, tx, ty) {
  pixelTile(ctx, (i, j) => {
    const wx = tx * TILE + i, wy = ty * TILE + j;
    const d = pondDepth(wx + 0.5, wy + 0.5) + dither(wx, wy) * 0.05;
    if (d < 0.5) return hash(wx >> 2, wy) > 0.965 ? C.water2 : C.waterDeep;
    if (d < 0.82) return hash(wx >> 2, wy) > 0.97 ? C.water2 : C.water1;
    if (d < 0.96) return C.waterShallow;
    if (d < 1.01) return C.waterFoam;
    if (d < 1.09) return C.sandWet;
    if (d < 1.26) return hash(wx, wy * 3) > 0.92 ? C.dirt1 : C.sand;
    return grassAt(wx, wy);
  });
  // lily pads (one with a flower)
  for (const [lx, ly, lr, bloom] of LILIES) {
    const x = lx - tx * TILE, y = ly - ty * TILE;
    if (x < -6 || y < -6 || x > TILE + 6 || y > TILE + 6) continue;
    disc(ctx, x, y + 0.7, lr, "#2f7a3c"); disc(ctx, x, y, lr, "#4fa04a"); disc(ctx, x - 0.8, y - 0.8, lr - 1.4, "#6cbd5b");
    const X = Math.round(x), Y = Math.round(y);
    r(ctx, X, Math.round(y - lr), 1, Math.round(lr), C.water1); px(ctx, X + 1, Math.round(y - lr) + 1, C.water1);
    if (bloom) { px(ctx, X - 2, Y - 1, "#ffd3e3"); px(ctx, X - 1, Y - 2, "#ff9fc4"); px(ctx, X - 3, Y - 2, "#ff9fc4"); px(ctx, X - 2, Y - 3, "#ff9fc4"); px(ctx, X - 2, Y - 2, "#ffd84a"); }
  }
}
function hedgeTile(ctx, tx, ty) {
  r(ctx, 0, 0, TILE, TILE, "#2a5f31");
  for (let k = 0; k < 5; k++) {
    const x = 2 + hash(tx * 3 + k, ty) * 12, y = 2 + hash(tx, ty * 3 + k) * 12;
    disc(ctx, x, y + 1, 5, "#22512a"); disc(ctx, x, y, 4.6, "#35763b"); disc(ctx, x - 1, y - 1.2, 3.2, "#448a45");
    px(ctx, Math.round(x) - 2, Math.round(y) - 3, "#69b25f");
  }
  if (hash(tx * 7, ty * 3) > 0.72) { px(ctx, 5, 9, "#e5484d"); px(ctx, 11, 4, "#e5484d"); px(ctx, 6, 9, "#ff8a8a"); }
}

export function buildTile(type, tx = 0, ty = 0, nb = () => "grass") {
  const o = makeCanvas(TILE, TILE);
  if (!o) return null;
  const { ctx } = o;
  if (type === "pond" || type === "water" || type === "sand" || type === "lily") { pondTile(ctx, tx, ty); return o.cv; }
  if (type === "hedge") { hedgeTile(ctx, tx, ty); return o.cv; }
  if (type === "path") { pathTile(ctx, tx, ty, nb); return o.cv; }
  if (type === "flower") { flowerTile(ctx, tx, ty, nb); return o.cv; }
  if (type === "soil" || type === "crop") {
    r(ctx, 0, 0, TILE, TILE, "#9a6a3c");
    for (let row = 0; row < 4; row++) { r(ctx, 0, row * 4 + 2, TILE, 1, "#7d5230"); r(ctx, 0, row * 4, TILE, 1, "#ad7b48"); }
    const soilish = (t) => t === "soil" || t === "crop";
    if (!soilish(nb(0, -1))) { r(ctx, 0, 0, TILE, 1, "#6a4526"); r(ctx, 0, 1, TILE, 1, "#b88752"); }
    if (!soilish(nb(0, 1))) r(ctx, 0, TILE - 1, TILE, 1, "#5e3d22");
    if (!soilish(nb(-1, 0))) r(ctx, 0, 0, 1, TILE, "#6a4526");
    if (!soilish(nb(1, 0))) r(ctx, TILE - 1, 0, 1, TILE, "#5e3d22");
    if (type === "crop") {
      const kind = Math.floor(hash(tx * 3, ty * 7) * 3);
      for (let i = 0; i < 2; i++) {
        const cx = 4 + i * 8, cy = 7 + (i % 2) * 2;
        if (kind === 0) { // cabbage
          disc(ctx, cx, cy + 0.6, 3.6, "#3f8a3a"); disc(ctx, cx, cy, 3.2, "#5aa84a"); disc(ctx, cx - 0.5, cy - 0.6, 2, "#8fd170"); px(ctx, cx - 1, cy - 2, "#c2ef9f");
        } else if (kind === 1) { // carrot tops
          r(ctx, cx - 1, cy - 4, 1, 4, C.leaf3); r(ctx, cx + 1, cy - 4, 1, 4, C.leaf1); r(ctx, cx, cy - 5, 1, 5, C.leaf3);
          r(ctx, cx - 1, cy, 3, 2, "#f08a3a"); px(ctx, cx - 1, cy, "#ffb06b");
        } else { // pumpkin
          disc(ctx, cx, cy + 0.5, 3.4, "#c9652a"); disc(ctx, cx, cy, 3, "#f0973a"); r(ctx, cx, cy - 2, 1, 5, "#d9772a");
          r(ctx, cx, cy - 5, 1, 2, C.leaf2); px(ctx, cx - 1, cy - 2, "#ffc27a");
        }
      }
    }
    return o.cv;
  }
  if (type === "picnic") {
    // red/white gingham; neighbouring picnic tiles join into one blanket
    grassTile(ctx, tx, ty, nb);
    for (let y = 2; y < 14; y += 2) for (let x = 0; x < TILE; x += 2)
      r(ctx, x, y, 2, 2, ((x + y) / 2) % 2 ? "#e45b5b" : "#fff4ea");
    r(ctx, 0, 14, TILE, 1, "#b84444"); r(ctx, 0, 15, TILE, 1, "rgba(20,50,25,0.35)");
    if (nb(-1, 0) !== "picnic") r(ctx, 0, 2, 1, 12, "#c94f4f");
    if (nb(1, 0) !== "picnic") r(ctx, TILE - 1, 2, 1, 12, "#c94f4f");
    return o.cv;
  }
  grassTile(ctx, tx, ty, nb);
  return o.cv;
}

// ============================================================ HERO
// Head + torso authored as pixel-maps (19 rows). Legs are drawn
// procedurally so the walk cycle (4 frames) animates cleanly.
const HPAL = {
  K: C.outline, H: "#7a5230", N: "#553718", F: "#9a6c3e",
  S: "#f6cda0", C: "#dca175", E: C.outline, M: "#b15f3c", R: "#e89a86",
  J: "#4f72a8", Z: "#3a5585", L: "#6f93c6", W: "#f1ece1", P: "#324d7d",
};
const HERO_BODY = {
  down: [
    "................", ".....FFFF.......", "...FNHHHHNF.....", "..FHHHHHHHHF....",
    "..NHHHHHHHHN....", "..HHFSSSSFHH....", "..HSSSSSSSSH....", "..HSSSSSSSSH....",
    "..HSECSSCESH....", "..FSSSSSSSSF....", "...SCRSSRCS.....", "...SSCMMCSS.....",
    "....KSSSSK......", "...ZJJWWJJZ.....", "..ZJJLJJLJJZ....", ".CKJLJJJJLJKC...",
    ".SKJLPPPPLJKS...", ".SKJZPPPPZJKS...", "..KJZZZZZZJK....",
  ],
  up: [
    "................", ".....FFFF.......", "...FNHHHHNF.....", "..FHHHHHHHHF....",
    "..NHHHHHHHHN....", "..HHHHHHHHHH....", "..HHHHHHHHHH....", "..HHHHHHHHHH....",
    "..HHHHHHHHHH....", "..FHHHHHHHHF....", "...HHHHHHHH.....", "....HHHHHH......",
    "....KHHHHK......", "...ZJJJJJJZ.....", "..ZJJLLLLJJZ....", ".CKJLLLLLLJKC...",
    ".SKJLLLLLLJKS...", ".SKJZJJJJZJKS...", "..KJZZZZZZJK....",
  ],
  left: [
    "................", "....FFFF........", "...FNHHHHF......", "..FHHHHHHHF.....",
    "..NHHHHHHHN.....", "..FSSSSHHF......", "..SSSSSSHF......", "..SESSSSHF......",
    "..SSSSSSHF......", "...SSSSHF.......", "...MSSSS........", "....SSS.........",
    "...KSSSK........", "..ZJJJJJZ.......", ".ZJJLLLJJZ......", "CKJLLLLJKZ......",
    "SKJLLLLJKZ......", ".KJPPPPJK.......", ".KJZZZZJK.......",
  ],
};
// procedural legs (rows 19..23) ---------------------------------
function legsFront(ctx, step, pal) {
  const D = pal?.pants || C.jeans, X = pal?.pantsDark || C.jeansDark, B = pal?.shoe || C.shoe, Y = pal?.shoeShade || C.shoeShade, K = C.outline;
  const lift = [[0, 0], [1, 0], [0, 0], [0, 1]][step]; // [left, right]
  // left leg (cols 3..6)
  r(ctx, 3, 19, 4, 3 - lift[0], D); r(ctx, 3, 19, 1, 3 - lift[0], X);
  r(ctx, 3, 22 - lift[0], 4, 2, B); r(ctx, 5, 22 - lift[0], 1, 2, Y); px(ctx, 2, 23 - lift[0], K);
  // right leg (cols 7..10)
  r(ctx, 7, 19, 4, 3 - lift[1], D); r(ctx, 10, 19, 1, 3 - lift[1], X);
  r(ctx, 7, 22 - lift[1], 4, 2, B); r(ctx, 9, 22 - lift[1], 1, 2, Y); px(ctx, 11, 23 - lift[1], K);
  // outline base
  r(ctx, 3, 19, 1, 5, K); r(ctx, 10, 19, 1, 5, K);
}
function legsSide(ctx, step, pal) {
  const D = pal?.pants || C.jeans, X = pal?.pantsDark || C.jeansDark, B = pal?.shoe || C.shoe, Y = pal?.shoeShade || C.shoeShade, K = C.outline;
  const swing = [0, 2, 0, -2][step]; // front foot horizontal swing
  // back leg
  const bx = 6 - Math.max(0, -swing);
  r(ctx, bx, 19, 3, 3, X); r(ctx, bx - 1, 22, 4, 2, Y); px(ctx, bx - 1, 23, K);
  // front leg
  const fx = 4 + Math.max(0, swing);
  r(ctx, fx, 19, 3, 4, D); r(ctx, fx, 19, 1, 4, X);
  r(ctx, fx - 1, 22, 5, 2, B); r(ctx, fx + 2, 22, 1, 2, Y); px(ctx, fx - 1, 23, K);
}
// `pal` recolours hair / skin / shirt / trousers (villagers reuse the hero
// rig); `hat` adds headwear; `blink` closes the eyes (front view only).
export function buildHero(dir, step = 0, pal = null, hat = null, blink = false) {
  const baseDir = dir === "right" ? "left" : dir;
  const o = makeCanvas(16, 24); const { ctx } = o;
  const P = pal ? { ...HPAL, ...pal } : HPAL;
  paintMap(ctx, HERO_BODY[baseDir], blink ? { ...P, E: P.C } : P);
  if (baseDir === "left") legsSide(ctx, step, pal); else legsFront(ctx, step, pal);
  if (hat) drawHat(ctx, hat, baseDir);
  return dir === "right" ? flipH(o.cv) : o.cv;
}
// build all facings × 4 frames at once (+ a blink frame for idle)
export function buildHeroFrames(pal = null, hat = null) {
  const dirs = ["down", "up", "left", "right"];
  const out = {};
  for (const d of dirs) out[d] = [0, 1, 2, 3].map((s) => buildHero(d, s, pal, hat));
  out.blink = buildHero("down", 0, pal, hat, true);
  return out;
}
// headwear for villagers, drawn over the hair (front / back / side)
function drawHat(ctx, kind, dir) {
  const side = dir === "left";
  if (kind === "straw") {
    const S = "#ecc96b", D = "#b8923f", B = "#c4604d";
    r(ctx, side ? 0 : 1, 4, side ? 12 : 12, 1, D); r(ctx, side ? 0 : 1, 3, side ? 12 : 12, 1, S);
    r(ctx, side ? 3 : 3, 0, 7, 3, S); r(ctx, side ? 3 : 3, 2, 7, 1, B); r(ctx, side ? 3 : 3, 0, 7, 1, "#f7dd92");
  } else if (kind === "beret") {
    const S = "#3c4868", H = "#53608a";
    r(ctx, 2, 1, 10, 3, S); r(ctx, 3, 0, 7, 1, S); r(ctx, 3, 1, 5, 1, H); px(ctx, 7, 0, C.outline);
    r(ctx, side ? 1 : 2, 3, side ? 10 : 10, 1, "#2a3248");
  } else if (kind === "cap") {
    const S = "#d9544a", D = "#a93a33";
    r(ctx, 2, 1, 10, 3, S); r(ctx, 3, 0, 8, 1, S); r(ctx, 3, 1, 4, 1, "#f07a6e");
    if (dir === "down") r(ctx, 3, 4, 8, 1, D);
    else if (side) r(ctx, 0, 3, 4, 1, D);
  } else if (kind === "bandana") {
    const S = "#e6bb52", D = "#bb8f30";
    r(ctx, 2, 2, 10, 2, S); r(ctx, 2, 3, 10, 1, D);
    if (dir === "up") { r(ctx, 6, 4, 2, 2, S); px(ctx, 5, 5, D); px(ctx, 8, 5, D); }
    if (side) { r(ctx, 9, 3, 2, 3, S); }
  }
}

// ============================================================ BUILDING PRIMITIVES
export const BUILDING_SIZE = {
  forge: { w: 4, h: 4 }, studio: { w: 3, h: 4 }, workshop: { w: 4, h: 4 },
  guild: { w: 5, h: 4 }, inn: { w: 4, h: 4 }, portal: { w: 3, h: 3 },
};

function buildingCanvas(wT, hT, padTop) {
  const w = wT * TILE, h = hT * TILE;
  const o = makeCanvas(w, h + padTop);
  o.ctx.translate(0, padTop);
  return { ...o, w, h, padTop };
}
// gable (triangular) roof spanning x0..x1, apex at top
function gableRoof(ctx, x0, x1, top, baseY, dark, light, ridge) {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  for (let y = baseY; y >= top; y--) {
    const t = (baseY - y) / (baseY - top);
    const half = (w / 2) * (1 - t);
    r(ctx, Math.round(cx - half), y, Math.round(half * 2), 1, (baseY - y) < 2 ? light : dark);
  }
  // shingle rows
  for (let y = top + 3; y < baseY; y += 3) {
    const t = (baseY - y) / (baseY - top), half = (w / 2) * (1 - t);
    r(ctx, Math.round(cx - half), y, Math.round(half * 2), 1, ridge);
  }
  // eaves
  r(ctx, x0 - 1, baseY, w + 2, 2, C.woodDark);
}
// hip / trapezoid roof — flat-ish top, angled sides (a wide tech shed look)
function hipRoof(ctx, x0, x1, top, baseY, dark, light, ridge) {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  for (let y = baseY; y >= top; y--) {
    const t = (baseY - y) / (baseY - top);        // 0 at eaves → 1 at ridge
    const half = (w / 2) - Math.round((w * 0.22) * t);
    r(ctx, Math.round(cx - half), y, Math.round(half * 2), 1, (baseY - y) < 2 ? light : dark);
  }
  for (let y = top + 3; y < baseY; y += 3) r(ctx, x0 + 3, y, w - 6, 1, ridge);
  r(ctx, x0 - 1, baseY, w + 2, 2, C.woodDark);
}
// mono-slope (shed) roof — high on the left, low on the right (industrial look)
function shedRoof(ctx, x0, x1, topL, topR, baseY, dark, light, ridge) {
  const w = x1 - x0;
  for (let x = x0; x < x1; x++) {
    const topY = Math.round(topL + (topR - topL) * ((x - x0) / w));
    r(ctx, x, topY, 1, baseY - topY, dark);
    r(ctx, x, topY, 1, 2, light);
    for (let yy = topY + 4; yy < baseY; yy += 3) px(ctx, x, yy, ridge);
  }
  r(ctx, x0 - 1, baseY, w + 2, 2, C.woodDark);
}
// brick column / chimney
function brick(ctx, x, y, w, h) {
  r(ctx, x, y, w, h, C.brick2);
  for (let yy = y; yy < y + h; yy += 3)
    for (let xx = x + (((yy - y) / 3) % 2 ? 3 : 0); xx < x + w; xx += 6) {
      r(ctx, xx, yy, 5, 2, C.brick1); px(ctx, xx, yy, C.brickHi);
    }
  r(ctx, x, y, w, 1, C.brickMortar);
}
function plasterWall(ctx, x, y, w, h, col = C.plaster, shade = C.plasterShade) {
  r(ctx, x, y, w, h, col);
  r(ctx, x, y, 2, h, shade); r(ctx, x + w - 2, y, 2, h, shade);
  r(ctx, x, y + h - 3, w, 3, shade);
  r(ctx, x, y, w, 1, C.outline);
}
function stoneWall(ctx, x, y, w, h) {
  r(ctx, x, y, w, h, C.stone);
  for (let yy = y; yy < y + h; yy += 4)
    for (let xx = x + ((yy - y) % 8 ? 0 : 3); xx < x + w; xx += 7) {
      r(ctx, xx, yy, 6, 3, C.stoneShade); r(ctx, xx, yy, 6, 1, C.stoneHi); px(ctx, xx, yy, C.stone);
    }
  r(ctx, x, y, 2, h, C.stoneDark); r(ctx, x + w - 2, y, 2, h, C.stoneDark);
}
function windowGlass(ctx, x, y, w, h, glass = C.glass) {
  r(ctx, x - 1, y - 1, w + 2, h + 2, C.glassFrame);
  r(ctx, x, y, w, h, glass);
  r(ctx, x, y, w, 1, C.glassHi); r(ctx, x, y, 1, h, C.glassHi);
  r(ctx, x + Math.floor(w / 2), y, 1, h, C.glassFrame);
  r(ctx, x, y + Math.floor(h / 2), w, 1, C.glassFrame);
}
function door(ctx, cx, baseY, dw = 12, dh = 17) {
  const dx = Math.round(cx - dw / 2);
  r(ctx, dx - 1, baseY - dh - 1, dw + 2, dh + 1, C.woodDark);
  r(ctx, dx, baseY - dh, dw, dh, C.door);
  r(ctx, dx, baseY - dh, dw, 1, C.doorHi);
  r(ctx, dx + 1, baseY - dh, 1, dh, C.doorHi);
  r(ctx, dx + Math.floor(dw / 2), baseY - dh, 1, dh, C.doorDark);
  px(ctx, dx + dw - 3, baseY - Math.floor(dh / 2), C.gold); // handle
}
// storefront fascia name-band spanning the wall, accent-coloured, framed in wood
function fascia(ctx, x, y, w, accentCol, text) {
  const h = 9;
  r(ctx, x - 1, y - 1, w + 2, h + 2, C.woodDark);     // frame
  r(ctx, x, y, w, h, accentCol);                       // band
  r(ctx, x, y, w, 1, "rgba(255,255,255,0.35)");
  r(ctx, x, y + h - 1, w, 1, "rgba(0,0,0,0.25)");
  // bracket bolts
  px(ctx, x + 1, y + 1, C.woodDark); px(ctx, x + w - 2, y + 1, C.woodDark);
  px(ctx, x + 1, y + h - 2, C.woodDark); px(ctx, x + w - 2, y + h - 2, C.woodDark);
  drawText(ctx, text, x, y + 2, C.black, { align: "center", w });
}
// striped, scalloped awning over a window/door
function awning(ctx, x, y, w, c1, c2) {
  for (let i = 0; i < w; i++) r(ctx, x + i, y, 1, 4, (i >> 1) % 2 ? c1 : c2);
  r(ctx, x, y, w, 1, "rgba(255,255,255,0.3)");
  // scalloped lower edge
  for (let i = 0; i < w; i += 3) { r(ctx, x + i, y + 4, 2, 1, (i >> 1) % 2 ? c1 : c2); }
  r(ctx, x - 1, y - 1, w + 2, 1, C.woodDark);
}
// projecting hanging sign (bracket + board with a 1px icon dot)
function hangingSign(ctx, x, y, accentCol, iconCol) {
  r(ctx, x, y, 6, 1, C.woodDark);          // bracket arm
  r(ctx, x + 5, y, 1, 3, C.woodDark);      // chain
  r(ctx, x + 2, y + 3, 7, 7, C.wood);      // board
  r(ctx, x + 2, y + 3, 7, 1, C.woodHi); r(ctx, x + 2, y + 9, 7, 1, C.woodDark);
  r(ctx, x + 4, y + 5, 3, 3, accentCol); px(ctx, x + 5, y + 6, iconCol);
}

// ============================================================ BUILDINGS (each unique)
export function buildForge() {
  const { ctx, w, h, cv, padTop } = buildingCanvas(BUILDING_SIZE.forge.w, BUILDING_SIZE.forge.h, 21);
  const roofBase = 22;
  // mono-slope corrugated roof (high-left → low-right): industrial, not a cottage
  shedRoof(ctx, 0, w, 0, 13, roofBase, C.stoneDark, C.stoneShade, "#6b6a7a");
  // brick chimney on the high side, with a stone cap (kept short)
  const chx = 4, chTop = -18;
  brick(ctx, chx, chTop, 12, roofBase - chTop - 2);
  r(ctx, chx - 1, chTop - 2, 14, 3, C.stoneDark); r(ctx, chx, chTop - 1, 12, 1, C.stoneShade);
  // heavy stone base
  stoneWall(ctx, 1, roofBase, w - 2, h - roofBase);
  r(ctx, 1, roofBase, w - 2, 2, C.woodDark); // timber wall-plate
  // iron name plate (right of the chimney)
  fascia(ctx, 18, roofBase + 2, w - 22, C.gold, "FORGE");
  // OPEN furnace bay — arched mouth glowing, set on a stone hearth (not cut at the ground).
  // `by` sits a few px below the fascia so the arch never overlaps the FORGE text.
  const bw = 20, bx = Math.floor(w / 2 - bw / 2 + 4), by = roofBase + 16, bh = h - by - 9;
  r(ctx, bx - 3, by - 4, bw + 6, bh + 13, C.stoneDark);     // stone surround down to base
  r(ctx, bx - 3, by - 5, bw + 6, 2, C.wood);                // timber lintel
  for (let i = 0; i < 5; i++) { r(ctx, bx + i, by - 4 + (4 - i), 1, 2, C.outline); r(ctx, bx + bw - 1 - i, by - 4 + (4 - i), 1, 2, C.outline); } // arch shoulders
  r(ctx, bx, by, bw, bh, C.outline);
  r(ctx, bx + 1, by + 1, bw - 2, bh - 1, C.furnace);
  r(ctx, bx + 3, by + 3, bw - 6, bh - 4, C.furnaceHot);
  r(ctx, bx + 6, by + 6, bw - 12, bh - 8, C.furnaceCore);
  px(ctx, bx + 4, by + 2, C.furnaceCore); px(ctx, bx + bw - 5, by + 4, C.white);
  // stone hearth + ash + embers below the opening (gives the bay a floor)
  r(ctx, bx - 1, by + bh, bw + 2, 4, C.stoneDark);
  r(ctx, bx + 2, by + bh + 1, bw - 4, 2, "#3a2418");
  px(ctx, bx + 5, by + bh + 1, C.ember); px(ctx, bx + bw - 7, by + bh + 1, C.furnace);
  // small iron door on the left
  door(ctx, 9, h, 10, 13);
  return {
    cv,
    glow: [{ x: bx + bw / 2, y: padTop + by + bh / 2 - 1, r: 8, col: "255,150,60" }],
    smoke: { x: chx + 6, y: padTop + chTop },
  };
}

export function buildStudio() {
  const { ctx, w, h, cv } = buildingCanvas(BUILDING_SIZE.studio.w, BUILDING_SIZE.studio.h, 12);
  // FLAT-roofed boutique shopfront (no gable) — reads as a high-street shop
  plasterWall(ctx, 1, 6, w - 2, h - 6, C.wall, C.wallShade);
  // parapet cornice
  r(ctx, 0, 0, w, 6, C.roseDark); r(ctx, 0, 0, w, 1, C.roseHi);
  r(ctx, -1, 4, w + 2, 2, C.woodDark);
  // rooftop potted plants on the parapet
  const pot = (x) => { r(ctx, x, -5, 5, 5, C.wood); r(ctx, x, -5, 5, 1, C.woodHi); r(ctx, x + 1, -9, 1, 4, C.leaf2); r(ctx, x - 1, -8, 4, 3, C.leaf1); px(ctx, x, -9, C.rose); px(ctx, x + 3, -8, C.gold); };
  pot(4); pot(w - 9);
  // fascia name band
  fascia(ctx, 3, 8, w - 6, C.rose, "STUDIO");
  // full-width striped awning
  awning(ctx, 1, 20, w - 2, C.rose, C.wall);
  // big display window (left) with an easel inside
  const wx = 4, wy = 28, ww = w - 18, wh = h - wy - 4;
  windowGlass(ctx, wx, wy, ww, wh, "#dff0f7");
  r(ctx, wx + 3, wy + 3, 1, wh - 5, C.wood); r(ctx, wx + ww - 5, wy + 3, 1, wh - 5, C.wood);
  r(ctx, wx + 7, wy + 6, 2, wh - 7, C.woodDark);
  r(ctx, wx + 3, wy + 3, ww - 7, Math.floor(wh * 0.5), C.wall);
  r(ctx, wx + 5, wy + 5, 4, 4, C.rose); r(ctx, wx + 9, wy + 5, 4, 4, C.cyan); r(ctx, wx + 5, wy + 9, 8, 2, C.gold);
  // glass shop door (right)
  const dx = w - 12;
  r(ctx, dx - 1, wy - 1, 10, wh + 2, C.glassFrame);
  r(ctx, dx, wy, 8, wh, "#cfe9f3"); r(ctx, dx, wy, 1, wh, C.glassHi);
  r(ctx, dx + 4, wy, 1, wh, C.glassFrame); px(ctx, dx + 6, wy + Math.floor(wh / 2), C.gold);
  // flower box beneath the window
  r(ctx, wx, wy + wh, ww, 3, C.wood); r(ctx, wx, wy + wh, ww, 1, C.woodHi);
  for (let i = wx + 1; i < wx + ww - 1; i += 3) { px(ctx, i, wy + wh - 1, C.rose); px(ctx, i + 1, wy + wh - 1, C.gold); px(ctx, i, wy + wh - 2, C.leaf1); }
  return { cv, glow: null, smoke: null };
}

export function buildWorkshop() {
  const { ctx, w, h, cv, padTop } = buildingCanvas(BUILDING_SIZE.workshop.w, BUILDING_SIZE.workshop.h, 26);
  const roofBase = 18;
  // low-pitch cool roof
  hipRoof(ctx, 0, w, 2, roofBase, C.cyanDark, C.cyan, C.cyanHi);
  // rooftop antenna + dish + blinking light (baked base; engine blinks)
  const ax = w - 14;
  r(ctx, ax, -22, 2, 24, C.metalDark);
  r(ctx, ax - 4, -22, 10, 2, C.metal); r(ctx, ax - 2, -19, 6, 2, C.metal);
  r(ctx, ax + 1, -24, 2, 2, C.led);
  // satellite dish (left)
  disc(ctx, 9, -8, 6, C.metalDark); disc(ctx, 9, -8, 4, C.metal); r(ctx, 9, -8, 2, 8, C.metalDark);
  // steel walls with metal trim
  plasterWall(ctx, 1, roofBase, w - 2, h - roofBase, "#dfe2ea", "#bcc1cd");
  r(ctx, 1, roofBase, w - 2, 1, C.outline);
  for (let bx = 1; bx < w; bx += 8) r(ctx, bx, roofBase, 1, h - roofBase, "#c6cad6");
  fascia(ctx, 3, roofBase + 1, w - 6, C.cyan, "WORKSHOP");
  // big monitor window with code lines
  const mx = 4, my = roofBase + 12, mw = 18, mh = 14;
  r(ctx, mx - 1, my - 1, mw + 2, mh + 2, C.outline);
  r(ctx, mx, my, mw, mh, C.screen);
  for (let i = 0; i < 5; i++) r(ctx, mx + 2, my + 2 + i * 2, 3 + ((i * 5) % (mw - 6)), 1, C.screenLine);
  // server-rack window with blinking LEDs (right)
  const sx = mx + mw + 3, sy = my, sw = w - sx - 4;
  r(ctx, sx - 1, sy - 1, sw + 2, mh + 2, C.outline); r(ctx, sx, sy, sw, mh, "#20242c");
  for (let yy = sy + 1; yy < sy + mh - 1; yy += 3) { px(ctx, sx + 1, yy, C.led); px(ctx, sx + 3, yy, C.gold); }
  // exposed gear on the wall
  // door
  door(ctx, w / 2, h, 12, 15);
  hangingSign(ctx, w - 9, roofBase + 11, C.cyan, C.metalHi);
  return {
    cv,
    glow: [{ x: mx + mw / 2, y: padTop + my + mh / 2, r: 7, col: "84,207,194" }],
    blink: { x: ax + 1, y: padTop - 24 }, smoke: null,
  };
}

export function buildGuild() {
  const { ctx, w, h, cv } = buildingCanvas(BUILDING_SIZE.guild.w, BUILDING_SIZE.guild.h, 24);
  const roofBase = 22;
  // grand two-slope roof
  gableRoof(ctx, 0, w, -14, roofBase, C.goldDark, C.gold, C.goldHi);
  // flag on the peak
  r(ctx, w / 2 - 1, -22, 2, 9, C.woodDark);
  r(ctx, w / 2 + 1, -22, 7, 5, C.rose); r(ctx, w / 2 + 1, -22, 7, 1, C.roseHi);
  // walls: plaster with timber framing
  plasterWall(ctx, 1, roofBase, w - 2, h - roofBase, C.wall, C.wallShade);
  for (let bx = 0; bx <= w; bx += TILE) r(ctx, bx === 0 ? 1 : bx - 1, roofBase, 2, h - roofBase, C.woodDark);
  r(ctx, 1, roofBase, w - 2, 2, C.woodDark); r(ctx, 1, h - 4, w - 2, 2, C.woodDark);
  fascia(ctx, 6, roofBase + 3, w - 12, C.gold, "QUESTS");
  // three hanging banners for the 3 SaaS
  const bcols = [C.gold, C.cyan, C.rose];
  bcols.forEach((bc, i) => {
    const bx = 8 + i * Math.floor((w - 16) / 3) + Math.floor((w - 16) / 6) - 3;
    r(ctx, bx, roofBase + 13, 7, 12, bc);
    r(ctx, bx, roofBase + 13, 7, 1, "rgba(255,255,255,0.35)");
    r(ctx, bx + 1, roofBase + 25, 2, 2, bc); r(ctx, bx + 4, roofBase + 25, 2, 2, bc);
    px(ctx, bx + 3, roofBase + 18, C.black);
  });
  // grand double door
  const dcx = w / 2;
  r(ctx, dcx - 9, h - 19, 18, 19, C.woodDark);
  r(ctx, dcx - 8, h - 18, 8, 18, C.door); r(ctx, dcx, h - 18, 8, 18, C.door);
  r(ctx, dcx - 8, h - 18, 8, 1, C.doorHi); r(ctx, dcx, h - 18, 8, 1, C.doorHi);
  px(ctx, dcx - 2, h - 9, C.gold); px(ctx, dcx + 1, h - 9, C.gold);
  return { cv, glow: null, smoke: null };
}

export function buildInn() {
  const { ctx, w, h, cv, padTop } = buildingCanvas(BUILDING_SIZE.inn.w, BUILDING_SIZE.inn.h, 24);
  const roofBase = 18;
  gableRoof(ctx, 0, w, -14, roofBase, C.woodDark, C.woodLight, C.wood);
  // roof dormer (a small gabled window poking from the roof) → upper storey
  const dx = Math.floor(w / 2 - 5);
  for (let i = 0; i < 6; i++) { r(ctx, dx + i, -9 + i, 1, 9 - i, C.wood); r(ctx, dx + 10 - i, -9 + i, 1, 9 - i, C.wood); }
  r(ctx, dx + 2, -3, 6, 5, C.glassFrame); r(ctx, dx + 3, -2, 4, 4, C.gold); px(ctx, dx + 5, -1, C.goldHi);
  // chimney (right) with smoke
  r(ctx, w - 13, -16, 7, 12, C.woodDark); r(ctx, w - 12, -15, 5, 11, C.wood); r(ctx, w - 12, -15, 5, 1, C.woodHi);
  // warm plaster + timber-framed walls
  plasterWall(ctx, 1, roofBase, w - 2, h - roofBase, "#f0dcb6", "#d8bf90");
  for (let bx = 4; bx < w - 2; bx += 13) r(ctx, bx, roofBase + 1, 2, h - roofBase - 1, C.woodDark);
  // upper-floor warm windows (row just under the eaves)
  const upper = (x) => { r(ctx, x - 1, roofBase + 2, 8, 7, C.glassFrame); r(ctx, x, roofBase + 3, 6, 5, C.gold); r(ctx, x + 3, roofBase + 3, 1, 5, C.glassFrame); r(ctx, x, roofBase + 3, 6, 1, C.goldHi); };
  upper(5); upper(w - 12);
  // fascia name band (between floors)
  fascia(ctx, 4, roofBase + 11, w - 8, C.wood, "THE INN");
  // covered porch — a small shed roof on two posts over the door
  const pY = h - 17;
  r(ctx, 5, pY - 1, w - 10, 1, C.wood); r(ctx, 5, pY, w - 10, 3, C.woodDark); r(ctx, 6, pY, w - 12, 1, C.woodLight);
  r(ctx, 8, pY + 3, 2, h - pY - 3, C.woodDark); r(ctx, w - 10, pY + 3, 2, h - pY - 3, C.woodDark);
  // ground-floor warm windows beside the porch
  r(ctx, 3, pY + 4, 4, 6, C.glassFrame); r(ctx, 4, pY + 5, 2, 4, C.gold);
  r(ctx, w - 7, pY + 4, 4, 6, C.glassFrame); r(ctx, w - 6, pY + 5, 2, 4, C.gold);
  // door under the porch
  door(ctx, w / 2, h, 12, 14);
  // projecting tavern sign with a mug
  hangingSign(ctx, 1, roofBase + 12, C.gold, C.white);
  return {
    cv,
    glow: [
      { x: 8, y: padTop + roofBase + 6, r: 5, col: "230,187,82" },
      { x: w - 9, y: padTop + roofBase + 6, r: 5, col: "230,187,82" },
      { x: 5, y: padTop + pY + 7, r: 4, col: "230,187,82" },
      { x: w - 5, y: padTop + pY + 7, r: 4, col: "230,187,82" },
    ],
    smoke: { x: w - 10, y: padTop - 16 },
  };
}

// Stone archway holding a swirling portal — the gateway from the pixel
// world to the Studio (scroll) world. Swirl uses the studio's accents.
export function buildPortal() {
  const { ctx, w, h, cv, padTop } = buildingCanvas(BUILDING_SIZE.portal.w, BUILDING_SIZE.portal.h, 14);
  const cx = w / 2, cy = 17, R = 20, rIn = 12, base = h - 6;
  const inOpening = (x, y) => {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    return y <= cy ? Math.hypot(dx, dy) < rIn : Math.abs(dx) < rIn && y < base;
  };
  // portal swirl (drawn first; the arch frames it)
  const swirl = ["#0b0b0e", "#141018", "#2a1f12", "#7a5a22", C.gold, C.goldHi];
  const pcy = cy + 9;
  for (let y = cy - rIn; y < base; y++) {
    for (let x = Math.floor(cx - rIn); x < cx + rIn; x++) {
      if (!inOpening(x, y)) continue;
      const dx = x + 0.5 - cx, dy = y + 0.5 - pcy;
      const d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
      const v = Math.sin(d * 0.85 - a * 2.0);
      const glow = Math.max(0, 1 - d / 15);
      let i = v > 0.82 ? 3 : v > 0.45 ? 2 : 1;
      if (glow > 0.62) i = Math.min(5, i + 2);
      else if (glow > 0.35) i = Math.min(4, i + 1);
      px(ctx, x, y, swirl[i]);
      const n = hash(x * 7 + 3, y * 13 + 1);
      if (n > 0.965) px(ctx, x, y, C.cyanHi);
      else if (n < 0.03) px(ctx, x, y, C.roseHi);
    }
  }
  // stone arch ring
  for (let y = cy - R; y <= cy; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d >= rIn && d < R) {
        const seg = Math.floor((Math.atan2(y + 0.5 - cy, x + 0.5 - cx) + Math.PI) * 4);
        px(ctx, x, y, d > R - 1.2 ? C.stoneDark : d < rIn + 1.2 ? C.stoneDark : seg % 2 ? C.stone : C.stoneShade);
      }
    }
  }
  // gold keystone
  r(ctx, cx - 3, cy - R - 1, 6, 9, C.outline); r(ctx, cx - 2, cy - R, 4, 7, C.gold); r(ctx, cx - 2, cy - R, 4, 1, C.goldHi);
  // pillars
  const pillar = (x) => {
    r(ctx, x, cy, 8, base - cy, C.stone);
    for (let yy = cy + 3, k = 0; yy < base; yy += 4, k++) {
      r(ctx, x, yy, 8, 1, C.stoneShade);
      px(ctx, x + (k % 2 ? 2 : 5), yy - 2, C.stoneShade); px(ctx, x + (k % 2 ? 2 : 5), yy - 1, C.stoneShade);
      r(ctx, x + 1, yy - 3, 6, 1, C.stoneHi);
    }
    r(ctx, x, cy, 1, base - cy, C.stoneDark); r(ctx, x + 7, cy, 1, base - cy, C.stoneDark);
    r(ctx, x - 1, cy - 1, 10, 2, C.stoneDark); r(ctx, x - 1, cy - 1, 10, 1, C.stoneHi);
  };
  pillar(cx - R); pillar(cx + R - 8);
  // stepped plinth
  r(ctx, 1, base, w - 2, 6, C.stoneDark); r(ctx, 2, base, w - 4, 1, C.stoneHi);
  r(ctx, cx - rIn - 2, base - 1, rIn * 2 + 4, 2, C.stoneShade);
  // name plaque on the plinth
  r(ctx, cx - 14, base - 1, 28, 7, C.outline);
  r(ctx, cx - 13, base, 26, 5, "#1c1c24");
  drawText(ctx, "PORTAL", cx - 13, base, C.gold, { align: "center", w: 26 });
  return {
    cv,
    glow: [
      { x: cx, y: padTop + pcy, r: 13, col: "212,168,72" },
      { x: cx, y: padTop + pcy - 4, r: 7, col: "79,209,197" },
    ],
    smoke: null,
  };
}

export const BUILD_BY_KIND = {
  forge: buildForge, studio: buildStudio, workshop: buildWorkshop,
  guild: buildGuild, inn: buildInn, portal: buildPortal,
};

// ============================================================ WAYFINDING SIGNPOST
// A central post with directional arrow-boards pointing to each shop.
export function buildSignpost(dirs = []) {
  // dirs: [{ text, side: 'left'|'right', col }]
  const maxTW = Math.max(8, ...dirs.map((d) => textWidth(d.text)));
  const boardW = maxTW + 5;          // text + inner padding
  const arrow = 4;
  const W = (boardW + arrow) * 2 + 6;
  const H = 11 + dirs.length * 9 + 7;
  const o = makeCanvas(W, H); const { ctx } = o; const cx = Math.floor(W / 2);
  // post + cap + base
  r(ctx, cx - 1, 6, 3, H - 9, C.wood); r(ctx, cx - 1, 6, 1, H - 9, C.woodHi); r(ctx, cx + 1, 6, 1, H - 9, C.woodDark);
  r(ctx, cx - 3, 4, 7, 3, C.woodDark); r(ctx, cx - 2, 5, 5, 1, C.woodLight);
  r(ctx, cx - 3, H - 3, 7, 3, C.woodDark);
  dirs.forEach((d, i) => {
    const y = 11 + i * 9;
    const x = d.side === "left" ? cx - 2 - boardW : cx + 2;
    r(ctx, x, y, boardW, 8, C.wood);
    r(ctx, x, y, boardW, 1, C.woodHi); r(ctx, x, y + 7, boardW, 1, C.woodDark);
    r(ctx, x, y, 1, 8, C.woodDark); r(ctx, x + boardW - 1, y, 1, 8, C.woodDark);
    // outward-pointing arrow
    if (d.side === "left") for (let k = 0; k < arrow; k++) r(ctx, x - 1 - k, y + 2, 1, Math.max(1, 4 - k), C.wood);
    else for (let k = 0; k < arrow; k++) r(ctx, x + boardW + k, y + 2, 1, Math.max(1, 4 - k), C.wood);
    // cream lettering for contrast; the destination colour lives on the arrow tip
    drawText(ctx, d.text, x + 3, y + 2, "#fff1d6", { shadow: C.woodDark });
    r(ctx, d.side === "left" ? x - 2 : x + boardW, y + 3, 2, 2, d.col || C.gold);
  });
  return o.cv;
}

// ============================================================ TREES
// Canopies are built from bumpy "cloud" blobs in 4 layers — outline, shade,
// body, sunlit top-left — so every tree reads as a rounded, lit volume.
const LEAF = {
  green:  { out: "#1d4626", dark: "#2b6a37", base: "#3b8a43", light: "#55a84f", hi: "#86cf6c", fleck: "#2f7a3c" },
  bright: { out: "#22502a", dark: "#327a3b", base: "#46a04a", light: "#66bd57", hi: "#9ade78", fleck: "#378444" },
  pine:   { out: "#173a22", dark: "#22573a", base: "#2f7048", light: "#3f8a56", hi: "#62ad70" },
};
function blob(ctx, cx, cy, R, col, seed) {
  disc(ctx, cx, cy, R, col);
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2 + hash(seed, k) * 0.5;
    const rr = R * (0.4 + hash(k, seed) * 0.16);
    disc(ctx, cx + Math.cos(a) * R * 0.74, cy + Math.sin(a) * R * 0.66, rr, col);
  }
}
function canopy(ctx, cx, cy, R, P, seed) {
  blob(ctx, cx, cy, R + 1, P.out, seed);
  blob(ctx, cx, cy, R, P.dark, seed);
  blob(ctx, cx - 1, cy - 1.6, R - 2.2, P.base, seed);
  blob(ctx, cx - 2.6, cy - 3.6, R - 6.2, P.light, seed + 3);
  for (let i = 0; i < 30; i++) {
    const a = hash(i, seed) * 7, rad = hash(seed, i) * (R - 2.5);
    const x = Math.round(cx + Math.cos(a) * rad), y = Math.round(cy + Math.sin(a) * rad * 0.9);
    if (y < cy - 3 && x < cx + 2) { px(ctx, x, y, P.hi); if (hash(i, 77) > 0.5) px(ctx, x + 1, y, P.hi); }
    else if (y > cy) px(ctx, x, y, P.fleck);
  }
}
function trunk(ctx, cx, top, bottom) {
  r(ctx, cx - 3, top, 6, bottom - top, C.outline);
  r(ctx, cx - 2, top, 4, bottom - top - 1, C.trunk);
  r(ctx, cx - 2, top, 1, bottom - top - 1, C.trunkHi);
  r(ctx, cx + 1, top, 1, bottom - top - 1, C.trunkDark);
  // root flare
  r(ctx, cx - 4, bottom - 3, 8, 2, C.outline); r(ctx, cx - 3, bottom - 3, 6, 1, C.trunk);
  r(ctx, cx - 2, top, 4, 3, C.trunkDark); // canopy shade on the trunk
}
export function buildTree(type = "oak") {
  const seed = { oak: 3, blossom: 5, fruit: 9, bushy: 13, pine: 17 }[type] || 3;
  if (type === "pine") {
    const o = makeCanvas(TILE * 2, TILE * 3 + 4); const { ctx } = o; const cx = TILE;
    trunk(ctx, cx, TILE * 2 + 4, TILE * 3 + 4);
    const P = LEAF.pine;
    for (let k = 0; k < 4; k++) {
      const top = 1 + k * 8, half = 5 + k * 3, rows = 11;
      for (let row = 0; row < rows; row++) {
        const w = Math.max(1, Math.round((row / (rows - 1)) * half));
        const y = top + row;
        r(ctx, cx - w - 1, y, w * 2 + 2, 1, P.out);
        r(ctx, cx - w, y, w * 2, 1, P.dark);
        r(ctx, cx - w, y, Math.max(1, w), 1, row < rows - 2 ? P.light : P.base);
        if (row > 2 && row < rows - 2) px(ctx, cx - Math.max(1, Math.floor(w * 0.5)), y, P.hi);
      }
      r(ctx, cx - half - 1, top + rows - 1, half * 2 + 2, 1, P.out);
      // jagged hem
      for (let x = cx - half + 1; x < cx + half; x += 3) px(ctx, x, top + rows - 1, P.dark);
    }
    return o.cv;
  }
  if (type === "bushy") {
    const o = makeCanvas(TILE * 2, TILE * 2 + 6); const { ctx } = o; const cx = TILE;
    trunk(ctx, cx, TILE + 6, TILE * 2 + 6);
    canopy(ctx, cx, TILE - 1, 11, LEAF.bright, seed);
    return o.cv;
  }
  // oak / blossom / fruit
  const o = makeCanvas(TILE * 2, TILE * 3); const { ctx } = o; const cx = TILE;
  trunk(ctx, cx, TILE * 2 - 4, TILE * 3);
  canopy(ctx, cx, TILE + 1, 14, LEAF.green, seed);
  if (type === "blossom" || type === "fruit") {
    const dot = type === "blossom" ? C.blossom : C.fruit, hi = type === "blossom" ? C.blossomHi : C.fruitHi;
    const dk = type === "blossom" ? "#d97a9f" : "#a8331c";
    const N = type === "blossom" ? 18 : 11;
    for (let i = 0; i < N; i++) {
      const a = i * 2.399 + seed, rad = 2 + Math.sqrt((i + 0.5) / N) * 10.5;
      const x = Math.round(cx + Math.cos(a) * rad), y = Math.round(TILE + 1 + Math.sin(a) * rad * 0.85);
      if (type === "blossom") { px(ctx, x, y, dot); px(ctx, x + 1, y, dot); px(ctx, x, y + 1, dk); px(ctx, x + 1, y - 1, hi); }
      else { r(ctx, x, y, 2, 2, dot); px(ctx, x, y, hi); px(ctx, x + 1, y + 1, dk); px(ctx, x, y - 1, "#2f6a2a"); }
    }
  }
  return o.cv;
}

// ============================================================ PROPS
export function buildBush() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  disc(ctx, 8, 9, 6, C.leaf2); disc(ctx, 7, 8, 4, C.leaf1);
  px(ctx, 5, 6, C.leafHi); px(ctx, 9, 7, C.leafHi); px(ctx, 6, 9, C.blossom);
  return o.cv;
}
export function buildLamp() {
  const o = makeCanvas(TILE, TILE * 2); const { ctx } = o;
  r(ctx, 7, 8, 2, TILE * 2 - 8, C.woodDark); r(ctx, 6, TILE * 2 - 2, 4, 2, C.woodDark);
  r(ctx, 5, 3, 6, 6, C.metalDark); r(ctx, 6, 4, 4, 4, C.gold); r(ctx, 6, 4, 4, 4, C.furnaceHot);
  r(ctx, 5, 2, 6, 1, C.metalDark); px(ctx, 8, 1, C.metalDark);
  return { cv: o.cv, glow: [{ x: 8, y: 6, r: 8, col: "230,187,82" }] };
}
export function buildAnvil() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  r(ctx, 4, 11, 8, 4, C.trunk); r(ctx, 4, 11, 8, 1, C.woodDark);
  r(ctx, 3, 7, 10, 2, C.stoneDark); r(ctx, 5, 9, 6, 2, C.stoneShade);
  r(ctx, 11, 6, 3, 2, C.stoneDark); r(ctx, 4, 6, 5, 1, C.metalHi);
  return o.cv;
}
export function buildEasel() {
  const o = makeCanvas(TILE, TILE + 4); const { ctx } = o;
  r(ctx, 4, 4, 2, TILE, C.wood); r(ctx, 10, 4, 2, TILE, C.wood); r(ctx, 7, 8, 2, TILE - 4, C.woodDark);
  r(ctx, 2, 2, 12, 9, C.wall); r(ctx, 2, 2, 12, 1, C.woodDark);
  r(ctx, 4, 4, 4, 4, C.rose); r(ctx, 8, 4, 4, 3, C.cyan); r(ctx, 4, 8, 8, 2, C.gold);
  return o.cv;
}
export function buildGear() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  const cog = (cx, cy, rad, col) => {
    disc(ctx, cx, cy, rad, col);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * 7; px(ctx, Math.round(cx + Math.cos(a) * rad), Math.round(cy + Math.sin(a) * rad), col); }
    r(ctx, cx - 1, cy - 1, 2, 2, C.outline);
  };
  cog(6, 9, 4, C.metalDark); cog(11, 6, 3, C.metal);
  return o.cv;
}
export function buildBarrel() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  r(ctx, 5, 4, 6, 11, C.wood); r(ctx, 5, 4, 1, 11, C.woodDark); r(ctx, 10, 4, 1, 11, C.woodDark);
  r(ctx, 4, 6, 8, 1, C.metalDark); r(ctx, 4, 12, 8, 1, C.metalDark); r(ctx, 5, 4, 6, 1, C.woodLight);
  return o.cv;
}
export function buildCrate() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  r(ctx, 3, 5, 10, 10, C.woodLight); r(ctx, 3, 5, 10, 1, C.woodHi); r(ctx, 3, 14, 10, 1, C.woodDark);
  r(ctx, 3, 5, 1, 10, C.woodDark); r(ctx, 12, 5, 1, 10, C.woodDark);
  r(ctx, 3, 9, 10, 1, C.woodDark); r(ctx, 7, 5, 1, 10, C.woodDark);
  return o.cv;
}
export function buildFlowerbox() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  r(ctx, 2, 9, 12, 5, C.wood); r(ctx, 2, 9, 12, 1, C.woodHi); r(ctx, 2, 13, 12, 1, C.woodDark);
  for (let i = 3; i < 13; i += 3) { px(ctx, i, 8, C.rose); px(ctx, i + 1, 7, C.gold); r(ctx, i, 9, 1, 1, C.leaf1); }
  return o.cv;
}
export function buildBench() {
  const o = makeCanvas(TILE + 6, TILE); const { ctx } = o;
  r(ctx, 1, 6, TILE + 4, 3, C.woodLight); r(ctx, 1, 6, TILE + 4, 1, C.woodHi);
  r(ctx, 1, 4, TILE + 4, 2, C.wood);
  r(ctx, 2, 9, 2, 5, C.woodDark); r(ctx, TILE + 1, 9, 2, 5, C.woodDark);
  return o.cv;
}
export function buildWell() {
  const o = makeCanvas(TILE * 2, TILE * 2); const { ctx } = o; const cx = TILE;
  r(ctx, 4, TILE + 2, TILE * 2 - 8, 10, C.stone); stoneWall(ctx, 4, TILE + 2, TILE * 2 - 8, 10);
  disc(ctx, cx, TILE + 6, 7, C.stoneDark); disc(ctx, cx, TILE + 6, 5, C.water1); px(ctx, cx - 2, TILE + 4, C.waterFoam);
  r(ctx, 5, 2, 2, TILE, C.wood); r(ctx, TILE * 2 - 7, 2, 2, TILE, C.wood);
  r(ctx, 3, 0, TILE * 2 - 6, 4, C.woodDark); r(ctx, 4, 1, TILE * 2 - 8, 2, C.woodLight);
  return o.cv;
}
export function buildFountain() {
  // Grand 3-tier fountain. Footprint stays 2×2 in the world; the sprite is
  // larger and overhangs (like a tree canopy) so it reads as a real centerpiece.
  const W = 48, H = 56;
  const o = makeCanvas(W, H); const { ctx } = o; const cx = Math.floor(W / 2); // 24
  // --- lower basin (wide tiered stone) ---
  r(ctx, 2, 42, W - 4, 13, C.stoneDark);
  r(ctx, 5, 40, W - 10, 12, C.stone); r(ctx, 5, 40, W - 10, 1, C.stoneHi);
  r(ctx, 1, 48, W - 2, 5, C.stoneDark); r(ctx, 4, 46, W - 8, 2, C.stoneShade);
  // water pool
  r(ctx, 8, 42, W - 16, 7, C.water1);
  r(ctx, 9, 42, 6, 1, C.water2); r(ctx, W - 16, 44, 6, 1, C.water2);
  px(ctx, 13, 45, C.waterFoam); px(ctx, W - 14, 43, C.waterFoam); px(ctx, 17, 47, C.waterFoam);
  // --- lower pedestal ---
  r(ctx, cx - 4, 28, 8, 14, C.stone); r(ctx, cx - 4, 28, 2, 14, C.stoneShade); r(ctx, cx + 2, 28, 2, 14, C.stoneDark);
  // --- mid bowl (tier 2) ---
  r(ctx, cx - 12, 26, 24, 4, C.stoneDark); r(ctx, cx - 11, 24, 22, 3, C.stone); r(ctx, cx - 11, 24, 22, 1, C.stoneHi);
  r(ctx, cx - 9, 24, 18, 1, C.water2);
  r(ctx, cx - 11, 27, 1, 14, C.water2); r(ctx, cx + 10, 27, 1, 14, C.water2); // overflow streams
  // --- upper pedestal ---
  r(ctx, cx - 2, 16, 4, 10, C.stone); r(ctx, cx - 2, 16, 1, 10, C.stoneShade);
  // --- top bowl (tier 3) ---
  r(ctx, cx - 6, 14, 12, 3, C.stoneDark); r(ctx, cx - 5, 12, 10, 3, C.stone); r(ctx, cx - 5, 12, 10, 1, C.stoneHi);
  r(ctx, cx - 4, 13, 8, 1, C.water2);
  r(ctx, cx - 5, 15, 1, 10, C.water2); r(ctx, cx + 4, 15, 1, 10, C.water2); // overflow
  // --- jet + droplets ---
  r(ctx, cx - 1, 3, 2, 10, C.water2); r(ctx, cx - 1, 3, 1, 10, C.waterFoam);
  px(ctx, cx, 1, C.waterFoam); px(ctx, cx - 2, 5, C.water2); px(ctx, cx + 1, 7, C.water2);
  return { cv: o.cv, glow: [{ x: cx, y: 45, r: 9, col: "150,220,255" }] };
}
export function buildNoticeBoard() {
  const o = makeCanvas(TILE * 2, TILE * 2 + 4); const { ctx } = o; const w = TILE * 2;
  r(ctx, 4, 12, 3, TILE * 2 - 8, C.woodDark); r(ctx, w - 7, 12, 3, TILE * 2 - 8, C.woodDark);
  r(ctx, 1, 2, w - 2, TILE + 4, C.wood); r(ctx, 1, 2, w - 2, 2, C.woodHi); r(ctx, 1, TILE + 4, w - 2, 2, C.woodDark);
  r(ctx, 1, 2, 2, TILE + 4, C.woodDark); r(ctx, w - 3, 2, 2, TILE + 4, C.woodDark);
  // pinned papers
  r(ctx, 5, 6, 8, 9, C.wall); r(ctx, 17, 7, 8, 8, C.wall);
  px(ctx, 9, 5, C.rose); px(ctx, 21, 6, C.cyan);
  ctx.fillStyle = C.stoneDark;
  for (let i = 0; i < 4; i++) { ctx.fillRect(6, 8 + i * 2, 6, 1); ctx.fillRect(18, 9 + i * 2, 6, 1); }
  return o.cv;
}

// ============================================================ FARM + PICNIC PROPS
// Windmill body (3×4 footprint). The sails are separate frames
// (buildWindmillSails) so the engine can turn them.
export function buildWindmill() {
  const W = TILE * 3, H = TILE * 4, pad = 20;
  const o = makeCanvas(W, H + pad); const { ctx } = o; ctx.translate(0, pad);
  const cx = W / 2;
  // tapered plaster tower
  for (let y = 10; y < H - 2; y++) {
    const half = 9 + Math.round(((y - 10) / (H - 12)) * 6);
    r(ctx, cx - half, y, half * 2, 1, C.wall);
    px(ctx, cx - half, y, C.wallShade); px(ctx, cx + half - 1, y, C.wallLine);
    r(ctx, cx + half - 4, y, 3, 1, C.wallShade);
  }
  // wooden bands
  for (const y of [24, 40]) { const half = 9 + Math.round(((y - 10) / (H - 12)) * 6); r(ctx, cx - half, y, half * 2, 2, C.wood); r(ctx, cx - half, y, half * 2, 1, C.woodHi); }
  // conical red roof
  for (let y = -6; y < 12; y++) {
    const half = Math.max(1, Math.round(((y + 6) / 18) * 12));
    r(ctx, cx - half, y, half * 2, 1, y > 8 ? "#a8483a" : "#c95a48");
    if (half > 2) px(ctx, cx - half + 1, y, "#e07a63");
  }
  r(ctx, cx - 13, 11, 26, 2, "#7d342b");
  // round window + door
  disc(ctx, cx, 30, 3, C.glassFrame); disc(ctx, cx, 30, 2, C.glass); px(ctx, cx - 1, 29, C.glassHi);
  r(ctx, cx - 5, H - 15, 10, 13, C.doorDark); r(ctx, cx - 4, H - 14, 8, 12, C.door); r(ctx, cx - 4, H - 14, 8, 1, C.doorHi);
  disc(ctx, cx, H - 15, 4, C.door); r(ctx, cx - 4, H - 16, 8, 1, C.doorHi);
  px(ctx, cx + 2, H - 8, C.gold);
  r(ctx, cx - 8, H - 2, 16, 2, C.stoneDark);
  // hub
  disc(ctx, cx, 8, 3, C.woodDark); disc(ctx, cx, 8, 1.6, C.woodLight);
  return { cv: o.cv, hub: { x: cx, y: pad + 8 }, glow: [{ x: cx, y: pad + 30, r: 6, col: "255,214,140", night: true }] };
}
// N frames of the four sails turning through 90° (4-fold symmetric loop)
export function buildWindmillSails(frames = 8) {
  const S = 64, c = S / 2, out = [];
  for (let f = 0; f < frames; f++) {
    const o = makeCanvas(S, S); const { ctx } = o;
    const a0 = (f / frames) * (Math.PI / 2);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = x + 0.5 - c, dy = y + 0.5 - c;
      for (let k = 0; k < 4; k++) {
        const a = a0 + (k * Math.PI) / 2, ca = Math.cos(a), sa = Math.sin(a);
        const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
        if (u < 0 || u > 29) continue;
        if (Math.abs(v) < 0.9) { px(ctx, x, y, C.woodDark); break; }
        if (u > 6 && v > 0.9 && v < 8) {
          const grid = Math.floor(u) % 5 === 0 || Math.floor(v) % 4 === 0;
          px(ctx, x, y, grid ? C.wood : (Math.floor(u / 5) % 2 ? "#fbf3e2" : "#efe3c8"));
          break;
        }
      }
    }
    out.push(o.cv);
  }
  return out;
}
export function buildCoop() {
  const W = TILE * 2, H = TILE * 2, pad = 8;
  const o = makeCanvas(W, H + pad); const { ctx } = o; ctx.translate(0, pad);
  // stilts + body
  r(ctx, 4, H - 6, 2, 6, C.woodDark); r(ctx, W - 6, H - 6, 2, 6, C.woodDark);
  r(ctx, 2, 6, W - 4, H - 12, "#d9544a"); r(ctx, 2, 6, W - 4, 1, "#f07a6e");
  for (let x = 4; x < W - 2; x += 4) r(ctx, x, 7, 1, H - 13, "#b8433a");
  r(ctx, 2, H - 7, W - 4, 1, C.woodDark);
  // white trim + roof
  for (let y = -6; y < 7; y++) { const half = Math.round(((y + 6) / 12) * (W / 2 + 1)); r(ctx, W / 2 - half, y, half * 2, 1, y > 4 ? C.woodDark : C.wood); }
  r(ctx, W / 2 - 1, -6, 2, 1, C.woodHi);
  // little round door + ramp
  disc(ctx, W / 2, 15, 4, C.outline); r(ctx, W / 2 - 4, 15, 8, 4, C.outline);
  r(ctx, W / 2 - 3, H - 6, 6, 2, C.woodLight); r(ctx, W / 2 - 2, H - 4, 6, 2, C.wood); r(ctx, W / 2 - 1, H - 2, 6, 2, C.woodLight);
  // straw poking out
  px(ctx, W / 2 - 2, 18, "#ecc96b"); px(ctx, W / 2 + 1, 18, "#ecc96b");
  return o.cv;
}
export function buildScarecrow() {
  const o = makeCanvas(TILE + 4, TILE * 2); const { ctx } = o; const cx = 10;
  r(ctx, cx - 1, 8, 2, 24, C.woodDark);
  r(ctx, 1, 12, 18, 2, C.wood);
  // shirt
  r(ctx, cx - 5, 11, 10, 9, "#5b86c9"); r(ctx, cx - 5, 11, 10, 1, "#7fa6e0"); r(ctx, cx - 1, 13, 2, 2, "#e45b5b");
  px(ctx, 1, 14, "#ecc96b"); px(ctx, 2, 15, "#ecc96b"); px(ctx, 18, 14, "#ecc96b"); px(ctx, 17, 15, "#ecc96b");
  // sack head + straw hat
  disc(ctx, cx, 7, 4, "#e8d2a2"); px(ctx, cx - 2, 7, C.outline); px(ctx, cx + 1, 7, C.outline);
  r(ctx, cx - 1, 9, 3, 1, "#b88f4e");
  r(ctx, cx - 7, 3, 14, 1, "#b8923f"); r(ctx, cx - 7, 2, 14, 1, "#ecc96b"); r(ctx, cx - 3, 0, 6, 2, "#ecc96b"); r(ctx, cx - 3, 1, 6, 1, "#c4604d");
  return o.cv;
}
export function buildMushrooms() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  const m = (x, y, s, cap) => { r(ctx, x - 1, y, 2, s, "#fff4ea"); disc(ctx, x, y, s, cap); px(ctx, x - 1, y - 1, "#fff4ea"); if (s > 2) px(ctx, x + 1, y - 2, "#fff4ea"); r(ctx, x - s, y, s * 2, 1, "#b8433a"); };
  m(6, 9, 3, "#e45b5b"); m(11, 11, 2, "#e45b5b"); m(3, 12, 1.6, "#f08a3a");
  return o.cv;
}
export function buildRock() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  disc(ctx, 8, 11, 5, C.stoneDark); disc(ctx, 7.5, 10, 4.4, C.stone); r(ctx, 5, 8, 3, 1, C.stoneHi); px(ctx, 10, 12, C.cobbleMoss); px(ctx, 11, 12, C.cobbleMoss);
  return o.cv;
}
export function buildBasket() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  r(ctx, 3, 8, 10, 6, "#b67c46"); r(ctx, 3, 8, 10, 1, "#c98f57");
  for (let x = 4; x < 13; x += 2) r(ctx, x, 9, 1, 5, "#9a6437");
  r(ctx, 3, 13, 10, 1, "#7a4d28");
  ctx.strokeStyle = "#7a4d28"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(8, 8, 4.5, Math.PI, 0); ctx.stroke();
  px(ctx, 5, 7, "#e0542f"); px(ctx, 6, 7, "#e0542f"); px(ctx, 9, 7, "#9bd36d"); px(ctx, 10, 7, "#ffd166");
  return o.cv;
}
export function buildSunflower() {
  const o = makeCanvas(TILE, TILE * 2); const { ctx } = o;
  r(ctx, 7, 10, 2, 22, C.leaf2); r(ctx, 3, 18, 4, 2, C.leaf1); r(ctx, 9, 22, 4, 2, C.leaf1);
  disc(ctx, 8, 7, 5.4, "#ffd23f"); disc(ctx, 8, 7, 2.6, "#7a4d28"); px(ctx, 7, 6, "#a8743c");
  return o.cv;
}
export function buildHay() {
  const o = makeCanvas(TILE, TILE); const { ctx } = o;
  r(ctx, 2, 5, 12, 9, "#e3c25e"); r(ctx, 2, 5, 12, 1, "#f5dc8a"); r(ctx, 2, 13, 12, 1, "#b8923f");
  r(ctx, 2, 8, 12, 1, "#c9a548"); r(ctx, 2, 11, 12, 1, "#c9a548");
  r(ctx, 5, 5, 1, 9, "#9a6437"); r(ctx, 10, 5, 1, 9, "#9a6437");
  return o.cv;
}
