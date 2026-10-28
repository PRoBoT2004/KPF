// ============================================================
// Image metadata for the Studio world — intrinsic sizes (so
// next/image never shifts layout) and the generative art plate
// paired with each project. Plates live in /public/studio/art and
// are rendered from src/components/studio/shaderArt.js. To use
// your own art instead, drop images with the same file names in.
// ============================================================
import manifest from "../../public/assets/work/manifest.json";

const PLATE_SIZES = {
  "/studio/art/hero.webp": [1920, 1080],
  "/studio/art/plate-1.webp": [1600, 1000],
  "/studio/art/plate-2.webp": [1600, 1000],
  "/studio/art/plate-3.webp": [1600, 1000],
  "/studio/art/plate-4.webp": [1600, 1000],
  "/studio/art/plate-5.webp": [1000, 1400],
  "/studio/art/plate-6.webp": [1000, 1400],
  "/studio/art/plate-7.webp": [1600, 1000],
  "/studio/art/world.webp": [1600, 1000],
};

const SIZES = new Map(manifest.map((m) => [m.path, [m.width, m.height]]));
Object.entries(PLATE_SIZES).forEach(([k, v]) => SIZES.set(k, v));

/** [width, height] for a public image path (falls back to 16:10). */
export function dims(src) {
  return SIZES.get(src) || [1600, 1000];
}

/** true for long, full-page captures that read best inside a scrolling frame */
export function isTall(src) {
  const [w, h] = dims(src);
  return h / w > 2.2;
}

const PLATE_BY_PROJECT = {
  "shop-erp": "/studio/art/plate-1.webp",
  hazeberg: "/studio/art/plate-2.webp",
  "trade-crm": "/studio/art/plate-7.webp",
  enda: "/studio/art/plate-3.webp",
  touchpe: "/studio/art/plate-4.webp",
  vitran: "/studio/art/plate-2.webp",
  meditrack: "/studio/art/plate-3.webp",
  launchpad: "/studio/art/plate-4.webp",
};
const ROTATION = ["/studio/art/plate-1.webp", "/studio/art/plate-2.webp", "/studio/art/plate-3.webp", "/studio/art/plate-4.webp", "/studio/art/plate-7.webp"];

export function plateFor(id, i = 0) {
  return PLATE_BY_PROJECT[id] || ROTATION[i % ROTATION.length];
}
