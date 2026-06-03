"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  TILE, buildTile, buildHeroFrames, buildTree, buildSignpost, BUILD_BY_KIND,
  buildBush, buildLamp, buildAnvil, buildEasel, buildGear, buildBarrel,
  buildCrate, buildFlowerbox, buildBench, buildWell, buildNoticeBoard, buildFountain,
} from "@/game/draw";
import { makeWorld, isSolid, MAP_W, MAP_H } from "@/game/world";
import GameDialog from "@/components/game/GameDialog";
import TouchControls from "@/components/game/TouchControls";

const SPEED = 1.85; // art-px per frame @60fps

const PROP_BUILDERS = {
  bush: buildBush, lamp: buildLamp, anvil: buildAnvil, easel: buildEasel,
  gear: buildGear, barrel: buildBarrel, crate: buildCrate, flowerbox: buildFlowerbox,
  bench: buildBench, well: buildWell, board: buildNoticeBoard, fountain: buildFountain,
};

const ZONE_LABEL = {
  welcome: "Town Square", designer: "Designer's Studio", engineer: "Engineer's Workshop",
  builder: "Builder's Forge", projects: "Quest Hall", inn: "The Inn",
};

// turn any object into { cv, glow?, smoke?, blink? }
function spriteFor(o) {
  if (o.kind === "tree") return { cv: buildTree(o.ttype) };
  if (o.kind === "signpost") return { cv: buildSignpost(o.dirs) };
  if (BUILD_BY_KIND[o.kind]) return BUILD_BY_KIND[o.kind]();
  const b = PROP_BUILDERS[o.kind];
  if (!b) return { cv: null };
  const res = b();
  return res.cv ? res : { cv: res };
}

export default function PixelWorld() {
  const canvasRef = useRef(null);
  const promptRef = useRef(null);
  const [dialog, setDialog] = useState(null);
  const [nearZone, setNearZone] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const g = useRef({
    world: null, hero: null, player: null,
    cam: { x: 0, y: 0 }, scale: 3, view: { w: 0, h: 0 },
    keys: new Set(), touch: new Set(),
    moveTarget: null, pendingZone: null, near: null,
    paused: false, frameT: 0, animFrame: 0, moving: false,
    drawObjects: [], smokeEmitters: [], smoke: [], now: 0, reduceMotion: false,
  });

  useEffect(() => { g.current.paused = dialog !== null; }, [dialog]);

  useEffect(() => {
    const s = g.current;
    setIsTouch(!!window.matchMedia?.("(pointer: coarse)").matches);
    s.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
    s.world = makeWorld();

    s.player = {
      x: s.world.spawn.x * TILE + TILE / 2,
      y: s.world.spawn.y * TILE + TILE - 2,
      dir: "up",
    };

    // ---- bake terrain to one big canvas (code-drawn, instant) ----
    const big = document.createElement("canvas");
    big.width = MAP_W * TILE; big.height = MAP_H * TILE;
    const bctx = big.getContext("2d");
    bctx.imageSmoothingEnabled = false;
    for (let y = 0; y < MAP_H; y++)
      for (let x = 0; x < MAP_W; x++)
        bctx.drawImage(buildTile(s.world.terrain[y][x], x, y), x * TILE, y * TILE);
    s.big = big;

    // ---- build every object's sprite (cached canvases) ----
    s.drawObjects = [];
    s.smokeEmitters = [];
    for (const o of s.world.objects) {
      const spr = spriteFor(o);
      if (!spr.cv) continue;
      const w = (o.w || 1) * TILE, base = (o.ty + (o.h || 1)) * TILE;
      const ox = o.tx * TILE + (w - spr.cv.width) / 2;     // centre sprite on footprint
      const sy = base - spr.cv.height;                      // top of sprite (world px)
      const drawO = { o, img: spr.cv, ox, sy, base, glow: spr.glow || null, blink: spr.blink || null, sway: o.sway };
      s.drawObjects.push(drawO);
      if (spr.smoke) s.smokeEmitters.push({ x: ox + spr.smoke.x, y: sy + spr.smoke.y, t: 0 });
    }

    // ---- hero frames (4 dirs × 4 walk frames) ----
    s.hero = buildHeroFrames();
    s.heroW = 16; s.heroH = 24;

    // ---- sizing ----
    const resize = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      s.view = { w: vw, h: vh };
      s.scale = Math.max(2, Math.floor(vh / (15 * TILE)));
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
      const k = keyMap[e.code] || keyMap[e.key];
      if (k) { s.keys.add(k); s.moveTarget = null; s.pendingZone = null; setShowHint(false); e.preventDefault(); }
      else if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") { tryInteract(); e.preventDefault(); }
    };
    const onKeyUp = (e) => { const k = keyMap[e.code] || keyMap[e.key]; if (k) s.keys.delete(k); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ---- click / tap to move ----
    const onPointer = (e) => {
      if (s.paused) return;
      const cv = canvasRef.current, rect = cv.getBoundingClientRect();
      const worldX = s.cam.x + (e.clientX - rect.left) / s.scale;
      const worldY = s.cam.y + (e.clientY - rect.top) / s.scale;
      const tx = Math.floor(worldX / TILE), ty = Math.floor(worldY / TILE);
      setShowHint(false);
      const zoneObj = s.world.objects.find(
        (o) => o.zone && tx >= o.tx && tx < o.tx + o.w && ty >= o.ty - 1 && ty < o.ty + o.h
      );
      if (zoneObj) {
        const z = s.world.zones.find((zz) => zz.id === zoneObj.zone);
        s.moveTarget = { x: z.front.x * TILE + TILE / 2, y: z.front.y * TILE + TILE - 2 };
        s.pendingZone = zoneObj.zone;
      } else {
        s.moveTarget = { x: worldX, y: worldY };
        s.pendingZone = null;
      }
    };
    const cv = canvasRef.current;
    cv.addEventListener("pointerdown", onPointer);

    function tryInteract() {
      if (s.paused) return;
      if (s.near) { setDialog(s.near); s.keys.clear(); s.touch.clear(); s.moveTarget = null; }
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

    // ---- update ----
    function update(dt) {
      const p = s.player;
      if (s.paused) return;
      let dx = 0, dy = 0;
      const active = (d) => s.keys.has(d) || s.touch.has(d);
      if (active("up")) dy -= 1; if (active("down")) dy += 1;
      if (active("left")) dx -= 1; if (active("right")) dx += 1;

      let moving = false;
      if (dx || dy) {
        s.moveTarget = null; s.pendingZone = null;
        const len = Math.hypot(dx, dy) || 1;
        moving = step(p, (dx / len) * SPEED * dt, (dy / len) * SPEED * dt, dx, dy);
      } else if (s.moveTarget) {
        const tdx = s.moveTarget.x - p.x, tdy = s.moveTarget.y - p.y, dist = Math.hypot(tdx, tdy);
        if (dist < 3) {
          s.moveTarget = null;
          if (s.pendingZone && s.near === s.pendingZone) { const z = s.pendingZone; s.pendingZone = null; setDialog(z); }
        } else {
          moving = step(p, (tdx / dist) * SPEED * dt, (tdy / dist) * SPEED * dt, tdx, tdy);
          if (!moving) s.moveTarget = null;
        }
      }

      s.moving = moving;
      if (moving) { s.frameT += dt; if (s.frameT > 6) { s.frameT = 0; s.animFrame = (s.animFrame + 1) % 4; } }
      else { s.animFrame = 0; s.frameT = 0; }

      // camera follow (clamped)
      const vwT = s.view.w / s.scale, vhT = s.view.h / s.scale;
      s.cam.x = clamp(p.x - vwT / 2, 0, Math.max(0, MAP_W * TILE - vwT));
      s.cam.y = clamp(p.y - vhT / 2, 0, Math.max(0, MAP_H * TILE - vhT));

      // nearest interactive zone
      const ptx = Math.floor(p.x / TILE), pty = Math.floor((p.y - 4) / TILE);
      let near = null;
      for (const z of s.world.zones)
        if (Math.abs(z.front.x - ptx) + Math.abs(z.front.y - pty) <= 1) { near = z.id; break; }
      s.near = near;
      if (near !== s._lastNear) { s._lastNear = near; setNearZone(near); }

      // smoke particles
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
      const { scale, cam, view } = s;
      ctx.imageSmoothingEnabled = false;

      // terrain (single scaled blit of visible region)
      ctx.drawImage(s.big, cam.x, cam.y, view.w / scale, view.h / scale, 0, 0, view.w, view.h);

      // depth-sorted objects + player
      const list = s.drawObjects.map((d) => ({ d, base: d.base }));
      list.push({ player: true, base: s.player.y });
      list.sort((a, b) => a.base - b.base);

      for (const item of list) {
        if (item.player) { drawPlayer(ctx); continue; }
        const { d } = item;
        const sx = Math.floor((d.ox - cam.x) * scale);
        const sy = Math.floor((d.sy - cam.y) * scale);
        const iw = d.img.width * scale, ih = d.img.height * scale;

        // ground shadow under buildings / trees / tall props
        const o = d.o;
        if (o.kind === "tree" || BUILD_BY_KIND[o.kind] || o.kind === "well" || o.kind === "signpost" || o.kind === "board" || o.kind === "fountain") {
          const cxw = (o.tx + (o.w || 1) / 2) * TILE, byw = (o.ty + (o.h || 1)) * TILE - 1;
          ctx.fillStyle = "rgba(0,0,0,0.16)";
          ctx.beginPath();
          ctx.ellipse((cxw - cam.x) * scale, (byw - cam.y) * scale, (o.w || 1) * TILE * 0.46 * scale, 2.6 * scale, 0, 0, 7);
          ctx.fill();
        }

        if (d.sway && !s.reduceMotion) {
          const baseScreenY = (d.base - cam.y) * scale;
          const k = Math.sin(s.now * 0.0013 + o.tx * 0.7 + o.ty * 0.4) * 0.04;
          ctx.save();
          ctx.transform(1, 0, k, 1, -k * baseScreenY, 0);
          ctx.drawImage(d.img, sx, sy, iw, ih);
          ctx.restore();
        } else {
          ctx.drawImage(d.img, sx, sy, iw, ih);
        }

        // additive glow (furnace, lamps, warm windows, monitor)
        if (d.glow) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          for (const gl of d.glow) {
            const flick = s.reduceMotion ? 0.5 : 0.42 + 0.12 * Math.sin(s.now * 0.006 + gl.x);
            const gx = sx + gl.x * scale, gy = sy + gl.y * scale, gr = gl.r * scale;
            const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
            grad.addColorStop(0, `rgba(${gl.col},${flick})`);
            grad.addColorStop(1, `rgba(${gl.col},0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
          }
          ctx.restore();
        }

        // blinking antenna LED
        if (d.blink) {
          const on = s.reduceMotion || Math.sin(s.now * 0.004) > 0;
          if (on) { ctx.fillStyle = "#7dff8e"; ctx.fillRect(sx + d.blink.x * scale, sy + d.blink.y * scale, 2 * scale, 2 * scale); }
        }

        // gold pennant flag above the recommended building (Forge)
        if (o.flag) {
          const fx = Math.floor(((o.tx + o.w / 2) * TILE - cam.x) * scale);
          const fy = sy - 6 * scale;
          ctx.fillStyle = "#2a2230"; ctx.fillRect(fx, fy, scale, 9 * scale);
          ctx.fillStyle = "#e6bb52"; ctx.fillRect(fx + scale, fy, 6 * scale, 4 * scale);
        }
      }

      // smoke (drawn above everything, soft)
      if (s.smoke.length) {
        for (const pt of s.smoke) {
          const a = Math.min(0.4, pt.life / 200);
          ctx.fillStyle = `rgba(215,210,201,${a})`;
          const px = (pt.x - cam.x) * scale, py = (pt.y - cam.y) * scale, sz = pt.size * scale;
          ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        }
      }

      // interaction prompt bubble (DOM follow)
      const pr = promptRef.current;
      if (pr) {
        if (s.near) {
          pr.style.transform = `translate(-50%,-100%) translate(${(s.player.x - cam.x) * scale}px,${(s.player.y - TILE - 8 - cam.y) * scale}px)`;
          pr.style.opacity = "1";
        } else pr.style.opacity = "0";
      }
    }

    function drawPlayer(ctx) {
      const p = s.player, { scale, cam } = s;
      // shadow
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath();
      ctx.ellipse((p.x - cam.x) * scale, (p.y - 2 - cam.y) * scale, 6 * scale, 2.4 * scale, 0, 0, 7);
      ctx.fill();
      const frames = s.hero[p.dir] || s.hero.down;
      const spr = frames[s.moving ? s.animFrame : 0];
      const sx = Math.floor((p.x - s.heroW / 2 - cam.x) * scale);
      const sy = Math.floor((p.y - s.heroH - cam.y) * scale);
      ctx.drawImage(spr, sx, sy, s.heroW * scale, s.heroH * scale);
    }

    // ---- main loop ----
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 16.6667, 2.2);
      last = now; s.now = now;
      update(dt); render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const hintT = setTimeout(() => setShowHint(false), 7000);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(hintT);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cv?.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const press = (d) => { g.current.touch.add(d); g.current.moveTarget = null; setShowHint(false); };
  const release = (d) => g.current.touch.delete(d);
  const action = () => g.current._tryInteract?.();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#7bc24f] select-none">
      <canvas ref={canvasRef} className="block h-full w-full" style={{ imageRendering: "pixelated", touchAction: "none" }} />

      {/* HUD: title + résumé link */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4">
        <div className="font-pixel rounded-md px-3 py-1.5 text-[13px] text-[#1a1420]"
          style={{ background: "rgba(243,231,207,0.92)", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(42,34,48,0.5)" }}>
          KRISHNA&apos;S WORLD
        </div>
        <Link href="/resume"
          className="font-pixel pointer-events-auto rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]"
          style={{ background: "rgba(243,231,207,0.92)", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(42,34,48,0.5)" }}>
          Résumé view →
        </Link>
      </div>

      {/* interaction prompt */}
      <div ref={promptRef}
        className="font-pixel pointer-events-none absolute left-0 top-0 z-30 whitespace-nowrap rounded px-2 py-1 text-[11px] text-[#1a1420] transition-opacity duration-150"
        style={{ background: "#e6bb52", border: "2px solid #2a2230", opacity: 0, boxShadow: "0 2px 0 rgba(42,34,48,0.5)" }}>
        {isTouch ? "Press A" : "Press E"} ▸ {ZONE_LABEL[nearZone] || nearZone}
      </div>

      {/* how-to-play hint */}
      {showHint && !isTouch && (
        <div className="font-pixel pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center">
          <div className="rounded-md px-4 py-2 text-[12px] text-[#1a1420]"
            style={{ background: "rgba(243,231,207,0.92)", border: "2px solid #2a2230" }}>
            WASD / Arrows to move · Click to walk · Walk to a shop &amp; press E
          </div>
        </div>
      )}

      {isTouch && <TouchControls onPress={press} onRelease={release} onAction={action} />}
      {dialog && <GameDialog zone={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
