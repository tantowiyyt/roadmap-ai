import { py } from './py.js'

// Panduan mendapatkan & membuat dataset (halaman Proyek → "Cara mendapatkan dataset").
// Kode dengan runnable: false butuh internet/komputer sendiri; sisanya bisa dijalankan di browser.

export const alurDataset = [
  ['Rumuskan pertanyaannya dulu', 'Apa yang ingin ditebak atau dipahami? Dari situ ketahuan kolom apa yang dibutuhkan, termasuk kolom **target** (label).'],
  ['Cari yang sudah ada', 'Mulai dari dataset siap pakai: lebih cepat, sudah dipakai banyak orang, dan ada pembandingnya.'],
  ['Cek kecocokan & lisensi', 'Apakah isinya sesuai konteksmu (bahasa, negara, tahun)? Boleh dipakai untuk tujuanmu?'],
  ['Kalau tidak ada, buat sendiri', 'Catat, survei, foto, API, scraping yang etis, atau data sintetis untuk latihan.'],
  ['Dokumentasikan & simpan mentahnya', 'Tulis asal-usul data, simpan versi mentah tanpa diubah, lalu bersihkan di salinannya.'],
]

export const sumberSiap = [
  {
    nama: 'Bawaan scikit-learn',
    icon: '🧰',
    cocok: 'Latihan pertama: kecil, bersih, langsung jalan tanpa internet.',
    url: 'https://scikit-learn.org/stable/datasets/toy_dataset.html',
    cara: 'Sudah terpasang bersama scikit-learn: `load_iris`, `load_wine`, `load_breast_cancer`, `load_digits`, `load_diabetes`.',
  },
  {
    nama: 'Kaggle Datasets & Competitions',
    icon: '🏆',
    cocok: 'Ribuan dataset dari berbagai bidang, lengkap dengan notebook contoh dari komunitas.',
    url: 'https://www.kaggle.com/datasets',
    cara: 'Unduh lewat tombol Download, atau lewat terminal dengan Kaggle CLI (butuh API token dari halaman Settings akunmu).',
  },
  {
    nama: 'Hugging Face Datasets',
    icon: '🤗',
    cocok: 'Teks, audio, gambar; banyak dataset NLP termasuk bahasa Indonesia.',
    url: 'https://huggingface.co/datasets',
    cara: '`pip install datasets`, lalu `load_dataset("nama/dataset")`. Cari dengan filter bahasa "Indonesian".',
  },
  {
    nama: 'UCI Machine Learning Repository',
    icon: '🎓',
    cocok: 'Dataset klasik untuk tabel: kualitas anggur, peminjaman sepeda, nilai siswa, SMS spam.',
    url: 'https://archive.ics.uci.edu',
    cara: 'Unduh ZIP dari halaman dataset, atau `pip install ucimlrepo` lalu `fetch_ucirepo(id=...)` (id ada di halaman dataset).',
  },
  {
    nama: 'OpenML',
    icon: '🔓',
    cocok: 'Ribuan dataset tabel yang langsung bisa diambil dari scikit-learn.',
    url: 'https://www.openml.org',
    cara: '`fetch_openml("nama", version=1, as_frame=True)` dari scikit-learn.',
  },
  {
    nama: 'Torchvision / Keras datasets',
    icon: '🖼️',
    cocok: 'Gambar klasik untuk deep learning: MNIST, Fashion-MNIST, CIFAR-10.',
    url: 'https://pytorch.org/vision/stable/datasets.html',
    cara: 'Satu baris kode dengan `download=True`; otomatis tersimpan di folder data.',
  },
  {
    nama: 'Google Dataset Search',
    icon: '🔎',
    cocok: 'Mesin pencari khusus dataset dari universitas, pemerintah, dan lembaga riset.',
    url: 'https://datasetsearch.research.google.com',
    cara: 'Ketik topik (mis. "curah hujan Indonesia"), lalu ikuti tautan ke penyedia aslinya.',
  },
]

export const sumberIndonesia = [
  { nama: 'Badan Pusat Statistik (BPS)', url: 'https://www.bps.go.id', isi: 'Kependudukan, ekonomi, pendidikan, kemiskinan per provinsi/kabupaten. Tabel bisa diunduh sebagai Excel/CSV.' },
  { nama: 'Satu Data Indonesia', url: 'https://data.go.id', isi: 'Portal data terbuka dari kementerian dan pemerintah daerah.' },
  { nama: 'Data Terbuka BMKG', url: 'https://data.bmkg.go.id', isi: 'Gempa terkini dan prakiraan cuaca dalam format JSON/XML.' },
  { nama: 'Open-Meteo', url: 'https://open-meteo.com', isi: 'Cuaca historis & prakiraan untuk koordinat mana pun, gratis untuk non-komersial, tanpa API key.' },
  { nama: 'IndoNLP (IndoNLU, NusaX, dll.)', url: 'https://github.com/IndoNLP', isi: 'Kumpulan dataset NLP bahasa Indonesia dan bahasa daerah untuk riset.' },
  { nama: 'Database Peraturan JDIH BPK', url: 'https://peraturan.bpk.go.id', isi: 'Teks peraturan perundang-undangan, cocok untuk proyek RAG.' },
]

export const kodeAmbil = [
  {
    judul: 'Dataset bawaan scikit-learn (bisa langsung dijalankan)',
    runnable: true,
    code: py`
from sklearn.datasets import load_iris, load_wine, load_breast_cancer, load_digits, load_diabetes  # dataset bawaan

for muat in [load_iris, load_wine, load_breast_cancer, load_digits, load_diabetes]:  # coba satu per satu
    d = muat(as_frame=True)  # muat sebagai DataFrame Pandas
    print(f"{muat.__name__:20s} -> {d.frame.shape[0]:5d} baris, {d.data.shape[1]:3d} fitur")  # ringkasan ukuran

wine = load_wine(as_frame=True).frame  # ambil satu untuk dilihat
print(wine.head(3))  # 3 baris pertama`,
  },
  {
    judul: 'Kaggle lewat terminal',
    runnable: false,
    note: 'Buat API token di kaggle.com → Settings → API, lalu ikuti petunjuk penyimpanan token di halaman itu.',
    code: py`
pip install kaggle
kaggle datasets download -d blastchar/telco-customer-churn --unzip -p data/
kaggle competitions download -c titanic -p data/`,
  },
  {
    judul: 'Hugging Face Datasets',
    runnable: false,
    code: py`
from datasets import load_dataset  # pip install datasets

ds = load_dataset("stanfordnlp/imdb")  # unduh sekali, lalu tersimpan di cache
print(ds)  # lihat pembagian train/test & jumlah baris
df = ds["train"].to_pandas()  # ubah ke DataFrame jika lebih nyaman
print(df.head())  # intip isinya`,
  },
  {
    judul: 'UCI Repository dengan ucimlrepo',
    runnable: false,
    code: py`
from ucimlrepo import fetch_ucirepo  # pip install ucimlrepo

iris = fetch_ucirepo(id=53)  # id 53 = Iris (lihat id di halaman dataset UCI)
X = iris.data.features  # tabel fitur
y = iris.data.targets  # tabel target
print(iris.metadata["name"], X.shape)  # nama & ukuran`,
  },
  {
    judul: 'Membaca hasil Google Form / Google Sheets',
    runnable: false,
    note: 'Sheet harus dibagikan "siapa saja yang memiliki link". Untuk data pribadi, lebih aman unduh CSV manual.',
    code: py`
import pandas as pd  # tabel

ID = "ID_SPREADSHEET_KAMU"  # bagian panjang di URL antara /d/ dan /edit
url = f"https://docs.google.com/spreadsheets/d/{ID}/export?format=csv"  # alamat ekspor CSV
df = pd.read_csv(url)  # langsung jadi DataFrame
df.columns = ["waktu", "jam_tidur", "fokus", "angkatan"]  # ganti judul pertanyaan yang panjang
print(df.describe())  # ringkasan`,
  },
]

export const caraBuat = [
  {
    cara: 'catat',
    judul: 'Catat sendiri (log harian)',
    kapan: 'Data tentang dirimu atau kegiatanmu: pengeluaran, jam belajar, langkah kaki, penjualan warung keluarga.',
    langkah: ['Tentukan kolom dan satuannya sebelum mulai.', 'Pakai daftar kategori tetap (dropdown di Google Sheets).', 'Catat di waktu yang sama setiap hari.', 'Kumpulkan minimal 2–4 minggu agar polanya terlihat.'],
    awas: ['Data yang terlewat beberapa hari: tandai kosong, jangan dikarang.', 'Penulisan tidak konsisten ("Makan", "makan", "mkn").'],
  },
  {
    cara: 'survei',
    judul: 'Survei / kuesioner',
    kapan: 'Pendapat, kebiasaan, atau karakteristik sekelompok orang.',
    langkah: ['Tulis tujuan dan pertanyaan yang ingin dijawab.', 'Utamakan pertanyaan tertutup: pilihan, angka, skala 1–5.', 'Uji coba ke 3–5 orang, perbaiki kalimat yang membingungkan.', 'Ekspor ke CSV (Google Forms → Sheets → Download CSV).'],
    alat: ['Google Forms', 'Microsoft Forms', 'KoboToolbox (untuk survei lapangan)'],
    awas: ['Jelaskan tujuan dan minta persetujuan di awal.', 'Jangan minta nama, NIK, atau nomor HP jika tidak perlu.', 'Responden dari satu grup saja bukan gambaran semua orang: tulis sebagai keterbatasan.'],
  },
  {
    cara: 'foto',
    judul: 'Foto, rekam suara, atau video sendiri',
    kapan: 'Klasifikasi gambar, deteksi objek, pengenalan suara, terutama untuk hal yang khas Indonesia.',
    langkah: ['Satu folder per kelas: `data/rendang/`, `data/sate/`.', 'Variasikan latar, cahaya, sudut, jarak, dan perangkat.', 'Untuk transfer learning, mulai dari ±100 foto per kelas.', 'Pisahkan data uji berdasarkan sesi/lokasi pengambilan, bukan acak per foto.'],
    alat: ['Kamera HP', 'Label Studio / CVAT untuk menggambar kotak', 'Roboflow untuk mengelola dataset gambar'],
    awas: ['Buramkan wajah dan pelat nomor orang lain.', 'Foto dari internet umumnya dilindungi hak cipta.', 'Foto beruntun yang hampir identik membuat akurasi uji palsu tinggi.'],
  },
  {
    cara: 'api',
    judul: 'Ambil lewat API',
    kapan: 'Data yang disediakan resmi oleh layanan: cuaca, gempa, Wikipedia, GitHub, data pemerintah.',
    langkah: ['Baca dokumentasi: alamat, parameter, batas permintaan (rate limit).', 'Coba satu permintaan, lihat struktur JSON-nya.', 'Simpan respons mentah, baru olah ke tabel.', 'Beri jeda dan tangani error (timeout, kode 429).'],
    alat: ['requests', 'pandas.json_normalize'],
    awas: ['Jangan menaruh API key di kode yang di-push ke GitHub; pakai variabel lingkungan.', 'Patuhi syarat pemakaian dan cantumkan sumber.'],
  },
  {
    cara: 'scrape',
    judul: 'Web scraping (dengan etika)',
    kapan: 'Data publik di halaman web yang tidak punya API. Pilihan terakhir, bukan pertama.',
    langkah: ['Cek dulu: adakah API resmi atau dataset unduhan?', 'Baca `robots.txt` dan syarat layanan situsnya.', 'Ambil satu halaman, pastikan pemilihan elemen benar.', 'Ulangi dengan jeda (≥1 detik) dan simpan HTML mentahnya.'],
    alat: ['requests + BeautifulSoup', 'Playwright (untuk halaman yang memakai JavaScript)', 'books.toscrape.com untuk latihan'],
    awas: ['Jangan mengambil data pribadi. Di Indonesia ada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.', 'Jangan membebani server (ribuan permintaan per menit).', 'Konten berhak cipta tidak boleh disebarkan ulang sembarangan.'],
  },
  {
    cara: 'sintetis',
    judul: 'Data sintetis (dibuat dengan kode)',
    kapan: 'Latihan algoritma, menguji kode, simulasi, atau saat data asli bersifat rahasia.',
    langkah: ['Tentukan aturan "dunia"-nya (rumus, peluang, pola musiman).', 'Tambahkan noise agar tidak terlalu sempurna.', 'Pakai seed agar bisa diulang.', 'Untuk teks, LLM bisa membuat variasi, tetapi cek manual hasilnya.'],
    alat: ['NumPy', '`sklearn.datasets.make_classification` / `make_regression` / `make_blobs` / `make_moons`'],
    awas: ['Model yang hebat di data sintetis belum tentu hebat di data nyata.', 'Jangan memakai data buatan LLM sebagai satu-satunya data uji.'],
  },
]

export const kodeBuat = [
  {
    judul: 'Dataset sintetis klasifikasi & regresi dalam 3 baris',
    runnable: true,
    code: py`
from sklearn.datasets import make_classification, make_regression  # pembuat data sintetis
import pandas as pd  # tabel

X, y = make_classification(n_samples=500, n_features=5, n_informative=3,  # 500 baris, 3 fitur benar-benar berguna
                           weights=[0.9, 0.1], random_state=0)  # kelas tidak seimbang 90:10
df = pd.DataFrame(X, columns=[f"f{i}" for i in range(5)]).assign(target=y)  # jadikan tabel + kolom target
print(df["target"].value_counts())  # cek keseimbangan kelas

Xr, yr = make_regression(n_samples=200, n_features=3, noise=10, random_state=0)  # data regresi dengan noise
print(Xr.shape, yr[:3].round(1))  # ukuran & 3 target pertama`,
  },
  {
    judul: 'Data sintetis yang realistis: penjualan warung 1 tahun',
    runnable: true,
    code: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(42)  # seed agar data selalu sama
tgl = pd.date_range("2025-01-01", "2025-12-31", freq="D")  # setiap hari selama setahun
akhir_pekan = tgl.dayofweek.to_numpy() >= 5  # Sabtu/Minggu (to_numpy: jadikan array biasa)
hujan = rng.random(len(tgl)) < 0.35  # 35% hari hujan
musim = 10 * np.sin(2 * np.pi * tgl.dayofyear.to_numpy() / 365)  # pola musiman pelan
hari = tgl.day.to_numpy()  # tanggal dalam bulan
gajian = (hari >= 25) | (hari <= 2)  # sekitar tanggal gajian

porsi = (60 + 15 * akhir_pekan - 12 * hujan + musim + 10 * gajian  # aturan dunia buatan kita
         + rng.normal(0, 6, len(tgl))).round().clip(0)  # ditambah noise, tidak boleh negatif
df = pd.DataFrame({"tanggal": tgl, "akhir_pekan": akhir_pekan, "hujan": hujan, "porsi_terjual": porsi})  # tabel akhir
df.loc[rng.choice(len(df), 8, replace=False), "porsi_terjual"] = np.nan  # sengaja: 8 hari lupa dicatat

print(df.head())  # intip data
print(df.groupby("hujan")["porsi_terjual"].mean().round(1))  # benarkah hujan menurunkan penjualan?`,
  },
  {
    judul: 'Cek kualitas dataset sebelum dipakai',
    runnable: true,
    code: py`
import pandas as pd, numpy as np  # tabel & angka

def cek_dataset(df, target=None):  # laporan kualitas singkat
    print(f"Ukuran: {df.shape[0]} baris x {df.shape[1]} kolom")  # jumlah baris & kolom
    hilang = df.isna().mean().mul(100).round(1)  # persen data kosong per kolom
    print("Kosong (%):", hilang[hilang > 0].to_dict() or "tidak ada")  # tampilkan yang bermasalah saja
    print("Baris duplikat:", df.duplicated().sum())  # baris yang persis sama
    konstan = [c for c in df if df[c].nunique(dropna=False) <= 1]  # kolom yang isinya cuma satu nilai
    mirip_id = [c for c in df if not pd.api.types.is_numeric_dtype(df[c]) and df[c].nunique() / len(df) > 0.75]  # teks yang hampir selalu berbeda (nama/ID)
    print("Kolom konstan:", konstan or "-", "| Kolom mirip ID:", mirip_id or "-")  # biasanya tidak berguna untuk model
    if target:  # jika ada kolom target
        print("Proporsi kelas:", df[target].value_counts(normalize=True).round(2).to_dict())  # cek imbalance

contoh = pd.DataFrame({  # data kecil dengan masalah yang disengaja
    "nama": ["Ani", "Budi", "Citra", "Dodi", "Dodi"],  # kolom mirip ID
    "umur": [21, np.nan, 19, 22, 22],  # ada yang kosong
    "kota": ["Bogor"] * 5,  # konstan
    "lulus": [1, 0, 1, 1, 1],  # target
})
contoh.loc[4] = contoh.loc[3]  # buat satu baris duplikat
cek_dataset(contoh, target="lulus")  # jalankan pemeriksaan`,
  },
]

export const checklistDataset = [
  ['Pertanyaan & target jelas', 'Ada kolom yang ingin ditebak, dan nilainya tersedia saat prediksi akan dipakai.'],
  ['Cukup banyak & beragam', 'Patokan kasar: ratusan baris untuk model tabel sederhana, ±100 gambar per kelas untuk transfer learning. Variasi lebih penting daripada jumlah.'],
  ['Kelas seimbang?', 'Jika satu kelas hanya 5%, siapkan metrik dan strategi khusus imbalance.'],
  ['Tidak bocor', 'Tidak ada kolom yang "membocorkan" jawaban (mis. tanggal lunas untuk memprediksi gagal bayar).'],
  ['Lisensi jelas', 'CC0 / CC BY bebas dipakai dengan atribusi; "non-commercial" tidak boleh untuk produk berbayar; tanpa lisensi = tanyakan dulu.'],
  ['Bebas data pribadi', 'Hapus atau samarkan nama, NIK, nomor HP, alamat, wajah, pelat nomor.'],
  ['Terdokumentasi', 'README: sumber, tanggal, cara pengumpulan, arti kolom, keterbatasan.'],
  ['Mentah disimpan', 'Simpan versi asli tanpa diubah; semua pembersihan dilakukan lewat kode yang bisa diulang.'],
]

export const formatSimpan = [
  ['CSV', 'Tabel kecil–sedang; bisa dibuka di Excel. Simpan dengan `index=False` dan encoding UTF-8.'],
  ['Parquet', 'Tabel besar; jauh lebih kecil dan cepat dibaca, tipe kolom ikut tersimpan.'],
  ['JSON Lines (.jsonl)', 'Teks atau data bersarang: satu baris = satu objek JSON. Format umum untuk dataset LLM.'],
  ['Folder per kelas', 'Gambar/audio: `data/train/kucing/*.jpg`. Label = nama folder.'],
  ['Jangan commit data besar ke Git', 'Masukkan folder data ke `.gitignore`; simpan di Google Drive, Kaggle, atau Hugging Face Hub, lalu tulis cara mengunduhnya di README.'],
]
