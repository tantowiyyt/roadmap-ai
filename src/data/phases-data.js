import { py } from './py.js'

export const matematika = {
  id: 'matematika',
  title: 'Matematika untuk AI',
  duration: '4 minggu (bisa paralel)',
  description:
    'Cukup paham konsep dan intuisinya — komputer yang menghitung. Bisa dipelajari bersamaan dengan tahap Data Science.',
  topics: [
    {
      id: 'mat-vektor',
      title: 'Vektor & matriks',
      summary: 'Bahasa yang dipakai AI untuk menyimpan dan mengolah data.',
      explain: [
        '**Vektor** adalah daftar angka, misalnya data satu rumah `[luas, kamar, umur]`. **Matriks** adalah tabel angka; satu dataset adalah matriks (baris = data, kolom = fitur).',
        '**Dot product** mengalikan elemen yang berpasangan lalu menjumlahkannya. Inilah operasi inti neural network: `output = input · bobot + bias`.',
        '**Perkalian matriks** (`A @ B`) adalah banyak dot product sekaligus. GPU sangat cepat melakukannya, karena itu GPU penting untuk AI.',
      ],
      uses: [
        'Merepresentasikan data: gambar = matriks piksel, kalimat = deretan vektor',
        'Menghitung output neural network (perkalian matriks bobot)',
        'Mengukur kemiripan dua data (cosine similarity, dipakai di pencarian & RAG)',
      ],
      examples: [
        {
          title: 'Vektor, dot product, dan matriks dengan NumPy',
          code: py`
import numpy as np  # NumPy untuk vektor & matriks

harga = np.array([5000, 12000, 3000])    # harga per barang
jumlah = np.array([2, 1, 5])             # jumlah dibeli
# @ = dot product: 5000x2 + 12000x1 + 3000x5
print("Total belanja (dot product):", harga @ jumlah)

# Matriks: 3 pembeli x 3 barang
belanja = np.array([  # baris = pembeli, kolom = barang
    [2, 1, 5],
    [0, 3, 1],
    [4, 0, 0],
])
# matriks @ vektor = total belanja setiap pembeli sekaligus
print("Total tiap pembeli:", belanja @ harga)

A = np.array([[1, 2], [3, 4]])  # matriks 2 x 2
B = np.array([[5, 6], [7, 8]])  # matriks 2 x 2 lainnya
print("A @ B =\n", A @ B)  # perkalian matriks
print("Transpose A =\n", A.T)  # .T = transpose: baris menjadi kolom
print("Shape:", belanja.shape)  # ukuran matriks (baris, kolom)`,
        },
        {
          title: 'Kemiripan dua vektor (cosine similarity)',
          code: py`
import numpy as np  # NumPy untuk vektor

def cosine(a, b):  # cosine similarity: kemiripan arah dua vektor
    # dot product dibagi perkalian panjang kedua vektor
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

# Fitur film: [aksi, romantis, komedi]
film_a = np.array([9, 1, 3])  # film aksi
film_b = np.array([8, 2, 2])  # film aksi juga
film_c = np.array([1, 9, 4])  # film romantis
print("A vs B:", round(cosine(film_a, film_b), 3))   # mirip
print("A vs C:", round(cosine(film_a, film_c), 3))   # beda`,
        },
      ],
    },
    {
      id: 'mat-aljabar',
      title: 'Aljabar linear lanjut',
      summary: 'Invers, sistem persamaan, eigen — dasar PCA dan regresi.',
      explain: [
        '**Invers matriks** `A⁻¹` seperti "pembagian" untuk matriks. Dipakai untuk menyelesaikan sistem persamaan linear dan rumus langsung regresi linear (normal equation).',
        '**Eigenvector** adalah arah yang tidak berubah arah ketika dikalikan matriks; **eigenvalue** adalah seberapa jauh ia diregangkan. **PCA** memakai eigenvector untuk menemukan arah data yang paling bervariasi.',
      ],
      uses: [
        'Menyelesaikan regresi linear secara langsung',
        'PCA untuk mengecilkan dimensi data',
        'Sistem rekomendasi (dekomposisi matriks)',
      ],
      examples: [
        {
          title: 'Sistem persamaan & eigen',
          code: py`
import numpy as np  # NumPy untuk aljabar linear

# 2x + y = 5
#  x + 3y = 10
A = np.array([[2, 1], [1, 3]])  # koefisien x dan y dari kedua persamaan
b = np.array([5, 10])  # ruas kanan persamaan
print("Solusi x, y:", np.linalg.solve(A, b))  # selesaikan sistem persamaan -> x = 1, y = 3
print("Invers A:\n", np.linalg.inv(A))  # matriks invers (kebalikan) dari A

# eigenvalue & eigenvector dari sebuah matriks
nilai, vektor = np.linalg.eig(np.array([[2, 0], [0, 3]]))
print("Eigenvalue:", nilai)  # seberapa besar peregangan di tiap arah
print("Eigenvector:\n", vektor)  # arah-arah istimewa yang tidak berbelok`,
        },
      ],
    },
    {
      id: 'mat-turunan',
      title: 'Turunan & gradien',
      summary: 'Mengukur seberapa cepat sesuatu berubah — inti dari cara model belajar.',
      explain: [
        '**Turunan** f\'(x) adalah kemiringan (slope) fungsi di titik x. Jika turunan positif, fungsi naik; jika negatif, fungsi turun.',
        '**Gradien** adalah kumpulan turunan parsial untuk fungsi dengan banyak variabel. Gradien menunjuk arah kenaikan paling curam.',
        '**Chain rule** menghitung turunan fungsi bersusun. Backpropagation di neural network pada dasarnya adalah chain rule yang diterapkan berulang kali.',
      ],
      uses: [
        'Menghitung ke arah mana bobot model harus diubah agar error turun',
        'Backpropagation di semua neural network',
      ],
      examples: [
        {
          title: 'Turunan numerik dan garis singgung',
          code: py`
import numpy as np  # NumPy untuk array
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

f = lambda x: x ** 2 - 4 * x + 5  # fungsi parabola yang ingin kita analisis

def turunan(f, x, h=1e-5):  # turunan numerik: geser x sedikit ke kanan dan kiri
    return (f(x + h) - f(x - h)) / (2 * h)  # kemiringan = selisih nilai / selisih x

for x in [0, 2, 4]:  # cek kemiringan di tiga titik
    # di x=2 kemiringannya 0: itulah titik terendah
    print(f"x={x}: f(x)={f(x)}, kemiringan={turunan(f, x):.2f}")

x = np.linspace(-1, 5, 100)  # 100 titik x dari -1 sampai 5
plt.plot(x, f(x), label="f(x) = x² - 4x + 5")  # gambar kurva fungsinya
x0 = 4  # titik tempat garis singgung digambar
# garis singgung = garis dengan kemiringan sama dengan turunan
plt.plot(x, f(x0) + turunan(f, x0) * (x - x0), "--", label=f"garis singgung di x={x0}")
plt.scatter([x0], [f(x0)], color="red")  # tandai titiknya dengan warna merah
# batasi sumbu tegak, tambah legenda dan grid
plt.ylim(-2, 12); plt.legend(); plt.grid(alpha=.3)
plt.show()  # tampilkan grafiknya`,
        },
      ],
    },
    {
      id: 'mat-optimasi',
      title: 'Gradient descent',
      summary: 'Algoritma "menuruni bukit" untuk mencari error terkecil.',
      explain: [
        'Bayangkan kamu di gunung berkabut dan ingin turun ke lembah. Langkahmu: rasakan kemiringan tanah, lalu melangkah ke arah yang menurun. Ulangi terus.',
        'Rumusnya: `x_baru = x - learning_rate × turunan`. **Learning rate** adalah besar langkah: terlalu kecil membuat proses lambat, terlalu besar membuatnya melompat-lompat dan tidak pernah sampai.',
        'Hampir semua model AI modern, termasuk LLM, dilatih dengan variasi gradient descent (SGD, Adam).',
      ],
      uses: [
        'Melatih regresi, neural network, dan LLM',
        'Optimasi apa pun yang ingin meminimalkan suatu nilai',
      ],
      examples: [
        {
          title: 'Gradient descent pada f(x) = (x − 3)²',
          code: py`
import numpy as np  # NumPy untuk array
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

f = lambda x: (x - 3) ** 2  # fungsi yang ingin dicari titik terendahnya (jawaban: x = 3)
df = lambda x: 2 * (x - 3)        # turunannya

x = -4.0  # titik awal tebakan
learning_rate = 0.1               # coba ganti: 0.01, 0.5, 1.05
jejak = [x]  # simpan posisi x di setiap langkah
for langkah in range(25):  # ulangi 25 langkah
    x = x - learning_rate * df(x)  # rumus inti: geser x berlawanan arah turunan
    jejak.append(x)  # catat posisi baru

print(f"Hasil akhir x = {x:.4f} (jawaban benar: 3)")

xs = np.linspace(-5, 10, 200)  # titik-titik untuk menggambar kurva
plt.plot(xs, f(xs))  # gambar kurva fungsi
# gambar jejak langkah gradient descent
plt.plot(jejak, [f(j) for j in jejak], "o-", color="red", markersize=4)
plt.title(f"Gradient descent, learning rate = {learning_rate}")
plt.show()  # tampilkan grafik`,
        },
      ],
      exercise: {
        task: 'Ubah learning_rate pada contoh di atas menjadi 0.01, 0.5, lalu 1.05. Apa yang terjadi pada masing-masing?',
        hint: 'Perhatikan jumlah langkah untuk sampai ke 3 dan apakah titik merahnya menjauh.',
        solution: py`
# 0.01 -> sangat lambat, setelah 25 langkah belum sampai 3
# 0.5  -> langsung tepat di 3 (untuk fungsi ini)
# 1.05 -> divergen: x makin menjauh (learning rate terlalu besar)
for lr in [0.01, 0.5, 1.05]:  # coba tiga learning rate berbeda
    x = -4.0  # mulai dari titik yang sama
    for _ in range(25):  # 25 langkah gradient descent
        x -= lr * 2 * (x - 3)  # x = x - lr x turunan
    print(f"lr={lr}: x akhir = {x:.3f}")  # lihat ke mana x berakhir`,
      },
    },
    {
      id: 'mat-prob',
      title: 'Probabilitas',
      summary: 'Mengukur ketidakpastian — AI selalu menjawab dengan peluang.',
      explain: [
        '**Probabilitas** adalah angka 0–1 yang menyatakan seberapa mungkin sesuatu terjadi. Output model klasifikasi berupa probabilitas, misalnya "92% spam".',
        '**Peluang bersyarat** P(A|B) adalah peluang A terjadi jika B sudah terjadi. **Teorema Bayes** membalik arah peluang bersyarat: P(A|B) = P(B|A)·P(A) / P(B). Dipakai di Naive Bayes untuk filter spam.',
        '**Distribusi normal** (kurva lonceng) muncul di mana-mana: tinggi badan, error pengukuran, inisialisasi bobot neural network.',
      ],
      uses: [
        'Output model klasifikasi (softmax = distribusi probabilitas)',
        'LLM memilih kata berikutnya berdasarkan probabilitas',
        'Naive Bayes untuk klasifikasi teks/spam',
      ],
      examples: [
        {
          title: 'Simulasi dadu & Teorema Bayes',
          code: py`
import numpy as np  # NumPy untuk simulasi acak
rng = np.random.default_rng(0)  # generator acak dengan seed tetap

lemparan = rng.integers(1, 7, size=10_000)  # lempar dadu 10.000 kali (angka 1 sampai 6)
# (lemparan == 6).mean() = proporsi lemparan yang menghasilkan 6
print("Peluang muncul 6 (simulasi):", (lemparan == 6).mean(), "| teori:", round(1/6, 4))

# Tes penyakit: penyakit diderita 1% orang.
# Tes benar positif 95% (jika sakit), salah positif 5% (jika sehat).
p_sakit = 0.01  # peluang seseorang sakit
p_pos_jika_sakit = 0.95  # peluang tes positif jika memang sakit
p_pos_jika_sehat = 0.05  # peluang tes positif padahal sehat (alarm palsu)
# total peluang tes positif (dari orang sakit + orang sehat)
p_pos = p_pos_jika_sakit * p_sakit + p_pos_jika_sehat * (1 - p_sakit)
p_sakit_jika_pos = p_pos_jika_sakit * p_sakit / p_pos  # Teorema Bayes: P(sakit | positif)
# :.1% = tampilkan sebagai persen
print(f"Jika tes positif, peluang benar-benar sakit = {p_sakit_jika_pos:.1%}")
print("Mengejutkan? Karena penyakitnya langka, banyak hasil positif yang palsu.")`,
        },
      ],
    },
    {
      id: 'mat-statistik',
      title: 'Statistik',
      summary: 'Meringkas dan memahami data dengan angka.',
      explain: [
        '**Mean** (rata-rata) sensitif terhadap outlier; **median** (nilai tengah) lebih tahan. **Standar deviasi** mengukur seberapa menyebar data.',
        '**Korelasi** (−1 sampai 1) mengukur hubungan linear dua variabel. Ingat: korelasi bukan sebab-akibat!',
      ],
      uses: [
        'Exploratory Data Analysis (EDA)',
        'Normalisasi/standardisasi fitur sebelum training',
        'Mendeteksi outlier dan anomali',
        'Mengevaluasi apakah model A benar-benar lebih baik dari model B',
      ],
      examples: [
        {
          title: 'Statistik deskriptif & histogram',
          code: py`
import numpy as np  # NumPy untuk statistik
import matplotlib.pyplot as plt  # Matplotlib untuk grafik

gaji = np.array([4.5, 5, 5.2, 4.8, 6, 5.5, 5.1, 50])   # juta, ada 1 outlier
print("Mean   :", gaji.mean().round(2))  # rata-rata ikut tertarik ke atas oleh outlier 50
print("Median :", np.median(gaji))  # median tetap mewakili gaji kebanyakan orang
print("Std    :", gaji.std().round(2))  # std besar karena ada outlier

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
jam_belajar = rng.uniform(0, 10, 100)  # 100 siswa dengan jam belajar 0 sampai 10
# nilai naik 4 poin per jam belajar, ditambah noise
nilai = 50 + 4 * jam_belajar + rng.normal(0, 5, 100)
# korelasi mendekati 1 = hubungan positif yang kuat
print("Korelasi jam belajar vs nilai:", np.corrcoef(jam_belajar, nilai)[0, 1].round(3))

fig, ax = plt.subplots(1, 2, figsize=(9, 3.5))  # dua grafik berdampingan
# 1000 tinggi badan acak berpola lonceng (distribusi normal)
ax[0].hist(rng.normal(170, 7, 1000), bins=30, color="teal")
ax[0].set_title("Distribusi normal (tinggi badan)")
ax[1].scatter(jam_belajar, nilai, s=12)  # titik-titik: jam belajar vs nilai
ax[1].set_title("Jam belajar vs nilai")
plt.show()  # tampilkan grafik`,
        },
      ],
    },
  ],
  project: 'Implementasikan gradient descent untuk mencari garis terbaik y = ax + b pada data buatanmu sendiri.',
  resources: [
    { label: '3Blue1Brown: Linear Algebra (visual)', url: 'https://www.3blue1brown.com/topics/linear-algebra' },
    { label: '3Blue1Brown: Calculus', url: 'https://www.3blue1brown.com/topics/calculus' },
    { label: 'Khan Academy: Statistik & Probabilitas', url: 'https://www.khanacademy.org/math/statistics-probability' },
    { label: 'Mathematics for Machine Learning (buku gratis)', url: 'https://mml-book.github.io/' },
  ],
  quiz: [
    {
      q: 'Apa yang terjadi jika learning rate terlalu besar?',
      options: ['Training lebih akurat', 'Nilai bisa melompat-lompat dan tidak konvergen', 'Tidak ada pengaruh', 'Model jadi lebih kecil'],
      answer: 1,
      why: 'Langkah yang terlalu besar melewati titik minimum, bahkan bisa makin menjauh.',
    },
    {
      q: 'Operasi apa yang paling banyak dipakai di dalam neural network?',
      options: ['Pengurutan', 'Perkalian matriks', 'Pembagian bulat', 'Faktorial'],
      answer: 1,
      why: 'Setiap layer menghitung input @ bobot + bias, yaitu perkalian matriks.',
    },
    {
      q: 'Data gaji punya satu nilai ekstrem. Ukuran mana yang lebih mewakili "gaji umum"?',
      options: ['Mean', 'Median', 'Maksimum', 'Jumlah'],
      answer: 1,
      why: 'Median tidak terpengaruh nilai ekstrem (outlier).',
    },
  ],
}

export const dataScience = {
  id: 'data-science',
  title: 'Data Science Tools',
  duration: '4 minggu',
  description: 'Model AI sebagus datanya. Di tahap ini kamu belajar mengolah dan memahami data.',
  topics: [
    {
      id: 'ds-numpy',
      title: 'NumPy',
      summary: 'Library untuk komputasi angka yang sangat cepat.',
      explain: [
        'NumPy menyediakan **array** yang jauh lebih cepat dari list Python karena dihitung di level bahasa C.',
        '**Vectorization**: operasi diterapkan ke seluruh array tanpa loop, misalnya `arr * 2`. **Broadcasting**: NumPy otomatis menyesuaikan ukuran array yang berbeda.',
        'Pandas, scikit-learn, dan PyTorch semuanya dibangun di atas konsep array NumPy.',
      ],
      uses: [
        'Representasi data numerik dan gambar',
        'Operasi matematika cepat pada jutaan angka',
        'Fondasi hampir semua library AI',
      ],
      examples: [
        {
          title: 'Dasar-dasar array',
          code: py`
import numpy as np  # NumPy untuk hitungan angka yang cepat, disingkat np

a = np.array([1, 2, 3, 4, 5])  # array: seperti list, tapi bisa dihitung sekaligus
# operasi berlaku ke semua elemen sekaligus, tanpa loop
print(a * 2, a ** 2, a.sum(), a.mean())
print(a[a > 2])                  # filter (boolean indexing)

m = np.arange(12).reshape(3, 4)  # matriks 3x4
print(m)  # cetak matriksnya
print("Shape:", m.shape)  # shape = (jumlah baris, jumlah kolom)
print("Baris ke-1:", m[1])  # ambil satu baris (indeks mulai 0)
print("Kolom ke-2:", m[:, 2])  # [:, 2] = semua baris, kolom ke-2
print("Jumlah per kolom:", m.sum(axis=0))  # axis=0 = jumlahkan ke bawah (per kolom)

# Broadcasting: standardisasi setiap kolom sekaligus
# 3 orang x 2 fitur (tinggi, berat)
data = np.array([[170, 65], [160, 50], [180, 80]], dtype=float)
# kurangi rata-rata lalu bagi std, untuk setiap kolom sekaligus
print((data - data.mean(axis=0)) / data.std(axis=0))`,
        },
        {
          title: 'Seberapa cepat dibanding loop?',
          code: py`
import numpy as np, time  # time untuk mengukur lama proses

n = 1_000_000  # satu juta data
lst = list(range(n))  # versi list Python
arr = np.arange(n)  # versi array NumPy

# kalikan 2 memakai loop Python (lambat)
t = time.perf_counter(); hasil = [x * 2 for x in lst]; t1 = time.perf_counter() - t
# kalikan 2 memakai NumPy (cepat, dihitung di bahasa C)
t = time.perf_counter(); hasil = arr * 2;             t2 = time.perf_counter() - t
print(f"List Python: {t1:.4f} detik")
# t1 / t2 = berapa kali lebih cepat
print(f"NumPy      : {t2:.4f} detik  (~{t1 / t2:.0f}x lebih cepat)")`,
        },
      ],
    },
    {
      id: 'ds-pandas',
      title: 'Pandas',
      summary: 'Excel-nya programmer: mengolah data tabel.',
      explain: [
        '**DataFrame** adalah tabel dengan baris dan kolom berlabel. **Series** adalah satu kolom.',
        'Operasi penting: membaca file (`pd.read_csv`), memilih kolom (`df["kolom"]`), filter (`df[df.umur > 20]`), mengelompokkan (`groupby`), dan menggabungkan tabel (`merge`).',
      ],
      uses: [
        'Membaca dataset CSV/Excel/SQL',
        'Membersihkan dan mengubah data sebelum training',
        'Analisis cepat: rata-rata per kategori, tren, dan lain-lain',
      ],
      examples: [
        {
          title: 'DataFrame dasar',
          code: py`
import pandas as pd  # Pandas untuk mengolah tabel data, disingkat pd

df = pd.DataFrame({  # DataFrame dibuat dari dict: kunci = nama kolom, isi = data kolom
    "nama":  ["Ani", "Budi", "Citra", "Dodi", "Eka", "Fajar"],
    "kelas": ["A", "B", "A", "B", "A", "B"],
    "mtk":   [90, 65, 78, 88, 55, 72],
    "ipa":   [85, 70, 80, 92, 60, 68],
})
print(df, "\n")  # tampilkan tabelnya
print(df.describe(), "\n")  # describe() = ringkasan statistik setiap kolom angka

df["rata"] = (df["mtk"] + df["ipa"]) / 2  # membuat kolom baru dari kolom lain
# filter baris (rata >= 75) lalu pilih dua kolom
print(df[df["rata"] >= 75][["nama", "rata"]], "\n")
print(df.groupby("kelas")[["mtk", "ipa"]].mean(), "\n")  # rata-rata nilai per kelas
# urutkan dari rata-rata tertinggi, ambil 3 teratas
print(df.sort_values("rata", ascending=False).head(3))`,
        },
      ],
      exercise: {
        task: 'Dari DataFrame contoh, tampilkan siswa dengan nilai mtk tertinggi di setiap kelas.',
        hint: 'Coba df.loc[df.groupby("kelas")["mtk"].idxmax()]',
        solution: py`
import pandas as pd
df = pd.DataFrame({  # data contoh
    "nama":  ["Ani", "Budi", "Citra", "Dodi", "Eka", "Fajar"],
    "kelas": ["A", "B", "A", "B", "A", "B"],
    "mtk":   [90, 65, 78, 88, 55, 72],
})
# idxmax() = indeks baris dengan nilai mtk tertinggi di tiap kelas; loc mengambil baris itu
print(df.loc[df.groupby("kelas")["mtk"].idxmax()])`,
      },
    },
    {
      id: 'ds-cleaning',
      title: 'Data cleaning',
      summary: 'Membersihkan data yang kosong, ganda, dan salah format.',
      explain: [
        'Data nyata hampir selalu "kotor": ada nilai kosong (NaN), duplikat, salah ketik, atau format yang tidak konsisten. Data scientist sering menghabiskan 60–80% waktunya di tahap ini.',
        'Strategi nilai kosong: hapus barisnya (`dropna`), isi dengan rata-rata/median/modus (`fillna`), atau isi dengan nilai khusus.',
        'Prinsip **"garbage in, garbage out"**: model terbaik pun akan buruk jika datanya buruk.',
      ],
      uses: [
        'Menyiapkan data sebelum training',
        'Menyamakan format (tanggal, huruf besar/kecil, satuan)',
        'Menghapus outlier yang merupakan kesalahan input',
      ],
      examples: [
        {
          title: 'Membersihkan data kotor',
          code: py`
import pandas as pd  # Pandas untuk tabel
import numpy as np  # NumPy untuk nilai kosong (np.nan)

# data kotor: spasi, huruf tidak seragam, kosong, duplikat, tidak masuk akal
df = pd.DataFrame({
    "nama": ["Ani", "budi ", "Citra", "Ani", "Dodi"],
    "umur": [20, np.nan, 22, 20, 250],
    "kota": ["Jakarta", "bandung", None, "Jakarta", "Surabaya"],
})
print("SEBELUM:\n", df, "\n")
# hitung nilai kosong di setiap kolom
print("Jumlah nilai kosong:\n", df.isna().sum(), "\n")

# hapus spasi di tepi, lalu Huruf Kapital Di Awal Kata
df["nama"] = df["nama"].str.strip().str.title()
# seragamkan huruf, isi kota kosong dengan teks pengganti
df["kota"] = df["kota"].str.title().fillna("Tidak diketahui")
df = df.drop_duplicates()  # buang baris yang sama persis
df.loc[df["umur"] > 120, "umur"] = np.nan          # umur 250 = salah input
# isi umur kosong dengan median (tahan terhadap outlier)
df["umur"] = df["umur"].fillna(df["umur"].median())

print("SESUDAH:\n", df)`,
        },
      ],
    },
    {
      id: 'ds-viz',
      title: 'Visualisasi (Matplotlib)',
      summary: 'Mengubah angka menjadi grafik yang mudah dipahami.',
      explain: [
        'Pilih grafik sesuai pertanyaan: **line** untuk tren waktu, **bar** untuk perbandingan kategori, **histogram** untuk sebaran, **scatter** untuk hubungan dua variabel.',
        'Matplotlib adalah library dasar. Seaborn dan Plotly membuat grafik lebih cantik dengan kode lebih sedikit (bisa dicoba di Colab).',
      ],
      uses: [
        'Memahami data saat EDA',
        'Memantau loss & akurasi selama training',
        'Mempresentasikan hasil ke orang non-teknis',
      ],
      examples: [
        {
          title: 'Empat jenis grafik utama',
          code: py`
import numpy as np  # untuk membuat data acak
import matplotlib.pyplot as plt  # untuk menggambar grafik
rng = np.random.default_rng(0)  # generator acak dengan seed 0 agar hasil selalu sama

fig, ax = plt.subplots(2, 2, figsize=(10, 7))  # satu gambar berisi 2 x 2 grafik

bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]  # label sumbu datar
# grafik garis: cocok untuk data yang berubah dari waktu ke waktu
ax[0, 0].plot(bulan, [120, 135, 128, 160, 175, 190], marker="o")
ax[0, 0].set_title("Line: penjualan per bulan")  # judul grafik pertama

# grafik batang: membandingkan kategori
ax[0, 1].bar(["Python", "JS", "Java", "Go"], [45, 30, 15, 10], color="orange")
ax[0, 1].set_title("Bar: bahasa favorit")

# histogram: melihat sebaran 500 nilai acak
ax[1, 0].hist(rng.normal(70, 10, 500), bins=25, color="green", alpha=.7)
ax[1, 0].set_title("Histogram: sebaran nilai")

x = rng.uniform(30, 200, 80)  # 80 angka acak antara 30 dan 200 (luas rumah)
# scatter: hubungan dua angka (harga = luas x 12 + noise)
ax[1, 1].scatter(x, x * 12 + rng.normal(0, 200, 80), alpha=.6)
ax[1, 1].set_title("Scatter: luas vs harga rumah")

plt.tight_layout()  # rapikan jarak antar grafik
plt.show()  # tampilkan semua grafik`,
        },
      ],
    },
    {
      id: 'ds-eda',
      title: 'Exploratory Data Analysis (EDA)',
      summary: 'Menggali pola dan insight sebelum membuat model.',
      explain: [
        'EDA adalah "berkenalan" dengan data: berapa ukurannya, apa saja kolomnya, apakah ada yang kosong, bagaimana sebarannya, dan fitur mana yang berhubungan dengan target.',
        'Langkah umum: `df.info()` → `df.describe()` → cek nilai kosong → visualisasi tiap kolom → cek korelasi dengan target → tulis temuan.',
        'Contoh di bawah memakai dataset **Iris**: ukuran bunga untuk menebak spesiesnya. Ini dataset klasik untuk belajar.',
      ],
      uses: [
        'Menentukan fitur mana yang berguna untuk model',
        'Menemukan masalah data lebih awal',
        'Mendapat insight bisnis bahkan tanpa model',
      ],
      examples: [
        {
          title: 'EDA dataset Iris',
          code: py`
import pandas as pd  # Pandas untuk tabel
import matplotlib.pyplot as plt  # Matplotlib untuk grafik
from sklearn.datasets import load_iris  # dataset bunga iris bawaan scikit-learn

iris = load_iris(as_frame=True)  # as_frame=True agar datanya berupa DataFrame
df = iris.frame  # tabel berisi fitur + kolom target
# ubah target angka (0, 1, 2) menjadi nama spesies
df["spesies"] = df["target"].map(dict(enumerate(iris.target_names)))

print("Ukuran:", df.shape)  # jumlah baris dan kolom
print(df.head(), "\n")  # 5 baris pertama
print("Nilai kosong:", df.isna().sum().sum())  # total nilai kosong di seluruh tabel
print(df["spesies"].value_counts(), "\n")  # jumlah data per spesies (apakah seimbang?)
# rata-rata setiap fitur per spesies
print(df.groupby("spesies").mean(numeric_only=True).round(2))

fig, ax = plt.subplots(figsize=(6, 4))  # siapkan satu grafik
for nama, grup in df.groupby("spesies"):  # gambar setiap spesies dengan warna berbeda
    # sumbu datar = panjang petal, sumbu tegak = lebar petal
    ax.scatter(grup["petal length (cm)"], grup["petal width (cm)"], label=nama, alpha=.7)
# beri label sumbu dan legenda
ax.set_xlabel("Panjang petal"); ax.set_ylabel("Lebar petal"); ax.legend()
ax.set_title("Insight: ukuran petal memisahkan spesies dengan jelas")
plt.show()  # tampilkan grafiknya`,
        },
      ],
    },
    {
      id: 'ds-sql',
      title: 'SQL dasar',
      summary: 'Bahasa untuk mengambil data dari database.',
      explain: [
        'Data perusahaan biasanya disimpan di database, bukan CSV. **SQL** adalah bahasa untuk mengambil dan meringkas data tersebut.',
        'Perintah inti: `SELECT` (pilih kolom), `WHERE` (filter), `GROUP BY` (kelompokkan), `ORDER BY` (urutkan), `JOIN` (gabungkan tabel).',
      ],
      uses: [
        'Mengambil data training dari database perusahaan',
        'Analisis data cepat',
        'Hampir selalu ditanyakan di interview data/AI',
      ],
      examples: [
        {
          title: 'SQL dengan SQLite + Pandas',
          code: py`
import sqlite3  # database SQLite bawaan Python
import pandas as pd  # Pandas untuk membaca hasil query sebagai tabel

# database sementara di memori (hilang saat program selesai)
con = sqlite3.connect(":memory:")
# jalankan beberapa perintah SQL: buat tabel dan isi data
con.executescript("""
CREATE TABLE pelanggan (id INTEGER, nama TEXT, kota TEXT);
INSERT INTO pelanggan VALUES (1,'Ani','Jakarta'),(2,'Budi','Bandung'),(3,'Citra','Jakarta');
CREATE TABLE pesanan (id INTEGER, pelanggan_id INTEGER, total INTEGER);
INSERT INTO pesanan VALUES (1,1,150000),(2,1,80000),(3,2,200000),(4,3,50000),(5,3,120000);
""")

# query: total belanja setiap pelanggan
query = """
SELECT p.nama, p.kota, COUNT(o.id) AS jumlah_pesanan, SUM(o.total) AS total_belanja
FROM pelanggan p
JOIN pesanan o ON o.pelanggan_id = p.id
GROUP BY p.nama
ORDER BY total_belanja DESC
"""
print(pd.read_sql(query, con))  # jalankan query, hasilnya berupa DataFrame
print()
# query kedua: jumlah pelanggan per kota
print(pd.read_sql("SELECT kota, COUNT(*) AS n FROM pelanggan GROUP BY kota", con))`,
        },
      ],
    },
  ],
  project: 'EDA dataset Titanic di Kaggle: siapa yang lebih mungkin selamat, dan kenapa?',
  resources: [
    { label: 'NumPy: Absolute Beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html' },
    { label: 'Pandas: Getting Started', url: 'https://pandas.pydata.org/docs/getting_started/index.html' },
    { label: 'Kaggle Learn: Pandas', url: 'https://www.kaggle.com/learn/pandas' },
    { label: 'Kaggle Learn: Intro to SQL', url: 'https://www.kaggle.com/learn/intro-to-sql' },
  ],
  quiz: [
    {
      q: 'Grafik apa yang paling tepat untuk melihat hubungan luas rumah dan harga?',
      options: ['Pie chart', 'Scatter plot', 'Bar chart', 'Histogram'],
      answer: 1,
      why: 'Scatter plot menampilkan hubungan antara dua variabel numerik.',
    },
    {
      q: 'Fungsi Pandas untuk mengisi nilai kosong adalah…',
      options: ['dropna()', 'fillna()', 'groupby()', 'merge()'],
      answer: 1,
      why: 'fillna() mengisi NaN; dropna() justru menghapus baris yang mengandung NaN.',
    },
    {
      q: 'Perintah SQL untuk mengelompokkan data adalah…',
      options: ['WHERE', 'ORDER BY', 'GROUP BY', 'SELECT'],
      answer: 2,
      why: 'GROUP BY mengelompokkan baris sehingga bisa dihitung COUNT, SUM, AVG per kelompok.',
    },
  ],
}
