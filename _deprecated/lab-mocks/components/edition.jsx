// ============================================================
// Direction C — "The Edition"
// The portfolio as a printed issue: a cover, a contents page,
// an annotated anatomy spread, a profile interview and a back
// cover. Cool newsprint, black ink, one teal.
// ============================================================
import { projects, identity, about } from "@/data/portfolio";
import { process } from "@/data/studio";

const E = {
  paper: "#ECEEE9",
  ink: "#111311",
  muted: "#5B6059",
  rule: "#C6CAC2",
  teal: "#0F7466",
  plate: "#DFE2DC",
};
const byId = (id) => projects.find((p) => p.id === id);
const wrap = "mx-auto max-w-[1440px] px-[clamp(1.25rem,3vw,2.75rem)]";

function Kicker({ children, className = "" }) {
  return <p className={`text-[12px] font-bold uppercase tracking-[0.24em] ${className}`} style={{ color: E.muted }}>{children}</p>;
}

function Barcode({ className = "h-14", color = E.ink }) {
  const seed = "KRISHNAMEHTA2026";
  const w = [];
  for (let i = 0; i < 44; i++) { const c = seed.charCodeAt(i % seed.length) + i * 5; w.push(1 + (c % 3), 1 + ((c >> 2) % 2)); }
  return (
    <div className={`flex ${className}`} aria-hidden>
      {w.map((v, i) => <span key={i} style={{ width: v * 1.5, background: i % 2 ? "transparent" : color }} />)}
    </div>
  );
}

// ------------------------------------------------------------
// C1 · Hero — the cover
// ------------------------------------------------------------
export function EditionHero() {
  const lines = [
    ["04", "Shop-ERP", "Month-end billing for 300+ paying merchants"],
    ["12", "Hazeberg", "A consultancy site, built for UMM Digital"],
    ["18", "Trade CRM", "Who is this deal waiting on?"],
    ["26", "Design ⇄ Code", "One desk, both sides of the product"],
  ];
  return (
    <section className="relative min-h-[100svh] overflow-hidden" style={{ background: E.paper, color: E.ink }}>
      <div className={`${wrap} pt-6`}>
        <div className="flex items-center justify-between border-b pb-3 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: E.ink }}>
          <span>Portfolio · 2026 edition</span>
          <span className="hidden md:block">Design + Engineering</span>
          <span>Bharuch, Gujarat</span>
        </div>
        <h1 className="-ml-[0.04em] mt-3 whitespace-nowrap text-[clamp(3rem,14.9vw,15.5rem)] font-extrabold leading-[0.8] tracking-[-0.06em]">Krishna Mehta</h1>
        <div className="mt-6 flex items-center justify-between border-t pt-3 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: E.ink }}>
          <span>The one-person product team</span>
          <span style={{ color: E.teal }}>Open to work</span>
        </div>

        <div className="mt-7 grid grid-cols-12 gap-[clamp(1rem,2.4vw,2.5rem)]">
          <figure className="relative col-span-12 md:col-span-5">
            <img src="/assets/work/profile.webp" alt="Krishna Mehta" className="h-[min(34rem,58svh)] w-full object-cover object-[50%_42%]" />
            <span className="absolute -right-6 top-8 grid h-[7.5rem] w-[7.5rem] rotate-[12deg] place-items-center rounded-full text-center text-[13px] font-extrabold uppercase leading-[1.15] tracking-[0.08em] text-[#ECEEE9]" style={{ background: E.teal }}>
              Design<br />+ code<br />inside
            </span>
          </figure>
          <div className="col-span-12 flex flex-col md:col-span-7">
            <p className="text-[clamp(2rem,3.9vw,3.7rem)] font-extrabold leading-[1.0] tracking-[-0.04em]">
              300+ shops close their month on software he designed <span style={{ color: E.teal }}>and</span> built.
            </p>
            <p className="mt-5 max-w-[34rem] text-[16px] font-medium leading-relaxed" style={{ color: E.muted }}>
              Designer and engineer, one person, no handoff. From the first user interview to production, and the months after.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {["shop-erp", "hazeberg", "trade-crm"].map((id) => (
                <div key={id} className="p-2" style={{ background: E.plate }}><img src={byId(id).cover} alt="" className="aspect-[16/10] w-full object-cover" /></div>
              ))}
            </div>
            <ol className="mt-auto pt-6">
              {lines.map(([pg, t, d]) => (
                <li key={pg} className="grid grid-cols-[3.5rem_11rem_1fr] items-baseline gap-4 border-t py-3.5 text-[15px]" style={{ borderColor: E.rule }}>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: E.teal }}>p. {pg}</span>
                  <span className="font-extrabold tracking-[-0.01em]">{t}</span>
                  <span className="font-medium" style={{ color: E.muted }}>{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// C2 · Work — contents page + the feature it points to
// ------------------------------------------------------------
export function EditionWork() {
  const erp = byId("shop-erp");
  return (
    <section className="py-[clamp(5rem,9vw,8rem)]" style={{ background: E.paper, color: E.ink }}>
      <div className={wrap}>
        <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: E.ink }}>
          <h2 className="text-[clamp(3.4rem,8vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.055em]">Contents</h2>
          <p className="max-w-[22rem] pb-2 text-[14px] font-medium leading-relaxed" style={{ color: E.muted }}>Twelve projects. Own products, client sites and design studies. Hover a line to open its spread.</p>
        </div>
        <div className="mt-10 grid grid-cols-12 gap-[clamp(1rem,3vw,3rem)]">
          <ol className="col-span-12 lg:col-span-5">
            {projects.map((p, i) => {
              const on = p.id === "shop-erp";
              return (
                <li key={p.id} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b py-[0.7rem]" style={{ borderColor: E.rule, color: on ? E.teal : E.ink }}>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: on ? E.teal : E.muted }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-extrabold tracking-[-0.025em]">{p.name}</span>
                    {on && <span className="mt-0.5 block text-[13px] font-medium" style={{ color: E.muted }}>{p.subtitle}</span>}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: on ? E.teal : E.muted }}>{p.discipline === "both" ? "Design + Eng" : p.discipline === "design" ? "Design" : "Eng"}</span>
                </li>
              );
            })}
          </ol>
          <article className="col-span-12 lg:col-span-7">
            <div className="p-[clamp(1rem,2.4vw,2.2rem)]" style={{ background: E.plate }}>
              <img src={erp.cover} alt="Shop-ERP dashboard" className="w-full" />
            </div>
            <div className="mt-6 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-7">
                <Kicker>Feature · p. 04 · {erp.org}</Kicker>
                <p className="mt-3 text-[clamp(1.6rem,2.4vw,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                  &ldquo;Shop owners want it to feel like a calculator, not a SaaS dashboard.&rdquo;
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: E.muted }}>{erp.problem.split(". ").slice(0, 2).join(". ")}.</p>
              </div>
              <div className="col-span-12 border-l pl-6 md:col-span-5" style={{ borderColor: E.ink }}>
                <p className="text-[clamp(3rem,5vw,4.8rem)] font-extrabold leading-none tracking-[-0.05em]" style={{ color: E.teal }}>300+</p>
                <p className="mt-1 text-[14px] font-bold">paying merchants</p>
                <p className="mt-5 text-[13.5px] leading-relaxed" style={{ color: E.muted }}>10+ months in production, zero critical downtime. Billing cut from 4–6 hours to under 30 minutes.</p>
                <p className="mt-5 text-[13px] font-extrabold uppercase tracking-[0.16em]">Read the case study &rarr;</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// C3 · Design ⇄ Code — anatomy spread: design notes left, engineering right
// ------------------------------------------------------------
function Pin({ n, tone }) {
  return <span className="grid h-7 w-7 place-items-center rounded-full text-[12px] font-extrabold text-white" style={{ background: tone }}>{n}</span>;
}

export function EditionDesignCode() {
  const rose = "#C2513F";
  const design = [
    ["1", "The total is the loudest thing on the tile. Label first, number biggest."],
    ["2", "Tabular figures, so the rupees don't jump around as sales tick up."],
    ["3", "A quiet Live badge instead of a refresh button."],
  ];
  const eng = [
    ["A", "One KpiCard component drives every tile on the dashboard."],
    ["B", "A real-time Firestore listener keeps the number current."],
    ["C", "Amounts formatted with Intl.NumberFormat('en-IN')."],
  ];
  return (
    <section className="py-[clamp(5rem,9vw,8rem)]" style={{ background: E.paper, color: E.ink }}>
      <div className={wrap}>
        <div className="border-b pb-5" style={{ borderColor: E.ink }}>
          <Kicker>Spread · Design ⇄ Code · p. 26</Kicker>
          <h2 className="mt-3 text-[clamp(2.6rem,5.4vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">Anatomy of a sales tile.</h2>
        </div>
        <div className="mt-12 grid grid-cols-12 items-center gap-8">
          <div className="col-span-12 space-y-8 lg:col-span-3">
            <Kicker className="!text-[#C2513F]">Design decisions</Kicker>
            {design.map(([n, t]) => (
              <div key={n} className="flex gap-4"><Pin n={n} tone={rose} /><p className="text-[15px] font-medium leading-relaxed">{t}</p></div>
            ))}
          </div>
          <div className="col-span-12 grid place-items-center py-10 lg:col-span-6" style={{ background: E.plate }}>
            <div className="relative scale-[1.35]">
              <div className="w-[17rem] rounded-[16px] bg-white p-6 shadow-[0_20px_40px_rgba(17,19,17,.12)]">
                <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[#5B6059]">Today&apos;s Sales</span><span className="rounded-full bg-[#E3F2EE] px-2 py-0.5 text-[11px] font-bold text-[#0F7466]">Live</span></div>
                <p className="mt-3 text-[40px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">₹4,513</p>
                <p className="mt-2 text-[13px] font-medium text-[#5B6059]">58 orders today</p>
              </div>
              <span className="absolute -left-10 top-[4.1rem] scale-75"><Pin n="1" tone={rose} /></span>
              <span className="absolute -right-[4.2rem] top-[4.1rem] flex scale-75 gap-1"><Pin n="2" tone={rose} /><Pin n="C" tone={E.teal} /></span>
              <span className="absolute -right-10 top-[1.1rem] scale-75"><Pin n="3" tone={rose} /></span>
              <span className="absolute -right-10 top-[6.9rem] scale-75"><Pin n="B" tone={E.teal} /></span>
              <span className="absolute -bottom-10 left-3 scale-75"><Pin n="A" tone={E.teal} /></span>
            </div>
          </div>
          <div className="col-span-12 space-y-8 lg:col-span-3">
            <Kicker className="!text-[#0F7466]">Engineering decisions</Kicker>
            {eng.map(([n, t]) => (
              <div key={n} className="flex gap-4"><Pin n={n} tone={E.teal} /><p className="text-[15px] font-medium leading-relaxed">{t}</p></div>
            ))}
          </div>
        </div>
        <p className="mt-10 max-w-[44rem] text-[14px] leading-relaxed" style={{ color: E.muted }}>
          Most products lose something between the design file and the deploy. When the same person makes both sets of decisions, the margins agree.
        </p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// C4 · Process — five verbs, set big
// ------------------------------------------------------------
export function EditionProcess() {
  return (
    <section className="py-[clamp(5rem,9vw,8rem)]" style={{ background: E.ink, color: E.paper }}>
      <div className={wrap}>
        <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: "#3a3e39" }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#9CA39A]">How I work · in five verbs</p>
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#9CA39A]">p. 32</p>
        </div>
        {process.map((s, i) => (
          <div key={s.n} className="grid grid-cols-12 items-center gap-6 border-b py-5" style={{ borderColor: "#2a2e29" }}>
            <span className="col-span-1 text-[13px] font-bold tabular-nums text-[#9CA39A]">{i + 1}</span>
            <p className={`col-span-11 text-[clamp(3.6rem,9.4vw,9rem)] font-extrabold leading-[0.86] tracking-[-0.055em] md:col-span-6 ${i === 1 ? "" : ""}`}
              style={i === 1 ? { color: "#5FC2B2" } : i > 1 ? { color: "transparent", WebkitTextStroke: "1.5px #6b726a" } : undefined}>
              {s.title.replace(" & stay", "")}.
            </p>
            <div className="col-span-12 md:col-span-5">
              <p className="text-[16px] font-medium leading-relaxed text-[#D7DAD3]">{s.body}</p>
              <p className="mt-2 text-[13.5px] font-semibold text-[#5FC2B2]">{s.proof} &rarr;</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// C5 · About — a profile interview
// ------------------------------------------------------------
export function EditionAbout() {
  const qa = [
    ["Designer or engineer?", about.intro],
    ["What are you proudest of?", "Shop-ERP. My first end-to-end production product, and 300+ merchants still run their month-end billing on it. It taught me how shop owners actually use software."],
    ["What has building taught you?", "For software aimed at non-technical users, speed is the moat, not feature count. Touchpe's whole bet is a cashier flow that feels faster than counting cash."],
  ];
  return (
    <section className="py-[clamp(5rem,9vw,8rem)]" style={{ background: E.paper, color: E.ink }}>
      <div className={wrap}>
        <div className="flex items-end justify-between border-b pb-5" style={{ borderColor: E.ink }}>
          <Kicker>Profile · p. 38</Kicker>
          <Kicker>Interview</Kicker>
        </div>
        <div className="mt-10 grid grid-cols-12 gap-[clamp(1rem,3vw,3rem)]">
          <figure className="col-span-12 md:col-span-5">
            <img src="/assets/work/k4.webp" alt="Krishna Mehta" className="aspect-[4/5] w-full object-cover object-bottom" />
            <figcaption className="mt-3 text-[13px] leading-relaxed" style={{ color: E.muted }}>
              Krishna Mehta, {identity.age}. Designer at UMM Digital. Builds his own products under PrimeDigitals.
            </figcaption>
          </figure>
          <div className="col-span-12 md:col-span-7">
            <h2 className="text-[clamp(2.4rem,4.6vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">The person who removes the handoff.</h2>
            <div className="mt-10 space-y-8">
              {qa.map(([q, a]) => (
                <div key={q} className="grid gap-2 md:grid-cols-[12rem_1fr] md:gap-8">
                  <p className="text-[15px] font-extrabold" style={{ color: E.teal }}>{q}</p>
                  <p className="text-[16.5px] font-medium leading-[1.7]">{a}</p>
                </div>
              ))}
            </div>
            <dl className="mt-12 grid grid-cols-2 border-t md:grid-cols-4" style={{ borderColor: E.ink }}>
              {[["Base", "Bharuch, IN"], ["Languages", "EN · HI · GU"], ["Education", "B.Tech CSE, 7.9"], ["Now", "UMM Digital"]].map(([k, v]) => (
                <div key={k} className="border-b py-4 pr-4" style={{ borderColor: E.rule }}>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: E.muted }}>{k}</dt>
                  <dd className="mt-1 text-[15px] font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// C6 · Contact — the back cover + colophon
// ------------------------------------------------------------
export function EditionContact() {
  return (
    <section className="pt-[clamp(5rem,9vw,8rem)]" style={{ background: E.teal, color: E.paper }}>
      <div className={wrap}>
        <div className="flex items-center justify-between border-b pb-3 text-[12px] font-bold uppercase tracking-[0.2em]" style={{ borderColor: "rgba(236,238,233,.5)" }}>
          <span>Back cover</span><span>Next issue: your product</span>
        </div>
        <div className="mt-10 grid grid-cols-12 items-end gap-6">
          <h2 className="col-span-12 text-[clamp(3.4rem,9vw,9rem)] font-extrabold leading-[0.84] tracking-[-0.055em] lg:col-span-8">Write to me.</h2>
          <p className="col-span-12 max-w-[24rem] pb-3 text-[16px] font-medium leading-relaxed opacity-85 lg:col-span-4">Open to product-first teams of 10 to 150. Remote, pan-India or relocation. Design-focused, engineering-focused or both.</p>
        </div>
        <p className="mt-8 break-all text-[clamp(1.6rem,4.2vw,4rem)] font-extrabold tracking-[-0.03em] underline decoration-2 underline-offset-[0.18em]">{identity.email}</p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px] font-bold">
          {["Copy email", identity.phone, "GitHub", "Résumé (PDF)", "Play the pixel world"].map((l, i) => (
            <span key={l} className="rounded-full px-5 py-3" style={i === 0 ? { background: E.paper, color: E.teal } : { boxShadow: "inset 0 0 0 1.5px rgba(236,238,233,.6)" }}>{l}</span>
          ))}
        </div>
        <div className="mt-20 grid grid-cols-2 gap-6 border-t pb-10 pt-6 text-[13px] leading-relaxed md:grid-cols-5" style={{ borderColor: "rgba(236,238,233,.5)" }}>
          <div><p className="font-bold">Colophon</p></div>
          <div><p className="opacity-75">Set in</p><p className="font-bold">Manrope</p></div>
          <div><p className="opacity-75">Built with</p><p className="font-bold">Next.js, Tailwind, Framer Motion</p></div>
          <div><p className="opacity-75">Designed and coded by</p><p className="font-bold">the same person</p></div>
          <div className="flex justify-end"><div className="bg-[#ECEEE9] p-2"><Barcode className="h-12" color={E.ink} /></div></div>
        </div>
      </div>
    </section>
  );
}
