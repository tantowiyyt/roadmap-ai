---
name: app-theme
description: Sistem desain bergaya Preline (Tailwind UI yang bersih) untuk aplikasi Roadmap Belajar AI. Muat skill ini SEBELUM mengubah atau menambah tampilan apa pun di proyek ini — CSS di src/styles.css, komponen/halaman baru di src/components atau src/pages, warna level, font, mode gelap, kotak catatan, kartu, tombol, atau saat pengguna minta "percantik", "rapikan tampilan", "ganti warna/tema", atau mengeluh tampilan "kurang clean".
---

# Tema aplikasi: gaya Preline

Pengguna meminta tampilan mengikuti **preline.co/templates** (12 November 2026), yaitu UI Tailwind yang bersih:
latar slate muda, kartu putih ber-border + bayangan sangat halus, aksen indigo.

Riwayat yang **ditolak** pengguna, jangan dikembalikan:
- Banner gradien ungu-pink, lingkaran dekorasi ("AI-slop").
- Latar krem/coklat ("jangan coklat gitu").
- Judul serif / gaya buku ("kurang clean").

## Token (bagian "Gaya Preline (tahap 5)" di akhir `src/styles.css`)

| Token | Terang | Gelap | Pakai untuk |
|---|---|---|---|
| `--bg` | `#f1f5f9` slate-100 | `#0b1120` | latar halaman (bukan putih polos: "terlalu putih") |
| `--card` | `#ffffff` | `#131c2e` | kartu, tombol biasa, input, bilah tab |
| `--surface` | `#e2e8f0` | `#1a2438` | latar sub-tab, hover |
| `--text` | `#0f172a` slate-900 | `#e2e8f0` | teks utama |
| `--muted` | `#64748b` | `#94a3b8` | keterangan |
| `--border` | `#e2e8f0` | `#243049` | semua border |
| `--accent` / `--accent-hover` | `#4f46e5` / `#4338ca` indigo | `#818cf8` / `#a5b4fc` | tombol utama, tab aktif, tautan |
| `--accent-soft` | `#eef2ff` | indigo 15% | badge, rona aksen |
| `--on-accent` | `#ffffff` | `#0b1120` | teks di atas aksen |
| `--ok` / `--danger` | `#16a34a` / `#dc2626` | `#4ade80` / `#f87171` | benar / salah |
| `--radius-sm` / `--radius` / `--radius-lg` | 8 / 12 / 16px | | tombol & input / kartu / panel besar |
| `--shadow-xs` / `--shadow-sm` | | | kartu & tombol / hover kartu |

Palet **Slate + Indigo** dipilih pengguna (12 Nov 2026) — lapisan "Palet Slate + Indigo (tahap 9)" di akhir styles.css.

Setiap blok warna gelap ditulis dua kali: `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }`
dan `:root[data-theme="dark"] {…}`.

**Font**: semua Inter (`--font-sans`, `--font-head`, `--font-read`), kode JetBrains Mono. Judul weight 600–700,
letter-spacing -0.015em. Ukuran pakai token `--fs-*` (12/13/14/15/16/17/18/22/26/34 px).

## Pola komponen

- **Kartu**: `background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-xs);`
  Hover kartu yang bisa diklik: `--shadow-sm` + border sedikit lebih gelap. Tanpa garis warna di atas, tanpa `transform`.
- **Tombol biasa**: latar `--card`, border `--border`, radius 8px, `--shadow-xs`, weight 500. Hover: rona abu tipis.
- **Tombol utama** (`button.primary`): latar `--accent`, teks putih, hover `--accent-hover`.
- **Input**: radius 8px, border `--border`; fokus = border aksen + cincin `0 0 0 3px` aksen 20%.
- **Chip saring**: seperti tombol biasa (radius 8px); yang aktif berlatar aksen, teks putih.
- **Badge/tag**: bentuk pil (`border-radius: 99px`), latar `--accent-soft` atau rona warnanya, teks berwarna.
- **Kotak catatan / alert** (`.kotak-bayi`, `.uses`, `.tips`, `.case`, `.istilah-materi`, `.project`, `.quiz-why`):
  border penuh 1px (warna `--note` 25%), radius 8px, latar `--note` 6%. Ganti warnanya lewat `--note`.
- **Kepala aplikasi** (`.hero`): panel **navy bergradien** (permintaan pengguna): `linear-gradient(135deg, #0b1437, #172554, #1e1b4b)`
  + dua rona radial lembut (indigo kanan atas, sky kiri bawah); teks putih, keterangan slate 78%; panel progres kaca gelap
  `rgb(255 255 255 / .07)`; isi bar progres gradien indigo→sky. Radius 16px. Sama di mode terang & gelap.
- **Kepala + bilah tab = satu blok navy** di desktop (tanpa jarak, dipisah garis `rgb(255 255 255 / .10)`).
- **Bilah tab utama** senada dengan kepala: gradien navy yang sama, teks `rgb(226 232 240 / .72)`, tab aktif pil kaca
  `rgb(255 255 255 / .14)` + garis bawah `#818cf8`; semua butir 38px, huruf `--fs-body`; Cari & Tema = tombol
  polos di kanan setelah garis tegak tipis. Di desktop tab dibagi rata (`flex: 1 1 0`); tombol tema hanya ikon 38px. **Tab utama**: teks abu, radius 8px; yang aktif = latar `--accent-soft` + teks aksen (tanpa garis bawah). **Sub-tab** (`.subtabs`): kontrol segmented —
  latar `--surface`, radius 8px, yang aktif = latar kartu + `--shadow-xs`.
- **Filter**: satu baris toolbar `.filter-bar` = kolom cari (melebar) + dropdown `<select className="filter-select">`
  (Level / Kategori / Sumber data). Jangan kembali ke baris-baris chip yang memecah ke beberapa baris.
- **Kepala aplikasi** di halaman selain Roadmap memakai class `ringkas` (judul kecil, tanpa deskripsi).
- **Sidebar tahap** (desktop): satu kartu navigasi sticky; baris = grid `28px | teks`; item aktif = rona `--lvl` 8% +
  nomor berwarna penuh; grup level dipisah `border-top`; lencana bahasa Inggris berupa pil kecil `--surface`.
- **Warna level** (`levels.js`, `--lvl`): Tailwind 600 — emerald `#059669`, sky `#0284c7`, amber `#d97706`, rose `#e11d48`,
  violet `#7c3aed`. Pengguna ingin tampilan **berwarna** ("kekurangan warna"): pakai `--lvl-soft` (12%) untuk ubin ikon
  emoji & nomor tahap, rona 6–8% untuk kepala detail & item aktif, `--lvl` penuh untuk nomor aktif & bar.
  `--lvl-soft` & `--lvl-ink` dihitung ulang di `*` agar mengikuti `--lvl` inline. Kotak catatan: uses biru, tips amber,
  contoh kasus violet, istilah sky. Kepala aplikasi berona biru lembut (bagian "Lebih berwarna (tahap 6)").
  Teks berwarna level pakai `--lvl-ink`.
- Warna animasi algoritma (`--s1..3`, `--anim-bg`) adalah palet aman buta warna — **jangan diubah**.
  Editor kode selalu gelap (`src/components/editorTheme.js`). Emoji tetap dipakai di isi halaman (pilihan pengguna), **kecuali di bilah tab / Cari / Tema**: di sana
  pakai ikon garis `<Ikon nama="…" />` (`src/components/Ikon.jsx`) supaya menu satu gaya ("vibe antar menu berbeda").

- **Tautan kembali** (`.back`): tombol kecil putih ber-border. **Kepala halaman detail** (`.algo-hero`, `.proyek-hero`):
  rona `--cat`/`--lvl` 6%, tanpa garis warna di atas, tidak berupa kartu di dalam kartu.

- **Daftar bernomor**: lingkaran nomor 26px (garis 1,5px `currentColor`), jarak ke teks 12px, antarbutir 14px; di kartu
  sempit 22px lewat `counter()`. Keterangan butir daftar **rata kiri**; rata kanan-kiri hanya untuk paragraf penjelasan.

## Dilarang

- Gradien dekoratif **di luar kepala aplikasi**, blob/lingkaran dekorasi, efek kaca (`backdrop-filter`).
- Bayangan besar/berwarna di kartu (cukup `--shadow-xs`/`--shadow-sm`; popup boleh satu bayangan lembut).
- Hover `transform: translateY` atau `filter: brightness`.
- Latar krem/coklat. Warna level boleh dipakai luas, tapi tombol utama & tab aktif tetap biru `--accent`.

## Di mana menulis CSS

`src/styles.css` berlapis; aturan paling bawah menang. Lapisan terakhir = "Gaya Preline (tahap 5)".
Untuk fitur baru, tulis bagian baru di akhir file yang langsung memakai token & pola di atas.

## Sebelum selesai

1. `npm run build` harus berhasil.
2. Cek tampilan terang, gelap, dan HP 390px. Pengguna lebih suka mengecek sendiri lewat `npm run preview`:
   beri daftar singkat apa yang perlu dilihat.
3. Catat perubahan tampilan yang berarti di `PROGRESS.md`.
