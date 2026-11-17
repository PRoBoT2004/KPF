"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduceAfterMount } from "../primitives";

/**
 * A line of type whose width breathes with the scroll: it enters condensed
 * (font-stretch `from`) and settles wide (`to`) as it reaches the reading line.
 * Mona Sans has a real width axis (75–125%), so this is the font, not a squash.
 */
export function KineticText({ as = "h2", children, className = "", from = 75, to = 125, drift = "8%", offset = ["start end", "end 0.55"], id }) {
  const ref = useRef(null);
  const reduce = useReduceAfterMount();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const stretch = useTransform(scrollYProgress, [0, 1], [from, to]);
  const fontStretch = useTransform(stretch, (v) => `${v}%`);
  const x = useTransform(scrollYProgress, [0, 1], [drift, "0%"]);
  const M = motion[as] || motion.h2;
  return (
    <M ref={ref} id={id} className={className} style={reduce ? { fontStretch: `${to}%` } : { fontStretch, x }}>
      {children}
    </M>
  );
}
