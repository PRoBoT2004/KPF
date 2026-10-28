// ============================================================
// Direction A — "The Counter"
// The site as the shop floor Krishna's software runs on:
// thermal receipts, order tickets, carbon-copy bill books,
// a member tap-card, a POS keypad. Dark counter + paper.
// ============================================================
import { projects, identity, about } from "@/data/portfolio";
import { process, capabilities } from "@/data/studio";
import { resume } from "@/data/resume";

const C = {
  counter: "#121110",
  paper: "#F4F1E9",
  ink: "#1B1A17",
  faded: "#6E695F",
  stamp: "#C8372D",
  gold: "#D4A848",
  text: "#EDE7DA",
  soft: "#9B9384",
};

const byId = (id) => projects.find((p) => p.id === id);

function Check({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Leader({ left, right, strong = false, className = "" }) {
  return (
    <div className={`flex items-baseline gap-2 ${strong ? "font-extrabold" : ""} ${className}`}>
      <span className="shrink-0">{left}</span>
      <span className="min-w-4 flex-1 -translate-y-[3px] border-b-2 border-dotted border-current opacity-30" />
      <span className="shrink-0 tabular-nums">{right}</span>
    </div>
  );
}

/** torn thermal-paper edge */
function Zig({ color = C.paper, flip = false }) {
  return (
    <div
      aria-hidden
      className="h-[10px] w-full"
      style={{
        background: `linear-gradient(${flip ? 45 : 135}deg, ${color} 50%, transparent 50%) 0 0 / 14px 10px repeat-x, linear-gradient(${flip ? -45 : -135}deg, ${color} 50%, transparent 50%) 0 0 / 14px 10px repeat-x`,
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    />
  );
}

function Barcode({ seed = "KRISHNAMEHTA", className = "h-12" }) {
  const w = [];
  for (let i = 0; i < seed.length * 3; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    w.push(1 + (c % 3), 1 + ((c >> 3) % 2));
  }
  return (
    <div className={`flex items-stretch ${className}`} aria-hidden>
      {w.map((v, i) => (
        <span key={i} style={{ width: v * 1.6, background: i % 2 ? "transparent" : C.ink }} />
      ))}
    </div>
  );
}

function Stamp({ children, className = "", color = C.stamp }) {
  return (
    <div
      className={`inline-block select-none rounded-[6px] border-[3px] px-3 py-1.5 text-center font-extrabold uppercase leading-none tracking-[0.14em] ${className}`}
      style={{
        color, borderColor: color, boxShadow: `inset 0 0 0 2px ${C.paper}, inset 0 0 0 4px ${color}`,
        mixBlendMode: "multiply", opacity: 0.86,
        WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.2 1.75'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    >
      {children}
    </div>
  );
}

function TopBar() {
  return (
    <header className="relative z-10 flex items-center justify-between px-[clamp(1.25rem,3vw,2.75rem)] pt-7 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9B9384]">
      <div className="flex items-center gap-3 text-[#EDE7DA]">
        <span className="grid h-9 w-9 place-items-center rounded-[4px] bg-[#F4F1E9] text-[13px] font-extrabold tracking-[0.02em] text-[#1B1A17]">KM</span>
        <span className="tracking-[0.12em]">Krishna Mehta</span>
      </div>
      <nav className="hidden items-center gap-9 md:flex">
        <span>Orders</span><span>How I work</span><span>About</span><span>Checkout</span>
      </nav>
      <span className="rounded-full border border-[#3a362f] px-4 py-2 text-[#EDE7DA]">Play the pixel world</span>
    </header>
  );
}

// ------------------------------------------------------------
// A1 · Hero — a receipt printing out of the counter printer
// ------------------------------------------------------------
export function CounterHero() {
  const items = ["User research", "Interface design", "Design system", "Frontend + backend", "Deploy & support"];
  return (
    <section className="relative min-h-[100svh] overflow-hidden" style={{ background: C.counter, color: C.text }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 60% at 74% -6%, rgba(255,204,140,0.17), transparent 70%)" }} />
      <TopBar />
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-12 gap-6 px-[clamp(1.25rem,3vw,2.75rem)] pt-[clamp(3rem,7vw,6.5rem)]">
        <div className="col-span-12 lg:col-span-7">
          <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.22em] text-[#9B9384]">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inset-0 animate-ping rounded-full bg-[#6FCF7A] opacity-60" /><span className="relative h-2.5 w-2.5 rounded-full bg-[#6FCF7A]" /></span>
            Counter open · Bharuch, IN · 14:32 IST
          </p>
          <h1 className="mt-8 text-[clamp(3.4rem,7.2vw,7.4rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            Designed,<br />built and<br />kept running<br /><span style={{ color: C.gold }}>by one person.</span>
          </h1>
          <p className="mt-9 max-w-[34rem] text-[clamp(1rem,1.25vw,1.2rem)] font-medium leading-relaxed text-[#B8B0A2]">
            More than 300 shops close their month on software I designed and built. Research, interface, code, deploy: the whole bill, one counter.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <span className="rounded-[10px] px-6 py-4 text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#1B1A17]" style={{ background: C.paper, boxShadow: "0 5px 0 #B9B2A3, 0 14px 30px rgba(0,0,0,.4)" }}>See the orders</span>
            <span className="rounded-[10px] border-2 border-[#3a362f] px-6 py-[14px] text-[14px] font-extrabold uppercase tracking-[0.12em]" style={{ boxShadow: "0 5px 0 #2a2722" }}>Play the pixel world</span>
          </div>
        </div>

        {/* printer + receipt */}
        <div className="relative col-span-12 flex justify-center lg:col-span-5">
          <div className="relative w-[min(25rem,92vw)]">
            <div className="relative z-10 h-14 rounded-t-[22px] rounded-b-[8px] border border-[#2e2b26] bg-gradient-to-b from-[#2b2925] to-[#1a1917] shadow-[0_18px_40px_rgba(0,0,0,.55)]">
              <span className="absolute left-5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#6FCF7A] shadow-[0_0_10px_#6FCF7A]" />
              <span className="absolute inset-x-8 bottom-2 h-[3px] rounded bg-black" />
            </div>
            <div className="relative mx-auto -mt-2 w-[92%] rotate-[1.2deg] origin-top shadow-[0_30px_60px_rgba(0,0,0,.5)]">
              <div className="px-7 pb-6 pt-8 text-[12.5px] font-semibold uppercase tracking-[0.08em]" style={{ background: C.paper, color: C.ink }}>
                <div className="text-center">
                  <p className="text-[20px] font-extrabold tracking-[0.04em]">Krishna Mehta</p>
                  <p className="mt-1">Designer + Engineer</p>
                  <p className="mt-1 opacity-60">Bharuch · Gujarat · India</p>
                </div>
                <div className="my-4 border-t-2 border-dashed border-[#1B1A17]/40" />
                <Leader left="Bill" right="KM / 2026" />
                <Leader left="Date" right="27 Oct 2026" className="mt-1" />
                <div className="my-4 border-t-2 border-dashed border-[#1B1A17]/40" />
                <div className="flex justify-between text-[11px] opacity-60"><span>Item</span><span>Qty</span></div>
                <div className="mt-2 space-y-1.5">
                  {items.map((it) => <Leader key={it} left={it} right="1" />)}
                </div>
                <div className="my-4 border-t-2 border-dashed border-[#1B1A17]/40" />
                <Leader left="Handoffs" right="0" />
                <Leader left="People on the job" right="1" className="mt-1.5" />
                <div className="my-4 border-t-[3px] border-double border-[#1B1A17]" />
                <Leader left="Paying merchants" right="300+" strong className="text-[15px]" />
                <Leader left="In production" right="10+ months" strong className="mt-1.5 text-[15px]" />
                <div className="mt-6 flex flex-col items-center gap-2">
                  <Barcode />
                  <p className="text-[10px] tracking-[0.3em] opacity-70">KRISHNA200428</p>
                </div>
                <p className="mt-5 text-center text-[13px] font-extrabold tracking-[0.2em]">Thank you · Visit again</p>
              </div>
              <Zig />
              <Stamp className="absolute -left-24 bottom-[5.2rem] rotate-[-12deg] text-[24px]">Open to<br />work</Stamp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// A2 · Work — order tickets clipped to a rail + a day-book index
// ------------------------------------------------------------
const STATUS = {
  "shop-erp": "Live", hazeberg: "Live", "trade-crm": "Live demo", touchpe: "Ready", enda: "Live",
  vitran: "Ready", launchpad: "Design", "patel-enterprise": "Live", primedigitals: "Live",
  cryptodash: "Build", meditrack: "Study", "fabric-tryon": "MVP",
};

function Ticket({ p, n, tilt, drop }) {
  const both = p.discipline === "both";
  return (
    <div className="relative w-[19.5rem] shrink-0" style={{ transform: `rotate(${tilt}deg) translateY(${drop}px)`, transformOrigin: "50% -20px" }}>
      <span className="absolute -top-7 left-1/2 z-10 h-10 w-7 -translate-x-1/2 rounded-[4px] bg-gradient-to-b from-[#c9c4bb] to-[#8d877c] shadow-[0_3px_6px_rgba(0,0,0,.5)]" />
      <div className="px-5 pb-5 pt-7 text-[12px] font-semibold uppercase tracking-[0.08em] shadow-[0_24px_50px_rgba(0,0,0,.5)]" style={{ background: C.paper, color: C.ink }}>
        <div className="flex items-start justify-between">
          <span className="opacity-60">Ticket {String(n).padStart(2, "0")}</span>
          <Stamp className="-mt-1 rotate-[6deg] text-[12px]" color={STATUS[p.id] === "Live" ? "#2E7D46" : C.stamp}>{STATUS[p.id]}</Stamp>
        </div>
        <p className="mt-2 text-[27px] font-extrabold normal-case leading-none tracking-[-0.03em]">{p.name}</p>
        <p className="mt-1.5 text-[11.5px] normal-case leading-snug tracking-normal opacity-70">{p.subtitle}</p>
        <div className="mt-4 overflow-hidden border-2 border-dashed border-[#1B1A17]/30 p-1.5">
          <img src={p.cover} alt="" className="aspect-[16/10] w-full object-cover" style={{ filter: "grayscale(1) contrast(1.35) brightness(1.08)", mixBlendMode: "multiply" }} />
        </div>
        <div className="mt-4 space-y-1">
          <Leader left="Design" right={p.discipline !== "engineering" ? <Check /> : "—"} />
          <Leader left="Engineering" right={p.discipline !== "design" ? <Check /> : "—"} />
          <Leader left="For" right={p.org || "Independent"} />
        </div>
        {p.stat && (
          <>
            <div className="my-3 border-t-[3px] border-double border-[#1B1A17]" />
            <div className="flex items-baseline justify-between">
              <span className="max-w-[9rem] text-[11px] leading-tight opacity-70">{p.stat.label}</span>
              <span className="text-[30px] font-extrabold normal-case tracking-[-0.03em]">{p.stat.value}</span>
            </div>
          </>
        )}
        {both && <p className="mt-3 text-center text-[10px] tracking-[0.24em] opacity-60">Designed + built in-house</p>}
      </div>
      <Zig />
    </div>
  );
}

export function CounterWork() {
  const rail = ["shop-erp", "hazeberg", "trade-crm", "touchpe", "enda"].map(byId);
  const tilts = [[-1.6, 0], [1.1, 18], [-0.6, 6], [1.8, 22], [-1.2, 4]];
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]" style={{ background: C.counter, color: C.text }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 items-end gap-6 px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="col-span-12 lg:col-span-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9B9384]">Orders fulfilled</p>
          <h2 className="mt-5 text-[clamp(2.6rem,5.4vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">Every project is a<br />ticket I closed myself.</h2>
        </div>
        <div className="col-span-12 text-[14px] leading-relaxed text-[#B8B0A2] lg:col-span-4">
          <p>Own products under PrimeDigitals, client work through UMM Digital. Each ticket says which side I worked on. On most, it's both.</p>
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#EDE7DA]">Drag the rail &rarr;</p>
        </div>
      </div>

      <div className="relative mt-20">
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#d9d4ca] via-[#8f897e] to-[#4a463f] shadow-[0_6px_14px_rgba(0,0,0,.6)]" />
        <div className="flex gap-9 overflow-hidden pb-12 pl-[clamp(1.25rem,3vw,2.75rem)] pt-5">
          {rail.map((p, i) => <Ticket key={p.id} p={p} n={i + 1} tilt={tilts[i][0]} drop={tilts[i][1]} />)}
        </div>
      </div>

      {/* day book — the full index */}
      <div className="mx-auto mt-24 max-w-[1440px] px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="flex items-baseline justify-between border-b-2 border-dashed border-[#3a362f] pb-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9B9384]">Day book · all 12 tickets</p>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#9B9384]">All · Design · Engineering</p>
        </div>
        <div className="grid gap-x-14 md:grid-cols-2">
          {projects.map((p, i) => (
            <div key={p.id} className="flex items-baseline gap-3 border-b border-dashed border-[#2c2924] py-3.5 text-[15px] font-semibold">
              <span className="w-8 text-[12px] tabular-nums text-[#6E695F]">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[#EDE7DA]">{p.name}</span>
              <span className="min-w-4 flex-1 -translate-y-[3px] border-b-2 border-dotted border-[#3a362f]" />
              <span className="text-[12px] uppercase tracking-[0.14em] text-[#9B9384]">{p.discipline === "both" ? "Design + Eng" : p.discipline === "design" ? "Design" : "Engineering"}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// A3 · Design ⇄ Code — original sheet (design) over the carbon duplicate (code)
// ------------------------------------------------------------
function KpiTile({ className = "" }) {
  return (
    <div className={`w-[17rem] rounded-[16px] border border-[#E4E1DA] bg-white p-6 text-[#15140F] shadow-[0_1px_2px_rgba(0,0,0,.06)] ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#6E695F]">Today&apos;s Sales</span>
        <span className="rounded-full bg-[#E9F6EC] px-2 py-0.5 text-[11px] font-bold text-[#2E7D46]">Live</span>
      </div>
      <p className="mt-3 text-[40px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">₹4,513</p>
      <p className="mt-2 text-[13px] font-medium text-[#6E695F]">58 orders today</p>
    </div>
  );
}

export function CounterDesignCode() {
  const lines = [
    "export function KpiCard({ label, value, sub }) {",
    "  return (",
    "    <div className=\"rounded-2xl border p-6\">",
    "      <header className=\"flex justify-between\">",
    "        <span className=\"text-[13px]\">{label}</span>",
    "        <LiveBadge />",
    "      </header>",
    "      <p className=\"text-[40px] font-extrabold",
    "                    tabular-nums\">",
    "        {formatINR(value)}",
    "      </p>",
    "      <p className=\"text-[13px]\">{sub}</p>",
    "    </div>",
    "  );",
    "}",
  ];
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]" style={{ background: C.counter, color: C.text }}>
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9B9384]">Original + duplicate</p>
            <h2 className="mt-5 text-[clamp(2.4rem,4.8vw,4.8rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">Every bill book has two copies. So does my work.</h2>
          </div>
          <p className="col-span-12 max-w-[30rem] text-[15px] leading-relaxed text-[#B8B0A2] lg:col-span-5">
            The top sheet is the design: a Shop-ERP sales tile, specced the way I spec in Figma. The carbon underneath is the same tile as a React component. One hand writes both, so nothing gets lost between them.
          </p>
        </div>

        <div className="relative mt-16 h-[36rem]">
          {/* duplicate — yellow paper, carbon-blue ink */}
          <div className="absolute right-[2%] top-10 w-[46%] rotate-[2.2deg] p-8 shadow-[0_30px_60px_rgba(0,0,0,.5)]" style={{ background: "#F1E6C2", color: "#2B3C8F" }}>
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
              <span>Duplicate · KpiCard.jsx</span><span>No. 0458</span>
            </div>
            <div className="mt-2 border-t-2 border-[#2B3C8F]/50" />
            <pre className="mt-5 whitespace-pre font-manrope text-[13.5px] font-semibold leading-[1.75]" style={{ textShadow: "0 0 .6px #2B3C8F" }}>
              {lines.map((l, i) => (
                <span key={i} className="block"><span className="mr-4 inline-block w-5 text-right opacity-40">{i + 1}</span>{l}</span>
              ))}
            </pre>
          </div>
          {/* original — white, design spec, folded corner */}
          <div className="absolute left-[2%] top-0 w-[48%] -rotate-[2deg] drop-shadow-[0_30px_40px_rgba(0,0,0,.55)]">
            <div className="p-8" style={{ background: "#FBFAF6", color: C.ink, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 72px), calc(100% - 72px) 100%, 0 100%)" }}>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
                <span>Original · Design spec</span><span>No. 0458</span>
              </div>
              <div className="mt-2 border-t-2 border-[#1B1A17]/50" />
              <div className="relative mt-10 flex justify-center pb-16 pt-6">
                <div className="relative">
                  <KpiTile />
                  <span className="absolute -top-6 left-0 right-0 flex items-center gap-1 text-[10px] font-bold text-[#E0533F]"><span className="h-px flex-1 bg-[#E0533F]" />272<span className="h-px flex-1 bg-[#E0533F]" /></span>
                  <span className="absolute left-0 top-0 h-6 w-6 border-b border-r border-dashed border-[#E0533F]" />
                  <span className="absolute left-1 top-1 text-[9px] font-bold text-[#E0533F]">24</span>
                  <span className="absolute -right-32 top-[3.1rem] flex items-center gap-2 text-[10px] font-bold text-[#E0533F]"><span className="h-px w-10 bg-[#E0533F]" />Manrope 800 · 40</span>
                  <span className="absolute -left-28 bottom-3 flex items-center gap-2 text-[10px] font-bold text-[#E0533F]">radius 16<span className="h-px w-8 bg-[#E0533F]" /></span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[10.5px] font-bold uppercase tracking-[0.1em]">
                {["space/6 · 24", "radius/lg · 16", "text/num · 40", "ink/muted"].map((t) => (
                  <span key={t} className="rounded-full border border-[#1B1A17]/25 px-2.5 py-1">{t}</span>
                ))}
              </div>
            </div>
            <span aria-hidden className="absolute bottom-0 right-0 h-[72px] w-[72px]" style={{ background: "linear-gradient(to top left, transparent 50%, #E3DED1 50%)", boxShadow: "-6px -6px 14px rgba(0,0,0,.18)" }} />
          </div>
        </div>

        <div className="mt-6 grid gap-10 text-[14px] md:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E07B6B]">On the original</p>
            <p className="leading-relaxed text-[#CFC8BA]">{capabilities.design.join(" · ")}</p>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8FA9EC]">On the duplicate</p>
            <p className="leading-relaxed text-[#CFC8BA]">{capabilities.engineering.join(" · ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// A4 · Process — order tracking on a full-bleed strip of receipt paper
// ------------------------------------------------------------
export function CounterProcess() {
  return (
    <section className="relative" style={{ background: C.counter }}>
      <Zig flip />
      <div className="px-[clamp(1.25rem,3vw,2.75rem)] py-[clamp(4.5rem,8vw,7rem)]" style={{ background: C.paper, color: C.ink }}>
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] opacity-60">Order status</p>
              <h2 className="mt-4 text-[clamp(2.6rem,5.4vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">Where&apos;s my order?</h2>
            </div>
            <p className="max-w-[26rem] text-[15px] font-medium leading-relaxed opacity-75">Every project moves through the same five stops. The last one never closes: I stay on after launch.</p>
          </div>

          <div className="relative mt-20">
            <div className="absolute left-0 right-[10%] top-[18px] h-[3px] bg-[#1B1A17]" />
            <div className="absolute left-[90%] right-0 top-[18px] h-[3px] border-t-[3px] border-dashed border-[#1B1A17]" />
            <ol className="relative grid grid-cols-5 gap-6">
              {process.map((s, i) => (
                <li key={s.n}>
                  <span className={`relative grid h-10 w-10 place-items-center rounded-full ${i === 4 ? "bg-[#C8372D]" : "bg-[#1B1A17]"} text-[#F4F1E9]`}>
                    {i === 4 && <span className="absolute inset-0 animate-ping rounded-full bg-[#C8372D] opacity-40" />}
                    <Check className="relative h-4 w-4" />
                  </span>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] opacity-55">Stop {s.n} · {i === 4 ? "Ongoing" : "Done"}</p>
                  <h3 className="mt-2 text-[30px] font-extrabold tracking-[-0.03em]">{s.title}</h3>
                  <p className="mt-3 text-[14px] font-medium leading-relaxed opacity-75">{s.body}</p>
                  <p className="mt-5 border-2 border-dashed border-[#1B1A17]/30 p-3 text-[12.5px] font-semibold leading-snug">{s.proof}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <Zig />
    </section>
  );
}

// ------------------------------------------------------------
// A5 · About — a member tap-card and a bahi-khata style ledger page
// ------------------------------------------------------------
function Contactless({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
    </svg>
  );
}

export function CounterAbout() {
  const rows = [
    ...resume.experience.map((e) => ({ d: e.dates.replace("Present", "now"), p: e.role, o: e.org.replace(" (Remote Agency)", "") })),
    { d: "2021 – 2025", p: "B.Tech Computer Science · CGPA 7.9", o: "Parul University" },
  ];
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]" style={{ background: C.counter, color: C.text }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="col-span-12 lg:col-span-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9B9384]">Member card</p>
          <h2 className="mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">Tap in.<br />Here&apos;s who&apos;s<br />behind the counter.</h2>
          <div className="relative mt-14 h-[19rem]">
            {/* back of the card */}
            <div className="absolute left-16 top-6 aspect-[1.586] w-[25rem] rotate-[7deg] rounded-[20px] bg-[#23211d] shadow-[0_24px_50px_rgba(0,0,0,.6)]">
              <div className="mt-8 h-12 bg-[#0d0c0b]" />
            </div>
            {/* front */}
            <div className="absolute left-0 top-0 aspect-[1.586] w-[25rem] -rotate-[4deg] overflow-hidden rounded-[20px] p-6 shadow-[0_30px_60px_rgba(0,0,0,.6)]"
              style={{ background: "linear-gradient(135deg,#2b2823,#171614 60%,#2a2620)", color: C.text }}>
              <div className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ background: "repeating-radial-gradient(circle at 110% 120%, transparent 0 9px, #D4A848 9px 10px)" }} />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9B9384]">Designer · Engineer</span>
                  <Contactless className="h-8 w-8 text-[#D4A848]" />
                </div>
                <div className="flex items-end gap-4">
                  <img src="/assets/work/profile.webp" alt="Krishna Mehta" className="h-[6.5rem] w-[5.2rem] rounded-[8px] object-cover object-top grayscale" />
                  <div>
                    <p className="text-[24px] font-extrabold leading-none tracking-[-0.02em]">Krishna Mehta</p>
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9B9384]">Bharuch · GJ · IN</p>
                    <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6FCF7A]">Status · open to work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-[24rem] text-[13px] leading-relaxed text-[#9B9384]">The same idea Shop-ERP customers use at the counter: tap a card, the shop knows who you are.</p>
        </div>

        {/* ledger page */}
        <div className="col-span-12 lg:col-span-7">
          <div className="relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,.5)]" style={{ background: "#F3EEE0", color: C.ink, backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 43px, rgba(70,110,170,.22) 43px 44px)" }}>
            <span className="absolute bottom-0 left-[4.2rem] top-0 w-[2px] bg-[#C8372D]/70" />
            <span className="absolute bottom-0 left-[4.6rem] top-0 w-[2px] bg-[#C8372D]/70" />
            <span className="absolute bottom-0 right-[9.5rem] top-0 w-[2px] bg-[#C8372D]/50" />
            <div className="relative py-8 pl-[6rem] pr-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-55">Account of</p>
              <p className="mt-1 text-[30px] font-extrabold tracking-[-0.03em]">Krishna Mehta</p>
              <p className="mt-5 max-w-[30rem] text-[15px] font-medium leading-[1.75]">{about.intro}</p>
              <div className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] opacity-55">
                <div className="flex"><span className="w-40">Date</span><span className="flex-1">Particulars</span><span className="w-[8rem] text-right">With</span></div>
              </div>
              {rows.map((r) => (
                <div key={r.d + r.p} className="flex items-baseline py-[0.7rem] text-[14.5px] font-semibold leading-[1.5]">
                  <span className="w-40 shrink-0 tabular-nums opacity-70">{r.d}</span>
                  <span className="flex-1">{r.p}</span>
                  <span className="w-[8rem] shrink-0 text-right opacity-70">{r.o}</span>
                </div>
              ))}
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-2 border-t-2 border-[#1B1A17] pt-5 text-[13px] font-bold">
                <span>Age {identity.age}</span><span>English · Hindi · Gujarati</span><span>Remote · pan-India · relocation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// A6 · Contact — the POS terminal checkout
// ------------------------------------------------------------
function Key({ children, wide = false, tone = "dark" }) {
  const styles = {
    dark: { background: "linear-gradient(#2c2a26,#232120)", color: C.text, boxShadow: "0 4px 0 #0c0b0a, inset 0 1px 0 rgba(255,255,255,.07)" },
    paper: { background: C.paper, color: C.ink, boxShadow: "0 4px 0 #a9a293, inset 0 1px 0 #fff" },
    gold: { background: C.gold, color: "#1B1A17", boxShadow: "0 4px 0 #8b6d27, inset 0 1px 0 rgba(255,255,255,.4)" },
  };
  return (
    <span className={`grid h-[4.6rem] place-items-center rounded-[14px] px-3 text-center text-[12.5px] font-extrabold uppercase tracking-[0.12em] ${wide ? "col-span-3" : ""}`} style={styles[tone]}>
      {children}
    </span>
  );
}

export function CounterContact() {
  return (
    <section className="relative overflow-hidden pt-[clamp(5rem,9vw,8rem)]" style={{ background: C.counter, color: C.text }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 items-center gap-10 px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="col-span-12 lg:col-span-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9B9384]">Checkout</p>
          <h2 className="mt-5 text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.88] tracking-[-0.05em]">Ready when<br />you are.</h2>
          <p className="mt-8 max-w-[30rem] text-[16px] leading-relaxed text-[#B8B0A2]">Open to product-first teams of 10 to 150 people. Remote, pan-India or relocation. Design-focused, engineering-focused or both.</p>
        </div>
        <div className="col-span-12 flex justify-center lg:col-span-6">
          <div className="w-[min(30rem,100%)] rounded-[30px] border border-[#2e2b26] bg-gradient-to-b from-[#211f1c] to-[#171614] p-6 shadow-[0_40px_80px_rgba(0,0,0,.6)]">
            <div className="rounded-[16px] border border-[#0a1412] bg-[#0E1A17] p-5 text-[#8FE6D9]" style={{ boxShadow: "inset 0 0 30px rgba(79,209,197,.08)" }}>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"><span>To</span><span>Bill KM / 2026</span></div>
              <p className="mt-2 break-all text-[22px] font-extrabold tracking-[-0.01em]">{identity.email}</p>
              <div className="mt-4 flex justify-between border-t border-dashed border-[#8FE6D9]/30 pt-3 text-[13px] font-bold uppercase tracking-[0.14em]"><span>Total</span><span>One conversation</span></div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Key tone="paper">Copy email</Key>
              <Key>Call</Key>
              <Key>GitHub</Key>
              <Key>Résumé</Key>
              <Key>Pixel world</Key>
              <Key>Top</Key>
              <Key wide tone="gold">Send an email &rarr;</Key>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24 border-y border-[#2c2924] py-4">
        <p className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.3em] text-[#6E695F]">
          {Array.from({ length: 6 }).map((_, i) => <span key={i} className="mr-10">Thank you · Visit again · Krishna Mehta · {identity.phone}</span>)}
        </p>
      </div>
      <p className="select-none px-[clamp(1.25rem,3vw,2.75rem)] pb-4 pt-6 text-[clamp(3rem,12.4vw,15rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-[#24221E]">
        Krishna Mehta
      </p>
    </section>
  );
}
