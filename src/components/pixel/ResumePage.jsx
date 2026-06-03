"use client";
import Link from "next/link";
import { resume } from "@/data/resume";

const INK = "#2e2519";
const HEAD = "#1a1420";
const SUB = "#6b5535";
// links: bold dark ink with a subtle underline (inline so styled-jsx scoping can't drop it)
const LINK = { color: "#1a1420", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" };

function A({ href, children, ext }) {
  if (!href) return <span style={{ color: SUB }}>{children}</span>;
  if (ext) return <a href={href} target="_blank" rel="noopener noreferrer" style={LINK}>{children}</a>;
  return <Link href={href} style={LINK}>{children}</Link>;
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="font-pixel text-[14px] font-bold uppercase tracking-wide" style={{ color: HEAD }}>{title}</h2>
      <div className="mb-3 mt-1 h-[2px] w-full" style={{ background: "#2a2230" }} />
      {children}
    </section>
  );
}

function Bullets({ points }) {
  return (
    <ul className="mt-1.5 space-y-1.5">
      {points.map((p) => (
        <li key={p.slice(0, 28)} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: INK }}>
          <span aria-hidden style={{ color: SUB }}>–</span><span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  const r = resume;
  const onPrint = () => { if (typeof window !== "undefined") window.print(); };
  const onDownload = async () => {
    try {
      const res = await fetch(r.pdf, { method: "HEAD" });
      if (res.ok) {
        const a = document.createElement("a");
        a.href = r.pdf; a.download = "Krishna-Mehta-Resume.pdf";
        document.body.appendChild(a); a.click(); a.remove();
        return;
      }
    } catch { /* fall through */ }
    onPrint(); // PDF not in /public yet → let them save the page as PDF
  };

  return (
    <div className="resume-desk relative min-h-[100dvh] w-full font-sans"
      style={{ background: "radial-gradient(110% 80% at 50% -10%, #2c2118, #1c150f 55%, #150f0a)" }}>
      {/* toolbar */}
      <div className="no-print sticky top-0 z-30 flex items-center justify-between gap-2 px-4 py-3 sm:px-6"
        style={{ background: "rgba(21,15,10,0.78)", backdropFilter: "blur(8px)", borderBottom: "2px solid #2a2230" }}>
        <Link href="/" className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#1a1420]"
          style={{ background: "#f3e7cf", border: "2px solid #2a2230", boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }}>
          <span className="sm:hidden">← Map</span><span className="hidden sm:inline">← Back to the map</span>
        </Link>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrint}
            className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#efe3c8] transition-colors hover:text-white"
            style={{ border: "2px solid #3a4a3a" }}>Print</button>
          <button type="button" onClick={onDownload}
            className="font-pixel rounded-md px-3 py-1.5 text-[12px] text-[#1a1420] transition-transform active:translate-y-[2px]"
            style={{ background: "#D4A848", border: "2px solid #2a2230", boxShadow: "0 3px 0 #2a2230" }}>
            Download PDF ↓
          </button>
        </div>
      </div>

      {/* the sheet */}
      <div className="mx-auto w-full max-w-[880px] px-3 py-6 sm:px-6 sm:py-10">
        <article className="resume-paper relative px-6 py-8 sm:px-12 sm:py-12"
          style={{
            background: "#f1e6cd",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            border: "1px solid #d8c79f",
          }}>
          {/* aged texture / stains */}
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 22% 12%, rgba(120,90,40,0.06), transparent 35%)," +
                "radial-gradient(circle at 85% 78%, rgba(120,90,40,0.05), transparent 40%)," +
                "radial-gradient(circle at 60% 50%, rgba(160,120,60,0.03), transparent 60%)",
              boxShadow: "inset 0 0 70px rgba(120,90,40,0.14)",
            }} />

          <div className="relative">
            {/* header */}
            <header className="text-center">
              <h1 className="font-pixel leading-none" style={{ color: HEAD, fontSize: "clamp(1.9rem,5.5vw,2.8rem)" }}>{r.name}</h1>
              <p className="mt-1 text-[12px] tracking-wide" style={{ color: SUB }}>{r.title}</p>
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px]" style={{ color: SUB }}>
                {r.contacts.map((c, i) => (
                  <span key={c.label} className="flex items-center gap-x-2">
                    {i > 0 && <span aria-hidden style={{ color: "#b8a87f" }}>·</span>}
                    <A href={c.href} ext>{c.label}</A>
                  </span>
                ))}
              </p>
            </header>

            <Section title="Professional Summary">
              <p className="text-[13px] leading-relaxed" style={{ color: INK }}>{r.summary}</p>
            </Section>

            <Section title="Skills">
              <div className="space-y-1.5">
                {r.skills.map((s) => (
                  <p key={s.group} className="text-[13px] leading-relaxed">
                    <span className="font-semibold" style={{ color: HEAD }}>{s.group}:</span>{" "}
                    <span style={{ color: INK }}>{s.items}</span>
                  </p>
                ))}
              </div>
            </Section>

            <Section title="Experience">
              {r.experience.map((e) => (
                <div key={e.role + e.dates} className="mb-4 last:mb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[14px] font-bold" style={{ color: HEAD }}>{e.role}</span>
                    <span className="text-[12px]" style={{ color: SUB }}>{e.dates}</span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[12px] italic" style={{ color: SUB }}>{e.org}</span>
                    <span className="text-[12px]" style={{ color: SUB }}>{e.loc}</span>
                  </div>
                  <Bullets points={e.points} />
                </div>
              ))}
            </Section>

            <Section title="Projects">
              {r.projects.map((p) => (
                <div key={p.id} className="mb-3.5 last:mb-0">
                  <p className="text-[13px]">
                    <Link href={`/quest/${p.id}`} className="text-[14px]" style={LINK}>{p.name}</Link>
                    <span style={{ color: HEAD }}> — {p.tag}</span>
                    <span style={{ color: SUB }}> | <span className="italic">{p.tech}</span> | </span>
                    {p.links.map((l, i) => (
                      <span key={l.label}>{i > 0 && <span style={{ color: SUB }}> · </span>}<A href={l.href} ext={l.ext}>{l.label}</A></span>
                    ))}
                  </p>
                  <Bullets points={p.points} />
                </div>
              ))}
            </Section>

            <Section title="Education">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="text-[14px] font-bold" style={{ color: HEAD }}>{r.education.school}</span>
                <span className="text-[12px]" style={{ color: SUB }}>{r.education.loc}</span>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="text-[12px] italic" style={{ color: SUB }}>{r.education.degree} | {r.education.detail}</span>
                <span className="text-[12px]" style={{ color: SUB }}>{r.education.dates}</span>
              </div>
            </Section>
          </div>
        </article>

        <p className="no-print mt-4 text-center text-[12px]" style={{ color: "#8f8a72" }}>
          Every link above is live · use <b>Print</b> to save an ATS-clean copy, or <b>Download PDF</b> for the formatted résumé.
        </p>
      </div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .resume-desk { background: #fff !important; }
          .resume-paper { box-shadow: none !important; border: none !important; background: #fff !important; max-width: 100% !important; padding: 0 !important; }
          .resume-paper :global(*) { color: #000 !important; font-family: "Plus Jakarta Sans", Arial, sans-serif !important; }
        }
      `}</style>
    </div>
  );
}
