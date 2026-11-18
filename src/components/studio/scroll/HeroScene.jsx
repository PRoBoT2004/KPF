"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { identity } from "@/data/portfolio";
import { scenes } from "@/data/studio";
import { PAD, useFinePointer, useReduceAfterMount, useScrollTo } from "../primitives";
import { easeInOut, easeOut, seg } from "./ease";

const SHOP = "/assets/work/covers/shop-erp.webp";
const SHOPS = 300;
const H = scenes.hero;
const BLUE = "#1E6BFF";
const ORANGE = "#FF5A1F";

// ============================================================
// Opening scene (pinned): a design canvas.
// The headline is half design (a selected word with handles) and
// half code (it types itself, caret blinking). Real work is pinned
// around it as stickers you can drag; two cursors, "designing" and
// "coding", drift across the board. Scrolling throws the stickers
// off and grows the Shop-ERP screen (from wherever it was dropped)
// into a full-screen count of the 300 shops that use it.
//   0.00–0.07 hold · 0.07–0.36 expand · 0.36–0.46 darken
//   0.46–0.80 count · 0.80–1.00 hold
// ============================================================
export default function HeroScene() {
  const reduce = useReduceAfterMount();
  const fine = useFinePointer();
  const scrollTo = useScrollTo();
  const section = useRef(null);
  const stage = useRef(null);
  const shop = useRef(null);
  const canvas = useRef(null);
  const geo = useRef({ x: 0, y: 0, w: 0, h: 0, W: 1, H: 1 });
  const [top, setTop] = useState("shop");
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  // where the Shop-ERP sticker sits inside the stage (re-measured while the scene is at rest)
  const measure = useCallback(() => {
    const s = stage.current?.getBoundingClientRect();
    const r = shop.current?.getBoundingClientRect();
    if (!s || !r || !r.width) return;
    geo.current = { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height, W: s.width, H: s.height };
  }, []);

  const t = useTransform(p, (v) => easeInOut(seg(v, 0.07, 0.36)));
  // transform + clip only (no width/height animation, so no layout shift):
  // the full-screen layer is shrunk onto the sticker, then released to fill the stage
  const clip = useTransform(t, (k) => {
    const g = geo.current, q = 1 - k;
    if (!g.w) return "inset(50% 50% 50% 50%)";
    return `inset(${g.y * q}px ${(g.W - g.x - g.w) * q}px ${(g.H - g.y - g.h) * q}px ${g.x * q}px round ${10 * q}px)`;
  });
  const fit = () => { const g = geo.current; return g.w ? Math.max(g.w / g.W, g.h / g.H) : 1; };
  const innerScale = useTransform(t, (k) => fit() + (1 - fit()) * k);
  const innerX = useTransform(t, (k) => (geo.current.x + geo.current.w / 2 - geo.current.W / 2) * (1 - k));
  const innerY = useTransform(t, (k) => (geo.current.y + geo.current.h / 2 - geo.current.H / 2) * (1 - k));
  const shown = useTransform(p, (v) => (v > 0.068 ? 1 : 0));
  const shopOpacity = useTransform(shown, (v) => 1 - v);
  const heroOpacity = useTransform(p, [0.1, 0.26], [1, 0]);
  const fly = useTransform(p, [0.03, 0.3], [0, 1]);
  const flyFade = useTransform(p, [0.1, 0.26], [1, 0]);
  const chrome = useTransform(p, [0, 0.05], [1, 0]);
  const chromeEvents = useTransform(chrome, (v) => (v > 0.5 ? "auto" : "none"));
  const shade = useTransform(p, [0.32, 0.46], [0, 0.8]);
  const proof = useTransform(p, [0.4, 0.48], [0, 1]);
  const proofY = useTransform(p, [0.4, 0.5], [28, 0]);
  const proofEvents = useTransform(proof, (v) => (v > 0.5 ? "auto" : "none"));
  const count = useTransform(p, (v) => Math.round(SHOPS * easeOut(seg(v, 0.46, 0.8))));
  const plus = useTransform(p, [0.79, 0.82], [0, 1]);
  const cta = useTransform(p, [0.78, 0.86], [0, 1]);

  // one dot per shop
  const draw = useCallback((n) => {
    const c = canvas.current;
    if (!c) return;
    const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const cols = w < 460 ? 20 : 30, rows = Math.ceil(SHOPS / cols);
    const cell = Math.min(w / cols, h / rows), rad = cell * 0.26;
    const ox = (w - cols * cell) / 2 + cell / 2, oy = (h - rows * cell) / 2 + cell / 2;
    for (let i = 0; i < SHOPS; i++) {
      g.fillStyle = i < n ? "#FFFFFF" : "rgba(255,255,255,0.14)";
      g.beginPath();
      g.arc(ox + (i % cols) * cell, oy + Math.floor(i / cols) * cell, i < n ? rad : rad * 0.82, 0, Math.PI * 2);
      g.fill();
    }
  }, []);
  useMotionValueEvent(count, "change", draw);

  // the dark scene tells the header to switch to its light-on-dark style
  useMotionValueEvent(p, "change", (v) => {
    if (v < 0.07) measure();
    if (section.current) section.current.dataset.nav = v > 0.3 && v < 0.995 ? "dark" : "light";
  });

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => { measure(); draw(count.get()); });
    if (stage.current) ro.observe(stage.current);
    document.fonts?.ready.then(measure);
    const late = setTimeout(measure, 1800); // after the stickers have landed
    draw(count.get());
    return () => { ro.disconnect(); clearTimeout(late); };
  }, [measure, draw, count]);

  if (reduce) return <StaticHero />;

  const sticker = { fly, fade: flyFade, fine, stage, top, onLift: setTop };

  return (
    <section id="top" ref={section} data-nav="light" aria-label="Introduction" className="relative h-[260svh] md:h-[300svh]">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden bg-[#fafaf8]">
        <motion.div aria-hidden="true" className="dot-grid absolute inset-0" style={{ opacity: heroOpacity }} />

        {/* the words */}
        <motion.div style={{ opacity: heroOpacity }}
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto max-w-[1440px] pt-[clamp(5.25rem,13svh,8rem)] ${PAD}`}>
          <p className="lift flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(0.95rem,1.15vw,1.1rem)] text-[var(--ink-2)]">
            <span>{H.kicker}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-white px-2.5 py-1 text-[12.5px] text-[var(--ink)] md:hidden">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#1f9d55]" />{H.status}
            </span>
          </p>
          <h1 aria-label="I design software, then I build it."
            className="wide mt-[clamp(0.8rem,2.2svh,1.5rem)] text-[clamp(3rem,9.4vw,10.4rem)] font-[600] leading-[0.95] tracking-[-0.055em]">
            <span aria-hidden="true" className="lift block">I <Selected>design</Selected> software,</span>
            <span aria-hidden="true" className="block">
              <Typed text="then I build it." start={0.5} />
              <span className="caret ml-[0.05em] inline-block h-[0.78em] w-[0.07em] translate-y-[0.06em] rounded-[1px]" style={{ background: BLUE }} />
            </span>
          </h1>
        </motion.div>

        {/* the board */}
        <Sticker id="note" {...sticker} rotate={-5} delay={0.4} to={[-40, 30]}
          className="left-[4%] top-[47%] w-[44vw] md:left-[3%] md:top-[63%] md:w-[clamp(150px,13vw,210px)]">
          <div className="hand aspect-square bg-[#FFE36E] p-[12%] text-[clamp(1.05rem,1.45vw,1.4rem)] leading-[1.15] text-[#2b2410] shadow-[0_18px_30px_-18px_rgba(0,0,0,0.45)]">
            {H.note}
          </div>
        </Sticker>

        <Sticker id="crm" {...sticker} rotate={4} delay={0.55} to={[-30, 60]} className="hidden md:left-[19%] md:top-[66%] md:block md:w-[clamp(180px,17vw,270px)]">
          <Frame label="Trade CRM" src="/assets/work/trade-crm/cover.webp" />
        </Sticker>

        <Sticker id="shop" {...sticker} rotate={0} delay={0.45} to={[0, 0]} fade={null}
          className="left-[5%] top-[66%] w-[58vw] md:left-[40%] md:top-[59%] md:w-[clamp(250px,25vw,390px)]">
          <Frame label="Shop-ERP · live, 300+ shops" src={SHOP} boxRef={shop} boxStyle={{ opacity: shopOpacity }} priority />
        </Sticker>

        <Sticker id="phone" {...sticker} rotate={7} delay={0.62} to={[30, 50]}
          className="right-[6%] top-[60%] md:left-[69%] md:right-auto md:top-[58%]">
          <p className="mb-1.5 text-[11.5px] text-[var(--mute)]">ScanDine · mobile</p>
          <div className="relative aspect-[390/844] h-[25svh] rounded-[16%/7.4%] bg-[#0a0a0a] p-[4%] shadow-[0_24px_40px_-20px_rgba(0,0,0,0.55)] md:h-[clamp(200px,33svh,330px)]">
            <div className="relative h-full w-full overflow-hidden rounded-[13%/6%]">
              <Image src="/assets/work/scandine/status.webp" alt="" fill sizes="150px" className="pointer-events-none object-cover object-top" />
            </div>
          </div>
        </Sticker>

        <Sticker id="me" {...sticker} rotate={6} delay={0.3} to={[40, -30]}
          className="right-[5%] top-[44%] w-[30vw] md:right-[3%] md:top-[33%] md:w-[clamp(150px,14vw,220px)]">
          <figure className="bg-white p-[6%] pb-0 shadow-[0_20px_36px_-18px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe2d3]">
              <Image src="/assets/work/profile.webp" alt="Krishna on a bridge at sunset" fill sizes="220px" priority className="pointer-events-none object-cover object-[50%_80%]" />
            </div>
            <figcaption className="hand py-[0.45em] text-center text-[clamp(0.95rem,1.3vw,1.3rem)] text-[var(--ink-2)]">hi, that’s me</figcaption>
          </figure>
        </Sticker>

        <Sticker id="badge" {...sticker} rotate={0} delay={0.75} to={[20, -40]} className="hidden md:left-[70%] md:top-[40%] md:block">
          <Badge text={`${H.status.toUpperCase()} · `} />
        </Sticker>

        {/* two of me on the same file */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 hidden md:block" style={{ opacity: chrome }}>
          <Cursor color={ORANGE} label="Krishna · designing" delay={1.6} dur={15}
            x={["24vw", "47vw", "53vw", "12vw", "30vw", "24vw"]} y={["33svh", "26svh", "70svh", "72svh", "38svh", "33svh"]} />
          <Cursor color={BLUE} label="Krishna · coding" delay={2.2} dur={17}
            x={["52vw", "64vw", "76vw", "34vw", "28vw", "52vw"]} y={["49svh", "74svh", "60svh", "80svh", "52svh", "49svh"]} />
        </motion.div>

        {/* the toolbar */}
        <motion.nav aria-label="Start here" style={{ opacity: chrome, pointerEvents: chromeEvents }}
          className="absolute bottom-[clamp(0.9rem,2.6svh,1.5rem)] left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#111] p-1.5 text-[14px] text-white shadow-[0_20px_40px_-18px_rgba(0,0,0,0.6)]">
          <a href="#work" onClick={(e) => { if (scrollTo("#work")) e.preventDefault(); }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 font-medium text-black transition-transform duration-300 active:scale-[0.97]">
            See the work <span aria-hidden="true">↓</span>
          </a>
          <Link href="/resume" className="rounded-full px-4 py-2.5 font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white">Résumé</Link>
          <a href={`mailto:${identity.email}`} className="whitespace-nowrap rounded-full px-4 py-2.5 font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white">Say hi</a>
        </motion.nav>

        {/* the Shop-ERP sticker, growing to fill the screen */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-40" style={{ clipPath: clip, opacity: shown }}>
          <motion.div className="absolute inset-0 overflow-hidden bg-[#0d0d0d]" style={{ x: innerX, y: innerY, scale: innerScale }}>
            <Image src={SHOP} alt="" fill sizes="100vw" className="object-contain object-[50%_42%] md:object-cover" />
          </motion.div>
          <motion.div className="absolute inset-0 bg-[#050505]" style={{ opacity: shade }} />
        </motion.div>

        {/* 300 shops */}
        <motion.div style={{ opacity: proof, y: proofY, pointerEvents: proofEvents }}
          className={`absolute inset-0 z-50 mx-auto flex max-w-[1440px] flex-col justify-end pb-[clamp(2rem,7svh,5rem)] pt-24 text-white ${PAD}`}>
          <div className="grid grid-cols-12 items-end gap-x-[clamp(1rem,3vw,3rem)] gap-y-8">
            <div className="col-span-12 md:col-span-6">
              <p className="text-[14px] text-white/60">Shop-ERP</p>
              <p className="wide tnum mt-2 text-[clamp(5.5rem,17vw,15.5rem)] font-[620] leading-[0.82] tracking-[-0.06em]" aria-label="300+">
                <motion.span>{count}</motion.span><motion.span style={{ opacity: plus }}>+</motion.span>
              </p>
              <p className="mt-4 max-w-[22ch] text-[clamp(1.25rem,2vw,1.9rem)] font-[500] leading-[1.15] tracking-[-0.03em]">{scenes.proof.label}</p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <canvas ref={canvas} aria-hidden="true" className="block aspect-[4/3] w-full md:aspect-[3/1]" />
              <motion.div style={{ opacity: cta }} className="mt-6">
                <p className="max-w-[52ch] text-[15.5px] leading-[1.55] text-white/75">{scenes.proof.line}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ul className="flex flex-wrap gap-2 text-[13px] text-white/80">
                    {scenes.proof.facts.map((f) => <li key={f} className="rounded-full border border-white/20 px-3 py-1.5">{f}</li>)}
                  </ul>
                  <Link href="/work/shop-erp" className="group inline-flex items-center gap-2 text-[15px] font-medium">
                    <span className="ink-link is-under">Read the Shop-ERP story</span>
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// A piece of work pinned to the board. It slaps on with a little
// spring, can be dragged anywhere (mouse / trackpad), and is thrown
// off the board (`to`, in vw / vh) as the scroll story starts.
function Sticker({ id, className = "", rotate = 0, delay = 0, to = [0, 0], fly, fade, fine, stage, top, onLift, children }) {
  const x = useTransform(fly, (v) => `${v * to[0]}vw`);
  const y = useTransform(fly, (v) => `${v * to[1]}vh`);
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y, opacity: fade ?? 1, zIndex: top === id ? 22 : 20 }}>
      <motion.div
        drag={fine} dragConstraints={stage} dragElastic={0.12} dragTransition={{ power: 0.25, timeConstant: 220 }}
        onPointerDown={() => onLift(id)}
        initial={{ opacity: 0, scale: 1.35, rotate: rotate + 10 }}
        animate={{ opacity: 1, scale: 1, rotate }}
        transition={{ type: "spring", stiffness: 240, damping: 17, delay }}
        whileHover={fine ? { scale: 1.03 } : undefined}
        whileDrag={{ scale: 1.07, rotate: 0 }}
        whileTap={fine ? undefined : { rotate: -rotate, scale: 0.97 }}
        className={fine ? "cursor-grab touch-none active:cursor-grabbing" : ""}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// a frame on the canvas, named the way a design tool names frames
function Frame({ label, src, boxRef, boxStyle, priority }) {
  return (
    <div>
      <p className="mb-1.5 text-[11.5px] text-[var(--mute)]">{label}</p>
      <motion.div ref={boxRef} style={boxStyle}
        className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-[#111] shadow-[0_24px_44px_-22px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
        <Image src={src} alt="" fill sizes="(min-width: 768px) 400px, 60vw" priority={priority} className="pointer-events-none object-cover object-top" />
      </motion.div>
    </div>
  );
}

// a word selected in a design tool: blue box, corner handles, live size
function Selected({ children }) {
  const ref = useRef(null);
  const [dims, setDims] = useState("");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { const r = el.getBoundingClientRect(); setDims(`${Math.round(r.width)} × ${Math.round(r.height)}`); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <span className="sel-in pointer-events-none absolute -inset-x-[0.06em] bottom-[0.02em] top-[0.14em] border-2" style={{ borderColor: BLUE }}>
        {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((c) => (
          <span key={c} className={`absolute h-[9px] w-[9px] border-2 bg-white ${c}`} style={{ borderColor: BLUE }} />
        ))}
        {dims && (
          <span className="absolute left-1/2 top-full mt-[7px] -translate-x-1/2 whitespace-nowrap rounded-[4px] px-1.5 py-[3px] text-[11px] font-medium leading-none tracking-normal text-white"
            style={{ background: BLUE, fontStretch: "100%" }}>{dims}</span>
        )}
      </span>
    </span>
  );
}

// letters that appear one by one, like code being typed (opacity only)
function Typed({ text, start = 1, step = 0.05 }) {
  return text.split("").map((ch, i) => (
    <span key={i} className="type-in" style={{ animationDelay: `${start + i * step}s` }}>{ch}</span>
  ));
}

// a slowly turning round sticker
function Badge({ text }) {
  return (
    <div className="relative grid h-[clamp(108px,9vw,136px)] w-[clamp(108px,9vw,136px)] place-items-center rounded-full bg-[#111] text-white shadow-[0_20px_36px_-18px_rgba(0,0,0,0.55)]">
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><path id="badge-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
        <text fill="currentColor" fontSize="6.6" fontWeight="600" textLength="230" lengthAdjust="spacing"><textPath href="#badge-ring" textLength="230" lengthAdjust="spacing">{text}</textPath></text>
      </svg>
      <span className="pulse-dot h-3 w-3 rounded-full bg-[#2bd36b]" />
    </div>
  );
}

// a multiplayer cursor with a name tag, drifting on a loop
function Cursor({ color, label, x, y, delay, dur }) {
  return (
    <motion.div className="absolute left-0 top-0" initial={{ opacity: 0, x: x[0], y: y[0] }} animate={{ opacity: 1, x, y }}
      transition={{ opacity: { delay, duration: 0.4 }, x: { delay, duration: dur, repeat: Infinity, ease: "easeInOut" }, y: { delay, duration: dur, repeat: Infinity, ease: "easeInOut" } }}>
      <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true">
        <path d="M3 2.5 L3 19.5 L7.8 15 L11 22 L14.2 20.6 L11 13.7 L17.6 13.7 Z" fill={color} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="-mt-1 ml-4 inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium text-white shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)]" style={{ background: color }}>
        {label}
      </span>
    </motion.div>
  );
}

// reduced motion: the same story without pinning, stickers or cursors
function StaticHero() {
  return (
    <section id="top" data-nav="light" aria-label="Introduction" className="dot-grid">
      <div className={`mx-auto max-w-[1440px] pb-16 pt-36 ${PAD}`}>
        <p className="text-[15px] text-[var(--ink-2)]">{H.kicker}</p>
        <h1 className="wide mt-5 text-[clamp(2.6rem,8vw,8.5rem)] font-[600] leading-[0.95] tracking-[-0.055em]">I design software, then I build it.</h1>
        <p className="mt-6 max-w-[50ch] text-[1.1rem] leading-[1.5] text-[var(--ink-2)]">{H.intro}</p>
        <p className="mt-4 text-[14px] text-[var(--mute)]">{H.status}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-[15px] font-medium">
          <a href="#work" className="rounded-full bg-[var(--ink)] px-5 py-3 text-white">See the work ↓</a>
          <Link href="/resume" className="rounded-full border border-[var(--line-2)] bg-white px-5 py-3">Résumé</Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--line-2)] pt-4 md:grid-cols-4">
          {H.facts.map((f) => (
            <li key={f.small}><p className="wide text-[1.6rem] font-[600] tracking-[-0.045em]">{f.big}</p><p className="text-[13.5px] text-[var(--mute)]">{f.small}</p></li>
          ))}
        </ul>
      </div>
      <div data-nav="dark" className={`bg-[#0a0a0a] py-16 text-white ${PAD}`}>
        <p className="wide text-[clamp(5rem,15vw,13rem)] font-[620] leading-[0.85] tracking-[-0.06em]">{SHOPS}+</p>
        <p className="mt-3 text-[1.5rem]">{scenes.proof.label}</p>
        <p className="mt-4 max-w-[52ch] text-white/75">{scenes.proof.line}</p>
        <Link href="/work/shop-erp" className="ink-link is-under mt-5 inline-block">Read the Shop-ERP story →</Link>
      </div>
    </section>
  );
}
