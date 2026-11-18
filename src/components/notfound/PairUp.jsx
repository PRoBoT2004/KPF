"use client";
import { useCallback, useEffect, useState } from "react";

// ============================================================
// Pair up: a memory game with the tools I build with.
// Flip two cards; matching pairs stay open. Fewest moves wins.
// Every card is a real button, so it plays with Tab + Enter too.
// ============================================================
const TOOLS = [
  { name: "Figma", note: "where it starts" },
  { name: "React", note: "the screens" },
  { name: "Next.js", note: "the app" },
  { name: "Postgres", note: "the records" },
  { name: "Firebase", note: "live data" },
  { name: "Tailwind", note: "the styling" },
];
const BEST_KEY = "km-404-pairs-best";
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };
const saveBest = (v) => { try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* storage blocked */ } };

const shuffled = () => {
  const d = [...TOOLS, ...TOOLS].map((t, i) => ({ ...t, key: i }));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

export default function PairUp() {
  const [deck, setDeck] = useState(null);
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState(() => new Set());
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(0);
  const [lock, setLock] = useState(false);

  const reset = useCallback(() => { setDeck(shuffled()); setOpen([]); setDone(new Set()); setMoves(0); setLock(false); }, []);
  useEffect(() => { reset(); setBest(readBest()); }, [reset]); // shuffle on the client only

  const won = deck && done.size === deck.length;
  useEffect(() => {
    if (!won) return;
    const b = readBest();
    if (!b || moves < b) { saveBest(moves); setBest(moves); }
  }, [won, moves]);

  const flip = (i) => {
    if (lock || open.includes(i) || done.has(i)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next;
    if (deck[a].name === deck[b].name) {
      setDone((d) => new Set([...d, a, b]));
      setOpen([]);
    } else {
      setLock(true);
      setTimeout(() => { setOpen([]); setLock(false); }, 800);
    }
  };

  return (
    <div className="rounded-[22px] border border-[var(--line-2)] bg-[#f6f6f4] p-[clamp(0.75rem,1.6vw,1.1rem)]">
      <div className="flex items-center justify-between px-1 pb-3 text-[13px]">
        <span className="tnum font-medium">Moves {moves}</span>
        <span className="text-[var(--mute)]">{done.size / 2} / {TOOLS.length} pairs</span>
        <span className="tnum text-[var(--mute)]">Best {best || "–"}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Memory cards">
        {(deck || shuffledPlaceholder).map((c, i) => {
          const up = open.includes(i) || done.has(i);
          return (
            <button key={c.key} type="button" onClick={() => deck && flip(i)} disabled={!deck || done.has(i)}
              aria-label={up ? `${c.name}, ${c.note}` : "Hidden card"}
              className="group relative aspect-[4/3] [perspective:800px] focus-visible:outline-none">
              <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transformStyle: "preserve-3d", transform: up ? "rotateY(180deg)" : "none" }}>
                {/* back */}
                <span className="absolute inset-0 grid place-items-center rounded-[14px] bg-[#0b0b0b] text-white/70 ring-offset-2 ring-offset-[#f6f6f4] group-focus-visible:ring-2 group-focus-visible:ring-[var(--ink)]"
                  style={{ backfaceVisibility: "hidden" }}>
                  <span className="wide text-[15px] font-[620] tracking-[-0.03em]">KM</span>
                </span>
                {/* face */}
                <span className={`absolute inset-0 flex flex-col items-center justify-center rounded-[14px] border text-center ${done.has(i) ? "border-[#1f9d55]/40 bg-[#eef8f1]" : "border-[var(--line-2)] bg-white"}`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <span className="wide text-[clamp(0.95rem,1.6vw,1.25rem)] font-[600] leading-none tracking-[-0.03em]">{c.name}</span>
                  <span className="mt-1 text-[11.5px] text-[var(--mute)]">{c.note}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex min-h-[3rem] items-center justify-between gap-3 px-1 pt-3 text-[14px]">
        <p aria-live="polite" className="text-[var(--ink-2)]">
          {won ? `Solved in ${moves} moves${moves === best ? ", your best." : "."}` : "Find the six pairs."}
        </p>
        <button type="button" onClick={reset} className="rounded-full border border-[var(--line-2)] px-4 py-2 font-medium transition-colors hover:border-[var(--ink)]">
          {won ? "Play again" : "Shuffle"}
        </button>
      </div>
    </div>
  );
}

const shuffledPlaceholder = [...TOOLS, ...TOOLS].map((t, i) => ({ ...t, key: i }));
