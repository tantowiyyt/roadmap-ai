import { py } from './py.js'

export const categories = [
  'Supervised · Regresi',
  'Supervised · Klasifikasi',
  'Unsupervised',
  'Deep Learning',
  'Pencarian & Reinforcement',
]

// Panduan cepat: masalah → algoritma yang cocok
export const chooser = [
  { problem: 'Menebak angka (harga, suhu, penjualan)', algos: ['linear-regression', 'random-forest', 'gradient-boosting'] },
  { problem: 'Menebak kategori dari data tabel (churn, kredit, penipuan)', algos: ['logistic-regression', 'random-forest', 'gradient-boosting'] },
  { problem: 'Klasifikasi teks sederhana (spam, sentimen)', algos: ['naive-bayes', 'logistic-regression'] },
  { problem: 'Butuh model yang mudah dijelaskan ke orang awam', algos: ['decision-tree', 'linear-regression'] },
  { problem: 'Mengelompokkan data tanpa label (segmentasi)', algos: ['kmeans', 'dbscan'] },
  { problem: 'Data punya terlalu banyak kolom / ingin visualisasi', algos: ['pca'] },
  { problem: 'Gambar (klasifikasi, deteksi)', algos: ['cnn'] },
  { problem: 'Teks / bahasa / chatbot', algos: ['transformer'] },
  { problem: 'Data berurutan waktu (time series, sensor)', algos: ['rnn', 'gradient-boosting'] },
  { problem: 'Analisis keranjang belanja ("yang beli A juga beli B")', algos: ['apriori'] },
  { problem: 'Mencari rute terpendek', algos: ['a-star'] },
  { problem: 'Agen yang belajar dari coba-coba (game, robot)', algos: ['q-learning'] },
]

export const algorithms = [
  {
    id: 'linear-regression',
    name: 'Regresi Linear',
    category: 'Supervised · Regresi',
    tagline: 'Menarik garis lurus terbaik untuk menebak angka.',
    explain: [
      'Mencari hubungan lurus antara fitur (x) dan target (y): `y = a₁x₁ + a₂x₂ + … + b`. Setiap koefisien menunjukkan seberapa besar pengaruh fitur tersebut.',
    ],
    steps: [
      'Mulai dengan garis sembarang',
      'Hitung error (selisih prediksi dan nilai asli) untuk semua data',
      'Ubah kemiringan dan titik potong agar total error kuadrat (MSE) mengecil',
      'Ulangi sampai error minimum (atau hitung langsung dengan rumus matriks)',
    ],
    uses: [
      'Prediksi harga rumah dari luas, lokasi, jumlah kamar',
      'Estimasi penjualan berdasarkan anggaran iklan',
      'Analisis pengaruh: "setiap tambahan 1 jam belajar menaikkan nilai berapa?"',
      'Baseline sebelum mencoba model rumit',
    ],
    pros: ['Sangat cepat dan sederhana', 'Mudah dijelaskan (koefisien bermakna)', 'Butuh sedikit data'],
    cons: ['Hanya menangkap hubungan lurus', 'Sensitif terhadap outlier', 'Fitur yang saling berkorelasi bisa mengacaukan koefisien'],
    when: 'Saat target berupa angka dan kamu butuh model yang bisa dijelaskan, atau sebagai pembanding awal.',
    code: py`
import numpy as np  # NumPy untuk array
from sklearn.linear_model import LinearRegression  # model regresi linear

# [luas m², jumlah kamar, jarak ke kota km] -> harga (juta)
# 6 rumah, masing-masing 3 fitur
X = np.array([[60, 2, 10], [80, 3, 8], [120, 3, 15], [45, 1, 5], [150, 4, 20], [90, 3, 3]])
y = np.array([550, 780, 900, 500, 1100, 950])  # harga tiap rumah (target)

model = LinearRegression().fit(X, y)  # latih model
# coef_ = pengaruh setiap fitur terhadap harga
for nama, k in zip(["luas", "kamar", "jarak"], model.coef_):
    # :+.1f menampilkan tanda + atau -
    print(f"Setiap +1 {nama:5s} -> harga berubah {k:+.1f} juta")
# tebak harga rumah baru
print("Prediksi rumah 100m², 3 kamar, 7km:", model.predict([[100, 3, 7]])[0].round(), "juta")`,
  },
  {
    id: 'logistic-regression',
    name: 'Regresi Logistik',
    category: 'Supervised · Klasifikasi',
    tagline: 'Menghitung peluang sesuatu termasuk kelas "ya".',
    explain: [
      'Menghitung skor linear seperti regresi linear, lalu memasukkannya ke fungsi **sigmoid** sehingga hasilnya menjadi probabilitas 0–1. Jika probabilitas > 0.5 (atau ambang lain), hasilnya "ya".',
    ],
    steps: [
      'Hitung skor = w·x + b',
      'Ubah skor menjadi probabilitas dengan sigmoid: 1 / (1 + e^(−skor))',
      'Ukur kesalahan dengan log-loss (cross-entropy)',
      'Perbaiki bobot dengan gradient descent',
    ],
    uses: [
      'Credit scoring: peluang nasabah gagal bayar',
      'Prediksi pelanggan berhenti berlangganan (churn)',
      'Diagnosa medis sederhana',
      'Prediksi klik iklan',
    ],
    pros: ['Memberi probabilitas, bukan hanya label', 'Cepat dan mudah dijelaskan', 'Baseline yang kuat untuk klasifikasi'],
    cons: ['Batas keputusannya lurus (linear)', 'Perlu scaling fitur', 'Kurang bagus untuk pola yang kompleks'],
    when: 'Klasifikasi ya/tidak yang butuh probabilitas dan penjelasan, misalnya di bank dan asuransi.',
    code: py`
import numpy as np  # NumPy untuk array
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.linear_model import LogisticRegression  # model regresi logistik

# fitur dibentuk kolom (-1, 1)
jam_belajar = np.array([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]).reshape(-1, 1)
# label: 0 = tidak lulus, 1 = lulus
lulus       = np.array([0,   0, 0,   0, 1,   0, 1,   1, 1,   1, 1,   1])

model = LogisticRegression().fit(jam_belajar, lulus)  # latih model
for jam in [1, 2.5, 4]:  # coba tiga lama belajar
    # predict_proba()[0, 1] = peluang kelas 1 (lulus)
    print(f"Belajar {jam} jam -> peluang lulus {model.predict_proba([[jam]])[0, 1]:.0%}")

xs = np.linspace(0, 7, 100).reshape(-1, 1)  # titik-titik untuk menggambar kurva
plt.scatter(jam_belajar, lulus, c=lulus, cmap="bwr")  # gambar data asli
# kurva peluang lulus berbentuk huruf S (sigmoid)
plt.plot(xs, model.predict_proba(xs)[:, 1], color="black")
plt.axhline(0.5, ls="--", color="gray")  # garis batas keputusan 50%
# label sumbu dan judul
plt.xlabel("Jam belajar"); plt.ylabel("P(lulus)"); plt.title("Kurva sigmoid")
plt.show()  # tampilkan`,
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    category: 'Supervised · Klasifikasi',
    tagline: '"Kamu mirip teman-teman terdekatmu."',
    explain: [
      'KNN tidak benar-benar "belajar"; ia menyimpan semua data latih. Untuk data baru, KNN mencari **K data terdekat** lalu mengambil suara terbanyak (klasifikasi) atau rata-rata (regresi).',
    ],
    steps: [
      'Simpan semua data latih',
      'Untuk data baru, hitung jaraknya ke semua data latih',
      'Ambil K data dengan jarak terkecil',
      'Voting kelas terbanyak di antara K tetangga tersebut',
    ],
    uses: [
      'Sistem rekomendasi sederhana ("pengguna yang mirip denganmu menyukai…")',
      'Klasifikasi dengan dataset kecil',
      'Mengisi nilai kosong (KNN imputer)',
      'Deteksi anomali',
    ],
    pros: ['Sangat intuitif', 'Tanpa proses training', 'Bisa menangkap pola non-linear'],
    cons: ['Lambat untuk data besar (menghitung jarak ke semua data)', 'Wajib scaling fitur', 'Buruk untuk data dengan banyak dimensi'],
    when: 'Dataset kecil–menengah, sebagai baseline, atau untuk rekomendasi berbasis kemiripan.',
    code: py`
import numpy as np  # NumPy untuk menghitung jarak
from collections import Counter  # Counter untuk voting

# [tingkat manis 1-10, tingkat renyah 1-10]
# data latih: setiap baris = satu makanan
data = np.array([[8, 2], [9, 3], [7, 1], [2, 9], [3, 8], [1, 7], [6, 6], [5, 7]])
# label setiap data
label = ["buah", "buah", "buah", "sayur", "sayur", "sayur", "kacang", "kacang"]

def knn(x_baru, k=3):  # KNN dari nol
    jarak = np.linalg.norm(data - x_baru, axis=1)  # jarak data baru ke semua data latih
    terdekat = jarak.argsort()[:k]  # indeks k data dengan jarak terkecil
    # tampilkan tetangga yang terpilih
    print("  tetangga:", [(label[i], round(jarak[i], 2)) for i in terdekat])
    # label terbanyak di antara tetangga = jawaban
    return Counter(label[i] for i in terdekat).most_common(1)[0][0]

for x in [[8, 3], [2, 8], [5, 6]]:  # tebak tiga data baru
    print(x, "->", knn(np.array(x)))  # cetak hasil tebakan`,
  },
  {
    id: 'naive-bayes',
    name: 'Naive Bayes',
    category: 'Supervised · Klasifikasi',
    tagline: 'Klasifikasi teks super cepat berbasis probabilitas.',
    explain: [
      'Memakai **Teorema Bayes** untuk menghitung peluang setiap kelas berdasarkan fitur (misalnya kata-kata dalam email). Disebut "naive" karena menganggap setiap fitur saling bebas. Asumsinya jarang benar, tetapi hasilnya sering tetap bagus.',
    ],
    steps: [
      'Hitung seberapa sering setiap kata muncul di setiap kelas (spam/bukan)',
      'Untuk email baru, kalikan peluang setiap katanya untuk setiap kelas',
      'Kalikan dengan peluang awal kelas (prior)',
      'Pilih kelas dengan peluang tertinggi',
    ],
    uses: ['Filter spam email/SMS', 'Analisis sentimen', 'Kategorisasi berita atau tiket', 'Klasifikasi dokumen'],
    pros: ['Sangat cepat, bahkan untuk data besar', 'Butuh sedikit data', 'Bagus untuk teks'],
    cons: ['Asumsi independensi sering tidak realistis', 'Probabilitas yang dihasilkan kurang akurat', 'Kalah dari model modern untuk teks yang kompleks'],
    when: 'Klasifikasi teks cepat sebagai baseline, atau saat data dan komputasi terbatas.',
    code: py`
# pengubah teks menjadi jumlah kata
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB  # Naive Bayes untuk data hitungan kata

# data latih: SMS
sms = ["selamat anda menang undian hadiah mobil", "klik link ini untuk klaim hadiah",
       "promo pulsa gratis transfer sekarang", "besok rapat jam sembilan ya",
       "jangan lupa beli telur pulang kerja", "nanti malam makan bareng yuk"]
label = ["spam", "spam", "spam", "normal", "normal", "normal"]  # label setiap SMS

vec = CountVectorizer()  # siapkan pengubah teks
# ubah SMS menjadi angka lalu latih model
model = MultinomialNB().fit(vec.fit_transform(sms), label)

# SMS baru untuk diuji
uji = ["anda dapat hadiah gratis", "rapat besok dibatalkan", "klik untuk promo"]
# peluang setiap kelas untuk setiap SMS
for teks, p in zip(uji, model.predict_proba(vec.transform(uji))):
    # kelas diurutkan alfabet: [normal, spam]
    print(f"{teks:30s} -> P(normal)={p[0]:.2f} P(spam)={p[1]:.2f}")`,
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    category: 'Supervised · Klasifikasi',
    tagline: 'Serangkaian pertanyaan ya/tidak yang dipelajari dari data.',
    explain: [
      'Membagi data berulang kali berdasarkan pertanyaan terbaik ("umur > 30?"), sehingga terbentuk pohon. "Terbaik" artinya pemisahan yang membuat setiap kelompok paling seragam (diukur dengan Gini atau entropi). Bisa untuk klasifikasi maupun regresi.',
    ],
    steps: [
      'Coba semua fitur dan semua titik potong',
      'Pilih pertanyaan yang paling "memurnikan" kelompok',
      'Ulangi untuk setiap cabang',
      'Berhenti di kedalaman maksimum atau saat kelompok sudah murni',
    ],
    uses: [
      'Aturan persetujuan kredit yang bisa diaudit',
      'Diagnosa (alur pertanyaan medis)',
      'Menjelaskan faktor penting ke manajemen',
      'Komponen dasar Random Forest dan Gradient Boosting',
    ],
    pros: ['Sangat mudah dijelaskan dan divisualisasikan', 'Tidak perlu scaling', 'Bisa menangani data angka dan kategori'],
    cons: ['Mudah overfitting', 'Tidak stabil: data berubah sedikit, pohonnya bisa berubah total', 'Akurasi biasanya kalah dari ensemble'],
    when: 'Saat keputusan model harus bisa dijelaskan langkah demi langkah.',
    code: py`
import matplotlib.pyplot as plt  # Matplotlib untuk menggambar pohon
# decision tree dan fungsi penggambarnya
from sklearn.tree import DecisionTreeClassifier, plot_tree

# [umur, penghasilan (juta), punya_hutang 0/1] -> kredit disetujui?
X = [[25, 4, 1], [35, 10, 0], [45, 15, 1], [22, 3, 0], [50, 8, 0],
     [30, 6, 1], [40, 12, 0], [28, 5, 0], [55, 20, 1], [23, 2, 1]]
# keputusan untuk setiap pemohon
y = ["tolak", "setuju", "setuju", "tolak", "setuju", "tolak", "setuju", "setuju", "setuju", "tolak"]

# latih pohon dengan kedalaman maksimal 3
tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X, y)
plt.figure(figsize=(9, 5))  # siapkan ukuran gambar
# gambar pohon: setiap kotak = satu pertanyaan
plot_tree(tree, feature_names=["umur", "penghasilan", "hutang"], class_names=tree.classes_,
          filled=True, rounded=True)
plt.show()  # tampilkan
# tebak keputusan untuk pemohon baru
print("Pemohon [27 th, 7 jt, ada hutang]:", tree.predict([[27, 7, 1]])[0])`,
  },
  {
    id: 'random-forest',
    name: 'Random Forest',
    category: 'Supervised · Klasifikasi',
    tagline: 'Ratusan decision tree yang voting bersama.',
    explain: [
      'Melatih banyak decision tree, masing-masing dengan sampel data acak dan subset fitur acak. Hasil akhir adalah voting (klasifikasi) atau rata-rata (regresi). Prinsip **"wisdom of the crowd"**: kesalahan tiap pohon saling menutupi.',
    ],
    steps: [
      'Ambil sampel acak dari data (bootstrap)',
      'Latih satu tree; di setiap cabang hanya boleh memilih dari sebagian fitur acak',
      'Ulangi untuk ratusan tree',
      'Gabungkan prediksi semua tree',
    ],
    uses: ['Deteksi penipuan', 'Prediksi churn', 'Credit scoring', 'Mencari fitur paling penting (feature importance)', 'Data medis dan ilmiah'],
    pros: ['Akurat tanpa banyak tuning', 'Tahan terhadap overfitting dibanding satu tree', 'Memberi feature importance'],
    cons: ['Lebih lambat dan berat dari satu tree', 'Sulit dijelaskan per keputusan', 'Biasanya sedikit kalah dari gradient boosting'],
    when: 'Pilihan default yang sangat aman untuk data tabel. Hasil bagus dengan sedikit usaha.',
    code: py`
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.tree import DecisionTreeClassifier  # satu pohon
from sklearn.ensemble import RandomForestClassifier  # hutan pohon

data = load_breast_cancer()  # muat data
# bagi data (default 25% untuk uji)
X_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, random_state=1)

tree = DecisionTreeClassifier(random_state=0).fit(X_tr, y_tr)  # latih satu pohon
# latih 300 pohon
forest = RandomForestClassifier(n_estimators=300, random_state=0).fit(X_tr, y_tr)
print("1 pohon      :", round(tree.score(X_te, y_te), 3))  # akurasi satu pohon
# akurasi random forest (biasanya lebih tinggi & stabil)
print("300 pohon    :", round(forest.score(X_te, y_te), 3))

# urutkan fitur dari yang paling penting, ambil 5
top = sorted(zip(forest.feature_importances_, data.feature_names), reverse=True)[:5]
print("\n5 fitur terpenting:")
for imp, nama in top:  # cetak setiap fitur
    print(f"  {nama:25s} {imp:.3f}")  # nama fitur & skor pentingnya`,
  },
  {
    id: 'gradient-boosting',
    name: 'Gradient Boosting (XGBoost, LightGBM)',
    category: 'Supervised · Klasifikasi',
    tagline: 'Tree demi tree, masing-masing memperbaiki kesalahan sebelumnya.',
    explain: [
      'Berbeda dengan random forest yang melatih tree secara paralel, boosting melatih tree **berurutan**. Setiap tree baru fokus pada kesalahan (residual) gabungan tree sebelumnya. Implementasi populer: XGBoost, LightGBM, CatBoost. Bisa untuk klasifikasi dan regresi.',
    ],
    steps: [
      'Mulai dari tebakan sederhana (misalnya rata-rata)',
      'Hitung kesalahan (residual) untuk setiap data',
      'Latih tree kecil untuk menebak kesalahan tersebut',
      'Tambahkan tree itu (dikali learning rate) ke model; ulangi ratusan kali',
    ],
    uses: [
      'Juara kebanyakan kompetisi Kaggle untuk data tabel',
      'Ranking hasil pencarian dan rekomendasi',
      'Prediksi permintaan/penjualan',
      'Risiko kredit dan asuransi',
    ],
    pros: ['Sering paling akurat untuk data tabel', 'Menangani nilai kosong (XGBoost/LightGBM)', 'Fleksibel'],
    cons: ['Banyak hyperparameter yang perlu di-tuning', 'Bisa overfitting jika tidak hati-hati', 'Training berurutan sehingga lebih lambat dari random forest'],
    when: 'Saat butuh akurasi maksimal pada data tabel dan bersedia melakukan tuning.',
    code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.tree import DecisionTreeRegressor  # pohon kecil untuk regresi

# Boosting dari nol untuk regresi
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
X = np.sort(rng.uniform(0, 6, 80)).reshape(-1, 1)  # 80 titik x antara 0 dan 6
y = np.sin(X).ravel() + rng.normal(0, 0.15, 80)  # target = sinus + noise

pred = np.full_like(y, y.mean())  # tebakan awal: rata-rata untuk semua titik
lr = 0.3  # learning rate: seberapa besar setiap pohon ikut memperbaiki
fig, axes = plt.subplots(1, 3, figsize=(12, 3.2))  # tiga grafik berdampingan
step_plot = {1: 0, 5: 1, 50: 2}  # gambar hasil setelah pohon ke-1, ke-5, dan ke-50
for i in range(1, 51):  # tambahkan 50 pohon satu per satu
    residual = y - pred                                   # kesalahan saat ini
    # pohon kecil belajar meniru residual
    tree = DecisionTreeRegressor(max_depth=2).fit(X, residual)
    pred += lr * tree.predict(X)                          # perbaiki sedikit
    if i in step_plot:  # gambar hanya pada langkah tertentu
        ax = axes[step_plot[i]]  # pilih kotak grafik
        # data + kurva tebakan saat ini
        ax.scatter(X, y, s=8, alpha=.5); ax.plot(X, pred, color="red")
        # judul berisi error saat ini
        ax.set_title(f"Setelah {i} tree, MSE={np.mean((y - pred) ** 2):.3f}")
plt.show()  # tampilkan`,
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'Supervised · Klasifikasi',
    tagline: 'Garis pemisah dengan jalur aman paling lebar.',
    explain: [
      'Mencari batas pemisah dua kelas dengan **margin** terlebar. Data yang berada tepat di tepi margin disebut **support vectors**. Dengan **kernel** (RBF, polinomial), SVM bisa membuat batas melengkung.',
    ],
    steps: [
      'Cari semua garis yang bisa memisahkan kelas',
      'Pilih garis dengan jarak terjauh ke titik terdekat dari kedua kelas',
      'Jika tidak bisa dipisah lurus, gunakan kernel untuk memetakan data ke dimensi lebih tinggi',
      'Parameter C mengatur toleransi terhadap kesalahan',
    ],
    uses: ['Klasifikasi teks (sebelum era deep learning)', 'Pengenalan tulisan tangan', 'Bioinformatika', 'Klasifikasi gambar dengan dataset kecil'],
    pros: ['Efektif untuk data berdimensi tinggi', 'Bagus dengan data menengah', 'Kernel memberi fleksibilitas'],
    cons: ['Lambat untuk data sangat besar', 'Perlu scaling dan tuning C/gamma', 'Tidak langsung memberi probabilitas'],
    when: 'Dataset kecil–menengah dengan banyak fitur, misalnya teks atau data biologi.',
    code: py`
import numpy as np  # NumPy untuk grid
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.svm import SVC  # Support Vector Machine
from sklearn.datasets import make_blobs  # pembuat data berkelompok

X, y = make_blobs(n_samples=60, centers=2, random_state=6)  # 60 titik dalam 2 kelompok
# SVM linear; C besar = margin hampir tidak boleh dilanggar
m = SVC(kernel="linear", C=1000).fit(X, y)

# grid titik untuk menggambar garis
xx, yy = np.meshgrid(np.linspace(X[:, 0].min()-1, X[:, 0].max()+1, 200),
                     np.linspace(X[:, 1].min()-1, X[:, 1].max()+1, 200))
# jarak bertanda setiap titik grid ke garis pemisah
Z = m.decision_function(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
plt.scatter(X[:, 0], X[:, 1], c=y, cmap="coolwarm", s=25)  # gambar data
# garis tebal = pemisah, putus-putus = tepi margin
plt.contour(xx, yy, Z, levels=[-1, 0, 1], linestyles=["--", "-", "--"], colors="k")
# lingkari support vector
plt.scatter(*m.support_vectors_.T, s=150, facecolors="none", edgecolors="k")
plt.title("Garis pemisah, margin, dan support vectors (dilingkari)")  # judul
plt.show()  # tampilkan`,
  },
  {
    id: 'kmeans',
    name: 'K-Means',
    category: 'Unsupervised',
    tagline: 'Mengelompokkan data menjadi K grup.',
    explain: [
      'Membagi data menjadi K cluster sehingga setiap data dekat dengan pusat (centroid) cluster-nya. Kamu harus menentukan K. Gunakan **metode elbow** atau silhouette score untuk membantu memilih.',
    ],
    steps: [
      'Taruh K centroid secara acak',
      'Setiap data bergabung ke centroid terdekat',
      'Pindahkan setiap centroid ke rata-rata anggotanya',
      'Ulangi langkah 2–3 sampai centroid tidak bergerak',
    ],
    uses: ['Segmentasi pelanggan', 'Kompresi warna gambar', 'Mengelompokkan dokumen/berita', 'Menentukan lokasi gudang atau toko'],
    pros: ['Sederhana dan cepat', 'Bisa untuk data besar', 'Hasil mudah dipahami'],
    cons: ['Harus menentukan K', 'Mengasumsikan cluster berbentuk bulat dengan ukuran mirip', 'Sensitif terhadap outlier dan posisi awal'],
    when: 'Ingin membagi data menjadi kelompok yang bentuknya kira-kira bulat dan jumlahnya diketahui.',
    code: py`
import numpy as np  # NumPy untuk hitungan
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.datasets import make_blobs  # pembuat data berkelompok

# 300 titik dalam 3 kelompok (labelnya tidak dipakai)
X, _ = make_blobs(n_samples=300, centers=3, random_state=2)
rng = np.random.default_rng(1)  # generator acak dengan seed tetap
K = 3  # jumlah kelompok
pusat = X[rng.choice(len(X), K, replace=False)]  # pilih 3 titik acak sebagai pusat awal

fig, axes = plt.subplots(1, 3, figsize=(12, 3.5))  # tiga grafik berdampingan
for it in range(3):  # jalankan 3 iterasi
    # jarak setiap titik ke setiap pusat
    jarak = np.linalg.norm(X[:, None] - pusat[None], axis=2)
    label = jarak.argmin(axis=1)                          # ikut pusat terdekat
    # warnai titik sesuai kelompoknya
    axes[it].scatter(X[:, 0], X[:, 1], c=label, cmap="tab10", s=8)
    axes[it].scatter(*pusat.T, c="black", marker="x", s=120)  # tanda x = posisi pusat
    axes[it].set_title(f"Iterasi {it + 1}")  # judul iterasi
    pusat = np.array([X[label == k].mean(axis=0) for k in range(K)])   # pindahkan pusat
plt.show()  # tampilkan`,
  },
  {
    id: 'dbscan',
    name: 'DBSCAN',
    category: 'Unsupervised',
    tagline: 'Clustering berdasarkan kepadatan; bisa menemukan bentuk aneh dan outlier.',
    explain: [
      'Data yang berkumpul padat menjadi satu cluster; data yang menyendiri dianggap **noise/outlier**. Tidak perlu menentukan jumlah cluster, cukup `eps` (radius tetangga) dan `min_samples`.',
    ],
    steps: [
      'Untuk setiap titik, hitung tetangga dalam radius eps',
      'Titik dengan tetangga ≥ min_samples menjadi titik inti',
      'Titik inti yang saling terhubung membentuk satu cluster',
      'Titik yang tidak terjangkau menjadi noise (label −1)',
    ],
    uses: ['Deteksi anomali/transaksi aneh', 'Clustering data lokasi GPS', 'Menemukan cluster dengan bentuk tidak beraturan'],
    pros: ['Tidak perlu menentukan K', 'Bisa menemukan bentuk sembarang', 'Otomatis mendeteksi outlier'],
    cons: ['Sulit memilih eps yang tepat', 'Kurang bagus jika kepadatan cluster berbeda-beda', 'Lambat untuk data berdimensi tinggi'],
    when: 'Bentuk cluster tidak bulat, jumlahnya tidak diketahui, atau ada outlier.',
    code: py`
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.datasets import make_moons  # pembuat data bulan sabit
from sklearn.cluster import DBSCAN, KMeans  # dua algoritma clustering yang dibandingkan

# 300 titik berbentuk dua bulan sabit
X, _ = make_moons(n_samples=300, noise=0.07, random_state=0)
fig, ax = plt.subplots(1, 2, figsize=(10, 4))  # dua grafik berdampingan
# warnai titik dengan hasil K-Means (2 kelompok)
ax[0].scatter(*X.T, c=KMeans(2, n_init=10, random_state=0).fit_predict(X), cmap="coolwarm", s=10)
ax[0].set_title("K-Means (gagal: cluster dianggap bulat)")  # judul
# warnai titik dengan hasil DBSCAN (eps = radius tetangga)
ax[1].scatter(*X.T, c=DBSCAN(eps=0.2, min_samples=5).fit_predict(X), cmap="coolwarm", s=10)
ax[1].set_title("DBSCAN (berhasil mengikuti bentuk)")  # judul
plt.show()  # tampilkan`,
  },
  {
    id: 'pca',
    name: 'PCA (Principal Component Analysis)',
    category: 'Unsupervised',
    tagline: 'Meringkas banyak kolom menjadi sedikit tanpa banyak kehilangan informasi.',
    explain: [
      'Mencari arah-arah baru (principal components) tempat data paling bervariasi, lalu memproyeksikan data ke beberapa arah teratas. Data 100 kolom bisa diringkas menjadi 2–10 kolom.',
    ],
    steps: [
      'Standarkan data (rata-rata 0)',
      'Hitung matriks kovarians antar fitur',
      'Cari eigenvector (arah) dan eigenvalue (besar variasi)',
      'Ambil k arah dengan variasi terbesar, lalu proyeksikan data',
    ],
    uses: ['Visualisasi data berdimensi tinggi ke 2D/3D', 'Mempercepat training dengan mengurangi fitur', 'Mengurangi noise', 'Kompresi gambar'],
    pros: ['Cepat dan tanpa parameter rumit', 'Menghilangkan redundansi fitur', 'Bagus untuk visualisasi'],
    cons: ['Komponen baru sulit diartikan', 'Hanya menangkap hubungan linear', 'Wajib scaling'],
    when: 'Data punya banyak kolom yang saling berkorelasi, atau ingin melihat data dalam 2D.',
    code: py`
import numpy as np  # NumPy untuk hitungan
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.datasets import load_digits  # dataset gambar angka 8x8
from sklearn.decomposition import PCA  # PCA

X = load_digits().data                    # 64 fitur per gambar
pca = PCA().fit(X)  # hitung semua komponen utama
# jumlah kumulatif variasi yang dijelaskan
kumulatif = np.cumsum(pca.explained_variance_ratio_)
k = np.argmax(kumulatif >= 0.9) + 1  # komponen pertama yang mencapai 90%
print(f"Hanya butuh {k} dari 64 komponen untuk menyimpan 90% informasi")  # cetak hasilnya

# kurva informasi tersimpan vs jumlah komponen
plt.plot(range(1, 65), kumulatif, marker=".")
# garis bantu di 90% dan di k
plt.axhline(0.9, ls="--", color="gray"); plt.axvline(k, ls="--", color="gray")
plt.xlabel("Jumlah komponen"); plt.ylabel("Informasi tersimpan")  # label sumbu
plt.show()  # tampilkan`,
  },
  {
    id: 'apriori',
    name: 'Apriori (Association Rules)',
    category: 'Unsupervised',
    tagline: '"Orang yang membeli roti juga membeli selai."',
    explain: [
      'Mencari kombinasi item yang sering muncul bersama dalam transaksi, lalu membuat aturan "jika A maka B". Ukurannya: **support** (seberapa sering), **confidence** (seberapa sering B muncul jika ada A), dan **lift** (> 1 berarti benar-benar berhubungan).',
    ],
    steps: [
      'Hitung frekuensi setiap item; buang yang jarang (di bawah min support)',
      'Gabungkan item yang lolos menjadi pasangan; hitung lagi dan buang yang jarang',
      'Lanjutkan ke kombinasi 3 item, dan seterusnya',
      'Dari kombinasi yang sering muncul, buat aturan dan hitung confidence & lift',
    ],
    uses: ['Penataan produk di minimarket', 'Rekomendasi "sering dibeli bersama"', 'Bundling promo', 'Analisis pola menu restoran'],
    pros: ['Mudah dipahami dan langsung bisa dipakai bisnis', 'Tanpa label'],
    cons: ['Lambat jika item sangat banyak', 'Bisa menghasilkan terlalu banyak aturan', 'Hanya menemukan korelasi, bukan sebab-akibat'],
    when: 'Data transaksi/keranjang belanja dan ingin menemukan produk yang sering dibeli bersama.',
    code: py`
from itertools import combinations  # membuat semua pasangan item
from collections import Counter  # menghitung kemunculan

transaksi = [  # setiap transaksi = himpunan barang yang dibeli
    {"roti", "selai", "susu"}, {"roti", "selai"}, {"roti", "susu", "telur"},
    {"kopi", "gula"}, {"roti", "selai", "telur"}, {"kopi", "gula", "susu"},
    {"roti", "selai", "kopi"}, {"susu", "telur"},
]
n = len(transaksi)  # jumlah transaksi
item_count = Counter(i for t in transaksi for i in t)  # berapa kali setiap barang muncul
# berapa kali setiap pasangan barang muncul bersama
pair_count = Counter(p for t in transaksi for p in combinations(sorted(t), 2))

print("Aturan (min support 25%):")  # aturan yang sering muncul
for (a, b), c in pair_count.items():  # periksa setiap pasangan
    if c / n < 0.25:  # lewati pasangan yang jarang (support < 25%)
        continue  # lanjut ke pasangan berikutnya
    for x, y in [(a, b), (b, a)]:  # cek dua arah: x -> y dan y -> x
        conf = c / item_count[x]  # confidence: dari yang beli x, berapa persen juga beli y
        lift = conf / (item_count[y] / n)  # lift > 1 = lebih sering dari kebetulan
        if conf >= 0.6:  # hanya tampilkan aturan yang cukup kuat
            # cetak aturan beserta ukurannya
            print(f"  {x} -> {y}: support={c/n:.2f} confidence={conf:.2f} lift={lift:.2f}")`,
  },
  {
    id: 'mlp',
    name: 'Neural Network (MLP)',
    category: 'Deep Learning',
    tagline: 'Lapisan-lapisan neuron yang bisa mempelajari pola apa pun.',
    explain: [
      'Multi-Layer Perceptron terdiri dari layer input, satu atau lebih hidden layer, dan layer output. Setiap neuron menghitung `aktivasi(input · bobot + bias)`. Dilatih dengan backpropagation dan gradient descent.',
    ],
    steps: [
      'Forward: data mengalir dari input melewati hidden layer ke output',
      'Hitung loss (seberapa salah)',
      'Backward: hitung gradien setiap bobot (chain rule)',
      'Update bobot; ulangi untuk banyak epoch',
    ],
    uses: ['Fondasi semua deep learning', 'Klasifikasi/regresi pada data tabel besar', 'Bagian akhir (head) dari CNN dan Transformer'],
    pros: ['Bisa mempelajari pola non-linear yang sangat kompleks', 'Fleksibel untuk banyak jenis data'],
    cons: ['Butuh banyak data', 'Banyak hyperparameter', 'Sulit dijelaskan (black box)', 'Untuk data tabel sering kalah dari gradient boosting'],
    when: 'Data besar dengan pola kompleks, atau sebagai komponen arsitektur yang lebih besar.',
    code: py`
import matplotlib.pyplot as plt  # Matplotlib untuk menampilkan gambar
from sklearn.datasets import load_digits  # dataset gambar angka 8x8
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.neural_network import MLPClassifier  # neural network (MLP)

digits = load_digits()  # muat data
# bagi 16 agar piksel berada di rentang 0 sampai 1
X_tr, X_te, y_tr, y_te = train_test_split(digits.data / 16, digits.target, random_state=0)
# 2 hidden layer: 64 dan 32 neuron
mlp = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=300, random_state=0).fit(X_tr, y_tr)
# akurasi di data uji
print("Akurasi mengenali angka tulisan tangan:", round(mlp.score(X_te, y_te), 3))

fig, ax = plt.subplots(1, 6, figsize=(10, 2))  # enam gambar berdampingan
# ambil 6 gambar uji pertama beserta tebakannya
for a, img, pred in zip(ax, X_te[:6], mlp.predict(X_te[:6])):
    # tampilkan gambar dan tebakan model
    a.imshow(img.reshape(8, 8), cmap="gray_r"); a.set_title(f"tebak: {pred}"); a.axis("off")
plt.show()  # tampilkan`,
  },
  {
    id: 'cnn',
    name: 'CNN (Convolutional Neural Network)',
    category: 'Deep Learning',
    tagline: 'Mata untuk AI: filter yang mendeteksi pola dalam gambar.',
    explain: [
      'Memakai filter kecil yang digeser di seluruh gambar untuk mendeteksi fitur lokal. Layer awal mendeteksi tepi, layer tengah mendeteksi tekstur dan bentuk, layer akhir mendeteksi objek. Pooling mengecilkan ukuran gambar.',
    ],
    steps: [
      'Konvolusi: filter digeser di atas gambar dan menghasilkan feature map',
      'Aktivasi ReLU',
      'Pooling: mengecilkan ukuran (ambil nilai maksimum per area)',
      'Ulangi beberapa kali, lalu flatten dan masuk ke layer dense untuk klasifikasi',
    ],
    uses: ['Klasifikasi gambar (X-ray, penyakit tanaman)', 'Pengenalan wajah', 'Object detection (YOLO berbasis CNN)', 'OCR, kontrol kualitas di pabrik'],
    pros: ['Sangat efektif untuk gambar', 'Jumlah parameter lebih hemat daripada MLP', 'Banyak model pretrained siap pakai'],
    cons: ['Butuh banyak data atau transfer learning', 'Butuh GPU untuk training', 'Sulit dijelaskan'],
    when: 'Data berupa gambar atau sinyal yang punya struktur spasial.',
    code: py`
import numpy as np  # NumPy untuk hitungan
import matplotlib.pyplot as plt  # Matplotlib untuk gambar
from sklearn.datasets import load_digits  # dataset gambar angka

img = load_digits().images[0]            # angka "0", 8x8 piksel

def conv2d(x, k):  # konvolusi dengan kernel 3x3 tanpa padding
    h, w = x.shape[0] - 2, x.shape[1] - 2  # ukuran hasil berkurang 2 piksel
    # kalikan potongan 3x3 dengan kernel lalu jumlahkan
    return np.array([[np.sum(x[i:i+3, j:j+3] * k) for j in range(w)] for i in range(h)])

def maxpool(x):  # max pooling 2x2
    h, w = x.shape[0] // 2, x.shape[1] // 2  # ukuran hasil menjadi setengah
    # kelompokkan per blok 2x2 lalu ambil nilai terbesar
    return x[:h*2, :w*2].reshape(h, 2, w, 2).max(axis=(1, 3))

kernel = np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]])   # deteksi tepi
fmap = np.maximum(0, conv2d(img, kernel))                      # konvolusi + ReLU
pooled = maxpool(fmap)  # ringkas menjadi setengah ukuran

fig, ax = plt.subplots(1, 3, figsize=(9, 3))  # tiga gambar berdampingan
# tampilkan setiap tahap
for a, g, t in zip(ax, [img, fmap, pooled], ["Input 8x8", "Konvolusi+ReLU 6x6", "Max pooling 3x3"]):
    # gambar, judul, sembunyikan sumbu
    a.imshow(g, cmap="gray"); a.set_title(t); a.axis("off")
plt.show()  # tampilkan`,
  },
  {
    id: 'rnn',
    name: 'RNN / LSTM',
    category: 'Deep Learning',
    tagline: 'Neural network dengan ingatan untuk data berurutan.',
    explain: [
      'Memproses urutan satu langkah demi satu langkah sambil membawa **hidden state** (ingatan). LSTM menambahkan gerbang (forget, input, output) agar bisa mengingat informasi jangka panjang.',
    ],
    steps: [
      'Ambil elemen urutan ke-t (misalnya harga hari ke-t)',
      'Gabungkan dengan hidden state dari langkah sebelumnya',
      'Hasilkan hidden state baru (dan output)',
      'Lanjut ke elemen berikutnya',
    ],
    uses: ['Prediksi time series (penjualan, cuaca, listrik)', 'Pengenalan suara', 'Analisis sinyal sensor/EKG', 'Teks (sebelum era Transformer)'],
    pros: ['Cocok untuk urutan dengan panjang bervariasi', 'Lebih ringan dari Transformer untuk perangkat kecil'],
    cons: ['Lambat karena tidak bisa paralel', 'Sulit mengingat urutan yang sangat panjang', 'Untuk teks sudah banyak digantikan Transformer'],
    when: 'Time series dan data sensor, terutama di perangkat dengan sumber daya terbatas.',
    code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.neural_network import MLPRegressor  # neural network untuk regresi

# Prediksi time series dengan "jendela" 10 langkah terakhir.
# (RNN asli memproses langkah demi langkah; ide jendela ini adalah versi sederhananya)
t = np.arange(400)  # 400 langkah waktu
# deret waktu: gabungan dua gelombang + noise
seri = np.sin(t * 0.1) + 0.5 * np.sin(t * 0.03) + np.random.default_rng(0).normal(0, 0.05, 400)

w = 10  # ukuran jendela: 10 nilai terakhir
# setiap baris = 10 nilai berturut-turut
X = np.array([seri[i:i+w] for i in range(len(seri) - w)])
y = seri[w:]  # target = nilai sesudah jendela
# latih dengan 300 jendela pertama
model = MLPRegressor(hidden_layer_sizes=(32,), max_iter=2000, random_state=0).fit(X[:300], y[:300])

plt.plot(range(310, 400), y[300:], label="asli")  # nilai asli di bagian uji
# tebakan model di bagian uji
plt.plot(range(310, 400), model.predict(X[300:]), "--", label="prediksi")
# tampilkan
plt.legend(); plt.title("Prediksi langkah berikutnya pada data uji"); plt.show()`,
  },
  {
    id: 'transformer',
    name: 'Transformer',
    category: 'Deep Learning',
    tagline: 'Arsitektur di balik ChatGPT, Claude, Gemini, dan banyak model modern.',
    explain: [
      'Memproses seluruh urutan sekaligus dengan **self-attention**: setiap token "melihat" semua token lain dan memutuskan mana yang relevan. Ditambah **positional encoding** (informasi urutan), layer feed-forward, dan disusun berlapis-lapis.',
    ],
    steps: [
      'Ubah token menjadi embedding dan tambahkan informasi posisi',
      'Self-attention: hitung Query, Key, Value; bobot = softmax(Q·Kᵀ/√d)',
      'Feed-forward network untuk setiap token',
      'Ulangi puluhan layer; layer terakhir memprediksi token berikutnya',
    ],
    uses: ['LLM & chatbot', 'Penerjemahan', 'Ringkasan dan tanya jawab', 'Vision Transformer (gambar), Whisper (suara), AlphaFold (protein)'],
    pros: ['Bisa dilatih paralel di GPU', 'Menangkap hubungan jarak jauh', 'Semakin besar (data + parameter), semakin pintar'],
    cons: ['Sangat mahal untuk dilatih', 'Biaya attention naik kuadratik terhadap panjang teks', 'Bisa berhalusinasi'],
    when: 'Hampir semua tugas bahasa dan banyak tugas lain. Biasanya dipakai lewat model pretrained atau API, bukan dilatih dari nol.',
    code: py`
import numpy as np  # NumPy untuk matriks

def softmax(z):  # softmax per baris
    # stabil: kurangi maksimum, lalu bagi total
    e = np.exp(z - z.max(-1, keepdims=True)); return e / e.sum(-1, keepdims=True)

def attention(Q, K, V):  # rumus inti attention
    # softmax(Q.K / akar d) lalu dikalikan V
    return softmax(Q @ K.T / np.sqrt(K.shape[1])) @ V

# Contoh intuitif: "ia" harus memperhatikan "kucing", bukan "meja"
kata = ["kucing", "naik", "meja", "ia", "tidur"]  # lima kata dalam kalimat
# Dimensi key: [makhluk hidup, aksi, benda]
K = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.4, 0, 0.3], [0.2, 1, 0]], dtype=float)
q_ia = np.array([[6, 0, 0]], dtype=float)        # query "ia": mencari makhluk hidup
bobot = softmax(q_ia @ K.T / np.sqrt(3))[0]  # skor attention 'ia' ke setiap kata
for k, b in zip(kata, bobot):  # tampilkan sebagai batang
    # panjang batang sebanding dengan perhatian
    print(f"'ia' memperhatikan {k:7s}: {'█' * int(b * 40)} {b:.2f}")`,
  },
  {
    id: 'a-star',
    name: 'A* Search',
    category: 'Pencarian & Reinforcement',
    tagline: 'Mencari rute terpendek dengan cerdas.',
    explain: [
      'Algoritma AI klasik untuk pencarian jalur. Untuk setiap posisi, A* menghitung `f = g + h`: **g** adalah jarak yang sudah ditempuh, **h** adalah perkiraan sisa jarak ke tujuan (heuristik). Posisi dengan f terkecil dieksplorasi lebih dulu, sehingga jauh lebih efisien daripada mencoba semua jalan.',
    ],
    steps: [
      'Masukkan titik awal ke daftar "terbuka"',
      'Ambil titik dengan f = g + h terkecil',
      'Jika itu tujuan, selesai; jika tidak, tambahkan tetangganya ke daftar',
      'Ulangi sampai tujuan ditemukan',
    ],
    uses: ['Navigasi peta & GPS', 'Gerakan karakter di game', 'Robot dan drone', 'Logistik dan perencanaan rute'],
    pros: ['Dijamin menemukan rute terpendek (jika heuristiknya tidak melebih-lebihkan)', 'Jauh lebih efisien daripada BFS'],
    cons: ['Memakai banyak memori untuk peta besar', 'Bergantung pada kualitas heuristik'],
    when: 'Mencari jalur terpendek di peta, grid, atau graf.',
    code: py`
import heapq  # antrian prioritas: selalu ambil f terkecil

peta = [
    "S . . # . . .",
    ". # . # . # .",
    ". # . . . # .",
    ". # # # . # .",
    ". . . # . . G",
]
grid = [row.split() for row in peta]  # ubah setiap baris menjadi list simbol
R, C = len(grid), len(grid[0])  # jumlah baris dan kolom
# cari posisi sebuah simbol di peta
find = lambda ch: next((r, c) for r in range(R) for c in range(C) if grid[r][c] == ch)
start, goal = find("S"), find("G")  # posisi awal dan tujuan
h = lambda p: abs(p[0] - goal[0]) + abs(p[1] - goal[1])      # jarak Manhattan

open_set = [(h(start), 0, start, [start])]  # isi antrian: (f = g + h, g, posisi, rute)
dikunjungi = set()  # posisi yang sudah diperiksa
while open_set:  # ulangi selama masih ada kandidat
    f, g, pos, path = heapq.heappop(open_set)  # ambil kandidat dengan f terkecil
    if pos == goal:  # sampai di tujuan
        break  # selesai
    if pos in dikunjungi:  # sudah pernah diperiksa
        continue  # lewati
    dikunjungi.add(pos)  # tandai sudah diperiksa
    # coba 4 arah: kanan, bawah, kiri, atas
    for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
        n = (pos[0] + dr, pos[1] + dc)  # posisi tetangga
        if 0 <= n[0] < R and 0 <= n[1] < C and grid[n[0]][n[1]] != "#":
            # masukkan tetangga ke antrian dengan biaya baru
            heapq.heappush(open_set, (g + 1 + h(n), g + 1, n, path + [n]))

for r, c in path[1:-1]:  # tandai rute di peta (kecuali S dan G)
    grid[r][c] = "*"  # * = jalur yang dipilih
print("\n".join(" ".join(row) for row in grid))  # cetak peta
# panjang rute dan jumlah sel yang diperiksa
print(f"Panjang rute: {len(path) - 1} langkah, sel dieksplorasi: {len(dikunjungi)}")`,
  },
  {
    id: 'q-learning',
    name: 'Q-Learning (Reinforcement Learning)',
    category: 'Pencarian & Reinforcement',
    tagline: 'Agen belajar dari coba-coba, hadiah, dan hukuman.',
    explain: [
      'Agen berada di suatu **state**, memilih **aksi**, lalu menerima **reward**. Q-Learning menyimpan tabel Q(state, aksi), yaitu perkiraan total hadiah jika melakukan aksi tersebut. Lama-lama agen tahu aksi terbaik di setiap state. Ada keseimbangan antara **eksplorasi** (mencoba hal baru) dan **eksploitasi** (memakai yang sudah diketahui).',
    ],
    steps: [
      'Mulai dengan tabel Q berisi nol',
      'Pilih aksi: kadang acak (eksplorasi), kadang terbaik menurut Q (eksploitasi)',
      'Terima reward dan state baru',
      'Update: Q ← Q + α·(reward + γ·max Q(state baru) − Q)',
      'Ulangi selama ribuan episode',
    ],
    uses: ['AI bermain game (AlphaGo memakai RL)', 'Robotika', 'Optimasi iklan dan harga', 'RLHF untuk melatih LLM agar membantu'],
    pros: ['Belajar tanpa data berlabel, cukup dari interaksi', 'Bisa menemukan strategi yang tidak terpikirkan manusia'],
    cons: ['Butuh sangat banyak percobaan', 'Mendesain reward itu sulit', 'Tabel Q tidak muat untuk state yang sangat banyak (solusinya Deep Q-Network)'],
    when: 'Masalah pengambilan keputusan berurutan dengan lingkungan yang bisa disimulasikan.',
    code: py`
import numpy as np  # NumPy untuk tabel Q
rng = np.random.default_rng(0)  # generator acak dengan seed tetap

# Lorong 6 kotak: mulai di 0, harta karun di 5 (+10), setiap langkah -1
N, AKSI = 6, ["kiri", "kanan"]  # 6 posisi, 2 aksi
Q = np.zeros((N, 2))  # tabel Q: nilai setiap (posisi, aksi), awalnya 0
# alpha = kecepatan belajar, gamma = bobot masa depan, epsilon = peluang mencoba acak
alpha, gamma, epsilon = 0.5, 0.9, 0.3

for episode in range(200):  # 200 episode (percobaan dari awal)
    s = 0  # mulai di posisi 0
    while s != N - 1:  # jalan terus sampai menemukan harta
        # kadang coba acak (eksplorasi), selain itu pilih aksi terbaik
        a = rng.integers(2) if rng.random() < epsilon else Q[s].argmax()
        # aksi 0 = mundur (tidak bisa < 0), aksi 1 = maju
        s_baru = max(0, s - 1) if a == 0 else s + 1
        # hadiah +10 jika sampai, -1 untuk setiap langkah lain
        reward = 10 if s_baru == N - 1 else -1
        # rumus Q-learning: geser Q ke arah reward + nilai masa depan
        Q[s, a] += alpha * (reward + gamma * Q[s_baru].max() - Q[s, a])
        s = s_baru  # pindah ke posisi baru

print("Tabel Q (baris = posisi):")  # tampilkan tabel Q yang dipelajari
for s in range(N - 1):  # untuk setiap posisi (kecuali posisi harta)
    # aksi dengan nilai Q tertinggi = kebijakan robot
    print(f"  posisi {s}: kiri={Q[s,0]:6.2f} kanan={Q[s,1]:6.2f} -> pilih {AKSI[Q[s].argmax()]}")`,
  },
]
