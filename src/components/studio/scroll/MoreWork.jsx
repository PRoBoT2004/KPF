"use client";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { projects } from "@/data/portfolio";
import { home, scenes } from "@/data/studio";
import { PAD, useFinePointer, useReduceAfterMount } from "../primitives";
import { KineticText } from "./Kinetic";
import { easeOut, seg } from "./ease";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
const MORE = home.more.filter((m) => scenes.more.includes(m.id));
// how each card lies in the pile before it is dealt (degrees, px)
const PILE = [[-9, -14, 8], [6, 10, -6], [-3, -6, -10], [11, 14, 4], [-12, -10, 12], [4, 6, -4], [-6, 12, 10], [8, -12, -8]];

// ============================================================
// More work: the rest of the projects arrive as a pile of
// cards that deals itself out into a grid as you scroll in.
// Each card tilts towards the cursor. The last tile is the
// one-page version (the résumé).
// ============================================================
export default function MoreWork() {
  const grid = useRef(null);
  const reduce = useReduceAfterMount();
  const fine = useFinePointer();
  const geo = useRef([]);
  const tick = useMotionValue(0);
  const { scrollYProgress: k } = useScroll({ target: grid, offset: ["start 0.92", "start 0.18"] });
  const count = MORE.length + 1;

  // distance from each card to the middle of the grid, where the pile sits
  const measure = useCallback(() => {
    const g = grid.current;
    if (!g) return;
    const cx = g.offsetWidth / 2, cy = g.offsetHeight / 2;
    geo.current = [...g.children].map((el) => ({ dx: cx - (el.offsetLeft + el.offsetWidth / 2), dy: cy - (el.offsetTop + el.offsetHeight / 2) }));
    tick.set(tick.get() + 1);
  }, [tick]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (grid.current) ro.observe(grid.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <section data-nav="light" aria-labelledby="more-title"
      className="relative z-10 -mt-[clamp(1.5rem,3vw,2.75rem)] overflow-x-clip rounded-t-[clamp(1.5rem,3vw,2.75rem)] bg-white">
      <div className={`mx-auto max-w-[1440px] pb-[clamp(5rem,10vw,9rem)] pt-[clamp(5rem,10vw,9rem)] ${PAD}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-[var(--line-2)] pb-6">
          <KineticText id="more-title" className="text-[clamp(2.6rem,7vw,7rem)] font-[600] leading-[0.9] tracking-[-0.055em]">
            More work
          </KineticText>
          <p className="max-w-[34ch] text-[15px] leading-[1.5] text-[var(--mute)]">
            Nine more: two products, my studio, three client sites, a design study and two experiments.
          </p>
        </div>

        <div ref={grid} className="relative mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-2 gap-[clamp(0.6rem,1.4vw,1.25rem)] lg:grid-cols-4">
          {MORE.map((m, i) => (
            <Dealt key={m.id} i={i} n={count} k={k} geo={geo} tick={tick} reduce={reduce}>
              <Card m={m} p={byId[m.id]} tilt={fine && !reduce} />
            </Dealt>
          ))}
          <Dealt i={MORE.length} n={count} k={k} geo={geo} tick={tick} reduce={reduce} className="lg:col-span-3">
            <ResumeTile />
          </Dealt>
        </div>
      </div>
    </section>
  );
}

function Dealt({ i, n, k, geo, tick, reduce, children, className = "" }) {
  const [rot, jx, jy] = PILE[i % PILE.length];
  // the top card of the pile goes first; each one starts a beat later
  const t = useTransform([k, tick], ([v]) => easeOut(seg(v, i * 0.045, 0.5 + i * 0.045)));
  const x = useTransform(t, (q) => ((geo.current[i]?.dx ?? 0) + jx) * (1 - q));
  const y = useTransform(t, (q) => ((geo.current[i]?.dy ?? 0) + jy) * (1 - q));
  const rotate = useTransform(t, (q) => rot * (1 - q));
  const scale = useTransform(t, (q) => 0.9 + 0.1 * q);
  return (
    <motion.div style={reduce ? undefined : { x, y, rotate, scale, zIndex: n - i }} className={`relative ${className}`}>
      {children}
    </motion.div>
  );
}

function Card({ m, p, tilt }) {
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const leave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div style={tilt ? { rotateX: srx, rotateY: sry, transformPerspective: 900 } : undefined}
      onMouseMove={tilt ? move : undefined} onMouseLeave={tilt ? leave : undefined} className="h-full">
      <Link href={`/work/${m.id}`}
        className="group flex h-full flex-col rounded-[clamp(16px,1.6vw,24px)] bg-[#f2f2f0] p-[clamp(0.4rem,0.6vw,0.55rem)] transition-[background-color,box-shadow] duration-500 hover:bg-[#ececea] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[clamp(11px,1.2vw,18px)] bg-[#111]">
          <Image src={p.cover || p.image} alt={`${p.name}: ${p.subtitle}`} fill sizes="(min-width: 1024px) 24vw, 48vw"
            className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-medium text-black backdrop-blur-sm md:left-3 md:top-3 md:text-[12px]">{m.kind}</span>
          <span aria-hidden="true" className="absolute bottom-3 right-3 hidden h-9 w-9 translate-y-2 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 md:grid">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
          </span>
        </div>
        <div className="flex flex-1 flex-col px-[clamp(0.35rem,0.8vw,0.75rem)] pb-[clamp(0.5rem,0.9vw,0.8rem)] pt-[clamp(0.7rem,1.1vw,1rem)]">
          <span className="stretchy text-[clamp(1.05rem,1.5vw,1.45rem)] font-[600] leading-[1.05] tracking-[-0.035em]">{p.name}</span>
          <span className="mt-1.5 line-clamp-3 text-[13px] leading-[1.45] text-[var(--mute)] md:text-[14px]">{m.line}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function ResumeTile() {
  return (
    <div className="flex h-full min-h-[14rem] flex-col justify-between rounded-[clamp(16px,1.6vw,24px)] bg-[#0b0b0b] p-[clamp(1rem,2vw,2rem)] text-white">
      <p className="text-[13px] text-white/55">The short version</p>
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
        <p className="wide max-w-[14ch] text-[clamp(1.5rem,2.6vw,2.6rem)] font-[600] lg:max-w-none lg:text-[clamp(2.6rem,4.4vw,4.4rem)] leading-[0.95] tracking-[-0.05em]">All of it, on one page.</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] lg:mt-0 lg:shrink-0">
          <Link href="/resume" className="group inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 font-medium text-black">
            Résumé
            <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-white transition-transform duration-500 group-hover:translate-x-0.5">→</span>
          </Link>
          <a href="/Krishna-Mehta-Resume.pdf" className="ink-link text-white/80">PDF</a>
        </div>
      </div>
    </div>
  );
}
