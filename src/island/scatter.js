// Seeded placement of trees, rocks, bushes and flower patches.
// Pure data so the terrain can darken the ground under each one (soft AO).
import { rng, fbm } from "./util";
import { heightAt, islandT, clearance, PLAZA, HILL, CAPE, DOCK, BUILDINGS, PORTAL } from "./layout";

const R = rng(20250);

function poisson(n, minD, tries, accept) {
  const out = [];
  for (let i = 0; i < tries && out.length < n; i++) {
    const x = (R() * 2 - 1) * 36, z = (R() * 2 - 1) * 36;
    if (!accept(x, z)) continue;
    if (out.some((o) => (o.x - x) ** 2 + (o.z - z) ** 2 < minD * minD)) continue;
    out.push({ x, z });
  }
  return out;
}

// Trees: denser in two groves (north-east + west) and on the hill.
const grove = (x, z) =>
  0.25 + 0.75 * Math.max(
    Math.exp(-((x - 13) ** 2 + (z + 20) ** 2) / 70),
    Math.exp(-((x + 27) ** 2 + (z - 2) ** 2) / 60),
    Math.exp(-((x - 24) ** 2 + (z - 2) ** 2) / 30),
    Math.exp(-((x + 6) ** 2 + (z + 25) ** 2) / 40),
    fbm(x * 0.09, z * 0.09, 2) - 0.25
  );

// keep the camera-side (south) of every building open so facades stay visible
const frontYard = (x, z) => BUILDINGS.some((b) => z > b.z - 1 && z < b.z + 10 && Math.abs(x - b.x) < b.w / 2 + 3.5);

export const TREES = poisson(56, 3.0, 9000, (x, z) => {
  const t = islandT(x, z), h = heightAt(x, z);
  if (t > 0.86 || h < 0.75) return false;
  if (clearance(x, z) < 2.8 || frontYard(x, z)) return false;
  if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r + 3.5) return false;
  if (Math.abs(x) < 3.2 && z > 8 && z < 20) return false; // keep the portal view open
  return R() < grove(x, z);
}).map((p) => {
  const h = heightAt(p.x, p.z);
  const north = p.z < -14 || h > 2.6;
  const roll = R();
  const type = north && roll < 0.55 ? "pine" : roll < 0.1 ? "blossom" : roll < 0.19 ? "fruit" : roll < 0.33 ? "pine" : "round";
  return { ...p, y: h, type, s: 0.82 + R() * 0.5, rot: R() * Math.PI * 2, seed: Math.floor(R() * 1e6) };
});

// A few hand-placed accent trees near the plaza and houses.
[[-7.8, -1.6, "blossom"], [7.9, -1.3, "blossom"], [-5.2, -10.2, "round"], [5.4, -10.0, "fruit"]].forEach(([x, z, type]) => {
  if (clearance(x, z) > 1.4) TREES.push({ x, z, y: heightAt(x, z), type, s: 0.95, rot: R() * 6.28, seed: Math.floor(R() * 1e6) });
});

export const BUSHES = poisson(46, 2.0, 5000, (x, z) => {
  const t = islandT(x, z), h = heightAt(x, z);
  return t < 0.9 && h > 0.6 && clearance(x, z) > 0.9 && TREES.every((o) => (o.x - x) ** 2 + (o.z - z) ** 2 > 3.2);
}).map((p) => ({ ...p, y: heightAt(p.x, p.z), s: 0.55 + R() * 0.5, seed: Math.floor(R() * 1e6), berry: R() < 0.3 }));

// Rocks: along the shoreline, on the hill and around the lighthouse cape.
export const ROCKS = [
  ...poisson(26, 2.4, 6000, (x, z) => {
    const t = islandT(x, z);
    return t > 0.86 && t < 1.04 && clearance(x, z) > 1 && Math.hypot(x - DOCK.x, z - DOCK.z) > 4;
  }),
  ...poisson(8, 2.2, 1500, (x, z) => Math.hypot(x - HILL.x, z - HILL.z) < 7 && Math.hypot(x - HILL.x, z - HILL.z) > 3 && clearance(x, z) > 1),
  ...[[-2.2, 1.8], [2.4, 1.2], [0.4, -2.6], [-1.6, -2.2], [2.6, -1.4]].map(([dx, dz]) => ({ x: CAPE.x + dx, z: CAPE.z + dz })),
].map((p) => ({ ...p, y: heightAt(p.x, p.z), s: 0.45 + R() * 0.75, seed: Math.floor(R() * 1e6) }));

// Flower patches: clusters in the meadows + beds framing the plaza.
export const FLOWERS = (() => {
  const out = [];
  const centers = poisson(64, 3.2, 6000, (x, z) => islandT(x, z) < 0.84 && clearance(x, z) > 1.2);
  const cols = [0, 1, 2, 3, 4, 5];
  for (const c of centers) {
    const n = 6 + Math.floor(R() * 12), col = cols[Math.floor(R() * cols.length)];
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 1.3, x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r;
      if (clearance(x, z) < 0.5) continue;
      out.push({ x, z, y: heightAt(x, z), col: R() < 0.8 ? col : Math.floor(R() * 6), s: 0.8 + R() * 0.5 });
    }
  }
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2, r = PLAZA.r + 0.55 + R() * 0.5;
    const x = PLAZA.x + Math.cos(a) * r, z = PLAZA.z + Math.sin(a) * r;
    if (clearance(x, z) < 0.25) continue;
    out.push({ x, z, y: heightAt(x, z), col: [0, 2, 1, 3][Math.floor(i / 6) % 4], s: 0.9 + R() * 0.3 });
  }
  return out;
})();

export const FLOWER_COLORS = ["#fff7ea", "#ffd84d", "#ff8fb1", "#b9a3ff", "#ff7a59", "#8fd0ff"];
