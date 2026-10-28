// ============================================================
// Direction B — "The Canvas"
// The site as the working file: a design canvas on one side,
// the codebase on the other, the same person holding both
// cursors. Dot-grid canvas, cyan selection, rose redlines.
// ============================================================
import { projects, identity, about, classes } from "@/data/portfolio";
import { process, capabilities } from "@/data/studio";
import { resume } from "@/data/resume";

const B = {
  canvas: "#141518",
  frame: "#0E0F11",
  panel: "#1B1D21",
  line: "#2A2D33",
  text: "#ECE8DF",
  soft: "#9C998F",
  sel: "#4FD1C5",
  red: "#E07B6B",
  gold: "#D4A848",
};
const dots = { backgroundColor: B.canvas, backgroundImage: "radial-gradient(rgba(255,255,255,.075) 1px, transparent 1.2px)", backgroundSize: "22px 22px" };
const byId = (id) => projects.find((p) => p.id === id);

/** cyan selection box with eight handles */
function Selected({ children, className = "", size }) {
  const h = "absolute h-[9px] w-[9px] border-[1.5px] bg-white";
  return (
    <div className={`relative ${className}`}>
      {children}
      <span className="pointer-events-none absolute -inset-[3px] border-[1.5px]" style={{ borderColor: B.sel }}>
        {[["-left-[5px] -top-[5px]"], ["left-1/2 -top-[5px] -translate-x-1/2"], ["-right-[5px] -top-[5px]"], ["-right-[5px] top-1/2 -translate-y-1/2"],
          ["-right-[5px] -bottom-[5px]"], ["left-1/2 -bottom-[5px] -translate-x-1/2"], ["-left-[5px] -bottom-[5px]"], ["-left-[5px] top-1/2 -translate-y-1/2"]].map(([c], i) => (
          <span key={i} className={`${h} ${c}`} style={{ borderColor: B.sel }} />
        ))}
        {size && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-[#0E0F11]" style={{ background: B.sel }}>{size}</span>
        )}
      </span>
    </div>
  );
}

function Cursor({ label, color, className = "" }) {
  return (
    <div className={`pointer-events-none absolute z-20 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill={color} stroke="#0E0F11" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      <span className="ml-4 -mt-1 inline-block whitespace-nowrap rounded-[6px] rounded-tl-none px-2.5 py-1 text-[12px] font-bold text-[#0E0F11]" style={{ background: color }}>{label}</span>
    </div>
  );
}

function FrameLabel({ children, active = false }) {
  return <p className="mb-2 text-[12px] font-semibold" style={{ color: active ? B.sel : B.soft }}>{children}</p>;
}

function Toolbar() {
  const tool = "grid h-8 w-8 place-items-center rounded-[6px]";
  return (
    <div className="relative z-10 flex h-12 items-center justify-between border-b px-3 text-[13px] font-semibold" style={{ background: B.panel, borderColor: B.line, color: B.text }}>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-[7px] text-[12px] font-extrabold text-[#0E0F11]" style={{ background: B.sel }}>KM</span>
        <span style={{ color: B.soft }}>krishna-mehta /</span><span>portfolio-2026</span>
      </div>
      <div className="flex items-center gap-1" style={{ color: B.soft }}>
        <span className={tool} style={{ background: B.sel, color: "#0E0F11" }}><svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M5 3l6 17 2.4-7.1L21 10z" /></svg></span>
        <span className={tool}><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3v18M17 3v18M3 7h18M3 17h18" /></svg></span>
        <span className={tool}><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5h14M12 5v14" /></svg></span>
        <span className={tool}><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></svg></span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex -space-x-2">
          <span className="grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-extrabold text-[#0E0F11]" style={{ background: B.sel, borderColor: B.panel }}>K</span>
          <span className="grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-extrabold text-[#0E0F11]" style={{ background: B.gold, borderColor: B.panel }}>K</span>
        </span>
        <span className="rounded-[7px] px-3.5 py-1.5 text-[12.5px] font-bold text-[#0E0F11]" style={{ background: B.sel }}>Hire</span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// B1 · Hero — the name as a selected layer, two cursors, one person
// ------------------------------------------------------------
export function CanvasHero() {
  const layers = [["Hero", 0, true], ["Name", 1, true], ["Statement", 1], ["Actions", 1], ["Work", 0], ["Design ⇄ Code", 0], ["How I work", 0], ["About", 0], ["Contact", 0]];
  return (
    <section className="flex h-[100svh] min-h-[46rem] flex-col overflow-hidden" style={{ color: B.text }}>
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[15rem] shrink-0 border-r p-3 text-[13px] lg:block" style={{ background: B.panel, borderColor: B.line }}>
          <p className="px-2 pb-3 pt-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: B.soft }}>Layers</p>
          {layers.map(([n, d, a]) => (
            <div key={n} className="flex items-center gap-2 rounded-[6px] py-1.5 font-semibold" style={{ paddingLeft: 8 + d * 18, background: n === "Name" ? "rgba(79,209,197,.14)" : "transparent", color: a ? B.text : B.soft }}>
              <span className="text-[11px] opacity-60">{d ? "T" : "#"}</span>{n}
            </div>
          ))}
        </aside>

        <div className="relative min-w-0 flex-1 overflow-hidden" style={dots}>
          <div className="absolute left-[6%] right-[6%] top-[9%]">
            <FrameLabel>Hero — Desktop 1440</FrameLabel>
            <div className="relative px-[clamp(2rem,5vw,4.5rem)] pb-14 pt-16" style={{ background: B.frame, boxShadow: "0 0 0 1px #24272c" }}>
              {/* redline from frame edge to the text */}
              <span className="absolute left-0 top-[8.6rem] flex w-[clamp(2rem,5vw,4.5rem)] items-center text-[10px] font-bold" style={{ color: B.red }}>
                <span className="h-px flex-1" style={{ background: B.red }} /><span className="px-1">72</span><span className="h-px flex-1" style={{ background: B.red }} />
              </span>
              <p className="text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color: B.soft }}>Designer &amp; engineer · Bharuch, IN</p>
              <Selected className="mt-6 inline-block" size="Hug × Hug · 1012 × 304">
                <h1 className="text-[clamp(4.5rem,10.4vw,10.5rem)] font-extrabold leading-[0.86] tracking-[-0.05em]">Krishna<br />Mehta</h1>
              </Selected>
              <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
                <p className="max-w-[30rem] text-[17px] font-medium leading-relaxed" style={{ color: "#BDB8AC" }}>
                  Designer and engineer, one person, no handoff. I take products from the first user interview to production, and keep them running.
                </p>
                <div className="flex gap-3">
                  <span className="rounded-[10px] px-5 py-3 text-[14px] font-bold text-[#0E0F11]" style={{ background: B.text }}>See the work</span>
                  <span className="rounded-[10px] border px-5 py-3 text-[14px] font-bold" style={{ borderColor: "#3a3d44" }}>Play the pixel world</span>
                </div>
              </div>
            </div>
          </div>
          <Cursor label="Krishna · designing" color={B.sel} className="left-[66%] top-[17%]" />
          <Cursor label="Krishna · shipping" color={B.gold} className="left-[71%] top-[71%]" />
          <span className="absolute bottom-4 left-4 rounded-[6px] px-2.5 py-1 text-[12px] font-semibold" style={{ background: B.panel, color: B.soft }}>Two cursors. Same person.</span>
        </div>

        <aside className="hidden w-[17.5rem] shrink-0 border-l text-[12.5px] xl:block" style={{ background: B.panel, borderColor: B.line }}>
          <div className="flex border-b text-[12px] font-bold" style={{ borderColor: B.line }}>
            <span className="border-b-2 px-4 py-3" style={{ borderColor: B.sel }}>Design</span>
            <span className="px-4 py-3" style={{ color: B.soft }}>Code</span>
          </div>
          {[
            ["Text", [["Font", "Manrope"], ["Weight", "Extra Bold"], ["Size", "168"], ["Line", "86%"], ["Tracking", "-5%"]]],
            ["Layout", [["W", "1012"], ["H", "304"], ["X", "72"], ["Y", "96"]]],
            ["Fill", [["#ECE8DF", "100%"]]],
          ].map(([t, rows]) => (
            <div key={t} className="border-b px-4 py-4" style={{ borderColor: B.line }}>
              <p className="mb-3 font-bold">{t}</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {rows.map(([k, v]) => (
                  <span key={k} className="flex justify-between rounded-[5px] px-2 py-1.5 tabular-nums" style={{ background: "#23262b" }}><span style={{ color: B.soft }}>{k}</span><span className="font-semibold">{v}</span></span>
                ))}
              </div>
            </div>
          ))}
          <div className="px-4 py-4">
            <p className="mb-3 font-bold">Shipped as</p>
            <pre className="whitespace-pre-wrap rounded-[6px] p-3 font-manrope text-[11.5px] leading-[1.65]" style={{ background: B.frame }}>
              <span style={{ color: B.sel }}>&lt;h1</span> <span style={{ color: B.soft }}>className=</span><span style={{ color: B.gold }}>&quot;text-[168px] font-extrabold leading-[.86] tracking-[-.05em]&quot;</span><span style={{ color: B.sel }}>&gt;</span>{"\n"}  Krishna Mehta{"\n"}<span style={{ color: B.sel }}>&lt;/h1&gt;</span>
            </pre>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// B2 · Work — project frames on an open canvas, one selected
// ------------------------------------------------------------
function Shot({ p, w, left, top, active = false, note }) {
  const img = <img src={p.cover} alt="" className="block aspect-[16/10] w-full object-cover" />;
  return (
    <div className="absolute" style={{ left, top, width: w }}>
      <FrameLabel active={active}>{p.name} / {p.subtitle.split(" — ")[0].split(",")[0]}</FrameLabel>
      {active ? <Selected size={`${Math.round(w * 2)} × ${Math.round(w * 1.25)}`}>{img}</Selected> : <div style={{ boxShadow: "0 0 0 1px #24272c" }}>{img}</div>}
      {note && (
        <div className="absolute -bottom-4 -right-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full rounded-bl-none border-2 text-[11px] font-extrabold text-[#0E0F11]" style={{ background: B.gold, borderColor: B.canvas }}>K</span>
          <span className="whitespace-nowrap rounded-[8px] px-3 py-1.5 text-[12px] font-semibold shadow-lg" style={{ background: B.panel, color: B.text }}>{note}</span>
        </div>
      )}
    </div>
  );
}

export function CanvasWork() {
  const erp = byId("shop-erp");
  return (
    <section className="relative h-[68rem] overflow-hidden" style={{ ...dots, color: B.text }}>
      <div className="absolute left-[clamp(1.25rem,4vw,4rem)] top-[4.5rem] max-w-[34rem]">
        <FrameLabel>Text</FrameLabel>
        <h2 className="text-[clamp(2.6rem,5vw,5.2rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">Selected work</h2>
        <p className="mt-4 text-[16px] leading-relaxed" style={{ color: "#BDB8AC" }}>Every frame here is a real product I designed, built, or both. Drag to pan, scroll to zoom, click a frame to open its case study.</p>
      </div>

      <Shot p={erp} w={560} left="6%" top="17rem" active />
      <div className="absolute left-[calc(6%+575px)] top-[30rem] w-[17rem] rounded-[12px] border p-4 text-[13px] shadow-[0_20px_40px_rgba(0,0,0,.45)]" style={{ background: B.panel, borderColor: B.line }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: B.soft }}>Shop-ERP · {erp.org}</p>
        <p className="mt-3 text-[34px] font-extrabold leading-none tracking-[-0.03em]">{erp.stat.value}</p>
        <p style={{ color: B.soft }}>{erp.stat.label}</p>
        <div className="mt-4 flex gap-2 text-[11.5px] font-bold">
          <span className="rounded-full px-2.5 py-1" style={{ background: "rgba(224,123,107,.16)", color: B.red }}>Design</span>
          <span className="rounded-full px-2.5 py-1" style={{ background: "rgba(79,209,197,.14)", color: B.sel }}>Engineering</span>
        </div>
        <p className="mt-4 font-bold" style={{ color: B.sel }}>Open case study &rarr;</p>
      </div>
      <Shot p={byId("hazeberg")} w={470} left="52%" top="9rem" note="13 pages, CMS-editable" />
      <Shot p={byId("trade-crm")} w={430} left="65%" top="37rem" note="7-step deal track" />
      <Shot p={byId("touchpe")} w={400} left="12%" top="47rem" />
      <Shot p={byId("enda")} w={420} left="91%" top="21rem" />
      <Shot p={byId("vitran")} w={380} left="36%" top="55rem" />

      <Cursor label="Krishna" color={B.sel} className="left-[40%] top-[29rem]" />
      <div className="absolute bottom-5 right-5 flex items-center gap-1 rounded-[10px] border p-1 text-[12px] font-bold tabular-nums" style={{ background: B.panel, borderColor: B.line }}>
        <span className="px-2.5 py-1" style={{ color: B.soft }}>−</span><span className="px-2">42%</span><span className="px-2.5 py-1" style={{ color: B.soft }}>+</span>
      </div>
      <div className="absolute bottom-5 left-5 rounded-[10px] border px-3 py-2 text-[12px] font-semibold" style={{ background: B.panel, borderColor: B.line, color: B.soft }}>
        12 frames · Products 4 · Client 4 · Studies 4
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// B3 · Design ⇄ Code — one tile, inspected in both tools at once
// ------------------------------------------------------------
export function CanvasDesignCode() {
  const code = [
    [["k", "export function "], ["f", "KpiCard"], ["t", "({ label, value, sub }) {"]],
    [["k", "  return "], ["t", "("]],
    [["t", "    "], ["g", "<div"], ["t", " className="], ["s", "\"rounded-2xl border p-6\""], ["g", ">"]],
    [["t", "      "], ["g", "<header"], ["t", " className="], ["s", "\"flex justify-between\""], ["g", ">"]],
    [["t", "        "], ["g", "<span"], ["t", " className="], ["s", "\"text-[13px] text-muted\""], ["g", ">"], ["t", "{label}"], ["g", "</span>"]],
    [["t", "        "], ["g", "<LiveBadge />"]],
    [["t", "      "], ["g", "</header>"]],
    [["t", "      "], ["g", "<p"], ["t", " className="], ["s", "\"text-[40px] font-extrabold tabular-nums\""], ["g", ">"]],
    [["t", "        {formatINR(value)}"]],
    [["t", "      "], ["g", "</p>"]],
    [["t", "      "], ["g", "<p"], ["t", " className="], ["s", "\"text-[13px] text-muted\""], ["g", ">"], ["t", "{sub}"], ["g", "</p>"]],
    [["t", "    "], ["g", "</div>"]],
    [["t", "  );"]],
    [["t", "}"]],
  ];
  const col = { k: B.red, f: B.gold, t: "#CFCBC1", g: B.sel, s: "#E9C77A" };
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]" style={{ background: B.canvas, color: B.text }}>
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[46rem] text-[clamp(2.4rem,4.8vw,4.8rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">The same tile, open in both of my tools.</h2>
          <p className="max-w-[26rem] text-[15px] leading-relaxed" style={{ color: "#BDB8AC" }}>A Shop-ERP sales tile. Hover any property on the left and the line that ships it lights up on the right.</p>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-[16px] border" style={{ borderColor: B.line, background: B.panel }}>
          <div className="flex border-b text-[12.5px] font-semibold" style={{ borderColor: B.line }}>
            <span className="border-r px-4 py-3" style={{ borderColor: B.line }}>kpi-card <span style={{ color: B.soft }}>· Design</span></span>
            <span className="border-r px-4 py-3" style={{ borderColor: B.line }}>KpiCard.jsx <span style={{ color: B.soft }}>· Code</span></span>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="relative grid min-h-[30rem] place-items-center" style={dots}>
              <div className="relative">
                <div className="w-[19rem] rounded-[16px] bg-white p-6 text-[#15140F]">
                  <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[#6E695F]">Today&apos;s Sales</span><span className="rounded-full bg-[#E9F6EC] px-2 py-0.5 text-[11px] font-bold text-[#2E7D46]">Live</span></div>
                  <Selected className="mt-3 inline-block"><p className="text-[40px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">₹4,513</p></Selected>
                  <p className="mt-2 text-[13px] font-medium text-[#6E695F]">58 orders today</p>
                </div>
                {/* padding overlays */}
                <span className="absolute inset-x-0 top-0 h-6 rounded-t-[16px]" style={{ background: "rgba(224,123,107,.22)" }} />
                <span className="absolute inset-y-0 left-0 w-6 rounded-l-[16px]" style={{ background: "rgba(224,123,107,.22)" }} />
                <span className="absolute -left-9 top-0 text-[11px] font-bold" style={{ color: B.red }}>24</span>
                <span className="absolute -top-6 left-0 text-[11px] font-bold" style={{ color: B.red }}>24</span>
                <span className="absolute -right-2 top-[3.6rem] translate-x-full rounded-[6px] px-2 py-1 text-[11px] font-bold text-[#0E0F11]" style={{ background: B.sel }}>Manrope 800 · 40 · tabular</span>
              </div>
            </div>
            <div className="border-l p-6" style={{ borderColor: B.line, background: B.frame }}>
              <pre className="font-manrope text-[13px] font-semibold leading-[1.85]">
                {code.map((line, i) => (
                  <span key={i} className="block rounded-[4px] pr-2" style={i === 7 ? { background: "rgba(79,209,197,.13)", boxShadow: `inset 2px 0 0 ${B.sel}` } : undefined}>
                    <span className="mr-5 inline-block w-5 text-right" style={{ color: "#4b4f57" }}>{i + 1}</span>
                    {line.map(([k, t], j) => <span key={j} style={{ color: col[k] }}>{t}</span>)}
                  </span>
                ))}
              </pre>
            </div>
          </div>
          {/* connector from selected layer to its code line */}
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d="M 48.3 53 C 50.5 53, 50.5 47.3, 53 47.3" fill="none" stroke={B.sel} strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {[["Design properties", capabilities.design, B.red], ["Code exports", capabilities.engineering, B.sel]].map(([t, list, c]) => (
            <div key={t}>
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: c }}>{t}</p>
              <div className="flex flex-wrap gap-2">
                {list.map((x) => <span key={x} className="rounded-[8px] border px-3 py-2 text-[13px] font-semibold" style={{ borderColor: B.line, background: B.panel }}>{x}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// B4 · Process — a whiteboard flow of sticky notes
// ------------------------------------------------------------
export function CanvasProcess() {
  const tones = ["#F2D774", "#F4A79B", "#8FE0D6", "#B9E39A", "#F7C08A"];
  const pos = [[0, 4], [20.5, 14], [41, 2], [61.5, 13], [82, 3]];
  const tilt = [-2, 1.5, -1, 2, -1.5];
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]" style={{ ...dots, color: B.text }}>
      <div className="mx-auto max-w-[1440px] px-[clamp(1.25rem,3vw,2.75rem)]">
        <FrameLabel>Section · How I work</FrameLabel>
        <div className="relative rounded-[18px] border-2 border-dashed px-8 pb-16 pt-10" style={{ borderColor: "#30343b" }}>
          <h2 className="text-[clamp(2.4rem,4.8vw,4.8rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">Five steps.<br />I&apos;m on every one.</h2>
          <div className="relative mt-10 h-[25rem]">
            {pos.slice(1).map(([x, y], i) => (
              <svg key={i} className="absolute h-6 w-10" style={{ left: `calc(${x}% - 2.4rem)`, top: `calc(${Math.min(y, pos[i][1])}% + 4.5rem)` }} viewBox="0 0 40 24" fill="none" aria-hidden>
                <path d="M2 12h32m-8-7 8 7-8 7" stroke="#6b707a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ))}
            {process.map((s, i) => (
              <div key={s.n} className="absolute w-[14.6rem]" style={{ left: `${pos[i][0]}%`, top: `${pos[i][1]}%`, transform: `rotate(${tilt[i]}deg)` }}>
                <div className="p-5 text-[#1B1A17] shadow-[0_16px_30px_rgba(0,0,0,.4)]" style={{ background: tones[i] }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">Step {s.n}</p>
                  <p className="mt-1 text-[28px] font-extrabold tracking-[-0.03em]">{s.title}</p>
                  <p className="mt-2 text-[13.5px] font-semibold leading-snug opacity-80">{s.body}</p>
                  <p className="mt-4 text-[11px] font-bold opacity-55">Krishna</p>
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full rounded-bl-none text-[10px] font-extrabold text-[#0E0F11]" style={{ background: B.gold }}>K</span>
                  <span className="rounded-[8px] px-3 py-2 text-[12px] font-semibold leading-snug" style={{ background: B.panel }}>{s.proof}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// B5 · About — Krishna as a component with variants and props
// ------------------------------------------------------------
export function CanvasAbout() {
  const field = "flex items-center justify-between rounded-[6px] px-3 py-2";
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,8rem)]" style={{ ...dots, color: B.text }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="col-span-12 lg:col-span-8">
          <FrameLabel active>◇ Krishna / Variant=Builder</FrameLabel>
          <Selected>
            <div className="grid gap-8 p-8 md:grid-cols-[17rem_1fr]" style={{ background: B.frame }}>
              <img src="/assets/work/profile.webp" alt="Krishna Mehta" className="aspect-[3/4] w-full object-cover object-top" />
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color: B.soft }}>About</p>
                  <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">{classes.builder.bioLong.split(".")[0]}.</h2>
                  <p className="mt-6 max-w-[36rem] text-[15.5px] leading-relaxed" style={{ color: "#BDB8AC" }}>{about.body[0]}</p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6 text-[13px]" style={{ borderColor: B.line }}>
                  {resume.experience.map((e) => (
                    <div key={e.dates}>
                      <p className="font-bold">{e.role}</p>
                      <p style={{ color: B.soft }}>{e.org.replace(" (Remote Agency)", "")}</p>
                      <p className="mt-1 tabular-nums" style={{ color: B.soft }}>{e.dates}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Selected>
        </div>

        <aside className="col-span-12 rounded-[14px] border text-[13px] lg:col-span-4" style={{ background: B.panel, borderColor: B.line }}>
          <p className="border-b px-5 py-4 font-bold" style={{ borderColor: B.line }}>Properties</p>
          <div className="space-y-5 p-5">
            <div>
              <p className="mb-2 font-semibold" style={{ color: B.soft }}>Variant</p>
              <div className="grid grid-cols-3 gap-1 rounded-[8px] p-1" style={{ background: "#23262b" }}>
                {["Designer", "Engineer", "Builder"].map((v) => (
                  <span key={v} className="rounded-[6px] py-1.5 text-center font-bold" style={v === "Builder" ? { background: B.sel, color: "#0E0F11" } : { color: B.soft }}>{v}</span>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed" style={{ color: B.soft }}>Switch variant to read the designer or engineer version of this bio.</p>
            </div>
            <div className="space-y-2">
              {[["Open to work", true], ["Relocation", true]].map(([k]) => (
                <div key={k} className={field} style={{ background: "#23262b" }}>
                  <span>{k}</span>
                  <span className="relative h-5 w-9 rounded-full" style={{ background: B.sel }}><span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" /></span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[["Location", "Bharuch, IN"], ["Age", String(identity.age)], ["Languages", "EN · HI · GU"], ["Education", "B.Tech CSE · 7.9"], ["Works at", "UMM Digital"], ["Builds at", "PrimeDigitals"]].map(([k, v]) => (
                <div key={k} className={field} style={{ background: "#23262b" }}><span style={{ color: B.soft }}>{k}</span><span className="font-semibold">{v}</span></div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// B6 · Contact — a comment thread you can reply to
// ------------------------------------------------------------
export function CanvasContact() {
  const links = [["Copy email", identity.email], ["Call", identity.phone], ["GitHub", identity.github], ["Résumé", "PDF · 1 page"], ["Pixel world", "Play the RPG version"]];
  return (
    <section className="relative overflow-hidden pt-[clamp(5rem,9vw,8rem)]" style={{ ...dots, color: B.text }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-[clamp(1.25rem,3vw,2.75rem)]">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-[clamp(2.8rem,6vw,6.2rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">Leave a comment.<br /><span style={{ color: B.sel }}>I reply.</span></h2>
          <div className="mt-12 max-w-[34rem] rounded-[16px] border shadow-[0_30px_60px_rgba(0,0,0,.45)]" style={{ background: B.panel, borderColor: B.line }}>
            <div className="flex gap-3 p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-extrabold text-[#0E0F11]" style={{ background: B.gold }}>KM</span>
              <div>
                <p className="text-[13px] font-bold">Krishna Mehta <span className="font-medium" style={{ color: B.soft }}>· now</span></p>
                <p className="mt-1.5 text-[15px] leading-relaxed">Open to product-first teams of 10 to 150. Remote, pan-India or relocation. Design, engineering, or both.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t p-4" style={{ borderColor: B.line }}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[12px] font-bold" style={{ borderColor: B.line, color: B.soft }}>You</span>
              <span className="flex-1 rounded-[10px] border px-4 py-3 text-[14px]" style={{ borderColor: B.line, color: B.soft }}>Reply to {identity.email}</span>
              <span className="rounded-[10px] px-4 py-3 text-[13px] font-bold text-[#0E0F11]" style={{ background: B.sel }}>Send</span>
            </div>
          </div>
          <Cursor label="You" color={B.red} className="ml-[28rem] -mt-3" />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-[16px] border p-2" style={{ background: B.panel, borderColor: B.line }}>
            <p className="px-3 pb-2 pt-3 text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: B.soft }}>Share · Krishna Mehta</p>
            {links.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-[10px] px-3 py-3.5 text-[15px]">
                <span className="font-bold">{k}</span><span style={{ color: B.soft }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-24 px-[clamp(1.25rem,3vw,2.75rem)] pb-10">
        <FrameLabel active>Footer / Wordmark</FrameLabel>
        <Selected size="Fill × 212">
          <p className="text-[clamp(3rem,12.6vw,15.5rem)] font-extrabold leading-[0.82] tracking-[-0.06em]">Krishna Mehta</p>
        </Selected>
      </div>
    </section>
  );
}
