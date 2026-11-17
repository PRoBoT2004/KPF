"use client";
import Link from "next/link";
import Image from "next/image";
import { identity } from "@/data/portfolio";
import { home } from "@/data/studio";
import { PAD, useScrollTo } from "../primitives";
import { Doodle, Note, Pen } from "./Pen";

// ============================================================
// Hero — a hello, one honest sentence, and two real photo prints.
// Copy uses the CSS .lift entrance (transform only) so the
// headline paints on the first frame.
// ============================================================
export default function HomeHero() {
  const scrollTo = useScrollTo();
  return (
    <section id="top" data-nav="light" aria-label="Introduction"
      className="relative pb-[clamp(1.5rem,5vh,6rem)] pt-[clamp(7rem,17vh,10.5rem)] md:flex md:min-h-[100svh] md:flex-col md:justify-center md:pb-[clamp(2.5rem,7vh,5rem)] md:pt-[clamp(5.5rem,11vh,8rem)]">
      <div className={`mx-auto grid w-full max-w-[1440px] grid-cols-12 items-center gap-x-[clamp(1rem,3vw,3rem)] gap-y-10 ${PAD}`}>
        {/* words */}
        <div className="col-span-12 md:col-span-7">
          <p className="lift text-[14px] text-[var(--mute)]">{home.meta}</p>
          <h1 className="wide breathe mt-6 text-[clamp(2.1rem,4.95vw,5.3rem)] font-[560] leading-[1.03] tracking-[-0.04em]" style={{ animationDelay: "0.06s" }}>
            <span className="block">Hi, I’m Krishna.</span>
            <span className="block">I design software,</span>
            <Doodle as="span" className="relative inline-block">
              and then I build&nbsp;it.
              <Pen mark="underline" className="absolute -bottom-[0.1em] right-0 h-[0.2em] w-[52%]" style={{ "--d": "0.9s" }} width={2.2} />
            </Doodle>
          </h1>
          <p className="lift mt-[clamp(1.75rem,3.2vw,2.5rem)] max-w-[40ch] text-[clamp(1.08rem,1.35vw,1.3rem)] leading-[1.55] tracking-[-0.012em] text-[var(--ink-2)]" style={{ animationDelay: "0.14s" }}>
            {home.intro.split("co-own").map((part, i) => (i ? [<span key={i} className="whitespace-nowrap">co-own</span>, part] : part))}
          </p>
          <div className="lift mt-[clamp(2rem,3.4vw,2.75rem)] flex flex-wrap items-center gap-x-7 gap-y-4 text-[15px] font-medium" style={{ animationDelay: "0.2s" }}>
            <a href="#work" onClick={(e) => { if (scrollTo("#work")) e.preventDefault(); }}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--ink)] py-2 pl-5 pr-2 text-[var(--paper)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]">
              See the work
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" /></svg>
              </span>
            </a>
            <Link href="/resume" className="ink-link is-under">My résumé</Link>
            <a href={`mailto:${identity.email}`} className="ink-link is-under">Email me</a>
          </div>
        </div>

        {/* photos */}
        <Doodle className="relative col-span-12 mx-auto w-full max-w-[460px] md:col-span-5 md:max-w-none">
          <div className="relative ml-auto aspect-[5/6] w-[80%] md:w-[84%]">
            <figure className="print print-in absolute right-0 top-0 w-[56%]" style={{ "--tilt": "5deg", animationDelay: "0.35s" }}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e4dc]">
                <Image src="/assets/work/k4.webp" alt="Krishna by a lake, leaning on a railing" fill sizes="(min-width: 768px) 22vw, 40vw"
                  className="object-cover object-[50%_18%]" />
              </div>
            </figure>
            <figure className="print print-in absolute bottom-0 left-0 w-[70%]" style={{ "--tilt": "-3deg", animationDelay: "0.15s" }}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe2d3]">
                <Image src="/assets/work/profile.webp" alt="Krishna standing on a bridge at sunset" fill priority sizes="(min-width: 768px) 30vw, 60vw"
                  className="object-cover object-[50%_88%]" />
              </div>
            </figure>
          </div>
          {/* pen note pointing at the front print */}
          <div className="pointer-events-none absolute left-[1%] top-[3%] z-10 flex flex-col items-start text-[var(--ink-2)] md:left-[2%] md:top-[6%]" style={{ "--d": "1.1s" }}>
            <Note r={-6} d="1.1s" className="text-[clamp(1.3rem,1.8vw,1.65rem)]">that’s me</Note>
            <Pen mark="arrowDown" className="ml-[2.2rem] mt-1 h-[clamp(2.6rem,4vw,3.6rem)] w-auto -scale-x-100" />
          </div>
        </Doodle>
      </div>
    </section>
  );
}
