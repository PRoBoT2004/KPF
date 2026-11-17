"use client";
import { home } from "@/data/studio";
import { PAD } from "../primitives";

// ============================================================
// About — two short paragraphs and the three lines that matter.
// ============================================================
export default function HomeAbout() {
  const a = home.about;
  return (
    <section id="about" data-nav="light" aria-labelledby="about-title" className="border-t border-[var(--line-2)] py-[clamp(5rem,10vw,9rem)]">
      <div className={`mx-auto grid max-w-[1440px] grid-cols-12 gap-x-[clamp(1rem,3vw,3rem)] gap-y-10 ${PAD}`}>
        <h2 id="about-title" className="col-span-12 text-[14px] text-[var(--mute)] md:col-span-4">About</h2>
        <div className="col-span-12 md:col-span-8">
          <p className="max-w-[24ch] text-[clamp(1.6rem,2.8vw,2.7rem)] font-[480] leading-[1.15] tracking-[-0.04em]">{a.lead}</p>
          <p className="mt-[clamp(1.5rem,2.6vw,2.25rem)] max-w-[56ch] text-[clamp(1.02rem,1.2vw,1.15rem)] leading-[1.6] text-[var(--ink-2)]">
            Today I co-own PrimeDigitals, where we make software for shops and traders, and I lead UI/UX at UMM Digital. {a.body}
          </p>

          <dl className="mt-[clamp(2.75rem,5vw,4rem)] border-t border-[var(--line-2)]">
            {a.timeline.map((t) => (
              <div key={t.org} className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-[var(--line-2)] py-4 text-[15px] md:grid-cols-[11.5rem_1fr_auto]">
                <dt className="font-medium">{t.org}</dt>
                <dd className="col-span-2 row-start-2 text-[var(--mute)] md:col-span-1 md:row-start-auto">{t.role}</dd>
                <dd className="col-start-2 row-start-1 whitespace-nowrap text-[var(--mute)] tnum md:col-start-auto md:row-start-auto">{t.when}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid gap-1.5 text-[14.5px] leading-[1.55] text-[var(--mute)] sm:grid-cols-2 sm:gap-6">
            <p><span className="text-[var(--ink)]">Tools I reach for:</span> {a.tools}</p>
            <p><span className="text-[var(--ink)]">Languages:</span> {a.languages}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
