"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline at the very top that fills as you read down the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <motion.div aria-hidden="true" style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-white mix-blend-difference" />
  );
}
