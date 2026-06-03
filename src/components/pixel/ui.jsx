"use client";
// ============================================================
// Shared pixel-UI kit for the deep pages (/quest, /about, /contact).
// Same parchment + accent language as the in-game dialogs, but as
// fast, accessible, scrollable DOM. Pixel font for labels/headings,
// Plus Jakarta Sans for body copy (readability).
// ============================================================
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const ACCENTS = {
  gold: { main: "#D4A848", soft: "#e6bb52", deep: "#9a7322" },
  cyan: { main: "#4FD1C5", soft: "#7fe0d6", deep: "#2f8f86" },
  rose: { main: "#E07B6B", soft: "#f0a394", deep: "#b15545" },
  wood: { main: "#c98f57", soft: "#dcab78", deep: "#7a4d28" },
};
export const accentOf = (a) => ACCENTS[a] || ACCENTS.gold;

// Robust copy (works over plain-HTTP / phone — navigator.clipboard is https-only)
export function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}
function legacyCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
    document.body.appendChild(ta); ta.focus(); ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta); return ok;
  } catch { return false; }
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
};

// ---- Page shell: cozy "interior" backdrop + top nav + header + footer ----
export function PixelShell({ accent = "gold", eyebrow, title, subtitle, children, backHref = "/" }) {
  const a = accentOf(accent);
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden font-sans text-[#efe3c8]"
      style={{ background: "radial-gradient(120% 80% at 50% -10%, #243024 0%, #1a221b 45%, #141a16 100%)" }}>
      {/* faint pixel grid + accent glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.5]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[40vh]"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${a.main}22 0%, transparent 70%)` }} />

      {/* top nav */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6"
        style={{ background: "rgba(20,26,22,0.72)", backdropFilter: "blur(8px)", borderBottom: "2px solid #2a2230" }}>
        <Link href={backHref}
          className="font-pixel inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] text-[#1a1420] transition-transform active:scale-95"
          style={{ background: "#f3e7cf", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
          <span className="sm:hidden">← Map</span>
          <span className="hidden sm:inline">← Back to the map</span>
        </Link>
        <Link href="/resume"
          className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#efe3c8] transition-colors hover:text-white"
          style={{ border: "2px solid #3a4a3a" }}>
          <span className="sm:hidden">Résumé →</span>
          <span className="hidden sm:inline">Résumé view →</span>
        </Link>
      </header>

      {/* header */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
        {eyebrow && (
          <motion.div {...fadeUp} className="mb-4">
            <span className="font-pixel inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1a1420]"
              style={{ background: a.main, border: "2px solid #2a2230" }}>{eyebrow}</span>
          </motion.div>
        )}
        <motion.h1 {...fadeUp}
          className="font-serif leading-[1.05] text-[#f7efdd]"
          style={{ fontSize: "clamp(2.4rem,7vw,4.5rem)" }}>{title}</motion.h1>
        {subtitle && (
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#bdb39c] sm:text-[17px]">{subtitle}</motion.p>
        )}
        <div className="mt-8 h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${a.main}, transparent)` }} />
      </div>

      {/* content */}
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6">{children}</main>

      {/* footer */}
      <footer className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6">
        <div className="flex flex-col items-center gap-3 border-t-2 border-[#2a2230] pt-8 text-center">
          <p className="font-pixel text-[12px]" style={{ color: "#8f8a72" }}>KRISHNA MEHTA · BUILDER · DESIGNER · ENGINEER</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#bdb39c]">
            <Link href="/" className="hover:text-white">The map</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/resume" className="hover:text-white">Résumé view</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---- Parchment panel with optional accent title bar ----
export function Panel({ title, accent = "gold", children, className = "", delay = 0 }) {
  const a = accentOf(accent);
  return (
    <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay }}
      className={`relative ${className}`}
      style={{ background: "#f3e7cf", border: "4px solid #2a2230", boxShadow: "7px 7px 0 rgba(0,0,0,0.35)" }}>
      {title && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: a.main, borderBottom: "4px solid #2a2230" }}>
          <span className="font-pixel text-[13px] font-bold tracking-wide text-[#1a1420]">{title}</span>
        </div>
      )}
      <div className="px-5 py-4 text-[#3a2f22]">{children}</div>
    </motion.section>
  );
}

// ---- small tech / tag chip ----
export function Chip({ children, accent = "gold" }) {
  const a = accentOf(accent);
  return (
    <span className="font-pixel inline-block px-2 py-1 text-[11px] text-[#2a2230]"
      style={{ background: "#efe2c4", border: `2px solid ${a.deep}` }}>{children}</span>
  );
}

// ---- chunky pixel button (link or button) ----
export function PixelButton({ href, external, children, accent = "gold", onClick, as = "a" }) {
  const a = accentOf(accent);
  const cls = "font-pixel inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] text-[#1a1420] transition-transform active:translate-y-[2px] active:shadow-none";
  const style = { background: a.main, border: "3px solid #2a2230", boxShadow: "0 4px 0 #2a2230" };
  if (as === "button") return <button type="button" onClick={onClick} className={cls} style={style}>{children}</button>;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>;
  return <Link href={href} className={cls} style={style}>{children}</Link>;
}

// ---- product-window mockup (fallback card when there's no screenshot yet) ----
export function ProductMock({ name, tagline, accent = "gold", live }) {
  const a = accentOf(accent);
  return (
    <div className="flex h-full w-full flex-col" style={{ background: "#1a1510" }}>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ background: a.deep }}>
        <span className="h-2 w-2 rounded-full" style={{ background: "#ff6a5e" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#ffbd44" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#5fd06a" }} />
        <span className="font-pixel ml-2 truncate text-[8px] text-white/55">
          {live ? live.replace(/^https?:\/\//, "").replace(/\/$/, "") : name.toLowerCase().replace(/\s+/g, "")}
        </span>
      </div>
      <div className="relative flex flex-1 flex-col justify-center gap-2.5 px-4 py-3"
        style={{ background: `radial-gradient(130% 110% at 0% 0%, ${a.deep}, #14110f)` }}>
        <span className="font-serif leading-none text-[#f7efdd]" style={{ fontSize: "clamp(1.5rem,4vw,2.3rem)" }}>{name}</span>
        {tagline && <span className="font-pixel text-[9px] uppercase tracking-[0.16em]" style={{ color: a.soft }}>{tagline}</span>}
        <div className="mt-1 space-y-1.5">
          <div className="h-1.5 w-2/3 rounded-sm" style={{ background: a.main }} />
          <div className="h-1.5 w-1/2 rounded-sm" style={{ background: "rgba(255,255,255,0.16)" }} />
          <div className="flex gap-1.5 pt-0.5">
            <div className="h-6 w-10 rounded-sm" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${a.main}66` }} />
            <div className="h-6 w-10 rounded-sm" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="h-6 w-10 rounded-sm" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>
        </div>
        <span className="font-pixel absolute right-2 top-2 px-1.5 py-0.5 text-[8px] text-[#1a1420]" style={{ background: a.main }}>LIVE</span>
      </div>
    </div>
  );
}

// ---- image loader with a fallback chain ----
// `src` may be a single path or an array of candidates (e.g. a generated mockup
// first, then the raw screenshot). Renders the first that loads; else `fallback`.
// Pre-checks each so there's never a broken-image flash.
export function ProjectImage({ src, alt, fallback, imgClassName = "" }) {
  const sources = (Array.isArray(src) ? src : [src]).filter(Boolean);
  const key = sources.join("|");
  const [resolved, setResolved] = useState(null);
  useEffect(() => {
    let live = true;
    setResolved(null);
    (async () => {
      for (const s of sources) {
        const ok = await new Promise((res) => {
          const img = new window.Image();
          img.onload = () => res(true);
          img.onerror = () => res(false);
          img.src = s;
        });
        if (!live) return;
        if (ok) { setResolved(s); return; }
      }
    })();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  if (resolved) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolved} alt={alt} className={imgClassName} />;
  }
  return fallback;
}

// ---- stat pips (Beginner→Expert = 1→4) ----
const LV = { Expert: 4, Advanced: 3, Intermediate: 2, Beginner: 1 };
export function Pips({ level, accent = "gold" }) {
  const a = accentOf(accent);
  const n = LV[level] ?? 1;
  return (
    <span className="inline-flex gap-[3px] align-middle">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className="inline-block h-3 w-3"
          style={{ background: i <= n ? a.main : "#cdbfa0", boxShadow: "inset -1px -1px 0 rgba(0,0,0,0.25)" }} />
      ))}
    </span>
  );
}
