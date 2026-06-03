"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

function CopyRow({ label, value, color }) {
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
      className="flex w-full items-center justify-between gap-3 border-b-2 border-dashed border-[#cdbfa0] py-2 text-left"
    >
      <span>
        <span className="block text-[10px] uppercase tracking-wider text-[#9a743f]">
          {label}
        </span>
        <span className="text-[13px] text-[#3a2f22]">{value}</span>
      </span>
      <span
        className="shrink-0 px-2 py-1 text-[10px] text-[#1a1420]"
        style={{ background: color }}
      >
        {copied ? "COPIED!" : "COPY"}
      </span>
    </button>
  );
}

function EnterLink({ href, color, children }) {
  return (
    <Link
      href={href}
      className="font-pixel inline-flex items-center gap-2 px-3 py-2 text-[12px] text-[#1a1420] transition-transform active:translate-y-[2px]"
      style={{ background: color, border: "3px solid #2a2230", boxShadow: "0 3px 0 #2a2230" }}
    >
      {children}
    </Link>
  );
}

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${zone} panel`}
        className="font-pixel relative w-full max-w-md outline-none"
        style={{
          background: "#f3e7cf",
          border: "4px solid #2a2230",
          boxShadow: "8px 8px 0 rgba(0,0,0,0.35)",
          imageRendering: "pixelated",
          outline: "none",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: color, borderBottom: "4px solid #2a2230" }}
        >
          <span className="text-[15px] font-bold tracking-wide text-[#1a1420]">
            {zone === "projects"
              ? "QUEST BOARD"
              : zone === "inn"
              ? "THE INN"
              : zone === "welcome"
              ? "WELCOME, TRAVELLER"
              : (cls?.name ?? zone).toUpperCase()}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-6 w-6 place-items-center bg-[#2a2230] text-[12px] text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 text-[#3a2f22]">
          {zone === "welcome" && (
            <div className="space-y-3 text-[13px] leading-relaxed">
              <p className="text-[15px] font-bold text-[#1a1420]">
                {identity.name}
              </p>
              <p>{identity.tagline} · {identity.location}</p>
              <p>
                Walk into the buildings to explore. The{" "}
                <b>Forge</b> (Builder), <b>Studio</b> (Designer) and{" "}
                <b>Workshop</b> (Engineer) hold the classes. The{" "}
                <b>Quest Board</b> lists shipped projects; the <b>Inn</b> has
                contact details.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <span className="bg-[#e3d4b4] px-2 py-1">MOVE · WASD / Arrows</span>
                <span className="bg-[#e3d4b4] px-2 py-1">MOVE · Click / Tap</span>
                <span className="bg-[#e3d4b4] px-2 py-1">ENTER · E / A button</span>
                <span className="bg-[#e3d4b4] px-2 py-1">CLOSE · Esc / ✕</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <EnterLink href="/about" color={color}>About →</EnterLink>
                <EnterLink href="/contact" color={color}>Contact →</EnterLink>
              </div>
            </div>
          )}

          {cls && (
            <div className="space-y-3 text-[13px] leading-relaxed">
              <p>{cls.bioLong}</p>
              <div className="mt-1 border-t-2 border-[#cdbfa0] pt-2">
                <p className="mb-1 text-[11px] uppercase tracking-wider text-[#9a743f]">
                  Stats
                </p>
                {classStats[zone].map((s) => (
                  <StatRow key={s.label} s={s} color={color} />
                ))}
              </div>
              <div className="pt-1">
                <EnterLink href="/about" color={color}>Full character sheet →</EnterLink>
              </div>
            </div>
          )}

          {zone === "projects" && (
            <div className="space-y-3">
              <p className="text-[12px] text-[#6b5535]">
                Flagship products — live SaaS, built solo end-to-end:
              </p>
              {flagshipProjects.map((p) => (
                <div key={p.id} className="border-2 border-[#cdbfa0] bg-[#efe2c4] p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#1a1420]">{p.name}</span>
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-[2px] text-[10px] text-[#1a1420]"
                      style={{ background: color }}
                    >
                      VISIT ↗
                    </a>
                  </div>
                  <p className="text-[12px] text-[#3a2f22]">{p.blurb}</p>
                  <p className="mt-1 text-[11px] text-[#6b5535]">{p.status}</p>
                  <div className="mt-2">
                    <EnterLink href={`/quest/${p.id}`} color={color}>Open quest →</EnterLink>
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-[#cdbfa0] pt-3">
                <p className="mb-2 text-[12px] text-[#3a2f22]">
                  Plus client work &amp; lab builds — <b>{projects.length} projects</b> in all.
                </p>
                <EnterLink href="/quests" color={color}>Walk the Hall of Quests →</EnterLink>
              </div>
            </div>
          )}

          {zone === "inn" && (
            <div className="space-y-1 text-[13px]">
              <p className="mb-2 text-[12px] text-[#6b5535]">
                Leave a note — tap any line to copy.
              </p>
              <CopyRow label="Email" value={identity.email} color={color} />
              <CopyRow label="Phone" value={identity.phone} color={color} />
              <CopyRow label="GitHub" value={identity.github} color={color} />
              <div className="mt-3 border-t-2 border-[#cdbfa0] pt-2">
                <p className="text-[11px] uppercase tracking-wider text-[#9a743f]">
                  Achievements
                </p>
                <ul className="mt-1 space-y-[2px] text-[12px]">
                  {achievements.slice(0, 4).map((a) => (
                    <li key={a}>★ {a}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-3">
                <EnterLink href="/contact" color={color}>Open the guestbook →</EnterLink>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2 text-[11px]"
          style={{ borderTop: "4px solid #2a2230", background: "#e3d4b4" }}
        >
          <Link href="/traditional" className="text-[#6b3f22] underline">
            Full résumé view →
          </Link>
          <span className="text-[#9a743f]">[Esc] close</span>
        </div>
      </div>
    </div>
  );
}
