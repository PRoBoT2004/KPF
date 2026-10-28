"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  TILE, buildTile, buildHeroFrames, buildTree, buildSignpost, BUILD_BY_KIND,
  buildBush, buildLamp, buildAnvil, buildEasel, buildGear, buildBarrel,
  buildCrate, buildFlowerbox, buildBench, buildWell, buildNoticeBoard, buildFountain,
  buildWindmill, buildWindmillSails, buildCoop, buildScarecrow, buildMushrooms,
  buildRock, buildBasket, buildSunflower, buildHay, outlineSprite,
} from "@/game/draw";
import { makeWorld, isSolid, MAP_W, MAP_H } from "@/game/world";
import {
  createLife, updateLife, nearestActor, actorLabel, say, burst, tossCoin, sfx,
  drawGround, drawActor, drawStar, drawAir, drawTint, drawLights, drawOverlay,
  drawVignette, lightFor, istHour, phaseName, FACTS,
} from "@/game/life";
import GameDialog from "@/components/game/GameDialog";
import TouchControls from "@/components/game/TouchControls";

const SPEED = 1.85;     // art-px per frame @60fps
const RUN = 1.6;        // Shift multiplier

const PROP_BUILDERS = {
  bush: buildBush, lamp: buildLamp, anvil: buildAnvil, easel: buildEasel,
  gear: buildGear, barrel: buildBarrel, crate: buildCrate, flowerbox: buildFlowerbox,
  bench: buildBench, well: buildWell, board: buildNoticeBoard, fountain: buildFountain,
  windmill: buildWindmill, coop: buildCoop, scarecrow: buildScarecrow, mushrooms: buildMushrooms,
  rock: buildRock, basket: buildBasket, sunflower: buildSunflower, hay: buildHay,
};
const SHADOWED = new Set(["tree", "well", "signpost", "board", "fountain", "windmill", "coop", "hay"]);

const ZONE_LABEL = {
  welcome: "Town Square", designer: "Designer's Studio", engineer: "Engineer's Workshop",
  builder: "Builder's Forge", projects: "Quest Hall", inn: "The Inn", portal: "The Portal",
};
const PLACES = ["designer", "engineer", "builder", "projects", "inn", "portal"];
const QUESTS = [
  { id: "visit", label: "Visit all 6 places", total: 6, get: (p) => p.visited.length },
  { id: "stars", label: "Find the 7 hidden stars", total: 7, get: (p) => p.stars.length },
  { id: "talk", label: "Chat with 4 villagers", total: 4, get: (p) => p.talked.length },
  { id: "pet", label: "Pet Mochi the cat", total: 1, get: (p) => (p.pet ? 1 : 0) },
  { id: "wish", label: "Make a wish at the fountain", total: 1, get: (p) => (p.wish ? 1 : 0) },
];
const EMPTY = { visited: [], stars: [], talked: [], pet: false, wish: false, done: false };
const STORE = "kw.progress.v1";
const loadProgress = () => {
  try { const v = JSON.parse(localStorage.getItem(STORE) || "null"); return v ? { ...EMPTY, ...v } : { ...EMPTY }; }
  catch { return { ...EMPTY }; }
};
const saveProgress = (p) => { try { localStorage.setItem(STORE, JSON.stringify(p)); } catch { /* private mode */ } };
const questsDone = (p) => QUESTS.filter((q) => q.get(p) >= q.total).length;

// turn any object into { cv, glow?, smoke?, blink?, hub? }
function spriteFor(o) {
  if (o.kind === "tree") return { cv: buildTree(o.ttype) };
  if (o.kind === "signpost") return { cv: buildSignpost(o.dirs) };
  if (BUILD_BY_KIND[o.kind]) return BUILD_BY_KIND[o.kind]();
  const b = PROP_BUILDERS[o.kind];
  if (!b) return { cv: null };
  const res = b();
  return res.cv ? res : { cv: res };
}

// ---- tiny pixel icons (svg, crisp) ----
const Px = ({ d, size = 14, color = "currentColor" }) => (
  <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden fill={color}>
    {d.map(([x, y, w = 1, h = 1], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
  </svg>
);
const SUN = [[3, 0, 2], [3, 7, 2], [0, 3, 1, 2], [7, 3, 1, 2], [1, 1], [6, 1], [1, 6], [6, 6], [2, 2, 4, 4]];
const MOON = [[3, 0, 3], [2, 1, 2], [1, 2, 2, 4], [2, 6, 2], [3, 7, 3], [4, 5, 3, 1]];
const STAR = [[3, 0, 2, 2], [0, 2, 8, 2], [1, 4, 6, 1], [2, 5, 4, 1], [1, 6, 2, 2], [5, 6, 2, 2]];
const SPK_ON = [[0, 3, 2, 2], [2, 2, 1, 4], [3, 1, 1, 6], [5, 2, 1, 1], [5, 5, 1, 1], [6, 1, 1, 1], [6, 6, 1, 1], [6, 3, 1, 2]];
const SPK_OFF = [[0, 3, 2, 2], [2, 2, 1, 4], [3, 1, 1, 6], [5, 2, 1, 1], [6, 3, 1, 1], [7, 4, 1, 1], [5, 5, 1, 1], [7, 2, 1, 1], [6, 5, 1, 1], [7, 6, 1, 1]];
const TICK = [[1, 4, 1, 1], [2, 5, 1, 1], [3, 4, 1, 1], [4, 3, 1, 1], [5, 2, 1, 1], [6, 1, 1, 1]];

const pillStyle = { background: "rgba(255,248,234,0.94)", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(42,34,48,0.55)" };

export default function PixelWorld() {
  const canvasRef = useRef(null);
  const promptRef = useRef(null);
  const speechRef = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [progress, setProgress] = useState(EMPTY);
  const [questsOpen, setQuestsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [speech, setSpeech] = useState(null);
  const [sound, setSound] = useState(false);
  const [mode, setMode] = useState("auto");        // auto (live IST) | day | night
  const [clock, setClock] = useState({ time: "--:--", phase: "Day" });

  const g = useRef({
    world: null, hero: null, player: null, life: null,
    cam: { x: 0, y: 0 }, scale: 3, view: { w: 0, h: 0 },
    keys: new Set(), touch: new Set(),
    moveTarget: null, pendingZone: null, pendingActor: null, target: null,
    paused: false, frameT: 0, animFrame: 0, moving: false, running: false,
    drawObjects: [], smokeEmitters: [], smoke: [], now: 0, reduceMotion: false,
    progress: EMPTY, sound: false, hour: 12,
  });

  useEffect(() => { g.current.paused = dialog !== null; }, [dialog]);
  useEffect(() => { g.current.sound = sound; try { localStorage.setItem("kw.sound", sound ? "1" : "0"); } catch { /* private mode */ } }, [sound]);

  // ---- progress: one place that saves, toasts and celebrates ----
  const toastTimer = useRef(null);
  const showToast = useCallback((t) => {
    setToast({ ...t, key: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), t.long ? 10000 : 6500);
  }, []);
  const commit = useCallback((mut) => {
    const s = g.current;
    const next = mut({ ...s.progress, visited: [...s.progress.visited], stars: [...s.progress.stars], talked: [...s.progress.talked] });
    if (!next) return;
    if (!next.done && questsDone(next) === QUESTS.length) {
      next.done = true;
      if (s.life) burst(s.life, "conf", s.player.x, s.player.y, 90);
      sfx("win", s.sound);
      setTimeout(() => showToast({
        icon: "trophy", long: true, title: "Quest log complete!",
        body: "You've seen the whole town. Krishna would love to hear from you.",
        link: { href: "mailto:krishna200428@gmail.com", label: "Email Krishna" },
      }), 1400);
    }
    s.progress = next; setProgress(next); saveProgress(next);
  }, [showToast]);

  // ---- light: live Bharuch time, or forced day / night ----
  useEffect(() => {
    const s = g.current;
    const q = parseFloat(new URLSearchParams(window.location.search).get("hour"));
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => {
      const h = mode === "day" ? 12 : mode === "night" ? 22 : !Number.isNaN(q) ? q : istHour();
      s.hour = h;
      if (s.life) s.life.light = lightFor(h);
      setClock({ time: fmt.format(new Date()), phase: phaseName(h) });
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [mode]);

  useEffect(() => {
    const s = g.current;
    setIsTouch(!!window.matchMedia?.("(pointer: coarse)").matches);
    s.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
    try { if (localStorage.getItem("kw.sound") === "1") setSound(true); } catch { /* private mode */ }
    if (window.innerWidth >= 900) setQuestsOpen(true);
    s.progress = loadProgress(); setProgress(s.progress);
    s.world = makeWorld();
    if (process.env.NODE_ENV !== "production") window.__kw = s; // dev-only handle for screenshots

    s.player = {
      x: s.world.spawn.x * TILE + TILE / 2,
      y: s.world.spawn.y * TILE + TILE - 2,
      dir: "up",
    };

    // ---- bake terrain to one big canvas (code-drawn) ----
    // Baked in ~12ms slices, rows nearest the spawn first, so the main thread
    // never blocks for long on slow phones.
    const big = document.createElement("canvas");
    big.width = MAP_W * TILE; big.height = MAP_H * TILE;
    const bctx = big.getContext("2d");
    bctx.imageSmoothingEnabled = false;
    s.big = big;
    const rowOrder = Array.from({ length: MAP_H }, (_, y) => y)
      .sort((a, b) => Math.abs(a - s.world.spawn.y) - Math.abs(b - s.world.spawn.y));
    let bakeI = 0;
    const bakeChunk = () => {
      const t0 = performance.now();
      while (bakeI < rowOrder.length && performance.now() - t0 < 12) {
        const y = rowOrder[bakeI++];
        const T = s.world.terrain;
        for (let x = 0; x < MAP_W; x++)
          bctx.drawImage(buildTile(T[y][x], x, y, (dx, dy) => T[y + dy]?.[x + dx] ?? "hedge"), x * TILE, y * TILE);
      }
      if (bakeI < rowOrder.length) s.bakeTimer = setTimeout(bakeChunk, 0);
    };
    bakeChunk();

    // ---- build every object's sprite (cached canvases) ----
    s.drawObjects = [];
    s.smokeEmitters = [];
    for (const o of s.world.objects) {
      const spr = spriteFor(o);
      if (!spr.cv) continue;
      // everything but trees (which carry their own leafy outline) gets a crisp 1px outline
      const pad = o.kind === "tree" ? 0 : 1;
      const img = pad ? outlineSprite(spr.cv) : spr.cv;
      const at = (p) => p && { ...p, x: p.x + pad, y: p.y + pad };
      const w = (o.w || 1) * TILE, base = (o.ty + (o.h || 1)) * TILE;
      const ox = o.tx * TILE + (w - img.width) / 2;         // centre sprite on footprint
      const sy = base - img.height + pad;                   // top of sprite (world px)
      s.drawObjects.push({ o, img, ox, sy, base, glow: spr.glow ? spr.glow.map(at) : null, blink: at(spr.blink) || null, sway: o.sway, hub: at(spr.hub) || null });
      if (spr.smoke) s.smokeEmitters.push({ x: ox + spr.smoke.x + pad, y: sy + spr.smoke.y + pad, t: 0 });
    }
    s.sails = buildWindmillSails(8).map((cv) => outlineSprite(cv, false));

    // ---- hero + town life ----
    s.hero = buildHeroFrames();
    s.heroW = 16; s.heroH = 24;
    s.life = createLife(s.world, s.progress);
    s.life.light = lightFor(s.hour);
    s.onSfx = (k) => sfx(k, s.sound);
    s.onStar = (st) => {
      sfx("star", s.sound);
      commit((p) => {
        if (p.stars.includes(st.i)) return null;
        p.stars.push(st.i);
        const n = p.stars.length;
        showToast({ icon: "star", title: n === 7 ? "All 7 stars found!" : `Star ${n} of 7`, body: FACTS[Math.min(n, FACTS.length) - 1] });
        return p;
      });
    };

    // ---- sizing + zoom (scroll wheel / pinch) ----
    const ZMIN = 0.6, ZMAX = 2.6;
    if (!s.zoom) s.zoom = 1;
    s.pointers = new Map();
    const applyScale = () => { s.scale = s.baseScale * s.zoom; };
    const resize = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      s.view = { w: vw, h: vh };
      s.baseScale = Math.max(2, Math.floor(vh / (15 * TILE)));
      applyScale();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cv = canvasRef.current; if (!cv) return;
      cv.width = Math.floor(vw * dpr); cv.height = Math.floor(vh * dpr);
      cv.style.width = vw + "px"; cv.style.height = vh + "px";
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- keyboard ----
    const keyMap = {
      ArrowUp: "up", KeyW: "up", w: "up", ArrowDown: "down", KeyS: "down", s: "down",
      ArrowLeft: "left", KeyA: "left", a: "left", ArrowRight: "right", KeyD: "right", d: "right",
    };
    const onKeyDown = (e) => {
      // let focused HUD buttons / links handle their own Enter + Space
      if ((e.code === "Space" || e.code === "Enter") && e.target?.closest?.("button, a")) return;
      const k = keyMap[e.code] || keyMap[e.key];
      if (k) { s.keys.add(k); s.moveTarget = null; s.pendingZone = null; s.pendingActor = null; setShowHint(false); e.preventDefault(); }
      else if (e.key === "Shift") s.shift = true;
      else if (e.code === "KeyQ" && !s.paused) setQuestsOpen((v) => !v);
      else if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") { tryInteract(); e.preventDefault(); }
    };
    const onKeyUp = (e) => {
      const k = keyMap[e.code] || keyMap[e.key]; if (k) s.keys.delete(k);
      if (e.key === "Shift") s.shift = false;
    };
    const onBlur = () => { s.keys.clear(); s.shift = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    // ---- tap / click to move  +  pinch / wheel to zoom ----
    const cv = canvasRef.current;
    const pinchDist = () => {
      const p = [...s.pointers.values()];
      return p.length < 2 ? 0 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    };
    const setZoom = (z) => { s.zoom = clamp(z, ZMIN, ZMAX); applyScale(); };

    const onPointerDown = (e) => {
      s.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (s.pointers.size >= 2) { s.pinch = pinchDist(); s.moveTarget = null; s.pendingZone = null; s.pendingActor = null; return; }
      if (s.paused) return;
      const rect = cv.getBoundingClientRect();
      const worldX = s.cam.x + (e.clientX - rect.left) / s.scale;
      const worldY = s.cam.y + (e.clientY - rect.top) / s.scale;
      const tx = Math.floor(worldX / TILE), ty = Math.floor(worldY / TILE);
      setShowHint(false);
      s.pendingZone = null; s.pendingActor = null;
      // clicked a critter / villager → walk over and interact
      const hit = s.life.actors.find((a) => ["cat", "chicken", "npc", "duck"].includes(a.type) &&
        Math.abs(worldX - a.x) < 11 && worldY < a.y + 3 && worldY > a.y - (a.type === "npc" ? 26 : 16));
      if (hit) { s.pendingActor = hit; s.moveTarget = { x: hit.x, y: hit.y + 6 }; return; }
      // clicked the fountain → walk to its front and make a wish
      if (tx >= 20 && tx <= 21 && ty >= 12 && ty <= 15) { s.pendingActor = { type: "wish" }; s.moveTarget = { x: s.life.wish.x, y: s.life.wish.y }; return; }
      const zoneObj = s.world.objects.find(
        (o) => o.zone && tx >= o.tx && tx < o.tx + o.w && ty >= o.ty - 1 && ty < o.ty + o.h
      );
      if (zoneObj) {
        const z = s.world.zones.find((zz) => zz.id === zoneObj.zone);
        s.moveTarget = { x: z.front.x * TILE + TILE / 2, y: z.front.y * TILE + TILE - 2 };
        s.pendingZone = zoneObj.zone;
      } else {
        s.moveTarget = { x: worldX, y: worldY };
      }
    };
    const onPointerMove = (e) => {
      if (!s.pointers.has(e.pointerId)) return;
      s.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (s.pointers.size >= 2) {
        const d = pinchDist();
        if (s.pinch) setZoom(s.zoom * (d / s.pinch));
        s.pinch = d;
      }
    };
    const onPointerUp = (e) => {
      s.pointers.delete(e.pointerId);
      if (s.pointers.size < 2) s.pinch = 0;
    };
    const onWheel = (e) => {
      e.preventDefault();
      setShowHint(false);
      setZoom(s.zoom * (e.deltaY < 0 ? 1.12 : 0.892));
    };
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerup", onPointerUp);
    cv.addEventListener("pointercancel", onPointerUp);
    cv.addEventListener("wheel", onWheel, { passive: false });

    // ---- interactions ----
    const openZone = (z) => {
      setDialog(z); sfx("open", s.sound);
      if (PLACES.includes(z)) commit((p) => (p.visited.includes(z) ? null : (p.visited.push(z), p)));
    };
    const interactActor = (a) => {
      const L = s.life;
      if (a.type === "cat") {
        a.follow = 1800; a.state = "sit"; a.face = s.player.x > a.x ? 1 : -1;
        burst(L, "heart", a.x, a.y - 12, 6); say(L, a, "PURR", 80); sfx("pet", s.sound);
        commit((p) => (p.pet ? null : (p.pet = true, p)));
      } else if (a.type === "chicken") {
        a.hop = 10; say(L, a, "BAWK!", 60); sfx("bawk", s.sound); burst(L, "heart", a.x, a.y - 10, 2);
      } else if (a.type === "duck") {
        say(L, a, "QUACK!", 70); sfx("quack", s.sound);
        L.actors.filter((d) => d.type === "duckling").forEach((d, i) => setTimeout(() => say(L, d, "QK", 40), 250 + i * 180));
      } else if (a.type === "npc") {
        const text = a.lines[a.line % a.lines.length]; a.line++;
        setSpeech({ id: a.id, name: a.name, text, key: Date.now() });
        clearTimeout(s.speechTimer); s.speechTimer = setTimeout(() => setSpeech(null), 7000);
        sfx("talk", s.sound);
        commit((p) => (p.talked.includes(a.id) ? null : (p.talked.push(a.id), p)));
      } else if (a.type === "wish") {
        if (L.wish.cool > 0) return;
        L.wish.cool = 90; tossCoin(L, s.player); sfx("coin", s.sound);
        setTimeout(() => sfx("splash", s.sound), 650);
        setTimeout(() => {
          const first = !s.progress.wish;
          showToast({
            icon: "coin", title: first ? "Wish made" : "Another coin!",
            body: first ? "Splash. The fountain keeps its secrets, but rumour says it works best for hiring managers." : "The fountain glitters. Somewhere, a portfolio gets read.",
          });
          commit((p) => (p.wish ? null : (p.wish = true, p)));
        }, 700);
      }
    };
    function tryInteract() {
      if (s.paused) return;
      const t = s.target;
      if (!t) return;
      s.keys.clear(); s.touch.clear(); s.moveTarget = null;
      if (t.kind === "zone") openZone(t.id); else interactActor(t.a);
    }
    s._tryInteract = tryInteract;

    // ---- collision (AABB at feet) ----
    const collide = (px, py) => {
      const hw = 5, top = py - 11, bot = py - 1;
      const pts = [[px - hw, top], [px + hw, top], [px - hw, bot], [px + hw, bot]];
      return pts.some(([x, y]) => isSolid(s.world.solids, Math.floor(x / TILE), Math.floor(y / TILE)));
    };
    const step = (p, mx, my, fdx, fdy) => {
      let moved = false;
      if (!collide(p.x + mx, p.y)) { p.x += mx; moved = true; }
      if (!collide(p.x, p.y + my)) { p.y += my; moved = true; }
      if (Math.abs(fdx) > Math.abs(fdy)) p.dir = fdx < 0 ? "left" : "right";
      else if (fdy !== 0) p.dir = fdy < 0 ? "up" : "down";
      return moved;
    };
    const sameTarget = (t, a) => t?.kind === "actor" && (t.a === a || (a.type === "wish" && t.a.type === "wish"));

    // ---- update ----
    function update(dt) {
      const p = s.player, L = s.life;
      L.wish.cool = Math.max(0, L.wish.cool - dt);
      if (s.paused) { s.moving = false; updateLife(L, s, dt); return; }
      let dx = 0, dy = 0;
      const active = (d) => s.keys.has(d) || s.touch.has(d);
      if (active("up")) dy -= 1; if (active("down")) dy += 1;
      if (active("left")) dx -= 1; if (active("right")) dx += 1;

      s.running = !!s.shift;
      const sp = SPEED * (s.running ? RUN : 1);
      let moving = false;
      if (dx || dy) {
        s.moveTarget = null; s.pendingZone = null; s.pendingActor = null;
        const len = Math.hypot(dx, dy) || 1;
        moving = step(p, (dx / len) * sp * dt, (dy / len) * sp * dt, dx, dy);
      } else if (s.moveTarget) {
        const pa = s.pendingActor;
        if (pa && pa.type !== "wish") s.moveTarget = { x: pa.x, y: pa.y + 6 };
        const tdx = s.moveTarget.x - p.x, tdy = s.moveTarget.y - p.y, dist = Math.hypot(tdx, tdy);
        const reached = pa && sameTarget(s.target, pa);
        if (dist < 3 || reached) {
          s.moveTarget = null;
          if (reached) {
            s.pendingActor = null;
            const a = s.target.a;
            p.dir = a.type === "wish" ? "up" : Math.abs(a.x - p.x) > Math.abs(a.y - p.y) ? (a.x > p.x ? "right" : "left") : (a.y > p.y ? "down" : "up");
            interactActor(a);
          } else if (s.pendingZone && s.target?.kind === "zone" && s.target.id === s.pendingZone) {
            const z = s.pendingZone; s.pendingZone = null; openZone(z);
          }
        } else {
          moving = step(p, (tdx / dist) * SPEED * dt, (tdy / dist) * SPEED * dt, tdx, tdy);
          if (!moving) { s.moveTarget = null; s.pendingActor = null; }
        }
      }

      s.moving = moving;
      if (moving) { s.frameT += dt * (s.running ? 1.5 : 1); if (s.frameT > 6) { s.frameT = 0; s.animFrame = (s.animFrame + 1) % 4; } }
      else { s.animFrame = 0; s.frameT = 0; }

      // camera follow (clamped)
      const vwT = s.view.w / s.scale, vhT = s.view.h / s.scale;
      s.cam.x = clamp(p.x - vwT / 2, 0, Math.max(0, MAP_W * TILE - vwT));
      s.cam.y = clamp(p.y - vhT / 2, 0, Math.max(0, MAP_H * TILE - vhT));

      updateLife(L, s, dt);

      // what can we interact with? a door wins when you face it
      const ptx = Math.floor(p.x / TILE), pty = Math.floor((p.y - 4) / TILE);
      let zone = null;
      for (const z of s.world.zones)
        if (Math.abs(z.front.x - ptx) + Math.abs(z.front.y - pty) <= 1) { zone = z.id; break; }
      const act = nearestActor(L, p);
      let target = null;
      if (zone && (!act || p.dir === "up")) target = { kind: "zone", id: zone };
      else if (act) target = { kind: "actor", a: act };
      s.target = target;
      const label = target ? (target.kind === "zone" ? ZONE_LABEL[target.id] : actorLabel(target.a)) : null;
      if (label !== s._lastLabel) { s._lastLabel = label; setPrompt(label); }

      // chimney smoke
      if (!s.reduceMotion) {
        for (const em of s.smokeEmitters) {
          em.t += dt;
          if (em.t > 26) { em.t = 0; if (s.smoke.length < 40) s.smoke.push({ x: em.x, y: em.y, life: 70, vy: 0.18, drift: (Math.random() - 0.5) * 0.12, size: 2 }); }
        }
        for (let i = s.smoke.length - 1; i >= 0; i--) {
          const pt = s.smoke[i];
          pt.y -= pt.vy * dt; pt.x += pt.drift * dt; pt.life -= dt; pt.size += 0.02 * dt;
          if (pt.life <= 0) s.smoke.splice(i, 1);
        }
      }
    }

    // ---- render ----
    function render() {
      const cv = canvasRef.current; if (!cv) return;
      const ctx = cv.getContext("2d");
      const { scale, cam, view } = s, L = s.life;
      ctx.imageSmoothingEnabled = false;

      // terrain (single scaled blit of visible region) + ground life
      ctx.drawImage(s.big, cam.x, cam.y, view.w / scale, view.h / scale, 0, 0, view.w, view.h);
      drawGround(ctx, L, s);

      // depth-sorted objects + actors + stars + player (culled to the view)
      const vx0 = cam.x - 64, vx1 = cam.x + view.w / scale + 64, vy1 = cam.y + view.h / scale + 96;
      const list = [];
      for (const d of s.drawObjects) if (d.ox < vx1 && d.ox + d.img.width > vx0 && d.sy < vy1 && d.base > cam.y - 16) list.push({ d, base: d.base });
      for (const a of L.actors) if (a.x > vx0 && a.x < vx1 && a.y > cam.y - 16 && a.y < vy1) list.push({ a, base: a.y });
      for (const st of L.stars) if (!st.got) list.push({ st, base: st.y });
      list.push({ player: true, base: s.player.y });
      list.sort((a, b) => a.base - b.base);

      const glows = [];
      for (const item of list) {
        if (item.player) { drawPlayer(ctx); continue; }
        if (item.a) { drawActor(ctx, L, s, item.a); continue; }
        if (item.st) {
          drawStar(ctx, L, s, item.st);
          glows.push({ x: (item.st.x - cam.x) * scale, y: (item.st.y - 9 - cam.y) * scale, r: 6, col: "255,214,110" });
          continue;
        }
        const { d } = item;
        const sx = Math.floor((d.ox - cam.x) * scale);
        const sy = Math.floor((d.sy - cam.y) * scale);
        const iw = d.img.width * scale, ih = d.img.height * scale;

        // ground shadow under buildings / trees / tall props
        const o = d.o;
        if (SHADOWED.has(o.kind) || BUILD_BY_KIND[o.kind]) {
          const tree = o.kind === "tree";
          const cxw = (o.tx + (o.w || 1) / 2) * TILE + (tree ? 2 : 1), byw = (o.ty + (o.h || 1)) * TILE - (tree ? 2 : 1);
          ctx.fillStyle = "rgba(18,52,30,0.26)";
          ctx.beginPath();
          ctx.ellipse((cxw - cam.x) * scale, (byw - cam.y) * scale, (tree ? 12 : (o.w || 1) * TILE * 0.5) * scale, (tree ? 4.2 : 4) * scale, 0, 0, 7);
          ctx.fill();
        }

        if (d.sway && !s.reduceMotion) {
          const baseScreenY = (d.base - cam.y) * scale;
          const k = Math.sin(s.now * 0.0013 + o.tx * 0.7 + o.ty * 0.4) * (o.kind === "tree" ? 0.04 : 0.07);
          ctx.save();
          ctx.transform(1, 0, k, 1, -k * baseScreenY, 0);
          ctx.drawImage(d.img, sx, sy, iw, ih);
          ctx.restore();
        } else {
          ctx.drawImage(d.img, sx, sy, iw, ih);
        }

        // windmill sails turn (frames cycle a 90° loop)
        if (d.hub && s.sails) {
          const fr = s.sails[Math.floor(L.sails) % s.sails.length];
          ctx.drawImage(fr, Math.floor(sx + (d.hub.x - 32) * scale), Math.floor(sy + (d.hub.y - 32) * scale), 64 * scale, 64 * scale);
        }

        if (d.glow) for (const gl of d.glow) glows.push({ x: sx + gl.x * scale, y: sy + gl.y * scale, r: gl.r, col: gl.col, night: gl.night });

        // blinking antenna LED
        if (d.blink) {
          const on = s.reduceMotion || Math.sin(s.now * 0.004) > 0;
          if (on) { ctx.fillStyle = "#7dff8e"; ctx.fillRect(sx + d.blink.x * scale, sy + d.blink.y * scale, 2 * scale, 2 * scale); }
        }

        // gold pennant above the recommended building (Forge) — it flutters
        if (o.flag) {
          const fx = Math.floor(((o.tx + o.w / 2) * TILE - cam.x) * scale);
          const fy = sy - 6 * scale;
          const wv = s.reduceMotion ? 0 : Math.round(Math.sin(s.now * 0.008));
          ctx.fillStyle = "#2a2230"; ctx.fillRect(fx, fy, scale, 9 * scale);
          ctx.fillStyle = "#e6bb52";
          ctx.fillRect(fx + scale, fy, (6 - Math.max(0, wv)) * scale, 2 * scale);
          ctx.fillRect(fx + scale, fy + 2 * scale, (5 + wv) * scale, 2 * scale);
        }
      }

      // chimney smoke (soft, above everything)
      if (s.smoke.length) {
        for (const pt of s.smoke) {
          const a = Math.min(0.4, pt.life / 200);
          ctx.fillStyle = `rgba(215,210,201,${a})`;
          const px = (pt.x - cam.x) * scale, py = (pt.y - cam.y) * scale, sz = pt.size * scale;
          ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        }
      }

      drawAir(ctx, L, s);
      drawTint(ctx, L, s);
      drawLights(ctx, L, s, glows);
      drawVignette(ctx, s);
      drawOverlay(ctx, L, s);

      // DOM followers: interaction prompt + villager speech
      const pr = promptRef.current;
      if (pr) {
        if (s.target && !s.paused) {
          pr.style.transform = `translate(-50%,-100%) translate(${(s.player.x - cam.x) * scale}px,${(s.player.y - TILE - 10 - cam.y) * scale}px)`;
          pr.style.opacity = "1";
        } else pr.style.opacity = "0";
      }
      const sp = speechRef.current;
      if (sp && sp.dataset.id) {
        const a = L.actors.find((x) => x.id === sp.dataset.id);
        if (a) {
          sp.style.transform = `translate(-50%,-100%) translate(${(a.x - cam.x) * scale}px,${(a.y - 30 - cam.y) * scale}px)`;
          if (Math.hypot(a.x - s.player.x, a.y - s.player.y) > 70) { sp.dataset.id = ""; setSpeech(null); }
        }
      }
    }

    function drawPlayer(ctx) {
      const p = s.player, { scale, cam } = s;
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath();
      ctx.ellipse((p.x - cam.x) * scale, (p.y - 2 - cam.y) * scale, 6 * scale, 2.4 * scale, 0, 0, 7);
      ctx.fill();
      const frames = s.hero[p.dir] || s.hero.down;
      let spr = frames[s.moving ? s.animFrame : 0];
      // idle: blink now and then, and breathe
      if (!s.moving && p.dir === "down" && s.now % 3600 < 130) spr = s.hero.blink;
      const bob = s.moving ? (s.animFrame % 2 ? 1 : 0) : (!s.reduceMotion && Math.sin(s.now * 0.004) > 0.6 ? 1 : 0);
      const sx = Math.floor((p.x - s.heroW / 2 - cam.x) * scale);
      const sy = Math.floor((p.y - s.heroH - bob - cam.y) * scale);
      ctx.drawImage(spr, sx, sy, s.heroW * scale, s.heroH * scale);
    }

    // ---- main loop ----
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.max(0, Math.min((now - last) / 16.6667, 2.2)); // rAF stamps can precede setup
      last = now; s.now = now;
      update(dt); render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const hintT = setTimeout(() => setShowHint(false), 9000);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(hintT); clearTimeout(s.bakeTimer); clearTimeout(s.speechTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      cv?.removeEventListener("pointerdown", onPointerDown);
      cv?.removeEventListener("pointermove", onPointerMove);
      cv?.removeEventListener("pointerup", onPointerUp);
      cv?.removeEventListener("pointercancel", onPointerUp);
      cv?.removeEventListener("wheel", onWheel);
    };
  }, [commit, showToast]);

  const press = (d) => { g.current.touch.add(d); g.current.moveTarget = null; g.current.pendingActor = null; setShowHint(false); };
  const release = (d) => g.current.touch.delete(d);
  const action = () => g.current._tryInteract?.();
  const night = clock.phase === "Night";
  const done = questsDone(progress);
  const nextMode = { auto: "day", day: "night", night: "auto" }[mode];

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#66a94a] select-none">
      <h1 className="sr-only">Krishna Mehta — Krishna&apos;s World, a pixel portfolio</h1>
      <canvas ref={canvasRef} className="block h-full w-full" style={{ imageRendering: "pixelated", touchAction: "none" }}
        role="img" aria-label="Krishna's pixel town. Walk with the arrow keys or WASD and press E to interact." />

      {/* HUD — left: title, live clock, quest log */}
      <div className="pointer-events-none absolute left-0 top-0 z-30 flex max-w-[min(340px,92vw)] flex-col items-start gap-2 p-3 pt-[58px] sm:max-w-[min(340px,62vw)] sm:p-4">
        <div className="font-pixel hidden rounded-md px-3 py-1.5 text-[13px] text-[#1a1420] sm:block" style={pillStyle}>
          KRISHNA&apos;S WORLD
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode(nextMode)}
            className="font-pixel flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] text-[#1a1420] transition-transform active:translate-y-[1px]"
            style={pillStyle}
            aria-label={`${clock.time} in Bharuch, ${mode === "auto" ? clock.phase.toLowerCase() + ", live" : mode + " forced"}. Switch to ${nextMode === "auto" ? "live time" : nextMode}.`}>
            <Px d={night ? MOON : SUN} color={night ? "#3c4868" : "#e39b1a"} />
            <span className="tnum">{clock.time}</span>
            <span className="text-[#6b5535]">· {mode === "auto" ? clock.phase : mode === "day" ? "Day" : "Night"}</span>
            {mode === "auto" && <span className="pulse-dot ml-0.5 h-1.5 w-1.5 rounded-full bg-[#e5484d]" aria-hidden />}
          </button>
          <button type="button" onClick={() => setQuestsOpen((v) => !v)} aria-expanded={questsOpen}
            className="font-pixel flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] text-[#1a1420] transition-transform active:translate-y-[1px]"
            style={pillStyle}>
            <Px d={STAR} color="#e39b1a" />
            Quests <span className="tnum">{done}/{QUESTS.length}</span>
            <span aria-hidden className={`inline-block transition-transform ${questsOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
        </div>
        {questsOpen && (
          <div className="kw-pop font-pixel pointer-events-auto w-[min(300px,80vw)] rounded-md p-3 text-[12px] text-[#1a1420]" style={pillStyle} role="region" aria-label="Quest log">
            <ul className="space-y-1.5">
              {QUESTS.map((q) => {
                const v = Math.min(q.total, q.get(progress)), ok = v >= q.total;
                return (
                  <li key={q.id} className="flex items-center gap-2">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-[3px]"
                      style={{ border: "2px solid #2a2230", background: ok ? "#7bc24f" : "#fff" }} aria-hidden>
                      {ok && <Px d={TICK} size={10} color="#1a1420" />}
                    </span>
                    <span className={ok ? "text-[#6b5535] line-through decoration-2" : ""}>{q.label}</span>
                    {q.total > 1 && <span className="tnum ml-auto text-[#6b5535]">{v}/{q.total}</span>}
                    <span className="sr-only">{ok ? "done" : "not done"}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2.5 border-t-2 border-dashed border-[#d9c7a0] pt-2 text-[11px] leading-snug text-[#6b5535]">
              {isTouch ? "Tap anywhere to walk. A to interact." : "Shift to run · E to interact · Q hides this"}
            </p>
          </div>
        )}
      </div>

      {/* HUD — right: sound, résumé, skip */}
      <div className="pointer-events-none absolute right-0 top-0 z-30 flex flex-wrap items-start justify-end gap-2 p-3 sm:p-4">
        <button type="button" onClick={() => setSound((v) => !v)} aria-pressed={sound} aria-label="Sound effects"
          className="font-pixel pointer-events-auto flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-[#1a1420]" style={pillStyle}>
          <Px d={sound ? SPK_ON : SPK_OFF} color="#1a1420" />
          <span className="hidden sm:inline">{sound ? "Sound on" : "Sound off"}</span>
        </button>
        <Link href="/resume" className="font-pixel pointer-events-auto rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]" style={pillStyle}>
          Résumé
        </Link>
        <Link href="/" className="font-pixel pointer-events-auto rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]"
          style={{ ...pillStyle, background: "#e6bb52" }}>
          <span className="sm:hidden">Studio site →</span><span className="hidden sm:inline">Skip to studio site →</span>
        </Link>
      </div>

      {/* interaction prompt */}
      <div ref={promptRef}
        className="font-pixel pointer-events-none absolute left-0 top-0 z-30 whitespace-nowrap rounded px-2 py-1 text-[11px] text-[#1a1420] transition-opacity duration-150"
        style={{ background: "#e6bb52", border: "2px solid #2a2230", opacity: 0, boxShadow: "0 2px 0 rgba(42,34,48,0.5)" }}
        aria-hidden>
        {isTouch ? "Press A" : "Press E"} ▸ {prompt}
      </div>

      {/* villager speech */}
      <div ref={speechRef} data-id={speech?.id || ""}
        className="pointer-events-none absolute left-0 top-0 z-30 w-max max-w-[min(280px,70vw)]"
        style={{ opacity: speech ? 1 : 0, transition: "opacity 160ms" }} aria-live="polite">
        {speech && (
          <div key={speech.key} className="kw-pop font-pixel relative rounded-md px-3 py-2 text-[12px] leading-snug text-[#1a1420]"
            style={{ background: "#fffaf0", border: "2px solid #2a2230", boxShadow: "0 3px 0 rgba(42,34,48,0.45)" }}>
            <span className="block text-[11px] uppercase tracking-wide text-[#b4473d]">{speech.name}</span>
            {speech.text}
            <span aria-hidden className="absolute left-1/2 top-full -ml-[6px] h-0 w-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "7px solid #2a2230" }} />
          </div>
        )}
      </div>

      {/* toast: star facts, wishes, the finale */}
      <div className={`pointer-events-none absolute inset-x-0 z-40 flex justify-center px-4 ${isTouch ? "bottom-[190px]" : "bottom-6"}`} aria-live="polite">
        {toast && (
          <div key={toast.key} className="kw-pop font-pixel pointer-events-auto flex max-w-[460px] items-start gap-3 rounded-md px-4 py-3 text-[#1a1420]"
            style={{ ...pillStyle, background: "#fffaf0", boxShadow: "0 4px 0 rgba(42,34,48,0.55)" }}>
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md" style={{ background: toast.icon === "trophy" ? "#7bc24f" : "#ffe7a3", border: "2px solid #2a2230" }} aria-hidden>
              <Px d={STAR} size={16} color={toast.icon === "trophy" ? "#1a1420" : "#e39b1a"} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px]">{toast.title}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-[#5a4a35]">{toast.body}</span>
              {toast.link && (
                <a href={toast.link.href} className="mt-2 inline-block rounded px-2 py-1 text-[12px]" style={{ background: "#e6bb52", border: "2px solid #2a2230" }}>
                  {toast.link.label} →
                </a>
              )}
            </span>
            <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="-mr-1 -mt-1 px-1 text-[14px] text-[#6b5535]">×</button>
          </div>
        )}
      </div>

      {/* how-to-play hint */}
      {showHint && !isTouch && !toast && (
        <div className="font-pixel pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <div className="rounded-md px-4 py-2 text-center text-[12px] text-[#1a1420]" style={pillStyle}>
            WASD / Arrows to move · Shift to run · Click to walk · Scroll to zoom · E to talk, pet and enter
          </div>
        </div>
      )}

      {isTouch && <TouchControls onPress={press} onRelease={release} onAction={action} />}
      {dialog && <GameDialog zone={dialog} onClose={() => setDialog(null)} />}

      <style jsx global>{`
        @keyframes kwPop { 0% { transform: translateY(6px) scale(.96); opacity: 0 } 100% { transform: none; opacity: 1 } }
        .kw-pop { animation: kwPop .22s cubic-bezier(.2,1.4,.4,1) both }
        @keyframes kwFade { from { opacity: 0 } to { opacity: 1 } }
        .kw-fade { animation: kwFade .18s ease-out both }
        @media (prefers-reduced-motion: reduce) { .kw-pop, .kw-fade { animation: none } }
      `}</style>
    </div>
  );
}

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
