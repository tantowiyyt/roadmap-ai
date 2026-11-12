import { py } from './py.js'

// Bank proyek per tahap roadmap. Setiap proyek menjelaskan DARI MANA datanya didapat
// atau BAGAIMANA membuatnya sendiri.
// `id` jangan diganti setelah dipakai (status "selesai" disimpan berdasarkan id).
// `dataset.cara`: siap (unduh dataset jadi), api, scrape, survei, foto (rekam/foto sendiri),
//                 catat (catat/tulis sendiri), sintetis (dibuat dengan kode).
// `dataset.kode`: contoh kode untuk mendapatkan/membuat data (runnable: false = jalankan di komputer/Colab).

export const caraDataset = {
  siap: { icon: '📦', label: 'Dataset siap pakai' },
  api: { icon: '🔌', label: 'Ambil lewat API' },
  scrape: { icon: '🕸️', label: 'Web scraping' },
  survei: { icon: '📝', label: 'Survei / kuesioner' },
  foto: { icon: '📷', label: 'Foto / rekam sendiri' },
  catat: { icon: '✍️', label: 'Catat / tulis sendiri' },
  sintetis: { icon: '🧪', label: 'Data sintetis (dibuat kode)' },
}

const cariKaggle = (q) => ['Cari di Kaggle: "' + q + '"', 'https://www.kaggle.com/datasets?search=' + encodeURIComponent(q)]

export const proyek = [
  // =============================== PEMULA ===============================
  // ---------- Fondasi & Tools ----------
  {
    id: 'p-jurnal-belajar',
    tahap: 'fondasi',
    judul: 'Jurnal belajar AI di GitHub',
    durasi: '1–2 jam, lalu 5 menit per hari',
    ringkas: 'Repo GitHub berisi catatan belajar harian dalam file CSV, lengkap dengan README yang rapi.',
    dataset: {
      nama: 'Catatan belajarmu sendiri (`jurnal.csv`)',
      cara: 'catat',
      petunjuk: 'Buat file `jurnal.csv` dengan kolom `tanggal,topik,menit,catatan`. Isi satu baris setiap selesai belajar. Setelah 2–4 minggu, kamu punya dataset pribadi pertama yang bisa dianalisis di tahap berikutnya.',
      kode: {
        code: py`
tanggal,topik,menit,catatan
2026-11-10,Install Python,45,PATH sempat lupa dicentang
2026-11-11,Git dasar,30,commit pertama berhasil
2026-11-12,Terminal,25,belajar cd dan ls`,
        runnable: false,
        note: 'Contoh isi jurnal.csv (baris pertama = nama kolom).',
      },
    },
    langkah: [
      ['Buat repo', 'Repo publik `belajar-ai` di GitHub, centang "Add a README".'],
      ['Clone ke laptop', '`git clone` lalu buka foldernya di VS Code.'],
      ['Buat jurnal.csv', 'Tulis baris judul kolom dan catatan hari ini.'],
      ['Commit setiap hari', '`git add`, `git commit -m "jurnal 12 Nov"`, `git push`.'],
      ['Rapikan README', 'Tulis tujuan belajar, daftar materi, dan tautan ke jurnal.'],
    ],
    hasil: 'Repo publik dengan riwayat commit harian dan dataset kecil buatan sendiri.',
    tantangan: ['Tambahkan kolom `mood` (1–5) untuk dianalisis nanti.', 'Buat badge jumlah hari belajar di README.'],
    skill: ['Git', 'GitHub', 'CSV'],
  },
  {
    id: 'p-colab-iris',
    tahap: 'fondasi',
    judul: 'Notebook pertama: menjelajah bunga Iris di Colab',
    durasi: '1–2 jam',
    ringkas: 'Notebook Colab yang memuat dataset, menampilkan tabel, dan membuat grafik pertama.',
    dataset: {
      nama: 'Iris (150 bunga, 4 ukuran, 3 jenis)',
      cara: 'siap',
      sumber: [['Dokumentasi load_iris (scikit-learn)', 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_iris.html']],
      petunjuk: 'Iris **sudah ikut terpasang** bersama scikit-learn, jadi tidak perlu mengunduh apa pun. Cocok untuk latihan pertama karena kecil dan bersih.',
      kode: {
        code: py`
from sklearn.datasets import load_iris  # dataset bawaan scikit-learn

iris = load_iris(as_frame=True)  # muat sebagai tabel Pandas
df = iris.frame  # ambil DataFrame lengkap (fitur + target)
df["jenis"] = df["target"].map(dict(enumerate(iris.target_names)))  # ubah angka 0/1/2 jadi nama jenis
print(df.shape)  # (baris, kolom)
print(df.head())  # 5 baris pertama
print(df["jenis"].value_counts())  # jumlah bunga per jenis`,
        runnable: true,
      },
    },
    langkah: [
      ['Buka Colab', 'colab.research.google.com → New notebook.'],
      ['Muat data', 'Jalankan kode di atas.'],
      ['Lihat ringkasan', '`df.describe()` untuk rata-rata, minimum, maksimum.'],
      ['Buat grafik', '`df.plot.scatter("petal length (cm)", "petal width (cm)")`.'],
      ['Tulis kesimpulan', 'Sel teks (Markdown): jenis mana yang paling mudah dibedakan?'],
    ],
    hasil: 'Notebook dengan tabel, grafik, dan 3 kalimat kesimpulan, disimpan ke GitHub.',
    tantangan: ['Warnai titik berdasarkan jenis bunga.', 'Coba dataset bawaan lain: `load_wine()`.'],
    skill: ['Colab', 'Pandas dasar'],
  },
  {
    id: 'p-kamus-bersama',
    tahap: 'fondasi',
    judul: 'Kamus istilah AI bersama teman (Pull Request)',
    durasi: '2–3 jam',
    ringkas: 'Kamu dan 2–3 teman membangun satu file CSV istilah AI bersama, lewat branch dan Pull Request.',
    dataset: {
      nama: '`istilah.csv` yang diisi bersama',
      cara: 'catat',
      petunjuk: 'Ini contoh **crowdsourcing** skala kecil: banyak orang mengisi satu dataset. Sepakati dulu format kolom (`istilah,arti,contoh,sumber`) agar isinya seragam, persis seperti tim data sungguhan menyepakati pedoman pengisian.',
    },
    langkah: [
      ['Buat repo & format', 'Tulis `istilah.csv` dengan baris judul dan aturan pengisian di README.'],
      ['Undang teman', 'Settings → Collaborators, atau minta mereka fork.'],
      ['Satu istilah = satu branch', '`git checkout -b tambah-overfitting`.'],
      ['Buka Pull Request', 'Teman lain meninjau: arti benar? format sesuai?'],
      ['Merge & selesaikan konflik', 'Jika dua orang mengubah baris yang sama, selesaikan konfliknya.'],
    ],
    hasil: 'Dataset bersama berisi ≥30 istilah dengan riwayat review yang terlihat di GitHub.',
    tantangan: ['Tambahkan GitHub Action yang mengecek jumlah kolom setiap baris.'],
    skill: ['Branch', 'Pull Request', 'Kolaborasi'],
  },

  // ---------- Python Dasar ----------
  {
    id: 'p-rekap-nilai',
    tahap: 'python-dasar',
    judul: 'Rekap nilai kelas dari file CSV',
    durasi: '2–3 jam',
    ringkas: 'Program yang membaca nilai siswa, menghitung rata-rata, predikat, dan peringkat, lalu menyimpan laporan.',
    dataset: {
      nama: 'Nilai 30 siswa (dibuat dengan kode)',
      cara: 'sintetis',
      petunjuk: 'Data nilai asli bersifat pribadi, jadi untuk latihan kita **buat data tiruan** dengan modul `random`. Seed tetap membuat datanya selalu sama setiap dijalankan.',
      kode: {
        code: py`
import random, csv, io  # acak, CSV, dan "file" di memori

random.seed(7)  # seed tetap -> data selalu sama
buf = io.StringIO()  # tempat menulis CSV (di komputer: open("nilai.csv", "w"))
w = csv.writer(buf)  # penulis CSV
w.writerow(["nama", "mtk", "ipa", "bindo"])  # baris judul kolom
for i in range(1, 31):  # 30 siswa
    dasar = random.randint(55, 90)  # kemampuan dasar tiap siswa
    nilai = [min(100, max(0, dasar + random.randint(-10, 10))) for _ in range(3)]  # 3 mapel, sedikit bervariasi
    w.writerow([f"Siswa-{i:02d}", *nilai])  # tulis satu baris
print(buf.getvalue()[:160])  # intip awal isi CSV`,
        runnable: true,
      },
    },
    langkah: [
      ['Buat data', 'Jalankan kode di atas dan simpan sebagai `nilai.csv`.'],
      ['Baca CSV', 'Pakai `csv.DictReader` agar tiap baris jadi dict.'],
      ['Hitung', 'Rata-rata per siswa, predikat (A ≥ 85, B ≥ 75, ...).'],
      ['Urutkan', '`sorted(..., key=lambda s: s["rata"], reverse=True)`.'],
      ['Simpan laporan', 'Tulis `laporan.csv` dan cetak 5 besar.'],
    ],
    hasil: 'Skrip `rekap.py` + `laporan.csv` berisi rata-rata, predikat, dan peringkat.',
    tantangan: ['Tangani baris rusak (nilai kosong/huruf) dengan `try/except`.', 'Hitung rata-rata per mata pelajaran.'],
    skill: ['File', 'Loop', 'Fungsi', 'CSV'],
  },
  {
    id: 'p-pengeluaran',
    tahap: 'python-dasar',
    judul: 'Pencatat pengeluaran harian di terminal',
    durasi: '3–4 jam + 2 minggu mencatat',
    ringkas: 'Aplikasi terminal untuk mencatat pengeluaran, lalu menampilkan ringkasan per kategori dan per minggu.',
    dataset: {
      nama: 'Pengeluaranmu sendiri selama 2 minggu',
      cara: 'catat',
      petunjuk: 'Dataset paling berharga adalah yang **kamu kumpulkan sendiri** dan kamu pahami konteksnya. Catat setiap jajan, ongkos, pulsa. Gunakan kategori tetap (mis. makan, transport, pulsa, hiburan) supaya tidak muncul "Makan" dan "makanan" sebagai dua kategori berbeda.',
    },
    langkah: [
      ['Rancang kolom', '`tanggal, kategori, jumlah, keterangan`.'],
      ['Menu input', '1) tambah, 2) lihat ringkasan, 3) keluar, dalam `while True`.'],
      ['Validasi', 'Kategori harus dari daftar; jumlah harus angka positif.'],
      ['Simpan ke CSV', 'Mode `"a"` (append) agar data lama tidak hilang.'],
      ['Ringkasan', 'Total per kategori dengan dict, urutkan dari terbesar.'],
    ],
    hasil: 'Program yang kamu pakai sendiri + dataset pengeluaran asli untuk dianalisis di tahap Data Science.',
    tantangan: ['Tambahkan anggaran bulanan dan peringatan jika terlewati.', 'Ekspor ringkasan ke file teks.'],
    skill: ['Input', 'Validasi', 'File CSV', 'Dict'],
  },
  {
    id: 'p-kuis-json',
    tahap: 'python-dasar',
    judul: 'Game kuis pilihan ganda dari file JSON',
    durasi: '2–3 jam',
    ringkas: 'Kuis di terminal yang mengambil soal dari file JSON, mengacak urutan, dan menghitung skor.',
    dataset: {
      nama: '`soal.json` yang kamu tulis sendiri',
      cara: 'catat',
      petunjuk: 'Tulis 15–20 soal tentang materi yang sedang kamu pelajari. Struktur yang rapi memudahkan program membacanya.',
      kode: {
        code: py`
[
  {"soal": "Library untuk tabel data?", "pilihan": ["NumPy", "Pandas", "Flask"], "jawaban": 1},
  {"soal": "Perintah menyimpan perubahan di Git?", "pilihan": ["git push", "git commit", "git clone"], "jawaban": 1}
]`,
        runnable: false,
        note: 'Contoh format soal.json. "jawaban" adalah nomor indeks pilihan yang benar (mulai dari 0).',
      },
    },
    langkah: [
      ['Tulis soal', 'Simpan sebagai `soal.json` dengan format di atas.'],
      ['Baca JSON', '`json.load(open("soal.json"))` → list of dict.'],
      ['Acak', '`random.shuffle` untuk soal dan pilihan (ingat sesuaikan indeks jawaban).'],
      ['Tanya-jawab', 'Tampilkan pilihan bernomor, cek input, hitung skor.'],
      ['Simpan skor tertinggi', 'Ke `skor.json` beserta nama dan tanggal.'],
    ],
    hasil: 'Game kuis yang bisa dipakai untuk belajar bersama teman.',
    tantangan: ['Tambahkan batas waktu per soal.', 'Tampilkan soal yang salah di akhir beserta pembahasannya.'],
    skill: ['JSON', 'List & dict', 'random'],
  },
  {
    id: 'p-frekuensi-kata',
    tahap: 'python-dasar',
    judul: 'Penghitung kata dari artikel atau lirik',
    durasi: '1–2 jam',
    ringkas: 'Program yang membersihkan teks lalu menampilkan 20 kata paling sering muncul, tanpa kata umum seperti "yang" dan "dan".',
    dataset: {
      nama: 'Teks artikel Wikipedia atau tulisanmu sendiri',
      cara: 'catat',
      sumber: [['Wikipedia bahasa Indonesia', 'https://id.wikipedia.org'], ['Lisensi CC BY-SA 4.0 (dipakai teks Wikipedia)', 'https://creativecommons.org/licenses/by-sa/4.0/deed.id']],
      petunjuk: 'Salin isi satu artikel Wikipedia ke `artikel.txt`. Teks Wikipedia berlisensi CC BY-SA, jadi boleh dipakai asalkan sumbernya disebut. Hindari menyalin artikel berita berbayar atau buku, karena biasanya dilindungi hak cipta.',
    },
    langkah: [
      ['Baca file', '`open("artikel.txt", encoding="utf-8").read()`.'],
      ['Bersihkan', 'Huruf kecil, buang tanda baca dengan `str.translate`.'],
      ['Pecah kata', '`.split()` lalu buang stopword (daftar kata umum buatanmu).'],
      ['Hitung', '`collections.Counter(kata).most_common(20)`.'],
      ['Tampilkan', 'Cetak sebagai tabel rapi dengan f-string.'],
    ],
    hasil: 'Skrip yang bisa dipakai untuk teks apa pun, dasar dari NLP.',
    tantangan: ['Bandingkan dua artikel: kata apa yang khas untuk masing-masing?'],
    skill: ['String', 'Counter', 'File'],
  },

  // =============================== MENENGAH ===============================
  // ---------- Python Lanjutan ----------
  {
    id: 'p-cuaca-api',
    tahap: 'python-lanjut',
    judul: 'Pengumpul data cuaca kota-kota Indonesia',
    durasi: '3–4 jam',
    ringkas: 'Skrip yang mengambil suhu dan curah hujan harian beberapa kota dari API, lalu menyimpannya ke CSV.',
    dataset: {
      nama: 'Data cuaca historis Open-Meteo (gratis, tanpa API key)',
      cara: 'api',
      sumber: [['Dokumentasi Open-Meteo Historical Weather', 'https://open-meteo.com/en/docs/historical-weather-api']],
      petunjuk: 'Open-Meteo menyediakan data cuaca harian sejak puluhan tahun lalu untuk koordinat mana pun, gratis untuk pemakaian non-komersial. Cari koordinat kota di Google Maps (klik kanan → angka lintang, bujur).',
      kode: {
        code: py`
import requests, pandas as pd  # pemanggil API & tabel

kota = {"Jakarta": (-6.2, 106.85), "Medan": (3.59, 98.67), "Makassar": (-5.15, 119.43)}  # nama: (lintang, bujur)
semua = []  # kumpulan tabel per kota
for nama, (lat, lon) in kota.items():  # untuk setiap kota
    r = requests.get("https://archive-api.open-meteo.com/v1/archive", params={  # alamat API data historis
        "latitude": lat, "longitude": lon,  # lokasi
        "start_date": "2025-01-01", "end_date": "2025-12-31",  # rentang tanggal
        "daily": "temperature_2m_max,precipitation_sum",  # suhu maks & total hujan harian
        "timezone": "Asia/Jakarta",  # zona waktu WIB
    }, timeout=30)  # batas waktu tunggu
    r.raise_for_status()  # hentikan jika API mengembalikan error
    df = pd.DataFrame(r.json()["daily"])  # JSON -> tabel
    df["kota"] = nama  # tandai asal kota
    semua.append(df)  # simpan
pd.concat(semua).to_csv("cuaca_2025.csv", index=False)  # gabung & simpan ke CSV`,
        runnable: false,
        note: 'Jalankan di komputer atau Colab (butuh internet). Pyodide di browser tidak bisa memanggil API ini lewat requests.',
      },
    },
    langkah: [
      ['Pilih kota & rentang', '3–5 kota, satu tahun penuh.'],
      ['Panggil API', 'Pakai `params=` agar URL rapi; pasang `timeout`.'],
      ['Tangani error', '`raise_for_status()` dan `try/except` untuk koneksi putus.'],
      ['Simpan mentah', 'Simpan respons asli dulu (JSON), baru olah ke CSV.'],
      ['Jadikan modul', 'Fungsi `ambil_cuaca(kota, mulai, selesai)` + docstring.'],
    ],
    hasil: 'File `cuaca_2025.csv` (±1.000 baris) yang dipakai lagi untuk proyek EDA dan LSTM.',
    tantangan: ['Jalankan otomatis setiap hari (cron / Task Scheduler).', 'Tambahkan kolom kelembapan dan kecepatan angin.'],
    skill: ['requests', 'JSON', 'Error handling', 'Modul'],
  },
  {
    id: 'p-scraper-buku',
    tahap: 'python-lanjut',
    judul: 'Scraper katalog buku (situs latihan scraping)',
    durasi: '3–4 jam',
    ringkas: 'Mengambil judul, harga, rating, dan stok dari 1.000 buku di 50 halaman, lalu menyimpannya ke CSV.',
    dataset: {
      nama: 'books.toscrape.com: toko buku palsu yang memang dibuat untuk latihan scraping',
      cara: 'scrape',
      sumber: [['books.toscrape.com', 'https://books.toscrape.com']],
      petunjuk: 'Mulailah scraping di situs yang **memang mengizinkan**. Di situs sungguhan, cek dulu `robots.txt` dan syarat layanannya, beri jeda antar permintaan, dan jangan pernah mengambil data pribadi.',
      kode: {
        code: py`
import time, requests, pandas as pd  # jeda, HTTP, tabel
from bs4 import BeautifulSoup  # pembaca HTML (pip install beautifulsoup4)

RATING = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}  # rating ditulis sebagai kata
data = []  # tempat hasil
for hal in range(1, 51):  # 50 halaman katalog
    url = f"https://books.toscrape.com/catalogue/page-{hal}.html"  # alamat tiap halaman
    html = requests.get(url, timeout=20).text  # ambil HTML
    soup = BeautifulSoup(html, "html.parser")  # ubah jadi pohon HTML
    for b in soup.select("article.product_pod"):  # setiap kartu buku
        data.append({
            "judul": b.h3.a["title"],  # judul lengkap ada di atribut title
            "harga": float(b.select_one(".price_color").text.lstrip("£Â")),  # "£51.77" -> 51.77
            "rating": RATING[b.select_one(".star-rating")["class"][1]],  # "Three" -> 3
        })
    time.sleep(1)  # sopan: jeda 1 detik antar halaman
pd.DataFrame(data).to_csv("buku.csv", index=False)  # simpan
print(len(data), "buku tersimpan")  # harusnya 1000`,
        runnable: false,
        note: 'Jalankan di komputer/Colab. Pasang dulu: pip install requests beautifulsoup4 pandas',
      },
    },
    langkah: [
      ['Pelajari HTML', 'Klik kanan → Inspect untuk menemukan elemen judul & harga.'],
      ['Ambil satu halaman', 'Pastikan hasil untuk halaman 1 benar sebelum mengulang.'],
      ['Ulangi dengan jeda', 'Loop semua halaman + `time.sleep`.'],
      ['Bersihkan', 'Harga jadi angka, rating jadi 1–5.'],
      ['Analisis kecil', 'Apakah buku dengan rating tinggi lebih mahal?'],
    ],
    hasil: '`buku.csv` berisi 1.000 baris + catatan etika scraping di README.',
    tantangan: ['Masuk ke halaman detail tiap buku untuk mengambil kategori dan stok.', 'Simpan HTML mentah agar tidak perlu scraping ulang.'],
    skill: ['HTML', 'BeautifulSoup', 'Etika scraping'],
  },
  {
    id: 'p-gempa-bmkg',
    tahap: 'python-lanjut',
    judul: 'Pemantau gempa terkini dari data terbuka BMKG',
    durasi: '2–3 jam',
    ringkas: 'Skrip yang mengambil daftar gempa terbaru, menyimpan yang belum tercatat, dan menampilkan ringkasan.',
    dataset: {
      nama: 'Data Terbuka BMKG (format JSON)',
      cara: 'api',
      sumber: [['Data Terbuka BMKG', 'https://data.bmkg.go.id']],
      petunjuk: 'BMKG menyediakan data gempa terkini dalam JSON yang bisa dibaca langsung. Lihat halaman data terbuka untuk alamat file yang berlaku (mis. daftar gempa M 5,0+). Sebutkan BMKG sebagai sumber data, sesuai ketentuan di halamannya.',
    },
    langkah: [
      ['Baca dokumentasi', 'Catat alamat JSON dan arti setiap kolom.'],
      ['Ambil & parse', '`requests.get(...).json()` → list gempa.'],
      ['Hindari duplikat', 'Simpan ke CSV hanya jika kombinasi tanggal+jam belum ada.'],
      ['Ubah tipe', 'Magnitudo & kedalaman jadi angka, waktu jadi `datetime`.'],
      ['Jadwalkan', 'Jalankan tiap jam; seminggu kemudian kamu punya dataset sendiri.'],
    ],
    hasil: 'Dataset gempa yang tumbuh sendiri + skrip yang tahan error.',
    tantangan: ['Plot lokasi gempa di peta (folium).', 'Kirim notifikasi jika ada gempa ≥ M 6.'],
    skill: ['API', 'Deduplikasi', 'Penjadwalan'],
  },
  {
    id: 'p-inventaris-oop',
    tahap: 'python-lanjut',
    judul: 'Sistem inventaris toko dengan OOP & unit test',
    durasi: '4–5 jam',
    ringkas: 'Class `Barang` dan `Gudang` dengan aturan stok, riwayat transaksi, dan pengujian otomatis dengan pytest.',
    dataset: {
      nama: 'Transaksi toko tiruan (dibuat dengan kode)',
      cara: 'sintetis',
      petunjuk: 'Buat 200 transaksi acak (barang, jumlah, masuk/keluar, tanggal). Sengaja selipkan kasus sulit, misalnya penjualan melebihi stok, supaya pengujianmu benar-benar menguji aturan.',
    },
    langkah: [
      ['Rancang class', '`Barang(nama, harga, stok)`, `Gudang.tambah()`, `Gudang.jual()`.'],
      ['Aturan bisnis', 'Jual melebihi stok → `ValueError` yang jelas.'],
      ['Generator transaksi', 'Fungsi pembuat data tiruan dengan seed.'],
      ['Unit test', '`pytest`: stok berkurang benar, error muncul saat seharusnya.'],
      ['Laporan', 'Barang terlaris dan stok yang perlu dipesan ulang.'],
    ],
    hasil: 'Paket Python kecil dengan ≥8 test yang lulus.',
    tantangan: ['Simpan data ke SQLite.', 'Pasang type hints dan cek dengan mypy.'],
    skill: ['OOP', 'pytest', 'Type hints'],
  },

  // ---------- Matematika ----------
  {
    id: 'p-gd-manual',
    tahap: 'matematika',
    judul: 'Gradient descent dari nol',
    durasi: '2–3 jam',
    ringkas: 'Mencari garis terbaik y = ax + b hanya dengan NumPy, lalu membandingkannya dengan hasil rumus pasti.',
    dataset: {
      nama: 'Titik data buatan dengan garis "rahasia"',
      cara: 'sintetis',
      petunjuk: 'Keuntungan data sintetis: **kamu tahu jawaban benarnya**. Jika gradient descent menemukan a ≈ 3 dan b ≈ 5, berarti algoritmamu benar.',
      kode: {
        code: py`
import numpy as np  # perhitungan angka

rng = np.random.default_rng(0)  # generator acak dengan seed
x = rng.uniform(0, 10, 100)  # 100 nilai x antara 0 dan 10
y = 3 * x + 5 + rng.normal(0, 2, 100)  # garis rahasia: a=3, b=5, ditambah noise
a, b, lr = 0.0, 0.0, 0.01  # tebakan awal & learning rate
for langkah in range(2000):  # ulangi 2000 kali
    galat = (a * x + b) - y  # selisih prediksi dan data asli
    a -= lr * 2 * np.mean(galat * x)  # turunan MSE terhadap a
    b -= lr * 2 * np.mean(galat)  # turunan MSE terhadap b
print(f"hasil GD : a={a:.2f}, b={b:.2f}")  # harusnya mendekati 3 dan 5
print("rumus pasti:", np.round(np.polyfit(x, y, 1), 2))  # pembanding dari NumPy`,
        runnable: true,
      },
    },
    langkah: [
      ['Buat data', 'Tentukan a dan b rahasia, tambahkan noise.'],
      ['Tulis loss', 'MSE = rata-rata kuadrat galat.'],
      ['Turunkan', 'Tulis turunan terhadap a dan b di kertas dulu.'],
      ['Update berulang', 'Catat loss setiap 100 langkah.'],
      ['Plot', 'Grafik loss turun, dan garis akhir di atas titik data.'],
    ],
    hasil: 'Notebook yang membuktikan gradient descent menemukan garis yang sama dengan rumus.',
    tantangan: ['Coba learning rate 0,1 dan 0,0001: apa yang terjadi?', 'Kembangkan ke 2 fitur (bidang datar).'],
    skill: ['Turunan', 'NumPy', 'Optimasi'],
  },
  {
    id: 'p-monte-carlo',
    tahap: 'matematika',
    judul: 'Simulasi peluang: paradoks ulang tahun',
    durasi: '1–2 jam',
    ringkas: 'Membuktikan dengan simulasi bahwa di kelas berisi 23 orang, peluang ada yang ulang tahunnya sama sekitar 50%.',
    dataset: {
      nama: 'Ribuan "kelas" acak hasil simulasi',
      cara: 'sintetis',
      petunjuk: 'Simulasi Monte Carlo menghasilkan data dari aturan peluang. Cocok untuk memeriksa rumus yang terasa tidak masuk akal.',
      kode: {
        code: py`
import numpy as np  # angka acak & perhitungan

rng = np.random.default_rng(1)  # seed agar hasil bisa diulang
for n in [10, 23, 40, 60]:  # beberapa ukuran kelas
    ultah = rng.integers(0, 365, size=(20000, n))  # 20.000 kelas, tiap siswa dapat hari 0..364
    urut = np.sort(ultah, axis=1)  # urutkan hari dalam tiap kelas
    ada_kembar = (np.diff(urut, axis=1) == 0).any(axis=1)  # ada dua hari yang sama berdampingan?
    print(f"{n} siswa -> peluang ada ulang tahun sama: {ada_kembar.mean():.1%}")  # proporsi kelas`,
        runnable: true,
      },
    },
    langkah: [
      ['Tulis rumus pasti', '1 − (365/365 × 364/365 × ...).'],
      ['Simulasikan', 'Kode di atas.'],
      ['Bandingkan', 'Selisih simulasi vs rumus untuk setiap n.'],
      ['Plot', 'Peluang terhadap jumlah siswa 1–80.'],
      ['Jelaskan', 'Tulis penjelasan untuk teman yang belum belajar peluang.'],
    ],
    hasil: 'Notebook dengan grafik dan penjelasan intuitif.',
    tantangan: ['Estimasi nilai π dengan melempar titik acak ke persegi.'],
    skill: ['Peluang', 'Simulasi', 'Vektorisasi NumPy'],
  },
  {
    id: 'p-svd-gambar',
    tahap: 'matematika',
    judul: 'Kompresi foto dengan SVD',
    durasi: '2–3 jam',
    ringkas: 'Memecah foto menjadi matriks, membuang komponen kecil, lalu melihat seberapa banyak foto masih bisa dikenali.',
    dataset: {
      nama: 'Foto milikmu sendiri (atau gambar contoh scikit-learn)',
      cara: 'foto',
      petunjuk: 'Pakai foto hasil jepretanmu sendiri agar bebas masalah hak cipta. Ubah ke hitam-putih supaya menjadi satu matriks. Alternatifnya, scikit-learn menyediakan gambar contoh lewat `load_sample_image("china.jpg")`.',
    },
    langkah: [
      ['Muat foto', 'Pillow → hitam-putih → array NumPy.'],
      ['SVD', '`U, S, Vt = np.linalg.svd(A, full_matrices=False)`.'],
      ['Rekonstruksi', 'Pakai k = 5, 20, 50, 100 komponen.'],
      ['Ukur', 'Rasio ukuran data dan error rekonstruksi.'],
      ['Pamerkan', 'Grid gambar berdampingan untuk tiap k.'],
    ],
    hasil: 'Visual yang menjelaskan "esensi" sebuah matriks: dasar PCA dan embedding.',
    tantangan: ['Lakukan per kanal warna (R, G, B).'],
    skill: ['Matriks', 'SVD', 'Visualisasi'],
  },

  // ---------- Data Science ----------
  {
    id: 'p-eda-titanic',
    tahap: 'data-science',
    judul: 'EDA Titanic: siapa yang lebih mungkin selamat?',
    durasi: '3–5 jam',
    ringkas: 'Analisis data penumpang Titanic dengan grafik dan kesimpulan yang didukung angka.',
    dataset: {
      nama: 'Titanic (891 penumpang)',
      cara: 'siap',
      sumber: [['Kompetisi Titanic di Kaggle', 'https://www.kaggle.com/c/titanic'], ['Titanic di OpenML', 'https://www.openml.org/search?type=data&sort=runs&id=40945']],
      petunjuk: 'Di Kaggle: daftar akun, buka halaman kompetisi, tab **Data** → Download. Atau langsung dari kode lewat OpenML (butuh internet).',
      kode: {
        code: py`
from sklearn.datasets import fetch_openml  # pengunduh dataset dari OpenML

titanic = fetch_openml("titanic", version=1, as_frame=True)  # unduh sekali, lalu tersimpan di cache
df = titanic.frame  # tabel lengkap
print(df.shape)  # jumlah baris & kolom
print(df[["pclass", "sex", "age", "survived"]].head())  # beberapa kolom penting`,
        runnable: false,
        note: 'Jalankan di komputer/Colab (butuh internet untuk mengunduh).',
      },
    },
    langkah: [
      ['Kenali kolom', 'Tulis arti setiap kolom di sel Markdown.'],
      ['Cek kualitas', 'Missing value (age, cabin), duplikat, tipe data.'],
      ['Satu variabel', 'Distribusi umur, proporsi kelas tiket.'],
      ['Hubungan', 'Tingkat selamat per jenis kelamin, kelas, dan kelompok umur.'],
      ['Cerita', '3–5 temuan utama dengan grafik pendukung.'],
    ],
    hasil: 'Notebook EDA yang bisa dibaca orang non-teknis.',
    tantangan: ['Buat fitur baru "ukuran keluarga" dan lihat pengaruhnya.'],
    skill: ['Pandas', 'Matplotlib', 'Bercerita dengan data'],
  },
  {
    id: 'p-bps-provinsi',
    tahap: 'data-science',
    judul: 'Profil 38 provinsi dari data BPS',
    durasi: '4–6 jam',
    ringkas: 'Menggabungkan beberapa tabel BPS (mis. IPM, penduduk, kemiskinan) menjadi satu tabel per provinsi, lalu menganalisisnya.',
    dataset: {
      nama: 'Tabel statistik Badan Pusat Statistik',
      cara: 'siap',
      sumber: [['Badan Pusat Statistik', 'https://www.bps.go.id'], ['Portal Satu Data Indonesia', 'https://data.go.id']],
      petunjuk: 'Di situs BPS, cari tabel (mis. "Indeks Pembangunan Manusia menurut provinsi") lalu unduh dalam format Excel/CSV. Data pemerintah biasanya **perlu dibersihkan**: judul bertingkat, angka berformat "1.234,5", nama provinsi yang ejaannya berbeda antar tabel, dan provinsi baru yang belum ada di tahun lama.',
    },
    langkah: [
      ['Unduh 3 tabel', 'Pilih tahun yang sama untuk ketiganya.'],
      ['Bersihkan', 'Lewati baris judul (`skiprows`), ubah format angka Indonesia.'],
      ['Samakan kunci', 'Normalisasi nama provinsi sebelum `merge`.'],
      ['Analisis', 'Korelasi antar indikator, 5 teratas dan terbawah.'],
      ['Visualisasi', 'Bar chart terurut dan scatter plot dua indikator.'],
    ],
    hasil: 'Satu tabel bersih per provinsi + notebook analisis + catatan sumber data.',
    tantangan: ['Tambahkan data beberapa tahun dan lihat trennya.', 'Buat peta choropleth dengan GeoJSON provinsi.'],
    skill: ['Cleaning', 'Merge', 'Data publik'],
  },
  {
    id: 'p-survei-tidur',
    tahap: 'data-science',
    judul: 'Survei kebiasaan tidur & belajar teman sekelas',
    durasi: '1 minggu (termasuk mengumpulkan jawaban)',
    ringkas: 'Merancang kuesioner sendiri, mengumpulkan ≥50 jawaban, lalu menganalisis hubungan jam tidur dengan fokus belajar.',
    dataset: {
      nama: 'Jawaban survei Google Form buatanmu',
      cara: 'survei',
      sumber: [['Google Forms', 'https://forms.google.com']],
      petunjuk: 'Pakai pertanyaan **tertutup** (pilihan, angka, skala 1–5) agar mudah dianalisis. Jelaskan tujuan survei di awal formulir, jangan minta nama/nomor HP jika tidak perlu, dan tanyakan persetujuan. Hasilnya bisa diekspor: Responses → ikon Sheets → File → Download → CSV.',
    },
    langkah: [
      ['Rancang pertanyaan', '8–12 pertanyaan; uji coba ke 3 teman dulu.'],
      ['Sebarkan', 'Grup kelas/organisasi; target ≥50 jawaban.'],
      ['Ekspor & bersihkan', 'Ganti nama kolom panjang jadi singkat, cek jawaban tidak wajar.'],
      ['Analisis', 'Rata-rata per kelompok, korelasi, crosstab.'],
      ['Laporkan dengan jujur', 'Sebutkan keterbatasan: sampel kecil, bukan sebab-akibat.'],
    ],
    hasil: 'Dataset survei asli + laporan singkat yang bisa dibagikan ke responden.',
    tantangan: ['Uji beda rata-rata dua kelompok (t-test).'],
    skill: ['Desain survei', 'Etika data', 'Statistik deskriptif'],
  },
  {
    id: 'p-sepeda-timeseries',
    tahap: 'data-science',
    judul: 'Pola peminjaman sepeda per jam dan musim',
    durasi: '3–4 jam',
    ringkas: 'Menemukan jam sibuk, pengaruh cuaca, dan perbedaan hari kerja vs libur dari data dua tahun.',
    dataset: {
      nama: 'Bike Sharing Dataset (UCI)',
      cara: 'siap',
      sumber: [['UCI Machine Learning Repository: Bike Sharing', 'https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset']],
      petunjuk: 'Unduh ZIP dari halaman UCI, lalu pakai `hour.csv` (per jam) dan `day.csv` (per hari). Baca file `Readme.txt` di dalamnya untuk arti kolom; beberapa kolom cuaca sudah dinormalisasi ke 0–1.',
    },
    langkah: [
      ['Muat & ubah tanggal', '`parse_dates=["dteday"]`.'],
      ['Pola harian', 'Rata-rata per jam, pisahkan hari kerja dan libur.'],
      ['Pola musiman', 'Resample per minggu/bulan.'],
      ['Pengaruh cuaca', 'Boxplot jumlah pinjaman per kondisi cuaca.'],
      ['Ringkas', 'Rekomendasi kapan sepeda perlu ditambah.'],
    ],
    hasil: 'Notebook time series dengan 4–6 grafik bercerita.',
    tantangan: ['Buat baseline prediksi: "sama dengan minggu lalu di jam yang sama".'],
    skill: ['Time series', 'groupby', 'resample'],
  },
  {
    id: 'p-sql-retail',
    tahap: 'data-science',
    judul: 'Analisis penjualan toko online dengan SQL',
    durasi: '3–5 jam',
    ringkas: 'Memuat ±500 ribu transaksi ke SQLite lalu menjawab pertanyaan bisnis hanya dengan query SQL.',
    dataset: {
      nama: 'Online Retail (UCI): transaksi toko online Inggris 2010–2011',
      cara: 'siap',
      sumber: [['UCI: Online Retail', 'https://archive.ics.uci.edu/dataset/352/online+retail']],
      petunjuk: 'Unduh file Excel dari UCI, baca dengan `pd.read_excel`, lalu simpan ke SQLite dengan `df.to_sql("transaksi", koneksi)`. Perhatikan: transaksi berawalan "C" adalah pembatalan, dan sebagian baris tidak punya ID pelanggan.',
    },
    langkah: [
      ['Muat ke SQLite', '`sqlite3.connect("retail.db")` + `to_sql`.'],
      ['Bersihkan dengan SQL', 'Buat VIEW tanpa pembatalan dan tanpa jumlah negatif.'],
      ['Pertanyaan bisnis', 'Produk terlaris, negara terbesar, penjualan per bulan.'],
      ['Pelanggan', 'Hitung RFM (recency, frequency, monetary) dengan SQL.'],
      ['Visualisasi', 'Ambil hasil query ke Pandas lalu buat grafik.'],
    ],
    hasil: 'File `.sql` berisi 10 query yang menjawab 10 pertanyaan bisnis.',
    tantangan: ['Gunakan window function untuk peringkat produk per bulan.', 'Lanjutkan ke proyek Apriori (aturan "sering dibeli bersama").'],
    skill: ['SQL', 'JOIN', 'Agregasi'],
  },

  // =============================== MAHIR ===============================
  // ---------- Machine Learning ----------
  {
    id: 'p-harga-rumah',
    tahap: 'machine-learning',
    judul: 'Prediksi harga rumah dengan 3 algoritma',
    durasi: '1–2 hari',
    ringkas: 'Membandingkan regresi linear, random forest, dan gradient boosting dengan cross-validation yang benar.',
    dataset: {
      nama: 'California Housing (20 ribu wilayah) atau Kaggle House Prices',
      cara: 'siap',
      sumber: [['fetch_california_housing (scikit-learn)', 'https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html'], ['Kaggle: House Prices', 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques']],
      petunjuk: 'California Housing langsung diunduh lewat scikit-learn (sekali, lalu tersimpan di cache). Kaggle House Prices punya 79 kolom dengan banyak missing value, cocok untuk latihan feature engineering.',
      kode: {
        code: py`
from sklearn.datasets import fetch_california_housing  # pengunduh dataset

data = fetch_california_housing(as_frame=True)  # unduh & jadikan tabel
X, y = data.data, data.target  # fitur & harga median (dalam ratusan ribu USD)
print(X.shape)  # (20640, 8)
print(X.columns.tolist())  # nama fitur`,
        runnable: false,
        note: 'Butuh internet untuk unduhan pertama; jalankan di komputer/Colab.',
      },
    },
    langkah: [
      ['Split dulu', 'Pisahkan data uji sebelum melihat apa pun.'],
      ['Baseline', 'Prediksi = rata-rata harga. Catat MAE-nya.'],
      ['Pipeline', 'Imputasi + scaling + model dalam satu `Pipeline`.'],
      ['Bandingkan', '5-fold CV untuk 3 model; catat rata-rata & simpangan MAE.'],
      ['Evaluasi akhir', 'Model terbaik dinilai sekali di data uji + analisis residual.'],
    ],
    hasil: 'Tabel perbandingan model + penjelasan fitur paling berpengaruh.',
    tantangan: ['Tuning dengan RandomizedSearchCV.', 'Prediksi log(harga) dan bandingkan.'],
    skill: ['Regresi', 'Cross-validation', 'Pipeline'],
    algo: ['linear-regression', 'random-forest', 'gradient-boosting'],
  },
  {
    id: 'p-churn',
    tahap: 'machine-learning',
    judul: 'Prediksi pelanggan yang akan berhenti (churn)',
    durasi: '1–2 hari',
    ringkas: 'Model klasifikasi yang memberi skor risiko berhenti untuk setiap pelanggan operator telekomunikasi.',
    dataset: {
      nama: 'Telco Customer Churn (7 ribu pelanggan)',
      cara: 'siap',
      sumber: [['Kaggle: Telco Customer Churn', 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn']],
      petunjuk: 'Unduh CSV dari Kaggle. Perhatikan kolom `TotalCharges` yang terbaca sebagai teks karena ada nilai kosong berupa spasi. Data ini tidak seimbang (±27% churn), jadi akurasi saja menyesatkan.',
    },
    langkah: [
      ['Bersihkan', '`TotalCharges` → angka; ubah Yes/No jadi 1/0.'],
      ['Encode', 'One-hot untuk kolom kategori di dalam Pipeline.'],
      ['Model', 'Regresi logistik (baseline) lalu gradient boosting.'],
      ['Metrik yang tepat', 'Recall, precision, PR-AUC; pilih threshold sesuai biaya.'],
      ['Jelaskan', 'Fitur apa yang paling memicu churn? (permutation importance).'],
    ],
    hasil: 'Model + rekomendasi bisnis: siapa yang harus ditawari promo dulu.',
    tantangan: ['Hitung keuntungan: biaya promo vs pelanggan yang diselamatkan.'],
    skill: ['Klasifikasi', 'Imbalance', 'Threshold'],
    algo: ['logistic-regression', 'gradient-boosting'],
  },
  {
    id: 'p-sms-spam',
    tahap: 'machine-learning',
    judul: 'Filter SMS spam + koleksi SMS penipuan Indonesia',
    durasi: '1 hari',
    ringkas: 'Melatih Naive Bayes pada dataset publik berbahasa Inggris, lalu mengujinya pada SMS penipuan berbahasa Indonesia yang kamu kumpulkan sendiri.',
    dataset: {
      nama: 'SMS Spam Collection (UCI) + koleksi pribadimu',
      cara: 'siap',
      sumber: [['UCI: SMS Spam Collection', 'https://archive.ics.uci.edu/dataset/228/sms+spam+collection']],
      petunjuk: 'Dataset UCI berisi ±5.500 SMS berlabel ham/spam (bahasa Inggris). Untuk versi Indonesia, kumpulkan sendiri SMS/WA penipuan yang kamu terima dan **sensor nomor, nama, serta tautan** sebelum disimpan. Labeli juga SMS biasa sebagai pembanding.',
    },
    langkah: [
      ['Muat data UCI', 'File berformat TSV: `sep="\\t"`, tanpa header.'],
      ['TF-IDF + Naive Bayes', 'Dalam satu Pipeline.'],
      ['Evaluasi', 'Precision spam penting: jangan sampai SMS penting terbuang.'],
      ['Kumpulkan data Indonesia', '30–50 SMS penipuan + 30–50 SMS biasa, sudah disensor.'],
      ['Latih ulang', 'Bandingkan model Inggris vs model yang dilatih data Indonesia.'],
    ],
    hasil: 'Model spam + dataset kecil SMS penipuan Indonesia yang sudah dianonimkan.',
    tantangan: ['Buat fitur tambahan: ada tautan? ada kata "hadiah"? ada angka rupiah?'],
    skill: ['Teks', 'Naive Bayes', 'Anonimisasi'],
    algo: ['naive-bayes'],
  },
  {
    id: 'p-segmentasi',
    tahap: 'machine-learning',
    judul: 'Segmentasi pelanggan mal dengan K-Means',
    durasi: '3–4 jam',
    ringkas: 'Mengelompokkan pelanggan berdasarkan pendapatan dan skor belanja, lalu memberi nama setiap segmen.',
    dataset: {
      nama: 'Mall Customer Segmentation (200 pelanggan)',
      cara: 'siap',
      sumber: [['Kaggle: Customer Segmentation Tutorial', 'https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python']],
      petunjuk: 'Dataset kecil dan bersih, cocok untuk memahami clustering. Setelah itu, terapkan cara yang sama ke data RFM dari proyek SQL retail yang jauh lebih realistis.',
    },
    langkah: [
      ['Pilih fitur', 'Pendapatan tahunan & skor belanja (lalu coba + umur).'],
      ['Scaling', 'StandardScaler agar satuan tidak mendominasi.'],
      ['Pilih K', 'Elbow method & silhouette score.'],
      ['Profil segmen', 'Rata-rata tiap fitur per cluster.'],
      ['Beri nama', 'Mis. "hemat berpenghasilan tinggi" → strategi pemasaran.'],
    ],
    hasil: 'Grafik cluster + tabel profil + saran strategi per segmen.',
    tantangan: ['Bandingkan dengan DBSCAN.', 'Terapkan ke RFM pelanggan Online Retail.'],
    skill: ['Clustering', 'Scaling', 'Interpretasi'],
    algo: ['kmeans', 'dbscan'],
  },
  {
    id: 'p-fraud',
    tahap: 'machine-learning',
    judul: 'Deteksi transaksi kartu kredit palsu',
    durasi: '1–2 hari',
    ringkas: 'Mendeteksi 0,17% transaksi penipuan di antara 284 ribu transaksi: latihan data yang sangat tidak seimbang.',
    dataset: {
      nama: 'Credit Card Fraud Detection',
      cara: 'siap',
      sumber: [['Kaggle: Credit Card Fraud Detection', 'https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud']],
      petunjuk: 'Kolom V1–V28 sudah diubah dengan PCA oleh pemilik data demi kerahasiaan, jadi tidak bisa ditafsirkan langsung. Ini contoh nyata cara perusahaan membagikan data sensitif.',
    },
    langkah: [
      ['Split stratified', 'Agar proporsi penipuan sama di latih & uji.'],
      ['Baseline', 'Model "semua normal" sudah 99,8% akurat: kenapa ini tidak berguna?'],
      ['Tangani imbalance', '`class_weight="balanced"` vs undersampling.'],
      ['Metrik', 'PR-AUC dan recall pada precision tertentu.'],
      ['Threshold', 'Pilih ambang berdasarkan biaya salah blokir vs penipuan lolos.'],
    ],
    hasil: 'Laporan perbandingan strategi imbalance dengan kurva precision-recall.',
    tantangan: ['Coba Isolation Forest (tanpa label) dan bandingkan.'],
    skill: ['Imbalance', 'PR-AUC', 'Biaya kesalahan'],
    algo: ['random-forest', 'gradient-boosting'],
  },
  {
    id: 'p-nilai-siswa',
    tahap: 'machine-learning',
    judul: 'Faktor yang memengaruhi nilai akhir siswa',
    durasi: '1 hari',
    ringkas: 'Model regresi yang bisa dijelaskan untuk melihat faktor kebiasaan belajar, dan diskusi etis tentang pemakaiannya.',
    dataset: {
      nama: 'Student Performance (UCI): siswa sekolah menengah di Portugal',
      cara: 'siap',
      sumber: [['UCI: Student Performance', 'https://archive.ics.uci.edu/dataset/320/student+performance']],
      petunjuk: 'Berisi nilai G1, G2, G3 dan 30 kolom latar belakang. Perhatian: jika G1 dan G2 dipakai untuk memprediksi G3, modelnya jadi "terlalu mudah". Putuskan dulu pertanyaanmu: memprediksi di awal semester (tanpa G1/G2) atau di akhir?',
    },
    langkah: [
      ['Tentukan skenario', 'Prediksi dini (tanpa G1/G2) vs akhir.'],
      ['Model sederhana', 'Regresi linear + decision tree dangkal.'],
      ['Interpretasi', 'Koefisien & feature importance.'],
      ['Bandingkan skenario', 'Seberapa besar beda MAE-nya?'],
      ['Diskusi etika', 'Bolehkah model ini dipakai untuk menentukan nasib siswa?'],
    ],
    hasil: 'Notebook + 1 halaman refleksi etika (bias, kebocoran, penggunaan wajar).',
    tantangan: ['Lakukan survei serupa di sekolahmu (dengan izin) dan bandingkan.'],
    skill: ['Interpretasi', 'Leakage', 'Etika AI'],
    algo: ['linear-regression', 'decision-tree'],
  },

  // ---------- Deep Learning ----------
  {
    id: 'p-fashion-mnist',
    tahap: 'deep-learning',
    judul: 'Fashion-MNIST: MLP vs CNN',
    durasi: '3–5 jam (Colab GPU)',
    ringkas: 'Mengklasifikasi 10 jenis pakaian dan membuktikan kenapa CNN lebih cocok untuk gambar.',
    dataset: {
      nama: 'Fashion-MNIST (70 ribu gambar 28×28)',
      cara: 'siap',
      sumber: [['Fashion-MNIST di GitHub', 'https://github.com/zalandoresearch/fashion-mnist']],
      petunjuk: 'Bisa langsung diunduh dari kode: `torchvision.datasets.FashionMNIST(root="data", download=True)` di PyTorch, atau `keras.datasets.fashion_mnist.load_data()` di Keras.',
    },
    langkah: [
      ['Muat & normalisasi', 'Piksel 0–255 → 0–1.'],
      ['MLP', '2 hidden layer; catat akurasi validasi.'],
      ['CNN', '2 lapis conv + pooling; parameter lebih sedikit.'],
      ['Kurva belajar', 'Plot loss latih vs validasi; pasang early stopping.'],
      ['Analisis salah', 'Confusion matrix: kelas mana yang tertukar?'],
    ],
    hasil: 'Tabel perbandingan akurasi & jumlah parameter + contoh gambar yang salah tebak.',
    tantangan: ['Tambahkan augmentasi dan dropout.'],
    skill: ['PyTorch/Keras', 'CNN', 'Kurva belajar'],
    algo: ['mlp', 'cnn'],
  },
  {
    id: 'p-makanan-nusantara',
    tahap: 'deep-learning',
    judul: 'Pengenal makanan Nusantara (dataset buatan sendiri)',
    durasi: '1 minggu (termasuk memotret)',
    ringkas: 'Mengumpulkan foto 5 jenis makanan sendiri, lalu melatih model dengan transfer learning.',
    dataset: {
      nama: 'Foto makanan hasil jepretanmu dan teman',
      cara: 'foto',
      sumber: [['Food-101 di Hugging Face (untuk pembanding)', 'https://huggingface.co/datasets/ethz/food101']],
      petunjuk: 'Pilih 5 makanan (mis. rendang, sate, nasi goreng, bakso, gado-gado). Targetkan **±100 foto per kelas** dari berbagai sudut, cahaya, dan piring. Simpan dalam folder `data/rendang/`, `data/sate/`, dst. Jangan mengambil foto dari internet sembarangan karena terikat hak cipta; jika terpaksa, pakai sumber berlisensi terbuka dan catat sumbernya.',
      kode: {
        code: py`
data/
  rendang/   img_001.jpg  img_002.jpg  ...
  sate/      img_001.jpg  ...
  nasgor/    ...
  bakso/     ...
  gadogado/  ...`,
        runnable: false,
        note: 'Struktur folder "satu folder = satu kelas" ini langsung dikenali ImageFolder (PyTorch) dan image_dataset_from_directory (Keras).',
      },
    },
    langkah: [
      ['Kumpulkan foto', 'Bagi tugas dengan teman; variasikan latar & cahaya.'],
      ['Bersihkan', 'Buang foto buram/duplikat; samakan format JPG.'],
      ['Split per sesi foto', 'Foto dari sesi yang sama jangan tersebar ke latih & uji.'],
      ['Transfer learning', 'Model pretrained (mis. ResNet/EfficientNet), latih lapisan akhir.'],
      ['Uji di dunia nyata', 'Foto baru di warung yang belum pernah dipakai.'],
    ],
    hasil: 'Dataset gambar milikmu sendiri + model dengan akurasi uji yang jujur.',
    tantangan: ['Publikasikan datasetnya (lihat proyek Karier).', 'Tambahkan kelas "bukan makanan".'],
    skill: ['Pengumpulan data', 'Transfer learning', 'Augmentasi'],
    algo: ['cnn'],
  },
  {
    id: 'p-sampah',
    tahap: 'deep-learning',
    judul: 'Klasifikasi sampah: organik, plastik, kertas, logam',
    durasi: '2–4 hari',
    ringkas: 'Model yang membantu memilah sampah dari foto, dilatih dengan dataset publik lalu diperkuat foto lokal.',
    dataset: {
      nama: 'Dataset publik "garbage classification" + foto sampah di sekitarmu',
      cara: 'siap',
      sumber: [cariKaggle('garbage classification'), ['Roboflow Universe (dataset gambar komunitas)', 'https://universe.roboflow.com']],
      petunjuk: 'Ada banyak dataset sampah di Kaggle dan Roboflow Universe; cek lisensi dan jumlah gambar per kelas sebelum memilih. Kemasan di Indonesia berbeda dengan di luar negeri, jadi tambahkan 30–50 foto lokal per kelas agar model tidak "kaget".',
    },
    langkah: [
      ['Pilih dataset', 'Bandingkan 2–3 kandidat: jumlah, kelas, lisensi.'],
      ['Tambah foto lokal', 'Bungkus mi instan, botol air mineral, daun, kardus.'],
      ['Latih', 'Transfer learning + augmentasi.'],
      ['Uji terpisah', 'Akurasi pada foto global vs foto lokal.'],
      ['Analisis', 'Kelas mana yang sering tertukar dan kenapa?'],
    ],
    hasil: 'Model + bukti bahwa data lokal meningkatkan performa di lingkunganmu.',
    tantangan: ['Deploy sebagai demo web (proyek Deploy).'],
    skill: ['Domain shift', 'Transfer learning'],
    algo: ['cnn'],
  },
  {
    id: 'p-daun-penyakit',
    tahap: 'deep-learning',
    judul: 'Deteksi penyakit daun tanaman',
    durasi: '2–3 hari',
    ringkas: 'Mengklasifikasi daun sehat dan sakit, lalu menguji apakah model tetap bekerja pada foto lapangan.',
    dataset: {
      nama: 'PlantVillage (foto daun berlatar polos) + foto kebun sendiri',
      cara: 'siap',
      sumber: [cariKaggle('plantvillage')],
      petunjuk: 'PlantVillage diambil di laboratorium dengan latar seragam, sehingga akurasi bisa 99% tetapi turun drastis di kebun sungguhan. Foto 20–30 daun di sekitarmu sebagai **data uji lapangan**: inilah pelajaran terpenting proyek ini.',
    },
    langkah: [
      ['Pilih 1 tanaman', 'Mis. tomat, dengan beberapa jenis penyakit.'],
      ['Latih', 'Transfer learning.'],
      ['Uji lab', 'Akurasi di data uji PlantVillage.'],
      ['Uji lapangan', 'Foto daunmu sendiri; bandingkan akurasinya.'],
      ['Perbaiki', 'Augmentasi latar acak, potong daun dari latar.'],
    ],
    hasil: 'Laporan "lab vs lapangan" yang menunjukkan pentingnya data uji yang realistis.',
    tantangan: ['Grad-CAM: bagian mana yang dilihat model?'],
    skill: ['Generalisasi', 'Evaluasi realistis'],
    algo: ['cnn'],
  },
  {
    id: 'p-suhu-lstm',
    tahap: 'deep-learning',
    judul: 'Prediksi suhu besok dengan LSTM',
    durasi: '1–2 hari',
    ringkas: 'Memakai data cuaca 10 tahun untuk memprediksi suhu maksimum esok hari, dibandingkan dengan baseline sederhana.',
    dataset: {
      nama: 'Data cuaca harian Open-Meteo (lanjutan proyek API cuaca)',
      cara: 'api',
      sumber: [['Open-Meteo Historical Weather API', 'https://open-meteo.com/en/docs/historical-weather-api']],
      petunjuk: 'Ambil 10 tahun data harian satu kota (lihat kode di proyek "Pengumpul data cuaca"). Untuk time series, **split berdasarkan waktu** (mis. 8 tahun latih, 1 validasi, 1 uji), jangan diacak.',
    },
    langkah: [
      ['Ambil data', '10 tahun, satu kota.'],
      ['Baseline', '"Suhu besok = suhu hari ini". Catat MAE-nya.'],
      ['Jendela waktu', 'Input 14 hari terakhir → target besok.'],
      ['LSTM', 'Latih dengan normalisasi dari data latih saja.'],
      ['Bandingkan', 'Apakah LSTM benar-benar mengalahkan baseline?'],
    ],
    hasil: 'Grafik prediksi vs aktual + tabel MAE baseline vs LSTM.',
    tantangan: ['Tambahkan fitur kelembapan & hari dalam setahun.'],
    skill: ['Time series', 'LSTM', 'Baseline'],
    algo: ['rnn'],
  },

  // =============================== AHLI ===============================
  // ---------- NLP & Computer Vision ----------
  {
    id: 'p-sentimen-indo',
    tahap: 'nlp-cv',
    judul: 'Analisis sentimen ulasan berbahasa Indonesia',
    durasi: '2–3 hari',
    ringkas: 'Dari TF-IDF + regresi logistik sampai fine-tuning IndoBERT, lalu diuji pada ulasan yang kamu kumpulkan sendiri.',
    dataset: {
      nama: 'SmSA dari benchmark IndoNLU (±12 ribu ulasan berlabel)',
      cara: 'siap',
      sumber: [['IndoNLU di GitHub', 'https://github.com/IndoNLP/indonlu']],
      petunjuk: 'Di repo IndoNLU, data SmSA ada di folder `dataset/` dalam format TSV (teks, label positif/negatif/netral). Untuk uji dunia nyata, salin 50–100 ulasan produk/aplikasi secara manual, buang nama pengguna, lalu labeli sendiri.',
    },
    langkah: [
      ['Baseline klasik', 'TF-IDF + regresi logistik.'],
      ['Fine-tune IndoBERT', 'Hugging Face Trainer di Colab GPU.'],
      ['Labeli data sendiri', 'Buat pedoman label; minta teman melabeli 30 yang sama untuk cek kesepakatan.'],
      ['Uji silang', 'Performa di SmSA vs di data buatanmu.'],
      ['Analisis salah', 'Sarkasme? bahasa gaul? campur Inggris?'],
    ],
    hasil: 'Dua model, dataset uji buatan sendiri, dan analisis kesalahan.',
    tantangan: ['Coba data bahasa daerah dari NusaX.'],
    skill: ['NLP', 'Fine-tuning', 'Pelabelan'],
    algo: ['transformer', 'naive-bayes'],
  },
  {
    id: 'p-topik-wikipedia',
    tahap: 'nlp-cv',
    judul: 'Klasifikasi topik artikel Wikipedia Indonesia',
    durasi: '1–2 hari',
    ringkas: 'Mengumpulkan artikel dari beberapa kategori lewat API Wikipedia, lalu melatih model penebak topik.',
    dataset: {
      nama: 'Artikel Wikipedia per kategori (dikumpulkan lewat API)',
      cara: 'api',
      sumber: [['MediaWiki Action API', 'https://www.mediawiki.org/wiki/API:Main_page'], ['Kebijakan User-Agent Wikimedia', 'https://meta.wikimedia.org/wiki/User-Agent_policy']],
      petunjuk: 'Pakai API resmi, bukan scraping halaman. Ambil daftar anggota kategori (`list=categorymembers`), lalu ringkasan tiap artikel. Isi header User-Agent dengan nama proyekmu sesuai kebijakan Wikimedia, dan beri jeda antar permintaan.',
    },
    langkah: [
      ['Pilih 4–5 kategori', 'Mis. Olahraga, Kuliner, Teknologi, Sejarah.'],
      ['Kumpulkan', '200 artikel per kategori, simpan ke JSONL.'],
      ['Bersihkan', 'Buang artikel terlalu pendek & duplikat.'],
      ['Model', 'TF-IDF + linear model, lalu embedding + logistic regression.'],
      ['Evaluasi', 'Confusion matrix & contoh artikel yang ambigu.'],
    ],
    hasil: 'Dataset JSONL berlisensi jelas (CC BY-SA) + model klasifikasi topik.',
    tantangan: ['Clustering tanpa label: apakah topiknya muncul sendiri?'],
    skill: ['API', 'Text classification', 'Embedding'],
  },
  {
    id: 'p-helm-yolo',
    tahap: 'nlp-cv',
    judul: 'Deteksi pengendara motor tanpa helm (YOLO)',
    durasi: '1–2 minggu',
    ringkas: 'Membuat dataset deteksi objek sendiri: merekam, memilih frame, menggambar kotak, lalu melatih YOLO.',
    dataset: {
      nama: 'Frame video jalan yang kamu rekam + label kotak',
      cara: 'foto',
      sumber: [['Label Studio (open-source)', 'https://labelstud.io'], ['CVAT', 'https://www.cvat.ai'], ['Roboflow Universe', 'https://universe.roboflow.com']],
      petunjuk: 'Rekam dari trotoar (bukan dari tengah jalan), ambil 1 frame tiap 1–2 detik agar tidak terlalu mirip, lalu gambar kotak "helm" dan "tanpa-helm". **Buramkan wajah dan pelat nomor** sebelum dibagikan. Mulai dengan ±300 gambar; dataset komunitas di Roboflow Universe bisa menambah variasi (cek lisensinya).',
    },
    langkah: [
      ['Rekam & potong frame', 'OpenCV: simpan 1 frame tiap 30–60 frame.'],
      ['Pedoman label', 'Kapan dianggap "pakai helm"? Bagaimana jika tertutup?'],
      ['Labeli', 'Label Studio/CVAT, ekspor ke format YOLO.'],
      ['Latih', 'Mulai dari model YOLO pretrained ukuran kecil.'],
      ['Evaluasi', 'mAP per kelas + contoh salah deteksi.'],
    ],
    hasil: 'Dataset deteksi objek pertama milikmu + model yang bisa dicoba di video baru.',
    tantangan: ['Hitung jumlah pelanggar per menit di sebuah video.'],
    skill: ['Anotasi', 'Object detection', 'Privasi'],
  },
  {
    id: 'p-ocr-struk',
    tahap: 'nlp-cv',
    judul: 'Struk belanja jadi tabel pengeluaran (OCR)',
    durasi: '3–5 hari',
    ringkas: 'Memotret struk, membaca teksnya dengan OCR, lalu mengekstrak nama barang, harga, dan total.',
    dataset: {
      nama: 'Foto struk belanjamu sendiri (30–50 lembar)',
      cara: 'foto',
      petunjuk: 'Kumpulkan struk dari beberapa toko berbeda karena formatnya berbeda-beda. Untuk setiap struk, ketik manual total yang benar sebagai **kunci jawaban**, agar akurasi ekstraksi bisa diukur. Tutupi nomor kartu atau nama di struk.',
    },
    langkah: [
      ['Foto rapi', 'Cahaya terang, struk diratakan, tegak lurus.'],
      ['Pra-proses', 'Hitam-putih, luruskan, perbesar kontras.'],
      ['OCR', 'Tesseract/EasyOCR (atau model vision-language).'],
      ['Ekstraksi', 'Regex untuk harga & total; cocokkan dengan kunci jawaban.'],
      ['Gabungkan', 'Masukkan ke CSV proyek pencatat pengeluaran.'],
    ],
    hasil: 'Pipeline foto → tabel, dengan persentase total yang terbaca benar.',
    tantangan: ['Bandingkan OCR klasik vs LLM multimodal dengan output JSON.'],
    skill: ['OCR', 'Regex', 'Evaluasi ekstraksi'],
  },
  {
    id: 'p-nusax',
    tahap: 'nlp-cv',
    judul: 'Sentimen untuk bahasa daerah (NusaX)',
    durasi: '1–2 hari',
    ringkas: 'Membandingkan model untuk bahasa Jawa, Sunda, Bali, Minang, dan bahasa daerah lain dengan data paralel yang sama.',
    dataset: {
      nama: 'NusaX-senti: kalimat paralel dalam 10 bahasa daerah + Indonesia + Inggris',
      cara: 'siap',
      sumber: [['NusaX di GitHub', 'https://github.com/IndoNLP/nusax']],
      petunjuk: 'Karena kalimatnya paralel (isi sama, bahasa berbeda), perbedaan akurasi benar-benar mencerminkan kesulitan bahasanya, bukan perbedaan topik. Data ada di folder `datasets/sentiment/` per bahasa.',
    },
    langkah: [
      ['Pilih 3–4 bahasa', 'Termasuk bahasa Indonesia sebagai pembanding.'],
      ['Baseline', 'TF-IDF + logistic regression per bahasa.'],
      ['Model multibahasa', 'Fine-tune satu model untuk semua bahasa.'],
      ['Transfer', 'Latih di bahasa Indonesia, uji di bahasa daerah.'],
      ['Refleksi', 'Kenapa bahasa tertentu lebih sulit?'],
    ],
    hasil: 'Tabel akurasi per bahasa + catatan tentang NLP bahasa daerah.',
    tantangan: ['Tambahkan 50 kalimat bahasa daerahmu sendiri sebagai data uji.'],
    skill: ['NLP multibahasa', 'Cross-lingual'],
    algo: ['transformer'],
  },

  // ---------- LLM & Generative AI ----------
  {
    id: 'p-rag-peraturan',
    tahap: 'llm',
    judul: 'Chatbot tanya-jawab peraturan (RAG)',
    durasi: '3–5 hari',
    ringkas: 'Chatbot yang menjawab pertanyaan berdasarkan dokumen peraturan dan selalu menyebut pasal sumbernya.',
    dataset: {
      nama: 'PDF peraturan resmi + set pertanyaan uji buatanmu',
      cara: 'siap',
      sumber: [['Database Peraturan JDIH BPK', 'https://peraturan.bpk.go.id']],
      petunjuk: 'Unduh 2–5 peraturan yang saling terkait (atau peraturan sekolah/kampusmu dengan izin). Lalu **buat sendiri 30 pasangan pertanyaan–jawaban** beserta pasal rujukannya: inilah dataset evaluasi yang menentukan apakah chatbotmu bisa dipercaya.',
    },
    langkah: [
      ['Ekstrak teks', 'PDF → teks; cek tabel dan nomor pasal tidak rusak.'],
      ['Chunking per pasal', 'Lebih bermakna daripada potongan per 500 karakter.'],
      ['Embedding & index', 'Simpan vektor + metadata (UU, pasal, ayat).'],
      ['Prompt dengan sitasi', 'Wajib menyebut pasal; jika tidak ada → bilang tidak tahu.'],
      ['Evaluasi', '30 pertanyaan uji: retrieval benar? jawaban benar?'],
    ],
    hasil: 'Chatbot + laporan evaluasi (persentase jawaban benar & bersitasi).',
    tantangan: ['Bandingkan chunk per pasal vs per ukuran tetap.', 'Tambahkan pencarian kata kunci (hybrid search).'],
    skill: ['RAG', 'Chunking', 'Evaluasi LLM'],
  },
  {
    id: 'p-ekstraksi-lowongan',
    tahap: 'llm',
    judul: 'Ekstraksi data terstruktur dari teks lowongan kerja',
    durasi: '2–3 hari',
    ringkas: 'LLM mengubah teks lowongan bebas menjadi JSON (posisi, kota, gaji, skill), lalu dievaluasi terhadap kunci jawaban manual.',
    dataset: {
      nama: '50 teks lowongan + JSON kunci jawaban yang kamu tulis sendiri',
      cara: 'catat',
      petunjuk: 'Salin teks lowongan dari papan pengumuman kampus atau situs yang mengizinkan, lalu buang nama kontak dan nomor HP. Tulis JSON jawaban yang benar secara manual (**gold label**). Boleh menambah contoh sintetis buatan LLM untuk variasi, tetapi data uji akhir sebaiknya teks asli yang dicek manusia.',
    },
    langkah: [
      ['Skema', 'Definisikan field & tipe (JSON Schema / Pydantic).'],
      ['Gold label', 'Tulis jawaban benar untuk 50 contoh.'],
      ['Structured output', 'Paksa LLM mengikuti skema.'],
      ['Ukur per field', 'Akurasi posisi, kota, gaji (toleransi angka), skill (F1).'],
      ['Perbaiki prompt', 'Lihat pola kesalahan, ulangi evaluasi.'],
    ],
    hasil: 'Skrip ekstraksi + tabel akurasi per field sebelum/sesudah perbaikan prompt.',
    tantangan: ['Bandingkan dua model: akurasi vs biaya per 1.000 dokumen.'],
    skill: ['Structured output', 'Gold label', 'Evaluasi'],
  },
  {
    id: 'p-golden-set',
    tahap: 'llm',
    judul: 'Membangun set evaluasi (golden set) untuk chatbot',
    durasi: '2–3 hari',
    ringkas: 'Kumpulan 60 kasus uji: pertanyaan normal, pertanyaan jebakan, dan percobaan prompt injection, plus penilai otomatis.',
    dataset: {
      nama: 'Kasus uji yang kamu rancang sendiri',
      cara: 'catat',
      petunjuk: 'Bagi menjadi 3 kelompok: 30 pertanyaan umum, 15 pertanyaan di luar cakupan (harus ditolak dengan sopan), 15 percobaan menyimpang dari tugas atau prompt injection. Tulis kriteria lulus untuk setiap kasus, bukan sekadar jawaban ideal.',
    },
    langkah: [
      ['Kumpulkan pertanyaan nyata', 'Tanya 5 calon pengguna: apa yang akan mereka tanyakan?'],
      ['Tulis kriteria', 'Mis. "menyebut sumber", "tidak mengarang angka".'],
      ['Penilai otomatis', 'Aturan sederhana + LLM sebagai penilai dengan rubrik.'],
      ['Cek penilai', 'Bandingkan nilai LLM dengan penilaianmu pada 20 kasus.'],
      ['Jalankan rutin', 'Setiap kali prompt/model diganti.'],
    ],
    hasil: 'File `eval.jsonl` + skrip yang mencetak skor per kelompok.',
    tantangan: ['Pasang di CI: tolak perubahan jika skor turun.'],
    skill: ['Eval', 'Keamanan LLM', 'LLM-as-judge'],
  },
  {
    id: 'p-agen-cuaca',
    tahap: 'llm',
    judul: 'Asisten perjalanan dengan tool use',
    durasi: '2–3 hari',
    ringkas: 'Agen LLM yang memanggil API cuaca dan kalkulator jarak untuk menyarankan jadwal perjalanan.',
    dataset: {
      nama: 'Data cuaca real-time dari API + skenario uji buatanmu',
      cara: 'api',
      sumber: [['Open-Meteo Forecast API', 'https://open-meteo.com/en/docs']],
      petunjuk: 'Agen tidak perlu dataset latih, tetapi tetap butuh **data uji**: tulis 20 permintaan pengguna dan langkah tool yang seharusnya dipanggil, untuk mengecek apakah agen memilih alat yang benar.',
    },
    langkah: [
      ['Definisikan tools', '`cek_cuaca(kota, tanggal)`, `jarak(a, b)`.'],
      ['Loop agen', 'LLM memilih tool → kamu jalankan → hasil dikembalikan.'],
      ['Batasan', 'Maksimal langkah, validasi argumen, tangani error API.'],
      ['Uji 20 skenario', 'Catat tool yang dipanggil vs yang diharapkan.'],
      ['Log', 'Simpan jejak percakapan untuk debugging.'],
    ],
    hasil: 'Agen yang bekerja + laporan ketepatan pemilihan tool.',
    tantangan: ['Tambahkan konfirmasi pengguna sebelum aksi yang berisiko.'],
    skill: ['Tool use', 'Agen', 'Logging'],
  },

  // =============================== PROFESIONAL ===============================
  // ---------- Deploy & MLOps ----------
  {
    id: 'p-api-model',
    tahap: 'deploy',
    judul: 'API prediksi churn dengan FastAPI + Docker',
    durasi: '2–3 hari',
    ringkas: 'Membungkus model churn menjadi endpoint `/prediksi`, lengkap dengan validasi input, log, dan container.',
    dataset: {
      nama: 'Model & data dari proyek churn + log permintaan yang masuk',
      cara: 'catat',
      petunjuk: 'Setelah deploy, setiap permintaan yang masuk adalah **data baru**. Simpan input, prediksi, dan waktu (tanpa data pribadi) ke file log. Nanti, saat label sebenarnya diketahui, log ini menjadi bahan evaluasi dan pelatihan ulang.',
    },
    langkah: [
      ['Simpan model', '`joblib.dump(pipeline, "model.joblib")` (pipeline lengkap).'],
      ['Endpoint', 'FastAPI + Pydantic untuk validasi input.'],
      ['Log', 'Tulis setiap permintaan ke JSONL.'],
      ['Docker', 'Dockerfile ramping, jalankan di lokal.'],
      ['Uji', 'Test endpoint dengan pytest + contoh input aneh.'],
    ],
    hasil: 'Container yang bisa dijalankan siapa pun dengan satu perintah.',
    tantangan: ['Deploy ke layanan cloud gratis/murah.', 'Tambahkan endpoint `/health`.'],
    skill: ['FastAPI', 'Docker', 'Logging'],
  },
  {
    id: 'p-demo-streamlit',
    tahap: 'deploy',
    judul: 'Demo web pemilah sampah di Hugging Face Spaces',
    durasi: '1–2 hari',
    ringkas: 'Aplikasi web tempat orang mengunggah foto sampah dan memberi tahu jika tebakan model salah.',
    dataset: {
      nama: 'Model proyek sampah + umpan balik pengguna',
      cara: 'catat',
      sumber: [['Hugging Face Spaces', 'https://huggingface.co/spaces']],
      petunjuk: 'Tombol "Tebakan salah? Pilih yang benar" mengubah pengguna menjadi pelabel. Minta **persetujuan** sebelum menyimpan foto mereka, dan jelaskan untuk apa foto dipakai. Ini cara banyak produk AI mengumpulkan data baru.',
    },
    langkah: [
      ['Antarmuka', 'Streamlit/Gradio: unggah foto → tebakan + keyakinan.'],
      ['Umpan balik', 'Tombol koreksi + kotak persetujuan.'],
      ['Penyimpanan', 'Simpan foto & label koreksi (mis. ke dataset HF privat).'],
      ['Deploy', 'Push ke Spaces; cek ukuran model & waktu muat.'],
      ['Tinjau mingguan', 'Berapa persen tebakan dikoreksi?'],
    ],
    hasil: 'Demo publik + mekanisme pengumpulan data yang etis.',
    tantangan: ['Latih ulang dengan data koreksi dan bandingkan.'],
    skill: ['Streamlit/Gradio', 'Human-in-the-loop'],
  },
  {
    id: 'p-monitoring-drift',
    tahap: 'deploy',
    judul: 'Simulasi monitoring drift data',
    durasi: '1–2 hari',
    ringkas: 'Membuat data "produksi" yang perlahan berubah, lalu membangun laporan yang mendeteksi kapan model perlu dilatih ulang.',
    dataset: {
      nama: 'Data produksi tiruan dengan drift yang disengaja',
      cara: 'sintetis',
      petunjuk: 'Karena data produksi asli jarang tersedia untuk latihan, kita **mensimulasikannya**: ambil data latih, lalu geser distribusinya sedikit demi sedikit setiap "minggu".',
      kode: {
        code: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(3)  # seed agar bisa diulang
latih = rng.normal(50, 10, 2000)  # distribusi fitur saat model dilatih (mis. umur pelanggan)
for minggu in range(1, 7):  # 6 minggu produksi
    geser = 2.5 * minggu  # rata-rata naik 2,5 setiap minggu (drift)
    prod = rng.normal(50 + geser, 10, 500)  # data yang masuk minggu ini
    # PSI sederhana: bandingkan proporsi di 10 kelompok (bin)
    bins = np.quantile(latih, np.linspace(0, 1, 11))  # batas bin dari data latih
    bins[0], bins[-1] = -np.inf, np.inf  # bin ujung terbuka
    p = np.histogram(latih, bins)[0] / len(latih)  # proporsi data latih per bin
    q = np.histogram(prod, bins)[0] / len(prod) + 1e-6  # proporsi data produksi per bin
    psi = np.sum((q - p) * np.log(q / p))  # Population Stability Index
    status = "AMAN" if psi < 0.1 else "WASPADA" if psi < 0.25 else "LATIH ULANG"  # aturan umum PSI
    print(f"minggu {minggu}: rata-rata {prod.mean():5.1f} | PSI {psi:.3f} -> {status}")  # laporan`,
        runnable: true,
      },
    },
    langkah: [
      ['Simulasikan drift', 'Kode di atas; coba juga drift mendadak.'],
      ['Ukur', 'PSI per fitur + performa model jika label tersedia.'],
      ['Ambang', 'Tentukan aturan kapan memberi peringatan.'],
      ['Laporan', 'Grafik PSI per minggu.'],
      ['Rencana aksi', 'Apa yang dilakukan saat status "LATIH ULANG"?'],
    ],
    hasil: 'Notebook monitoring + SOP singkat untuk tim.',
    tantangan: ['Pakai library Evidently untuk laporan otomatis.'],
    skill: ['Drift', 'Monitoring', 'Simulasi'],
  },

  // ---------- Portofolio & Karier ----------
  {
    id: 'p-publikasi-dataset',
    tahap: 'karier',
    judul: 'Publikasikan dataset buatanmu (dengan datasheet)',
    durasi: '1–2 hari',
    ringkas: 'Merapikan salah satu dataset buatanmu (foto makanan, SMS penipuan, survei) lalu membagikannya di Kaggle atau Hugging Face.',
    dataset: {
      nama: 'Dataset dari proyek sebelumnya',
      cara: 'catat',
      sumber: [['Membuat dataset di Kaggle', 'https://www.kaggle.com/datasets'], ['Dataset di Hugging Face Hub', 'https://huggingface.co/docs/hub/datasets-overview']],
      petunjuk: 'Dataset yang baik selalu punya dokumentasi: siapa yang mengumpulkan, kapan, bagaimana, untuk apa, arti setiap kolom/label, keterbatasan, dan **lisensi** (mis. CC BY 4.0). Pastikan tidak ada data pribadi dan kamu berhak membagikan semua isinya.',
    },
    langkah: [
      ['Pilih & bersihkan', 'Hapus data pribadi, duplikat, dan file rusak.'],
      ['Datasheet', 'README: motivasi, cara pengumpulan, statistik, keterbatasan.'],
      ['Lisensi', 'Pilih lisensi yang sesuai dan sebutkan sumber data asal.'],
      ['Unggah', 'Kaggle Datasets atau Hugging Face Hub.'],
      ['Notebook contoh', 'Satu notebook baseline agar orang mudah memulai.'],
    ],
    hasil: 'Dataset publik bertautan di CV-mu: bukti kemampuan yang jarang dimiliki pemula.',
    tantangan: ['Minta 3 orang mencoba dan beri masukan pada dokumentasinya.'],
    skill: ['Dokumentasi data', 'Lisensi', 'Etika'],
  },
  {
    id: 'p-kaggle-playground',
    tahap: 'karier',
    judul: 'Ikut kompetisi Kaggle Playground',
    durasi: '2–4 minggu',
    ringkas: 'Mengikuti kompetisi ringan bulanan, menulis notebook publik yang rapi, dan belajar dari solusi orang lain.',
    dataset: {
      nama: 'Dataset kompetisi (disediakan Kaggle)',
      cara: 'siap',
      sumber: [['Kompetisi Kaggle', 'https://www.kaggle.com/competitions']],
      petunjuk: 'Cari seri "Playground Series" di halaman kompetisi. Data biasanya bisa diunduh lewat tab Data atau perintah `kaggle competitions download -c <nama-kompetisi>` setelah kamu menyetujui aturan kompetisi.',
    },
    langkah: [
      ['Baca aturan & metrik', 'Metrik penilaian menentukan strategimu.'],
      ['Baseline cepat', 'Submit pertama di hari pertama.'],
      ['CV lokal yang bisa dipercaya', 'Jangan mengejar leaderboard publik.'],
      ['Iterasi', 'Fitur, model, ensemble; catat setiap eksperimen.'],
      ['Tulis notebook publik', 'Jelaskan apa yang berhasil dan tidak.'],
    ],
    hasil: 'Notebook publik + riwayat eksperimen yang bisa ditunjukkan saat wawancara.',
    tantangan: ['Baca 3 solusi teratas setelah kompetisi selesai dan coba ulangi satu ide.'],
    skill: ['Eksperimen', 'Validasi', 'Komunikasi'],
  },
  {
    id: 'p-portofolio-masalah-lokal',
    tahap: 'karier',
    judul: 'Proyek end-to-end dari masalah di sekitarmu',
    durasi: '1–2 bulan',
    ringkas: 'Satu proyek orisinal: kamu menemukan masalah, mengumpulkan data sendiri, membangun model, dan men-deploy-nya.',
    dataset: {
      nama: 'Data yang kamu kumpulkan untuk masalah nyata',
      cara: 'survei',
      petunjuk: 'Mulai dari masalah, bukan dari algoritma. Tanya UMKM, sekolah, atau komunitas di sekitarmu: data apa yang sudah mereka punya (buku kas, catatan stok, absensi)? Data yang sudah ada biasanya lebih realistis daripada data baru. Minta izin tertulis dan anonimkan.',
    },
    langkah: [
      ['Wawancara', 'Temukan 1 masalah yang bisa diukur.'],
      ['Data', 'Kumpulkan/kelola dengan izin; dokumentasikan.'],
      ['Baseline non-AI', 'Kadang aturan sederhana sudah cukup.'],
      ['Model & deploy', 'Versi pertama yang bisa dipakai pengguna.'],
      ['Ukur dampak', 'Waktu yang dihemat, kesalahan yang berkurang.'],
    ],
    hasil: 'Studi kasus lengkap di portofolio: masalah → data → solusi → dampak.',
    tantangan: ['Presentasikan hasilnya ke pemilik masalah dan catat masukannya.'],
    skill: ['Problem framing', 'End-to-end', 'Komunikasi'],
  },

  // ---------- Proyek untuk materi baru ----------
  {
    id: 'p-ab-test',
    tahap: 'matematika',
    judul: 'Analisis A/B test yang jujur',
    durasi: '3–4 jam',
    ringkas: 'Menganalisis hasil eksperimen A/B: konversi, p-value, interval kepercayaan, dan rekomendasi keputusan.',
    dataset: {
      nama: 'Dataset A/B test publik di Kaggle (atau simulasi sendiri)',
      cara: 'siap',
      sumber: [cariKaggle('ab testing')],
      petunjuk: 'Ada beberapa dataset A/B test publik di Kaggle (mis. eksperimen game mobile atau halaman situs). Baca deskripsinya: apa versi A dan B, metrik apa yang diukur, dan bagaimana pengguna dibagi. Jika belum menemukan yang cocok, simulasikan sendiri dengan peluang konversi yang kamu tentukan, lalu cek apakah analisismu menemukan "jawaban" yang kamu tanam.',
    },
    langkah: [
      ['Pahami desainnya', 'Satu metrik utama, unit acak (pengguna), durasi eksperimen.'],
      ['Cek kewajaran pembagian', 'Jumlah pengguna A dan B seimbang? Ciri-cirinya mirip?'],
      ['Uji', 'Chi-square/uji proporsi untuk konversi; t-test untuk rata-rata.'],
      ['Besar efek', 'Selisih + interval kepercayaan 95%, bukan hanya p-value.'],
      ['Rekomendasi', 'Tulis keputusan dan keterbatasannya dalam 5 kalimat untuk non-teknis.'],
    ],
    hasil: 'Notebook analisis + memo keputusan satu halaman.',
    tantangan: ['Hitung ukuran sampel yang dibutuhkan untuk mendeteksi kenaikan 1 poin persen.', 'Simulasikan efek "mengintip" hasil setiap hari.'],
    skill: ['Uji hipotesis', 'Interval kepercayaan', 'Komunikasi'],
  },
  {
    id: 'p-rekomendasi-film',
    tahap: 'machine-learning',
    judul: 'Sistem rekomendasi film MovieLens',
    durasi: '1–2 hari',
    ringkas: 'Membandingkan rekomendasi "terpopuler", item-based collaborative filtering, dan matrix factorization dengan evaluasi yang benar.',
    dataset: {
      nama: 'MovieLens (rating film dari pengguna sungguhan)',
      cara: 'siap',
      sumber: [['GroupLens: MovieLens datasets', 'https://grouplens.org/datasets/movielens/']],
      petunjuk: 'Mulai dari versi kecil "ml-latest-small" (±100 ribu rating) agar cepat. File `ratings.csv` berisi userId, movieId, rating, dan timestamp; `movies.csv` berisi judul dan genre. Baca lisensi di halaman GroupLens: boleh untuk riset/belajar, dengan syarat menyebut sumbernya.',
    },
    langkah: [
      ['Split berdasarkan waktu', 'Untuk tiap pengguna, rating terakhir menjadi data uji.'],
      ['Baseline populer', 'Film dengan rating terbanyak yang belum ditonton.'],
      ['Item-based CF', 'Cosine similarity antar film dari matriks pengguna × film.'],
      ['Matrix factorization', 'Mis. TruncatedSVD atau library `implicit`/`surprise`.'],
      ['Evaluasi', 'Hit rate@10 & precision@10 untuk ketiga pendekatan.'],
    ],
    hasil: 'Tabel perbandingan + contoh rekomendasi untuk beberapa pengguna yang masuk akal.',
    tantangan: ['Tambahkan content-based dari genre untuk film baru (cold start).', 'Ukur keberagaman genre dalam rekomendasi.'],
    skill: ['Rekomendasi', 'Evaluasi offline', 'Matrix factorization'],
    algo: ['knn'],
  },
  {
    id: 'p-bandit-promo',
    tahap: 'machine-learning',
    judul: 'Simulasi bandit untuk memilih promo',
    durasi: '3–4 jam',
    ringkas: 'Membandingkan epsilon-greedy, epsilon menurun, dan A/B test klasik untuk memilih teks promo terbaik.',
    dataset: {
      nama: 'Klik promo tiruan (dibuat dengan kode)',
      cara: 'sintetis',
      petunjuk: 'Tentukan sendiri peluang klik setiap promo (mis. 3%, 4%, 6%), lalu biarkan agen belajar tanpa mengetahuinya. Karena kamu tahu jawaban yang benar, kamu bisa mengukur **regret**: berapa klik yang hilang dibanding selalu memilih promo terbaik.',
    },
    langkah: [
      ['Buat lingkungan', 'Fungsi `klik(promo)` yang mengembalikan 1/0 sesuai peluang rahasia.'],
      ['Strategi', 'ε tetap, ε menurun, dan A/B rata sebagai pembanding.'],
      ['Ulangi banyak kali', '≥200 seed agar hasilnya tidak kebetulan.'],
      ['Ukur', 'Total klik, regret, dan seberapa cepat promo terbaik ditemukan.'],
      ['Uji ketahanan', 'Bagaimana jika peluang klik berubah di tengah jalan?'],
    ],
    hasil: 'Grafik regret kumulatif untuk tiap strategi + rekomendasi kapan memakai bandit vs A/B test.',
    tantangan: ['Implementasikan Thompson sampling dan bandingkan.'],
    skill: ['Reinforcement learning', 'Simulasi', 'Eksperimen'],
    algo: ['q-learning'],
  },
  {
    id: 'p-transkrip-kuliah',
    tahap: 'nlp-cv',
    judul: 'Transkrip & ringkasan rekaman kuliah',
    durasi: '2–4 hari',
    ringkas: 'Mengubah rekaman kuliah menjadi transkrip dengan Whisper, mengukur akurasinya (WER), lalu membuat ringkasan per topik.',
    dataset: {
      nama: 'Rekaman suaramu sendiri (dengan izin) + potongan transkrip manual',
      cara: 'foto',
      sumber: [['Mozilla Common Voice (suara bahasa Indonesia, untuk pembanding)', 'https://commonvoice.mozilla.org']],
      petunjuk: 'Minta izin dosen/pembicara sebelum merekam dan jangan menyebarkan rekamannya. Transkripsi manual 3–5 menit sebagai kunci jawaban untuk menghitung WER. Rekam dari beberapa posisi (depan, belakang kelas) untuk melihat pengaruh kualitas audio.',
    },
    langkah: [
      ['Siapkan audio', 'Ubah ke mono 16 kHz; potong bagian hening panjang.'],
      ['Transkripsi', 'Whisper (bahasa Indonesia), coba ukuran model berbeda.'],
      ['Ukur WER', 'Bandingkan dengan transkrip manual; catat jenis kesalahan (istilah, angka, nama).'],
      ['Ringkas', 'LLM meringkas per bagian, dengan kutipan waktu (timestamp).'],
      ['Cek manusia', 'Periksa istilah teknis dan angka sebelum dibagikan.'],
    ],
    hasil: 'Transkrip + ringkasan + tabel WER per ukuran model dan posisi rekam.',
    tantangan: ['Buat daftar istilah kuliah agar ejaan istilah teknis lebih tepat.'],
    skill: ['Speech recognition', 'Evaluasi WER', 'Privasi'],
  },
  {
    id: 'p-taksi-parquet',
    tahap: 'data-science',
    judul: 'Analisis jutaan perjalanan taksi dengan Parquet & Polars',
    durasi: '1 hari',
    ringkas: 'Mengolah data perjalanan taksi New York satu bulan (jutaan baris) di laptop biasa dan membandingkan Pandas, Polars, dan DuckDB.',
    dataset: {
      nama: 'NYC TLC Trip Record Data (file Parquet per bulan)',
      cara: 'siap',
      sumber: [['NYC Taxi & Limousine Commission: Trip Record Data', 'https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page']],
      petunjuk: 'Unduh satu file bulanan "Yellow Taxi Trip Records" dalam format Parquet (sekitar puluhan MB, berisi jutaan baris). Baca juga kamus datanya (data dictionary) di halaman yang sama untuk arti setiap kolom.',
    },
    langkah: [
      ['Ukur', 'Ukuran file, jumlah baris, memori setelah dibaca Pandas.'],
      ['Pertanyaan', 'Jam tersibuk, rata-rata tarif per jarak, lokasi jemput terpopuler.'],
      ['Tiga cara', 'Jawab dengan Pandas, Polars (lazy), dan DuckDB (SQL).'],
      ['Bandingkan', 'Waktu eksekusi dan memori masing-masing.'],
      ['Bersihkan', 'Buang perjalanan berjarak 0 atau tarif negatif, lalu jelaskan dampaknya.'],
    ],
    hasil: 'Notebook dengan tabel perbandingan kecepatan + 3 temuan menarik dari data.',
    tantangan: ['Gabungkan 3 bulan sekaligus dengan `scan_parquet("*.parquet")`.'],
    skill: ['Parquet', 'Polars', 'DuckDB'],
  },
  {
    id: 'p-anomali-sensor',
    tahap: 'machine-learning',
    judul: 'Deteksi anomali deret waktu sensor',
    durasi: '1 hari',
    ringkas: 'Membandingkan aturan median bergerak, Isolation Forest, dan LOF pada data sensor yang anomalinya sudah diberi label.',
    dataset: {
      nama: 'Numenta Anomaly Benchmark (NAB)',
      cara: 'siap',
      sumber: [['NAB di GitHub', 'https://github.com/numenta/NAB']],
      petunjuk: 'Folder `data/` berisi puluhan deret waktu nyata (suhu mesin, lalu lintas, CPU server). Label waktu anomali ada di folder `labels/`. Karena labelnya ada, kamu bisa mengukur precision dan recall setiap metode.',
    },
    langkah: [
      ['Pilih 2–3 deret', 'Mis. suhu mesin industri dan beban CPU.'],
      ['Baseline aturan', 'Median bergerak + ambang MAD.'],
      ['Model', 'Isolation Forest dengan fitur lag & rolling.'],
      ['Evaluasi', 'Precision, recall, dan seberapa cepat anomali terdeteksi.'],
      ['Visualisasi', 'Plot deret waktu dengan titik deteksi dan label asli.'],
    ],
    hasil: 'Grafik per deret + tabel perbandingan metode.',
    tantangan: ['Coba autoencoder dari tahap Deep Learning.'],
    skill: ['Deteksi anomali', 'Time series', 'Evaluasi'],
  },
  {
    id: 'p-ci-model',
    tahap: 'deploy',
    judul: 'Pipeline CI untuk model: tes data, tes model, versi data',
    durasi: '1–2 hari',
    ringkas: 'Repo yang otomatis menolak data rusak dan model yang lebih buruk setiap kali ada push, lengkap dengan versi data DVC.',
    dataset: {
      nama: 'Data & model dari proyek churn atau harga rumah',
      cara: 'catat',
      petunjuk: 'Pakai data proyek sebelumnya. Sengaja buat beberapa versi "rusak" (kolom berganti nama, nilai negatif, banyak kosong) untuk membuktikan tesmu benar-benar menangkap masalah.',
    },
    langkah: [
      ['Lacak data', '`dvc init`, `dvc add data/...`, commit file `.dvc`.'],
      ['Tes data', 'Skema, tipe, rentang, persentase kosong (pandera atau fungsi sendiri).'],
      ['Gerbang kualitas', 'Bandingkan model baru dengan model yang tersimpan.'],
      ['GitHub Actions', 'Jalankan semua tes setiap push & pull request.'],
      ['Buktikan', 'Buat pull request berisi data rusak dan tunjukkan CI gagal.'],
    ],
    hasil: 'Repo dengan badge CI hijau, plus contoh pull request yang ditolak otomatis.',
    tantangan: ['Tambahkan `dvc.yaml` dan `dvc repro` untuk pipeline lengkap.'],
    skill: ['CI/CD', 'Validasi data', 'DVC'],
  },
  {
    id: 'p-mini-warehouse',
    tahap: 'data-science',
    judul: 'Mini data warehouse dari data Online Retail',
    durasi: '1–2 hari',
    ringkas: 'Mengubah ±500 ribu transaksi mentah menjadi skema bintang (fakta + dimensi) di DuckDB/SQLite, lengkap dengan ETL yang bisa diulang dan laporan SQL.',
    dataset: {
      nama: 'Online Retail (UCI)',
      cara: 'siap',
      sumber: [['UCI: Online Retail', 'https://archive.ics.uci.edu/dataset/352/online+retail']],
      petunjuk: 'Data mentah berisi satu tabel lebar: nomor faktur, kode & deskripsi produk, jumlah, tanggal, harga, ID pelanggan, dan negara. Tugasmu memecahnya menjadi tabel fakta penjualan serta dimensi produk, pelanggan, negara, dan tanggal.',
    },
    langkah: [
      ['Extract', 'Baca file Excel apa adanya, simpan salinan mentah.'],
      ['Transform', 'Buang pembatalan (faktur berawalan C), jumlah negatif, duplikat; rapikan deskripsi produk.'],
      ['Rancang skema bintang', 'fakta_penjualan + dim_produk, dim_pelanggan, dim_negara, dim_tanggal.'],
      ['Load & uji', 'Muat ke DuckDB/SQLite; cek jumlah baris dan total omzet sebelum vs sesudah.'],
      ['Laporan', '5 query: omzet per bulan, produk terlaris per negara, pelanggan paling bernilai, dll.'],
    ],
    hasil: 'Skrip ETL yang bisa dijalankan ulang + file database + 5 query laporan beserta hasilnya.',
    tantangan: ['Partisi data per bulan dalam file Parquet.', 'Kelola transformasi SQL dengan dbt.'],
    skill: ['ETL', 'Skema bintang', 'SQL'],
  },
]
