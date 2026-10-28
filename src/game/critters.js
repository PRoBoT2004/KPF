// ============================================================
// Critter + pickup sprites (pixel-maps, drawn once to canvases).
// Every map faces RIGHT; the engine mirrors for left.
// ============================================================
import { C, makeCanvas, paintMap } from "./draw";

const K = C.outline;

function sprite(rows, pal) {
  const w = Math.max(...rows.map((r) => r.length));
  const o = makeCanvas(w, rows.length);
  if (!o) return null;
  paintMap(o.ctx, rows, pal);
  return o.cv;
}
function mirror(cv) {
  const o = makeCanvas(cv.width, cv.height);
  o.ctx.translate(cv.width, 0); o.ctx.scale(-1, 1); o.ctx.drawImage(cv, 0, 0);
  return o.cv;
}
const both = (cv) => ({ r: cv, l: mirror(cv) });

// ---------------------------------------------------------------- cat (Mochi)
const CAT_PAL = { K, O: "#f2a24e", D: "#d27a2c", W: "#fff4e6", E: K, P: "#ff8fa8", Z: "#d27a2c" };
const CAT_TOP = [
  "..........K...K.",
  "..K......KOK.KOK",
  ".KOK.....KOOOOOK",
  ".KOK.....KOEOEOK",
  "..KOK....KOWPWOK",
  "...KOKKKKKKWWWK.",
  "...KODODODOOOK..",
  "...KOOOOOOWWOK..",
  "....KOOOOOOOOK..",
];
const CAT_LEGS = [
  ["....KOK....KOK..", "....KK.....KK..."],
  [".....KOK..KOK...", ".....KK...KK...."],
  ["....KOK....KOK..", "....KK.....KK..."],
  ["...KOK......KOK.", "...KK.......KK.."],
];
const CAT_SIT = [
  "..........K...K.",
  ".........KOK.KOK",
  ".........KOOOOOK",
  ".........KOEOEOK",
  "....KK...KOWPWOK",
  "...KOOK.KOOWWWK.",
  "....KOOKODOOOOK.",
  "......KODODOWWK.",
  "......KOOOOOWWK.",
  ".....KOOOOOOOOK.",
  ".....KKKKKOKKOK.",
];
export function buildCat() {
  const walk = CAT_LEGS.map((legs) => both(sprite([...CAT_TOP, ...legs], CAT_PAL)));
  const sit = both(sprite(CAT_SIT, CAT_PAL));
  const sleep = both(sprite(CAT_SIT, { ...CAT_PAL, E: CAT_PAL.D }));
  return { walk, sit, sleep, w: 16, h: 11 };
}

// ---------------------------------------------------------------- chicken
const CH_PAL = { K, W: "#fffaf0", G: "#e3dccd", R: "#e5484d", Y: "#f6a623", E: K };
const CH_HEAD = [
  "......RR..",
  ".....KRRK.",
  "....KWWWWK",
  "....KWWEWYY",
  "....KWWWWR",
];
const CH_BODY = [
  "K..KWWWWK.",
  "KK.KWWWWK.",
  "KWKWWWWWWK",
  "KWWWWWGWWK",
  ".KWWWGGWK.",
  "..KKKKKK..",
];
const CH_FEET = [["....Y.Y..."], [".....YY..."]];
function chickenFrame(feet, peck) {
  const o = makeCanvas(12, 13);
  const head = peck ? CH_HEAD.map((r) => "." + r) : CH_HEAD;
  paintMap(o.ctx, CH_BODY, CH_PAL, 0, 5);
  paintMap(o.ctx, head, CH_PAL, 0, peck ? 3 : 0);
  paintMap(o.ctx, feet, CH_PAL, 0, 11);
  return o.cv;
}
export function buildChicken() {
  return {
    walk: [both(chickenFrame(CH_FEET[0], false)), both(chickenFrame(CH_FEET[1], false))],
    peck: both(chickenFrame(CH_FEET[0], true)),
    w: 12, h: 13,
  };
}
// baby chick that trails a hen
export function buildChick() {
  const pal = { K, Y: "#ffd84a", O: "#f6a623", E: K };
  const a = sprite([".KKK..", "KYYYK.", "KYEYOO", "KYYYK.", ".KKK..", ".O.O.."], pal);
  const b = sprite([".KKK..", "KYYYK.", "KYEYOO", "KYYYK.", ".KKK..", "..OO.."], pal);
  return { walk: [both(a), both(b)], w: 6, h: 6 };
}

// ---------------------------------------------------------------- ducks
export function buildDuck() {
  const pal = { K, W: "#fffaf0", G: "#e3dccd", Y: "#f6a623", E: K };
  const cv = sprite([
    ".......KKK..",
    "......KWWWK.",
    "......KWEWYY",
    "K.....KWWWK.",
    "KWK..KWWWK..",
    "KWWKKWWWWWK.",
    ".KWWWWWGWWK.",
    "..KKKKKKKK..",
  ], pal);
  return { swim: both(cv), w: 12, h: 8 };
}
export function buildDuckling() {
  const pal = { K, Y: "#ffd84a", O: "#f6a623", E: K };
  const cv = sprite([
    "..KKK..",
    ".KYYYK.",
    ".KYEYOO",
    "KYYYYK.",
    "KYYYYK.",
    ".KKKK..",
  ], pal);
  return { swim: both(cv), w: 7, h: 6 };
}

// ---------------------------------------------------------------- sky + air
export function buildBird() {
  const pal = { K: "#3a3346" };
  return [
    sprite(["K.....K", ".K...K.", "..KKK.."], pal),
    sprite(["..KKK..", ".K...K.", "K.....K"], pal),
  ];
}
export function buildButterfly(col) {
  const pal = { A: col, K: "#2a2230", H: "#ffffff" };
  return [
    sprite(["AA.AA", "AHKHA", ".AKA."], pal),
    sprite([".AKA.", ".AKA.", "..K.."], pal),
  ];
}
export function buildFish() {
  return sprite(["..KK..", ".KCCK.", "KCWCCK", ".KCCK.", "..KK.."].map((r) => r), { K: "#2f5f8a", C: "#7fcbef", W: "#ffffff" });
}

// ---------------------------------------------------------------- pickups + fx
export function buildStar() {
  const pal = { K: "#7a4d10", Y: "#ffd23f", W: "#fff7c2", O: "#f0a51e" };
  return sprite([
    ".....K.....",
    "....KYK....",
    "....KYK....",
    "KKKKYWYKKKK",
    "KYYYYWYYYOK",
    ".KYYYYYYOK.",
    "..KYYYYOK..",
    "..KYYKYOK..",
    ".KYOK.KYOK.",
    ".KKK...KKK.",
  ], pal);
}
export function buildHeart() {
  return sprite([
    ".KK.KK.",
    "KRRKRRK",
    "KRWRRRK",
    ".KRRRK.",
    "..KRK..",
    "...K...",
  ], { K: "#7a1f2b", R: "#ff5d7a", W: "#ffd1dc" });
}
export function buildCoin() {
  return sprite([".KKK.", "KYWYK", "KYYYK", "KYYOK", ".KKK."], { K: "#7a4d10", Y: "#ffd23f", W: "#fff7c2", O: "#f0a51e" });
}

// ---------------------------------------------------------------- villagers
// Palettes for the hero rig (see buildHero). Hats: straw | beret | cap | bandana.
export const VILLAGER_LOOKS = {
  asha:  { hat: "straw",   pal: { H: "#2b2026", N: "#1a1418", F: "#3d2f37", S: "#e8b98c", C: "#c99467", J: "#5aa05a", Z: "#3f7a42", L: "#86c97c", P: "#3f7a42", pants: "#7a5a3a", pantsDark: "#5a4128" } },
  ravi:  { hat: "bandana", pal: { H: "#3b2a1c", N: "#24180e", F: "#4d3826", S: "#d9a275", C: "#b97f55", J: "#7d7c8a", Z: "#5d5c6c", L: "#9b9aa6", P: "#4a3a2a", pants: "#3a3346", pantsDark: "#262230" } },
  meera: { hat: "beret",   pal: { H: "#1f1a22", N: "#141016", F: "#2d2631", S: "#f0c49a", C: "#d39f74", J: "#e88a78", Z: "#c4604d", L: "#ffb9a6", P: "#c4604d", pants: "#3c4868", pantsDark: "#2a3248" } },
  kabir: { hat: "cap",     pal: { H: "#5a3a22", N: "#3a2414", F: "#6e4a2e", S: "#f6cda0", C: "#dca175", J: "#4fb3c4", Z: "#2f8a9a", L: "#8fdbe6", P: "#2f8a9a", pants: "#4a4a58", pantsDark: "#33333f" } },
};
