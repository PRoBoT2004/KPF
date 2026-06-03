"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { projects, projectCategories } from "@/data/portfolio";
import { accentOf, ProjectImage, ProductMock } from "./ui";

// flat walk order: a section sign, then its exhibits, per category
const ITEMS = [];
projectCategories.forEach((cat) => {
  ITEMS.push({ type: "section", cat });
  projects.filter((p) => p.category === cat.key).forEach((p) => ITEMS.push({ type: "exhibit", p }));
});

function SectionSign({ cat }) {
  const a = accentOf(cat.accent);
  return (
    <div className="flex h-full shrink-0 snap-center flex-col items-center justify-center px-3" style={{ scrollSnapAlign: "center" }}>
      <div className="w-[150px] text-center sm:w-[180px]">
        <div className="mx-auto mb-3 h-16 w-[3px]" style={{ background: "#3a2a1a" }} />
        <div className="px-3 py-3" style={{ background: a.main, border: "4px solid #2a2230", boxShadow: "5px 5px 0 rgba(0,0,0,0.4)" }}>
          <p className="font-pixel text-[15px] font-bold leading-tight text-[#1a1420]">{cat.label}</p>
        </div>
        <p className="mt-3 text-[12px] leading-snug text-[#cdbfa0]">{cat.blurb}</p>
      </div>
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
      className={`group relative flex h-full shrink-0 snap-center flex-col items-center justify-center px-3 ${w}`}
      style={{ scrollSnapAlign: "center" }}
      aria-label={`Open ${p.name}`}
    >
      {/* spotlight on flagship exhibits */}
      {big && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
          style={{ background: `radial-gradient(60% 70% at 50% 0%, ${a.main}33, transparent 70%)` }} />
      )}
      {/* hanging wire + nail */}
      <div className="relative z-10 h-7 w-px" style={{ background: "#000" }} />
      <div className="relative z-10 -mt-[26px] mb-2 h-1.5 w-1.5 rounded-full" style={{ background: a.soft }} />

      {/* the frame */}
      <div className="relative z-10 w-full transition-transform duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
        style={{ background: "#2a2230", padding: 6, boxShadow: "8px 10px 0 rgba(0,0,0,0.4)" }}>
        <div style={{ background: a.main, padding: 4 }}>
          <div className="relative overflow-hidden" style={{ border: "2px solid #2a2230", aspectRatio: "16 / 10", background: "#14110f" }}>
            <ProjectImage
              src={p.image}
              alt={p.name}
              imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              fallback={<ProductMock name={p.name} tagline={p.flagship ? "Live product" : p.category} accent={p.accent} live={p.live} />}
            />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)" }} />
            <span className="font-pixel absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-[10px] text-[#1a1420] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ background: a.main, border: "2px solid #2a2230" }}>View quest →</span>
          </div>
        </div>
      </div>

      {/* brass nameplate */}
      <div className="relative z-10 mt-3 w-[88%] px-3 py-2 text-center" style={{ background: "#efe2c4", border: "3px solid #2a2230", boxShadow: "3px 3px 0 rgba(0,0,0,0.35)" }}>
        <p className="font-pixel text-[13px] font-bold text-[#1a1420]">{big && <span style={{ color: a.deep }}>★ </span>}{p.name}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-[#6b5535]">{p.subtitle}</p>
      </div>
    </Link>
  );
}

export default function QuestHall() {
  const trackRef = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const step = () => {
    const el = trackRef.current;
    return el ? Math.min(el.clientWidth * 0.82, 440) : 380;
  };
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); scroll(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); scroll(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // drag-to-scroll (desktop); suppress click after a drag
  const onDown = (e) => { const el = trackRef.current; if (!el) return; drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false }; };
  const onMove = (e) => {
    const d = drag.current; if (!d.down) return;
    const dx = e.clientX - d.x; if (Math.abs(dx) > 4) d.moved = true;
    trackRef.current.scrollLeft = d.left - dx;
  };
  const onUp = () => { drag.current.down = false; };
  const onClickCapture = (e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } };

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden font-sans text-[#efe3c8]">
      {/* gallery interior: wall + picture rail + floor */}
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[62%]" style={{ background: "linear-gradient(#241c16, #1c1712)" }} />
        <div className="absolute inset-x-0 top-0 h-[62%] opacity-[0.5]"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "44px 100%" }} />
        <div className="absolute inset-x-0" style={{ top: "60%", height: 8, background: "#3a2a1a", boxShadow: "0 2px 0 #14100c" }} />
        <div className="absolute inset-x-0 bottom-0 top-[62%]" style={{ background: "linear-gradient(#3a2a1c, #241810)" }} />
        <div className="absolute inset-x-0 bottom-0 top-[62%] opacity-30"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.4) 2px, transparent 2px)", backgroundSize: "60px 100%" }} />
      </div>

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]"
          style={{ background: "#f3e7cf", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
          <span className="sm:hidden">← Map</span><span className="hidden sm:inline">← Back to the map</span>
        </Link>
        <div className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]" style={{ background: "rgba(243,231,207,0.92)", border: "2px solid #2a2230" }}>
          HALL OF QUESTS · {projects.length}
        </div>
      </header>

      {/* the walkable track */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        className="hall-track absolute inset-0 z-10 flex items-center gap-3 overflow-x-auto overflow-y-hidden px-[28vw] pt-6 sm:gap-6"
        style={{ scrollSnapType: "x mandatory", touchAction: "pan-x", cursor: "grab", WebkitOverflowScrolling: "touch" }}
      >
        {ITEMS.map((it, i) => it.type === "section"
          ? <SectionSign key={"s" + it.cat.key} cat={it.cat} />
          : <Exhibit key={it.p.id} p={it.p} />)}
      </div>

      {/* arrows */}
      <button type="button" aria-label="Previous" onClick={() => scroll(-1)}
        className="font-pixel absolute left-2 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center text-[18px] text-[#1a1420] transition-transform active:scale-95 sm:left-5"
        style={{ background: "#e6bb52", border: "3px solid #2a2230", boxShadow: "0 4px 0 #2a2230" }}>←</button>
      <button type="button" aria-label="Next" onClick={() => scroll(1)}
        className="font-pixel absolute right-2 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center text-[18px] text-[#1a1420] transition-transform active:scale-95 sm:right-5"
        style={{ background: "#e6bb52", border: "3px solid #2a2230", boxShadow: "0 4px 0 #2a2230" }}>→</button>

      {/* footer hint */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
        <div className="font-pixel rounded-md px-3 py-1.5 text-center text-[11px] text-[#1a1420]" style={{ background: "rgba(243,231,207,0.9)", border: "2px solid #2a2230" }}>
          Drag · swipe · ← → to walk the hall · click an exhibit to open
        </div>
      </div>

      <style jsx>{`.hall-track::-webkit-scrollbar{display:none}.hall-track{scrollbar-width:none}`}</style>
    </div>
  );
}
