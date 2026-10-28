// Sky dome, stars, drifting clouds and the time-of-day lighting keys.
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { rng, smooth, clamp } from "./util";

const C = (h) => new THREE.Color(h);
// Time-of-day keyframes (hour, IST). fog == horizon so the sea melts into the sky.
const KEYS = [
  { h: 0, top: "#0a1430", hor: "#1f2d56", sun: "#9db4ff", si: 0.42, hs: "#4b62a8", hg: "#1a2138", hi: 0.5, elev: 48, night: 1, cloud: "#3a4672", shallow: "#1f6f86", deep: "#0b2a4e" },
  { h: 5, top: "#0d1838", hor: "#27355f", sun: "#9db4ff", si: 0.42, hs: "#4b62a8", hg: "#1a2138", hi: 0.5, elev: 48, night: 1, cloud: "#3a4672", shallow: "#1f6f86", deep: "#0b2a4e" },
  { h: 6.3, top: "#5b7cc4", hor: "#ffb48c", sun: "#ffb27a", si: 1.7, hs: "#a6bbe8", hg: "#6d5a50", hi: 0.75, elev: 9, night: 0.25, cloud: "#ffd2bd", shallow: "#58c2c4", deep: "#25619e" },
  { h: 8, top: "#4fa3ef", hor: "#cfe8fb", sun: "#fff0d4", si: 2.9, hs: "#c4e2ff", hg: "#74914f", hi: 1.05, elev: 40, night: 0, cloud: "#ffffff", shallow: "#5fd6cf", deep: "#1f6fae" },
  { h: 15.6, top: "#4fa3ef", hor: "#d3eafb", sun: "#fff0d4", si: 2.9, hs: "#c4e2ff", hg: "#74914f", hi: 1.05, elev: 46, night: 0, cloud: "#ffffff", shallow: "#5fd6cf", deep: "#1f6fae" },
  { h: 17.4, top: "#6a8ed8", hor: "#ffc690", sun: "#ffb46a", si: 2.6, hs: "#ffd6ae", hg: "#6d6248", hi: 0.85, elev: 15, night: 0.02, cloud: "#ffe0c2", shallow: "#6ccfc4", deep: "#2a66a6" },
  { h: 18.7, top: "#38407c", hor: "#f2896a", sun: "#ff865a", si: 1.2, hs: "#8f88cc", hg: "#3e3448", hi: 0.6, elev: 4, night: 0.6, cloud: "#e59a8a", shallow: "#3f8f9e", deep: "#1b3f72" },
  { h: 20, top: "#0d1838", hor: "#27355f", sun: "#9db4ff", si: 0.42, hs: "#4b62a8", hg: "#1a2138", hi: 0.5, elev: 48, night: 1, cloud: "#3a4672", shallow: "#1f6f86", deep: "#0b2a4e" },
  { h: 24, top: "#0a1430", hor: "#1f2d56", sun: "#9db4ff", si: 0.42, hs: "#4b62a8", hg: "#1a2138", hi: 0.5, elev: 48, night: 1, cloud: "#3a4672", shallow: "#1f6f86", deep: "#0b2a4e" },
];
const COLOR_KEYS = ["top", "hor", "sun", "hs", "hg", "cloud", "shallow", "deep"];
const KEYC = KEYS.map((k) => ({ ...k, ...Object.fromEntries(COLOR_KEYS.map((n) => [n, C(k[n])])) }));

/** Interpolated lighting for an hour (0–24). */
export function lightAt(hour) {
  const h = ((hour % 24) + 24) % 24;
  let i = 0;
  while (i < KEYC.length - 2 && KEYC[i + 1].h <= h) i++;
  const a = KEYC[i], b = KEYC[i + 1], t = smooth(0, 1, (h - a.h) / (b.h - a.h || 1));
  const out = { hour: h };
  for (const n of COLOR_KEYS) out[n] = a[n].clone().lerp(b[n], t);
  for (const n of ["si", "hi", "elev", "night"]) out[n] = a[n] + (b[n] - a[n]) * t;
  // sun arcs east → south → west; at night a moon hangs high in the south-west
  const day = clamp((h - 5.6) / (19.2 - 5.6), 0, 1);
  const az = day * Math.PI;
  const e = (out.elev * Math.PI) / 180;
  const sun = new THREE.Vector3(Math.cos(az) * Math.cos(e), Math.sin(e), Math.sin(az) * Math.cos(e) * 0.9 + 0.35).normalize();
  const moon = new THREE.Vector3(-0.45, 0.75, 0.5).normalize();
  out.sunDir = sun.lerp(moon, smooth(0.55, 0.95, out.night)).normalize();
  out.moonDir = moon;
  return out;
}

export const istHour = () => {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const g = (t) => +p.find((x) => x.type === t).value;
  return g("hour") + g("minute") / 60;
};

export function buildSky() {
  const uniforms = {
    uTop: { value: C("#4fa3ef") },
    uHor: { value: C("#cfe8fb") },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunCol: { value: C("#fff0d4") },
    uMoonDir: { value: new THREE.Vector3(0, 1, 0) },
    uNight: { value: 0 },
  };
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(420, 40, 20),
    new THREE.ShaderMaterial({
      uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop, uHor, uSunDir, uSunCol, uMoonDir;
        uniform float uNight;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 col = mix(uHor, uTop, pow(smoothstep(-0.02, 0.85, d.y), 0.6));
          float sd = max(dot(d, uSunDir), 0.0);
          col += uSunCol * (pow(sd, 7.0) * 0.28 + pow(sd, 1400.0) * 5.0) * (1.0 - uNight);
          float md = max(dot(d, uMoonDir), 0.0);
          col += vec3(0.9, 0.93, 1.0) * (smoothstep(0.99935, 0.99965, md) * 1.8 + pow(md, 80.0) * 0.22) * uNight;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    })
  );
  dome.renderOrder = -10;
  dome.frustumCulled = false;

  // stars
  const R = rng(77), N = 700, sp = new Float32Array(N * 3), sz = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const u = R() * Math.PI * 2, v = Math.acos(1 - R() * 0.95), r = 400;
    sp.set([Math.sin(v) * Math.cos(u) * r, Math.cos(v) * r, Math.sin(v) * Math.sin(u) * r], i * 3);
    sz[i] = R();
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  sg.setAttribute("aS", new THREE.BufferAttribute(sz, 1));
  const starU = { uNight: { value: 0 }, uTime: { value: 0 } };
  const stars = new THREE.Points(
    sg,
    new THREE.ShaderMaterial({
      uniforms: starU,
      transparent: true,
      depthWrite: false,
      fog: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aS;
        uniform float uTime;
        varying float vA;
        void main() {
          vA = 0.45 + 0.55 * sin(uTime * (0.6 + aS * 1.7) + aS * 40.0);
          gl_PointSize = 1.2 + aS * 2.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uNight;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(vec3(1.0, 0.97, 0.9), smoothstep(0.5, 0.0, d) * vA * uNight);
        }`,
    })
  );
  stars.frustumCulled = false;
  stars.renderOrder = -9;

  // puffy clouds orbiting the island
  const cloudMat = new THREE.MeshLambertMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.28 });
  const clouds = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const puffs = [];
    const n = 4 + Math.floor(R() * 4), len = 7 + R() * 9;
    for (let k = 0; k < n; k++) {
      const r = 2.2 + R() * 2.6;
      const g = new THREE.IcosahedronGeometry(r, 2);
      g.translate((k / (n - 1) - 0.5) * len, (R() - 0.3) * 1.6, (R() - 0.5) * 3);
      puffs.push(g);
    }
    const geo = mergeGeometries(puffs);
    geo.scale(1, 0.62, 1);
    const m = new THREE.Mesh(geo, cloudMat);
    const a = (i / 16) * Math.PI * 2 + R() * 0.3, d = 58 + R() * 80;
    m.position.set(Math.cos(a) * d, 22 + R() * 16, Math.sin(a) * d - 10);
    m.rotation.y = R() * Math.PI;
    clouds.add(m);
  }

  return { dome, uniforms, stars, starU, clouds, cloudMat };
}
