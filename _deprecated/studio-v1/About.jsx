"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { about, identity } from "@/data/portfolio";
import { resume } from "@/data/resume";
import { toolsWall } from "@/data/studio";
import { EASE, Label, MaskLines, PAD, Reveal } from "./primitives";

function ExperienceRow({ job, open, onToggle }) {
  return (
    <li className="border-b border-[var(--line-2)]">
      <button type="button" onClick={onToggle} aria-expanded={open}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-12">
        <span className="md:col-span-6">
          <span className="block text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.04em]">{job.role}</span>
          <span className="block text-[14px] text-[var(--mute)]">{job.org}</span>
        </span>
        <span className="hidden text-[14px] text-[var(--mute)] tnum md:col-span-5 md:block">{job.dates}</span>
        <span className={`grid h-9 w-9 place-items-center justify-self-end rounded-full border transition-all duration-500 md:col-span-1 ${
          open ? "rotate-45 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-2)] group-hover:border-[var(--ink)]"}`} aria-hidden>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
            <p className="pb-2 text-[13px] text-[var(--mute)] tnum md:hidden">{job.dates}</p>
            <ul className="space-y-2.5 pb-6 md:ml-0 md:max-w-[70ch]">
              {job.points.map((pt) => (
                <li key={pt.slice(0, 32)} className="flex gap-3 text-[15px] leading-relaxed text-[var(--ink-2)]">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-[var(--ink)]" aria-hidden />{pt}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function About() {
  const [open, setOpen] = useState(0);
  const facts = [
    ["Based in", identity.location],
    ["Education", "B.Tech CSE, Parul University, 2025 · CGPA 7.9"],
    ["Languages", "English, Hindi, Gujarati"],
    ["Looking for", "Product-first teams of 10–150"],
  ];
  return (
    <section id="about" data-nav="light" aria-label="About" className={`scroll-mt-16 border-t border-[var(--line)] py-[clamp(5rem,10vw,9rem)] ${PAD}`}>
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-12 gap-x-4 gap-y-10">
          <Label n="06" className="col-span-12 md:col-span-3">About</Label>
          <div className="col-span-12 md:col-span-6 md:col-start-4">
            <MaskLines lines={["Hi, I'm Krishna."]} className="text-[clamp(3rem,7.4vw,7.4rem)] font-medium leading-[0.86] tracking-[-0.065em]" />
            <Reveal className="mt-[clamp(1.75rem,3vw,2.5rem)] space-y-5">
              <p className="text-[clamp(1.25rem,1.85vw,1.7rem)] font-medium leading-[1.2] tracking-[-0.025em]">{about.intro}</p>
              {about.body.map((b) => <p key={b.slice(0, 24)} className="max-w-[60ch] text-[16px] leading-relaxed text-[var(--ink-2)]">{b}</p>)}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="col-span-8 col-start-3 sm:col-span-6 sm:col-start-4 md:col-span-3 md:col-start-10">
            <figure className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--line)]">
                <Image src="/assets/work/profile.webp" alt="Krishna Mehta, standing by a railing at sunset" fill
                  sizes="(min-width: 768px) 25vw, 60vw" className="mono-img object-cover object-[50%_35%] group-hover:scale-[1.03]" />
              </div>
              <figcaption className="mt-2 flex justify-between text-[12.5px] uppercase text-[var(--mute)]">
                <span>Bharuch, Gujarat</span><span className="tnum">{identity.age}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <dl className="mt-[clamp(3.5rem,7vw,6rem)] grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k} className="border-t border-[var(--ink)] pt-3">
              <dt className="text-[12.5px] uppercase text-[var(--mute)]">{k}</dt>
              <dd className="mt-1.5 text-[15.5px] font-medium leading-snug">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[clamp(4.5rem,9vw,8rem)] grid grid-cols-12 gap-x-4 gap-y-6">
          <div className="col-span-12 md:col-span-3">
            <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-[0.95] tracking-[-0.05em]">Experience</h3>
            <p className="mt-3 max-w-[30ch] text-[14.5px] leading-snug text-[var(--mute)]">Co-owner of a product studio and UI/UX designer at an agency, side by side.</p>
          </div>
          <ul className="col-span-12 border-t border-[var(--ink)] md:col-span-9">
            {resume.experience.map((job, i) => (
              <ExperienceRow key={job.role + job.dates} job={job} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
            <li className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[var(--line-2)] py-5 md:grid-cols-12">
              <span className="md:col-span-6">
                <span className="block text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.04em]">{resume.education.degree}</span>
                <span className="block text-[14px] text-[var(--mute)]">{resume.education.school} · {resume.education.detail}</span>
              </span>
              <span className="hidden text-[14px] text-[var(--mute)] tnum md:col-span-5 md:block">{resume.education.dates}</span>
              <span className="w-9 md:col-span-1" />
            </li>
          </ul>
        </div>

        <div className="mt-[clamp(4.5rem,9vw,8rem)] grid grid-cols-12 gap-x-4 gap-y-6">
          <div className="col-span-12 md:col-span-3">
            <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-[0.95] tracking-[-0.05em]">Toolkit</h3>
            <p className="mt-3 max-w-[30ch] text-[14.5px] leading-snug text-[var(--mute)]">What I reach for, from first sketch to production.</p>
          </div>
          <ul className="col-span-12 grid grid-cols-3 border-l border-t border-[var(--line-2)] md:col-span-9 lg:grid-cols-7">
            {toolsWall.map((t) => (
              <li key={t} className="border-b border-r border-[var(--line-2)] px-4 py-5 text-[14.5px] font-medium transition-colors duration-300 hover:bg-[var(--ink)] hover:text-[var(--paper)]">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
