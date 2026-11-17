"use client";
import Link from "next/link";
import { identity } from "@/data/portfolio";
import { home } from "@/data/studio";
import { LocalTime, PAD, useScrollTo } from "../primitives";
import { Doodle, Note, Pen } from "../home/Pen";
import { KineticText } from "./Kinetic";

// ============================================================
// Contact — the black ending. Two lines that widen in opposite
// directions as they arrive, the email, the practical links.
// ============================================================
export default function ContactScene() {
  const scrollTo = useScrollTo();
  return (
    <section id="contact" data-nav="dark" aria-labelledby="contact-title" className="overflow-hidden bg-[#0a0a0a] text-white">
      <div className={`mx-auto max-w-[1440px] pb-8 pt-[clamp(6rem,13vw,11rem)] ${PAD}`}>
        <h2 id="contact-title" className="sr-only">Contact</h2>
        <KineticText as="p" from={75} to={125} drift="-10%" offset={["start end", "end 0.6"]}
          className="text-[clamp(3rem,10.5vw,11.5rem)] font-[600] leading-[0.88] tracking-[-0.06em]">
          Building
        </KineticText>
        <KineticText as="p" from={125} to={100} drift="12%" offset={["start end", "end 0.6"]}
          className="text-right text-[clamp(3rem,10.5vw,11.5rem)] font-[600] leading-[0.88] tracking-[-0.06em] text-white/45">
          something?
        </KineticText>

        <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-12 items-end gap-x-[clamp(1rem,3vw,3rem)] gap-y-10">
          <Doodle className="relative col-span-12 md:col-span-8" style={{ "--d": "0.25s" }}>
            <p className="mb-3 text-[14px] text-white/55">Let’s talk</p>
            <a href={`mailto:${identity.email}`} className="wide inline-block break-all text-[clamp(1.35rem,3.6vw,3.4rem)] font-[480] leading-tight tracking-[-0.04em] transition-opacity duration-300 hover:opacity-70">
              {identity.email}
            </a>
            <span className="relative block h-3.5 max-w-[min(100%,48rem)]">
              <Pen mark="underline" className="absolute inset-0 h-full w-full text-white/45" width={1.8} />
            </span>
            <Note r={-4} d="0.6s" className="mt-4 text-[clamp(1.1rem,1.5vw,1.35rem)] text-white/70">I reply within a day or two</Note>
          </Doodle>
          <ul className="col-span-12 space-y-2 text-[15px] md:col-span-4 md:text-right">
            <li><a href={`tel:${identity.phone.replace(/-/g, "")}`} className="ink-link">{identity.phone.replace("-", " ")}</a></li>
            <li><a href={identity.githubUrl} target="_blank" rel="noopener noreferrer" className="ink-link">GitHub</a></li>
            <li><Link href="/resume" className="ink-link">Résumé</Link> <span className="text-white/40">·</span> <a href="/Krishna-Mehta-Resume.pdf" className="ink-link">PDF</a></li>
          </ul>
        </div>

        <div className="mt-[clamp(4rem,8vw,6.5rem)] grid grid-cols-12 gap-x-[clamp(1rem,3vw,3rem)] gap-y-4 border-t border-white/10 pt-6 text-[13px] text-white/55">
          <p className="col-span-12 md:col-span-5">{home.contact.status}</p>
          <p className="col-span-6 md:col-span-3">Bharuch, India · <LocalTime /></p>
          <div className="col-span-6 flex justify-end gap-6 md:col-span-4">
            <Link href="/island" className="ink-link">The island</Link>
            <a href="#top" onClick={(e) => { if (scrollTo("#top")) e.preventDefault(); }} className="ink-link">Back to top</a>
          </div>
          <p className="col-span-12 pt-6 text-white/35">© 2026 Krishna Mehta. Designed and built in Bharuch, India.</p>
        </div>
      </div>
    </section>
  );
}
