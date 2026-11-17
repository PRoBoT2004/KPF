"use client";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { scenes } from "@/data/studio";
import { PAD, useReduceAfterMount } from "../primitives";
import { easeInOut, seg } from "./ease";

// ============================================================
// The island door (pinned). A small window onto the 3D island
// opens up to fill the screen, then invites you in.
//   0.00–0.08 hold · 0.08–0.55 open · 0.55–1.00 "walk in"
// ============================================================
export default function IslandScene() {
  const reduce = useReduceAfterMount();
  const section = useRef(null);
  const stage = useRef(null);
  const slot = useRef(null);
  const geo = useRef({ x: 0, y: 0, w: 0, h: 0, W: 1, H: 1 });
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  const measure = useCallback(() => {
    const s = stage.current?.getBoundingClientRect();
    const r = slot.current?.getBoundingClientRect();
    if (!s || !r || !r.width) return;
    geo.current = { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height, W: s.width, H: s.height };
  }, []);

  const t = useTransform(p, (v) => easeInOut(seg(v, 0.08, 0.55)));
  const clip = useTransform(t, (k) => {
    const g = geo.current, q = 1 - k;
    if (!g.w) return "inset(30% 30% 30% 30% round 28px)";
    return `inset(${g.y * q}px ${(g.W - g.x - g.w) * q}px ${(g.H - g.y - g.h) * q}px ${g.x * q}px round ${28 * q}px)`;
  });
  const imgScale = useTransform(t, [0, 1], [1.25, 1]);
  const intro = useTransform(p, [0.06, 0.2], [1, 0]);
  const shade = useTransform(p, [0.45, 0.66], [0, 0.5]);
  const outro = useTransform(p, [0.56, 0.7], [0, 1]);
  const outroY = useTransform(p, [0.56, 0.72], [36, 0]);
  const outroEvents = useTransform(outro, (v) => (v > 0.5 ? "auto" : "none"));

  useMotionValueEvent(p, "change", (v) => {
    if (v < 0.08) measure();
    if (section.current) section.current.dataset.nav = v > 0.4 && v < 0.995 ? "dark" : "light";
  });
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, [measure]);

  if (reduce) {
    return (
      <section data-nav="dark" aria-labelledby="island-title" className="relative overflow-hidden bg-[#0a0a0a] text-white">
        <Image src="/studio/art/island.webp" alt="" fill sizes="100vw" className="object-cover opacity-60" />
        <div className={`relative mx-auto max-w-[1440px] py-32 ${PAD}`}><Outro /></div>
      </section>
    );
  }

  return (
    <section ref={section} data-nav="light" aria-labelledby="island-title" className="relative h-[220svh]">
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* invitation around the closed window */}
        <motion.div style={{ opacity: intro }} className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-[clamp(1.25rem,3svh,2rem)] text-center ${PAD}`}>
          <p className="wide max-w-[18ch] text-[clamp(1.8rem,4.2vw,4.4rem)] font-[580] leading-[0.95] tracking-[-0.05em]">{scenes.island.kicker}</p>
          <div ref={slot} className="aspect-[4/3] w-[86vw] md:aspect-[16/10] md:w-[min(40vw,640px)]" />
          <p className="max-w-[44ch] text-[15.5px] leading-[1.55] text-[var(--mute)]">{scenes.island.body}</p>
        </motion.div>

        {/* the island, through a window that opens */}
        <motion.div aria-hidden="true" className="absolute inset-0 z-20 overflow-hidden bg-[#9fc7e8]" style={{ clipPath: clip }}>
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            <Image src="/studio/art/island.webp" alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <motion.div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_60%,rgba(0,0,0,0.15),rgba(0,0,0,0.75))]" style={{ opacity: shade }} />
        </motion.div>

        <motion.div style={{ opacity: outro, y: outroY, pointerEvents: outroEvents }}
          className={`absolute inset-0 z-30 mx-auto flex max-w-[1440px] flex-col items-center justify-center text-center text-white ${PAD}`}>
          <Outro />
        </motion.div>
      </div>
    </section>
  );
}

function Outro() {
  return (
    <>
      <h2 id="island-title" className="wide text-[clamp(2.8rem,9vw,9.5rem)] font-[600] leading-[0.86] tracking-[-0.06em]">Walk the island.</h2>
      <p className="mx-auto mt-5 max-w-[42ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.5] text-white/80">Same work, played as a game. Day and night follow the time in India.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link href="/island"
          className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 text-[15px] font-medium text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]">
          Enter the island
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">→</span>
        </Link>
        <Link href="/world" className="ink-link is-under text-[15px] text-white/85">or the pixel version</Link>
      </div>
    </>
  );
}
