// Langkah-langkah praktis & contoh kasus untuk tahap Fondasi, Python Dasar, Python Lanjutan.
// Format: id_topik: { steps: [[judul, penjelasan], ...], case: { title, situation, steps, result } }

export const guidesPython = {
  // ---------- FONDASI ----------
  'install-python': {
    steps: [
      ['Unduh installer Python', 'Buka python.org/downloads dan unduh versi Python 3 terbaru untuk sistem operasimu.'],
      ['Centang "Add Python to PATH"', 'Ini langkah yang paling sering terlewat. Tanpa opsi ini, perintah `python` tidak dikenali di terminal.'],
      ['Verifikasi instalasi', 'Buka terminal baru lalu ketik `python --version` dan `pip --version`. Keduanya harus menampilkan nomor versi.'],
      ['Install VS Code + ekstensi Python', 'Unduh dari code.visualstudio.com, lalu di menu Extensions cari "Python" (dari Microsoft) dan install.'],
      ['Buat file pertama', 'Buat folder `belajar-ai`, buka di VS Code, buat `hello.py` berisi `print("Halo AI")`, lalu klik tombol ▶ Run.'],
    ],
    case: {
      title: 'Siswa SMK menyiapkan laptop untuk belajar AI',
      situation: 'Dimas punya laptop Windows baru dan bingung harus mulai dari mana. Saat mengetik `python` di terminal, yang muncul malah Microsoft Store.',
      steps: [
        'Dimas menonaktifkan alias Python bawaan Windows di Settings → Apps → Advanced app settings → App execution aliases.',
        'Ia menginstall Python dari python.org dengan mencentang "Add Python to PATH".',
        'Ia menutup lalu membuka ulang terminal, dan `python --version` kini menampilkan versi yang benar.',
        'Ia menginstall VS Code beserta ekstensi Python, lalu menjalankan `hello.py`.',
      ],
      result: 'Dalam 20 menit lingkungan kerja siap dipakai. Pelajaran: jika perintah tidak dikenali, hampir selalu penyebabnya PATH.',
    },
  },
  terminal: {
    steps: [
      ['Buka terminal', 'Di Windows: PowerShell atau Terminal. Di VS Code: menu Terminal → New Terminal (Ctrl+`).'],
      ['Ketahui posisimu', 'Gunakan `pwd` untuk melihat folder aktif dan `ls` (atau `dir`) untuk melihat isinya.'],
      ['Berpindah folder', '`cd nama_folder` untuk masuk, `cd ..` untuk naik satu tingkat. Tekan Tab untuk melengkapi nama otomatis.'],
      ['Membuat folder & menjalankan skrip', '`mkdir proyek1` untuk membuat folder, `python skrip.py` untuk menjalankan file Python.'],
      ['Gunakan riwayat perintah', 'Tekan panah atas untuk mengulang perintah sebelumnya. Ctrl+C untuk menghentikan program yang sedang berjalan.'],
    ],
    case: {
      title: 'Menjalankan skrip training di server tanpa tampilan grafis',
      situation: 'Sari mendapat akses ke server kampus ber-GPU untuk melatih model. Server tidak punya tampilan desktop, hanya terminal.',
      steps: [
        'Sari login ke server lewat terminal dengan `ssh nama@alamat-server`.',
        'Ia menyalin proyeknya dengan `git clone`, lalu masuk ke folder dengan `cd`.',
        'Ia menginstall library dengan `pip install -r requirements.txt`.',
        'Ia menjalankan `python train.py` dan memantau output yang muncul di terminal.',
      ],
      result: 'Model selesai dilatih di GPU server. Tanpa kemampuan dasar terminal, server itu tidak bisa ia pakai sama sekali.',
    },
  },
  git: {
    steps: [
      ['Konfigurasi identitas (sekali saja)', '`git config --global user.name "Nama"` dan `git config --global user.email "email@contoh.com"`.'],
      ['Inisialisasi repository', 'Di folder proyek jalankan `git init`. Buat file `.gitignore` untuk mengecualikan file besar seperti dataset dan `.venv`.'],
      ['Siklus kerja: add → commit', 'Setiap kali menyelesaikan satu bagian: `git add .` lalu `git commit -m "pesan yang jelas"`.'],
      ['Hubungkan ke GitHub', 'Buat repo kosong di github.com, lalu `git remote add origin URL` dan `git push -u origin main`.'],
      ['Kembali ke versi lama bila perlu', '`git log --oneline` untuk melihat riwayat, `git restore nama_file` untuk membatalkan perubahan yang belum di-commit.'],
    ],
    case: {
      title: 'Kode notebook rusak sehari sebelum presentasi',
      situation: 'Andi mengubah fungsi preprocessing dan akurasi modelnya tiba-tiba anjlok dari 90% ke 60%. Ia tidak ingat apa saja yang diubah.',
      steps: [
        'Andi menjalankan `git diff` dan melihat persis baris mana saja yang berubah sejak commit terakhir.',
        'Ternyata ia tidak sengaja menghapus langkah normalisasi data.',
        'Ia mengembalikan file dengan `git restore preprocessing.py`.',
        'Setelah diperbaiki, ia membuat commit dengan pesan jelas: "Perbaiki: kembalikan normalisasi".',
      ],
      result: 'Masalah selesai dalam 5 menit. Sejak itu Andi selalu commit setiap kali model mencapai hasil yang bagus.',
    },
  },
  notebook: {
    steps: [
      ['Buka Google Colab', 'Kunjungi colab.research.google.com, login dengan akun Google, lalu pilih "New notebook".'],
      ['Pahami dua jenis sel', 'Sel **kode** untuk Python, sel **teks** (Markdown) untuk catatan dan penjelasan.'],
      ['Jalankan sel', 'Tekan Shift+Enter. Variabel dari sel sebelumnya tetap tersimpan selama runtime masih aktif.'],
      ['Aktifkan GPU jika perlu', 'Menu Runtime → Change runtime type → pilih GPU (T4). Wajib untuk deep learning.'],
      ['Simpan & bagikan', 'Notebook otomatis tersimpan di Google Drive. Pilih File → Save a copy in GitHub untuk portofolio.'],
    ],
    case: {
      title: 'Guru membuat bahan ajar analisis data interaktif',
      situation: 'Bu Rina ingin siswanya belajar analisis data tanpa harus menginstall apa pun di komputer lab sekolah yang terbatas.',
      steps: [
        'Bu Rina membuat notebook Colab yang berisi penjelasan (sel teks) dan kode (sel kode) secara bergantian.',
        'Ia mengunggah dataset nilai ujian ke Google Drive dan membacanya dari notebook.',
        'Ia membagikan link notebook dengan akses "Viewer". Siswa menyimpan salinan masing-masing.',
        'Siswa menjalankan sel satu per satu, mengubah angka, dan langsung melihat grafiknya berubah.',
      ],
      result: 'Pembelajaran berjalan cukup dengan browser, dan setiap siswa memiliki salinan notebook di Drive-nya sendiri.',
    },
  },

  // ---------- PYTHON DASAR ----------
  'py-variabel': {
    steps: [
      ['Pilih nama yang jelas', 'Gunakan huruf kecil dan garis bawah (`total_harga`, bukan `th`). Nama tidak boleh diawali angka atau memakai spasi.'],
      ['Isi nilai dengan tanda =', '`umur = 17`. Tanda `=` berarti "simpan ke", bukan "sama dengan".'],
      ['Kenali tipenya', 'Cek dengan `type(x)`. Angka bulat → int, desimal → float, teks dalam tanda kutip → str.'],
      ['Konversi bila perlu', 'Data dari `input()` atau file selalu berupa teks. Ubah dengan `int()` atau `float()` sebelum dihitung.'],
      ['Perbarui nilai', 'Variabel bisa diisi ulang: `skor = skor + 10` atau singkatnya `skor += 10`.'],
    ],
    case: {
      title: 'Kalkulator diskon sederhana untuk toko online',
      situation: 'Pemilik toko ingin menghitung harga akhir setelah diskon dan pajak, tanpa salah hitung manual.',
      steps: [
        'Simpan data ke variabel: `harga = 250000`, `diskon = 0.15`, `pajak = 0.11`.',
        'Hitung bertahap: `setelah_diskon = harga * (1 - diskon)`, lalu `total = setelah_diskon * (1 + pajak)`.',
        'Tampilkan dengan format rupiah: `print(f"Total: Rp{total:,.0f}")`.',
      ],
      result: 'Harga akhir Rp235.875 dihitung otomatis. Cukup ubah satu variabel untuk produk lain.',
    },
  },
  'py-operator': {
    steps: [
      ['Pilih jenis operator', 'Menghitung → aritmatika. Membandingkan → perbandingan. Menggabungkan syarat → logika.'],
      ['Perhatikan urutan operasi', 'Pangkat dahulu, lalu kali/bagi, lalu tambah/kurang. Gunakan tanda kurung agar jelas: `(a + b) * c`.'],
      ['Bedakan / dan //', '`7 / 2 = 3.5` (desimal), `7 // 2 = 3` (pembagian bulat), `7 % 2 = 1` (sisa bagi).'],
      ['Bedakan = dan ==', '`=` untuk menyimpan nilai, `==` untuk membandingkan. Tertukar keduanya adalah kesalahan pemula yang paling umum.'],
    ],
    case: {
      title: 'Membagi siswa ke dalam kelompok',
      situation: 'Ada 34 siswa yang akan dibagi menjadi kelompok berisi 4 orang. Berapa kelompok penuh yang terbentuk, dan berapa siswa yang tersisa?',
      steps: [
        '`kelompok = 34 // 4` menghasilkan 8 kelompok penuh.',
        '`sisa = 34 % 4` menghasilkan 2 siswa tersisa.',
        'Untuk menentukan nomor kelompok siswa ke-n: `(n - 1) // 4 + 1`.',
      ],
      result: 'Terbentuk 8 kelompok penuh dan 2 siswa ditambahkan ke kelompok lain. Pola `//` dan `%` ini juga dipakai untuk membagi data menjadi batch.',
    },
  },
  'py-kondisi': {
    steps: [
      ['Rumuskan syarat sebagai pertanyaan ya/tidak', 'Contoh: "apakah nilai ≥ 75?" menjadi `nilai >= 75`.'],
      ['Tulis if dengan titik dua dan indentasi', '`if syarat:` lalu baris berikutnya menjorok 4 spasi.'],
      ['Tambah elif untuk kondisi lain', 'Python mengecek dari atas ke bawah dan berhenti di syarat pertama yang benar, jadi urutkan dari yang paling ketat.'],
      ['Tutup dengan else', 'Untuk menangani semua kemungkinan yang tersisa.'],
      ['Uji batas-batasnya', 'Coba nilai tepat di batas (misalnya 75, 74, 100) untuk memastikan logikanya benar.'],
    ],
    case: {
      title: 'Sistem penentuan ongkos kirim',
      situation: 'Toko ingin ongkir otomatis: gratis jika belanja ≥ Rp200.000; Rp10.000 untuk dalam kota; Rp25.000 untuk luar kota.',
      steps: [
        'Cek syarat paling menguntungkan dulu: `if total >= 200000: ongkir = 0`.',
        '`elif kota == "Bandung": ongkir = 10000`.',
        '`else: ongkir = 25000`.',
        'Uji dengan tiga skenario: belanja besar, dalam kota, dan luar kota.',
      ],
      result: 'Aturan ongkir berjalan konsisten. Pola if-elif seperti ini juga dipakai untuk mengubah output model menjadi keputusan bisnis.',
    },
  },
  'py-loop': {
    steps: [
      ['Tentukan apa yang diulang', 'Untuk setiap item dalam koleksi → gunakan `for`. Selama kondisi tertentu benar → gunakan `while`.'],
      ['Siapkan penampung hasil', 'Misalnya `total = 0` atau `hasil = []` sebelum loop dimulai.'],
      ['Tulis isi loop', 'Proses satu item per putaran, lalu perbarui penampung.'],
      ['Pastikan loop bisa berhenti', 'Pada `while`, variabel di dalam kondisi harus berubah. Jika tidak, terjadi infinite loop.'],
      ['Gunakan break/continue seperlunya', '`break` untuk keluar lebih awal (misalnya data sudah ditemukan), `continue` untuk melewati data yang tidak valid.'],
    ],
    case: {
      title: 'Merekap nilai satu kelas',
      situation: 'Wali kelas punya daftar 30 nilai dan ingin tahu rata-rata, jumlah siswa yang lulus, dan nilai tertinggi.',
      steps: [
        'Siapkan `total = 0`, `lulus = 0`, `tertinggi = 0`.',
        '`for n in nilai:` → tambahkan ke total, jika `n >= 75` maka `lulus += 1`, dan jika `n > tertinggi` perbarui nilai tertinggi.',
        'Setelah loop selesai: `rata = total / len(nilai)`.',
      ],
      result: 'Rekap selesai dalam hitungan detik. Pola "siapkan penampung → loop → perbarui" ini adalah dasar training loop di machine learning.',
    },
  },
  'py-koleksi': {
    steps: [
      ['Pilih struktur yang tepat', 'Berurutan & bisa berubah → list. Tetap → tuple. Berlabel → dict. Unik → set.'],
      ['Buat dan isi', 'list: `x = []` lalu `x.append(...)`. dict: `d = {}` lalu `d["kunci"] = nilai`.'],
      ['Akses data', 'list: `x[0]`, `x[-1]`, `x[1:3]`. dict: `d["kunci"]` atau `d.get("kunci", default)` agar tidak error.'],
      ['Iterasi', 'list: `for item in x`. dict: `for k, v in d.items()`.'],
      ['Gabungkan struktur', 'Data nyata sering berbentuk list berisi dict: `[{"nama": "Ani", "nilai": 90}, ...]`, persis seperti JSON.'],
    ],
    case: {
      title: 'Data inventaris toko kecil',
      situation: 'Pemilik warung mencatat stok barang dan ingin tahu barang mana yang perlu dibeli ulang.',
      steps: [
        'Simpan stok sebagai dict: `stok = {"beras": 5, "gula": 1, "minyak": 0, "telur": 30}`.',
        'Cari barang dengan stok < 3: `[b for b, j in stok.items() if j < 3]`.',
        'Kategori barang yang unik disimpan dalam set agar tidak ada duplikat.',
      ],
      result: 'Daftar belanja ["gula", "minyak"] dibuat otomatis. Struktur dict seperti ini juga dipakai untuk konfigurasi model dan data JSON dari API.',
    },
  },
  'py-string': {
    steps: [
      ['Bersihkan', '`strip()` untuk membuang spasi di awal/akhir, `lower()` untuk menyeragamkan huruf.'],
      ['Pecah', '`split()` memecah teks menjadi list kata; `split(",")` memecah berdasarkan koma.'],
      ['Ubah', '`replace("lama", "baru")` untuk mengganti kata, misalnya singkatan "yg" menjadi "yang".'],
      ['Cek isi', '`"kata" in teks`, `startswith()`, `endswith()`, `isdigit()`.'],
      ['Susun kembali', '`" ".join(list_kata)` atau f-string `f"..."` untuk membuat teks baru.'],
    ],
    case: {
      title: 'Merapikan data nama pelanggan yang berantakan',
      situation: 'Data dari formulir online tidak seragam: "  budi SANTOSO ", "ANI", "citra dewi  ". Akibatnya nama yang sama dianggap berbeda.',
      steps: [
        'Bersihkan spasi: `nama.strip()`.',
        'Seragamkan format: `.title()` menghasilkan "Budi Santoso".',
        'Rapikan spasi ganda di tengah: `" ".join(nama.split())`.',
        'Bandingkan nama dalam huruf kecil saat mencari duplikat.',
      ],
      result: 'Semua nama menjadi rapi dan duplikat terdeteksi. Ini sama dengan langkah "case folding" pada NLP.',
    },
  },
  'py-fungsi': {
    steps: [
      ['Kenali kode yang berulang', 'Jika kamu menyalin-tempel kode yang sama lebih dari dua kali, jadikan fungsi.'],
      ['Tentukan input dan output', 'Apa yang dibutuhkan (parameter) dan apa yang dihasilkan (return)?'],
      ['Beri nama berupa kata kerja', '`hitung_rata()`, `bersihkan_teks()`. Nama harus menjelaskan apa yang dilakukan fungsi.'],
      ['Tulis docstring singkat', 'Kalimat pertama di dalam fungsi: `"""Menghitung rata-rata dari list angka."""`.'],
      ['Uji dengan beberapa input', 'Termasuk input ekstrem seperti list kosong atau angka negatif.'],
    ],
    case: {
      title: 'Menghitung nilai rapor dengan bobot',
      situation: 'Nilai akhir = 30% tugas + 30% UTS + 40% UAS, untuk ratusan siswa. Menghitung manual di setiap tempat rawan salah.',
      steps: [
        'Buat `def nilai_akhir(tugas, uts, uas): return 0.3*tugas + 0.3*uts + 0.4*uas`.',
        'Buat `def predikat(n):` yang mengembalikan A/B/C/D.',
        'Panggil keduanya di dalam loop untuk setiap siswa.',
        'Jika bobot berubah, cukup ubah satu fungsi.',
      ],
      result: 'Kode menjadi pendek, konsisten, dan mudah diuji. Library ML juga bekerja dengan cara ini: semuanya adalah fungsi yang bisa dipakai ulang.',
    },
  },
  'py-file': {
    steps: [
      ['Tentukan mode', '`"r"` untuk membaca, `"w"` untuk menulis baru (menimpa isi lama), `"a"` untuk menambahkan di akhir.'],
      ['Selalu gunakan with', '`with open("data.csv") as f:` agar file otomatis ditutup meskipun terjadi error.'],
      ['Tentukan encoding untuk teks Indonesia', '`open(..., encoding="utf-8")` agar karakter khusus tidak rusak.'],
      ['Baca sesuai format', 'Teks biasa → `f.read()` atau loop per baris. CSV → modul `csv` (atau nanti Pandas). JSON → `json.load(f)`.'],
      ['Tangani file yang tidak ada', 'Gunakan `try/except FileNotFoundError` atau cek dulu dengan `os.path.exists()`.'],
    ],
    case: {
      title: 'Aplikasi catatan pengeluaran harian',
      situation: 'Mahasiswa ingin mencatat pengeluaran setiap hari tanpa kehilangan data saat program ditutup.',
      steps: [
        'Setiap pengeluaran baru ditambahkan dengan mode `"a"`: `tanggal,kategori,jumlah`.',
        'Untuk laporan, file dibaca dengan `csv.DictReader` lalu dijumlahkan per kategori.',
        'Jika file belum ada, program membuatnya dengan baris header terlebih dahulu.',
      ],
      result: 'Data tersimpan permanen dan laporan bulanan bisa dibuat kapan saja. File CSV ini nantinya bisa langsung dianalisis dengan Pandas.',
    },
  },
  'py-error': {
    steps: [
      ['Baca traceback dari bawah', 'Baris terakhir berisi jenis error dan pesannya. Baris di atasnya menunjukkan file dan nomor baris penyebabnya.'],
      ['Kenali error umum', '`NameError` (variabel belum dibuat), `TypeError` (tipe data salah), `IndexError` (index di luar jangkauan), `KeyError` (kunci dict tidak ada), `ValueError` (nilai tidak valid).'],
      ['Bungkus bagian yang berisiko', 'Hanya kode yang mungkin gagal yang dimasukkan ke `try`, bukan seluruh program.'],
      ['Tangkap error yang spesifik', '`except ValueError:` lebih baik daripada `except:` yang menyembunyikan semua masalah.'],
      ['Beri pesan yang membantu', 'Catat data mana yang gagal agar bisa diperbaiki nanti.'],
    ],
    case: {
      title: 'Membaca 10.000 baris data sensor yang sebagian rusak',
      situation: 'Data suhu dari sensor IoT kadang berisi "ERR" atau kosong. Program langsung berhenti di baris ke-347.',
      steps: [
        'Traceback menunjukkan `ValueError: could not convert string to float: \'ERR\'`.',
        'Konversi dibungkus: `try: suhu = float(x) except ValueError: rusak.append(i); continue`.',
        'Di akhir dicetak ringkasan: "9.912 data valid, 88 data rusak".',
      ],
      result: 'Program tetap berjalan sampai selesai dan data yang rusak terdokumentasi. Data rusak inilah yang nanti ditangani di tahap data cleaning.',
    },
  },

  // ---------- PYTHON LANJUTAN ----------
  'pyl-oop': {
    steps: [
      ['Identifikasi "benda" dalam masalah', 'Kata benda menjadi class (Siswa, Rekening, Model), kata sifat menjadi atribut, kata kerja menjadi method.'],
      ['Tulis __init__', 'Tentukan atribut awal object: `self.nama = nama`.'],
      ['Tambah method', 'Fungsi di dalam class yang selalu diawali parameter `self`.'],
      ['Buat object dan pakai', '`s = Siswa("Ani")` lalu `s.tambah_nilai(90)`.'],
      ['Gunakan inheritance untuk variasi', 'Jika ada jenis khusus (SiswaBeasiswa), turunkan dari class induk lalu tambahkan atau ubah perilakunya.'],
    ],
    case: {
      title: 'Sistem perpustakaan sekolah',
      situation: 'Perpustakaan perlu mencatat buku, anggota, dan peminjaman. Jika memakai variabel terpisah, kodenya cepat berantakan.',
      steps: [
        'Class `Buku` memiliki atribut judul, penulis, dan `tersedia`.',
        'Class `Anggota` memiliki nama, daftar pinjaman, serta method `pinjam(buku)` dan `kembalikan(buku)`.',
        '`pinjam()` mengecek `buku.tersedia`, mengubahnya menjadi False, lalu menambahkan buku ke daftar pinjaman.',
        'Class `AnggotaGuru(Anggota)` mewarisi semua kemampuan tetapi batas pinjamnya 10 buku, bukan 3.',
      ],
      result: 'Kode terorganisir dan mudah dikembangkan. Model PyTorch juga disusun dengan cara yang sama: class dengan atribut (layer) dan method (forward).',
    },
  },
  'pyl-modul': {
    steps: [
      ['Cek modul bawaan dulu', 'Banyak kebutuhan sudah ada di library standar: `math`, `random`, `datetime`, `csv`, `json`, `collections`.'],
      ['Cari library di PyPI', 'Kunjungi pypi.org, lalu perhatikan jumlah pengguna, dokumentasi, dan tanggal update terakhir.'],
      ['Install dengan pip', '`pip install nama_library` (sebaiknya di dalam virtual environment).'],
      ['Import dengan alias standar', '`import numpy as np`, `import pandas as pd`. Ikuti konvensi agar kode mudah dibaca orang lain.'],
      ['Pecah proyekmu sendiri', 'Pindahkan fungsi ke `utils.py`, lalu `from utils import bersihkan_teks`.'],
    ],
    case: {
      title: 'Merapikan proyek analisis yang sudah 800 baris',
      situation: 'Semua kode Budi ada di satu file `main.py` sehingga sulit mencari fungsi dan sering terjadi konflik saat bekerja dengan tim.',
      steps: [
        'Fungsi membaca data dipindahkan ke `data.py`.',
        'Fungsi preprocessing dipindahkan ke `preprocess.py`, dan fungsi model ke `model.py`.',
        '`main.py` kini hanya berisi alur utama: `from data import load` → `from preprocess import clean` → `from model import train`.',
      ],
      result: 'Setiap file pendek dengan tanggung jawab yang jelas, dan anggota tim bisa mengerjakan file berbeda tanpa bentrok.',
    },
  },
  'pyl-venv': {
    steps: [
      ['Buat venv di folder proyek', '`python -m venv .venv` (satu kali per proyek).'],
      ['Aktifkan', 'Windows: `.venv\\Scripts\\activate`. Mac/Linux: `source .venv/bin/activate`. Nama `(.venv)` akan muncul di terminal.'],
      ['Install library', '`pip install ...`. Library hanya masuk ke venv ini, tidak ke Python global.'],
      ['Catat dependensi', '`pip freeze > requirements.txt`, lalu commit file ini ke Git (tetapi jangan folder `.venv`-nya).'],
      ['Pilih interpreter di VS Code', 'Ctrl+Shift+P → "Python: Select Interpreter" → pilih yang ada di `.venv`.'],
    ],
    case: {
      title: '"Di laptopku jalan, di laptopmu error"',
      situation: 'Proyek kelompok Rina error di laptop temannya karena versi pandas yang berbeda: `AttributeError: DataFrame has no attribute append`.',
      steps: [
        'Rina membuat venv dan menjalankan `pip freeze > requirements.txt` yang mencatat `pandas==1.5.3`.',
        'Temannya meng-clone repo, membuat venv sendiri, lalu `pip install -r requirements.txt`.',
        'Kini keduanya memakai versi library yang persis sama.',
      ],
      result: 'Error hilang dan proyek bisa dijalankan siapa saja. Langkah yang sama juga dipakai saat deploy ke server.',
    },
  },
  'pyl-comprehension': {
    steps: [
      ['Mulai dari loop biasa', 'Tulis dulu versi `for` + `append` yang kamu pahami.'],
      ['Pindahkan ekspresi ke depan', '`hasil.append(x * 2)` menjadi `[x * 2 ...]`.'],
      ['Tambahkan for-nya', '`[x * 2 for x in data]`.'],
      ['Tambahkan filter di akhir jika perlu', '`[x * 2 for x in data if x > 0]`.'],
      ['Jaga keterbacaan', 'Jika comprehension menjadi lebih dari satu baris atau bersarang dua tingkat, kembali ke loop biasa.'],
    ],
    case: {
      title: 'Menyiapkan vocabulary untuk model NLP',
      situation: 'Dari ribuan ulasan, kamu perlu daftar kata unik dan nomor index untuk setiap kata sebelum teks bisa masuk ke model.',
      steps: [
        'Kumpulkan semua kata: `kata = [k for u in ulasan for k in u.lower().split()]`.',
        'Ambil kata unik lalu urutkan: `unik = sorted(set(kata))`.',
        'Buat kamus kata ke index: `vocab = {k: i for i, k in enumerate(unik)}`.',
        'Ubah setiap ulasan menjadi angka: `[[vocab[k] for k in u.lower().split()] for u in ulasan]`.',
      ],
      result: 'Teks berubah menjadi deretan angka yang siap diproses model, hanya dengan beberapa baris kode.',
    },
  },
  'pyl-generator': {
    steps: [
      ['Kenali kapan butuh generator', 'Ketika data terlalu besar untuk dimuat ke memori sekaligus, atau hanya perlu diproses satu per satu.'],
      ['Ganti return dengan yield', 'Fungsi akan "berhenti sejenak" di setiap `yield` dan melanjutkan saat nilai berikutnya diminta.'],
      ['Konsumsi dengan for', '`for batch in generator(): ...`'],
      ['Gunakan lambda untuk fungsi sekali pakai', 'Terutama sebagai `key=` di `sorted()`, `max()`, `min()`.'],
    ],
    case: {
      title: 'Memproses file log 5 GB di laptop dengan RAM 8 GB',
      situation: '`f.readlines()` membuat laptop hang karena seluruh file dimuat ke memori sekaligus.',
      steps: [
        'Buat generator: `def baca_baris(path): with open(path) as f: for baris in f: yield baris`.',
        'Buat generator kedua yang hanya meneruskan baris berisi "ERROR".',
        'Hitung jumlahnya dengan loop, sehingga yang ada di memori hanya satu baris pada satu waktu.',
      ],
      result: 'File 5 GB berhasil diproses dengan penggunaan memori hanya beberapa MB. DataLoader PyTorch memakai prinsip yang sama untuk dataset besar.',
    },
  },
  'pyl-decorator': {
    steps: [
      ['Pahami bahwa fungsi adalah objek', 'Fungsi bisa disimpan di variabel, dikirim sebagai argumen, dan dikembalikan dari fungsi lain.'],
      ['Buat fungsi pembungkus', 'Decorator menerima fungsi, lalu mengembalikan fungsi baru yang menambahkan perilaku sebelum/sesudah fungsi asli.'],
      ['Pasang dengan @', '`@nama_decorator` di atas `def` sama dengan `f = nama_decorator(f)`.'],
      ['Tambahkan type hints', '`def prediksi(teks: str) -> float:`. Tidak mengubah cara kerja, tetapi editor dan FastAPI memanfaatkannya.'],
    ],
    case: {
      title: 'Mencari bagian yang lambat dalam pipeline data',
      situation: 'Pipeline butuh 10 menit, tetapi tidak jelas langkah mana yang paling lambat.',
      steps: [
        'Buat decorator `@ukur_waktu` yang mencetak durasi setiap fungsi.',
        'Pasang di fungsi `load_data`, `clean`, `feature_eng`, dan `train`.',
        'Hasilnya: `clean` butuh 8 menit karena memakai loop Python biasa.',
        'Ganti loop dengan operasi vektor Pandas, sehingga `clean` turun menjadi 20 detik.',
      ],
      result: 'Total waktu turun dari 10 menit menjadi sekitar 2 menit tanpa menyentuh isi fungsi lainnya.',
    },
  },
  'pyl-api': {
    steps: [
      ['Baca dokumentasi API', 'Cari URL endpoint, parameter yang dibutuhkan, cara autentikasi (API key), dan batas request.'],
      ['Kirim request', '`r = requests.get(url, params={...}, timeout=10)`. Gunakan `post` jika harus mengirim data.'],
      ['Cek status', '`r.raise_for_status()`. Kode 200 berarti berhasil, 401 berarti API key salah, 429 berarti terlalu banyak request.'],
      ['Ambil data JSON', '`data = r.json()`, lalu akses seperti dict/list biasa.'],
      ['Simpan & hormati batas', 'Simpan hasil ke file agar tidak perlu request ulang, dan beri jeda (`time.sleep`) jika mengambil banyak data.'],
    ],
    case: {
      title: 'Mengumpulkan data cuaca untuk prediksi panen',
      situation: 'Kelompok tani ingin tahu hubungan curah hujan dengan hasil panen, tetapi belum punya data cuaca.',
      steps: [
        'Pilih API cuaca gratis (misalnya Open-Meteo) yang menyediakan data historis.',
        'Loop untuk setiap bulan: request data curah hujan dan suhu, lalu ambil field yang dibutuhkan dari JSON.',
        'Simpan semuanya ke `cuaca.csv`.',
        'Gabungkan dengan data panen untuk dianalisis di tahap Data Science.',
      ],
      result: 'Dataset cuaca 5 tahun terkumpul otomatis dalam beberapa menit, jauh lebih cepat daripada mencatatnya manual.',
    },
  },
  'pyl-test': {
    steps: [
      ['Pilih fungsi penting', 'Mulai dari fungsi yang hasilnya kritis atau sering diubah, misalnya preprocessing dan perhitungan metrik.'],
      ['Tulis kasus yang diketahui jawabannya', 'Input sederhana dengan output yang sudah pasti.'],
      ['Tambahkan kasus ekstrem', 'List kosong, nilai nol, teks kosong, nilai negatif.'],
      ['Jalankan pytest', 'Simpan sebagai `test_nama.py` dengan fungsi `test_...`, lalu jalankan perintah `pytest` di terminal.'],
      ['Jalankan setiap selesai mengubah kode', 'Jika ada test yang gagal, berarti ada yang rusak sebelum masalahnya sampai ke pengguna.'],
    ],
    case: {
      title: 'Bug pembagian nol di fungsi normalisasi',
      situation: 'Fungsi `normalisasi(data)` membagi dengan `max - min`. Saat semua nilai sama, program error di tengah training.',
      steps: [
        'Tulis test: `assert normalisasi([5, 5, 5]) == [0, 0, 0]`. Test ini gagal dengan ZeroDivisionError.',
        'Perbaiki fungsi: jika `max == min`, kembalikan list berisi nol.',
        'Jalankan ulang pytest, dan semua test lulus.',
      ],
      result: 'Bug ditemukan dan dicegah secara permanen. Jika suatu hari ada yang mengubah fungsi itu, test akan langsung memberi peringatan.',
    },
  },
}
