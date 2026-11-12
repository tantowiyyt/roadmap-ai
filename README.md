# Roadmap Belajar AI

Aplikasi web untuk belajar AI dari Python dasar sampai LLM & deploy, dengan kode yang bisa langsung dicoba di browser.

## Fitur
- **5 level berurutan**: 🌱 Pemula → 🌿 Menengah → 🌳 Mahir → 🚀 Ahli → 💼 Profesional
- **Roadmap 11 tahap** (97 materi), dikelompokkan per level. Setiap materi berisi penjelasan, kegunaannya, contoh kode, dan latihan dengan petunjuk + jawaban
- **📝 Kuis 10–12 soal per tahap** (114 soal) dengan pembahasan, plus **🔀 latihan acak** dari semua kuis
- **🎓 Ujian akhir per level** (5 × 12 soal berbasis kasus): nilai lulus 75%, pembahasan, dan tautan "pelajari lagi" ke materi
- **🧠 Ulang soal**: soal yang pernah salah dijadwalkan ulang dengan pengulangan berjarak (hari ini, 1, 3, 7, 14 hari)
- **Tema Otomatis / Terang / Gelap** yang bisa dipilih manual
- **📜 Pencapaian & sertifikat**: ringkasan progres per level dan sertifikat belajar mandiri per level yang lulus, bisa dicetak/disimpan sebagai PDF
- **Langkah-langkah & contoh kasus** di setiap materi: urutan langkah praktis dari awal sampai hasil, plus satu contoh kasus nyata (situasi, langkah, hasil)
- **🔬 Pendalaman** di setiap materi: konsep di balik layar, contoh kode lanjutan, kesalahan umum + cara benar, praktik terbaik, dan **🧩 cek pemahaman** (128 soal dengan jawaban tersembunyi)
- **Python di browser** (Pyodide): NumPy, Pandas, scikit-learn, matplotlib, SciPy, SQLite tanpa install apa pun
- **Ensiklopedia Algoritma** (18 algoritma): 🎬 **animasi cara kerja langkah demi langkah**, cara kerja, kegunaan, kelebihan/kekurangan, kapan dipakai, kode yang bisa dicoba, langkah penerapan, studi kasus lengkap dengan kode, dan panduan "masalahku apa → algoritmanya apa"
- **👶 Versi bahasa bayi** di setiap materi & algoritma: penjelasan paling sederhana dengan perumpamaan sehari-hari
- **📖 Kamus istilah** (187 istilah): arti singkat + 👶 "bahasa bayi". Istilah di dalam materi bisa diklik untuk melihat artinya
- **🛠️ Bank proyek** (53 proyek): setiap proyek menjelaskan dari mana datanya didapat atau cara membuatnya sendiri, plus panduan lengkap "Cara mendapatkan dataset"
- **Playground** untuk bereksperimen bebas (kode tersimpan otomatis)
- **🔍 Pencarian global** (`Ctrl`+`K` atau `/`): materi, algoritma, istilah, proyek, dan halaman dalam satu kotak
- **📊 Statistik belajar**: streak 🔥 hari beruntun, kalender aktivitas 26 minggu, rekap mingguan
- Kuis per tahap, checklist progres, catatan pribadi, **ekspor/impor semua data** sebagai file cadangan (data tersimpan di browser pengguna, bukan di server)

## Donasi (Saweria)
Isi username Saweria di `src/config.js` (`DONASI.saweria`). Tombol "☕ Dukung via Saweria" otomatis muncul di bagian bawah halaman. Jika kosong, tombol disembunyikan.

## Menjalankan
```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # hasil di folder dist/
```
Pemuatan Python pertama kali mengunduh sekitar 10 MB dari CDN jsDelivr, jadi butuh internet.

## Upload ke hosting
Aplikasi ini sepenuhnya **statis**: tidak butuh server, database, atau backend. Cukup upload hasil build.

1. Jalankan `npm run build`. Hasilnya ada di folder `dist/` (berisi `index.html`, folder `assets/`, dan `py-worker.js`).
2. Upload **isi** folder `dist/` ke salah satu hosting berikut:
   - **Netlify**: buka app.netlify.com/drop, lalu seret folder `dist/` ke halaman itu.
   - **Vercel / Cloudflare Pages / Netlify via GitHub**: hubungkan repo, isi build command `npm run build` dan output folder `dist`.
   - **Hosting biasa (cPanel)**: upload isi `dist/` ke folder `public_html/` (atau sub-folder).
   - **GitHub Pages** (alamat `https://namakamu.github.io/nama-repo/`): build dengan
     `npx vite build --base=/nama-repo/`, lalu upload isi `dist/`. Untuk domain sendiri atau Netlify/Vercel, `--base` tidak perlu.
3. Tidak perlu aturan *rewrite/redirect*, karena alamat halaman memakai `#` (contoh `/#/kamus`).
4. Setiap kali isi materi diubah: build ulang dan upload lagi. Progres pengunjung **tidak** ikut terhapus.

**Tentang data pengunjung:** progres, skor ujian, Ulang soal, nama, dan tema disimpan di **browser masing-masing pengunjung**
(localStorage), bukan di hosting. Data tetap ada saat halaman dimuat ulang atau web di-update, tetapi bisa hilang jika
pengunjung menghapus data browser, memakai mode penyamaran, ganti perangkat/browser, atau alamat web berganti (data terikat ke
alamat, jadi progres di `localhost` tidak ikut ke domain). Safari bisa menghapus data situs yang ±7 hari tidak dibuka.
Karena itu ada tombol **⬇️ Ekspor semua data / ⬆️ Impor data** di bagian bawah halaman. Sinkron otomatis antar perangkat
butuh login + database di server (belum dibuat).

## Struktur
- `src/data/phases-*.js`: isi materi per tahap
- `src/data/levels.js`: daftar level + level setiap tahap dan algoritma
- `src/data/guides-*.js`: langkah-langkah & contoh kasus per materi (digabung ke materi di `src/roadmap.js` berdasarkan `id`)
- `src/data/deep-*.js`: pendalaman per materi (digabung di `src/roadmap.js`)
- `src/data/topics-extra.js`, `src/data/topics-baru.js`, `src/data/topics-baru2.js`: materi tambahan yang disisipkan ke tahap (`after` = posisi)
- `src/data/latihan-extra.js`: latihan untuk materi yang belum punya latihan (`runnable: false` = dikerjakan di komputer sendiri)
- `src/data/kuis-extra.js`: soal kuis tambahan per tahap (urutan pilihan diacak otomatis, lihat `acak.js`)
- `src/data/ujian.js`: soal ujian akhir per level (halaman 🎓 Ujian, `src/pages/UjianPage.jsx`)
- `src/data/proyek.js`, `src/data/dataset-guide.js`: bank proyek & panduan dataset (halaman 🛠️ Proyek)
- `src/data/glosarium.js`: kamus istilah (arti + bahasa bayi)
- `src/data/bayi.js`: penjelasan versi bahasa bayi untuk setiap materi & algoritma
- `src/data/algorithms.js`: isi ensiklopedia algoritma
- `src/data/algo-guides.js`: langkah penerapan & studi kasus per algoritma
- `src/animations/`: animasi cara kerja setiap algoritma (SVG), diputar oleh `src/components/AlgoAnimation.jsx`
- `src/components/Guide.jsx`: tampilan langkah-langkah & kartu contoh kasus
- `public/py-worker.js`: menjalankan Python (Pyodide) di Web Worker
- `src/components/CodeRunner.jsx`: editor kode + tombol jalankan

Jangan mengganti `id` materi yang sudah dipakai, karena progres disimpan berdasarkan `id`.
Contoh kode dengan `runnable: false` hanya ditampilkan (untuk PyTorch, API, Docker, dan lain-lain yang perlu Colab/komputer sendiri).

## Lisensi
- **Kode program**: [MIT](LICENSE). Bebas dipakai, asal pemberitahuan hak cipta tetap disertakan.
- **Isi materi** (teks, contoh, soal, kamus, ide proyek; terutama `src/data/`): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.id).
  Boleh dibagikan dan diubah dengan menyebut sumber, **bukan untuk komersial**, dan turunannya memakai lisensi yang sama.
- **Donasi**: salinan atau fork tidak boleh dipakai untuk mengumpulkan donasi atau uang atas nama penyalin. Tombol Saweria harus
  dihapus atau tetap mengarah ke [saweria.co/tantowiyyt](https://saweria.co/tantowiyyt). Rincian di file [LICENSE](LICENSE).

Menemukan kesalahan di materi? Silakan buka [Issue](https://github.com/tantowiyyt/roadmap-ai/issues). Masukan dari praktisi sangat membantu.
