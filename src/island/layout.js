// The island's ground truth: terrain shape, where every landmark stands,
// the paths between them, villagers and walkability. Pure JS (no three.js) so
// the HUD/minimap can import it without pulling the renderer.
import { fbm, smooth, chaikin, segDist } from "./util";

export const WATER_Y = 0;
export const PLAZA = { x: 0, z: 2, r: 5.6 };
export const HILL = { x: -21, z: -15.5, r: 5.0, h: 3.6 };
export const CAPE = { x: 26, z: -17.5 }; // rocky outcrop under the lighthouse

const shoreR = (a) => 33.5 + 3.2 * Math.sin(a * 3 + 0.5) + 2.1 * Math.sin(a * 5 + 1.7) + 1.3 * Math.sin(a * 9 + 0.3);
/** 0 at the island centre, 1 on the shoreline. */
export const islandT = (x, z) => Math.hypot(x, z) / shoreR(Math.atan2(z, x));
const bump = (x, z, cx, cz, r, h) => h * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (2 * r * r));

function baseHeight(x, z) {
  const t = islandT(x, z);
  let h = 1.15 * (1 - smooth(0.74, 1.0, t)) - smooth(0.97, 1.45, t) * 7;
  h += (fbm(x * 0.06 + 3, z * 0.06 - 7, 3) - 0.5) * 0.7 * (1 - smooth(0.7, 0.95, t));
  h += bump(x, z, HILL.x, HILL.z, HILL.r, HILL.h);
  h += bump(x, z, CAPE.x, CAPE.z, 3.4, 3.0);
  return h;
}

// ---- Landmarks (front of every building faces local +z) ----
const B = (id, zone, kind, name, sub, x, z, rot, w, d) => {
  const off = d / 2 + 1.15;
  return { id, zone, kind, name, sub, x, z, rot, w, d, door: { x: x + Math.sin(rot) * off, z: z + Math.cos(rot) * off } };
};
export const BUILDINGS = [
  B("hall", "projects", "hall", "Quest Hall", "Shipped work", 0, -14, 0, 7.4, 5.2),
  B("studio", "designer", "studio", "Designer's Studio", "Design work", -15.5, -7.5, 0.55, 5.4, 4.4),
  B("forge", "builder", "forge", "Builder's Forge", "Recommended path", 15.5, -7.5, -0.55, 5.4, 4.4),
  B("workshop", "engineer", "workshop", "Engineer's Workshop", "Code work", -17, 8.5, 0.95, 5.2, 4.2),
  B("inn", "inn", "inn", "The Inn", "Say hello", 17, 8.5, -0.95, 6.2, 4.6),
];
export const PORTAL = { id: "portal", zone: "portal", kind: "portal", name: "The Portal", sub: "To the studio site", x: 0, z: 21.5, rot: Math.PI, door: { x: 0, z: 19.4 } };
export const SIGNPOST = { id: "sign", zone: "welcome", kind: "sign", name: "Signpost", sub: "How to explore", x: 2.9, z: 7.15, door: { x: 2.3, z: 8.2 } };
export const FOUNTAIN = { id: "fountain", x: PLAZA.x, z: PLAZA.z, r: 2.4 };
export const WINDMILL = { x: HILL.x, z: HILL.z, door: { x: HILL.x, z: HILL.z + 2.4 } };
export const LIGHTHOUSE = { x: CAPE.x, z: CAPE.z, door: { x: CAPE.x - 1.7, z: CAPE.z + 1.3 } };
export const FARM = { x0: -15.8, x1: -9.2, z0: -22.6, z1: -18.4 };

// ---- Ground flattening under everything that needs a level footing ----
const PADS = [
  ...BUILDINGS.map((b) => ({ x: b.x, z: b.z, r: Math.max(b.w, b.d) / 2 + 0.9, f: 2.2 })),
  { x: PLAZA.x, z: PLAZA.z, r: PLAZA.r, f: 3 },
  { x: PORTAL.x, z: PORTAL.z, r: 3.4, f: 2 },
  { x: HILL.x, z: HILL.z, r: 2.4, f: 2.5 },
  { x: CAPE.x, z: CAPE.z, r: 1.9, f: 1.6 },
].map((p) => ({ ...p, h: baseHeight(p.x, p.z) }));

export function heightAt(x, z) {
  let h = baseHeight(x, z);
  for (const p of PADS) {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < p.r + p.f) h += (p.h - h) * (1 - smooth(p.r, p.r + p.f, d));
  }
  return h;
}

// ---- Dock: march south-west from the centre until we reach the beach ----
export const DOCK = (() => {
  const a = 2.33, dx = Math.cos(a), dz = Math.sin(a);
  let r = 18;
  while (baseHeight(dx * r, dz * r) > 0.32 && r < 40) r += 0.1;
  const len = 9;
  return { x: dx * r, z: dz * r, dx, dz, len, half: 0.95, y: 0.62, rot: Math.atan2(dx, dz) };
})();
export function onDock(x, z) {
  const px = x - DOCK.x, pz = z - DOCK.z;
  const along = px * DOCK.dx + pz * DOCK.dz, across = -px * DOCK.dz + pz * DOCK.dx;
  return along > -0.6 && along < DOCK.len && Math.abs(across) < DOCK.half - 0.15;
}

// ---- Paths (soft curves between plaza and every door) ----
const byId = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]));
const fromPlaza = ({ x, z }) => {
  const dx = x - PLAZA.x, dz = z - PLAZA.z, L = Math.hypot(dx, dz);
  return [PLAZA.x + (dx / L) * (PLAZA.r - 0.8), PLAZA.z + (dz / L) * (PLAZA.r - 0.8)];
};
const d = (b) => [b.door.x, b.door.z];
export const PATHS = [
  [fromPlaza(byId.hall.door), [0.5, -6.4], d(byId.hall)],
  [fromPlaza(byId.studio.door), [-8.6, -3.2], d(byId.studio)],
  [fromPlaza(byId.forge.door), [8.6, -3.2], d(byId.forge)],
  [fromPlaza(byId.workshop.door), [-9.5, 6.8], d(byId.workshop)],
  [fromPlaza(byId.inn.door), [9.5, 6.8], d(byId.inn)],
  [fromPlaza(PORTAL.door), [0.9, 13], [PORTAL.door.x, PORTAL.door.z]],
  [d(byId.studio), [-15.2, -10.8], [-18.8, -12.2], [WINDMILL.door.x, WINDMILL.door.z]],
  [d(byId.forge), [18.6, -10.6], [22.2, -14.2], [LIGHTHOUSE.door.x, LIGHTHOUSE.door.z]],
  [d(byId.workshop), [-17.6, 13.6], [-18.6, 18.6], [DOCK.x - DOCK.dx * 0.4, DOCK.z - DOCK.dz * 0.4]],
].map((p) => chaikin(p, 3));
export const PATH_HALF = 0.85;

export function pathDist(x, z) {
  let m = 1e9;
  for (const p of PATHS)
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, az] = p[i], [bx, bz] = p[i + 1];
      if (Math.abs(x - ax) > 8 && Math.abs(x - bx) > 8) continue;
      const s = segDist(x, z, ax, az, bx, bz);
      if (s < m) m = s;
    }
  return m;
}

// ---- Distances used for placement + collision ----
/** Signed-ish distance from a point to a rotated box footprint (0 inside). */
export function boxDist(x, z, b, pad = 0) {
  const c = Math.cos(-b.rot), s = Math.sin(-b.rot), px = x - b.x, pz = z - b.z;
  const lx = px * c + pz * s, lz = -px * s + pz * c;
  const qx = Math.max(Math.abs(lx) - (b.w / 2 + pad), 0), qz = Math.max(Math.abs(lz) - (b.d / 2 + pad), 0);
  return Math.hypot(qx, qz);
}

/** How far a point is from anything built (used to keep trees/grass tidy). */
export function clearance(x, z) {
  let m = pathDist(x, z) - PATH_HALF;
  for (const b of BUILDINGS) m = Math.min(m, boxDist(x, z, b));
  m = Math.min(m, Math.hypot(x - PLAZA.x, z - PLAZA.z) - PLAZA.r);
  m = Math.min(m, Math.hypot(x - PORTAL.x, z - PORTAL.z) - 3.2);
  m = Math.min(m, Math.hypot(x - WINDMILL.x, z - WINDMILL.z) - 2.2);
  m = Math.min(m, Math.hypot(x - LIGHTHOUSE.x, z - LIGHTHOUSE.z) - 1.8);
  const fx = Math.max(FARM.x0 - x, 0, x - FARM.x1), fz = Math.max(FARM.z0 - z, 0, z - FARM.z1);
  m = Math.min(m, Math.hypot(fx, fz) - 0.3);
  return m;
}

// ---- Street lamps: along the main paths + four around the plaza ----
export const LAMPS = (() => {
  const out = [];
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    out.push({ x: PLAZA.x + Math.cos(a) * (PLAZA.r + 0.5), z: PLAZA.z + Math.sin(a) * (PLAZA.r + 0.5) });
  }
  PATHS.forEach((p, pi) => {
    let acc = 0, next = 6.5, side = pi % 2 ? 1 : -1;
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, az] = p[i], [bx, bz] = p[i + 1], L = Math.hypot(bx - ax, bz - az);
      while (acc + L >= next) {
        const t = (next - acc) / L, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        const nx = -(bz - az) / L, nz = (bx - ax) / L;
        const lx = x + nx * 1.45 * side, lz = z + nz * 1.45 * side;
        const ok = out.every((o) => Math.hypot(o.x - lx, o.z - lz) > 5.5) && BUILDINGS.every((b) => boxDist(lx, lz, b) > 1.2);
        if (ok && pathDist(lx, lz) > 1.1) out.push({ x: lx, z: lz });
        side = -side;
        next += 8;
      }
      acc += L;
    }
  });
  return out;
})();

export const BENCHES = [200, 340].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: PLAZA.x + Math.cos(a) * 4.5, z: PLAZA.z + Math.sin(a) * 4.5, rot: Math.atan2(-Math.cos(a), -Math.sin(a)) };
});

// ---- Villagers (lines are directions or facts from the portfolio only) ----
export const NPCS = [
  { id: "asha", name: "Asha", look: { hat: "straw", top: "#6aa84f", pants: "#6b4f3a", skin: "#c98b62", hair: "#3a2418" },
    route: [[-8.4, -17.3], [-12.5, -17.1], [-16.7, -17.5], [-12.5, -17.2]],
    lines: [
      "Morning! I keep the little farm by the windmill.",
      "Krishna is from Bharuch, Gujarat. He's 22.",
      "Mochi the cat naps by the Inn. Say hi if you pass.",
    ] },
  { id: "ravi", name: "Ravi", look: { hat: "bandana", top: "#4a78b5", pants: "#3b3b46", skin: "#b97b52", hair: "#1e1510" },
    route: [[11.4, -3.0], [16.8, -2.4], [19.8, -4.2], [16.8, -2.4]],
    lines: [
      "This is the Builder's Forge. Products made end to end come from here.",
      "Shop-ERP came out of this forge. 300+ shops bill on it every month.",
      "Walk up to the door and press E to look inside.",
    ] },
  { id: "meera", name: "Meera", look: { hat: "beret", top: "#f4c95d", pants: "#3b4a6b", skin: "#e2a77d", hair: "#2a1a12" },
    route: [[-11.4, -3.0], [-16.8, -2.4], [-19.8, -4.2], [-16.8, -2.4]],
    lines: [
      "The Studio holds the design work: Enda, Hazeberg, MediTrack.",
      "Every screen starts in Figma. Then Krishna builds it himself.",
      "Want the clean version? The Portal on the south beach leads to his studio site.",
    ] },
  { id: "kabir", name: "Kabir", look: { hat: "cap", top: "#f1eee6", pants: "#4c5d7a", skin: "#d39a6e", hair: "#1a1410" },
    route: [[3.7, 2], [0, 5.7], [-3.7, 2], [0, -1.7]],
    lines: [
      "Welcome to the island! The signpost by the fountain points everywhere.",
      "The Inn is where you reach Krishna: email, phone and GitHub.",
      "Toss a coin in the fountain. Locals swear it works.",
    ] },
];
export const CAT = { name: "Mochi", x: 20.5, z: 13.2, r: 3.2 };
export const SPAWN = { x: 0, z: 8.2 };

/** Interactable landmarks shown as nameplates + on the minimap. */
export const PLACES = [...BUILDINGS, PORTAL, SIGNPOST];
