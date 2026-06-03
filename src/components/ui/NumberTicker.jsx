"use client";
import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Counts up from `from` to `value` when scrolled into view.
 * Used for the "300+ paying customers" reveal.
 */
export default function NumberTicker({
  value,
  from = 0,
  duration = 1.6,
  delay = 0,
  className = "",
  suffix = "",
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, {
    damping: 28,
    stiffness: 90,
    duration,
  });
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const t = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay, reduce, motionValue, suffix]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Intl.NumberFormat("en-US").format(
          Math.round(latest)
        )}${suffix}`;
      }
    });
  }, [spring, suffix]);

  return (
    <span ref={ref} className={className}>
      {from}
      {suffix}
    </span>
  );
}
