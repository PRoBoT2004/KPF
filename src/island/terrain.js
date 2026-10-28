// Ground, paved plaza, flagstones, wind-blown grass, flowers and the ocean.
import * as THREE from "three";
import { heightAt, islandT, pathDist, clearance, PATH_HALF, PATHS, PLAZA, BUILDINGS, boxDist, FARM, WINDMILL, LIGHTHOUSE } from "./layout";
import { TREES, ROCKS, FLOWERS, FLOWER_COLORS } from "./scatter";
import { fbm, vnoise, smooth, rng } from "./util";
import { U } from "./materials";

const col = (hex) => new THREE.Color(hex);
const C = {
  grassDark: col("#4c8c35"), grassMid: col("#68ab43"), grassLight: col("#97c95a"), grassHill: col("#b1c862"),
  sand: col("#f0d9a3"), sandWet: col("#cdb27b"), seabed: col("#c9bd8f"), seabedDeep: col("#4f7d82"),
  path: col("#dcc596"), pathDark: col("#c4a874"), plaza: col("#b2a993"), soil: col("#7d5a3e"),
};

/** Bilinear-sampled grid of an expensive distance function. */
function field(fn, res = 0.5, ext = 40) {
  const n = Math.round((ext * 2) / res) + 1, a = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) a[j * n + i] = fn(-ext + i * res, -ext + j * res);
  return (x, z) => {
    const fx = (x + ext) / res, fz = (z + ext) / res;
    if (fx < 0 || fz < 0 || fx >= n - 1 || fz >= n - 1) return 99;
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * n + i;
    return (a[k] * (1 - u) + a[k + 1] * u) * (1 - v) + (a[k + n] * (1 - u) + a[k + n + 1] * u) * v;
  };
}

const tmp = new THREE.Color();
export function grassColor(x, z, h, out) {
  const n = fbm(x * 0.07 + 11, z * 0.07 - 4, 3), m = vnoise(x * 0.55, z * 0.55);
  out.copy(C.grassDark).lerp(C.grassMid, smooth(0.25, 0.5, n)).lerp(C.grassLight, smooth(0.5, 0.82, n) * 0.85);
  if (h > 2) out.lerp(C.grassHill, smooth(2, 4.2, h) * 0.45);
  return out.multiplyScalar(0.93 + m * 0.14);
}

export function buildGround(quality) {
  const F = { path: field(pathDist), clear: field(clearance) };
  const group = new THREE.Group();

  // ---- terrain ----
  const SEG = quality.low ? 180 : 256;
  const geo = new THREE.PlaneGeometry(160, 160, SEG, SEG).rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, colors = new Float32Array(pos.count * 3);
  const occl = [...TREES.map((t) => ({ x: t.x, z: t.z, r: 2.0 * t.s, k: 0.7 })), ...ROCKS.map((r) => ({ x: r.x, z: r.z, r: 1.3 * r.s, k: 0.8 }))];
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = heightAt(x, z);
    pos.setY(i, h);
    if (h < -0.05) c.copy(C.seabed).lerp(C.seabedDeep, smooth(0.1, 5.5, -h));
    else {
      grassColor(x, z, h, c);
      const sandK = 1 - smooth(0.4, 0.8, h + (vnoise(x * 0.5, z * 0.5) - 0.5) * 0.3);
      if (sandK > 0) c.lerp(tmp.copy(C.sand).lerp(C.sandWet, 1 - smooth(0.02, 0.25, h)), sandK);
      if (x > FARM.x0 - 0.4 && x < FARM.x1 + 0.4 && z > FARM.z0 - 0.4 && z < FARM.z1 + 0.4) c.lerp(C.soil, 0.85);
      const pd = F.path(x, z) - PATH_HALF + (vnoise(x * 1.3, z * 1.3) - 0.5) * 0.4;
      const pk = 1 - smooth(-0.25, 0.32, pd);
      if (pk > 0) c.lerp(tmp.copy(C.path).lerp(C.pathDark, vnoise(x * 2.3, z * 2.3) * 0.7), pk * 0.95);
      const dp = Math.hypot(x - PLAZA.x, z - PLAZA.z);
      if (dp < PLAZA.r + 0.6) c.lerp(C.plaza, 1 - smooth(PLAZA.r - 0.3, PLAZA.r + 0.6, dp));
      // soft contact shading around buildings, trees and rocks
      let ao = 1;
      for (const b of BUILDINGS) {
        const bd = boxDist(x, z, b);
        if (bd < 2.2) ao = Math.min(ao, 0.62 + 0.38 * smooth(0, 2.2, bd));
      }
      for (const o of occl) {
        const dx = x - o.x, dz = z - o.z;
        if (dx * dx + dz * dz < o.r * o.r * 1.6) ao = Math.min(ao, o.k + (1 - o.k) * smooth(o.r * 0.25, o.r * 1.25, Math.hypot(dx, dz)));
      }
      for (const p of [WINDMILL, LIGHTHOUSE]) ao = Math.min(ao, 0.66 + 0.34 * smooth(1.6, 3.6, Math.hypot(x - p.x, z - p.z)));
      c.multiplyScalar(ao);
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  ground.receiveShadow = true;
  ground.name = "ground";
  group.add(ground);

  // ---- paved plaza ----
  const plazaY = heightAt(PLAZA.x, PLAZA.z);
  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(PLAZA.r, 80).rotateX(-Math.PI / 2),
    new THREE.MeshLambertMaterial({ map: quality.kit.T.paving, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
  );
  plaza.position.set(PLAZA.x, plazaY + 0.03, PLAZA.z);
  plaza.receiveShadow = true;
  group.add(plaza);

  // ---- flagstones along the dirt paths ----
  const R = rng(99);
  const stones = [];
  for (const p of PATHS) {
    let carry = 0;
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, az] = p[i], [bx, bz] = p[i + 1], L = Math.hypot(bx - ax, bz - az);
      for (let s = carry; s < L; s += 0.95) {
        const t = s / L, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        const nx = -(bz - az) / L, nz = (bx - ax) / L, off = (R() - 0.5) * 0.75;
        const sx = x + nx * off, sz = z + nz * off;
        if (Math.hypot(sx - PLAZA.x, sz - PLAZA.z) < PLAZA.r + 0.2 || R() < 0.18) continue;
        stones.push([sx, heightAt(sx, sz), sz]);
      }
      carry = 0;
    }
  }
  const stoneMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.33, 0.1, 7), new THREE.MeshLambertMaterial(), stones.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  stones.forEach(([x, y, z], i) => {
    q.setFromEuler(e.set((R() - 0.5) * 0.06, R() * 6.28, (R() - 0.5) * 0.06));
    m4.compose(v.set(x, y + 0.01, z), q, sc.set(0.8 + R() * 0.55, 1, 0.65 + R() * 0.45));
    stoneMesh.setMatrixAt(i, m4);
    stoneMesh.setColorAt(i, tmp.set(["#e2d8c3", "#d4c8af", "#cbbfa6", "#e9e1cf"][Math.floor(R() * 4)]));
  });
  stoneMesh.receiveShadow = true;
  group.add(stoneMesh);

  return { group, ground, F, plazaY };
}

// ---- Grass: instanced blades, chunked for culling, swaying + parting around the player ----
export function buildGrass(F, count) {
  const w = 0.12;
  const blade = new THREE.BufferGeometry();
  blade.setAttribute("position", new THREE.Float32BufferAttribute([-w / 2, 0, 0, w / 2, 0, 0, -w * 0.4, 0.38, 0.03, w * 0.4, 0.38, 0.03, -w * 0.26, 0.7, 0.08, w * 0.26, 0.7, 0.08, 0, 1, 0.17], 3));
  blade.setAttribute("normal", new THREE.Float32BufferAttribute(new Array(7).fill([0, 1, 0]).flat(), 3));
  blade.setAttribute("color", new THREE.Float32BufferAttribute([0.62, 0.66, 0.55, 0.62, 0.66, 0.55, 0.95, 0.97, 0.9, 0.95, 0.97, 0.9, 1.12, 1.12, 1.02, 1.12, 1.12, 1.02, 1.3, 1.28, 1.06], 3));
  blade.setAttribute("aH", new THREE.Float32BufferAttribute([0, 0, 0.38, 0.38, 0.7, 0.7, 1], 1));
  blade.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5, 4, 4, 5, 6]);

  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = "uniform float uTime;\nuniform vec3 uPlayer;\nattribute float aH;\n" +
      sh.vertexShader.replace("#include <project_vertex>", `
      vec4 wpos = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
      float k = aH * aH;
      float wv = sin(uTime * 1.8 + wpos.x * 0.42 + wpos.z * 0.31) * 0.6 + sin(uTime * 3.1 + wpos.x * 1.3 - wpos.z * 0.9) * 0.25;
      float gust = smoothstep(0.2, 1.0, sin(uTime * 0.55 + wpos.x * 0.06 - wpos.z * 0.045));
      wpos.x += (wv * 0.09 + gust * 0.17) * k;
      wpos.z += (wv * 0.05 + gust * 0.06) * k;
      vec2 dp = wpos.xz - uPlayer.xz;
      float dist = length(dp);
      float push = (1.0 - smoothstep(0.1, 1.3, dist)) * k * step(abs(wpos.y - uPlayer.y), 1.2);
      wpos.xz += (dp / max(dist, 0.001)) * push * 0.5;
      wpos.y -= push * 0.22;
      vec4 mvPosition = viewMatrix * wpos;
      gl_Position = projectionMatrix * mvPosition;`);
  };
  mat.customProgramCacheKey = () => "kw-grass";

  const R = rng(4242), CH = 10, buckets = new Map();
  let placed = 0;
  const c = new THREE.Color();
  for (let tries = 0; placed < count && tries < count * 5; tries++) {
    const x = (R() * 2 - 1) * 37, z = (R() * 2 - 1) * 37, h = heightAt(x, z);
    if (h < 0.48 || islandT(x, z) > 0.98) continue;
    const cl = F.clear(x, z);
    if (cl < 0.05 || (cl < 0.9 && R() > cl / 0.9)) continue;
    if (h < 0.85 && R() > (h - 0.48) / 0.37) continue;
    if (x > FARM.x0 - 0.3 && x < FARM.x1 + 0.3 && z > FARM.z0 - 0.3 && z < FARM.z1 + 0.3) continue;
    const dens = 0.45 + 0.55 * fbm(x * 0.11 + 5, z * 0.11, 2);
    if (R() > dens) continue;
    const key = `${Math.floor(x / CH)},${Math.floor(z / CH)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    const tall = 0.26 + 0.38 * smooth(0.35, 0.8, fbm(x * 0.16 - 9, z * 0.16 + 2, 2));
    grassColor(x, z, h, c);
    buckets.get(key).push([x, h - 0.04, z, R() * 6.28, tall * (0.75 + R() * 0.5), 0.8 + R() * 0.5, c.r, c.g, c.b]);
    placed++;
  }
  const group = new THREE.Group();
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3();
  for (const list of buckets.values()) {
    const mesh = new THREE.InstancedMesh(blade, mat, list.length);
    list.forEach(([x, y, z, rot, hh, ww, r, g, b], i) => {
      q.setFromEuler(e.set((R() - 0.5) * 0.25, rot, (R() - 0.5) * 0.25));
      m4.compose(v.set(x, y, z), q, s.set(ww, hh, ww));
      mesh.setMatrixAt(i, m4);
      mesh.setColorAt(i, c.setRGB(r, g, b));
    });
    mesh.computeBoundingSphere();
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

export function buildFlowers() {
  const n = FLOWERS.length;
  const head = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.075, 1), new THREE.MeshLambertMaterial({ emissive: "#222" }), n);
  const stem = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.016, 1, 4).translate(0, 0.5, 0), new THREE.MeshLambertMaterial({ color: "#4f8f3a" }), n);
  const m4 = new THREE.Matrix4(), c = new THREE.Color();
  FLOWERS.forEach((f, i) => {
    const hgt = 0.3 * f.s;
    m4.makeScale(f.s, f.s * 0.8, f.s).setPosition(f.x, f.y + hgt, f.z);
    head.setMatrixAt(i, m4);
    head.setColorAt(i, c.set(FLOWER_COLORS[f.col]));
    m4.makeScale(1, hgt, 1).setPosition(f.x, f.y - 0.02, f.z);
    stem.setMatrixAt(i, m4);
  });
  head.castShadow = false;
  const g = new THREE.Group();
  g.add(stem, head);
  return g;
}

// ---- Ocean: depth-tinted, foam at the shoreline, sun glints, fresnel sky ----
export function buildWater() {
  const N = 256, EXT = 80, data = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const x = -EXT + ((i + 0.5) / N) * EXT * 2, z = -EXT + ((j + 0.5) / N) * EXT * 2;
      const v = Math.max(0, Math.min(255, Math.round(((heightAt(x, z) + 8) / 12) * 255)));
      data.set([v, v, v, 255], (j * N + i) * 4);
    }
  const hTex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter;
  hTex.needsUpdate = true;

  const uniforms = {
    uTime: U.uTime,
    uHeight: { value: hTex },
    uShallow: { value: col("#5fd6cf") },
    uDeep: { value: col("#1f6fae") },
    uFoam: { value: col("#ffffff") },
    uSky: { value: col("#cfe9ff") },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunCol: { value: col("#fff2d6") },
    uNight: { value: 0 },
    uFogCol: { value: col("#cfe9ff") },
    uFogNear: { value: 60 },
    uFogFar: { value: 190 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uNight, uFogNear, uFogFar;
      uniform sampler2D uHeight;
      uniform vec3 uShallow, uDeep, uFoam, uSky, uSunDir, uSunCol, uFogCol;
      varying vec3 vW;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      void main() {
        vec2 p = vW.xz, uv = (p + 80.0) / 160.0;
        float th = -8.0;
        if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) th = texture2D(uHeight, uv).r * 12.0 - 8.0;
        float depth = max(-th, 0.0), t = uTime;
        float n1 = noise(p * 0.32 + vec2(t * 0.22, t * 0.16));
        float n2 = noise(p * 0.85 - vec2(t * 0.28, -t * 0.2));
        float n3 = noise(p * 2.4 + vec2(-t * 0.5, t * 0.35));
        vec3 N = normalize(vec3((n1 - 0.5) * 0.55 + (n2 - 0.5) * 0.3 + (n3 - 0.5) * 0.12, 1.0, (n2 - 0.5) * 0.5 - (n1 - 0.5) * 0.25 + (n3 - 0.5) * 0.1));
        vec3 col = mix(uShallow, uDeep, smoothstep(0.0, 5.0, depth));
        float ca = noise(p * 1.6 + vec2(t * 0.45, t * 0.4)) * noise(p * 1.25 - vec2(t * 0.33, -t * 0.21));
        col += vec3(0.22, 0.3, 0.27) * smoothstep(0.1, 0.32, ca) * (1.0 - smoothstep(0.2, 2.4, depth)) * (1.0 - uNight * 0.8);
        vec3 V = normalize(cameraPosition - vW);
        float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
        col = mix(col, uSky, clamp(fres * 0.75 + 0.06, 0.0, 1.0));
        vec3 H = normalize(V + uSunDir);
        col += uSunCol * pow(max(dot(N, H), 0.0), 220.0) * 2.4;
        float edge = 1.0 - smoothstep(0.0, 0.2 + 0.14 * noise(p * 2.2 + t * 0.3), depth);
        float rings = sin(depth * 7.0 - t * 1.6 + noise(p * 0.7) * 4.0);
        float band = smoothstep(0.84, 0.98, rings) * (1.0 - smoothstep(0.15, 1.5, depth)) * smoothstep(0.35, 0.62, noise(p * 1.3 - t * 0.2));
        float foam = clamp(edge + band * 0.85, 0.0, 1.0);
        col = mix(col, uFoam * (1.0 - uNight * 0.6), foam);
        float alpha = max(mix(0.55, 1.0, smoothstep(0.0, 3.0, depth)), foam);
        col = mix(col, uFogCol, smoothstep(uFogNear, uFogFar, length(cameraPosition - vW)));
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(900, 900).rotateX(-Math.PI / 2), mat);
  mesh.position.y = 0.0;
  mesh.renderOrder = 2;
  return { mesh, uniforms };
}
