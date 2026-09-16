import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "./slides";
import { MagicScene } from "./MagicScene";

const ACTS = [
  { key: "A1", short: "problem", full: "problem.magic-numbers" },
  { key: "A2", short: "language", full: "language.meaning" },
  { key: "A3", short: "case-study", full: "case-study.transfer" },
  { key: "A4", short: "pattern", full: "pattern.template" },
  { key: "A5", short: "action", full: "action.one-promise" },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(0);

  const next = useCallback(() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const jump = useCallback((i: number) => setIndex(Math.max(0, Math.min(SLIDES.length - 1, i))), []);

  /* fullscreen state */
  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (rootRef.current) {
      void rootRef.current.requestFullscreen();
    }
  }, []);

  /* keyboard nav */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, toggleFullscreen]);

  /* wheel: scroll inside current slide first, switch at edges */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - wheelLock.current < 350) return;
      const el = scrollRef.current;
      if (!el) return;
      const atTop = el.scrollTop <= 2;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 2;
      if (e.deltaY > 0) {
        if (!atBottom) return; // let inner scroll
        e.preventDefault();
        wheelLock.current = now;
        next();
      } else if (e.deltaY < 0) {
        if (!atTop) return;
        e.preventDefault();
        wheelLock.current = now;
        prev();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const slide = SLIDES[index];
  const actFirst = ACTS.map((a) => SLIDES.findIndex((s) => s.act === a.key));
  const progress = ((index + 1) / SLIDES.length) * 100;

  return (
    <div ref={rootRef} className="fixed inset-0 overflow-hidden">
      {/* ambient neutral gradient */}
      <div className="neon-mesh absolute inset-0 -z-20" />
      {/* 3D scene — transitions to a fresh seeded pose per slide */}
      <MagicScene active={index} />

      {/* current slide */}
      <main
        key={index}
        ref={scrollRef}
        className="slide-in absolute inset-0 z-10 overflow-y-auto overscroll-contain"
      >
        {slide.body}
      </main>

      {/* act dock */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <span className="glass pointer-events-auto rounded-full px-4 py-1.5 text-[18px] font-bold tracking-wide text-slate-200">
          💠 Goodbye Magic Numbers
        </span>
        <nav className="glass pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1">
          {ACTS.map((a, ai) => {
            const active = slide.act === a.key;
            return (
              <button
                key={a.key}
                onClick={() => jump(actFirst[ai])}
                title={a.full}
                className={`rounded-full px-3 py-1.5 font-mono text-[20px] transition sm:px-4 sm:text-[22px] ${
                  active ? "bg-white/20 text-white ring-1 ring-white/40" : "text-white/70 hover:text-slate-200"
                }`}
              >
                {a.short}
              </button>
            );
          })}
        </nav>
      </header>

      {/* progress */}
      <div className="absolute inset-x-0 bottom-0 z-40 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-slate-300/80 via-slate-200/70 to-white/80 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* prev / next */}
      <div className="absolute bottom-6 left-4 z-40 flex items-center gap-2 sm:left-6">
        <button
          onClick={prev}
          disabled={index === 0}
          className="glass flex h-14 w-14 items-center justify-center rounded-full text-slate-200 transition enabled:hover:bg-white/10 disabled:opacity-30"
          aria-label="Sebelumnya"
        >
          ←
        </button>
        <button
          onClick={next}
          disabled={index === SLIDES.length - 1}
          className="glass flex h-14 w-14 items-center justify-center rounded-full text-slate-200 transition enabled:hover:bg-white/10 disabled:opacity-30"
          aria-label="Berikutnya"
        >
          →
        </button>
        <span className="glass rounded-full px-4 py-1.5 font-mono text-[18px] text-white/70">
          {String(index + 1).padStart(2, "0")}/{SLIDES.length}
        </span>
      </div>

      {/* fullscreen toggle */}
      <div className="absolute bottom-6 right-4 z-40 sm:right-6">
        <button
          onClick={toggleFullscreen}
          title={isFs ? "Keluar fullscreen (F)" : "Fullscreen (F)"}
          className={`glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition ${
            isFs ? "text-white ring-1 ring-white/50" : "text-white/90 hover:text-white"
          }`}
          aria-label="Fullscreen"
        >
          {isFs ? "⤡" : "⛶"}
        </button>
      </div>
    </div>
  );
}
