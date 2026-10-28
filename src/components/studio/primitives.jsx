"use client";
// ============================================================
// Studio primitives — small building blocks shared by every
// section of the scroll world (white-first, monochrome).
// ============================================================
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  motion, useReducedMotion, useInView, useMotionValue, useSpring, animate,
} from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];
export const PAD = "px-[clamp(1rem,2.2vw,2rem)]";

// ---- Lenis instance, shared through context ----
export const LenisContext = createContext({ current: null });
export const useLenis = () => useContext(LenisContext);

/** Scroll to an in-page anchor through Lenis (falls back to native). */
export function useScrollTo() {
  const lenis = useLenis();
  return (target, opts = {}) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return false;
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.4, ...opts });
    else el.scrollIntoView({ behavior: "smooth" });
    return true;
  };
}

/** Reduced-motion flag that is false on the server and first client render
 *  (so hydration matches), then the real preference after mount. */
export function useReduceAfterMount() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}

export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return fine;
}

// ---- bracket label: "[ 02 ] Selected work" ----
export function Label({ n, children, className = "", tone = "light", as: Tag = "p" }) {
  const c = tone === "light" ? "text-[var(--mute)]" : "text-[var(--on-dark-mute)]";
  return (
    <Tag className={`text-[12.5px] font-medium uppercase tracking-[0.02em] ${c} ${className}`}>
      {n && <span className="tnum">[ {n} ]&nbsp;&nbsp;</span>}{children}
    </Tag>
  );
}

// ---- fade + rise on enter ----
export function Reveal({ children, delay = 0, y = 28, className = "", as = "div", once = true }) {
  const reduce = useReducedMotion();
  const M = motion[as] || motion.div;
  return (
    <M
      className={`rm-show ${className}`}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

// ---- masked line reveal (each line slides up out of a clip) ----
export function MaskLines({ lines, className = "", lineClassName = "", delay = 0, stagger = 0.08, as = "h2" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em]">
          <motion.span
            className={`rm-show block ${lineClassName} ${typeof l === "object" ? l.className || "" : ""}`}
            initial={reduce ? false : { y: "110%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {typeof l === "object" ? l.text : l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ---- magnetic hover (desktop) ----
export function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const on = fine && !reduce;
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={on ? { x: sx, y: sy } : undefined}
      onPointerMove={on ? (e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      } : undefined}
      onPointerLeave={on ? () => { x.set(0); y.set(0); } : undefined}
    >
      {children}
    </motion.div>
  );
}

// ---- count-up number (starts when visible) ----
export function CountUp({ value, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || reduce) { if (reduce) setN(value); return; }
    const c = animate(0, value, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, reduce]);
  return (
    <span ref={ref} className={`tnum ${className}`}>
      <span className="sr-only">{prefix}{value}{suffix}</span>
      <span aria-hidden>{prefix}{n}{suffix}</span>
    </span>
  );
}

// ---- live local time in Bharuch (IST) ----
export function LocalTime({ className = "" }) {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className={`tnum ${className}`} suppressHydrationWarning>{t || "--:--"} IST</span>;
}

// ---- text that rolls to a duplicate on hover ----
export function Roll({ children }) {
  return (
    <span className="roll">
      <span>
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
    </span>
  );
}

// ---- arrow glyph (svg, inherits color) ----
export function Arrow({ className = "h-4 w-4", dir = "ne" }) {
  const rot = { ne: 0, e: 45, s: 135, w: 225, n: -45, se: 90 }[dir] ?? 0;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

// ---- six-point asterisk separator (svg, not an emoji) ----
export function Asterisk({ className = "h-[0.5em] w-[0.5em]" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
    </svg>
  );
}

// ---- discipline as plain text: "Design + Engineering" ----
export function disciplineLabel(d) {
  return d === "both" ? "Design + Engineering" : d === "design" ? "Design" : "Engineering";
}

// ---- pill buttons (black = primary, outline = secondary) ----
export const pill = {
  dark: "inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-[14px] font-medium text-[var(--paper)] transition-colors hover:bg-[#2E2E2E]",
  line: "inline-flex items-center gap-2 rounded-full border border-[var(--ink)] px-5 py-[11px] text-[14px] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]",
  light: "inline-flex items-center gap-2 rounded-full bg-[var(--on-dark)] px-5 py-3 text-[14px] font-medium text-[var(--ink)] transition-colors hover:bg-white",
  lineDark: "inline-flex items-center gap-2 rounded-full border border-[#3A3A3A] px-5 py-[11px] text-[14px] font-medium text-[var(--on-dark)] transition-colors hover:border-[var(--on-dark)]",
};

// ---- robust copy (works over http/LAN too) ----
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
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}
