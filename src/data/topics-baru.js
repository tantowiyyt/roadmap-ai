import { py } from './py.js'

// Materi baru (gelombang 2): statistik inferensial, sistem rekomendasi, reinforcement learning, audio & multimodal.
// Formatnya sama dengan topics-extra.js. `after` boleh menunjuk materi tambahan lain (diproses setelah topics-extra).

export const topikBaru = {
  // ---------------- Menengah: Matematika ----------------
  matematika: [
    {
      after: 'mat-statistik',
      id: 'mat-inferensi',
      title: 'Statistik inferensial: uji hipotesis & A/B test',
      summary: 'Menarik kesimpulan tentang populasi dari sampel: interval kepercayaan, p-value, dan A/B test yang jujur.',
      explain: [
        'Kita hampir tidak pernah punya data seluruh **populasi** (semua mahasiswa Indonesia, semua calon pembeli). Yang ada hanya **sampel**. Statistik inferensial menjawab: seberapa yakin kesimpulan dari sampel juga berlaku untuk populasinya?',
        '**Interval kepercayaan (confidence interval)** memberi rentang nilai yang masuk akal, bukan satu angka. "Rata-rata tidur 6,4 jam (95% CI 6,1–6,8)" jauh lebih jujur daripada "rata-rata tidur 6,4 jam". Rentang ini bisa dihitung dengan rumus, atau dengan **bootstrap**: mengambil ulang sampel secara acak ribuan kali.',
        '**Uji hipotesis** dimulai dari anggapan "tidak ada perbedaan" (**H0**). **p-value** adalah peluang mendapat hasil seekstrem ini *jika H0 benar*. p-value kecil (biasanya < 0,05) berarti hasilnya sulit dijelaskan oleh kebetulan saja. p-value **bukan** peluang H0 benar, dan **bukan** ukuran seberapa besar efeknya.',
        '**A/B test** adalah eksperimen acak: sebagian pengguna melihat versi A, sebagian versi B, lalu dibandingkan. Karena pembagiannya acak, perbedaan hasil bisa dianggap disebabkan oleh perubahan itu. Jebakan umum: sampel terlalu kecil, mengintip hasil lalu berhenti saat "menang", dan menguji banyak variasi sekaligus tanpa koreksi.',
      ],
      uses: [
        'Memutuskan apakah desain tombol/halaman baru benar-benar menaikkan penjualan (A/B test)',
        'Melaporkan hasil survei dengan rentang ketidakpastian, bukan angka tunggal',
        'Membandingkan dua model ML: apakah selisih akurasinya nyata atau kebetulan?',
        'Menentukan berapa banyak responden/pengguna yang dibutuhkan sebelum eksperimen',
      ],
      examples: [
        {
          title: 'Interval kepercayaan: rumus vs bootstrap',
          code: py`
import numpy as np  # angka acak & perhitungan
from scipy import stats  # distribusi statistik

rng = np.random.default_rng(0)  # seed agar hasil sama
sampel = rng.normal(6.4, 1.1, 40).round(1)  # jam tidur 40 mahasiswa yang disurvei
n, rata = len(sampel), sampel.mean()  # ukuran & rata-rata sampel
print(f"rata-rata sampel: {rata:.2f} jam")  # satu angka saja belum cukup

se = sampel.std(ddof=1) / np.sqrt(n)  # standard error: ketidakpastian rata-rata
t = stats.t.ppf(0.975, df=n - 1)  # nilai kritis distribusi t untuk 95%
print(f"95% CI rumus    : {rata - t * se:.2f} - {rata + t * se:.2f} jam")  # rentang dari rumus

boot = [rng.choice(sampel, n, replace=True).mean() for _ in range(5000)]  # ambil ulang sampel 5000 kali
lo, hi = np.percentile(boot, [2.5, 97.5])  # 95% di tengah sebaran rata-rata bootstrap
print(f"95% CI bootstrap: {lo:.2f} - {hi:.2f} jam")  # hasilnya mirip rumus`,
        },
        {
          title: 'A/B test: apakah tombol "Beli" baru lebih baik?',
          code: py`
import numpy as np  # perhitungan
from scipy import stats  # uji statistik

pengunjung = np.array([2400, 2380])  # versi A (lama) dan B (baru), dibagi acak
beli = np.array([96, 131])  # jumlah yang membeli
konversi = beli / pengunjung  # tingkat konversi
print("konversi A, B:", (konversi * 100).round(2), "%")  # 4,00% vs 5,50%

tabel = np.column_stack([beli, pengunjung - beli])  # 2x2: [beli, tidak beli] per versi
chi2, p, dof, _ = stats.chi2_contingency(tabel)  # uji: apakah proporsinya berbeda?
print("p-value:", round(p, 4))  # peluang selisih sebesar ini muncul jika sebenarnya sama

selisih = konversi[1] - konversi[0]  # efek: berapa poin persen naiknya
se = np.sqrt((konversi * (1 - konversi) / pengunjung).sum())  # standard error selisih
print(f"selisih: {selisih * 100:.2f} poin persen (95% CI {(selisih - 1.96 * se) * 100:.2f} s.d. {(selisih + 1.96 * se) * 100:.2f})")  # besar efek + ketidakpastian
print("keputusan:", "pakai B" if p < 0.05 and selisih > 0 else "belum cukup bukti")  # kesimpulan`,
        },
      ],
      exercise: {
        task: 'Dua kelas mencoba metode belajar berbeda. Buat data tiruan: kelas A (35 siswa, rata-rata 72, simpangan 10) dan kelas B (35 siswa, rata-rata 77, simpangan 10) dengan seed 3. Lakukan Welch t-test, hitung selisih rata-rata, dan ukuran efek Cohen\'s d. Apakah perbedaannya signifikan? Jika tidak, kenapa bisa begitu padahal kita tahu selisih sebenarnya 5 poin?',
        hint: '`stats.ttest_ind(b, a, equal_var=False)`. Cohen\'s d = selisih rata-rata / akar rata-rata kedua varians. d ≈ 0,2 kecil, 0,5 sedang, 0,8 besar.',
        solution: py`
import numpy as np  # angka acak
from scipy import stats  # uji t

rng = np.random.default_rng(3)  # seed
a = rng.normal(72, 10, 35)  # nilai kelas A
b = rng.normal(77, 10, 35)  # nilai kelas B
t, p = stats.ttest_ind(b, a, equal_var=False)  # Welch t-test (tidak mengasumsikan varians sama)
selisih = b.mean() - a.mean()  # besar perbedaan
d = selisih / np.sqrt((a.var(ddof=1) + b.var(ddof=1)) / 2)  # Cohen's d: efek dalam satuan simpangan baku
print(f"rata-rata A={a.mean():.1f}, B={b.mean():.1f}, selisih={selisih:.1f}")  # ringkasan
print(f"p-value={p:.4f} -> {'signifikan' if p < 0.05 else 'tidak signifikan'} pada 0,05")  # keputusan
print(f"Cohen's d={d:.2f}")  # besar efek praktis
print("catatan: selisih SEBENARNYA 5 poin, tapi 35 siswa per kelas sering belum cukup untuk mendeteksinya")  # soal ukuran sampel (power)`,
      },
      steps: [
        ['Tulis pertanyaan & metrik', 'Mis. "Apakah tombol B menaikkan konversi?" Metrik: persen pengunjung yang membeli.'],
        ['Tentukan ukuran sampel dulu', 'Hitung sebelum mulai (power analysis), lalu jangan berhenti lebih awal.'],
        ['Acak pembagiannya', 'Setiap pengguna masuk A atau B secara acak, bukan dipilih.'],
        ['Uji & hitung efek', 'p-value untuk "nyata atau kebetulan", selisih + CI untuk "seberapa besar".'],
        ['Putuskan secara praktis', 'Efek kecil yang signifikan belum tentu sepadan dengan biayanya.'],
      ],
      case: {
        title: 'Dua puluh warna tombol, satu "menang": benarkah?',
        situation: 'Tim marketing menguji 20 warna tombol sekaligus terhadap tombol lama. Satu warna mendapat p-value 0,03 dan langsung diumumkan sebagai pemenang. Padahal, apakah warna memang berpengaruh?',
        steps: [
          'Simulasikan kondisi terburuk: semua warna sebenarnya **sama persis** dengan tombol lama (A/A test).',
          'Ulangi "eksperimen 20 warna" 1.000 kali dan hitung seberapa sering minimal satu warna terlihat "signifikan".',
          'Terapkan koreksi Bonferroni (batas 0,05 / 20) dan bandingkan.',
          'Kesimpulan: uji ulang pemenang dalam eksperimen baru sebelum dipakai.',
        ],
        code: py`
import numpy as np  # simulasi
from scipy import stats  # uji proporsi

rng = np.random.default_rng(7)  # seed
n, konversi = 2000, 0.05  # pengunjung per versi & konversi yang SAMA untuk semua versi
palsu = palsu_koreksi = 0  # penghitung "pemenang palsu"
for _ in range(1000):  # ulangi eksperimen 1000 kali
    lama = rng.binomial(n, konversi)  # pembeli di tombol lama
    p_values = []  # p-value tiap warna
    for warna in range(20):  # 20 warna baru
        baru = rng.binomial(n, konversi)  # pembeli di warna ini (sebenarnya tidak ada efek)
        tabel = [[lama, n - lama], [baru, n - baru]]  # tabel 2x2
        p_values.append(stats.chi2_contingency(tabel)[1])  # simpan p-value
    palsu += min(p_values) < 0.05  # ada yang tampak "menang" tanpa koreksi?
    palsu_koreksi += min(p_values) < 0.05 / 20  # dengan koreksi Bonferroni
print(f"tanpa koreksi : {palsu / 10:.1f}% eksperimen punya 'pemenang' palsu")  # jauh di atas 5%
print(f"dengan koreksi: {palsu_koreksi / 10:.1f}%")  # kembali ke kisaran aman`,
        result: 'Tanpa koreksi, hampir 4 dari 10 eksperimen menghasilkan "pemenang" padahal semua warna sama (jauh di atas 5% yang kita kira). Dengan koreksi Bonferroni (atau uji ulang pemenangnya), kesalahan ini kembali terkendali.',
      },
      deep: {
        concepts: [
          ['Arti p-value yang benar', 'p = 0,03 artinya: jika sebenarnya tidak ada perbedaan, hasil seekstrem ini muncul sekitar 3% dari waktu. Itu BUKAN "peluang hipotesis benar 97%". Dan p kecil bisa terjadi pada efek yang sangat kecil jika sampelnya besar.'],
          ['Signifikan statistik vs penting secara praktis', 'Dengan 1 juta pengguna, kenaikan konversi 0,01 poin persen bisa signifikan, tetapi mungkin tidak sebanding dengan biaya pengembangannya. Selalu laporkan besar efek + interval kepercayaannya.'],
          ['Mengintip hasil (peeking)', 'Mengecek p-value setiap hari dan berhenti saat < 0,05 membuat peluang "pemenang palsu" jauh lebih besar dari 5%. Tentukan ukuran sampel di awal, atau pakai metode sekuensial yang dirancang untuk itu.'],
          ['Korelasi bukan sebab-akibat', 'Hanya eksperimen acak (A/B test) yang bisa menunjukkan sebab-akibat dengan kuat. Data observasi (survei, log) menunjukkan hubungan, yang bisa saja disebabkan faktor ketiga.'],
        ],
        mistakes: [
          ['"p > 0,05, berarti tidak ada efek."', 'Artinya belum cukup bukti; bisa jadi sampelnya terlalu kecil untuk mendeteksi efek.'],
          ['Menguji 20 metrik lalu melaporkan yang signifikan saja.', 'Tentukan satu metrik utama sebelum eksperimen; koreksi untuk banyak pengujian.'],
          ['Membagi A dan B berdasarkan hari (Senin A, Selasa B).', 'Acak per pengguna agar faktor lain (hari, cuaca, promo) tersebar merata.'],
        ],
        tips: [
          'Laporkan: besar efek, interval kepercayaan, p-value, dan ukuran sampel, bukan p-value saja.',
          'Untuk membandingkan dua model ML, pakai skor dari cross-validation yang sama (fold sama) atau bootstrap pada data uji.',
        ],
        check: [
          ['Hasil A/B test: p = 0,20. Apa kesimpulan yang tepat?', 'Belum ada cukup bukti bahwa A dan B berbeda. Bukan berarti keduanya pasti sama; mungkin perlu sampel lebih besar.'],
          ['Kenapa pembagian A/B harus acak?', 'Agar satu-satunya perbedaan sistematis antar kelompok adalah perubahan yang diuji, sehingga perbedaan hasil bisa dianggap disebabkan oleh perubahan itu.'],
        ],
      },
    },
  ],

  // ---------------- Mahir: Machine Learning ----------------
  'machine-learning': [
    {
      after: 'ml-interpretasi',
      id: 'ml-rekomendasi',
      title: 'Sistem rekomendasi',
      summary: 'Menyarankan produk, film, atau materi yang paling mungkin disukai: content-based dan collaborative filtering.',
      algos: ['knn'],
      explain: [
        'Sistem rekomendasi ada di mana-mana: produk di toko online, video berikutnya, lagu, bahkan materi belajar. Tujuannya: dari ribuan pilihan, tampilkan beberapa yang paling mungkin disukai **orang ini**.',
        '**Content-based**: rekomendasikan barang yang **mirip** dengan yang pernah disukai, berdasarkan ciri barangnya (genre, deskripsi, harga). Cocok untuk barang baru yang belum punya riwayat.',
        '**Collaborative filtering**: "orang yang selera beli-nya mirip denganmu juga menyukai X". Hanya memakai pola interaksi (rating, klik, pembelian), tanpa perlu tahu isi barangnya. Versi **item-based** mencari barang yang sering disukai oleh orang yang sama; **matrix factorization** meringkas selera pengguna dan sifat barang menjadi beberapa angka tersembunyi.',
        'Tantangannya: **cold start** (pengguna/barang baru tanpa riwayat), data yang sangat jarang terisi (sparse), dan evaluasi. Model harus selalu dibandingkan dengan baseline sederhana: **"rekomendasikan yang paling populer"**, yang sering kali sudah cukup kuat.',
      ],
      uses: [
        'Produk "sering dibeli bersama" dan "mungkin kamu suka" di toko online',
        'Rekomendasi film, musik, video, dan artikel berita',
        'Menyarankan materi belajar berikutnya sesuai kemampuan siswa',
        'Rekomendasi menu atau promo yang dipersonalisasi untuk UMKM',
      ],
      examples: [
        {
          title: 'Item-based collaborative filtering untuk menu kafe',
          code: py`
import numpy as np, pandas as pd  # angka & tabel

menu = ["kopi susu", "es teh", "americano", "matcha", "roti bakar", "pisang goreng"]  # barang
rating = pd.DataFrame([  # baris = pelanggan, kolom = menu, 0 = belum pernah beli
    [5, 3, 0, 1, 4, 0],
    [4, 0, 0, 1, 5, 4],
    [1, 1, 0, 5, 0, 4],
    [0, 0, 5, 4, 0, 0],
    [0, 1, 5, 4, 1, 0],
], index=["Ani", "Budi", "Citra", "Dodi", "Eka"], columns=menu)

M = rating.to_numpy(dtype=float)  # matriks pelanggan x menu
norma = np.linalg.norm(M, axis=0)  # panjang vektor tiap menu
sim = pd.DataFrame((M.T @ M) / np.outer(norma, norma), index=menu, columns=menu)  # cosine similarity antar menu
print(sim["kopi susu"].drop("kopi susu").sort_values(ascending=False).round(2))  # menu yang "mirip" kopi susu

def rekomendasi(nama, n=2):  # saran untuk satu pelanggan
    r = rating.loc[nama].to_numpy(dtype=float)  # rating pelanggan ini
    skor = sim.to_numpy() @ r / sim.to_numpy().sum(axis=1)  # rata-rata berbobot dari menu yang ia sukai
    skor = pd.Series(skor, index=menu)[r == 0]  # hanya menu yang belum pernah ia beli
    return skor.sort_values(ascending=False).head(n).round(2)  # n teratas

print("untuk Ani:", rekomendasi("Ani").to_dict())  # saran untuk Ani`,
        },
        {
          title: 'Matrix factorization: menebak rating yang kosong',
          code: py`
import numpy as np  # perhitungan

R = np.array([  # rating 1-5, 0 = belum ada (yang ingin ditebak)
    [5, 4, 0, 1, 0],
    [4, 0, 4, 1, 1],
    [1, 1, 0, 5, 4],
    [0, 1, 1, 4, 5],
], dtype=float)
ada = R > 0  # posisi rating yang diketahui
rng = np.random.default_rng(0)  # seed
k = 2  # jumlah "selera tersembunyi" (mis. suka manis, suka kopi)
P = rng.normal(0, 0.1, (R.shape[0], k))  # vektor selera tiap pengguna
Q = rng.normal(0, 0.1, (R.shape[1], k))  # vektor sifat tiap barang
for epoch in range(3000):  # gradient descent sederhana
    E = (R - P @ Q.T) * ada  # galat hanya pada rating yang diketahui
    P += 0.01 * (E @ Q - 0.02 * P)  # perbarui selera pengguna (+ regularisasi kecil)
    Q += 0.01 * (E.T @ P - 0.02 * Q)  # perbarui sifat barang

tebak = P @ Q.T  # rating lengkap hasil model
print("galat rata-rata pada rating diketahui:", round(np.abs((R - tebak)[ada]).mean(), 2))  # seberapa pas
print("tebakan untuk sel kosong:")  # yang sebelumnya 0
for u, i in zip(*np.where(~ada)):  # setiap sel kosong
    print(f"  pengguna {u}, barang {i}: {tebak[u, i]:.1f}")  # perkiraan rating`,
        },
      ],
      exercise: {
        task: 'Buat rekomendasi **content-based** dari deskripsi menu: ubah deskripsi menjadi vektor TF-IDF, hitung cosine similarity, lalu tampilkan 2 menu yang paling mirip dengan "kopi susu gula aren".',
        hint: '`TfidfVectorizer().fit_transform(deskripsi)` lalu `cosine_similarity(X)`. Urutkan baris menu tersebut, buang menu itu sendiri.',
        solution: py`
from sklearn.feature_extraction.text import TfidfVectorizer  # teks -> vektor
from sklearn.metrics.pairwise import cosine_similarity  # kemiripan antar vektor

menu = {  # nama: deskripsi
    "kopi susu gula aren": "kopi espresso susu segar gula aren manis dingin",
    "americano": "kopi espresso air panas tanpa gula pahit",
    "es kopi susu": "kopi espresso susu es manis",
    "matcha latte": "teh hijau matcha susu manis",
    "es teh manis": "teh melati gula es manis",
    "roti bakar cokelat": "roti panggang mentega cokelat manis",
}
nama = list(menu)  # daftar nama
X = TfidfVectorizer().fit_transform(menu.values())  # vektor kata tiap deskripsi
sim = cosine_similarity(X)  # matriks kemiripan
i = nama.index("kopi susu gula aren")  # menu acuan
urut = sim[i].argsort()[::-1]  # dari yang paling mirip
saran = [(nama[j], round(float(sim[i, j]), 2)) for j in urut if j != i][:2]  # 2 teratas, selain dirinya
print(saran)`,
      },
      steps: [
        ['Tentukan sinyalnya', 'Rating eksplisit (bintang) atau implisit (klik, beli, durasi tonton).'],
        ['Buat baseline populer', 'Rekomendasikan barang terpopuler; ini patokan minimal.'],
        ['Pilih pendekatan', 'Content-based untuk barang baru; collaborative untuk riwayat yang kaya; gabungan (hybrid) di produk nyata.'],
        ['Evaluasi offline', 'Sembunyikan interaksi terakhir tiap pengguna, ukur hit rate@k / precision@k.'],
        ['Uji online & pantau', 'A/B test di pengguna sungguhan; perhatikan keberagaman, bukan hanya klik.'],
      ],
      case: {
        title: 'Rekomendasi buku perpustakaan sekolah',
        situation: 'Perpustakaan ingin menampilkan 3 saran buku di halaman siswa. Apakah collaborative filtering lebih baik daripada sekadar "buku terpopuler"? Diuji dengan menyembunyikan satu pinjaman terakhir setiap siswa.',
        steps: [
          'Data tiruan: 60 siswa, 30 buku dari 3 genre; setiap siswa cenderung meminjam satu genre.',
          'Untuk setiap siswa, sembunyikan satu pinjaman sebagai "jawaban".',
          'Model A: 3 buku terpopuler yang belum dipinjam. Model B: item-based collaborative filtering.',
          'Ukur **hit rate@3**: seberapa sering buku yang disembunyikan ada di 3 saran.',
        ],
        code: py`
import numpy as np  # perhitungan

rng = np.random.default_rng(1)  # seed
siswa, buku = 60, 30  # jumlah siswa & buku
genre_buku = np.repeat([0, 1, 2], 10)  # buku 0-9 genre 0, 10-19 genre 1, 20-29 genre 2
popularitas = rng.uniform(0.5, 1.5, buku)  # sebagian buku memang lebih populer
X = np.zeros((siswa, buku))  # matriks pinjam (1 = pernah pinjam)
for s in range(siswa):  # buat riwayat tiap siswa
    suka = s % 3  # genre favorit siswa ini
    p = np.where(genre_buku == suka, 0.45, 0.04) * popularitas  # peluang pinjam tiap buku
    X[s] = rng.random(buku) < np.clip(p, 0, 1)  # pinjam atau tidak

hit_pop = hit_cf = uji = 0  # penghitung
for s in range(siswa):  # evaluasi leave-one-out
    dipinjam = np.flatnonzero(X[s])  # buku yang pernah dipinjam siswa ini
    if len(dipinjam) < 2: continue  # butuh minimal 2 agar ada yang bisa disembunyikan
    jawaban = rng.choice(dipinjam)  # sembunyikan satu
    latih = X.copy(); latih[s, jawaban] = 0  # data yang boleh dilihat model
    sudah = latih[s] > 0  # buku yang terlihat sudah dipinjam

    pop = latih.sum(axis=0); pop[sudah] = -1  # A: terpopuler yang belum dipinjam
    norma = np.linalg.norm(latih, axis=0) + 1e-9  # panjang vektor tiap buku
    sim = (latih.T @ latih) / np.outer(norma, norma)  # kemiripan antar buku
    skor = sim @ latih[s]; skor[sudah] = -1  # B: mirip dengan yang pernah dipinjam

    hit_pop += jawaban in np.argsort(pop)[-3:]  # tebakan A benar?
    hit_cf += jawaban in np.argsort(skor)[-3:]  # tebakan B benar?
    uji += 1  # jumlah siswa yang diuji
print(f"hit rate@3 populer : {hit_pop / uji:.0%}")  # baseline
print(f"hit rate@3 item-CF : {hit_cf / uji:.0%}")  # model`,
        result: 'Collaborative filtering menebak buku yang disembunyikan jauh lebih sering daripada daftar terpopuler, karena memanfaatkan pola genre setiap siswa. Di data nyata, selisihnya harus selalu diukur seperti ini sebelum dipakai.',
      },
      deep: {
        concepts: [
          ['Umpan balik implisit', 'Kebanyakan aplikasi tidak punya rating bintang, hanya klik/beli/tonton. "Tidak klik" belum tentu "tidak suka", mungkin belum pernah lihat. Model untuk data implisit memperlakukan barang yang tidak disentuh sebagai sinyal lemah, bukan negatif pasti.'],
          ['Cold start', 'Pengguna baru: tanya preferensi di awal atau tampilkan yang populer. Barang baru: pakai fitur kontennya (content-based) sampai ada cukup interaksi.'],
          ['Two-stage system', 'Di skala besar, rekomendasi dibuat dua tahap: **retrieval** memilih ratusan kandidat dengan cepat (sering memakai embedding & vector search), lalu **ranking** mengurutkannya dengan model yang lebih detail.'],
          ['Gelembung filter & keberagaman', 'Mengoptimalkan klik saja bisa membuat pengguna hanya melihat hal yang itu-itu saja. Produk yang baik juga mengukur keberagaman, kebaruan, dan keadilan bagi penjual kecil.'],
        ],
        mistakes: [
          ['Tidak membandingkan dengan "terpopuler".', 'Selalu hitung baseline populer; model rumit sering hanya sedikit lebih baik.'],
          ['Mengevaluasi dengan membagi interaksi secara acak tanpa melihat waktu.', 'Untuk simulasi realistis, sembunyikan interaksi terakhir (berdasarkan waktu), bukan acak.'],
          ['Merekomendasikan barang yang sudah dibeli (mis. kulkas).', 'Saring barang yang sudah dimiliki, kecuali barang habis pakai.'],
        ],
        tips: [
          'Library: `implicit` (ALS untuk data implisit), `surprise` (rating eksplisit), LightFM (hybrid).',
          'Dataset latihan: MovieLens (grouplens.org) dan Online Retail (UCI).',
        ],
        check: [
          ['Toko online baru buka dan belum punya data pembelian. Pendekatan apa yang bisa dipakai?', 'Content-based (berdasarkan ciri produk) dan rekomendasi populer/kurasi manual, sampai interaksi cukup untuk collaborative filtering.'],
          ['Apa itu hit rate@3?', 'Persentase pengguna yang barang "jawaban"-nya (disembunyikan saat uji) muncul di 3 saran teratas.'],
        ],
      },
    },
    {
      after: 'ml-rekomendasi',
      id: 'ml-rl',
      title: 'Reinforcement learning dasar',
      summary: 'Belajar dari coba-coba dan hadiah: agen, aksi, reward, eksplorasi vs eksploitasi, hingga RLHF di LLM.',
      algos: ['q-learning'],
      explain: [
        'Di **reinforcement learning (RL)**, tidak ada kunci jawaban. Sebuah **agen** mencoba **aksi** di sebuah **lingkungan**, lalu mendapat **reward** (hadiah atau hukuman). Tujuannya mempelajari **policy**: aturan memilih aksi yang memaksimalkan total reward jangka panjang.',
        'Dilema utama RL adalah **eksplorasi vs eksploitasi**: terus memakai pilihan yang sejauh ini terbaik, atau mencoba pilihan lain yang mungkin lebih baik? Strategi sederhana **epsilon-greedy**: sebagian kecil waktu (ε) pilih acak, sisanya pilih yang terbaik.',
        'Kasus paling sederhana adalah **multi-armed bandit**: memilih satu dari beberapa opsi berulang kali (mis. banner promo mana yang ditampilkan). Kasus lengkap melibatkan **state** yang berubah, misalnya robot di labirin. **Q-learning** mempelajari nilai Q(state, aksi) dengan aturan: Q ← Q + α·(reward + γ·max Q berikutnya − Q), dengan γ menentukan seberapa penting masa depan.',
        'RL dipakai di game (AlphaGo), robotika, sistem rekomendasi, dan penting untuk LLM: **RLHF** (reinforcement learning from human feedback) melatih model agar jawabannya lebih disukai manusia, memakai model reward yang dilatih dari penilaian manusia.',
      ],
      uses: [
        'Memilih iklan/banner/notifikasi terbaik secara otomatis (bandit)',
        'Game AI dan robotika (berjalan, menggenggam benda)',
        'Mengatur lampu lalu lintas, pendingin ruangan, atau stok gudang',
        'RLHF untuk membuat chatbot lebih membantu dan aman',
      ],
      examples: [
        {
          title: 'Multi-armed bandit: banner promo mana yang paling sering diklik?',
          code: py`
import numpy as np  # simulasi

PELUANG_KLIK = [0.04, 0.05, 0.08]  # rahasia lingkungan: banner C paling bagus (agen tidak tahu)

def jalankan(eps, langkah=5000, seed=0):  # simulasi satu strategi
    rng = np.random.default_rng(seed)  # seed
    Q = np.zeros(3)  # perkiraan tingkat klik tiap banner
    N = np.zeros(3)  # berapa kali tiap banner ditampilkan
    total = 0  # total klik
    for t in range(langkah):  # setiap pengunjung
        if rng.random() < eps: a = rng.integers(3)  # eksplorasi: pilih acak
        else: a = int(np.argmax(Q))  # eksploitasi: pilih yang terbaik sejauh ini
        r = float(rng.random() < PELUANG_KLIK[a])  # reward: 1 jika diklik
        N[a] += 1  # catat
        Q[a] += (r - Q[a]) / N[a]  # perbarui rata-rata berjalan
        total += r  # kumpulkan klik
    return int(total), N.astype(int)  # hasil

for eps in [0.0, 0.1, 0.3]:  # bandingkan tingkat eksplorasi
    klik, N = jalankan(eps)  # jalankan
    print(f"eps={eps:.1f}: total klik={klik}, ditampilkan A/B/C={N}")  # banner mana yang dipilih`,
        },
        {
          title: 'Q-learning di lorong 6 kotak',
          code: py`
import numpy as np  # perhitungan

# Lorong: kotak 0 = jurang (-10), kotak 5 = harta (+10), mulai di kotak 2. Aksi: 0 = kiri, 1 = kanan.
rng = np.random.default_rng(0)  # seed
Q = np.zeros((6, 2))  # nilai Q untuk setiap (kotak, aksi)
alpha, gamma, eps = 0.5, 0.9, 0.2  # laju belajar, diskon masa depan, eksplorasi
for episode in range(300):  # banyak percobaan
    s = 2  # posisi awal
    while s not in (0, 5):  # sampai jatuh atau dapat harta
        a = rng.integers(2) if rng.random() < eps else int(np.argmax(Q[s]))  # epsilon-greedy
        s2 = s - 1 if a == 0 else s + 1  # pindah kiri/kanan
        r = -10 if s2 == 0 else 10 if s2 == 5 else -1  # reward (tiap langkah -1 agar cepat)
        target = r if s2 in (0, 5) else r + gamma * Q[s2].max()  # reward + nilai masa depan
        Q[s, a] += alpha * (target - Q[s, a])  # aturan Q-learning
        s = s2  # lanjut dari kotak baru

print(np.round(Q[1:5], 1))  # Q kotak 1-4: kolom kiri vs kanan
print("policy:", ["←" if q[0] > q[1] else "→" for q in Q[1:5]])  # aksi terbaik tiap kotak`,
        },
      ],
      exercise: {
        task: 'Ubah bandit di atas menjadi **epsilon yang menurun**: ε = 1 / (1 + t/100), jadi agen banyak mencoba di awal lalu semakin yakin. Bandingkan total klik dengan ε tetap 0,1 pada 5.000 pengunjung (seed sama).',
        hint: 'Hitung `eps = 1 / (1 + t / 100)` di dalam loop, sebelum memilih aksi.',
        solution: py`
import numpy as np  # simulasi

PELUANG_KLIK = [0.04, 0.05, 0.08]  # lingkungan yang sama

def jalankan(menurun, langkah=5000, seed=0):  # menurun=True -> epsilon berkurang seiring waktu
    rng = np.random.default_rng(seed)  # seed
    Q, N, total = np.zeros(3), np.zeros(3), 0  # perkiraan, hitungan, total klik
    for t in range(langkah):  # setiap pengunjung
        eps = 1 / (1 + t / 100) if menurun else 0.1  # jadwal eksplorasi
        a = rng.integers(3) if rng.random() < eps else int(np.argmax(Q))  # pilih banner
        r = float(rng.random() < PELUANG_KLIK[a])  # klik atau tidak
        N[a] += 1; Q[a] += (r - Q[a]) / N[a]; total += r  # perbarui
    return int(total), N.astype(int)  # hasil

print("eps tetap 0.1 :", jalankan(False))  # pembanding
print("eps menurun   :", jalankan(True))  # lebih banyak eksplorasi di awal, lalu fokus`,
      },
      steps: [
        ['Definisikan lingkungan', 'State apa yang dilihat agen, aksi apa yang tersedia.'],
        ['Rancang reward dengan hati-hati', 'Agen akan mengejar reward persis seperti yang kamu tulis, termasuk celahnya.'],
        ['Mulai dari simulasi', 'Latih di simulator dulu; coba-coba di dunia nyata mahal/berbahaya.'],
        ['Seimbangkan eksplorasi', 'ε-greedy, ε menurun, atau metode lain (UCB, Thompson sampling).'],
        ['Evaluasi policy', 'Uji tanpa eksplorasi (ε = 0) di banyak episode dan bandingkan dengan baseline.'],
      ],
      case: {
        title: 'Bandit vs A/B test untuk notifikasi promo',
        situation: 'Aplikasi kopi punya 3 teks notifikasi promo. A/B test klasik membagi pengguna rata ke 3 versi selama 6.000 pengiriman. Bandit menggeser pengiriman ke versi yang tampak lebih baik sambil tetap belajar. Mana yang menghasilkan lebih banyak klik?',
        steps: [
          'Simulasikan tingkat klik sebenarnya: 3%, 4%, dan 6%.',
          'A/B test: setiap versi dikirim 2.000 kali.',
          'Bandit epsilon-greedy (ε = 0,1) memilih versi untuk setiap pengiriman.',
          'Ulangi 200 kali dengan seed berbeda agar hasilnya tidak kebetulan.',
        ],
        code: py`
import numpy as np  # simulasi

p_klik = np.array([0.03, 0.04, 0.06])  # tingkat klik sebenarnya (tidak diketahui tim)
total_ab, total_bandit = [], []  # hasil tiap ulangan
for ulang in range(200):  # ulangi agar adil
    rng = np.random.default_rng(ulang)  # seed berbeda tiap ulangan
    total_ab.append(sum(rng.binomial(2000, p) for p in p_klik))  # A/B: rata 2000 per versi
    Q, N, klik = np.zeros(3), np.zeros(3), 0  # bandit mulai dari nol
    for t in range(6000):  # 6000 pengiriman
        a = rng.integers(3) if rng.random() < 0.1 else int(np.argmax(Q))  # epsilon-greedy
        r = rng.random() < p_klik[a]  # klik?
        N[a] += 1; Q[a] += (r - Q[a]) / N[a]; klik += r  # perbarui
    total_bandit.append(klik)  # simpan
print(f"A/B test rata : {np.mean(total_ab):.0f} klik")  # 6000 x rata-rata 4,3%
print(f"bandit        : {np.mean(total_bandit):.0f} klik")  # biasanya lebih banyak
print(f"maksimum teoretis (selalu versi terbaik): {6000 * p_klik.max():.0f} klik")  # batas atas`,
        result: 'Bandit mendapat lebih banyak klik selama periode uji karena cepat menggeser pengiriman ke versi terbaik. Kekurangannya: kesimpulan statistik tentang versi yang kalah lebih lemah. A/B test cocok untuk keputusan jangka panjang yang butuh kesimpulan pasti; bandit cocok untuk optimasi terus-menerus.',
      },
      deep: {
        concepts: [
          ['Discount factor γ', 'γ mendekati 1 membuat agen sabar (memikirkan reward jauh di depan); γ kecil membuatnya rakus pada reward segera. Di lorong contoh, γ = 0,9 cukup untuk "melihat" harta 3 langkah lagi.'],
          ['Reward hacking', 'Agen mengejar angka reward, bukan niat kita. Contoh terkenal: agen balap perahu yang berputar-putar mengumpulkan poin tanpa pernah finis. Rancang reward dengan hati-hati dan amati perilakunya, bukan hanya skornya.'],
          ['Dari tabel ke neural network', 'Q-learning tabel hanya cocok untuk sedikit state. Untuk gambar layar game atau sensor robot, Q diganti neural network (Deep Q-Network). Metode policy gradient seperti PPO mempelajari policy secara langsung, dan PPO juga dipakai di RLHF.'],
          ['RLHF secara singkat', '(1) Manusia membandingkan dua jawaban model; (2) model reward dilatih untuk menebak jawaban yang disukai; (3) LLM dioptimasi dengan RL untuk memaksimalkan skor model reward, dengan batasan agar tidak menyimpang terlalu jauh dari model awal.'],
        ],
        mistakes: [
          ['Memakai RL untuk masalah yang sebenarnya supervised.', 'Jika ada label jawaban benar, supervised learning jauh lebih mudah dan stabil.'],
          ['ε = 0 sejak awal.', 'Agen bisa terjebak pada pilihan pertama yang kebetulan beruntung; selalu ada eksplorasi.'],
          ['Menilai agen dari satu kali jalan.', 'Hasil RL sangat bervariasi; rata-ratakan banyak seed/episode.'],
        ],
        tips: [
          'Lingkungan latihan standar: Gymnasium (penerus OpenAI Gym), mis. CartPole dan FrozenLake.',
          'Library: Stable-Baselines3 untuk algoritma RL siap pakai (PPO, DQN).',
          'Lihat animasi Q-learning di halaman 🧠 Algoritma.',
        ],
        check: [
          ['Apa perbedaan utama RL dengan supervised learning?', 'RL tidak diberi jawaban benar; agen belajar dari reward hasil aksinya sendiri dan harus menyeimbangkan eksplorasi dan eksploitasi.'],
          ['Kenapa di contoh lorong setiap langkah diberi reward -1?', 'Agar agen terdorong mencapai harta secepat mungkin, bukan mondar-mandir tanpa tujuan.'],
        ],
      },
    },
  ],

  // ---------------- Ahli: NLP & CV ----------------
  'nlp-cv': [
    {
      after: 'cv-generatif',
      id: 'cv-audio',
      title: 'Audio, suara & model multimodal',
      summary: 'Mengolah suara (spektrogram, speech-to-text dengan Whisper) dan model yang memahami gambar + teks sekaligus.',
      explain: [
        'Suara adalah **gelombang**: deretan angka tekanan udara yang direkam ribuan kali per detik (**sampling rate**, mis. 16.000 Hz untuk suara manusia). Satu detik audio = 16.000 angka.',
        'Model jarang memakan gelombang mentah. Biasanya suara diubah menjadi **spektrogram**: gambar yang menunjukkan frekuensi apa yang muncul di setiap waktu. Versi **mel-spectrogram** menyesuaikan skala frekuensinya dengan pendengaran manusia. Setelah jadi "gambar", teknik CNN dan Transformer bisa dipakai.',
        'Tugas audio utama: **speech recognition / ASR** (suara → teks, mis. **Whisper** yang mendukung bahasa Indonesia), **text-to-speech** (teks → suara), dan **klasifikasi audio** (suara mesin rusak, jenis burung, batuk).',
        'Model **multimodal** memahami lebih dari satu jenis data. **CLIP** memetakan gambar dan teks ke ruang embedding yang sama, sehingga bisa mencari gambar dengan kalimat atau mengklasifikasi gambar tanpa dilatih ulang (zero-shot). **Vision-language model** dan LLM multimodal bisa menjawab pertanyaan tentang gambar, membaca grafik, atau mendeskripsikan foto.',
      ],
      uses: [
        'Transkripsi otomatis rapat, kuliah, wawancara, dan subtitle video',
        'Asisten suara dan pencarian dengan suara',
        'Deteksi suara anomali pada mesin pabrik',
        'Mencari foto dengan kalimat, membaca struk/dokumen, dan tanya-jawab tentang gambar',
      ],
      examples: [
        {
          title: 'Suara sebagai angka: menemukan nada dengan FFT',
          code: py`
import numpy as np  # perhitungan sinyal

sr = 16000  # sampling rate: 16.000 angka per detik
t = np.arange(0, 1.0, 1 / sr)  # waktu selama 1 detik
rng = np.random.default_rng(0)  # seed untuk noise
suara = 0.6 * np.sin(2 * np.pi * 440 * t) + 0.3 * np.sin(2 * np.pi * 660 * t)  # dua nada: 440 Hz & 660 Hz
suara += 0.2 * rng.normal(size=t.size)  # tambah desis (noise)
print("jumlah sampel:", suara.size)  # 16000 angka untuk 1 detik

spektrum = np.abs(np.fft.rfft(suara))  # kekuatan tiap frekuensi (Fast Fourier Transform)
frek = np.fft.rfftfreq(suara.size, 1 / sr)  # frekuensi (Hz) untuk tiap nilai spektrum
puncak = frek[np.argsort(spektrum)[-2:]]  # dua frekuensi terkuat
print("nada yang terdeteksi:", sorted(puncak.round().astype(int).tolist()), "Hz")  # [440, 660]`,
        },
        {
          title: 'Spektrogram: gambar dari suara',
          code: py`
import numpy as np  # sinyal
import matplotlib.pyplot as plt  # grafik
from scipy import signal  # pengolahan sinyal

sr = 8000  # sampling rate
t = np.arange(0, 2.0, 1 / sr)  # 2 detik
siul = signal.chirp(t, f0=300, t1=2.0, f1=2000)  # siulan yang naik dari 300 Hz ke 2000 Hz
ketuk = (np.sin(2 * np.pi * 5 * t) > 0.95) * np.sin(2 * np.pi * 120 * t)  # ketukan pendek berulang: bunyi yang tiba-tiba tampak sebagai garis tegak
f, waktu, S = signal.spectrogram(siul + ketuk, fs=sr, nperseg=256)  # frekuensi x waktu

plt.figure(figsize=(7, 3))  # ukuran gambar
plt.pcolormesh(waktu, f, 10 * np.log10(S + 1e-10), shading="auto")  # kekuatan dalam desibel
plt.ylabel("frekuensi (Hz)"); plt.xlabel("waktu (detik)")  # label sumbu
plt.title("Spektrogram: siulan naik + ketukan berulang")  # judul
plt.colorbar(label="dB")  # skala warna`,
        },
        {
          title: 'Whisper (speech-to-text) & CLIP (gambar + teks)',
          runnable: false,
          note: 'Jalankan di Colab/komputer: pip install transformers torch pillow (butuh file audio & gambar sendiri).',
          code: py`
from transformers import pipeline  # antarmuka siap pakai

# 1) Suara -> teks dengan Whisper (mendukung bahasa Indonesia)
asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")  # model ukuran kecil
hasil = asr("rekaman.wav", generate_kwargs={"language": "indonesian"})  # file audio milikmu
print(hasil["text"])  # transkrip

# 2) Klasifikasi gambar tanpa pelatihan ulang (zero-shot) dengan CLIP
clip = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")  # model gambar+teks
label = ["foto rendang", "foto sate", "foto nasi goreng"]  # kelas ditulis sebagai kalimat
for h in clip("makanan.jpg", candidate_labels=label):  # gambar milikmu
    print(f"{h['label']}: {h['score']:.2f}")  # skor kecocokan gambar dengan tiap kalimat`,
        },
      ],
      exercise: {
        task: 'Sebuah rekaman 1 detik (sr = 16.000) berisi tiga nada piano bercampur noise. Buat sinyalnya dari nada A4 (440 Hz), C#5 (554,37 Hz), dan E5 (659,26 Hz), lalu temukan kembali ketiga frekuensi itu dengan FFT dan cocokkan ke nama nadanya.',
        hint: 'Ambil 3 puncak terbesar dari `np.abs(np.fft.rfft(...))`. Cocokkan tiap puncak ke nada terdekat dengan `min(nada, key=lambda n: abs(nada[n] - f))`.',
        solution: py`
import numpy as np  # sinyal

sr = 16000  # sampling rate
t = np.arange(0, 1.0, 1 / sr)  # 1 detik
nada = {"A4": 440.0, "C#5": 554.37, "E5": 659.26}  # akor A mayor
rng = np.random.default_rng(2)  # seed
x = sum(np.sin(2 * np.pi * f * t) for f in nada.values()) + 0.5 * rng.normal(size=t.size)  # campuran + noise

spek = np.abs(np.fft.rfft(x))  # kekuatan tiap frekuensi
frek = np.fft.rfftfreq(x.size, 1 / sr)  # frekuensi tiap titik (resolusi 1 Hz)
puncak = sorted(frek[np.argsort(spek)[-3:]])  # 3 frekuensi terkuat
for f in puncak:  # cocokkan ke nama nada
    terdekat = min(nada, key=lambda n: abs(nada[n] - f))  # nada dengan selisih terkecil
    print(f"{f:.0f} Hz -> {terdekat}")  # hasil`,
      },
      steps: [
        ['Rekam dengan konsisten', 'Mono, 16 kHz cukup untuk suara manusia; catat izin perekaman.'],
        ['Ubah ke representasi', 'Spektrogram / mel-spectrogram untuk klasifikasi; model ASR biasanya melakukannya sendiri.'],
        ['Mulai dari model pretrained', 'Whisper untuk transkripsi, CLIP untuk gambar+teks; fine-tune hanya jika perlu.'],
        ['Potong yang panjang', 'Audio berjam-jam dipotong per 30 detik (chunk) sebelum diproses.'],
        ['Ukur kualitasnya', 'WER (word error rate) untuk transkripsi pada contoh yang ditranskripsi manual.'],
      ],
      case: {
        title: 'Transkripsi otomatis rapat warga',
        situation: 'Pengurus RT ingin notulen rapat dibuat otomatis dari rekaman. Sebelum dipakai, mereka ingin tahu seberapa akurat transkripnya dibanding catatan manual, terutama untuk nama dan angka.',
        steps: [
          'Minta izin peserta sebelum merekam; jelaskan rekaman hanya untuk notulen.',
          'Transkripsi dengan Whisper (bahasa Indonesia) di Colab.',
          'Transkripsi manual 2 menit pertama sebagai kunci jawaban.',
          'Hitung **WER**: berapa persen kata yang salah, hilang, atau tambahan.',
          'Periksa ulang manual bagian penting (angka iuran, tanggal, nama) sebelum notulen dibagikan.',
        ],
        code: py`
def wer(acuan, hasil):  # word error rate dengan edit distance tingkat kata
    a, h = acuan.lower().split(), hasil.lower().split()  # pecah jadi kata
    d = [[0] * (len(h) + 1) for _ in range(len(a) + 1)]  # tabel jarak
    for i in range(len(a) + 1): d[i][0] = i  # hapus semua kata acuan
    for j in range(len(h) + 1): d[0][j] = j  # sisipkan semua kata hasil
    for i in range(1, len(a) + 1):  # isi tabel
        for j in range(1, len(h) + 1):
            beda = a[i - 1] != h[j - 1]  # 1 jika kata berbeda
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + beda)  # hapus / sisip / ganti
    return d[-1][-1] / len(a)  # jumlah kesalahan dibagi jumlah kata acuan

manual = "iuran kebersihan bulan depan naik menjadi lima belas ribu rupiah mulai tanggal satu"  # catatan manual
whisper = "iuran kebersihan bulan depan naik jadi lima puluh ribu rupiah mulai tanggal satu"  # hasil mesin (contoh)
print(f"WER: {wer(manual, whisper):.0%}")  # 2 kata salah dari 13
print("kata berbeda:", [(m, w) for m, w in zip(manual.split(), whisper.split()) if m != w])  # cek bagian penting`,
        result: 'WER-nya rendah, tetapi salah satu kesalahannya justru angka iuran ("lima belas" menjadi "lima puluh"). Kesimpulannya: transkrip otomatis menghemat waktu, tetapi angka, nama, dan keputusan penting tetap harus dicek manusia.',
      },
      deep: {
        concepts: [
          ['Sampling rate & Nyquist', 'Untuk merekam frekuensi f, sampling rate minimal 2f. Suara manusia penting sampai ±8 kHz, jadi 16 kHz cukup; musik butuh 44,1 kHz. Audio dengan sampling rate berbeda harus diseragamkan (resample) sebelum masuk model.'],
          ['Ruang embedding bersama', 'CLIP dilatih dengan ratusan juta pasangan gambar–keterangan agar gambar dan kalimat yang cocok punya vektor yang berdekatan. Karena itu "foto rendang" bisa dicocokkan dengan foto rendang tanpa pelatihan khusus.'],
          ['Privasi suara & wajah', 'Suara dan wajah adalah data biometrik yang sangat pribadi. Minta persetujuan, simpan seperlunya, dan pertimbangkan pemrosesan di perangkat sendiri daripada mengunggah ke layanan pihak ketiga.'],
          ['Halusinasi pada ASR', 'Model seperti Whisper kadang "mengarang" kalimat pada bagian hening atau berisik. Potong bagian hening, dan jangan memakai transkrip mentah untuk keputusan penting tanpa pengecekan.'],
        ],
        mistakes: [
          ['Mencampur audio 44,1 kHz dan 16 kHz dalam satu dataset.', 'Resample semua audio ke sampling rate yang sama.'],
          ['Menguji model suara hanya dengan rekaman studio yang bersih.', 'Uji juga rekaman HP, ruangan bergema, dan logat daerah yang akan dipakai.'],
          ['Menganggap CLIP pasti benar karena skornya tinggi.', 'Skor zero-shot bersifat relatif terhadap label yang diberikan; label yang kurang lengkap tetap akan "dipilih".'],
        ],
        tips: [
          'Library audio: `librosa` (fitur & spektrogram), `torchaudio`, `soundfile`.',
          'Dataset suara bahasa Indonesia: Mozilla Common Voice (commonvoice.mozilla.org).',
          'Ukuran Whisper: tiny/base cepat, small/medium lebih akurat; pilih sesuai GPU.',
        ],
        check: [
          ['Kenapa audio sering diubah menjadi spektrogram sebelum masuk model?', 'Spektrogram menunjukkan frekuensi terhadap waktu dalam bentuk seperti gambar, yang lebih informatif dan ringkas daripada ribuan angka gelombang mentah, serta bisa diproses dengan CNN/Transformer.'],
          ['Apa yang membuat CLIP bisa mengklasifikasi gambar tanpa dilatih ulang?', 'Gambar dan teks dipetakan ke ruang embedding yang sama; kelas ditulis sebagai kalimat, lalu dipilih kalimat yang vektornya paling dekat dengan vektor gambar.'],
        ],
      },
    },
  ],
}
