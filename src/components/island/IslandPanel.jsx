"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, Copy, Mail, Phone, GitBranch, X, FileText, Download } from "lucide-react";
import { identity, classes, projects } from "@/data/portfolio";
import { resume } from "@/data/resume";

export const ZONE = {
  projects: { title: "Quest Hall", sub: "Shipped work", accent: "#D4A848" },
  designer: { title: "Designer's Studio", sub: "The design path", accent: "#E07B6B" },
  engineer: { title: "Engineer's Workshop", sub: "The engineering path", accent: "#4FD1C5" },
  builder: { title: "Builder's Forge", sub: "Recommended · design + engineering", accent: "#D4A848" },
  inn: { title: "The Inn", sub: "Say hello", accent: "#6abe4f" },
  portal: { title: "The Portal", sub: "Leave the island", accent: "#4FD1C5" },
  welcome: { title: "Welcome to the island", sub: "How to explore", accent: "#111111" },
  resume: { title: "Résumé", sub: "Product Designer & Engineer", accent: "#111111" },
};

const pick = (ids) => ids.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
const SIGNATURE = {
  designer: pick(["enda", "hazeberg", "meditrack", "vitran"]),
  engineer: pick(["shop-erp", "touchpe", "vitran", "trade-crm"]),
  builder: pick(["touchpe", "shop-erp", "trade-crm", "vitran"]),
};
const HALL = pick(["shop-erp", "touchpe", "vitran", "trade-crm", "hazeberg", "enda", "primedigitals", "patel-enterprise"]);

function Row({ p }) {
  return (
    <Link href={`/work/${p.id}`} className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-black/[0.04]">
      <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f0]">
        {p.cover && <Image src={p.cover} alt="" fill sizes="80px" className="object-cover" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-[#111]">{p.name}</span>
        <span className="block truncate text-[13px] text-[#6b6b6b]">{p.subtitle}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#9a9a9a] transition-transform group-hover:translate-x-0.5 group-hover:text-[#111]" />
    </Link>
  );
}

function CopyRow({ icon: Icon, label, value, href }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white px-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f4f4f2]"><Icon className="h-4 w-4 text-[#111]" /></span>
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a]">{label}</span>
        <span className="block truncate text-[15px] font-medium text-[#111]">{value}</span>
      </a>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value).then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1400);
          }).catch(() => {});
        }}
        aria-label={`Copy ${label}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#6b6b6b] transition-colors hover:bg-black/[0.05] hover:text-[#111]"
      >
        {done ? <Check className="h-4 w-4 text-[#2f9e5a]" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

const Btn = ({ href, children, dark, ext }) => {
  const cls = `inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-transform hover:-translate-y-px ${dark ? "bg-[#111] text-white" : "bg-[#f1f1ef] text-[#111]"}`;
  return ext ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
};

export default function IslandPanel({ zone, id, onClose }) {
  const ref = useRef(null);
  const proj = zone === "project" ? projects.find((p) => p.id === id) : null;
  const z = proj ? { title: proj.name, sub: proj.subtitle, accent: "#D4A848" } : ZONE[zone] ?? ZONE.welcome;
  useEffect(() => {
    ref.current?.focus();
    const k = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  const cls = classes[zone];

  return (
    <div className="isl-fade fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6" style={{ background: "rgba(10,18,26,0.28)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={z.title}
        onClick={(e) => e.stopPropagation()}
        style={{ outline: "none" }}
        className="isl-rise relative flex max-h-[86vh] w-full max-w-[34rem] flex-col overflow-hidden rounded-[28px] bg-white/95 shadow-[0_30px_80px_-20px_rgba(10,20,30,0.45)] outline-none ring-1 ring-black/5 backdrop-blur-xl"
      >
        <div className="flex items-start gap-3 px-6 pb-3 pt-6">
          <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: z.accent, boxShadow: `0 0 0 4px ${z.accent}22` }} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#111]">{z.title}</h2>
            <p className="mt-0.5 text-[14px] text-[#6b6b6b]">{z.sub}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1f1ef] text-[#111] transition-colors hover:bg-[#e6e6e3]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {proj && (
            <>
              <span className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-[#f2f2f0]">
                {proj.cover && <Image src={proj.cover} alt={`${proj.name} cover`} fill sizes="(max-width: 640px) 90vw, 500px" className="object-cover" />}
              </span>
              {proj.status && <p className="mt-4 text-[13px] font-medium text-[#8a7a55]">{proj.status}</p>}
              <p className="mt-2 text-[15px] leading-relaxed text-[#444]">{proj.blurb || proj.subtitle}</p>
              {proj.tech?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {proj.tech.map((t) => <li key={t} className="rounded-full bg-[#f2f2f0] px-2.5 py-1 text-[12px] text-[#444]">{t}</li>)}
                </ul>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <Btn href={`/work/${proj.id}`} dark>Read the case study <ArrowRight className="h-4 w-4" /></Btn>
                {proj.live && <Btn href={proj.live} ext>Visit live <ArrowUpRight className="h-4 w-4" /></Btn>}
              </div>
            </>
          )}

          {zone === "resume" && (
            <>
              <p className="text-[15px] leading-relaxed text-[#444]">{resume.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Btn href="/resume" dark>Open the résumé <ArrowRight className="h-4 w-4" /></Btn>
                <a href={resume.pdf} download className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f1ef] px-4 py-2.5 text-[14px] font-semibold text-[#111] transition-transform hover:-translate-y-px"><Download className="h-4 w-4" /> PDF</a>
              </div>
            </>
          )}

          {zone === "projects" && (
            <>
              <p className="text-[15px] leading-relaxed text-[#444]">Products and client work, each designed and built end to end. Open any one for the full case study.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {HALL.map((p) => (
                  <Link key={p.id} href={`/work/${p.id}`} className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
                    <span className="relative block aspect-[16/10] bg-[#f2f2f0]">
                      {p.cover && <Image src={p.cover} alt="" fill sizes="(max-width: 640px) 45vw, 260px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
                    </span>
                    <span className="block px-3 pb-3 pt-2.5">
                      <span className="block truncate text-[14px] font-semibold text-[#111]">{p.name}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#777]">{p.stat ? `${p.stat.value} ${p.stat.label}` : p.subtitle}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {cls && (
            <>
              <p className="text-[16px] leading-relaxed text-[#333]">{cls.bioLong}</p>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8a8a]">Signature work</p>
              <div className="mt-2 -mx-2">{SIGNATURE[zone].map((p) => <Row key={p.id} p={p} />)}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn href="/about" dark>About Krishna <ArrowRight className="h-4 w-4" /></Btn>
                <Btn href="/quests">All work</Btn>
              </div>
            </>
          )}

          {zone === "inn" && (
            <>
              <p className="text-[15px] leading-relaxed text-[#444]">{identity.statusLong}</p>
              <div className="mt-4 grid gap-2">
                <CopyRow icon={Mail} label="Email" value={identity.email} href={`mailto:${identity.email}`} />
                <CopyRow icon={Phone} label="Phone" value={identity.phone} href={`tel:${identity.phone.replace(/[^+\d]/g, "")}`} />
                <CopyRow icon={GitBranch} label="GitHub" value={identity.github} href={identity.githubUrl} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn href="/contact" dark>Write a message <ArrowRight className="h-4 w-4" /></Btn>
                <Btn href="/resume"><FileText className="h-4 w-4" /> Résumé</Btn>
              </div>
            </>
          )}

          {zone === "portal" && (
            <>
              <p className="text-[15px] leading-relaxed text-[#444]">The portal leads off the island to the studio site: the same work as a clean, fast portfolio. You can come back any time.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Btn href="/" dark>Go to the studio site <ArrowRight className="h-4 w-4" /></Btn>
                <Btn href="/world">Pixel world</Btn>
                <Btn href="/resume">Résumé</Btn>
              </div>
            </>
          )}

          {zone === "welcome" && (
            <>
              <p className="text-[15px] leading-relaxed text-[#444]">This is a small island where Krishna&apos;s work lives. Every building holds a part of the portfolio.</p>
              <ul className="mt-4 grid gap-2 text-[14px] text-[#333]">
                {[
                  ["Move", "WASD or arrow keys. Hold Shift to run, Space to jump."],
                  ["Interact", "Walk up to a door or a villager and press E."],
                  ["Touch", "Drag anywhere to steer, tap a place to walk there."],
                  ["Zoom", "Scroll, or pinch on a phone."],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-3 rounded-2xl bg-[#f6f6f4] px-3 py-2.5">
                    <span className="w-16 shrink-0 font-semibold text-[#111]">{k}</span>
                    <span className="text-[#555]">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8a8a]">Places</p>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-[14px]">
                {["projects", "builder", "designer", "engineer", "inn", "portal"].map((k) => (
                  <li key={k} className="flex items-center gap-2 rounded-xl border border-black/[0.06] px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: ZONE[k].accent }} />
                    <span className="truncate text-[#222]">{ZONE[k].title}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
