import type { ReactNode } from "react";
import {
  Kicker,
  Shell,
  Glass,
  Pill,
  Bullets,
  Stat,
  CodeBlock,
  CodeCmp,
  FlowRow,
  Card,
  GameGrid,
  Tabs,
} from "./ui";

export type SlideDef = {
  id: string;
  act: string;
  actColor: string;
  title: string;
  note: string;
  body: ReactNode;
};

const ACT_NEON: Record<string, string> = {
  A1: "from-indigo-400/90 to-cyan-300/90",
  A2: "from-cyan-300/90 to-teal-200/90",
  A3: "from-emerald-300/90 to-cyan-200/90",
  A4: "from-fuchsia-300/90 to-pink-200/90",
  A5: "from-amber-200/90 to-orange-200/90",
};

/* semantic act names — the deck practices what it preaches */
export const ACT_NAME: Record<string, string> = {
  A1: "problem.magic-numbers",
  A2: "language.meaning",
  A3: "case-study.transfer",
  A4: "pattern.template",
  A5: "action.one-promise",
};

function SlideTitle({ act, title }: { act: string; title: ReactNode }) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`rounded-md bg-gradient-to-r px-3 py-1 font-mono text-[20px] font-bold text-slate-950 sm:text-[24px] ${ACT_NEON[act]}`}
        >
          {ACT_NAME[act]}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
      </div>
      <h2 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-7xl">
        {title}
      </h2>
    </>
  );
}

export const SLIDES: SlideDef[] = [
  /* ---------------- ACT 1 ---------------- */
  {
    id: "s01",
    act: "A1",
    actColor: "#818cf8",
    title: "Goodbye Magic Numbers",
    note: "Perkenalan singkat: gue dari design system, mantan UI/UX. Frame: ini nyambung ke semua role di ruangan.",
    body: (
      <Shell>
        <div className="blueprint absolute inset-x-0 top-0 -z-10 h-full opacity-60" />
        <div className="pointer-events-none absolute right-0 top-24 -z-10 select-none text-[20rem] font-black leading-none text-white/[0.04] sm:text-[28rem]">
          16
        </div>
        <Kicker>Bagi-bagi ilmu walaupun sedikit 🤏</Kicker>
        <h1 className="max-w-5xl text-7xl font-black leading-[1.02] tracking-tight sm:text-9xl">
          Goodbye{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
            Magic Numbers
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-2xl text-white/90">
          Semantic Naming Approach — <em className="text-slate-100">dari sekedar angka ke bahasa bersama.</em>
        </p>
        <Kicker>Hamzhya Salsatinnov Hairy - iOS Design System - BRI</Kicker>
      </Shell>
    ),
  },
  {
    id: "s02",
    act: "A1",
    actColor: "#818cf8",
    title: "Berapa Angka di Layar Ini?",
    note: "Main tebak-tebakan. Tampung 3-4 jawaban acak dari audiens. Semua angka ini ada di layar Konfirmasi Transfer.",
    body: (
      <Shell>
        <SlideTitle act="A1" title="Berapa Angka di Layar Ini?" />
        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[auto_1fr]">
          <div>
            <p className="max-w-3xl text-xl text-white/90">
              Layar ini adalah <b className="text-white">Konfirmasi Transfer</b>.{" "}
              <span className="text-white/70">Perhatikan angka-angka di dalamnya — klik untuk melihat pemiliknya.</span>
            </p>
            <GameGrid
              items={[
                { num: "16", role: "UI/UX", claim: "jarak antar konten (spacing)", color: "text-pink-300" },
                { num: "16", role: "FE Mobile", claim: "radius kartu total (corner)", color: "text-cyan-300" },
                { num: "16", role: "FE Mobile", claim: "jarak dari tepi layar (padding)", color: "text-emerald-300" },
              ]}
            />
          </div>
          <div className="flex h-[600px] w-[600px] items-center justify-center overflow-hidden rounded-2xl">
            <img src="/gambar-slide-02.png" alt="Screenshot Transaksi" className="h-full w-auto object-contain" />
          </div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s03",
    act: "A1",
    actColor: "#818cf8",
    title: "Semua jawaban bener. Dan itu masalahnya.",
    note: "Kunci slide: 16 yang sama punya arti beda per role. Masalahnya bukan angkanya — tapi tidak ada bahasa bersama.",
    body: (
      <Shell>
        <SlideTitle act="A1" title="Semua jawaban bener. Dan itu masalahnya." />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["16", "spacing antar konten", "kata si UI/UX bilang: jarak", "text-pink-300"],
            ["16", "radius kartu total", "FE bilang: sudut kartu", "text-cyan-300"],
            ["16", "jarak dari tepi layar", "FE bilang: screen padding", "text-emerald-300"],
          ].map(([n, what, who, c]) => (
            <Glass key={n} className="p-5">
              <div className={`font-mono text-3xl font-black ${c}`}>{n}</div>
              <div className="mt-1 text-xl font-semibold text-slate-100">{what}</div>
              <div className="text-xl text-white/70">{who}</div>
            </Glass>
          ))}
        </div>
        <div className="glass mt-8 max-w-3xl rounded-2xl border-l-4 border-l-fuchsia-400 p-6">
          <p className="text-2xl font-semibold text-white">
            Masalahnya bukan angkanya. Masalahnya kita gak ngomong{" "}
            <span className="text-fuchsia-300">bahasa yang sama</span>.
          </p>
        </div>
      </Shell>
    ),
  },
  {
    id: "s04",
    act: "A1",
    actColor: "#818cf8",
    title: "Magic Number itu mahal",
    note: "Fakta audit: 100+ padding raw di Features/, 2 sistem warna dengan hex beda untuk nama yang sama. Ini biaya komunikasi, bukan cuma code.",
    body: (
      <Shell>
        <SlideTitle act="A1" title="Magic Number itu mahal" />
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Card icon="🌀" title="Inconsistency" desc="Layar A radius 16, layar B radius 12 — dua-duanya 'card'. Pengguna liat, QA bingung, Dev Bingung, Aku juga bingung" />
          <Card icon="🔍" title="Maintenance" desc="Desain ganti spacing? Cari manual tiap '16' di codebase. Ketinggalan satu = drift diam-diam." />
          <Card icon="🌉" title="Drift desain–dev" desc="Figma bilang 14, code nulis 12. Aman aja sebelum QA bilang `mas ini nya kayanya kurang ini`." />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Stat value="100+" label="padding raw di Features" />
          <Stat value="0%" label="adopsi token spacing (awal audit)" />
          <Stat value="2×" label="sistem warna, hex beda" />
          <Glass className="flex-1 p-6">
            <div className="font-mono text-xl">
              <span className="text-white/70">BRIColors Green.main</span>{" "}
              <span className="text-emerald-300">#27AE60</span>{" "}
              <span className="text-slate-200">vs lama</span>{" "}
              <span className="text-rose-300">#72AE60</span>
            </div>
            <div className="mt-2 text-xl text-white/70">
              Desainer bilang "pakai green" — dev pilih yang mana? 🤷
            </div>
          </Glass>
        </div>
      </Shell>
    ),
  },
  /* ---------------- WHY — comparison screens ---------------- */
  {
    id: "s05",
    act: "A1",
    actColor: "#818cf8",
    title: "Kenapa butuh ini? Over-engineer kah?",
    note: "WHY utama: bukan 1-10 screen, tapi super app dengan ratusan screen. Reskin bisa terjadi kapan saja. Token = insurance, bukan overhead.",
    body: (
      <Shell>
        <SlideTitle act="A1" title="Kenapa butuh ini? Over-engineer kah?" />
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <div className="flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl glass p-3">
              <img src="/screen-v1.png" alt="App v1 — Classic" className="h-full max-h-[400px] object-contain" />
            </div>
            <div className="text-xl text-white/50">Classic</div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl glass p-3">
              <img src="/screen-v2.png" alt="App v2 — New Skin" className="h-full max-h-[400px] object-contain" />
            </div>
            <div className="text-xl text-white/50">New Skin</div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl glass p-3">
              <img src="/screen-v3.png" alt="App v3 — Reskin" className="h-full max-h-[400px] object-contain" />
            </div>
            <div className="text-xl text-white/50">Inovasi Baru</div>
          </div>
        </div>
        <div className="mt-4 glass rounded-2xl p-5">
          <div className="text-xl text-white/90 text-center">
            Layout <span className="text-cyan-300 font-bold">SAMA</span>. Style <span className="text-fuchsia-300 font-bold">BEDA BANGET</span>.
          </div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s06",
    act: "A1",
    actColor: "#818cf8",
    title: "1-10 screen? Gak butuh. Super app? WAJIB.",
    note: "Di 1-10 screen hardcode oke. Di super app ratusan screen: hardcode = bom waktu. Reskin bukan 'kalau' tapi 'kapan'. Token = insurance.",
    body: (
      <Shell>
        <SlideTitle act="A1" title="1-10 screen? Gak butuh. Super app? WAJIB." />
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <Glass className="p-6">
            <div className="text-xl font-bold text-white/50 mb-3">1–10 Screen</div>
            <div className="space-y-2 text-xl text-white/70">
              <div>✓ Hardcode oke</div>
              <div>✓ Reskin = rebuild</div>
              <div>✓ Satu dev handle</div>
              <div>✓ Murah untuk 1 layar</div>
            </div>
          </Glass>
          <Glass className="p-6 ring-1 ring-fuchsia-300/30">
            <div className="text-xl font-bold text-fuchsia-300 mb-3">Super App (50–500 screen)</div>
            <div className="space-y-2 text-xl">
              <div>✗ Hardcode = <span className="text-rose-300">bom waktu</span></div>
              <div>✓ Reskin = <span className="text-emerald-300">update token</span></div>
              <div>✓ Tim besar, banyak role</div>
              <div>✓ Murah untuk <span className="text-emerald-300">ratusan layar</span></div>
            </div>
          </Glass>
        </div>
        <div className="mt-8 text-center text-2xl font-bold text-white">
          Token bukan over-engineering — itu <span className="text-fuchsia-300">insurance</span>.
        </div>
      </Shell>
    ),
  },

  /* ---------------- ACT 2 ---------------- */
  {
    id: "s05",
    act: "A2",
    actColor: "#22d3ee",
    title: "16 itu kata tanpa makna",
    note: "Dulu gue UI/UX: desainer gak mikir 'angka 16', dia mikir 'jarak dari tepi layar'. Nama = intent. Angka buang semua konteks itu.",
    body: (
      <Shell>
        <SlideTitle act="A2" title="16 itu kata tanpa makna" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Glass className="p-6 opacity-80">
            <div className="text-xl uppercase tracking-widest text-slate-200">tanpa nama</div>
            <div className="mt-3 font-mono text-3xl text-white/70">.padding(16)</div>
            <p className="mt-3 text-lg text-slate-200">
              16 untuk apa? Padding? Margin? Radius? Entah. Konteksnya hilang.
            </p>
          </Glass>
          <Glass className="p-6 ring-1 ring-cyan-300/30">
            <div className="text-xl uppercase tracking-widest text-cyan-300">dengan nama</div>
            <div className="mt-3 font-mono text-3xl text-cyan-200">screen.margin.horizontal</div>
            <p className="mt-3 text-lg text-white/90">
              "Ini margin dari tepi layar." Nama bilang <b className="text-white">intent</b>.
            </p>
          </Glass>
        </div>
        <div className="mt-8 max-w-3xl">
          <div className="text-3xl font-bold text-white">Nama = intent. Intent = konsistensi 100 orang tanpa nanya.</div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s06",
    act: "A2",
    actColor: "#22d3ee",
    title: "Satu bahasa, empat wujud",
    note: "Prinsip gak spesifik framework: {context}.{property}.{direction}.{size}. Nilai sama antar konteks = disengaja. Pilih by intent bukan by angka.",
    body: (
      <Shell>
        <SlideTitle act="A2" title="Satu bahasa, empat wujud" />
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <Glass className="p-6">
            <div className="font-mono text-xl text-cyan-200">{"{context}.{property}.{direction}.{size}"}</div>
            <Bullets
              items={[
                { t: "Konteks dulu, angka belakangan", d: "card.padding.horizontal.default — bukan spacing-16" },
                { t: "Nilai sama = disengaja", d: "card & screen sama-sama 16? Beda konteks, kebetulan senilai. Bukan duplikasi." },
                { t: "Dev milih mau ngapain", d: "bukan butuh angka berapa" },
              ]}
            />
          </Glass>
          <Glass className="p-6">
            <Tabs
              tabs={[
                {
                  name: "🎨 Figma",
                  rows: [
                    { left: "spacing/section", right: "jarak antar section (24)" },
                    { left: "radius/card", right: "sudut kartu (16)" },
                    { left: "color/brand/main", right: "warna brand (hex disimpan sekali)" },
                  ],
                },
                {
                  name: "📱 Mobile Dev",
                  rows: [
                    { left: "screen.margin", right: "margin layar" },
                    { left: "card.radius", right: "radius kartu" },
                    { left: "Semantic.Text.Brand", right: "teks brand" },
                  ],
                },
              ]}
            />
            <p className="mt-3 text-xs text-slate-200">Bahasa sama, wujud beda per platform.</p>
          </Glass>
        </div>
      </Shell>
    ),
  },
  {
    id: "s07",
    act: "A2",
    actColor: "#22d3ee",
    title: "Bukan malas. Namanya gak ngasih tau.",
    note: "Token spacing kami ada setahun, adopsi 0%. Bukan salah dev — nama 'twelve' gak bilang buat apa. Naming 90% dari adopsi.",
    body: (
      <Shell>
        <SlideTitle act="A2" title="Bukan malas. Namanya gak ngasih tau." />
        <CodeCmp
          title="Token spacing"
          before={[
            { t: 'BRISpacing.twelve.rawValue', tone: "del" },
            { t: "// → 12", tone: "dim" },
            { t: "// Buat apa? Entah.", tone: "dim" },
          ]}
          after={[
            { t: 'BRISpacing.contentSectionGap', tone: "add" },
            { t: "// → 24", tone: "dim" },
            { t: "// Jarak antar section. Jelas.", tone: "dim" },
          ]}
        />
        <Glass className="mt-6 flex max-w-3xl items-center gap-4 rounded-2xl border-l-4 border-l-amber-300 p-6">
          <div className="text-4xl">🧠</div>
          <p className="text-xl text-slate-200">
            Token spacing kami <b className="text-white">udah ada setahun</b>. Adopsi:{" "}
            <b className="text-amber-300">0%</b>. Namanya: <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-amber-200">twelve</code>,{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-amber-200">sixteen</code>. Dev gak tau nilainya buat apa →
            nulis <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono">12</code> langsung.
          </p>
        </Glass>
        <div className="mt-5 text-2xl font-semibold text-white">
          Naming itu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-pink-300">90% dari masalah adopsi</span>.
        </div>
      </Shell>
    ),
  },
  {
    id: "s08",
    act: "A2",
    actColor: "#22d3ee",
    title: "Token itu kamus bersama — bukan punya satu tim",
    note: "Shared ownership. Desainer define + kasih nama; dev pakai + tanya kalau gak ada; PM kasih kapasitas. Bahasa mati kalau satu sisi gak jalan.",
    body: (
      <Shell>
        <SlideTitle act="A2" title="Token itu kamus bersama — bukan punya satu tim" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Glass className="p-6">
            <div className="text-3xl">🎨</div>
            <div className="mt-2 text-xl font-bold text-white">Desain define</div>
            <p className="mt-1 text-xl text-white/70">
              Token di Figma, <b>kasih nama</b>, jangan kirim angka lepas.
            </p>
          </Glass>
          <Glass className="p-6">
            <div className="text-3xl">🧑‍💻</div>
            <div className="mt-2 text-xl font-bold text-white">Dev implement</div>
            <p className="mt-1 text-xl text-white/70">
              Pakai token. Gak ada yang cocok? <b>Tanya</b>, jangan invent angka.
            </p>
          </Glass>
          <Glass className="p-6">
            <div className="text-3xl">📋</div>
            <div className="mt-2 text-xl font-bold text-white">PM kasih kapasitas</div>
            <p className="mt-1 text-xl text-white/70">
              Ini ngurangin utang & biaya komunikasi — bukan polish.
            </p>
          </Glass>
        </div>
        <div className="glass mt-6 rounded-full px-6 py-4 text-center text-xl text-slate-200">
          Kalau salah satu gak jalan → <span className="font-bold text-rose-300">bahasanya mati</span>
        </div>
      </Shell>
    ),
  },

  /* ---------------- ACT 3 ---------------- */
  {
    id: "s09",
    act: "A3",
    actColor: "#34d399",
    title: "Satu layar, empat tahap, empat bahasa",
    note: "Transisi ke case study. Layar Konfirmasi Transfer dibedah dari lahir sampai jalan: Figma → code.",
    body: (
      <Shell>
        <SlideTitle act="A3" title="Satu layar, empat tahap, empat bahasa" />
        <div className="mt-8">
          <FlowRow
              items={[
              { label: "🎨 Figma", sub: "spacing & radius jadi nama" },
              { label: "📱 Mobile Dev", sub: "dari .padding(16)" },
            ]}
          />
        </div>
        <Glass className="mt-8 rounded-2xl p-6">
          <div className="text-xl uppercase tracking-widest text-emerald-300">Case study · layar Konfirmasi Transfer</div>
          <p className="mt-2 text-xl text-white/90">
            Di tiap tahap ada magic number-nya sendiri. Kita lihat satu per satu gimana{" "}
            <b className="text-white">semantic naming</b> beresin itu.
          </p>
        </Glass>
      </Shell>
    ),
  },
  {
    id: "s10",
    act: "A3",
    actColor: "#34d399",
    title: "Di Figma, namanya udah ada — tinggal dijaga",
    note: "Desainer sebenarnya udah punya bahasa: Figma variables. PR: nama di Figma = nama di kode. Satu kamus dua sisi.",
    body: (
      <Shell>
        <SlideTitle act="A3" title="Di Figma, namanya udah ada — tinggal dijaga" />
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <CodeBlock
            title="Figma variables (yang bener)"
            rows={[
              { t: "spacing/section   = 24" },
              { t: "radius/card       = 16" },
              { t: "color/brand/main  = #307FE2", tone: "pink" },
            ]}
          />
          <Glass className="flex flex-col justify-center p-6">
            <div className="text-xl font-semibold text-white">PR pertama: satu kamus, dua sisi</div>
            <p className="mt-2 text-xl text-white/70">
              Nama yang dipakai Figma harus nama yang dipakai kode. Selama handoff cuma gambar tanpa nama, desain & dev bakal terus{" "}
              <span className="text-rose-300">salah paham</span> soal nilai.
            </p>
          </Glass>
        </div>
      </Shell>
    ),
  },
  {
    id: "s11",
    act: "A3",
    actColor: "#34d399",
    title: "Mobile Dev — dari angka ke nama",
    note: "Contoh: radius jadi satu kata, warna 6-level jadi 1 properti. Desain ganti 16→20 = satu tempat berubah, semua screen ngikut.",
    body: (
      <Shell>
        <SlideTitle act="A3" title="Mobile Dev — dari angka ke nama" />
        <CodeCmp
          title="SwiftUI"
          before={[
            { t: ".padding(.horizontal, 16)", tone: "del" },
            { t: ".cornerRadius(16)", tone: "del" },
            { t: ".foregroundColor(", tone: "del" },
            { t: "    BRIColors.Semantic.Text", tone: "del" },
            { t: "        .Brand.Primary.default.color)", tone: "del" },
            { t: "// 6 level nesting buat 'teks utama' 😮‍💨", tone: "dim" },
          ]}
          after={[
            { t: ".padding(.horizontal, screen.margin)", tone: "add" },
            { t: ".briCardRadius()", tone: "add" },
            { t: ".textBrandPrimaryMain", tone: "add" },
          ]}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Pill className="border-emerald-300/30 bg-emerald-300/10 text-emerald-200 text-lg">
            Desain ganti radius 16 → 20? 1 tempat berubah, ratusan layar ngikut.
          </Pill>
          <Pill className="text-lg">Gak ada grep, gak ada tebak-tebakan</Pill>
        </div>
      </Shell>
    ),
  },
  {
    id: "s12",
    act: "A3",
    actColor: "#34d399",
    title: "Pola sama, wujud beda per framework",
    note: "Framing blueprint — aturan main: nama = makna. Bisa React Native, Kotlin, Swift — polanya sama.",
    body: (
      <Shell>
        <SlideTitle act="A3" title="Pola sama, wujud beda per framework" />
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <CodeBlock
            title="contoh: resource dimens (concept)"
            rows={[
              { t: 'screen_margin_horizontal = 16' },
              { t: 'card_radius = 16', tone: "pink" },
              { t: 'section_gap = 24' },
            ]}
          />
          <div className="flex flex-col justify-center gap-3">
            <Glass className="p-6">
              <div className="text-xl text-slate-200">
                Nama = <b className="text-white">konteks + makna</b>, bukan ukuran. Satu sumber nilai, gak ada <code className="rounded bg-white/10 px-1.5 font-mono text-xs">16</code> nyasar di mana-mana.
              </div>
            </Glass>
            <Glass className="border-amber-300/20 p-6">
              <div className="text-xl uppercase tracking-widest text-amber-300">Sejujurnya…</div>
              <p className="mt-1 text-base text-slate-400">
                Ini <b className="text-white">blueprint</b> — bahasanya bisa ditiru di framework apapun.
              </p>
            </Glass>
          </div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s14",
    act: "A3",
    actColor: "#34d399",
    title: "Kalau gak enak dipakai, gak akan dipakai",
    note: "Idealisme harus realistis. Nama panjang bener tapi berat → tambah lapisan shortcut 1 kata. Pelajaran: token harus nyaman dipakai.",
    body: (
      <Shell>
        <SlideTitle act="A3" title="Kalau gak enak dipakai, gak akan dipakai" />
        <div className="mt-7 space-y-3">
          {[
            { code: "BRIColors.Semantic.Text.Brand.Primary.default.color", tag: "6 level — bener tapi berat", tone: "text-slate-200" },
            { code: "BRI.Text.brand", tag: "3 level — lebih baik", tone: "text-white/90" },
            { code: ".textBrandPrimaryMain", tag: "1 properti — ini yang dipakai orang", tone: "text-cyan-200" },
            { code: ".bodyMediumRegular", tag: "font juga gitu — BRIFont.bodyMediumRegular", tone: "text-fuchsia-200" },
          ].map((r, i) => (
            <div key={i} className={`glass flex flex-wrap items-center justify-between gap-2 rounded-xl px-6 py-4 ${i === 2 || i === 3 ? "ring-1 ring-cyan-300/20" : ""}`}>
              <code className={`font-mono text-xl ${r.tone}`}>{r.code}</code>
              <span className="text-xl text-slate-200">{r.tag}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-2xl font-semibold text-white">
          Kalau enak → orang pakai sendiri. Kalau ribet → orang bikin angka ajaib baru.
        </div>
      </Shell>
    ),
  },

  /* ---------------- ACT 4 ---------------- */
  {
    id: "s15",
    act: "A4",
    actColor: "#e879f9",
    title: "Pola yang cuma diingat, bakal dilanggar",
    note: "Aturan tertulis gak cukup, ingatan bocor. Template = cara kunci bahasa biar layar baru lahir udah benar, tanpa mikir.",
    body: (
      <Shell>
        <SlideTitle act="A4" title="Pola yang cuma diingat, bakal dilanggar" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card icon="🧠" title="Ingatan" desc="Bocor. Dev baru, dev buru-buru, dev yang gak hafal design system — semua lupa." />
          <Card icon="📄" title="Aturan di doc" desc="Jarang dibaca. Doc gak bisa mastiin output-nya bener." />
          <Card icon="⚙️" title="Template" desc="Selalu dipakai. Pola lahir otomatis bener — semantic naming dikunci di sini." className="ring-1 ring-fuchsia-300/30" />
        </div>
        <div className="mt-8 text-center text-3xl font-bold text-white">
          Template = cara kita <span className="text-fuchsia-300">kunci bahasa</span>, biar gak perlu diingat.
        </div>
      </Shell>
    ),
  },
  {
    id: "s16",
    act: "A4",
    actColor: "#e879f9",
    title: "Satu perintah, satu modul",
    note: "make module type=confirmation → Features/Transfer/ lengkap Data+Domain+Presentation UDF, terdaftar otomatis, output token-clean.",
    body: (
      <Shell>
        <SlideTitle act="A4" title="Satu perintah, satu modul" />
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <div className="flex items-center justify-center overflow-hidden rounded-2xl glass p-4">
            <img src="/template-arch.png" alt="Template Architecture" className="w-full object-contain" />
          </div>
          <div className="flex flex-col justify-center gap-3">
            <div className="text-2xl font-bold text-white">Satu perintah, satu modul lengkap</div>
            <p className="text-xl text-white/90">
              Struktur Data/Domain/Presentation + pola UDF (State → Action → Reducer) konsisten,{" "}
              <b className="text-white">langsung ke-register</b> ke project.
            </p>
            <div className="text-xl text-white/90">
              Dev mulai dari <span className="text-fuchsia-300">pola yang udah bener</span>.
            </div>
          </div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s17",
    act: "A4",
    actColor: "#e879f9",
    title: "New File → BRI Template UI",
    note: "Untuk module existing: Xcode file template. 2 file (Store + View), find-replace StoreBaseName. Template kerangka, bukan kotak hitam.",
    body: (
      <Shell>
        <SlideTitle act="A4" title="New File → BRI Template UI" />
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <div className="flex items-center justify-center overflow-hidden rounded-2xl glass p-4">
            <img src="/template-xcode.png" alt="Xcode Template" className="w-full object-contain" />
          </div>
          <div className="flex flex-col justify-center gap-3">
            <div className="text-2xl font-bold text-white">Kerangka, bukan kotak hitam</div>
            <p className="text-xl text-white/90">
              Template tetap <b className="text-white">pegang kendali</b> — dev isi logika. Tapi keputusan design system (token, layout, pola error){" "}
              <span className="text-fuchsia-300">udah dikunci di kerangka</span>.
            </p>
            <Pill className="w-fit border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200 text-lg">
              find-replace: StoreBaseName → TransferConfirmationStore
            </Pill>
          </div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s18",
    act: "A4",
    actColor: "#e879f9",
    title: "Layar tadi? Sekarang lahir dari template",
    note: "Payoff sirkular. Layar pembuka lahir dari template; output token-clean — nol angka ajaib. Bahasa dikunci di pola.",
    body: (
      <Shell>
        <SlideTitle act="A4" title="Layar tadi? Sekarang lahir dari template" />
        <div className="mt-7 grid items-stretch gap-4 lg:grid-cols-2">
          <Glass className="flex flex-col gap-3 p-6">
            <div className="text-xs uppercase tracking-widest text-slate-200">Hasil generate template</div>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl">
              <img src="/template-native.png" alt="Generated Output" className="max-h-[300px] object-contain" />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl glass p-2">
                <img src="/template-framework.png" alt="Framework Target" className="max-h-[120px] object-contain" />
              </div>
              <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl glass p-2">
                <img src="/template-arch.png" alt="Architecture" className="max-h-[120px] object-contain" />
              </div>
            </div>
          </Glass>
          <div className="flex flex-col justify-center gap-3">
            <div className="text-2xl font-bold text-white">Output template: token clean</div>
            <p className="text-xl text-white/90">
              Template menghasilkan kode yang sudah menggunakan semantic tokens — bukan angka ajaib.
            </p>
            <div className="glass rounded-xl px-4 py-3 text-center text-xl font-bold text-amber-300">
              In development — sebagian belum merge ke main
            </div>
            <p className="text-xl text-white/70">
              Dev baru, dev buru-buru —{" "}
              <b className="text-white">semua otomatis bener dari awal</b>.
            </p>
          </div>
        </div>
      </Shell>
    ),
  },
  {
    id: "s19",
    act: "A4",
    actColor: "#e879f9",
    title: "Bukan cuma satu platform",
    note: "Templating = pola universal. Prinsip: jangan generate manual, generate dari pola.",
    body: (
      <Shell>
        <SlideTitle act="A4" title="Bukan cuma satu platform" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card icon="📱" title="Mobile Dev" desc="Template scaffold — token-clean dari awal" className="ring-1 ring-emerald-300/20" />
          <Card icon="🎨" title="UI/UX" desc="Figma component + variables — sumber polanya" />
        </div>
        <div className="glass mt-8 rounded-2xl p-6 text-center">
          <div className="text-2xl font-bold text-white">
            Jangan <span className="text-rose-300">generate manual</span> —{" "}
            <span className="text-emerald-300">generate dari pola</span>. Kamus & polanya satu.
          </div>
        </div>
      </Shell>
    ),
  },

  /* ---------------- ACT 5 ---------------- */
  {
    id: "s21",
    act: "A5",
    actColor: "#fbbf24",
    title: "Goodbye magic numbers. Hello bahasa bersama.",
    note: "Tutup sirkular: balik ke layar pembuka, highlight angka diganti label semantic. Undang Q&A.",
    body: (
      <Shell>
        <div className="pointer-events-none absolute right-0 top-24 -z-10 select-none text-[16rem] font-black leading-none text-white/[0.04] sm:text-[22rem]">
          ∞
        </div>
        <SlideTitle act="A5" title="Goodbye magic numbers. Hello bahasa bersama." />
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            {[
              ["16", "→", "screen.margin", "text-pink-300"],
              ["16", "→", "card.radius", "text-cyan-300"],
              ["24", "→", "section.gap", "text-emerald-300"],
            ].map(([a, _, b, c]) => (
              <div key={a} className="glass flex items-center gap-3 rounded-xl px-5 py-3 font-mono text-sm">
                <span className={`font-black ${c}`}>{a}</span>
                <span className="text-slate-600">→</span>
                <span className="text-slate-200">{b}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-3">
            <p className="text-2xl text-slate-200">
              Layar yang sama. Tapi sekarang tiap orang yang buka — desainer, developer —{" "}
              <b className="text-white">langsung ngerti keputusannya</b>.
            </p>
          </div>
        </div>
        <div className="mt-10 text-2xl font-semibold text-amber-200">Terima kasih — Q&amp;A terbuka 💬</div>
      </Shell>
    ),
  },
];
