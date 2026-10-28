// Krishna's Island — the runtime. Builds the scene, runs the player/camera,
// villagers and ambient life, building interiors, hidden stars and sound, and
// drives the DOM overlays the React HUD owns.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { createKit, updateKit, U } from "./materials";
import { buildGround, buildGrass, buildFlowers, buildWater } from "./terrain";
import { buildSky, lightAt, istHour } from "./sky";
import { buildProps } from "./props";
import { makeCharacter, animateCharacter, makeCat, animateCat, makeDuck, makeBird, makeButterfly } from "./actors";
import { buildInterior, ROOMS } from "./interiors";
import { createAudio } from "./audio";
import { STARS } from "./quests";
import { heightAt, onDock, islandT, pathDist, DOCK, PLACES, NPCS, CAT, SPAWN, FOUNTAIN, PLAZA, BUILDINGS } from "./layout";
import { FLOWERS, TREES } from "./scatter";
import { clamp, damp, dampAngle, lerp, rng, smooth } from "./util";

const TiltShift = {
  uniforms: { tDiffuse: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uAmt: { value: 2.2 }, uSat: { value: 1.06 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uAmt, uSat; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float b = smoothstep(0.24, 0.52, abs(vUv.y - 0.5)) * uAmt;
      if (b > 0.05) {
        vec4 acc = c;
        for (int i = 0; i < 8; i++) {
          float a = float(i) * 0.785398 + 0.39;
          vec2 o = vec2(cos(a), sin(a)) * b / uRes;
          acc += texture2D(tDiffuse, vUv + o) + texture2D(tDiffuse, vUv + o * 0.5);
        }
        c = acc / 17.0;
      }
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, uSat);
      gl_FragColor = c;
    }`,
};

export function createIsland({ canvas, overlay = {}, found = [], onReady, onPrompt, onOpen, onToast, onEvent, onInside }) {
  const params = new URLSearchParams(location.search);
  const coarse = matchMedia("(pointer: coarse)").matches;
  const low = coarse || Math.min(innerWidth, innerHeight) < 640 || params.has("low");
  const Q = { low, dpr: Math.min(devicePixelRatio || 1, low ? 1.5 : 2), post: !low && !params.has("nopost"), grass: low ? 20000 : 56000, shadow: low ? 1024 : 2048 };
  const audio = createAudio();
  const emit = (e) => onEvent?.(e);

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Q.dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xcfe8fb, 70, 200);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.3, 900);

  const K = createKit();
  const ground = buildGround({ low, kit: K });
  scene.add(ground.group);
  scene.add(buildGrass(ground.F, Q.grass));
  scene.add(buildFlowers());
  const water = buildWater();
  scene.add(water.mesh);
  const sky = buildSky();
  scene.add(sky.dome, sky.stars, sky.clouds);
  const P = buildProps(K, Q);
  scene.add(P.merged, P.mergedPools, P.dynamic);
  P.hits.forEach((h) => h.updateMatrixWorld(true));

  const hemi = new THREE.HemisphereLight(0xc4e2ff, 0x74914f, 1.0);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(Q.shadow, Q.shadow);
  const SH = 26;
  Object.assign(sun.shadow.camera, { left: -SH, right: SH, top: SH, bottom: -SH, near: 1, far: 170 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  const lantern = new THREE.PointLight(0xffb866, 0, 9, 1.6);
  scene.add(lantern);

  // ---------- post ----------
  let composer = null, bloom = null, tilt = null, renderPass = null;
  if (Q.post) {
    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.6, 0.92);
    composer.addPass(bloom);
    tilt = new ShaderPass(TiltShift);
    composer.addPass(tilt);
    composer.addPass(new OutputPass());
  }

  // ---------- collision + ground ----------
  const PR = 0.42;
  function resolve(x, z, list) {
    for (const c of list) {
      if (c.box) {
        const cs = Math.cos(-c.rot), sn = Math.sin(-c.rot), px = x - c.x, pz = z - c.z;
        let lx = px * cs + pz * sn, lz = -px * sn + pz * cs;
        const qx = clamp(lx, -c.hw, c.hw), qz = clamp(lz, -c.hd, c.hd), dx = lx - qx, dz = lz - qz, d = Math.hypot(dx, dz);
        if (d < PR) {
          if (d > 1e-5) {
            lx = qx + (dx / d) * PR;
            lz = qz + (dz / d) * PR;
          } else {
            const ex = c.hw - Math.abs(lx), ez = c.hd - Math.abs(lz);
            if (ex < ez) lx = Math.sign(lx || 1) * (c.hw + PR);
            else lz = Math.sign(lz || 1) * (c.hd + PR);
          }
          const ics = Math.cos(c.rot), isn = Math.sin(c.rot);
          x = c.x + lx * ics + lz * isn;
          z = c.z - lx * isn + lz * ics;
        }
      } else {
        const dx = x - c.x, dz = z - c.z, m = c.r + PR;
        if (Math.abs(dx) > m || Math.abs(dz) > m) continue;
        const d = Math.hypot(dx, dz);
        if (d < m && d > 1e-5) {
          x = c.x + (dx / d) * m;
          z = c.z + (dz / d) * m;
        }
      }
    }
    return [x, z];
  }
  const walkable = (x, z) => heightAt(x, z) > -0.3 || onDock(x, z);
  function floorAt(x, z) {
    if (inside) return 0;
    let y = heightAt(x, z);
    if (onDock(x, z)) y = Math.max(y, DOCK.y + 0.04);
    for (const p of P.platforms) if (Math.hypot(x - p.x, z - p.z) < p.r) y = Math.max(y, p.y);
    return y;
  }
  let inside = null; // { b, I } while in a building

  // ---------- blob shadows ----------
  const blobMat = new THREE.MeshBasicMaterial({ map: K.T.pool, color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false });
  const blob = (r, parent = scene) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20).rotateX(-Math.PI / 2), blobMat);
    m.renderOrder = 1;
    parent.add(m);
    return m;
  };

  // ---------- player ----------
  const hero = makeCharacter({ top: "#ff6b4a", pants: "#2f3b59", skin: "#e8ae86", hair: "#4a2c1c", backpack: "#f2c14e", shoe: "#ffffff" });
  scene.add(hero.root);
  const heroBlob = blob(0.55);
  const st = { x: SPAWN.x, z: SPAWN.z, y: heightAt(SPAWN.x, SPAWN.z), vx: 0, vz: 0, vy: 0, yaw: Math.PI, air: false, paused: false, coins: 0, runT: 0, stepSign: 1 };

  // ---------- villagers ----------
  const npcs = NPCS.map((n) => {
    const c = makeCharacter(n.look);
    scene.add(c.root);
    return { ...n, c, blob: blob(0.5), x: n.route[0][0], z: n.route[0][1], yaw: 0, yawT: 0, wp: 1, wait: 0.5 + Math.random() * 2, speed: 0, talkT: 0, line: -1, waveT: 0, waved: false };
  });

  // ---------- Mochi ----------
  const cat = { ...makeCat(), blob: blob(0.32), x: CAT.x, z: CAT.z, yaw: 0, yawT: 0, mode: "sit", t: 3, tx: CAT.x, tz: CAT.z, follow: 0, speed: 0 };
  scene.add(cat.root);

  // ---------- ducks near the dock ----------
  const duckC = { x: DOCK.x + DOCK.dx * 6 - DOCK.dz * 4.2, z: DOCK.z + DOCK.dz * 6 + DOCK.dx * 4.2 };
  const ducks = [makeDuck(false), makeDuck(true), makeDuck(true), makeDuck(true)];
  ducks.forEach((d) => scene.add(d.root));
  let quackT = 6;

  // ---------- birds + butterflies ----------
  const birds = Array.from({ length: 8 }, (_, i) => ({ ...makeBird(), flock: i < 4 ? 0 : 1, i: i % 4 }));
  birds.forEach((b) => scene.add(b.root));
  const R = rng(5150);
  const flies = ["#ffffff", "#ffd84d", "#8fd0ff", "#ff9e5e", "#ffc2e0", "#ffffff", "#ffd84d", "#b9a3ff", "#8fd0ff"].map((c) => {
    const home = FLOWERS[Math.floor(R() * FLOWERS.length)];
    const f = { ...makeButterfly(c), home, ph: R() * 6, mode: "fly", t: 3 + R() * 6, x: home.x, y: home.y + 0.8, z: home.z, tgt: null };
    f.root.position.set(f.x, f.y, f.z);
    scene.add(f.root);
    return f;
  });
  const flowersNear = (h) => FLOWERS.filter((f) => Math.abs(f.x - h.x) < 2.6 && Math.abs(f.z - h.z) < 2.6);

  // ---------- fireflies ----------
  const FN = low ? 60 : 110, fpos = new Float32Array(FN * 3), fseed = new Float32Array(FN);
  for (let i = 0; i < FN; i++) {
    const src = R() < 0.6 ? FLOWERS[Math.floor(R() * FLOWERS.length)] : TREES[Math.floor(R() * TREES.length)];
    const x = src.x + (R() - 0.5) * 3, z = src.z + (R() - 0.5) * 3;
    fpos.set([x, heightAt(x, z) + 0.5 + R() * 1.4, z], i * 3);
    fseed[i] = R();
  }
  const fg = new THREE.BufferGeometry();
  fg.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
  fg.setAttribute("aSeed", new THREE.BufferAttribute(fseed, 1));
  const ffU = { uTime: U.uTime, uNight: { value: 0 }, uScale: { value: Q.dpr } };
  const fireflies = new THREE.Points(fg, new THREE.ShaderMaterial({
    uniforms: ffU,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSeed; uniform float uTime, uScale; varying float vA;
      void main() {
        vec3 p = position + vec3(sin(uTime * 0.6 + aSeed * 31.0) * 0.9, sin(uTime * 1.1 + aSeed * 17.0) * 0.35, cos(uTime * 0.5 + aSeed * 23.0) * 0.9);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vA = smoothstep(0.1, 1.0, 0.5 + 0.5 * sin(uTime * (1.4 + aSeed * 2.0) + aSeed * 40.0));
        gl_PointSize = (90.0 * uScale) / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uNight; varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(0.95, 1.0, 0.55) * (0.6 + a), a * a * vA * uNight);
      }`,
  }));
  fireflies.frustumCulled = false;
  scene.add(fireflies);

  // ---------- instanced puffs: dust + chimney smoke ----------
  const puffGeo = new THREE.IcosahedronGeometry(1, 1);
  const DUST = 36, dust = new THREE.InstancedMesh(puffGeo, new THREE.MeshLambertMaterial({ color: "#f1e6cc" }), DUST);
  dust.frustumCulled = false;
  const dustP = Array.from({ length: DUST }, () => ({ life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, s: 0 }));
  let dustI = 0;
  scene.add(dust);
  const puff = (x, y, z, n = 1, spread = 1) => {
    for (let k = 0; k < n; k++) {
      const p = dustP[dustI++ % DUST], a = Math.random() * 6.28;
      Object.assign(p, { life: 0.55 + Math.random() * 0.25, max: 0.7, x, y, z, vx: Math.cos(a) * 0.9 * spread, vy: 0.5 + Math.random() * 0.6, vz: Math.sin(a) * 0.9 * spread, s: 0.12 + Math.random() * 0.1 });
    }
  };
  const smokeMat = new THREE.MeshLambertMaterial({ color: "#f2f2f2", emissive: "#555", emissiveIntensity: 0.3, transparent: true, opacity: 0.55, depthWrite: false });
  const SMN = 8, smoke = new THREE.InstancedMesh(puffGeo, smokeMat, P.smokes.length * SMN);
  smoke.frustumCulled = false;
  scene.add(smoke);

  // ---------- sprite FX: hearts + sparkles ----------
  const sprites = Array.from({ length: 48 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: K.T.sparkle, transparent: true, depthWrite: false }));
    s.visible = false;
    s.userData = { life: 0 };
    scene.add(s);
    return s;
  });
  let spI = 0;
  const fx = (kind, x, y, z, n = 6, spread = 1) => {
    for (let k = 0; k < n; k++) {
      const s = sprites[spI++ % sprites.length], heart = kind === "heart";
      s.material.map = heart ? K.T.heart : K.T.sparkle;
      s.material.blending = heart ? THREE.NormalBlending : THREE.AdditiveBlending;
      s.material.needsUpdate = true;
      s.position.set(x + (Math.random() - 0.5) * 0.6 * spread, y + Math.random() * 0.3, z + (Math.random() - 0.5) * 0.6 * spread);
      s.userData = { life: 1.1 + Math.random() * 0.5, max: 1.4, vy: heart ? 0.9 : 1.6, vx: (Math.random() - 0.5) * (heart ? 0.4 : 1.6) * spread, vz: (Math.random() - 0.5) * (heart ? 0.4 : 1.6) * spread, size: heart ? 0.38 : 0.45, kind };
      s.visible = true;
    }
  };

  // ---------- confetti (quest log complete) ----------
  const CONF = 140, confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.14, 0.08), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), CONF);
  confetti.frustumCulled = false;
  confetti.visible = false;
  const confP = Array.from({ length: CONF }, () => ({ life: 0 }));
  const confCols = ["#D4A848", "#E07B6B", "#4FD1C5", "#ffffff", "#6abe4f", "#b9a3ff"].map((c) => new THREE.Color(c));
  for (let i = 0; i < CONF; i++) confetti.setColorAt(i, confCols[i % confCols.length]);
  scene.add(confetti);

  // tap marker + thrown coin
  const marker = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.45, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false }));
  marker.renderOrder = 3;
  scene.add(marker);
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 18), new THREE.MeshStandardMaterial({ color: "#ffd25a", metalness: 0.8, roughness: 0.3, emissive: "#6b4a00", emissiveIntensity: 0.4 }));
  coin.visible = false;
  scene.add(coin);
  let coinFly = null;
  const travellers = () => [hero.root, heroBlob, dust, marker, confetti, ...sprites]; // objects that follow the player between scenes

  // ---------- hidden stars ----------
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.17 : 0.4;
    if (i) starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }).center();
  const starMat = new THREE.MeshStandardMaterial({ color: "#ffd65a", emissive: "#ffa800", emissiveIntensity: 1.2, metalness: 0.45, roughness: 0.3 });
  const glowMat = new THREE.SpriteMaterial({ map: K.T.puff, color: "#ffd65a", transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
  const foundSet = new Set(found);
  const stars = STARS.map((s, i) => {
    const g = new THREE.Group(), m = new THREE.Mesh(starGeo, starMat);
    m.castShadow = true;
    const glow = new THREE.Sprite(glowMat);
    glow.scale.setScalar(1.7);
    g.add(glow, m);
    const baseY = (s.room === "out" ? floorAt(s.x, s.z) : 0) + 1.05;
    g.position.set(s.x, baseY, s.z);
    return { ...s, i, g, m, baseY, got: foundSet.has(s.id) };
  });
  stars.filter((s) => s.room === "out" && !s.got).forEach((s) => scene.add(s.g));

  // ---------- fish that leap near the shore ----------
  const fishSpots = [];
  for (let k = 0; k < 360; k++) {
    const a = (k / 360) * Math.PI * 2;
    for (let r = 26; r < 46; r += 0.5) {
      const x = Math.cos(a) * r, z = Math.sin(a) * r, h = heightAt(x, z);
      if (h < -0.9 && h > -2.6) {
        fishSpots.push({ x, z, a });
        break;
      }
    }
  }
  const fishMat = new THREE.MeshStandardMaterial({ color: "#ff9b54", roughness: 0.35, metalness: 0.2 });
  const fish = Array.from({ length: 2 }, () => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), fishMat);
    body.scale.set(0.7, 0.85, 1.7);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.22, 4).rotateX(-Math.PI / 2), fishMat);
    tail.position.z = -0.32;
    g.add(body, tail);
    g.visible = false;
    scene.add(g);
    return { g, t: 2 + Math.random() * 5, jump: null };
  });
  const ringMat = () => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false });
  const rings = Array.from({ length: 6 }, () => {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 28).rotateX(-Math.PI / 2), ringMat());
    m.renderOrder = 3;
    m.userData.life = 0;
    scene.add(m);
    return m;
  });
  let ringI = 0;
  const ripple = (x, z, y = 0.03) => {
    const m = rings[ringI++ % rings.length];
    m.position.set(x, y, z);
    m.userData.life = 1;
    m.scale.setScalar(0.5);
  };

  // ---------- petals drifting off the blossom trees ----------
  const blossoms = TREES.filter((t) => t.type === "blossom");
  const PET = blossoms.length ? 90 : 0;
  const petals = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.1, 0.07), new THREE.MeshLambertMaterial({ color: "#ffc6d9", side: THREE.DoubleSide, emissive: "#5a2a3a", emissiveIntensity: 0.25 }), Math.max(PET, 1));
  petals.frustumCulled = false;
  scene.add(petals);
  const petalP = Array.from({ length: PET }, () => ({ life: 0, delay: Math.random() * 8 }));
  const spawnPetal = (p) => {
    const tr = blossoms[Math.floor(Math.random() * blossoms.length)], a = Math.random() * 6.28, r = Math.random() * 1.6 * tr.s;
    Object.assign(p, { x: tr.x + Math.cos(a) * r, z: tr.z + Math.sin(a) * r, y: tr.y + (2.2 + Math.random() * 1.4) * tr.s, gy: heightAt(tr.x, tr.z), seed: Math.random() * 10, life: 1, rest: 0 });
  };

  // ---------- lighting / time of day ----------
  let fixedHour = params.has("hour") ? clamp(+params.get("hour"), 0, 23.99) : null;
  let hourNow = fixedHour ?? istHour();
  let target = lightAt(hourNow);
  const env = { ...target, sunDir: target.sunDir.clone() };
  for (const k of ["top", "hor", "sun", "hs", "hg", "cloud", "shallow", "deep"]) env[k] = target[k].clone();
  let hourTimer = 0;
  const lightBasis = new THREE.Matrix4(), lightInv = new THREE.Matrix4(), tmpV = new THREE.Vector3(), origin = new THREE.Vector3(), upV = new THREE.Vector3(0, 1, 0);

  function applyLight(dt) {
    hourTimer -= dt;
    if (hourTimer <= 0) {
      hourTimer = 1;
      hourNow = fixedHour ?? istHour();
      target = lightAt(hourNow);
    }
    const k = 1 - Math.exp(-dt * 2.2);
    for (const n of ["top", "hor", "sun", "hs", "hg", "cloud", "shallow", "deep"]) env[n].lerp(target[n], k);
    for (const n of ["si", "hi", "night"]) env[n] += (target[n] - env[n]) * k;
    env.sunDir.lerp(target.sunDir, k).normalize();
    scene.fog.color.copy(env.hor);
    sky.uniforms.uTop.value.copy(env.top);
    sky.uniforms.uHor.value.copy(env.hor);
    sky.uniforms.uSunDir.value.copy(env.sunDir);
    sky.uniforms.uSunCol.value.copy(env.sun);
    sky.uniforms.uMoonDir.value.copy(target.moonDir);
    sky.uniforms.uNight.value = env.night;
    sky.starU.uNight.value = smooth(0.4, 1, env.night);
    sky.starU.uTime.value = U.uTime.value;
    sky.cloudMat.color.copy(env.cloud);
    sky.cloudMat.emissive.copy(env.cloud).multiplyScalar(0.35);
    hemi.color.copy(env.hs);
    hemi.groundColor.copy(env.hg);
    hemi.intensity = env.hi;
    sun.color.copy(env.sun);
    sun.intensity = env.si;
    const W = water.uniforms;
    W.uShallow.value.copy(env.shallow);
    W.uDeep.value.copy(env.deep);
    W.uSky.value.copy(env.hor).lerp(env.top, 0.35);
    W.uSunDir.value.copy(env.sunDir);
    W.uSunCol.value.copy(env.sun).multiplyScalar(1 - env.night * 0.6);
    W.uNight.value = env.night;
    W.uFogCol.value.copy(env.hor);
    ffU.uNight.value = smooth(0.45, 1, env.night);
    P.waterU.uDay.value = 1 - env.night * 0.8;
    smokeMat.color.setScalar(1 - env.night * 0.55);
    updateKit(K, env.night, U.uTime.value);
    lantern.intensity = env.night * 7;
    if (bloom) bloom.strength = inside ? 0.42 : 0.3 + env.night * 0.55;
    renderer.toneMappingExposure = inside ? 1.0 : 1.0 + env.night * 0.12;
  }

  function placeSun(fx_, fy, fz) {
    // keep the shadow map texel-snapped so edges don't shimmer while walking
    lightBasis.lookAt(origin, tmpV.copy(env.sunDir).negate(), upV);
    lightInv.copy(lightBasis).invert();
    const f = tmpV.set(fx_, fy, fz).applyMatrix4(lightInv), texel = (SH * 2) / Q.shadow;
    f.x = Math.round(f.x / texel) * texel;
    f.y = Math.round(f.y / texel) * texel;
    f.applyMatrix4(lightBasis);
    sun.target.position.copy(f);
    sun.position.copy(f).addScaledVector(env.sunDir, 80);
    sun.target.updateMatrixWorld();
  }

  // ---------- camera ----------
  const portrait = () => innerWidth < innerHeight;
  const outDist = () => (portrait() ? 31 : 24);
  const roomDist = (W = 11) => (portrait() ? W * 1.75 : Math.max(13, W * 1.12));
  let camDist = outDist(), camDistT = camDist;
  const camT = new THREE.Vector3(st.x, st.y + 0.9, st.z);
  let introT = params.has("nointro") ? 9 : 0;

  // ---------- rooms: walk in through a door, out through the doorway ----------
  const rooms = {};
  const fadeEl = overlay.fade;
  let busy = false;
  function transition(swap) {
    if (busy) return;
    busy = true;
    st.paused = true;
    keys.clear();
    moveTo = null;
    joy = null;
    if (fadeEl) fadeEl.style.opacity = "1";
    setTimeout(() => {
      swap();
      setTimeout(() => {
        if (fadeEl) fadeEl.style.opacity = "0";
        st.paused = false;
        busy = false;
        current = null;
        onPrompt?.(null);
      }, 140);
    }, fadeEl ? 330 : 0);
  }
  function enterRoom(b) {
    audio.sfx("door");
    transition(() => {
      let I = rooms[b.kind];
      if (!I) {
        I = rooms[b.kind] = buildInterior(b.kind, K);
        stars.filter((s) => s.room === b.kind && !s.got).forEach((s) => I.scene.add(s.g));
      }
      inside = { b, I };
      travellers().forEach((o) => I.scene.add(o));
      Object.assign(st, { x: I.spawn.x, z: I.spawn.z, y: 0, vx: 0, vz: 0, vy: 0, air: false, yaw: Math.PI });
      camT.set(0, 1.2, -I.D * 0.12);
      camDist = camDistT = roomDist(I.W);
      if (renderPass) renderPass.scene = I.scene;
      onInside?.({ id: b.id, title: I.title, zone: I.zone });
      emit({ type: "visit", zone: I.zone });
    });
  }
  function exitRoom() {
    if (!inside) return;
    const { b } = inside;
    audio.sfx("door");
    transition(() => {
      travellers().forEach((o) => scene.add(o));
      inside = null;
      const x = b.door.x + Math.sin(b.rot) * 0.5, z = b.door.z + Math.cos(b.rot) * 0.5;
      Object.assign(st, { x, z, y: floorAt(x, z), vx: 0, vz: 0, vy: 0, air: false, yaw: b.rot });
      camT.set(st.x, st.y + 0.9, st.z);
      camDist = camDistT = outDist();
      if (renderPass) renderPass.scene = scene;
      onInside?.(null);
    });
  }

  // ---------- input ----------
  const keys = new Set();
  let moveTo = null, joy = null;
  const isField = (el) => el && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(el.tagName);
  function onKeyDown(e) {
    if (st.paused) return;
    const k = e.code;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(k)) e.preventDefault();
    if ((k === "Space" || k === "Enter") && isField(e.target)) return;
    keys.add(k);
    if (/^(Key[WASD]|Arrow)/.test(k)) moveTo = null;
    if (e.repeat) return;
    if (k === "Space") api.jump();
    if (k === "KeyE" || k === "Enter") api.interact();
  }
  const onKeyUp = (e) => keys.delete(e.code);
  const onBlur = () => keys.clear();

  const pointers = new Map();
  let pinch = 0;
  const zoomLimits = () => (inside ? [9, 30] : [12, 42]);
  function onPointerDown(e) {
    if (st.paused) return;
    canvas.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, { sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, t: performance.now() });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
      joy = null;
    }
  }
  function onPointerMove(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y), [lo, hi] = zoomLimits();
      if (pinch) camDistT = clamp(camDistT * (pinch / d), lo, hi);
      pinch = d;
      return;
    }
    const dx = p.x - p.sx, dy = p.y - p.sy, m = Math.hypot(dx, dy);
    if (m > 14 || joy) {
      const L = Math.min(m, 70) / 70;
      joy = { x: (dx / (m || 1)) * L, z: (dy / (m || 1)) * L, sx: p.sx, sy: p.sy, kx: (dx / (m || 1)) * Math.min(m, 46), ky: (dy / (m || 1)) * Math.min(m, 46) };
      moveTo = null;
    }
  }
  function onPointerUp(e) {
    const p = pointers.get(e.pointerId);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (!p) return;
    const moved = Math.hypot(p.x - p.sx, p.y - p.sy);
    if (!joy && moved < 10 && performance.now() - p.t < 400 && !st.paused) tap(p.x, p.y);
    joy = null;
  }
  const onWheel = (e) => {
    e.preventDefault();
    const [lo, hi] = zoomLimits();
    camDistT = clamp(camDistT * (1 + clamp(e.deltaY, -120, 120) * 0.0012), lo, hi);
  };

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), proj = new THREE.Vector3();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitP = new THREE.Vector3();
  function screenOf(x, y, z) {
    proj.set(x, y, z).project(camera);
    const r = canvas.getBoundingClientRect();
    return { x: r.left + (proj.x * 0.5 + 0.5) * r.width, y: r.top + (-proj.y * 0.5 + 0.5) * r.height, behind: proj.z > 1 };
  }
  function tap(cx, cy) {
    let best = null, bd = 48;
    const rect = canvas.getBoundingClientRect();
    ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (inside) {
      for (const sp of inside.I.spots) {
        const s = screenOf(sp.x, sp.exit ? 0.4 : 1.2, sp.z), d = Math.hypot(s.x - cx, s.y - cy);
        if (d < 60 && d < bd + 12) (bd = d), (best = { type: "spot", spot: sp, x: sp.x, z: sp.z, r: 0.45 });
      }
      if (!best && ray.ray.intersectPlane(floorPlane, hitP)) best = { type: "walk", x: hitP.x, z: hitP.z, r: 0.3 };
    } else {
      // actors first (screen-space pick), then buildings, then the ground
      for (const n of npcs) {
        const s = screenOf(n.x, floorAt(n.x, n.z) + 1.1, n.z), d = Math.hypot(s.x - cx, s.y - cy);
        if (d < bd) (bd = d), (best = { type: "npc", n, x: n.x, z: n.z, r: 2.0 });
      }
      {
        const s = screenOf(cat.x, floorAt(cat.x, cat.z) + 0.4, cat.z), d = Math.hypot(s.x - cx, s.y - cy);
        if (d < bd) (bd = d), (best = { type: "cat", x: cat.x, z: cat.z, r: 1.5 });
      }
      if (!best) {
        const h = ray.intersectObjects(P.hits, false)[0];
        if (h) {
          const pl = PLACES.find((p) => p.id === h.object.userData.target);
          if (pl) best = { type: "place", id: pl.id, x: pl.door.x, z: pl.door.z, r: pl.id === "portal" ? 2.4 : 1.6 };
        }
      }
      if (!best) {
        const g = ray.intersectObject(ground.ground, false)[0];
        if (g) {
          if (Math.hypot(g.point.x - FOUNTAIN.x, g.point.z - FOUNTAIN.z) < FOUNTAIN.r + 0.2) best = { type: "coin", x: FOUNTAIN.x, z: FOUNTAIN.z + FOUNTAIN.r + 0.6, r: 1.2 };
          else if (walkable(g.point.x, g.point.z)) best = { type: "walk", x: g.point.x, z: g.point.z, r: 0.3 };
        }
      }
    }
    if (!best) return;
    moveTo = { ...best, stuck: 0, lastD: 1e9 };
    marker.position.set(best.x, floorAt(best.x, best.z) + 0.06, best.z);
    marker.material.opacity = 0.9;
    marker.scale.setScalar(1);
  }

  // ---------- interactions ----------
  let current = null;
  const spotTarget = (sp) => ({ type: "spot", id: sp.id, name: sp.name, verb: sp.verb, spot: sp });
  function findTarget() {
    let best = null, score = 1;
    if (inside) {
      for (const sp of inside.I.spots) {
        const d = Math.hypot(st.x - sp.x, st.z - sp.z) / sp.r;
        if (d < score) (score = d), (best = spotTarget(sp));
      }
      return best;
    }
    for (const p of PLACES) {
      const r = p.id === "portal" ? 2.8 : 2.4, d = Math.hypot(st.x - p.door.x, st.z - p.door.z) / r;
      if (d < score) (score = d), (best = { type: "place", id: p.id, zone: p.zone, name: p.name, verb: p.id === "portal" ? "Step through" : p.id === "sign" ? "Read" : "Go into" });
    }
    const fd = (Math.hypot(st.x - FOUNTAIN.x, st.z - FOUNTAIN.z) - FOUNTAIN.r - PR) / 1.2;
    if (fd < score) (score = fd), (best = { type: "coin", id: "fountain", name: "the fountain", verb: "Toss a coin into" });
    for (const n of npcs) {
      const d = (Math.hypot(st.x - n.x, st.z - n.z) / 2.4) * 0.75;
      if (d < score) (score = d), (best = { type: "npc", id: n.id, name: n.name, verb: "Talk to", n });
    }
    const cd = (Math.hypot(st.x - cat.x, st.z - cat.z) / 1.9) * 0.7;
    if (cd < score && cat.follow <= 0) (score = cd), (best = { type: "cat", id: "cat", name: CAT.name, verb: "Pet" });
    return best;
  }

  const bubble = { who: null, t: 0, text: "" };
  function say(who, text, secs = 4.8) {
    bubble.who = who;
    bubble.t = secs;
    if (overlay.bubble?.text) overlay.bubble.text.textContent = text;
  }

  const api = {
    interact() {
      const tg = current;
      if (!tg || st.paused) return;
      moveTo = null;
      if (tg.type === "spot") {
        const sp = tg.spot;
        if (sp.exit) return exitRoom();
        audio.sfx("open");
        st.paused = true;
        keys.clear();
        onOpen?.(sp.open.zone, sp.open.id);
      } else if (tg.type === "place") {
        const b = BUILDINGS.find((x) => x.id === tg.id);
        if (b && ROOMS[b.kind]) return enterRoom(b);
        audio.sfx(tg.zone === "portal" ? "portal" : "open");
        if (tg.zone === "portal") emit({ type: "visit", zone: "portal" });
        st.paused = true;
        keys.clear();
        onOpen?.(tg.zone, tg.id);
      } else if (tg.type === "npc") {
        const n = tg.n;
        n.line = (n.line + 1) % n.lines.length;
        n.talkT = 6;
        n.waveT = 0;
        n.c.squash = 0.6;
        say(n, n.lines[n.line]);
        audio.sfx("talk");
        emit({ type: "talk", id: n.id });
      } else if (tg.type === "cat") {
        cat.follow = 24;
        cat.mode = "follow";
        fx("heart", cat.x, floorAt(cat.x, cat.z) + 0.8, cat.z, 6);
        say(cat, "Mrrp! Mochi will tag along for a bit.", 3.5);
        audio.sfx("pet");
        emit({ type: "pet" });
      } else if (tg.type === "coin") {
        if (coinFly) return;
        const a = Math.random() * 6.28, r = 0.6 + Math.random() * 0.9;
        coinFly = { t: 0, x0: st.x, y0: st.y + 1.2, z0: st.z, x1: FOUNTAIN.x + Math.cos(a) * r, z1: FOUNTAIN.z + Math.sin(a) * r };
        hero.squash = 0.4;
        audio.sfx("coin");
      }
    },
    jump() {
      if (st.paused || st.air) return;
      st.vy = 7.2;
      st.air = true;
      hero.squash = -0.5;
      puff(st.x, st.y + 0.1, st.z, 4, 0.7);
      audio.sfx("jump");
    },
    pause() {
      st.paused = true;
      keys.clear();
      moveTo = null;
      joy = null;
    },
    resume() {
      st.paused = false;
      current = null;
      onPrompt?.(null);
    },
    exit: () => exitRoom(),
    setHour(h) {
      fixedHour = h;
      hourTimer = 0;
    },
    setSound: (on) => audio.setEnabled(on),
    celebrate() {
      confetti.visible = true;
      confP.forEach((p) => Object.assign(p, { life: 3.5 + Math.random() * 2, x: st.x + (Math.random() - 0.5) * 6, y: st.y + 4 + Math.random() * 3, z: st.z + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 1.2, vz: (Math.random() - 0.5) * 1.2, rx: Math.random() * 6, ry: Math.random() * 6, spin: 4 + Math.random() * 6 }));
      fx("sparkle", st.x, st.y + 1.5, st.z, 16, 3);
      audio.sfx("win");
    },
    joystick(x, z) {
      joy = x || z ? { x, z } : null;
      if (joy) moveTo = null;
    },
    dispose,
  };

  // ---------- minimap ----------
  const MM = overlay.minimap;
  let mmBase = null;
  if (MM) {
    const N = 120, c = document.createElement("canvas");
    c.width = c.height = N;
    const g = c.getContext("2d"), img = g.createImageData(N, N);
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const x = -42 + (i / N) * 84, z = -42 + (j / N) * 84, h = heightAt(x, z);
        const col = h < -1.2 ? [94, 170, 214] : h < -0.02 ? [126, 200, 222] : h < 0.5 ? [240, 220, 170] : h > 2.4 ? [128, 178, 92] : [150, 200, 110];
        img.data.set([...col, 255], (j * N + i) * 4);
      }
    g.putImageData(img, 0, 0);
    mmBase = c;
  }
  const PLACE_COL = { projects: "#D4A848", designer: "#E07B6B", builder: "#D4A848", engineer: "#4FD1C5", inn: "#6abe4f", portal: "#4FD1C5", welcome: "#ffffff" };
  function drawMinimap() {
    if (!MM || !mmBase || inside) return;
    const g = MM.getContext("2d"), S = MM.width, k = S / 84, m = (x) => (x + 42) * k, u = S / 132;
    g.clearRect(0, 0, S, S);
    g.save();
    g.beginPath();
    g.arc(S / 2, S / 2, S / 2 - 1, 0, Math.PI * 2);
    g.clip();
    g.imageSmoothingEnabled = true;
    g.drawImage(mmBase, 0, 0, S, S);
    for (const p of PLACES) {
      g.fillStyle = PLACE_COL[p.zone] || "#fff";
      g.strokeStyle = "rgba(20,20,20,0.75)";
      g.lineWidth = 1.5 * u;
      g.beginPath();
      g.arc(m(p.x), m(p.z), 3.4 * u, 0, Math.PI * 2);
      g.fill();
      g.stroke();
    }
    g.fillStyle = "#ffffff";
    for (const n of npcs) {
      g.beginPath();
      g.arc(m(n.x), m(n.z), 1.8 * u, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "#f2a65a";
    g.beginPath();
    g.arc(m(cat.x), m(cat.z), 1.8 * u, 0, Math.PI * 2);
    g.fill();
    g.translate(m(st.x), m(st.z));
    g.rotate(-st.yaw + Math.PI);
    g.fillStyle = "#ff6b4a";
    g.strokeStyle = "#ffffff";
    g.lineWidth = 1.5 * u;
    g.beginPath();
    g.moveTo(0, -6 * u);
    g.lineTo(4.5 * u, 4.5 * u);
    g.lineTo(0, 2.2 * u);
    g.lineTo(-4.5 * u, 4.5 * u);
    g.closePath();
    g.fill();
    g.stroke();
    g.restore();
  }

  // ---------- overlays (nameplates, NPC tags, bubble, joystick) ----------
  function place(el, x, y, z, op) {
    if (!el) return;
    const s = screenOf(x, y, z);
    if (s.behind || op < 0.02) {
      el.style.opacity = "0";
      return;
    }
    el.style.opacity = String(op);
    el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
  }
  function updateOverlays() {
    const L = overlay.labels || {}, T = overlay.tags || {};
    if (inside) {
      Object.values(L).forEach((el) => el && (el.style.opacity = "0"));
      Object.values(T).forEach((el) => el && (el.style.opacity = "0"));
    } else {
      for (const p of PLACES) {
        const a = P.anchors[p.id];
        if (!a) continue;
        const d = Math.hypot(st.x - p.door.x, st.z - p.door.z);
        const sy = screenOf(a.x, a.y, a.z).y, hgt = canvas.clientHeight || innerHeight;
        place(L[p.id], a.x, a.y, a.z, (1 - smooth(10, 18, d)) * (1 - smooth(hgt - 190, hgt - 120, sy)));
        if (L[p.id]) L[p.id].dataset.active = current?.id === p.id ? "1" : "0";
      }
      for (const n of npcs) place(T[n.id], n.x, floorAt(n.x, n.z) + 2.25, n.z, (1 - smooth(5, 9, Math.hypot(st.x - n.x, st.z - n.z))) * (bubble.who === n && bubble.t > 0 ? 0 : 1));
      place(T.cat, cat.x, floorAt(cat.x, cat.z) + 1.0, cat.z, (1 - smooth(3.5, 6.5, Math.hypot(st.x - cat.x, st.z - cat.z))) * (bubble.who === cat && bubble.t > 0 ? 0 : 1));
    }
    const B = overlay.bubble?.el;
    if (B) {
      const w = bubble.who;
      if (w && bubble.t > 0 && !inside) place(B, w.x, floorAt(w.x, w.z) + (w === cat ? 1.05 : 2.35), w.z, Math.min(1, bubble.t * 3));
      else B.style.opacity = "0";
    }
    const J = overlay.joy;
    if (J?.base) {
      if (joy && joy.sx !== undefined) {
        J.base.style.opacity = "1";
        J.base.style.transform = `translate3d(${joy.sx}px, ${joy.sy}px, 0) translate(-50%, -50%)`;
        J.knob.style.transform = `translate3d(${joy.kx}px, ${joy.ky}px, 0)`;
      } else J.base.style.opacity = "0";
    }
  }

  // ---------- updates ----------
  let last = performance.now();
  let raf = 0, t = 0, frameN = 0, ready = false, perfAcc = 0, perfN = 0, degraded = 0;
  const m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), vv = new THREE.Vector3(), ss = new THREE.Vector3(), ee = new THREE.Euler();

  function surfaceAt(x, z) {
    if (inside || onDock(x, z)) return "wood";
    if (Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r || pathDist(x, z) < 0.9) return "stone";
    for (const p of P.platforms) if (Math.hypot(x - p.x, z - p.z) < p.r) return "stone";
    return heightAt(x, z) < 0.55 ? "sand" : "grass";
  }

  function updatePlayer(dt) {
    let ix = 0, iz = 0;
    if (!st.paused) {
      if (keys.has("KeyA") || keys.has("ArrowLeft")) ix -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) ix += 1;
      if (keys.has("KeyW") || keys.has("ArrowUp")) iz -= 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) iz += 1;
      if (joy) {
        ix += joy.x;
        iz += joy.z;
      }
    }
    let mag = Math.min(1, Math.hypot(ix, iz));
    const run = keys.has("ShiftLeft") || keys.has("ShiftRight") || (joy && Math.hypot(joy.x, joy.z) > 0.92);
    if (mag < 0.05 && moveTo && !st.paused) {
      const dx = moveTo.x - st.x, dz = moveTo.z - st.z, d = Math.hypot(dx, dz);
      if (d < moveTo.r) {
        const mt = moveTo;
        moveTo = null;
        if (mt.type !== "walk") {
          current = mt.type === "spot" ? spotTarget(mt.spot) : findTarget();
          if (mt.type === "npc" && (!current || current.type !== "npc")) current = { type: "npc", id: mt.n.id, n: mt.n, name: mt.n.name, verb: "Talk to" };
          if (mt.type === "cat") current = { type: "cat", id: "cat" };
          if (mt.type === "coin") current = { type: "coin", id: "fountain" };
          api.interact();
        }
      } else {
        ix = dx / d;
        iz = dz / d;
        mag = Math.min(1, d / 1.2 + 0.35);
        if (moveTo.type === "npc") ((moveTo.x = moveTo.n.x), (moveTo.z = moveTo.n.z));
        if (moveTo.type === "cat") ((moveTo.x = cat.x), (moveTo.z = cat.z));
        moveTo.stuck = d > moveTo.lastD - 0.004 ? moveTo.stuck + dt : 0;
        moveTo.lastD = d;
        if (moveTo.stuck > 0.8) moveTo = null;
      }
    }
    const len = Math.hypot(ix, iz) || 1, sp = (run ? 7.4 : 4.4) * mag * (inside ? 0.8 : 1);
    st.vx = damp(st.vx, (ix / len) * sp, mag > 0.05 ? 11 : 13, dt);
    st.vz = damp(st.vz, (iz / len) * sp, mag > 0.05 ? 11 : 13, dt);
    let nx = st.x + st.vx * dt, nz = st.z + st.vz * dt;
    if (inside) {
      const { W, D, colliders } = inside.I, m = PR + 0.1, inGap = Math.abs(nx) < 0.95 - PR * 0.4;
      [nx, nz] = resolve(nx, nz, colliders);
      nx = clamp(nx, -W / 2 + m, W / 2 - m);
      nz = clamp(nz, -D / 2 + m, inGap ? D / 2 + 1.2 : D / 2 - m);
      if (nz > D / 2 + 0.3 && !busy) exitRoom();
    } else {
      [nx, nz] = resolve(nx, nz, P.colliders);
      if (!walkable(nx, nz)) {
        if (walkable(nx, st.z)) nz = st.z;
        else if (walkable(st.x, nz)) nx = st.x;
        else ((nx = st.x), (nz = st.z));
      }
    }
    const spd = Math.hypot(nx - st.x, nz - st.z) / Math.max(dt, 1e-4);
    st.x = nx;
    st.z = nz;
    if (spd > 0.3) st.yaw = dampAngle(st.yaw, Math.atan2(st.vx, st.vz), 14, dt);
    const fl = floorAt(st.x, st.z);
    if (st.air) {
      st.vy -= 21 * dt;
      st.y += st.vy * dt;
      if (st.y <= fl) {
        st.y = fl;
        st.air = false;
        hero.squash = Math.min(0.9, Math.abs(st.vy) * 0.09);
        puff(st.x, fl + 0.05, st.z, 6, 1.1);
        audio.sfx("land");
        st.vy = 0;
      }
    } else if (fl < st.y - 0.35) {
      st.air = true;
      st.vy = 0;
    } else st.y = damp(st.y, fl, 30, dt);
    st.runT -= dt;
    if (!st.air && spd > 5.5 && st.runT <= 0 && (inside || heightAt(st.x, st.z) > 0.1)) {
      st.runT = 0.09;
      puff(st.x - st.vx * 0.04, st.y + 0.05, st.z - st.vz * 0.04, 1, 0.4);
    }
    hero.root.position.set(st.x, st.y, st.z);
    hero.root.rotation.y = st.yaw;
    animateCharacter(hero, dt, st.air ? 0 : spd, t, st.air);
    // a footstep each time a foot passes the middle of its swing
    const sg = Math.sign(Math.sin(hero.phase));
    if (!st.air && spd > 0.8 && sg !== st.stepSign) audio.step(surfaceAt(st.x, st.z));
    st.stepSign = sg;
    heroBlob.position.set(st.x, fl + 0.05, st.z);
    heroBlob.scale.setScalar(1 - clamp((st.y - fl) * 0.25, 0, 0.5));
    U.uPlayer.value.set(st.x, st.y, st.z);
    lantern.position.set(st.x + 0.4, st.y + 2.2, st.z + 0.6);
  }

  function updateNpcs(dt) {
    for (const n of npcs) {
      const dP = Math.hypot(st.x - n.x, st.z - n.z);
      let want = 0;
      // wave once as you approach (resets after you've wandered off)
      if (!n.waved && dP < 6.5 && dP > 2.6 && n.talkT <= 0) {
        n.waved = true;
        n.waveT = 1.8;
      }
      if (dP > 11) n.waved = false;
      if (n.talkT > 0 || dP < 2.4 || n.waveT > 0) {
        n.talkT -= dt;
        n.waveT -= dt;
        n.yawT = Math.atan2(st.x - n.x, st.z - n.z);
      } else if (n.wait > 0) n.wait -= dt;
      else {
        const [wx, wz] = n.route[n.wp], dx = wx - n.x, dz = wz - n.z, d = Math.hypot(dx, dz);
        if (d < 0.25) {
          n.wp = (n.wp + 1) % n.route.length;
          n.wait = 1.6 + Math.random() * 3.2;
        } else {
          want = 1.55;
          n.yawT = Math.atan2(dx, dz);
        }
      }
      n.speed = damp(n.speed, want, 5, dt);
      n.yaw = dampAngle(n.yaw, n.yawT, 6, dt);
      n.x += Math.sin(n.yaw) * n.speed * dt;
      n.z += Math.cos(n.yaw) * n.speed * dt;
      const y = floorAt(n.x, n.z);
      n.c.root.position.set(n.x, y, n.z);
      n.c.root.rotation.y = n.yaw;
      animateCharacter(n.c, dt, n.speed, t);
      if (n.waveT > 0) {
        n.c.armR.rotation.x = 0;
        n.c.armR.rotation.z = -2.55 + Math.sin(t * 13) * 0.35;
      }
      n.blob.position.set(n.x, y + 0.05, n.z);
    }
  }

  function updateCat(dt) {
    const c = cat;
    c.t -= dt;
    let want = 0, pose = "walk";
    if (c.follow > 0) {
      c.follow -= dt;
      const bx = st.x - Math.sin(st.yaw) * 1.3, bz = st.z - Math.cos(st.yaw) * 1.3, dx = bx - c.x, dz = bz - c.z, d = Math.hypot(dx, dz);
      if (d > 0.5) {
        want = clamp(d * 1.6, 0.8, 7.5);
        c.yawT = Math.atan2(dx, dz);
      } else pose = "sit";
      if (c.follow <= 0) ((c.mode = "sit"), (c.t = 3), (c.tx = CAT.x), (c.tz = CAT.z));
    } else if (c.mode === "walk") {
      const dx = c.tx - c.x, dz = c.tz - c.z, d = Math.hypot(dx, dz);
      if (d < 0.3) {
        c.mode = Math.random() < (env.night > 0.5 ? 0.6 : 0.3) ? "sleep" : "sit";
        c.t = c.mode === "sleep" ? 9 + Math.random() * 8 : 2.5 + Math.random() * 4;
      } else {
        want = d > 4 ? 1.6 : 0.9;
        c.yawT = Math.atan2(dx, dz);
      }
    } else {
      pose = c.mode;
      if (c.t <= 0) {
        c.mode = "walk";
        const a = Math.random() * 6.28, r = Math.random() * CAT.r;
        c.tx = CAT.x + Math.cos(a) * r;
        c.tz = CAT.z + Math.sin(a) * r;
      }
    }
    c.speed = damp(c.speed, want, 6, dt);
    c.yaw = dampAngle(c.yaw, c.yawT, 7, dt);
    const nx = c.x + Math.sin(c.yaw) * c.speed * dt, nz = c.z + Math.cos(c.yaw) * c.speed * dt;
    if (walkable(nx, nz)) ((c.x = nx), (c.z = nz));
    const y = floorAt(c.x, c.z);
    c.root.position.set(c.x, y, c.z);
    c.root.rotation.y = c.yaw;
    animateCat(c, dt, c.speed, t, c.speed < 0.15 ? pose : "walk");
    c.blob.position.set(c.x, y + 0.04, c.z);
    if (pose === "sleep" && Math.random() < dt * 0.6) fx("sparkle", c.x, y + 0.6, c.z, 1);
  }

  function updateOutdoorLife(dt) {
    // ducks paddle a lazy loop, ducklings in a line behind mum
    ducks.forEach((d, i) => {
      const a = t * 0.11 - i * 0.16;
      const x = duckC.x + Math.cos(a) * 3.4, z = duckC.z + Math.sin(a) * 2.2;
      d.root.position.set(x, Math.sin(t * 2 + i) * 0.03 - 0.02, z);
      d.root.rotation.y = Math.atan2(-Math.sin(a) * 3.4, Math.cos(a) * 2.2);
      d.root.rotation.z = Math.sin(t * 2.4 + i) * 0.06;
    });
    quackT -= dt;
    if (quackT <= 0) {
      quackT = 5 + Math.random() * 9;
      if (Math.hypot(st.x - duckC.x, st.z - duckC.z) < 16) audio.sfx("quack");
    }
    // birds circle high, hidden at night
    const showBirds = env.night < 0.55;
    birds.forEach((b) => {
      b.root.visible = showBirds;
      if (!showBirds) return;
      const a = t * (b.flock ? -0.13 : 0.16) + b.flock * 2 + b.i * 0.07, rad = b.flock ? 30 : 22;
      b.root.position.set(Math.cos(a) * rad + Math.sin(b.i * 2.1) * 1.2, 15 + b.flock * 4 + Math.sin(t * 0.8 + b.i) * 0.6 + b.i * 0.35, Math.sin(a) * rad - 4 + Math.cos(b.i * 1.7) * 1.2);
      b.root.rotation.y = a + (b.flock ? Math.PI : 0);
      b.root.rotation.z = b.flock ? -0.25 : 0.25;
      const flap = Math.sin(t * 2.1 + b.phase) > -0.2 ? Math.sin(t * 13 + b.phase) * 0.7 : 0.12;
      b.wings[0].rotation.z = flap;
      b.wings[1].rotation.z = -flap;
    });
    // butterflies: flutter around a patch, then settle on a flower for a while
    const showFlies = env.night < 0.5;
    flies.forEach((f, i) => {
      f.root.visible = showFlies;
      if (!showFlies) return;
      f.t -= dt;
      let tx, ty, tz, flap;
      if (f.mode === "fly") {
        const h = f.home, ph = f.ph;
        tx = h.x + Math.sin(t * 0.55 + ph) * 1.6 + Math.sin(t * 1.7 + ph * 2) * 0.4;
        tz = h.z + Math.cos(t * 0.42 + ph) * 1.6;
        ty = h.y + 0.75 + Math.sin(t * 1.9 + ph) * 0.35;
        flap = Math.sin(t * 20 + i) * 1.05;
        if (f.t <= 0) {
          const near = flowersNear(f.home);
          f.tgt = near.length ? near[Math.floor(Math.random() * near.length)] : null;
          f.mode = f.tgt ? "land" : "fly";
          f.t = 3 + Math.random() * 4;
        }
      } else {
        const g = f.tgt;
        tx = g.x;
        tz = g.z;
        ty = g.y + 0.3 * g.s + 0.07;
        const close = Math.hypot(f.x - tx, f.z - tz) < 0.08;
        flap = close ? 0.25 + Math.abs(Math.sin(t * 2.2 + i)) * 0.9 : Math.sin(t * 20 + i) * 1.05;
        if (f.t <= 0) {
          f.mode = "fly";
          f.t = 5 + Math.random() * 6;
        }
      }
      const k = 1 - Math.exp(-dt * (f.mode === "land" ? 3.5 : 6));
      const px = f.x, pz = f.z;
      f.x += (tx - f.x) * k;
      f.y += (ty - f.y) * k;
      f.z += (tz - f.z) * k;
      f.root.position.set(f.x, f.y, f.z);
      if (Math.hypot(f.x - px, f.z - pz) > 0.002) f.root.rotation.y = Math.atan2(f.x - px, f.z - pz);
      f.wings[0].rotation.z = flap;
      f.wings[1].rotation.z = flap;
    });
    // fish leap out of the shallows now and then
    fish.forEach((F) => {
      if (F.jump) {
        const J = F.jump;
        J.t += dt / 0.95;
        const k = Math.min(J.t, 1), y = Math.sin(k * Math.PI) * 1.05 - 0.15;
        F.g.position.set(J.x + J.dx * (k - 0.5) * 1.8, y, J.z + J.dz * (k - 0.5) * 1.8);
        F.g.rotation.set(-Math.cos(k * Math.PI) * 1.1, Math.atan2(J.dx, J.dz), 0);
        F.g.visible = true;
        if (J.t >= 1) {
          F.jump = null;
          F.g.visible = false;
          F.t = 3 + Math.random() * 6;
          ripple(J.x + J.dx * 0.9, J.z + J.dz * 0.9);
          if (J.near) audio.sfx("fish");
        }
      } else if ((F.t -= dt) <= 0) {
        const near = fishSpots.filter((s) => Math.abs(s.x - st.x) < 26 && Math.abs(s.z - st.z) < 22);
        const s = near.length ? near[Math.floor(Math.random() * near.length)] : fishSpots[Math.floor(Math.random() * fishSpots.length)];
        if (!s) return;
        const a = s.a + Math.PI / 2 + (Math.random() - 0.5);
        F.jump = { t: 0, x: s.x, z: s.z, dx: Math.cos(a), dz: Math.sin(a), near: near.length > 0 };
        ripple(s.x - F.jump.dx * 0.9, s.z - F.jump.dz * 0.9);
        if (F.jump.near) audio.sfx("fish");
      }
    });
    rings.forEach((m) => {
      const L = m.userData.life;
      if (L <= 0) return void (m.visible = false);
      m.visible = true;
      m.userData.life = L - dt * 0.9;
      m.scale.setScalar(0.5 + (1 - L) * 2.2);
      m.material.opacity = L * 0.7;
    });
    // petals
    petalP.forEach((p, i) => {
      if (p.life <= 0) {
        p.delay -= dt;
        if (p.delay <= 0) spawnPetal(p);
        m4.makeScale(0, 0, 0);
      } else if (p.rest > 0) {
        p.rest -= dt;
        if (p.rest <= 0) ((p.life = 0), (p.delay = 1 + Math.random() * 5));
        m4.compose(vv.set(p.x, p.gy + 0.04, p.z), qq.setFromEuler(ee.set(-Math.PI / 2, 0, p.seed)), ss.setScalar(Math.min(1, p.rest)));
      } else {
        p.y -= dt * 0.42;
        p.x += Math.sin(t * 1.3 + p.seed) * dt * 0.45 + dt * 0.18;
        p.z += Math.cos(t * 1.1 + p.seed * 2) * dt * 0.35;
        if (p.y <= p.gy + 0.04) p.rest = 3 + Math.random() * 3;
        m4.compose(vv.set(p.x, p.y, p.z), qq.setFromEuler(ee.set(t * 2 + p.seed, t * 1.3 + p.seed, t * 0.7)), ss.setScalar(1));
      }
      petals.setMatrixAt(i, m4);
    });
    if (PET) petals.instanceMatrix.needsUpdate = true;
    // chimney smoke
    P.smokes.forEach((e, ei) => {
      for (let k = 0; k < SMN; k++) {
        const age = (t * 0.32 + k / SMN) % 1, w = e.world;
        const sc = (0.14 + age * 0.42) * Math.sin(Math.min(1, age * 1.1) * Math.PI) + 0.01;
        m4.compose(vv.set(w.x + age * 2.2 + Math.sin(t * 0.8 + k * 1.7) * 0.25, w.y + age * 3.2, w.z - age * 0.9), qq.identity(), ss.setScalar(sc));
        smoke.setMatrixAt(ei * SMN + k, m4);
      }
    });
    smoke.instanceMatrix.needsUpdate = true;
    // coin arc into the fountain
    if (coinFly) {
      coinFly.t += dt / 0.85;
      const k = Math.min(coinFly.t, 1), fy = P.fountainY + 0.64;
      coin.visible = true;
      coin.position.set(lerp(coinFly.x0, coinFly.x1, k), lerp(coinFly.y0, fy, k) + Math.sin(k * Math.PI) * 2.4, lerp(coinFly.z0, coinFly.z1, k));
      coin.rotation.set(t * 14, 0, t * 9);
      if (coinFly.t >= 1) {
        coin.visible = false;
        P.waterU.uSplash.value.set(coinFly.x1 - FOUNTAIN.x, coinFly.z1 - FOUNTAIN.z, t, 0);
        fx("sparkle", coinFly.x1, fy + 0.2, coinFly.z1, 9);
        audio.sfx("splash");
        st.coins++;
        onToast?.(st.coins === 1 ? "Coin tossed. Wish made." : `Coin tossed. That's ${st.coins} wishes.`);
        emit({ type: "wish" });
        coinFly = null;
      }
    }
  }

  // shared FX that travel with the player (dust, sparkles, confetti, tap marker)
  function updateFx(dt) {
    dustP.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vx *= 0.92;
        p.vz *= 0.92;
        const k = clamp(p.life / p.max, 0, 1), sc = p.s * (0.6 + (1 - k) * 1.6) * Math.min(1, k * 3);
        m4.compose(vv.set(p.x, p.y, p.z), qq.identity(), ss.setScalar(sc));
      } else m4.makeScale(0, 0, 0);
      dust.setMatrixAt(i, m4);
    });
    dust.instanceMatrix.needsUpdate = true;
    for (const s of sprites) {
      const u = s.userData;
      if (!s.visible) continue;
      u.life -= dt;
      if (u.life <= 0) {
        s.visible = false;
        continue;
      }
      s.position.x += u.vx * dt;
      s.position.y += u.vy * dt;
      s.position.z += u.vz * dt;
      u.vy *= u.kind === "heart" ? 0.995 : 0.95;
      const k = u.life / u.max;
      s.material.opacity = Math.min(1, k * 2.2);
      s.scale.setScalar(u.size * (u.kind === "heart" ? 0.7 + Math.sin(u.life * 10) * 0.08 : 0.4 + k * 0.6));
    }
    if (confetti.visible) {
      let alive = 0;
      confP.forEach((p, i) => {
        if (p.life > 0) {
          alive++;
          p.life -= dt;
          p.y = Math.max(p.y - dt * 1.3, floorAt(p.x, p.z) + 0.03);
          p.x += (p.vx + Math.sin(t * 3 + i) * 0.5) * dt;
          p.z += p.vz * dt;
          p.rx += p.spin * dt;
          m4.compose(vv.set(p.x, p.y, p.z), qq.setFromEuler(ee.set(p.rx, p.ry + t, p.rx * 0.5)), ss.setScalar(Math.min(1, p.life)));
        } else m4.makeScale(0, 0, 0);
        confetti.setMatrixAt(i, m4);
      });
      confetti.instanceMatrix.needsUpdate = true;
      if (!alive) confetti.visible = false;
    }
    if (marker.material.opacity > 0) {
      marker.material.opacity = Math.max(0, marker.material.opacity - dt * 1.3);
      marker.scale.setScalar(1 + (0.9 - marker.material.opacity) * 0.6);
      if (!moveTo) marker.material.opacity = Math.max(0, marker.material.opacity - dt * 3);
    }
  }

  function updateStars(dt) {
    const room = inside ? inside.b.kind : "out";
    for (const s of stars) {
      if (s.got || s.room !== room) continue;
      s.m.rotation.y = t * 2.2 + s.i;
      s.g.position.y = s.baseY + Math.sin(t * 2 + s.i) * 0.14;
      if (Math.hypot(st.x - s.x, st.z - s.z) < 1.05 && Math.abs(st.y + 0.9 - s.baseY) < 1.8) {
        s.got = true;
        s.g.parent?.remove(s.g);
        fx("sparkle", s.x, s.baseY, s.z, 14, 1.4);
        audio.sfx("star");
        emit({ type: "star", id: s.id });
      }
    }
    void dt;
  }

  function updateCamera(dt) {
    introT += dt;
    const k = 1 - Math.pow(1 - clamp(introT / 3.2, 0, 1), 3);
    camDist = damp(camDist, camDistT, 6, dt);
    const ahead = inside ? 0.18 : 0.32;
    let tx = st.x + st.vx * ahead, tz = st.z + st.vz * ahead;
    if (inside) {
      // frame the room with a bias towards the gallery wall, drifting gently with the player
      const { W, D } = inside.I;
      tx = clamp(st.x * 0.45, -Math.max(0, W / 2 - 4), Math.max(0, W / 2 - 4));
      tz = lerp(-D * 0.14, st.z, 0.3);
    }
    camT.x = damp(camT.x, tx, 5, dt);
    camT.y = damp(camT.y, inside ? 1.2 : st.y + 0.9, 4, dt);
    camT.z = damp(camT.z, tz, 5, dt);
    const dist = inside ? camDist : lerp(86, camDist, k), pitch = inside ? 0.74 : lerp(1.2, 0.8, k), yaw = inside ? 0 : lerp(-0.75, 0, k);
    camera.position.set(camT.x + Math.sin(yaw) * Math.cos(pitch) * dist, camT.y + Math.sin(pitch) * dist, camT.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(camT);
    U.uCam.value.copy(camera.position);
    sky.dome.position.copy(camera.position);
    sky.stars.position.copy(camera.position);
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const now = performance.now(), dt = Math.min(Math.max(now - last, 0) / 1000, 0.05);
    last = now;
    t += dt;
    U.uTime.value = t;
    updatePlayer(dt);
    if (inside) {
      for (const a of inside.I.anims) a(t, dt, env);
    } else {
      updateNpcs(dt);
      updateCat(dt);
      updateOutdoorLife(dt);
      for (const a of P.anims) a(t, dt, env);
      sky.clouds.rotation.y += dt * 0.004;
    }
    updateFx(dt);
    updateStars(dt);
    updateCamera(dt);
    applyLight(dt);
    if (!inside) placeSun(camT.x, camT.y, camT.z);
    if (!st.paused) {
      const nt = findTarget();
      if ((nt?.id ?? null) !== (current?.id ?? null)) {
        current = nt;
        onPrompt?.(nt ? { id: nt.id, verb: nt.verb, name: nt.name, type: nt.type } : null);
      } else current = nt;
    }
    if (bubble.t > 0) bubble.t -= dt;
    audio.update(dt, { shore: inside ? 0 : smooth(0.62, 0.95, islandT(st.x, st.z)), night: env.night, inside: !!inside, fire: inside ? inside.I.fire : 0, t });
    updateOverlays();
    if ((frameN++ & 3) === 0) drawMinimap();
    if (composer) composer.render(dt);
    else renderer.render(inside ? inside.I.scene : scene, camera);
    if (!ready) {
      ready = true;
      onReady?.({ low: Q.low });
    }
    // adapt quality if the device is struggling: drop post-processing first,
    // then resolution. One fast 150-frame window ends the measuring.
    if (frameN > 40 && degraded < 2 && !document.hidden) {
      perfAcc += dt;
      perfN++;
      if (perfN === 150) {
        if (perfAcc / perfN > 0.026) {
          degraded++;
          composer = null;
          renderer.setPixelRatio(degraded === 1 ? Math.min(Q.dpr, 1.25) : 1);
          resize();
        } else degraded = 2;
        perfAcc = perfN = 0;
      }
    }
  }

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 44 : 36;
    camera.updateProjectionMatrix();
    if (composer) {
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(w, h);
      tilt.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      tilt.uniforms.uAmt.value = 1.7 * renderer.getPixelRatio();
    }
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  addEventListener("keydown", onKeyDown);
  addEventListener("keyup", onKeyUp);
  addEventListener("blur", onBlur);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  if (params.has("debug")) {
    window.__island = {
      st, camera, renderer, scene, env, stars,
      setPos(x, z) {
        st.x = x;
        st.z = z;
        st.y = floorAt(x, z);
        camT.set(x, st.y + 0.9, z);
      },
      setHour: api.setHour,
      zoom(d) {
        camDistT = camDist = d;
      },
      enter: (id) => enterRoom(BUILDINGS.find((b) => b.id === id)),
      exit: () => exitRoom(),
      inside: () => (inside ? inside.b.id : null),
      celebrate: () => api.celebrate(),
      info: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles, geos: renderer.info.memory.geometries, post: !!composer }),
    };
  }

  function dispose() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    removeEventListener("keydown", onKeyDown);
    removeEventListener("keyup", onKeyUp);
    removeEventListener("blur", onBlur);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("wheel", onWheel);
    Object.values(rooms).forEach((I) => I.dispose());
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      const m = o.material;
      (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => x.dispose?.());
    });
    audio.dispose();
    renderer.dispose();
    if (window.__island) delete window.__island;
  }

  frame();
  return api;
}
