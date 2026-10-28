"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Moon, Sun, Sunset, Clock, Star, Trophy, Volume2, VolumeX, Mail, X } from "lucide-react";
import IslandPanel from "./IslandPanel";
import { PLACES, NPCS, CAT } from "@/island/layout";
import { FACTS, QUESTS, STARS, loadProgress, saveProgress, questsDone } from "@/island/quests";

const MODES = [
  { id: "live", label: "Live", icon: Clock },
  { id: "day", label: "Day", icon: Sun, hour: 11 },
  { id: "golden", label: "Golden hour", icon: Sunset, hour: 17.3 },
  { id: "night", label: "Night", icon: Moon, hour: 22 },
];
const PLACE_ACCENT = { projects: "#D4A848", designer: "#E07B6B", builder: "#D4A848", engineer: "#4FD1C5", inn: "#6abe4f", portal: "#4FD1C5", welcome: "#111" };
const SOUND_KEY = "isl.sound";

function istClock() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
}
const readSound = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === "1";
  } catch {
    return false;
  }
};

const glass = "bg-white/80 backdrop-blur-xl ring-1 ring-black/[0.06] shadow-[0_8px_30px_-10px_rgba(10,20,30,0.35)]";

export default function Island() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const labels = useRef({});
  const tags = useRef({});
  const bubbleEl = useRef(null);
  const bubbleText = useRef(null);
  const joyBase = useRef(null);
  const joyKnob = useRef(null);
  const miniRef = useRef(null);
  const fadeRef = useRef(null);
  const toastT = useRef(0);
  const cardT = useRef(0);
  const progressRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [panel, setPanel] = useState(null);
  const [room, setRoom] = useState(null);
  const [mode, setMode] = useState(0);
  const [clock, setClock] = useState("");
  const [toast, setToast] = useState(null);
  const [card, setCard] = useState(null);
  const [touch, setTouch] = useState(false);
  const [help, setHelp] = useState(true);
  const [log, setLog] = useState(false);
  const [sound, setSound] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setTouch(matchMedia("(pointer: coarse)").matches);
    setClock(istClock());
    const p = loadProgress();
    progressRef.current = p;
    setProgress(p);
    setSound(readSound());
    const id = setInterval(() => setClock(istClock()), 20000);
    const h = setTimeout(() => setHelp(false), 16000);
    return () => (clearInterval(id), clearTimeout(h));
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 2600);
  }, []);
  const showCard = useCallback((c, ms = 6500) => {
    setCard(c);
    clearTimeout(cardT.current);
    cardT.current = setTimeout(() => setCard(null), ms);
  }, []);

  // quest progress from engine events
  const onEvent = useCallback((e) => {
    const prev = progressRef.current;
    if (!prev) return;
    const next = { ...prev, visited: [...prev.visited], stars: [...prev.stars], talked: [...prev.talked] };
    if (e.type === "visit" && !next.visited.includes(e.zone)) next.visited.push(e.zone);
    if (e.type === "talk" && !next.talked.includes(e.id)) next.talked.push(e.id);
    if (e.type === "pet") next.pet = true;
    if (e.type === "wish") next.wish = true;
    if (e.type === "star" && !next.stars.includes(e.id)) {
      next.stars.push(e.id);
      const n = next.stars.length;
      showCard({ kind: "fact", title: `Star ${n} of ${STARS.length}`, body: FACTS[(n - 1) % FACTS.length] });
    }
    if (!next.done && questsDone(next) === QUESTS.length) {
      next.done = true;
      setTimeout(() => {
        engineRef.current?.celebrate();
        showCard({ kind: "win", title: "Quest log complete!", body: "You've seen the whole island. Krishna would love to hear from you." }, 14000);
      }, 900);
    }
    progressRef.current = next;
    setProgress(next);
    saveProgress(next);
  }, [showCard]);

  useEffect(() => {
    if (!progress) return; // wait until saved progress is loaded so found stars stay hidden
    if (engineRef.current) return;
    let dead = false, eng = null;
    import("@/island/engine")
      .then(({ createIsland }) => {
        if (dead || !canvasRef.current) return;
        try {
          eng = createIsland({
            canvas: canvasRef.current,
            found: progressRef.current?.stars || [],
            overlay: {
              labels: labels.current,
              tags: tags.current,
              bubble: { el: bubbleEl.current, text: bubbleText.current },
              joy: { base: joyBase.current, knob: joyKnob.current },
              minimap: miniRef.current,
              fade: fadeRef.current,
            },
            onReady: () => setReady(true),
            onPrompt: (p) => setPrompt(p),
            onOpen: (zone, id) => setPanel({ zone, id }),
            onToast: showToast,
            onEvent,
            onInside: (r) => setRoom(r),
          });
          engineRef.current = eng;
          if (readSound()) eng.setSound(true);
        } catch (err) {
          console.error(err);
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
    return () => {
      dead = true;
      eng?.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress === null]);

  // browsers start audio suspended until a gesture — resume on the first one
  useEffect(() => {
    if (!sound) return;
    const wake = () => engineRef.current?.setSound(true);
    addEventListener("pointerdown", wake, { once: true });
    addEventListener("keydown", wake, { once: true });
    return () => {
      removeEventListener("pointerdown", wake);
      removeEventListener("keydown", wake);
    };
  }, [sound]);

  // Q toggles the quest log
  useEffect(() => {
    const k = (e) => {
      if (e.code === "KeyQ" && !panel && !/^(INPUT|TEXTAREA)$/.test(e.target?.tagName)) setLog((v) => !v);
      if (e.code === "Escape" && log) setLog(false);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [panel, log]);

  const closePanel = useCallback(() => {
    setPanel(null);
    engineRef.current?.resume();
    canvasRef.current?.focus();
  }, []);

  const cycleMode = () => {
    const next = (mode + 1) % MODES.length;
    setMode(next);
    engineRef.current?.setHour(MODES[next].hour ?? null);
  };
  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    engineRef.current?.setSound(v);
    try {
      localStorage.setItem(SOUND_KEY, v ? "1" : "0");
    } catch {
      /* optional */
    }
  };
  const M = MODES[mode], MIcon = M.icon;
  const done = progress ? questsDone(progress) : 0;

  return (
    <div className="isl fixed inset-0 select-none overflow-hidden bg-[#cfe8fb] text-[#111]" style={{ fontFamily: "var(--font-studio), ui-sans-serif, system-ui, sans-serif" }}>
      <h1 className="sr-only">Krishna Mehta — The Island, an explorable 3D portfolio</h1>
      <canvas ref={canvasRef} tabIndex={0} aria-label="Krishna's Island, an explorable 3D portfolio" className="absolute inset-0 h-full w-full touch-none outline-none" />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(8,20,30,0.28))" }} />

      {/* world-space overlays (positioned every frame by the engine) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PLACES.map((p) => (
          <div key={p.id} ref={(el) => (labels.current[p.id] = el)} className="isl-plate absolute left-0 top-0 opacity-0" data-active="0">
            <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white/90 py-1.5 pl-2.5 pr-3.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.4)] ring-1 ring-black/5 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: PLACE_ACCENT[p.zone] }} />
              <span className="text-[13px] font-semibold leading-none text-[#111]">{p.name}</span>
              <span className="hidden text-[12px] leading-none text-[#777] sm:inline">{p.sub}</span>
            </span>
            <span className="mx-auto mt-1 block h-2 w-2 rotate-45 rounded-[2px] bg-white/90" />
          </div>
        ))}
        {[...NPCS, { id: "cat", name: CAT.name }].map((n) => (
          <div key={n.id} ref={(el) => (tags.current[n.id] = el)} className="absolute left-0 top-0 opacity-0">
            <span className="whitespace-nowrap rounded-full bg-[#111]/75 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur">{n.name}</span>
          </div>
        ))}
        <div ref={bubbleEl} className="absolute left-0 top-0 opacity-0 transition-opacity duration-150">
          <div className="relative max-w-[250px] rounded-2xl bg-white px-4 py-3 text-[14px] leading-snug text-[#222] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]">
            <span ref={bubbleText} />
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[3px] bg-white" />
          </div>
        </div>
        <div ref={joyBase} className="absolute left-0 top-0 h-28 w-28 rounded-full opacity-0 ring-2 ring-white/70" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(2px)" }}>
          <div ref={joyKnob} className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 rounded-full bg-white/90 shadow-lg" />
        </div>
      </div>

      {/* door fade */}
      <div ref={fadeRef} aria-hidden className="pointer-events-none absolute inset-0 bg-[#15110e] opacity-0 transition-opacity duration-300" />

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto flex flex-col items-start gap-2.5">
          <div className={`flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 ${glass}`}>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#111] text-[13px] font-bold text-white">K</span>
            <span className="leading-tight">
              <span className="block text-[14px] font-semibold tracking-[-0.01em]">{room ? room.title : "Krishna's Island"}</span>
              <span className="block text-[11px] text-[#6b6b6b]">{room ? "Inside" : "Explore the work"}</span>
            </span>
          </div>
          {progress && (
            <button type="button" onClick={() => setLog((v) => !v)} aria-expanded={log} className={`flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium ${glass}`}>
              <Trophy className="h-4 w-4 text-[#b8892c]" />
              Quests <span className="tabular-nums text-[#6b6b6b]">{done}/{QUESTS.length}</span>
            </button>
          )}
          {room && (
            <button type="button" onClick={() => engineRef.current?.exit()} className={`flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium ${glass}`}>
              <ArrowLeft className="h-4 w-4" /> Back outside
            </button>
          )}
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleSound} className={`grid h-10 w-10 place-items-center rounded-full ${glass}`} aria-label={sound ? "Turn sound off" : "Turn sound on"} aria-pressed={sound}>
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-[#777]" />}
            </button>
            <button type="button" onClick={cycleMode} className={`flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium ${glass}`} aria-label={`Time of day: ${M.label}. Change`}>
              <MIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{M.id === "live" ? `Live · ${clock} IST` : M.label}</span>
            </button>
            <Link href="/world" className={`hidden h-10 items-center rounded-full px-4 text-[13px] font-medium md:flex ${glass}`}>Pixel world</Link>
            <Link href="/" className="flex h-10 items-center gap-1.5 rounded-full bg-[#111] px-4 text-[13px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]">
              <span className="hidden sm:inline">Skip to studio site</span>
              <span className="sm:hidden">Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <canvas ref={miniRef} width={240} height={240} aria-hidden className={`h-[92px] w-[92px] rounded-full ring-[3px] ring-white/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-opacity duration-300 sm:h-[120px] sm:w-[120px] ${room ? "opacity-0" : "opacity-100"}`} />
        </div>
      </div>

      {/* quest log */}
      {log && progress && (
        <div className={`isl-rise pointer-events-auto absolute left-3 top-[118px] w-[min(320px,calc(100vw-24px))] rounded-3xl p-4 sm:left-5 sm:top-[132px] ${glass}`}>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#777]">Quest log</span>
            <button type="button" onClick={() => setLog(false)} aria-label="Close quest log" className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
          </div>
          <ul className="mt-2 grid gap-2.5">
            {QUESTS.map((q) => {
              const v = Math.min(q.get(progress), q.total), ok = v >= q.total;
              return (
                <li key={q.id}>
                  <div className="flex items-center justify-between gap-3 text-[14px]">
                    <span className={ok ? "text-[#2f8a4f]" : "text-[#222]"}>{q.label}</span>
                    <span className="tabular-nums text-[12px] text-[#777]">{v}/{q.total}</span>
                  </div>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
                    <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${(v / q.total) * 100}%`, background: ok ? "#4caf6e" : "#d4a848" }} />
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[12px] leading-snug text-[#777]">Stars glow at night. Two are hidden indoors.</p>
        </div>
      )}

      {/* toast + fact cards */}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-[84px] flex flex-col items-center gap-2 px-4 sm:top-6">
        {toast && <span className={`isl-rise rounded-full px-4 py-2 text-[14px] font-medium ${glass}`}>{toast}</span>}
        {card && (
          <div className={`isl-rise pointer-events-auto flex w-[min(380px,calc(100vw-32px))] gap-3 rounded-3xl p-4 ${glass}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl" style={{ background: card.kind === "win" ? "#111" : "#fff4d6" }}>
              {card.kind === "win" ? <Trophy className="h-5 w-5 text-[#ffd65a]" /> : <Star className="h-5 w-5 fill-[#f2b72f] text-[#d99a12]" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8a7a55]">{card.title}</p>
              <p className="mt-0.5 text-[15px] leading-snug text-[#222]">{card.body}</p>
              {card.kind === "win" && (
                <a href="mailto:krishna200428@gmail.com" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3.5 py-2 text-[13px] font-semibold text-white">
                  <Mail className="h-4 w-4" /> Email Krishna
                </a>
              )}
            </div>
            <button type="button" onClick={() => setCard(null)} aria-label="Dismiss" className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>

      {/* interaction prompt */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center px-4" aria-live="polite">
        {prompt && !panel && (
          <button type="button" onClick={() => engineRef.current?.interact()} className="isl-rise pointer-events-auto flex items-center gap-3 rounded-full bg-[#111]/90 py-2 pl-2 pr-5 text-white shadow-[0_14px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <span className="grid h-9 min-w-9 place-items-center rounded-full bg-white px-2 text-[14px] font-bold text-[#111]">{touch ? "Tap" : "E"}</span>
            <span className="text-[15px] font-medium">
              {prompt.verb} <span className="font-semibold">{prompt.name}</span>
            </span>
          </button>
        )}
      </div>

      {/* controls help (desktop) */}
      {!touch && ready && (
        <div className="pointer-events-auto absolute bottom-5 left-5 hidden sm:block">
          {help ? (
            <div className={`isl-rise w-[248px] rounded-3xl p-4 ${glass}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#777]">Controls</span>
                <button type="button" onClick={() => setHelp(false)} className="text-[12px] text-[#777] hover:text-[#111]">Hide</button>
              </div>
              <ul className="mt-2.5 grid gap-2 text-[13px] text-[#333]">
                {[["W A S D", "Move"], ["Shift", "Run"], ["Space", "Jump"], ["E", "Talk · go in"], ["Q", "Quest log"], ["Scroll", "Zoom"], ["Click", "Walk there"]].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-3">
                    <span className="flex gap-1">{k.split(" ").map((c) => <kbd key={c} className="min-w-[24px] rounded-md bg-white px-1.5 py-0.5 text-center text-[12px] font-semibold shadow-[0_1px_0_1px_rgba(0,0,0,0.12)]">{c}</kbd>)}</span>
                    <span className="text-[#666]">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <button type="button" onClick={() => setHelp(true)} className={`grid h-10 w-10 place-items-center rounded-full text-[15px] font-semibold ${glass}`} aria-label="Show controls">?</button>
          )}
        </div>
      )}

      {/* touch: jump button */}
      {touch && ready && (
        <button type="button" onClick={() => engineRef.current?.jump()} aria-label="Jump" className={`absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 grid h-16 w-16 place-items-center rounded-full text-[13px] font-semibold ${glass}`}>
          Jump
        </button>
      )}
      {touch && ready && !prompt && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[max(1.6rem,env(safe-area-inset-bottom))] flex justify-center">
          <span className="rounded-full bg-black/35 px-3 py-1.5 text-[12px] text-white backdrop-blur">Drag to move · tap a place to go</span>
        </div>
      )}

      {/* loader */}
      <div className={`pointer-events-none absolute inset-0 grid place-items-center bg-white transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#111] text-[18px] font-bold text-white">K</span>
          <p className="mt-4 text-[18px] font-semibold tracking-[-0.01em]">Krishna&apos;s Island</p>
          <p className="mt-1 text-[14px] text-[#777]">{failed ? "Your browser couldn't start 3D. Try the studio site instead." : "Building the island…"}</p>
          {failed ? (
            <Link href="/" className="pointer-events-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#111] px-4 py-2.5 text-[14px] font-semibold text-white">Studio site <ArrowRight className="h-4 w-4" /></Link>
          ) : (
            <span className="isl-bar mx-auto mt-5 block h-1 w-40 overflow-hidden rounded-full bg-black/[0.07]"><span className="block h-full w-1/3 rounded-full bg-[#111]" /></span>
          )}
        </div>
      </div>

      {panel && <IslandPanel zone={panel.zone} id={panel.id} onClose={closePanel} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .isl-plate[data-active="1"] > span:first-child { background: #111; }
        .isl-plate[data-active="1"] > span:first-child span:nth-child(2) { color: #fff; }
        .isl-plate[data-active="1"] > span:first-child span:nth-child(3) { color: rgba(255,255,255,0.7); }
        .isl-plate[data-active="1"] > span:last-child { background: #111; }
        @keyframes islRise { from { opacity: 0; transform: translateY(10px) scale(0.98) } to { opacity: 1; transform: none } }
        .isl-rise { animation: islRise .32s cubic-bezier(.2,.9,.3,1) both }
        @keyframes islFade { from { opacity: 0 } to { opacity: 1 } }
        .isl-fade { animation: islFade .2s ease-out both }
        @keyframes islBar { from { transform: translateX(-100%) } to { transform: translateX(300%) } }
        .isl-bar > span { animation: islBar 1.1s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .isl-rise, .isl-fade, .isl-bar > span { animation: none } }
      ` }} />
    </div>
  );
}
