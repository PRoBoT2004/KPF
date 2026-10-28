// Characters (player + villagers), Mochi the cat, ducks, birds, butterflies.
// Everything is built from soft primitives and animated procedurally.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const mats = new Map();
const mat = (c, r = 0.7, extra) => {
  const k = c + r + (extra ? JSON.stringify(extra) : "");
  if (!mats.has(k)) mats.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra }));
  return mats.get(k);
};
const mesh = (g, m, shadow = true) => {
  const o = new THREE.Mesh(g, m);
  o.castShadow = shadow;
  o.receiveShadow = true;
  return o;
};
const at = (o, x, y, z) => (o.position.set(x, y, z), o);

function hat(kind, look) {
  const g = new THREE.Group();
  if (kind === "straw") {
    const straw = mat("#e9c46a", 0.9);
    g.add(at(mesh(new THREE.CylinderGeometry(0.58, 0.6, 0.04, 28), straw), 0, 0.2, 0));
    g.add(at(mesh(new THREE.CylinderGeometry(0.27, 0.33, 0.22, 24), straw), 0, 0.32, 0));
    g.add(at(mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.06, 24), mat("#c0533b")), 0, 0.25, 0));
  } else if (kind === "cap") {
    const c = mat("#3e9e98", 0.6);
    g.add(at(mesh(new THREE.SphereGeometry(0.385, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), c), 0, 0.06, 0));
    const brim = at(mesh(new RoundedBoxGeometry(0.42, 0.04, 0.3, 2, 0.02), c), 0, 0.08, 0.38);
    brim.rotation.x = 0.12;
    g.add(brim);
    g.add(at(mesh(new THREE.SphereGeometry(0.05, 10, 8), mat("#ffffff")), 0, 0.44, 0));
  } else if (kind === "beret") {
    const b = at(mesh(new THREE.SphereGeometry(0.36, 24, 12), mat("#e07b6b", 0.8)), 0.06, 0.24, -0.02);
    b.scale.set(1.05, 0.42, 1.05);
    b.rotation.z = -0.25;
    g.add(b);
    g.add(at(mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.08, 6), mat("#b85a4c")), 0.02, 0.4, 0));
  } else if (kind === "bandana") {
    const r = mat("#d9534a", 0.7);
    const band = at(mesh(new THREE.TorusGeometry(0.345, 0.06, 8, 32), r), 0, 0.12, 0);
    band.rotation.x = Math.PI / 2 - 0.18;
    g.add(band);
    const knot = at(mesh(new THREE.SphereGeometry(0.08, 10, 8), r), 0, 0.06, -0.36);
    knot.scale.set(1.3, 0.8, 0.8);
    g.add(knot);
  }
  return g;
}

/** A chibi villager. `look` = { top, pants, skin, hair, hat?, shoe?, backpack? } */
export function makeCharacter(look) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const skin = mat(look.skin, 0.6), top = mat(look.top, 0.75), pants = mat(look.pants, 0.8), hair = mat(look.hair, 0.5);
  const shoe = mat(look.shoe || "#f4f1ea", 0.6), dark = mat("#17171d", 0.25);

  const torso = at(mesh(new THREE.CapsuleGeometry(0.27, 0.3, 6, 18), top), 0, 0.8, 0);
  torso.scale.set(1, 1, 0.86);
  body.add(torso);
  // hoodie pocket / collar detail
  const collar = at(mesh(new THREE.TorusGeometry(0.17, 0.05, 8, 20), top), 0, 1.13, 0);
  collar.rotation.x = Math.PI / 2;
  body.add(collar);

  const head = new THREE.Group();
  head.position.y = 1.44;
  body.add(head);
  const skull = mesh(new THREE.SphereGeometry(0.36, 30, 22), skin);
  skull.scale.set(1, 0.94, 0.96);
  head.add(skull);
  const cap = at(mesh(new THREE.SphereGeometry(0.378, 30, 16, 0, Math.PI * 2, 0, Math.PI * 0.53), hair), 0, 0.03, -0.015);
  cap.rotation.x = -0.34;
  head.add(cap);
  const fringe = at(mesh(new THREE.SphereGeometry(0.16, 14, 10), hair), 0.1, 0.2, 0.25);
  fringe.scale.set(1.5, 0.55, 0.7);
  fringe.rotation.z = -0.35;
  head.add(fringe);
  const eyes = [-1, 1].map((s) => {
    const e = at(mesh(new THREE.SphereGeometry(0.046, 12, 10), dark, false), s * 0.125, -0.01, 0.325);
    e.scale.set(1, 1.35, 0.6);
    head.add(e);
    head.add(at(mesh(new THREE.SphereGeometry(0.014, 6, 6), mat("#ffffff", 0.2), false), s * 0.125 + 0.014, 0.025, 0.352));
    return e;
  });
  [-1, 1].forEach((s) => {
    const ch = at(mesh(new THREE.SphereGeometry(0.06, 12, 8), mat("#ff9c8c", 0.8, { transparent: true, opacity: 0.75 }), false), s * 0.205, -0.1, 0.285);
    ch.scale.set(1, 0.55, 0.35);
    head.add(ch);
  });
  const smile = at(mesh(new THREE.TorusGeometry(0.042, 0.011, 6, 14, Math.PI), dark, false), 0, -0.1, 0.338);
  smile.rotation.z = Math.PI;
  head.add(smile);
  if (look.hat) head.add(hat(look.hat, look));

  const limb = (x, y, len, rad, m, endGeo, endMat, endY, endZ = 0) => {
    const pivot = at(new THREE.Group(), x, y, 0);
    pivot.add(at(mesh(new THREE.CapsuleGeometry(rad, len, 4, 10), m), 0, -len / 2 - rad * 0.4, 0));
    if (endGeo) pivot.add(at(mesh(endGeo, endMat), 0, endY, endZ));
    body.add(pivot);
    return pivot;
  };
  const armL = limb(-0.33, 1.03, 0.26, 0.075, top, new THREE.SphereGeometry(0.082, 12, 10), skin, -0.42);
  const armR = limb(0.33, 1.03, 0.26, 0.075, top, new THREE.SphereGeometry(0.082, 12, 10), skin, -0.42);
  const legL = limb(-0.13, 0.5, 0.2, 0.095, pants, new RoundedBoxGeometry(0.2, 0.13, 0.31, 2, 0.05), shoe, -0.42, 0.05);
  const legR = limb(0.13, 0.5, 0.2, 0.095, pants, new RoundedBoxGeometry(0.2, 0.13, 0.31, 2, 0.05), shoe, -0.42, 0.05);
  armL.rotation.z = 0.1;
  armR.rotation.z = -0.1;

  if (look.backpack) {
    body.add(at(mesh(new RoundedBoxGeometry(0.4, 0.44, 0.2, 3, 0.07), mat(look.backpack, 0.8)), 0, 0.86, -0.26));
    body.add(at(mesh(new RoundedBoxGeometry(0.3, 0.16, 0.06, 2, 0.03), mat("#e0a63a", 0.8)), 0, 0.78, -0.37));
  }
  return { root, body, head, eyes, armL, armR, legL, legR, phase: Math.random() * 6, blinkT: 1 + Math.random() * 3, blink: 0, squash: 0 };
}

/** Procedural walk/run/idle/air animation. */
export function animateCharacter(c, dt, speed, t, airborne = false) {
  const k = Math.min(speed / 4.3, 1.7);
  c.phase += dt * (3 + speed * 1.85);
  const s = Math.sin(c.phase), swing = 0.8 * Math.min(k, 1.25);
  if (airborne) {
    c.legL.rotation.x += (-0.55 - c.legL.rotation.x) * Math.min(1, dt * 14);
    c.legR.rotation.x += (0.35 - c.legR.rotation.x) * Math.min(1, dt * 14);
    c.armL.rotation.z += (0.95 - c.armL.rotation.z) * Math.min(1, dt * 12);
    c.armR.rotation.z += (-0.95 - c.armR.rotation.z) * Math.min(1, dt * 12);
  } else {
    c.legL.rotation.x = s * swing;
    c.legR.rotation.x = -s * swing;
    c.armL.rotation.x = -s * swing * 0.85;
    c.armR.rotation.x = s * swing * 0.85;
    c.armL.rotation.z += (0.1 + k * 0.08 - c.armL.rotation.z) * Math.min(1, dt * 10);
    c.armR.rotation.z += (-0.1 - k * 0.08 - c.armR.rotation.z) * Math.min(1, dt * 10);
  }
  const breathe = Math.sin(t * 2.3 + c.phase * 0.05) * 0.014 * (1 - Math.min(k, 1));
  c.body.position.y = airborne ? 0 : Math.abs(Math.cos(c.phase)) * 0.075 * Math.min(k, 1.2);
  c.body.rotation.x = Math.min(speed * 0.028, 0.2);
  c.head.rotation.z = Math.sin(c.phase * 0.5) * 0.04 * Math.min(k, 1);
  c.squash *= Math.exp(-dt * 9);
  const sq = c.squash;
  c.body.scale.set(1 + sq * 0.16, 1 - sq * 0.2 + breathe, 1 + sq * 0.16);
  c.blinkT -= dt;
  if (c.blinkT < 0) {
    c.blink = 0.12;
    c.blinkT = 2 + Math.random() * 3.5;
  }
  c.blink -= dt;
  const ey = c.blink > 0 ? 0.15 : 1.35;
  c.eyes.forEach((e) => (e.scale.y = ey));
}

// ---- Mochi the cat ----
export function makeCat() {
  const fur = mat("#f2a65a", 0.85), cream = mat("#fff1dc", 0.85), dark = mat("#2b211b", 0.3), pink = mat("#ff9c9c", 0.6);
  const root = new THREE.Group(), body = new THREE.Group();
  root.add(body);
  const torso = at(mesh(new THREE.CapsuleGeometry(0.17, 0.34, 6, 14), fur), 0, 0.31, 0);
  torso.rotation.x = Math.PI / 2;
  body.add(torso);
  const belly = at(mesh(new THREE.CapsuleGeometry(0.12, 0.26, 4, 10), cream), 0, 0.26, 0.02);
  belly.rotation.x = Math.PI / 2;
  body.add(belly);
  const head = at(new THREE.Group(), 0, 0.47, 0.3);
  body.add(head);
  const skull = mesh(new THREE.SphereGeometry(0.19, 22, 16), fur);
  skull.scale.set(1.08, 0.95, 0.95);
  head.add(skull);
  [-1, 1].forEach((s) => {
    const ear = at(mesh(new THREE.ConeGeometry(0.075, 0.15, 4), fur), s * 0.11, 0.17, -0.01);
    ear.rotation.z = -s * 0.25;
    head.add(ear);
    const e = at(mesh(new THREE.SphereGeometry(0.03, 10, 8), dark, false), s * 0.075, 0.02, 0.165);
    e.scale.set(1, 1.3, 0.6);
    head.add(e);
  });
  const muzzle = at(mesh(new THREE.SphereGeometry(0.08, 14, 10), cream), 0, -0.05, 0.13);
  muzzle.scale.set(1.35, 0.8, 0.8);
  head.add(muzzle);
  head.add(at(mesh(new THREE.SphereGeometry(0.022, 8, 6), pink, false), 0, -0.02, 0.2));
  const legs = [[-0.09, 0.15], [0.09, 0.15], [-0.09, -0.15], [0.09, -0.15]].map(([x, z]) => {
    const p = at(new THREE.Group(), x, 0.2, z);
    p.add(at(mesh(new THREE.CapsuleGeometry(0.045, 0.12, 4, 8), fur), 0, -0.1, 0));
    body.add(p);
    return p;
  });
  const tail = [];
  let parent = body, y = 0.36, z = -0.27;
  for (let i = 0; i < 4; i++) {
    const seg = at(new THREE.Group(), 0, y, z);
    seg.add(at(mesh(new THREE.CapsuleGeometry(0.04, 0.1, 4, 8), i === 3 ? cream : fur), 0, 0.07, 0));
    seg.rotation.x = -0.5;
    parent.add(seg);
    tail.push(seg);
    parent = seg;
    y = 0.13;
    z = 0;
  }
  return { root, body, head, legs, tail, phase: 0, eyes: [] };
}

export function animateCat(c, dt, speed, t, pose) {
  c.phase += dt * (2 + speed * 9);
  const s = Math.sin(c.phase), k = Math.min(speed / 1.5, 1.3);
  c.legs.forEach((l, i) => (l.rotation.x = (i === 0 || i === 3 ? s : -s) * 0.7 * k));
  const sit = pose === "sit" ? 1 : 0, sleep = pose === "sleep" ? 1 : 0;
  c.body.rotation.x += ((sit ? -0.42 : 0) - c.body.rotation.x) * Math.min(1, dt * 6);
  c.body.position.y += ((sleep ? -0.13 : sit ? 0.02 : Math.abs(Math.cos(c.phase)) * 0.03 * k) - c.body.position.y) * Math.min(1, dt * 8);
  c.head.rotation.x = sleep ? 0.35 : Math.sin(t * 0.7) * 0.08;
  c.head.rotation.y = sleep ? 0.6 : Math.sin(t * 0.45) * 0.3 * (1 - k);
  c.tail.forEach((seg, i) => {
    seg.rotation.z = Math.sin(t * (sleep ? 1 : 2.6) - i * 0.6) * (sleep ? 0.08 : 0.28);
    seg.rotation.x = sleep ? 0.6 : -0.45 + Math.sin(t * 1.3 - i) * 0.08;
  });
}

// ---- Ducks ----
export function makeDuck(baby = false) {
  const root = new THREE.Group();
  const w = mat(baby ? "#ffd54d" : "#fffaf0", 0.8), beak = mat("#ff9d2e", 0.6), dark = mat("#17171d", 0.3);
  const s = baby ? 0.55 : 1;
  const b = at(mesh(new THREE.SphereGeometry(0.2 * s, 18, 12), w), 0, 0.1 * s, 0);
  b.scale.set(1, 0.72, 1.35);
  root.add(b);
  root.add(at(mesh(new THREE.SphereGeometry(0.125 * s, 16, 12), baby ? w : mat("#3f8f5a", 0.6)), 0, 0.27 * s, 0.17 * s));
  const bk = at(mesh(new RoundedBoxGeometry(0.1 * s, 0.035 * s, 0.12 * s, 2, 0.015 * s), beak), 0, 0.25 * s, 0.3 * s);
  root.add(bk);
  [-1, 1].forEach((k) => root.add(at(mesh(new THREE.SphereGeometry(0.02 * s, 8, 6), dark, false), k * 0.075 * s, 0.3 * s, 0.26 * s)));
  const tail = at(mesh(new THREE.ConeGeometry(0.07 * s, 0.14 * s, 6), w), 0, 0.17 * s, -0.27 * s);
  tail.rotation.x = -1.1;
  root.add(tail);
  return { root };
}

// ---- Birds (flapping silhouettes circling high above) ----
export function makeBird() {
  const root = new THREE.Group();
  const m = mat("#3d4250", 0.7, { side: THREE.DoubleSide });
  const body = mesh(new THREE.CapsuleGeometry(0.09, 0.28, 4, 8), m, false);
  body.rotation.x = Math.PI / 2;
  root.add(body);
  const wingGeo = new THREE.BufferGeometry();
  wingGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0.14, 0, 0, -0.12, 0.62, 0.02, -0.04], 3));
  wingGeo.computeVertexNormals();
  const wings = [1, -1].map((s) => {
    const w = mesh(wingGeo, m, false);
    w.scale.x = s;
    root.add(w);
    return w;
  });
  return { root, wings, phase: Math.random() * 6 };
}

// ---- Butterflies ----
export function makeButterfly(color) {
  const root = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, side: THREE.DoubleSide, emissive: color, emissiveIntensity: 0.15 });
  const g = new THREE.CircleGeometry(0.11, 10);
  g.translate(0.11, 0, 0);
  const wings = [1, -1].map((s) => {
    const w = new THREE.Mesh(g, m);
    w.rotation.x = -Math.PI / 2;
    const p = new THREE.Group();
    p.add(w);
    p.scale.x = s;
    root.add(p);
    return p;
  });
  const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.12, 4, 6), mat("#2b2b30"));
  b.rotation.x = Math.PI / 2;
  root.add(b);
  return { root, wings, phase: Math.random() * 6 };
}
