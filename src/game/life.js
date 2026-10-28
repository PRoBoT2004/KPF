// ============================================================
// Life in the town: critters, villagers, pickups, ambient FX,
// the real-time day/night light, and tiny synth sound effects.
// Pure canvas + data; PixelWorld owns input and React state.
// ============================================================
import { TILE, POND, pondDepth, buildHeroFrames, drawText, textWidth, makeCanvas } from "./draw";
import { isSolid, LIFE, MAP_W, MAP_H } from "./world";
import {
  buildCat, buildChicken, buildChick, buildDuck, buildDuckling, buildBird,
  buildButterfly, buildFish, buildStar, buildHeart, buildCoin, VILLAGER_LOOKS,
} from "./critters";

// The Nth star found reveals FACTS[N]. Facts only — all from portfolio data.
export const FACTS = [
  "Krishna is 22 and lives in Bharuch, Gujarat.",
  "Shop-ERP is used by 300+ paying merchants, with zero critical downtime in 10+ months.",
  "He co-owns PrimeDigitals and leads UI/UX at UMM Digital.",
  "Touchpe's cashier flow takes under 3 seconds.",
  "Vitran seals every GST invoice with a SHA-256 hash, so nobody can quietly edit one.",
  "He speaks English, Hindi and Gujarati.",
  "B.Tech in Computer Science, Parul University, 2025.",
];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const tileCenter = ([tx, ty]) => ({ x: tx * TILE + 8, y: ty * TILE + 13 });

// ---------------------------------------------------------------- light
// hour (0–24, IST) → n: 0 day … 1 night, warm: golden-hour tint
const KEYS = [[0, 1, 0], [5, 1, 0], [6, 0.35, 0.9], [7.2, 0, 0], [17, 0, 0], [18.2, 0.12, 1], [19.2, 0.7, 0.45], [20.2, 1, 0], [24, 1, 0]];
export function lightFor(h) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [h0, n0, w0] = KEYS[i], [h1, n1, w1] = KEYS[i + 1];
    if (h >= h0 && h <= h1) { const t = (h - h0) / (h1 - h0 || 1); return { n: n0 + (n1 - n0) * t, warm: w0 + (w1 - w0) * t }; }
  }
  return { n: 0, warm: 0 };
}
export function istHour(date = new Date()) {
  const p = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).formatToParts(date);
  const h = +p.find((x) => x.type === "hour").value, m = +p.find((x) => x.type === "minute").value;
  return h + m / 60;
}
export function phaseName(h) {
  if (h >= 5 && h < 7.2) return "Dawn";
  if (h >= 7.2 && h < 17) return "Day";
  if (h >= 17 && h < 19.6) return "Dusk";
  return "Night";
}

// ---------------------------------------------------------------- sound
let actx = null;
export function sfx(kind, on) {
  if (!on || typeof window === "undefined") return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const t = actx.currentTime;
    const tone = (f0, f1, dur, type = "square", vol = 0.04, delay = 0) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t + delay);
      o.frequency.exponentialRampToValueAtTime(f1, t + delay + dur);
      g.gain.setValueAtTime(vol, t + delay);
      g.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
      o.connect(g).connect(actx.destination);
      o.start(t + delay); o.stop(t + delay + dur + 0.03);
    };
    if (kind === "star") { tone(988, 988, 0.08); tone(1319, 1319, 0.08, "square", 0.04, 0.08); tone(1976, 1976, 0.22, "triangle", 0.05, 0.16); }
    else if (kind === "pet") { tone(392, 587, 0.14, "triangle", 0.06); tone(587, 494, 0.16, "triangle", 0.05, 0.13); }
    else if (kind === "talk") { tone(523, 587, 0.05, "square", 0.025); tone(659, 698, 0.05, "square", 0.025, 0.07); }
    else if (kind === "bawk") { tone(950, 520, 0.08, "sawtooth", 0.025); tone(820, 430, 0.11, "sawtooth", 0.025, 0.09); }
    else if (kind === "quack") { tone(320, 210, 0.13, "sawtooth", 0.03); }
    else if (kind === "meow") { tone(700, 1000, 0.09, "triangle", 0.04); tone(1000, 620, 0.18, "triangle", 0.04, 0.09); }
    else if (kind === "coin") { tone(1047, 1047, 0.07); tone(1568, 1568, 0.22, "square", 0.04, 0.07); }
    else if (kind === "splash") { tone(240, 70, 0.28, "triangle", 0.06); }
    else if (kind === "open") { tone(392, 523, 0.07, "triangle", 0.04); tone(523, 659, 0.09, "triangle", 0.04, 0.07); }
    else if (kind === "win") { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, f, 0.18, "square", 0.035, i * 0.11)); }
  } catch { /* audio is optional */ }
}

// ---------------------------------------------------------------- setup
export function createLife(world, progress) {
  const L = {
    actors: [], fx: [], birds: [], butterflies: [], flies: [], clouds: [], stars: [],
    bubbles: [], bubbleCache: new Map(), waterSpots: [], blossoms: [], flowers: [],
    t: 0, light: { n: 0, warm: 0 }, nextBirds: 600, nextFish: 300, sails: 0,
  };
  const S = (L.sprites = {
    cat: buildCat(), chicken: buildChicken(), chick: buildChick(), duck: buildDuck(), duckling: buildDuckling(),
    bird: buildBird(), fish: buildFish(), star: buildStar(), heart: buildHeart(), coin: buildCoin(),
    butterflies: ["#ff9fc4", "#ffd23f", "#9bf0e6", "#ffffff", "#ffb36b"].map(buildButterfly),
    npc: {},
  });
  for (const [id, look] of Object.entries(VILLAGER_LOOKS)) S.npc[id] = buildHeroFrames(look.pal, look.hat);

  const T = world.terrain;
  for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
    if (T[y][x] === "flower") L.flowers.push({ x: x * TILE + 8, y: y * TILE + 8 });
  }
  // glints + drifting wave lines across the pond (sampled inside the shore)
  for (let y = POND.cy - POND.ry; y < POND.cy + POND.ry; y += 5)
    for (let x = POND.cx - POND.rx; x < POND.cx + POND.rx; x += 7) {
      const jx = x + ((y * 13) % 5), d = pondDepth(jx, y);
      if (d < 0.86) L.waterSpots.push({ x: jx, y, ph: (jx * 7 + y * 3) % 37, wave: d < 0.7 && (jx + y) % 3 === 0 });
    }
  L.blossoms = world.objects.filter((o) => o.kind === "tree" && (o.ttype === "blossom" || o.ttype === "fruit"))
    .map((o) => ({ x: o.tx * TILE + 8, y: o.ty * TILE - 14, pink: o.ttype === "blossom" }));

  // Mochi the cat
  const c = LIFE.cat;
  L.actors.push({
    type: "cat", id: "cat", name: c.name, ...tileCenter([c.x, c.y]), face: 1, state: "sit", t: 200,
    area: c.area, speed: 0.5, frame: 0, ft: 0, follow: 0, cool: 0,
  });
  // hens + chicks
  const ch = LIFE.chickens;
  for (let i = 0; i < ch.hens; i++) {
    L.actors.push({
      type: "chicken", id: "hen" + i, x: rand(ch.area[0] + 1, ch.area[2]) * TILE, y: rand(ch.area[1] + 0.5, ch.area[3] + 0.8) * TILE,
      face: Math.random() > 0.5 ? 1 : -1, state: "peck", t: rand(30, 160), area: ch.area, speed: 0.42, frame: 0, ft: 0, hop: 0, cool: 0,
    });
  }
  for (let i = 0; i < ch.chicks; i++) {
    const mom = L.actors.find((a) => a.id === "hen" + i);
    L.actors.push({ type: "chick", id: "chick" + i, x: mom.x - 8, y: mom.y + 3, face: 1, mom, off: rand(-12, -7), frame: 0, ft: 0 });
  }
  // duck family on the pond
  const P = LIFE.pond;
  L.pond = { cx: P.cx * TILE, cy: P.cy * TILE, rx: P.rx * TILE, ry: P.ry * TILE };
  L.actors.push({ type: "duck", id: "duck", th: 0, x: 0, y: 0, face: 1, cool: 0 });
  for (let i = 1; i <= 3; i++) L.actors.push({ type: "duckling", id: "duckling" + i, k: i, th: 0, x: 0, y: 0, face: 1 });
  // villagers
  for (const n of LIFE.npcs) {
    const p0 = tileCenter(n.route[0]);
    L.actors.push({
      type: "npc", id: n.id, name: n.name, lines: n.lines, line: 0, route: n.route.map(tileCenter), wp: 1,
      x: p0.x, y: p0.y, dir: "down", state: "walk", t: 0, frame: 0, ft: 0, blink: rand(60, 240),
    });
  }
  // the wishing fountain is an interactable spot, not an actor
  L.wish = { ...tileCenter([LIFE.wish.x, LIFE.wish.y]), cool: 0 };
  // hidden stars
  L.stars = LIFE.stars.map(([tx, ty], i) => ({ i, x: tx * TILE + 8, y: ty * TILE + 13, got: progress.stars.includes(i), ph: i * 0.9 }));
  // butterflies around flower tiles
  for (let i = 0; i < 9 && L.flowers.length; i++) {
    const f = L.flowers[(i * 7) % L.flowers.length];
    L.butterflies.push({ hx: f.x, hy: f.y, x: f.x, y: f.y, ph: rand(0, 6), sp: rand(0.6, 1.1), kind: i % S.butterflies.length, face: 1 });
  }
  // cloud shadows: soft-edged textures built once at 1/4 art resolution
  for (let i = 0; i < 4; i++) {
    const W = 64, H = 32, o = makeCanvas(W, H);
    for (let k = 0; k < 7; k++) {
      const x = rand(16, W - 16), y = rand(11, H - 11), rr = rand(8, 13);
      const g = o.ctx.createRadialGradient(x, y, 0, x, y, rr);
      g.addColorStop(0, "rgba(28,40,72,0.5)"); g.addColorStop(1, "rgba(28,40,72,0)");
      o.ctx.fillStyle = g; o.ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
    }
    L.clouds.push({ x: rand(0, MAP_W * TILE), y: rand(40, MAP_H * TILE - 40), img: o.cv, v: rand(0.06, 0.11) });
  }
  return L;
}

// ---------------------------------------------------------------- update
const free = (world, x, y) => !isSolid(world.solids, Math.floor(x / TILE), Math.floor((y - 3) / TILE));
function stepTo(a, tx, ty, sp, dt, world, ghost = false) {
  const dx = tx - a.x, dy = ty - a.y, d = Math.hypot(dx, dy);
  if (d < 1.2) return "arrived";
  const vx = (dx / d) * Math.min(sp * dt, d), vy = (dy / d) * Math.min(sp * dt, d);
  let moved = false;
  if (ghost || free(world, a.x + vx, a.y)) { a.x += vx; moved = true; }
  if (ghost || free(world, a.x, a.y + vy)) { a.y += vy; moved = true; }
  if (Math.abs(dx) > 0.4) a.face = dx > 0 ? 1 : -1;
  if (a.type === "npc") a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  return moved ? "moving" : "blocked";
}
function wanderTarget(world, area) {
  for (let i = 0; i < 14; i++) {
    const x = rand(area[0] * TILE + 4, (area[2] + 1) * TILE - 4), y = rand(area[1] * TILE + 8, (area[3] + 1) * TILE - 2);
    if (free(world, x, y)) return { x, y };
  }
  return null;
}
export function say(L, a, text, frames = 90) {
  L.bubbles = L.bubbles.filter((b) => b.a !== a);
  L.bubbles.push({ a, text, t: frames });
}
export function burst(L, kind, x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    if (kind === "heart") L.fx.push({ k: "heart", x: x + rand(-6, 6), y: y + rand(-4, 2), vx: rand(-0.25, 0.25), vy: rand(-0.55, -0.3), life: rand(55, 80), max: 80 });
    else if (kind === "spark") L.fx.push({ k: "spark", x: x + rand(-8, 8), y: y + rand(-8, 4), vx: rand(-0.5, 0.5), vy: rand(-0.9, -0.2), life: rand(25, 45), max: 45, col: pick(["#fff7c2", "#ffd23f", "#ffffff"]) });
    else if (kind === "conf") L.fx.push({ k: "conf", x: x + rand(-4, 4), y: y - 20, vx: rand(-1.6, 1.6), vy: rand(-2.8, -1.2), life: rand(90, 140), max: 140, col: pick(["#ff5d7a", "#ffd23f", "#4fd1c5", "#7bc24f", "#ffffff", "#ff9a3c"]) });
    else if (kind === "drop") L.fx.push({ k: "drop", x: x + rand(-3, 3), y, vx: rand(-0.6, 0.6), vy: rand(-1.4, -0.7), life: 30, max: 30, col: "#cdeeff" });
  }
}
function ring(L, x, y, max = 40, big = 1) { L.fx.push({ k: "ring", x, y, life: max, max, big }); }

export function updateLife(L, s, dt) {
  const world = s.world, p = s.player, reduce = s.reduceMotion;
  L.t += dt;
  L.sails = (L.sails + dt * (reduce ? 0 : 0.06)) % 8;

  for (const a of L.actors) {
    a.cool = Math.max(0, (a.cool || 0) - dt);
    // ---------------- cat
    if (a.type === "cat") {
      const dP = dist(a, p);
      if (a.follow > 0) {
        a.follow -= dt;
        const tx = p.x - (p.dir === "right" ? 14 : p.dir === "left" ? -14 : 0), ty = p.y + (p.dir === "up" ? 12 : p.dir === "down" ? -2 : 1);
        if (Math.hypot(tx - a.x, ty - a.y) > 6) { const r = stepTo(a, tx, ty, Math.max(0.9, Math.min(2, dP / 18)), dt, world, dP > 40); a.state = r === "moving" ? "walk" : "sit"; }
        else { a.state = "sit"; a.face = p.x > a.x ? 1 : -1; }
        if (a.follow <= 0) { a.state = "sit"; a.t = 160; say(L, a, "MEOW", 70); }
      } else if (a.state === "walk") {
        const r = stepTo(a, a.tx, a.ty, a.speed, dt, world);
        if (r !== "moving") { a.state = L.light.n > 0.6 || Math.random() < 0.25 ? "sleep" : "sit"; a.t = a.state === "sleep" ? rand(500, 900) : rand(160, 380); }
      } else {
        a.t -= dt;
        if (a.state === "sleep" && Math.random() < 0.012 * dt) L.fx.push({ k: "z", x: a.x + 4 * a.face, y: a.y - 10, vx: 0.12, vy: -0.22, life: 70, max: 70 });
        if (a.t <= 0) { const tg = wanderTarget(world, a.area); if (tg) { a.tx = tg.x; a.ty = tg.y; a.state = "walk"; } else a.t = 120; }
        if (a.state === "sit" && dP < 40 && a.cool <= 0 && Math.random() < 0.004 * dt) { say(L, a, "MEOW", 60); a.cool = 400; }
      }
      if (a.state === "walk") { a.ft += dt; if (a.ft > 7) { a.ft = 0; a.frame = (a.frame + 1) % 4; } }
    }
    // ---------------- chickens
    else if (a.type === "chicken") {
      a.hop = Math.max(0, a.hop - dt);
      const dP = dist(a, p);
      if (dP < 24 && s.moving && (s.running || dP < 13) && a.state !== "flee") {
        const ang = Math.atan2(a.y - p.y, a.x - p.x) + rand(-0.5, 0.5);
        a.tx = a.x + Math.cos(ang) * 46; a.ty = a.y + Math.sin(ang) * 30; a.state = "flee"; a.hop = 10;
        if (a.cool <= 0) { say(L, a, "BAWK!", 55); a.cool = 160; s.onSfx?.("bawk"); }
      }
      if (a.state === "walk" || a.state === "flee") {
        const r = stepTo(a, a.tx, a.ty, a.state === "flee" ? 1.5 : a.speed, dt, world);
        a.ft += dt; if (a.ft > (a.state === "flee" ? 4 : 8)) { a.ft = 0; a.frame ^= 1; }
        if (r !== "moving") { a.state = "peck"; a.t = rand(60, 200); }
      } else {
        a.t -= dt; a.ft += dt; if (a.ft > 12) { a.ft = 0; a.frame ^= 1; }
        if (a.t <= 0) { const tg = wanderTarget(world, a.area); if (tg) { a.tx = tg.x; a.ty = tg.y; a.state = "walk"; } a.t = 90; }
      }
    }
    // ---------------- chicks trail their hen
    else if (a.type === "chick") {
      const tx = a.mom.x + a.off * a.mom.face, ty = a.mom.y + 3;
      const r = stepTo(a, tx, ty, Math.max(0.5, Math.min(1.7, Math.hypot(tx - a.x, ty - a.y) / 14)), dt, world, true);
      if (r === "moving") { a.ft += dt; if (a.ft > 5) { a.ft = 0; a.frame ^= 1; } }
    }
    // ---------------- duck family circles the pond
    else if (a.type === "duck" || a.type === "duckling") {
      const P = L.pond, sp = reduce ? 0.0015 : 0.0034;
      if (a.type === "duck") a.th = (L.t * sp) % (Math.PI * 2);
      else a.th = (L.t * sp - a.k * 0.42) % (Math.PI * 2);
      const nx = P.cx + Math.cos(a.th) * P.rx * (a.type === "duck" ? 1 : 0.94);
      const ny = P.cy + Math.sin(a.th) * P.ry + Math.sin(L.t * 0.05 + (a.k || 0)) * 0.6;
      if (Math.abs(nx - a.x) > 0.01) a.face = nx > a.x ? 1 : -1;
      a.x = nx; a.y = ny;
      if (a.type === "duck" && !reduce && Math.floor(L.t) % 70 === 0) ring(L, a.x - 6 * a.face, a.y - 1, 34, 0.7);
    }
    // ---------------- villagers
    else if (a.type === "npc") {
      a.blink -= dt; if (a.blink < -7) a.blink = rand(120, 260);
      const near = dist(a, p) < 30;
      if (near) {
        a.state = "attend"; a.frame = 0;
        const dx = p.x - a.x, dy = p.y - a.y;
        a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
      } else if (a.state === "attend") { a.state = "wait"; a.t = 40; }
      else if (a.state === "wait") { a.t -= dt; a.frame = 0; if (a.t <= 0) { a.wp = (a.wp + 1) % a.route.length; a.state = "walk"; } }
      else {
        const tg = a.route[a.wp];
        const r = stepTo(a, tg.x, tg.y, 0.55, dt, world);
        a.ft += dt; if (a.ft > 8) { a.ft = 0; a.frame = (a.frame + 1) % 4; }
        if (r !== "moving") { a.state = "wait"; a.t = rand(90, 220); a.dir = "down"; }
      }
    }
  }

  // stars: pick up by walking over them
  for (const st of L.stars) {
    if (st.got) continue;
    if (!reduce && Math.random() < 0.03 * dt) L.fx.push({ k: "spark", x: st.x + rand(-7, 7), y: st.y - 8 + rand(-7, 5), vx: 0, vy: -0.15, life: 26, max: 26, col: "#fff7c2" });
    if (Math.abs(st.x - p.x) < 10 && Math.abs(st.y - p.y) < 10) { st.got = true; s.onStar?.(st); burst(L, "spark", st.x, st.y - 6, 18); }
  }

  // footstep dust
  if (s.moving && !reduce) { L.dust = (L.dust || 0) + dt; if (L.dust > (s.running ? 6 : 10)) { L.dust = 0; L.fx.push({ k: "dust", x: p.x + rand(-3, 3), y: p.y - 1, vx: rand(-0.15, 0.15), vy: -0.08, life: 26, max: 26 }); } }

  if (!reduce) {
    // butterflies (day) / fireflies (night)
    for (const b of L.butterflies) {
      b.ph += 0.012 * b.sp * dt;
      const nx = b.hx + Math.sin(b.ph * 1.3) * 22 + Math.sin(b.ph * 3.1) * 5, ny = b.hy + Math.cos(b.ph) * 12 - 10;
      if (Math.abs(nx - b.x) > 0.02) b.face = nx > b.x ? 1 : -1;
      b.x = nx; b.y = ny;
    }
    const wantFlies = L.light.n > 0.35 ? 26 : 0;
    while (L.flies.length < wantFlies) {
      const src = Math.random() < 0.5 && L.blossoms.length ? pick(L.blossoms) : pick(L.flowers.length ? L.flowers : [{ x: p.x, y: p.y }]);
      L.flies.push({ x: src.x + rand(-30, 30), y: src.y + rand(-20, 20), vx: 0, vy: 0, ph: rand(0, 6) });
    }
    if (L.flies.length > wantFlies) L.flies.length = wantFlies;
    for (const f of L.flies) {
      f.ph += 0.03 * dt; f.vx += rand(-0.02, 0.02); f.vy += rand(-0.02, 0.02);
      f.vx *= 0.97; f.vy *= 0.97; f.x += f.vx * dt; f.y += f.vy * dt;
    }
    // clouds drift east
    for (const c of L.clouds) { c.x += c.v * dt; if (c.x > MAP_W * TILE + 120) { c.x = -120; c.y = rand(40, MAP_H * TILE - 40); } }
    // birds cross the sky now and then (daytime)
    L.nextBirds -= dt;
    if (L.nextBirds <= 0 && L.light.n < 0.5) {
      L.nextBirds = rand(900, 1700);
      const vw = s.view.w / s.scale, vh = s.view.h / s.scale, ltr = Math.random() > 0.5;
      const y0 = s.cam.y + rand(0.15, 0.6) * vh;
      L.birds.push({ x: ltr ? s.cam.x - 30 : s.cam.x + vw + 30, y: y0, vx: ltr ? 0.9 : -0.9, vy: rand(-0.12, 0.12), n: 3 + Math.floor(rand(0, 3)), t: 0 });
    }
    for (const b of L.birds) { b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt; }
    L.birds = L.birds.filter((b) => b.t < 1400);
    // fish jump in the pond
    L.nextFish -= dt;
    if (L.nextFish <= 0) {
      L.nextFish = rand(260, 560);
      const P = L.pond, ang = rand(0, Math.PI * 2);
      const fx = P.cx + Math.cos(ang) * P.rx * 0.5, fy = P.cy + Math.sin(ang) * P.ry * 0.5;
      L.fx.push({ k: "fish", x: fx, y: fy, dir: Math.random() > 0.5 ? 1 : -1, life: 46, max: 46 });
      ring(L, fx, fy, 36);
    }
    // petals drift down from blossom trees
    for (const bl of L.blossoms) {
      if (!bl.pink) continue;
      if (Math.abs(bl.x - p.x) > 260 || Math.abs(bl.y - p.y) > 200) continue;
      if (Math.random() < 0.012 * dt) L.fx.push({ k: "petal", x: bl.x + rand(-12, 12), y: bl.y + rand(-8, 6), vx: rand(0.05, 0.2), vy: rand(0.12, 0.22), life: rand(140, 220), max: 220, ph: rand(0, 6) });
    }
  }

  // particles
  for (let i = L.fx.length - 1; i >= 0; i--) {
    const f = L.fx[i];
    f.life -= dt;
    if (f.k === "conf") { f.vy += 0.06 * dt; f.vx *= 0.99; }
    if (f.k === "drop") f.vy += 0.08 * dt;
    if (f.k === "coin") { f.vy += 0.09 * dt; if (f.life <= 0) { ring(L, f.x, f.y, 40, 1); burst(L, "drop", f.x, f.y, 6); burst(L, "spark", f.x, f.y - 4, 10); } }
    if (f.k === "petal") f.x += Math.sin(L.t * 0.04 + f.ph) * 0.15 * dt;
    if (f.vx != null) f.x += f.vx * dt;
    if (f.vy != null) f.y += f.vy * dt;
    if (f.life <= 0) L.fx.splice(i, 1);
  }
  if (L.fx.length > 260) L.fx.splice(0, L.fx.length - 260);
  for (let i = L.bubbles.length - 1; i >= 0; i--) { L.bubbles[i].t -= dt; if (L.bubbles[i].t <= 0) L.bubbles.splice(i, 1); }
}

// ---------------------------------------------------------------- interaction
const RADIUS = { cat: 20, chicken: 18, duck: 40, npc: 24 };
export function nearestActor(L, p) {
  let best = null, bd = Infinity;
  for (const a of L.actors) {
    const r = RADIUS[a.type]; if (!r) continue;
    if (a.type === "cat" && a.follow > 0) continue; // already your buddy — don't block villagers
    const d = dist(a, p);
    if (d < r && d < bd) { best = a; bd = d; }
  }
  if (L.wish && dist(L.wish, p) < 22 && dist(L.wish, p) < bd) return { type: "wish", id: "wish" };
  return best;
}
export function actorLabel(a) {
  if (!a) return "";
  if (a.type === "cat") return `Pet ${a.name}`;
  if (a.type === "chicken") return "Say hi to the hen";
  if (a.type === "duck") return "Quack at the ducks";
  if (a.type === "npc") return `Talk to ${a.name}`;
  if (a.type === "wish") return "Toss a coin";
  return "";
}
export function tossCoin(L, from) {
  L.fx.push({ k: "coin", x: from.x, y: from.y - 14, vx: (L.wish.x - from.x) / 40, vy: -2.1, life: 40, max: 40 });
}

// ---------------------------------------------------------------- render helpers
function bubbleCanvas(L, text) {
  if (L.bubbleCache.has(text)) return L.bubbleCache.get(text);
  const tw = textWidth(text), w = tw + 7, h = 11;
  const o = makeCanvas(w, h + 3); const c = o.ctx;
  c.fillStyle = "#2a2230"; c.fillRect(1, 0, w - 2, h); c.fillRect(0, 1, w, h - 2);
  c.fillStyle = "#fffaf0"; c.fillRect(1, 1, w - 2, h - 2);
  c.fillStyle = "#2a2230"; c.fillRect(Math.floor(w / 2) - 1, h, 3, 1); c.fillRect(Math.floor(w / 2), h + 1, 1, 1);
  c.fillStyle = "#fffaf0"; c.fillRect(Math.floor(w / 2) - 1, h - 1, 2, 1);
  drawText(c, text, 4, 3, "#2a2230");
  L.bubbleCache.set(text, o.cv);
  return o.cv;
}

/** Ground layer — drawn right after the terrain blit (before objects). */
export function drawGround(ctx, L, s) {
  const { scale, cam } = s;
  // water: slow drifting wave lines + quick glints
  for (const w of L.waterSpots) {
    if (w.wave) {
      const a = 0.5 + 0.5 * Math.sin(L.t * 0.02 + w.ph);
      const dx = Math.sin(L.t * 0.012 + w.ph) * 2;
      ctx.fillStyle = `rgba(190,232,252,${0.18 + a * 0.3})`;
      ctx.fillRect(Math.floor((w.x + dx - cam.x) * scale), Math.floor((w.y - cam.y) * scale), Math.round(3 + a * 2) * scale, scale);
      continue;
    }
    const a = Math.sin(L.t * 0.045 + w.ph);
    if (a < 0.86) continue;
    ctx.fillStyle = `rgba(255,255,255,${(a - 0.86) * 6})`;
    ctx.fillRect(Math.floor((w.x - cam.x) * scale), Math.floor((w.y - cam.y) * scale), 2 * scale, scale);
  }
  // ripples
  for (const f of L.fx) {
    if (f.k !== "ring") continue;
    const k = 1 - f.life / f.max, rr = (3 + k * 11) * f.big;
    ctx.strokeStyle = `rgba(230,248,255,${0.75 * (1 - k)})`; ctx.lineWidth = Math.max(1, scale * 0.6);
    ctx.beginPath(); ctx.ellipse((f.x - cam.x) * scale, (f.y - cam.y) * scale, rr * scale, rr * 0.45 * scale, 0, 0, 7); ctx.stroke();
  }
}

/** One depth-sorted actor (called from the engine's sorted draw list). */
export function drawActor(ctx, L, s, a) {
  const { scale, cam } = s, S = L.sprites;
  const at = (img, ox, oy) => ctx.drawImage(img, Math.floor((a.x - cam.x - ox) * scale), Math.floor((a.y - cam.y - oy) * scale), img.width * scale, img.height * scale);
  const shadow = (rw) => {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse((a.x - cam.x) * scale, (a.y - 1 - cam.y) * scale, rw * scale, 1.8 * scale, 0, 0, 7); ctx.fill();
  };
  const side = a.face > 0 ? "r" : "l";
  if (a.type === "cat") {
    shadow(6);
    const set = a.state === "walk" ? S.cat.walk[a.frame] : a.state === "sleep" ? S.cat.sleep : S.cat.sit;
    at(set[side], 8, set[side].height);
  } else if (a.type === "chicken") {
    shadow(4.5);
    const set = a.state === "peck" && a.frame ? S.chicken.peck : S.chicken.walk[a.frame];
    const hop = a.hop > 0 ? Math.round(Math.sin((a.hop / 10) * Math.PI) * 3) : 0;
    at(set[side], 6, 13 + hop);
  } else if (a.type === "chick") {
    shadow(3); at(S.chick.walk[a.frame][side], 3, 6);
  } else if (a.type === "duck" || a.type === "duckling") {
    const spr = (a.type === "duck" ? S.duck : S.duckling).swim[side];
    ctx.fillStyle = "rgba(205,238,255,0.55)";
    ctx.fillRect(Math.floor((a.x - cam.x - spr.width / 2) * scale), Math.floor((a.y - cam.y) * scale), spr.width * scale, scale);
    at(spr, spr.width / 2, spr.height - 1);
  } else if (a.type === "npc") {
    shadow(5.5);
    const fr = S.npc[a.id];
    const img = a.state !== "walk" && a.dir === "down" && a.blink < 0 ? fr.blink : fr[a.dir][a.state === "walk" ? a.frame : 0];
    const bob = a.state === "walk" && a.frame % 2 ? 1 : 0;
    at(img, 8, 24 + bob);
  }
}

export function drawStar(ctx, L, s, st) {
  const { scale, cam } = s, img = L.sprites.star;
  const bob = s.reduceMotion ? 0 : Math.round(Math.sin(L.t * 0.07 + st.ph) * 2);
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.beginPath(); ctx.ellipse((st.x - cam.x) * scale, (st.y - 1 - cam.y) * scale, (4 - bob * 0.4) * scale, 1.4 * scale, 0, 0, 7); ctx.fill();
  ctx.drawImage(img, Math.floor((st.x - cam.x - 5.5) * scale), Math.floor((st.y - cam.y - 14 + bob) * scale), img.width * scale, img.height * scale);
}

/** Things in the air + cloud shadows — after objects, before the light tint. */
export function drawAir(ctx, L, s) {
  const { scale, cam, view } = s, day = 1 - L.light.n;
  // cloud shadows
  if (day > 0.05 && !s.reduceMotion) {
    ctx.globalAlpha = 0.16 * day;
    for (const c of L.clouds) ctx.drawImage(c.img, Math.floor((c.x - 128 - cam.x) * scale), Math.floor((c.y - 64 - cam.y) * scale), 256 * scale, 128 * scale);
    ctx.globalAlpha = 1;
  }
  // particles (non-ring)
  for (const f of L.fx) {
    const x = (f.x - cam.x) * scale, y = (f.y - cam.y) * scale, k = f.life / f.max;
    if (x < -40 || y < -40 || x > view.w + 40 || y > view.h + 40) continue;
    if (f.k === "dust") { ctx.fillStyle = `rgba(214,196,160,${0.55 * k})`; const sz = (2 + (1 - k) * 2) * scale; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz); }
    else if (f.k === "petal") { ctx.fillStyle = `rgba(255,180,205,${Math.min(1, k * 2)})`; ctx.fillRect(Math.floor(x), Math.floor(y), 2 * scale, scale); }
    else if (f.k === "fish") {
      const t = 1 - k, h = Math.sin(t * Math.PI) * 9;
      ctx.drawImage(L.sprites.fish, Math.floor(x + (t - 0.5) * 10 * f.dir * scale - 3 * scale), Math.floor(y - h * scale - 3 * scale), 6 * scale, 5 * scale);
    } else if (f.k === "coin") {
      ctx.drawImage(L.sprites.coin, Math.floor(x - 2.5 * scale), Math.floor(y - 2.5 * scale), 5 * scale, 5 * scale);
    } else if (f.k === "drop") { ctx.fillStyle = f.col; ctx.fillRect(Math.floor(x), Math.floor(y), scale, scale); }
  }
  // butterflies
  if (day > 0.3) for (const b of L.butterflies) {
    const fr = L.sprites.butterflies[b.kind][Math.floor(L.t / 7 + b.ph * 3) & 1];
    ctx.drawImage(fr, Math.floor((b.x - cam.x) * scale), Math.floor((b.y - cam.y) * scale), fr.width * scale, fr.height * scale);
  }
  // birds + their shadows
  for (const b of L.birds) {
    const fr = L.sprites.bird[Math.floor(b.t / 9) & 1];
    for (let i = 0; i < b.n; i++) {
      const ox = -Math.sign(b.vx) * i * 9, oy = (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 7;
      const bx = (b.x + ox - cam.x) * scale, by = (b.y + oy - cam.y) * scale;
      ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(bx + 4 * scale, by + 46 * scale, 5 * scale, 2 * scale);
      ctx.drawImage(fr, Math.floor(bx), Math.floor(by), fr.width * scale, fr.height * scale);
    }
  }
}

/** Multiply tint for dusk / night. */
export function drawTint(ctx, L, s) {
  const { n, warm } = L.light;
  if (n < 0.01 && warm < 0.01) return;
  const night = [58, 72, 138], gold = [255, 196, 150];
  const c = [0, 1, 2].map((i) => {
    const a = 255 + (night[i] - 255) * n;
    const b = 255 + (gold[i] - 255) * warm * 0.75;
    return Math.round((a * b) / 255);
  });
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
  ctx.fillRect(0, 0, s.view.w, s.view.h);
  ctx.restore();
}

/** Additive lights (lamps, windows, hero lantern, fireflies) — after the tint. */
export function drawLights(ctx, L, s, glows) {
  const { scale, cam } = s, n = L.light.n;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const g of glows) {
    if (g.night && n < 0.2) continue;
    const flick = s.reduceMotion ? 0.5 : 0.42 + 0.12 * Math.sin(L.t * 0.1 + g.x);
    const a = flick * (0.45 + n * 0.9), rr = g.r * scale * (1 + n * 1.5);
    const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, rr);
    grad.addColorStop(0, `rgba(${g.col},${Math.min(0.85, a)})`);
    grad.addColorStop(1, `rgba(${g.col},0)`);
    ctx.fillStyle = grad; ctx.fillRect(g.x - rr, g.y - rr, rr * 2, rr * 2);
  }
  if (n > 0.2) {
    // a warm lantern glow around the player so you never lose yourself
    const p = s.player, x = (p.x - cam.x) * scale, y = (p.y - 10 - cam.y) * scale, rr = 52 * scale;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rr);
    grad.addColorStop(0, `rgba(255,214,160,${0.28 * n})`); grad.addColorStop(1, "rgba(255,214,160,0)");
    ctx.fillStyle = grad; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
    for (const f of L.flies) {
      const on = 0.5 + 0.5 * Math.sin(f.ph);
      if (on < 0.25) continue;
      const fx = (f.x - cam.x) * scale, fy = (f.y - cam.y) * scale, fr = 6 * scale;
      const gg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
      gg.addColorStop(0, `rgba(210,255,140,${0.75 * on * n})`); gg.addColorStop(1, "rgba(210,255,140,0)");
      ctx.fillStyle = gg; ctx.fillRect(fx - fr, fy - fr, fr * 2, fr * 2);
      ctx.fillStyle = `rgba(240,255,200,${on * n})`; ctx.fillRect(Math.floor(fx), Math.floor(fy), scale, scale);
    }
  }
  ctx.restore();
}

/** Hearts, sparkles, zzz, confetti and speech bubbles — on top, untinted. */
export function drawOverlay(ctx, L, s) {
  const { scale, cam } = s;
  for (const f of L.fx) {
    const x = (f.x - cam.x) * scale, y = (f.y - cam.y) * scale, k = f.life / f.max;
    if (f.k === "heart") { ctx.globalAlpha = Math.min(1, k * 1.6); ctx.drawImage(L.sprites.heart, Math.floor(x), Math.floor(y), 7 * scale, 6 * scale); ctx.globalAlpha = 1; }
    else if (f.k === "spark") { ctx.fillStyle = f.col; ctx.globalAlpha = k; const sz = scale * (k > 0.5 ? 2 : 1); ctx.fillRect(Math.floor(x), Math.floor(y), sz, sz); ctx.globalAlpha = 1; }
    else if (f.k === "conf") { ctx.fillStyle = f.col; ctx.globalAlpha = Math.min(1, k * 2); ctx.fillRect(Math.floor(x), Math.floor(y), 2 * scale, scale * (1 + (Math.floor(f.life / 6) % 2))); ctx.globalAlpha = 1; }
    else if (f.k === "z") { ctx.globalAlpha = Math.min(1, k * 1.5); const img = bubbleText(L, "Z"); ctx.drawImage(img, Math.floor(x), Math.floor(y), img.width * scale * 0.8, img.height * scale * 0.8); ctx.globalAlpha = 1; }
  }
  for (const b of L.bubbles) {
    const img = bubbleCanvas(L, b.text), a = b.a;
    const top = a.type === "npc" ? 30 : a.type === "duck" ? 12 : 16;
    const pop = Math.min(1, (90 - Math.min(90, b.t)) / 6 + 0.6);
    const w = img.width * scale * Math.min(1, pop), h = img.height * scale * Math.min(1, pop);
    ctx.drawImage(img, Math.floor((a.x - cam.x) * scale - w / 2), Math.floor((a.y - top - cam.y) * scale - h), w, h);
  }
}
function bubbleText(L, ch) {
  const key = "txt:" + ch;
  if (L.bubbleCache.has(key)) return L.bubbleCache.get(key);
  const o = makeCanvas(textWidth(ch) + 2, 7);
  drawText(o.ctx, ch, 1, 1, "#ffffff", { shadow: "#2a2230" });
  L.bubbleCache.set(key, o.cv);
  return o.cv;
}

/** Soft corner vignette — frames the scene like a lens (cached per size). */
let vig = null;
export function drawVignette(ctx, s) {
  const { w, h } = s.view;
  if (!vig || vig.w !== w || vig.h !== h) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.62);
    g.addColorStop(0, "rgba(16,30,22,0)");
    g.addColorStop(1, "rgba(16,30,22,0.22)");
    vig = { w, h, g };
  }
  ctx.fillStyle = vig.g;
  ctx.fillRect(0, 0, w, h);
}
