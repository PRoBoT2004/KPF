// Island quests: hidden stars (each reveals a fact), the quest log, and saved progress.
// Pure data so both the engine and the React HUD can import it.
import { DOCK, HILL, CAPE, FARM } from "./layout";

// Facts only — all from the portfolio data. The Nth star found reveals FACTS[N].
export const FACTS = [
  "Krishna is 22 and lives in Bharuch, Gujarat.",
  "Shop-ERP is used by 300+ paying merchants, with zero critical downtime in 10+ months.",
  "He co-owns PrimeDigitals and leads UI/UX at UMM Digital.",
  "Touchpe's cashier flow takes under 3 seconds.",
  "Vitran seals every GST invoice with a SHA-256 hash, so nobody can quietly edit one.",
  "He speaks English, Hindi and Gujarati.",
  "B.Tech in Computer Science, Parul University, 2025.",
];

// `room` = "out" for the island, otherwise the building whose interior holds it.
export const STARS = [
  { id: "dock", room: "out", x: DOCK.x + DOCK.dx * (DOCK.len - 0.9), z: DOCK.z + DOCK.dz * (DOCK.len - 0.9) },
  { id: "hill", room: "out", x: HILL.x - 2.6, z: HILL.z - 2.4 },
  { id: "cape", room: "out", x: CAPE.x + 0.4, z: CAPE.z + 2.7 },
  { id: "farm", room: "out", x: (FARM.x0 + FARM.x1) / 2, z: (FARM.z0 + FARM.z1) / 2 + 0.2 },
  { id: "beach", room: "out", x: 9.5, z: 27.5 },
  { id: "gallery", room: "hall", x: 5.6, z: -2.6 },
  { id: "hearth", room: "inn", x: -3.6, z: -2.4 },
];

export const PLACES_TO_VISIT = ["projects", "builder", "designer", "engineer", "inn", "portal"];

export const QUESTS = [
  { id: "visit", label: "Step inside all 6 places", total: PLACES_TO_VISIT.length, get: (p) => p.visited.length },
  { id: "stars", label: "Find the 7 hidden stars", total: STARS.length, get: (p) => p.stars.length },
  { id: "talk", label: "Chat with the 4 villagers", total: 4, get: (p) => p.talked.length },
  { id: "pet", label: "Pet Mochi the cat", total: 1, get: (p) => (p.pet ? 1 : 0) },
  { id: "wish", label: "Make a wish at the fountain", total: 1, get: (p) => (p.wish ? 1 : 0) },
];

export const EMPTY = { visited: [], stars: [], talked: [], pet: false, wish: false, done: false };
const STORE = "isl.progress.v1";

export function loadProgress() {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) || "null");
    return v ? { ...EMPTY, ...v } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}
export function saveProgress(p) {
  try {
    localStorage.setItem(STORE, JSON.stringify(p));
  } catch {
    /* storage is optional */
  }
}
export const questsDone = (p) => QUESTS.filter((q) => q.get(p) >= q.total).length;
