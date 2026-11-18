"use client";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { projects } from "@/data/portfolio";
import { scenes } from "@/data/studio";
import { PAD, useReduceAfterMount } from "../primitives";
import { seg } from "./ease";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2 = (n) => String(n).padStart(2, "0");

// ============================================================
// Selected work: a pinned showreel. Scrolling down moves a
// track of projects sideways across a dark stage. Each panel
// turns slightly as it passes the centre (a shallow curve),
// its screenshot drifts inside the frame, and a stat card and
// phone float over it at their own speeds. The project names
// slide past in the background at a slower pace.
//   0.00–0.04 hold · 0.04–0.96 travel · 0.96–1.00 hold
// ============================================================
export default function WorkReel() {
  const reduce = useReduceAfterMount();
  const section = useRef(null);
  const track = useRef(null);
  const geo = useRef({ travel: 0, vw: 1, panels: [] });
  const tick = useMotionValue(0); // bumped after measuring so derived values refresh
  const near = useInView(section, { once: true, margin: "120% 0px" });
  const cards = scenes.cards;
  const n = cards.length;

  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });
  const { scrollYProgress: enter } = useScroll({ target: section, offset: ["start end", "start start"] });

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const vw = t.parentElement.clientWidth;
    const panels = [...t.querySelectorAll("[data-panel]")].map((el) => el.offsetLeft + el.offsetWidth / 2);
    geo.current = { travel: Math.max(0, t.scrollWidth - vw), vw, panels };
    tick.set(tick.get() + 1);
  }, [tick]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const x = useTransform([p, tick], ([v]) => -seg(v, 0.04, 0.96) * geo.current.travel);
  const bandX = useTransform(p, [0, 1], ["4%", "-38%"]);
  const fill = useTransform(p, [0.04, 0.96], [0, 1]);
  const hud = useTransform(p, [0, 0.02, 0.95, 0.99], [0, 1, 1, 0]);
  const introStretch = useTransform(enter, [0.2, 1], [75, 125]);
  const introFont = useTransform(introStretch, (v) => `${v}%`);
  const active = useTransform([x, tick], ([xv]) => {
    const g = geo.current;
    let best = 0, bd = Infinity;
    g.panels.forEach((c, i) => { const d = Math.abs(c + xv - g.vw / 2); if (d < bd) { bd = d; best = i; } });
    return pad2(Math.max(1, best));
  });

  if (reduce) return <StaticWork />;

  return (
    <section id="work" ref={section} data-nav="dark" aria-labelledby="work-title"
      className="relative h-[330svh] bg-[#0a0a0a] text-white md:h-[440svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* project names drifting behind, slower than the track */}
        <motion.p aria-hidden="true" style={{ x: bandX }}
          className="wide pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(7rem,34svh,22rem)] font-[680] leading-none tracking-[-0.06em] text-white/[0.045]">
          {cards.map((c) => byId[c.id].name).join(" · ")}
        </motion.p>

        <motion.div ref={track} style={{ x }} className="relative flex h-full w-max items-center gap-[clamp(3rem,8vw,9rem)] pl-[clamp(1rem,5vw,5rem)] pr-[clamp(1rem,8vw,9rem)] pt-10">
          {/* intro */}
          <div data-panel className="flex w-[84vw] shrink-0 flex-col justify-center md:w-[min(40vw,560px)]">
            <p className="text-[14px] text-white/55">Products and client work · 2024 – now</p>
            <motion.h2 id="work-title" style={{ fontStretch: introFont }}
              className="mt-5 text-[clamp(3.6rem,10vw,10rem)] font-[600] leading-[0.86] tracking-[-0.06em]">
              Selected<br />work
            </motion.h2>
            <p className="mt-7 max-w-[34ch] text-[clamp(1rem,1.25vw,1.15rem)] leading-[1.55] text-white/70">
              Three products from the studio I co-own and one client build I led, from the first sketch to the code that runs them.
            </p>
            <p className="mt-8 flex items-center gap-3 text-[13px] text-white/55">
              <span className="relative block h-px w-14 overflow-hidden bg-white/20"><span className="reel-hint absolute inset-0 bg-white" /></span>
              Keep scrolling
            </p>
          </div>

          {cards.map((c, i) => (
            <Panel key={c.id} c={c} p={byId[c.id]} i={i + 1} n={n} x={x} geo={geo} eager={near} />
          ))}
        </motion.div>

        {/* progress */}
        <motion.div aria-hidden="true" style={{ opacity: hud }}
          className={`absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] items-center gap-5 pb-[clamp(1rem,3svh,1.75rem)] text-[13px] text-white/55 ${PAD}`}>
          <span className="hidden sm:inline">Selected work</span>
          <span className="relative h-px flex-1 bg-white/15">
            <motion.span className="absolute inset-0 origin-left bg-white" style={{ scaleX: fill }} />
          </span>
          <span className="tnum text-white"><motion.span>{active}</motion.span><span className="text-white/45"> / {pad2(n)}</span></span>
        </motion.div>
      </div>
    </section>
  );
}

function Panel({ c, p, i, n, x, geo, eager }) {
  // d: where this panel sits relative to the centre of the screen, in screen widths
  const d = useTransform(x, (xv) => {
    const g = geo.current, cx = g.panels[i];
    return cx == null ? 0 : (cx + xv - g.vw / 2) / g.vw;
  });
  const small = () => geo.current.vw < 700;
  const rotateY = useTransform(d, (v) => clamp(v, -1, 1) * (small() ? -9 : -16));
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), 1) * 0.12);
  const imgX = useTransform(d, (v) => `${clamp(v, -1.2, 1.2) * -6}%`);
  const statY = useTransform(d, (v) => clamp(v, -1.5, 1.5) * (small() ? -30 : -70));
  const phoneX = useTransform(d, (v) => clamp(v, -1.5, 1.5) * 140);
  const phoneR = useTransform(d, (v) => 6 + clamp(v, -1.5, 1.5) * 6);
  // the words lead slightly towards the centre, so they never drift into a neighbour
  const textX = useTransform(d, (v) => -clamp(v, -1.2, 1.2) * geo.current.vw * 0.04);
  const dim = useTransform(d, (v) => Math.min(Math.abs(v) * 1.1, 0.7));
  const src = p.cover || p.image;

  return (
    <article data-panel className="w-[84vw] shrink-0 md:w-[min(66vw,90svh)]">
      <motion.div style={{ rotateY, scale, transformPerspective: 1500 }} className="relative">
        <Link href={`/work/${p.id}`} aria-label={`${p.name}: read the case study`}
          className={`group relative block overflow-hidden rounded-[clamp(18px,2vw,30px)] bg-[#161616] ring-1 ring-inset ring-white/[0.09] md:aspect-[16/10] ${c.phones ? "aspect-square" : "aspect-[4/3]"}`}>
          {c.phones ? (
            <PhoneTrio srcs={c.phones} d={d} eager={eager} />
          ) : (
            <motion.div className="absolute inset-y-0 left-[-7%] w-[114%]" style={{ x: imgX }}>
              <div className={`relative h-full w-full ${c.flat ? "p-[5%]" : ""}`}>
                <div className={`relative h-full w-full overflow-hidden ${c.flat ? "rounded-[8px]" : ""}`}>
                  <Image src={src} alt={`${p.name}: ${p.subtitle}`} fill loading={eager ? "eager" : "lazy"}
                    sizes="(min-width: 768px) 66vw, 90vw"
                    className="object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                </div>
              </div>
            </motion.div>
          )}
          <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
          <span className="absolute right-4 top-4 grid h-11 w-11 scale-90 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
          </span>
        </Link>

        {/* floating stat */}
        <motion.div aria-hidden="true" style={{ y: statY }}
          className="pointer-events-none absolute -bottom-5 left-3 rounded-[16px] bg-white px-4 py-3 text-black shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] md:-bottom-8 md:-left-8 md:rounded-[20px] md:px-6 md:py-5">
          <p className="wide text-[clamp(1.4rem,3vw,3.1rem)] font-[640] leading-none tracking-[-0.05em]">{c.stat.big}</p>
          <p className="mt-1.5 text-[12px] text-black/55 md:text-[13px]">{c.stat.small}</p>
        </motion.div>

        {/* phone */}
        {c.phone && (
          <motion.div aria-hidden="true" style={{ x: phoneX, rotate: phoneR }}
            className="pointer-events-none absolute -right-[5%] bottom-[-10%] hidden aspect-[400/860] h-[78%] rounded-[clamp(18px,2.2vw,32px)] bg-[#050505] p-[5px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 md:block">
            <div className="relative h-full w-full overflow-hidden rounded-[clamp(14px,1.8vw,27px)]">
              <Image src={c.phone} alt="" fill loading={eager ? "eager" : "lazy"} sizes="240px" className="object-cover object-top" />
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div style={{ x: textX }} className="mt-[clamp(2.2rem,5svh,3.5rem)] grid gap-x-10 gap-y-3 md:grid-cols-[1fr_minmax(0,0.9fr)] md:items-end">
        <div>
          <p className="tnum flex gap-4 text-[13px] text-white/50"><span>{pad2(i)} / {pad2(n)}</span><span>{c.kind}</span></p>
          <h3 className="wide mt-2 text-[clamp(2.1rem,4.6vw,4.8rem)] font-[600] leading-[0.92] tracking-[-0.055em]">{p.name}</h3>
        </div>
        <div>
          <p className="max-w-[40ch] text-[clamp(0.95rem,1.1vw,1.08rem)] leading-[1.5] text-white/70">{c.line}</p>
          <Link href={`/work/${p.id}`} className="group mt-4 inline-flex items-center gap-2 text-[14.5px] font-medium">
            <span className="ink-link is-under">Read the case study</span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </motion.div>
    </article>
  );
}

// A mobile product shown as three phones: the side ones drift up and down
// against each other as the panel passes, the middle one rises into place.
function PhoneTrio({ srcs, d, eager }) {
  const leftY = useTransform(d, (v) => `${clamp(v, -1.5, 1.5) * 12}%`);
  const rightY = useTransform(d, (v) => `${clamp(v, -1.5, 1.5) * -12}%`);
  const midY = useTransform(d, (v) => `${Math.min(Math.abs(v), 1.5) * 8}%`);
  return (
    <div className="absolute inset-0 bg-[radial-gradient(90%_85%_at_50%_65%,#4a2410_0%,#1f0f07_55%,#0d0705_100%)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
      <motion.div style={{ y: leftY, rotate: -7 }} className="absolute left-[11%] top-[17%] h-[80%] md:left-[19%]"><Phone src={srcs[0]} eager={eager} /></motion.div>
      <motion.div style={{ y: rightY, rotate: 7 }} className="absolute right-[11%] top-[17%] h-[80%] md:right-[19%]"><Phone src={srcs[2]} eager={eager} /></motion.div>
      <motion.div style={{ y: midY, x: "-50%" }} className="absolute left-1/2 top-[6%] h-[92%]"><Phone src={srcs[1]} eager={eager} /></motion.div>
    </div>
  );
}

function Phone({ src, eager }) {
  return (
    <div className="relative aspect-[390/844] h-full rounded-[14%/6.5%] bg-[#0a0a0a] p-[3%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
      <div className="relative h-full w-full overflow-hidden rounded-[11.5%/5.3%]">
        <Image src={src} alt="" fill loading={eager ? "eager" : "lazy"} sizes="(min-width: 768px) 240px, 120px" className="object-cover object-top" />
      </div>
    </div>
  );
}

// reduced motion: the same projects as a plain vertical list
function StaticWork() {
  const cards = scenes.cards;
  return (
    <section id="work" data-nav="dark" aria-labelledby="work-title" className="bg-[#0a0a0a] text-white">
      <div className={`mx-auto max-w-[1440px] py-24 ${PAD}`}>
        <p className="text-[14px] text-white/55">Products and client work · 2024 – now</p>
        <h2 id="work-title" className="wide mt-4 text-[clamp(3rem,8vw,8rem)] font-[600] leading-[0.9] tracking-[-0.06em]">Selected work</h2>
        <div className="mt-16 grid gap-16 md:grid-cols-2">
          {cards.map((c, i) => {
            const p = byId[c.id];
            return (
              <article key={c.id}>
                <Link href={`/work/${p.id}`} className="relative block aspect-[16/10] overflow-hidden rounded-[24px] bg-[#161616]">
                  <Image src={p.cover || p.image} alt={`${p.name}: ${p.subtitle}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
                </Link>
                <p className="mt-5 text-[13px] text-white/50">{pad2(i + 1)} · {c.kind}</p>
                <h3 className="wide mt-1 text-[2.4rem] font-[600] tracking-[-0.05em]">{p.name}</h3>
                <p className="mt-2 max-w-[44ch] text-white/70">{c.line}</p>
                <p className="mt-2 text-[14px] text-white/80">{c.stat.big} <span className="text-white/50">{c.stat.small}</span></p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
