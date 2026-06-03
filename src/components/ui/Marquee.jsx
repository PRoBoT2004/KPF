"use client";

/**
 * Infinite horizontal marquee. Duplicates children so the scroll is seamless.
 * Edges fade out via a mask for a polished "tools wall".
 */
export default function Marquee({
  children,
  duration = 40,
  gap = "2rem",
  reverse = false,
  pauseOnHover = true,
  className = "",
}) {
  return (
    <div
      className={`group relative flex w-full overflow-hidden ${className}`}
      style={{
        "--marquee-duration": `${duration}s`,
        "--marquee-gap": gap,
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={`flex shrink-0 items-center ${
            reverse ? "animate-marquee-reverse" : "animate-marquee"
          } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
          style={{ gap, paddingRight: gap }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
