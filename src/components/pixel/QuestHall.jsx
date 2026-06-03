"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { projects, projectCategories } from "@/data/portfolio";
import { accentOf, ProjectImage, ProductMock } from "./ui";

// flat walk order: a section banner, then its exhibits, per category
const ITEMS = [];
projectCategories.forEach((cat) => {
  ITEMS.push({ type: "section", cat });
  projects.filter((p) => p.category === cat.key).forEach((p) => ITEMS.push({ type: "exhibit", p }));
});

// fixed dust-mote positions (no Math.random → SSR-safe)
const DUST = [
  ["12%", "18%", 3, "15s", "0s"], ["24%", "31%", 2, "19s", "2s"], ["38%", "12%", 2, "16s", "1s"],
  ["47%", "24%", 3, "21s", "3s"], ["56%", "16%", 2, "15s", "0.5s"], ["66%", "28%", 3, "19s", "2.5s"],
  ["74%", "14%", 2, "17s", "1.5s"], ["85%", "26%", 2, "22s", "3.5s"], ["18%", "41%", 2, "23s", "1s"],
  ["62%", "43%", 2, "16s", "2s"], ["33%", "46%", 3, "25s", "0s"], ["79%", "38%", 2, "18s", "4s"],
];

function GildedFrame({ p }) {
  const a = accentOf(p.accent || "gold");
  return (
    <div
      className="exhibit-frame relative"
      style={{
        background: "linear-gradient(150deg,#f3d885 0%,#cba23f 55%,#8f6c20 100%)",
        padding: 7,
        border: "2px solid #4a3712",
        boxShadow: "0 18px 36px rgba(0,0,0,0.65), inset 0 2px 2px rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.45)",
        WebkitBoxReflect: "below 7px linear-gradient(transparent 60%, rgba(255,240,210,0.13))",
      }}
    >
      <div style={{ border: "2px solid #4a3712", background: "#14110f", overflow: "hidden", position: "relative" }}>
        <div className="relative" style={{ aspectRatio: "16 / 10" }}>
          <ProjectImage
            src={p.image}
            alt={p.name}
            imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            fallback={<div className="absolute inset-0"><ProductMock name={p.name} tagline={p.flagship ? "Live product" : p.category} accent={p.accent} live={p.live} /></div>}
          />
          {/* glass sheen */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.16), transparent 42%)" }} />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 55%)" }} />
          <span className="font-pixel absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-[10px] text-[#1a1420] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ background: a.main, border: "2px solid #2a2230" }}>View quest →</span>
        </div>
      </div>
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
    </div>
  );
}

function Exhibit({ p }) {
  const a = accentOf(p.accent || "gold");
  const big = !!p.flagship;
  const w = big ? "w-[300px] sm:w-[360px]" : "w-[260px] sm:w-[300px]";
  return (
    <Link
      href={`/quest/${p.id}`}
      className={`exhibit group relative flex h-full shrink-0 snap-center flex-col items-center justify-center px-4 ${w}`}
      style={{ scrollSnapAlign: "center" }}
      aria-label={`Open ${p.name}`}
    >
      <div className="relative w-full" style={{ transform: "translateY(-6%)" }}>
        <div className="spot-cone" aria-hidden />
        <div className="wall-glow" aria-hidden />
        <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
          <GildedFrame p={p} />
        </div>
        <div className="floor-pool" aria-hidden />
      </div>
      {/* brass nameplate */}
      <div className="relative z-10 mt-6 w-[90%] px-3 py-2 text-center"
        style={{ background: "linear-gradient(#f4e7c6,#e0cd9f)", border: "3px solid #2a2230", boxShadow: "3px 4px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)" }}>
        <p className="font-pixel text-[13px] font-bold text-[#1a1420]">{big && <span style={{ color: a.deep }}>★ </span>}{p.name}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-[#6b5535]">{p.subtitle}</p>
      </div>
    </Link>
  );
}

function SectionBanner({ cat }) {
  const a = accentOf(cat.accent);
  return (
    <div className="flex h-full shrink-0 snap-center flex-col items-center justify-center px-6" style={{ scrollSnapAlign: "center" }}>
      <div className="relative" style={{ transform: "translateY(-14%)" }}>
        <div className="absolute left-1/2 bottom-full h-[44vh] w-px -translate-x-1/2" style={{ background: "rgba(0,0,0,0.55)" }} />
        <div className="relative w-[160px] pb-6 text-center sm:w-[180px]"
          style={{ background: `linear-gradient(${a.deep}, #1b140e)`, border: "3px solid #2a2230", boxShadow: "0 16px 32px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.14)", clipPath: "polygon(0 0,100% 0,100% 88%,50% 100%,0 88%)" }}>
          <div className="px-3 pt-4">
            <p className="font-pixel text-[15px] font-bold leading-tight text-[#f7efdd]">{cat.label}</p>
            <div className="mx-auto my-2 h-[2px] w-10" style={{ background: a.main }} />
            <p className="text-[11px] leading-snug text-[#d8cbab]">{cat.blurb}</p>
          </div>
        </div>
        <div className="absolute left-1/2 top-full h-3 w-1 -translate-x-1/2" style={{ background: a.main }} />
        <div className="absolute left-1/2 top-full mt-[10px] h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ background: a.soft }} />
      </div>
    </div>
  );
}

export default function QuestHall() {
  const trackRef = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const step = () => { const el = trackRef.current; return el ? Math.min(el.clientWidth * 0.82, 440) : 380; };
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); scroll(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); scroll(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onDown = (e) => { const el = trackRef.current; if (!el) return; drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false }; };
  const onMove = (e) => { const d = drag.current; if (!d.down) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) d.moved = true; trackRef.current.scrollLeft = d.left - dx; };
  const onUp = () => { drag.current.down = false; };
  const onClickCapture = (e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } };

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden font-sans text-[#efe3c8]">
      {/* ===================== museum atmosphere (fixed) ===================== */}
      <div aria-hidden className="absolute inset-0 z-0">
        {/* wall */}
        <div className="absolute inset-x-0 top-0" style={{ height: "64%", background: "linear-gradient(#2c2118,#221a12 55%,#1b1410)" }} />
        {/* damask pattern */}
        <div className="absolute inset-x-0 top-0 opacity-[0.06]" style={{ height: "64%", backgroundImage: "radial-gradient(rgba(232,202,140,0.9) 1px, transparent 1.6px)", backgroundSize: "26px 26px" }} />
        {/* warm ceiling glow */}
        <div className="absolute inset-x-0 top-0" style={{ height: "44%", background: "radial-gradient(70% 100% at 50% -12%, rgba(125,92,50,0.55), transparent 70%)" }} />
        {/* crown molding */}
        <div className="absolute inset-x-0 top-0" style={{ height: 7, background: "#3a2a18" }} />
        <div className="absolute inset-x-0" style={{ top: 7, height: 3, background: "linear-gradient(#caa24a,#7a5a22)" }} />
        <div className="absolute inset-x-0" style={{ top: 10, height: 2, background: "#15100b" }} />
        {/* chair rail / picture rail */}
        <div className="absolute inset-x-0" style={{ top: "57%", height: 4, background: "#3a2a18" }} />
        <div className="absolute inset-x-0" style={{ top: "57.7%", height: 2, background: "linear-gradient(#caa24a,#7a5a22)" }} />
        {/* wainscoting */}
        <div className="absolute inset-x-0 opacity-50" style={{ top: "58%", height: "6%", backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.4) 2px, transparent 2px)", backgroundSize: "72px 100%" }} />
        {/* floor */}
        <div className="absolute inset-x-0 bottom-0" style={{ top: "64%", background: "linear-gradient(#3a2a1c,#201610)" }} />
        <div className="absolute inset-x-0 opacity-25" style={{ top: "64%", bottom: 0, backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.45) 2px, transparent 2px)", backgroundSize: "84px 100%" }} />
        {/* polished sheen */}
        <div className="absolute inset-x-0" style={{ top: "64%", height: "9%", background: "linear-gradient(rgba(255,236,200,0.07),transparent)" }} />
        {/* red carpet runner */}
        <div className="absolute inset-x-0" style={{ top: "73%", height: "15%", background: "linear-gradient(#7c242b,#551820)" }} />
        <div className="absolute inset-x-0" style={{ top: "73%", height: 2, background: "#d9a441" }} />
        <div className="absolute inset-x-0" style={{ top: "87.5%", height: 2, background: "#d9a441" }} />
        {/* center "now showing" stage glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(58% 72% at 50% 32%, rgba(255,236,195,0.12), transparent 72%)" }} />
      </div>

      {/* ===================== the walkable track ===================== */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        className="hall-track absolute inset-0 z-10 flex items-center gap-4 overflow-x-auto overflow-y-hidden px-[30vw] sm:gap-8"
        style={{ scrollSnapType: "x mandatory", touchAction: "pan-x", cursor: "grab", WebkitOverflowScrolling: "touch" }}
      >
        {ITEMS.map((it) => it.type === "section"
          ? <SectionBanner key={"s" + it.cat.key} cat={it.cat} />
          : <Exhibit key={it.p.id} p={it.p} />)}
      </div>

      {/* vignette + dust (above exhibits, below UI) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20" style={{ background: "radial-gradient(125% 105% at 50% 44%, transparent 52%, rgba(8,6,4,0.62) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {DUST.map((d, i) => (
          <span key={i} className="dust" style={{ left: d[0], top: d[1], width: d[2], height: d[2], animationDuration: d[3], animationDelay: d[4] }} />
        ))}
      </div>

      {/* ===================== chrome ===================== */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]" style={{ background: "#f3e7cf", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
          <span className="sm:hidden">← Map</span><span className="hidden sm:inline">← Back to the map</span>
        </Link>
        <div className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]" style={{ background: "rgba(243,231,207,0.94)", border: "2px solid #2a2230" }}>
          ✦ HALL OF QUESTS · {projects.length} ✦
        </div>
      </header>

      <button type="button" aria-label="Previous" onClick={() => scroll(-1)}
        className="font-pixel absolute left-2 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center text-[18px] text-[#1a1420] transition-transform active:scale-95 sm:left-5"
        style={{ background: "#e6bb52", border: "3px solid #2a2230", boxShadow: "0 4px 0 #2a2230" }}>←</button>
      <button type="button" aria-label="Next" onClick={() => scroll(1)}
        className="font-pixel absolute right-2 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center text-[18px] text-[#1a1420] transition-transform active:scale-95 sm:right-5"
        style={{ background: "#e6bb52", border: "3px solid #2a2230", boxShadow: "0 4px 0 #2a2230" }}>→</button>

      <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
        <div className="font-pixel rounded-md px-3 py-1.5 text-center text-[11px] text-[#1a1420]" style={{ background: "rgba(243,231,207,0.92)", border: "2px solid #2a2230" }}>
          Drag · swipe · ← → to walk the hall · click an exhibit to open
        </div>
      </div>

      <style jsx>{`
        .hall-track::-webkit-scrollbar { display: none; }
        .hall-track { scrollbar-width: none; }
        .spot-cone {
          position: absolute; left: 50%; bottom: 100%; transform: translateX(-50%);
          width: 240%; height: 48vh; pointer-events: none; z-index: 0;
          background: linear-gradient(to bottom, rgba(255,240,205,0) 0%, rgba(255,238,200,0.10) 60%, rgba(255,235,190,0.24) 100%);
          clip-path: polygon(45% 0, 55% 0, 100% 100%, 0 100%);
          filter: blur(3px);
        }
        .wall-glow {
          position: absolute; inset: -20% -14%; z-index: 0; pointer-events: none;
          background: radial-gradient(58% 60% at 50% 46%, rgba(255,230,178,0.16), transparent 70%);
          filter: blur(6px);
        }
        .floor-pool {
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 2px;
          width: 120%; height: 50px; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, rgba(255,234,190,0.30), transparent 70%);
          filter: blur(2px);
        }
        .corner {
          position: absolute; width: 11px; height: 11px; z-index: 5;
          background: linear-gradient(135deg, #ffe9a6, #b8860b); border: 1px solid #5a4218;
          transform: rotate(45deg); box-shadow: inset 0 1px 1px rgba(255,255,255,0.5);
        }
        .corner.tl { top: -6px; left: -6px; } .corner.tr { top: -6px; right: -6px; }
        .corner.bl { bottom: -6px; left: -6px; } .corner.br { bottom: -6px; right: -6px; }
        @keyframes dustfloat {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          12% { opacity: 0.55; } 88% { opacity: 0.4; }
          100% { transform: translateY(-44px) translateX(14px); opacity: 0; }
        }
        .dust { position: absolute; border-radius: 9999px; background: rgba(255,240,210,0.7); animation: dustfloat linear infinite; }
      `}</style>
    </div>
  );
}
