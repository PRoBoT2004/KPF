"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// The 404 arcade: two small games, loaded only when the page needs them.
const Box = () => <div className="aspect-[4/5] w-full animate-pulse rounded-[22px] bg-[#f2f2f0] sm:aspect-[16/11]" />;
const OrderRush = dynamic(() => import("./OrderRush"), { ssr: false, loading: Box });
const PairUp = dynamic(() => import("./PairUp"), { ssr: false, loading: Box });

const GAMES = [
  { id: "rush", label: "Order rush" },
  { id: "pairs", label: "Pair up" },
];

export default function Arcade() {
  const [game, setGame] = useState("rush");
  return (
    <section aria-label="Games" className="w-full">
      <div role="tablist" aria-label="Pick a game" className="mb-3 inline-flex rounded-full border border-[var(--line-2)] bg-white p-1 text-[14px]">
        {GAMES.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={game === g.id} aria-controls={`game-${g.id}`} id={`tab-${g.id}`}
            onClick={() => setGame(g.id)}
            className={`rounded-full px-4 py-2 font-medium transition-colors duration-300 ${game === g.id ? "bg-[#0b0b0b] text-white" : "text-[var(--ink-2)] hover:text-[var(--ink)]"}`}>
            {g.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`game-${game}`} aria-labelledby={`tab-${game}`}>
        {game === "rush" ? <OrderRush /> : <PairUp />}
      </div>
    </section>
  );
}
