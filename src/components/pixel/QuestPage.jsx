"use client";
import { PixelShell, Panel, Chip, PixelButton, accentOf, ProjectImage, ProductMock } from "./ui";
import { projects, identity, projectCategories } from "@/data/portfolio";

const catLabel = (key) => projectCategories.find((c) => c.key === key)?.label || key;

function FramedShot({ p }) {
  const a = accentOf(p.accent || "gold");
  return (
    <div className="p-2" style={{ background: "#2a2230", boxShadow: "7px 7px 0 rgba(0,0,0,0.35)" }}>
      <div className="p-1" style={{ background: a.main }}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10", border: "2px solid #2a2230", background: "#14110f" }}>
          <ProjectImage
            src={p.image}
            alt={`${p.name} screenshot`}
            imgClassName="absolute inset-0 h-full w-full object-cover object-top"
            fallback={<div className="absolute inset-0"><ProductMock name={p.name} tagline={p.subtitle} accent={p.accent} live={p.live} /></div>}
          />
        </div>
      </div>
    </div>
  );
}

export default function QuestPage({ id }) {
  const idx = projects.findIndex((p) => p.id === id);
  const p = projects[idx];
  if (!p) return null;
  const next = projects[(idx + 1) % projects.length];
  const accent = p.accent || "gold";

  return (
    <PixelShell accent={accent} eyebrow={`${catLabel(p.category)}${p.flagship ? " · Flagship ★" : ""}`} title={p.name} subtitle={p.subtitle}>
      <div className="space-y-6">
        {/* screenshot / product mockup */}
        <div className="-mt-2">
          <FramedShot p={p} />
        </div>

        {/* status / links */}
        <Panel accent={accent}>
          {p.status && <p className="font-mono text-[13px] font-medium leading-relaxed" style={{ color: accentOf(accent).deep }}>{p.status}</p>}
          {p.role && <p className="text-[13px] leading-relaxed text-[#5b4a33]"><span className="font-pixel text-[11px] uppercase tracking-wider text-[#9a743f]">Role · </span>{p.role}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            {p.live && <PixelButton href={p.live} external accent={accent}>Visit live ↗</PixelButton>}
            {p.figma && <PixelButton href={p.figma} external accent={accent}>Figma ↗</PixelButton>}
            {p.flagship && <PixelButton href={identity.githubUrl} external accent="wood">GitHub ↗</PixelButton>}
            <PixelButton href={`/work/${p.id}`} accent="wood">Full case study →</PixelButton>
          </div>
        </Panel>

        {/* design + engineering — both sides of the same quest */}
        {(p.design?.length > 0 || p.engineering?.length > 0) && (
          <div className={`grid gap-6 ${p.design?.length && p.engineering?.length ? "md:grid-cols-2" : ""}`}>
            {p.design?.length > 0 && (
              <Panel title="DESIGN SIDE" accent="rose" delay={0.04}>
                <ul className="space-y-2">
                  {p.design.map((d) => (
                    <li key={d} className="flex gap-2 text-[13.5px] leading-snug">
                      <span className="font-pixel shrink-0" style={{ color: accentOf("rose").deep }}>▸</span><span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            {p.engineering?.length > 0 && (
              <Panel title="ENGINEERING SIDE" accent="cyan" delay={0.06}>
                <ul className="space-y-2">
                  {p.engineering.map((d) => (
                    <li key={d} className="flex gap-2 text-[13.5px] leading-snug">
                      <span className="font-pixel shrink-0" style={{ color: accentOf("cyan").deep }}>▸</span><span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </div>
        )}

        {/* ---- flagship: full case study ---- */}
        {p.flagship ? (
          <>
            <Panel title="THE PROBLEM" accent={accent} delay={0.04}><p className="text-[14px] leading-relaxed">{p.problem}</p></Panel>
            <Panel title="WHAT I BUILT" accent={accent} delay={0.04}>
              <ul className="space-y-2">
                {p.built.map((b) => (
                  <li key={b} className="flex gap-2 text-[14px] leading-snug">
                    <span className="font-pixel shrink-0" style={{ color: accentOf(accent).deep }}>▸</span><span>{b}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="STACK" accent={accent} delay={0.04}><div className="flex flex-wrap gap-2">{p.tech.map((t) => <Chip key={t} accent={accent}>{t}</Chip>)}</div></Panel>
            <Panel title="OUTCOME" accent={accent} delay={0.04}><p className="text-[14px] leading-relaxed">{p.outcome}</p></Panel>
            {(p.reflection || p.decision) && (
              <Panel title={p.reflection ? "REFLECTION" : "KEY DECISION"} accent={accent} delay={0.04}>
                <p className="text-[14px] italic leading-relaxed text-[#5b4a33]">{p.reflection || p.decision}</p>
              </Panel>
            )}
          </>
        ) : (
          /* ---- client / lab: focused brief ---- */
          <>
            {p.challenge && <Panel title="THE CHALLENGE" accent={accent} delay={0.04}><p className="text-[14px] leading-relaxed">{p.challenge}</p></Panel>}
            {p.overview && <Panel title="OVERVIEW" accent={accent} delay={0.04}><p className="text-[14px] leading-relaxed">{p.overview}</p></Panel>}
            {Array.isArray(p.problem) && (
              <Panel title="BEFORE → AFTER" accent={accent} delay={0.04}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[["Before", p.problem], ["After", p.solution || []]].map(([t, list]) => (
                    <div key={t}>
                      <p className="font-pixel mb-1 text-[11px] uppercase tracking-wider text-[#9a743f]">{t}</p>
                      <ul className="space-y-1.5">{list.map((x) => <li key={x} className="text-[13.5px] leading-snug">{x}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
            {p.highlights?.length > 0 && (
              <Panel title="HIGHLIGHTS" accent={accent} delay={0.04}>
                <ul className="space-y-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-[14px] leading-snug">
                      <span className="font-pixel shrink-0" style={{ color: accentOf(accent).deep }}>▸</span><span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            {p.tech?.length > 0 && (
              <Panel title="STACK" accent={accent} delay={0.04}><div className="flex flex-wrap gap-2">{p.tech.map((t) => <Chip key={t} accent={accent}>{t}</Chip>)}</div></Panel>
            )}
          </>
        )}

        {/* screenshot strip */}
        {p.gallery?.length > 0 && (
          <Panel title="FROM THE QUEST LOG" accent={accent} delay={0.04}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.gallery.slice(0, 6).map((g) => (
                <a key={g.src} href={`/work/${p.id}`} className="block overflow-hidden" style={{ border: "2px solid #2a2230", aspectRatio: "16 / 10", background: "#14110f" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105" />
                </a>
              ))}
            </div>
          </Panel>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <PixelButton href="/quests" accent="wood">← Hall of Quests</PixelButton>
          <PixelButton href={`/quest/${next.id}`} accent={accent}>Next · {next.name} →</PixelButton>
        </div>
      </div>
    </PixelShell>
  );
}
