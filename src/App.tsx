import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { SLIDES } from "./slides";
import { MagicScene } from "./MagicScene";

const PEER_ID = "semantic-deck-main";
const ACTS = [
  { key: "A1", short: "problem", full: "problem.magic-numbers" },
  { key: "A2", short: "language", full: "language.meaning" },
  { key: "A3", short: "case-study", full: "case-study.transfer" },
  { key: "A4", short: "pattern", full: "pattern.template" },
  { key: "A5", short: "action", full: "action.one-promise" },
];

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
}

/* ── Main Deck ── */
function Deck() {
  const [index, setIndex] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(0);
  const peerRef = useRef<Peer | null>(null);

  const broadcast = useCallback((msg: any) => {
    const conns = peerRef.current?.connections;
    if (!conns) return;
    Object.values(conns).forEach((arr: any) => arr.forEach((c: any) => c.send(msg)));
  }, []);

  const setSlide = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(clamped);
    broadcast({ type: "slide", index: clamped, total: SLIDES.length });
  }, [broadcast]);

  const next = useCallback(() => setIndex((i) => {
    const n = Math.min(SLIDES.length - 1, i + 1);
    broadcast({ type: "slide", index: n, total: SLIDES.length });
    return n;
  }), [broadcast]);

  const prev = useCallback(() => setIndex((i) => {
    const n = Math.max(0, i - 1);
    broadcast({ type: "slide", index: n, total: SLIDES.length });
    return n;
  }), [broadcast]);

  /* PeerJS — accept remote connections */
  useEffect(() => {
    const peer = new Peer(PEER_ID);
    peerRef.current = peer;

    peer.on("connection", (conn) => {
      setRemoteConnected(true);
      // send current state on connect
      conn.send({ type: "slide", index, total: SLIDES.length });

      conn.on("data", (data: any) => {
        if (data?.type === "next") {
          setIndex((i) => {
            const n = Math.min(SLIDES.length - 1, i + 1);
            broadcast({ type: "slide", index: n, total: SLIDES.length });
            return n;
          });
        } else if (data?.type === "prev") {
          setIndex((i) => {
            const n = Math.max(0, i - 1);
            broadcast({ type: "slide", index: n, total: SLIDES.length });
            return n;
          });
        } else if (data?.type === "jump" && typeof data.index === "number") {
          const clamped = Math.max(0, Math.min(SLIDES.length - 1, data.index));
          setIndex(clamped);
          broadcast({ type: "slide", index: clamped, total: SLIDES.length });
        }
      });

      conn.on("close", () => setRemoteConnected(false));
    });

    peer.on("disconnected", () => setRemoteConnected(false));
    peer.on("error", () => setRemoteConnected(false));

    return () => { peer.destroy(); peerRef.current = null; };
  }, []);

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
        e.preventDefault(); next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault(); prev();
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
        e.preventDefault(); wheelLock.current = now; next();
      } else if (e.deltaY < 0) {
        if (!atTop) return;
        e.preventDefault(); wheelLock.current = now; prev();
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

      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <span className="glass pointer-events-auto rounded-full px-4 py-1.5 text-[18px] font-bold tracking-wide text-slate-200">
          💠 Goodbye Magic Numbers
        </span>
        <nav className="glass pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1">
          {ACTS.map((a, ai) => {
            const active = slide.act === a.key;
            return (
              <button key={a.key} onClick={() => setSlide(actFirst[ai])} title={a.full}
                className={`rounded-full px-3 py-1.5 font-mono text-[20px] transition sm:px-4 sm:text-[22px] ${active ? "bg-white/20 text-white ring-1 ring-white/40" : "text-white/70 hover:text-slate-200"}`}>
                {a.short}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="absolute inset-x-0 bottom-0 z-40 h-1 bg-white/5">
        <div className="h-full bg-gradient-to-r from-slate-300/80 via-slate-200/70 to-white/80 transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="absolute bottom-6 left-4 z-40 flex items-center gap-2 sm:left-6">
        <button onClick={prev} disabled={index === 0} className="glass flex h-14 w-14 items-center justify-center rounded-full text-slate-200 transition enabled:hover:bg-white/10 disabled:opacity-30">←</button>
        <button onClick={next} disabled={index === SLIDES.length - 1} className="glass flex h-14 w-14 items-center justify-center rounded-full text-slate-200 transition enabled:hover:bg-white/10 disabled:opacity-30">→</button>
        <span className="glass rounded-full px-4 py-1.5 font-mono text-[18px] text-white/70">{String(index + 1).padStart(2, "0")}/{SLIDES.length}</span>
        {remoteConnected && <span className="glass rounded-full px-3 py-1.5 text-[14px] text-emerald-300">● remote</span>}
      </div>

      <div className="absolute bottom-6 right-4 z-40 sm:right-6">
        <button onClick={toggleFullscreen} className={`glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition ${isFs ? "text-white ring-1 ring-white/50" : "text-white/90 hover:text-white"}`}>
          {isFs ? "⤡" : "⛶"}
        </button>
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
        <span className="glass rounded-full px-4 py-1.5 text-[18px] font-bold tracking-wide text-white mb-8">🎛️ Remote Control</span>
        <div className="glass rounded-3xl p-10 flex flex-col items-center gap-6">
          <div className="text-xl text-white/60">Scan dari HP buat kontrol presentasi</div>
          <img src={qrSrc} alt="QR Remote" className="rounded-2xl" width={280} height={280} />
          <div className="text-sm text-white/40 font-mono max-w-[320px] break-all">{remoteUrl}</div>
          <button onClick={() => navigator.clipboard?.writeText(remoteUrl)} className="glass rounded-full px-6 py-2 text-base text-white/70 hover:text-white transition">📋 Copy link</button>
          <div className="text-sm text-white/30 mt-2">Buka link di HP → kontrol slide dari sana</div>
        </div>
      </main>
    </div>
  );
}

/* ── Remote: Mobile (full control via PeerJS) ── */
function RemoteMobile() {
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(SLIDES.length);
  const [note, setNote] = useState(SLIDES[0].note);
  const [title, setTitle] = useState(SLIDES[0].title);
  const [connected, setConnected] = useState(false);
  const connRef = useRef<any>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", () => {
      const conn = peer.connect(PEER_ID, { reliable: true });
      connRef.current = conn;

      conn.on("open", () => setConnected(true));

      conn.on("data", (data: any) => {
        if (data?.type === "slide") {
          setIndex(data.index);
          setTotal(data.total);
          setNote(SLIDES[data.index]?.note ?? "");
          setTitle(SLIDES[data.index]?.title ?? "");
        }
      });

      conn.on("close", () => setConnected(false));
      conn.on("error", () => setConnected(false));
    });

    peer.on("disconnected", () => setConnected(false));
    peer.on("error", () => setConnected(false));

    return () => { peer.destroy(); peerRef.current = null; };
  }, []);

  const send = useCallback((msg: any) => {
    if (connRef.current?.open) connRef.current.send(msg);
  }, []);

  const pct = total > 0 ? ((index + 1) / total) * 100 : 0;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="neon-mesh absolute inset-0 -z-20" />
      <MagicScene active={index} />
      <main className="relative z-10 min-h-screen overflow-y-auto p-5 text-white">
        <div className="flex items-center justify-between mb-6">
          <span className="glass rounded-full px-3 py-1.5 text-[16px] font-bold text-white">🎛️ Remote</span>
          <span className={`glass rounded-full px-3 py-1.5 text-[14px] font-mono ${connected ? "text-emerald-300" : "text-white/50"}`}>
            {connected ? "● connected" : "○ connecting…"}
          </span>
        </div>

        {!connected ? (
          <div className="glass rounded-2xl p-10 text-center">
            <div className="text-2xl mb-3">🔍</div>
            <div className="text-xl text-white/70">Nyari deck di network…</div>
            <div className="text-sm text-white/40 mt-2">Pastikan laptop & HP 1 WiFi yang sama</div>
          </div>
        ) : (
          <>
            <div className="glass rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-4 mb-3">
                <button onClick={() => send({ type: "prev" })} disabled={index === 0}
                  className="glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition enabled:hover:bg-white/10 disabled:opacity-30">←</button>
                <div className="flex-1 text-center">
                  <div className="text-5xl font-black font-mono">{String(index + 1).padStart(2, "0")}</div>
                  <div className="text-base text-white/50">of {total}</div>
                </div>
                <button onClick={() => send({ type: "next" })} disabled={index === total - 1}
                  className="glass flex h-14 w-14 items-center justify-center rounded-full text-2xl transition enabled:hover:bg-white/10 disabled:opacity-30">→</button>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-[width] duration-200" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="glass rounded-2xl p-4 mb-4">
              <div className="text-xs uppercase tracking-wider text-white/50 mb-1">Current Slide</div>
              <div className="text-2xl font-bold">{title}</div>
            </div>

            <div className="glass rounded-2xl p-4 mb-4">
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">📝 Notes</div>
              <p className="text-lg leading-relaxed text-white/90">{note}</p>
            </div>

            <div className="glass rounded-2xl p-4 mb-4">
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Jump</div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: total }, (_, i) => (
                  <button key={i} onClick={() => send({ type: "jump", index: i })}
                    className={`rounded-lg py-2 text-sm font-mono transition ${i === index ? "bg-white/25 text-white ring-1 ring-white/50" : "bg-white/5 text-white/50 active:bg-white/20"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">📋 All Notes</div>
              <div className="space-y-2">
                {SLIDES.map((s, i) => (
                  <div key={s.id} className={`glass rounded-xl p-3 transition ${i === index ? "ring-1 ring-cyan-400/50" : "opacity-50"}`}
                    onClick={() => send({ type: "jump", index: i })}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-sm text-white/50">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-bold text-white">{s.title}</span>
                    </div>
                    <p className="text-sm text-white/70 ml-6">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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
