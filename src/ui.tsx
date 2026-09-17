import type { ReactNode } from "react";
import { useState } from "react";

/* ---------- shared visual primitives ---------- */

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[24px] font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
      {children}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 flex min-h-[94vh] w-full flex-col justify-center px-10 pb-28 pt-12 sm:px-16 sm:pt-16">
      {children}
    </section>
  );
}

export function Glass({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>;
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xl font-medium text-slate-200 ${className}`}
    >
      {children}
    </span>
  );
}

export function Bullets({ items }: { items: { t: ReactNode; d?: ReactNode }[] }) {
  return (
    <ul className="mt-5 space-y-3 text-[22px] leading-relaxed text-white/90">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
          <div>
            <div className="text-slate-100">{it.t}</div>
            {it.d && <div className="mt-0.5 text-lg text-white/70">{it.d}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Stat({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div className={`glass rounded-2xl px-6 py-5 text-center ${className}`}>
      <div className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-cyan-200 via-indigo-200 to-fuchsia-200">
        {value}
      </div>
      <div className="mt-1 text-xl uppercase tracking-wider text-white/70">{label}</div>
    </div>
  );
}

/* ---------- code ---------- */

export type CodeRow = { t: string; tone?: "add" | "del" | "dim" | "pink" };

export function CodeBlock({ rows, title }: { rows: CodeRow[]; title?: string }) {
  return (
    <div className="code-block w-full overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-[20px] uppercase tracking-wider text-white/90">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-300/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono normal-case tracking-normal text-white/70">{title}</span>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-[18px] leading-7">
        {rows.map((r, i) => (
          <div
            key={i}
            className={
              r.tone === "add"
                ? "diff-add"
                : r.tone === "del"
                  ? "diff-del"
                  : r.tone === "dim"
                    ? "text-white/90"
                    : r.tone === "pink"
                      ? "text-fuchsia-300"
                      : "text-white/90"
            }
          >
            {r.t || "\u00A0"}
          </div>
        ))}
      </pre>
    </div>
  );
}

export function CodeCmp({
  before,
  after,
  title,
}: {
  before: CodeRow[];
  after: CodeRow[];
  title?: string;
}) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <CodeBlock title={title ? `${title} — Before` : "Before"} rows={before} />
      <CodeBlock title={title ? `${title} — After` : "After"} rows={after} />
    </div>
  );
}

/* ---------- rows / cards ---------- */

export function FlowRow({ items }: { items: { label: string; sub?: string }[] }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="glass-soft rounded-xl px-4 py-2.5 text-xl">
            <div className="font-semibold text-slate-100">{it.label}</div>
            {it.sub && <div className="text-[20px] text-white/70">{it.sub}</div>}
          </div>
          {i < items.length - 1 && <span className="text-cyan-300/70">→</span>}
        </div>
      ))}
    </div>
  );
}

export function Card({ icon, title, desc, className = "" }: { icon: ReactNode; title: string; desc: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl">
        {icon}
      </div>
      <div className="mt-3 text-xl font-semibold text-slate-100">{title}</div>
      <div className="mt-1 text-xl leading-relaxed text-white/70">{desc}</div>
    </div>
  );
}

/* Screenshot placeholder — replace with <img src="..." /> when real asset ready */
export function ScreenshotSlot({
  width,
  height,
  label,
  className = "",
}: {
  width: string;
  height: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] p-4 text-center ${className}`}
    >
      <div className="text-3xl opacity-70">🖼️</div>
      <div className="text-xl font-semibold text-white/90">{label}</div>
      <div className="rounded bg-white/10 px-2 py-0.5 font-mono text-[18px] text-white/70">
        {width}×{height}
      </div>
      <div className="absolute bottom-1.5 right-2 text-[14px] uppercase tracking-wider text-slate-600">
        placeholder
      </div>
    </div>
  );
}

/* ---------- interactive primitives ---------- */

export function GameGrid({
  items,
}: {
  items: { num: string; role: string; claim: string; color: string }[];
}) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const allOpen = Object.keys(revealed).length === items.length;
  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-3">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}
            className={`group rounded-xl border px-5 py-3 text-left font-mono text-base transition ${
              revealed[i]
                ? "border-white/40 bg-white/10"
                : "border-white/15 bg-white/[0.03] hover:border-cyan-300/50 hover:bg-white/[0.07]"
            }`}
          >
            <div className={`text-2xl font-bold ${it.color}`}>{it.num}</div>
            {revealed[i] ? (
              <div className="mt-0.5 max-w-[320px] text-xl text-white/90">
                <span className="font-semibold text-white">{it.role}:</span> {it.claim}
              </div>
            ) : (
              <div className="mt-0.5 max-w-[320px] text-xl text-white/90">klik untuk lihat pemiliknya</div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={() => setRevealed(Object.fromEntries(items.map((_, i) => [i, true])))}
        disabled={allOpen}
        className="mt-4 rounded-lg border border-cyan-300/40 px-3 py-1.5 text-base text-cyan-200 transition enabled:hover:bg-cyan-300/10 disabled:opacity-30"
      >
        {allOpen ? "Semua kebuka — itu masalahnya 😅" : "Buka semua"}
      </button>
    </div>
  );
}

export function Tabs({
  tabs,
}: {
  tabs: { name: string; rows: { left: string; right: ReactNode }[] }[];
}) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={`rounded-lg px-4 py-1.5 text-xl transition ${
              i === active
                ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/40"
                : "bg-white/[0.04] text-white/70 hover:text-slate-200"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="glass-soft mt-4 overflow-hidden rounded-xl">
        {tab.rows.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-2 gap-3 px-5 py-3 text-base ${i % 2 ? "bg-white/[0.02]" : ""}`}
          >
            <div className="font-mono text-cyan-200">{r.left}</div>
            <div className="text-slate-200">{r.right}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PromiseCheck({
  items,
}: {
  items: { role: string; text: string; emoji: string }[];
}) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        {items.map((it, i) => (
          <button
            key={it.role}
            onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
            className={`glass rounded-2xl p-5 text-left transition ${
              done[i] ? "ring-1 ring-emerald-300/60" : "hover:bg-white/[0.06]"
            }`}
          >
            <div className="text-2xl">{done[i] ? "✅" : it.emoji}</div>
            <div className="mt-1 text-lg font-bold text-slate-100">{it.role}</div>
            <div className="mt-0.5 text-xl text-white/90">{it.text}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 text-base text-white/70">
        {count === items.length ? (
          <span className="text-emerald-300">
            🎉 {items.length} janji terkunci. Sebulan lagi codebase kita ngomong bahasa yang sama.
          </span>
        ) : (
          <span>
            Janji terkunci: {count}/{items.length} — klik kartu untuk berjanji di PR lo berikutnya.
          </span>
        )}
      </div>
    </div>
  );
}
