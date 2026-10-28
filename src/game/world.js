// ============================================================
// Overworld map — terrain, collision, objects, content zones.
// Tile coordinates (x →, y ↓). Built once on the client.
// Buildings are placed by `kind`; the engine draws them from
// code (src/game/draw.js). No images anywhere.
// ============================================================
import { BUILDING_SIZE, pondDepth, TILE } from "./draw";

export const MAP_W = 44;
export const MAP_H = 30;
export const SPAWN = { x: 21, y: 18 }; // main avenue at the town square (signpost in view)

// ---- Buildings: kind + zone + accent + footprint (from BUILDING_SIZE) ----
const BUILDINGS = [
  { id: "guild",    kind: "guild",    zone: "projects", accent: "gold", name: "Quest Hall",          tx: 19, ty: 3 },
  { id: "workshop", kind: "workshop", zone: "engineer", accent: "cyan", name: "Engineer's Workshop", tx: 4,  ty: 8 },
  { id: "forge",    kind: "forge",    zone: "builder",  accent: "gold", name: "Builder's Forge",     tx: 33, ty: 8, flag: true },
  { id: "studio",   kind: "studio",   zone: "designer", accent: "rose", name: "Designer's Studio",   tx: 6,  ty: 20 },
  { id: "inn",      kind: "inn",      zone: "inn",      accent: "gold", name: "The Inn",              tx: 31, ty: 20 },
  // gateway to the Studio (scroll) world at "/"
  { id: "portal",   kind: "portal",   zone: "portal",   accent: "cyan", name: "The Portal",           tx: 38, ty: 16 },
];

// ---- Trees (varied species) — [x, y, type] at trunk-base tile ----
const TREES = [
  [3, 3, "blossom"], [16, 6, "oak"], [8, 7, "bushy"], [14, 4, "pine"],
  [15, 9, "oak"], [28, 6, "pine"], [29, 9, "fruit"], [16, 13, "bushy"],
  [27, 13, "blossom"], [12, 17, "oak"], [38, 14, "pine"], [3, 14, "fruit"],
  [13, 26, "oak"], [18, 27, "bushy"], [26, 27, "blossom"], [38, 26, "pine"],
  [2, 24, "oak"], [41, 22, "oak"],
];

// ---- Props (decorative; mostly non-solid) — themed beside each shop ----
const PROPS = [
  // forge: anvil + barrel on the grass either side of the door
  { kind: "anvil", tx: 32, ty: 11 }, { kind: "barrel", tx: 37, ty: 10 },
  // studio
  { kind: "easel", tx: 9, ty: 22 }, { kind: "flowerbox", tx: 5, ty: 23 },
  // workshop
  { kind: "gear", tx: 8, ty: 11 }, { kind: "crate", tx: 3, ty: 11 },
  // inn
  { kind: "barrel", tx: 35, ty: 22 }, { kind: "bench", tx: 29, ty: 23 }, { kind: "barrel", tx: 30, ty: 21 },
  // guild notice board (solid)
  { kind: "board", tx: 25, ty: 6, w: 2, h: 1, solid: true },
  // lamps — all on grass, flanking (never on a road tile)
  { kind: "lamp", tx: 17, ty: 12 }, { kind: "lamp", tx: 25, ty: 12 },
  { kind: "lamp", tx: 37, ty: 14 }, { kind: "lamp", tx: 10, ty: 22 },
  // roadside greenery
  { kind: "bush", tx: 26, ty: 12 },
  // town-square centerpiece (solid — walk around it)
  { kind: "fountain", tx: 20, ty: 14, w: 2, h: 2, solid: true },
  // farm corner (top-right): windmill, coop, scarecrow, sunflowers, hay
  { kind: "windmill", tx: 38, ty: 2, w: 3, h: 4, solid: true },
  { kind: "coop", tx: 41, ty: 6, w: 2, h: 2, solid: true },
  { kind: "scarecrow", tx: 33, ty: 3, sway: true },
  { kind: "sunflower", tx: 30, ty: 5, sway: true }, { kind: "sunflower", tx: 32, ty: 5, sway: true },
  { kind: "sunflower", tx: 34, ty: 5, sway: true }, { kind: "sunflower", tx: 36, ty: 5, sway: true },
  { kind: "hay", tx: 40, ty: 7, solid: true }, { kind: "hay", tx: 37, ty: 7, solid: true },
  // picnic spot (bottom middle) + little details around town
  { kind: "basket", tx: 24, ty: 26 },
  { kind: "mushrooms", tx: 14, ty: 26 }, { kind: "mushrooms", tx: 39, ty: 25 }, { kind: "mushrooms", tx: 4, ty: 15 },
  { kind: "mushrooms", tx: 17, ty: 7 },
  { kind: "rock", tx: 18, ty: 2 }, { kind: "rock", tx: 41, ty: 12 }, { kind: "rock", tx: 9, ty: 28 }, { kind: "rock", tx: 12, ty: 7 },
];

// ---- Life: who lives where (consumed by src/game/life.js) ----
// Positions are tiles. Villagers walk between waypoints on the roads and
// only ever give directions or facts from the portfolio data.
export const LIFE = {
  cat: { name: "Mochi", x: 28, y: 22, area: [24, 19, 33, 25] },
  chickens: { area: [29, 5, 42, 7], hens: 4, chicks: 2 },
  pond: { cx: 9, cy: 4.35, rx: 2.15, ry: 1.0 },
  wish: { x: 21, y: 16.5 },
  npcs: [
    { id: "asha", name: "Asha", route: [[31, 6], [36, 6], [39, 8], [33, 7], [29, 7]],
      lines: [
        "Morning! I look after the farm by the windmill.",
        "Seven stars are hidden around town. Each one holds a fact about Krishna.",
        "The chickens get shy if you run at them. Walk slowly and they'll stay.",
      ] },
    { id: "ravi", name: "Ravi", route: [[32, 13], [36, 13], [36, 14], [32, 14]],
      lines: [
        "This is the Builder's Forge. Products that ship end to end are made here.",
        "Shop-ERP came out of this forge. 300+ shops bill on it every month.",
        "Step up to the door and press E to see the work.",
      ] },
    { id: "meera", name: "Meera", route: [[10, 24], [14, 24], [14, 22], [10, 22]],
      lines: [
        "The Studio is where the design work lives: Enda, Hazeberg, MediTrack.",
        "Every screen starts in Figma. Then Krishna builds it himself.",
        "Want the clean version? The Portal leads to his studio site.",
      ] },
    { id: "kabir", name: "Kabir", route: [[21, 20], [21, 23], [26, 24], [21, 23]],
      lines: [
        "Lost? The signpost by the fountain points everywhere.",
        "The Inn is where you reach Krishna: email, phone and GitHub.",
        "Toss a coin in the fountain. Locals swear it works.",
      ] },
  ],
  // seven hidden stars; the Nth one found reveals FACTS[N]
  stars: [[17, 20], [11, 6], [2, 2], [41, 2], [41, 17], [22, 28], [2, 27]],
};

// ---- Central wayfinding signpost (interactive: welcome / how-to-play) ----
const SIGNPOST = {
  id: "sign", kind: "signpost", zone: "welcome", name: "Town Square", tx: 22, ty: 12,
  dirs: [
    { text: "QUEST HALL", side: "left", col: "#bb8f30" },
    { text: "FORGE", side: "right", col: "#bb8f30" },
    { text: "WORKSHOP", side: "left", col: "#349a90" },
    { text: "STUDIO", side: "left", col: "#c4604d" },
    { text: "INN", side: "right", col: "#bb8f30" },
    { text: "PORTAL", side: "right", col: "#349a90" },
  ],
};

// ---- Decorative well by the pond (solid 2×2) ----
const WELL = { kind: "well", tx: 2, ty: 6, w: 2, h: 2, solid: true };

const key = (x, y) => `${x},${y}`;
const frontTile = (o) => ({ x: o.tx + Math.floor((o.w ?? 1) / 2), y: o.ty + (o.h ?? 1) });

export function makeWorld() {
  // ---------- terrain ----------
  const terrain = Array.from({ length: MAP_H }, () => Array.from({ length: MAP_W }, () => "grass"));
  const setT = (x, y, t) => { if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) terrain[y][x] = t; };
  const hLine = (x0, x1, y) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) setT(x, y, "path"); };
  const vLine = (y0, y1, x) => { for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) setT(x, y, "path"); };
  const rect = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) setT(x, y, t); };

  // pond (top-left): painted per pixel with a round shore (see draw.js);
  // any tile the shore touches is a "pond" tile
  for (let y = 0; y <= 8; y++)
    for (let x = 3; x <= 14; x++) {
      const near = [[2, 2], [8, 8], [14, 14], [2, 14], [14, 2]].some(([i, j]) => pondDepth(x * TILE + i, y * TILE + j) < 1.3);
      if (near) setT(x, y, "pond");
    }
  // hedge wall around the whole map (it was an invisible wall before)
  for (let x = 0; x < MAP_W; x++) { setT(x, 0, "hedge"); setT(x, MAP_H - 1, "hedge"); }
  for (let y = 0; y < MAP_H; y++) { setT(0, y, "hedge"); setT(MAP_W - 1, y, "hedge"); }

  // farm field (top-right): crops with the scarecrow standing in a soil gap
  rect(30, 2, 35, 4, "crop");
  setT(33, 3, "soil");
  // picnic blanket (bottom middle)
  setT(23, 26, "picnic"); setT(24, 26, "picnic");

  // path network
  rect(18, 13, 24, 17, "path");           // central plaza
  vLine(7, 26, 21);                        // main avenue (guild → spawn)
  hLine(6, 18, 15); vLine(12, 15, 6);      // → workshop
  hLine(24, 35, 15); vLine(12, 15, 35);    // → forge
  hLine(7, 33, 24);                        // lower cross-road (studio ↔ inn)
  vLine(23, 24, 7);                        // studio approach
  vLine(23, 24, 33);                       // inn approach
  vLine(15, 19, 35); hLine(35, 39, 19);    // → portal (east, off the forge road)

  // flowers on grass (deterministic, avoids paths)
  const flowerSpots = [
    [12, 6], [14, 8], [27, 4], [30, 7], [16, 11], [25, 11], [10, 16], [34, 16],
    [3, 18], [40, 18], [15, 22], [27, 22], [11, 27], [30, 27], [20, 19], [22, 19],
    [22, 25], [25, 27], [3, 21], [4, 22], [26, 9], [13, 12], [38, 21], [40, 24],
    [17, 17], [25, 19], [9, 12], [31, 18], [16, 28], [34, 28], [36, 26], [28, 2], [42, 10],
  ];
  flowerSpots.forEach(([x, y]) => { if (terrain[y]?.[x] === "grass") setT(x, y, "flower"); });

  // ---------- objects + collision ----------
  const solids = new Set();
  const objects = [];
  const zones = [];

  // border ring
  for (let x = 0; x < MAP_W; x++) { solids.add(key(x, 0)); solids.add(key(x, MAP_H - 1)); }
  for (let y = 0; y < MAP_H; y++) { solids.add(key(0, y)); solids.add(key(MAP_W - 1, y)); }
  // open water and crop rows are solid
  for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
    const t = terrain[y][x];
    if (t === "crop" || (t === "pond" && pondDepth(x * TILE + 8, y * TILE + 8) < 0.97)) solids.add(key(x, y));
  }

  // buildings
  BUILDINGS.forEach((b) => {
    const size = BUILDING_SIZE[b.kind];
    const o = { ...b, w: size.w, h: size.h };
    objects.push(o);
    for (let yy = o.ty; yy < o.ty + o.h; yy++)
      for (let xx = o.tx; xx < o.tx + o.w; xx++) solids.add(key(xx, yy));
    zones.push({ id: o.zone, name: o.name, accent: o.accent, front: frontTile(o), flag: o.flag });
  });

  // trees (trunk tile solid)
  TREES.forEach(([x, y, type]) => {
    objects.push({ kind: "tree", ttype: type, tx: x, ty: y, w: 1, h: 1, sway: true });
    solids.add(key(x, y));
  });

  // props
  PROPS.forEach((p) => {
    const o = { w: 1, h: 1, ...p };
    objects.push(o);
    if (o.solid) for (let yy = o.ty; yy < o.ty + o.h; yy++) for (let xx = o.tx; xx < o.tx + o.w; xx++) solids.add(key(xx, yy));
  });

  // well (solid)
  objects.push(WELL);
  for (let yy = WELL.ty; yy < WELL.ty + WELL.h; yy++) for (let xx = WELL.tx; xx < WELL.tx + WELL.w; xx++) solids.add(key(xx, yy));

  // signpost (interactive, not solid)
  objects.push(SIGNPOST);
  zones.push({ id: SIGNPOST.zone, name: SIGNPOST.name, accent: "cyan", front: frontTile(SIGNPOST) });

  return { terrain, solids, objects, zones, spawn: SPAWN };
}

export function isSolid(solids, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  return solids.has(key(tx, ty));
}
