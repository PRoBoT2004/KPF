"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// Order rush: a small catch game for the 404 page.
// Order tickets and QR stickers fall into a café; catch them on
// the tray, let the bugs fall past. Three lives, and it speeds up.
// Mouse / touch drag, or ← → (A / D). Best score stays on this device.
// ============================================================
const BEST_KEY = "km-404-rush-best";
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };
const saveBest = (v) => { try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* storage blocked */ } };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);
const PRICES = [40, 50, 60, 110, 120, 130, 140, 150, 160, 180];

export default function OrderRush() {
  const wrap = useRef(null);
  const cv = useRef(null);
  const g = useRef(null);
  const raf = useRef(0);
  const [phase, setPhase] = useState("ready"); // ready | play | over
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  useEffect(() => setBest(readBest()), []);

  const size = useCallback(() => {
    const c = cv.current, s = g.current;
    if (!c) return;
    const r = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
    if (s) { s.w = r.width; s.h = r.height; s.dpr = dpr; s.x = clamp(s.x, 0, r.width); s.tx = clamp(s.tx, 0, r.width); }
  }, []);

  const fresh = useCallback(() => {
    const c = cv.current, r = c.getBoundingClientRect();
    return {
      w: r.width, h: r.height, dpr: Math.min(window.devicePixelRatio || 1, 2),
      x: r.width / 2, tx: r.width / 2, items: [], pops: [], t: 0, spawnIn: 0.6, score: 0, lives: 3,
      keys: { l: false, r: false }, shake: 0, flash: 0, font: getComputedStyle(wrap.current).fontFamily,
    };
  }, []);

  const draw = useCallback(() => {
    const c = cv.current, s = g.current;
    if (!c || !s) return;
    const ctx = c.getContext("2d"), { w, h, dpr } = s;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sx = s.shake ? rand(-s.shake, s.shake) : 0;
    ctx.translate(sx, 0);
    // floor + grid
    ctx.fillStyle = "#f6f6f4"; ctx.fillRect(-10, 0, w + 20, h);
    ctx.strokeStyle = "rgba(0,0,0,0.05)"; ctx.lineWidth = 1;
    const step = Math.max(28, w / 18);
    for (let x = step; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = step; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    if (s.flash) { ctx.fillStyle = `rgba(214,69,69,${s.flash * 0.18})`; ctx.fillRect(-10, 0, w + 20, h); }

    const unit = clamp(w * 0.055, 26, 46);
    for (const it of s.items) {
      ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
      if (it.kind === "ticket") drawTicket(ctx, unit, it.price, s.font);
      else if (it.kind === "qr") drawQR(ctx, unit);
      else drawBug(ctx, unit);
      ctx.restore();
    }
    // tray
    const tw = clamp(w * 0.17, 84, 160), ty = h - 30;
    ctx.fillStyle = "rgba(0,0,0,0.08)"; roundRect(ctx, s.x - tw / 2 + 4, ty + 6, tw, 12, 6); ctx.fill();
    ctx.fillStyle = "#0b0b0b"; roundRect(ctx, s.x - tw / 2, ty, tw, 12, 6); ctx.fill();
    ctx.fillStyle = "#0b0b0b"; roundRect(ctx, s.x - tw * 0.18, ty + 10, tw * 0.36, 8, 3); ctx.fill();
    // score pops
    for (const p of s.pops) {
      ctx.globalAlpha = clamp(p.life / 0.8, 0, 1);
      ctx.fillStyle = p.bad ? "#d64545" : "#0b0b0b";
      ctx.font = `600 ${Math.round(unit * 0.5)}px ${s.font}`; ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, []);

  const loop = useCallback((now) => {
    const s = g.current;
    if (!s) return;
    const dt = Math.min(0.05, (now - (s.last || now)) / 1000);
    s.last = now;
    s.t += dt;
    const pace = 1 + s.t / 35;
    const { w, h } = s, unit = clamp(w * 0.055, 26, 46), tw = clamp(w * 0.17, 84, 160), ty = h - 30;
    if (s.keys.l) s.tx -= w * 1.15 * dt;
    if (s.keys.r) s.tx += w * 1.15 * dt;
    s.tx = clamp(s.tx, tw / 2, w - tw / 2);
    s.x += (s.tx - s.x) * Math.min(1, dt * 18);

    s.spawnIn -= dt;
    if (s.spawnIn <= 0) {
      const r = Math.random();
      const kind = r < 0.6 ? "ticket" : r < 0.7 ? "qr" : "bug";
      s.items.push({ kind, x: rand(unit, w - unit), y: -unit, vy: rand(h * 0.32, h * 0.5), rot: rand(-0.4, 0.4), vr: rand(-1, 1), price: PRICES[(Math.random() * PRICES.length) | 0] });
      s.spawnIn = rand(0.42, 0.9) / pace;
    }
    for (const it of s.items) { it.y += it.vy * pace * dt; it.rot += it.vr * dt; }

    const keep = [];
    for (const it of s.items) {
      const caught = it.y + unit * 0.45 >= ty && it.y - unit * 0.45 <= ty + 12 && Math.abs(it.x - s.x) <= tw / 2 + unit * 0.3;
      if (caught) {
        if (it.kind === "bug") {
          s.lives -= 1; s.shake = 7; s.flash = 1;
          s.pops.push({ x: it.x, y: ty - 10, text: "bug!", life: 0.8, bad: true });
          setLives(s.lives);
        } else {
          const pts = it.kind === "qr" ? 25 : 10;
          s.score += pts;
          s.pops.push({ x: it.x, y: ty - 10, text: `+${pts}`, life: 0.8 });
          setScore(s.score);
        }
      } else if (it.y < h + unit) keep.push(it);
    }
    s.items = keep;
    for (const p of s.pops) { p.life -= dt; p.y -= 40 * dt; }
    s.pops = s.pops.filter((p) => p.life > 0);
    s.shake = Math.max(0, s.shake - dt * 30);
    s.flash = Math.max(0, s.flash - dt * 3);
    draw();

    if (s.lives <= 0) {
      cancelAnimationFrame(raf.current);
      const b = Math.max(readBest(), s.score);
      saveBest(b); setBest(b);
      setPhase("over");
      return;
    }
    raf.current = requestAnimationFrame(loop);
  }, [draw]);

  const start = useCallback(() => {
    cancelAnimationFrame(raf.current);
    size();
    g.current = fresh();
    setScore(0); setLives(3); setPhase("play");
    raf.current = requestAnimationFrame(loop);
    cv.current?.focus({ preventScroll: true });
  }, [fresh, loop, size]);

  // first paint of the empty café, and keep the canvas sharp on resize
  useEffect(() => {
    if (!g.current) g.current = fresh();
    size(); draw();
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(cv.current);
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); };
  }, [draw, fresh, size]);

  // keyboard
  useEffect(() => {
    const set = (e, on) => {
      const s = g.current;
      if (phase !== "play" || !s) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { s.keys.l = on; e.preventDefault(); }
      if (k === "arrowright" || k === "d") { s.keys.r = on; e.preventDefault(); }
    };
    const down = (e) => set(e, true), up = (e) => set(e, false);
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [phase]);

  // pause when the tab is hidden
  useEffect(() => {
    const vis = () => {
      const s = g.current;
      if (phase !== "play" || !s) return;
      if (document.hidden) cancelAnimationFrame(raf.current);
      else { s.last = 0; raf.current = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [phase, loop]);

  const point = (e) => {
    const s = g.current;
    if (!s || phase !== "play") return;
    const r = cv.current.getBoundingClientRect();
    s.tx = e.clientX - r.left;
  };

  return (
    <div ref={wrap} className="relative overflow-hidden rounded-[22px] border border-[var(--line-2)] bg-[#f6f6f4]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-3 text-[13px]">
        <span className="tnum font-medium">Score {score}</span>
        <span className="flex items-center gap-1.5" aria-label={`${lives} lives left`}>
          {[0, 1, 2].map((i) => <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < lives ? "bg-[#0b0b0b]" : "bg-black/15"}`} />)}
        </span>
        <span className="tnum text-[var(--mute)]">Best {best}</span>
      </div>
      <canvas ref={cv} tabIndex={0} role="img" aria-label="Order rush game area"
        onPointerMove={point} onPointerDown={point}
        className={`block aspect-[4/5] w-full outline-none sm:aspect-[16/11] ${phase === "play" ? "touch-none" : ""}`} />

      {phase !== "play" && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-white/70 p-6 text-center backdrop-blur-[2px]">
          <div className="max-w-[30ch]">
            {phase === "ready" ? (
              <>
                <p className="wide text-[clamp(1.6rem,3vw,2.4rem)] font-[600] leading-none tracking-[-0.045em]">Order rush</p>
                <p className="mt-3 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                  Catch the order tickets (+10) and QR stickers (+25) on your tray. Let the bugs fall past. Three bugs and the shift is over.
                </p>
                <p className="mt-2 text-[13px] text-[var(--mute)]">Drag, or use ← → / A D</p>
              </>
            ) : (
              <>
                <p className="text-[13px] text-[var(--mute)]">Shift over</p>
                <p className="wide tnum mt-1 text-[clamp(2.4rem,5vw,3.6rem)] font-[620] leading-none tracking-[-0.05em]">{score}</p>
                <p className="mt-2 text-[14px] text-[var(--ink-2)]">{score >= best && score > 0 ? "A new best on this device." : `Your best: ${best}`}</p>
              </>
            )}
            <button type="button" onClick={start} autoFocus={phase === "over"}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0b0b0b] px-5 py-3 text-[14.5px] font-medium text-white transition-transform duration-300 active:scale-[0.97]">
              {phase === "ready" ? "Start the shift" : "Play again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function drawTicket(ctx, u, price, font) {
  const w = u * 1.05, h = u * 1.3;
  ctx.fillStyle = "#fff"; ctx.strokeStyle = "#0b0b0b"; ctx.lineWidth = 1.5;
  roundRect(ctx, -w / 2, -h / 2, w, h, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e85d26"; ctx.fillRect(-w / 2 + 1, -h / 2 + 1, w - 2, h * 0.16);
  ctx.fillStyle = "#0b0b0b"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.round(u * 0.34)}px ${font}`;
  ctx.fillText(`₹${price}`, 0, h * 0.06);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(-w * 0.3, h * 0.28, w * 0.6, 1.5);
}

function drawQR(ctx, u) {
  const s = u * 1.05, c = s / 7;
  ctx.fillStyle = "#0b0b0b"; roundRect(ctx, -s / 2, -s / 2, s, s, 4); ctx.fill();
  ctx.fillStyle = "#fff";
  const finder = (fx, fy) => { ctx.fillRect(fx, fy, c * 2.2, c * 2.2); ctx.fillStyle = "#0b0b0b"; ctx.fillRect(fx + c * 0.6, fy + c * 0.6, c, c); ctx.fillStyle = "#fff"; };
  finder(-s / 2 + c * 0.6, -s / 2 + c * 0.6);
  finder(s / 2 - c * 2.8, -s / 2 + c * 0.6);
  finder(-s / 2 + c * 0.6, s / 2 - c * 2.8);
  ctx.fillRect(c * 0.4, c * 0.4, c, c); ctx.fillRect(c * 1.6, c * 1.6, c * 0.9, c * 0.9); ctx.fillRect(-c * 0.2, c * 1.8, c * 0.8, c * 0.8);
}

function drawBug(ctx, u) {
  const r = u * 0.42;
  ctx.strokeStyle = "#7a2222"; ctx.lineWidth = 2; ctx.lineCap = "round";
  for (const sy of [-0.45, 0, 0.45]) for (const sx of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(sx * r * 0.5, sy * r); ctx.lineTo(sx * r * 1.15, sy * r + r * 0.25); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(-r * 0.2, -r * 1.05); ctx.lineTo(-r * 0.45, -r * 1.5); ctx.moveTo(r * 0.2, -r * 1.05); ctx.lineTo(r * 0.45, -r * 1.5); ctx.stroke();
  ctx.fillStyle = "#d64545"; ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.72, r * 0.95, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#7a2222"; ctx.beginPath(); ctx.arc(0, -r * 0.85, r * 0.38, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#7a2222"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -r * 0.45); ctx.lineTo(0, r * 1.0); ctx.stroke();
}
