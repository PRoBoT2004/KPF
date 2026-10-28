"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { projects, identity } from "@/data/portfolio";
import { dims, isTall } from "@/data/media";
import { Arrow, EASE, Label, PAD, Reveal, Roll, disciplineLabel, pill } from "./primitives";

const CAT = { Product: "Product", Client: "Client work", Lab: "Lab & studies" };

function CaseHero({ p }) {
  const meta = [
    ["Role", p.role || (p.flagship ? "Design + engineering, end to end" : disciplineLabel(p.discipline))],
    ["Client", p.client || p.org || (p.category === "Lab" ? "Personal" : "—")],
    ["Year", p.year || "—"],
    ["Status", p.status || (p.live ? "Live" : p.figma ? "Design" : "—")],
  ].filter(([, v]) => v && v !== "—");
  return (
    <header data-nav="light" className={`pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(7rem,16vh,10rem)] ${PAD}`}>
      <div className="mx-auto max-w-[1920px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/#work" className="group inline-flex items-center gap-2 text-[12.5px] font-medium uppercase">
            <Arrow className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" dir="w" /> <Roll>All work</Roll>
          </Link>
          <Label>{CAT[p.category]}{p.flagship ? " · Flagship" : ""}</Label>
        </div>
        <h1 className="mt-[clamp(2rem,5vw,4rem)] overflow-hidden">
          <span className="rise block pb-[0.16em] text-[clamp(3.4rem,12.4vw,12.4rem)] font-medium leading-[0.84] tracking-[-0.068em]">{p.name}</span>
        </h1>
        <div className="mt-2 grid grid-cols-12 items-end gap-x-4 gap-y-6">
          <p className="lift col-span-12 max-w-[30ch] text-[clamp(1.3rem,2.3vw,2.1rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--ink-2)] md:col-span-7" style={{ animationDelay: "0.3s" }}>
            {p.subtitle}
          </p>
          <div className="lift col-span-12 flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end" style={{ animationDelay: "0.42s" }}>
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className={pill.dark}>
                <Roll>Visit live</Roll><Arrow className="h-4 w-4" />
              </a>
            )}
            {p.figma && (
              <a href={p.figma} target="_blank" rel="noopener noreferrer" className={pill.line}>
                <Roll>Figma file</Roll><Arrow className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <dl className="lift mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-2 gap-x-4 lg:grid-cols-4" style={{ animationDelay: "0.5s" }}>
          {meta.map(([k, v]) => (
            <div key={k} className="border-t border-[var(--ink)] py-3">
              <dt className="text-[12.5px] uppercase text-[var(--mute)]">{k}</dt>
              <dd className="mt-1 text-[15px] font-medium leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

function Cover({ p }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [reduce ? 1 : 0.94, 1]);
  const [w, h] = dims(p.cover);
  return (
    <div ref={ref} data-nav="light" className={`relative ${PAD}`}>
      <motion.div style={{ scale }} className="relative mx-auto max-w-[1920px] bg-[var(--dark)] p-[clamp(8px,1vw,16px)]">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${w} / ${h}` }}>
          <Image src={p.cover} alt={`${p.name}: ${p.subtitle}`} fill priority sizes="100vw" className="object-cover object-top" />
        </div>
      </motion.div>
    </div>
  );
}

function Block({ label, children, n }) {
  return (
    <section data-nav="light" className={`py-[clamp(3rem,6vw,5.5rem)] ${PAD}`}>
      <div className="mx-auto grid max-w-[1920px] grid-cols-12 gap-x-4 gap-y-6 border-t border-[var(--line-2)] pt-6">
        <Label as="h2" n={n} className="col-span-12 md:col-span-3">{label}</Label>
        <div className="col-span-12 md:col-span-9 md:col-start-4">{children}</div>
      </div>
    </section>
  );
}

function BigText({ children }) {
  return (
    <Reveal as="p" className="max-w-[34ch] text-[clamp(1.4rem,2.6vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.035em]">
      {children}
    </Reveal>
  );
}

function TwoSides({ p }) {
  const cols = [
    { k: "design", title: "Design", items: p.design },
    { k: "engineering", title: "Engineering", items: p.engineering },
  ].filter((c) => c.items?.length);
  if (!cols.length) return null;
  return (
    <div className={`grid gap-x-4 gap-y-10 ${cols.length > 1 ? "md:grid-cols-2" : ""}`}>
      {cols.map((c, ci) => (
        <Reveal key={c.k} delay={ci * 0.08}>
          <div className="flex items-baseline justify-between border-b border-[var(--ink)] pb-3">
            <h3 className="text-[clamp(1.5rem,2.2vw,2.1rem)] font-medium tracking-[-0.045em]">{c.title}</h3>
            <span className="text-[12.5px] text-[var(--mute)] tnum">({String(c.items.length).padStart(2, "0")})</span>
          </div>
          <ul>
            {c.items.map((it) => (
              <li key={it} className="border-b border-[var(--line-2)] py-3.5 text-[15.5px] leading-snug text-[var(--ink-2)]">{it}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

// tall full-page captures scroll inside a pinned browser window
function ScrollFrame({ src, alt, caption }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [w, h] = dims(src);
  const view = (10 / 16) * (w / h);              // visible fraction of the image
  const end = -(1 - view) * 100;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const y = useTransform(scrollYProgress, [0.05, 0.95], ["0%", reduce ? "0%" : `${end}%`]);
  return (
    <figure ref={ref} className="relative" style={{ height: reduce ? "auto" : "260svh" }}>
      <div className={reduce ? "" : "sticky top-[12svh]"}>
        <div className="overflow-hidden border border-[var(--line-2)] bg-white">
          <div className="flex items-center gap-1.5 border-b border-[var(--line-2)] px-4 py-3">
            {[0, 1, 2].map((k) => <span key={k} className="h-2.5 w-2.5 rounded-full bg-[var(--line-2)]" />)}
            <span className="ml-3 truncate text-[11.5px] text-[var(--mute)]">{alt}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden" data-lenis-prevent={reduce ? "" : undefined}>
            <motion.div style={{ y }} className="absolute inset-x-0 top-0">
              <Image src={src} alt={alt} width={w} height={h} sizes="(min-width: 1200px) 1100px, 92vw" className="h-auto w-full" />
            </motion.div>
          </div>
        </div>
        {caption && <figcaption className="mt-3 text-[14px] text-[var(--mute)]">{caption}</figcaption>}
      </div>
    </figure>
  );
}

function Shot({ g, i }) {
  const reduce = useReducedMotion();
  const [w, h] = dims(g.src);
  return (
    <motion.figure
      initial={reduce ? false : { clipPath: "inset(10% 0% 10% 0%)", opacity: 0.5 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay: (i % 2) * 0.08 }}>
      <div className="overflow-hidden border border-[var(--line-2)]">
        <Image src={g.src} alt={g.alt} width={w} height={h} sizes="(min-width: 1024px) 50vw, 92vw" className="h-auto w-full" />
      </div>
      {g.caption && <figcaption className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-[var(--mute)]">{g.caption}</figcaption>}
    </motion.figure>
  );
}

function Gallery({ p }) {
  const items = p.gallery || [];
  const tall = items.filter((g) => isTall(g.src));
  const flat = items.filter((g) => !isTall(g.src));
  if (!items.length && !p.phone?.length) return null;
  return (
    <section aria-label="Gallery" data-nav="light" className={`py-[clamp(2rem,5vw,4rem)] ${PAD}`}>
      <div className="mx-auto max-w-[1920px] space-y-[clamp(2.5rem,6vw,5rem)]">
        {tall.length > 0 && (
          <div className="mx-auto max-w-[1200px] space-y-[clamp(2rem,5vw,4rem)]">
            {tall.slice(0, 2).map((g) => <ScrollFrame key={g.src} src={g.src} alt={g.alt} caption={g.caption} />)}
          </div>
        )}
        {flat.length > 0 && (
          <div className="grid gap-[clamp(10px,1.4vw,20px)] md:grid-cols-2">
            {flat.map((g, i) => (
              <div key={g.src} className={flat.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}><Shot g={g} i={i} /></div>
            ))}
          </div>
        )}
        {p.phone?.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-[clamp(1rem,4vw,4rem)] bg-[var(--card)] px-4 py-[clamp(2.5rem,6vw,5rem)]">
            {p.phone.map((g, i) => {
              const [w, h] = dims(g.src);
              return (
                <Reveal key={g.src} delay={i * 0.1} y={50}
                  className={`w-[clamp(150px,20vw,260px)] rounded-[clamp(22px,3vw,38px)] border-[6px] border-[var(--dark)] bg-[var(--dark)] ${i % 2 ? "md:translate-y-10" : ""}`}>
                  <div className="overflow-hidden rounded-[clamp(16px,2.4vw,32px)]">
                    <Image src={g.src} alt={g.alt} width={w} height={h} sizes="260px" className="h-auto w-full" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function NextProject({ next }) {
  return (
    <section aria-label="Next project" data-nav="dark" className={`bg-[var(--dark)] pb-[clamp(2rem,4vw,3rem)] pt-[clamp(4rem,8vw,7rem)] text-[var(--on-dark)] ${PAD}`}>
      <Link href={`/work/${next.id}`} className="group mx-auto grid max-w-[1920px] grid-cols-12 items-end gap-x-4 gap-y-8">
        <div className="col-span-12 md:col-span-7">
          <Label tone="dark">Next project</Label>
          <p className="mt-4 text-[clamp(3rem,9vw,9rem)] font-medium leading-[0.84] tracking-[-0.068em]">{next.name}</p>
          <p className="mt-4 text-[clamp(1rem,1.3vw,1.2rem)] text-[var(--on-dark-mute)]">{next.subtitle}</p>
          <span className={`mt-8 ${pill.light}`}><Roll>Open case study</Roll><Arrow className="h-4 w-4" /></span>
        </div>
        <div className="relative col-span-12 aspect-[16/10] overflow-hidden bg-[var(--dark-2)] md:col-span-5">
          <Image src={next.cover} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="mono-img object-cover object-top group-hover:scale-[1.03]" />
        </div>
      </Link>
      <div className="mx-auto mt-[clamp(3rem,6vw,5rem)] flex max-w-[1920px] flex-wrap items-center justify-between gap-4 border-t border-[var(--dark-line)] pt-4 text-[12.5px] uppercase text-[var(--on-dark-mute)]">
        <Link href="/#work" className="transition-colors hover:text-[var(--on-dark)]"><Roll>← All work</Roll></Link>
        <a href={`mailto:${identity.email}`} className="normal-case transition-colors hover:text-[var(--on-dark)]">{identity.email}</a>
        <Link href="/island" className="transition-colors hover:text-[var(--on-dark)]"><Roll>The island</Roll></Link>
      </div>
    </section>
  );
}

export default function CaseStudy({ id }) {
  const idx = projects.findIndex((x) => x.id === id);
  const p = projects[idx];
  if (!p) return null;
  const next = projects[(idx + 1) % projects.length];

  const intro = p.problem && typeof p.problem === "string" ? ["The problem", p.problem]
    : p.challenge ? ["The challenge", p.challenge]
    : p.overview ? ["Overview", p.overview] : null;
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <article>
      <CaseHero p={p} />
      <Cover p={p} />

      {p.stat && (
        <section data-nav="light" className={`pt-[clamp(4rem,8vw,7rem)] ${PAD}`}>
          <Reveal className="mx-auto flex max-w-[1920px] flex-wrap items-end gap-x-8 gap-y-2">
            <span className="text-[clamp(4rem,13vw,12.5rem)] font-medium leading-[0.8] tracking-[-0.07em]">{p.stat.value}</span>
            <span className="pb-[1.1vw] text-[clamp(1.2rem,2.3vw,2.1rem)] font-medium leading-tight tracking-[-0.03em] text-[var(--mute)]">{p.stat.label}</span>
          </Reveal>
        </section>
      )}

      {intro && <Block n={num()} label={intro[0]}><BigText>{intro[1]}</BigText></Block>}
      {intro && intro[0] !== "Overview" && p.overview && (
        <Block n={num()} label="Overview"><BigText>{p.overview}</BigText></Block>
      )}

      {Array.isArray(p.problem) && (
        <Block n={num()} label="Problem → solution">
          <div className="grid gap-x-4 gap-y-10 md:grid-cols-2">
            {[["Before", p.problem], ["After", p.solution || []]].map(([t, list]) => (
              <Reveal key={t}>
                <p className="border-b border-[var(--ink)] pb-3 text-[clamp(1.5rem,2.2vw,2.1rem)] font-medium tracking-[-0.045em]">{t}</p>
                <ul>{list.map((x) => <li key={x} className="border-b border-[var(--line-2)] py-3.5 text-[15.5px] leading-snug text-[var(--ink-2)]">{x}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </Block>
      )}

      {(p.design?.length || p.engineering?.length) && (
        <Block n={num()} label="Both sides of the work"><TwoSides p={p} /></Block>
      )}

      {p.built?.length > 0 && (
        <Block n={num()} label="What I built">
          <ol className="border-t border-[var(--ink)]">
            {p.built.map((b, i) => (
              <Reveal as="li" key={b} delay={Math.min(i, 4) * 0.04} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--line-2)] py-4 text-[clamp(1.02rem,1.3vw,1.2rem)] leading-snug">
                <span className="text-[12.5px] text-[var(--mute)] tnum">{String(i + 1).padStart(2, "0")}</span>{b}
              </Reveal>
            ))}
          </ol>
        </Block>
      )}

      <Gallery p={p} />

      {p.outcome && <Block n={num()} label="Outcome"><BigText>{p.outcome}</BigText></Block>}

      {(p.reflection || p.decision) && (
        <section data-nav="dark" className={`bg-[var(--dark)] py-[clamp(5rem,10vw,9rem)] text-[var(--on-dark)] ${PAD}`}>
          <div className="mx-auto grid max-w-[1920px] grid-cols-12 gap-x-4 gap-y-6">
            <Label tone="dark" className="col-span-12 md:col-span-3">{p.reflection ? "Reflection" : "The key decision"}</Label>
            <Reveal as="blockquote" className="col-span-12 max-w-[30ch] text-[clamp(1.6rem,3.3vw,3.3rem)] font-medium leading-[1.1] tracking-[-0.04em] md:col-span-9 md:col-start-4">
              “{p.reflection || p.decision}”
            </Reveal>
          </div>
        </section>
      )}

      {p.tech?.length > 0 && (
        <Block n={num()} label="Stack">
          <ul className="flex flex-wrap gap-2">
            {p.tech.map((t) => <li key={t} className="rounded-full border border-[var(--line-2)] px-4 py-2 text-[14px]">{t}</li>)}
          </ul>
        </Block>
      )}

      <NextProject next={next} />
    </article>
  );
}
