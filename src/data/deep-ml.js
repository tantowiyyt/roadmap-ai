import { py } from './py.js'

// Pendalaman materi Machine Learning dan Deep Learning.

export const deepMl = {
  // ---------------- Machine Learning ----------------
  'ml-konsep': {
    deep: {
      concepts: [
        ['Tujuan sebenarnya: generalisasi', 'Model tidak dinilai dari seberapa baik ia menghafal data latih, tetapi dari performanya di **data yang belum pernah dilihat**. Semua teknik (split, validasi, regularisasi) ada untuk mengukur dan meningkatkan generalisasi.'],
        ['Tiga set data', '**Latih** untuk mempelajari parameter. **Validasi** untuk memilih model dan hyperparameter. **Uji** dipakai sekali di akhir untuk melaporkan performa. Jika data uji dipakai berulang kali untuk memilih model, ia diam-diam berubah menjadi data validasi dan skornya jadi terlalu optimis.'],
        ['Parameter vs hyperparameter', '**Parameter** dipelajari dari data (koefisien regresi, bobot neural network). **Hyperparameter** ditentukan sebelum training (kedalaman tree, learning rate, jumlah cluster) dan dipilih lewat validasi.'],
        ['Selalu mulai dari baseline', 'Sebelum model rumit, ukur baseline sederhana: tebak kelas mayoritas, tebak rata-rata, atau aturan if-else sederhana. Model yang tidak jauh lebih baik dari baseline belum layak dipakai.'],
        ['No Free Lunch', 'Tidak ada algoritma yang selalu terbaik untuk semua masalah. Untuk data tabel, gradient boosting sering unggul; untuk gambar/teks/suara, deep learning. Tetap bandingkan beberapa kandidat.'],
      ],
      examples: [
        {
          title: 'Split latih/validasi/uji dan perbandingan dengan baseline',
          code: py`
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.dummy import DummyClassifier  # model 'tebak asal' sebagai baseline
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.tree import DecisionTreeClassifier  # decision tree
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.preprocessing import StandardScaler  # penyeragam skala

X, y = load_breast_cancer(return_X_y=True)  # muat data
# sisihkan 20% sebagai data uji (disimpan sampai akhir)
X_sisa, X_uji, y_sisa, y_uji = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)
# dari sisanya, 25% untuk validasi
X_latih, X_val, y_latih, y_val = train_test_split(X_sisa, y_sisa, test_size=0.25, stratify=y_sisa, random_state=0)
# ukuran setiap bagian
print(f"Latih {len(X_latih)} | Validasi {len(X_val)} | Uji {len(X_uji)}")

kandidat = {  # kandidat model yang dibandingkan
    "Baseline (mayoritas)": DummyClassifier(strategy="most_frequent"),
    "Decision tree": DecisionTreeClassifier(max_depth=4, random_state=0),
    "Regresi logistik": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
}
skor_val = {}  # skor validasi setiap kandidat
for nama, m in kandidat.items():  # latih & nilai setiap kandidat
    m.fit(X_latih, y_latih)  # latih di data latih
    skor_val[nama] = m.score(X_val, y_val)  # nilai di data validasi
    # bandingkan skor latih & validasi
    print(f"{nama:22s} latih={m.score(X_latih, y_latih):.3f}  validasi={skor_val[nama]:.3f}")

terbaik = max(skor_val, key=skor_val.get)  # pilih model dengan skor validasi tertinggi
model = kandidat[terbaik].fit(X_sisa, y_sisa)          # latih ulang dengan latih+validasi
# data uji dipakai SEKALI di akhir
print(f"\nDipilih: {terbaik} -> skor UJI (dilaporkan sekali): {model.score(X_uji, y_uji):.3f}")`,
        },
      ],
      mistakes: [
        ['Melaporkan akurasi pada data latih.', 'Selalu laporkan pada data yang tidak dipakai untuk training.'],
        ['Memilih model berdasarkan skor uji, lalu melaporkan skor uji yang sama.', 'Pilih dengan validasi atau cross-validation; data uji hanya untuk laporan akhir.'],
        ['Langsung memakai deep learning untuk 500 baris data tabel.', 'Mulai dari baseline dan model klasik; sering kali sudah cukup dan lebih mudah dijelaskan.'],
      ],
      tips: [
        'Tetapkan `random_state` agar eksperimen bisa diulang dengan hasil sama.',
        'Untuk data berurutan waktu, split berdasarkan waktu (latih = masa lalu, uji = masa depan), jangan acak.',
        'Pakai `stratify=y` untuk klasifikasi agar proporsi kelas sama di setiap split.',
      ],
      check: [
        ['Apa bedanya data validasi dan data uji?', 'Validasi dipakai berulang kali untuk memilih model/hyperparameter; uji dipakai sekali di akhir untuk estimasi performa yang jujur.'],
        ['Model kamu 92% akurat. Kenapa angka ini belum bermakna tanpa baseline?', 'Jika 90% data adalah satu kelas, tebakan mayoritas sudah 90%; model hanya unggul 2%.'],
      ],
    },
    exercise: {
      task: 'Pada dataset wine (`load_wine`), bandingkan `DummyClassifier` dengan `KNeighborsClassifier` (dengan dan tanpa `StandardScaler`). Laporkan skor pada data uji 25%.',
      hint: 'Pakai `train_test_split(..., stratify=y)` dan `make_pipeline(StandardScaler(), KNeighborsClassifier())`.',
      solution: py`
from sklearn.datasets import load_wine  # dataset anggur
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.dummy import DummyClassifier  # baseline
from sklearn.neighbors import KNeighborsClassifier  # KNN
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.preprocessing import StandardScaler  # penyeragam skala

X, y = load_wine(return_X_y=True)  # muat data
# 25% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)
for nama, m in [("Dummy", DummyClassifier()),  # tiga model yang dibandingkan
                ("KNN tanpa scaling", KNeighborsClassifier()),
                ("KNN + scaling", make_pipeline(StandardScaler(), KNeighborsClassifier()))]:
    # latih lalu nilai di data uji
    print(f"{nama:18s}: {m.fit(X_tr, y_tr).score(X_te, y_te):.3f}")`,
    },
  },
  'ml-regresi': {
    deep: {
      concepts: [
        ['Apa yang diminimalkan', 'Regresi linear mencari garis/bidang yang meminimalkan **jumlah kuadrat error** (OLS). Kuadrat membuat error besar dihukum lebih berat, sehingga regresi linear sensitif terhadap outlier.'],
        ['Membaca koefisien dengan benar', 'Koefisien `w_i` berarti "jika fitur i naik 1 satuan **dan fitur lain tetap**, prediksi berubah `w_i`". Jika dua fitur saling berkorelasi kuat (multikolinearitas), koefisien bisa tidak stabil atau bertanda aneh walaupun prediksinya tetap bagus.'],
        ['Regularisasi: Ridge dan Lasso', '**Ridge (L2)** mengecilkan semua koefisien, stabil saat fitur berkorelasi. **Lasso (L1)** bisa membuat koefisien tepat nol, sekaligus memilih fitur. Kekuatannya diatur `alpha`; fitur harus distandarkan dulu.'],
        ['Hubungan non-linear', 'Regresi linear tetap bisa memodelkan kurva jika fiturnya ditransformasi: `PolynomialFeatures`, `log(x)`, atau interaksi `x1*x2`. "Linear" artinya linear terhadap parameter, bukan terhadap fitur mentah.'],
        ['Metrik regresi', '**MAE** (rata-rata selisih absolut, mudah dijelaskan dalam satuan asli), **RMSE** (menghukum error besar), **R²** (proporsi variasi yang dijelaskan; 0 = sama dengan tebak rata-rata), **MAPE** (persentase, hati-hati bila nilai aktual mendekati nol).'],
      ],
      examples: [
        {
          title: 'Ridge vs Lasso pada fitur yang berkorelasi, dan analisis residual',
          code: py`
import numpy as np  # NumPy untuk data
from sklearn.linear_model import LinearRegression, Ridge, Lasso  # tiga jenis regresi linear
# penyeragam skala (wajib untuk Ridge/Lasso)
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.model_selection import cross_val_score  # cross-validation

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 80  # 80 rumah
luas = rng.uniform(40, 200, n)  # luas rumah
kamar = luas / 30 + rng.normal(0, 0.3, n)            # sangat berkorelasi dengan luas
jarak = rng.uniform(1, 30, n)  # jarak ke kota
acak = rng.normal(size=(n, 5))                         # 5 fitur tidak berguna
X = np.column_stack([luas, kamar, jarak, acak])  # gabungkan semua fitur menjadi matriks
y = 8 * luas - 15 * jarak + rng.normal(0, 60, n)       # harga (juta)
nama = ["luas", "kamar", "jarak"] + [f"acak{i}" for i in range(5)]  # nama setiap kolom

# bandingkan 3 model
for label, model in [("OLS", LinearRegression()), ("Ridge", Ridge(alpha=10)), ("Lasso", Lasso(alpha=5))]:
    pipe = make_pipeline(StandardScaler(), model).fit(X, y)  # latih dengan seluruh data
    coef = pipe[-1].coef_  # koefisien setiap fitur
    # skor R2 lewat cross-validation
    cv = cross_val_score(make_pipeline(StandardScaler(), model), X, y, cv=5, scoring="r2").mean()
    # lihat koefisiennya: Lasso membuat fitur acak = 0
    print(f"{label:5s} CV R2={cv:.3f} | koef:", " ".join(f"{n}={c:.0f}" for n, c in zip(nama, coef)))

# Analisis residual: apakah error masih punya pola?
ols = LinearRegression().fit(X, y)  # regresi biasa
residual = y - ols.predict(X)  # residual = nilai asli - tebakan
# rata-rata & sebaran residual
print(f"\nResidual: rata-rata {residual.mean():.1f}, std {residual.std():.1f} (juta)")
# bagi rumah menjadi 3 kelompok harga
kelompok = np.digitize(ols.predict(X), np.percentile(ols.predict(X), [33, 66]))
for k, nama_k in enumerate(["murah", "sedang", "mahal"]):  # untuk setiap kelompok
    # rata-rata residual per kelompok
    print(f"  rumah {nama_k:6s}: rata-rata residual {residual[kelompok == k].mean():6.1f}")
print("Rata-rata residual ~0 di semua kelompok = tidak ada pola sistematis yang terlewat.")`,
        },
      ],
      mistakes: [
        ['Menafsirkan koefisien tanpa standarisasi sebagai "tingkat kepentingan".', 'Koefisien bergantung pada satuan fitur. Standarkan fitur dulu jika ingin membandingkan besarnya.'],
        ['Memakai R² data latih sebagai ukuran kualitas.', 'Menambah fitur apa pun selalu menaikkan R² latih. Pakai R² validasi / cross-validation.'],
        ['Mengekstrapolasi jauh di luar rentang data (memprediksi rumah 2000 m² dari data 40–200 m²).', 'Model hanya bisa dipercaya di rentang data latih.'],
      ],
      tips: [
        'Jika target sangat miring (harga, pendapatan), latih pada `log(y)` lalu kembalikan dengan `exp`.',
        'Plot residual vs prediksi: pola berbentuk kurva atau corong menandakan model belum menangkap sesuatu.',
        'Pakai `RidgeCV`/`LassoCV` untuk memilih alpha otomatis.',
      ],
      check: [
        ['Kenapa koefisien "kamar" bisa bertanda negatif walau rumah dengan lebih banyak kamar lebih mahal?', 'Karena kamar sangat berkorelasi dengan luas. Koefisien mengukur efek kamar **saat luas tetap**, dan multikolinearitas membuat estimasinya tidak stabil.'],
        ['Apa kelebihan Lasso dibanding Ridge?', 'Lasso bisa membuat koefisien tepat nol sehingga otomatis membuang fitur yang tidak berguna.'],
      ],
    },
    exercise: {
      task: 'Dengan `load_diabetes` dari scikit-learn, bandingkan R² cross-validation (5-fold) untuk `LinearRegression`, `Ridge(alpha=1)`, dan `Lasso(alpha=0.1)`. Fitur mana yang dibuang Lasso?',
      hint: 'Pakai `cross_val_score(model, X, y, cv=5).mean()` dan lihat `coef_ == 0` setelah Lasso di-fit.',
      solution: py`
from sklearn.datasets import load_diabetes  # dataset diabetes
from sklearn.linear_model import LinearRegression, Ridge, Lasso  # tiga model regresi
from sklearn.model_selection import cross_val_score  # cross-validation

data = load_diabetes()  # muat data
X, y = data.data, data.target  # fitur & target
for m in [LinearRegression(), Ridge(alpha=1), Lasso(alpha=0.1)]:  # bandingkan ketiganya
    # skor R2 rata-rata 5-fold
    print(f"{type(m).__name__:16s} R2 CV = {cross_val_score(m, X, y, cv=5).mean():.3f}")
lasso = Lasso(alpha=0.1).fit(X, y)  # latih Lasso
# fitur dengan koefisien tepat 0 = dibuang
print("Dibuang Lasso:", [f for f, c in zip(data.feature_names, lasso.coef_) if c == 0])`,
    },
  },
  'ml-klasifikasi': {
    deep: {
      concepts: [
        ['Regresi logistik menghasilkan peluang', 'Model menghitung skor linear `z = w·x + b`, lalu sigmoid mengubahnya menjadi peluang 0–1. Koefisien bisa dibaca sebagai **log-odds**: `exp(w)` = pengali odds jika fitur naik 1 satuan.'],
        ['Threshold bisa (dan sering harus) diubah', 'Default `predict` memakai threshold 0,5. Untuk skrining penyakit, kita mungkin memakai 0,2 agar lebih sedikit kasus terlewat; untuk filter spam, 0,9 agar email penting tidak terbuang. Pilih threshold berdasarkan biaya kesalahan.'],
        ['Kalibrasi', 'Model terkalibrasi: dari semua prediksi "70% positif", sekitar 70% memang positif. Regresi logistik biasanya cukup terkalibrasi; random forest, SVM, dan boosting sering tidak, sehingga perlu `CalibratedClassifierCV` jika peluangnya dipakai langsung.'],
        ['KNN: malas tapi jujur', 'KNN tidak "belajar" apa pun saat fit; ia menyimpan data dan mencari k tetangga terdekat saat prediksi. Wajib scaling. Lambat untuk data besar, dan buruk di dimensi tinggi (curse of dimensionality: semua titik jadi "sama jauhnya").'],
        ['Multikelas', 'Regresi logistik menangani banyak kelas dengan softmax (multinomial). Strategi umum lain: one-vs-rest (satu model per kelas).'],
      ],
      examples: [
        {
          title: 'Memilih threshold berdasarkan biaya, dan memeriksa kalibrasi',
          code: py`
import numpy as np  # NumPy untuk hitungan
from sklearn.datasets import make_classification  # pembuat data klasifikasi
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.metrics import confusion_matrix  # tabel TP/FP/FN/TN
from sklearn.calibration import calibration_curve  # untuk mengecek kalibrasi peluang

# 4000 data, 85% kelas 0
X, y = make_classification(n_samples=4000, n_features=8, weights=[0.85], class_sep=0.8, random_state=0)
# 40% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, stratify=y, random_state=0)
model = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)  # latih model
p = model.predict_proba(X_te)[:, 1]  # peluang kelas positif untuk setiap data uji

# Biaya: kasus positif terlewat (FN) = 10, alarm palsu (FP) = 1
print("thr   FN   FP  biaya")  # judul tabel
for thr in [0.1, 0.2, 0.3, 0.5, 0.7]:  # coba beberapa threshold
    # hitung kesalahan pada threshold ini
    tn, fp, fn, tp = confusion_matrix(y_te, p >= thr).ravel()
    # biaya total: FN 10x lebih mahal daripada FP
    print(f"{thr:.1f}  {fn:4d} {fp:4d} {10 * fn + fp:5d}")

# exp(koefisien) = pengali odds
print("\nOdds ratio fitur pertama:", np.exp(model.coef_[0][0]).round(2))
# kelompokkan prediksi ke 5 rentang
frac_pos, mean_pred = calibration_curve(y_te, p, n_bins=5)
print("Kalibrasi (prediksi rata-rata -> proporsi positif nyata):")  # judul
for a, b in zip(mean_pred, frac_pos):  # bandingkan peluang tebakan vs kenyataan
    print(f"  {a:.2f} -> {b:.2f}")  # idealnya kedua angka hampir sama`,
        },
      ],
      mistakes: [
        ['Selalu memakai threshold 0,5.', 'Tentukan threshold dari biaya FN vs FP, pada data validasi.'],
        ['KNN tanpa scaling.', 'Fitur dengan rentang besar (gaji) mendominasi jarak. Selalu `StandardScaler` dulu.'],
        ['Memakai `predict_proba` model yang tidak terkalibrasi sebagai peluang sungguhan.', 'Cek kurva kalibrasi; kalibrasi ulang jika perlu.'],
      ],
      tips: [
        'Regresi logistik adalah baseline klasifikasi yang kuat: cepat, mudah dijelaskan, peluangnya relatif andal.',
        'Pilih k ganjil pada KNN biner untuk menghindari seri, dan cari k terbaik dengan cross-validation.',
      ],
      check: [
        ['Kenapa threshold rendah (0,2) cocok untuk skrining kanker?', 'Melewatkan pasien sakit (FN) jauh lebih mahal daripada pemeriksaan lanjutan untuk pasien sehat (FP), jadi kita rela menambah FP demi mengurangi FN.'],
        ['Kenapa KNN memburuk saat jumlah fitur sangat banyak?', 'Di dimensi tinggi, jarak antar titik menjadi hampir sama sehingga konsep "tetangga terdekat" kehilangan makna.'],
      ],
    },
    exercise: {
      task: 'Pada `load_breast_cancer`, cari nilai k terbaik untuk KNN (k = 1, 3, 5, ..., 21) dengan 5-fold cross-validation, menggunakan pipeline dengan StandardScaler.',
      hint: 'Loop atas k, `cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(k)), X, y, cv=5).mean()`.',
      solution: py`
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
from sklearn.neighbors import KNeighborsClassifier  # KNN
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.model_selection import cross_val_score  # cross-validation

X, y = load_breast_cancer(return_X_y=True)  # muat data
# skor CV untuk setiap k ganjil 1 sampai 21
hasil = {k: cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(k)), X, y, cv=5).mean()
         for k in range(1, 22, 2)}
for k, s in hasil.items():  # cetak skor setiap k
    print(f"k={k:2d}: {s:.4f}")
print("k terbaik:", max(hasil, key=hasil.get))  # k dengan skor tertinggi`,
    },
  },
  'ml-tree': {
    deep: {
      concepts: [
        ['Bagaimana tree memilih split', 'Di setiap node, tree mencoba semua fitur dan semua titik potong, lalu memilih yang paling menurunkan **impurity** (Gini atau entropi untuk klasifikasi, MSE untuk regresi). Prosesnya rakus (greedy): terbaik saat ini, bukan terbaik secara global.'],
        ['Bagging: kenapa random forest stabil', 'Satu tree sangat sensitif terhadap data (variance tinggi). Random forest melatih ratusan tree pada **sampel bootstrap** berbeda dan hanya melihat **sebagian fitur acak** di setiap split, lalu merata-ratakan hasilnya. Error acak antar tree saling meniadakan.'],
        ['Boosting: belajar dari kesalahan', 'Gradient boosting membangun tree kecil secara **berurutan**; setiap tree baru mempelajari sisa kesalahan (residual/gradien) dari gabungan tree sebelumnya. Hyperparameter kunci: `learning_rate` (kecil = lebih hati-hati), `n_estimators`, `max_depth`. Implementasi populer: XGBoost, LightGBM, CatBoost, dan `HistGradientBoosting` di scikit-learn.'],
        ['Feature importance yang menyesatkan', 'Importance bawaan (berbasis impurity) cenderung melebih-lebihkan fitur dengan banyak nilai unik (ID, angka kontinu). **Permutation importance** pada data validasi lebih andal: acak satu fitur, lihat seberapa turun skornya.'],
      ],
      examples: [
        {
          title: 'Bias–variance: tree tunggal vs forest vs boosting, dan permutation importance',
          code: py`
import numpy as np  # NumPy untuk data
from sklearn.datasets import make_classification  # pembuat data
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.tree import DecisionTreeClassifier  # satu pohon
# ensemble: hutan & boosting
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.inspection import permutation_importance  # importance yang lebih andal

# 6 fitur, hanya 3 yang berguna
X, y = make_classification(n_samples=2000, n_features=6, n_informative=3, n_redundant=0, random_state=0)
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# Dua kolom acak yang sama-sama TIDAK berguna: "id" (2000 nilai unik) dan biner (0/1)
X = np.column_stack([X, rng.integers(0, 2000, len(X)), rng.integers(0, 2, len(X))])
nama_fitur = [f"f{i}" for i in range(6)] + ["id_acak", "biner_acak"]  # nama setiap kolom
# 30% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

# empat model yang dibandingkan
for nama, m in [("Tree (tanpa batas)", DecisionTreeClassifier(random_state=0)),
                ("Tree (depth=5)", DecisionTreeClassifier(max_depth=5, random_state=0)),
                ("Random forest", RandomForestClassifier(300, random_state=0, n_jobs=1)),
                ("Gradient boosting", HistGradientBoostingClassifier(random_state=0))]:
    m.fit(X_tr, y_tr)  # latih
    # bandingkan skor latih vs uji (tanda overfitting)
    print(f"{nama:20s} latih={m.score(X_tr, y_tr):.3f} uji={m.score(X_te, y_te):.3f}")

# latih random forest
rf = RandomForestClassifier(300, random_state=0, n_jobs=1).fit(X_tr, y_tr)
# acak satu fitur di data uji, ukur seberapa turun skornya
perm = permutation_importance(rf, X_te, y_te, n_repeats=5, random_state=0)
print("\nfitur        impurity  permutation")
for i in np.argsort(-rf.feature_importances_):  # urutkan dari impurity importance tertinggi
    print(f"{nama_fitur[i]:11s}  {rf.feature_importances_[i]:.3f}     {perm.importances_mean[i]:.3f}")
print("-> f0-f2 dan id_acak sebenarnya noise (permutation ~0), tapi impurity-nya ~0.05 karena nilainya")
print("   kontinu/banyak; biner_acak yang sama-sama noise hanya 0.007. Impurity importance bias ke kolom bernilai banyak.")`,
        },
      ],
      mistakes: [
        ['Decision tree tanpa batas kedalaman.', 'Hampir pasti overfit (akurasi latih 100%). Batasi `max_depth`, `min_samples_leaf`.'],
        ['Menambah `n_estimators` boosting tanpa batas.', 'Boosting bisa overfit. Pakai early stopping (`early_stopping=True` di HistGradientBoosting).'],
        ['Memakai importance bawaan untuk menyimpulkan fitur "penting".', 'Pakai permutation importance atau SHAP pada data validasi.'],
      ],
      tips: [
        'Untuk data tabel, coba gradient boosting dulu: sering jadi pemenang kompetisi Kaggle untuk data tabel.',
        'Random forest jarang butuh tuning berat; cocok sebagai baseline kuat.',
        'Tree tidak butuh scaling fitur.',
      ],
      check: [
        ['Apa perbedaan mendasar bagging dan boosting?', 'Bagging melatih banyak model secara paralel dan independen lalu merata-ratakan (mengurangi variance); boosting melatih model berurutan, masing-masing memperbaiki kesalahan sebelumnya (mengurangi bias).'],
        ['Kenapa kolom "id" acak bisa tampak penting di impurity importance?', 'Karena punya banyak nilai unik sehingga bisa dipakai untuk membuat banyak split yang menghafal data latih; permutation importance di data uji menunjukkan kontribusinya sebenarnya ~0.'],
      ],
    },
    exercise: {
      task: 'Pada `load_breast_cancer`, latih `DecisionTreeClassifier` dengan `max_depth` 1 sampai 10 dan cetak akurasi latih serta uji. Di kedalaman berapa model mulai overfit?',
      hint: 'Loop `for d in range(1, 11)`; overfit terlihat saat akurasi latih terus naik tetapi akurasi uji berhenti naik atau turun.',
      solution: py`
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.tree import DecisionTreeClassifier  # decision tree

X, y = load_breast_cancer(return_X_y=True)  # muat data
# 30% uji, proporsi kelas dijaga
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=1, stratify=y)
for d in range(1, 11):  # coba kedalaman 1 sampai 10
    m = DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_tr, y_tr)  # latih pohon
    # skor latih terus naik; perhatikan kapan skor uji berhenti naik
    print(f"depth={d:2d} latih={m.score(X_tr, y_tr):.3f} uji={m.score(X_te, y_te):.3f}")`,
    },
  },
  'ml-svm': {
    deep: {
      concepts: [
        ['Margin maksimum', 'SVM mencari garis pemisah dengan **jarak terlebar** ke titik terdekat dari setiap kelas. Titik-titik terdekat itu disebut **support vector**; hanya mereka yang menentukan posisi garis.'],
        ['Soft margin dan parameter C', 'Data nyata jarang terpisah sempurna. Parameter `C` mengatur toleransi: C kecil = margin lebar dan lebih banyak pelanggaran (lebih halus, bisa underfit); C besar = berusaha mengklasifikasikan semua titik latih dengan benar (bisa overfit).'],
        ['Kernel trick', 'Kernel menghitung kemiripan seolah data dipetakan ke dimensi lebih tinggi, tanpa benar-benar memetakannya. **RBF** paling umum; `gamma` mengatur jangkauan pengaruh satu titik: gamma besar = batas sangat berliku (overfit), gamma kecil = batas halus.'],
        ['Kapan memakai SVM', 'Bagus untuk data berukuran kecil–menengah (hingga puluhan ribu baris) dengan banyak fitur, mis. klasifikasi teks TF-IDF (LinearSVC). Lambat untuk data sangat besar dan tidak memberi peluang secara langsung.'],
      ],
      examples: [
        {
          title: 'Grid C × gamma untuk SVM RBF',
          code: py`
import numpy as np  # NumPy
from sklearn.datasets import make_moons  # pembuat data bulan sabit
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.svm import SVC  # SVM
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.preprocessing import StandardScaler  # penyeragam skala

# 600 titik dengan noise cukup besar
X, y = make_moons(n_samples=600, noise=0.3, random_state=0)
# 40% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, random_state=0)

print("Akurasi uji (baris = C, kolom = gamma)")  # judul tabel
gammas = [0.1, 1, 10, 100]  # nilai gamma yang dicoba
print("C\\gamma " + "".join(f"{g:>8}" for g in gammas))  # baris judul kolom
for C in [0.1, 1, 10, 100]:  # nilai C yang dicoba
    baris = []  # skor satu baris
    for g in gammas:  # untuk setiap gamma
        m = make_pipeline(StandardScaler(), SVC(C=C, gamma=g)).fit(X_tr, y_tr)  # latih SVM
        baris.append(m.score(X_te, y_te))  # simpan skor uji
    print(f"{C:<8}" + "".join(f"{s:8.3f}" for s in baris))  # cetak satu baris tabel

# model dengan pengaturan sedang
m = make_pipeline(StandardScaler(), SVC(C=1, gamma=1)).fit(X_tr, y_tr)
# support vector: titik yang menentukan garis
print("\nJumlah support vector:", m[-1].n_support_.sum(), "dari", len(X_tr), "data latih")`,
        },
      ],
      mistakes: [
        ['SVM tanpa scaling fitur.', 'SVM berbasis jarak; selalu standarkan fitur.'],
        ['Mengatur C dan gamma terpisah satu per satu.', 'Keduanya saling memengaruhi; cari bersama dengan grid search pada skala log.'],
        ['Memakai `SVC(kernel="rbf")` untuk 1 juta baris.', 'Kompleksitasnya kuadratik. Pakai `LinearSVC`, `SGDClassifier`, atau model lain.'],
      ],
      tips: [
        'Untuk teks, `LinearSVC` + TF-IDF adalah baseline yang sangat kuat dan cepat.',
        'Butuh peluang? Pakai `SVC(probability=True)` (lebih lambat) atau kalibrasi terpisah.',
      ],
      check: [
        ['Apa efek gamma yang sangat besar pada kernel RBF?', 'Setiap titik hanya memengaruhi area sangat kecil di sekitarnya, sehingga batas keputusan berliku mengelilingi titik latih dan model overfit.'],
      ],
    },
    exercise: {
      task: 'Pada `load_digits`, bandingkan `LinearSVC` dan `SVC(kernel="rbf")` (keduanya dalam pipeline dengan StandardScaler) memakai 5-fold cross-validation.',
      hint: '`cross_val_score(make_pipeline(StandardScaler(), model), X, y, cv=5).mean()`. LinearSVC mungkin butuh `max_iter=5000`.',
      solution: py`
from sklearn.datasets import load_digits  # dataset gambar angka
from sklearn.svm import SVC, LinearSVC  # SVM linear & SVM kernel
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.model_selection import cross_val_score  # cross-validation

X, y = load_digits(return_X_y=True)  # muat data
# dua model yang dibandingkan
for nama, m in [("LinearSVC", LinearSVC(max_iter=5000)), ("SVC RBF", SVC())]:
    # skor rata-rata 5-fold
    s = cross_val_score(make_pipeline(StandardScaler(), m), X, y, cv=5).mean()
    print(f"{nama:10s}: {s:.4f}")  # cetak hasil`,
    },
  },
  'ml-clustering': {
    deep: {
      concepts: [
        ['K-Means: asumsi tersembunyi', 'K-Means meminimalkan jarak kuadrat ke pusat cluster, sehingga mengasumsikan cluster **bulat, ukurannya mirip, dan kepadatannya sama**. Untuk cluster memanjang, berbentuk aneh, atau ada noise, pakai DBSCAN, HDBSCAN, atau Gaussian Mixture.'],
        ['Memilih jumlah cluster', '**Elbow method**: plot inertia vs k, cari "siku". **Silhouette score** (−1 sampai 1): seberapa dekat titik ke cluster-nya dibanding cluster terdekat lain. Tetapi keputusan akhir juga harus **bermakna bagi bisnis**: 4 segmen yang bisa ditindaklanjuti lebih berguna daripada 9 segmen dengan silhouette sedikit lebih tinggi.'],
        ['PCA vs t-SNE/UMAP', '**PCA** linear, cepat, menjaga struktur global dan bisa dipakai untuk mengurangi fitur sebelum modeling. **t-SNE/UMAP** non-linear, bagus untuk visualisasi cluster, tetapi jarak antar cluster di plotnya tidak bermakna dan tidak cocok sebagai fitur.'],
        ['Menafsirkan cluster', 'Clustering hanya memberi nomor kelompok. Maknanya didapat dengan melihat profil setiap cluster (rata-rata fitur, ukuran) dan memberi nama, mis. "pelanggan setia bernilai tinggi".'],
      ],
      examples: [
        {
          title: 'Elbow + silhouette, dan kapan K-Means gagal',
          code: py`
import numpy as np  # NumPy
from sklearn.datasets import make_blobs, make_moons  # pembuat data
from sklearn.cluster import KMeans, DBSCAN  # dua algoritma clustering
from sklearn.metrics import silhouette_score, adjusted_rand_score  # skor kualitas cluster
from sklearn.preprocessing import StandardScaler  # penyeragam skala

# 600 titik dalam 4 kelompok
X, _ = make_blobs(n_samples=600, centers=4, cluster_std=1.0, random_state=3)
print(" k   inertia  silhouette")  # judul tabel
for k in range(2, 8):  # coba k = 2 sampai 7
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)  # jalankan K-Means
    # inertia (makin kecil makin rapat) & silhouette (makin tinggi makin baik)
    print(f"{k:2d} {km.inertia_:9.0f}   {silhouette_score(X, km.labels_):.3f}")

# Data bulan sabit: K-Means gagal, DBSCAN berhasil
# data bulan sabit dengan label aslinya
Xm, ym = make_moons(n_samples=500, noise=0.06, random_state=0)
Xm = StandardScaler().fit_transform(Xm)  # standarkan
km = KMeans(2, n_init=10, random_state=0).fit(Xm)  # K-Means 2 kelompok
db = DBSCAN(eps=0.3, min_samples=5).fit(Xm)  # DBSCAN dengan radius 0.3
print("\nBulan sabit -> kecocokan dengan label asli (ARI, 1 = sempurna)")  # judul
# ARI: kecocokan hasil dengan label asli
print(f"  K-Means: {adjusted_rand_score(ym, km.labels_):.3f}")
# label -1 = noise
print(f"  DBSCAN : {adjusted_rand_score(ym, db.labels_):.3f} | noise: {(db.labels_ == -1).sum()} titik")`,
        },
      ],
      mistakes: [
        ['Clustering tanpa scaling fitur.', 'Fitur dengan satuan besar mendominasi jarak. Standarkan dulu.'],
        ['Menganggap cluster hasil K-Means pasti "nyata".', 'K-Means selalu menghasilkan k cluster, bahkan pada data acak. Validasi dengan silhouette dan makna bisnis.'],
        ['Menjalankan K-Means sekali saja.', 'Hasilnya bergantung inisialisasi; pakai `n_init=10` atau lebih.'],
      ],
      tips: [
        'Untuk data campuran angka dan kategori, coba K-Prototypes atau ubah kategori dengan one-hot terlebih dulu.',
        'Pakai PCA ke 2 dimensi untuk memvisualisasikan hasil clustering.',
      ],
      check: [
        ['Kenapa K-Means gagal pada data bulan sabit?', 'K-Means membagi ruang berdasarkan jarak ke pusat (batas lurus), sehingga tidak bisa mengikuti bentuk melengkung. DBSCAN mengikuti kepadatan titik.'],
      ],
    },
    exercise: {
      task: 'Pada dataset iris (tanpa label), jalankan K-Means untuk k = 2..6 dan cetak silhouette score. Apakah k terbaik menurut silhouette sama dengan jumlah spesies sebenarnya (3)?',
      hint: 'Standarkan fitur, loop k, `silhouette_score(X, KMeans(k, n_init=10).fit_predict(X))`.',
      solution: py`
from sklearn.datasets import load_iris  # dataset iris
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.cluster import KMeans  # K-Means
from sklearn.metrics import silhouette_score  # skor silhouette

# standarkan fitur (label tidak dipakai)
X = StandardScaler().fit_transform(load_iris().data)
for k in range(2, 7):  # coba k = 2 sampai 6
    lab = KMeans(k, n_init=10, random_state=0).fit_predict(X)  # kelompokkan
    print(f"k={k}: silhouette={silhouette_score(X, lab):.3f}")  # skor silhouette tiap k
print("Silhouette memilih k=2: dua spesies (versicolor & virginica) sangat mirip sehingga tampak menyatu.")`,
    },
  },
  'ml-evaluasi': {
    deep: {
      concepts: [
        ['Precision, recall, dan trade-off-nya', '**Precision**: dari yang ditebak positif, berapa yang benar. **Recall**: dari yang benar-benar positif, berapa yang tertangkap. Menurunkan threshold menaikkan recall tetapi menurunkan precision. **F1** adalah rata-rata harmonik keduanya.'],
        ['ROC-AUC vs PR-AUC', '**ROC-AUC** mengukur kemampuan mengurutkan (peluang positif acak diberi skor lebih tinggi dari negatif acak). Pada data sangat tidak seimbang, ROC-AUC bisa tampak tinggi padahal precision buruk; **PR-AUC (average precision)** lebih jujur untuk kasus seperti penipuan.'],
        ['Rata-rata macro vs weighted', 'Untuk banyak kelas, **macro** merata-ratakan metrik setiap kelas setara (kelas kecil sama penting), **weighted** memberi bobot sesuai jumlah data. Jika kelas langka penting, lihat macro.'],
        ['Metrik bisnis', 'Pada akhirnya terjemahkan metrik ke dampak: "model menangkap 80% penipuan dengan 1 alarm palsu per 20 transaksi yang ditandai" lebih bermakna bagi manajer daripada "F1 = 0,72".'],
      ],
      examples: [
        {
          title: 'ROC-AUC vs PR-AUC pada data sangat tidak seimbang',
          code: py`
import numpy as np  # NumPy
from sklearn.datasets import make_classification  # pembuat data klasifikasi
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.linear_model import LogisticRegression  # regresi logistik
# metrik untuk data tidak seimbang
from sklearn.metrics import roc_auc_score, average_precision_score, precision_recall_curve, classification_report

def siapkan(proporsi):  # buat data dengan proporsi kelas positif tertentu
    # 40.000 data, positif sebanyak 'proporsi'
    X, y = make_classification(n_samples=40000, n_features=10, weights=[1 - proporsi], class_sep=1.0, random_state=0)
    # separuh untuk uji, proporsi kelas dijaga
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.5, stratify=y, random_state=0)
    # latih lalu ambil peluang kelas positif
    return y_te, LogisticRegression(max_iter=1000).fit(X_tr, y_tr).predict_proba(X_te)[:, 1]

for proporsi in [0.5, 0.05, 0.005]:  # makin langka kelas positif...
    y_te, p = siapkan(proporsi)  # siapkan data & tebakan
    # ...ROC-AUC tetap tinggi, PR-AUC turun drastis
    print(f"positif {proporsi:6.1%}: ROC-AUC={roc_auc_score(y_te, p):.3f}  PR-AUC={average_precision_score(y_te, p):.3f}")

# Data 5% positif: cari threshold dengan recall minimal 70% dan precision setinggi mungkin
y_te, p = siapkan(0.05)  # data dengan 5% positif
prec, rec, thr = precision_recall_curve(y_te, p)  # precision & recall di setiap threshold
ok = rec[:-1] >= 0.7  # threshold yang recall-nya >= 70%
i = np.argmax(np.where(ok, prec[:-1], -1))  # di antaranya, pilih precision tertinggi
# threshold terpilih
print(f"\nThreshold {thr[i]:.3f}: precision {prec[i]:.2f}, recall {rec[i]:.2f}")
print(classification_report(y_te, p >= thr[i], digits=3))  # laporan lengkap per kelas`,
        },
      ],
      mistakes: [
        ['Melaporkan akurasi untuk data dengan 1% kelas positif.', 'Pakai precision, recall, F1, PR-AUC, dan tampilkan confusion matrix.'],
        ['Mengoptimalkan metrik yang tidak sesuai dengan tujuan bisnis.', 'Tentukan dulu kesalahan mana yang lebih mahal, lalu pilih metrik dan threshold yang sesuai.'],
        ['Memilih threshold di data uji.', 'Pilih threshold di data validasi, lalu laporkan hasilnya di data uji.'],
      ],
      tips: [
        'Selalu cetak `classification_report` dan confusion matrix, bukan satu angka saja.',
        'Untuk regresi, laporkan MAE dalam satuan asli agar mudah dipahami ("rata-rata meleset Rp12 juta").',
      ],
      check: [
        ['Model penipuan: precision 0,9, recall 0,3. Apa artinya?', 'Hampir semua yang ditandai memang penipuan, tetapi model hanya menangkap 30% dari seluruh penipuan; 70% lolos.'],
        ['Kenapa PR-AUC turun drastis saat kelas positif makin langka, padahal ROC-AUC hampir sama?', 'ROC memakai false positive rate yang "terlihat kecil" karena negatifnya sangat banyak; PR-AUC memakai precision yang langsung terpengaruh banyaknya alarm palsu.'],
      ],
    },
    exercise: {
      task: 'Diberi `y_asli = [1,0,1,1,0,0,1,0,0,0]` dan `y_pred = [1,0,0,1,0,1,1,0,0,0]`, hitung manual TP, FP, FN, TN, precision, dan recall, lalu cocokkan dengan scikit-learn.',
      hint: 'TP = asli 1 & pred 1, FP = asli 0 & pred 1, dst. Precision = TP/(TP+FP), recall = TP/(TP+FN).',
      solution: py`
import numpy as np  # NumPy
from sklearn.metrics import precision_score, recall_score  # fungsi metrik bawaan

a = np.array([1, 0, 1, 1, 0, 0, 1, 0, 0, 0])  # label asli
p = np.array([1, 0, 0, 1, 0, 1, 1, 0, 0, 0])  # tebakan model
tp = ((a == 1) & (p == 1)).sum(); fp = ((a == 0) & (p == 1)).sum()  # hitung TP & FP
fn = ((a == 1) & (p == 0)).sum(); tn = ((a == 0) & (p == 0)).sum()  # hitung FN & TN
print(f"TP={tp} FP={fp} FN={fn} TN={tn}")  # tampilkan keempatnya
# precision = TP/(TP+FP), recall = TP/(TP+FN)
print(f"Manual : precision={tp/(tp+fp):.2f} recall={tp/(tp+fn):.2f}")
# hasil sklearn harus sama
print(f"sklearn: precision={precision_score(a, p):.2f} recall={recall_score(a, p):.2f}")`,
    },
  },
  'ml-overfit': {
    deep: {
      concepts: [
        ['Bias–variance trade-off', '**Bias** tinggi: model terlalu sederhana, salah secara sistematis (underfit). **Variance** tinggi: model terlalu sensitif terhadap data latih tertentu (overfit). Menambah kompleksitas menurunkan bias tetapi menaikkan variance; titik terbaik ada di tengah.'],
        ['Learning curve', 'Plot skor latih dan validasi terhadap **jumlah data latih**. Jika keduanya rendah dan berdekatan → underfit (butuh model lebih kompleks/fitur lebih baik). Jika jaraknya besar → overfit (butuh lebih banyak data atau regularisasi).'],
        ['Data leakage: overfitting yang tersembunyi', 'Leakage terjadi ketika informasi yang tidak tersedia saat prediksi ikut masuk ke training: scaling sebelum split, fitur dari masa depan, baris duplikat di latih dan uji, atau data dari orang yang sama di kedua split. Gejalanya: skor validasi terlalu bagus, lalu anjlok di produksi.'],
        ['Variasi cross-validation', '`KFold` (umum), `StratifiedKFold` (klasifikasi), `GroupKFold` (data dari satu pasien/pengguna tidak boleh terpisah ke latih dan uji), `TimeSeriesSplit` (selalu latih di masa lalu, uji di masa depan).'],
      ],
      examples: [
        {
          title: 'Learning curve dan kebocoran karena seleksi fitur sebelum split',
          code: py`
import numpy as np  # NumPy
# learning curve & cross-validation
from sklearn.model_selection import learning_curve, cross_val_score
from sklearn.tree import DecisionTreeClassifier  # decision tree
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
from sklearn.feature_selection import SelectKBest, f_classif  # seleksi fitur
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.pipeline import make_pipeline  # merangkai langkah

X, y = load_breast_cancer(return_X_y=True)  # muat data
# skor latih & validasi untuk berbagai ukuran data latih
ukuran, latih, val = learning_curve(DecisionTreeClassifier(max_depth=6, random_state=0), X, y,
                                    # 10% sampai 100% data latih
                                    train_sizes=[0.1, 0.3, 0.5, 0.7, 1.0], cv=5)
print("n_latih  latih   validasi")  # judul tabel
for n, a, b in zip(ukuran, latih.mean(1), val.mean(1)):  # rata-rata setiap ukuran
    print(f"{n:6d}  {a:.3f}   {b:.3f}")  # cetak satu baris

# Leakage: 1000 fitur ACAK murni, label acak -> akurasi jujur seharusnya ~50%
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# 100 data, 1000 fitur acak, label acak
Xr, yr = rng.normal(size=(100, 1000)), rng.integers(0, 2, 100)
X_bocor = SelectKBest(f_classif, k=20).fit_transform(Xr, yr)        # memilih fitur dengan melihat SEMUA label
# CV setelah seleksi yang bocor
salah = cross_val_score(LogisticRegression(max_iter=1000), X_bocor, yr, cv=5).mean()
# seleksi di dalam pipeline: diulang di setiap fold
benar = cross_val_score(make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000)), Xr, yr, cv=5).mean()
print(f"\nSeleksi fitur sebelum CV (bocor): {salah:.2f}  <- palsu!")  # skor palsu tinggi
print(f"Seleksi fitur di dalam pipeline : {benar:.2f}  <- jujur (~0.5)")  # skor jujur`,
        },
      ],
      mistakes: [
        ['Melakukan scaling, seleksi fitur, atau oversampling sebelum split/CV.', 'Masukkan semua langkah itu ke dalam `Pipeline` agar di-fit hanya pada fold latih.'],
        ['Data pasien yang sama muncul di latih dan uji (beberapa foto per pasien).', 'Pakai `GroupKFold` berdasarkan ID pasien.'],
        ['Mengacak data deret waktu untuk CV.', 'Pakai `TimeSeriesSplit`.'],
      ],
      tips: [
        'Jika skor terlalu bagus untuk jadi kenyataan, anggap ada leakage sampai terbukti sebaliknya.',
        'Cara mengatasi overfit: tambah data, sederhanakan model, regularisasi, augmentasi, early stopping, ensemble.',
      ],
      check: [
        ['Learning curve: skor latih 0,99, validasi 0,75, dan jaraknya mengecil saat data bertambah. Apa sarannya?', 'Model overfit tetapi membaik dengan data; kumpulkan lebih banyak data atau tambahkan regularisasi.'],
        ['Kenapa seleksi fitur pada seluruh data menghasilkan akurasi 80%+ untuk data acak?', 'Fitur dipilih karena kebetulan berkorelasi dengan label di seluruh data, termasuk fold uji. Informasi label uji bocor ke proses pemilihan fitur.'],
      ],
    },
    exercise: {
      task: 'Tunjukkan perbedaan skor CV antara `KFold` biasa dan `GroupKFold` pada data yang punya 20 "pasien" dengan 10 sampel masing-masing, di mana fitur sangat mirip dalam satu pasien.',
      hint: 'Buat fitur = ciri pasien + noise kecil, label acak per pasien. Bandingkan `cross_val_score(..., cv=KFold(5, shuffle=True))` dan `cv=GroupKFold(5), groups=...`.',
      solution: py`
import numpy as np  # NumPy
# dua cara membagi fold
from sklearn.model_selection import cross_val_score, KFold, GroupKFold
from sklearn.neighbors import KNeighborsClassifier  # KNN

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
pasien = np.repeat(np.arange(20), 10)  # 20 pasien, masing-masing 10 pengukuran
ciri = rng.normal(size=(20, 5))  # ciri khas setiap pasien
# pengukuran = ciri pasien + noise kecil
X = ciri[pasien] + rng.normal(scale=0.05, size=(200, 5))
y = rng.integers(0, 2, 20)[pasien]           # label acak per pasien (tidak bisa diprediksi dari ciri)

m = KNeighborsClassifier(1)  # KNN dengan 1 tetangga
# fold acak: pasien sama ada di latih & uji (bocor)
print("KFold acak :", cross_val_score(m, X, y, cv=KFold(5, shuffle=True, random_state=0)).mean().round(3))
# fold per pasien: skor jujur (~0.5)
print("GroupKFold :", cross_val_score(m, X, y, cv=GroupKFold(5), groups=pasien).mean().round(3))`,
    },
  },
  'ml-fitur': {
    deep: {
      concepts: [
        ['Fitur lebih penting daripada algoritma', 'Untuk data tabel, peningkatan terbesar biasanya datang dari fitur yang lebih baik, bukan algoritma yang lebih canggih. Fitur yang baik mengubah pengetahuan domain menjadi angka: rasio (utang/pendapatan), selisih waktu (hari sejak transaksi terakhir), agregasi (rata-rata belanja 30 hari).'],
        ['Encoding kategori', '**One-hot** untuk kategori sedikit. **Ordinal** jika ada urutan (S < M < L). **Target encoding** (rata-rata target per kategori) untuk kategori sangat banyak, tetapi rawan leakage sehingga harus dihitung di dalam CV. Kategori langka bisa digabung menjadi "lainnya".'],
        ['Fitur waktu', 'Pecah tanggal menjadi jam, hari dalam minggu, akhir pekan, bulan, hari libur. Untuk fitur siklik (jam 23 dekat dengan jam 0), gunakan `sin` dan `cos`.'],
        ['ColumnTransformer + Pipeline', 'Menggabungkan preprocessing berbeda per kolom dan model dalam satu objek. Keuntungan: tidak ada leakage di CV, bisa di-tuning bersama, dan disimpan sebagai satu file untuk produksi.'],
      ],
      examples: [
        {
          title: 'Fitur rasio, waktu siklik, dan pipeline lengkap',
          code: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas
from sklearn.compose import ColumnTransformer  # memproses kolom berbeda dengan cara berbeda
from sklearn.pipeline import Pipeline  # merangkai langkah
# encoder, penyeragam skala, pembungkus fungsi
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer
from sklearn.impute import SimpleImputer  # pengisi nilai kosong
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.model_selection import cross_val_score  # cross-validation

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 3000  # 3000 pengajuan kredit
df = pd.DataFrame({  # tabel data mentah
    "pendapatan": rng.lognormal(2.2, 0.5, n),  # pendapatan
    "cicilan": rng.lognormal(1.0, 0.6, n),  # cicilan
    "jam_pengajuan": rng.integers(0, 24, n),  # jam pengajuan
    "kota": rng.choice(["Jakarta", "Bandung", "Medan", "Solo", "Ambon"], n),  # kota
})
df.loc[rng.random(n) < 0.05, "pendapatan"] = np.nan  # 5% pendapatan dikosongkan
# rasio cicilan terhadap pendapatan
rasio = df.cicilan / df.pendapatan.fillna(df.pendapatan.median())
malam = (df.jam_pengajuan < 5) | (df.jam_pengajuan > 22)  # pengajuan larut malam
# peluang gagal bayar dari rasio & jam malam
y = (rng.random(n) < 1 / (1 + np.exp(-(-5 + 12 * rasio + 3 * malam)))).astype(int)

def tambah_fitur(d):  # fungsi rekayasa fitur
    d = d.copy()  # salin agar data asli aman
    d["rasio_cicilan"] = d.cicilan / d.pendapatan  # fitur rasio
    # jam diubah ke lingkaran: jam 23 dekat dengan jam 0
    d["jam_sin"] = np.sin(2 * np.pi * d.jam_pengajuan / 24)
    d["jam_cos"] = np.cos(2 * np.pi * d.jam_pengajuan / 24)  # pasangan cos-nya
    return d  # kembalikan data baru

# kolom angka setelah rekayasa
angka = ["pendapatan", "cicilan", "rasio_cicilan", "jam_sin", "jam_cos"]
prep = ColumnTransformer([  # pemrosesan per jenis kolom
    # angka: isi kosong lalu standarkan
    ("angka", Pipeline([("isi", SimpleImputer(strategy="median")), ("skala", StandardScaler())]), angka),
    ("kategori", OneHotEncoder(handle_unknown="ignore"), ["kota"]),  # kategori: one-hot
])
# model dasar: hanya fitur mentah
dasar = Pipeline([("prep", ColumnTransformer([("a", Pipeline([("i", SimpleImputer()), ("s", StandardScaler())]),
                   # kolom mentah
                   ["pendapatan", "cicilan", "jam_pengajuan"])])), ("m", LogisticRegression(max_iter=1000))])
# model lengkap: fitur baru + pemrosesan + model
lengkap = Pipeline([("fitur", FunctionTransformer(tambah_fitur)), ("prep", prep), ("m", LogisticRegression(max_iter=1000))])

a = cross_val_score(dasar, df, y, cv=5, scoring="roc_auc").mean()  # skor model dasar
b = cross_val_score(lengkap, df, y, cv=5, scoring="roc_auc").mean()  # skor model lengkap
print(f"ROC-AUC fitur mentah     : {a:.3f}")  # tampilkan
print(f"ROC-AUC + fitur rekayasa : {b:.3f}")  # bandingkan
# besar perbaikannya
print(f"Kesalahan pengurutan (1 - AUC) turun {((1 - a) - (1 - b)) / (1 - a):.0%} hanya dengan 3 kolom baru.")`,
        },
      ],
      mistakes: [
        ['Membuat fitur memakai informasi masa depan (mis. "total belanja bulan ini" untuk memprediksi churn di awal bulan).', 'Pastikan setiap fitur hanya memakai data yang tersedia pada saat prediksi dibuat.'],
        ['One-hot untuk kolom dengan 10.000 kategori (kode pos).', 'Gabungkan kategori langka, pakai target encoding di dalam CV, atau embedding.'],
        ['Preprocessing ditulis terpisah untuk training dan produksi.', 'Simpan satu Pipeline yang sama agar tidak terjadi training–serving skew.'],
      ],
      tips: [
        'Tanya ahli domain: fitur apa yang mereka lihat saat mengambil keputusan secara manual?',
        'Pakai `OneHotEncoder(handle_unknown="ignore")` agar kategori baru di produksi tidak membuat error.',
      ],
      check: [
        ['Kenapa jam diubah menjadi sin dan cos?', 'Agar model tahu jam 23 dan jam 0 berdekatan; sebagai angka biasa, keduanya terlihat berjauhan (23 vs 0).'],
      ],
    },
    exercise: {
      task: 'Dari kolom tanggal `pd.date_range("2025-01-01", periods=10, freq="36h")`, buat fitur: hari dalam minggu, akhir pekan (0/1), jam, dan `jam_sin`/`jam_cos`.',
      hint: 'Pakai accessor `.dt.dayofweek`, `.dt.hour`; akhir pekan = dayofweek >= 5.',
      solution: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas

# 10 waktu dengan jarak 36 jam
df = pd.DataFrame({"waktu": pd.date_range("2025-01-01", periods=10, freq="36h")})
df["hari"] = df.waktu.dt.dayofweek  # hari dalam minggu (0 = Senin)
df["akhir_pekan"] = (df.hari >= 5).astype(int)  # 1 jika Sabtu/Minggu
df["jam"] = df.waktu.dt.hour  # jam
df["jam_sin"] = np.sin(2 * np.pi * df.jam / 24).round(3)  # jam dalam bentuk lingkaran: sin
df["jam_cos"] = np.cos(2 * np.pi * df.jam / 24).round(3)  # dan cos
print(df)  # lihat hasilnya`,
    },
  },

  // ---------------- Deep Learning ----------------
  'dl-nn': {
    deep: {
      concepts: [
        ['Neuron = regresi logistik kecil', 'Satu neuron menghitung `aktivasi(w·x + b)`. Satu layer adalah banyak neuron yang membaca input yang sama, dihitung sekaligus sebagai `aktivasi(X @ W + b)`. Jaringan adalah tumpukan layer.'],
        ['Kenapa butuh non-linearitas', 'Tanpa fungsi aktivasi, tumpukan layer linear tetap setara dengan **satu** layer linear (perkalian matriks bisa digabung). Aktivasi non-linear (ReLU, dll.) yang membuat jaringan bisa mempelajari pola melengkung.'],
        ['Universal approximation', 'Jaringan dengan satu hidden layer yang cukup lebar secara teori bisa mendekati fungsi kontinu apa pun. Dalam praktik, jaringan **lebih dalam** biasanya lebih efisien: setiap layer membangun fitur yang makin abstrak (tepi → bentuk → objek).'],
        ['Menghitung jumlah parameter', 'Layer dari n input ke m neuron punya `n×m` bobot + `m` bias. Jaringan 784→128→10 punya 784·128+128 + 128·10+10 = **101.770** parameter. Ini membantu memperkirakan memori dan risiko overfitting.'],
      ],
      examples: [
        {
          title: 'Tanpa aktivasi, jaringan dalam = satu layer linear',
          code: py`
import numpy as np  # NumPy

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
X = rng.normal(size=(5, 3))  # 5 data, 3 fitur
# bobot 3 layer
W1, W2, W3 = rng.normal(size=(3, 8)), rng.normal(size=(8, 8)), rng.normal(size=(8, 2))

tiga_layer_linear = X @ W1 @ W2 @ W3  # 3 layer tanpa aktivasi
satu_layer = X @ (W1 @ W2 @ W3)          # matriks gabungan 3x2
# True: tanpa aktivasi, 3 layer = 1 layer
print("3 layer linear == 1 layer?", np.allclose(tiga_layer_linear, satu_layer))

relu = lambda z: np.maximum(0, z)  # fungsi aktivasi ReLU
dengan_relu = relu(relu(X @ W1) @ W2) @ W3  # 3 layer dengan ReLU di antaranya
# False: ReLU membuat jaringan lebih kuat
print("Dengan ReLU masih sama?   ", np.allclose(dengan_relu, satu_layer))

def jumlah_param(ukuran):  # hitung jumlah parameter
    # bobot (a x b) + bias (b) per layer
    return sum(a * b + b for a, b in zip(ukuran[:-1], ukuran[1:]))
for arsitektur in [[784, 10], [784, 128, 10], [784, 512, 256, 10]]:  # tiga arsitektur
    # makin besar layer, parameter melonjak
    print(f"{arsitektur}: {jumlah_param(arsitektur):,} parameter")`,
        },
      ],
      mistakes: [
        ['Menambah layer terus-menerus untuk memperbaiki model yang underfit tanpa memeriksa data.', 'Cek dulu kualitas data, label, dan learning rate. Arsitektur jarang menjadi masalah pertama.'],
        ['Menggunakan neural network untuk data tabel kecil.', 'Gradient boosting biasanya lebih baik dan jauh lebih mudah untuk data tabel.'],
      ],
      tips: [
        'Mulai dari jaringan kecil yang bisa overfit pada sebagian kecil data, lalu besarkan secara bertahap.',
        'Lebar hidden layer umum: pangkat dua (64, 128, 256) — bukan aturan, hanya kebiasaan yang efisien untuk GPU.',
      ],
      check: [
        ['Berapa parameter layer Dense dari 100 input ke 50 neuron?', '100×50 bobot + 50 bias = 5.050.'],
        ['Kenapa ReLU membuat tumpukan layer lebih kuat daripada layer linear saja?', 'ReLU non-linear sehingga komposisi layer tidak lagi bisa diringkas menjadi satu perkalian matriks; jaringan bisa membentuk batas keputusan melengkung.'],
      ],
    },
    exercise: {
      task: 'Latih `MLPClassifier` scikit-learn dengan hidden layer (2,), (16,), dan (64, 32) pada `make_moons(noise=0.25)`. Bandingkan akurasi uji.',
      hint: '`MLPClassifier(hidden_layer_sizes=..., max_iter=2000, random_state=0)`, split 70/30.',
      solution: py`
from sklearn.datasets import make_moons  # data bulan sabit
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.neural_network import MLPClassifier  # neural network kecil

X, y = make_moons(n_samples=1000, noise=0.25, random_state=0)  # 1000 titik
# 30% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)
for h in [(2,), (16,), (64, 32)]:  # coba 3 ukuran hidden layer
    # latih
    m = MLPClassifier(hidden_layer_sizes=h, max_iter=2000, random_state=0).fit(X_tr, y_tr)
    print(f"{str(h):9s}: akurasi uji {m.score(X_te, y_te):.3f}")  # skor uji`,
    },
  },
  'dl-backprop': {
    deep: {
      concepts: [
        ['Computational graph', 'Setiap perhitungan (kali, tambah, aktivasi, loss) dicatat sebagai node dalam graf. **Forward pass** menghitung nilai dari input ke loss; **backward pass** menghitung gradien dari loss kembali ke setiap parameter dengan aturan rantai. PyTorch membangun graf ini otomatis (autograd).'],
        ['Vanishing & exploding gradient', 'Gradien di layer awal adalah hasil kali banyak turunan. Sigmoid punya turunan maksimal 0,25, sehingga setelah 10 layer gradien menyusut hingga ~0,25¹⁰ ≈ 0,000001 (vanishing): layer awal hampir tidak belajar. Sebaliknya, bobot besar bisa membuat gradien meledak. Solusi: ReLU, inisialisasi yang tepat (He/Xavier), batch norm, residual connection, gradient clipping.'],
        ['Inisialisasi bobot', 'Bobot nol membuat semua neuron identik dan belajar hal yang sama (simetri). Bobot terlalu besar membuat aktivasi jenuh. Inisialisasi He (`std = √(2/n_input)`) untuk ReLU menjaga skala sinyal tetap stabil antar layer.'],
        ['Gradient check', 'Bandingkan gradien hasil backprop dengan turunan numerik; selisih relatif < 1e-6 menandakan implementasi benar. Ini cara standar men-debug backprop yang ditulis manual.'],
      ],
      examples: [
        {
          title: 'Gradient check dan bukti vanishing gradient',
          code: py`
import numpy as np  # NumPy

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# 8 data, 3 fitur, label 0/1
X = rng.normal(size=(8, 3)); y = rng.integers(0, 2, (8, 1)).astype(float)
W1 = rng.normal(size=(3, 4)) * 0.5; W2 = rng.normal(size=(4, 1)) * 0.5  # bobot awal kecil
sig = lambda z: 1 / (1 + np.exp(-z))  # fungsi sigmoid

def loss_fn(W1, W2):  # loss jaringan 2 layer
    p = sig(np.tanh(X @ W1) @ W2)  # forward: tanh lalu sigmoid
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))  # binary cross-entropy

# Backprop manual
h = np.tanh(X @ W1); p = sig(h @ W2)  # forward
dz2 = (p - y) / len(X)  # gradien di output
dW2 = h.T @ dz2  # gradien bobot layer 2
dW1 = X.T @ ((dz2 @ W2.T) * (1 - h ** 2))  # aturan rantai mundur ke layer 1

# Gradien numerik untuk W1
num = np.zeros_like(W1); eps = 1e-6  # wadah gradien numerik & geseran kecil
for idx in np.ndindex(W1.shape):  # untuk setiap bobot
    Wp, Wm = W1.copy(), W1.copy(); Wp[idx] += eps; Wm[idx] -= eps  # geser naik & turun
    num[idx] = (loss_fn(Wp, W2) - loss_fn(Wm, W2)) / (2 * eps)  # kemiringan loss
# angka sangat kecil = backprop benar
print("Selisih relatif backprop vs numerik:", np.linalg.norm(dW1 - num) / np.linalg.norm(dW1 + num))

# Vanishing gradient: besarnya gradien di layer pertama untuk 10 layer
# sigmoid dengan init biasa
for nama, f, df, skala in [("sigmoid", sig, lambda a: a * (1 - a), 1.0),
                           # ReLU dengan init He
                           ("ReLU + He", lambda z: np.maximum(0, z), lambda a: (a > 0).astype(float), None)]:
    a = rng.normal(size=(64, 50)); Ws, acts = [], []  # input acak
    for _ in range(10):  # 10 layer
        # bobot layer
        W = rng.normal(size=(50, 50)) * (np.sqrt(2 / 50) if skala is None else skala / np.sqrt(50))
        a = f(a @ W); Ws.append(W); acts.append(a)  # forward & simpan aktivasi
    g = np.ones_like(a)  # gradien awal
    for W, a in zip(reversed(Ws), reversed(acts)):  # mundur dari layer terakhir
        g = (g * df(a)) @ W.T  # kalikan turunan aktivasi lalu bobot
    # sigmoid: gradien hampir hilang
    print(f"{nama:10s}: rata-rata |gradien| di layer 1 = {np.abs(g).mean():.2e}")`,
        },
      ],
      mistakes: [
        ['Inisialisasi semua bobot dengan nol.', 'Pakai inisialisasi acak yang terskala (He untuk ReLU, Xavier untuk tanh); PyTorch sudah melakukannya secara default.'],
        ['Lupa `optimizer.zero_grad()` di PyTorch.', 'Gradien akan terakumulasi dari batch sebelumnya dan update menjadi salah.'],
        ['Loss tiba-tiba NaN.', 'Gradien meledak atau log(0). Turunkan learning rate, pakai gradient clipping, dan fungsi loss bawaan yang stabil secara numerik.'],
      ],
      tips: [
        'Pantau norma gradien per layer selama training (mis. dengan TensorBoard) untuk mendeteksi vanishing/exploding.',
        'Residual connection (`x + f(x)`) memberi "jalan tol" bagi gradien, alasan ResNet dan Transformer bisa sangat dalam.',
      ],
      check: [
        ['Kenapa sigmoid di banyak layer menyebabkan vanishing gradient?', 'Turunannya maksimal 0,25; mengalikan banyak angka kecil membuat gradien di layer awal mendekati nol.'],
        ['Kenapa bobot awal tidak boleh semuanya nol?', 'Semua neuron dalam satu layer akan menerima gradien yang sama dan tetap identik selamanya (simetri tidak pernah pecah).'],
      ],
    },
    exercise: {
      task: 'Implementasikan forward dan backward untuk satu neuron `y = sigmoid(w*x + b)` dengan loss MSE, lalu lakukan 100 langkah gradient descent agar output untuk x=2 mendekati 0,8.',
      hint: 'dL/dy = 2(y − t), dy/dz = y(1 − y), dz/dw = x, dz/db = 1. Kalikan berantai.',
      solution: py`
import numpy as np  # NumPy

x, target = 2.0, 0.8  # input & target
w, b, lr = 0.1, 0.0, 1.0  # bobot, bias, learning rate
sig = lambda z: 1 / (1 + np.exp(-z))  # sigmoid
for langkah in range(100):  # 100 langkah
    z = w * x + b; y = sig(z)  # forward
    dL_dy = 2 * (y - target); dy_dz = y * (1 - y)  # turunan loss & sigmoid
    w -= lr * dL_dy * dy_dz * x  # perbarui w (aturan rantai)
    b -= lr * dL_dy * dy_dz  # perbarui b
    if langkah % 25 == 0:  # cetak setiap 25 langkah
        print(f"langkah {langkah:3d}: output={y:.4f}")  # output makin mendekati target
print(f"akhir: output={sig(w * x + b):.4f}, w={w:.3f}, b={b:.3f}")  # hasil akhir`,
    },
  },
  'dl-aktivasi': {
    deep: {
      concepts: [
        ['Pasangan output–loss yang benar', 'Regresi: output linear + **MSE/MAE/Huber**. Klasifikasi biner: 1 output + sigmoid + **binary cross-entropy** (`BCEWithLogitsLoss`). Multikelas: k output + softmax + **cross-entropy** (`CrossEntropyLoss`). Multilabel (satu data bisa punya banyak label): k sigmoid + BCE.'],
        ['Logits dan stabilitas numerik', 'Fungsi loss PyTorch seperti `CrossEntropyLoss` menerima **logits** (skor mentah sebelum softmax) dan menghitung softmax + log secara stabil (trik log-sum-exp). Menerapkan softmax sendiri lalu log bisa menghasilkan log(0) = −∞.'],
        ['Varian aktivasi', '**ReLU** default yang cepat, tetapi neuron bisa "mati" (selalu 0). **Leaky ReLU** memberi kemiringan kecil di sisi negatif. **GELU/SiLU** halus, dipakai di Transformer modern. **tanh** di RNN. Sigmoid jarang dipakai di hidden layer.'],
        ['Optimizer & learning rate schedule', '**SGD + momentum**: sering memberi generalisasi terbaik di vision jika di-tuning. **Adam/AdamW**: default yang aman, AdamW memisahkan weight decay dengan benar. Schedule seperti **warmup + cosine decay** sangat umum di Transformer.'],
      ],
      examples: [
        {
          title: 'Softmax yang stabil, dan pengaruh pilihan loss terhadap outlier',
          code: py`
import numpy as np  # NumPy

def softmax_naif(z):  # softmax langsung
    e = np.exp(z); return e / e.sum()  # exp(1000) = tak hingga

def softmax_stabil(z):  # softmax versi aman
    e = np.exp(z - z.max()); return e / e.sum()     # trik: kurangi nilai maksimum

logits = np.array([1000.0, 999.0, 990.0])  # logit sangat besar
with np.errstate(over="ignore", invalid="ignore"):  # sembunyikan peringatan overflow
    print("Naif  :", softmax_naif(logits))  # hasilnya NaN
print("Stabil:", softmax_stabil(logits).round(5))  # hasil benar

def cross_entropy_dari_logits(z, kelas):  # cross-entropy langsung dari logit
    log_sum_exp = z.max() + np.log(np.exp(z - z.max()).sum())  # log-sum-exp yang stabil
    return log_sum_exp - z[kelas]  # loss kelas yang benar
print("CE (kelas 0):", round(cross_entropy_dari_logits(logits, 0), 4))  # hitung loss

# MSE vs MAE vs Huber: konstanta terbaik untuk data dengan outlier
data = np.array([10, 11, 9, 10, 12, 10, 100.0])  # data dengan outlier 100
c = np.linspace(0, 40, 4001)  # kandidat konstanta
mse = ((data[:, None] - c) ** 2).mean(0)  # MSE untuk setiap kandidat
mae = np.abs(data[:, None] - c).mean(0)  # MAE untuk setiap kandidat
# Huber: kuadrat jika dekat, linear jika jauh
d = np.abs(data[:, None] - c); huber = np.where(d < 2, 0.5 * d ** 2, 2 * (d - 1)).mean(0)
# MSE tertarik outlier, MAE & Huber tidak
print(f"Prediksi terbaik -> MSE: {c[mse.argmin()]:.2f} | MAE: {c[mae.argmin()]:.2f} | Huber: {c[huber.argmin()]:.2f}")`,
        },
      ],
      mistakes: [
        ['Menambahkan `softmax` di akhir model lalu memakai `nn.CrossEntropyLoss`.', '`CrossEntropyLoss` sudah melakukan softmax; keluarkan logits mentah dari model.'],
        ['Memakai MSE untuk klasifikasi.', 'Gradiennya lemah saat prediksi sangat salah; cross-entropy belajar jauh lebih cepat.'],
        ['Memakai softmax untuk masalah multilabel.', 'Softmax memaksa total peluang = 1. Untuk multilabel pakai sigmoid per label + BCE.'],
      ],
      tips: [
        'Default yang aman untuk memulai: ReLU/GELU di hidden layer, AdamW dengan lr 1e-3 (model kecil) atau 1e-4–3e-5 (fine-tuning model besar).',
        'Huber loss cocok untuk regresi dengan sedikit outlier.',
      ],
      check: [
        ['Kenapa MSE menghasilkan prediksi ~23 sedangkan MAE ~10 pada data di atas?', 'MSE menghukum kuadrat error sehingga sangat terpengaruh outlier 100 (meminimalkan MSE = mean); MAE diminimalkan oleh median yang tahan outlier.'],
        ['Apa itu logits?', 'Skor mentah output model sebelum diubah menjadi peluang oleh sigmoid/softmax.'],
      ],
    },
    exercise: {
      task: 'Hitung cross-entropy untuk prediksi peluang `[0.7, 0.2, 0.1]` jika kelas benar adalah 0, lalu jika kelas benar adalah 2. Mana yang lossnya lebih besar dan kenapa?',
      hint: 'Cross-entropy = −log(peluang kelas yang benar).',
      solution: py`
import numpy as np  # NumPy

p = np.array([0.7, 0.2, 0.1])  # peluang tebakan model
# loss kecil: jawaban benar diberi peluang besar
print("Kelas benar 0:", round(-np.log(p[0]), 3))
# loss besar: jawaban benar diberi peluang kecil
print("Kelas benar 2:", round(-np.log(p[2]), 3))
# kesimpulan
print("Loss lebih besar saat model memberi peluang kecil pada jawaban yang benar.")`,
    },
  },
  'dl-pytorch': {
    deep: {
      concepts: [
        ['Tensor, device, dan dtype', 'Tensor PyTorch mirip array NumPy tetapi bisa berada di GPU (`.to("cuda")`) dan melacak gradien (`requires_grad=True`). Model dan data **harus** berada di device yang sama, dan tipe umumnya `float32`.'],
        ['Anatomi training loop', 'Setiap batch: `model.train()` → forward → hitung loss → `optimizer.zero_grad()` → `loss.backward()` → `optimizer.step()`. Untuk evaluasi: `model.eval()` dan `with torch.no_grad():` agar dropout/batch norm berperilaku mode inferensi dan memori hemat.'],
        ['Dataset & DataLoader', '`Dataset` mendefinisikan `__len__` dan `__getitem__` (satu sampel). `DataLoader` mengurus batching, shuffle, dan memuat paralel (`num_workers`). Ini memisahkan "cara membaca data" dari "cara melatih".'],
        ['Menyimpan model', 'Simpan `model.state_dict()` (bobot saja), bukan objek model penuh. Untuk melanjutkan training, simpan juga state optimizer dan epoch (checkpoint).'],
      ],
      examples: [
        {
          title: 'Template training loop lengkap (jalankan di Colab)',
          runnable: false,
          code: py`
import torch  # library PyTorch
from torch import nn  # modul neural network
from torch.utils.data import Dataset, DataLoader  # pembungkus data & pemotong batch

class DataTabel(Dataset):  # Dataset: cara PyTorch mengambil data satu per satu
    def __init__(self, X, y):  # terima fitur & label
        self.X = torch.tensor(X, dtype=torch.float32)  # fitur sebagai tensor desimal
        self.y = torch.tensor(y, dtype=torch.long)  # label sebagai tensor bilangan bulat
    def __len__(self):  # jumlah data
        return len(self.X)
    def __getitem__(self, i):  # ambil data ke-i
        return self.X[i], self.y[i]

class MLP(nn.Module):  # model MLP sederhana
    def __init__(self, n_in, n_kelas):  # jumlah fitur & jumlah kelas
        super().__init__()  # siapkan bagian dalam nn.Module
        self.net = nn.Sequential(nn.Linear(n_in, 128), nn.ReLU(), nn.Dropout(0.2),
                                 nn.Linear(128, n_kelas))       # output logits
    def forward(self, x):  # forward: alur data melewati jaringan
        return self.net(x)

device = "cuda" if torch.cuda.is_available() else "cpu"  # pakai GPU jika ada
# batch latih 64, diacak setiap epoch
latih = DataLoader(DataTabel(X_tr, y_tr), batch_size=64, shuffle=True)
# data validasi tidak perlu diacak
val = DataLoader(DataTabel(X_val, y_val), batch_size=256)
model = MLP(X_tr.shape[1], 3).to(device)  # buat model lalu pindahkan ke device
opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)  # optimizer AdamW
loss_fn = nn.CrossEntropyLoss()  # loss untuk klasifikasi
terbaik, sabar = float("inf"), 0  # loss terbaik & penghitung kesabaran

for epoch in range(100):  # maksimal 100 epoch
    model.train()  # mode training (dropout aktif)
    for xb, yb in latih:  # untuk setiap batch
        xb, yb = xb.to(device), yb.to(device)  # pindahkan batch ke device
        loss = loss_fn(model(xb), yb)  # hitung loss
        # nolkan gradien, hitung gradien, perbarui bobot
        opt.zero_grad(); loss.backward(); opt.step()

    model.eval(); total, benar, n = 0.0, 0, 0  # mode evaluasi (dropout mati)
    with torch.no_grad():  # tanpa menghitung gradien (lebih hemat)
        for xb, yb in val:  # untuk setiap batch validasi
            xb, yb = xb.to(device), yb.to(device)  # pindahkan ke device
            out = model(xb)  # tebakan model
            total += loss_fn(out, yb).item() * len(yb)  # jumlahkan loss
            # hitung tebakan benar
            benar += (out.argmax(1) == yb).sum().item(); n += len(yb)
    val_loss = total / n  # rata-rata loss validasi
    # laporan per epoch
    print(f"epoch {epoch}: val_loss={val_loss:.4f} acc={benar / n:.3f}")

    if val_loss < terbaik:                       # early stopping + simpan model terbaik
        terbaik, sabar = val_loss, 0  # catat yang terbaik & reset kesabaran
        torch.save(model.state_dict(), "model_terbaik.pt")  # simpan bobot model
    else:  # tidak membaik
        sabar += 1  # tambah hitungan epoch tanpa perbaikan
        if sabar >= 5:  # 5 epoch tanpa perbaikan
            print("Berhenti lebih awal"); break  # hentikan training`,
        },
        {
          title: 'Konsep autograd dengan NumPy: grafik komputasi mini',
          code: py`
# Versi super kecil dari autograd PyTorch: setiap Nilai mencatat cara menghitung gradiennya.
class Nilai:
    # setiap Nilai menyimpan angka, gradien, asal-usul, dan cara mundur
    def __init__(self, data, anak=(), op=""):
        self.data, self.grad, self._anak, self._backward, self.op = data, 0.0, anak, lambda: None, op
    def __add__(self, lain):  # penjumlahan
        # hasil baru yang mengingat kedua asalnya
        out = Nilai(self.data + lain.data, (self, lain), "+")
        def _bw():  # cara menghitung gradien penjumlahan
            self.grad += out.grad; lain.grad += out.grad  # turunan a+b terhadap a dan b = 1
        out._backward = _bw; return out  # simpan cara mundurnya
    def __mul__(self, lain):  # perkalian
        out = Nilai(self.data * lain.data, (self, lain), "*")  # hasil baru
        def _bw():  # cara menghitung gradien perkalian
            # turunan a*b terhadap a = b, terhadap b = a
            self.grad += lain.data * out.grad; lain.grad += self.data * out.grad
        out._backward = _bw; return out  # simpan cara mundurnya
    def backward(self):  # hitung semua gradien
        urutan, dikunjungi = [], set()  # urutan perhitungan
        def bangun(v):  # susun dari input ke output
            if v not in dikunjungi:  # kunjungi setiap nilai sekali
                dikunjungi.add(v); [bangun(a) for a in v._anak]; urutan.append(v)
        bangun(self); self.grad = 1.0  # gradien output terhadap dirinya = 1
        for v in reversed(urutan):  # mundur dari output ke input
            v._backward()  # jalankan aturan rantai

w, x, b = Nilai(3.0), Nilai(2.0), Nilai(1.0)  # tiga nilai awal
y = w * x + b          # forward: 7
L = y * y              # loss = y^2 = 49
L.backward()  # hitung gradien semuanya
# bandingkan dengan teori
print(f"L={L.data}, dL/dw={w.grad} (teori 2*y*x = 28), dL/dx={x.grad}, dL/db={b.grad}")`,
        },
      ],
      mistakes: [
        ['Lupa `model.eval()` saat validasi.', 'Dropout tetap aktif dan batch norm memakai statistik batch, sehingga skor validasi berfluktuasi dan lebih rendah.'],
        ['`RuntimeError: Expected all tensors to be on the same device`.', 'Pindahkan model dan setiap batch ke device yang sama.'],
        ['Menyimpan `loss` (tensor) ke list untuk dicatat.', 'Pakai `loss.item()`; menyimpan tensor menahan seluruh graf di memori.'],
      ],
      tips: [
        'Sanity check: latih pada satu batch kecil berulang-ulang; loss harus turun mendekati nol.',
        'Set seed (`torch.manual_seed`) untuk eksperimen yang bisa diulang.',
        'PyTorch Lightning atau Hugging Face Accelerate mengurangi kode boilerplate training.',
      ],
      check: [
        ['Kenapa `optimizer.zero_grad()` diperlukan setiap iterasi?', 'PyTorch menjumlahkan (akumulasi) gradien setiap kali `backward()` dipanggil; tanpa dikosongkan, gradien batch lama ikut terpakai.'],
        ['Apa fungsi `torch.no_grad()` saat evaluasi?', 'Mematikan pelacakan graf gradien sehingga lebih cepat dan hemat memori, karena kita tidak akan memanggil backward.'],
      ],
    },
  },
  'dl-cnn': {
    deep: {
      concepts: [
        ['Dua ide kunci: lokalitas dan berbagi bobot', 'Filter konvolusi hanya melihat area kecil (mis. 3×3) dan **filter yang sama dipakai di seluruh gambar**. Akibatnya parameter jauh lebih sedikit daripada layer dense, dan pola (mis. tepi) dikenali di mana pun posisinya.'],
        ['Ukuran output', '`output = (input − kernel + 2·padding) / stride + 1`. Gambar 32×32 dengan kernel 3, padding 1, stride 1 tetap 32×32; dengan stride 2 menjadi 16×16. Pooling 2×2 juga membagi dua ukuran.'],
        ['Receptive field', 'Setiap layer konvolusi memperluas area gambar yang "dilihat" oleh satu neuron. Layer awal menangkap tepi dan tekstur, layer tengah bentuk, layer akhir bagian objek (mata, roda). Inilah hierarki fitur.'],
        ['Arsitektur penting', '**LeNet** (1998, angka), **AlexNet** (2012, memicu revolusi DL), **VGG** (tumpukan 3×3), **ResNet** (residual connection, 100+ layer), **EfficientNet**/**ConvNeXt** (modern, efisien). Vision Transformer (ViT) kini juga populer.'],
      ],
      examples: [
        {
          title: 'Menghitung ukuran output dan parameter: conv vs dense',
          code: py`
def ukuran_output(n, k, p=0, s=1):  # rumus ukuran output konvolusi
    return (n - k + 2 * p) // s + 1  # n input, k kernel, p padding, s stride

n = 224  # ukuran gambar awal
print("Input 224x224x3")  # judul
# daftar lapisan: nama, kernel, padding, stride
lapisan = [("conv3x3 64, p=1", 3, 1, 1), ("maxpool 2x2", 2, 0, 2), ("conv3x3 128, p=1", 3, 1, 1),
           ("maxpool 2x2", 2, 0, 2), ("conv3x3 256, s=2, p=1", 3, 1, 2)]
for nama, k, p, s in lapisan:  # lewati setiap lapisan
    n = ukuran_output(n, k, p, s)  # ukuran baru
    print(f"  {nama:24s} -> {n}x{n}")  # cetak ukurannya

param_conv = 3 * 3 * 3 * 64 + 64                 # kernel 3x3, 3 channel masuk, 64 filter
param_dense = (224 * 224 * 3) * 64 + 64          # dense dari seluruh piksel ke 64 neuron
print(f"\nParameter conv 3x3 (64 filter): {param_conv:,}")  # jumlah parameter conv
# dense jauh lebih boros
print(f"Parameter dense ke 64 neuron  : {param_dense:,}  ({param_dense // param_conv:,}x lebih banyak)")

# Receptive field setelah beberapa conv 3x3 (stride 1)
rf = 1  # receptive field awal: 1 piksel
for i in range(1, 6):  # tambah 5 conv
    rf += 2  # setiap conv 3x3 menambah 2
    print(f"Setelah {i} conv 3x3: receptive field {rf}x{rf}")  # cetak luas pandangnya`,
        },
      ],
      mistakes: [
        ['Lupa normalisasi piksel (0–255).', 'Skalakan ke 0–1 atau normalisasi dengan mean/std ImageNet saat memakai model pretrained.'],
        ['Shape salah: PyTorch memakai (batch, channel, tinggi, lebar), sedangkan gambar dari PIL/NumPy (tinggi, lebar, channel).', 'Pakai `transforms.ToTensor()` atau `.permute(2, 0, 1)`.'],
        ['Melatih CNN dari nol dengan 500 gambar.', 'Pakai transfer learning dari model pretrained.'],
      ],
      tips: [
        'Visualisasikan filter dan feature map layer awal untuk memahami apa yang dipelajari.',
        'Global average pooling di akhir (daripada flatten besar) mengurangi parameter dan overfitting.',
      ],
      check: [
        ['Gambar 64×64, kernel 5×5, padding 0, stride 1. Berapa ukuran output?', '(64 − 5)/1 + 1 = 60, jadi 60×60.'],
        ['Kenapa CNN butuh jauh lebih sedikit parameter daripada jaringan dense untuk gambar?', 'Karena setiap filter kecil dan dipakai bersama (shared weights) di seluruh posisi gambar.'],
      ],
    },
    exercise: {
      task: 'Terapkan filter blur 3×3 (semua elemen 1/9) pada gambar 6×6 berisi kotak putih di tengah, memakai `scipy.signal.convolve2d`. Cetak hasilnya dibulatkan 2 desimal.',
      hint: '`np.ones((3, 3)) / 9`, `convolve2d(gambar, kernel, mode="same")`.',
      solution: py`
import numpy as np  # NumPy
from scipy.signal import convolve2d  # fungsi konvolusi 2D

gambar = np.zeros((6, 6)); gambar[2:4, 2:4] = 1  # gambar 6x6 dengan kotak putih di tengah
kernel = np.ones((3, 3)) / 9  # kernel rata-rata 3x3 (blur)
print(convolve2d(gambar, kernel, mode="same").round(2))  # hasil: tepi kotak menjadi buram`,
    },
  },
  'dl-rnn': {
    deep: {
      concepts: [
        ['Hidden state sebagai memori', 'RNN memproses urutan satu langkah demi satu langkah: `hₜ = tanh(W·xₜ + U·hₜ₋₁ + b)`. Bobot yang sama dipakai di setiap langkah waktu, dan `hₜ` merangkum semua yang sudah dilihat.'],
        ['Masalah ingatan jangka panjang', 'Backprop melalui waktu (BPTT) mengalikan gradien di setiap langkah, sehingga informasi dari puluhan langkah lalu hilang (vanishing gradient). **LSTM** menambahkan *cell state* dengan gerbang (forget, input, output) yang mengatur apa yang disimpan atau dibuang; **GRU** versi lebih ringkas.'],
        ['Bentuk masalah urutan', '**Many-to-one** (klasifikasi sentimen kalimat), **many-to-many sejajar** (label setiap kata/NER), **seq2seq** (terjemahan: encoder → decoder), **one-to-many** (caption gambar).'],
        ['Posisi RNN saat ini', 'Untuk teks, Transformer sudah menggantikan RNN hampir sepenuhnya karena bisa diproses paralel dan menangkap konteks jauh. RNN/LSTM masih berguna untuk time series kecil, data sensor streaming, dan perangkat dengan sumber daya terbatas. Untuk time series tabular, gradient boosting dengan fitur lag sering setara atau lebih baik.'],
      ],
      examples: [
        {
          title: 'Seberapa cepat ingatan RNN memudar',
          code: py`
import numpy as np  # NumPy

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n_hidden = 16  # ukuran hidden state
W_x = rng.normal(scale=0.5, size=(1, n_hidden))  # bobot input

def jalankan(urutan, U):  # jalankan RNN pada sebuah urutan
    h = np.zeros(n_hidden)  # hidden state awal = nol
    for x in urutan:  # baca urutan satu per satu
        # state baru = tanh(input baru + state lama)
        h = np.tanh(np.array([x]) @ W_x + h @ U)
    return h  # state terakhir = ringkasan urutan

# Dua urutan yang hanya berbeda di langkah PERTAMA; seberapa beda hidden state di akhir?
# dua skala bobot rekuren
for skala, label in [(0.5, "bobot rekuren kecil"), (1.0, "bobot rekuren sedang")]:
    # bobot rekuren
    U = rng.normal(scale=skala / np.sqrt(n_hidden), size=(n_hidden, n_hidden))
    print(label)  # judul
    for panjang in [1, 5, 10, 20, 40]:  # coba berbagai panjang urutan
        a = [1.0] + [0.0] * (panjang - 1)  # urutan diawali 1
        b = [-1.0] + [0.0] * (panjang - 1)  # urutan diawali -1
        # selisih state akhir keduanya
        beda = np.linalg.norm(jalankan(a, U) - jalankan(b, U))
        # makin kecil = makin lupa
        print(f"  setelah {panjang:2d} langkah: selisih hidden state = {beda:.2e}")
print("Dengan bobot kecil, informasi langkah pertama praktis hilang setelah ~20 langkah.")
print("Bobot lebih besar mengingat lebih lama, tetapi rawan gradien meledak; LSTM mengaturnya dengan gerbang.")`,
        },
      ],
      mistakes: [
        ['Mengacak urutan waktu saat membagi data latih/uji.', 'Split berdasarkan waktu; model tidak boleh "melihat masa depan".'],
        ['Tidak menormalisasi data time series.', 'Skalakan dengan statistik data latih; RNN sangat sensitif terhadap skala input.'],
        ['Langsung memakai LSTM untuk forecasting tanpa baseline.', 'Bandingkan dengan baseline naif (nilai kemarin/minggu lalu) dan model fitur-lag.'],
      ],
      tips: [
        'Pakai gradient clipping saat melatih RNN.',
        'Untuk urutan panjang dengan banyak data, coba Transformer atau model khusus time series (Temporal Fusion Transformer, N-BEATS).',
      ],
      check: [
        ['Apa fungsi forget gate di LSTM?', 'Menentukan bagian cell state lama mana yang dibuang, sehingga LSTM bisa menyimpan informasi penting dalam waktu lama dan melupakan yang tidak relevan.'],
        ['Kenapa Transformer menggantikan RNN untuk NLP?', 'Transformer memproses semua token secara paralel (training jauh lebih cepat di GPU) dan attention menghubungkan token yang berjauhan secara langsung.'],
      ],
    },
    exercise: {
      task: 'Buat fitur lag (nilai 1, 2, 7 hari sebelumnya) dari deret waktu sinus mingguan + noise, lalu latih `LinearRegression` untuk memprediksi hari berikutnya. Bandingkan MAE dengan baseline "nilai kemarin".',
      hint: 'Pakai `pd.Series.shift(k)`; split 80% awal untuk latih, 20% akhir untuk uji.',
      solution: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas
from sklearn.linear_model import LinearRegression  # regresi linear
from sklearn.metrics import mean_absolute_error  # metrik MAE

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
t = np.arange(400)  # 400 hari
# pola mingguan + noise
s = pd.Series(100 + 20 * np.sin(2 * np.pi * t / 7) + rng.normal(0, 3, 400))
# fitur lag: nilai 1, 2, dan 7 hari sebelumnya
df = pd.DataFrame({"y": s, "lag1": s.shift(1), "lag2": s.shift(2), "lag7": s.shift(7)}).dropna()
batas = int(len(df) * 0.8)  # 80% awal untuk latih
latih, uji = df.iloc[:batas], df.iloc[batas:]  # bagi berdasarkan waktu, bukan acak
m = LinearRegression().fit(latih[["lag1", "lag2", "lag7"]], latih.y)  # latih model
# baseline: tebak sama dengan kemarin
print("MAE baseline (kemarin):", round(mean_absolute_error(uji.y, uji.lag1), 2))
# model lag harus lebih baik
print("MAE model fitur lag   :", round(mean_absolute_error(uji.y, m.predict(uji[["lag1", "lag2", "lag7"]])), 2))`,
    },
  },
  'dl-regularisasi': {
    deep: {
      concepts: [
        ['Dropout', 'Saat training, setiap neuron dimatikan secara acak dengan peluang p (mis. 0,2–0,5), sehingga jaringan tidak bisa bergantung pada neuron tertentu. Efeknya mirip melatih banyak sub-jaringan lalu merata-ratakan. Saat inferensi dropout dimatikan dan output disesuaikan skalanya otomatis.'],
        ['Batch normalization', 'Menormalisasi aktivasi setiap batch ke rata-rata 0 dan std 1, lalu diskalakan ulang dengan parameter yang dipelajari. Training jadi lebih stabil dan bisa memakai learning rate lebih besar. Saat inferensi memakai statistik rata-rata berjalan, karena itu `model.eval()` penting. Untuk Transformer dipakai **LayerNorm**.'],
        ['Early stopping', 'Hentikan training saat loss validasi berhenti membaik selama beberapa epoch (patience), dan pakai bobot terbaik. Sederhana tetapi sangat efektif.'],
        ['Augmentasi data', 'Membuat variasi realistis dari data latih: flip, crop, rotasi, perubahan warna (gambar); sinonim, back-translation (teks); noise, time-shift (audio). Augmentasi harus mempertahankan label: membalik angka "6" secara vertikal bisa menjadi "9"!'],
        ['Label smoothing & mixup', '**Label smoothing** mengganti target 1/0 menjadi 0,9/0,1 agar model tidak terlalu yakin. **Mixup** mencampur dua gambar dan labelnya. Keduanya meningkatkan generalisasi dan kalibrasi.'],
      ],
      examples: [
        {
          title: 'Dropout dari nol dan efek early stopping',
          code: py`
import numpy as np  # NumPy
from sklearn.datasets import load_digits  # dataset gambar angka
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.neural_network import MLPClassifier  # neural network

rng = np.random.default_rng(0)  # generator acak dengan seed tetap

def dropout(a, p, latih=True):  # fungsi dropout
    if not latih:  # saat inferensi tidak ada dropout
        return a  # kembalikan apa adanya
    mask = rng.random(a.shape) >= p  # matikan neuron dengan peluang p
    return a * mask / (1 - p)            # inverted dropout: skala dijaga saat training

a = np.ones(10)  # 10 neuron bernilai 1
print("Training :", dropout(a, 0.3))  # sebagian menjadi 0, sisanya diperbesar
print("Inferensi:", dropout(a, 0.3, latih=False))  # inferensi: semua tetap 1
# rata-ratanya tetap sekitar 1
print("Rata-rata output training (10.000 kali):", np.mean([dropout(a, 0.3).mean() for _ in range(10000)]).round(3))

# Early stopping: data sedikit + 30% label latih SALAH (seperti anotasi yang asal-asalan)
X, y = load_digits(return_X_y=True); X = X / 16.0  # muat & skala ke 0 sampai 1
# hanya 600 data latih
X_tr, X_te, y_tr, y_te = train_test_split(X, y, train_size=600, random_state=0, stratify=y)
# sisihkan validasi
X_tr, X_val, y_tr, y_val = train_test_split(X_tr, y_tr, test_size=0.25, random_state=0, stratify=y_tr)
salah = rng.random(len(y_tr)) < 0.3  # pilih 30% label
y_tr = np.where(salah, rng.integers(0, 10, len(y_tr)), y_tr)  # ganti dengan label acak

# jaringan besar (mudah menghafal)
mlp = MLPClassifier(hidden_layer_sizes=(256, 256), random_state=0)
skor_val, skor_uji = [], []  # catatan skor per epoch
for epoch in range(200):  # 200 epoch
    mlp.partial_fit(X_tr, y_tr, classes=np.arange(10))      # satu epoch
    # catat skor validasi & uji
    skor_val.append(mlp.score(X_val, y_val)); skor_uji.append(mlp.score(X_te, y_te))
for e in (5, 20, 50, 100, 199):  # beberapa epoch contoh
    # cetak skornya
    print(f"epoch {e:3d}: validasi={skor_val[e]:.3f} uji={skor_uji[e]:.3f}")
terbaik = int(np.argmax(skor_val))  # epoch dengan skor validasi terbaik
# bandingkan
print(f"Early stopping memilih epoch {terbaik}: uji={skor_uji[terbaik]:.3f} | tanpa early stopping: uji={skor_uji[-1]:.3f}")
# kesimpulan
print("Tanpa dihentikan, model terus menghafal label yang salah sehingga performa di data baru turun.")`,
        },
      ],
      mistakes: [
        ['Menerapkan augmentasi ke data validasi/uji.', 'Augmentasi hanya untuk data latih; data evaluasi harus mencerminkan kondisi nyata.'],
        ['Dropout terlalu besar pada jaringan kecil.', 'Model jadi underfit. Mulai dari 0,1–0,3.'],
        ['Batch size sangat kecil (2–4) dengan batch norm.', 'Statistik batch jadi tidak stabil. Pakai batch lebih besar, GroupNorm, atau LayerNorm.'],
      ],
      tips: [
        'Urutan prioritas melawan overfitting: lebih banyak data > augmentasi > transfer learning > regularisasi > model lebih kecil.',
        'Library augmentasi: torchvision.transforms v2, Albumentations (gambar), nlpaug (teks).',
      ],
      check: [
        ['Kenapa output dropout dibagi (1 − p) saat training?', 'Agar nilai harapan aktivasi saat training sama dengan saat inferensi (ketika semua neuron aktif), sehingga tidak perlu penyesuaian skala saat prediksi.'],
        ['Augmentasi apa yang tidak boleh dipakai untuk klasifikasi angka tulisan tangan?', 'Flip/rotasi besar yang mengubah makna angka (6 ↔ 9, atau mencerminkan 2, 3, 7).'],
      ],
    },
  },
  'dl-transfer': {
    deep: {
      concepts: [
        ['Kenapa transfer learning bekerja', 'Layer awal model yang dilatih pada jutaan gambar (ImageNet) sudah belajar fitur umum (tepi, tekstur, bentuk) yang berguna untuk hampir semua tugas gambar. Kita cukup mengajari layer akhir untuk tugas baru, sehingga butuh data jauh lebih sedikit.'],
        ['Tiga strategi', '**Feature extraction**: bekukan seluruh backbone, latih head baru saja (data sangat sedikit). **Fine-tuning sebagian**: buka beberapa layer terakhir. **Fine-tuning penuh**: semua layer dilatih dengan learning rate kecil (data cukup banyak). Semakin mirip domainnya dengan data pretraining dan semakin sedikit data, semakin banyak layer yang dibekukan.'],
        ['Learning rate diskriminatif', 'Backbone sudah bagus, jadi diberi lr kecil (mis. 1e-5), sedangkan head baru diberi lr lebih besar (1e-3). Ini mencegah fitur bagus "rusak" di awal training (catastrophic forgetting).'],
        ['Preprocessing harus sama', 'Model pretrained mengharapkan input dengan ukuran dan normalisasi yang sama seperti saat pretraining (mis. 224×224, mean/std ImageNet). Gunakan transform bawaan dari bobot model.'],
      ],
      examples: [
        {
          title: 'Fine-tuning dua tahap dengan lr berbeda (jalankan di Colab)',
          runnable: false,
          code: py`
import torch  # PyTorch
from torch import nn  # modul neural network
from torchvision import models  # model siap pakai

bobot = models.ResNet50_Weights.DEFAULT  # bobot hasil pretraining ImageNet
model = models.resnet50(weights=bobot)  # muat ResNet-50 dengan bobot tersebut
preprocess = bobot.transforms()                  # resize + normalisasi yang benar

model.fc = nn.Linear(model.fc.in_features, 5)    # head baru untuk 5 kelas

# Tahap 1: bekukan backbone, latih head saja (beberapa epoch)
for nama, p in model.named_parameters():  # untuk setiap parameter
    p.requires_grad = nama.startswith("fc.")  # hanya head (fc) yang dilatih
# optimizer hanya untuk parameter yang dilatih
opt = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3)
# ... training loop ...

# Tahap 2: buka layer4 + fc dengan learning rate berbeda
for nama, p in model.named_parameters():  # untuk setiap parameter
    p.requires_grad = nama.startswith(("layer4.", "fc."))  # buka layer4 & fc
opt = torch.optim.AdamW([  # optimizer dengan learning rate berbeda
    # layer4: lr kecil agar tidak merusak
    {"params": model.layer4.parameters(), "lr": 1e-5},
    {"params": model.fc.parameters(), "lr": 1e-4},  # head: lr lebih besar
], weight_decay=1e-4)
# ... training loop dengan early stopping ...`,
        },
        {
          title: 'Ide yang sama di browser: fitur "pretrained" vs belajar dari nol',
          code: py`
import numpy as np  # NumPy
from sklearn.datasets import load_digits  # dataset gambar angka
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.neural_network import MLPClassifier  # neural network

X, y = load_digits(return_X_y=True); X = X / 16  # muat & skala
# bagi indeks: separuh sumber, separuh target
sumber, target = train_test_split(np.arange(len(X)), test_size=0.5, random_state=0, stratify=y)

# 1) "Pretraining" pada data sumber yang besar & bersih
# latih jaringan di data sumber
pre = MLPClassifier(hidden_layer_sizes=(128,), max_iter=1000, random_state=0).fit(X[sumber], y[sumber])
backbone = lambda A: np.maximum(0, A @ pre.coefs_[0] + pre.intercepts_[0])   # layer tersembunyi, dibekukan

# 2) Domain baru: hasil scan berderau, dan hanya sedikit yang berlabel
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# data target diberi noise
Xt = np.clip(X[target] + rng.normal(0, 0.35, X[target].shape), 0, 1); yt = y[target]

for n in (20, 100):  # coba 20 dan 100 label
    nol, tf = [], []  # skor dari nol & skor transfer
    for s in range(5):  # ulangi 5 kali dengan pembagian berbeda
        # ambil n data berlabel
        tr, te = train_test_split(np.arange(len(yt)), train_size=n, random_state=s, stratify=yt)
        # dari nol: model langsung di piksel
        nol.append(LogisticRegression(max_iter=3000).fit(Xt[tr], yt[tr]).score(Xt[te], yt[te]))
        # transfer: model di fitur backbone
        tf.append(LogisticRegression(max_iter=3000).fit(backbone(Xt[tr]), yt[tr]).score(backbone(Xt[te]), yt[te]))
    # bandingkan rata-ratanya
    print(f"{n:3d} label | dari nol: {np.mean(nol):.3f} | transfer (backbone beku + head baru): {np.mean(tf):.3f}")
print("Transfer paling membantu saat label sangat sedikit.")  # kesimpulan`,
        },
      ],
      mistakes: [
        ['Learning rate besar (1e-2) untuk fine-tuning penuh.', 'Fitur pretrained rusak dalam beberapa langkah. Pakai lr kecil (1e-5 sampai 1e-4).'],
        ['Lupa memakai normalisasi ImageNet.', 'Akurasi turun drastis tanpa error apa pun. Pakai `weights.transforms()`.'],
        ['Membekukan layer tetapi masih memasukkan semua parameter ke optimizer dengan weight decay.', 'Filter hanya parameter dengan `requires_grad=True`.'],
      ],
      tips: [
        'Sumber model pretrained: torchvision, timm (ratusan model vision), Hugging Face Hub.',
        'Untuk dataset sangat kecil, coba juga embedding dari model besar (CLIP/DINOv2) + regresi logistik — sering sudah sangat kuat.',
      ],
      check: [
        ['Datamu 200 gambar sinar-X, sangat berbeda dari ImageNet. Strategi apa yang masuk akal?', 'Mulai dengan feature extraction / fine-tuning sebagian dengan lr kecil dan augmentasi kuat; pertimbangkan model yang dipretrain pada citra medis jika tersedia.'],
      ],
    },
  },
  'dl-gpu': {
    deep: {
      concepts: [
        ['Kenapa GPU cepat untuk deep learning', 'Training didominasi perkalian matriks besar yang bisa dipecah menjadi ribuan operasi independen. CPU punya sedikit core yang sangat pintar; GPU punya ribuan core sederhana yang mengerjakan operasi serupa secara paralel.'],
        ['Memori GPU (VRAM) adalah batasnya', 'VRAM dipakai untuk bobot model, gradien, state optimizer (Adam menyimpan 2 nilai per parameter), dan aktivasi tiap layer (tergantung batch size). Perkiraan kasar training dengan Adam fp32: ~16 byte per parameter + aktivasi. Model 1 miliar parameter ≈ 16 GB hanya untuk itu.'],
        ['Mixed precision', 'Memakai float16/bfloat16 untuk sebagian besar perhitungan dan float32 untuk bagian sensitif. Jauh lebih cepat di GPU modern (Tensor Core) dan menghemat memori **aktivasi** sekitar separuh (memori bobot + optimizer hampir sama karena tetap ada salinan fp32). Di PyTorch: `torch.autocast`.'],
        ['Trik saat kehabisan memori', 'Kecilkan batch + **gradient accumulation** (jumlahkan gradien beberapa batch kecil sebelum `step`), **gradient checkpointing** (hitung ulang aktivasi daripada menyimpannya), mixed precision, atau model lebih kecil / LoRA.'],
      ],
      examples: [
        {
          title: 'Mixed precision + gradient accumulation (jalankan di Colab GPU)',
          runnable: false,
          code: py`
import torch  # PyTorch

device = "cuda"  # pakai GPU
model = model.to(device)  # pindahkan model ke GPU
opt = torch.optim.AdamW(model.parameters(), lr=3e-4)  # optimizer
scaler = torch.amp.GradScaler()          # mencegah gradien fp16 terlalu kecil (underflow)
akumulasi = 4                            # batch efektif = batch_size x 4

for i, (xb, yb) in enumerate(loader):  # untuk setiap batch
    # kirim ke GPU tanpa menunggu
    xb, yb = xb.to(device, non_blocking=True), yb.to(device, non_blocking=True)
    # hitung dengan presisi fp16 (lebih cepat & hemat)
    with torch.autocast(device_type="cuda", dtype=torch.float16):
        loss = loss_fn(model(xb), yb) / akumulasi  # loss dibagi agar akumulasi setara
    scaler.scale(loss).backward()  # hitung gradien (diperbesar scaler)
    if (i + 1) % akumulasi == 0:  # setiap 4 batch
        scaler.unscale_(opt)  # kembalikan skala gradien
        # batasi gradien agar tidak meledak
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        # perbarui bobot, update scaler, nolkan gradien
        scaler.step(opt); scaler.update(); opt.zero_grad(set_to_none=True)

print(torch.cuda.max_memory_allocated() / 1e9, "GB terpakai")  # memori GPU tertinggi`,
        },
        {
          title: 'Kalkulator kebutuhan memori GPU',
          code: py`
# perkiraan memori GPU
def memori_gb(n_param, bytes_bobot=4, optimizer="adam", training=True):
    bobot = n_param * bytes_bobot  # memori bobot
    if not training:  # inferensi hanya butuh bobot
        return bobot / 1e9  # dalam GB
    grad = n_param * bytes_bobot  # gradien seukuran bobot
    opt = n_param * 8 if optimizer == "adam" else n_param * 4   # Adam: 2 state fp32
    master = n_param * 4 if bytes_bobot == 2 else 0             # salinan fp32 saat mixed precision
    return (bobot + grad + opt + master) / 1e9  # total dalam GB

# tiga model contoh
for nama, n in [("ResNet-50", 25.6e6), ("BERT-base", 110e6), ("LLM 7B", 7e9)]:
    print(f"{nama:10s}: inferensi fp16 {memori_gb(n, 2, training=False):6.1f} GB | "
          f"training Adam {memori_gb(n):7.1f} GB  (+ memori aktivasi)")
# catatan
print("Mixed precision tidak mengecilkan angka training di atas; penghematannya di memori aktivasi & kecepatan.")
# kesimpulan
print("\nKarena itu LLM 7B bisa dijalankan (inferensi) di GPU 16 GB, tetapi fine-tuning penuh butuh banyak GPU -> pakai LoRA/QLoRA.")`,
        },
      ],
      mistakes: [
        ['`CUDA out of memory` lalu langsung membeli GPU lebih besar.', 'Coba dulu: batch lebih kecil + gradient accumulation, mixed precision, gradient checkpointing.'],
        ['GPU utilisasi rendah (20%) padahal training lambat.', 'Bottleneck di pemuatan data. Naikkan `num_workers`, pakai `pin_memory=True`, dan preprocessing yang lebih ringan.'],
        ['Memanggil `.item()` atau `print` tensor GPU di setiap langkah.', 'Memaksa sinkronisasi CPU–GPU. Catat log setiap N langkah saja.'],
      ],
      tips: [
        'Pantau GPU dengan `nvidia-smi` (atau `watch -n 1 nvidia-smi`).',
        'Opsi GPU murah/gratis: Google Colab, Kaggle Notebooks (30 jam/minggu), Lightning Studio; untuk serius: RunPod, Lambda, Vast.ai.',
      ],
      check: [
        ['Apa itu gradient accumulation?', 'Menjumlahkan gradien dari beberapa batch kecil sebelum melakukan satu langkah update, sehingga meniru batch besar tanpa memori besar.'],
        ['Kenapa Adam butuh memori lebih banyak daripada SGD?', 'Adam menyimpan dua nilai tambahan (rata-rata gradien dan rata-rata kuadratnya) untuk setiap parameter.'],
      ],
    },
  },
}
