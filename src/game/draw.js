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
  grass1: "#7bc24f", grass2: "#69ad42", grass3: "#92d566", grassDark: "#579537",
  blade: "#5da23a",
  dirt1: "#cda968", dirt2: "#b88f4e", dirtEdge: "#9a743f",
  cobble1: "#d8c08c", cobble2: "#c8ac74", cobbleDark: "#a98a58", cobbleMortar: "#b99e6e", cobbleMoss: "#9fb060",
  water1: "#46a6dd", water2: "#7fcbef", waterDeep: "#3784bf", waterFoam: "#cdeeff",
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
const disc = (ctx, cx, cy, rad, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fill(); };
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
  M: ["#.#", "###", "###", "#.#", "#.#"], N: ["#.#", "##.", "###", ".##", "#.#"],
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
export function buildTile(type, tx = 0, ty = 0) {
  const o = makeCanvas(TILE, TILE);
  if (!o) return null;
  const { ctx } = o;

  if (type === "water") {
    r(ctx, 0, 0, TILE, TILE, C.water1);
    for (let i = 0; i < TILE; i++) for (let j = 0; j < TILE; j++) {
      const n = hash(tx * 16 + i, ty * 16 + j);
      if (n > 0.92) px(ctx, i, j, C.water2);
      else if (n < 0.05) px(ctx, i, j, C.waterDeep);
    }
    r(ctx, 2, 5, 4, 1, C.water2); r(ctx, 9, 11, 3, 1, C.water2);
    return o.cv;
  }
  if (type === "sand") {
    r(ctx, 0, 0, TILE, TILE, C.sand);
    for (let i = 0; i < TILE; i++) for (let j = 0; j < TILE; j++) {
      const n = hash(tx * 16 + i + 7, ty * 16 + j + 3);
      if (n > 0.9) px(ctx, i, j, C.dirt1); else if (n < 0.08) px(ctx, i, j, "#dcc488");
    }
    return o.cv;
  }
  if (type === "path") {
    // warm packed-earth road with rounded cobbles (2 layouts to break the grid)
    r(ctx, 0, 0, TILE, TILE, C.cobbleMortar);
    for (let i = 0; i < TILE; i++) for (let j = 0; j < TILE; j++) {
      const n = hash(tx * 16 + i + 11, ty * 16 + j + 5);
      if (n > 0.93) px(ctx, i, j, C.cobbleDark);
    }
    const layouts = [
      [[1, 1, 6, 5], [8, 0, 6, 6], [0, 7, 5, 5], [6, 7, 5, 6], [11, 7, 5, 5], [1, 12, 6, 4], [8, 12, 6, 4], [12, 1, 4, 5]],
      [[0, 0, 5, 6], [6, 1, 5, 5], [12, 0, 4, 5], [2, 7, 6, 5], [9, 7, 6, 4], [0, 12, 4, 4], [5, 12, 6, 4], [12, 6, 4, 6]],
    ];
    const stones = layouts[hash(tx, ty) > 0.5 ? 1 : 0];
    stones.forEach(([sx, sy, sw, sh], i) => {
      const v = hash(tx * 7 + i, ty * 5 + i);
      const col = v > 0.62 ? C.cobble1 : v > 0.16 ? C.cobble2 : C.cobbleMoss;
      r(ctx, sx, sy, sw, sh, col);
      r(ctx, sx, sy + sh - 1, sw, 1, C.cobbleDark);
      r(ctx, sx, sy, sw, 1, "rgba(255,248,230,0.35)");
    });
    return o.cv;
  }
  // grass (+ flower)
  r(ctx, 0, 0, TILE, TILE, C.grass1);
  for (let i = 0; i < TILE; i++) for (let j = 0; j < TILE; j++) {
    const n = hash(tx * 16 + i, ty * 16 + j);
    if (n > 0.93) px(ctx, i, j, C.grass3);
    else if (n < 0.07) px(ctx, i, j, C.grass2);
  }
  // a few grass blades, deterministic
  if (hash(tx, ty) > 0.62) { r(ctx, 4, 9, 1, 3, C.blade); r(ctx, 5, 10, 1, 2, C.blade); r(ctx, 3, 11, 1, 1, C.grassDark); }
  if (hash(tx + 5, ty + 9) > 0.78) { r(ctx, 11, 5, 1, 3, C.blade); r(ctx, 12, 6, 1, 2, C.blade); }
  if (type === "flower") {
    const cols = [C.rose, C.gold, C.white, C.cyan, C.blossom];
    const pick = (s) => cols[Math.floor(hash(tx + s, ty + s * 2) * cols.length)];
    const f = (fx, fy, c) => { r(ctx, fx, fy + 1, 3, 1, c); r(ctx, fx + 1, fy, 1, 3, c); px(ctx, fx + 1, fy + 1, C.gold); r(ctx, fx + 1, fy + 3, 1, 1, C.leaf2); };
    f(5, 5, pick(3)); f(10, 9, pick(8)); f(3, 11, pick(13));
    return o.cv;
  }
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
function legsFront(ctx, step) {
  const D = C.jeans, X = C.jeansDark, B = C.shoe, Y = C.shoeShade, K = C.outline;
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
function legsSide(ctx, step) {
  const D = C.jeans, X = C.jeansDark, B = C.shoe, Y = C.shoeShade, K = C.outline;
  const swing = [0, 2, 0, -2][step]; // front foot horizontal swing
  // back leg
  const bx = 6 - Math.max(0, -swing);
  r(ctx, bx, 19, 3, 3, X); r(ctx, bx - 1, 22, 4, 2, C.shoeShade); px(ctx, bx - 1, 23, K);
  // front leg
  const fx = 4 + Math.max(0, swing);
  r(ctx, fx, 19, 3, 4, D); r(ctx, fx, 19, 1, 4, X);
  r(ctx, fx - 1, 22, 5, 2, B); r(ctx, fx + 2, 22, 1, 2, Y); px(ctx, fx - 1, 23, K);
}
export function buildHero(dir, step = 0) {
  const baseDir = dir === "right" ? "left" : dir;
  const o = makeCanvas(16, 24); const { ctx } = o;
  paintMap(ctx, HERO_BODY[baseDir], HPAL);
  if (baseDir === "left") legsSide(ctx, step); else legsFront(ctx, step);
  return dir === "right" ? flipH(o.cv) : o.cv;
}
// build all facings × 4 frames at once
export function buildHeroFrames() {
  const dirs = ["down", "up", "left", "right"];
  const out = {};
  for (const d of dirs) out[d] = [0, 1, 2, 3].map((s) => buildHero(d, s));
  return out;
}

// ============================================================ BUILDING PRIMITIVES
export const BUILDING_SIZE = {
  forge: { w: 4, h: 4 }, studio: { w: 3, h: 4 }, workshop: { w: 4, h: 4 },
  guild: { w: 5, h: 4 }, inn: { w: 4, h: 4 },
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

export const BUILD_BY_KIND = {
  forge: buildForge, studio: buildStudio, workshop: buildWorkshop,
  guild: buildGuild, inn: buildInn,
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
    drawText(ctx, d.text, x + 3, y + 2, d.col || C.black);
  });
  return o.cv;
}

// ============================================================ TREES
export function buildTree(type = "oak") {
  if (type === "pine") {
    const o = makeCanvas(TILE * 2, TILE * 3 + 4); const { ctx } = o; const cx = TILE;
    r(ctx, cx - 2, TILE * 2 + 6, 4, TILE - 4, C.trunk); r(ctx, cx - 2, TILE * 2 + 6, 1, TILE - 4, C.trunkDark);
    for (let k = 0; k < 4; k++) {
      const yy = 2 + k * 8, half = 4 + k * 3;
      ctx.fillStyle = k % 2 ? C.pine2 : C.pine1;
      for (let row = 0; row < 10; row++) { const ww = Math.round((row / 10) * half * 2); ctx.fillRect(cx - Math.floor(ww / 2), yy + row, ww, 1); }
      r(ctx, cx - 1, yy + 1, 2, 1, C.pineHi);
    }
    return o.cv;
  }
  if (type === "blossom" || type === "fruit") {
    const o = makeCanvas(TILE * 2, TILE * 3); const { ctx } = o; const cx = TILE;
    r(ctx, cx - 2, TILE * 2 - 2, 4, TILE + 2, C.trunk); r(ctx, cx - 2, TILE * 2 - 2, 1, TILE + 2, C.trunkDark);
    disc(ctx, cx, TILE + 1, TILE - 2, C.leaf2); disc(ctx, cx, TILE - 1, TILE - 4, C.leaf1);
    const dot = type === "blossom" ? C.blossom : C.fruit, hi = type === "blossom" ? C.blossomHi : C.fruitHi;
    for (let i = 0; i < 12; i++) {
      const a = hash(i, 5) * 7, rad = hash(i, 2) * (TILE - 5);
      const dx = Math.round(cx + Math.cos(a) * rad), dy = Math.round(TILE + Math.sin(a) * rad * 0.85);
      px(ctx, dx, dy, dot); if (hash(i, 8) > 0.6) px(ctx, dx, dy - 1, hi);
    }
    return o.cv;
  }
  if (type === "bushy") {
    const o = makeCanvas(TILE * 2, TILE * 2 + 6); const { ctx } = o; const cx = TILE;
    r(ctx, cx - 2, TILE + 4, 4, TILE - 2, C.trunk); r(ctx, cx - 2, TILE + 4, 1, TILE - 2, C.trunkDark);
    for (const [ox, oy, rad, col] of [[-5, 4, 6, C.leaf2], [5, 4, 6, C.leaf2], [0, 0, 8, C.leaf1], [-3, -1, 5, C.leaf3], [4, 0, 4, C.leaf3]]) disc(ctx, cx + ox, TILE + oy, rad, col);
    px(ctx, cx - 3, TILE - 3, C.leafHi); px(ctx, cx + 2, TILE - 2, C.leafHi);
    return o.cv;
  }
  // oak
  const o = makeCanvas(TILE * 2, TILE * 3); const { ctx } = o; const cx = TILE;
  r(ctx, cx - 2, TILE * 2 - 2, 4, TILE + 2, C.trunk); r(ctx, cx - 2, TILE * 2 - 2, 1, TILE + 2, C.trunkDark); r(ctx, cx + 1, TILE * 2 - 2, 1, TILE + 2, C.trunkHi);
  disc(ctx, cx, TILE + 2, TILE - 1, C.leaf2); disc(ctx, cx, TILE, TILE - 3, C.leaf1); disc(ctx, cx - 3, TILE - 3, TILE - 7, C.leaf3);
  for (let i = 0; i < 18; i++) {
    const a = hash(i, 3) * 7, rad = hash(i, 9) * (TILE - 5);
    px(ctx, Math.round(cx + Math.cos(a) * rad), Math.round(TILE + Math.sin(a) * rad * 0.85), hash(i, 1) > 0.6 ? C.leafHi : C.leaf1);
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
