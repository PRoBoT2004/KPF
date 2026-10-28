"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { projects } from "@/data/portfolio";
import { featuredOrder } from "@/data/studio";
import { Arrow, EASE, Label, MaskLines, PAD, Reveal, disciplineLabel, useFinePointer } from "./primitives";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
const pad = (n) => String(n).padStart(2, "0");

// ============================================================
// Selected work — black frames on the white page. Images stay
// monochrome until pointed at (colour on touch devices).
// ============================================================
function FeaturedCard({ p, i, wide }) {
  return (
    <Reveal delay={wide ? 0 : (i % 2) * 0.08} className={wide ? "md:col-span-2" : ""}>
      <Link href={`/work/${p.id}`} aria-label={`${p.name}: ${p.subtitle}`}
        className="group block bg-[var(--dark)] p-[clamp(8px,0.9vw,14px)] text-[var(--on-dark)]">
        <div className={`relative overflow-hidden bg-[var(--dark-2)] ${wide ? "aspect-[16/10] md:aspect-[16/7.2]" : "aspect-[16/10]"}`}>
          <Image src={p.cover} alt="" fill sizes={wide ? "(min-width: 768px) 96vw, 100vw" : "(min-width: 768px) 48vw, 100vw"}
            className={`mono-img object-cover group-hover:scale-[1.03] ${wide ? "object-center" : "object-top"}`} />
          {p.stat && (
            <span className="absolute left-3 top-3 bg-[var(--on-dark)] px-2.5 py-1 text-[12px] font-medium text-[var(--ink)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              {p.stat.value} {p.stat.label}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-6 px-1 pb-1 pt-[clamp(0.8rem,1.2vw,1.1rem)]">
          <div className="min-w-0">
            <p className="text-[clamp(1.25rem,1.9vw,1.85rem)] font-medium leading-none tracking-[-0.035em]">{p.name}</p>
            <p className="mt-1.5 truncate text-[13.5px] text-[var(--on-dark-mute)]">{p.subtitle}</p>
          </div>
          <ul className="shrink-0 text-right text-[10.5px] uppercase leading-[1.45] text-[var(--on-dark-mute)]">
            {(p.tech || []).slice(0, 4).map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </Link>
    </Reveal>
  );
}

export function FeaturedWork() {
  const list = featuredOrder.map((id) => byId[id]).filter(Boolean);
  return (
    <section id="work" data-nav="light" aria-label="Selected work" className={`scroll-mt-16 pb-[clamp(4rem,8vw,7rem)] pt-[clamp(3rem,6vw,5rem)] ${PAD}`}>
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-6 pb-[clamp(1.5rem,3vw,2.5rem)]">
          <div className="col-span-12 md:col-span-8">
            <Label n="02">Selected work</Label>
            <MaskLines lines={["Selected work"]} className="mt-4 text-[clamp(3.2rem,10.4vw,10.5rem)] font-medium leading-[0.84] tracking-[-0.065em]" />
          </div>
          <Reveal className="col-span-12 max-w-[34ch] pb-2 text-[15px] leading-snug text-[var(--mute)] md:col-span-3 md:col-start-10">
            Products I own end to end under PrimeDigitals, and client sites I designed and built with UMM Digital.
          </Reveal>
        </div>
        <div className="grid gap-[clamp(10px,1.1vw,16px)] md:grid-cols-2">
          {list.map((p, i) => <FeaturedCard key={p.id} p={p} i={i} wide={i === 0} />)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Index — every project, filterable by discipline, with a
// floating preview that follows the cursor on desktop
// ============================================================
const FILTERS = [
  { key: "all", label: "All" },
  { key: "design", label: "Design" },
  { key: "engineering", label: "Engineering" },
];
const match = (p, f) => f === "all" || p.discipline === f || p.discipline === "both";

export function WorkIndex() {
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const list = useMemo(() => projects.filter((p) => match(p, filter)), [filter]);
  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.key, projects.filter((p) => match(p, f.key)).length])), []);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 170, damping: 22, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 170, damping: 22, mass: 0.5 });
  const showPreview = fine && !reduce;

  return (
    <section aria-label="All projects" data-nav="light" className={`relative pb-[clamp(5rem,10vw,9rem)] ${PAD}`}
      onPointerMove={showPreview ? (e) => { mx.set(e.clientX); my.set(e.clientY); } : undefined}>
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-5 border-b border-[var(--ink)] pb-5">
          <div className="col-span-12 md:col-span-6">
            <Label n="03">Index</Label>
            <h2 className="mt-3 text-[clamp(2.2rem,4.6vw,4.4rem)] font-medium leading-[0.9] tracking-[-0.055em]">Every project</h2>
          </div>
          <div role="tablist" aria-label="Filter projects by discipline" className="col-span-12 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:justify-end">
            {FILTERS.map((f) => (
              <button key={f.key} role="tab" type="button" aria-selected={filter === f.key} onClick={() => setFilter(f.key)}
                className={`relative pb-1 text-[13px] font-medium uppercase transition-colors ${filter === f.key ? "text-[var(--ink)]" : "text-[var(--mute)] hover:text-[var(--ink)]"}`}>
                {f.label} <span className="tnum">({counts[f.key]})</span>
                {filter === f.key && <motion.span layoutId="filter-line" className="absolute inset-x-0 -bottom-px h-px bg-[var(--ink)]" transition={{ duration: 0.45, ease: EASE }} />}
              </button>
            ))}
          </div>
        </div>

        <motion.ul key={filter} onPointerLeave={() => setHover(null)}
          initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              {list.map((p, i) => (
                <li key={p.id} className="border-b border-[var(--line-2)]">
                  <Link href={`/work/${p.id}`}
                    onPointerEnter={() => setHover(p.id)} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-4 md:grid-cols-12 md:py-[clamp(1rem,1.6vw,1.5rem)]">
                    <span className="relative h-12 w-[4.5rem] overflow-hidden bg-[var(--dark)] md:hidden">
                      <Image src={p.cover} alt="" fill sizes="72px" className="object-cover object-top" />
                    </span>
                    <span className="hidden text-[12.5px] text-[var(--mute)] tnum md:col-span-1 md:block">[ {pad(i + 1)} ]</span>
                    <span className="min-w-0 md:col-span-5">
                      <span className="block text-[clamp(1.4rem,2.9vw,2.8rem)] font-medium leading-none tracking-[-0.05em] transition-transform duration-500 ease-out group-hover:translate-x-2">
                        {p.name}
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-[var(--mute)] md:hidden">{p.subtitle}</span>
                    </span>
                    <span className="hidden truncate text-[14px] text-[var(--mute)] md:col-span-3 md:block">{p.subtitle}</span>
                    <span className="hidden text-[12px] uppercase text-[var(--mute)] md:col-span-2 md:block">{disciplineLabel(p.discipline)}</span>
                    <span className="flex justify-end md:col-span-1">
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-2)] transition-all duration-500 group-hover:rotate-45 group-hover:border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]">
                        <Arrow className="h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
        </motion.ul>
      </div>

      {showPreview && (
        <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {hover && (
              <motion.div key={hover}
                initial={{ opacity: 0, scale: 0.9, clipPath: "inset(50% 0 50% 0)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)" }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute bg-[var(--dark)] p-2"
                style={{ width: "clamp(260px, 22vw, 380px)", left: 28, top: -110 }}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={byId[hover].cover} alt="" fill sizes="380px" className="object-cover object-top" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
