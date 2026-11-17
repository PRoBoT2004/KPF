"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { home, scenes } from "@/data/studio";
import { PAD, useReduceAfterMount } from "../primitives";
import { Doodle, Note, Pen } from "../home/Pen";

// ============================================================
// About — the photos stay put while the paragraph inks itself in,
// word by word, as you read down the page.
// ============================================================
export default function AboutScene() {
  const a = home.about;
  const words = scenes.about.split(" ");
  const para = useRef(null);
  const reduce = useReduceAfterMount();
  const { scrollYProgress } = useScroll({ target: para, offset: ["start 0.82", "end 0.42"] });

  return (
    <section id="about" data-nav="light" aria-labelledby="about-title" className="border-t border-[var(--line-2)]">
      <div className={`mx-auto grid max-w-[1440px] grid-cols-12 gap-x-[clamp(1rem,3vw,3rem)] gap-y-14 py-[clamp(5.5rem,11vw,10rem)] ${PAD}`}>
        {/* photos (sticky on wide screens) */}
        <div className="col-span-12 md:col-span-5">
          <Doodle className="relative mx-auto w-full max-w-[440px] md:sticky md:top-[16svh]">
            <div className="relative ml-auto aspect-[5/6] w-[84%]">
              <figure className="print absolute right-0 top-0 w-[56%]" style={{ "--tilt": "5deg" }}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e4dc]">
                  <Image src="/assets/work/k4.webp" alt="Krishna by a lake, leaning on a railing" fill sizes="(min-width: 768px) 18vw, 40vw" className="object-cover object-[50%_18%]" />
                </div>
              </figure>
              <figure className="print absolute bottom-0 left-0 w-[72%]" style={{ "--tilt": "-3deg" }}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#efe2d3]">
                  <Image src="/assets/work/profile.webp" alt="Krishna standing on a bridge at sunset" fill sizes="(min-width: 768px) 26vw, 60vw" className="object-cover object-[50%_88%]" />
                </div>
              </figure>
            </div>
            <div className="pointer-events-none absolute left-[1%] top-[2%] z-10 flex flex-col items-start text-[var(--ink-2)]" style={{ "--d": "0.4s" }}>
              <Note r={-6} d="0.4s" className="text-[clamp(1.3rem,1.8vw,1.65rem)]">that’s me</Note>
              <Pen mark="arrowDown" className="ml-[2.2rem] mt-1 h-[clamp(2.6rem,4vw,3.6rem)] w-auto -scale-x-100" />
            </div>
          </Doodle>
        </div>

        {/* words */}
        <div className="col-span-12 md:col-span-7">
          <h2 id="about-title" className="text-[14px] text-[var(--mute)]">About</h2>
          <p ref={para} className="mt-6 text-[clamp(1.65rem,3.1vw,3rem)] font-[480] leading-[1.18] tracking-[-0.04em]">
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={reduce}>{w}</Word>
            ))}
          </p>
          <p className="mt-10 max-w-[54ch] border-l-2 border-[var(--ink)] pl-5 text-[clamp(1rem,1.2vw,1.12rem)] leading-[1.6] text-[var(--ink-2)]">
            My favourite moment so far: a wholesaler telling me he’d actually use Vitran, because nobody could quietly edit an invoice after the fact.
          </p>

          <dl className="mt-[clamp(3rem,5vw,4.5rem)] border-t border-[var(--line-2)]">
            {a.timeline.map((t) => (
              <div key={t.org} className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-[var(--line-2)] py-4 text-[15px] md:grid-cols-[11.5rem_1fr_auto]">
                <dt className="font-[600]">{t.org}</dt>
                <dd className="col-span-2 row-start-2 text-[var(--mute)] md:col-span-1 md:row-start-auto">{t.role}</dd>
                <dd className="tnum col-start-2 row-start-1 whitespace-nowrap text-[var(--mute)] md:col-start-auto md:row-start-auto">{t.when}</dd>
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

function Word({ children, progress, range, reduce }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <><motion.span style={reduce ? undefined : { opacity }}>{children}</motion.span>{" "}</>;
}
