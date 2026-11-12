import { py } from './py.js'

// Langkah penerapan (dari data sampai hasil) & studi kasus lengkap dengan kode untuk setiap algoritma.
// Kode memakai data simulasi yang dibuat di dalam kode agar bisa dijalankan di browser.

export const algoGuides = {
  'linear-regression': {
    steps: [
      ['Kumpulkan data', 'Fitur numerik/kategori dan target berupa angka.'],
      ['Eksplorasi hubungan', 'Scatter plot setiap fitur vs target; cek apakah hubungannya kira-kira lurus.'],
      ['Siapkan fitur', 'One-hot untuk kategori; tangani outlier ekstrem; pertimbangkan log-transform jika target sangat miring.'],
      ['Split data', '80% latih, 20% uji.'],
      ['Latih', '`LinearRegression().fit(X_train, y_train)`.'],
      ['Evaluasi', 'MAE, RMSE, R² pada data uji. Bandingkan dengan baseline "tebak rata-rata".'],
      ['Interpretasi & gunakan', 'Baca koefisien untuk insight; gunakan `predict()` untuk data baru.'],
    ],
    case: {
      title: 'Berapa omzet kedai jika anggaran iklan dinaikkan?',
      situation: 'Kedai kopi punya data 52 minggu: anggaran iklan Instagram, anggaran brosur, apakah ada event, dan omzet mingguan. Pemilik ingin tahu kanal mana yang paling efektif dan memprediksi omzet minggu depan.',
      steps: [
        'Data mingguan dimuat dan dilihat sekilas.',
        'Split 80/20, latih regresi linear.',
        'Evaluasi MAE dibanding baseline rata-rata.',
        'Baca koefisien: setiap Rp1 juta iklan menghasilkan berapa tambahan omzet?',
        'Prediksi untuk rencana anggaran minggu depan.',
      ],
      result: 'Koefisien menunjukkan iklan Instagram ~3× lebih efektif daripada brosur, sehingga anggaran dialihkan.',
      code: py`
import numpy as np  # NumPy untuk data acak
import pandas as pd  # Pandas untuk tabel
from sklearn.linear_model import LinearRegression  # model regresi linear
from sklearn.model_selection import train_test_split  # membagi data latih & uji
from sklearn.metrics import mean_absolute_error, r2_score  # ukuran error untuk regresi

# 1. Data 52 minggu (juta rupiah) - disimulasikan
rng = np.random.default_rng(7)  # generator acak dengan seed tetap
df = pd.DataFrame({  # tabel 52 minggu
    "iklan_ig": rng.uniform(0.5, 5, 52).round(1),  # anggaran iklan Instagram (juta)
    "brosur":   rng.uniform(0.2, 3, 52).round(1),  # anggaran brosur (juta)
    "event":    rng.integers(0, 2, 52),  # ada event (1) atau tidak (0)
})
# omzet dibuat dari rumus + noise (agar ada pola untuk dipelajari)
df["omzet"] = (20 + 6 * df.iklan_ig + 2 * df.brosur + 8 * df.event + rng.normal(0, 3, 52)).round(1)
print(df.head(), "\n")  # lihat 5 baris pertama

# 2. Split & latih
X, y = df[["iklan_ig", "brosur", "event"]], df["omzet"]  # fitur (X) dan target (y)
# 20% data untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)
model = LinearRegression().fit(X_tr, y_tr)  # latih model

# 3. Evaluasi
pred = model.predict(X_te)  # tebakan untuk data uji
# MAE: rata-rata selisih tebakan dengan nilai asli
print(f"MAE model   : {mean_absolute_error(y_te, pred):.2f} juta")
# pembanding: selalu menebak rata-rata data latih
print(f"MAE baseline: {mean_absolute_error(y_te, [y_tr.mean()] * len(y_te)):.2f} juta")
# R2: seberapa banyak variasi omzet yang dijelaskan model
print(f"R²          : {r2_score(y_te, pred):.2f}\n")

# 4. Interpretasi
for nama, k in zip(X.columns, model.coef_):  # koefisien setiap fitur
    # pengaruh tiap fitur terhadap omzet
    print(f"+1 juta/+1 unit {nama:8s} -> omzet {k:+.2f} juta")

# 5. Prediksi rencana minggu depan
# rencana anggaran minggu depan
rencana = pd.DataFrame({"iklan_ig": [4.0], "brosur": [0.5], "event": [1]})
# tebak omzetnya
print(f"\nPrediksi omzet minggu depan: Rp{model.predict(rencana)[0]:.1f} juta")`,
    },
  },
  'logistic-regression': {
    steps: [
      ['Definisikan kelas positif', 'Misal "churn = 1". Cek proporsinya.'],
      ['Siapkan fitur', 'Scaling (StandardScaler) dan one-hot untuk kategori.'],
      ['Split dengan stratify', 'Agar proporsi kelas sama di latih dan uji.'],
      ['Latih', '`LogisticRegression(max_iter=1000)`; gunakan `class_weight="balanced"` jika kelas timpang.'],
      ['Dapatkan probabilitas', '`predict_proba` → skor risiko 0–1.'],
      ['Pilih ambang', 'Sesuaikan dengan biaya kesalahan (recall vs precision).'],
      ['Interpretasi', 'Koefisien positif menaikkan peluang kelas positif; `exp(koef)` = odds ratio.'],
    ],
    case: {
      title: 'Siapa pelanggan internet yang akan berhenti berlangganan?',
      situation: 'Provider internet ingin menelepon pelanggan berisiko churn bulan depan dan menawarkan promo. Tim CS hanya sanggup menelepon 20% pelanggan.',
      steps: [
        'Fitur: lama berlangganan, tagihan bulanan, jumlah keluhan, kontrak tahunan.',
        'Pipeline scaling + regresi logistik dengan class_weight balanced.',
        'Urutkan pelanggan berdasarkan probabilitas churn.',
        'Ukur: dari 20% teratas, berapa persen churner yang tertangkap?',
      ],
      result: 'Dengan menelepon hanya 20% pelanggan berisiko tertinggi, hampir separuh calon churner terjangkau, lebih dari 2× lipat dibanding menelepon secara acak (yang hanya menjangkau 20%).',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel
from sklearn.pipeline import make_pipeline  # merangkai scaler + model
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.metrics import classification_report  # laporan precision/recall/f1

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
n = 2000  # 2000 pelanggan
df = pd.DataFrame({  # tabel pelanggan buatan
    "bulan_langganan": rng.integers(1, 60, n),
    "tagihan":         rng.uniform(150, 600, n).round(),   # ribu rupiah
    "keluhan":         rng.poisson(1, n),  # jumlah keluhan (distribusi Poisson)
    "kontrak_tahunan": rng.integers(0, 2, n),  # berlangganan tahunan (1) atau bulanan (0)
})
# skor risiko churn dari setiap fitur
skor = -1 - 0.05 * df.bulan_langganan + 0.004 * df.tagihan + 0.8 * df.keluhan - 1.5 * df.kontrak_tahunan
# ubah skor menjadi peluang (sigmoid), lalu acak siapa yang churn
df["churn"] = (rng.random(n) < 1 / (1 + np.exp(-skor))).astype(int)
print("Proporsi churn:", df.churn.mean().round(3))  # persentase pelanggan yang berhenti

X, y = df.drop(columns="churn"), df.churn  # fitur = semua kolom kecuali churn
# stratify=y menjaga proporsi churn sama di latih & uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)
# class_weight='balanced' memberi bobot lebih pada kelas churn yang sedikit
model = make_pipeline(StandardScaler(), LogisticRegression(class_weight="balanced")).fit(X_tr, y_tr)
# nilai model per kelas
print(classification_report(y_te, model.predict(X_te), target_names=["bertahan", "churn"]))

# Koefisien (setelah scaling): arah pengaruh tiap fitur
# model[-1] = langkah terakhir pipeline (regresi logistik)
for nama, k in zip(X.columns, model[-1].coef_[0]):
    # koefisien positif menaikkan risiko, negatif menurunkan
    print(f"{nama:16s} {'menaikkan' if k > 0 else 'menurunkan'} risiko churn ({k:+.2f})")

# Strategi: telepon 20% pelanggan dengan risiko tertinggi
prob = model.predict_proba(X_te)[:, 1]  # peluang churn setiap pelanggan uji
# indeks 20% pelanggan dengan peluang tertinggi
top = np.argsort(-prob)[: int(0.2 * len(prob))]
# berapa persen churner yang tertangkap jika hanya menelepon 20%
print(f"\nMenelepon 20% teratas menjangkau {y_te.iloc[top].sum() / y_te.sum():.0%} dari semua churner")`,
    },
  },
  knn: {
    steps: [
      ['Siapkan fitur numerik', 'KNN berbasis jarak, jadi semua fitur harus angka.'],
      ['Scaling wajib', 'Tanpa scaling, fitur berskala besar (gaji) mendominasi fitur kecil (umur).'],
      ['Pilih K', 'Coba K ganjil 1–25 dengan cross-validation. K kecil → sensitif noise; K besar → terlalu halus.'],
      ['Pilih metrik jarak', 'Euclidean (default), Manhattan, atau cosine untuk teks/embedding.'],
      ['Prediksi', 'Cari K tetangga terdekat → voting/rata-rata.'],
      ['Evaluasi & jelaskan', 'Tunjukkan tetangga terdekat sebagai alasan prediksi.'],
    ],
    case: {
      title: 'Rekomendasi jurusan kuliah berdasarkan nilai rapor',
      situation: 'Guru BK punya data nilai alumni (Matematika, Biologi, Ekonomi, Bahasa) dan jurusan tempat mereka sukses. Ia ingin rekomendasi untuk siswa baru, beserta "alumni yang mirip denganmu".',
      steps: [
        'Data nilai alumni + jurusan.',
        'Pipeline scaling + KNN; pilih K terbaik dengan cross-validation.',
        'Untuk siswa baru, tampilkan rekomendasi dan 5 alumni paling mirip.',
      ],
      result: 'Rekomendasi mudah dijelaskan ke siswa: "5 alumni dengan nilai paling mirip denganmu sukses di jurusan X".',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel
from sklearn.pipeline import make_pipeline  # merangkai scaler + model
from sklearn.preprocessing import StandardScaler  # penyeragam skala (penting untuk KNN)
from sklearn.neighbors import KNeighborsClassifier  # algoritma KNN
from sklearn.model_selection import cross_val_score  # cross-validation untuk memilih K

rng = np.random.default_rng(3)  # generator acak dengan seed tetap
profil = {  # rata-rata nilai [mtk, bio, eko, bahasa]
    "Teknik":     [90, 75, 70, 72],
    "Kedokteran": [85, 92, 70, 78],
    "Manajemen":  [75, 70, 90, 80],
    "Sastra":     [68, 72, 74, 92],
}
rows = []  # tempat menampung data siswa buatan
for jurusan, mu in profil.items():  # untuk setiap jurusan
    for _ in range(60):  # buat 60 alumni
        # nilai acak di sekitar rata-rata jurusan, dibatasi 50 sampai 100
        rows.append([*np.clip(rng.normal(mu, 5), 50, 100).round(), jurusan])
df = pd.DataFrame(rows, columns=["mtk", "bio", "eko", "bahasa", "jurusan"])  # jadikan tabel
X, y = df[["mtk", "bio", "eko", "bahasa"]], df["jurusan"]  # fitur nilai dan label jurusan

# Pilih K terbaik
for k in [1, 3, 5, 9, 15]:  # coba beberapa nilai K
    # skor rata-rata 5-fold
    s = cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(k)), X, y, cv=5).mean()
    print(f"K={k:2d}: akurasi CV {s:.3f}")  # bandingkan akurasinya

# model akhir dengan K = 9
model = make_pipeline(StandardScaler(), KNeighborsClassifier(9)).fit(X, y)
siswa = pd.DataFrame([[88, 90, 72, 80]], columns=X.columns)  # nilai calon mahasiswa
print("\nRekomendasi:", model.predict(siswa)[0])  # jurusan yang direkomendasikan
# peluang setiap jurusan
print("Peluang:", {j: round(float(p), 2) for j, p in zip(model.classes_, model.predict_proba(siswa)[0])})

# cari 5 alumni terdekat (data harus diskalakan dulu dengan model[0])
jarak, idx = model[-1].kneighbors(model[0].transform(siswa), n_neighbors=5)
print("\n5 alumni paling mirip:")  # alumni-alumni ini menjadi alasan rekomendasi
print(df.iloc[idx[0]].to_string())  # tampilkan datanya`,
    },
  },
  'naive-bayes': {
    steps: [
      ['Kumpulkan teks berlabel', 'Contoh: SMS + label spam/normal.'],
      ['Bersihkan teks', 'Lowercase, hapus tanda baca/angka berlebihan.'],
      ['Ubah ke vektor', '`CountVectorizer` atau `TfidfVectorizer` (bisa dengan n-gram 1–2).'],
      ['Latih MultinomialNB', 'Parameter `alpha` (smoothing) mencegah peluang nol untuk kata yang belum pernah muncul.'],
      ['Evaluasi', 'Precision untuk spam (jangan sampai pesan penting dibuang), recall, F1.'],
      ['Lihat kata paling berpengaruh', 'Untuk memahami dan menjelaskan model.'],
    ],
    case: {
      title: 'Filter SMS penipuan berhadiah',
      situation: 'Aplikasi pesan ingin memberi label peringatan pada SMS penipuan ("Selamat Anda menang…") tanpa salah melabeli pesan biasa.',
      steps: [
        'Kumpulan SMS berlabel penipuan/normal.',
        'TF-IDF (unigram + bigram) + MultinomialNB dalam pipeline.',
        'Evaluasi precision kelas penipuan.',
        'Tampilkan kata yang paling menunjukkan penipuan.',
      ],
      result: 'Model ringan dan cepat, cukup untuk berjalan di HP; kata-kata pemicu mudah dijelaskan ke pengguna.',
      code: py`
import numpy as np  # NumPy untuk acak & urutan
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.feature_extraction.text import TfidfVectorizer  # TF-IDF: teks -> angka
from sklearn.naive_bayes import MultinomialNB  # Naive Bayes
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.metrics import classification_report  # laporan evaluasi

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# pola kalimat penipuan; {} diisi kata acak
penipuan_pola = ["selamat anda terpilih pemenang undian {} hadiah {}", "klaim hadiah {} anda segera hubungi {}",
                 "anda mendapat transfer {} silakan klik link {}", "pinjaman cair cepat tanpa jaminan {} hubungi {}",
                 "kode verifikasi anda {} jangan berikan ke siapapun kecuali {}",
                 "ini mama ganti nomor tolong kirim pulsa {} {}"]
# pola pesan normal
normal_pola = ["nanti {} jadi kumpul jam {}", "jangan lupa bawa {} besok ya {}", "rapat dipindah ke {} jam {}",
               "mama sudah sampai {} kabari {}", "tugas {} dikumpulkan hari {}", "makan siang di {} yuk {}",
               # pesan normal yang mirip penipuan (membuat tugas lebih sulit, seperti di dunia nyata)
               "sudah transfer uang arisan ke {} ya {}", "hadiah ulang tahun buat {} sudah dibeli {}",
               "link zoom rapat {} klik saja jam {}"]
# kata-kata pengisi
isian = ["bank", "mobil", "sekarang", "rumah", "kantor", "jumat", "laptop", "kamis", "nanti", "pak", "lima", "warung"]

def buat(pola, n):  # membuat n pesan dari pola acak
    # pilih pola, isi {} dengan dua kata acak
    return [rng.choice(pola).format(rng.choice(isian), rng.choice(isian)) for _ in range(n)]

sms = buat(penipuan_pola, 300) + buat(normal_pola, 700)  # 300 penipuan + 700 normal
label = ["penipuan"] * 300 + ["normal"] * 700  # label sesuai urutan
# 25% untuk uji, proporsi kelas dijaga
X_tr, X_te, y_tr, y_te = train_test_split(sms, label, test_size=0.25, stratify=label, random_state=0)

# ngram_range=(1, 2): pakai kata tunggal dan pasangan kata
model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), MultinomialNB(alpha=0.5)).fit(X_tr, y_tr)
print(classification_report(y_te, model.predict(X_te)))  # nilai model di data uji

vec, nb = model  # ambil dua langkah pipeline
kata = vec.get_feature_names_out()  # daftar kata/frasa yang dikenali
selisih = nb.feature_log_prob_[1] - nb.feature_log_prob_[0]   # penipuan vs normal
# 8 kata yang paling khas penipuan
print("Kata paling 'penipuan':", list(kata[np.argsort(-selisih)[:8]]))

# Catatan: data simulasi ini rapi sehingga skornya sempurna. Data SMS nyata biasanya 90-98%.
# Uji pesan baru, termasuk pesan "jebakan" yang mirip penipuan:
# uji beberapa pesan baru
for s in ["selamat anda menang hadiah motor klik link", "besok rapat jam sembilan ya",
          "sudah transfer uang arisan, cek ya", "hubungi saya kalau sudah sampai"]:
    # peluang kelas 'penipuan'
    p = model.predict_proba([s])[0][list(model.classes_).index("penipuan")]
    print(f"{s!r:48s} -> P(penipuan)={p:.2f}")  # tampilkan`,
    },
  },
  'decision-tree': {
    steps: [
      ['Siapkan data', 'Tree tidak butuh scaling; kategori cukup di-encode.'],
      ['Batasi kompleksitas', 'Atur `max_depth`, `min_samples_leaf` untuk mencegah overfitting.'],
      ['Latih', '`DecisionTreeClassifier(max_depth=3)`.'],
      ['Visualisasikan', '`plot_tree` atau `export_text` untuk melihat aturan yang dipelajari.'],
      ['Evaluasi dengan CV', 'Tuning `max_depth` agar seimbang antara akurasi dan keterbacaan.'],
      ['Ubah jadi aturan bisnis', 'Setiap jalur dari akar ke daun = satu aturan if-then.'],
    ],
    case: {
      title: 'Aturan prioritas penanganan pasien IGD (triase)',
      situation: 'Rumah sakit ingin aturan triase yang konsisten dan bisa diperiksa dokter, dipelajari dari data keputusan triase sebelumnya.',
      steps: [
        'Fitur: denyut nadi, saturasi oksigen, suhu, skala nyeri, umur.',
        'Decision tree depth 3 → aturan yang bisa dibaca dokter.',
        'Bandingkan akurasi depth 3 vs tanpa batas (overfit).',
        'Cetak aturan sebagai teks.',
      ],
      result: 'Aturan sederhana dan bisa diaudit, misalnya "saturasi < 92 → prioritas tinggi", akurasinya mendekati tree yang jauh lebih rumit.',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel
# decision tree + tampilan teks aturannya
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import cross_val_score  # cross-validation

rng = np.random.default_rng(5)  # generator acak dengan seed tetap
n = 1200  # 1200 pasien
df = pd.DataFrame({  # tanda vital pasien buatan
    "nadi":      rng.normal(90, 20, n).round(),
    "saturasi":  rng.normal(95, 3, n).clip(80, 100).round(),
    "suhu":      rng.normal(37.2, 0.9, n).round(1),
    "nyeri":     rng.integers(0, 11, n),
    "umur":      rng.integers(1, 90, n),
})
# aturan triase 'sebenarnya': kritis jika saturasi rendah atau nadi sangat cepat
prioritas = np.where((df.saturasi < 92) | (df.nadi > 130), "tinggi",
             np.where((df.nyeri >= 7) | (df.suhu >= 39), "sedang", "rendah"))
flip = rng.random(n) < 0.05                      # 5% keputusan tidak konsisten (noise)
# terapkan noise ke sebagian label
df["prioritas"] = np.where(flip, rng.choice(["tinggi", "sedang", "rendah"], n), prioritas)

X, y = df.drop(columns="prioritas"), df.prioritas  # fitur dan label
for d in [2, 3, None]:  # bandingkan beberapa kedalaman pohon
    # skor CV untuk setiap kedalaman
    print(f"max_depth={d}: akurasi CV {cross_val_score(DecisionTreeClassifier(max_depth=d, random_state=0), X, y, cv=5).mean():.3f}")

# model akhir: kedalaman 3 agar mudah dibaca dokter
tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(X, y)
print("\nAturan triase yang dipelajari:\n")  # judul
# cetak aturan if-then yang dipelajari
print(export_text(tree, feature_names=list(X.columns)))`,
    },
  },
  'random-forest': {
    steps: [
      ['Siapkan data tabel', 'Encode kategori; tidak perlu scaling.'],
      ['Latih dengan setelan default yang baik', '`n_estimators=300`, `n_jobs=-1`.'],
      ['Evaluasi dengan CV atau OOB', '`oob_score=True` memberi estimasi skor gratis dari data yang tidak terpilih bootstrap.'],
      ['Tuning ringan', '`max_depth`, `min_samples_leaf`, `max_features`.'],
      ['Feature importance', 'Lihat fitur paling berpengaruh; konfirmasi dengan permutation importance.'],
      ['Gunakan probabilitas', '`predict_proba` untuk skor risiko.'],
    ],
    case: {
      title: 'Prediksi mesin pabrik yang akan rusak (predictive maintenance)',
      situation: 'Pabrik tekstil ingin tahu mesin mana yang kemungkinan rusak dalam 7 hari berdasarkan data sensor, agar perawatan dijadwalkan sebelum mesin mati mendadak.',
      steps: [
        'Fitur sensor: suhu, getaran, jam operasi sejak servis, tekanan oli.',
        'Random forest dengan class_weight balanced (kerusakan jarang).',
        'Evaluasi recall kelas "rusak".',
        'Feature importance untuk tim teknisi.',
      ],
      result: 'Teknisi mendapat daftar mesin berisiko + alasan utamanya (getaran & jam operasi), sehingga perawatan bisa diprioritaskan.',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel
from sklearn.ensemble import RandomForestClassifier  # random forest
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.metrics import classification_report  # laporan evaluasi

rng = np.random.default_rng(11)  # generator acak dengan seed tetap
n = 3000  # 3000 catatan mesin
df = pd.DataFrame({  # data sensor buatan
    "suhu":           rng.normal(70, 8, n).round(1),
    "getaran":        rng.gamma(2, 1.5, n).round(2),
    "jam_sejak_servis": rng.integers(0, 2000, n),
    "tekanan_oli":    rng.normal(4, 0.6, n).round(2),
})
# skor risiko kerusakan dari kondisi mesin
risiko = 0.002 * df.jam_sejak_servis + 0.9 * df.getaran + 0.05 * (df.suhu - 70) - 1.2 * (df.tekanan_oli - 4) - 8
# ubah skor menjadi peluang, lalu acak mesin yang rusak
df["rusak_7_hari"] = (rng.random(n) < 1 / (1 + np.exp(-risiko))).astype(int)
print("Proporsi rusak:", df.rusak_7_hari.mean().round(3))  # persentase mesin rusak

X, y = df.drop(columns="rusak_7_hari"), df.rusak_7_hari  # fitur dan label
# 25% uji, proporsi rusak dijaga
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, test_size=0.25, random_state=0)
# 300 pohon; class_weight menyeimbangkan kelas rusak yang sedikit
rf = RandomForestClassifier(n_estimators=300, min_samples_leaf=3, class_weight="balanced",
                            # oob_score: skor gratis dari data yang tidak terpilih bootstrap
                            oob_score=True, random_state=0).fit(X_tr, y_tr)
print("OOB score:", round(rf.oob_score_, 3))  # skor OOB
# nilai model di data uji
print(classification_report(y_te, rf.predict(X_te), target_names=["normal", "rusak"]))

print("Faktor paling berpengaruh:")  # seberapa penting setiap sensor
# urutkan dari yang paling penting
for imp, nama in sorted(zip(rf.feature_importances_, X.columns), reverse=True):
    # batang sebanding dengan tingkat kepentingan
    print(f"  {nama:17s} {'█' * int(imp * 50)} {imp:.2f}")

# tambahkan kolom peluang rusak
X_te = X_te.assign(risiko=rf.predict_proba(X_te)[:, 1].round(2))
# 5 mesin yang paling perlu diperiksa
print("\n5 mesin dengan risiko tertinggi:\n", X_te.nlargest(5, "risiko"))`,
    },
  },
  'gradient-boosting': {
    steps: [
      ['Siapkan data tabel', 'Boosting modern (HistGradientBoosting/LightGBM/XGBoost) bisa menangani nilai kosong.'],
      ['Siapkan data validasi', 'Untuk early stopping.'],
      ['Atur learning rate kecil', '0.03–0.1; lebih kecil = lebih banyak tree tetapi biasanya lebih akurat.'],
      ['Gunakan early stopping', 'Berhenti saat skor validasi tidak membaik.'],
      ['Tuning', '`max_depth`/`max_leaf_nodes`, `min_samples_leaf`, regularisasi L2.'],
      ['Bandingkan dengan random forest', 'Pastikan peningkatannya sepadan dengan usaha tuning.'],
    ],
    case: {
      title: 'Prediksi jumlah pesanan harian restoran untuk persiapan bahan',
      situation: 'Restoran sering kelebihan atau kekurangan bahan. Mereka ingin prediksi jumlah porsi harian dari hari, cuaca, libur, dan promo, agar belanja bahan pas.',
      steps: [
        'Data 2 tahun: hari dalam minggu, bulan, libur, hujan, promo, suhu.',
        'Split berdasarkan waktu: 1,5 tahun latih, sisanya uji.',
        'HistGradientBoostingRegressor dengan early stopping.',
        'Bandingkan MAE dengan baseline "rata-rata hari yang sama minggu lalu".',
      ],
      result: 'Prediksi lebih akurat dari kebiasaan lama, sehingga bahan terbuang berkurang.',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel & tanggal
from sklearn.ensemble import HistGradientBoostingRegressor  # gradient boosting yang cepat
from sklearn.metrics import mean_absolute_error  # ukuran error

rng = np.random.default_rng(2)  # generator acak dengan seed tetap
tgl = pd.date_range("2024-01-01", periods=730)  # 730 hari berturut-turut
df = pd.DataFrame({"tanggal": tgl})  # tabel berisi tanggal
df["hari"] = df.tanggal.dt.dayofweek  # hari dalam minggu (0 = Senin)
df["bulan"] = df.tanggal.dt.month  # bulan (1 sampai 12)
df["libur"] = (rng.random(730) < 0.05).astype(int)  # 5% hari libur
# musim hujan lebih sering hujan
df["hujan"] = (rng.random(730) < np.where(df.bulan.isin([11, 12, 1, 2, 3]), 0.6, 0.2)).astype(int)
df["promo"] = (rng.random(730) < 0.15).astype(int)  # 15% hari ada promo
# jumlah porsi terjual: dipengaruhi akhir pekan, libur, hujan, promo, musim
df["porsi"] = (120 + 60 * (df.hari >= 5) + 50 * df.libur - 35 * df.hujan + 40 * df.promo
               + 10 * np.sin(df.bulan / 12 * 2 * np.pi) + rng.normal(0, 12, 730)).round()

fitur = ["hari", "bulan", "libur", "hujan", "promo"]  # kolom yang dipakai sebagai fitur
latih, uji = df.iloc[:550], df.iloc[550:]             # split berdasarkan waktu

# learning rate kecil + banyak pohon + early stopping
model = HistGradientBoostingRegressor(learning_rate=0.05, max_iter=500, early_stopping=True,
                                      validation_fraction=0.15, random_state=0)
model.fit(latih[fitur], latih.porsi)  # latih
pred = model.predict(uji[fitur])  # tebak data uji
# jumlah pohon yang benar-benar dipakai
print("Jumlah tree terpakai (early stopping):", model.n_iter_)

baseline = df.porsi.shift(7).iloc[550:]                # "sama dengan minggu lalu"
# error jika menebak 'sama dengan minggu lalu'
print(f"MAE baseline minggu lalu: {mean_absolute_error(uji.porsi, baseline):.1f} porsi")
# error model
print(f"MAE gradient boosting   : {mean_absolute_error(uji.porsi, pred):.1f} porsi")

besok = pd.DataFrame([[5, 12, 0, 1, 1]], columns=fitur)   # Sabtu, Desember, hujan, ada promo
# tebak penjualan untuk skenario tersebut
print(f"\nPrediksi Sabtu hujan + promo: {model.predict(besok)[0]:.0f} porsi")`,
    },
  },
  svm: {
    steps: [
      ['Siapkan fitur numerik', 'Encode kategori.'],
      ['Scaling wajib', 'Bungkus `StandardScaler` + `SVC` dalam pipeline.'],
      ['Mulai dengan kernel RBF', 'Default yang kuat; coba linear jika fitur sangat banyak (teks).'],
      ['Tuning C dan gamma', 'GridSearchCV dengan skala logaritmik (0.1, 1, 10, 100).'],
      ['Probabilitas (opsional)', '`SVC(probability=True)` jika butuh skor; lebih lambat.'],
      ['Evaluasi', 'Confusion matrix & F1 di data uji.'],
    ],
    case: {
      title: 'Deteksi kecurangan nilai ujian online dari pola pengerjaan',
      situation: 'Platform ujian online ingin menandai sesi yang mencurigakan berdasarkan pola: waktu rata-rata per soal, jumlah pindah tab, variasi waktu, dan skor.',
      steps: [
        'Data sesi ujian berlabel (hasil investigasi pengawas).',
        'Pipeline scaling + SVC, GridSearch C dan gamma.',
        'Evaluasi F1 kelas "curang".',
        'Sesi mencurigakan diteruskan ke pengawas untuk dicek manual.',
      ],
      result: 'Pengawas tidak perlu memeriksa semua sesi; hanya yang ditandai model.',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk ringkasan tabel
from sklearn.pipeline import make_pipeline  # merangkai scaler + model
from sklearn.preprocessing import StandardScaler  # penyeragam skala (wajib untuk SVM)
from sklearn.svm import SVC  # Support Vector Machine
# pencarian hyperparameter & pembagian data
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import classification_report  # laporan evaluasi

rng = np.random.default_rng(4)  # generator acak dengan seed tetap
def sesi(n, curang):  # membuat n sesi ujian buatan
    if curang:  # peserta curang: cepat, sering pindah tab, waktu seragam, skor tinggi
        # 4 fitur per sesi
        return np.c_[rng.normal(25, 10, n), rng.poisson(4, n), rng.normal(10, 5, n), rng.normal(85, 8, n)]
    # peserta normal
    return np.c_[rng.normal(42, 15, n), rng.poisson(1.5, n), rng.normal(18, 8, n), rng.normal(72, 12, n)]

X = np.vstack([sesi(900, False), sesi(100, True)])  # 900 normal + 100 curang
y = np.array([0] * 900 + [1] * 100)  # label: 0 = normal, 1 = curang
kolom = ["detik_per_soal", "pindah_tab", "variasi_waktu", "skor"]  # nama setiap fitur
# rata-rata setiap fitur per kelompok
print(pd.DataFrame(X, columns=kolom).groupby(y).mean().round(1).rename(index={0: "normal", 1: "curang"}), "\n")

# 30% untuk uji, proporsi dijaga
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, test_size=0.3, random_state=0)
# class_weight menyeimbangkan kelas curang yang sedikit
grid = GridSearchCV(make_pipeline(StandardScaler(), SVC(class_weight="balanced")),
                    # coba kombinasi C dan gamma; skor = f1
                    {"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.1, 0.01]}, cv=5, scoring="f1")
grid.fit(X_tr, y_tr)  # jalankan semua kombinasi
print("Parameter terbaik:", grid.best_params_)  # kombinasi terbaik
# nilai model terbaik di data uji
print(classification_report(y_te, grid.predict(X_te), target_names=["normal", "curang"]))`,
    },
  },
  kmeans: {
    steps: [
      ['Pilih fitur yang bermakna untuk pengelompokan', 'Hanya fitur yang relevan dengan tujuan segmentasi.'],
      ['Scaling', 'StandardScaler agar semua fitur setara.'],
      ['Tentukan K', 'Elbow method (inertia) dan/atau silhouette score untuk K = 2..10.'],
      ['Jalankan K-Means', '`KMeans(n_clusters=K, n_init=10, random_state=0)`.'],
      ['Profilkan setiap cluster', 'Rata-rata fitur per cluster (dalam skala asli) + jumlah anggota.'],
      ['Beri nama & tindakan', 'Terjemahkan cluster ke bahasa bisnis dan strategi.'],
    ],
    case: {
      title: 'Segmentasi member minimarket dengan RFM',
      situation: 'Minimarket ingin strategi promo berbeda per tipe pelanggan berdasarkan Recency (hari sejak belanja terakhir), Frequency (kunjungan/bulan), dan Monetary (rata-rata belanja).',
      steps: [
        'Hitung RFM tiap member.',
        'Scaling, lalu elbow + silhouette untuk memilih K.',
        'K-Means dengan K terpilih.',
        'Profil cluster & usulan strategi.',
      ],
      result: 'Empat segmen jelas, masing-masing dengan strategi promo berbeda.',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.cluster import KMeans  # K-Means
from sklearn.metrics import silhouette_score  # skor kualitas pengelompokan

rng = np.random.default_rng(8)  # generator acak dengan seed tetap
def grup(n, r, f, m):  # membuat n pelanggan dengan pola recency, frekuensi, belanja
    return np.c_[rng.normal(r, r * 0.3, n), rng.normal(f, f * 0.3, n), rng.normal(m, m * 0.25, n)]
# gabungkan 4 kelompok pelanggan buatan
X = np.abs(np.vstack([grup(300, 3, 12, 150), grup(250, 5, 4, 300), grup(200, 60, 2, 80), grup(250, 10, 10, 40)]))
# tabel RFM
df = pd.DataFrame(X.round(), columns=["recency_hari", "frekuensi_bln", "belanja_rb"])
Xs = StandardScaler().fit_transform(df)  # standarkan agar satuan berbeda tidak mendominasi

print("K  inertia  silhouette")  # judul tabel
for k in range(2, 8):  # coba jumlah segmen 2 sampai 7
    km = KMeans(k, n_init=10, random_state=0).fit(Xs)  # jalankan K-Means
    # inertia makin kecil = makin rapat; silhouette makin tinggi = makin terpisah
    print(f"{k}  {km.inertia_:7.0f}  {silhouette_score(Xs, km.labels_):.3f}")

km = KMeans(4, n_init=10, random_state=0).fit(Xs)  # model akhir dengan 4 segmen
df["segmen"] = km.labels_  # simpan nomor segmen setiap pelanggan
# profil rata-rata setiap segmen
profil = df.groupby("segmen").agg(jumlah=("recency_hari", "size"), recency=("recency_hari", "mean"),
                                  frekuensi=("frekuensi_bln", "mean"), belanja=("belanja_rb", "mean")).round(1)
print("\nProfil segmen:\n", profil)  # tampilkan profil

def nama(r):  # beri nama & strategi sesuai profil segmen
    if r.recency > 30: return "Hampir hilang -> voucher comeback"
    if r.belanja > 200: return "Belanja besar -> layanan premium"
    if r.frekuensi > 8 and r.belanja > 100: return "Loyal -> poin ganda"
    return "Sering tapi kecil -> promo bundling"
print()
for i, r in profil.iterrows():  # cetak strategi untuk setiap segmen
    print(f"Segmen {i}: {nama(r)}")  # nama segmen`,
    },
  },
  dbscan: {
    steps: [
      ['Scaling', 'Agar eps bermakna di semua fitur (untuk koordinat GPS cukup gunakan jarak haversine).'],
      ['Tentukan min_samples', 'Aturan praktis: 2 × jumlah dimensi, atau sesuai "minimal anggota kelompok" yang masuk akal.'],
      ['Tentukan eps', 'Plot jarak ke tetangga ke-k yang diurutkan (k-distance plot); pilih nilai di "siku".'],
      ['Jalankan DBSCAN', 'Label −1 = noise/outlier.'],
      ['Analisis cluster & noise', 'Noise sering justru yang paling menarik (anomali).'],
    ],
    case: {
      title: 'Menemukan titik rawan kecelakaan dari koordinat kejadian',
      situation: 'Dinas perhubungan punya koordinat 600 kecelakaan setahun dan ingin menemukan "titik rawan" (banyak kejadian berdekatan) tanpa menentukan jumlahnya di awal.',
      steps: [
        'Koordinat kejadian (dalam km dari pusat kota).',
        'k-distance plot untuk memilih eps.',
        'DBSCAN → cluster = titik rawan, noise = kejadian tersebar.',
        'Urutkan titik rawan berdasarkan jumlah kejadian.',
      ],
      result: 'Beberapa titik rawan teridentifikasi untuk prioritas pemasangan rambu & lampu; kejadian acak tidak dipaksa masuk cluster.',
      code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.cluster import DBSCAN  # DBSCAN
from sklearn.neighbors import NearestNeighbors  # untuk menghitung jarak ke tetangga

rng = np.random.default_rng(6)  # generator acak dengan seed tetap
rawan = [(2, 3), (-4, 1), (5, -3), (-1, -5)]  # pusat 4 titik rawan sebenarnya (km)
# kejadian yang mengumpul di sekitar setiap titik rawan
titik = [rng.normal(c, 0.25, (n, 2)) for c, n in zip(rawan, [120, 80, 60, 40])]
acak = rng.uniform(-8, 8, (300, 2))  # 300 kejadian tersebar acak
X = np.vstack(titik + [acak])          # koordinat (km)

# Memilih eps: jarak ke tetangga ke-5, diurutkan
# jarak setiap titik ke 5 tetangga terdekatnya
d, _ = NearestNeighbors(n_neighbors=5).fit(X).kneighbors(X)
fig, ax = plt.subplots(1, 2, figsize=(11, 4))  # dua grafik berdampingan
# urutkan jarak ke tetangga ke-5; garis merah = eps yang dipilih
ax[0].plot(np.sort(d[:, -1])); ax[0].axhline(0.35, ls="--", color="red")
ax[0].set_title("k-distance plot (pilih eps di 'siku')")  # judul

# label -1 = noise, 0, 1, 2, ... = nomor kelompok
label = DBSCAN(eps=0.35, min_samples=10).fit_predict(X)
# titik noise berwarna abu-abu
ax[1].scatter(*X[label == -1].T, s=6, c="lightgray", label="tersebar (noise)")
# titik yang masuk kelompok berwarna
ax[1].scatter(*X[label >= 0].T, s=8, c=label[label >= 0], cmap="tab10")
ax[1].set_title("Titik rawan kecelakaan"); ax[1].legend()  # judul dan legenda
plt.show()  # tampilkan

# jumlah kelompok & jumlah noise
print("Jumlah titik rawan:", label.max() + 1, "| kejadian tersebar:", (label == -1).sum())
# urutkan kelompok dari yang paling banyak kejadiannya
for k in sorted(set(label) - {-1}, key=lambda k: -(label == k).sum()):
    pusat = X[label == k].mean(axis=0)  # titik tengah kelompok
    # lokasi titik rawan
    print(f"Titik rawan {k}: {(label == k).sum():3d} kejadian di sekitar ({pusat[0]:.1f}, {pusat[1]:.1f}) km")`,
    },
  },
  pca: {
    steps: [
      ['Standarkan fitur', 'PCA sangat sensitif terhadap skala.'],
      ['Fit PCA dengan semua komponen', 'Lihat `explained_variance_ratio_`.'],
      ['Pilih jumlah komponen', 'Cukup untuk menyimpan 90–95% variasi, atau 2–3 untuk visualisasi.'],
      ['Transformasi data', '`fit_transform` pada latih, `transform` pada uji.'],
      ['Interpretasi komponen (opsional)', 'Lihat loading: fitur mana yang paling berkontribusi pada setiap komponen.'],
      ['Gunakan', 'Visualisasi, input model yang lebih ringkas, atau mengurangi noise.'],
    ],
    case: {
      title: 'Memetakan profil 34 provinsi dari 10 indikator',
      situation: 'Peneliti punya 10 indikator per provinsi (kemiskinan, IPM, akses internet, dan lain-lain) dan ingin melihat provinsi mana yang mirip dalam satu grafik 2D.',
      steps: [
        'Standarkan 10 indikator.',
        'PCA → cek berapa persen informasi tersimpan di 2 komponen.',
        'Plot provinsi di ruang PC1–PC2.',
        'Baca loading: PC1 kira-kira mewakili apa?',
      ],
      result: 'Dua komponen sudah menyimpan sebagian besar informasi; PC1 dapat diartikan sebagai "tingkat pembangunan".',
      code: py`
import numpy as np  # NumPy untuk data
import pandas as pd  # Pandas untuk tabel
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.preprocessing import StandardScaler  # penyeragam skala (wajib sebelum PCA)
from sklearn.decomposition import PCA  # PCA

rng = np.random.default_rng(9)  # generator acak dengan seed tetap
n = 34  # 34 provinsi
pembangunan = rng.normal(0, 1, n)            # faktor tersembunyi
pariwisata = rng.normal(0, 1, n)  # faktor tersembunyi kedua
df = pd.DataFrame({  # 10 indikator yang dipengaruhi kedua faktor tersembunyi
    "ipm":            70 + 4 * pembangunan + rng.normal(0, 1, n),
    "kemiskinan":     12 - 4 * pembangunan + rng.normal(0, 1.5, n),
    "akses_internet": 70 + 10 * pembangunan + rng.normal(0, 4, n),
    "lama_sekolah":   9 + 1.2 * pembangunan + rng.normal(0, .4, n),
    "pengangguran":   5 - 0.8 * pembangunan + rng.normal(0, .8, n),
    "hotel":          50 + 20 * pariwisata + rng.normal(0, 8, n),
    "wisatawan":      100 + 40 * pariwisata + rng.normal(0, 15, n),
    "restoran":       80 + 15 * pariwisata + 5 * pembangunan + rng.normal(0, 6, n),
    "harapan_hidup":  70 + 2 * pembangunan + rng.normal(0, 1, n),
    "rasio_dokter":   0.5 + 0.2 * pembangunan + rng.normal(0, .08, n),
}, index=[f"Prov-{i+1}" for i in range(n)])

Z = StandardScaler().fit_transform(df)  # standarkan semua kolom
pca = PCA().fit(Z)  # hitung semua komponen utama
# persentase informasi di 4 komponen pertama
print("Informasi per komponen:", (pca.explained_variance_ratio_[:4] * 100).round(1), "%")
# total informasi dari 2 komponen
print(f"2 komponen menyimpan {pca.explained_variance_ratio_[:2].sum():.0%} informasi\n")

# loading: seberapa kuat setiap indikator membentuk PC1 & PC2
loading = pd.DataFrame(pca.components_[:2].T, index=df.columns, columns=["PC1", "PC2"]).round(2)
print(loading.sort_values("PC1"))  # indikator yang searah akan berkumpul

XY = pca.transform(Z)[:, :2]  # posisi setiap provinsi di PC1 & PC2
plt.scatter(XY[:, 0], XY[:, 1])  # gambar sebagai titik
for nama, (a, b) in zip(df.index, XY):  # beri label nomor provinsi
    plt.annotate(nama.split("-")[1], (a, b), fontsize=7)
# label sumbu sesuai makna komponen
plt.xlabel("PC1 (pembangunan)"); plt.ylabel("PC2 (pariwisata)")
plt.title("Peta 34 provinsi dari 10 indikator"); plt.show()  # judul & tampilkan`,
    },
  },
  apriori: {
    steps: [
      ['Siapkan data transaksi', 'Satu baris = satu keranjang berisi daftar item.'],
      ['Tentukan min support', 'Misal 2–5%: kombinasi yang terlalu jarang diabaikan.'],
      ['Cari itemset yang sering muncul', 'Mulai dari 1 item, lalu 2, 3, … (prinsip Apriori: jika {A,B} jarang, {A,B,C} pasti jarang).'],
      ['Bentuk aturan', 'Dari itemset {A,B}: A→B dan B→A.'],
      ['Filter dengan confidence & lift', 'Lift > 1 berarti hubungan nyata, bukan karena item populer saja.'],
      ['Ubah jadi tindakan', 'Penataan rak, bundling, rekomendasi.'],
    ],
    case: {
      title: 'Penataan rak & paket hemat di minimarket',
      situation: 'Minimarket punya 2.000 struk dan ingin tahu produk mana yang sering dibeli bersama untuk membuat paket hemat dan mendekatkan raknya.',
      steps: [
        'Data keranjang belanja.',
        'Hitung support item & pasangan item.',
        'Bentuk aturan, hitung confidence & lift.',
        'Ambil aturan dengan lift tertinggi sebagai usulan paket.',
      ],
      result: 'Aturan seperti "mi instan → telur (lift tinggi)" menjadi dasar paket hemat dan penataan rak.',
      code: py`
import numpy as np  # NumPy untuk acak
import pandas as pd  # Pandas untuk tabel aturan
from itertools import combinations  # membuat pasangan item
from collections import Counter  # menghitung kemunculan

rng = np.random.default_rng(12)  # generator acak dengan seed tetap
# daftar produk minimarket
produk = ["mi instan", "telur", "roti", "selai", "susu", "kopi", "gula", "sabun", "sampo", "air mineral"]
transaksi = []  # tempat menampung transaksi
for _ in range(2000):  # buat 2000 transaksi
    # 1 sampai 3 produk acak per keranjang
    k = set(rng.choice(produk, rng.integers(1, 4), replace=False))
    # pola yang sengaja disisipkan: mi instan sering dibeli dengan telur
    if "mi instan" in k and rng.random() < 0.6: k.add("telur")
    if "roti" in k and rng.random() < 0.55: k.add("selai")  # roti sering bersama selai
    if "kopi" in k and rng.random() < 0.5: k.add("gula")  # kopi sering bersama gula
    if "sabun" in k and rng.random() < 0.35: k.add("sampo")  # sabun kadang bersama sampo
    transaksi.append(k)  # simpan transaksinya

n = len(transaksi)  # jumlah transaksi
c1 = Counter(i for t in transaksi for i in t)  # frekuensi setiap produk
# frekuensi setiap pasangan produk
c2 = Counter(p for t in transaksi for p in combinations(sorted(t), 2))

aturan = []  # daftar aturan
for (a, b), c in c2.items():  # periksa setiap pasangan
    if c / n < 0.02:                       # min support 2%
        continue  # lewati pasangan yang jarang
    for x, y in [(a, b), (b, a)]:  # dua arah aturan
        conf = c / c1[x]  # confidence: dari pembeli x, berapa persen juga membeli y
        # simpan aturan + ukurannya
        aturan.append({"jika beli": x, "maka beli": y, "support": c / n,
                       # lift > 1 berarti lebih sering dari kebetulan
                       "confidence": conf, "lift": conf / (c1[y] / n)})

# urutkan dari lift tertinggi
df = pd.DataFrame(aturan).sort_values("lift", ascending=False)
print(df.head(8).round(3).to_string(index=False))  # 8 aturan teratas
print("\nUsulan paket hemat:")
# aturan kuat (lift > 1.5) dijadikan usulan paket
for _, r in df[df.lift > 1.5].drop_duplicates("support").head(4).iterrows():
    # cetak usulan
    print(f"  Paket {r['jika beli']} + {r['maka beli']} (lift {r['lift']:.1f})")`,
    },
  },
  mlp: {
    steps: [
      ['Siapkan & scaling data', 'Neural network sangat sensitif terhadap skala input.'],
      ['Rancang arsitektur', 'Mulai 1–2 hidden layer (64–128 neuron), ReLU.'],
      ['Pilih loss & optimizer', 'Cross-entropy/MSE; Adam.'],
      ['Latih dengan validasi', 'Pantau loss latih vs validasi; gunakan early stopping.'],
      ['Regularisasi bila overfit', 'alpha (L2), dropout (di PyTorch), kurangi neuron.'],
      ['Evaluasi & bandingkan', 'Dengan model lebih sederhana (logistic regression, random forest).'],
    ],
    case: {
      title: 'Membaca digit nomor meteran air dari foto',
      situation: 'PDAM ingin petugas cukup memotret meteran, lalu angka terbaca otomatis. Langkah awal: mengenali digit tunggal yang sudah dipotong.',
      steps: [
        'Dataset digit 8×8 (simulasi potongan foto).',
        'Bandingkan logistic regression vs MLP.',
        'MLP dengan early stopping.',
        'Tampilkan digit yang salah tebak untuk analisis.',
      ],
      result: 'MLP lebih akurat dari model linear; contoh yang salah menunjukkan data seperti apa yang perlu ditambah.',
      code: py`
import numpy as np  # NumPy untuk array
import matplotlib.pyplot as plt  # Matplotlib untuk menampilkan gambar
from sklearn.datasets import load_digits  # dataset gambar angka 8x8
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.linear_model import LogisticRegression  # model pembanding sederhana
from sklearn.neural_network import MLPClassifier  # neural network

digits = load_digits()  # muat data
# bagi fitur, label, dan gambarnya sekaligus
X_tr, X_te, y_tr, y_te, img_tr, img_te = train_test_split(
    digits.data, digits.target, digits.images, test_size=0.3, random_state=0)
sc = StandardScaler().fit(X_tr)  # pelajari skala dari data latih
X_tr, X_te = sc.transform(X_tr), sc.transform(X_te)  # terapkan ke latih & uji

lin = LogisticRegression(max_iter=2000).fit(X_tr, y_tr)  # model linear sebagai baseline
# MLP 2 hidden layer; early_stopping berhenti saat skor validasi tidak membaik
mlp = MLPClassifier(hidden_layer_sizes=(128, 64), early_stopping=True, max_iter=500, random_state=0).fit(X_tr, y_tr)
print(f"Logistic regression: {lin.score(X_te, y_te):.3f}")  # akurasi baseline
# akurasi MLP dan jumlah epoch yang dipakai
print(f"MLP (128-64)       : {mlp.score(X_te, y_te):.3f}  (berhenti di epoch {mlp.n_iter_})")

pred = mlp.predict(X_te)  # tebakan MLP
salah = np.where(pred != y_te)[0][:6]  # indeks 6 gambar yang salah tebak
fig, ax = plt.subplots(1, len(salah), figsize=(10, 2.2))  # satu kotak per gambar
for a, i in zip(np.atleast_1d(ax), salah):  # tampilkan setiap gambar yang salah
    # gambar + label asli vs tebakan
    a.imshow(img_te[i], cmap="gray_r"); a.set_title(f"asli {y_te[i]}, tebak {pred[i]}", fontsize=9); a.axis("off")
plt.suptitle("Contoh yang salah tebak"); plt.show()  # judul & tampilkan`,
    },
  },
  cnn: {
    steps: [
      ['Kumpulkan & label gambar', 'Folder per kelas; minimal ratusan per kelas (atau gunakan transfer learning).'],
      ['Preprocessing', 'Ukuran seragam, normalisasi piksel, augmentasi untuk data latih.'],
      ['Rancang/ambil arsitektur', 'Blok Conv-ReLU-Pool berulang, atau model pretrained (ResNet/EfficientNet).'],
      ['Latih di GPU', 'Adam, cross-entropy, early stopping, simpan checkpoint terbaik.'],
      ['Evaluasi', 'Confusion matrix untuk melihat kelas yang sering tertukar.'],
      ['Iterasi data', 'Tambah data untuk kelas/kondisi yang lemah; deploy.'],
    ],
    case: {
      title: 'Kontrol kualitas: mendeteksi ubin keramik retak',
      situation: 'Pabrik keramik ingin kamera di jalur produksi mendeteksi ubin retak secara otomatis. Retak berupa garis tipis gelap, yang merupakan pola lokal dan cocok untuk filter konvolusi.',
      steps: [
        'Gambar ubin 16×16 (simulasi): mulus vs ada garis retak.',
        'Filter konvolusi pendeteksi tepi diterapkan (seperti layer pertama CNN).',
        'Fitur hasil konvolusi + pooling → klasifikasi.',
        'Bandingkan dengan klasifikasi langsung dari piksel mentah.',
      ],
      result: 'Fitur hasil konvolusi jauh lebih informatif daripada piksel mentah, dan itulah alasan CNN unggul untuk gambar. Di produksi, filternya dipelajari otomatis dengan PyTorch.',
      code: py`
import numpy as np  # NumPy untuk gambar
import matplotlib.pyplot as plt  # Matplotlib untuk menampilkan
from sklearn.linear_model import LogisticRegression  # model klasifikasi
from sklearn.model_selection import train_test_split  # membagi data

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
def ubin(retak):  # membuat gambar ubin 16x16
    g = 0.8 + rng.normal(0, 0.06, (16, 16))  # ubin polos (abu terang) + sedikit noise
    if retak:                                   # garis retak acak (posisi & arah berbeda-beda)
        # titik awal dan arah retak acak
        r, c = rng.integers(2, 14, 2); dr, dc = rng.choice([-1, 0, 1], 2)
        dr = dr or 1  # pastikan retak bergerak ke bawah/atas
        for _ in range(rng.integers(5, 10)):  # panjang retak 5 sampai 9 piksel
            # gelapkan piksel di jalur retak
            if 0 <= r < 16 and 0 <= c < 16: g[r, c] -= 0.35
            r += dr; c += dc  # lanjutkan ke piksel berikutnya
    return g  # kembalikan gambarnya

y = rng.integers(0, 2, 600)  # label acak: 1 = retak, 0 = mulus
imgs = np.array([ubin(t) for t in y])  # buat 600 gambar

def conv(img, k):  # konvolusi 3x3 dari nol (hasil 14x14)
    # kalikan potongan dengan kernel lalu jumlahkan
    return np.array([[np.sum(img[i:i+3, j:j+3] * k) for j in range(14)] for i in range(14)])
kernel = np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]])      # pendeteksi titik/garis
def fitur_cnn(img):  # fitur ala CNN: konvolusi -> ReLU -> pooling
    f = np.maximum(0, -conv(img, kernel))                         # konvolusi + ReLU (bagian gelap)
    return f.reshape(7, 2, 7, 2).max(axis=(1, 3)).ravel()         # max pooling 2x2

X_raw = imgs.reshape(len(imgs), -1)  # pendekatan 1: semua piksel mentah sebagai fitur
X_cnn = np.array([fitur_cnn(i) for i in imgs])  # pendekatan 2: fitur hasil konvolusi
# bandingkan keduanya
for nama, X in [("Piksel mentah", X_raw), ("Fitur konvolusi", X_cnn)]:
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)  # bagi data
    # latih dan nilai model yang sama dengan fitur berbeda
    print(f"{nama:15s}: akurasi {LogisticRegression(max_iter=2000).fit(X_tr, y_tr).score(X_te, y_te):.3f}")

i = np.where(y == 1)[0][0]  # ambil satu contoh ubin retak
fig, ax = plt.subplots(1, 2, figsize=(6, 3))  # dua gambar berdampingan
ax[0].imshow(imgs[i], cmap="gray"); ax[0].set_title("Ubin retak")  # gambar asli
# peta fitur: bagian retak menyala
ax[1].imshow(fitur_cnn(imgs[i]).reshape(7, 7), cmap="hot"); ax[1].set_title("Setelah konvolusi+pooling")
for a in ax: a.axis("off")  # sembunyikan sumbu
plt.show()  # tampilkan`,
    },
  },
  rnn: {
    steps: [
      ['Susun data berurutan', 'Urutkan menurut waktu; tangani nilai hilang.'],
      ['Buat jendela (window)', 'N langkah terakhir → target langkah berikutnya (atau beberapa langkah).'],
      ['Normalisasi', 'Gunakan statistik data latih saja.'],
      ['Split berdasarkan waktu', 'Jangan diacak.'],
      ['Latih model', 'LSTM/GRU (PyTorch) atau model sederhana berbasis jendela sebagai pembanding.'],
      ['Bandingkan dengan baseline naif', '"Besok = hari ini" atau "sama dengan minggu lalu".'],
    ],
    case: {
      title: 'Prediksi jumlah pengunjung harian tempat wisata',
      situation: 'Pengelola tempat wisata ingin memprediksi pengunjung besok agar jumlah petugas & stok tiket pas. Pola: ramai akhir pekan, naik saat musim liburan.',
      steps: [
        'Data pengunjung harian 2 tahun.',
        'Jendela 14 hari terakhir + hari dalam minggu → pengunjung besok.',
        'Split waktu; model berbasis jendela (konsep sama dengan RNN: melihat urutan sebelumnya).',
        'Bandingkan dengan baseline "sama dengan minggu lalu".',
      ],
      result: 'Model yang memanfaatkan urutan mengalahkan baseline. Untuk data lebih kompleks, LSTM di PyTorch memakai alur data yang persis sama.',
      code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.neural_network import MLPRegressor  # neural network untuk regresi
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.metrics import mean_absolute_error  # ukuran error

# 1. Data pengunjung harian 2 tahun (simulasi): ramai akhir pekan + musim liburan + tren
rng = np.random.default_rng(1)  # generator acak dengan seed tetap
hari = np.arange(730)  # 730 hari
dow = hari % 7  # hari dalam minggu (0 sampai 6)
# pengunjung: ramai akhir pekan + musiman + tren + noise
pengunjung = (500 + 400 * (dow >= 5) + 250 * np.sin(2 * np.pi * hari / 365) ** 2
              + np.cumsum(rng.normal(0, 4, 730)) + rng.normal(0, 40, 730)).clip(100)

# 2. Jendela: 14 hari terakhir + hari dalam minggu -> pengunjung besok
W = 14  # panjang jendela (hari)
# setiap baris: 14 hari terakhir + one-hot hari dalam minggu
X = np.array([np.r_[pengunjung[i - W:i], np.eye(7)[dow[i]]] for i in range(W, 730)])
y = pengunjung[W:]  # target: pengunjung hari berikutnya

# 3. Split berdasarkan waktu (tidak diacak!) + normalisasi dari data latih saja
batas = 550  # 550 hari pertama untuk latih, sisanya uji
sx = StandardScaler().fit(X[:batas])  # skala fitur dari data latih
sy = StandardScaler().fit(y[:batas, None])  # skala target dari data latih
# jaringan kecil dengan regularisasi (alpha)
model = MLPRegressor(hidden_layer_sizes=(32,), alpha=1.0, max_iter=3000, random_state=0)
# latih dengan data yang sudah diskalakan
model.fit(sx.transform(X[:batas]), sy.transform(y[:batas, None]).ravel())
# tebak lalu kembalikan ke satuan 'orang'
pred = sy.inverse_transform(model.predict(sx.transform(X[batas:]))[:, None]).ravel()

# 4. Bandingkan dengan baseline naif
baseline = pengunjung[W + batas - 7: 730 - 7]           # "sama dengan minggu lalu"
# error baseline
print(f"MAE baseline (minggu lalu): {mean_absolute_error(y[batas:], baseline):.0f} orang")
# error model
print(f"MAE model urutan          : {mean_absolute_error(y[batas:], pred):.0f} orang")

plt.figure(figsize=(10, 3.5))  # ukuran grafik
plt.plot(y[batas:batas + 60], label="aktual")  # data asli
plt.plot(pred[:60], "--", label="prediksi model")  # tebakan model
plt.plot(baseline[:60], ":", label="baseline minggu lalu", alpha=.7)  # tebakan baseline
plt.legend(); plt.title("60 hari pertama data uji"); plt.show()  # legenda, judul, tampilkan`,
    },
  },
  transformer: {
    steps: [
      ['Pilih pendekatan', 'Pakai via API (LLM), pakai model pretrained (Hugging Face), atau fine-tune. Hampir tidak pernah melatih dari nol.'],
      ['Tokenisasi', 'Gunakan tokenizer milik model yang sama.'],
      ['Embedding + posisi', 'Token → vektor + informasi urutan.'],
      ['Self-attention berlapis', 'Setiap token mengumpulkan informasi dari token lain yang relevan.'],
      ['Head sesuai tugas', 'Klasifikasi (encoder), embedding untuk pencarian, atau generasi teks (decoder).'],
      ['Evaluasi', 'Dengan data uji yang mewakili kasus nyata.'],
    ],
    case: {
      title: 'Bagaimana model memahami kata "bisa" yang ambigu?',
      situation: 'Kata "bisa" berarti "dapat" ("saya bisa datang") atau "racun" ("bisa ular"). Model berbasis kata tunggal tidak bisa membedakannya; attention mengambil makna dari kata-kata di sekitarnya.',
      steps: [
        'Embedding mainan dengan dimensi [kemampuan, hewan, aksi, ...].',
        'Self-attention dihitung untuk dua kalimat berbeda.',
        'Bandingkan: kata "bisa" memperhatikan kata apa di tiap kalimat?',
        'Representasi baru "bisa" menjadi berbeda tergantung konteks.',
      ],
      result: 'Representasi "bisa" bergeser ke arah "hewan" di kalimat ular dan ke "aksi" di kalimat datang. Inilah kekuatan Transformer: makna kata bergantung pada konteks.',
      code: py`
import numpy as np  # NumPy untuk vektor

def softmax(z):  # softmax per baris
    # stabil: kurangi maksimum, lalu bagi total
    e = np.exp(z - z.max(-1, keepdims=True)); return e / e.sum(-1, keepdims=True)

# Dimensi embedding mainan: [kemampuan, hewan, bahaya, aksi]
emb = {  # vektor kata buatan
    "saya":  np.array([0.2, 0.0, 0.0, 0.3]),
    "bisa":  np.array([0.6, 0.4, 0.4, 0.2]),     # ambigu
    "datang":np.array([0.3, 0.0, 0.0, 1.0]),
    "besok": np.array([0.1, 0.0, 0.0, 0.4]),
    "ular":  np.array([0.0, 1.0, 0.6, 0.0]),
    "itu":   np.array([0.1, 0.1, 0.1, 0.1]),
    "mematikan": np.array([0.0, 0.3, 1.0, 0.2]),
}

def self_attention(kalimat):  # self-attention sederhana
    X = np.array([emb[k] for k in kalimat])  # susun vektor setiap kata
    bobot = softmax(X @ X.T * 3)                 # Q = K = V = X agar mudah dipahami
    return bobot, bobot @ X  # bobot dan hasil campuran informasi

# kata 'bisa' dalam dua konteks berbeda
for kalimat in [["saya", "bisa", "datang", "besok"], ["bisa", "ular", "itu", "mematikan"]]:
    bobot, out = self_attention(kalimat)  # hitung attention
    i = kalimat.index("bisa")  # posisi kata 'bisa'
    print("Kalimat:", " ".join(kalimat))  # tampilkan kalimatnya
    for k, b in zip(kalimat, bobot[i]):  # seberapa besar 'bisa' memperhatikan setiap kata
        # batang sebanding dengan bobot
        print(f"   'bisa' -> {k:10s} {'█' * int(b * 30)} {b:.2f}")
    # makna 'bisa' berubah sesuai konteks
    print("   Vektor 'bisa' baru [kemampuan, hewan, bahaya, aksi]:", out[i].round(2), "\n")`,
    },
  },
  'a-star': {
    steps: [
      ['Modelkan peta sebagai graf/grid', 'Simpul = lokasi, sisi = jalan dengan biaya (jarak/waktu).'],
      ['Pilih heuristik', 'Perkiraan sisa jarak yang tidak berlebihan: Manhattan (grid 4 arah), Euclidean (garis lurus).'],
      ['Inisialisasi', 'Masukkan titik awal ke priority queue dengan f = h(awal).'],
      ['Ekspansi', 'Ambil f terkecil; jika tujuan → selesai; jika tidak, hitung g baru untuk tetangga dan masukkan ke antrian.'],
      ['Rekonstruksi rute', 'Ikuti catatan "datang dari mana" mundur dari tujuan.'],
      ['Bandingkan dengan BFS/Dijkstra', 'A* mengeksplorasi jauh lebih sedikit simpul.'],
    ],
    case: {
      title: 'Rute robot pengantar barang di gudang',
      situation: 'Robot di gudang harus mengambil barang di rak tertentu dengan rute terpendek, menghindari rak dan area terlarang. Jalan di lorong ramai lebih "mahal".',
      steps: [
        'Peta gudang 14×30 sebagai grid: # = rak, ~ = lorong ramai (biaya 3), . = jalan biasa (biaya 1).',
        'A* dengan heuristik Manhattan.',
        'Bandingkan jumlah sel yang dieksplorasi dengan Dijkstra (A* tanpa heuristik).',
        'Gambar rutenya.',
      ],
      result: 'A* menemukan rute dengan biaya minimum yang sama dengan Dijkstra (hanya melintasi lorong ramai sekali), tetapi mengeksplorasi jauh lebih sedikit sel karena heuristik mengarahkannya ke tujuan.',
      code: py`
import heapq  # antrian prioritas

# Peta gudang 14 x 30: # = rak, ~ = lorong ramai (biaya 3), . = jalan biasa (biaya 1)
R, C = 14, 30  # ukuran peta
grid = [["."] * C for _ in range(R)]  # awalnya semua jalan biasa
for c0 in [5, 11, 17, 23]:                       # deretan rak
    for r in range(2, 12):  # rak setinggi baris 2 sampai 11
        if r != 7:                               # celah tengah = lorong ramai
            grid[r][c0] = grid[r][c0 + 1] = "#"
for c in range(C):  # baris 7 dijadikan lorong ramai
    if grid[7][c] == ".":
        grid[7][c] = "~"
start, goal = (12, 0), (3, 29)  # posisi awal & tujuan
grid[start[0]][start[1]], grid[goal[0]][goal[1]] = "S", "G"  # tandai di peta
biaya = lambda p: 3 if grid[p[0]][p[1]] == "~" else 1  # biaya melewati sebuah sel

def a_star(pakai_heuristik=True):  # A* (atau Dijkstra jika heuristik dimatikan)
    # heuristik: jarak Manhattan ke tujuan
    h = (lambda p: abs(p[0] - goal[0]) + abs(p[1] - goal[1])) if pakai_heuristik else (lambda p: 0)
    # antrian, biaya terbaik g, asal setiap sel, sel yang sudah selesai
    antrian, g, asal, selesai = [(h(start), start)], {start: 0}, {}, set()
    while antrian:  # ulangi selama ada kandidat
        _, pos = heapq.heappop(antrian)  # ambil kandidat dengan f = g + h terkecil
        if pos in selesai:  # sudah diproses
            continue  # lewati
        selesai.add(pos)  # tandai selesai
        if pos == goal:  # sampai tujuan
            break  # berhenti
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:  # periksa 4 tetangga
            n = (pos[0] + dr, pos[1] + dc)  # posisi tetangga
            if 0 <= n[0] < R and 0 <= n[1] < C and grid[n[0]][n[1]] != "#":
                g_baru = g[pos] + biaya(n)  # biaya jika lewat sel ini
                # lebih murah dari yang pernah diketahui?
                if g_baru < g.get(n, float("inf")):
                    g[n], asal[n] = g_baru, pos  # simpan biaya dan asalnya
                    heapq.heappush(antrian, (g_baru + h(n), n))  # masukkan ke antrian
    rute, p = [], goal  # telusuri rute mundur dari tujuan
    while p != start:  # ikuti jejak asal
        rute.append(p); p = asal[p]  # tambahkan ke rute
    return rute[::-1], g[goal], len(selesai)  # rute, total biaya, jumlah sel yang diperiksa

rute, total, n_a = a_star(True)  # jalankan A*
_, total_d, n_d = a_star(False)  # jalankan Dijkstra sebagai pembanding
peta = [row[:] for row in grid]  # salin peta
for r, c in rute[:-1]:  # tandai rute
    peta[r][c] = "*"  # * = rute
print("\n".join("".join(r) for r in peta))  # cetak peta
# biaya keduanya sama
print(f"\nBiaya rute A*: {total} (Dijkstra: {total_d}) | panjang: {len(rute)} langkah")
# tapi A* memeriksa jauh lebih sedikit sel
print(f"Sel dieksplorasi -> A*: {n_a}, Dijkstra (tanpa heuristik): {n_d}")`,
    },
  },
  'q-learning': {
    steps: [
      ['Definisikan lingkungan', 'State (posisi/kondisi), aksi yang tersedia, dan aturan perpindahan.'],
      ['Rancang reward', 'Hadiah untuk tujuan, hukuman untuk hal yang dihindari, biaya kecil per langkah agar cepat.'],
      ['Inisialisasi tabel Q', 'Ukuran (jumlah state × jumlah aksi), isi nol.'],
      ['Loop episode', 'Pilih aksi (ε-greedy) → dapat reward & state baru → update Q.'],
      ['Kurangi eksplorasi bertahap', 'ε besar di awal (banyak mencoba), mengecil seiring waktu.'],
      ['Uji kebijakan', 'Jalankan agen dengan ε = 0 (selalu pilih aksi terbaik) dan lihat hasilnya.'],
    ],
    case: {
      title: 'Agen belajar menyeberangi danau es yang licin',
      situation: 'Agen di grid 4×4 harus mencapai tujuan tanpa jatuh ke lubang. Ia tidak diberi tahu peta; ia hanya belajar dari hadiah (+1 di tujuan) dan hukuman (−1 di lubang).',
      steps: [
        'Lingkungan grid dengan lubang (H) dan tujuan (G).',
        'Reward: +1 tujuan, −1 lubang, −0.01 per langkah.',
        'Q-learning 3.000 episode dengan ε menurun.',
        'Tampilkan kebijakan (arah panah terbaik di tiap kotak) dan tingkat keberhasilan.',
      ],
      result: 'Tanpa diberi peta, agen menemukan jalur aman menuju tujuan hanya dari pengalaman. Prinsip ini juga dipakai di robotika, game, dan RLHF.',
      code: py`
import numpy as np  # NumPy untuk tabel Q
rng = np.random.default_rng(0)  # generator acak dengan seed tetap

peta = ["S...",  # S = mulai, H = lubang, G = tujuan
        ".H.H",
        "...H",
        "H..G"]
N = 4  # ukuran peta 4x4
AKSI = [(-1, 0), (1, 0), (0, -1), (0, 1)]          # atas, bawah, kiri, kanan
PANAH = "↑↓←→"  # panah untuk menampilkan kebijakan

def langkah(s, a):  # fungsi lingkungan: lakukan aksi a di posisi s
    r, c = divmod(s, N)  # ubah nomor posisi menjadi baris & kolom
    # bergerak, tetapi tidak boleh keluar peta
    r = min(max(r + AKSI[a][0], 0), N - 1); c = min(max(c + AKSI[a][1], 0), N - 1)
    sel = peta[r][c]  # isi sel tujuan
    if sel == "G": return r * N + c, 1.0, True  # sampai tujuan: hadiah +1, episode selesai
    if sel == "H": return r * N + c, -1.0, True  # jatuh ke lubang: -1, episode selesai
    return r * N + c, -0.01, False  # langkah biasa: sedikit minus agar mencari jalan pendek

Q = np.zeros((N * N, 4))  # tabel Q: 16 posisi x 4 aksi
alpha, gamma = 0.1, 0.95  # kecepatan belajar & bobot masa depan
for ep in range(3000):  # 3000 episode
    eps = max(0.05, 1 - ep / 2000)                  # eksplorasi menurun
    s, selesai = 0, False  # mulai dari S
    for _ in range(50):  # maksimal 50 langkah per episode
        # eksplorasi (acak) atau eksploitasi (aksi terbaik)
        a = rng.integers(4) if rng.random() < eps else Q[s].argmax()
        s2, r, selesai = langkah(s, a)  # lakukan aksi
        # rumus Q-learning
        Q[s, a] += alpha * (r + gamma * Q[s2].max() * (not selesai) - Q[s, a])
        s = s2  # pindah posisi
        if selesai: break  # berhenti jika episode selesai

print("Kebijakan yang dipelajari:")  # tampilkan panah terbaik di setiap sel
for r in range(N):  # untuk setiap baris peta
    # cetak panah (kecuali di lubang & tujuan)
    print("  " + " ".join(peta[r][c] if peta[r][c] in "HG" else PANAH[Q[r * N + c].argmax()] for c in range(N)))

sukses = 0  # uji kebijakan 100 kali
for _ in range(100):
    s = 0
    for _ in range(20):  # maksimal 20 langkah
        s, rwd, done = langkah(s, Q[s].argmax())  # selalu pilih aksi terbaik
        if done: sukses += rwd > 0; break  # hitung yang berhasil sampai tujuan
print(f"\nTingkat keberhasilan: {sukses}%")  # persentase keberhasilan`,
    },
  },
}
