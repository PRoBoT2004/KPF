// Everything that stands on the island: houses, windmill, lighthouse, dock,
// fountain, portal, farm, trees, rocks, lamps. Static meshes are merged by
// material at the end so the whole town costs a few dozen draw calls.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  heightAt, BUILDINGS, PORTAL, SIGNPOST, FOUNTAIN, WINDMILL, LIGHTHOUSE, FARM, DOCK, LAMPS, BENCHES,
} from "./layout";
import { TREES, BUSHES, ROCKS } from "./scatter";
import { rng, smooth } from "./util";
import { patch, signTexture, paintingTexture, U } from "./materials";

// ---------- tiny scene-building helpers ----------
const mesh = (g, m, cast = true, recv = true) => {
  const o = new THREE.Mesh(g, m);
  o.castShadow = cast;
  o.receiveShadow = recv;
  return o;
};
const rbGeo = (w, h, d, r = 0.06, seg = 2) => new RoundedBoxGeometry(w, h, d, seg, Math.max(0.001, Math.min(r, w / 2.05, h / 2.05, d / 2.05)));
const rb = (w, h, d, m, r = 0.06) => mesh(rbGeo(w, h, d, r), m);
const cyl = (rt, rbt, h, m, seg = 16) => mesh(new THREE.CylinderGeometry(rt, rbt, h, seg), m);
const sph = (r, m, ws = 14, hs = 10) => mesh(new THREE.SphereGeometry(r, ws, hs), m);
function put(parent, o, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0) {
  o.position.set(x, y, z);
  o.rotation.set(rx, ry, rz);
  parent.add(o);
  return o;
}
/** Scale box UVs per face so textures keep a constant world size. */
function boxUV(g, w, h, d, unit = 2) {
  const n = g.attributes.normal, uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const [su, sv] = ax >= ay && ax >= az ? [d, h] : ay >= az ? [w, d] : [w, h];
    uv.setXY(i, (uv.getX(i) * su) / unit, (uv.getY(i) * sv) / unit);
  }
  return g;
}
const tbox = (w, h, d, m, unit = 2, r = 0.05) => mesh(boxUV(rbGeo(w, h, d, r), w, h, d, unit), m);

export function buildProps(K, quality) {
  const R = rng(31337);
  const statics = new THREE.Group();
  const dynamic = new THREE.Group();
  const anims = [];
  const colliders = [];
  const platforms = [];
  const hits = [];
  const smokes = [];
  const anchors = {};
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });

  const wood = K.wood("#b07a4c"), woodDark = K.wood("#7a5134"), woodPale = K.wood("#d2a877");
  const metal = K.metal("#353a42"), stoneMat = K.stone("#cfc7b9"), stoneDark = K.stone("#a9a092");
  const gold = K.plain("#d4a848", 0.4);
  const leafMat = patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }), { wind: 0.03, windBase: 1.6 });
  const leafStill = patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }));
  const bark = K.wood("#80583a");
  const pools = new THREE.Group();
  const toDynamic = []; // animated parts built inside static groups

  const pool = (x, z, r = 2.4, y) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 28).rotateX(-Math.PI / 2), K.pool);
    m.position.set(x, (y ?? heightAt(x, z)) + 0.07, z);
    m.renderOrder = 1;
    pools.add(m);
  };
  const flag = (parent, x, y, z, color, w = 0.9, h = 0.55) => {
    const geo = new THREE.PlaneGeometry(w, h, 10, 2).translate(w / 2, 0, 0);
    const base = geo.attributes.position.array.slice();
    const f = mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.7, side: THREE.DoubleSide }), true, false);
    f.position.set(x, y, z);
    parent.add(f);
    toDynamic.push(f);
    const ph = R() * 6;
    anims.push((t) => {
      const a = geo.attributes.position.array;
      for (let i = 0; i < a.length; i += 3) {
        const u = base[i] / w;
        a[i + 2] = Math.sin(t * 5 + ph - base[i] * 3.2) * 0.12 * u;
        a[i + 1] = base[i + 1] - u * 0.05 + Math.sin(t * 4 + ph - base[i] * 2.5) * 0.03 * u;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    });
    return f;
  };
  const lantern = (parent, x, y, z) => {
    put(parent, rb(0.06, 0.06, 0.32, metal, 0.02), x, y + 0.24, z - 0.12);
    put(parent, rb(0.2, 0.26, 0.2, K.lamp, 0.04), x, y, z + 0.04);
    put(parent, mesh(new THREE.ConeGeometry(0.17, 0.14, 4).rotateY(Math.PI / 4), metal), x, y + 0.2, z + 0.04);
  };

  // ---------- generic house ----------
  function windowAt(g, x, y, z, w, h, trim, { box = false, shutters = null, round = false } = {}) {
    const p = put(g, new THREE.Group(), x, y, z);
    if (round) {
      put(p, mesh(new THREE.TorusGeometry(w / 2 + 0.05, 0.07, 8, 24), trim), 0, 0, 0.03);
      put(p, mesh(new THREE.CircleGeometry(w / 2, 24), K.window), 0, 0, 0.03);
      put(p, rb(0.05, w, 0.04, trim, 0.01), 0, 0, 0.05);
      put(p, rb(w, 0.05, 0.04, trim, 0.01), 0, 0, 0.05);
      return p;
    }
    put(p, rb(w + 0.18, h + 0.18, 0.1, trim, 0.03), 0, 0, 0);
    put(p, rb(w, h, 0.06, K.window, 0.02), 0, 0, 0.04);
    put(p, rb(0.05, h, 0.04, trim, 0.01), 0, 0, 0.08);
    put(p, rb(w, 0.05, 0.04, trim, 0.01), 0, 0, 0.08);
    put(p, rb(w + 0.34, 0.08, 0.2, trim, 0.02), 0, -h / 2 - 0.1, 0.07);
    if (shutters) [-1, 1].forEach((s) => put(p, tbox(w * 0.48, h + 0.1, 0.05, shutters, 1, 0.02), s * (w / 2 + w * 0.24 + 0.12), 0, 0.03));
    if (box) {
      put(p, tbox(w + 0.12, 0.2, 0.24, woodDark, 1, 0.03), 0, -h / 2 - 0.27, 0.16);
      const cols = ["#ff8fb1", "#ffd84d", "#fff7ea", "#ff7a59", "#b9a3ff"];
      for (let i = 0; i < 6; i++) {
        put(p, sph(0.075, K.plain(cols[Math.floor(R() * cols.length)], 0.7), 8, 6), -w / 2 + 0.12 + (i / 5) * (w - 0.24), -h / 2 - 0.13 + R() * 0.05, 0.16 + (R() - 0.5) * 0.08);
        put(p, sph(0.07, K.plain("#5f9e45", 0.8), 8, 6), -w / 2 + 0.2 + (i / 5) * (w - 0.4), -h / 2 - 0.17, 0.2);
      }
    }
    return p;
  }

  function roof(g, w, d, ph, o, roofMat, gableMat, y0, ridgeMat) {
    const half = d / 2 + o, ang = Math.atan2(ph, d / 2), L = half / Math.cos(ang), W = w + o * 2, thick = 0.17;
    const eaveY = y0 - (ph * o) / (d / 2);
    for (const s of [1, -1]) {
      const geo = rbGeo(W, thick, L, 0.05);
      const uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * W) / 2.4, (uv.getY(i) * L) / 2.4);
      const m = mesh(geo, roofMat);
      m.position.set(0, (eaveY + y0 + ph) / 2 + thick * 0.45, (s * half) / 2);
      m.rotation.x = s * ang;
      g.add(m);
    }
    put(g, mesh(new THREE.CylinderGeometry(0.12, 0.12, W + 0.06, 10).rotateZ(Math.PI / 2), ridgeMat || roofMat), 0, y0 + ph + thick * 0.75, 0);
    const sh = new THREE.Shape();
    sh.moveTo(-d / 2, 0);
    sh.lineTo(d / 2, 0);
    sh.lineTo(0, ph);
    sh.closePath();
    const tg = new THREE.ExtrudeGeometry(sh, { depth: w - 0.04, bevelEnabled: false });
    tg.rotateY(Math.PI / 2).translate(-(w - 0.04) / 2, 0, 0);
    put(g, mesh(tg, gableMat), 0, y0, 0);
  }

  function house(o) {
    const g = new THREE.Group();
    const { w, d, h } = o, y0 = 0.25 + h;
    put(g, tbox(w + 0.44, 0.9, d + 0.44, o.base, 1.4, 0.08), 0, -0.2, 0);
    put(g, tbox(w, h, d, o.wall, 2, 0.05), 0, 0.25 + h / 2, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(g, tbox(0.22, h + 0.02, 0.22, o.trim, 1, 0.03), sx * (w / 2), 0.25 + h / 2, sz * (d / 2));
    put(g, tbox(w + 0.1, 0.18, 0.12, o.trim, 1, 0.03), 0, y0 - 0.06, d / 2 + 0.02);
    put(g, tbox(w + 0.1, 0.18, 0.12, o.trim, 1, 0.03), 0, y0 - 0.06, -d / 2 - 0.02);
    roof(g, w, d, o.ph, o.o ?? 0.42, o.roof, o.wall, y0, o.ridge);
    // door
    const dw = o.door?.w ?? 1.1, dh = o.door?.h ?? 2.0;
    put(g, tbox(dw + 0.24, dh + 0.14, 0.12, o.trim, 1, 0.03), 0, 0.25 + dh / 2, d / 2 + 0.03);
    put(g, tbox(dw, dh, 0.1, o.door?.mat ?? woodDark, 1, 0.03), 0, 0.25 + dh / 2, d / 2 + 0.07);
    put(g, sph(0.055, gold, 10, 8), dw * 0.32, 0.25 + dh * 0.48, d / 2 + 0.15);
    put(g, tbox(dw + 0.7, 0.2, 0.7, o.base, 1, 0.04), 0, 0.1, d / 2 + 0.45);
    if (o.lanterns !== false) [-1, 1].forEach((s) => lantern(g, s * (dw / 2 + 0.38), 0.25 + dh + 0.05, d / 2 + 0.12));
    // windows
    (o.windows || []).forEach(([x, y, ww, hh, opts]) => windowAt(g, x, y, d / 2 + 0.04, ww, hh, o.frame || o.trim, opts));
    (o.side || []).forEach(([z, y, ww, hh, opts]) => {
      [-1, 1].forEach((s) => {
        const sg = put(g, new THREE.Group(), s * (w / 2 + 0.04), 0, z * s, (s * Math.PI) / 2);
        windowAt(sg, 0, y, 0, ww, hh, o.frame || o.trim, opts);
      });
    });
    if (o.gableWindow) windowAt(g, 0, y0 + o.ph * 0.38, d / 2 + 0.02, 0.62, 0.62, o.frame || o.trim, { round: true });
    if (o.sign) {
      const tex = signTexture(o.sign, { bg: o.signBg || "#6f4a2f" });
      const sm = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 });
      const sw = o.signW || 2.2;
      put(g, rb(sw + 0.12, sw / 4 + 0.12, 0.08, woodDark, 0.03), 0, o.signY ?? y0 - 0.55, d / 2 + 0.1);
      put(g, mesh(new THREE.PlaneGeometry(sw, sw / 4), sm, false), 0, o.signY ?? y0 - 0.55, d / 2 + 0.15);
    }
    if (o.chimney) {
      const [cx, cz, ch] = o.chimney;
      put(g, tbox(0.62, ch, 0.62, o.chimneyMat || K.brick("#b46f55"), 1, 0.04), cx, y0 + ch / 2 - 0.2, cz);
      put(g, tbox(0.78, 0.16, 0.78, stoneDark, 1, 0.03), cx, y0 + ch - 0.2, cz);
      smokes.push({ local: new THREE.Vector3(cx, y0 + ch, cz), group: g });
    }
    return g;
  }

  // ---------- the five buildings ----------
  const plaster = (c) => K.plaster(c);
  const SPEC = {
    hall: {
      h: 3.0, ph: 2.2, wall: plaster("#f4e6c9"), trim: woodDark, base: stoneMat, roof: K.roof("#d4613f"), ridge: K.plain("#a84a30"),
      door: { w: 1.55, h: 2.15, mat: K.wood("#8a5a3b") }, sign: "QUEST HALL", signW: 2.6, signY: 2.86,
      windows: [[-2.5, 1.5, 1.0, 1.05, { box: true }], [2.5, 1.5, 1.0, 1.05, { box: true }]],
      side: [[-1.1, 1.6, 0.9, 1.0], [1.1, 1.6, 0.9, 1.0]], gableWindow: true,
    },
    studio: {
      h: 2.7, ph: 1.9, wall: plaster("#f8e2da"), trim: K.wood("#fbf3ea"), frame: K.wood("#fbf3ea"), base: K.stone("#d9cfc2"), roof: K.roof("#e07b6b"), ridge: K.plain("#b85a4c"),
      door: { w: 1.0, h: 2.0, mat: K.wood("#4e9a95") }, sign: "STUDIO",
      windows: [[-1.65, 1.45, 1.05, 1.15, { box: true, shutters: K.wood("#5aa5a0") }], [1.65, 1.45, 1.05, 1.15, { box: true, shutters: K.wood("#5aa5a0") }]],
      side: [[0, 1.5, 0.9, 1.0, { shutters: K.wood("#5aa5a0") }]], gableWindow: true,
    },
    forge: {
      h: 2.6, ph: 1.8, wall: K.stone("#c7bba9"), trim: K.wood("#4a3426"), base: K.stone("#9c9184"), roof: K.roof("#56637d"), ridge: K.plain("#3d4659"),
      door: { w: 1.25, h: 2.05, mat: K.wood("#6b4630") }, sign: "FORGE", signBg: "#3c2a1f",
      windows: [[1.65, 1.4, 1.0, 0.95]], side: [[0, 1.4, 0.9, 0.9]],
      chimney: [1.5, -0.7, 2.6], chimneyMat: K.brick("#9e5f4a"),
    },
    workshop: {
      h: 2.6, ph: 1.7, wall: plaster("#e4edf0"), trim: K.wood("#2f4f5a"), base: K.stone("#cbc4b6"), roof: K.roof("#3e9e98"), ridge: K.plain("#2c7a75"),
      door: { w: 1.05, h: 2.0, mat: K.wood("#3c6e7c") }, sign: "WORKSHOP", signBg: "#2f4f5a",
      windows: [[-1.6, 1.45, 1.15, 1.0, { box: true }], [1.6, 1.45, 1.15, 1.0, { box: true }]], side: [[0, 1.45, 1.0, 0.9]],
    },
    inn: {
      h: 4.3, ph: 2.0, wall: plaster("#f3e7cc"), trim: K.wood("#6e4a32"), base: K.stone("#b8ae9e"), roof: K.roof("#4c8a5e"), ridge: K.plain("#36684a"),
      door: { w: 1.2, h: 2.1, mat: K.wood("#7a4e31") }, sign: "THE INN", signW: 2.2, signY: 2.55,
      windows: [[-2.1, 1.35, 1.0, 0.95, { box: true }], [2.1, 1.35, 1.0, 0.95, { box: true }], [-1.9, 3.4, 0.9, 0.95], [1.9, 3.4, 0.9, 0.95], [0, 3.45, 0.8, 1.15]],
      side: [[-1, 1.4, 0.85, 0.9], [1, 3.4, 0.85, 0.9]], chimney: [-1.9, -0.8, 2.2], gableWindow: true,
    },
  };

  for (const b of BUILDINGS) {
    const s = SPEC[b.kind];
    const g = house({ ...s, w: b.w, d: b.d });
    const gy = heightAt(b.x, b.z);
    g.position.set(b.x, gy, b.z);
    g.rotation.y = b.rot;
    const d2 = b.d / 2;

    if (b.kind === "hall") {
      // timber beam + posts, banners, quest board, cupola with a gold flag
      put(g, tbox(b.w, 0.16, 0.1, woodDark, 1, 0.03), 0, 2.45, d2 + 0.04);
      [-1, 1].forEach((sx) => {
        put(g, tbox(0.16, 2.2, 0.1, woodDark, 1, 0.03), sx * 1.3, 1.35, d2 + 0.04);
        put(g, rb(0.06, 0.06, 0.62, metal, 0.02), sx * 1.85, 2.3, d2 + 0.3, 0, 0, Math.PI / 2);
        const ban = put(g, mesh(new THREE.PlaneGeometry(0.5, 1.05), K.plain(sx < 0 ? "#d4a848" : "#e07b6b", 0.7), true, false), sx * 1.85, 1.75, d2 + 0.09);
        ban.material = new THREE.MeshStandardMaterial({ color: sx < 0 ? "#d4a848" : "#e07b6b", roughness: 0.7, side: THREE.DoubleSide });
      });
      const top = 0.25 + s.h + s.ph;
      put(g, tbox(1.1, 0.95, 1.1, s.wall, 2, 0.04), 0, top + 0.35, 0);
      [0, 1, 2, 3].forEach((k) => {
        const a = (k * Math.PI) / 2;
        put(g, rb(0.42, 0.5, 0.05, K.window, 0.02), Math.sin(a) * 0.56, top + 0.4, Math.cos(a) * 0.56, a);
      });
      put(g, mesh(new THREE.ConeGeometry(0.98, 0.9, 4).rotateY(Math.PI / 4), s.roof), 0, top + 1.27, 0);
      put(g, cyl(0.03, 0.03, 1.5, metal, 6), 0, top + 2.2, 0);
      put(g, sph(0.07, gold, 10, 8), 0, top + 2.96, 0);
      flag(g, 0.03, top + 2.68, 0, "#d4a848", 0.85, 0.5);
      // quest board
      const qb = put(g, new THREE.Group(), -3.1, 0, d2 + 1.6, 0.25);
      [-0.85, 0.85].forEach((x) => put(qb, tbox(0.14, 1.95, 0.14, woodDark, 1, 0.03), x, 0.97, 0));
      put(qb, tbox(1.95, 1.15, 0.1, woodPale, 1, 0.03), 0, 1.35, 0.03);
      put(qb, rb(2.25, 0.08, 0.5, s.roof, 0.03), 0, 2.02, 0.05, 0, 0.18);
      ["#fff7e3", "#ffe58a", "#ffc2d1", "#bfeadf", "#cfe3ff"].forEach((c, i) => {
        const nx = -0.65 + (i % 3) * 0.62 + (R() - 0.5) * 0.08, ny = 1.6 - Math.floor(i / 3) * 0.5;
        put(qb, mesh(new THREE.PlaneGeometry(0.42, 0.36), K.plain(c, 0.9), false), nx, ny, 0.085, 0, 0, (R() - 0.5) * 0.2);
        put(qb, sph(0.025, K.plain("#d9534a", 0.4), 6, 5), nx, ny + 0.14, 0.1);
      });
      colliders.push({ x: b.x + Math.sin(b.rot) * (d2 + 1.6) + Math.cos(b.rot) * -3.1, z: b.z + Math.cos(b.rot) * (d2 + 1.6) - Math.sin(b.rot) * -3.1, r: 0.9 });
      // planters along the front
      [-1, 1].forEach((sx) => {
        put(g, tbox(1.6, 0.3, 0.5, stoneDark, 1, 0.05), sx * 2.5, 0.35, d2 + 0.55);
        for (let i = 0; i < 7; i++) put(g, sph(0.12 + R() * 0.05, K.plain(["#ff8fb1", "#ffd84d", "#fff7ea", "#5f9e45", "#5f9e45"][Math.floor(R() * 5)], 0.8), 8, 6), sx * 2.5 - 0.65 + i * 0.22, 0.58, d2 + 0.55 + (R() - 0.5) * 0.15);
      });
    }

    if (b.kind === "studio") {
      // easel with a painting, potted plants
      const ea = put(g, new THREE.Group(), -2.35, 0, d2 + 1.25, 0.35);
      [-0.32, 0.32].forEach((x) => put(ea, tbox(0.06, 1.7, 0.06, woodPale, 1, 0.02), x, 0.82, 0, 0, -0.12, x > 0 ? -0.08 : 0.08));
      put(ea, tbox(0.06, 1.6, 0.06, woodPale, 1, 0.02), 0, 0.78, -0.32, 0, 0.25);
      put(ea, tbox(0.85, 0.06, 0.1, woodPale, 1, 0.02), 0, 0.7, 0.07);
      put(ea, rb(0.82, 0.66, 0.04, K.plain("#fbf6ec", 0.9), 0.01), 0, 1.07, 0.06, 0, -0.12);
      put(ea, mesh(new THREE.PlaneGeometry(0.76, 0.6), new THREE.MeshStandardMaterial({ map: paintingTexture(), roughness: 0.9 }), false), 0, 1.07, 0.085, 0, -0.12);
      colliders.push({ x: b.x + Math.cos(b.rot) * -2.35 + Math.sin(b.rot) * (d2 + 1.25), z: b.z - Math.sin(b.rot) * -2.35 + Math.cos(b.rot) * (d2 + 1.25), r: 0.55 });
      [-1, 1].forEach((sx) => {
        put(g, cyl(0.22, 0.17, 0.36, K.plain("#d9845f", 0.8), 12), sx * 0.95, 0.43, d2 + 0.5);
        put(g, sph(0.3, K.plain("#5f9e45", 0.85), 10, 8), sx * 0.95, 0.85, d2 + 0.5);
      });
    }

    if (b.kind === "forge") {
      // glowing hearth, anvil, barrels, gold banner pole
      put(g, tbox(1.25, 0.95, 0.14, K.stone("#5a524a"), 1, 0.04), -1.65, 1.15, d2 + 0.05);
      put(g, rb(1.0, 0.7, 0.06, K.ember, 0.03), -1.65, 1.12, d2 + 0.1);
      [-0.3, 0, 0.3].forEach((x) => put(g, rb(0.05, 0.72, 0.05, metal, 0.01), -1.65 + x, 1.12, d2 + 0.16));
      put(g, tbox(1.45, 0.14, 0.32, stoneDark, 1, 0.03), -1.65, 0.62, d2 + 0.16);
      pool(b.x + Math.cos(b.rot) * -1.65 + Math.sin(b.rot) * (d2 + 1.2), b.z - Math.sin(b.rot) * -1.65 + Math.cos(b.rot) * (d2 + 1.2), 1.8, gy);
      const an = put(g, new THREE.Group(), 2.0, 0, d2 + 1.35, -0.3);
      put(an, cyl(0.32, 0.36, 0.6, bark, 12), 0, 0.3, 0);
      put(an, rb(0.62, 0.16, 0.26, metal, 0.03), 0, 0.68, 0);
      put(an, rb(0.32, 0.18, 0.18, metal, 0.03), 0, 0.82, 0);
      put(an, mesh(new THREE.ConeGeometry(0.09, 0.34, 8).rotateZ(Math.PI / 2), metal), 0.3, 0.85, 0);
      colliders.push({ x: b.x + Math.cos(b.rot) * 2.0 + Math.sin(b.rot) * (d2 + 1.35), z: b.z - Math.sin(b.rot) * 2.0 + Math.cos(b.rot) * (d2 + 1.35), r: 0.55 });
      const pole = put(g, new THREE.Group(), -b.w / 2 - 0.55, 0, d2 + 0.1);
      put(pole, cyl(0.05, 0.06, 4.2, metal, 8), 0, 2.1, 0);
      put(pole, sph(0.08, gold, 10, 8), 0, 4.25, 0);
      flag(pole, 0.05, 3.85, 0, "#d4a848", 1.0, 0.6);
    }

    if (b.kind === "workshop") {
      // dish + antenna with a blinking light, crates, a laptop on a workbench
      const top = 0.25 + s.h;
      const dish = put(g, new THREE.Group(), 1.4, top + s.ph * 0.5, -0.9, 0.3, -0.5);
      put(dish, cyl(0.04, 0.04, 0.5, metal, 6), 0, 0.15, 0);
      put(dish, mesh(new THREE.SphereGeometry(0.55, 18, 8, 0, Math.PI * 2, 0, 1.0), new THREE.MeshStandardMaterial({ color: "#e8ecef", roughness: 0.5, side: THREE.DoubleSide })), 0, 0.85, 0, 0, Math.PI);
      put(dish, cyl(0.025, 0.025, 0.55, metal, 6), 0, 0.62, 0);
      const ant = put(g, new THREE.Group(), -1.5, top + s.ph * 0.45, -0.5);
      put(ant, cyl(0.035, 0.05, 1.9, metal, 6), 0, 0.95, 0);
      [0.6, 1.1, 1.5].forEach((y, i) => put(ant, cyl(0.015, 0.015, 0.7 - i * 0.18, metal, 4), 0, y, 0, 0, 0, Math.PI / 2));
      put(ant, sph(0.07, K.led, 10, 8), 0, 1.95, 0);
      [[2.45, 0.32, 0.6], [2.5, 0.92, 0.5], [2.95, 0.3, 0.55]].forEach(([x, y, sz]) => put(g, tbox(sz, sz, sz, woodPale, 0.8, 0.04), x, y, d2 + 0.75 + (x > 2.8 ? 0.4 : 0), R() * 0.3));
      const wb = put(g, new THREE.Group(), -2.3, 0, d2 + 1.15, 0.2);
      put(wb, tbox(1.3, 0.08, 0.65, wood, 1, 0.02), 0, 0.82, 0);
      [[-0.55, -0.25], [0.55, -0.25], [-0.55, 0.25], [0.55, 0.25]].forEach(([x, z]) => put(wb, tbox(0.07, 0.8, 0.07, woodDark, 1, 0.02), x, 0.4, z));
      put(wb, rb(0.52, 0.03, 0.36, metal, 0.01), 0, 0.88, 0.05);
      put(wb, rb(0.52, 0.34, 0.03, metal, 0.01), 0, 1.06, -0.14, 0, -0.25);
      put(wb, mesh(new THREE.PlaneGeometry(0.46, 0.28), new THREE.MeshStandardMaterial({ color: "#0e2a33", emissive: "#5fe3ff", emissiveIntensity: 0.9 }), false), 0, 1.065, -0.12, 0, -0.25);
      colliders.push({ x: b.x + Math.cos(b.rot) * -2.3 + Math.sin(b.rot) * (d2 + 1.15), z: b.z - Math.sin(b.rot) * -2.3 + Math.cos(b.rot) * (d2 + 1.15), r: 0.75 });
    }

    if (b.kind === "inn") {
      // ground floor in stone, timbered upper floor, balcony, hanging sign, bench + mailbox
      put(g, tbox(b.w + 0.06, 2.25, b.d + 0.06, K.stone("#cdc3b1"), 1.4, 0.05), 0, 0.25 + 1.12, 0);
      put(g, tbox(b.w + 0.3, 0.2, b.d + 0.3, s.trim, 1, 0.04), 0, 2.5, 0);
      [-1.0, 1.0].forEach((x) => put(g, tbox(0.14, 1.8, 0.1, s.trim, 1, 0.03), x, 3.45, d2 + 0.05));
      const bal = put(g, new THREE.Group(), 0, 2.62, d2 + 0.45);
      put(bal, tbox(2.1, 0.12, 0.9, wood, 1, 0.03), 0, 0, 0);
      put(bal, tbox(2.1, 0.08, 0.08, woodDark, 1, 0.02), 0, 0.62, 0.42);
      for (let i = 0; i < 9; i++) put(bal, cyl(0.03, 0.03, 0.6, woodDark, 6), -0.98 + i * 0.245, 0.32, 0.42);
      [-0.95, 0.95].forEach((x) => put(bal, tbox(0.1, 0.1, 0.9, woodDark, 1, 0.02), x, -0.1, 0, 0, 0, 0));
      const arm = put(g, new THREE.Group(), 1.15, 2.2, d2 + 0.1);
      put(arm, rb(0.06, 0.06, 0.9, metal, 0.02), 0, 0, 0.42);
      const hang = put(arm, new THREE.Group(), 0, -0.04, 0.72);
      put(hang, mesh(new THREE.PlaneGeometry(0.62, 0.44), new THREE.MeshStandardMaterial({ map: signTexture("INN", { w: 256, h: 180, size: 88, bg: "#4c8a5e" }), roughness: 0.8, side: THREE.DoubleSide })), 0, -0.3, 0, Math.PI / 2);
      [-0.2, 0.2].forEach((z) => put(hang, cyl(0.01, 0.01, 0.1, metal, 4), 0, -0.05, z));
      toDynamic.push(arm);
      anims.push((t) => (hang.rotation.x = Math.sin(t * 1.4) * 0.12));
      // bench + mailbox out front
      const be = put(g, new THREE.Group(), -2.35, 0, d2 + 1.3);
      put(be, tbox(1.5, 0.08, 0.45, wood, 1, 0.02), 0, 0.48, 0);
      put(be, tbox(1.5, 0.36, 0.06, wood, 1, 0.02), 0, 0.78, -0.2, 0, -0.12);
      [-0.62, 0.62].forEach((x) => put(be, rb(0.08, 0.48, 0.42, metal, 0.02), x, 0.24, 0));
      const mb = put(g, new THREE.Group(), 2.6, 0, d2 + 1.45, -0.4);
      put(mb, cyl(0.05, 0.05, 1.05, woodDark, 6), 0, 0.52, 0);
      put(mb, rb(0.36, 0.3, 0.5, K.plain("#d9534a", 0.55), 0.12), 0, 1.15, 0);
      put(mb, rb(0.04, 0.24, 0.07, gold, 0.01), 0.2, 1.3, 0.1);
      put(mb, rb(0.2, 0.025, 0.02, K.plain("#2b2b30"), 0.005), 0, 1.2, 0.25);
      [[-2.35, 1.3, 0.9], [2.6, 1.45, 0.35]].forEach(([x, z, r]) => colliders.push({ x: b.x + Math.cos(b.rot) * x + Math.sin(b.rot) * (d2 + z), z: b.z - Math.sin(b.rot) * x + Math.cos(b.rot) * (d2 + z), r }));
    }

    statics.add(g);
    colliders.push({ box: true, x: b.x, z: b.z, rot: b.rot, hw: b.w / 2 + 0.28, hd: b.d / 2 + 0.28 });
    const hit = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.6, s.h + s.ph + 0.6, b.d + 0.6), hitMat);
    hit.position.set(b.x, gy + (s.h + s.ph) / 2, b.z);
    hit.rotation.y = b.rot;
    hit.userData.target = b.id;
    hits.push(hit);
    anchors[b.id] = new THREE.Vector3(b.x, gy + 0.25 + s.h + s.ph + (b.kind === "hall" ? 2.2 : 0.9), b.z);
    pool(b.door.x, b.door.z, 2.3, gy);
  }

  // ---------- fountain ----------
  const fy = heightAt(FOUNTAIN.x, FOUNTAIN.z);
  const ftn = put(statics, new THREE.Group(), FOUNTAIN.x, fy, FOUNTAIN.z);
  put(ftn, cyl(2.38, 2.48, 0.6, stoneMat, 44), 0, 0.3, 0);
  put(ftn, mesh(new THREE.TorusGeometry(2.24, 0.17, 10, 56).rotateX(Math.PI / 2), K.stone("#ddd5c7")), 0, 0.62, 0);
  put(ftn, cyl(0.3, 0.38, 1.4, stoneMat, 16), 0, 0.95, 0);
  put(ftn, cyl(0.95, 0.38, 0.3, K.stone("#ddd5c7"), 28), 0, 1.6, 0);
  put(ftn, cyl(0.12, 0.16, 0.4, stoneMat, 12), 0, 1.9, 0);
  put(ftn, sph(0.17, K.stone("#ddd5c7"), 14, 10), 0, 2.15, 0);
  const waterU = { uTime: U.uTime, uDay: { value: 1 }, uSplash: { value: new THREE.Vector4(0, 0, -10, 0) } };
  const fWaterMat = new THREE.ShaderMaterial({
    uniforms: waterU,
    vertexShader: "varying vec2 vP; void main(){ vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: /* glsl */ `
      uniform float uTime, uDay; uniform vec4 uSplash; varying vec2 vP;
      void main(){
        float r = length(vP);
        float rip = sin(r * 11.0 - uTime * 3.2) * 0.5 + 0.5;
        float sp = 0.0;
        float age = uTime - uSplash.z;
        if (age > 0.0 && age < 2.5) { float d = length(vP - uSplash.xy); sp = smoothstep(0.12, 0.0, abs(d - age * 0.9)) * (1.0 - age / 2.5); }
        vec3 col = mix(vec3(0.16, 0.55, 0.66), vec3(0.42, 0.82, 0.88), smoothstep(2.0, 0.3, r));
        col += vec3(0.5) * pow(rip, 8.0) * 0.18 + vec3(1.0) * sp * 0.8;
        col *= mix(0.35, 1.0, uDay);
        gl_FragColor = vec4(col, 0.92);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
  });
  put(ftn, mesh(new THREE.CircleGeometry(2.1, 48).rotateX(-Math.PI / 2), fWaterMat, false, false), 0, 0.64, 0);
  put(ftn, mesh(new THREE.CircleGeometry(0.86, 32).rotateX(-Math.PI / 2), fWaterMat, false, false), 0, 1.77, 0);
  colliders.push({ x: FOUNTAIN.x, z: FOUNTAIN.z, r: 2.5 });
  anchors.fountain = new THREE.Vector3(FOUNTAIN.x, fy + 2.6, FOUNTAIN.z);
  // falling droplets
  const DN = 54, drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 6, 5), new THREE.MeshStandardMaterial({ color: "#d8f6ff", emissive: "#7fd8ea", emissiveIntensity: 0.35, roughness: 0.1 }), DN);
  drops.frustumCulled = false;
  dynamic.add(drops);
  const dropState = Array.from({ length: DN }, (_, i) => ({ t: (i / DN) * 1.1, a: (i / DN) * Math.PI * 2 * 3.7 }));
  const dm = new THREE.Matrix4();
  anims.push((t, dt) => {
    dropState.forEach((d, i) => {
      d.t += dt;
      if (d.t > 1.1) d.t -= 1.1;
      const tt = d.t, low = i % 3 === 0;
      const r = (low ? 0.55 : 0.32) * tt * 2.2, y = 2.25 + (low ? 1.4 : 2.1) * tt - 4.6 * tt * tt;
      dm.makeTranslation(FOUNTAIN.x + Math.cos(d.a) * r, fy + Math.max(y, low ? 0.64 : 1.77), FOUNTAIN.z + Math.sin(d.a) * r);
      drops.setMatrixAt(i, dm);
    });
    drops.instanceMatrix.needsUpdate = true;
  });

  // ---------- portal ----------
  const py = heightAt(PORTAL.x, PORTAL.z);
  const ptl = put(statics, new THREE.Group(), PORTAL.x, py, PORTAL.z, PORTAL.rot);
  put(ptl, cyl(3.3, 3.45, 0.22, stoneDark, 40), 0, 0.11, 0);
  put(ptl, cyl(2.9, 3.0, 0.42, stoneMat, 40), 0, 0.21, 0);
  const ring = put(ptl, mesh(new THREE.TorusGeometry(2.05, 0.32, 14, 56), K.stone("#bdb3a3")), 0, 2.72, 0);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    put(ptl, rb(0.22, 0.22, 0.7, K.rune, 0.05), Math.cos(a) * 2.05, 2.72 + Math.sin(a) * 2.05, 0, 0, 0, a);
  }
  [-1, 1].forEach((s) => {
    put(ptl, tbox(0.62, 2.0, 0.7, stoneMat, 1, 0.08), s * 2.35, 1.4, 0);
    put(ptl, tbox(0.8, 0.22, 0.85, stoneDark, 1, 0.05), s * 2.35, 2.46, 0);
    colliders.push({ x: PORTAL.x - s * 2.35, z: PORTAL.z, r: 0.55 });
  });
  void ring;
  const swirlU = { uTime: U.uTime };
  const swirl = new THREE.Mesh(
    new THREE.CircleGeometry(1.78, 64),
    new THREE.ShaderMaterial({
      uniforms: swirlU,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: /* glsl */ `
        uniform float uTime; varying vec2 vUv;
        void main(){
          vec2 p = vUv * 2.0 - 1.0; float r = length(p), a = atan(p.y, p.x);
          float s1 = sin(a * 3.0 + r * 9.0 - uTime * 2.6) * 0.5 + 0.5;
          float s2 = sin(a * 5.0 - r * 15.0 + uTime * 1.9) * 0.5 + 0.5;
          vec3 col = mix(vec3(0.12, 0.62, 0.78), vec3(0.42, 0.36, 0.95), s1 * 0.6);
          col += vec3(0.75, 1.0, 1.0) * pow(s2, 5.0) * 0.9 + vec3(1.0) * pow(1.0 - r, 3.0) * 1.1;
          gl_FragColor = vec4(col * 1.7, smoothstep(1.0, 0.9, r) * 0.95);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    })
  );
  swirl.position.set(PORTAL.x, py + 2.72, PORTAL.z);
  swirl.rotation.y = PORTAL.rot;
  dynamic.add(swirl);
  platforms.push({ x: PORTAL.x, z: PORTAL.z, r: 3.0, y: py + 0.42 });
  const orbit = [];
  for (let i = 0; i < 6; i++) {
    const o = mesh(new THREE.OctahedronGeometry(0.16, 0), K.rune, true, false);
    dynamic.add(o);
    orbit.push(o);
  }
  anims.push((t) => {
    orbit.forEach((o, i) => {
      const a = t * 0.5 + (i / 6) * Math.PI * 2;
      o.position.set(PORTAL.x + Math.cos(a) * 2.9, py + 2.72 + Math.sin(a) * 2.9 * 0.85 + Math.sin(t * 2 + i) * 0.12, PORTAL.z + Math.sin(t + i) * 0.35);
      o.rotation.set(t + i, t * 1.3, 0);
    });
  });
  const ph = new THREE.Mesh(new THREE.BoxGeometry(5.6, 5.4, 1.6), hitMat);
  ph.position.set(PORTAL.x, py + 2.7, PORTAL.z);
  ph.userData.target = "portal";
  hits.push(ph);
  anchors.portal = new THREE.Vector3(PORTAL.x, py + 5.6, PORTAL.z);
  pool(PORTAL.x, PORTAL.z, 3.6, py + 0.42);

  // ---------- signpost ----------
  const sy = heightAt(SIGNPOST.x, SIGNPOST.z);
  const sp = put(statics, new THREE.Group(), SIGNPOST.x, sy, SIGNPOST.z);
  put(sp, cyl(0.09, 0.11, 2.6, woodDark, 8), 0, 1.3, 0);
  put(sp, mesh(new THREE.ConeGeometry(0.14, 0.2, 8), woodDark), 0, 2.7, 0);
  const targets = [["QUEST HALL", BUILDINGS[0]], ["THE INN", BUILDINGS[4]], ["PORTAL", PORTAL], ["STUDIO", BUILDINGS[1]], ["WORKSHOP", BUILDINGS[3]]];
  targets.forEach(([label, tgt], i) => {
    const ang = Math.atan2(tgt.x - SIGNPOST.x, tgt.z - SIGNPOST.z) - Math.PI / 2;
    const arm = put(sp, new THREE.Group(), 0, 2.35 - i * 0.36, 0, ang);
    put(arm, tbox(1.35, 0.28, 0.07, woodPale, 1, 0.02), 0.62, 0, 0);
    put(arm, mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.07, 3).rotateX(Math.PI / 2).rotateZ(Math.PI / 2), woodPale), 1.36, 0, 0);
    const tex = signTexture(label, { bg: "#d2a877", fg: "#4a3020", w: 512, h: 104, size: 58 });
    const sm = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
    put(arm, mesh(new THREE.PlaneGeometry(1.25, 0.25), sm, false), 0.6, 0, 0.04);
    put(arm, mesh(new THREE.PlaneGeometry(1.25, 0.25), sm, false), 0.6, 0, -0.04, Math.PI);
  });
  colliders.push({ x: SIGNPOST.x, z: SIGNPOST.z, r: 0.3 });
  const sh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3, 1.4), hitMat);
  sh.position.set(SIGNPOST.x, sy + 1.5, SIGNPOST.z);
  sh.userData.target = "sign";
  hits.push(sh);
  anchors.sign = new THREE.Vector3(SIGNPOST.x, sy + 3.3, SIGNPOST.z);

  // ---------- benches around the plaza ----------
  for (const b of BENCHES) {
    const by = heightAt(b.x, b.z);
    const be = put(statics, new THREE.Group(), b.x, by, b.z, b.rot);
    put(be, tbox(1.6, 0.08, 0.46, wood, 1, 0.02), 0, 0.48, 0);
    put(be, tbox(1.6, 0.36, 0.06, wood, 1, 0.02), 0, 0.8, -0.21, 0, -0.12);
    [-0.66, 0.66].forEach((x) => put(be, rb(0.08, 0.48, 0.44, metal, 0.02), x, 0.24, 0));
    colliders.push({ box: true, x: b.x, z: b.z, rot: b.rot, hw: 0.85, hd: 0.3 });
  }

  // ---------- street lamps ----------
  for (const l of LAMPS) {
    const ly = heightAt(l.x, l.z);
    const lp = put(statics, new THREE.Group(), l.x, ly, l.z);
    put(lp, rb(0.32, 0.26, 0.32, metal, 0.05), 0, 0.13, 0);
    put(lp, cyl(0.05, 0.065, 2.5, metal, 8), 0, 1.4, 0);
    put(lp, rb(0.34, 0.06, 0.34, metal, 0.02), 0, 2.66, 0);
    put(lp, rb(0.26, 0.36, 0.26, K.lamp, 0.04), 0, 2.88, 0);
    put(lp, mesh(new THREE.ConeGeometry(0.26, 0.24, 4).rotateY(Math.PI / 4), metal), 0, 3.17, 0);
    put(lp, sph(0.04, metal, 6, 5), 0, 3.31, 0);
    colliders.push({ x: l.x, z: l.z, r: 0.28 });
    pool(l.x, l.z, 2.8, ly);
  }

  // ---------- windmill on the hill ----------
  const wy = heightAt(WINDMILL.x, WINDMILL.z);
  const wm = put(statics, new THREE.Group(), WINDMILL.x, wy, WINDMILL.z);
  put(wm, cyl(2.0, 2.15, 0.5, stoneDark, 18), 0, 0.1, 0);
  const tower = new THREE.CylinderGeometry(1.15, 1.75, 5.8, 18, 1);
  const tuv = tower.attributes.uv;
  for (let i = 0; i < tuv.count; i++) tuv.setXY(i, tuv.getX(i) * 4, tuv.getY(i) * 2.6);
  put(wm, mesh(tower, plaster("#f4efe4")), 0, 3.25, 0);
  put(wm, cyl(1.3, 1.25, 0.25, woodDark, 18), 0, 6.2, 0);
  const capG = new THREE.ConeGeometry(1.55, 1.7, 18);
  const cuv = capG.attributes.uv;
  for (let i = 0; i < cuv.count; i++) cuv.setXY(i, cuv.getX(i) * 4, cuv.getY(i) * 1.4);
  put(wm, mesh(capG, K.roof("#a65a3c")), 0, 7.15, 0);
  put(wm, tbox(0.85, 1.6, 0.2, woodDark, 1, 0.04), 0, 1.15, 1.68, 0, -0.07);
  windowAt(wm, 0, 3.6, 1.43, 0.55, 0.6, woodDark);
  windowAt(put(wm, new THREE.Group(), 0, 0, 0, Math.PI), 0, 2.3, 1.58, 0.5, 0.55, woodDark);
  const sails = new THREE.Group();
  sails.position.set(WINDMILL.x, wy + 5.35, WINDMILL.z + 1.6);
  put(sails, cyl(0.24, 0.24, 0.5, woodDark, 12), 0, 0, 0, 0, Math.PI / 2);
  for (let k = 0; k < 4; k++) {
    const arm = put(sails, new THREE.Group(), 0, 0, 0.18, 0, 0, (k * Math.PI) / 2);
    put(arm, tbox(0.14, 4.4, 0.1, woodDark, 1, 0.03), 0, 2.3, 0);
    put(arm, tbox(0.86, 3.1, 0.04, K.plain("#f7f0e0", 0.95), 1, 0.01), 0.5, 2.75, 0);
    [1.4, 2.4, 3.4].forEach((y) => put(arm, rb(0.92, 0.04, 0.06, woodDark, 0.01), 0.5, y, 0.02));
    put(arm, rb(0.04, 3.1, 0.06, woodDark, 0.01), 0.93, 2.75, 0.02);
  }
  dynamic.add(sails);
  anims.push((t, dt) => (sails.rotation.z -= dt * 0.55));
  colliders.push({ x: WINDMILL.x, z: WINDMILL.z, r: 2.1 });
  // hay bales
  [[2.9, 1.2], [3.4, -0.4], [-2.8, 1.6]].forEach(([dx, dz], i) => {
    const x = WINDMILL.x + dx, z = WINDMILL.z + dz, y = heightAt(x, z);
    put(statics, cyl(0.5, 0.5, 0.95, K.plain("#e8c66a", 0.95), 16), x, y + 0.48, z, R() * 3, 0, Math.PI / 2);
    colliders.push({ x, z, r: 0.6 });
    void i;
  });

  // ---------- farm: fenced crop rows with pumpkins and sunflowers ----------
  const fence = (x0, z0, x1, z1) => {
    const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(2, Math.round(L / 1.1));
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n, z = z0 + ((z1 - z0) * i) / n, y = heightAt(x, z);
      put(statics, tbox(0.12, 0.85, 0.12, woodPale, 1, 0.03), x, y + 0.42, z);
    }
    const ang = Math.atan2(x1 - x0, z1 - z0);
    [0.35, 0.7].forEach((hh) => {
      const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      put(statics, tbox(0.06, 0.09, L, woodPale, 1, 0.02), mx, heightAt(mx, mz) + hh, mz, ang);
    });
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    colliders.push({ box: true, x: mx, z: mz, rot: ang, hw: 0.12, hd: L / 2 });
  };
  const { x0, x1, z0, z1 } = FARM, gapA = (x0 + x1) / 2 - 1.0, gapB = (x0 + x1) / 2 + 1.0;
  fence(x0, z0, x1, z0);
  fence(x0, z0, x0, z1);
  fence(x1, z0, x1, z1);
  fence(x0, z1, gapA, z1);
  fence(gapB, z1, x1, z1);
  for (let r = 0; r < 4; r++) {
    const z = z0 + 0.75 + r * ((z1 - z0 - 1.5) / 3);
    for (let x = x0 + 0.6; x < x1 - 0.4; x += 0.62) {
      const y = heightAt(x, z);
      put(statics, sph(0.22, K.plain("#6b4a33", 1), 8, 6), x, y + 0.02, z).scale.set(1.6, 0.45, 1.2);
      if (r === 0 && R() < 0.55) {
        const p = put(statics, sph(0.26, K.plain("#f08a2c", 0.6), 14, 10), x, y + 0.2, z);
        p.scale.set(1.15, 0.8, 1.15);
        put(statics, cyl(0.03, 0.03, 0.14, K.plain("#5a7a2a"), 5), x, y + 0.42, z);
      } else if (r === 3) {
        put(statics, cyl(0.035, 0.045, 1.5, K.plain("#5f8f3a"), 6), x, y + 0.75, z);
        const head = put(statics, new THREE.Group(), x, y + 1.55, z + 0.05, 0, -0.35);
        put(head, cyl(0.24, 0.24, 0.06, K.plain("#ffcf3a", 0.8), 14), 0, 0, 0, 0, Math.PI / 2);
        put(head, cyl(0.13, 0.13, 0.08, K.plain("#6b4423", 0.9), 12), 0, 0, 0.02, 0, Math.PI / 2);
        put(statics, sph(0.12, K.plain("#5f9e45"), 8, 6), x + 0.12, y + 0.8, z).scale.set(1.4, 0.5, 0.9);
      } else {
        put(statics, sph(0.2 + R() * 0.06, K.plain(r === 1 ? "#8fcf5a" : "#5fae4a", 0.85), 10, 8), x, y + 0.2, z).scale.set(1, 0.75, 1);
      }
    }
  }

  // ---------- lighthouse on the cape ----------
  const ly = heightAt(LIGHTHOUSE.x, LIGHTHOUSE.z);
  const lh = put(statics, new THREE.Group(), LIGHTHOUSE.x, ly, LIGHTHOUSE.z);
  put(lh, cyl(1.7, 1.85, 0.5, stoneDark, 20), 0, 0.15, 0);
  const bands = 5, H = 7.2, r0 = 1.35, r1 = 0.92;
  for (let i = 0; i < bands; i++) {
    const a = i / bands, b = (i + 1) / bands;
    put(lh, cyl(r0 + (r1 - r0) * b, r0 + (r1 - r0) * a, H / bands, K.plain(i % 2 ? "#d64f45" : "#f6f3ec", 0.7), 22), 0, 0.4 + (H / bands) * (i + 0.5), 0);
  }
  const top = 0.4 + H;
  put(lh, cyl(1.32, 1.18, 0.16, metal, 22), 0, top + 0.08, 0);
  put(lh, mesh(new THREE.TorusGeometry(1.26, 0.035, 6, 32).rotateX(Math.PI / 2), metal), 0, top + 0.6, 0);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    put(lh, cyl(0.025, 0.025, 0.5, metal, 4), Math.cos(a) * 1.26, top + 0.37, Math.sin(a) * 1.26);
  }
  put(lh, cyl(0.68, 0.68, 1.0, K.lamp, 16), 0, top + 0.66, 0);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    put(lh, cyl(0.035, 0.035, 1.0, metal, 4), Math.cos(a) * 0.7, top + 0.66, Math.sin(a) * 0.7);
  }
  put(lh, mesh(new THREE.ConeGeometry(0.95, 0.85, 18), K.plain("#d64f45", 0.6)), 0, top + 1.6, 0);
  put(lh, sph(0.12, metal, 10, 8), 0, top + 2.08, 0);
  const ldx = LIGHTHOUSE.door.x - LIGHTHOUSE.x, ldz = LIGHTHOUSE.door.z - LIGHTHOUSE.z, lang = Math.atan2(ldx, ldz);
  const ldoor = put(lh, new THREE.Group(), 0, 0, 0, lang);
  put(ldoor, tbox(0.8, 1.6, 0.2, woodDark, 1, 0.04), 0, 1.2, 1.3);
  [2.8, 4.6].forEach((y) => put(ldoor, rb(0.3, 0.45, 0.12, K.window, 0.03), 0, y, 1.35 - 0.43 * ((y - 0.4) / 7.2) + 0.02));
  const beam = new THREE.Group();
  beam.position.set(LIGHTHOUSE.x, ly + top + 0.66, LIGHTHOUSE.z);
  // light beam: fades along its length so it never reads as a hard disc
  const beamMat = new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: "varying float vK; void main(){ vK = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform float uOpacity; varying float vK; void main(){ gl_FragColor = vec4(vec3(1.0, 0.94, 0.75) * uOpacity * pow(vK, 2.2), 1.0); }",
  });
  [1, -1].forEach((s) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 18, 24, 1, true).translate(0, -9, 0).rotateZ((s * Math.PI) / 2), beamMat);
    beam.add(cone);
  });
  dynamic.add(beam);
  anims.push((t, dt, env) => {
    beam.rotation.y += dt * 0.7;
    beamMat.uniforms.uOpacity.value = env.night * 0.32;
    beam.visible = env.night > 0.05;
  });
  colliders.push({ x: LIGHTHOUSE.x, z: LIGHTHOUSE.z, r: 1.7 });
  anchors.lighthouse = new THREE.Vector3(LIGHTHOUSE.x, ly + top + 2.6, LIGHTHOUSE.z);

  // ---------- dock + boat ----------
  const dock = put(statics, new THREE.Group(), DOCK.x, 0, DOCK.z, DOCK.rot);
  for (let i = 0; i * 0.43 < DOCK.len; i++) {
    put(dock, tbox(DOCK.half * 2, 0.08, 0.39, i % 3 === 1 ? woodPale : wood, 1, 0.02), (R() - 0.5) * 0.06, DOCK.y, i * 0.43 + 0.2, (R() - 0.5) * 0.03);
  }
  [-1, 1].forEach((s) => {
    put(dock, tbox(0.14, 0.16, DOCK.len, woodDark, 1, 0.03), s * (DOCK.half - 0.2), DOCK.y - 0.12, DOCK.len / 2);
    for (let z = 0.2; z <= DOCK.len; z += 2.2) put(dock, cyl(0.11, 0.12, 3.4, woodDark, 8), s * DOCK.half, DOCK.y - 1.3, z);
  });
  const endPost = put(dock, new THREE.Group(), DOCK.half, DOCK.y, DOCK.len - 0.2);
  put(endPost, cyl(0.06, 0.07, 1.6, metal, 8), 0, 0.8, 0);
  put(endPost, rb(0.24, 0.32, 0.24, K.lamp, 0.04), 0, 1.75, 0);
  put(endPost, mesh(new THREE.ConeGeometry(0.22, 0.2, 4).rotateY(Math.PI / 4), metal), 0, 2.0, 0);
  const endW = { x: DOCK.x + DOCK.dx * (DOCK.len - 0.2) + DOCK.dz * DOCK.half, z: DOCK.z + DOCK.dz * (DOCK.len - 0.2) - DOCK.dx * DOCK.half };
  pool(endW.x, endW.z, 3, 0.02);
  const boat = new THREE.Group();
  const hull = mesh(new THREE.SphereGeometry(1, 22, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#c96a3f", roughness: 0.75, side: THREE.DoubleSide }));
  hull.scale.set(0.8, 0.5, 1.9);
  boat.add(hull);
  put(boat, mesh(new THREE.TorusGeometry(1, 0.06, 6, 30).rotateX(Math.PI / 2), K.plain("#f6f3ec", 0.6)), 0, 0, 0).scale.set(0.8, 1, 1.9);
  [-0.5, 0.45].forEach((z) => put(boat, tbox(1.4, 0.06, 0.32, woodPale, 1, 0.02), 0, -0.12, z));
  const bx = DOCK.x + DOCK.dx * (DOCK.len - 2.2) - DOCK.dz * (DOCK.half + 1.2), bz = DOCK.z + DOCK.dz * (DOCK.len - 2.2) + DOCK.dx * (DOCK.half + 1.2);
  boat.position.set(bx, 0.12, bz);
  boat.rotation.y = DOCK.rot + 0.12;
  dynamic.add(boat);
  anims.push((t) => {
    boat.position.y = 0.12 + Math.sin(t * 1.3) * 0.06;
    boat.rotation.z = Math.sin(t * 1.05) * 0.05;
    boat.rotation.x = Math.sin(t * 0.8 + 1) * 0.03;
  });
  colliders.push({ x: bx, z: bz, r: 1.2 });

  // ---------- trees ----------
  const T = { round: ["#3f7f34", "#86c15a"], fruit: ["#3c7a35", "#7fbe57"], blossom: ["#e98aa9", "#ffd3e1"], pine: ["#2f6a3a", "#5fa055"] };
  const tc = new THREE.Color(), tl = new THREE.Color();
  function paint(geo, dark, light, cx, cy, cz, y0, y1, noise = 0.08) {
    const p = geo.attributes.position, n = geo.attributes.normal, cols = new Float32Array(p.count * 3);
    tc.set(dark);
    tl.set(light);
    const c = new THREE.Color(), v = new THREE.Vector3(), d = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      d.set(v.x - cx, (v.y - cy) * 1.15, v.z - cz).normalize();
      const nn = new THREE.Vector3().fromBufferAttribute(n, i).multiplyScalar(0.35).addScaledVector(d, 0.65).normalize();
      n.setXYZ(i, nn.x, nn.y, nn.z);
      const k = smooth(y0, y1, v.y);
      const h = Math.sin(v.x * 12.9898 + v.y * 78.233 + v.z * 37.719) * 43758.5453;
      const j = 1 + ((h - Math.floor(h)) - 0.5) * noise;
      c.copy(tc).lerp(tl, Math.pow(k, 0.85)).multiplyScalar(j);
      cols.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    return geo;
  }
  function dotColors(geo, color) {
    const c = new THREE.Color(color), cols = new Float32Array(geo.attributes.position.count * 3);
    for (let i = 0; i < geo.attributes.position.count; i++) cols.set([c.r, c.g, c.b], i * 3);
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    return geo;
  }

  for (const tr of TREES) {
    const r2 = rng(tr.seed), s = tr.s;
    const g = new THREE.Group();
    g.position.set(tr.x, tr.y - 0.05, tr.z);
    g.rotation.y = tr.rot;
    if (tr.type === "pine") {
      const th = 0.9 * s;
      put(g, cyl(0.13 * s, 0.22 * s, th + 0.4, bark, 7), 0, (th + 0.4) / 2, 0);
      const tiers = [];
      const nT = 4;
      for (let i = 0; i < nT; i++) {
        const rad = (1.55 - i * 0.3) * s, hh = (1.5 - i * 0.12) * s, y = th + i * 0.95 * s + hh / 2;
        tiers.push(new THREE.ConeGeometry(rad, hh, 10, 1).toNonIndexed().translate((r2() - 0.5) * 0.1, y, (r2() - 0.5) * 0.1));
      }
      const geo = mergeGeometries(tiers);
      paint(geo, T.pine[0], T.pine[1], 0, th + 1.6 * s, 0, th, th + 4.2 * s, 0.1);
      put(g, mesh(geo, leafMat), 0, 0, 0);
      colliders.push({ x: tr.x, z: tr.z, r: 0.4 * s });
    } else {
      const th = (1.25 + r2() * 0.35) * s;
      const trunk = new THREE.CylinderGeometry(0.15 * s, 0.24 * s, th + 0.5, 8);
      put(g, mesh(trunk, bark), 0, (th + 0.5) / 2, 0);
      put(g, mesh(new THREE.ConeGeometry(0.42 * s, 0.4, 8), bark), 0, 0.15, 0);
      const cy = th + 1.05 * s, puffs = [];
      puffs.push(new THREE.IcosahedronGeometry(1.3 * s, 2).translate(0, cy, 0));
      const n = 4 + Math.floor(r2() * 3);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r2() * 0.6, rr = (0.95 + r2() * 0.25) * s;
        puffs.push(new THREE.IcosahedronGeometry((0.72 + r2() * 0.28) * s, 2).translate(Math.cos(a) * rr, cy - 0.25 * s + r2() * 0.55 * s, Math.sin(a) * rr));
      }
      puffs.push(new THREE.IcosahedronGeometry(0.85 * s, 2).translate(0.1 * s, cy + 0.85 * s, -0.05 * s));
      const geo = mergeGeometries(puffs);
      const pal = T[tr.type];
      paint(geo, pal[0], pal[1], 0, cy, 0, cy - 1.3 * s, cy + 1.6 * s);
      const extra = [];
      if (tr.type === "fruit" || tr.type === "blossom") {
        const N = tr.type === "fruit" ? 12 : 20;
        for (let i = 0; i < N; i++) {
          const a = i * 2.399 + r2(), y = (r2() * 2 - 0.6) * s, rad = Math.sqrt(Math.max(0, (1.75 * s) ** 2 - y * y)) * 0.97;
          extra.push(dotColors(new THREE.IcosahedronGeometry(tr.type === "fruit" ? 0.13 * s : 0.11 * s, 1).translate(Math.cos(a) * rad, cy + y * 0.8, Math.sin(a) * rad), tr.type === "fruit" ? (i % 3 ? "#e8453c" : "#ffb02e") : i % 2 ? "#ffffff" : "#ffeef4"));
        }
      }
      put(g, mesh(extra.length ? mergeGeometries([geo, ...extra]) : geo, leafMat), 0, 0, 0);
      colliders.push({ x: tr.x, z: tr.z, r: 0.42 * s });
    }
    statics.add(g);
  }

  // ---------- bushes ----------
  for (const b of BUSHES) {
    const r2 = rng(b.seed), s = b.s, puffs = [];
    for (let i = 0; i < 3 + Math.floor(r2() * 2); i++) puffs.push(new THREE.IcosahedronGeometry((0.5 + r2() * 0.25) * s, 1).translate((r2() - 0.5) * 0.9 * s, (0.35 + r2() * 0.2) * s, (r2() - 0.5) * 0.7 * s));
    const geo = mergeGeometries(puffs);
    paint(geo, "#3f7f34", "#8cc65c", 0, 0.4 * s, 0, 0, 0.95 * s);
    const parts = [geo];
    if (b.berry) for (let i = 0; i < 7; i++) parts.push(dotColors(new THREE.IcosahedronGeometry(0.06, 0).translate((r2() - 0.5) * 1.0 * s, (0.4 + r2() * 0.35) * s, (0.25 + r2() * 0.2) * s), "#e8453c"));
    put(statics, mesh(parts.length > 1 ? mergeGeometries(parts) : geo, leafStill), b.x, b.y - 0.08, b.z, r2() * 6);
  }

  // ---------- rocks ----------
  const rockMat = patch(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }));
  for (const r of ROCKS) {
    const r2 = rng(r.seed), geo = new THREE.DodecahedronGeometry(1, 1);
    const p = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const h = Math.sin(v.x * 3.1 + v.y * 5.7 + v.z * 2.3 + r.seed) * 0.5 + 0.5;
      v.multiplyScalar(0.82 + h * 0.3);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const base = ["#a9a194", "#b7aea0", "#9b9488"][Math.floor(r2() * 3)];
    paint(geo, "#837c70", base, 0, 0.3, 0, -0.8, 0.8, 0.12);
    // keep flat-shaded facets: restore geometric normals
    geo.computeVertexNormals();
    const m = put(statics, mesh(geo, rockMat), r.x, r.y - 0.25 * r.s, r.z, r2() * 6, r2() * 0.3, r2() * 0.3);
    m.scale.set(r.s * (1 + r2() * 0.4), r.s * (0.55 + r2() * 0.3), r.s);
    if (r.y > -0.4) colliders.push({ x: r.x, z: r.z, r: 0.85 * r.s });
  }

  // ---------- mushrooms near some trees ----------
  TREES.filter((_, i) => i % 7 === 2).forEach((tr) => {
    const r2 = rng(tr.seed + 5);
    for (let i = 0; i < 3; i++) {
      const a = r2() * 6.28, x = tr.x + Math.cos(a) * 1.0, z = tr.z + Math.sin(a) * 1.0, y = heightAt(x, z), s = 0.7 + r2() * 0.6;
      put(statics, cyl(0.05 * s, 0.06 * s, 0.22 * s, K.plain("#fbf3e6"), 8), x, y + 0.1 * s, z);
      const c = put(statics, mesh(new THREE.SphereGeometry(0.15 * s, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), K.plain(i % 2 ? "#e8453c" : "#f08a2c", 0.6)), x, y + 0.2 * s, z);
      c.scale.y = 0.75;
    }
  });

  // ---------- pull animated parts out, then merge static meshes by material ----------
  statics.updateMatrixWorld(true);
  dynamic.updateMatrixWorld(true);
  for (const o of toDynamic) dynamic.attach(o);
  for (const sm of smokes) sm.world = sm.local.clone().applyMatrix4(sm.group.matrixWorld);
  const merged = mergeStatic(statics);
  const mergedPools = mergeStatic(pools);
  mergedPools.children.forEach((m) => (m.renderOrder = 1));

  return { merged, mergedPools, dynamic, anims, colliders, platforms, hits, smokes, anchors, waterU, fountainY: fy, quality };
}

/** Bake world transforms and merge meshes that share a material. */
export function mergeStatic(root) {
  root.updateMatrixWorld(true);
  const buckets = new Map();
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh) return;
    const key = `${o.material.uuid}|${o.castShadow}|${o.receiveShadow}|${o.renderOrder}`;
    if (!buckets.has(key)) buckets.set(key, { mat: o.material, cast: o.castShadow, recv: o.receiveShadow, geos: [] });
    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const n of Object.keys(g.attributes)) if (!["position", "normal", "uv", "color"].includes(n)) g.deleteAttribute(n);
    if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    if (!g.attributes.normal) g.computeVertexNormals();
    if (o.material.vertexColors) {
      if (!g.attributes.color) g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(1), 3));
    } else if (g.attributes.color) g.deleteAttribute("color");
    g.clearGroups();
    g.applyMatrix4(o.matrixWorld);
    buckets.get(key).geos.push(g);
  });
  const out = new THREE.Group();
  for (const b of buckets.values()) {
    const geo = mergeGeometries(b.geos);
    if (!geo) continue;
    geo.computeBoundingSphere();
    const m = new THREE.Mesh(geo, b.mat);
    m.castShadow = b.cast;
    m.receiveShadow = b.recv;
    out.add(m);
  }
  return out;
}
