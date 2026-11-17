"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Arrow, Label, LocalTime, PAD, Roll, pill, useScrollTo } from "./primitives";

// ============================================================
// Hero — white page, one statement, the name set across the
// full width at the bottom. CSS entrance (.settle / .lift) so the
// name paints on the first frame (it's the LCP element).
// ============================================================
export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);

  return (
    <section id="top" ref={ref} data-nav="light" aria-label="Introduction"
      className="grid-rules relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-[clamp(0.75rem,1.6vw,1.5rem)] pt-[clamp(7rem,15vh,9.5rem)]">
      <div className={`mx-auto grid w-full max-w-[1920px] grid-cols-12 gap-x-4 gap-y-6 ${PAD}`}>
        <div className="lift col-span-12 md:col-span-3">
          <Label>Bharuch, India</Label>
          <p className="mt-1 text-[12.5px] uppercase text-[var(--mute)]"><LocalTime /></p>
        </div>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <p className="lift max-w-[30ch] text-[clamp(1.6rem,3.15vw,3.1rem)] font-medium leading-[1.06] tracking-[-0.038em]" style={{ animationDelay: "0.08s" }}>
            I design and build software products end to end, from the first user interview to production.{" "}
            <span className="text-[var(--dim)]">Today more than 300 shops close their month on one of them.</span>
          </p>
          <div className="lift mt-[clamp(1.75rem,3vw,2.5rem)] flex flex-wrap gap-3" style={{ animationDelay: "0.18s" }}>
            <a href="#work" onClick={(e) => { if (scrollTo("#work")) e.preventDefault(); }} className={pill.dark}>
              <Roll>See selected work</Roll><Arrow className="h-4 w-4" dir="se" />
            </a>
            <Link href="/island" className={pill.line}>
              <Roll>Explore the island</Roll><Arrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <motion.div style={{ y: nameY }} className={`mx-auto w-full max-w-[1920px] ${PAD}`}>
        <div className="lift mb-[clamp(0.5rem,1.4vw,1.25rem)] grid grid-cols-12 items-end gap-x-4" style={{ animationDelay: "0.26s" }}>
          <p className="col-span-6 flex items-center gap-2 text-[12.5px] font-medium uppercase md:col-span-3">
            <span className="relative flex h-2 w-2"><span className="pulse-dot absolute inset-0 rounded-full bg-[var(--ink)]" /></span>
            Open to work
          </p>
          <p className="col-span-6 hidden text-[12.5px] uppercase text-[var(--mute)] md:col-span-4 md:block">Remote · pan-India · relocation</p>
          <div className="col-span-6 flex justify-end md:col-span-2 md:col-start-11">
            <div className="relative aspect-[4/5] w-[clamp(4.5rem,8.5vw,8.5rem)] overflow-hidden bg-[var(--line)]">
              <Image src="/assets/work/profile.webp" alt="Krishna Mehta" fill priority sizes="140px" className="object-cover object-[50%_35%] grayscale" />
            </div>
          </div>
        </div>
        <h1 className="overflow-hidden">
          <span className="settle block whitespace-nowrap text-[15.8vw] font-medium leading-[0.8] md:text-[16.9vw] tracking-[-0.065em] min-[1920px]:text-[324px]">
            Krishna Mehta
          </span>
        </h1>
      </motion.div>
    </section>
  );
}
