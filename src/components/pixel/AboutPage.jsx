"use client";
import { PixelShell, Panel, Chip, PixelButton, Pips } from "./ui";
import HeroAvatar from "./HeroAvatar";
import { identity, about, classStats, tools, achievements, flagshipProjects } from "@/data/portfolio";

const CLASS_META = [
  { key: "designer", label: "The Designer", accent: "rose" },
  { key: "engineer", label: "The Engineer", accent: "cyan" },
  { key: "builder", label: "The Builder", accent: "gold" },
];

function Vital({ k, v }) {
  return (
    <div className="flex flex-col gap-0.5 border-b-2 border-dashed border-[#cdbfa0] py-2 last:border-0">
      <span className="font-pixel text-[10px] uppercase tracking-wider text-[#9a743f]">{k}</span>
      <span className="text-[14px] text-[#3a2f22]">{v}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PixelShell accent="gold" eyebrow="Character Sheet" title="Krishna Mehta" subtitle={identity.tagline + " · " + identity.location}>
      <div className="space-y-6">
        {/* avatar + vitals */}
        <Panel accent="gold">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="shrink-0 p-3" style={{ background: "#efe2c4", border: "4px solid #2a2230", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}>
              <HeroAvatar scale={6} />
            </div>
            <div className="grid w-full grid-cols-1 gap-x-8 sm:grid-cols-2">
              <Vital k="Level" v={identity.yoe + " · solo, end-to-end"} />
              <Vital k="Region" v={identity.location} />
              <Vital k="Status" v={identity.status} />
              <Vital k="Education" v={identity.education} />
              <Vital k="Languages" v={identity.languages} />
              <Vital k="Class" v="Builder (Design + Engineering)" />
            </div>
          </div>
        </Panel>

        {/* bio */}
        <Panel title="THE STORY SO FAR" accent="gold" delay={0.04}>
          <div className="space-y-3 text-[14px] leading-relaxed">
            <p className="text-[15px] text-[#1a1420]">{about.intro}</p>
            {about.body.map((para) => <p key={para.slice(0, 24)}>{para}</p>)}
            <p className="mt-2 border-t-2 border-[#cdbfa0] pt-3 text-[13px] text-[#6b5535]">{about.target}</p>
          </div>
        </Panel>

        {/* stats per class */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CLASS_META.map((c, i) => (
            <Panel key={c.key} title={c.label.toUpperCase()} accent={c.accent} delay={0.03 * i}>
              <div className="space-y-1">
                {classStats[c.key].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-2 py-[3px]">
                    <span className="text-[12px] text-[#3a2f22]">{s.label}</span>
                    <span className="flex items-center gap-1.5">
                      <Pips level={s.level} accent={c.accent} />
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>

        {/* tools */}
        <Panel title="EQUIPPED TOOLS" accent="cyan" delay={0.04}>
          <div className="flex flex-wrap gap-2">
            {tools.map((t) => <Chip key={t} accent="cyan">{t}</Chip>)}
          </div>
        </Panel>

        {/* achievements */}
        <Panel title="ACHIEVEMENTS" accent="gold" delay={0.04}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {achievements.map((a) => (
              <li key={a} className="flex gap-2 text-[13px] leading-snug">
                <span className="shrink-0 text-[#bb8f30]">★</span><span>{a}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* quests + contact */}
        <Panel title="SHIPPED QUESTS" accent="gold" delay={0.04}>
          <div className="flex flex-wrap gap-3">
            {flagshipProjects.map((p) => <PixelButton key={p.id} href={`/quest/${p.id}`} accent="gold">{p.name} →</PixelButton>)}
            <PixelButton href="/quests" accent="cyan">All projects →</PixelButton>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 border-t-2 border-[#cdbfa0] pt-4">
            <PixelButton href="/contact" accent="rose">Get in touch →</PixelButton>
            <PixelButton href="/" accent="wood">← Back to the map</PixelButton>
          </div>
        </Panel>
      </div>
    </PixelShell>
  );
}
