"use client";
import { useRef } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { process } from "@/data/studio";
import { Arrow, Label, MaskLines, PAD, Reveal, useReduceAfterMount } from "./primitives";

// Five steps as a plain list. Each title turns black while it
// sits in the middle band of the viewport; the rest stay grey.
function Step({ s }) {
  const ref = useRef(null);
  const reduce = useReduceAfterMount();
  const inBand = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const on = reduce || inBand;
  return (
    <li ref={ref} className="grid grid-cols-12 gap-x-4 gap-y-4 border-t border-[var(--line-2)] py-[clamp(1.5rem,3vw,2.75rem)]">
      <span className="col-span-12 text-[12.5px] text-[var(--mute)] tnum md:col-span-2">[ {s.n} ]</span>
      <h3 className={`col-span-12 text-[clamp(2.6rem,6.6vw,6.6rem)] font-medium leading-[0.86] tracking-[-0.065em] transition-colors duration-700 md:col-span-5 ${
        on ? "text-[var(--ink)]" : "text-[#8C8C8C]"}`}>
        {s.title}
      </h3>
      <div className="col-span-12 self-end md:col-span-5">
        <p className="max-w-[38ch] text-[clamp(1rem,1.25vw,1.15rem)] leading-snug text-[var(--ink-2)]">{s.body}</p>
        <Link href={s.href} className="group mt-4 inline-flex items-baseline gap-2 border-b border-[var(--ink)] pb-0.5 text-[14px] font-medium">
          {s.proof}
          <Arrow className="h-3.5 w-3.5 shrink-0 translate-y-[2px] transition-transform duration-500 group-hover:rotate-45" />
        </Link>
      </div>
    </li>
  );
}

export default function Process() {
  return (
    <section id="process" data-nav="light" aria-label="How I work" className={`scroll-mt-16 py-[clamp(5rem,10vw,9rem)] ${PAD}`}>
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-6 pb-[clamp(2rem,4vw,3.5rem)]">
          <div className="col-span-12 md:col-span-8">
            <Label n="05">Process</Label>
            <MaskLines lines={["How I work"]} className="mt-4 text-[clamp(3rem,8.4vw,8.4rem)] font-medium leading-[0.86] tracking-[-0.065em]" />
          </div>
          <Reveal className="col-span-12 max-w-[34ch] pb-2 text-[15px] leading-snug text-[var(--mute)] md:col-span-4">
            Five steps, one person on every one of them. Each step links to the project that proves it.
          </Reveal>
        </div>
        <ol className="border-b border-[var(--line-2)]">
          {process.map((s) => <Step key={s.n} s={s} />)}
        </ol>
      </div>
    </section>
  );
}
