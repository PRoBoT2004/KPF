"use client";
import Link from "next/link";
import { resume } from "@/data/resume";

// One sheet, two outputs: this page on screen, and (via print CSS)
// the A4 PDF in /public. Every size is in em so print only has to
// change the sheet's base font-size.
const CSS = `
body:has(.rs-desk){background:#F2F2F2}
.rs-desk{min-height:100dvh;background:#F2F2F2;color:#0A0A0A;font-family:var(--font-studio),ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:-0.005em}
.rs-bar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px clamp(1rem,2.2vw,2rem);background:rgba(242,242,242,.86);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid #E2E2E2}
.rs-btn{display:inline-flex;align-items:center;gap:.4em;border-radius:999px;padding:9px 16px;font-size:13.5px;font-weight:500;line-height:1;transition:background-color .2s,color .2s,border-color .2s}
.rs-btn-dark{background:#0A0A0A;color:#fff}.rs-btn-dark:hover{background:#2E2E2E}
.rs-btn-line{border:1px solid #CFCFCF;color:#0A0A0A}.rs-btn-line:hover{border-color:#0A0A0A}
.rs-wrap{padding:clamp(0rem,3vw,3rem) clamp(0rem,2vw,2rem) 3rem}
.rs-sheet{max-width:820px;margin:0 auto;background:#fff;padding:clamp(1.75rem,6vw,3.6rem) clamp(1.25rem,6vw,3.8rem);font-size:14px;line-height:1.45;box-shadow:0 1px 2px rgba(0,0,0,.05),0 16px 48px rgba(0,0,0,.07)}
.rs-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:.8em 2em}
.rs-name{font-size:2.7em;font-weight:600;letter-spacing:-0.04em;word-spacing:.12em;line-height:.92}
.rs-title{margin-top:.4em;font-size:1.12em;color:#4A4A4A;letter-spacing:-0.015em}
.rs-avail{font-size:.84em;color:#4A4A4A;text-align:right;line-height:1.35}
.rs-avail b{display:block;color:#0A0A0A;font-weight:600}
.rs-contacts{margin-top:1.1em;display:flex;flex-wrap:wrap;gap:.2em 1.1em;font-size:.88em;color:#2E2E2E}
.rs-sec{display:grid;grid-template-columns:8.6em 1fr;gap:0 1.4em;border-top:1px solid #0A0A0A;padding-top:.7em;margin-top:1.3em}
.rs-tech{color:#6B6B6B;font-weight:400;font-size:.86em;letter-spacing:0}
.rs-h{font-size:.72em;font-weight:600;text-transform:uppercase;letter-spacing:.09em;padding-top:.3em}
.rs-p{color:#1F1F1F}
.rs-item+.rs-item{margin-top:1em}
.rs-row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:0 1em}
.rs-role{font-weight:600;font-size:1.03em;letter-spacing:-0.015em}
.rs-meta{color:#5E5E5E;font-size:.9em;font-variant-numeric:tabular-nums}
.rs-ul{margin-top:.35em;display:grid;gap:.28em}
.rs-li{display:flex;gap:.65em;color:#1F1F1F}
.rs-li:before{content:"";flex:none;width:.55em;height:1px;background:#0A0A0A;margin-top:.74em}
a.rs-a{color:inherit;text-decoration:underline;text-decoration-color:#C9C9C9;text-underline-offset:2px;text-decoration-thickness:1px}
a.rs-a:hover{text-decoration-color:#0A0A0A}
.rs-skill{display:grid;grid-template-columns:7.6em 1fr;gap:.9em;color:#1F1F1F}
.rs-skill+.rs-skill{margin-top:.22em}
.rs-skill b{font-weight:600;color:#0A0A0A}
.rs-note{margin:1.25rem auto 0;max-width:820px;padding:0 1rem;text-align:center;font-size:12.5px;color:#6B6B6B}
@media (max-width:640px){
  .rs-sec{grid-template-columns:1fr}.rs-h{margin-bottom:.55em}
  .rs-skill{grid-template-columns:1fr;gap:0}.rs-skill+.rs-skill{margin-top:.5em}
  .rs-avail{text-align:left}.rs-sheet{box-shadow:none}
}
@page{size:A4;margin:10mm 14mm}
@media print{
  html,body{background:#fff!important}
  .rs-sheet *{letter-spacing:0}
  .rs-sheet .rs-name{letter-spacing:-0.03em}
  .rs-bar,.rs-note{display:none!important}
  .rs-desk{background:#fff!important;min-height:0}
  .rs-wrap{padding:0!important}
  .rs-sheet{max-width:none;padding:0;box-shadow:none;font-size:9pt;line-height:1.33}
  .rs-sec{margin-top:1.05em}
  .rs-item+.rs-item{margin-top:.8em}
  .rs-item{break-inside:avoid}
  a.rs-a{text-decoration-color:#BDBDBD}
}
`;

function A({ href, children }) {
  if (!href) return <span>{children}</span>;
  const ext = /^(https?:|mailto:|tel:)/.test(href);
  return ext
    ? <a className="rs-a" href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>
    : <Link className="rs-a" href={href}>{children}</Link>;
}

function Bullets({ points }) {
  return (
    <ul className="rs-ul">
      {points.map((p) => <li key={p.slice(0, 32)} className="rs-li"><span>{p}</span></li>)}
    </ul>
  );
}

function Section({ title, children }) {
  return (
    <section className="rs-sec" aria-label={title}>
      <h2 className="rs-h">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function ResumePage() {
  const r = resume;
  return (
    <div className="rs-desk">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <nav className="rs-bar" aria-label="Résumé">
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em]">Krishna Mehta</Link>
        <div className="flex items-center gap-2">
          <Link href="/world" className="rs-btn rs-btn-line hidden sm:inline-flex">Pixel world</Link>
          <button type="button" onClick={() => window.print()} className="rs-btn rs-btn-line">Print</button>
          <a href={r.pdf} download="Krishna-Mehta-Resume.pdf" className="rs-btn rs-btn-dark">Download PDF</a>
        </div>
      </nav>

      <main className="rs-wrap">
        <article className="rs-sheet">
          <header>
            <div className="rs-head">
              <div>
                <h1 className="rs-name">{r.name}</h1>
                <p className="rs-title">{r.title}</p>
              </div>
              <p className="rs-avail"><b>Open to work</b>Remote, pan-India or relocation</p>
            </div>
            <p className="rs-contacts">
              {r.contacts.map((c) => <A key={c.label} href={c.href}>{c.label}</A>)}
            </p>
          </header>

          <Section title="Summary">
            <p className="rs-p">{r.summary}</p>
          </Section>

          <Section title="Experience">
            {r.experience.map((e) => (
              <div key={e.role + e.dates} className="rs-item">
                <div className="rs-row">
                  <span className="rs-role">{e.role}, {e.org}</span>
                  <span className="rs-meta">{e.dates} · {e.loc}</span>
                </div>
                <Bullets points={e.points} />
              </div>
            ))}
          </Section>

          <Section title="Selected products">
            {r.projects.map((p) => (
              <div key={p.id} className="rs-item">
                <div className="rs-row">
                  <span className="rs-role"><A href={`/work/${p.id}`}>{p.name}</A> <span className="font-normal text-[#4A4A4A]">· {p.tag}</span> <span className="rs-tech">— {p.tech}</span></span>
                  <span className="rs-meta">
                    {p.links.map((l, i) => <span key={l.label}>{i > 0 && " · "}{l.href ? <A href={l.href}>{l.label}</A> : l.label}</span>)}
                  </span>
                </div>
                <Bullets points={p.points} />
              </div>
            ))}
          </Section>

          <Section title="Skills">
            {r.skills.map((s) => (
              <p key={s.group} className="rs-skill"><b>{s.group}</b><span>{s.items}</span></p>
            ))}
          </Section>

          <Section title="Education">
            <div className="rs-row">
              <span className="rs-role">{r.education.degree}</span>
              <span className="rs-meta">{r.education.dates}</span>
            </div>
            <p className="rs-meta">{r.education.school}, {r.education.loc} · {r.education.detail}</p>
            <p className="rs-p" style={{ marginTop: "0.5em" }}><b className="font-semibold">Languages</b> &nbsp;{r.languages}</p>
          </Section>
        </article>
        <p className="rs-note">Every link on this page works. The PDF is printed from this exact page.</p>
      </main>
    </div>
  );
}
