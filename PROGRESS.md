# Progres — Roadmap Belajar AI

_Terakhir diperbarui: 12 November 2026_

## Permintaan terakhir
"Tambahkan info lebih lengkap mengenai langkah-langkahnya kemudian contoh kasus yang sesuai."

## Sudah selesai ✅
- **Langkah-langkah + contoh kasus untuk 76 topik**, di file terpisah:
  `src/data/guides-python.js`, `guides-data.js`, `guides-ml.js`, `guides-advanced.js`.
  Digabung otomatis di `src/roadmap.js`.
- **Langkah penerapan + studi kasus dengan kode untuk 18 algoritma**: `src/data/algo-guides.js`.
- Tampilan: `src/components/Guide.jsx` (komponen `Steps` & `CaseStudy`), dipakai di
  `Lesson.jsx` dan `pages/AlgorithmsPage.jsx`. Style ditambahkan di akhir `src/styles.css`.
- Studi kasus yang sudah diperbaiki: A* (peta 14×30), RNN (sudah mengalahkan baseline),
  SVM (data lebih realistis), KNN (format angka), teks hasil regresi logistik.
- Contoh "Efek regularisasi (weight decay)" di `src/data/phases-ml.js` diganti demo yang lebih jelas.
- Uji terakhir yang lengkap: semua kode jalan tanpa error/warning, kecuali `py-error` contoh ke-2
  yang **sengaja** error (IndexError).

## Diselesaikan di sesi lanjutan ✅
- Naive Bayes: catatan "data nyata biasanya 90–98%" + uji pesan jebakan dengan `P(penipuan)` sudah ada dan jalan.
- **Bug diperbaiki**: contoh "Efek regularisasi" di `phases-ml.js` punya SyntaxError (`print("` terpotong baris
  baru). Sekarang memakai `\n` dan hasilnya sesuai: alpha=0.1 punya error uji terkecil.
- Semua 116 kode yang bisa dijalankan diuji ulang: lulus semua (kecuali `py-error` yang sengaja error dan
  `py-kondisi` yang butuh `input()`; di aplikasi diisi lewat kotak "Input program").
- Dicek: 76/76 materi dan 18/18 algoritma punya langkah-langkah + contoh kasus.
- `npm run build` berhasil.
- `README.md` diperbarui (fitur langkah & contoh kasus, struktur file baru).

## Level belajar (permintaan baru) ✅
- 5 level berurutan di `src/data/levels.js`: Pemula (Beginner) → Menengah (Intermediate) → Mahir (Advanced)
  → Ahli (Expert) → Profesional (Pro). Field `level` lama yang tidak konsisten di `phases-*.js` dihapus.
- Sidebar roadmap dikelompokkan per level; kepala tahap & tombol "Lanjutkan belajar" menampilkan level.
- Ensiklopedia Algoritma: diurutkan dari level termudah, ada label warna dan filter per level.

## Materi lebih lengkap & dalam (permintaan baru) ✅
- Bagian **🔬 Pendalaman** untuk 88 materi: `src/data/deep-python.js`, `deep-data.js`, `deep-ml.js`,
  `deep-advanced.js` (konsep, contoh lanjutan, kesalahan umum, tips, cek pemahaman). Komponen `DeepDive`
  dan `CheckQuestions` di `src/components/Guide.jsx`.
- Latihan baru untuk materi yang sebelumnya tanpa latihan (latihan asli tidak ditimpa).
- 12 materi baru di `src/data/topics-extra.js`: py-modul-std, pyl-regex, mat-info, ds-timeseries,
  ml-imbalance, ml-tuning, ml-interpretasi, dl-autoencoder, llm-sampling, cv-generatif, dep-optimasi, kar-etika.
- Semua kode baru sudah dijalankan dan output-nya dicek sesuai dengan penjelasan teks.
- Catatan teknis: di dalam py`...` jangan menulis `${` (bentrok dengan template JS), dan pakai
  `hidden_layer_sizes=` (bukan argumen posisional) untuk MLPClassifier/MLPRegressor.

## Tampilan untuk memudahkan pemahaman ✅
- Setiap materi dibagi menjadi tahapan belajar (Pahami → Langkah & kasus → Coba kode → Pendalaman → Uji diri)
  dengan stepper, tombol "Lanjut", tanda ✓ untuk tahap yang sudah dibuka, perkiraan waktu baca,
  dan opsi "Tampilkan semua sekaligus" (`src/components/Lesson.jsx`).
- Kesalahan umum ditampilkan dua kolom Salah vs Benar; konsep pendalaman jadi kartu bernomor;
  cek pemahaman dengan tombol "Lihat jawaban" (`src/components/Guide.jsx`).
- Bug CSS: `.topics li` ikut mengenai semua `li` di dalam materi → diganti `.topics > li`.
- Emoji 🪜 (tidak tampil di Windows 10) diganti 🧭.
- HP: daftar tahap jadi strip geser horizontal yang otomatis menuju tahap aktif; padding diperkecil.
- Sudah dicek dengan screenshot Chrome headless: desktop, HP (390 px), dan mode gelap.

## Tampilan dipercantik ✅
- Header jadi banner bergradien + cincin progres (`ProgressRing` di `App.jsx`) dan statistik level/tahap/materi.
- Setiap level punya warna (`color` di `src/data/levels.js`), dipakai lewat variabel CSS `--lvl` di sidebar,
  banner tahap, nomor materi, stepper materi, kartu "Lanjutkan belajar", dan label level.
- Tab utama berbentuk pil; daftar materi bernomor (01, 02, ...); proyek akhir berbingkai putus-putus.
- Kartu algoritma punya ikon & warna per kategori (`KATEGORI` di `AlgorithmsPage.jsx`) dan banner di halaman detail.
- Font Plus Jakarta Sans (Google Fonts, dengan fallback font sistem), favicon 🤖, bayangan & efek hover halus.
- Semua gaya baru ada di bagian "Tema visual" di akhir `src/styles.css`.
- Dicek dengan screenshot: desktop, HP 390 px, dan mode gelap.

## Animasi cara kerja algoritma ✅
- 18 animasi langkah demi langkah di halaman detail algoritma (setelah "Apa itu?").
  Pemutar: `src/components/AlgoAnimation.jsx` (putar/jeda, maju/mundur, penggeser langkah, kecepatan
  0,5×/1×/2×, tombol panah & spasi, keterangan per langkah, legenda). Dimuat terpisah (lazy, ±53 KB).
- Isi animasi di `src/animations/` (`kit.jsx` perkakas SVG, `supervised.jsx`, `unsupervised.jsx`,
  `deep.jsx`, `search.jsx`, daftar di `index.js`). Setiap animasi benar-benar menjalankan algoritmanya
  pada data kecil dengan seed tetap (gradient descent, split Gini, K-Means, DBSCAN, A*, Q-learning, dst.).
  Pengecualian: bobot attention Transformer dibuat ilustratif.
- Warna kelas: 3 slot pertama palet kategorikal tervalidasi (aman buta warna) + bentuk berbeda per kelas.
- Diuji di Chrome headless: ke-18 animasi dijalankan sampai langkah terakhir tanpa error;
  tampilan dicek di desktop, HP, dan mode gelap.
- Bug yang ditemukan & diperbaiki: pindah algoritma membuat pemutar crash (sekarang di-reset dengan `key`).

## Kamus istilah + bahasa bayi ✅
- `src/data/glosarium.js`: 167 istilah, masing-masing punya `arti`, `bayi` (penjelasan super sederhana dengan
  perumpamaan), `alias`, `kategori`, dan `topik` (materi yang membahasnya). Istilah bertanda `umum: true`
  (mis. "model") ada di kamus tapi tidak disorot di teks.
- Tab baru **📖 Kamus** (`src/pages/KamusPage.jsx`, rute `#/kamus` dan `#/kamus/<id>`): cari, filter kategori,
  lompat per huruf, mode "bahasa bayi saja", tautan ke materi.
- Istilah di teks materi diberi garis titik-titik dan bisa diklik/disorot → popup arti + bahasa bayi
  (`src/components/Istilah.jsx`, dipakai otomatis oleh `RichText` di dalam `<LingkupIstilah>`).
  Aktif di tahap Pahami, Langkah & kasus, Pendalaman, serta "Apa itu?" & "Cara kerja" di halaman algoritma.
  Setiap istilah hanya disorot pada kemunculan pertama di satu bagian agar teks tidak ramai.
- Kotak "📚 Istilah di materi ini" di tahap Pahami (maks. 8 istilah).
- Catatan: alias yang terlalu umum sengaja tidak dipakai (mis. "CV", "agen", "tree"), karena bisa salah sorot.
- Diuji di Chrome headless (desktop & HP): tanpa error konsol.

## Bahasa bayi ditulis langsung di materi ✅
- `src/data/bayi.js`: `bayiMateri` (88 materi) dan `bayiAlgoritma` (18 algoritma), masing-masing berisi
  `cerita` (penjelasan dengan perumpamaan sehari-hari) dan `intinya` (satu kalimat).
- Ditampilkan sebagai kotak "👶 Versi bahasa bayi" (komponen `KotakBayi` di `src/components/Istilah.jsx`):
  paling atas di tahap Pahami setiap materi, dan sebelum "Apa itu?" di halaman algoritma.
- Materi baru wajib diberi entri di `bayi.js` (dicek: 88/88 materi, 18/18 algoritma).
- Perbaikan: pencocokan istilah tidak lagi memotong kata bertanda hubung (mis. "feed-forward").

## Tombol donasi Saweria ✅ (username: tantowiyyt)
- `src/config.js` → isi `DONASI.saweria` dengan username Saweria. Selama kosong, tombol tidak tampil.
- `src/components/Donasi.jsx`: kartu ajakan donasi di atas footer + tombol kecil di footer, membuka
  https://saweria.co/<username> di tab baru. Username divalidasi (huruf/angka/._-).

## Pembaruan materi agar tetap terkini (10 November 2026) ✅
- Contoh chatbot di Pendalaman "Memakai API LLM": `claude-sonnet-4-5` (deprecated, pensiun 30 Nov 2026)
  → `claude-opus-5-5` dengan streaming, `effort: low`, dan fallback otomatis saat ditolak (`fallbacks="default"`).
- Contoh dasar Claude API: membaca blok `text` (bukan `content[0]`, karena thinking selalu aktif), `max_tokens`
  dinaikkan, dan cek `stop_reason == "refusal"`.
- `temperature`/`top_p`/`top_k` sudah dihapus di Claude API versi 2026-10-21: materi Strategi sampling, glosarium,
  dan Pendalaman API diberi catatan; saran praktis diganti structured output/prompt (konsep tetap diajarkan).
- Harga contoh diperbarui ke harga per Oktober 2026 (Sonnet 5.5, Opus 5.5, Haiku 5.5); tautan dokumentasi ke platform.claude.com/docs.
- Bagian yang cepat berubah dan perlu dicek berkala: nama model & harga LLM, versi Python, versi YOLO (Ultralytics), versi Pyodide.

## Komentar di setiap contoh kode (10 November 2026) ✅
- 301 contoh kode di semua file materi (phases-*, algorithms, algo-guides, deep-*, topics-extra) diberi komentar
  bahasa Indonesia per baris: import, langkah data, rumus, dan alasan setiap langkah.
- Komentar ditaruh di akhir baris; untuk baris panjang (> 92 karakter), baris lanjutan `\`, isi string tiga kutip,
  dan Dockerfile, komentar ditaruh di baris atasnya agar kode tetap valid.
- Yang sengaja tidak diberi komentar tambahan: contoh teks/markdown (README, template pertanyaan forum, ringkasan paper)
  dan .gitignore.
- Semua contoh yang bisa dijalankan sudah dites ulang; contoh statis dicek sintaksnya dengan `ast.parse`.

## Font dirapikan (10 November 2026) ✅
- Tiga font dengan peran jelas (dimuat dari Google Fonts di `index.html`): **Inter** untuk teks biasa (lebih lega dan
  mudah dibaca di ukuran kecil), **Plus Jakarta Sans** untuk judul & angka besar, **JetBrains Mono** untuk kode.
- Sekitar 20 ukuran font acak (0.7–2.1rem) disatukan menjadi skala token di `:root` (`src/styles.css`):
  `--fs-xs` 12px, `--fs-sm` 13px, `--fs-md` 14px, `--fs-body` 15px, `--fs-base` 16px, `--fs-lead` 17px,
  `--fs-lg` 18px, `--fs-xl` 22px, `--fs-2xl` 26px, `--fs-3xl` 34px, `--fs-code`, dan `--lh-read` (1.65).
  **Aturan: pakai token ini, jangan menulis ukuran rem baru.** Ukuran ikon emoji dan teks SVG animasi (px) tidak diubah.
- Judul kecil (h3 dan h4 di materi/algoritma/animasi) memakai Inter 650, karena Plus Jakarta Sans tebal terlihat sesak di
  ukuran kecil. Plus Jakarta Sans hanya untuk judul besar. Inter dimuat sebagai font variabel (`wght@400..700`).
- HP: tombol "Tahap sebelumnya / berikutnya" dibuat sama lebar dan satu baris.
- Screenshot sekarang diambil dengan puppeteer-core (emulasi HP 390 px yang benar + cek scroll horizontal + error konsol).
- Angka statistik memakai `tabular-nums`; judul memakai `text-wrap: balance`. Aturan tambahan di bagian "Tipografi" di akhir CSS.
- Dicek dengan screenshot (desktop, HP, mode gelap) dan `npm run build` berhasil.

## Halaman Kamus dirapikan (10 November 2026) ✅
- Kartu istilah: tautan "Dibahas di" selalu di dasar kartu (dipisah garis tipis), sehingga sejajar dalam satu baris.
  Teks kartu 15px; "juga disebut" jadi baris kecil abu-abu (`.ki-alias`).
- Kotak bahasa bayi di kartu kamus lebih kalem: garis kuning di kiri (`.kamus-bayi`). Popup istilah tidak berubah.
- Judul huruf menampilkan jumlah ("A · 7 istilah"); saat dicari/difilter muncul "Menampilkan X dari 167 istilah".
- Saat istilah tidak ditemukan: kotak kosong dengan saran dan tombol "Hapus pencarian & filter".
- Desktop: kotak cari, kategori, dan huruf A–Z menempel di atas saat menggulir (latar padat).
- HP: kategori dan huruf A–Z masing-masing satu baris yang bisa digeser (sebelumnya 3 + 2 baris).
- Mode "bahasa bayi saja": kartu tidak ditarik setinggi baris, jadi tidak ada ruang kosong.


## Rata kanan-kiri (10 November 2026) ✅
- Atas permintaan: paragraf penjelasan dibuat rata kanan-kiri **di semua layar, termasuk HP** (materi, langkah, studi kasus,
  Pendalaman, bahasa bayi, cek pemahaman, halaman algoritma, keterangan animasi). Aturan di bagian "Rata kanan-kiri" di akhir CSS.
- Kartu kamus, popup istilah, kolom Salah/Benar, dan daftar tetap rata kiri.
- Catatan: di HP beberapa baris jadi renggang karena browser tidak memotong kata bahasa Indonesia dengan tanda hubung.
- Kode di dalam kalimat dibuat `inline-block` supaya spasinya tidak ikut direnggangkan.

## Animasi mini di kartu algoritma (10 November 2026) ✅
- `src/animations/mini.jsx`: 18 animasi kecil (SVG + animasi CSS, tanpa JS) di bagian atas setiap kartu algoritma.
  Siklus 5 detik. Keyframe "muncul berurutan" dibuat otomatis di mini.jsx (mp/mt/ms/mx/md/mk) agar urutan tetap
  sinkron setiap putaran; CSS di bagian "Animasi mini kartu" di styles.css.
- Keadaan dasar elemen = keadaan akhir, jadi dengan "kurangi gerakan" (prefers-reduced-motion) gambarnya tetap utuh.
- Label "target" di animasi Gradient Boosting sudah diperbaiki (lihat sesi lanjutan di bawah).

## Bank proyek & panduan dataset (10 November 2026) ✅
- Tab baru **🛠️ Proyek** (`src/pages/ProyekPage.jsx`, rute `#/proyek`, `#/proyek/<id>`, `#/proyek/<id-tahap>`, `#/proyek/dataset`).
- `src/data/proyek.js`: 45 proyek untuk 11 tahap (3–6 per tahap). Setiap proyek: ringkasan, **dataset** (nama, cara
  mendapatkan/membuat, tautan sumber, contoh kode), langkah, hasil akhir, tantangan, keterampilan, algoritma terkait.
  Cara dataset: siap pakai, API, scraping, survei, foto, catat sendiri, sintetis (filter di halaman).
  Tautan yang alamat persisnya tidak pasti memakai tautan pencarian Kaggle (`cariKaggle`).
- `src/data/dataset-guide.js`: alur mencari dataset, 7 sumber siap pakai, 6 sumber data Indonesia (BPS, Satu Data,
  BMKG, Open-Meteo, IndoNLP, JDIH BPK), contoh kode mengambil data, 6 cara membuat dataset sendiri (dengan etika,
  UU PDP No. 27/2022), contoh kode membuat & memeriksa dataset, checklist kualitas, format penyimpanan.
- Detail proyek dirapikan: 2 kolom di layar ≥ 900px (isi utama + panel "Ringkasan proyek" yang menempel: level, durasi,
  cara data, keterampilan, bekal roadmap, tombol "Tandai sudah dikerjakan"); judul bagian seragam (`.proyek-h`);
  proyek lain di tahap yang sama tampil sebagai kartu. Di HP, deskripsi langkah proyek tetap rata kiri.
- Status "sudah dikerjakan" proyek disimpan terpisah di localStorage `roadmap-ai-proyek-selesai` (tidak memengaruhi progres roadmap).
- Kotak "Proyek akhir tahap" di roadmap kini punya tautan "Lihat N ide proyek untuk tahap ini".
- Materi baru **`ds-dataset` "Mencari & membuat dataset"** (tahap Data Science, setelah Pandas) di `topics-extra.js`,
  lengkap dengan bayi.js, contoh, latihan, studi kasus UMKM, dan pendalaman. Total materi jadi 89.
- 4 istilah kamus baru: web scraping, data sintetis, pelabelan data (anotasi), lisensi data (total 171).
- Semua kode yang bisa dijalankan (13) diuji dengan Python lokal; satu dijalankan langsung di Pyodide. Kode statis dicek
  sintaksnya. Catatan: pandas 3 memakai tipe `str` untuk teks, jadi jangan cek `dtype == object`.

## Editor kode dipercantik (10 November 2026) ✅
- `src/components/CodeRunner.jsx` ditulis ulang tampilannya (logika menjalankan Python tidak berubah): jendela gelap ala
  VS Code dengan bilah judul (titik warna, tab nama file seperti `main.py`/`terminal`/`data.csv`, tombol Salin & Reset),
  tombol ▶ Jalankan hijau, petunjuk `Ctrl`+`Enter` (⌘ di Mac), panel "Keluaran" bergaya terminal dengan status
  "✓ Selesai · waktu" / "✗ Error" dan tombol Bersihkan.
- Tema warna token di `src/components/editorTheme.js` (selalu gelap, juga di mode terang). `@lezer/highlight` dan
  `@codemirror/language` kini tercatat di package.json (versi sama dengan yang sudah terpasang).
- Contoh kode statis (runnable: false) kini juga berwarna (CodeMirror read-only), baris panjang digeser, bukan dilipat.
- Ligatur JetBrains Mono dimatikan agar `->` tidak tampil sebagai panah.

## Substansi ditambah: kuis, latihan, 4 materi baru (10 November 2026) ✅
- **Kuis 10 soal per tahap** (110 soal, sebelumnya 1–3): `src/data/kuis-extra.js` (82 soal baru), digabung di roadmap.js.
  Urutan pilihan diacak deterministik dari teks soal (`acakTetap`), jadi posisi jawaban benar tersebar (26/17/18/21).
- **Latihan untuk 24 materi** yang belum punya (`src/data/latihan-extra.js`). Kini 93/93 materi punya latihan.
  Latihan `runnable: false` (terminal, Git, Docker, PyTorch, FastAPI, karier) tampil sebagai contoh jawaban tanpa editor kosong;
  `Lesson.jsx` mendukung `ex.runnable`, `ex.file`, `ex.note`.
- `CodeRunner` punya prop `file` (nama tab). Pewarnaan Python hanya untuk file `.py`; terminal/README/Dockerfile polos.
- **4 materi baru** di `src/data/topics-baru.js` (digabung setelah topics-extra, jadi `after` boleh menunjuk materi tambahan):
  `mat-inferensi` (statistik inferensial & A/B test), `ml-rekomendasi` (sistem rekomendasi), `ml-rl` (reinforcement learning
  dasar + RLHF), `cv-audio` (audio, Whisper, CLIP/multimodal). Lengkap: bayi.js, contoh, latihan, langkah, studi kasus, pendalaman.
  Total materi 93, total item progres 104.
- 9 istilah kamus baru (total 180): interval kepercayaan, A/B test, reward & policy, eksplorasi vs eksploitasi,
  collaborative filtering, cold start, spektrogram, ASR, model multimodal. Tautan p-value & reinforcement diarahkan ke materi baru.
- 4 proyek baru (total 49): analisis A/B test, rekomendasi film MovieLens, simulasi bandit promo, transkrip kuliah.
- Pengujian: semua kode baru (contoh, latihan, studi kasus) dijalankan dengan Python lokal; contoh A/B test (SciPy) dan
  spektrogram (matplotlib) juga dijalankan langsung di Pyodide. Kode statis dicek sintaksnya.
- Catatan uji di Windows: pakai `python -X utf8` agar karakter ✓/✗ bisa dicetak di konsol.

## Lanjutan: 3 materi baru + ujian akhir per level (10 November 2026) ✅
- Label "target" di animasi mini Gradient Boosting dipindah agar tidak tertutup batang.
- **3 materi baru** di `src/data/topics-baru2.js` (diproses setelah topics-extra & topics-baru):
  `ds-data-besar` (hemat memori, chunksize, Parquet, Polars lazy, DuckDB), `ml-anomali` (z-score, IQR, Isolation Forest,
  LOF, median bergerak + MAD), `dep-cicd` (tes data, gerbang kualitas model, GitHub Actions, DVC, validasi skema).
  Contoh Parquet/Polars/DuckDB `runnable: false` (pyarrow & polars tidak tersedia di Pyodide/lokal); sisanya dites.
  Total materi 96, item progres 107. Lengkap dengan bayi.js, latihan, studi kasus, pendalaman.
- 4 istilah baru (total 184): Parquet, Isolation Forest, CI/CD, DVC. 3 soal kuis baru (data-science, ML, deploy jadi 11).
- 3 proyek baru (total 52): taksi NYC dengan Parquet/Polars, anomali sensor (NAB), pipeline CI untuk model.
- **🎓 Ujian akhir per level**: tab baru `#/ujian` (`src/pages/UjianPage.jsx`, data `src/data/ujian.js`, 12 soal × 5 level).
  Satu soal per layar, navigasi nomor soal, dinilai di akhir, lulus ≥ 75% (`BATAS_LULUS`). Hasil menampilkan pembahasan
  soal yang salah + tombol "Pelajari lagi" yang membuka materinya. Skor terbaik di localStorage `roadmap-ai-ujian`.
  Tautan "🎓 Ujian akhir level ..." di bawah setiap level pada sidebar roadmap.
- Posisi jawaban benar di ujian diratakan (`ratakan`, pola A/B/C/D per 4 soal) setelah tes menunjukkan strategi
  "selalu A" sempat mendapat 58%; sekarang 25%. Pengacak bersama dipindah ke `src/data/acak.js`.

## Data warehouse, latihan acak, pencapaian & sertifikat (10 November 2026) ✅
- Materi baru `ds-warehouse` "Data warehouse, ETL & Spark" (setelah ds-data-besar, di `topics-baru2.js`): skema bintang
  dengan SQLite (bisa dijalankan di browser), ETL data mentah berantakan, PySpark (`runnable: false`), latihan window
  function, studi kasus UMKM 3 cabang dengan pengecekan total otomatis. Total materi 97, item progres 108.
- 3 istilah baru (data warehouse, ETL/ELT, Apache Spark; total 187), 1 soal kuis data-science (jadi 12),
  1 proyek baru "Mini data warehouse dari data Online Retail" (total 53).
- Halaman 🎓 Ujian kini punya sub-menu: Ujian per level · **🔀 Latihan acak** (`#/ujian/acak`: soal acak dari semua kuis
  tahap, filter level & 5/10/20 soal, memakai komponen Quiz) · **📜 Pencapaian & sertifikat** (`#/ujian/pencapaian`).
- Pencapaian: nama (localStorage `roadmap-ai-nama`), materi selesai, ujian lulus, proyek dikerjakan, progres per level.
  Sertifikat muncul per level yang lulus ujian; tombol "Cetak / simpan sebagai PDF" memakai window.print().
  Saat mencetak, sertifikat disalin ke `.cetak-portal` (React portal di bawah body) dan semua elemen lain disembunyikan,
  sehingga hasilnya tepat 1 halaman A4 mendatar (dicek dengan puppeteer page.pdf). Sertifikat diberi catatan
  "bukti belajar mandiri, bukan sertifikat resmi". `App.jsx` meneruskan `done` ke `UjianPage`.

## Ulang soal (pengulangan berjarak) & tombol tema (10 November 2026) ✅
- **🧠 Ulang soal** (`src/ulang.js`, halaman `#/ujian/ulang`): sistem kotak Leitner. Soal yang salah di kuis tahap, latihan
  acak, atau ujian masuk kotak 1 (jatuh tempo hari ini). Benar → kotak berikutnya dengan jarak 0/1/3/7/14 hari; benar di
  kotak 5 → "dikuasai". Salah → kembali ke kotak 1. Data + salinan soal di localStorage `roadmap-ai-ulang`; id soal = hash teks.
  `Quiz.jsx` mencatat setiap jawaban (prop `sumber`), ujian mencatat saat dikumpulkan. Jumlah soal jatuh tempo tampil
  sebagai angka merah di tab 🎓 Ujian dan sub-menu "Ulang soal" (event `ulang-berubah` + `storage`).
- **Tombol tema** di ujung baris tab: Otomatis → Terang → Gelap (`src/tema.js`, localStorage `roadmap-ai-tema`, atribut
  `data-theme` di `<html>`). Skrip kecil di `index.html` memasang tema sebelum React dimuat (tanpa kedipan).
  CSS: setiap blok gelap kini `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` + `:root[data-theme="dark"]`.
  Satu blok media kosong sisa lama dihapus. Catatan: `src/useDarkMode.js` sudah tidak dipakai komponen mana pun.
- Diuji di Chrome headless: salah 2 soal → angka 2 di tab; dijawab benar di Ulang soal → pindah ke kotak 2 & angka hilang;
  jawaban ujian ikut tercatat; tema Terang tetap terang saat sistem gelap, tema bertahan setelah reload.
- PWA sengaja tidak dibuat (permintaan pengguna).

## Cadangan lengkap & penyimpanan permanen (10 November 2026) ✅
- Konteks: semua data pengguna disimpan di localStorage browser (bukan di hosting), jadi tidak hilang saat web di-reload
  atau di-update, tetapi hilang jika data browser dihapus, ganti perangkat/browser, ganti domain, atau Safari menghapus
  data situs yang ±7 hari tidak dibuka.
- `src/cadangan.js`: **⬇️ Ekspor semua data** mengumpulkan SEMUA kunci `roadmap-ai-*` (progres & catatan, ujian, ulang soal,
  proyek selesai, nama, tema, playground) ke `roadmap-ai-cadangan-YYYY-MM-DD.json` (format `{ aplikasi, versi: 2, dibuat, data }`).
  **⬆️ Impor data** meminta konfirmasi, memulihkan semua kunci, lalu memuat ulang halaman; file ekspor format lama
  (`{ done, notes }`) tetap bisa dibaca. **Reset** kini menghapus semua data belajar (tema dibiarkan) lalu memuat ulang.
- Penyimpanan permanen: `navigator.storage.persist()` diminta sekali setelah pengguna punya progres; footer menampilkan
  "(penyimpanan permanen aktif ✓)" jika diizinkan browser, plus saran untuk rutin mengekspor cadangan.
- Diuji: ekspor berisi 7 kunci (data situs lain tidak ikut), impor memulihkan semuanya (progres tampil 2/108, tema gelap,
  skor ujian, nama), impor format lama, reset menyisakan tema + progres kosong.

## Catatan upload ke hosting (10 November 2026)
- Panduan lengkap ada di `README.md` bagian "Upload ke hosting". Ringkasnya: `npm run build`, lalu upload isi `dist/`
  (Netlify drop, Vercel/Cloudflare Pages, cPanel `public_html/`). GitHub Pages di sub-folder: `npx vite build --base=/nama-repo/`
  (worker Python memakai `import.meta.env.BASE_URL`, jadi aman di sub-folder). Routing memakai `#`, tidak perlu rewrite.
- Data pengunjung ada di localStorage masing-masing browser (lihat bagian "Cadangan lengkap" di atas), tidak di hosting.
- Jika domain/alamat web berganti, progres pengunjung lama tidak ikut pindah: sarankan mereka memakai Ekspor/Impor.

## Statistik belajar & streak (11–12 November 2026) ✅
- `src/aktivitas.js`: catatan per hari di localStorage `roadmap-ai-aktivitas` (ikut ekspor/impor): materi & proyek selesai
  (daftar id, jadi centang ulang tidak dihitung dobel), soal dijawab/benar, kode dijalankan. Data > 400 hari dibuang.
  Dicatat dari App.jsx (centang materi), ProyekPage, ulang.js (`catatJawaban` → semua kuis/ujian), CodeRunner.
- Proyek akhir tahap (`project:<tahap>`) dihitung sebagai **proyek**, bukan materi (`catatMateri` mengarahkannya).
- Halaman `#/ujian/statistik` (`src/pages/StatistikBelajar.jsx`): streak sekarang & terpanjang, ubin 7 hari vs minggu lalu,
  kalender aktivitas 26 minggu (SVG, tooltip), tabel 14 hari. Lencana 🔥 streak di banner atas menuju halaman ini.
- HP: kalender tidak lagi mengecil; ukuran kotak tetap (min 560px) dan bisa digeser, mulai dari minggu terbaru.

## Aplikasi lebih ringan: pemuatan terpisah (12 November 2026) ✅
- File JS awal turun dari 1,9 MB (660 KB gzip) menjadi ±710 KB (±245 KB gzip).
- Halaman Algoritma, Playground, Kamus, Proyek, Ujian memakai `React.lazy` + `Suspense` di `App.jsx` ("Memuat halaman…").
  Jumlah ide proyek per tahap diambil dengan dynamic import `ProyekPage.jsx` (`useJumlahProyek`).
- Editor kode: semua tempat memakai `src/components/KodeLazy.jsx` (CodeMirror dimuat saat dibutuhkan; sementara itu kode
  tampil sebagai teks `.kode-memuat`). **Jangan import `CodeRunner.jsx` langsung.**
- Isi panjang materi (guides-*, deep-*, bayiMateri, latihan-extra) dipindah dari `roadmap.js` ke `src/materi-detail.js`
  (`lengkapiMateri`), dimuat oleh `Lesson.jsx` saat materi dibuka ("Memuat materi…", ada tombol coba lagi jika gagal).
  Akibatnya objek materi di `roadmap` **tidak** berisi steps/case/deep/bayi/exercise dari file-file itu; hanya Lesson yang memakainya.
- Build masih memberi peringatan chunk > 500 KB (file utama ±710 KB, berisi phases-* & topics-* & glosarium). Aman.
- Dicek manual oleh pengguna di `npm run preview`: materi, editor, semua tab, proyek, kalender HP — aman.

## 🔍 Pencarian global (12 November 2026) ✅
- `src/components/CariGlobal.jsx`: satu kotak cari untuk materi (judul, ringkasan, penjelasan), algoritma, 187 istilah kamus
  (termasuk alias), proyek (dimuat saat kotak dibuka), dan halaman (ujian, statistik, sertifikat, dataset, dst.).
- Dibuka lewat tombol 🔍 Cari di ujung baris tab, `Ctrl`/`⌘`+`K`, atau `/`. Di HP tombolnya jadi bilah cari penuh di atas tab
  dan kotak cari tampil layar penuh. Navigasi ↑ ↓ Enter Esc, kata yang cocok disorot, maks. 6 hasil per kelompok.
- Materi dibuka dengan `goTo(tahap, materi)`; lainnya lewat hash (`#/algoritma/<id>`, `#/kamus/<id>`, `#/proyek/<id>`).
- Dicek pengguna: berhasil.

## Tampilan "buku pelajaran" (12 November 2026) ✅
- Permintaan: tampilan lama terasa "AI-slop" (banner gradien ungu-pink, lingkaran dekorasi, tab pil, bayangan di semua kartu).
  Emoji **sengaja dipertahankan** (pilihan pengguna).
- Token warna di `:root` (styles.css): kertas `--bg #f6f3ea`, halaman `--card #fffdf7`, tinta `--text #1f1d18`, satu aksen
  hijau tua `--accent #1d6b4c` (gelap: `#79c29d` di atas `#191815`). Bayangan (`--shadow*`) = none, `--radius` = 6px.
- Judul memakai **Source Serif 4** (`--font-head`, Google Fonts di index.html; Plus Jakarta Sans dihapus). Teks tetap Inter.
- Bagian "Tema visual" di styles.css ditulis ulang: kepala halaman tanpa banner (garis ganda di bawah, progres berupa garis tipis
  `.hero-bar` di App.jsx, bukan cincin), tab bergaris bawah, sidebar seperti daftar isi, daftar materi berupa baris bergaris,
  kartu tanpa bayangan. Semua `border-radius` 10–29px diganti `var(--radius)`.
- Penyesuaian lain ada di bagian paling akhir CSS: donasi, proyek, ujian, sertifikat, editor (titik "jendela Mac" disembunyikan,
  tombol Jalankan hijau polos), kalender statistik jadi skala hijau.
- Warna level di `levels.js` dibuat lebih kalem. Untuk teks berwarna level pakai `--lvl-ink` (dicampur dengan --text agar kontras).
- **Tahap 2 (penyempurnaan)**, bagian terakhir styles.css: teks bacaan materi memakai serif (`--font-read`, Source Serif 4
  400–700 + italic), penunjuk tahap materi seperti daftar bab (garis bawah, nomor berbingkai), satu gaya kotak catatan
  (garis kiri 3px + rona tipis via `--note`) untuk bahasa bayi, kegunaan, tips, contoh kasus, istilah; nomor langkah/konsep
  berbingkai tipis; konsep pendalaman dipisah garis, bukan kotak; kotak centang bergaya tinta; kode inline rona kertas;
  kartu proyek bergaris atas tipis; lencana cara-data & tautan ujian di sidebar dibuat kalem.
- **Tahap 3**, bagian paling akhir styles.css: kuis bergaya lembar soal (pilihan berhuruf A–D berbingkai lingkaran,
  2 kolom di desktop tanpa pilihan yatim, 1 kolom di HP; penjelasan benar/salah memakai pola `--note`); kotak "Proyek akhir
  tahap" jadi kotak catatan berwarna level (bukan garis putus-putus); garis putus-putus di kaki kartu jadi garis rambut;
  strip tahap di HP: penanda aktif garis bawah (bukan balok), tanpa celah kosong, judul satu baris; detail kecil
  (warna seleksi teks, cincin fokus aksen, `text-wrap: balance` di judul, tombol & textarea radius 6px).
- **Palet netral (12 November 2026)**: pengguna menolak nuansa krem/coklat. Latar `#f7f8f7` (abu-putih), kartu `#ffffff`,
  teks `#1a1f1c`, garis `#e3e6e4`, keterangan `#5f6662`; gelap: latar `#121614`, kartu `#1a1f1c`. Aksen hijau tetap.
  Skill app-theme ikut diperbarui.
- **Tampilan bersih (tahap 4, 12 November 2026)**: pengguna bilang "kurang clean". Semua font jadi Inter (Source Serif 4
  dihapus dari index.html), garis ganda di kepala diganti 1px, rona latar di item aktif sidebar & label level dihapus,
  garis bawah kepala halaman dihapus, chip saring tanpa kotak (aktif = rona aksen tipis), ruang atas lebih lega.
- **Gaya Preline (tahap 5, 12 November 2026)**: pengguna minta mengikuti preline.co/templates. Lapisan terakhir styles.css:
  latar putih, kepala aplikasi = panel abu `#f3f4f6` radius 16px, kartu putih border `#e5e7eb` radius 12px + bayangan halus,
  aksen **biru** `#2563eb` (gelap `#3b82f6` di atas `#171717`), tombol & input radius 8px, chip aktif biru, badge pil,
  kotak catatan bergaya alert (border penuh + rona), sidebar aktif = latar abu. Skill app-theme ditulis ulang.
- **Lebih berwarna (tahap 6)**: pengguna bilang "kekurangan warna". Warna level jadi Tailwind 600 (emerald, sky, amber,
  rose, violet) di levels.js; emoji level/ujian/lanjutkan di ubin berwarna, nomor tahap sidebar berwarna level, kepala
  detail berona level, label & tombol "Mulai" ujian berwarna level, kepala aplikasi berona biru, kotak catatan beda warna.
- **Kerapian (tahap 7)**: kepala aplikasi ringkas (class `ringkas` di App.jsx) di semua halaman selain Roadmap; baris filter
  di Proyek, Algoritma, Kamus diganti satu baris toolbar: kolom cari + dropdown (`.filter-bar`, `.filter-select`); sub-tab Proyek & Ujian jadi
  kontrol segmented (latar abu, yang aktif kartu putih); kepala statistik & kotak info dirapikan.
- **Latar abu (tahap 8)**: pengguna bilang "terlalu putih". Latar halaman `#eef0f4`, kartu tetap putih, bilah tab utama
  jadi kartu putih, kepala aplikasi berona biru sedikit lebih kuat.
- **Palet Slate + Indigo (tahap 9)**: dipilih pengguna dari 4 pilihan. Latar `#f1f5f9`, teks `#0f172a`, aksen indigo
  `#4f46e5` (gelap: latar `#0b1120`, kartu `#131c2e`, aksen `#818cf8` dengan teks gelap di atasnya).
- **Penyempurnaan (tahap 10)**: tab utama aktif = rona indigo (bukan garis bawah); progres di kepala Roadmap dalam panel
  putih; judul bagian detail tahap seragam + garis pemisah antarbagian; bar progres sidebar disembunyikan bila 0%;
  materi yang terbuka diberi latar lembut; pilihan kuis ber-hover indigo.
- **Halaman detail (tahap 11)**: tautan "← Semua …" jadi tombol kecil; kepala detail algoritma & proyek berona warna
  kategori/level tanpa garis warna di atas (dan bukan kartu di dalam kartu); judul bagian seragam 18px; kotak "Hasil akhir"
  bergaya alert hijau; panel samping proyek kartu putih; pilihan ujian ber-hover indigo; bar progres pencapaian membulat;
  kartu donasi berona kuning lembut.
- **Sidebar (tahap 12)**: di desktop daftar tahap jadi satu kartu navigasi (sticky, bisa digulir sendiri); setiap baris
  sejajar pada kolom ikon/nomor 28px + teks; grup level dipisah garis tipis; label Beginner/Intermediate jadi lencana kecil;
  tautan ujian akhir kini baris yang sama bentuknya dengan baris tahap (ikon 🎓 di kotak bergaris putus warna level,
  judul "Ujian akhir" + keterangan "Level … · lulus ≥ 75%", markup di App.jsx); di HP kepala level di strip disembunyikan; bar progres tahap hanya muncul bila sudah ada kemajuan.
- **Kepala navy (tahap 13)**: permintaan pengguna — kepala aplikasi navy bergradien (#0b1437 → #172554 → #1e1b4b + rona
  radial indigo & sky), teks putih, panel progres kaca gelap, bar progres gradien indigo→sky. Satu-satunya gradien di aplikasi. Statistik "5 level · 11 tahap · 97 materi" dibungkus pil kaca transparan.
- **Daftar langkah (tahap 14)**: judul langkah 16px tebal, keterangan 15px abu (sebelumnya keterangan lebih besar dari
  judul); jarak antarlangkah seragam 14px; nomor 26px sejajar judul. Paragraf rata kanan-kiri dirapatkan sedikit (word-spacing).
- **Daftar bernomor seragam (tahap 15)**: semua lingkaran nomor/centang 26px dengan garis 1,5px, jarak ke teks 12px;
  daftar langkah di kartu "buat datasetmu sendiri" kini juga memakai lingkaran (22px), bukan angka "1."; keterangan butir
  daftar rata kiri (rata kanan-kiri hanya untuk paragraf) agar jarak antarkata tidak melebar.
- **Bilah tab (tahap 16)**: semua butir tinggi 38px & huruf 15px yang sama; tombol Cari & Tema jadi tombol polos (tanpa
  kotak) di kanan, dipisah garis tegak; label Ctrl K berupa lencana kecil; kepala ringkas tidak menampilkan pil statistik.
- **Aturan**: ikuti skill app-theme (gaya Preline). Jangan kembali ke krem/coklat, serif, atau gradien dekoratif.

## Belum dilakukan ⏳
- Belum dicek di browser HP sungguhan / Safari.
- Penjelasan teks 97 materi belum ditinjau ulang menyeluruh oleh praktisi (kode sudah dites).
- Ide berikutnya: target harian untuk streak, tombol "Laporkan kesalahan" per materi (bantu tinjauan isi),
  rangkuman per tahap yang bisa dicetak, statistik pengunjung tanpa cookie (Umami/Plausible), meta Open Graph untuk pratinjau link.
