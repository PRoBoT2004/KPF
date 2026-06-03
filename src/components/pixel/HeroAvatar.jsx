"use client";
// Draws the in-game code-drawn hero into a crisp canvas (no images).
import { useEffect, useRef } from "react";
import { buildHero } from "@/game/draw";

export default function HeroAvatar({ scale = 6, dir = "down" }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const spr = buildHero(dir, 0);
    cv.width = spr.width * scale;
    cv.height = spr.height * scale;
    const ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(spr, 0, 0, cv.width, cv.height);
  }, [scale, dir]);
  return <canvas ref={ref} className="block" style={{ imageRendering: "pixelated" }} aria-label="Pixel avatar of Krishna" />;
}
