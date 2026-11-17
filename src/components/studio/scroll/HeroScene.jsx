"use client";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { scenes } from "@/data/studio";
import { PAD, useReduceAfterMount } from "../primitives";
import { easeInOut, easeOut, seg } from "./ease";

const SHOP = "/assets/work/covers/shop-erp.webp";
const SHOPS = 300;

// ============================================================
// Opening scene (pinned). A sentence with two image pills in it.
// Scrolling grows the Shop-ERP pill to fill the screen, then a
// counter runs to 300 while one dot lights up per paying shop.
//   0.00–0.07 hold · 0.07–0.36 expand · 0.36–0.46 darken
//   0.46–0.80 count · 0.80–1.00 hold
// ============================================================
export default function HeroScene() {
  const reduce = useReduceAfterMount();
  const section = useRef(null);
  const stage = useRef(null);
  const pill = useRef(null);
  const canvas = useRef(null);
  const geo = useRef({ x: 0, y: 0, w: 0, h: 0, W: 1, H: 1 });
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  // where the pill sits inside the stage (re-measured while the scene is at rest)
  const measure = useCallback(() => {
    const s = stage.current?.getBoundingClientRect();
    const r = pill.current?.getBoundingClientRect();
    if (!s || !r || !r.width) return;
    geo.current = { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height, W: s.width, H: s.height };
  }, []);

  const t = useTransform(p, (v) => easeInOut(seg(v, 0.07, 0.36)));
  // transform + clip only (no width/height animation, so no layout shift):
  // the full-screen layer is shrunk onto the pill, then released to fill the stage
  const clip = useTransform(t, (k) => {
    const g = geo.current, q = 1 - k;
    if (!g.w) return "inset(50% 50% 50% 50%)";
    return `inset(${g.y * q}px ${(g.W - g.x - g.w) * q}px ${(g.H - g.y - g.h) * q}px ${g.x * q}px round ${(g.h / 2) * q ** 1.6}px)`;
  });
  const fit = () => { const g = geo.current; return g.w ? Math.max(g.w / g.W, g.h / g.H) : 1; };
  const innerScale = useTransform(t, (k) => fit() + (1 - fit()) * k);
  const innerX = useTransform(t, (k) => (geo.current.x + geo.current.w / 2 - geo.current.W / 2) * (1 - k));
  const innerY = useTransform(t, (k) => (geo.current.y + geo.current.h / 2 - geo.current.H / 2) * (1 - k));
  const imgScale = useTransform(t, (k) => 1.18 - 0.18 * k);
  const shown = useTransform(p, (v) => (v > 0.068 ? 1 : 0));
  const pillOpacity = useTransform(shown, (v) => 1 - v);
  const heroOpacity = useTransform(p, [0.12, 0.3], [1, 0]);
  const hint = useTransform(p, [0, 0.04], [1, 0]);
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
    const late = setTimeout(measure, 2600); // after the headline's widening entrance
    draw(count.get());
    return () => { ro.disconnect(); clearTimeout(late); };
  }, [measure, draw, count]);

  if (reduce) return <StaticHero />;

  return (
    <section id="top" ref={section} data-nav="light" aria-label="Introduction" className="relative h-[260svh] md:h-[300svh]">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the sentence */}
        <motion.div style={{ opacity: heroOpacity }} className={`absolute inset-0 z-10 mx-auto flex max-w-[1440px] flex-col justify-center pt-16 ${PAD}`}>
          <p className="lift text-[14px] text-[var(--mute)]">Product designer &amp; engineer · Bharuch, India</p>
          <h1 className="wide breathe mt-6 text-[clamp(2.65rem,8.2vw,9.2rem)] font-[560] leading-[1.02] tracking-[-0.05em]">
            Hi, I’m Krishna<Pill src="/assets/work/profile.webp" pos="50% 42%" w="1.7em" alt="" />.
            <br className="hidden md:block" />{" "}
            I design software,
            <br className="hidden md:block" />{" "}
            then I build&nbsp;it<Pill ref={pill} src={SHOP} pos="50% 42%" w="2.6em" alt="" zoom style={{ opacity: pillOpacity }} />.
          </h1>
        </motion.div>

        <motion.p style={{ opacity: hint }} aria-hidden="true"
          className={`absolute bottom-6 left-0 right-0 z-10 mx-auto flex max-w-[1440px] items-center justify-between text-[13px] text-[var(--mute)] ${PAD}`}>
          <span className="flex items-center gap-3"><span className="relative block h-8 w-px overflow-hidden bg-[var(--line-2)]"><span className="scroll-hint absolute inset-0 bg-[var(--ink)]" /></span>Scroll</span>
          <span>Open to product roles · remote or relocation</span>
        </motion.p>

        {/* the pill, growing to fill the screen */}
        <motion.div aria-hidden="true" className="absolute inset-0 z-20" style={{ clipPath: clip, opacity: shown }}>
          <motion.div className="absolute inset-0 overflow-hidden bg-[#0d0d0d]" style={{ x: innerX, y: innerY, scale: innerScale }}>
            <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
              <Image src={SHOP} alt="" fill sizes="100vw" className="object-contain object-[50%_42%] md:object-cover" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-0 bg-[#050505]" style={{ opacity: shade }} />
        </motion.div>

        {/* 300 shops */}
        <motion.div style={{ opacity: proof, y: proofY, pointerEvents: proofEvents }}
          className={`absolute inset-0 z-30 mx-auto flex max-w-[1440px] flex-col justify-end pb-[clamp(2rem,7svh,5rem)] pt-24 text-white ${PAD}`}>
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

const Pill = forwardRef(function Pill({ src, pos, w, alt, style, zoom }, ref) {
  return (
    <motion.span ref={ref} style={{ width: w, ...style }}
      className="relative ml-[0.14em] mr-[0.05em] inline-block h-[0.8em] translate-y-[0.06em] overflow-hidden rounded-full bg-[#0d0d0d] align-baseline">
      <Image src={src} alt={alt} fill sizes="320px" priority className={`object-cover ${zoom ? "scale-[1.18]" : ""}`} style={{ objectPosition: pos }} />
    </motion.span>
  );
});

// reduced motion: the same story without pinning or growth
function StaticHero() {
  return (
    <section id="top" data-nav="light" aria-label="Introduction">
      <div className={`mx-auto max-w-[1440px] pb-16 pt-36 ${PAD}`}>
        <p className="text-[14px] text-[var(--mute)]">Product designer &amp; engineer · Bharuch, India</p>
        <h1 className="wide mt-6 text-[clamp(2.15rem,6.3vw,7rem)] font-[560] leading-[1.04] tracking-[-0.045em]">
          Hi, I’m Krishna<Pill src="/assets/work/profile.webp" pos="50% 42%" w="1.7em" alt="" />. I design software, then I build&nbsp;it<Pill src={SHOP} pos="50% 50%" w="2.3em" alt="" />.
        </h1>
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

