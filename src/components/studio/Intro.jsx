"use client";
import { useRef } from "react";
import {
  motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring,
  useTransform, useVelocity,
} from "framer-motion";
import { marqueeWords, manifesto, stats } from "@/data/studio";
import { Asterisk, CountUp, Label, PAD, Reveal } from "./primitives";

const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };

// ---- marquee whose speed + direction follow the scroll velocity ----
export function VelocityMarquee({ words = marqueeWords, base = 2.6, className = "", reverse = false, size = "big" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 4], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);
  const box = useRef(null);
  const visible = useInView(box, { margin: "100px 0px" });

  useAnimationFrame((_, delta) => {
    if (reduce || !visible) return;
    let move = dir.current * -base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1; else if (f > 0) dir.current = reverse ? -1 : 1;
    move += dir.current * -base * Math.abs(f) * (delta / 1000);
    x.set(x.get() + move);
  });

  const text = size === "big"
    ? "text-[clamp(2.6rem,7.4vw,7rem)] tracking-[-0.05em]"
    : "text-[clamp(1.3rem,2.6vw,2.2rem)] tracking-[-0.03em]";
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w + i} className={`flex items-center font-medium leading-[1.05] ${text}`}>
          {w}
          <Asterisk className="mx-[0.38em] h-[0.42em] w-[0.42em] text-[var(--dim)]" />
        </span>
      ))}
    </div>
  );
  return (
    <div ref={box} className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div className="flex w-max" style={{ x: tx }}>
        {row}{row}
      </motion.div>
    </div>
  );
}

// ---- manifesto: words darken from grey to black as it scrolls past ----
// The grey start (#8C8C8C) still clears 3:1 for large text.
function Word({ children, progress, range }) {
  const color = useTransform(progress, range, ["#8C8C8C", "#0A0A0A"]);
  return <motion.span className="rm-ink mr-[0.22em] inline-block" style={{ color }}>{children}</motion.span>;
}

export function Manifesto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const words = manifesto.split(" ");
  return (
    <section id="approach" data-nav="light" aria-label="Approach" className={`py-[clamp(5rem,11vw,10rem)] ${PAD}`}>
      <div className="mx-auto grid max-w-[1920px] grid-cols-12 gap-x-4 gap-y-6">
        <Label n="01" className="col-span-12 md:col-span-3">Approach</Label>
        <p ref={ref} className="relative col-span-12 max-w-[34ch] text-[clamp(1.7rem,3.4vw,3.35rem)] font-medium leading-[1.08] tracking-[-0.038em] md:col-span-9 md:col-start-4">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1.5) / words.length]}>{w}</Word>
          ))}
        </p>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section aria-label="Numbers" data-nav="light" className={`pb-[clamp(5rem,10vw,9rem)] ${PAD}`}>
      <dl className="mx-auto grid max-w-[1920px] grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-12">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className={`border-t border-[var(--ink)] pt-4 md:col-span-3 ${i === 0 ? "md:col-start-1" : ""}`}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix}
                className="block text-[clamp(2.8rem,6vw,5.6rem)] font-medium leading-[0.9] tracking-[-0.06em]" />
              <span className="mt-3 block text-[15px] font-medium">{s.label}</span>
              <span className="block text-[13.5px] text-[var(--mute)]">{s.note}</span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
