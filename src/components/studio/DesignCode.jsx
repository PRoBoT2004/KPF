"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { capabilities } from "@/data/studio";
import { Label, MaskLines, PAD, Reveal } from "./primitives";

// The tile both layers describe — the "Today's Sales" KPI from Shop-ERP.
function KpiCard({ className = "" }) {
  return (
    <div className={`w-[clamp(220px,24vw,290px)] border border-[#E2E2DF] bg-white p-6 text-left text-[#0A0A0A] ${className}`}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[#6B6B6B]">Today&apos;s Sales</p>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#0A0A0A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0A0A0A]" />Live
        </span>
      </div>
      <p className="mt-3 text-[32px] font-medium leading-none tracking-[-0.04em] tnum">₹4,513</p>
      <p className="mt-2 text-[12px] text-[#6B6B6B]">58 orders today</p>
    </div>
  );
}

function Redline({ className, label, vertical }) {
  return (
    <span aria-hidden className={`absolute flex items-center justify-center ${className}`}>
      <span className={`absolute bg-[#0A0A0A] ${vertical ? "inset-y-0 left-1/2 w-px" : "inset-x-0 top-1/2 h-px"}`} />
      <span className="relative bg-[#0A0A0A] px-1 text-[9px] font-medium leading-[14px] text-white tnum">{label}</span>
    </span>
  );
}

function DesignLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--card)]"
      style={{ backgroundImage: "radial-gradient(#D6D6D2 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
      <div className="absolute inset-x-0 top-0 flex h-10 items-center gap-3 border-b border-[#E2E2DF] bg-white px-4 text-[11.5px] font-medium text-[#6B6B6B]">
        <span>Shop-ERP</span><span className="text-[#C4C4C0]">/</span><span className="text-[#0A0A0A]">Dashboard</span>
        <span className="ml-auto hidden uppercase sm:inline">Design</span>
      </div>
      <div className="absolute left-[6%] top-[22%] sm:left-[8%]">
        <p className="mb-2 text-[11px] text-[#6B6B6B]">KPI / Today&apos;s sales / Default</p>
        <div className="relative outline outline-1 outline-[#0A0A0A]">
          <KpiCard />
          <Redline className="left-0 top-[46px] h-3 w-6" label="24" />
          <Redline className="left-[26px] top-0 h-6 w-3" label="24" vertical />
          <Redline className="bottom-0 right-[64px] h-6 w-3" label="24" vertical />
          {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((c) => (
            <span key={c} aria-hidden className={`absolute h-2 w-2 border border-[#0A0A0A] bg-white ${c}`} />
          ))}
          <span aria-hidden className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0A0A0A] px-1.5 py-px text-[9.5px] font-medium text-white tnum">290 × 148</span>
        </div>
        <div className="mt-10 flex items-center gap-2">
          {["#0A0A0A", "#2E2E2E", "#6B6B6B", "#E2E2DF", "#FFFFFF"].map((c) => (
            <span key={c} className="h-6 w-6 rounded-full ring-1 ring-black/10" style={{ background: c }} title={c} />
          ))}
          <span className="ml-1 text-[11px] text-[#6B6B6B]">Tokens</span>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 top-10 hidden w-[min(34%,260px)] border-l border-[#E2E2DF] bg-white p-4 text-[11.5px] text-[#6B6B6B] md:block">
        <p className="font-medium uppercase text-[#0A0A0A]">Inspect</p>
        {[["Frame", "290 × 148"], ["Fill", "#FFFFFF"], ["Stroke", "1 · #E2E2DF"], ["Padding", "24"], ["Gap", "8 · auto layout"]].map(([k, v]) => (
          <div key={k} className="mt-2.5 flex justify-between border-b border-[#EFEFEC] pb-2"><span>{k}</span><span className="text-[#0A0A0A] tnum">{v}</span></div>
        ))}
        <p className="mt-5 font-medium uppercase text-[#0A0A0A]">Type</p>
        {[["Label", "13 / Medium"], ["Value", "32 / Medium · tnum"], ["Meta", "12 / Regular"]].map(([k, v]) => (
          <div key={k} className="mt-2.5 flex justify-between border-b border-[#EFEFEC] pb-2"><span>{k}</span><span className="text-[#0A0A0A]">{v}</span></div>
        ))}
      </div>
    </div>
  );
}

const CODE = [
  [["k", "export function "], ["f", "KpiCard"], ["p", "({ label, value, sub }) {"]],
  [["k", "  return "], ["p", "("]],
  [["t", "    <article "], ["a", "className"], ["p", "="], ["s", '"border bg-white p-6"'], ["t", ">"]],
  [["t", "      <header "], ["a", "className"], ["p", "="], ["s", '"flex items-start justify-between"'], ["t", ">"]],
  [["t", "        <h3 "], ["a", "className"], ["p", "="], ["s", '"text-[13px] font-medium text-muted"'], ["t", ">"], ["p", "{label}"], ["t", "</h3>"]],
  [["t", "        <LiveBadge />"]],
  [["t", "      </header>"]],
  [["t", "      <p "], ["a", "className"], ["p", "="], ["s", '"mt-3 text-[32px] font-medium tabular-nums"'], ["t", ">"]],
  [["p", "        {inr(value)}"]],
  [["t", "      </p>"]],
  [["t", "      <p "], ["a", "className"], ["p", "="], ["s", '"mt-2 text-xs text-muted"'], ["t", ">"], ["p", "{sub}"], ["t", "</p>"]],
  [["t", "    </article>"]],
  [["p", "  );"]],
  [["p", "}"]],
  [["p", ""]],
  [["c", "// usage — Shop-ERP dashboard"]],
  [["t", "<KpiCard "], ["a", "label"], ["p", "="], ["s", '"Today\'s Sales"'], ["a", " value"], ["p", "={total}"], ["a", " sub"], ["p", "={`${orders} orders today`}"], ["t", " />"]],
];
const TONE = { k: "#FFFFFF", f: "#FFFFFF", p: "#BDBDBD", t: "#E8E8E8", a: "#9A9A9A", s: "#CFCFCF", c: "#6E6E6E" };

function CodeLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-x-0 top-0 flex h-10 items-center gap-4 border-b border-[#262626] px-4 text-[11.5px] font-medium text-[#8F8F8F]">
        <span className="hidden md:inline">localhost:3000/dashboard</span>
        <span className="border-b border-white py-[11px] text-white md:ml-[calc(44%-10rem)]">KpiCard.jsx</span>
        <span className="hidden lg:inline">Dashboard.jsx</span>
        <span className="ml-auto hidden uppercase sm:inline">Code</span>
      </div>
      <div className="absolute left-[6%] top-[22%] hidden sm:left-[8%] md:block">
        <p className="mb-2 text-[11px] text-[#8F8F8F]">Rendered, production build</p>
        <KpiCard />
      </div>
      <pre className="absolute bottom-0 left-0 right-0 top-10 overflow-hidden border-[#262626] px-3 py-4 font-[family-name:var(--font-studio)] text-[clamp(10px,1.02vw,13px)] leading-[1.75] sm:px-5 md:left-[44%] md:border-l" aria-label="React component code for the KPI card">
        {CODE.map((line, i) => (
          <div key={i} className="flex whitespace-pre">
            <span className="mr-4 inline-block w-5 select-none text-right text-[#6E6E6E] tnum">{i + 1}</span>
            <span>{line.map(([k, s], j) => <span key={j} style={{ color: TONE[k] }}>{s}</span>)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function Comparator() {
  const wrap = useRef(null);
  const inView = useInView(wrap, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const pos = useMotionValue(50);
  const clip = useTransform(pos, (v) => `inset(0 0 0 ${v}%)`);
  const left = useTransform(pos, (v) => `${v}%`);
  const [val, setVal] = useState(50);
  const dragging = useRef(false);

  useEffect(() => pos.on("change", (v) => setVal(Math.round(v))), [pos]);
  // one-time sweep so people discover it's draggable
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(pos, [50, 24, 76, 50], { duration: 2.8, ease: "easeInOut", times: [0, 0.35, 0.75, 1], delay: 0.4 });
    return () => c.stop();
  }, [inView, reduce, pos]);

  const setFromX = useCallback((clientX) => {
    const r = wrap.current.getBoundingClientRect();
    pos.set(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, [pos]);

  return (
    <div ref={wrap}
      className="relative h-[clamp(420px,50vw,600px)] cursor-ew-resize touch-pan-y select-none overflow-hidden border border-[var(--line-2)]"
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFromX(e.clientX); }}
      onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}>
      <DesignLayer />
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <CodeLayer />
      </motion.div>

      <span className="pointer-events-none absolute bottom-4 left-4 bg-[#0A0A0A] px-2.5 py-1 text-[11px] font-medium uppercase text-white">Design</span>
      <span className="pointer-events-none absolute bottom-4 right-4 bg-white px-2.5 py-1 text-[11px] font-medium uppercase text-[#0A0A0A]">Code</span>

      <motion.div className="absolute inset-y-0 z-10 w-0" style={{ left }}>
        <span aria-hidden className="absolute inset-y-0 -left-px w-[2px] bg-[#7F7F7F]" />
        <button type="button" role="slider" aria-label="Compare design and code" aria-valuemin={0} aria-valuemax={100} aria-valuenow={val}
          aria-valuetext={`${val}% design`}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 10 : 4;
            if (e.key === "ArrowLeft") { e.preventDefault(); pos.set(Math.max(4, pos.get() - step)); }
            if (e.key === "ArrowRight") { e.preventDefault(); pos.set(Math.min(96, pos.get() + step)); }
          }}
          className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#3A3A3A] bg-[#0A0A0A] text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}

export default function DesignCode() {
  return (
    <section aria-label="Design and engineering" data-nav="light" className={`py-[clamp(5rem,10vw,9rem)] ${PAD}`}>
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-6">
          <div className="col-span-12 md:col-span-8">
            <Label n="04">Design ⇄ Code</Label>
            <MaskLines lines={["Same hands.", "Both sides."]} className="mt-4 text-[clamp(3rem,8.4vw,8.4rem)] font-medium leading-[0.86] tracking-[-0.065em]" />
          </div>
          <Reveal className="col-span-12 max-w-[42ch] pb-2 text-[15px] leading-snug text-[var(--mute)] md:col-span-4">
            Drag the line. On the left, a Shop-ERP sales tile specced the way I work in Figma: spacing, tokens, type. On the right,
            the same tile as a React component. One person owns both sides, so nothing is lost in a handoff.
          </Reveal>
        </div>

        <Reveal className="mt-[clamp(2rem,4vw,3.5rem)]"><Comparator /></Reveal>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-4 gap-y-12 md:grid-cols-2">
          {[
            { key: "design", title: "Design", items: capabilities.design },
            { key: "engineering", title: "Engineering", items: capabilities.engineering },
          ].map((col, ci) => (
            <Reveal key={col.key} delay={ci * 0.08}>
              <div className="flex items-baseline justify-between border-b border-[var(--ink)] pb-3">
                <h3 className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium tracking-[-0.045em]">{col.title}</h3>
                <span className="text-[12.5px] text-[var(--mute)] tnum">({String(col.items.length).padStart(2, "0")})</span>
              </div>
              <ul>
                {col.items.map((it, i) => (
                  <li key={it} className="group flex items-baseline gap-4 border-b border-[var(--line-2)] py-3 text-[clamp(0.98rem,1.15vw,1.08rem)]">
                    <span className="w-8 text-[12px] text-[var(--mute)] tnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">{it}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
