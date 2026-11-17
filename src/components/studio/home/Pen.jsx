"use client";
// ============================================================
// Pen marks — a few hand-drawn strokes (arrow, underline, loop)
// that draw themselves once, when they scroll into view.
// Paths use pathLength="1" so the CSS dash animation is length-free
// (see .pen / .drawn in globals.css). Purely decorative: aria-hidden.
// ============================================================
import { useEffect, useRef, useState } from "react";

const MARKS = {
  // a loose curve that ends in an arrowhead pointing up-right
  arrow: {
    viewBox: "0 0 120 72",
    paths: ["M5 62 C 24 66, 54 62, 74 45 S 102 16, 111 7", "M111 7 L 97.5 9.5", "M111 7 L 108.5 20.5"],
  },
  // arrow that drops down and to the left
  arrowDown: {
    viewBox: "0 0 90 96",
    paths: ["M80 6 C 86 30, 70 58, 40 72 S 14 84, 9 89", "M9 89 L 12.5 76", "M9 89 L 22 90.5"],
  },
  underline: {
    viewBox: "0 0 240 16",
    stretch: true,
    paths: ["M3 10.5 C 40 4, 76 13.5, 114 8.5 S 188 3.5, 237 9"],
  },
  loop: {
    viewBox: "0 0 220 72",
    paths: ["M34 13 C 84 0, 192 3, 211 27 C 227 49, 141 68, 71 63 C 19 60, 3 39, 23 21 C 35 11, 62 6, 88 7"],
  },
};

/** Adds `drawn` once the element is in view, so the pen marks inside play. */
export function Doodle({ as: Tag = "div", className = "", style, children, margin = "0px 0px -15% 0px" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return <Tag ref={ref} className={`${className} ${on ? "drawn" : ""}`} style={style}>{children}</Tag>;
}

export function Pen({ mark = "arrow", className = "", style, width = 1.7 }) {
  const m = MARKS[mark];
  return (
    <svg aria-hidden="true" viewBox={m.viewBox} preserveAspectRatio={m.stretch ? "none" : undefined} fill="none" className={`pen ${className}`} style={style}
      stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {m.paths.map((d) => <path key={d} d={d} pathLength="1" vectorEffect={m.stretch ? undefined : "non-scaling-stroke"} />)}
    </svg>
  );
}

/** A handwritten margin note. `r` is its tilt in degrees. */
export function Note({ children, className = "", r = -4, d }) {
  return (
    <span aria-hidden="true" className={`hand pen-note inline-block ${className}`} style={{ "--r": `${r}deg`, ...(d ? { "--d": d } : null) }}>
      {children}
    </span>
  );
}
