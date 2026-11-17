"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { identity } from "@/data/portfolio";
import { contact, worldPortal } from "@/data/studio";
import { Arrow, Label, LocalTime, MaskLines, PAD, Reveal, Roll, copyText, pill, useScrollTo } from "./primitives";

// ============================================================
// The pixel world — a quiet band on the white page
// ============================================================
export function WorldPortal() {
  return (
    <section aria-label="The island" data-nav="light" className={`border-t border-[var(--line)] py-[clamp(5rem,10vw,9rem)] ${PAD}`}>
      <div className="mx-auto grid max-w-[1920px] grid-cols-12 items-end gap-x-4 gap-y-10">
        <div className="col-span-12 md:col-span-5">
          <Label>Another way in</Label>
          <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.06em]">{worldPortal.title}</h2>
          <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-[var(--ink-2)]">{worldPortal.body}</p>
          <p className="mt-5 text-[12.5px] uppercase text-[var(--mute)]">{worldPortal.places.join(" · ")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/island" className={pill.dark}>
              <Roll>Explore the island</Roll><Arrow className="h-4 w-4" />
            </Link>
            <Link href="/world" className="text-[14px] text-[var(--mute)] underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:text-[var(--ink)]">
              or play the pixel version
            </Link>
          </div>
        </div>
        <Link href="/island" aria-label="Explore the island" tabIndex={-1}
          className="group col-span-12 block bg-[var(--dark)] p-[clamp(8px,0.9vw,14px)] md:col-span-7">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image src="/studio/art/island.webp" alt="" fill sizes="(min-width: 768px) 58vw, 100vw"
              className="mono-img object-cover group-hover:scale-[1.03]" />
          </div>
        </Link>
      </div>
    </section>
  );
}

// ============================================================
// Contact — the one black section
// ============================================================
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <a href={`mailto:${identity.email}`}
        className="text-[clamp(1.45rem,3.3vw,3.3rem)] font-medium leading-none tracking-[-0.045em] [overflow-wrap:anywhere] underline decoration-[#3A3A3A] decoration-1 underline-offset-[0.16em] transition-colors hover:decoration-[var(--on-dark)]">
        {identity.email}
      </a>
      <button type="button"
        onClick={() => copyText(identity.email).then((ok) => { if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); } })}
        className="rounded-full border border-[#3A3A3A] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--on-dark-mute)] transition-colors hover:border-[var(--on-dark)] hover:text-[var(--on-dark)]"
        aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function Contact() {
  const scrollTo = useScrollTo();
  const links = [
    { href: `tel:${identity.phone.replace(/-/g, "")}`, label: identity.phone },
    { href: identity.githubUrl, label: "GitHub", ext: true },
    { href: "/Krishna-Mehta-Resume.pdf", label: "Résumé (PDF)", ext: true },
    { href: "/island", label: "The island" },
  ];
  return (
    <section id="contact" data-nav="dark" aria-label="Contact"
      className="grid-rules relative overflow-hidden bg-[var(--dark)] pt-[clamp(6rem,12vw,10rem)] text-[var(--on-dark)]"
      style={{ "--rule": "rgba(255,255,255,0.06)" }}>
      <div className={`relative mx-auto max-w-[1920px] ${PAD}`}>
        <Label n="07" tone="dark">Contact</Label>
        <MaskLines lines={[contact.lines[0], { text: contact.lines[1], className: "text-[var(--on-dark-mute)]" }]} as="h2"
          className="mt-5 text-[clamp(3.2rem,10.4vw,10.4rem)] font-medium leading-[0.86] tracking-[-0.065em]" />

        <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-12 items-end gap-x-4 gap-y-10">
          <Reveal className="col-span-12 md:col-span-4">
            <p className="flex items-center gap-2 text-[12.5px] font-medium uppercase">
              <span className="pulse-dot h-2 w-2 rounded-full bg-[var(--on-dark)]" aria-hidden /> Currently available
            </p>
            <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed text-[var(--on-dark-mute)]">{contact.status}</p>
          </Reveal>
          <Reveal delay={0.08} className="col-span-12 md:col-span-7 md:col-start-6 md:justify-self-end md:text-right">
            <p className="mb-3 text-[12.5px] uppercase text-[var(--on-dark-mute)]">Write to me</p>
            <div className="md:flex md:justify-end"><CopyEmail /></div>
            <ul className="mt-4 flex flex-wrap gap-x-2 text-[14px] text-[var(--on-dark-mute)] md:justify-end">
              {links.map((l, i) => (
                <li key={l.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-[#3A3A3A]">|</span>}
                  <a href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="transition-colors hover:text-[var(--on-dark)]"><Roll>{l.label}</Roll></a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <footer className="mt-[clamp(4rem,8vw,7rem)] grid grid-cols-12 gap-x-4 gap-y-3 border-t border-[var(--dark-line)] pt-4 text-[12.5px] uppercase text-[var(--on-dark-mute)]">
          <p className="col-span-12 md:col-span-4">Bharuch · <LocalTime /> <span className="tnum">· 21.70° N, 72.99° E</span></p>
          <p className="col-span-6 md:col-span-4">© 2026 Krishna Mehta · Designed &amp; built by me</p>
          <p className="col-span-6 text-right md:col-span-4">
            <button type="button" onClick={() => scrollTo("#top", { duration: 2 })} className="uppercase transition-colors hover:text-[var(--on-dark)]">
              <Roll>Back to top ↑</Roll>
            </button>
          </p>
        </footer>
      </div>
      <p aria-hidden className={`mx-auto mt-[clamp(1.5rem,3vw,2.5rem)] max-w-[1920px] select-none overflow-hidden whitespace-nowrap pb-[clamp(0.5rem,1vw,1rem)] text-[15.8vw] font-medium leading-[0.8] md:text-[16.9vw] tracking-[-0.065em] min-[1920px]:text-[324px] ${PAD}`}>
        Krishna Mehta
      </p>
    </section>
  );
}
