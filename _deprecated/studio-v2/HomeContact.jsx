"use client";
import Link from "next/link";
import Image from "next/image";
import { identity } from "@/data/portfolio";
import { home } from "@/data/studio";
import { PAD, useScrollTo } from "../primitives";
import { Doodle, Note, Pen } from "./Pen";

// ============================================================
// Contact — the one black block on the page. Big email, the
// practical links, and a quiet door to the 3D island.
// ============================================================
export default function HomeContact() {
  const scrollTo = useScrollTo();
  const year = 2026;
  return (
    <section id="contact" data-nav="dark" aria-labelledby="contact-title" className="bg-[var(--dark)] text-[var(--on-dark)]">
      <div className={`mx-auto max-w-[1440px] pb-8 pt-[clamp(5rem,11vw,10rem)] ${PAD}`}>
        <h2 id="contact-title" className="wide text-[clamp(2.2rem,6.1vw,6.5rem)] font-[560] leading-[1.02] tracking-[-0.05em]">
          <span className="block">Building something?</span>
          <span className="block text-[var(--on-dark-mute)]">Let’s talk.</span>
        </h2>

        <Doodle className="relative mt-[clamp(2.25rem,4.5vw,3.75rem)] inline-block" style={{ "--d": "0.25s" }}>
          <a href={`mailto:${identity.email}`} className="wide break-all text-[clamp(1.2rem,2.7vw,2.6rem)] font-[460] leading-tight tracking-[-0.035em] transition-opacity duration-300 hover:opacity-70">
            {identity.email}
          </a>
          <Pen mark="underline" className="pointer-events-none absolute -bottom-3 left-0 h-3.5 w-full text-[var(--on-dark-mute)]" width={1.8} />
          <Note r={-5} d="0.6s" className="absolute right-0 top-full mt-6 whitespace-nowrap text-[clamp(1.05rem,1.4vw,1.3rem)] text-[#bdbdbd] lg:left-full lg:right-auto lg:top-[22%] lg:ml-10 lg:mt-0">
            I reply within a day or two
          </Note>
        </Doodle>

        <div className="mt-[clamp(4.5rem,8vw,7rem)] grid grid-cols-12 gap-x-[clamp(1rem,3vw,3rem)] gap-y-10 border-t border-[var(--dark-line)] pt-8">
          <p className="col-span-12 max-w-[40ch] text-[15px] leading-[1.55] text-[var(--on-dark-mute)] md:col-span-5">{home.contact.status}</p>
          <ul className="col-span-12 space-y-2 text-[15px] sm:col-span-5 md:col-span-3">
            <li><a href={`tel:${identity.phone.replace(/-/g, "")}`} className="ink-link">{identity.phone.replace("-", " ")}</a></li>
            <li><a href={identity.githubUrl} target="_blank" rel="noopener noreferrer" className="ink-link">GitHub</a></li>
            <li><Link href="/resume" className="ink-link">Résumé</Link></li>
            <li><a href="/Krishna-Mehta-Resume.pdf" className="ink-link">Résumé (PDF)</a></li>
          </ul>
          <Link href="/island" className="group col-span-12 flex items-start gap-4 sm:col-span-7 md:col-span-4">
            <span className="relative block aspect-[4/3] w-[clamp(5.5rem,9vw,8rem)] shrink-0 overflow-hidden rounded-[4px] bg-[#1a1a1a]">
              <Image src="/studio/art/island.webp" alt="" fill sizes="128px" className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
            </span>
            <span className="text-[15px] leading-[1.45]">
              <span className="block">Prefer to wander?</span>
              <span className="block text-[var(--on-dark-mute)]">Walk around the 3D island, where the work hangs on the walls.</span>
              <span className="mt-1.5 inline-flex items-center gap-1.5">Explore <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span></span>
            </span>
          </Link>
        </div>

        <div className="mt-[clamp(4rem,8vw,6.5rem)] flex flex-wrap items-baseline justify-between gap-4 text-[13px] text-[var(--on-dark-mute)]">
          <p>© {year} Krishna Mehta. Designed and built in Bharuch, India.</p>
          <div className="flex gap-6">
            <Link href="/world" className="ink-link">Pixel version</Link>
            <a href="#top" onClick={(e) => { if (scrollTo("#top")) e.preventDefault(); }} className="ink-link">Back to top</a>
          </div>
        </div>
      </div>
    </section>
  );
}
