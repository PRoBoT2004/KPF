"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { projects } from "@/data/portfolio";
import { home, scenes } from "@/data/studio";
import { PAD, useFinePointer, useReduceAfterMount } from "../primitives";
import { KineticText } from "./Kinetic";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
const MORE = home.more.filter((m) => scenes.more.includes(m.id));

// ============================================================
// Selected work — project cards that pin and stack as you scroll
// (each one settles, the next slides over it and the one below
// shrinks back). Then a short list of everything else with an
// image that follows the cursor.
// ============================================================
export default function WorkStack() {
  const deck = useRef(null);
  const reduce = useReduceAfterMount();
  const { scrollYProgress } = useScroll({ target: deck, offset: ["start start", "end end"] });
  const cards = scenes.cards;
  const n = cards.length;

  return (
    <section id="work" data-nav="light" aria-labelledby="work-title" className="relative">
      <div className={`mx-auto max-w-[1440px] pb-[clamp(1rem,3vw,2rem)] pt-[clamp(6rem,13vw,11rem)] ${PAD}`}>
        <div className="border-b border-[var(--line-2)] pb-5">
          <p className="mb-4 flex justify-between text-[14px] text-[var(--mute)]"><span>Products and client work</span><span>2024 – now</span></p>
          <KineticText id="work-title" className="whitespace-nowrap text-[clamp(2.3rem,9.4vw,9rem)] font-[580] leading-[0.9] tracking-[-0.055em]">
            Selected work
          </KineticText>
        </div>
      </div>

      <div ref={deck} className="relative">
        {cards.map((c, i) => (
          <CardSlot key={c.id} c={c} p={byId[c.id]} i={i} n={n} progress={scrollYProgress} reduce={reduce} />
        ))}
      </div>

      <MoreWork />
    </section>
  );
}

function CardSlot({ c, p, i, n, progress, reduce }) {
  const slot = useRef(null);
  const { scrollYProgress: enter } = useScroll({ target: slot, offset: ["start end", "start start"] });
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const dim = useTransform(progress, [i / n, Math.min(1, (i + 1.2) / n)], [0, i === n - 1 ? 0 : 0.45]);
  const imgScale = useTransform(enter, [0, 1], [1.22, 1]);
  const src = p.cover || p.image;

  return (
    <div ref={slot} className="sticky top-0 flex h-[100svh] items-center justify-center">
      <motion.article
        style={reduce ? undefined : { scale, top: `calc(${i * 16}px - 2svh)` }}
        className={`relative mx-[clamp(0.75rem,2vw,2rem)] flex h-[84svh] w-full max-w-[1400px] origin-top flex-col overflow-hidden rounded-[clamp(22px,2.4vw,36px)] bg-[#0b0b0b] text-white md:flex-row`}>
        <div className="flex flex-col justify-between gap-6 p-[clamp(1.4rem,3vw,3rem)] md:w-[42%]">
          <div className="flex items-center justify-between text-[13px] text-white/55">
            <span>{c.kind}</span>
            <span className="tnum">0{i + 2} / 0{n + 1}</span>
          </div>
          <div>
            <h3 className="wide text-[clamp(2.3rem,5vw,5.2rem)] font-[580] leading-[0.92] tracking-[-0.055em]">{p.name}</h3>
            <p className="mt-4 max-w-[38ch] text-[clamp(0.98rem,1.2vw,1.15rem)] leading-[1.5] text-white/70">{c.line}</p>
          </div>
          <div className="hidden md:block">
            <ul className="flex flex-wrap gap-2 text-[13px] text-white/80">
              {c.facts.map((f) => <li key={f} className="rounded-full border border-white/15 px-3 py-1.5">{f}</li>)}
            </ul>
            <CaseLink id={p.id} className="mt-7" />
          </div>
        </div>

        <Link href={`/work/${p.id}`} aria-label={`${p.name} case study`}
          className="group relative m-2 mt-0 flex-1 overflow-hidden rounded-[clamp(16px,1.8vw,28px)] bg-[#141414] md:m-3 md:ml-0">
          <motion.div className={`absolute inset-0 ${c.flat ? "p-[6%]" : ""}`} style={reduce ? undefined : { scale: imgScale }}>
            <div className={`relative h-full w-full overflow-hidden ${c.flat ? "rounded-[6px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]" : ""}`}>
              <Image src={src} alt={`${p.name}: ${p.subtitle}`} fill sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]" />
            </div>
          </motion.div>
          <span className="absolute bottom-4 left-4 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-black md:hidden">Read the case study ↗</span>
        </Link>

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={reduce ? { opacity: 0 } : { opacity: dim }} />
      </motion.article>
    </div>
  );
}

function CaseLink({ id, className = "" }) {
  return (
    <Link href={`/work/${id}`}
      className={`group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14.5px] font-medium text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] ${className}`}>
      Read the case study
      <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-px group-hover:translate-x-0.5">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
      </span>
    </Link>
  );
}

// ------------------------------------------------------------
function MoreWork() {
  const list = useRef(null);
  const fine = useFinePointer();
  const [active, setActive] = useState(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  const move = (e) => {
    const r = list.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const cur = active && byId[active];

  return (
    <div className={`mx-auto max-w-[1440px] pb-[clamp(5rem,10vw,9rem)] pt-[clamp(5rem,10vw,9rem)] ${PAD}`}>
      <div className="grid grid-cols-12 gap-x-[clamp(1rem,3vw,3rem)] gap-y-8">
        <div className="col-span-12 md:col-span-4">
          <h3 className="wide text-[clamp(1.6rem,2.6vw,2.6rem)] font-[580] leading-none tracking-[-0.045em]">More work</h3>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-[1.5] text-[var(--mute)]">Products, client sites and a few experiments.</p>
        </div>
        <div ref={list} onMouseMove={fine ? move : undefined} onMouseLeave={() => setActive(null)} className="relative col-span-12 md:col-span-8">
          <ul className="border-t border-[var(--line-2)] [&:hover>li]:opacity-45 [&>li:hover]:!opacity-100">
            {MORE.map((m) => (
              <li key={m.id} className="border-b border-[var(--line-2)] transition-opacity duration-300" onMouseEnter={() => setActive(m.id)}>
                <Link href={`/work/${m.id}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1.5 py-[1.1rem] md:py-[1.35rem]">
                  <span className="stretchy text-[clamp(1.3rem,2.2vw,2.15rem)] font-[560] leading-none tracking-[-0.04em]">{byId[m.id].name}</span>
                  <span className="text-[13px] text-[var(--mute)]">{m.kind}</span>
                  <span className="col-span-2 text-[14.5px] leading-[1.45] text-[var(--mute)]">{m.line}</span>
                </Link>
              </li>
            ))}
          </ul>

          {fine && (
            <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 w-[clamp(220px,22vw,340px)]" style={{ x: sx, y: sy, translateX: "-50%", translateY: "-110%" }}>
              <AnimatePresence>
                {cur && (
                  <motion.div key={cur.id} initial={{ opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#111] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)]">
                    <Image src={cur.cover || cur.image} alt="" fill sizes="340px" className="object-cover object-top" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
