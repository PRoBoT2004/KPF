"use client";
// ============================================================
// Studio chrome — persists across "/" and "/work/[id]":
// Lenis smooth scroll, the nav (+ mobile menu) and a skip link.
// The nav flips to its dark variant over [data-nav="dark"] sections.
// ============================================================
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { identity } from "@/data/portfolio";
import { Arrow, EASE, LenisContext, PAD, Roll, useScrollTo } from "./primitives";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
];

export default function StudioChrome({ children }) {
  const lenisRef = useRef(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // ---- Lenis (desktop wheel/trackpad only — touch keeps native momentum scroll) ----
  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
    lenisRef.current = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, [reduce]);

  // reset to top on route change, or honor a #hash
  useEffect(() => {
    const hash = window.location.hash;
    const l = lenisRef.current;
    if (hash) {
      const go = () => {
        const el = document.querySelector(hash);
        if (!el) return;
        if (l) l.scrollTo(el, { immediate: true, force: true }); else el.scrollIntoView();
      };
      requestAnimationFrame(() => requestAnimationFrame(go));
    } else if (l) {
      l.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisRef}>
      <a href="#main"
        className="sr-only z-[90] rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-medium text-[var(--paper)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
    </LenisContext.Provider>
  );
}

// ------------------------------------------------------------
function Nav() {
  const pathname = usePathname();
  const scrollTo = useScrollTo();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  const probe = () => {
    const hit = document.elementsFromPoint(window.innerWidth / 2, 36).find((el) => el.closest?.("[data-nav]"));
    setDark(hit?.closest("[data-nav]")?.getAttribute("data-nav") === "dark");
  };

  useMotionValueEvent(scrollY, "change", (y) => {
    const dy = y - last.current;
    last.current = y;
    setSolid(y > 40);
    probe();
    if (open) return;
    if (y < 120) setHidden(false);
    else if (dy > 6) setHidden(true);
    else if (dy < -6) setHidden(false);
  });

  useEffect(() => { setOpen(false); probe(); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e, href) => {
    const hash = href.split("#")[1];
    if (pathname === "/" && hash) {
      e.preventDefault();
      setOpen(false);
      scrollTo("#" + hash);
      history.replaceState(null, "", "#" + hash);
    }
  };

  const onDark = dark && !open;
  const tone = onDark ? "text-[var(--on-dark)]" : "text-[var(--ink)]";
  const sub = onDark ? "text-[var(--on-dark-mute)]" : "text-[var(--mute)]";
  const bg = !solid || open ? "bg-transparent" : onDark ? "bg-[#0A0A0A]/80 backdrop-blur-md" : "bg-white/85 backdrop-blur-md";

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[75] transition-colors duration-500 ${bg}`}
      >
        <div className={`mx-auto grid max-w-[1920px] grid-cols-[1fr_auto] items-start gap-4 py-4 md:grid-cols-12 ${PAD} ${tone}`}>
          <Link href="/" onClick={(e) => go(e, "/#top")} className="col-span-1 leading-tight md:col-span-4">
            <span className="block text-[15px] font-semibold tracking-[-0.02em]">Krishna Mehta</span>
            <span className={`block text-[13px] ${sub}`}>Designer &amp; Engineer</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-start justify-end gap-[clamp(1.25rem,3.4vw,3.5rem)] pt-[2px] md:col-span-6 md:col-start-5 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={(e) => go(e, n.href)}
                className="text-[12.5px] font-medium uppercase tracking-[0.02em]">
                <Roll>{n.label}</Roll>
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 md:col-span-2">
            <Link href="/island"
              className={`hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-medium sm:inline-flex ${
                onDark ? "bg-[var(--on-dark)] text-[var(--ink)]" : "bg-[var(--ink)] text-[var(--paper)]"}`}>
              <Roll>The island</Roll><Arrow className="h-3.5 w-3.5" />
            </Link>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="studio-menu"
              className={`rounded-full border px-3.5 py-[7px] text-[12.5px] font-medium md:hidden ${onDark ? "border-[#3A3A3A]" : "border-[var(--ink)]"}`}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div id="studio-menu" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className={`fixed inset-0 z-[74] flex flex-col justify-between bg-[var(--paper)] pb-8 pt-28 text-[var(--ink)] md:hidden ${PAD}`} data-lenis-prevent>
            <nav aria-label="Mobile" className="flex flex-col border-t border-[var(--line)]">
              {[...NAV, { href: "/island", label: "The island" }].map((n, i) => (
                <motion.div key={n.href} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.05 }}>
                  <Link href={n.href} onClick={(e) => go(e, n.href)}
                    className="flex items-baseline justify-between border-b border-[var(--line)] py-4 text-[clamp(2.2rem,11vw,3.2rem)] font-medium leading-none tracking-[-0.045em]">
                    {n.label}
                    <span className="text-[12px] font-medium tracking-normal text-[var(--mute)] tnum">[ 0{i + 1} ]</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="space-y-1 text-[14px] text-[var(--mute)]">
              <a href={`mailto:${identity.email}`} className="block font-medium text-[var(--ink)]">{identity.email}</a>
              <p>{identity.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
