"use client";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/portfolio";
import { home } from "@/data/studio";
import { PAD, Reveal } from "../primitives";
import { Doodle, Note, Pen } from "./Pen";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

// ============================================================
// Work — four projects shown big, in colour, then a short list
// of everything else. Right-hand cards sit lower (md+) so the
// grid reads like a spread, not a template.
// ============================================================
export default function HomeWork() {
  return (
    <section id="work" data-nav="light" aria-labelledby="work-title" className="pb-[clamp(5rem,10vw,9rem)] pt-[clamp(3rem,6vw,5rem)]">
      <div className={`mx-auto max-w-[1440px] ${PAD}`}>
        <div className="flex items-end justify-between gap-6 border-b border-[var(--line-2)] pb-5">
          <h2 id="work-title" className="wide text-[clamp(1.9rem,3.6vw,3.5rem)] font-[560] leading-none tracking-[-0.045em]">Selected work</h2>
          <p className="pb-1 text-[14px] text-[var(--mute)]">2024 – now</p>
        </div>

        <div className="mt-[clamp(5.25rem,7vw,6.5rem)] grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,4.5rem)] gap-y-[clamp(3.5rem,7vw,6rem)] md:grid-cols-2">
          {home.featured.map((f, i) => (
            <Reveal key={f.id} delay={(i % 2) * 0.08} className={i % 2 ? "md:mt-[clamp(5rem,11vw,10rem)]" : ""}>
              <Card f={f} p={byId[f.id]} note={i === 0} />
            </Reveal>
          ))}
        </div>

        {/* everything else */}
        <div className="mt-[clamp(5.5rem,11vw,10rem)] grid grid-cols-12 gap-x-[clamp(1rem,3vw,3rem)] gap-y-6">
          <div className="col-span-12 md:col-span-4">
            <h3 className="wide text-[clamp(1.35rem,1.9vw,1.85rem)] font-[560] leading-none tracking-[-0.04em]">More work</h3>
            <p className="mt-3 max-w-[30ch] text-[15px] leading-[1.5] text-[var(--mute)]">Products, client sites and a few experiments.</p>
          </div>
          <ul className="col-span-12 border-t border-[var(--line-2)] md:col-span-8">
            {home.more.map((m) => {
              const p = byId[m.id];
              return (
                <li key={m.id} className="border-b border-[var(--line-2)]">
                  <Link href={`/work/${m.id}`}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-[1.05rem] md:grid-cols-[11.5rem_1fr_auto] md:py-[1.3rem]">
                    <span className="stretchy text-[clamp(1.12rem,1.4vw,1.35rem)] font-[540] leading-tight tracking-[-0.03em]">{p.name}</span>
                    <span className="col-span-2 row-start-2 text-[15px] leading-[1.45] text-[var(--mute)] md:col-span-1 md:row-start-auto">{m.line}</span>
                    <span className="col-start-2 row-start-1 flex items-center gap-2 whitespace-nowrap text-[13px] text-[var(--mute)] md:col-start-auto md:row-start-auto">
                      {m.kind}
                      <svg viewBox="0 0 16 16" className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Card({ f, p, note }) {
  const src = p.cover || p.image;
  return (
    <div className="relative">
      {note && (
        <Doodle className="pointer-events-none absolute -top-[clamp(3.9rem,5vw,4.7rem)] right-[2%] z-10 flex items-end gap-1 text-[var(--ink-2)]" style={{ "--d": "0.3s" }}>
          <Note r={-4} d="0.3s" className="text-[clamp(1.15rem,1.5vw,1.4rem)]">300+ shops pay for this one</Note>
          <Pen mark="arrowDown" className="-mb-7 h-[3.4rem] w-auto" />
        </Doodle>
      )}
      <Link href={`/work/${p.id}`} className="group block">
        <div className={`relative aspect-[16/10] overflow-hidden rounded-[4px] bg-[#0d0d0d] ${f.flat ? "p-[5%]" : ""}`}>
          <div className={`relative h-full w-full overflow-hidden ${f.flat ? "rounded-[3px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]" : ""}`}>
            <Image src={src} alt={`${p.name}: ${p.subtitle}`} fill sizes="(min-width: 768px) 46vw, 100vw"
              className="object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h3 className="stretchy text-[clamp(1.4rem,2vw,1.95rem)] font-[560] leading-none tracking-[-0.04em]">
            <span className="ink-link">{p.name}</span>
          </h3>
          <span className="whitespace-nowrap text-[13px] text-[var(--mute)]">{f.kind}</span>
        </div>
        <p className="mt-2.5 max-w-[44ch] text-[15.5px] leading-[1.5] text-[var(--mute)]">{f.line}</p>
      </Link>
    </div>
  );
}
