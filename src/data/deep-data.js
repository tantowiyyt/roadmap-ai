import { py } from './py.js'

// Pendalaman materi Matematika untuk AI dan Data Science Tools.

export const deepData = {
  // ---------------- Matematika ----------------
  'mat-vektor': {
    deep: {
      concepts: [
        ['Dot product = ukuran kemiripan arah', [
          '`a · b = Σ aᵢbᵢ = |a||b|cos θ`. Jika dua vektor searah, hasilnya besar positif; tegak lurus, nol; berlawanan, negatif.',
          'Inilah dasar **cosine similarity** yang dipakai untuk mencari dokumen mirip, rekomendasi, dan pencarian semantik di RAG: `cos θ = a·b / (|a||b|)`.',
        ]],
        ['Perkalian matriks = banyak dot product sekaligus', 'Elemen (i, j) dari `A @ B` adalah dot product baris ke-i A dengan kolom ke-j B. Syarat: jumlah kolom A = jumlah baris B. Satu layer neural network pada dasarnya `y = X @ W + b`, dihitung untuk seluruh batch sekaligus.'],
        ['Shape adalah segalanya', 'Data tabel berbentuk `(n_sampel, n_fitur)`. Batch gambar `(batch, channel, tinggi, lebar)`. Sebagian besar error deep learning adalah shape yang tidak cocok, jadi biasakan mencetak `.shape` di setiap langkah.'],
        ['Norm', 'Panjang vektor. L2 `√Σx²` (jarak lurus), L1 `Σ|x|` (jarak "blok kota"). Dipakai untuk jarak antar data (KNN), normalisasi embedding, dan regularisasi (Ridge = L2, Lasso = L1).'],
      ],
      examples: [
        {
          title: 'Cosine similarity untuk mencari kalimat paling mirip',
          code: py`
import numpy as np  # NumPy untuk vektor

# Vektor fitur sederhana: [olahraga, makanan, teknologi]
kalimat = {  # setiap kalimat diwakili vektor 3 angka
    "sepak bola seru":        np.array([0.9, 0.1, 0.0]),
    "resep nasi goreng":      np.array([0.0, 0.95, 0.1]),
    "laptop baru cepat":      np.array([0.05, 0.0, 0.9]),
    "makanan atlet sehat":    np.array([0.6, 0.7, 0.0]),
}
query = np.array([0.8, 0.3, 0.0])     # "berita olahraga"

def cosine(a, b):  # cosine similarity: kemiripan arah
    # dot product dibagi perkalian panjang
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

# urutkan kalimat dari yang paling mirip dengan query
for teks, v in sorted(kalimat.items(), key=lambda kv: -cosine(query, kv[1])):
    print(f"{cosine(query, v):.3f}  {teks}")  # cetak skor dan kalimatnya

# Satu layer neural network = perkalian matriks untuk satu batch
X = np.random.default_rng(0).normal(size=(4, 3))    # 4 sampel, 3 fitur
W = np.random.default_rng(1).normal(size=(3, 2))    # 3 input -> 2 neuron
b = np.zeros(2)  # bias untuk 2 neuron
# (4, 3) @ (3, 2) -> (4, 2): setiap sampel kini punya 2 nilai
print("Shape:", X.shape, "@", W.shape, "->", (X @ W + b).shape)`,
        },
      ],
      mistakes: [
        ['Memakai `*` untuk perkalian matriks di NumPy.', '`*` adalah perkalian per elemen. Perkalian matriks memakai `@` atau `np.dot`.'],
        ['Bingung shape `(3,)` dengan `(3, 1)`.', '`(3,)` adalah vektor 1D, `(3, 1)` matriks kolom. Pakai `reshape(-1, 1)` saat library meminta 2D.'],
        ['Membandingkan embedding dengan jarak Euclid padahal panjangnya berbeda-beda.', 'Pakai cosine similarity, atau normalisasi dulu ke panjang 1.'],
      ],
      tips: [
        'Gambarlah vektor 2D di kertas untuk membangun intuisi sebelum ke dimensi tinggi.',
        'Tonton seri "Essence of Linear Algebra" (3Blue1Brown) untuk intuisi visual.',
      ],
      check: [
        ['Matriks A berukuran (32, 784) dan W (784, 128). Berapa shape `A @ W`?', '(32, 128): 32 sampel, masing-masing kini punya 128 nilai.'],
        ['Cosine similarity dua vektor bernilai 0. Apa artinya?', 'Kedua vektor tegak lurus, artinya tidak ada kemiripan arah sama sekali.'],
      ],
    },
    exercise: {
      task: 'Hitung cosine similarity antara vektor `[1, 2, 3]` dan `[2, 4, 6]`, lalu antara `[1, 0]` dan `[0, 1]`. Jelaskan hasilnya.',
      hint: 'Pakai rumus `a @ b / (norm(a) * norm(b))` dengan `np.linalg.norm`.',
      solution: py`
import numpy as np  # NumPy untuk vektor

def cosine(a, b):  # fungsi cosine similarity
    a, b = np.array(a, float), np.array(b, float)  # pastikan input berupa array desimal
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))  # rumus cosine

print(cosine([1, 2, 3], [2, 4, 6]))   # 1.0 -> searah (hanya beda panjang)
print(cosine([1, 0], [0, 1]))         # 0.0 -> tegak lurus, tidak mirip`,
    },
  },
  'mat-aljabar': {
    deep: {
      concepts: [
        ['Matriks sebagai transformasi', 'Mengalikan vektor dengan matriks berarti memutar, meregangkan, atau memproyeksikan ruang. Neural network adalah tumpukan transformasi linear (matriks) yang diselingi fungsi non-linear (aktivasi).'],
        ['Eigenvector & eigenvalue', 'Eigenvector adalah arah yang **tidak berubah arah** saat ditransformasi, hanya diregangkan sebesar eigenvalue: `A v = λ v`. Pada matriks kovarians data, eigenvector dengan eigenvalue terbesar adalah arah variasi terbesar: itulah komponen utama di **PCA**.'],
        ['SVD (Singular Value Decomposition)', 'Setiap matriks bisa dipecah `A = U Σ Vᵀ`. Dengan hanya menyimpan k nilai singular terbesar, kita mendapat pendekatan terbaik berperingkat k. Dipakai untuk kompresi, sistem rekomendasi, PCA, dan ide dasar LoRA (update bobot berperingkat rendah).'],
        ['Invers dan sistem persamaan', 'Regresi linear punya solusi tertutup `w = (XᵀX)⁻¹Xᵀy`. Dalam praktik, gunakan `np.linalg.lstsq` atau `solve` yang lebih stabil secara numerik daripada menghitung invers langsung.'],
      ],
      examples: [
        {
          title: 'PCA dari nol dengan eigenvector, dan kompresi dengan SVD',
          code: py`
import numpy as np  # NumPy untuk aljabar linear

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# Data 2D yang memanjang miring (tinggi badan vs berat, sudah distandarkan)
x = rng.normal(size=300)  # 300 nilai acak
# kolom kedua = 0.8 x kolom pertama + noise (berkorelasi)
data = np.column_stack([x, 0.8 * x + rng.normal(scale=0.3, size=300)])
data -= data.mean(axis=0)  # geser agar rata-rata setiap kolom = 0

kov = np.cov(data, rowvar=False)  # matriks kovarians 2x2
# eigh: eigenvalue & eigenvector untuk matriks simetris
nilai_eigen, vektor_eigen = np.linalg.eigh(kov)
urut = np.argsort(nilai_eigen)[::-1]  # urutan dari eigenvalue terbesar
nilai_eigen, vektor_eigen = nilai_eigen[urut], vektor_eigen[:, urut]  # urutkan keduanya
# eigenvector pertama = arah sebaran terbesar
print("Arah variasi terbesar (PC1):", vektor_eigen[:, 0].round(3))
# persentase variasi di setiap arah
print("Proporsi variasi dijelaskan:", (nilai_eigen / nilai_eigen.sum()).round(3))

# Cek: A v = lambda v
v, lam = vektor_eigen[:, 0], nilai_eigen[0]  # ambil eigenvector & eigenvalue pertama
print("A@v == lambda*v ?", np.allclose(kov @ v, lam * v))  # buktikan definisi eigenvector

# SVD: kompresi matriks 50x40 berperingkat rendah + noise
# matriks 50x40 yang sebenarnya dibentuk dari 3 pola + noise
A = rng.normal(size=(50, 3)) @ rng.normal(size=(3, 40)) + 0.05 * rng.normal(size=(50, 40))
U, S, Vt = np.linalg.svd(A, full_matrices=False)  # pecah A = U x S x Vt
for k in (1, 3, 10):  # coba simpan k komponen saja
    Ak = U[:, :k] * S[:k] @ Vt[:k]  # rekonstruksi dengan k komponen
    err = np.linalg.norm(A - Ak) / np.linalg.norm(A)  # seberapa jauh dari matriks asli
    simpan = k * (50 + 40 + 1)  # jumlah angka yang perlu disimpan
    # k = 3 sudah hampir sempurna
    print(f"k={k:2d}: error relatif {err:.3f}, angka disimpan {simpan} dari {A.size}")`,
        },
      ],
      mistakes: [
        ['Menghitung `np.linalg.inv(X.T @ X) @ X.T @ y` untuk data nyata.', 'Pakai `np.linalg.lstsq(X, y)`: lebih stabil jika fitur saling berkorelasi.'],
        ['Menjalankan PCA tanpa standarisasi fitur.', 'Fitur berskala besar (gaji dalam rupiah) akan mendominasi. Standarkan dulu dengan `StandardScaler`.'],
      ],
      tips: [
        'Untuk matriks simetris (kovarians), pakai `np.linalg.eigh` — lebih cepat dan stabil daripada `eig`.',
        'Fokus pada intuisi geometris; perhitungan manual matriks besar tidak diperlukan di praktik.',
      ],
      check: [
        ['Apa hubungan eigenvector matriks kovarians dengan PCA?', 'Eigenvector adalah arah komponen utama, dan eigenvalue-nya menunjukkan berapa banyak variasi data di arah itu.'],
        ['Kenapa SVD berperingkat rendah relevan dengan LoRA?', 'LoRA mengasumsikan perubahan bobot saat fine-tuning bisa didekati dengan perkalian dua matriks kecil (peringkat rendah), sehingga parameter yang dilatih jauh lebih sedikit.'],
      ],
    },
    exercise: {
      task: 'Selesaikan sistem persamaan `2x + y = 5` dan `x - y = 1` dengan `np.linalg.solve`, lalu periksa jawabannya.',
      hint: 'Tulis sebagai `A @ [x, y] = b` dengan `A = [[2, 1], [1, -1]]` dan `b = [5, 1]`.',
      solution: py`
import numpy as np  # NumPy untuk aljabar linear

A = np.array([[2, 1], [1, -1]], dtype=float)  # koefisien: 2x + y dan x - y
b = np.array([5, 1], dtype=float)  # ruas kanan
x = np.linalg.solve(A, b)  # selesaikan sistem persamaan
print("x, y =", x)               # [2. 1.]
print("Cek A @ x == b:", np.allclose(A @ x, b))  # periksa A x hasil = b`,
    },
  },
  'mat-turunan': {
    deep: {
      concepts: [
        ['Turunan = laju perubahan', 'f′(x) menjawab "jika x digeser sedikit, seberapa besar f berubah?". Di ML, f adalah **loss** dan x adalah **bobot model**. Turunan memberi tahu ke arah mana bobot harus digeser agar loss turun.'],
        ['Gradien = turunan untuk banyak variabel', 'Untuk fungsi banyak variabel, gradien `∇f` adalah vektor berisi turunan parsial terhadap setiap variabel. Gradien menunjuk arah kenaikan tercepat; maka gradient descent bergerak ke arah **minus** gradien.'],
        ['Aturan rantai (chain rule)', 'Jika `y = f(g(x))`, maka `dy/dx = f′(g(x)) · g′(x)`. Neural network adalah fungsi bertumpuk, dan backpropagation hanyalah aturan rantai yang diterapkan berulang dari output ke input.'],
        ['Turunan numerik untuk mengecek', '`(f(x+h) − f(x−h)) / 2h` dengan h kecil mendekati turunan. Teknik ini disebut **gradient check**, dipakai untuk memverifikasi turunan yang dihitung manual.'],
      ],
      examples: [
        {
          title: 'Gradien manual vs numerik, dan aturan rantai',
          code: py`
import numpy as np  # NumPy untuk hitungan

# Loss MSE untuk model y = w*x + b
x = np.array([1.0, 2.0, 3.0, 4.0])  # data fitur
y = np.array([3.0, 5.0, 7.0, 9.0])          # pola sebenarnya: y = 2x + 1

def loss(w, b):  # loss: rata-rata kuadrat selisih tebakan & target
    return np.mean((w * x + b - y) ** 2)  # rumus MSE

def gradien_manual(w, b):  # gradien dari rumus turunan
    err = w * x + b - y  # selisih tebakan & target
    return np.mean(2 * err * x), np.mean(2 * err)   # dL/dw, dL/db

def gradien_numerik(w, b, h=1e-5):  # gradien dengan cara numerik (geser sedikit)
    dw = (loss(w + h, b) - loss(w - h, b)) / (2 * h)  # turunan terhadap w
    db = (loss(w, b + h) - loss(w, b - h)) / (2 * h)  # turunan terhadap b
    return dw, db  # kembalikan keduanya

w, b = 0.5, 0.0  # titik tempat gradien dihitung
print("Manual  :", np.round(gradien_manual(w, b), 5))  # hasil rumus
print("Numerik :", np.round(gradien_numerik(w, b), 5))  # hasil numerik: harus hampir sama

# Aturan rantai: y = sigmoid(3x + 1), dy/dx = sigmoid'(u) * 3
sig = lambda u: 1 / (1 + np.exp(-u))  # fungsi sigmoid
x0 = 0.2  # titik yang diperiksa
u = 3 * x0 + 1  # fungsi dalam: u = 3x + 1
rantai = sig(u) * (1 - sig(u)) * 3  # turunan luar x turunan dalam
# turunan numerik sebagai pembanding
numerik = (sig(3 * (x0 + 1e-5) + 1) - sig(3 * (x0 - 1e-5) + 1)) / 2e-5
print(f"Aturan rantai: {rantai:.6f} | numerik: {numerik:.6f}")  # kedua angka harus sama`,
        },
      ],
      mistakes: [
        ['Mengira gradien menunjuk ke arah turun.', 'Gradien menunjuk ke arah **naik** tercepat; update bobot memakai tanda minus: `w -= lr * grad`.'],
        ['Memakai h terlalu kecil (1e-15) pada turunan numerik.', 'Error pembulatan float membesar. Nilai sekitar 1e-5 biasanya pas.'],
      ],
      tips: [
        'Hafalkan beberapa turunan penting: `x²→2x`, `eˣ→eˣ`, `ln x→1/x`, sigmoid `σ(1−σ)`.',
        'Di praktik, PyTorch menghitung gradien otomatis (autograd). Tujuan belajar turunan adalah memahami apa yang terjadi, bukan menghitung manual.',
      ],
      check: [
        ['Jika dL/dw = +4, ke arah mana w harus digeser untuk menurunkan loss?', 'Ke arah negatif (dikurangi), karena menaikkan w akan menaikkan loss.'],
        ['Kenapa aturan rantai penting untuk deep learning?', 'Neural network adalah komposisi banyak fungsi; aturan rantai memungkinkan gradien loss terhadap setiap bobot di setiap layer dihitung (backpropagation).'],
      ],
    },
    exercise: {
      task: 'Hitung turunan numerik `f(x) = x³ − 2x` di x = 2 dan bandingkan dengan turunan analitiknya `3x² − 2`.',
      hint: 'Pakai rumus beda tengah `(f(x+h) - f(x-h)) / (2h)` dengan h = 1e-5.',
      solution: py`
f = lambda x: x ** 3 - 2 * x  # fungsi yang diturunkan
h = 1e-5  # geseran kecil
numerik = (f(2 + h) - f(2 - h)) / (2 * h)  # turunan numerik (beda tengah)
analitik = 3 * 2 ** 2 - 2  # rumus turunan 3x^2 - 2 di x = 2
print(f"Numerik: {numerik:.6f} | Analitik: {analitik}")  # bandingkan`,
    },
  },
  'mat-optimasi': {
    deep: {
      concepts: [
        ['Learning rate: parameter paling penting', 'Terlalu kecil → konvergen sangat lambat. Terlalu besar → melompati minimum dan bisa meledak (loss jadi NaN). Cara praktis: coba skala log (0.1, 0.01, 0.001) dan amati kurva loss.'],
        ['Batch, mini-batch, dan stochastic', '**Batch GD** memakai seluruh data per langkah (akurat, lambat). **SGD** memakai satu sampel (cepat, berisik). **Mini-batch** (32–256 sampel) adalah kompromi yang dipakai hampir semua deep learning. Noise kecil dari mini-batch justru membantu keluar dari minimum lokal yang buruk.'],
        ['Momentum dan Adam', '**Momentum** menambahkan "kelembaman" agar update tidak zig-zag. **Adam** menggabungkan momentum dengan learning rate adaptif per parameter; ini pilihan default yang aman untuk deep learning.'],
        ['Minimum lokal & saddle point', 'Fungsi loss neural network tidak berbentuk mangkuk sederhana. Ternyata di dimensi tinggi, masalah utamanya lebih sering **saddle point** (datar di beberapa arah) daripada minimum lokal; momentum membantu melewatinya.'],
      ],
      examples: [
        {
          title: 'Membandingkan learning rate dan momentum',
          code: py`
import numpy as np  # NumPy untuk vektor
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

# Fungsi lembah sempit memanjang: f(x, y) = x^2 + 10 y^2  (minimum di 0,0)
# gradien fungsi (turunan terhadap x dan y)
grad = lambda p: np.array([2 * p[0], 20 * p[1]])
f = lambda p: p[0] ** 2 + 10 * p[1] ** 2  # fungsi loss

def jalankan(lr, momentum=0.0, langkah=60):  # gradient descent dengan momentum
    # posisi awal, kecepatan awal 0, catatan loss
    p, v, jejak = np.array([-4.0, 2.0]), np.zeros(2), []
    for _ in range(langkah):  # jalankan sejumlah langkah
        # kecepatan = sisa kecepatan lama + dorongan gradien
        v = momentum * v - lr * grad(p)
        p = p + v  # pindah posisi
        jejak.append(f(p))  # catat loss
    return jejak  # kembalikan riwayat loss

for lr, m in [(0.01, 0.0), (0.09, 0.0), (0.11, 0.0), (0.01, 0.9)]:  # coba 4 pengaturan
    j = jalankan(lr, m)  # jalankan
    print(f"lr={lr:<5} momentum={m}: loss akhir = {j[-1]:.2e}")  # loss akhir
    plt.semilogy(j, label=f"lr={lr}, m={m}")  # grafik loss dengan sumbu log
# label & judul
plt.xlabel("langkah"); plt.ylabel("loss (skala log)"); plt.legend(); plt.title("Pengaruh learning rate & momentum")
plt.show()  # tampilkan`,
        },
      ],
      mistakes: [
        ['Loss menjadi NaN setelah beberapa epoch.', 'Learning rate terlalu besar (atau data belum dinormalisasi). Turunkan lr 10×, dan standarkan fitur.'],
        ['Loss turun sangat lambat dan langsung menyimpulkan model jelek.', 'Coba naikkan learning rate atau ganti optimizer ke Adam sebelum mengganti arsitektur.'],
        ['Tidak mengacak data sebelum membagi mini-batch.', 'Jika data urut berdasarkan kelas, tiap batch berisi satu kelas dan training jadi kacau. Acak setiap epoch.'],
      ],
      tips: [
        'Normalisasi fitur membuat permukaan loss lebih "bulat" sehingga gradient descent lebih cepat konvergen.',
        'Learning rate schedule (menurunkan lr seiring waktu) sering memberi akurasi akhir yang lebih baik.',
      ],
      check: [
        ['Kenapa pada contoh di atas lr=0.11 gagal tetapi lr=0.09 berhasil?', 'Pada arah y, kelengkungannya 20; lr di atas 2/20 = 0.1 membuat setiap langkah melompati minimum dan makin menjauh (divergen).'],
        ['Apa keuntungan mini-batch dibanding batch penuh?', 'Setiap update jauh lebih cepat dan muat di memori GPU, dan noise-nya membantu generalisasi.'],
      ],
    },
  },
  'mat-prob': {
    deep: {
      concepts: [
        ['Teorema Bayes', [
          '`P(A|B) = P(B|A) · P(A) / P(B)`. Ini cara memperbarui keyakinan setelah melihat bukti. **P(A)** = prior (keyakinan awal), **P(B|A)** = likelihood, **P(A|B)** = posterior.',
          'Contoh klasik: tes penyakit 99% akurat, tetapi penyakitnya langka (1 dari 1000). Jika hasil positif, peluang benar-benar sakit hanya sekitar **9%**, karena prior-nya sangat kecil. Intuisi ini penting saat membaca hasil model pendeteksi penipuan atau penyakit.',
        ]],
        ['Distribusi yang sering muncul', '**Bernoulli/Binomial** (sukses-gagal: klik iklan atau tidak), **Normal** (tinggi badan, error pengukuran), **Poisson** (jumlah kejadian per waktu: pesanan per jam), **Uniform** (inisialisasi acak), **Categorical** (output softmax).'],
        ['Expectation & variance', 'Nilai harapan `E[X]` adalah rata-rata jangka panjang; variance mengukur sebaran. Loss yang kita minimalkan sebenarnya adalah **nilai harapan** error terhadap distribusi data.'],
        ['Model ML sebagai probabilitas', 'Classifier memberi `P(kelas | data)`. LLM memberi `P(token berikutnya | token sebelumnya)`. Melatih model berarti memaksimalkan peluang data yang teramati (maximum likelihood), yang setara dengan meminimalkan cross-entropy.'],
      ],
      examples: [
        {
          title: 'Paradoks tes medis: rumus Bayes vs simulasi',
          code: py`
import numpy as np  # NumPy untuk simulasi

prevalensi = 0.001       # 1 dari 1000 orang sakit
sensitivitas = 0.99      # P(positif | sakit)
spesifisitas = 0.99      # P(negatif | sehat)

# total peluang hasil tes positif
p_pos = sensitivitas * prevalensi + (1 - spesifisitas) * (1 - prevalensi)
posterior = sensitivitas * prevalensi / p_pos  # Teorema Bayes
print(f"Rumus Bayes   : P(sakit | positif) = {posterior:.3f}")  # hasil rumus

# Simulasi 2 juta orang
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 2_000_000  # jumlah orang yang disimulasikan
sakit = rng.random(n) < prevalensi  # tandai siapa yang sakit
# hasil tes: sakit -> 99% positif, sehat -> 1% positif palsu
positif = np.where(sakit, rng.random(n) < sensitivitas, rng.random(n) < 1 - spesifisitas)
# dari yang positif, berapa persen yang benar sakit
print(f"Simulasi      : P(sakit | positif) = {sakit[positif].mean():.3f}")
# jumlah positif vs yang benar sakit
print(f"Dari {positif.sum():,} orang positif, hanya {sakit[positif].sum():,} yang benar-benar sakit")

# Tes kedua (independen) pada yang positif menaikkan keyakinan drastis
# Bayes lagi: posterior tes pertama menjadi prior tes kedua
p2 = sensitivitas * posterior / (sensitivitas * posterior + (1 - spesifisitas) * (1 - posterior))
print(f"Setelah 2x positif: {p2:.3f}")  # keyakinan naik drastis`,
        },
      ],
      mistakes: [
        ['Menyamakan P(A|B) dengan P(B|A).', 'P(positif | sakit) = 99% tidak sama dengan P(sakit | positif) ≈ 9%. Selalu perhatikan prior.'],
        ['Menganggap kejadian independen padahal tidak (mis. dua tes dari sampel darah yang sama).', 'Bayes berantai hanya valid jika bukti-buktinya benar-benar independen.'],
      ],
      tips: [
        'Jika ragu, simulasikan dengan NumPy. Simulasi Monte Carlo sering lebih mudah dipahami daripada rumus.',
        'Saat data kelas sangat tidak seimbang (penipuan 0,1%), akurasi menyesatkan; pikirkan dengan kerangka Bayes.',
      ],
      check: [
        ['Kenapa model pendeteksi penipuan dengan akurasi 99% bisa menghasilkan banyak alarm palsu?', 'Karena penipuan sangat langka (prior kecil), sehingga sebagian besar hasil positif berasal dari 1% kesalahan pada transaksi normal yang jumlahnya sangat banyak.'],
      ],
    },
    exercise: {
      task: 'Simulasikan pelemparan 2 dadu sebanyak 100.000 kali dan hitung peluang jumlahnya 7. Bandingkan dengan nilai teori 6/36.',
      hint: '`rng.integers(1, 7, size=(n, 2))`, jumlahkan per baris, lalu hitung proporsi yang sama dengan 7.',
      solution: py`
import numpy as np  # NumPy untuk simulasi

rng = np.random.default_rng(42)  # generator acak dengan seed tetap
dadu = rng.integers(1, 7, size=(100_000, 2))  # 100.000 lemparan dua dadu
p = (dadu.sum(axis=1) == 7).mean()  # proporsi lemparan yang jumlahnya 7
print(f"Simulasi: {p:.4f} | Teori: {6/36:.4f}")  # bandingkan dengan teori 6/36`,
    },
  },
  'mat-statistik': {
    deep: {
      concepts: [
        ['Sampel vs populasi', 'Kita hampir tidak pernah melihat seluruh populasi; kita melihat sampel. Statistik sampel (rata-rata, akurasi model) punya **ketidakpastian**. Akurasi 85% dari 100 data uji jauh kurang meyakinkan daripada 85% dari 10.000 data.'],
        ['Confidence interval & bootstrap', 'Confidence interval memberi rentang nilai yang masuk akal. **Bootstrap**: ambil sampel ulang dengan pengembalian ribuan kali, hitung statistiknya, lalu ambil persentil 2,5% dan 97,5%. Bisa dipakai untuk metrik apa pun, termasuk akurasi model.'],
        ['Uji hipotesis & p-value', 'p-value adalah peluang mendapat hasil seekstrem ini **jika sebenarnya tidak ada efek**. p < 0,05 sering dianggap signifikan. p-value **bukan** peluang hipotesis benar, dan signifikan secara statistik belum tentu penting secara praktis.'],
        ['Korelasi ≠ kausalitas', 'Penjualan es krim berkorelasi dengan kasus tenggelam, karena keduanya naik saat musim panas (variabel pengganggu). Model ML menangkap korelasi; jangan langsung menafsirkannya sebagai sebab-akibat.'],
      ],
      examples: [
        {
          title: 'Bootstrap untuk akurasi model & A/B test',
          code: py`
import numpy as np  # NumPy untuk data
from scipy import stats  # fungsi uji statistik

rng = np.random.default_rng(0)  # generator acak dengan seed tetap

# Hasil prediksi model di 200 data uji (1 = benar)
benar = rng.random(200) < 0.86  # 200 hasil tebakan, 86% benar
# bootstrap: ambil sampel ulang 5000 kali, hitung akurasinya
boot = [rng.choice(benar, size=benar.size, replace=True).mean() for _ in range(5000)]
lo, hi = np.percentile(boot, [2.5, 97.5])  # batas bawah & atas 95%
# rentang akurasi yang masuk akal
print(f"Akurasi {benar.mean():.3f}, 95% CI [{lo:.3f}, {hi:.3f}]")

# A/B test: apakah tombol baru menaikkan konversi?
lama = rng.random(5000) < 0.100  # 5000 pengunjung tombol lama (10% konversi)
baru = rng.random(5000) < 0.112  # 5000 pengunjung tombol baru (11,2% konversi)
# tabel jumlah konversi & tidak
tabel = [[lama.sum(), (~lama).sum()], [baru.sum(), (~baru).sum()]]
chi2, p, _, _ = stats.chi2_contingency(tabel)  # uji chi-kuadrat
# bandingkan konversi & p-value
print(f"Konversi lama {lama.mean():.3%} vs baru {baru.mean():.3%}, p-value = {p:.4f}")
print("Signifikan (p<0.05)?", p < 0.05)  # p < 0.05 dianggap signifikan
print("-> Walau tombol baru sebenarnya lebih baik (11,2% vs 10%), 5.000 pengunjung per grup belum cukup")
print("   untuk membuktikannya. Selisih kecil butuh sampel lebih besar.")

# Korelasi palsu karena variabel pengganggu
suhu = rng.normal(30, 4, 365)  # suhu harian setahun
es_krim = 10 * suhu + rng.normal(0, 20, 365)  # penjualan es krim naik karena suhu
renang = 3 * suhu + rng.normal(0, 8, 365)  # perenang juga naik karena suhu
# korelasi tinggi walau tidak saling menyebabkan
print(f"Korelasi es krim vs perenang: {np.corrcoef(es_krim, renang)[0, 1]:.2f} (penyebab sebenarnya: suhu)")`,
        },
      ],
      mistakes: [
        ['Melaporkan akurasi tanpa ukuran data uji atau interval.', 'Sertakan jumlah data dan confidence interval, terutama saat membandingkan dua model yang selisihnya kecil.'],
        ['Mencoba puluhan uji lalu melaporkan yang p < 0,05 saja (p-hacking).', 'Tentukan hipotesis sebelum melihat data; koreksi untuk banyak pengujian (mis. Bonferroni).'],
        ['Memakai rata-rata untuk data dengan outlier ekstrem (gaji).', 'Laporkan median juga.'],
      ],
      tips: [
        'Selalu lihat distribusi data (histogram) sebelum memilih statistik.',
        'Untuk membandingkan dua model pada data uji yang sama, pakai uji berpasangan (McNemar) atau bootstrap selisih akurasinya.',
      ],
      check: [
        ['Model A akurasi 85,2%, model B 85,6% pada 300 data uji. Apakah B pasti lebih baik?', 'Belum tentu. Selisih 0,4% pada 300 data (≈1 prediksi) jauh lebih kecil dari ketidakpastian sampelnya; perlu interval/uji statistik atau data uji lebih besar.'],
        ['Apa arti p-value 0,03?', 'Jika sebenarnya tidak ada perbedaan, peluang mendapat hasil seekstrem ini sekitar 3%. Bukan berarti peluang hipotesis benar 97%.'],
      ],
    },
    exercise: {
      task: 'Diberi data waktu respons server (ms) `[120, 135, 128, 142, 900, 131, 125, 138]`, hitung mean, median, dan standar deviasi. Statistik mana yang paling mewakili "waktu respons biasa"? Kenapa?',
      hint: 'Pakai `np.mean`, `np.median`, `np.std`. Perhatikan nilai 900.',
      solution: py`
import numpy as np  # NumPy untuk statistik

# waktu respons, ada satu outlier 900
data = np.array([120, 135, 128, 142, 900, 131, 125, 138])
print("Mean  :", data.mean())  # mean tertarik ke atas
print("Median:", np.median(data))  # median tetap mewakili
print("Std   :", data.std().round(1))  # std besar karena outlier
print("Median lebih mewakili karena satu outlier (900 ms) menarik mean jauh ke atas.")`,
    },
  },

  // ---------------- Data Science Tools ----------------
  'ds-numpy': {
    deep: {
      concepts: [
        ['Kenapa NumPy cepat', 'Array NumPy menyimpan angka bertipe sama secara berurutan di memori dan operasinya dijalankan oleh kode C yang teroptimasi (vectorization). List Python menyimpan pointer ke objek-objek terpisah, sehingga jauh lebih lambat.'],
        ['Broadcasting', 'NumPy otomatis "merentangkan" array berdimensi kecil agar cocok dengan yang besar. Aturan: bandingkan shape dari kanan; dimensi cocok jika sama atau salah satunya 1. Contoh: `(100, 3) - (3,)` mengurangi setiap baris dengan vektor yang sama (normalisasi per kolom).'],
        ['axis', '`axis=0` bekerja **menyusuri baris** (hasil per kolom), `axis=1` menyusuri kolom (hasil per baris). `X.mean(axis=0)` = rata-rata setiap fitur.'],
        ['View vs copy', 'Slicing (`a[1:3]`) menghasilkan **view** yang berbagi memori dengan array asli: mengubah view mengubah aslinya. Fancy indexing (`a[[1, 3]]`) dan boolean mask menghasilkan copy. Pakai `.copy()` jika ragu.'],
      ],
      examples: [
        {
          title: 'Broadcasting, axis, boolean mask, dan view',
          code: py`
import numpy as np  # NumPy untuk array

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
X = rng.normal(loc=[50, 170, 3], scale=[10, 8, 1], size=(1000, 3))   # umur, tinggi, anak

# Standarisasi per kolom dengan broadcasting: (1000,3) - (3,) / (3,)
# kurangi rata-rata & bagi std setiap kolom sekaligus
Z = (X - X.mean(axis=0)) / X.std(axis=0)
# hasilnya: rata-rata 0, std 1
print("Rata-rata per kolom:", Z.mean(axis=0).round(3), "| std:", Z.std(axis=0).round(3))

# Boolean mask: pilih baris dengan umur > 60
tua = X[X[:, 0] > 60]  # ambil baris yang kolom umurnya > 60
# jumlah & rata-rata tinggi kelompok ini
print("Jumlah umur > 60:", len(tua), "| rata-rata tinggi:", tua[:, 1].mean().round(1))

# Jarak setiap titik ke 3 pusat sekaligus: (1000,1,3) - (1,3,3) -> (1000,3,3)
pusat = X[:3]  # 3 baris pertama sebagai pusat
# None menambah dimensi agar bisa dikurangkan berpasangan
jarak = np.linalg.norm(X[:, None, :] - pusat[None, :, :], axis=2)
# pusat terdekat untuk setiap titik
print("Shape jarak:", jarak.shape, "| pusat terdekat 5 data pertama:", jarak.argmin(axis=1)[:5])

# View vs copy
a = np.arange(6)  # array 0 sampai 5
v = a[1:4]; v[0] = 99  # slicing = view: mengubah v ikut mengubah a
c = a[[4, 5]]; c[0] = -1  # fancy indexing = copy: a tidak berubah
print("a setelah ubah view & copy:", a)  # a[1] berubah menjadi 99, a[4] tetap 4`,
        },
      ],
      mistakes: [
        ['Memakai loop Python untuk operasi per elemen.', 'Gunakan operasi vektor: `arr * 2`, `np.where(kondisi, a, b)`, `arr.sum(axis=0)`.'],
        ['Broadcasting tak sengaja: `(100,) - (100, 1)` menghasilkan matriks (100, 100).', 'Cek shape; ubah ke bentuk yang sama dengan `reshape` atau `ravel`.'],
        ['`a == np.nan` untuk mencari NaN (selalu False).', 'Pakai `np.isnan(a)`.'],
      ],
      tips: [
        'Pakai `np.random.default_rng(seed)` (API baru) daripada `np.random.seed`.',
        'Pakai `dtype=np.float32` untuk data besar di deep learning agar hemat memori separuh.',
      ],
      check: [
        ['Shape X = (500, 4). Berapa shape `X.mean(axis=0)` dan `X.mean(axis=1)`?', '`(4,)` (rata-rata per fitur) dan `(500,)` (rata-rata per sampel).'],
        ['Apakah `(32, 10) + (10,)` valid? Bagaimana dengan `(32, 10) + (32,)`?', 'Yang pertama valid (dimensi kanan cocok). Yang kedua error; harus diubah menjadi `(32, 1)`.'],
      ],
    },
    exercise: {
      task: 'Buat matriks nilai 5 siswa × 3 mata pelajaran (acak 50–100). Hitung rata-rata tiap siswa, rata-rata tiap mapel, dan tampilkan indeks siswa dengan rata-rata tertinggi — tanpa loop.',
      hint: '`rng.integers(50, 101, size=(5, 3))`, lalu `mean(axis=1)`, `mean(axis=0)`, dan `argmax()`.',
      solution: py`
import numpy as np  # NumPy untuk array

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
nilai = rng.integers(50, 101, size=(5, 3))  # 5 siswa x 3 mapel, nilai 50 sampai 100
print(nilai)  # lihat tabel nilai
# axis=1: rata-rata ke samping (per siswa)
print("Rata-rata per siswa:", nilai.mean(axis=1).round(1))
# axis=0: rata-rata ke bawah (per mapel)
print("Rata-rata per mapel:", nilai.mean(axis=0).round(1))
# indeks siswa dengan rata-rata tertinggi
print("Siswa terbaik: indeks", nilai.mean(axis=1).argmax())`,
    },
  },
  'ds-pandas': {
    deep: {
      concepts: [
        ['Index dan alignment', 'Setiap Series/DataFrame punya **index**. Operasi antara dua Series dicocokkan berdasarkan index, bukan posisi. Ini kuat, tapi bisa menghasilkan NaN tak terduga jika index berbeda (mis. setelah filter).'],
        ['loc vs iloc', '`df.loc[baris, kolom]` memakai **label** (dan slicing label inklusif), `df.iloc[i, j]` memakai **posisi** angka. Untuk mengubah nilai berdasarkan kondisi: `df.loc[df["umur"] < 0, "umur"] = np.nan`.'],
        ['Split–apply–combine', '`groupby` membagi data per kelompok, menerapkan fungsi (sum, mean, custom), lalu menggabungkan hasilnya. `agg` bisa menghitung banyak statistik sekaligus, dan `transform` mengembalikan hasil dengan ukuran sama seperti data asli (berguna untuk fitur "rata-rata kelompok").'],
        ['Tipe data dan memori', 'Kolom teks berulang (kota, kategori) bisa diubah ke `category` untuk menghemat memori dan mempercepat groupby. Cek dengan `df.info(memory_usage="deep")`.'],
      ],
      examples: [
        {
          title: 'groupby agg/transform, merge, dan pivot',
          code: py`
import numpy as np  # NumPy untuk data acak
import pandas as pd  # Pandas untuk tabel

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 12  # 12 transaksi
trx = pd.DataFrame({  # tabel transaksi
    "tanggal": pd.date_range("2025-01-01", periods=n, freq="D"),  # 12 tanggal berurutan
    "toko": rng.choice(["A", "B", "C"], n),  # toko acak
    "produk": rng.choice(["kopi", "teh"], n),  # produk acak
    "qty": rng.integers(1, 10, n),  # jumlah beli
})
# tabel harga produk
harga = pd.DataFrame({"produk": ["kopi", "teh"], "harga": [18000, 12000]})

df = trx.merge(harga, on="produk", how="left")          # gabung seperti JOIN SQL
df["omzet"] = df["qty"] * df["harga"]  # kolom baru = qty x harga

# beberapa ringkasan per toko sekaligus
print(df.groupby("toko").agg(total=("omzet", "sum"), rata_qty=("qty", "mean"), transaksi=("qty", "size")))

df["porsi_toko"] = df["omzet"] / df.groupby("toko")["omzet"].transform("sum")   # fitur per kelompok
print(df[["toko", "omzet", "porsi_toko"]].head(4).round(2))  # lihat 4 baris pertama

# tabel silang: baris = toko, kolom = produk
print(df.pivot_table(index="toko", columns="produk", values="omzet", aggfunc="sum", fill_value=0))

# tipe category: hemat memori untuk teks berulang
df["toko"] = df["toko"].astype("category")
print("Tipe kolom toko:", df["toko"].dtype)  # cek tipenya`,
        },
      ],
      mistakes: [
        ['`df[df.umur > 17]["kelas"] = "dewasa"` → SettingWithCopyWarning dan data tidak berubah.', 'Pakai `df.loc[df.umur > 17, "kelas"] = "dewasa"`.'],
        ['Loop `for i, row in df.iterrows()` untuk menghitung kolom baru.', 'Gunakan operasi vektor atau `np.where`; bisa ratusan kali lebih cepat.'],
        ['Merge yang menggandakan baris karena kunci tidak unik.', 'Cek `df.shape` sebelum dan sesudah merge, atau pakai `validate="many_to_one"`.'],
      ],
      tips: [
        'Mulai setiap analisis dengan `df.shape`, `df.head()`, `df.info()`, `df.describe()`.',
        'Pakai method chaining dengan `.assign()` dan `.pipe()` agar langkah transformasi mudah dibaca.',
        'Untuk data jutaan baris, coba format Parquet dan library Polars.',
      ],
      check: [
        ['Apa beda `groupby().agg("mean")` dan `groupby().transform("mean")`?', '`agg` menghasilkan satu baris per kelompok; `transform` mengembalikan nilai kelompok untuk setiap baris asli (ukuran sama dengan data).'],
        ['Kapan `df.loc[0:2]` dan `df.iloc[0:2]` memberi hasil berbeda?', '`loc` memakai label dan inklusif (baris berlabel 0, 1, 2), `iloc` memakai posisi dan eksklusif (posisi 0, 1).'],
      ],
    },
  },
  'ds-cleaning': {
    deep: {
      concepts: [
        ['Jenis data hilang', '**MCAR** (hilang acak murni), **MAR** (hilang berkaitan dengan kolom lain, mis. pendapatan kosong lebih sering pada responden muda), **MNAR** (hilang karena nilainya sendiri, mis. orang berpenghasilan tinggi enggan mengisi). Jenisnya menentukan strategi: hapus, isi median, isi per kelompok, atau tambahkan kolom penanda "hilang".'],
        ['Data leakage saat cleaning', 'Statistik untuk mengisi nilai hilang atau scaling (median, mean, std) **harus dihitung dari data latih saja**, lalu diterapkan ke data uji. Menghitungnya dari seluruh data membocorkan informasi data uji dan membuat skor terlalu optimis.'],
        ['Outlier: salah input atau kejadian nyata?', 'Umur 250 tahun jelas salah input. Transaksi Rp500 juta mungkin nyata dan justru yang ingin dideteksi (penipuan). Jangan menghapus outlier secara otomatis; pahami konteksnya. Metode deteksi: IQR, z-score.'],
        ['Konsistensi kategori', '"Jakarta", "jakarta ", "DKI Jakarta", "Jkt" adalah satu kategori. Normalisasi teks (strip, lower, kamus pemetaan) sebelum analisis.'],
      ],
      examples: [
        {
          title: 'Pipeline cleaning yang realistis',
          code: py`
import numpy as np  # NumPy untuk np.nan
import pandas as pd  # Pandas untuk tabel

df = pd.DataFrame({  # data kotor yang sering ditemui
    "nama": ["Ani", "Budi", "Citra", "Dodi", "Eka", "Budi", "Fajar"],
    "kota": [" Jakarta", "jakarta", "Bandung", "DKI Jakarta", "bdg", "jakarta", None],
    "umur": [25, 31, 250, np.nan, 28, 31, 45],
    "gaji_juta": ["7,5", "9", "12", "8", None, "9", "15"],
    "tgl_daftar": ["2024-01-05", "2024-02-11", "05/03/2024", "2024-03-20", "2024-04-01", "2024-02-11", "2024-05-09"],
})
print("Sebelum:", df.shape)  # ukuran sebelum dibersihkan

df = df.drop_duplicates()                                                 # 1. duplikat
# kamus penyeragaman nama kota
peta = {"jakarta": "Jakarta", "dki jakarta": "Jakarta", "bandung": "Bandung", "bdg": "Bandung"}
df["kota"] = df["kota"].str.strip().str.lower().map(peta).fillna("Tidak diketahui")   # 2. kategori
df["gaji_juta"] = pd.to_numeric(df["gaji_juta"].str.replace(",", "."), errors="coerce")  # 3. tipe angka
df.loc[(df["umur"] < 15) | (df["umur"] > 100), "umur"] = np.nan          # 4. nilai mustahil
df["umur_hilang"] = df["umur"].isna().astype(int)                         # 5. penanda hilang
df["umur"] = df["umur"].fillna(df["umur"].median())  # isi umur kosong dengan median
# isi gaji kosong dengan median kota yang sama
df["gaji_juta"] = df["gaji_juta"].fillna(df.groupby("kota")["gaji_juta"].transform("median"))
# 6. tanggal dengan dua format: parse masing-masing secara eksplisit (jangan menebak!)
# baca format tahun-bulan-tanggal
iso = pd.to_datetime(df["tgl_daftar"], format="%Y-%m-%d", errors="coerce")
# baca format tanggal/bulan/tahun
dmy = pd.to_datetime(df["tgl_daftar"], format="%d/%m/%Y", errors="coerce")
df["tgl_daftar"] = iso.fillna(dmy)  # gabungkan: pakai yang berhasil dibaca

print("Sesudah:", df.shape)  # ukuran sesudah
print(df)  # lihat hasilnya
print(df.dtypes)  # tipe setiap kolom`,
        },
      ],
      mistakes: [
        ['`df.dropna()` di awal tanpa melihat berapa banyak baris yang hilang.', 'Cek `df.isna().mean()` per kolom dulu. Menghapus 40% data bisa membuat model bias.'],
        ['Mengisi nilai hilang memakai statistik dari seluruh dataset sebelum split.', 'Split dulu, lalu fit imputer pada data latih (paling aman dengan `Pipeline` scikit-learn).'],
        ['Mengubah data mentah secara langsung.', 'Simpan data mentah apa adanya; tulis cleaning sebagai kode yang bisa dijalankan ulang.'],
      ],
      tips: [
        'Catat setiap keputusan cleaning (berapa baris dihapus, alasannya) — ini bagian dari laporan proyek.',
        'Tulis fungsi `bersihkan(df)` agar langkah yang sama bisa diterapkan pada data baru saat produksi.',
      ],
      check: [
        ['Kenapa menambahkan kolom penanda "umur_hilang" bisa membantu model?', 'Fakta bahwa data hilang bisa jadi informatif (MNAR/MAR). Penanda membuat model bisa memanfaatkan pola itu, bukan hanya nilai pengganti.'],
        ['Kenapa median imputer harus di-fit di data latih saja?', 'Agar tidak ada informasi dari data uji yang bocor ke proses training; skor uji jadi mencerminkan performa di data yang benar-benar baru.'],
      ],
    },
    exercise: {
      task: 'Bersihkan kolom harga `["Rp 15.000", "20000", "Rp12.500", "gratis", None]` menjadi angka (float), dengan "gratis" = 0 dan nilai kosong diisi median.',
      hint: 'Ganti "gratis" → "0", hapus "Rp", spasi, dan titik dengan `str.replace(regex=True)`, lalu `pd.to_numeric` dan `fillna(median)`.',
      solution: py`
import pandas as pd  # Pandas untuk data

# data harga yang tidak seragam
harga = pd.Series(["Rp 15.000", "20000", "Rp12.500", "gratis", None])
# huruf kecil, ubah 'gratis' menjadi 0
bersih = (harga.str.lower().str.replace("gratis", "0")
               .str.replace(r"[^0-9]", "", regex=True))  # buang semua karakter selain angka
angka = pd.to_numeric(bersih, errors="coerce")  # ubah ke angka; yang gagal menjadi NaN
angka = angka.fillna(angka.median())  # isi kosong dengan median
print(angka)  # lihat hasilnya`,
    },
  },
  'ds-viz': {
    deep: {
      concepts: [
        ['Pilih grafik berdasarkan pertanyaan', '**Distribusi** satu variabel: histogram, boxplot. **Hubungan** dua angka: scatter. **Perbandingan** kategori: bar chart (diurutkan). **Tren waktu**: line chart. **Komposisi**: stacked bar (hindari pie chart dengan banyak irisan). **Korelasi banyak fitur**: heatmap.'],
        ['Figure dan Axes', 'Pakai API berorientasi objek: `fig, ax = plt.subplots()` lalu `ax.plot(...)`, `ax.set_title(...)`. Cara ini jelas saat membuat banyak subplot, berbeda dengan `plt.plot` yang bergantung pada "plot aktif".'],
        ['Grafik yang jujur', 'Sumbu Y bar chart harus mulai dari nol. Beri label sumbu dan satuan. Jangan memakai warna pelangi untuk data berurutan; pakai satu gradasi warna. Grafik yang menyesatkan lebih buruk daripada tanpa grafik.'],
        ['Visualisasi untuk ML', 'Kurva loss latih vs validasi (deteksi overfitting), confusion matrix, distribusi fitur per kelas, plot prediksi vs nilai aktual, dan feature importance. Grafik-grafik ini sering lebih informatif daripada satu angka akurasi.'],
      ],
      examples: [
        {
          title: 'Dashboard 2×2 dengan subplots',
          code: py`
import numpy as np  # NumPy untuk data
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
umur = rng.normal(35, 10, 500).clip(18, 70)  # 500 umur, dibatasi 18 sampai 70
gaji = 2 + 0.25 * umur + rng.normal(0, 2, 500)  # gaji naik seiring umur + noise
# kota dengan peluang berbeda-beda
kota = rng.choice(["Jakarta", "Bandung", "Surabaya", "Medan"], 500, p=[0.4, 0.25, 0.2, 0.15])
# penjualan 12 bulan dengan tren naik
bulan = np.arange(1, 13); penjualan = 100 + 8 * bulan + rng.normal(0, 10, 12)

fig, ax = plt.subplots(2, 2, figsize=(10, 7))  # 4 grafik dalam satu gambar
# histogram: sebaran umur
ax[0, 0].hist(umur, bins=25, color="steelblue", edgecolor="white")
# atur judul & label sekaligus
ax[0, 0].set(title="Distribusi umur", xlabel="umur (tahun)", ylabel="jumlah")

ax[0, 1].scatter(umur, gaji, s=8, alpha=0.5)  # scatter: hubungan umur & gaji
ax[0, 1].set(title="Umur vs gaji", xlabel="umur", ylabel="gaji (juta)")  # judul & label

nama, jumlah = np.unique(kota, return_counts=True)  # hitung jumlah pelanggan per kota
urut = np.argsort(jumlah)  # urutan dari terkecil
# batang mendatar yang sudah diurutkan
ax[1, 0].barh(nama[urut], jumlah[urut], color="seagreen")
ax[1, 0].set(title="Pelanggan per kota (diurutkan)", xlabel="jumlah")  # judul & label

ax[1, 1].plot(bulan, penjualan, marker="o")  # grafik garis: tren dari waktu ke waktu
# ylim=(0, None): sumbu dimulai dari nol
ax[1, 1].set(title="Tren penjualan", xlabel="bulan", ylabel="unit", ylim=(0, None))
fig.suptitle("Ringkasan data pelanggan"); fig.tight_layout()  # judul besar & rapikan jarak
plt.show()  # tampilkan`,
        },
      ],
      mistakes: [
        ['Grafik tanpa judul, label sumbu, atau satuan.', 'Pembaca harus bisa memahami grafik tanpa membaca kodenya.'],
        ['Scatter plot 1 juta titik yang menjadi gumpalan hitam.', 'Pakai `alpha` kecil, sampel acak, atau `hexbin`.'],
        ['Bar chart kategori tidak diurutkan.', 'Urutkan dari besar ke kecil agar perbandingan langsung terlihat.'],
      ],
      tips: [
        'Seaborn (`sns.histplot`, `sns.boxplot`, `sns.heatmap`) membuat grafik statistik dengan sedikit kode.',
        'Plotly membuat grafik interaktif (bisa di-hover dan di-zoom) untuk dashboard.',
        'Simpan grafik untuk laporan dengan `fig.savefig("grafik.png", dpi=150, bbox_inches="tight")`.',
      ],
      check: [
        ['Grafik apa yang paling cocok untuk melihat apakah fitur "jam belajar" berbeda antara siswa lulus dan tidak lulus?', 'Boxplot atau histogram berlapis per kelompok (lulus vs tidak).'],
      ],
    },
    exercise: {
      task: 'Buat line chart dua garis — suhu Jakarta dan Bandung selama 7 hari (data bebas) — lengkap dengan judul, label sumbu, dan legenda.',
      hint: '`fig, ax = plt.subplots()`, panggil `ax.plot` dua kali dengan `label=`, lalu `ax.legend()`.',
      solution: py`
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]  # label sumbu datar
jakarta = [32, 33, 31, 34, 33, 32, 31]  # suhu Jakarta
bandung = [25, 26, 24, 25, 27, 26, 24]  # suhu Bandung
fig, ax = plt.subplots()  # siapkan grafik
ax.plot(hari, jakarta, marker="o", label="Jakarta")  # garis pertama dengan titik bulat
ax.plot(hari, bandung, marker="s", label="Bandung")  # garis kedua dengan titik kotak
# judul & label sumbu
ax.set(title="Suhu harian seminggu", xlabel="hari", ylabel="suhu (°C)")
ax.legend(); ax.grid(alpha=0.3)  # legenda & grid tipis
plt.show()  # tampilkan`,
    },
  },
  'ds-eda': {
    deep: {
      concepts: [
        ['EDA itu bertanya, bukan sekadar membuat grafik', 'Mulai dari pertanyaan bisnis ("faktor apa yang membuat pelanggan berhenti?"), lalu cari bukti di data. Setiap grafik sebaiknya diikuti satu kalimat temuan.'],
        ['Urutan EDA yang sistematis', '1) Bentuk & tipe data. 2) Kualitas: nilai hilang, duplikat, nilai aneh. 3) Univariat: distribusi setiap kolom. 4) Bivariat: hubungan fitur dengan **target**. 5) Multivariat: korelasi antar fitur, interaksi. 6) Ringkas temuan dan dampaknya pada modeling.'],
        ['Cek ketidakseimbangan target', 'Jika 95% data berlabel "tidak churn", model yang selalu menebak "tidak churn" sudah 95% akurat. EDA harus mengungkap ini sejak awal agar metrik evaluasi dipilih dengan tepat.'],
        ['Waspada leakage', 'Fitur yang korelasinya dengan target terlalu sempurna (mis. "tanggal_berhenti" untuk memprediksi churn) biasanya bocoran informasi dari masa depan, bukan fitur hebat.'],
      ],
      examples: [
        {
          title: 'EDA churn pelanggan: dari pertanyaan ke temuan',
          code: py`
import numpy as np  # NumPy untuk data acak
import pandas as pd  # Pandas untuk tabel

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 2000  # 2000 pelanggan
df = pd.DataFrame({  # tabel pelanggan buatan
    "lama_langganan_bln": rng.integers(1, 60, n),
    "keluhan_3bln": rng.poisson(0.8, n),
    "paket": rng.choice(["basic", "premium"], n, p=[0.7, 0.3]),
    "tagihan": rng.normal(150, 40, n).round(),
})
# skor risiko churn
logit = -1.5 - 0.05 * df.lama_langganan_bln + 0.8 * df.keluhan_3bln + 0.6 * (df.paket == "basic")
# ubah skor menjadi peluang, lalu acak siapa yang churn
df["churn"] = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)

# langkah 1: ukuran data & nilai kosong
print("1) Bentuk:", df.shape, "| nilai hilang:", int(df.isna().sum().sum()))
# langkah 2: proporsi kelas target
print("2) Proporsi churn:", df.churn.mean().round(3), "-> data tidak seimbang, jangan hanya pakai akurasi")
print("\n3) Rata-rata fitur per kelompok target:")
# langkah 3: rata-rata fitur per kelompok target
print(df.groupby("churn")[["lama_langganan_bln", "keluhan_3bln", "tagihan"]].mean().round(2))
print("\n4) Churn rate per paket:")
print(df.groupby("paket")["churn"].mean().round(3))  # langkah 4: churn rate per paket
print("\n5) Churn rate per jumlah keluhan:")
# langkah 5: churn rate per jumlah keluhan (4+ digabung)
print(df.groupby(df.keluhan_3bln.clip(upper=4))["churn"].agg(["mean", "size"]).round(3))
print("\n6) Korelasi dengan churn:")
# langkah 6: korelasi semua fitur angka dengan churn
print(df.select_dtypes("number").corr()["churn"].drop("churn").sort_values().round(3))
print("\nTemuan: pelanggan baru, banyak keluhan, dan paket basic paling berisiko churn; tagihan tidak berpengaruh.")`,
        },
      ],
      mistakes: [
        ['Melakukan EDA pada seluruh data, termasuk data uji, lalu memilih fitur berdasarkan hasilnya.', 'Idealnya pisahkan data uji sebelum EDA mendalam agar evaluasi akhir tetap jujur.'],
        ['Membuat 50 grafik tanpa kesimpulan.', 'Tulis temuan di bawah setiap grafik dan rangkum 3–5 insight utama.'],
        ['Hanya melihat korelasi linear.', 'Hubungan bisa non-linear (bentuk U). Lihat juga grafik dan statistik per kelompok.'],
      ],
      tips: [
        'Library seperti `ydata-profiling` membuat laporan EDA otomatis sebagai titik awal.',
        'Pakai `pd.crosstab` untuk hubungan dua kategori, dan `pd.cut`/`qcut` untuk mengelompokkan angka.',
      ],
      check: [
        ['Kamu menemukan fitur dengan korelasi 0,99 terhadap target. Apa yang harus dicurigai?', 'Kemungkinan data leakage: fitur tersebut mungkin dihitung dari target atau berasal dari masa setelah kejadian yang ingin diprediksi.'],
      ],
    },
    exercise: {
      task: 'Dengan dataset iris (`sklearn.datasets.load_iris(as_frame=True)`), cari fitur yang paling membedakan ketiga spesies. Tampilkan rata-rata setiap fitur per spesies.',
      hint: 'Ambil `.frame`, groupby kolom `target`, lalu `mean()`. Bandingkan selisih antar spesies relatif terhadap std fitur.',
      solution: py`
from sklearn.datasets import load_iris  # dataset bunga iris

df = load_iris(as_frame=True).frame  # tabel fitur + target
rata = df.groupby("target").mean()  # rata-rata setiap fitur per spesies
print(rata.round(2))  # tampilkan
# selisih antar spesies dibanding sebarannya
pemisah = (rata.max() - rata.min()) / df.drop(columns="target").std()
print("\nSelisih antar spesies / std (makin besar makin membedakan):")
# urutkan dari fitur yang paling membedakan
print(pemisah.sort_values(ascending=False).round(2))`,
    },
  },
  'ds-sql': {
    deep: {
      concepts: [
        ['Urutan eksekusi SQL', 'Ditulis `SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT`, tetapi dijalankan dengan urutan `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`. Itulah sebabnya `WHERE` tidak bisa memakai alias dari `SELECT` dan filter hasil agregasi memakai `HAVING`.'],
        ['Jenis JOIN', '`INNER JOIN` hanya baris yang cocok di kedua tabel. `LEFT JOIN` semua baris tabel kiri, kolom kanan NULL jika tidak cocok (berguna untuk mencari "pelanggan yang belum pernah belanja"). Perhatikan JOIN pada kunci tidak unik yang menggandakan baris.'],
        ['Window function', '`ROW_NUMBER()`, `RANK()`, `SUM() OVER (PARTITION BY ... ORDER BY ...)` menghitung per kelompok tanpa meringkas baris. Sangat berguna untuk fitur ML: total belanja kumulatif, transaksi ke-n, selisih dengan transaksi sebelumnya (`LAG`).'],
        ['CTE (WITH)', 'Memecah query panjang menjadi langkah-langkah bernama, seperti variabel. Query jadi jauh lebih mudah dibaca dan di-debug.'],
      ],
      examples: [
        {
          title: 'JOIN, HAVING, CTE, dan window function dengan SQLite',
          code: py`
import sqlite3  # database SQLite bawaan
import pandas as pd  # Pandas untuk membuat tabel & membaca hasil

con = sqlite3.connect(":memory:")  # database di memori
# tabel pelanggan langsung ditulis ke database
pd.DataFrame({"id": [1, 2, 3, 4], "nama": ["Ani", "Budi", "Citra", "Dodi"],
              "kota": ["Jakarta", "Bandung", "Jakarta", "Medan"]}).to_sql("pelanggan", con, index=False)
pd.DataFrame({"pelanggan_id": [1, 1, 2, 3, 3, 3, 1],  # tabel pesanan
              "tanggal": ["2025-01-02", "2025-01-15", "2025-01-20", "2025-01-03", "2025-02-01", "2025-02-14", "2025-03-01"],
              "total": [50, 120, 80, 200, 40, 90, 70]}).to_sql("pesanan", con, index=False)

# fungsi kecil: jalankan query lalu cetak hasilnya
q = lambda sql: print(pd.read_sql(sql, con), end="\n\n")

# LEFT JOIN: pelanggan tanpa pesanan tetap muncul
q("""SELECT p.nama, COUNT(o.total) AS jml, COALESCE(SUM(o.total), 0) AS belanja
     FROM pelanggan p LEFT JOIN pesanan o ON o.pelanggan_id = p.id
     GROUP BY p.nama HAVING belanja >= 0 ORDER BY belanja DESC""")   # Dodi tetap muncul (0)

# CTE (WITH): hitung omzet per kota dulu, lalu persentasenya
q("""WITH per_kota AS (
       SELECT p.kota, SUM(o.total) AS omzet
       FROM pesanan o JOIN pelanggan p ON p.id = o.pelanggan_id GROUP BY p.kota)
     SELECT kota, omzet, ROUND(100.0 * omzet / (SELECT SUM(omzet) FROM per_kota), 1) AS persen
     FROM per_kota ORDER BY omzet DESC""")

# window function: nomor transaksi, total kumulatif, jeda hari
q("""SELECT pelanggan_id, tanggal, total,
       ROW_NUMBER() OVER (PARTITION BY pelanggan_id ORDER BY tanggal) AS transaksi_ke,
       SUM(total)  OVER (PARTITION BY pelanggan_id ORDER BY tanggal) AS kumulatif,
       julianday(tanggal) - julianday(LAG(tanggal) OVER (PARTITION BY pelanggan_id ORDER BY tanggal)) AS jeda_hari
     FROM pesanan ORDER BY pelanggan_id, tanggal""")
con.close()  # tutup koneksi`,
        },
      ],
      mistakes: [
        ['`WHERE COUNT(*) > 2`', 'Filter hasil agregasi memakai `HAVING COUNT(*) > 2`.'],
        ['`WHERE kolom = NULL`', 'Pakai `WHERE kolom IS NULL`.'],
        ['Menyusun query dengan f-string dari input pengguna.', 'Rawan SQL injection. Pakai parameter: `con.execute("SELECT * FROM t WHERE id = ?", (id_user,))`.'],
      ],
      tips: [
        'Lakukan agregasi berat di database, lalu ambil hasil ringkasnya ke Pandas.',
        'Latihan SQL gratis: SQLBolt, LeetCode Database, atau Mode SQL Tutorial.',
      ],
      check: [
        ['Kenapa query "pelanggan yang belum pernah belanja" memakai LEFT JOIN?', 'Karena INNER JOIN membuang pelanggan tanpa pesanan; LEFT JOIN mempertahankannya dengan kolom pesanan bernilai NULL, lalu bisa difilter `WHERE o.pelanggan_id IS NULL`.'],
      ],
    },
    exercise: {
      task: 'Dengan tabel `nilai(siswa, mapel, skor)`, tulis query SQL yang menampilkan mapel dengan rata-rata skor di atas 75, diurutkan dari tertinggi.',
      hint: '`GROUP BY mapel`, `AVG(skor)`, filter dengan `HAVING`, lalu `ORDER BY ... DESC`.',
      solution: py`
import sqlite3  # database SQLite bawaan
import pandas as pd  # Pandas

con = sqlite3.connect(":memory:")  # database di memori
pd.DataFrame({"siswa": ["A", "A", "B", "B", "C", "C"],  # tulis tabel nilai
              "mapel": ["mtk", "ipa", "mtk", "ipa", "mtk", "ipa"],
              "skor": [80, 70, 90, 65, 75, 72]}).to_sql("nilai", con, index=False)
# rata-rata per mapel, hanya yang > 75
print(pd.read_sql("""SELECT mapel, ROUND(AVG(skor), 1) AS rata
                     FROM nilai GROUP BY mapel HAVING AVG(skor) > 75
                     ORDER BY rata DESC""", con))
con.close()  # tutup koneksi`,
    },
  },
}
