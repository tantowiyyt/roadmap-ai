import { py } from './py.js'

export const machineLearning = {
  id: 'machine-learning',
  title: 'Machine Learning',
  duration: '6 minggu',
  description: 'Mulai membuat model yang belajar dari data menggunakan scikit-learn.',
  topics: [
    {
      id: 'ml-konsep',
      title: 'Konsep dasar ML',
      summary: 'Apa itu "mesin belajar" dan jenis-jenisnya.',
      explain: [
        'Pemrograman biasa: kita menulis **aturan** → komputer memberi jawaban. Machine learning: kita memberi **contoh data + jawaban** → komputer menemukan aturannya sendiri.',
        '**Supervised learning**: data punya label/jawaban (email + "spam/bukan"). Terbagi menjadi **klasifikasi** (menebak kategori) dan **regresi** (menebak angka).',
        '**Unsupervised learning**: data tanpa label, model mencari pola sendiri (misalnya mengelompokkan pelanggan). **Reinforcement learning**: agen belajar dari hadiah/hukuman (game, robot).',
        '**Fitur (X)** adalah input, **label (y)** adalah jawaban. Data dibagi menjadi **training set** (untuk belajar) dan **test set** (untuk ujian). Model tidak boleh melihat test set saat belajar.',
      ],
      uses: [
        'Klasifikasi: deteksi spam, diagnosa penyakit, deteksi penipuan',
        'Regresi: prediksi harga rumah, penjualan, suhu',
        'Clustering: segmentasi pelanggan',
        'Reinforcement: AI game, robotika',
      ],
      algos: ['knn', 'linear-regression', 'kmeans', 'q-learning'],
      examples: [
        {
          title: 'Alur ML lengkap dalam 10 baris',
          code: py`
from sklearn.datasets import load_iris  # dataset bunga iris
# fungsi untuk membagi data latih & uji
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier  # algoritma K-Nearest Neighbors

X, y = load_iris(return_X_y=True)            # X = fitur, y = label
print("Contoh fitur:", X[0], "-> label:", y[0])  # satu baris data dan labelnya

# 20% data disisihkan untuk ujian
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Data latih:", len(X_train), "| data uji:", len(X_test))  # cek ukuran tiap bagian

model = KNeighborsClassifier(n_neighbors=3)  # pilih model: lihat 3 tetangga terdekat
model.fit(X_train, y_train)                  # 1. belajar
prediksi = model.predict(X_test)             # 2. menebak
print("Prediksi :", prediksi)  # tebakan model
print("Jawaban  :", y_test)  # jawaban sebenarnya
print("Akurasi  :", model.score(X_test, y_test))   # 3. evaluasi`,
        },
      ],
    },
    {
      id: 'ml-regresi',
      title: 'Regresi linear',
      summary: 'Menebak angka dengan menarik garis terbaik.',
      explain: [
        'Regresi linear mencari garis `y = a·x + b` yang paling dekat dengan semua titik data. "Paling dekat" artinya total kuadrat error-nya (**MSE**) paling kecil.',
        '`a` (slope/koefisien) menunjukkan seberapa besar y berubah jika x naik 1. Dengan banyak fitur: `y = a₁x₁ + a₂x₂ + … + b`.',
        'Kelebihannya: sederhana, cepat, dan mudah dijelaskan. Kekurangannya: hanya menangkap hubungan lurus (linear).',
      ],
      uses: [
        'Prediksi harga rumah dari luas dan lokasi',
        'Prediksi penjualan dari biaya iklan',
        'Baseline (pembanding) sebelum mencoba model yang lebih rumit',
      ],
      algos: ['linear-regression'],
      examples: [
        {
          title: 'Dari nol dengan gradient descent vs scikit-learn',
          code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.linear_model import LinearRegression  # model regresi linear scikit-learn

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
luas = rng.uniform(30, 150, 50)                       # m²
harga = 8 * luas + 100 + rng.normal(0, 60, 50)        # juta

# --- Versi dari nol (gradient descent) ---
x = (luas - luas.mean()) / luas.std()                 # standardisasi agar stabil
a, b, lr = 0.0, 0.0, 0.1  # kemiringan a, titik potong b, learning rate
for _ in range(200):  # 200 langkah gradient descent
    pred = a * x + b  # tebakan dengan garis saat ini
    a -= lr * 2 * np.mean((pred - harga) * x)  # geser a ke arah yang menurunkan error
    b -= lr * 2 * np.mean(pred - harga)  # geser b ke arah yang menurunkan error
# kembalikan ke satuan asli (karena x tadi distandarkan)
print(f"Dari nol   : harga ≈ {a / luas.std():.2f} * luas + {b - a * luas.mean() / luas.std():.1f}")

# --- Versi scikit-learn ---
# reshape(-1, 1): scikit-learn butuh fitur berbentuk kolom
model = LinearRegression().fit(luas.reshape(-1, 1), harga)
# coef_ = kemiringan, intercept_ = titik potong
print(f"scikit-learn: harga ≈ {model.coef_[0]:.2f} * luas + {model.intercept_:.1f}")
# tebak harga rumah 100 m2
print("Prediksi rumah 100 m²:", model.predict([[100]])[0].round(1), "juta")

plt.scatter(luas, harga, alpha=.6)  # gambar data
garis = np.linspace(30, 150, 2)  # dua titik ujung untuk menggambar garis
# gambar garis hasil model
plt.plot(garis, model.predict(garis.reshape(-1, 1)), color="red")
plt.xlabel("Luas (m²)"); plt.ylabel("Harga (juta)")  # label sumbu
plt.show()  # tampilkan`,
        },
      ],
    },
    {
      id: 'ml-klasifikasi',
      title: 'Regresi logistik & KNN',
      summary: 'Menebak kategori: ya/tidak, spam/bukan.',
      explain: [
        '**Regresi logistik** (meski namanya "regresi") adalah model **klasifikasi**. Ia menghitung skor linear lalu mengubahnya menjadi probabilitas 0–1 dengan fungsi sigmoid.',
        '**KNN (K-Nearest Neighbors)** sangat intuitif: untuk data baru, cari K tetangga terdekat lalu ambil suara terbanyak. "Kamu mirip dengan teman-temanmu."',
      ],
      uses: [
        'Logistik: skor kredit, prediksi pelanggan berhenti (churn), diagnosa medis',
        'KNN: sistem rekomendasi sederhana, klasifikasi dengan data sedikit',
      ],
      algos: ['logistic-regression', 'knn'],
      examples: [
        {
          title: 'Deteksi kanker payudara (dataset nyata)',
          code: py`
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.preprocessing import StandardScaler  # penyeragam skala fitur
from sklearn.linear_model import LogisticRegression  # model regresi logistik
from sklearn.neighbors import KNeighborsClassifier  # model KNN

data = load_breast_cancer()  # muat data
X_train, X_test, y_train, y_test = train_test_split(  # 25% data untuk uji
    data.data, data.target, test_size=0.25, random_state=0)

scaler = StandardScaler().fit(X_train)  # pelajari rata-rata & std dari data LATIH saja
# terapkan skala yang sama ke latih dan uji
X_train, X_test = scaler.transform(X_train), scaler.transform(X_test)

logreg = LogisticRegression(max_iter=1000).fit(X_train, y_train)  # latih regresi logistik
# latih KNN dengan 5 tetangga
knn = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)

# akurasi di data uji
print("Akurasi regresi logistik:", round(logreg.score(X_test, y_test), 3))
print("Akurasi KNN             :", round(knn.score(X_test, y_test), 3))

prob = logreg.predict_proba(X_test[:3])  # peluang setiap kelas untuk 3 pasien pertama
for p in prob:  # cetak peluang tiap pasien
    print(f"P(ganas)={p[0]:.2f}  P(jinak)={p[1]:.2f}")  # kelas 0 = ganas, kelas 1 = jinak`,
        },
      ],
    },
    {
      id: 'ml-tree',
      title: 'Decision tree, random forest, gradient boosting',
      summary: 'Model andalan untuk data berbentuk tabel.',
      explain: [
        '**Decision tree** membuat serangkaian pertanyaan ya/tidak ("luas > 100?") yang dipelajari dari data. Mudah dijelaskan, tetapi cenderung overfitting.',
        '**Random forest** melatih ratusan tree pada potongan data acak lalu melakukan voting. Hasilnya lebih stabil dan akurat. Ini contoh **ensemble**.',
        '**Gradient boosting** (XGBoost, LightGBM, CatBoost) membuat tree secara berurutan; setiap tree baru memperbaiki kesalahan tree sebelumnya. Sering menjadi juara kompetisi Kaggle untuk data tabel.',
      ],
      uses: [
        'Credit scoring dan deteksi penipuan transaksi',
        'Prediksi churn pelanggan',
        'Kompetisi Kaggle untuk data tabel',
        'Mencari fitur yang paling berpengaruh (feature importance)',
      ],
      algos: ['decision-tree', 'random-forest', 'gradient-boosting'],
      examples: [
        {
          title: 'Melihat isi decision tree',
          code: py`
from sklearn.datasets import load_iris  # dataset bunga iris
# decision tree dan fungsi untuk menampilkannya sebagai teks
from sklearn.tree import DecisionTreeClassifier, export_text

iris = load_iris()  # muat data
# pohon dengan kedalaman maksimal 2 pertanyaan
tree = DecisionTreeClassifier(max_depth=2, random_state=0).fit(iris.data, iris.target)
# cetak aturan if-else yang dipelajari
print(export_text(tree, feature_names=list(iris.feature_names)))
# Perhatikan: ini hanyalah if-else yang dipelajari otomatis!`,
        },
        {
          title: 'Membandingkan 3 model pada dataset anggur',
          code: py`
from sklearn.datasets import load_wine  # dataset anggur
from sklearn.model_selection import cross_val_score  # cross-validation
from sklearn.tree import DecisionTreeClassifier  # satu pohon
# kumpulan pohon (ensemble)
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

X, y = load_wine(return_X_y=True)  # muat fitur dan label
models = {  # tiga model yang akan dibandingkan
    "Decision Tree": DecisionTreeClassifier(random_state=0),
    "Random Forest": RandomForestClassifier(n_estimators=200, random_state=0),
    "Gradient Boosting": GradientBoostingClassifier(random_state=0),
}
for nama, m in models.items():  # uji setiap model
    # 5-fold cross-validation: 5 kali ujian dengan potongan data berbeda
    skor = cross_val_score(m, X, y, cv=5)
    print(f"{nama:18s}: {skor.mean():.3f} ± {skor.std():.3f}")  # rata-rata ± variasi skor

rf = models["Random Forest"].fit(X, y)  # latih random forest dengan seluruh data
names = load_wine().feature_names  # nama setiap fitur
# urutkan fitur dari yang paling penting, ambil 3 teratas
top = sorted(zip(rf.feature_importances_, names), reverse=True)[:3]
print("\nFitur paling penting:", [n for _, n in top])  # cetak nama fiturnya saja`,
        },
      ],
    },
    {
      id: 'ml-svm',
      title: 'Support Vector Machine',
      summary: 'Mencari garis pemisah dengan jarak aman terlebar.',
      explain: [
        'SVM mencari garis (atau bidang) pemisah dua kelas dengan **margin** terlebar, yaitu jarak terjauh ke titik terdekat dari masing-masing kelas.',
        'Dengan **kernel trick** (misalnya RBF), SVM bisa memisahkan data yang tidak bisa dipisah garis lurus, dengan cara "mengangkat" data ke dimensi yang lebih tinggi.',
      ],
      uses: [
        'Klasifikasi teks dan gambar dengan data menengah',
        'Bioinformatika (klasifikasi gen/protein)',
        'Pengenalan tulisan tangan',
      ],
      algos: ['svm'],
      examples: [
        {
          title: 'Kernel linear vs RBF pada data "bulan sabit"',
          code: py`
import numpy as np  # NumPy untuk grid titik
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.datasets import make_moons  # pembuat data berbentuk bulan sabit
from sklearn.svm import SVC  # Support Vector Machine

# 200 titik, 2 kelas, sedikit noise
X, y = make_moons(n_samples=200, noise=0.2, random_state=0)
fig, axes = plt.subplots(1, 2, figsize=(10, 4))  # dua grafik berdampingan
# grid titik untuk mewarnai wilayah keputusan
xx, yy = np.meshgrid(np.linspace(-1.5, 2.5, 200), np.linspace(-1, 1.5, 200))

for ax, kernel in zip(axes, ["linear", "rbf"]):  # coba kernel linear dan RBF
    m = SVC(kernel=kernel).fit(X, y)  # latih SVM
    # tebak kelas setiap titik grid
    Z = m.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=.25, cmap="coolwarm")  # warnai wilayah keputusan
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap="coolwarm", s=15)  # gambar data asli
    ax.set_title(f"Kernel {kernel}: akurasi {m.score(X, y):.2f}")  # judul berisi akurasi
plt.show()  # tampilkan`,
        },
      ],
    },
    {
      id: 'ml-clustering',
      title: 'Clustering & PCA',
      summary: 'Menemukan kelompok dan meringkas data tanpa label.',
      explain: [
        '**K-Means** membagi data menjadi K kelompok. Caranya: taruh K titik pusat secara acak → setiap data ikut pusat terdekat → pusat dipindah ke rata-rata anggotanya → ulangi sampai stabil.',
        '**PCA** (Principal Component Analysis) memadatkan banyak fitur menjadi sedikit fitur baru sambil mempertahankan informasi sebanyak mungkin. Berguna untuk visualisasi data berdimensi tinggi dan mempercepat model.',
      ],
      uses: [
        'Segmentasi pelanggan untuk marketing',
        'Mengelompokkan berita/dokumen yang mirip',
        'PCA: visualisasi data 100 dimensi ke 2D, kompresi data',
      ],
      algos: ['kmeans', 'dbscan', 'pca'],
      examples: [
        {
          title: 'Segmentasi pelanggan dengan K-Means',
          code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.cluster import KMeans  # algoritma K-Means

rng = np.random.default_rng(3)  # generator acak dengan seed tetap
# [pendapatan (juta/bulan), skor belanja 0-100]
X = np.vstack([  # gabungkan 4 kelompok pelanggan buatan
    rng.normal([4, 20], [1, 8], (50, 2)),  # pendapatan rendah, belanja rendah
    rng.normal([5, 75], [1, 8], (50, 2)),  # pendapatan rendah, belanja tinggi
    rng.normal([15, 80], [2, 8], (50, 2)),  # pendapatan tinggi, belanja tinggi
    rng.normal([14, 25], [2, 8], (50, 2)),  # pendapatan tinggi, belanja rendah
])
# cari 4 kelompok; n_init=10 = coba 10 posisi awal
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)

# warnai titik sesuai kelompok yang ditemukan
plt.scatter(X[:, 0], X[:, 1], c=km.labels_, cmap="tab10", s=15)
# tanda x hitam = titik pusat tiap kelompok
plt.scatter(*km.cluster_centers_.T, c="black", marker="x", s=150)
plt.xlabel("Pendapatan"); plt.ylabel("Skor belanja")  # label sumbu
plt.title("4 segmen pelanggan")  # judul
plt.show()  # tampilkan
for i, c in enumerate(km.cluster_centers_):  # profil setiap segmen
    print(f"Segmen {i}: pendapatan≈{c[0]:.1f} jt, skor belanja≈{c[1]:.0f}")`,
        },
        {
          title: 'PCA: 64 dimensi → 2 dimensi',
          code: py`
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.datasets import load_digits  # dataset gambar angka tulisan tangan
from sklearn.decomposition import PCA  # PCA untuk meringkas kolom

digits = load_digits()               # gambar angka 8x8 = 64 fitur
X2 = PCA(n_components=2).fit_transform(digits.data)  # 64 kolom diringkas menjadi 2 kolom
# gambar setiap gambar sebagai titik, warna = angka aslinya
plt.scatter(X2[:, 0], X2[:, 1], c=digits.target, cmap="tab10", s=8)
plt.colorbar(label="angka")  # keterangan warna
plt.title("Gambar angka tulisan tangan setelah PCA")  # judul
plt.show()  # tampilkan`,
        },
      ],
    },
    {
      id: 'ml-evaluasi',
      title: 'Evaluasi model',
      summary: 'Mengukur seberapa bagus model — dengan metrik yang tepat.',
      explain: [
        '**Accuracy** (persentase benar) bisa menipu. Jika 99% transaksi normal, model yang selalu menjawab "normal" akurasinya 99% tapi tidak pernah menangkap penipuan!',
        '**Confusion matrix** menunjukkan detail benar/salah. **Precision**: dari yang ditebak positif, berapa yang benar? **Recall**: dari semua yang positif, berapa yang tertangkap? **F1** adalah gabungan keduanya.',
        'Untuk regresi: **MAE** (rata-rata selisih absolut), **RMSE** (menghukum error besar lebih berat), dan **R²** (proporsi variasi yang dijelaskan model).',
      ],
      uses: [
        'Deteksi penyakit: utamakan recall (jangan sampai ada pasien terlewat)',
        'Filter spam: utamakan precision (jangan sampai email penting masuk spam)',
        'Memilih model terbaik',
      ],
      examples: [
        {
          title: 'Jebakan accuracy & confusion matrix',
          code: py`
import numpy as np  # NumPy untuk data
# fungsi-fungsi evaluasi
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
y_true = (rng.random(1000) < 0.02).astype(int)   # hanya 2% penipuan

y_malas = np.zeros(1000, dtype=int)              # model "malas": selalu normal
# akurasinya tinggi padahal tidak berguna
print("Akurasi model malas:", accuracy_score(y_true, y_malas))
# hitung penipuan yang berhasil ditandai (0!)
print("Penipuan yang tertangkap:", (y_malas[y_true == 1] == 1).sum(), "dari", y_true.sum())

# Model yang lebih baik (simulasi)
y_pred = y_true.copy()  # salin jawaban benar
salah = rng.choice(1000, 15, replace=False)  # pilih 15 data acak
y_pred[salah] = 1 - y_pred[salah]  # buat 15 tebakan salah
# tabel tebakan benar & salah per kelas
print("\nConfusion matrix [[TN FP] [FN TP]]:\n", confusion_matrix(y_true, y_pred))
# precision, recall, f1 untuk setiap kelas
print(classification_report(y_true, y_pred, target_names=["normal", "penipuan"]))`,
        },
      ],
    },
    {
      id: 'ml-overfit',
      title: 'Overfitting & cross-validation',
      summary: 'Model yang hafal vs model yang paham.',
      explain: [
        '**Overfitting**: model menghafal data latih (skor latih tinggi, skor uji rendah), seperti siswa yang menghafal kunci jawaban. **Underfitting**: model terlalu sederhana sehingga keduanya rendah.',
        'Solusi overfitting: tambah data, sederhanakan model, **regularisasi** (L1/L2), dan early stopping.',
        '**Cross-validation (k-fold)**: data dibagi menjadi k bagian, lalu model dilatih/diuji k kali dengan bagian uji yang bergantian. Penilaiannya lebih adil daripada satu kali split.',
      ],
      uses: [
        'Memastikan model bekerja pada data baru, bukan hanya data latih',
        'Memilih hyperparameter (GridSearchCV)',
      ],
      examples: [
        {
          title: 'Melihat overfitting dengan polinomial',
          code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
# pembuat fitur polinomial (x, x^2, x^3, ...)
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression  # regresi linear
from sklearn.pipeline import make_pipeline  # merangkai langkah-langkah jadi satu model
from sklearn.model_selection import train_test_split  # membagi data latih & uji

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
X = np.sort(rng.uniform(0, 1, 30)).reshape(-1, 1)  # 30 titik x antara 0 dan 1
# target = gelombang sinus + noise
y = np.sin(2 * np.pi * X).ravel() + rng.normal(0, 0.2, 30)
# 30% data untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

xs = np.linspace(0, 1, 200).reshape(-1, 1)  # titik-titik untuk menggambar kurva
# gambar data latih dan uji
plt.scatter(X_tr, y_tr, label="latih"); plt.scatter(X_te, y_te, label="uji", marker="x")
for deg in [1, 4, 15]:  # coba 3 tingkat kerumitan model
    # polinomial derajat deg lalu regresi linear
    m = make_pipeline(PolynomialFeatures(deg), LinearRegression()).fit(X_tr, y_tr)
    # bandingkan skor latih vs uji
    print(f"Derajat {deg:2d}: skor latih={m.score(X_tr, y_tr):.2f}, skor uji={m.score(X_te, y_te):.2f}")
    plt.plot(xs, m.predict(xs), label=f"derajat {deg}")  # gambar kurva model
plt.ylim(-2, 2); plt.legend(); plt.show()  # tampilkan
print("Derajat 1 = underfit, 4 = pas, 15 = overfit (hafal data latih)")`,
        },
        {
          title: 'Cross-validation & GridSearch',
          code: py`
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
# pencarian hyperparameter terbaik dengan cross-validation
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeClassifier  # decision tree

X, y = load_breast_cancer(return_X_y=True)  # muat data
grid = GridSearchCV(DecisionTreeClassifier(random_state=0),  # coba beberapa nilai max_depth
                    {"max_depth": [1, 2, 3, 5, 10, None]}, cv=5)
grid.fit(X, y)  # jalankan semua percobaan
# cetak skor setiap max_depth
for d, s in zip(grid.cv_results_["param_max_depth"], grid.cv_results_["mean_test_score"]):
    print(f"max_depth={str(d):5s} -> skor CV {s:.3f}")
print("Terbaik:", grid.best_params_)  # pengaturan dengan skor terbaik`,
        },
      ],
    },
    {
      id: 'ml-fitur',
      title: 'Feature engineering & pipeline',
      summary: 'Menyiapkan fitur agar model bisa belajar lebih baik.',
      explain: [
        'Model hanya mengerti angka. Data kategori ("Jakarta", "Bandung") diubah dengan **one-hot encoding**. Angka dengan skala berbeda (umur vs gaji) disamakan dengan **scaling**.',
        '**Feature engineering** adalah membuat fitur baru yang lebih bermakna, misalnya "harga per m²" atau "hari dalam seminggu" dari tanggal. Sering memberi peningkatan lebih besar daripada mengganti algoritma.',
        '**Pipeline** menggabungkan preprocessing dan model menjadi satu object, sehingga tidak ada kebocoran data (data leakage) dan mudah di-deploy.',
      ],
      uses: [
        'Mengolah data campuran (angka + kategori)',
        'Mencegah data leakage',
        'Menyimpan seluruh proses dalam satu file model',
      ],
      examples: [
        {
          title: 'Pipeline dengan data campuran',
          code: py`
import pandas as pd  # Pandas untuk tabel
from sklearn.compose import ColumnTransformer  # menerapkan preprocessing berbeda per kolom
# one-hot untuk kategori, standarisasi untuk angka
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline  # merangkai preprocessing + model
from sklearn.ensemble import RandomForestRegressor  # random forest untuk regresi

df = pd.DataFrame({  # data rumah kecil
    "luas":   [36, 45, 70, 90, 120, 60, 150, 80],
    "kamar":  [1, 2, 2, 3, 4, 2, 4, 3],
    "kota":   ["Bekasi", "Jakarta", "Bekasi", "Jakarta", "Bandung", "Bandung", "Jakarta", "Bekasi"],
    "harga":  [350, 900, 600, 1500, 1300, 650, 2600, 750],
})
df["harga_per_m2"] = df["harga"] / df["luas"]       # contoh fitur baru (untuk analisis)
# rata-rata harga per m2 tiap kota
print(df.groupby("kota")["harga_per_m2"].mean().round(1), "\n")

X, y = df[["luas", "kamar", "kota"]], df["harga"]  # pisahkan fitur (X) dan target (y)
pipe = Pipeline([  # pipeline: langkah dijalankan berurutan
    ("prep", ColumnTransformer([
        ("angka", StandardScaler(), ["luas", "kamar"]),  # kolom angka distandarkan
        # kolom kota diubah menjadi kolom 0/1
        ("kategori", OneHotEncoder(handle_unknown="ignore"), ["kota"]),
    ])),
    # model di akhir pipeline
    ("model", RandomForestRegressor(n_estimators=100, random_state=0)),
])
pipe.fit(X, y)  # latih: preprocessing + model sekaligus
# data rumah baru (masih mentah)
baru = pd.DataFrame({"luas": [100], "kamar": [3], "kota": ["Jakarta"]})
# pipeline otomatis memproses data baru dengan cara yang sama
print("Prediksi harga rumah baru:", pipe.predict(baru)[0].round(0), "juta")`,
        },
      ],
    },
  ],
  project: 'Model prediksi harga rumah lengkap dengan evaluasi dan perbandingan 3 algoritma.',
  resources: [
    { label: 'Kaggle Learn: Intro to Machine Learning', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
    { label: 'Machine Learning Specialization (Andrew Ng)', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
    { label: 'scikit-learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html' },
    { label: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' },
  ],
  quiz: [
    {
      q: 'Memprediksi harga rumah termasuk jenis masalah…',
      options: ['Klasifikasi', 'Regresi', 'Clustering', 'Reinforcement learning'],
      answer: 1,
      why: 'Outputnya angka kontinu, jadi termasuk regresi.',
    },
    {
      q: 'Skor latih 99% tetapi skor uji 60%. Ini tanda…',
      options: ['Underfitting', 'Overfitting', 'Model sempurna', 'Data terlalu banyak'],
      answer: 1,
      why: 'Model menghafal data latih dan gagal pada data baru.',
    },
    {
      q: 'Untuk deteksi kanker, metrik mana yang paling penting dijaga tetap tinggi?',
      options: ['Precision', 'Recall', 'Akurasi data latih', 'Waktu training'],
      answer: 1,
      why: 'Recall tinggi berarti hampir semua pasien yang sakit tertangkap; melewatkan pasien sakit sangat berbahaya.',
    },
  ],
}

export const deepLearning = {
  id: 'deep-learning',
  title: 'Deep Learning',
  duration: '6 minggu',
  description: 'Neural network — teknologi di balik pengenalan gambar, suara, dan LLM seperti ChatGPT/Claude.',
  topics: [
    {
      id: 'dl-nn',
      title: 'Neural network & perceptron',
      summary: 'Neuron buatan: input × bobot + bias → aktivasi.',
      explain: [
        'Satu **neuron** menerima beberapa input, mengalikan masing-masing dengan **bobot** (seberapa penting input itu), menjumlahkan, menambah **bias**, lalu melewatkannya ke **fungsi aktivasi**.',
        'Neuron disusun menjadi **layer**: input layer → hidden layer(s) → output layer. "Deep" berarti ada banyak hidden layer.',
        '**Perceptron** adalah neural network paling sederhana (1 neuron). Ia bisa belajar AND/OR, tetapi tidak bisa XOR. Untuk XOR dibutuhkan hidden layer, dan inilah alasan kita butuh jaringan yang "dalam".',
      ],
      uses: [
        'Fondasi semua deep learning: pengenalan gambar, suara, teks, LLM',
        'Memahami arsitektur yang lebih kompleks',
      ],
      algos: ['mlp'],
      examples: [
        {
          title: 'Perceptron belajar gerbang AND',
          code: py`
import numpy as np  # NumPy untuk hitungan vektor

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])  # 4 kemungkinan input dua angka 0/1
y = np.array([0, 0, 0, 1])        # AND

w = np.zeros(2); b = 0.0; lr = 0.1  # bobot awal 0, bias 0, learning rate 0.1
for epoch in range(10):  # ulangi 10 putaran (epoch)
    for xi, target in zip(X, y):  # proses satu contoh data per langkah
        pred = int(xi @ w + b > 0)          # neuron: x·w + b, lalu aktivasi step
        error = target - pred  # selisih jawaban benar dan tebakan (0, 1, atau -1)
        w += lr * error * xi                # perbaiki bobot
        b += lr * error  # perbaiki bias dengan cara yang sama

print("Bobot:", w, "Bias:", b)  # bobot hasil belajar
for xi in X:  # uji ke semua input
    print(xi, "->", int(xi @ w + b > 0))  # tebakan akhir untuk setiap input
# Coba ganti y menjadi [0,1,1,0] (XOR). Perceptron tidak akan pernah benar semua!`,
        },
      ],
    },
    {
      id: 'dl-backprop',
      title: 'Backpropagation',
      summary: 'Cara neural network belajar dari kesalahannya.',
      explain: [
        'Training neural network punya 4 langkah yang diulang: (1) **forward pass**: hitung prediksi, (2) hitung **loss** (seberapa salah), (3) **backward pass**: hitung gradien loss terhadap setiap bobot dengan chain rule, (4) **update** bobot dengan gradient descent.',
        'Backpropagation adalah cara efisien menghitung gradien untuk jutaan bobot sekaligus, mulai dari layer terakhir mundur ke layer pertama.',
        'Untungnya PyTorch/TensorFlow menghitungnya otomatis (**autograd**). Tapi membuatnya sekali dari nol akan membuatmu benar-benar paham.',
      ],
      uses: [
        'Melatih semua jenis neural network',
        'Memahami masalah seperti vanishing/exploding gradient',
      ],
      examples: [
        {
          title: 'Neural network 2 layer dari nol (menyelesaikan XOR)',
          code: py`
import numpy as np  # NumPy untuk matriks
import matplotlib.pyplot as plt  # Matplotlib untuk grafik loss
rng = np.random.default_rng(0)  # generator acak dengan seed tetap

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)  # 4 input XOR
y = np.array([[0], [1], [1], [0]], dtype=float)          # XOR

sigmoid = lambda z: 1 / (1 + np.exp(-z))  # fungsi aktivasi sigmoid (hasil 0 sampai 1)
W1, b1 = rng.normal(0, 1, (2, 4)), np.zeros(4)           # 2 input -> 4 hidden
W2, b2 = rng.normal(0, 1, (4, 1)), np.zeros(1)           # 4 hidden -> 1 output
lr, riwayat = 1.0, []  # learning rate dan catatan loss

for epoch in range(3000):  # ulangi 3000 kali
    # 1. Forward
    h = sigmoid(X @ W1 + b1)  # lapisan tersembunyi
    out = sigmoid(h @ W2 + b2)  # lapisan output = tebakan
    # 2. Loss (MSE)
    loss = np.mean((out - y) ** 2); riwayat.append(loss)
    # 3. Backward (chain rule)
    # gradien di output (turunan loss x turunan sigmoid)
    d_out = 2 * (out - y) / len(X) * out * (1 - out)
    d_W2, d_b2 = h.T @ d_out, d_out.sum(0)  # gradien untuk bobot & bias lapisan 2
    # teruskan gradien mundur ke lapisan tersembunyi (aturan rantai)
    d_h = d_out @ W2.T * h * (1 - h)
    d_W1, d_b1 = X.T @ d_h, d_h.sum(0)  # gradien untuk bobot & bias lapisan 1
    # 4. Update
    W2 -= lr * d_W2; b2 -= lr * d_b2  # perbarui bobot berlawanan arah gradien
    W1 -= lr * d_W1; b1 -= lr * d_b1  # begitu juga lapisan 1

# setelah training, tebakan mendekati target
print("Prediksi XOR:", out.round(2).ravel(), "| target:", y.ravel())
# grafik loss yang turun dari waktu ke waktu
plt.plot(riwayat); plt.title("Loss turun selama training"); plt.xlabel("epoch"); plt.show()`,
        },
      ],
    },
    {
      id: 'dl-aktivasi',
      title: 'Fungsi aktivasi, loss & optimizer',
      summary: 'Komponen yang menentukan cara jaringan belajar.',
      explain: [
        '**Fungsi aktivasi** membuat jaringan bisa mempelajari pola non-linear. **ReLU** (max(0,x)) adalah default untuk hidden layer. **Sigmoid** untuk output ya/tidak. **Softmax** untuk output banyak kelas (hasilnya probabilitas yang jumlahnya 1).',
        '**Loss function** mengukur kesalahan: MSE untuk regresi, **cross-entropy** untuk klasifikasi.',
        '**Optimizer** mengatur cara update bobot: SGD (dasar), **Adam** (adaptif, paling populer, default yang aman).',
      ],
      uses: [
        'Memilih komponen yang tepat saat merancang model',
        'Softmax juga dipakai LLM untuk memilih token berikutnya',
      ],
      examples: [
        {
          title: 'Grafik fungsi aktivasi, softmax, dan cross-entropy',
          code: py`
import numpy as np  # NumPy untuk hitungan
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

x = np.linspace(-5, 5, 200)  # 200 titik x dari -5 sampai 5
plt.plot(x, np.maximum(0, x), label="ReLU")  # ReLU: negatif jadi 0, positif tetap
# Sigmoid: menekan semua angka ke 0 sampai 1
plt.plot(x, 1 / (1 + np.exp(-x)), label="Sigmoid")
plt.plot(x, np.tanh(x), label="Tanh")  # Tanh: menekan ke -1 sampai 1
# tampilkan ketiga kurva
plt.legend(); plt.grid(alpha=.3); plt.title("Fungsi aktivasi"); plt.show()

def softmax(z):  # softmax: ubah skor menjadi peluang yang totalnya 1
    e = np.exp(z - z.max())  # dikurangi nilai maksimum agar exp() tidak meluap (stabil)
    return e / e.sum()  # bagi dengan total agar jumlahnya 1

skor = np.array([2.0, 1.0, 0.1])           # skor mentah (logits) untuk kucing, anjing, burung
prob = softmax(skor)  # hitung peluang tiap kelas
print("Probabilitas:", prob.round(3), "| jumlah:", prob.sum())

# Cross-entropy: jika jawaban benar = kucing (index 0)
# -log(peluang jawaban benar): kecil jika yakin benar
print("Loss jika yakin & benar :", round(-np.log(prob[0]), 3))
# besar jika model yakin pada jawaban yang salah
print("Loss jika yakin & salah :", round(-np.log(softmax(np.array([0.1, 3.0, 0.1]))[0]), 3))`,
        },
      ],
    },
    {
      id: 'dl-pytorch',
      title: 'PyTorch dasar',
      summary: 'Library deep learning paling populer untuk riset & industri.',
      explain: [
        '**Tensor** adalah array seperti NumPy tetapi bisa berjalan di GPU dan mencatat gradien otomatis (**autograd**).',
        'Model dibuat sebagai class turunan `nn.Module`. Training loop standar: `optimizer.zero_grad()` → `loss = loss_fn(model(x), y)` → `loss.backward()` → `optimizer.step()`.',
        'PyTorch tidak bisa dijalankan di browser. Salin kode di bawah ke **Google Colab** (sudah terinstall).',
      ],
      uses: [
        'Membuat dan melatih neural network apa pun',
        'Dipakai untuk melatih banyak LLM dan model open-source',
        'Library Hugging Face dibangun di atas PyTorch',
      ],
      examples: [
        {
          title: 'Training loop PyTorch (jalankan di Colab)',
          runnable: false,
          note: 'Salin ke Google Colab (colab.research.google.com) lalu jalankan.',
          code: py`
import torch  # library deep learning PyTorch
from torch import nn  # nn = kumpulan layer siap pakai

X = torch.tensor([[0., 0.], [0., 1.], [1., 0.], [1., 1.]])  # input XOR sebagai tensor
y = torch.tensor([[0.], [1.], [1.], [0.]])  # target XOR

class XORNet(nn.Module):  # model PyTorch dibuat sebagai class turunan nn.Module
    def __init__(self):
        super().__init__()  # wajib: jalankan inisialisasi nn.Module
        self.layers = nn.Sequential(  # Sequential = layer dijalankan berurutan
            nn.Linear(2, 8), nn.ReLU(),  # 2 input -> 8 neuron, lalu ReLU
            nn.Linear(8, 1), nn.Sigmoid(),  # 8 neuron -> 1 output, lalu sigmoid (peluang)
        )
    def forward(self, x):  # forward = cara data mengalir dari input ke output
        return self.layers(x)

model = XORNet()  # buat model
loss_fn = nn.BCELoss()  # loss untuk klasifikasi biner
# optimizer Adam memperbarui semua bobot model
optimizer = torch.optim.Adam(model.parameters(), lr=0.05)

for epoch in range(500):  # ulangi 500 epoch
    optimizer.zero_grad()  # kosongkan gradien dari langkah sebelumnya
    loss = loss_fn(model(X), y)  # forward + hitung loss
    loss.backward()          # backprop otomatis!
    optimizer.step()  # perbarui bobot

# detach() lepas dari graf gradien, round() bulatkan ke 0/1
print(model(X).detach().round())`,
        },
        {
          title: 'Hal yang sama dengan scikit-learn (bisa di browser)',
          code: py`
import numpy as np  # NumPy untuk array
# neural network sederhana dari scikit-learn
from sklearn.neural_network import MLPClassifier

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])  # input XOR
y = np.array([0, 1, 1, 0])  # target XOR
# 1 hidden layer berisi 8 neuron dengan aktivasi ReLU
model = MLPClassifier(hidden_layer_sizes=(8,), activation="relu",
                      solver="lbfgs", random_state=1, max_iter=1000).fit(X, y)
print("Prediksi XOR:", model.predict(X))  # seharusnya [0 1 1 0]`,
        },
      ],
    },
    {
      id: 'dl-cnn',
      title: 'CNN (Convolutional Neural Network)',
      summary: 'Arsitektur khusus untuk gambar.',
      explain: [
        'Gambar adalah matriks piksel. CNN memakai **filter (kernel)** kecil, misalnya 3×3, yang "digeser" ke seluruh gambar untuk mendeteksi pola: tepi, sudut, tekstur.',
        'Layer awal mendeteksi pola sederhana (garis). Layer yang lebih dalam menggabungkannya menjadi pola kompleks (mata, roda, wajah). **Pooling** mengecilkan ukuran gambar sambil menyimpan informasi penting.',
        'Filter-filter ini **dipelajari otomatis** saat training, bukan dibuat manual.',
      ],
      uses: [
        'Klasifikasi gambar (jenis penyakit daun, X-ray)',
        'Pengenalan wajah, OCR (membaca tulisan)',
        'Mobil otonom, kontrol kualitas produk di pabrik',
      ],
      algos: ['cnn'],
      examples: [
        {
          title: 'Konvolusi dari nol: filter pendeteksi tepi',
          code: py`
import numpy as np  # NumPy untuk array gambar
import matplotlib.pyplot as plt  # Matplotlib untuk menampilkan gambar

# Gambar 20x20: kotak putih di tengah
img = np.zeros((20, 20)); img[5:15, 5:15] = 1

def konvolusi(gambar, kernel):  # konvolusi: geser kernel ke seluruh gambar
    k = kernel.shape[0]  # ukuran kernel (mis. 3)
    # ukuran hasil lebih kecil k-1 piksel
    out = np.zeros((gambar.shape[0] - k + 1, gambar.shape[1] - k + 1))
    for i in range(out.shape[0]):  # geser ke bawah
        for j in range(out.shape[1]):  # geser ke kanan
            # kalikan potongan gambar dengan kernel lalu jumlahkan
            out[i, j] = np.sum(gambar[i:i+k, j:j+k] * kernel)
    return out

# kernel pendeteksi tepi tegak
tepi_vertikal = np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]])
tepi_horizontal = tepi_vertikal.T  # ditranspose menjadi pendeteksi tepi datar

fig, ax = plt.subplots(1, 3, figsize=(10, 3.5))  # tiga gambar berdampingan
ax[0].imshow(img, cmap="gray"); ax[0].set_title("Gambar asli")  # gambar asli
# hasil filter tepi vertikal (merah/biru = tepi)
ax[1].imshow(konvolusi(img, tepi_vertikal), cmap="bwr"); ax[1].set_title("Filter tepi vertikal")
# hasil filter tepi horizontal
ax[2].imshow(konvolusi(img, tepi_horizontal), cmap="bwr"); ax[2].set_title("Filter tepi horizontal")
plt.show()  # tampilkan`,
        },
        {
          title: 'CNN di PyTorch (Colab)',
          runnable: false,
          code: py`
from torch import nn  # layer-layer PyTorch

model = nn.Sequential(  # susun layer berurutan
    nn.Conv2d(1, 16, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 28x28 -> 14x14
    nn.Conv2d(16, 32, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 14x14 -> 7x7
    nn.Flatten(),  # ratakan gambar 32x7x7 menjadi satu vektor
    nn.Linear(32 * 7 * 7, 10),     # 10 kelas (angka 0-9, dataset MNIST)
)`,
        },
      ],
    },
    {
      id: 'dl-rnn',
      title: 'RNN & LSTM',
      summary: 'Arsitektur untuk data berurutan.',
      explain: [
        '**RNN** membaca data satu per satu (kata demi kata, hari demi hari) sambil membawa "ingatan" (**hidden state**) dari langkah sebelumnya.',
        'RNN biasa mudah lupa pada urutan panjang. **LSTM** dan **GRU** menambahkan "gerbang" yang mengatur apa yang diingat dan apa yang dilupakan.',
        'Untuk teks, posisinya sekarang banyak digantikan **Transformer**, tetapi RNN/LSTM masih dipakai untuk time series dan perangkat kecil.',
      ],
      uses: [
        'Prediksi time series: harga saham, cuaca, permintaan listrik',
        'Pengenalan suara dan teks tulisan tangan',
        'Sensor IoT',
      ],
      algos: ['rnn'],
      examples: [
        {
          title: 'Cara RNN membawa ingatan',
          code: py`
import numpy as np  # NumPy untuk vektor
rng = np.random.default_rng(0)  # generator acak

kalimat = ["saya", "suka", "belajar", "ai"]  # kalimat yang dibaca satu kata per langkah
emb = {k: rng.normal(0, 1, 3) for k in kalimat}    # vektor setiap kata

W_x = rng.normal(0, 0.5, (3, 4))   # input -> hidden
W_h = rng.normal(0, 0.5, (4, 4))   # hidden -> hidden (ingatan)
h = np.zeros(4)                    # ingatan awal kosong

for kata in kalimat:  # baca kata satu per satu
    h = np.tanh(emb[kata] @ W_x + h @ W_h)     # ingatan baru = f(input sekarang, ingatan lama)
    # cetak isi ingatan setelah setiap kata
    print(f"Setelah membaca '{kata:8s}': hidden state = {h.round(2)}")
print("\nHidden state terakhir merangkum seluruh kalimat -> dipakai untuk klasifikasi/prediksi.")`,
        },
      ],
    },
    {
      id: 'dl-regularisasi',
      title: 'Dropout, batch norm & augmentasi',
      summary: 'Teknik agar neural network tidak overfitting.',
      explain: [
        '**Dropout**: saat training, sebagian neuron dimatikan secara acak supaya jaringan tidak bergantung pada neuron tertentu.',
        '**Batch normalization**: menormalkan output setiap layer agar training lebih stabil dan cepat. **Weight decay (L2)**: menghukum bobot yang terlalu besar.',
        '**Data augmentation**: memperbanyak data dengan memodifikasi data yang ada (memutar, membalik, memotong gambar). **Early stopping**: berhenti saat skor validasi mulai turun.',
      ],
      uses: [
        'Melatih model dengan data terbatas',
        'Meningkatkan performa pada data baru',
      ],
      examples: [
        {
          title: 'Efek regularisasi (weight decay)',
          code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.neural_network import MLPRegressor  # neural network untuk regresi

# Hanya 20 titik data latih + jaringan besar = resep overfitting
rng = np.random.default_rng(3)  # generator acak dengan seed tetap
# 20 titik x acak, diurutkan, dibentuk menjadi kolom
x_latih = np.sort(rng.uniform(-3, 3, 20)).reshape(-1, 1)
y_latih = np.sin(x_latih).ravel() + rng.normal(0, 0.3, 20)  # target = sinus + noise
x_uji = rng.uniform(-3, 3, 200).reshape(-1, 1)  # 200 titik uji
y_uji = np.sin(x_uji).ravel() + rng.normal(0, 0.3, 200)  # target uji

xs = np.linspace(-3, 3, 300).reshape(-1, 1)  # titik-titik untuk menggambar kurva model
# gambar data latih
plt.scatter(x_latih, y_latih, color="black", zorder=3, label="data latih (20 titik)")
for alpha in [0.0, 0.1, 5.0]:          # alpha = kekuatan weight decay (L2)
    # jaringan besar: 2 layer x 200 neuron
    m = MLPRegressor(hidden_layer_sizes=(200, 200), alpha=alpha, solver="lbfgs",
                     max_iter=5000, random_state=0).fit(x_latih, y_latih)
    # fungsi kecil untuk menghitung error kuadrat rata-rata
    mse = lambda X, Y: np.mean((m.predict(X) - Y) ** 2)
    # bandingkan error latih vs uji
    print(f"alpha={alpha:<4}: error latih={mse(x_latih, y_latih):.3f}  error uji={mse(x_uji, y_uji):.3f}")
    plt.plot(xs, m.predict(xs), label=f"alpha={alpha}")  # gambar kurva tebakan model
# tampilkan grafik
plt.ylim(-2, 2); plt.legend(); plt.title("Efek weight decay pada neural network"); plt.show()
print("\nalpha=0   -> overfit: hafal data latih, error uji besar")
print("alpha=0.1 -> pas: error uji paling kecil")
print("alpha=5   -> terlalu kuat: underfit")`,
        },
        {
          title: 'Augmentasi gambar sederhana',
          code: py`
import numpy as np  # NumPy untuk mengolah gambar
import matplotlib.pyplot as plt  # Matplotlib untuk menampilkan
from sklearn.datasets import load_digits  # dataset gambar angka 8x8

img = load_digits().images[3]  # ambil satu gambar (angka 3)
variasi = {  # berbagai versi augmentasi dari gambar yang sama
    "Asli": img,
    "Dibalik": np.fliplr(img),  # dibalik kiri-kanan
    "Diputar 90°": np.rot90(img),  # diputar 90 derajat
    "Digeser": np.roll(img, 1, axis=1),  # digeser 1 piksel ke kanan
    # ditambah noise acak
    "Diberi noise": img + np.random.default_rng(0).normal(0, 2, img.shape),
}
fig, ax = plt.subplots(1, 5, figsize=(11, 2.5))  # lima gambar berdampingan
# pasangkan setiap kotak gambar dengan satu variasi
for a, (judul, g) in zip(ax, variasi.items()):
    # tampilkan gambar, beri judul, sembunyikan sumbu
    a.imshow(g, cmap="gray"); a.set_title(judul); a.axis("off")
plt.show()  # tampilkan`,
        },
      ],
    },
    {
      id: 'dl-transfer',
      title: 'Transfer learning',
      summary: 'Memakai model yang sudah pintar untuk tugas baru.',
      explain: [
        'Melatih model gambar dari nol butuh jutaan gambar dan GPU berhari-hari. Dengan **transfer learning**, kita memakai model **pretrained** (misalnya ResNet yang dilatih di ImageNet) lalu hanya melatih ulang layer terakhir dengan data kita.',
        'Prinsipnya: kemampuan mengenali tepi, tekstur, dan bentuk sudah dipelajari dan bisa dipakai ulang. Cukup ratusan gambar untuk hasil bagus.',
        'Ini juga prinsip di balik LLM: model besar dilatih sekali (pretraining), lalu disesuaikan (fine-tuning) untuk tugas tertentu.',
      ],
      uses: [
        'Klasifikasi gambar dengan data sedikit (jenis batik, penyakit tanaman)',
        'Fine-tuning model bahasa untuk bahasa Indonesia',
        'Menghemat waktu dan biaya komputasi',
      ],
      examples: [
        {
          title: 'Transfer learning dengan torchvision (Colab)',
          runnable: false,
          code: py`
import torch  # PyTorch
from torch import nn  # layer siap pakai
from torchvision import models  # kumpulan model gambar terlatih

model = models.resnet18(weights="IMAGENET1K_V1")   # model pretrained

for p in model.parameters():                      # bekukan semua layer
    p.requires_grad = False  # bobot tidak ikut dilatih

model.fc = nn.Linear(model.fc.in_features, 5)     # ganti layer terakhir: 5 kelas kita
# hanya layer baru yang dilatih
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
# ... lalu training loop seperti biasa dengan dataset gambarmu`,
        },
      ],
    },
    {
      id: 'dl-gpu',
      title: 'Training di GPU',
      summary: 'Mempercepat training puluhan kali lipat.',
      explain: [
        'GPU punya ribuan inti kecil yang bisa melakukan perkalian matriks secara paralel, sehingga training jauh lebih cepat daripada di CPU.',
        'Di PyTorch, model dan data dipindahkan ke GPU dengan `.to("cuda")`. **Batch size** yang lebih besar memakai lebih banyak memori GPU; jika muncul error "CUDA out of memory", kecilkan batch size.',
        'Pilihan GPU gratis: Google Colab dan Kaggle Notebooks (sekitar 30 jam/minggu).',
      ],
      uses: [
        'Training deep learning dan fine-tuning LLM',
        'Inferensi (prediksi) cepat untuk banyak pengguna',
      ],
      examples: [
        {
          title: 'Memakai GPU di PyTorch (Colab: Runtime → Change runtime type → GPU)',
          runnable: false,
          code: py`
import torch  # PyTorch

# pakai GPU (cuda) jika ada, kalau tidak pakai CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Memakai:", device)  # cetak perangkat yang dipakai
if device == "cuda":  # jika ada GPU
    print(torch.cuda.get_device_name(0))  # nama kartu GPU-nya

model = model.to(device)  # pindahkan model ke GPU/CPU
for X, y in dataloader:  # ambil data per batch
    X, y = X.to(device), y.to(device)  # data juga harus dipindah ke perangkat yang sama
    ...  # ... lanjutkan training loop di sini`,
        },
      ],
    },
  ],
  project: 'Klasifikasi gambar (mis. jenis makanan Indonesia) dengan transfer learning di Colab.',
  resources: [
    { label: 'Practical Deep Learning (fast.ai)', url: 'https://course.fast.ai/' },
    { label: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' },
    { label: 'Dive into Deep Learning (buku gratis)', url: 'https://d2l.ai/' },
    { label: '3Blue1Brown: Neural Networks', url: 'https://www.3blue1brown.com/topics/neural-networks' },
  ],
  quiz: [
    {
      q: 'Fungsi aktivasi apa yang paling umum untuk hidden layer?',
      options: ['Softmax', 'ReLU', 'Step', 'Linear'],
      answer: 1,
      why: 'ReLU sederhana, cepat, dan mengurangi masalah vanishing gradient.',
    },
    {
      q: 'Arsitektur apa yang paling cocok untuk klasifikasi gambar?',
      options: ['CNN', 'K-Means', 'Regresi linear', 'Apriori'],
      answer: 0,
      why: 'CNN memakai filter konvolusi untuk menangkap pola spasial pada gambar.',
    },
    {
      q: 'Kamu hanya punya 300 gambar untuk 5 kelas. Strategi terbaik adalah…',
      options: ['Latih CNN besar dari nol', 'Transfer learning dari model pretrained', 'Pakai regresi linear', 'Tidak mungkin bisa'],
      answer: 1,
      why: 'Model pretrained sudah paham fitur visual umum, jadi cukup disesuaikan dengan sedikit data.',
    },
  ],
}
