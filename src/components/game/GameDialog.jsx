"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  identity,
  classes,
  classStats,
  levelToPips,
  projects,
  flagshipProjects,
  achievements,
} from "@/data/portfolio";

const ACCENT = {
  designer: "#E07B6B",
  engineer: "#4FD1C5",
  builder: "#D4A848",
  projects: "#D4A848",
  inn: "#6abe4f",
  welcome: "#4FD1C5",
  portal: "#4FD1C5",
};

// Signature quests per class building — the same work, filtered by discipline.
const pick = (ids) => ids.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
const SIGNATURE = {
  designer: pick(["enda", "hazeberg", "meditrack", "launchpad", "vitran"]),
  engineer: pick(["shop-erp", "touchpe", "vitran", "trade-crm", "cryptodash"]),
  builder: pick(["touchpe", "shop-erp", "trade-crm", "hazeberg", "vitran"]),
};

function Pips({ level, color }) {
  const n = levelToPips(level);
  return (
    <span className="inline-flex gap-[3px] align-middle">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="inline-block h-3 w-3"
          style={{
            background: i <= n ? color : "#cdbfa0",
            boxShadow: "inset -1px -1px 0 rgba(0,0,0,0.25)",
          }}
        />
      ))}
    </span>
  );
}

function StatRow({ s, color }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[3px]">
      <span className="text-[13px] text-[#3a2f22]">{s.label}</span>
      <span className="flex items-center gap-2">
        <Pips level={s.level} color={color} />
        <span className="w-[78px] text-right text-[11px] text-[#6b5535]">
          {s.level}
        </span>
      </span>
    </div>
  );
}

// Robust copy — navigator.clipboard is unavailable over plain-HTTP (LAN/phone),
// so fall back to a temporary <textarea> + execCommand('copy').
function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}
function legacyCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

const INK = "#2a2230";
const PAPER = "#f6ecd6";

// tiny pixel icons for the title banner (8×8 grid, crisp)
const ICONS = {
  projects: [[1, 1, 6, 1], [1, 1, 1, 6], [6, 1, 1, 6], [1, 6, 6, 1], [2, 3, 4, 1], [2, 4, 3, 1]],
  builder: [[1, 2, 4, 2], [5, 1, 2, 4], [3, 4, 1, 4], [2, 7, 3, 1]],
  designer: [[5, 0, 2, 2], [4, 2, 2, 2], [3, 4, 2, 2], [1, 6, 2, 2], [6, 1, 1, 1]],
  engineer: [[0, 3, 2, 2], [2, 1, 1, 2], [2, 5, 1, 2], [6, 3, 2, 2], [5, 1, 1, 2], [5, 5, 1, 2], [3, 6, 2, 1], [3, 1, 2, 1]],
  inn: [[1, 3, 6, 4], [0, 2, 8, 1], [2, 1, 4, 1], [3, 0, 2, 1], [3, 5, 2, 2]],
  portal: [[2, 0, 4, 1], [1, 1, 1, 6], [6, 1, 1, 6], [0, 7, 8, 1], [3, 3, 2, 2]],
  welcome: [[3, 0, 2, 2], [0, 2, 8, 2], [1, 4, 6, 1], [2, 5, 4, 1], [1, 6, 2, 2], [5, 6, 2, 2]],
};
function PixelIcon({ d, color = INK, size = 18 }) {
  return (
    <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" aria-hidden fill={color}>
      {d.map(([x, y, w = 1, h = 1], i) => <rect key={i} x={x} y={y} width={w} height={h} />)}
    </svg>
  );
}

function Heading({ children }) {
  return (
    <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#8a6a35]">
      <span className="inline-block h-[6px] w-[6px] bg-[#c99a3e]" style={{ boxShadow: `1px 1px 0 ${INK}` }} aria-hidden />
      {children}
      <span className="h-[2px] flex-1" style={{ backgroundImage: "linear-gradient(90deg,#cdb88f 50%,transparent 50%)", backgroundSize: "6px 2px" }} aria-hidden />
    </p>
  );
}

function Thumb({ p, w = 96, h = 60 }) {
  return (
    <span className="relative block shrink-0 overflow-hidden bg-[#1c1820]" style={{ width: w, height: h, boxShadow: `0 0 0 2px ${INK}, 3px 3px 0 0 rgba(42,34,48,0.35)` }}>
      {p.cover && <Image src={p.cover} alt="" fill sizes={`${w * 2}px`} className="object-cover object-top" />}
    </span>
  );
}

function CopyRow({ label, value, color, icon }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        copyText(value).then((ok) => {
          if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }
        });
      }}
      className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-transform hover:-translate-y-[1px]"
      style={{ background: "#fbf4e4", boxShadow: `0 0 0 2px ${INK}, 3px 3px 0 0 rgba(42,34,48,0.3)` }}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center" style={{ background: color, boxShadow: `0 0 0 2px ${INK}` }}>
        <PixelIcon d={icon} size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-[0.14em] text-[#9a743f]">{label}</span>
        <span className="block truncate text-[13px] text-[#2e2519]">{value}</span>
      </span>
      <span className="shrink-0 px-2 py-1 text-[10px] text-[#1a1420] transition-colors" style={{ background: copied ? "#7bc24f" : "#efe1c0", boxShadow: `0 0 0 2px ${INK}` }}>
        {copied ? "COPIED!" : "COPY"}
      </span>
    </button>
  );
}

function EnterLink({ href, color, children, ext }) {
  const cls = "font-pixel inline-flex items-center gap-2 px-3 py-2 text-[12px] text-[#1a1420] transition-transform hover:-translate-y-[1px] active:translate-y-[2px]";
  const style = { background: color, boxShadow: `0 0 0 2px ${INK}, 0 4px 0 2px ${INK}`, marginBottom: 4 };
  if (ext) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>;
  return <Link href={href} className={cls} style={style}>{children}</Link>;
}

const ICON_MAIL = [[0, 1, 8, 1], [0, 6, 8, 1], [0, 1, 1, 6], [7, 1, 1, 6], [1, 2, 1, 1], [2, 3, 1, 1], [3, 4, 2, 1], [5, 3, 1, 1], [6, 2, 1, 1]];
const ICON_PHONE = [[2, 0, 4, 1], [2, 7, 4, 1], [2, 0, 1, 8], [5, 0, 1, 8], [3, 5, 2, 1], [3, 2, 2, 2]];
const ICON_GIT = [[2, 0, 4, 1], [1, 1, 6, 4], [2, 5, 4, 1], [3, 6, 2, 2], [0, 6, 2, 1]];

export default function GameDialog({ zone, onClose }) {
  const ref = useRef(null);
  const color = ACCENT[zone] ?? "#D4A848";

  // focus for keyboard, close on Esc
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cls = classes[zone];
  const title = zone === "projects" ? "Quest Board" : zone === "inn" ? "The Inn" : zone === "welcome" ? "Welcome, traveller"
    : zone === "portal" ? "The Portal" : cls?.name ?? zone;
  const sub = zone === "projects" ? "Shipped work" : zone === "inn" ? "Rest a while · say hello" : zone === "welcome" ? "Town square"
    : zone === "portal" ? "To the studio site" : zone === "builder" ? "Builder's Forge · recommended" : zone === "designer" ? "Designer's Studio" : "Engineer's Workshop";

  return (
    <div className="kw-fade fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "radial-gradient(120% 90% at 50% 50%, rgba(18,13,22,0.35), rgba(18,13,22,0.72))", backdropFilter: "blur(2px)" }}
      onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="kw-pop font-pixel relative flex max-h-[88vh] w-full max-w-[31rem] flex-col outline-none"
        style={{
          background: `linear-gradient(180deg, #fbf3e1, ${PAPER} 40%, #efe0c0)`,
          outline: "none",
          boxShadow: `0 0 0 3px ${INK}, inset 0 0 0 3px #fff8ea, inset 0 0 0 5px rgba(201,154,62,0.55), 10px 10px 0 0 rgba(20,12,24,0.45)`,
        }}
      >
        {/* corner rivets */}
        {["left-1.5 top-1.5", "right-1.5 top-1.5", "left-1.5 bottom-1.5", "right-1.5 bottom-1.5"].map((p) => (
          <span key={p} className={`pointer-events-none absolute z-10 h-[6px] w-[6px] ${p}`} style={{ background: "#c99a3e", boxShadow: `0 0 0 1px ${INK}` }} aria-hidden />
        ))}

        {/* Title banner */}
        <div className="relative mx-[5px] mt-[5px] flex items-center gap-3 px-4 py-2.5"
          style={{ background: color, boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.35), 0 3px 0 ${INK}` }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center" style={{ background: "#fff8ea", boxShadow: `0 0 0 2px ${INK}` }}>
            <PixelIcon d={ICONS[zone] || ICONS.welcome} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[16px] font-bold uppercase leading-tight tracking-wide text-[#1a1420]">{title}</span>
            <span className="block truncate text-[11px] text-[#1a1420]/70">{sub}</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Close"
            className="grid h-7 w-7 shrink-0 place-items-center text-[13px] text-white transition-transform hover:scale-105"
            style={{ background: INK, boxShadow: "0 0 0 2px rgba(255,255,255,0.25)" }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-5 text-[#3a2f22]">
          {zone === "welcome" && (
            <div className="space-y-4 text-[13px] leading-relaxed">
              <div>
                <p className="text-[16px] font-bold text-[#1a1420]">{identity.name}</p>
                <p className="text-[12px] text-[#6b5535]">{identity.tagline} · {identity.location}</p>
              </div>
              <p>
                Walk into the buildings to explore. The <b>Forge</b> (Builder), <b>Studio</b> (Designer) and{" "}
                <b>Workshop</b> (Engineer) hold the classes. The <b>Quest Board</b> lists shipped projects; the{" "}
                <b>Inn</b> has contact details. The <b>Portal</b> (east) leads to the studio site — the same work as a
                scrollable portfolio.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[["MOVE", "WASD / Arrows"], ["WALK", "Click / Tap"], ["TALK · ENTER", "E / A button"], ["RUN", "Hold Shift"]].map(([k, v]) => (
                  <span key={k} className="px-2.5 py-1.5" style={{ background: "#fbf4e4", boxShadow: `0 0 0 2px ${INK}` }}>
                    <span className="block text-[10px] text-[#9a743f]">{k}</span>{v}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <EnterLink href="/about" color={color}>About →</EnterLink>
                <EnterLink href="/contact" color={color}>Contact →</EnterLink>
              </div>
            </div>
          )}

          {cls && (
            <div className="space-y-5 text-[13px] leading-relaxed">
              <p className="text-[13.5px] text-[#2e2519]">{cls.bioLong}</p>
              <div>
                <Heading>Stats</Heading>
                <div className="px-3 py-2" style={{ background: "#fbf4e4", boxShadow: `0 0 0 2px ${INK}` }}>
                  {classStats[zone].map((s) => <StatRow key={s.label} s={s} color={color} />)}
                </div>
              </div>
              <div>
                <Heading>Signature quests</Heading>
                <ul className="space-y-2">
                  {SIGNATURE[zone].map((p) => (
                    <li key={p.id}>
                      <Link href={`/quest/${p.id}`} className="group flex items-center gap-3 px-2 py-2 transition-transform hover:-translate-y-[1px]"
                        style={{ background: "#fbf4e4", boxShadow: `0 0 0 2px ${INK}` }}>
                        <Thumb p={p} w={58} h={38} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold text-[#1a1420]">{p.name}</span>
                          <span className="block truncate text-[11px] text-[#6b5535]">{(zone === "designer" ? p.design : zone === "engineer" ? p.engineering : [p.subtitle])?.[0]}</span>
                        </span>
                        <span className="pr-1 text-[#9a743f] transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <EnterLink href="/about" color={color}>Full character sheet →</EnterLink>
            </div>
          )}

          {zone === "portal" && (
            <div className="space-y-4 text-[13px] leading-relaxed">
              <p>
                The air hums. Through the arch: the <b>studio site</b> — every project as a scrollable portfolio.
                Case studies, design and code, process and contact.
              </p>
              <p className="text-[12px] text-[#6b5535]">Built for recruiters in a hurry, and anyone who&apos;d rather scroll than walk.</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <EnterLink href="/" color={color}>Step through →</EnterLink>
                <EnterLink href="/work/trade-crm" color="#e6bb52">Newest: Trade CRM →</EnterLink>
              </div>
            </div>
          )}

          {zone === "projects" && (
            <div className="space-y-4">
              <p className="text-[12px] text-[#6b5535]">Flagship products — live SaaS, designed and built end to end:</p>
              {flagshipProjects.map((p) => (
                <div key={p.id} className="flex gap-3 p-3" style={{ background: "#fbf4e4", boxShadow: `0 0 0 2px ${INK}, 4px 4px 0 0 rgba(42,34,48,0.22)` }}>
                  <Thumb p={p} w={96} h={62} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold leading-tight text-[#1a1420]">{p.name}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#3a2f22]">{p.blurb}</p>
                    <p className="mt-1 text-[10.5px] leading-snug text-[#7a6040]">{p.status}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <EnterLink href={`/quest/${p.id}`} color={color}>Open quest →</EnterLink>
                      {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#6b3f22] underline underline-offset-2">Visit live ↗</a>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-1">
                <p className="mb-3 text-[12px] text-[#3a2f22]">Plus client work &amp; lab builds — <b>{projects.length} projects</b> in all.</p>
                <EnterLink href="/quests" color={color}>Walk the Hall of Quests →</EnterLink>
              </div>
            </div>
          )}

          {zone === "inn" && (
            <div className="space-y-4 text-[13px]">
              <p className="text-[12px] text-[#6b5535]">Leave a note — tap any card to copy.</p>
              <div className="space-y-3">
                <CopyRow label="Email" value={identity.email} color={color} icon={ICON_MAIL} />
                <CopyRow label="Phone" value={identity.phone} color={color} icon={ICON_PHONE} />
                <CopyRow label="GitHub" value={identity.github} color={color} icon={ICON_GIT} />
              </div>
              <div>
                <Heading>Achievements</Heading>
                <ul className="space-y-1.5 text-[12px]">
                  {achievements.slice(0, 4).map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="mt-[3px]"><PixelIcon d={ICONS.welcome} color="#c99a3e" size={11} /></span>{a}
                    </li>
                  ))}
                </ul>
              </div>
              <EnterLink href="/contact" color={color}>Open the guestbook →</EnterLink>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mx-[5px] mb-[5px] flex items-center justify-between px-4 py-2 text-[11px]"
          style={{ background: "#eadbb8", boxShadow: `0 -2px 0 ${INK}` }}>
          <span className="flex gap-4">
            <Link href="/resume" className="text-[#6b3f22] underline underline-offset-2">Résumé →</Link>
            <Link href="/" className="text-[#6b3f22] underline underline-offset-2">Studio site →</Link>
          </span>
          <span className="text-[#9a743f]">[Esc] close</span>
        </div>
      </div>
    </div>
  );
}
