import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SLIDES } from "./slides";
import { MagicScene } from "./MagicScene";

const ACTS = [
  { key: "A1", short: "problem", full: "problem.magic-numbers" },
  { key: "A2", short: "language", full: "language.meaning" },
  { key: "A3", short: "case-study", full: "case-study.transfer" },
  { key: "A4", short: "pattern", full: "pattern.template" },
  { key: "A5", short: "action", full: "action.one-promise" },
];

/* ── BroadcastChannel helper ── */
function useChannel() {
  return useMemo(() => {
    try {
      return new BroadcastChannel("deck-remote");
    } catch {
      return null;
    }
  }, []);
}

/* ── Main Deck ── */
function Deck() {
  const [index, setIndex] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(0);
  const ch = useChannel();

  const next = useCallback(() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const jump = useCallback((i: number) => setIndex(Math.max(0, Math.min(SLIDES.length - 1, i))), []);

  /* broadcast slide changes */
  useEffect(() => {
    ch?.postMessage({ type: "slide", index, total: SLIDES.length, note: SLIDES[index].note, title: SLIDES[index].title });
  }, [index, ch]);

  /* listen for remote commands */
  useEffect(() => {
    if (!ch) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "next") next();
      else if (e.data?.type === "prev") prev();
      else if (e.data?.type === "jump" && typeof e.data.index === "number") jump(e.data.index);
    };
    ch.addEventListener("message", handler);
    return () => ch.removeEventListener("message", handler);
  }, [ch, next, prev, jump]);

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
        if (!atBottom) return;
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
      <div className="neon-mesh absolute inset-0 -z-20" />
      <MagicScene active={index} />
      <main key={index} ref={scrollRef} className="slide-in absolute inset-0 z-10 overflow-y-auto overscroll-contain">
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

/* ── Remote Control ── */
function Remote() {
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState(SLIDES[0].note);
  const [title, setTitle] = useState(SLIDES[0].title);
  const [connected, setConnected] = useState(false);
  const ch = useChannel();
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* listen for slide updates from deck */
  useEffect(() => {
    if (!ch) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "slide") {
        setIndex(e.data.index);
        setNote(e.data.note);
        setTitle(e.data.title);
        setConnected(true);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setConnected(false), 3000);
      }
    };
    ch.addEventListener("message", handler);
    return () => ch.removeEventListener("message", handler);
  }, [ch]);

  const sendNext = useCallback(() => ch?.postMessage({ type: "next" }), [ch]);
  const sendPrev = useCallback(() => ch?.postMessage({ type: "prev" }), [ch]);
  const sendJump = useCallback((i: number) => ch?.postMessage({ type: "jump", index: i }), [ch]);

  const total = SLIDES.length;
  const pct = ((index + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-[#06070c] text-white p-6 sm:p-10">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">🎛️ Remote Control</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-mono ${connected ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"}`}>
          {connected ? "● connected" : "○ waiting…"}
        </span>
      </div>

      {/* slide counter + nav */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-6 mb-4">
          <button onClick={sendPrev} disabled={index === 0}
            className="glass flex h-16 w-16 items-center justify-center rounded-full text-3xl transition enabled:hover:bg-white/10 disabled:opacity-30">
            ←
          </button>
          <div className="flex-1 text-center">
            <div className="text-6xl font-black font-mono">{String(index + 1).padStart(2, "0")}</div>
            <div className="text-xl text-white/50 mt-1">of {total}</div>
          </div>
          <button onClick={sendNext} disabled={index === total - 1}
            className="glass flex h-16 w-16 items-center justify-center rounded-full text-3xl transition enabled:hover:bg-white/10 disabled:opacity-30">
            →
          </button>
        </div>
        {/* progress bar */}
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* current slide title */}
      <div className="glass rounded-2xl p-5 mb-6">
        <div className="text-sm uppercase tracking-wider text-white/50 mb-2">Current Slide</div>
        <div className="text-2xl font-bold">{title}</div>
      </div>

      {/* speaker notes / cheat sheet */}
      <div className="glass rounded-2xl p-5 mb-6">
        <div className="text-sm uppercase tracking-wider text-white/50 mb-3">📝 Speaker Notes</div>
        <p className="text-xl leading-relaxed text-white/90">{note}</p>
      </div>

      {/* quick jump grid */}
      <div className="glass rounded-2xl p-5">
        <div className="text-sm uppercase tracking-wider text-white/50 mb-3">Jump to Slide</div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => sendJump(i)}
              className={`rounded-lg py-2 text-sm font-mono transition ${
                i === index
                  ? "bg-white/25 text-white ring-1 ring-white/50"
                  : "bg-white/5 text-white/50 hover:bg-white/15 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* all notes cheat sheet */}
      <div className="mt-8">
        <div className="text-sm uppercase tracking-wider text-white/50 mb-3">📋 All Notes Cheat Sheet</div>
        <div className="space-y-3">
          {SLIDES.map((s, i) => (
            <div key={s.id} className={`glass rounded-xl p-4 transition ${i === index ? "ring-1 ring-cyan-400/50" : "opacity-60"}`}>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm text-white/50">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-bold text-white">{s.title}</span>
              </div>
              <p className="text-sm text-white/70 ml-8">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Router ── */
export default function App() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isRemote = params?.get("remote") === "control";

  return isRemote ? <Remote /> : <Deck />;
}
