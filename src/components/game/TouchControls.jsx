"use client";

// On-screen controls for touch devices. SVG arrows; pointer-driven holds.
function Arrow({ rotate = 0 }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <path d="M12 5 L19 15 H5 Z" fill="currentColor" />
    </svg>
  );
}

function DirBtn({ dir, rotate, onPress, onRelease, className }) {
  const start = (e) => {
    e.preventDefault();
    onPress(dir);
  };
  const end = (e) => {
    e.preventDefault();
    onRelease(dir);
  };
  return (
    <button
      type="button"
      aria-label={dir}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={end}
      onPointerCancel={end}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex items-center justify-center bg-[#2a2230]/85 text-[#f3e7cf] active:bg-[#4FD1C5] active:text-[#1a1420] ${className}`}
      style={{ touchAction: "none", border: "2px solid rgba(243,231,207,0.25)" }}
    >
      <Arrow rotate={rotate} />
    </button>
  );
}

export default function TouchControls({ onPress, onRelease, onAction }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex select-none items-end justify-between px-5 pb-6">
      {/* D-pad */}
      <div
        className="pointer-events-auto grid h-36 w-36 grid-cols-3 grid-rows-3 gap-1"
        style={{ touchAction: "none" }}
      >
        <span />
        <DirBtn dir="up" rotate={0} onPress={onPress} onRelease={onRelease} className="rounded-t-lg" />
        <span />
        <DirBtn dir="left" rotate={-90} onPress={onPress} onRelease={onRelease} className="rounded-l-lg" />
        <span className="bg-[#2a2230]/60" />
        <DirBtn dir="right" rotate={90} onPress={onPress} onRelease={onRelease} className="rounded-r-lg" />
        <span />
        <DirBtn dir="down" rotate={180} onPress={onPress} onRelease={onRelease} className="rounded-b-lg" />
        <span />
      </div>

      {/* Action button */}
      <button
        type="button"
        aria-label="Interact"
        onPointerDown={(e) => {
          e.preventDefault();
          onAction();
        }}
        onContextMenu={(e) => e.preventDefault()}
        className="pointer-events-auto grid h-20 w-20 place-items-center rounded-full text-[20px] font-bold text-[#1a1420] active:scale-95"
        style={{
          background: "#D4A848",
          border: "3px solid #2a2230",
          boxShadow: "0 4px 0 #2a2230",
          fontFamily: "var(--font-pixel)",
          touchAction: "none",
        }}
      >
        A
      </button>
    </div>
  );
}
