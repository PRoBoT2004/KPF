// Building interiors: cutaway rooms (three walls + a low front wall) with framed
// project covers you can walk up to, and a desk/lectern that opens the matching
// panel so nothing from the old pop-ups is lost. Built lazily on first entry.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { projects } from "@/data/portfolio";
import { mergeStatic } from "./props";
import { paintingTexture } from "./materials";

const pick = (ids) => ids.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

export const ROOMS = {
  hall: { title: "Quest Hall", zone: "projects", W: 16, D: 10, wall: "#f4e6c9", floor: "#b8875a", trim: "#7a5134", rug: "#c8553d",
    frames: pick(["shop-erp", "touchpe", "vitran", "trade-crm", "hazeberg", "enda", "primedigitals", "patel-enterprise"]) },
  studio: { title: "Designer's Studio", zone: "designer", W: 11, D: 8.5, wall: "#f8e2da", floor: "#d6b088", trim: "#fbf3ea", rug: "#5aa5a0",
    frames: pick(["enda", "hazeberg", "meditrack", "vitran"]) },
  forge: { title: "Builder's Forge", zone: "builder", W: 11, D: 8.5, wall: "#cdbfac", floor: "#8f6a49", trim: "#4a3426", rug: "#d4a848",
    frames: pick(["touchpe", "shop-erp", "trade-crm", "vitran"]) },
  workshop: { title: "Engineer's Workshop", zone: "engineer", W: 11, D: 8.5, wall: "#e4edf0", floor: "#c9a27a", trim: "#2f4f5a", rug: "#3e9e98",
    frames: pick(["shop-erp", "touchpe", "vitran", "trade-crm"]) },
  inn: { title: "The Inn", zone: "inn", W: 11, D: 8.5, wall: "#f3e7cc", floor: "#a8794f", trim: "#6e4a32", rug: "#4c8a5e", frames: [] },
};

// ---------- helpers ----------
const mesh = (g, m, cast = true, recv = true) => {
  const o = new THREE.Mesh(g, m);
  o.castShadow = cast;
  o.receiveShadow = recv;
  return o;
};
const rbGeo = (w, h, d, r = 0.05) => new RoundedBoxGeometry(w, h, d, 2, Math.max(0.001, Math.min(r, w / 2.05, h / 2.05, d / 2.05)));
function boxUV(g, w, h, d, unit) {
  const n = g.attributes.normal, uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const [su, sv] = ax >= ay && ax >= az ? [d, h] : ay >= az ? [w, d] : [w, h];
    uv.setXY(i, (uv.getX(i) * su) / unit, (uv.getY(i) * sv) / unit);
  }
  return g;
}
const tbox = (w, h, d, m, unit = 1.5, r = 0.04) => mesh(boxUV(rbGeo(w, h, d, r), w, h, d, unit), m);
const cyl = (a, b, h, m, s = 16) => mesh(new THREE.CylinderGeometry(a, b, h, s), m);
const sph = (r, m, w = 14, h = 10) => mesh(new THREE.SphereGeometry(r, w, h), m);
function put(parent, o, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0) {
  o.position.set(x, y, z);
  o.rotation.set(rx, ry, rz);
  parent.add(o);
  return o;
}
function canvasTex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
const plaqueTex = (title, sub) =>
  canvasTex(512, 128, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, "#e7c873");
    grd.addColorStop(1, "#b98f3a");
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(60,40,10,0.45)";
    g.lineWidth = 6;
    g.strokeRect(5, 5, w - 10, h - 10);
    g.textAlign = "center";
    g.fillStyle = "#3a2810";
    g.font = '700 46px "Segoe UI", system-ui, sans-serif';
    g.fillText(title, w / 2, 58);
    g.font = '500 28px "Segoe UI", system-ui, sans-serif';
    g.fillStyle = "rgba(58,40,16,0.8)";
    g.fillText(sub.length > 34 ? sub.slice(0, 33) + "…" : sub, w / 2, 100);
  });
const codeTex = () =>
  canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = "#0f1b24";
    g.fillRect(0, 0, w, h);
    const cols = ["#4fd1c5", "#e07b6b", "#d4a848", "#9aa8b5", "#b9a3ff"];
    for (let i = 0; i < 12; i++) {
      let x = 12 + (i % 4 === 0 ? 0 : 16 * ((i * 7) % 3));
      const y = 14 + i * 12;
      for (let k = 0; k < 3; k++) {
        const len = 18 + ((i * 13 + k * 29) % 60);
        g.fillStyle = cols[(i + k) % cols.length];
        g.fillRect(x, y, len, 5);
        x += len + 8;
      }
    }
  });
const uiTex = () =>
  canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = "#fbf6ef";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#e07b6b";
    g.fillRect(0, 0, w, 22);
    g.fillStyle = "#f1e3dc";
    g.fillRect(12, 34, 70, 112);
    [["#e07b6b", 96, 34, 148, 50], ["#4fd1c5", 96, 94, 70, 52], ["#d4a848", 174, 94, 70, 52]].forEach(([c, x, y, ww, hh]) => {
      g.fillStyle = c;
      g.globalAlpha = 0.85;
      g.fillRect(x, y, ww, hh);
    });
  });
const boardTex = () =>
  canvasTex(320, 200, (g, w, h) => {
    g.fillStyle = "#fbfcfd";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#2f4f5a";
    g.lineWidth = 4;
    [[24, 30, 80, 44], [130, 30, 80, 44], [236, 30, 64, 44], [80, 120, 90, 46], [200, 120, 90, 46]].forEach(([x, y, ww, hh]) => g.strokeRect(x, y, ww, hh));
    g.strokeStyle = "#e07b6b";
    g.beginPath();
    g.moveTo(104, 52); g.lineTo(130, 52);
    g.moveTo(210, 52); g.lineTo(236, 52);
    g.moveTo(170, 74); g.lineTo(125, 120);
    g.moveTo(170, 74); g.lineTo(245, 120);
    g.stroke();
  });
const rugTex = (col) =>
  canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = col;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(255,245,225,0.75)";
    g.lineWidth = 10;
    g.strokeRect(16, 16, w - 32, h - 32);
    g.lineWidth = 4;
    g.strokeRect(34, 34, w - 68, h - 68);
    g.fillStyle = "rgba(0,0,0,0.08)";
    for (let i = 0; i < 6; i++) g.fillRect(50 + i * 28, 50, 12, h - 100);
  });
const beamTex = () =>
  canvasTex(32, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, "rgba(255,240,205,0.95)");
    grd.addColorStop(1, "rgba(255,240,205,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
  });

const loader = typeof window !== "undefined" ? new THREE.TextureLoader() : null;

/** Build one room. Returns everything the engine needs to run it. */
export function buildInterior(kind, K) {
  const R = ROOMS[kind];
  const { W, D } = R, H = 3.3;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#1d1916");
  const statics = new THREE.Group();
  const dynamic = new THREE.Group();
  scene.add(dynamic);
  const colliders = [], spots = [], anims = [], disposables = [];
  const wall = K.plaster(R.wall), trim = K.wood(R.trim), floor = K.wood(R.floor), dark = K.wood("#5a3b26"), metal = K.metal("#3a3f47"), brass = K.plain("#c9a24a", 0.35);

  // ---- shell: plinth, floor, three walls, low front wall with a doorway ----
  put(statics, tbox(W + 0.9, 0.6, D + 0.9, K.stone("#8f877b"), 1.4, 0.08), 0, -0.4, 0);
  put(statics, tbox(W, 0.2, D, floor, 1.6, 0.02), 0, -0.1, 0);
  put(statics, tbox(W + 0.6, H, 0.3, wall, 2, 0.03), 0, H / 2, -D / 2 - 0.15);
  [-1, 1].forEach((s) => put(statics, tbox(0.3, H, D + 0.3, wall, 2, 0.03), s * (W / 2 + 0.15), H / 2, -0.15));
  // wainscot + crown trim
  put(statics, tbox(W, 1.0, 0.06, trim, 1, 0.02), 0, 0.5, -D / 2 + 0.03);
  put(statics, tbox(W + 0.6, 0.16, 0.36, trim, 1, 0.02), 0, H, -D / 2 - 0.15);
  [-1, 1].forEach((s) => {
    put(statics, tbox(0.06, 1.0, D, trim, 1, 0.02), s * (W / 2 - 0.03), 0.5, 0);
    put(statics, tbox(0.36, 0.16, D + 0.3, trim, 1, 0.02), s * (W / 2 + 0.15), H, -0.15);
  });
  const gap = 1.9, seg = (W - gap) / 2;
  [-1, 1].forEach((s) => {
    put(statics, tbox(seg + 0.3, 0.85, 0.3, wall, 2, 0.03), s * (gap / 2 + seg / 2 + 0.15), 0.42, D / 2 + 0.15);
    put(statics, tbox(seg + 0.36, 0.1, 0.38, trim, 1, 0.02), s * (gap / 2 + seg / 2 + 0.15), 0.88, D / 2 + 0.15);
  });
  put(statics, mesh(new THREE.PlaneGeometry(1.6, 0.9).rotateX(-Math.PI / 2), K.plain("#7a5134", 0.95), false), 0, 0.012, D / 2 - 0.4);

  // ---- windows on the side walls, with soft light beams falling across the floor ----
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex(), color: "#ffd9a0", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.3 });
  disposables.push(beamMat);
  // window z-positions per side wall (west = -1, east = +1), clear of frames and furniture
  const WIN = { hall: [[-3.3], [-3.3]], studio: [[-1.2], [-1.2]], workshop: [[-1.4], [-1.4]], forge: [[], [-1.4]], inn: [[-1.4], []] }[kind];
  [-1, 1].forEach((s) => {
    WIN[s < 0 ? 0 : 1].forEach((z) => {
      const g = put(statics, new THREE.Group(), s * (W / 2 - 0.02), 1.95, z, -s * Math.PI / 2);
      put(g, tbox(1.25, 1.45, 0.12, trim, 1, 0.03), 0, 0, 0);
      put(g, mesh(rbGeo(1.05, 1.25, 0.06, 0.02), K.window), 0, 0, 0.03);
      put(g, tbox(0.05, 1.25, 0.05, trim, 1, 0.01), 0, 0, 0.07);
      put(g, tbox(1.05, 0.05, 0.05, trim, 1, 0.01), 0, 0, 0.07);
      put(g, tbox(1.4, 0.08, 0.22, trim, 1, 0.02), 0, -0.72, 0.08);
      const patchM = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.3).rotateX(-Math.PI / 2), beamMat);
      patchM.position.set(s * (W / 2 - 1.55), 0.025, z + 0.55);
      patchM.rotation.y = s * 0.35;
      patchM.renderOrder = 2;
      dynamic.add(patchM);
    });
  });

  // ---- framed projects ----
  const framePos = [];
  const n = R.frames.length;
  if (kind === "hall") {
    [-5.4, -1.8, 1.8, 5.4].forEach((x) => framePos.push({ x, z: -D / 2 + 0.08, ry: 0 }));
    [-0.6, 2.4].forEach((z) => {
      framePos.push({ x: W / 2 - 0.08, z, ry: -Math.PI / 2 });
      framePos.push({ x: -W / 2 + 0.08, z, ry: Math.PI / 2 });
    });
  } else {
    const xs = n === 4 ? [-3.9, -1.3, 1.3, 3.9] : [];
    xs.forEach((x) => framePos.push({ x, z: -D / 2 + 0.08, ry: 0 }));
  }
  R.frames.forEach((p, i) => {
    const fp = framePos[i];
    if (!fp) return;
    const g = put(statics, new THREE.Group(), fp.x, 1.9, fp.z, fp.ry);
    put(g, tbox(2.04, 1.42, 0.1, dark, 1, 0.03), 0, 0, 0.05);
    put(g, mesh(new THREE.PlaneGeometry(1.86, 1.26), K.plain("#f6efe1", 0.9), false), 0, 0, 0.105);
    const tex = loader.load(p.cover || p.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const pm = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, emissive: "#ffffff", emissiveMap: tex, emissiveIntensity: 0.12 });
    disposables.push(tex, pm);
    put(g, mesh(new THREE.PlaneGeometry(1.64, 1.025), pm, false), 0, 0, 0.11);
    const plq = new THREE.MeshStandardMaterial({ map: plaqueTex(p.name, p.stat ? `${p.stat.value} ${p.stat.label}` : p.subtitle), roughness: 0.4, metalness: 0.3 });
    disposables.push(plq);
    put(g, tbox(1.12, 0.3, 0.05, brass, 1, 0.02), 0, -0.98, 0.06);
    put(g, mesh(new THREE.PlaneGeometry(1.06, 0.265), plq, false), 0, -0.98, 0.09);
    put(g, tbox(0.7, 0.06, 0.12, brass, 1, 0.02), 0, 0.82, 0.16);
    put(g, mesh(rbGeo(0.6, 0.03, 0.05, 0.01), K.lamp, false), 0, 0.79, 0.2);
    // stand point in front of the frame
    const fx = Math.sin(fp.ry), fz = Math.cos(fp.ry);
    spots.push({ id: `frame-${p.id}`, x: fp.x + fx * 1.45, z: fp.z + fz * 1.45, r: 1.3, verb: "View", name: p.name, open: { zone: "project", id: p.id } });
  });

  // ---- furniture per room ----
  const plant = (x, z, s = 1) => {
    put(statics, cyl(0.28 * s, 0.22 * s, 0.5 * s, K.plain("#c9744f", 0.8), 14), x, 0.25 * s, z);
    [[0, 0.75, 0, 0.36], [0.18, 0.95, 0.05, 0.26], [-0.16, 0.92, -0.06, 0.28], [0.02, 1.15, 0, 0.22]].forEach(([dx, y, dz, r]) => put(statics, sph(r * s, K.plain("#5f9e45", 0.85), 10, 8), x + dx * s, y * s, z + dz * s));
    colliders.push({ x, z, r: 0.35 * s });
  };
  const rug = (w, d, col, x = 0, z = 0) => {
    const m = new THREE.MeshStandardMaterial({ map: rugTex(col), roughness: 1 });
    disposables.push(m);
    put(statics, mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), m, false), x, 0.01, z);
  };
  const lectern = (x, z, ry, spot) => {
    const g = put(statics, new THREE.Group(), x, 0, z, ry);
    put(g, tbox(0.5, 0.06, 0.5, dark, 1, 0.02), 0, 0.03, 0);
    put(g, tbox(0.16, 1.0, 0.16, dark, 1, 0.02), 0, 0.55, 0);
    put(g, tbox(0.7, 0.06, 0.5, dark, 1, 0.02), 0, 1.08, 0.02, 0, 0.35);
    put(g, mesh(new THREE.PlaneGeometry(0.56, 0.38), K.plain("#fbf3e3", 0.9), false), 0, 1.12, 0.03, 0, -Math.PI / 2 + 0.35);
    colliders.push({ x, z, r: 0.45 });
    spots.push({ ...spot, x: x + Math.sin(ry) * 1.1, z: z + Math.cos(ry) * 1.1, r: 1.25 });
  };
  // brass wall sconce on the north wall above x (the light itself comes from `point`)
  const pendant = (x) => {
    const g = put(statics, new THREE.Group(), x, 2.75, -D / 2 + 0.05);
    put(g, tbox(0.16, 0.26, 0.06, brass, 1, 0.02), 0, 0, 0.03);
    put(g, tbox(0.05, 0.05, 0.22, brass, 1, 0.01), 0, -0.02, 0.15);
    put(g, mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.22, 14, 1, true), new THREE.MeshStandardMaterial({ color: "#f6ead2", emissive: "#ffcf8a", emissiveIntensity: 0.9, side: THREE.DoubleSide })), 0, 0.08, 0.27);
  };
  const lights = [];
  const point = (x, y, z, color = "#ffc27a", intensity = 9, dist = 12) => {
    const l = new THREE.PointLight(color, intensity, dist, 1.4);
    l.position.set(x, y, z);
    scene.add(l);
    lights.push(l);
    return l;
  };
  let fire = 0, flicker = null;

  if (kind === "hall") {
    rug(5.5, 3.2, R.rug, 0, -0.2);
    [-0.45, 0.45].forEach((dz) => {
      const b = put(statics, new THREE.Group(), 0, 0, -0.2 + dz, dz > 0 ? 0 : Math.PI);
      put(b, tbox(2.6, 0.1, 0.5, K.wood("#9a6a43"), 1, 0.02), 0, 0.48, 0);
      [-1.1, 1.1].forEach((x) => put(b, tbox(0.1, 0.45, 0.42, dark, 1, 0.02), x, 0.22, 0));
    });
    colliders.push({ box: true, x: 0, z: -0.2, rot: 0, hw: 1.35, hd: 0.75 });
    [[-7.2, -4.2], [7.2, -4.2], [-7.2, 4.2], [7.2, 4.2]].forEach(([x, z]) => plant(x, z, 1.1));
    lectern(-4.2, 3.0, 0, { id: "board", verb: "Read", name: "the quest board", open: { zone: "projects" } });
    pendant(-3.6, -0.2);
    pendant(3.6, -0.2);
    point(-3.6, 2.5, -0.2);
    point(3.6, 2.5, -0.2);
  } else if (kind === "studio") {
    rug(4.2, 2.8, R.rug, 0, 0.6);
    const ea = put(statics, new THREE.Group(), -3.4, 0, 1.4, 0.5);
    [-0.32, 0.32].forEach((x) => put(ea, tbox(0.06, 1.7, 0.06, K.wood("#d2a877"), 1, 0.02), x, 0.82, 0, 0, -0.12, x > 0 ? -0.08 : 0.08));
    put(ea, tbox(0.85, 0.06, 0.1, K.wood("#d2a877"), 1, 0.02), 0, 0.7, 0.07);
    const pmat = new THREE.MeshStandardMaterial({ map: paintingTexture(), roughness: 0.9 });
    disposables.push(pmat);
    put(ea, mesh(new THREE.PlaneGeometry(0.8, 0.62), pmat, false), 0, 1.07, 0.09, 0, -0.12);
    colliders.push({ x: -3.4, z: 1.4, r: 0.55 });
    const desk = put(statics, new THREE.Group(), 3.2, 0, 0.6, -0.4);
    put(desk, tbox(1.8, 0.08, 0.85, K.wood("#e9d3b5"), 1, 0.02), 0, 0.78, 0, 0, -0.08);
    [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]].forEach(([x, z]) => put(desk, tbox(0.06, 0.78, 0.06, dark, 1, 0.02), x, 0.39, z));
    const scr = new THREE.MeshStandardMaterial({ map: uiTex(), emissive: "#ffffff", emissiveMap: uiTex(), emissiveIntensity: 0.6 });
    disposables.push(scr);
    put(desk, tbox(0.9, 0.58, 0.05, metal, 1, 0.02), 0, 1.25, -0.28);
    put(desk, mesh(new THREE.PlaneGeometry(0.82, 0.5), scr, false), 0, 1.25, -0.25);
    colliders.push({ box: true, x: 3.2, z: 0.6, rot: -0.4, hw: 0.95, hd: 0.5 });
    // swatches shelf
    const sh = put(statics, new THREE.Group(), W / 2 - 0.25, 1.6, 2.1, -Math.PI / 2);
    put(sh, tbox(1.6, 0.06, 0.3, trim, 1, 0.02), 0, 0, 0.1);
    ["#E07B6B", "#D4A848", "#4FD1C5", "#3b4a6b", "#f6efe1", "#111111"].forEach((c, i) => put(sh, tbox(0.2, 0.3, 0.16, K.plain(c, 0.7), 1, 0.02), -0.62 + i * 0.25, 0.18, 0.1));
    plant(-W / 2 + 0.7, -D / 2 + 1.6, 1.1);
    plant(W / 2 - 0.7, D / 2 - 1.0, 0.9);
    lectern(1.2, 2.4, -0.3, { id: "desk", verb: "Read about", name: "the Designer", open: { zone: "designer" } });
    pendant(0, 0.2);
    point(0, 2.5, 0.2);
    point(3.2, 2.2, 0.6, "#ffd9b0", 4, 6);
  } else if (kind === "workshop") {
    rug(4.2, 2.8, R.rug, 0, 0.6);
    const code = codeTex();
    const scr = new THREE.MeshStandardMaterial({ map: code, emissive: "#ffffff", emissiveMap: code, emissiveIntensity: 0.9 });
    disposables.push(scr);
    [[-3.0, 0.4, 0.35], [3.0, 0.4, -0.35]].forEach(([x, z, ry]) => {
      const desk = put(statics, new THREE.Group(), x, 0, z, ry);
      put(desk, tbox(1.9, 0.08, 0.85, K.wood("#cfae86"), 1, 0.02), 0, 0.78, 0);
      [[-0.85, -0.35], [0.85, -0.35], [-0.85, 0.35], [0.85, 0.35]].forEach(([a, b]) => put(desk, tbox(0.06, 0.78, 0.06, metal, 1, 0.02), a, 0.39, b));
      [-0.42, 0.42].forEach((mx) => {
        put(desk, tbox(0.78, 0.5, 0.05, metal, 1, 0.02), mx, 1.2, -0.25, mx > 0 ? -0.2 : 0.2);
        put(desk, mesh(new THREE.PlaneGeometry(0.72, 0.44), scr, false), mx * 1.0 + (mx > 0 ? -0.006 : 0.006), 1.2, -0.22, mx > 0 ? -0.2 : 0.2);
      });
      put(desk, tbox(0.6, 0.03, 0.2, metal, 1, 0.01), 0, 0.84, 0.15);
      colliders.push({ box: true, x, z, rot: ry, hw: 1.0, hd: 0.5 });
    });
    // server rack with blinking lights
    const rack = put(statics, new THREE.Group(), -W / 2 + 0.55, 0, 1.4, Math.PI / 2);
    put(rack, tbox(0.8, 2.1, 0.7, K.plain("#2a3138", 0.5), 1, 0.03), 0, 1.05, 0);
    for (let i = 0; i < 6; i++) {
      put(rack, tbox(0.66, 0.22, 0.04, K.plain("#3c4651", 0.4), 1, 0.01), 0, 0.35 + i * 0.3, 0.36);
      put(rack, sph(0.025, i % 2 ? K.led : K.rune, 6, 5), 0.24, 0.35 + i * 0.3, 0.39);
    }
    colliders.push({ box: true, x: -W / 2 + 0.55, z: 1.4, rot: 0, hw: 0.4, hd: 0.45 });
    // whiteboard
    const wb = new THREE.MeshStandardMaterial({ map: boardTex(), roughness: 0.4 });
    disposables.push(wb);
    const bd = put(statics, new THREE.Group(), W / 2 - 0.05, 1.8, 0.6, -Math.PI / 2);
    put(bd, tbox(2.1, 1.35, 0.05, K.plain("#d7dde2", 0.4), 1, 0.02), 0, 0, 0);
    put(bd, mesh(new THREE.PlaneGeometry(1.95, 1.2), wb, false), 0, 0, 0.03);
    plant(W / 2 - 0.7, D / 2 - 1.0, 0.9);
    lectern(-2.3, 2.5, 0.3, { id: "desk", verb: "Read about", name: "the Engineer", open: { zone: "engineer" } });
    pendant(-2.4, 0.3);
    pendant(2.4, 0.3);
    point(0, 2.6, 0.3, "#fff1dc", 9, 12);
    point(-W / 2 + 1.2, 1.4, 1.4, "#4fd1c5", 2.5, 4);
  } else if (kind === "forge") {
    rug(3.6, 2.6, R.rug, 1.0, 0.8);
    // hearth on the west wall
    const h = put(statics, new THREE.Group(), -W / 2 + 0.45, 0, -0.8, Math.PI / 2);
    put(h, tbox(2.3, 1.6, 0.9, K.stone("#7d7468"), 1, 0.06), 0, 0.8, 0);
    put(h, tbox(1.4, 0.9, 0.2, K.plain("#2a2420", 0.9), 1, 0.03), 0, 0.75, 0.38);
    put(h, mesh(rbGeo(1.2, 0.5, 0.1, 0.04), K.ember, false), 0, 0.5, 0.51);
    put(h, tbox(1.2, 1.7, 0.7, K.brick("#9e5f4a"), 1, 0.04), 0, 2.45, -0.05);
    colliders.push({ box: true, x: -W / 2 + 0.45, z: -0.8, rot: 0, hw: 0.5, hd: 1.2 });
    flicker = point(-W / 2 + 1.4, 1.0, -0.8, "#ff8a3d", 10, 8);
    fire = 1;
    const an = put(statics, new THREE.Group(), 0.6, 0, -0.3);
    put(an, cyl(0.36, 0.4, 0.62, K.wood("#80583a"), 14), 0, 0.31, 0);
    put(an, tbox(0.7, 0.18, 0.3, metal, 1, 0.03), 0, 0.72, 0);
    put(an, tbox(0.36, 0.2, 0.2, metal, 1, 0.03), 0, 0.88, 0);
    put(an, mesh(new THREE.ConeGeometry(0.1, 0.38, 8).rotateZ(Math.PI / 2), metal), 0.34, 0.9, 0);
    colliders.push({ x: 0.6, z: -0.3, r: 0.5 });
    const tr = put(statics, new THREE.Group(), W / 2 - 0.08, 1.7, 1.2, -Math.PI / 2);
    put(tr, tbox(2.0, 0.1, 0.12, K.wood("#6b4630"), 1, 0.02), 0, 0.5, 0.05);
    [-0.7, -0.25, 0.25, 0.7].forEach((x, i) => {
      put(tr, tbox(0.05, 0.7, 0.05, K.wood("#a8754a"), 1, 0.01), x, 0.1, 0.12);
      put(tr, tbox(i % 2 ? 0.26 : 0.16, 0.12, 0.12, metal, 1, 0.02), x, -0.22, 0.12);
    });
    [[4.5, 3.2], [4.6, 2.3]].forEach(([x, z]) => {
      put(statics, cyl(0.35, 0.32, 0.9, K.wood("#9a6a43"), 14), x, 0.45, z);
      [0.2, 0.7].forEach((y) => put(statics, mesh(new THREE.TorusGeometry(0.35, 0.025, 6, 20).rotateX(Math.PI / 2), metal), x, y, z));
      colliders.push({ x, z, r: 0.4 });
    });
    lectern(2.6, 2.3, -0.35, { id: "desk", verb: "Read", name: "the Builder's ledger", open: { zone: "builder" } });
    pendant(2.6);
    point(1.8, 2.5, 0.4, "#ffd9a0", 6, 10);
  } else if (kind === "inn") {
    rug(4.6, 3.0, R.rug, -0.8, 0.6);
    // fireplace on the north wall
    const fp = put(statics, new THREE.Group(), -1.2, 0, -D / 2 + 0.4);
    put(fp, tbox(2.2, 1.5, 0.7, K.stone("#bdb3a3"), 1, 0.06), 0, 0.75, 0);
    put(fp, tbox(1.3, 0.85, 0.2, K.plain("#2a2420", 0.9), 1, 0.03), 0, 0.6, 0.3);
    put(fp, mesh(rbGeo(1.1, 0.36, 0.1, 0.04), K.ember, false), 0, 0.36, 0.43);
    [-0.25, 0.1, 0.4].forEach((x, i) => put(fp, cyl(0.07, 0.07, 0.8, K.wood("#6b4630"), 8), x * 0.8, 0.26, 0.5, 0.5 * i, 0, Math.PI / 2));
    put(fp, tbox(2.5, 0.12, 0.85, K.wood("#6e4a32"), 1, 0.02), 0, 1.56, 0.05);
    put(fp, tbox(1.6, 1.8, 0.5, K.stone("#bdb3a3"), 1, 0.05), 0, 2.45, -0.05);
    [-0.8, 0.8].forEach((x) => put(fp, cyl(0.06, 0.08, 0.28, brass, 10), x, 1.76, 0.05));
    colliders.push({ box: true, x: -1.2, z: -D / 2 + 0.4, rot: 0, hw: 1.15, hd: 0.45 });
    flicker = point(-1.2, 0.9, -D / 2 + 1.3, "#ff9a4d", 9, 8);
    fire = 1;
    // bar counter along the east wall with the guestbook
    const bar = put(statics, new THREE.Group(), W / 2 - 1.1, 0, -0.4);
    put(bar, tbox(0.8, 1.05, 4.2, K.wood("#7a4e31"), 1, 0.04), 0, 0.52, 0);
    put(bar, tbox(0.95, 0.08, 4.35, K.wood("#a8754a"), 1, 0.02), 0, 1.08, 0);
    put(bar, tbox(0.5, 0.04, 0.36, K.plain("#fbf3e3", 0.9), 1, 0.01), -0.05, 1.14, -0.6, 0.2);
    put(bar, tbox(0.04, 0.02, 0.36, K.plain("#7a2e22"), 1, 0.005), -0.05, 1.165, -0.6, 0.2);
    [[0.1, 0.6], [-0.15, 1.3], [0.05, -1.6]].forEach(([x, z]) => put(bar, cyl(0.07, 0.06, 0.16, K.plain("#e8c66a", 0.4), 10), x, 1.2, z));
    const shelf = put(statics, new THREE.Group(), W / 2 - 0.12, 1.7, -0.4, -Math.PI / 2);
    [0, 0.55].forEach((y) => put(shelf, tbox(3.2, 0.06, 0.26, K.wood("#6e4a32"), 1, 0.02), 0, y, 0.12));
    for (let i = 0; i < 10; i++) put(shelf, cyl(0.06, 0.07, 0.3, K.plain(["#4c8a5e", "#d9534a", "#e8c66a", "#3b4a6b"][i % 4], 0.35), 8), -1.4 + (i % 5) * 0.7, 0.18 + Math.floor(i / 5) * 0.55, 0.12);
    colliders.push({ box: true, x: W / 2 - 1.1, z: -0.4, rot: 0, hw: 0.5, hd: 2.2 });
    spots.push({ id: "guestbook", x: W / 2 - 2.1, z: -1.0, r: 1.3, verb: "Sign", name: "the guestbook", open: { zone: "inn" } });
    // round tables with stools
    [[-1.9, 2.1], [1.4, 1.6]].forEach(([x, z]) => {
      put(statics, cyl(0.6, 0.6, 0.07, K.wood("#9a6a43"), 20), x, 0.78, z);
      put(statics, cyl(0.07, 0.12, 0.75, dark, 10), x, 0.38, z);
      put(statics, cyl(0.07, 0.06, 0.14, K.plain("#e8c66a", 0.4), 10), x + 0.2, 0.88, z - 0.1);
      [0, 2.1, 4.2].forEach((a) => {
        const sx = x + Math.cos(a) * 0.95, sz = z + Math.sin(a) * 0.95;
        put(statics, cyl(0.22, 0.22, 0.07, K.wood("#7a4e31"), 14), sx, 0.5, sz);
        put(statics, cyl(0.04, 0.05, 0.48, dark, 6), sx, 0.24, sz);
      });
      colliders.push({ x, z, r: 0.75 });
    });
    // the résumé, framed on the west wall
    const rf = put(statics, new THREE.Group(), -W / 2 + 0.08, 1.9, 1.4, Math.PI / 2);
    put(rf, tbox(1.1, 1.45, 0.08, dark, 1, 0.03), 0, 0, 0.04);
    const resT = canvasTex(256, 340, (g, w, h) => {
      g.fillStyle = "#fffdf8";
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#111";
      g.font = '700 26px "Segoe UI", system-ui, sans-serif';
      g.fillText("Krishna Mehta", 22, 46);
      g.font = '500 15px "Segoe UI", system-ui, sans-serif';
      g.fillStyle = "#666";
      g.fillText("Product Designer & Engineer", 22, 70);
      g.fillStyle = "#cfcfcf";
      for (let i = 0; i < 11; i++) g.fillRect(22, 100 + i * 20, 120 + ((i * 37) % 90), 6);
    });
    const rm = new THREE.MeshStandardMaterial({ map: resT, roughness: 0.9 });
    disposables.push(rm);
    put(rf, mesh(new THREE.PlaneGeometry(0.96, 1.28), rm, false), 0, 0, 0.09);
    spots.push({ id: "resume", x: -W / 2 + 1.5, z: 1.4, r: 1.3, verb: "Read", name: "Krishna's résumé", open: { zone: "resume" } });
    plant(W / 2 - 0.8, D / 2 - 0.9, 0.9);
    pendant(-3.6);
    pendant(1.6);
    point(-0.8, 2.5, 0.8, "#ffcf8a", 7, 11);
  }

  // way out
  spots.push({ id: "leave", x: 0, z: D / 2 - 0.55, r: 1.0, verb: "Leave", name: R.title, exit: true });

  // ---- lights ----
  scene.add(new THREE.HemisphereLight("#fff3df", "#6b5440", 1.05));
  const key = new THREE.DirectionalLight("#ffe7c4", 1.5);
  key.position.set(4, 12, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -W / 2 - 1, right: W / 2 + 1, top: D / 2 + 1, bottom: -D / 2 - 1, near: 1, far: 30 });
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.03;
  scene.add(key, key.target);

  if (flicker) {
    const base = flicker.intensity;
    anims.push((t) => (flicker.intensity = base * (0.82 + Math.sin(t * 11) * 0.08 + Math.sin(t * 23 + 1) * 0.06 + Math.random() * 0.06)));
  }
  anims.push((t, dt, env) => (beamMat.opacity = 0.32 * (1 - env.night)));

  const merged = mergeStatic(statics);
  scene.add(merged);

  return {
    kind, scene, title: R.title, zone: R.zone, W, D, fire, spots, colliders, anims,
    spawn: { x: 0, z: D / 2 - 2.0 },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
      scene.traverse((o) => o.geometry?.dispose?.());
    },
  };
}
