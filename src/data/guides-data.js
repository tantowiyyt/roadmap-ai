// Langkah-langkah praktis & contoh kasus untuk tahap Matematika dan Data Science.

export const guidesData = {
  // ---------- MATEMATIKA ----------
  'mat-vektor': {
    steps: [
      ['Ubah data menjadi angka', 'Setiap data menjadi vektor: rumah = [luas, kamar, umur]. Satu tabel data menjadi matriks.'],
      ['Periksa shape', '`X.shape` = (jumlah data, jumlah fitur). Sebagian besar error di AI terjadi karena shape tidak cocok.'],
      ['Operasi elemen demi elemen', '`a + b`, `a * 2`. Kedua array harus berukuran sama atau bisa di-broadcast.'],
      ['Dot product untuk skor berbobot', '`fitur @ bobot` menghasilkan satu angka. Inilah yang dihitung oleh satu neuron.'],
      ['Perkalian matriks untuk banyak data sekaligus', '`X @ W`. Syaratnya, jumlah kolom X harus sama dengan jumlah baris W.'],
    ],
    case: {
      title: 'Menghitung skor kelayakan beasiswa untuk 500 pendaftar',
      situation: 'Skor = 0.5×nilai rapor + 0.3×prestasi + 0.2×kondisi ekonomi. Panitia ingin menghitungnya untuk semua pendaftar sekaligus.',
      steps: [
        'Susun matriks X berukuran (500, 3): setiap baris adalah satu pendaftar.',
        'Susun vektor bobot `w = [0.5, 0.3, 0.2]`.',
        'Hitung `skor = X @ w`, menghasilkan 500 skor dalam satu operasi.',
        'Urutkan dengan `np.argsort(-skor)[:50]` untuk mengambil 50 pendaftar teratas.',
      ],
      result: 'Perhitungan selesai seketika. Satu layer neural network melakukan hal yang sama, hanya saja bobotnya dipelajari dari data.',
    },
  },
  'mat-aljabar': {
    steps: [
      ['Tulis masalah sebagai sistem persamaan', 'Setiap persamaan menjadi satu baris matriks A, dan konstantanya menjadi vektor b.'],
      ['Selesaikan dengan solver', '`np.linalg.solve(A, b)` lebih stabil secara numerik daripada menghitung invers secara manual.'],
      ['Gunakan invers hanya bila perlu', '`np.linalg.inv(A)`. Matriks harus persegi dan determinannya tidak nol.'],
      ['Eigen untuk mencari arah utama', '`np.linalg.eig(M)`. Dipakai di PCA untuk menemukan arah dengan variasi data terbesar.'],
    ],
    case: {
      title: 'Menentukan harga satuan dari struk belanja',
      situation: 'Struk 1: 2 kopi + 1 roti = Rp50.000. Struk 2: 1 kopi + 3 roti = Rp55.000. Berapa harga masing-masing?',
      steps: [
        'Bentuk A = [[2, 1], [1, 3]] dan b = [50000, 55000].',
        '`np.linalg.solve(A, b)` menghasilkan [19000, 12000].',
        'Verifikasi: 2×19.000 + 12.000 = 50.000 ✓.',
      ],
      result: 'Kopi Rp19.000, roti Rp12.000. Regresi linear menyelesaikan versi besar dari masalah ini, yaitu ribuan persamaan dengan "harga" fitur yang tidak diketahui.',
    },
  },
  'mat-turunan': {
    steps: [
      ['Pahami arti turunan', 'Turunan = kemiringan = "jika x naik sedikit, f(x) berubah seberapa?"'],
      ['Hafalkan beberapa aturan dasar', 'd/dx xⁿ = n·xⁿ⁻¹, turunan konstanta = 0, turunan dari jumlah = jumlah turunannya.'],
      ['Turunan parsial untuk banyak variabel', 'Turunkan terhadap satu variabel, anggap variabel lainnya konstanta.'],
      ['Chain rule untuk fungsi bersusun', 'Jika y = f(g(x)), maka dy/dx = f\'(g(x)) · g\'(x). Inilah inti backpropagation.'],
      ['Cek dengan turunan numerik', '`(f(x+h) - f(x-h)) / 2h` dengan h kecil, untuk memastikan hitungan manualmu benar.'],
    ],
    case: {
      title: 'Menentukan harga jual untuk keuntungan maksimum',
      situation: 'Penjual kue menemukan pola: jika harga p (ribu), terjual (100 − 4p) kue. Keuntungan = (p − 5) × (100 − 4p). Harga berapa yang paling menguntungkan?',
      steps: [
        'Jabarkan: untung(p) = −4p² + 120p − 500.',
        'Turunannya: untung\'(p) = −8p + 120.',
        'Titik puncak saat turunan = 0: p = 15.',
        'Cek: untung(15) = 10 × 40 = Rp400 ribu, lebih besar daripada harga 14 atau 16.',
      ],
      result: 'Harga optimal Rp15.000. Model ML juga mencari titik di mana turunan (gradien) loss mendekati nol.',
    },
  },
  'mat-optimasi': {
    steps: [
      ['Definisikan fungsi yang ingin diminimalkan', 'Di ML, ini adalah loss (misalnya MSE) sebagai fungsi dari bobot model.'],
      ['Hitung gradien', 'Turunan loss terhadap setiap bobot, menunjukkan arah kenaikan.'],
      ['Melangkah berlawanan arah gradien', '`w = w - learning_rate * gradien`.'],
      ['Ulangi dan pantau loss', 'Loss seharusnya turun. Jika naik atau melompat-lompat, kecilkan learning rate.'],
      ['Berhenti saat konvergen', 'Ketika loss hampir tidak berubah lagi atau jumlah iterasi maksimum tercapai.'],
    ],
    case: {
      title: 'Mencari garis tren penjualan',
      situation: 'Toko punya data penjualan 12 bulan dan ingin garis y = a·bulan + b yang paling cocok untuk memprediksi bulan depan.',
      steps: [
        'Loss = rata-rata (prediksi − aktual)². Mulai dari a = 0, b = 0.',
        'Hitung gradien: ∂L/∂a = 2·mean(error·x), ∂L/∂b = 2·mean(error).',
        'Update a dan b dengan learning rate 0.01, ulangi 1.000 kali sambil mencatat loss.',
        'Plot loss untuk memastikan nilainya terus menurun lalu mendatar.',
      ],
      result: 'Diperoleh garis tren dan prediksi bulan ke-13. Cara yang persis sama (dengan miliaran bobot) dipakai untuk melatih LLM.',
    },
  },
  'mat-prob': {
    steps: [
      ['Definisikan kejadian', 'Apa yang dihitung peluangnya? Misalnya "email ini spam".'],
      ['Hitung peluang dasar', 'P(A) = jumlah kejadian A / total. Nilainya selalu antara 0 dan 1.'],
      ['Gunakan peluang bersyarat bila ada informasi tambahan', 'P(spam | ada kata "hadiah") berbeda dengan P(spam).'],
      ['Terapkan Teorema Bayes untuk membalik arah', 'P(A|B) = P(B|A)·P(A) / P(B).'],
      ['Verifikasi dengan simulasi', 'Simulasikan ribuan kali dengan `numpy.random` untuk mengecek hasil hitunganmu.'],
    ],
    case: {
      title: 'Filter spam berdasarkan kata "gratis"',
      situation: 'Dari 1.000 email: 200 spam. Kata "gratis" muncul di 120 email spam dan di 40 email normal. Email baru mengandung kata "gratis". Seberapa mungkin email itu spam?',
      steps: [
        'P(spam) = 200/1000 = 0.2; P(gratis | spam) = 120/200 = 0.6.',
        'P(gratis) = (120 + 40)/1000 = 0.16.',
        'Bayes: P(spam | gratis) = 0.6 × 0.2 / 0.16 = 0.75.',
      ],
      result: 'Peluangnya 75% spam. Gabungkan dengan kata-kata lain, maka jadilah algoritma Naive Bayes.',
    },
  },
  'mat-statistik': {
    steps: [
      ['Hitung pusat data', 'Mean dan median. Jika jauh berbeda, kemungkinan ada outlier atau datanya miring (skewed).'],
      ['Hitung sebaran', 'Standar deviasi, nilai min/max, dan kuartil (Q1, Q3).'],
      ['Visualisasikan', 'Histogram untuk sebaran, boxplot untuk melihat outlier.'],
      ['Ukur hubungan antar variabel', 'Korelasi Pearson (−1 sampai 1). Ingat bahwa korelasi bukan sebab-akibat.'],
      ['Uji perbedaan', 'Untuk menilai apakah perbedaan dua kelompok nyata atau kebetulan, gunakan uji t (`scipy.stats.ttest_ind`).'],
    ],
    case: {
      title: 'Apakah metode belajar baru benar-benar efektif?',
      situation: 'Kelas A (metode baru) rata-rata 78, kelas B (metode lama) rata-rata 74. Kepala sekolah bertanya: perbedaan ini nyata atau hanya kebetulan?',
      steps: [
        'Hitung mean dan standar deviasi kedua kelas, lalu buat histogramnya.',
        'Jalankan `ttest_ind(nilai_A, nilai_B)` dan dapatkan p-value 0.03.',
        'Karena p < 0.05, perbedaan dianggap signifikan secara statistik.',
        'Laporkan juga besar efeknya: selisih 4 poin, apakah cukup berarti secara praktis?',
      ],
      result: 'Keputusan diambil berdasarkan data, bukan perasaan. Cara yang sama dipakai untuk A/B testing dan untuk membandingkan dua model AI.',
    },
  },

  // ---------- DATA SCIENCE ----------
  'ds-numpy': {
    steps: [
      ['Buat array', '`np.array(list)`, `np.zeros`, `np.arange`, `np.linspace`, atau `np.random.default_rng().normal(...)`.'],
      ['Periksa shape & dtype', '`arr.shape`, `arr.dtype`. Ubah bentuk dengan `reshape`.'],
      ['Ambil data dengan indexing', '`arr[0]`, `arr[:, 1]` (kolom), `arr[arr > 5]` (filter boolean).'],
      ['Hitung tanpa loop', '`arr * 2`, `arr.mean(axis=0)`, `np.sqrt(arr)`. Ini puluhan kali lebih cepat daripada loop Python.'],
      ['Manfaatkan broadcasting', 'Mengurangi rata-rata per kolom: `X - X.mean(axis=0)` tanpa loop.'],
    ],
    case: {
      title: 'Menormalkan data sensor 1 juta baris',
      situation: 'Data 1 juta pembacaan sensor (suhu, kelembapan, tekanan) memiliki skala yang sangat berbeda dan perlu distandarkan sebelum masuk ke model.',
      steps: [
        'Muat data ke array berukuran (1.000.000, 3).',
        'Hitung `mean = X.mean(axis=0)` dan `std = X.std(axis=0)`.',
        '`X_std = (X - mean) / std`, broadcasting menangani semua kolom sekaligus.',
        'Bandingkan dengan versi loop Python: hasilnya sama, tetapi NumPy jauh lebih cepat.',
      ],
      result: 'Standardisasi selesai dalam milidetik. Semua kolom kini memiliki rata-rata 0 dan standar deviasi 1, siap untuk training.',
    },
  },
  'ds-pandas': {
    steps: [
      ['Baca data', '`df = pd.read_csv("file.csv")` (atau `read_excel`, `read_sql`).'],
      ['Kenali data', '`df.head()`, `df.info()`, `df.describe()`, `df.shape`.'],
      ['Pilih & filter', '`df["kolom"]`, `df[["a", "b"]]`, `df[df["umur"] > 20]`, `df.query("kota == \'Bandung\'")`.'],
      ['Buat kolom baru', '`df["total"] = df["harga"] * df["jumlah"]`.'],
      ['Ringkas dan gabungkan', '`df.groupby("kategori")["total"].sum()`, `pd.merge(df1, df2, on="id")`.'],
      ['Simpan hasil', '`df.to_csv("hasil.csv", index=False)`.'],
    ],
    case: {
      title: 'Laporan penjualan bulanan kedai kopi',
      situation: 'Pemilik kedai mengekspor 3 bulan transaksi dari aplikasi kasir (5.000 baris) dan ingin tahu menu terlaris serta jam paling ramai.',
      steps: [
        '`pd.read_csv("transaksi.csv", parse_dates=["waktu"])`.',
        'Tambahkan kolom `jam = df["waktu"].dt.hour` dan `pendapatan = harga * jumlah`.',
        'Menu terlaris: `df.groupby("menu")["jumlah"].sum().nlargest(5)`.',
        'Jam ramai: `df.groupby("jam")["pendapatan"].sum()`, lalu buat grafik batang.',
      ],
      result: 'Ditemukan bahwa jam 07.00–09.00 menyumbang 40% pendapatan dan es kopi susu adalah menu terlaris. Pemilik menambah barista di pagi hari.',
    },
  },
  'ds-cleaning': {
    steps: [
      ['Audit data', '`df.isna().sum()` untuk nilai kosong, `df.duplicated().sum()` untuk duplikat, `df.dtypes` untuk tipe data yang salah.'],
      ['Perbaiki tipe data', '`pd.to_numeric(..., errors="coerce")`, `pd.to_datetime(...)`.'],
      ['Seragamkan teks', '`.str.strip().str.lower()`, ganti variasi penulisan ("Jkt", "jakarta" → "Jakarta").'],
      ['Tangani nilai kosong', 'Hapus jika sedikit, isi dengan median (angka) atau modus (kategori) jika banyak. Catat keputusanmu.'],
      ['Tangani outlier', 'Cek dengan boxplot atau IQR. Bedakan nilai salah input (perbaiki/hapus) dari nilai ekstrem yang wajar (biarkan).'],
      ['Hapus duplikat & verifikasi', '`df.drop_duplicates()`, lalu ulangi audit untuk memastikan data sudah bersih.'],
    ],
    case: {
      title: 'Membersihkan data pendaftaran siswa baru',
      situation: 'Data 2.000 pendaftar dari Google Form: umur ada yang "16 th", kota ditulis bermacam-macam, 50 baris ganda karena tombol kirim ditekan dua kali, dan nilai rapor ada yang 850 (seharusnya 85.0).',
      steps: [
        'Umur: ambil angkanya dengan `.str.extract(r"(\\d+)")`, lalu ubah ke int.',
        'Kota: lowercase + strip, lalu petakan variasinya dengan dict ke nama baku.',
        'Duplikat: `drop_duplicates(subset=["nisn"])`.',
        'Nilai > 100: dibagi 10 karena jelas salah ketik koma. Nilai yang kosong diisi median per sekolah asal.',
      ],
      result: 'Data siap dianalisis dan semua keputusan pembersihan terdokumentasi. Tanpa langkah ini, rata-rata nilai akan kacau karena angka 850.',
    },
  },
  'ds-viz': {
    steps: [
      ['Mulai dari pertanyaan', 'Ingin melihat tren? Perbandingan? Sebaran? Hubungan? Pertanyaan menentukan jenis grafik.'],
      ['Pilih grafik yang sesuai', 'Tren waktu → line. Perbandingan kategori → bar. Sebaran → histogram/boxplot. Hubungan → scatter.'],
      ['Buat grafik dasar', '`plt.plot`, `plt.bar`, `plt.hist`, `plt.scatter`, atau langsung dari Pandas: `df.plot(...)`.'],
      ['Beri konteks', 'Judul yang menyatakan insight, label sumbu beserta satuan, dan legend jika ada beberapa seri.'],
      ['Sederhanakan', 'Hilangkan elemen yang tidak perlu dan pakai warna seperlunya untuk menyorot hal penting.'],
    ],
    case: {
      title: 'Meyakinkan manajemen untuk menambah stok',
      situation: 'Analis tahu penjualan selalu melonjak menjelang Lebaran, tetapi tabel angka tidak meyakinkan manajemen.',
      steps: [
        'Line chart penjualan harian selama 3 tahun, dengan periode Ramadan diberi arsiran.',
        'Bar chart perbandingan penjualan rata-rata saat Ramadan vs bulan biasa.',
        'Judul grafik langsung menyatakan insight: "Penjualan naik 2,3× setiap Ramadan".',
      ],
      result: 'Manajemen langsung memahami polanya dalam 10 detik dan menyetujui penambahan stok.',
    },
  },
  'ds-eda': {
    steps: [
      ['Pahami konteks', 'Dari mana data berasal? Apa arti setiap kolom? Kolom mana yang menjadi target?'],
      ['Cek struktur & kualitas', 'Jumlah baris/kolom, tipe data, nilai kosong, dan duplikat.'],
      ['Analisis univariat', 'Lihat sebaran setiap kolom: histogram untuk angka, value_counts untuk kategori.'],
      ['Analisis bivariat', 'Hubungan setiap fitur dengan target: korelasi, scatter plot, rata-rata target per kategori.'],
      ['Cari anomali & pola', 'Outlier, ketidakseimbangan kelas, dan pola waktu.'],
      ['Tulis ringkasan temuan', '3–5 poin insight serta rencana preprocessing dan modeling.'],
    ],
    case: {
      title: 'EDA sebelum memprediksi pelanggan yang berhenti berlangganan',
      situation: 'Perusahaan internet rumahan punya data 7.000 pelanggan dan ingin model prediksi churn. Sebelum membuat model, data perlu dipahami terlebih dahulu.',
      steps: [
        'Cek target: 26% pelanggan churn, jadi data tidak seimbang dan metrik akurasi saja tidak cukup.',
        'Churn per jenis kontrak: bulanan 43%, tahunan 11%, dua tahunan 3%.',
        'Lama berlangganan: pelanggan churn mayoritas baru 1–6 bulan.',
        '11 baris memiliki total tagihan kosong, semuanya pelanggan yang baru bergabung.',
      ],
      result: 'Insight utama: pelanggan baru dengan kontrak bulanan paling berisiko. Bahkan sebelum ada model, tim marketing sudah bisa menargetkan promo kontrak tahunan.',
    },
  },
  'ds-sql': {
    steps: [
      ['Pahami struktur tabel', 'Tabel apa saja yang ada, kolomnya apa, dan kunci (id) mana yang menghubungkan antar tabel.'],
      ['Pilih kolom & filter', '`SELECT kolom FROM tabel WHERE syarat`.'],
      ['Gabungkan tabel', '`JOIN tabel2 ON tabel1.id = tabel2.tabel1_id`.'],
      ['Ringkas', '`GROUP BY` bersama `COUNT`, `SUM`, `AVG`. Filter hasil ringkasan dengan `HAVING`.'],
      ['Urutkan & batasi', '`ORDER BY ... DESC LIMIT 10`.'],
      ['Bawa ke Python', '`pd.read_sql(query, koneksi)` untuk analisis lanjutan atau training model.'],
    ],
    case: {
      title: 'Mencari pelanggan paling berharga di toko online',
      situation: 'Tim marketing ingin memberi voucher kepada 100 pelanggan dengan total belanja tertinggi dalam setahun terakhir.',
      steps: [
        'JOIN tabel `pelanggan` dan `pesanan` berdasarkan `pelanggan_id`.',
        '`WHERE tanggal >= \'2025-01-01\' AND status = \'selesai\'`.',
        '`GROUP BY pelanggan_id` dengan `SUM(total)` dan `COUNT(*)`.',
        '`ORDER BY total_belanja DESC LIMIT 100`.',
      ],
      result: 'Daftar 100 pelanggan teratas dihasilkan dalam satu query. Query yang sama juga dipakai untuk membuat fitur ("total belanja", "frekuensi") bagi model ML.',
    },
  },
}
