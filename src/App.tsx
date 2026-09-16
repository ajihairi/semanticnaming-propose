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

/* ── helpers ── */
function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
}

function getHashIndex(): number | null {
  const m = window.location.hash.match(/#slide=(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function setHashIndex(i: number) {
  history.replaceState(null, "", `#slide=${i}`);
}

/* ── Main Deck ── */
function Deck() {
  const [index, setIndex] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(0);
  const lastHash = useRef(0);

  const goTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(clamped);
    setHashIndex(clamped);
  }, []);

  const next = useCallback(() => setIndex((i) => {
    const n = Math.min(SLIDES.length - 1, i + 1);
    setHashIndex(n);
    return n;
  }), []);

  const prev = useCallback(() => setIndex((i) => {
    const n = Math.max(0, i - 1);
    setHashIndex(n);
    return n;
  }), []);

  const jump = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(clamped);
    setHashIndex(clamped);
  }, []);

  /* poll hash for remote control */
  useEffect(() => {
    const poll = () => {
      const h = getHashIndex();
      if (h !== null && h !== lastHash.current) {
        lastHash.current = h;
        setIndex(h);
      }
    };
    const iv = setInterval(poll, 200);
    return () => clearInterval(iv);
  }, []);

  /* sync lastHash on local nav */
  useEffect(() => {
    lastHash.current = index;
  }, [index]);

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

  /* wheel */
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
        <button onClick={prev} disabled={index === 0}
          className="glass flex h-14 w-14 items-center justify-center rounded-full text-slate-200 transition enabled:hover:bg-white/10 disabled:opacity-30"
          aria-label="Sebelumnya">←</button>
        <button onClick={next} disabled={index === SLIDES.length - 1}
          className="glass flex h-14 w-14 items-center justify-center rounded-full text-slate-200 transition enabled:hover:bg-white/10 disabled:opacity-30"
          aria-label="Berikutnya">→</button>
        <span className="glass rounded-full px-4 py-1.5 font-mono text-[18px] text-white/70">
          {String(index + 1).padStart(2, "0")}/{SLIDES.length}
        </span>
      </div>

      {/* fullscreen toggle */}
      <div className="absolute bottom-6 right-4 z-40 sm:right-6">
        <button onClick={toggleFullscreen} title={isFs ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          className={`glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition ${isFs ? "text-white ring-1 ring-white/50" : "text-white/90 hover:text-white"}`}
          aria-label="Fullscreen">{isFs ? "⤡" : "⛶"}</button>
      </div>
    </div>
  );
}

/* ── Remote: Desktop (QR only) ── */
function RemoteDesktop() {
  const remoteUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?remote=control` : "";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=06070c&color=ffffff&data=${encodeURIComponent(remoteUrl)}`;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="neon-mesh absolute inset-0 -z-20" />
      <MagicScene active={0} />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-10 text-center">
        <span className="glass rounded-full px-4 py-1.5 text-[18px] font-bold tracking-wide text-white mb-8">
          🎛️ Remote Control
        </span>
        <div className="glass rounded-3xl p-10 flex flex-col items-center gap-6">
          <div className="text-xl text-white/60">Scan dari HP buat kontrol presentasi</div>
          <img src={qrSrc} alt="QR Remote" className="rounded-2xl" width={280} height={280} />
          <div className="text-sm text-white/40 font-mono max-w-[320px] break-all">{remoteUrl}</div>
          <button
            onClick={() => navigator.clipboard?.writeText(remoteUrl)}
            className="glass rounded-full px-6 py-2 text-base text-white/70 hover:text-white transition"
          >
            📋 Copy link
          </button>
          <div className="text-sm text-white/30 mt-2">
            Buka link di HP → kontrol slide dari sana
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Remote: Mobile (full control) ── */
function RemoteMobile() {
  const [index, setIndex] = useState(() => getHashIndex() ?? 0);
  const [note, setNote] = useState(SLIDES[getHashIndex() ?? 0]?.note ?? SLIDES[0].note);
  const [title, setTitle] = useState(SLIDES[getHashIndex() ?? 0]?.title ?? SLIDES[0].title);
  const pollRef = useRef(0);

  /* poll hash to stay in sync with main deck */
  useEffect(() => {
    const poll = () => {
      const h = getHashIndex();
      if (h !== null && h !== pollRef.current && h !== index) {
        pollRef.current = h;
        setIndex(h);
        setNote(SLIDES[h]?.note ?? "");
        setTitle(SLIDES[h]?.title ?? "");
      }
    };
    const iv = setInterval(poll, 300);
    return () => clearInterval(iv);
  }, [index]);

  const sendSlide = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(clamped);
    pollRef.current = clamped;
    setNote(SLIDES[clamped].note);
    setTitle(SLIDES[clamped].title);
    setHashIndex(clamped);
  }, []);

  const total = SLIDES.length;
  const pct = ((index + 1) / total) * 100;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="neon-mesh absolute inset-0 -z-20" />
      <MagicScene active={index} />
      <main className="relative z-10 min-h-screen overflow-y-auto p-5 text-white">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <span className="glass rounded-full px-3 py-1.5 text-[16px] font-bold text-white">
            🎛️ Remote
          </span>
          <span className="glass rounded-full px-3 py-1.5 text-[14px] font-mono text-emerald-300">
            ● live
          </span>
        </div>

        {/* slide counter + nav */}
        <div className="glass rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-4 mb-3">
            <button onClick={() => sendSlide(index - 1)} disabled={index === 0}
              className="glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition enabled:hover:bg-white/10 disabled:opacity-30">←</button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-black font-mono">{String(index + 1).padStart(2, "0")}</div>
              <div className="text-base text-white/50">of {total}</div>
            </div>
            <button onClick={() => sendSlide(index + 1)} disabled={index === total - 1}
              className="glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition enabled:hover:bg-white/10 disabled:opacity-30">→</button>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* current slide title */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-1">Current Slide</div>
          <div className="text-2xl font-bold">{title}</div>
        </div>

        {/* speaker notes */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">📝 Notes</div>
          <p className="text-lg leading-relaxed text-white/90">{note}</p>
        </div>

        {/* quick jump grid */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Jump</div>
          <div className="grid grid-cols-7 gap-1.5">
            {SLIDES.map((s, i) => (
              <button key={s.id} onClick={() => sendSlide(i)}
                className={`rounded-lg py-2 text-sm font-mono transition ${
                  i === index ? "bg-white/25 text-white ring-1 ring-white/50" : "bg-white/5 text-white/50 active:bg-white/20"
                }`}>{i + 1}</button>
            ))}
          </div>
        </div>

        {/* all notes */}
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">📋 All Notes</div>
          <div className="space-y-2">
            {SLIDES.map((s, i) => (
              <div key={s.id} className={`glass rounded-xl p-3 transition ${i === index ? "ring-1 ring-cyan-400/50" : "opacity-50"}`}
                onClick={() => sendSlide(i)}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-sm text-white/50">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-bold text-white">{s.title}</span>
                </div>
                <p className="text-sm text-white/70 ml-6">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Router ── */
export default function App() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isRemote = params?.get("remote") === "control";

  if (!isRemote) return <Deck />;
  return isMobile() ? <RemoteMobile /> : <RemoteDesktop />;
}
