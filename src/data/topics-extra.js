import { py } from './py.js'

// Materi tambahan per tahap. `after` = id materi yang menjadi posisi sisipan.
// Jangan mengganti `id` setelah dipakai, karena progres disimpan berdasarkan id.

export const extraTopics = {
  // ---------------- Pemula ----------------
  'python-dasar': [
    {
      after: 'py-error',
      id: 'py-modul-std',
      title: 'Modul bawaan penting',
      summary: 'math, random, datetime, collections, pathlib: alat siap pakai tanpa install.',
      explain: [
        'Python datang dengan **standard library** yang sangat lengkap ("batteries included"). Sebelum menulis fungsi sendiri atau memasang library baru, cek dulu apakah sudah ada di modul bawaan.',
        '`math` (fungsi matematika), `random` (angka acak, mengacak data), `datetime` (tanggal & waktu), `collections` (`Counter`, `defaultdict`), `pathlib` (path file), `json`, `csv`, `statistics`, dan `itertools` adalah yang paling sering dipakai di proyek data.',
        'Modul `random` menghasilkan angka **pseudo-acak**: terlihat acak tetapi ditentukan oleh *seed*. Dengan seed yang sama, urutan angkanya selalu sama. Inilah cara eksperimen AI dibuat bisa diulang (reproducible).',
      ],
      uses: [
        '`random.shuffle` dan `random.sample` untuk mengacak dan mengambil sampel data',
        '`datetime` untuk menghitung umur akun, selisih hari, atau mengubah teks menjadi tanggal',
        '`Counter` untuk menghitung frekuensi kata/kategori',
        '`statistics` untuk rata-rata, median, dan standar deviasi cepat tanpa NumPy',
      ],
      examples: [
        {
          title: 'Tur singkat modul bawaan',
          code: py`
import math, random, statistics  # modul bawaan: matematika, acak, statistik
from datetime import datetime, date, timedelta  # tanggal & selisih waktu
from collections import Counter  # penghitung frekuensi

print("akar 2       :", math.sqrt(2))  # akar kuadrat
# logaritma & pembulatan ke atas
print("log natural e:", math.log(math.e), "| pembulatan ke atas 4.1:", math.ceil(4.1))

random.seed(42)                       # seed sama -> hasil acak sama
data = list(range(1, 11))  # angka 1 sampai 10
random.shuffle(data)  # acak urutannya
print("diacak       :", data)  # tampilkan
print("sampel 3     :", random.sample(data, 3))  # ambil 3 tanpa pengembalian

nilai = [70, 85, 90, 65, 85, 100]  # nilai ujian
# rata-rata, median, simpangan baku
print("mean/median  :", statistics.mean(nilai), statistics.median(nilai), "| std:", round(statistics.stdev(nilai), 2))

daftar = datetime.strptime("2025-03-15", "%Y-%m-%d").date()  # ubah teks menjadi tanggal
print("hari sejak daftar:", (date(2025, 11, 9) - daftar).days)  # selisih hari
# tambah 30 hari lalu format ulang
print("30 hari lagi :", (daftar + timedelta(days=30)).strftime("%d %B %Y"))

print("frekuensi    :", Counter("mississippi").most_common(3))  # 3 huruf terbanyak`,
        },
      ],
      exercise: {
        task: 'Dengan `random.seed(0)`, simulasikan 1.000 lemparan koin (`random.choice(["A", "G"])`) dan hitung frekuensinya dengan `Counter`. Lalu hitung berapa hari lagi menuju 1 Januari tahun depan dari 9 November 2025.',
        hint: 'List comprehension untuk 1.000 lemparan, `Counter(...)`, dan `(date(2026, 1, 1) - date(2025, 11, 9)).days`.',
        solution: py`
import random  # modul acak
from collections import Counter  # penghitung
from datetime import date  # tanggal

random.seed(0)  # seed agar hasil sama
# 1000 lemparan koin (Angka/Gambar)
lemparan = [random.choice(["A", "G"]) for _ in range(1000)]
print(Counter(lemparan))  # hitung hasilnya
# selisih dua tanggal
print("Hari menuju tahun baru:", (date(2026, 1, 1) - date(2025, 11, 9)).days)`,
      },
      steps: [
        ['Kenali masalahnya', 'Hitung, acak, tanggal, path, atau format data?'],
        ['Cek standard library dulu', 'Cari di docs.python.org "Library Reference" sebelum menulis sendiri.'],
        ['Import seperlunya', '`from collections import Counter` agar jelas asal fungsinya.'],
        ['Set seed untuk hal acak', 'Agar hasil bisa diulang saat debugging dan eksperimen.'],
        ['Naik ke library khusus jika perlu', 'Data besar → NumPy/Pandas; tanggal rumit → Pandas/dateutil.'],
      ],
      case: {
        title: 'Membagi peserta pelatihan ke kelompok secara adil',
        situation: 'Panitia pelatihan AI punya 23 peserta dan ingin membaginya acak ke 4 kelompok, tetapi pembagian harus bisa diulang persis jika ada protes, serta dicatat tanggal pelaksanaannya.',
        steps: [
          'Daftar nama diacak dengan `random.shuffle` memakai seed yang diumumkan.',
          'Peserta dibagi bergiliran ke 4 kelompok.',
          'Ukuran kelompok dicek dengan `Counter`.',
          'Jadwal tiap kelompok dibuat dengan `timedelta`.',
        ],
        code: py`
import random  # modul acak
from collections import Counter  # penghitung
from datetime import date, timedelta  # tanggal

peserta = [f"Peserta-{i:02d}" for i in range(1, 24)]  # 23 nama peserta
SEED = 2025                                   # diumumkan agar bisa dicek siapa pun
random.seed(SEED)  # seed dipakai
random.shuffle(peserta)  # acak urutan peserta

kelompok = {p: i % 4 + 1 for i, p in enumerate(peserta)}  # bagi bergiliran ke 4 kelompok
# cek ukuran setiap kelompok
print("Ukuran kelompok:", sorted(Counter(kelompok.values()).items()))
mulai = date(2025, 12, 1)  # tanggal mulai
for k in range(1, 5):  # untuk setiap kelompok
    anggota = [p for p, g in kelompok.items() if g == k]  # anggota kelompok ini
    # jadwal per minggu & 3 anggota pertama
    print(f"Kelompok {k} ({(mulai + timedelta(weeks=k - 1)).strftime('%d %b')}): {', '.join(anggota[:3])}, ...")`,
        result: 'Pembagian acak, seimbang (6-6-6-5), dan bisa diverifikasi ulang siapa pun dengan seed yang sama.',
      },
      deep: {
        concepts: [
          ['Seed dan reproducibility', 'Di proyek AI, sumber keacakan ada di banyak tempat: `random`, NumPy, scikit-learn (`random_state`), dan PyTorch. Untuk eksperimen yang bisa diulang, set seed di semuanya.'],
          ['Zona waktu', '`datetime.now()` tanpa zona waktu bisa menimbulkan bug saat server berada di zona berbeda (UTC vs WIB). Simpan waktu dalam UTC dengan `datetime.now(timezone.utc)` dan ubah ke WIB hanya saat ditampilkan.'],
        ],
        mistakes: [
          ['Memakai `random` untuk token keamanan/password.', 'Pakai modul `secrets` yang dirancang untuk keperluan kriptografi.'],
          ['Membandingkan tanggal dalam bentuk teks "9/11/2025".', 'Ubah ke objek `date` dulu dengan `strptime`.'],
        ],
        tips: ['Format tanggal standar untuk disimpan: ISO 8601 (`2025-11-09`).', '`pprint` membantu mencetak dict bersarang agar mudah dibaca.'],
        check: [
          ['Kenapa `random.seed(42)` membuat hasil acak selalu sama?', 'Generator acak Python bersifat deterministik; seed menentukan titik awal urutan angka, sehingga seed sama menghasilkan urutan sama.'],
        ],
      },
    },
  ],

  // ---------------- Menengah ----------------
  'python-lanjut': [
    {
      after: 'pyl-decorator',
      id: 'pyl-regex',
      title: 'Regular expression (regex)',
      summary: 'Pola teks untuk mencari, mengekstrak, dan membersihkan data.',
      explain: [
        '**Regex** adalah bahasa mini untuk mendeskripsikan pola teks: "kata yang diawali 08 diikuti 8–11 angka" atau "teks di antara tanda kurung". Di Python dipakai lewat modul `re`.',
        'Simbol dasar: `\\d` angka, `\\w` huruf/angka/garis bawah, `\\s` spasi, `.` karakter apa pun, `+` satu atau lebih, `*` nol atau lebih, `?` opsional, `{2,4}` 2 sampai 4 kali, `[abc]` salah satu karakter, `^` awal, `$` akhir, `( )` grup yang bisa diambil.',
        'Fungsi utama: `re.search` (cari pertama), `re.findall` (semua kecocokan), `re.sub` (ganti), `re.split` (pisah), `re.fullmatch` (validasi seluruh teks). Selalu tulis pola sebagai raw string `r"..."` agar backslash tidak diproses Python.',
      ],
      uses: [
        'Membersihkan teks NLP: menghapus URL, mention, emoji, angka',
        'Mengekstrak nomor HP, email, tanggal, harga dari teks bebas',
        'Validasi format input (kode pos, NIK, email)',
        'Memecah dokumen menjadi pasal/bagian untuk RAG',
      ],
      examples: [
        {
          title: 'Ekstraksi informasi dari pesan pelanggan',
          code: py`
import re  # regular expression

# pesan pelanggan
pesan = """Halo min, saya Budi (budi.s@mail.com), HP 0812-3456-7890.
Pesanan #INV-2025-0042 tgl 05/11/2025 total Rp 1.250.000 belum sampai.
Cek https://toko.id/lacak?id=42 ya @admin_toko"""

print("Email   :", re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", pesan))  # pola email
# pola nomor HP, lalu buang selain angka
print("HP      :", [re.sub(r"\D", "", h) for h in re.findall(r"08[\d-]{8,14}", pesan)])
print("Invoice :", re.search(r"#(INV-\d{4}-\d+)", pesan).group(1))
tgl = re.search(r"(\d{2})/(\d{2})/(\d{4})", pesan)  # tanggal dd/mm/yyyy
# susun ulang menjadi yyyy-mm-dd
print("Tanggal :", f"{tgl.group(3)}-{tgl.group(2)}-{tgl.group(1)}")
harga = re.search(r"Rp\s?([\d.]+)", pesan).group(1)  # ambil angka setelah Rp
print("Total   :", int(harga.replace(".", "")))  # buang titik ribuan, ubah ke angka

bersih = re.sub(r"https?://\S+|(?<![\w.])@\w+", "", pesan)   # hapus URL & mention, email aman
bersih = re.sub(r"\s+", " ", bersih).strip()  # rapikan spasi berlebih
print("Bersih  :", bersih[:70], "...")  # tampilkan`,
        },
      ],
      exercise: {
        task: 'Validasi daftar nomor HP Indonesia `["081234567890", "0812-345", "+6281298765432", "6281211112222", "08abc1234567"]`. Nomor valid diawali `08`, `+628`, atau `628`, diikuti 8–11 angka. Ubah yang valid ke format `08...`.',
        hint: 'Pola `^(\\+62|62|0)8\\d{8,11}$` dengan `re.fullmatch`, lalu `re.sub(r"^(\\+62|62)", "0", nomor)`.',
        solution: py`
import re  # regular expression

# nomor yang diuji
nomor = ["081234567890", "0812-345", "+6281298765432", "6281211112222", "08abc1234567"]
for n in nomor:  # untuk setiap nomor
    if re.fullmatch(r"(\+62|62|0)8\d{8,11}", n):  # fullmatch: seluruh teks harus cocok pola
        # seragamkan awalan menjadi 0
        print(f"{n:16s} valid -> {re.sub(r'^(\+62|62)', '0', n)}")
    else:  # tidak cocok
        print(f"{n:16s} TIDAK valid")  # tidak valid`,
      },
      steps: [
        ['Kumpulkan contoh nyata', 'Ambil 10–20 contoh teks, termasuk yang aneh.'],
        ['Tulis pola sederhana dulu', 'Mulai dari bagian paling khas, mis. `08\\d+`.'],
        ['Uji di regex101.com', 'Lihat kecocokan secara visual dan penjelasan tiap simbol.'],
        ['Tambahkan grup', 'Pakai `( )` atau grup bernama `(?P<nama>...)` untuk mengambil bagian tertentu.'],
        ['Uji kasus negatif', 'Pastikan teks yang salah tidak ikut cocok.'],
        ['Compile jika dipakai berulang', '`pola = re.compile(r"...")` lalu `pola.findall(teks)`.'],
      ],
      case: {
        title: 'Mengubah log server menjadi tabel untuk analisis error',
        situation: 'Tim IT punya ribuan baris log teks dan ingin tahu endpoint mana yang paling sering error dan jam berapa error memuncak.',
        steps: [
          'Pola regex dengan grup bernama mengekstrak waktu, level, endpoint, dan durasi.',
          'Hasil dimasukkan ke DataFrame Pandas.',
          'Dihitung jumlah error per endpoint dan per jam.',
        ],
        code: py`
import re, random  # regex & acak
import pandas as pd  # Pandas

random.seed(1)  # seed agar log sama
endpoint = ["/login", "/prediksi", "/produk", "/bayar"]  # daftar endpoint
log = []  # baris log
for i in range(400):  # buat 400 baris log
    jam = random.choice([8, 9, 12, 13, 19, 20, 21])  # jam acak
    ep = random.choices(endpoint, weights=[2, 4, 3, 1])[0]  # endpoint dengan bobot berbeda
    # /prediksi malam hari lebih sering error
    level = "ERROR" if random.random() < (0.25 if ep == "/prediksi" and jam >= 19 else 0.05) else "INFO"
    # tulis satu baris log
    log.append(f"2025-11-0{random.randint(1, 7)} {jam:02d}:{random.randint(0, 59):02d}:00 [{level}] GET {ep} {random.randint(20, 900)}ms")

# pola dengan nama group
pola = re.compile(r"(?P<tanggal>\S+) (?P<jam>\d{2}):\d{2}:\d{2} \[(?P<level>\w+)\] GET (?P<endpoint>\S+) (?P<ms>\d+)ms")
# ambil field dari setiap baris yang cocok
df = pd.DataFrame([m.groupdict() for baris in log if (m := pola.match(baris))])
df["ms"] = df["ms"].astype(int)  # ubah waktu proses ke angka
err = df[df.level == "ERROR"]  # baris error saja
print("Baris terbaca:", len(df), "| error:", len(err))  # jumlah baris
print(err.endpoint.value_counts().to_string())  # error per endpoint
print("\nError per jam:")  # judul
print(err.jam.value_counts().sort_index().to_string())  # error per jam`,
        result: 'Terlihat endpoint /prediksi paling sering error, memuncak pukul 19–21, sehingga tim menambah kapasitas server di jam tersebut.',
      },
      deep: {
        concepts: [
          ['Greedy vs lazy', '`.*` bersifat **greedy**: mengambil sebanyak mungkin. Pada `<b>satu</b> <b>dua</b>`, pola `<b>.*</b>` mencocokkan seluruh teks. Tambahkan `?` agar lazy: `<b>.*?</b>` mencocokkan per tag.'],
          ['Regex vs parser', 'Regex cocok untuk pola sederhana–menengah. Untuk HTML, JSON, atau bahasa bersarang, pakai parser khusus (BeautifulSoup, `json`), karena regex mudah rusak pada struktur bersarang.'],
        ],
        mistakes: [
          ['Lupa raw string: `"\\d"` vs `r"\\d"`.', 'Selalu tulis pola dengan awalan `r`.'],
          ['Pola terlalu longgar: `.+@.+` untuk email.', 'Cocok dengan banyak teks yang salah; buat lebih spesifik dan uji kasus negatif.'],
          ['Menulis satu regex raksasa yang tidak bisa dibaca.', 'Pecah menjadi beberapa langkah atau pakai flag `re.VERBOSE` dengan komentar.'],
        ],
        tips: ['Grup bernama `(?P<nama>...)` + `groupdict()` langsung menghasilkan dict siap jadi DataFrame.', 'Pandas punya `str.extract` dan `str.contains` yang menerima regex.'],
        check: [
          ['Apa beda `re.search` dan `re.fullmatch`?', '`search` mencari pola di mana pun dalam teks; `fullmatch` mengharuskan seluruh teks cocok, sehingga cocok untuk validasi.'],
        ],
      },
    },
  ],
  matematika: [
    {
      after: 'mat-prob',
      id: 'mat-info',
      title: 'Entropi, cross-entropy & KL divergence',
      summary: 'Teori informasi di balik loss function klasifikasi dan LLM.',
      explain: [
        '**Entropi** mengukur ketidakpastian sebuah distribusi: `H(p) = −Σ p log p`. Koin adil (50:50) punya entropi maksimum; koin yang selalu angka punya entropi nol karena tidak ada kejutan.',
        '**Cross-entropy** `H(p, q) = −Σ p log q` mengukur seberapa "terkejut" kita rata-rata jika kenyataan mengikuti `p` tetapi kita memakai tebakan `q`. Inilah **loss** standar klasifikasi dan LLM: `p` = label asli (one-hot), `q` = peluang dari model.',
        '**KL divergence** `KL(p‖q) = H(p, q) − H(p)` adalah "biaya tambahan" karena memakai q, bukan p. Selalu ≥ 0, dan nol hanya jika q = p. Dipakai di VAE, distilasi model, dan RLHF (menjaga model tidak menjauh dari model awal).',
      ],
      uses: [
        'Loss klasifikasi (`CrossEntropyLoss`) dan pelatihan LLM (prediksi token berikutnya)',
        'Perplexity LLM = exp(cross-entropy): "rata-rata model ragu di antara berapa token"',
        'Kriteria split decision tree (information gain)',
        'Mengukur perubahan distribusi data (drift) dan distilasi model',
      ],
      algos: ['decision-tree'],
      examples: [
        {
          title: 'Entropi, cross-entropy, KL, dan perplexity',
          code: py`
import numpy as np  # NumPy

def entropi(p):  # entropi: rata-rata 'kejutan'
    p = np.asarray(p, float); p = p[p > 0]  # buang peluang 0
    return -(p * np.log2(p)).sum()  # rumus entropi dalam bit

def cross_entropy(p, q):  # cross-entropy
    p, q = np.asarray(p, float), np.clip(np.asarray(q, float), 1e-12, 1)  # hindari log(0)
    return -(p * np.log2(q)).sum()  # rumus cross-entropy

# empat distribusi
for nama, p in [("koin adil", [0.5, 0.5]), ("koin berat sebelah", [0.9, 0.1]), ("pasti", [1, 0]), ("dadu adil", [1/6] * 6)]:
    # makin acak, makin tinggi entropinya
    print(f"Entropi {nama:20s}: {entropi(p):.3f} bit")

asli = [0, 1, 0]                          # label: kelas 1
for q in ([0.1, 0.8, 0.1], [0.3, 0.4, 0.3], [0.7, 0.2, 0.1]):  # tiga prediksi
    # makin yakin & benar, makin kecil
    print(f"Prediksi {q}: cross-entropy = {cross_entropy(asli, q):.3f} bit")

p, q = np.array([0.5, 0.3, 0.2]), np.array([0.4, 0.4, 0.2])  # dua distribusi
kl = cross_entropy(p, q) - entropi(p)  # KL = cross-entropy - entropi
# dibalik hasilnya berbeda
print(f"\nKL(p||q) = {kl:.4f} bit, KL(q||p) = {cross_entropy(q, p) - entropi(q):.4f} bit  (tidak simetris)")

# Perplexity: model yang memberi peluang rata-rata 0.25 ke token yang benar
# peluang yang diberi model ke token benar
peluang_token_benar = np.array([0.5, 0.2, 0.25, 0.1, 0.4])
ce = -np.mean(np.log(peluang_token_benar))  # rata-rata cross-entropy
# perplexity = exp(cross-entropy)
print(f"Perplexity = {np.exp(ce):.2f} (model ragu di antara ~{np.exp(ce):.0f} token)")`,
        },
      ],
      exercise: {
        task: 'Sebuah dataset punya 8 sampel "ya" dan 2 "tidak". Hitung entropinya. Lalu hitung information gain jika split menghasilkan kiri (6 ya, 0 tidak) dan kanan (2 ya, 2 tidak).',
        hint: 'Information gain = entropi induk − rata-rata tertimbang entropi anak (bobot = proporsi sampel).',
        solution: py`
import numpy as np  # NumPy

def H(ya, tidak):  # entropi dari jumlah ya & tidak
    # ubah ke peluang, buang 0
    p = np.array([ya, tidak], float) / (ya + tidak); p = p[p > 0]
    return -(p * np.log2(p)).sum()  # rumus entropi

induk = H(8, 2)  # entropi sebelum dibagi
anak = 6 / 10 * H(6, 0) + 4 / 10 * H(2, 2)  # rata-rata tertimbang entropi anak
# information gain = induk - anak
print(f"Entropi induk: {induk:.3f} | rata-rata anak: {anak:.3f} | information gain: {induk - anak:.3f}")`,
      },
      steps: [
        ['Pahami intuisi "kejutan"', 'Kejadian berpeluang kecil membawa informasi besar: −log p.'],
        ['Hitung entropi', 'Rata-rata kejutan dari sebuah distribusi.'],
        ['Hubungkan ke loss', 'Cross-entropy dengan label one-hot = −log(peluang kelas benar).'],
        ['Pakai log natural di kode', 'Library ML memakai ln (nats); bit memakai log2. Bentuknya sama, skalanya beda.'],
        ['Kenali di mana dipakai', 'Loss, perplexity, decision tree, KL di VAE/RLHF/distilasi.'],
      ],
      case: {
        title: 'Membandingkan dua model bahasa dengan perplexity',
        situation: 'Tim ingin memilih model untuk fitur autocomplete pesan berbahasa Indonesia, dengan membandingkan seberapa baik dua model memprediksi kata berikutnya pada kalimat uji.',
        steps: [
          'Dua model bigram dilatih dari korpus kecil: satu dengan smoothing, satu tanpa.',
          'Pada kalimat uji, dihitung peluang setiap kata berikutnya.',
          'Cross-entropy rata-rata diubah menjadi perplexity; makin kecil makin baik.',
        ],
        code: py`
import numpy as np  # NumPy
from collections import Counter, defaultdict  # penghitung

# kalimat latih dipecah per kata
latih = ("saya mau pesan kopi . saya mau pesan teh . kamu mau pesan apa . "
         "saya pesan kopi susu . kamu mau kopi . saya mau teh manis .").split()
uji = "kamu mau pesan susu manis .".split()  # kalimat uji
vocab = set(latih) | set(uji)  # semua kata yang dikenal

bigram = defaultdict(Counter)  # hitungan pasangan kata
for a, b in zip(latih, latih[1:]):  # untuk setiap pasangan berurutan
    bigram[a][b] += 1  # tambah hitungan

def peluang(a, b, alpha):  # peluang kata b setelah kata a
    c = bigram[a]  # kata setelah a
    # alpha = smoothing agar tidak ada peluang 0
    return (c[b] + alpha) / (sum(c.values()) + alpha * len(vocab))

# bandingkan dengan & tanpa smoothing
for nama, alpha in [("tanpa smoothing", 0.0), ("smoothing alpha=0.1", 0.1)]:
    # peluang setiap pasangan di kalimat uji
    p = np.array([peluang(a, b, alpha) for a, b in zip(uji, uji[1:])])
    if (p == 0).any():  # ada pasangan yang belum pernah dilihat
        # perplexity tak hingga
        print(f"{nama:20s}: ada kata berpeluang 0 -> perplexity tak hingga")
    else:  # semua peluang > 0
        print(f"{nama:20s}: perplexity = {np.exp(-np.log(p).mean()):.2f}")  # perplexity`,
        result: 'Model tanpa smoothing gagal total pada pasangan kata yang belum pernah dilihat ("pesan susu", "susu manis"), sedangkan model dengan smoothing memberi perplexity terbatas. Konsep yang sama dipakai untuk mengevaluasi LLM.',
      },
      deep: {
        concepts: [
          ['Kenapa cross-entropy, bukan akurasi, untuk training', 'Akurasi tidak berubah sedikit demi sedikit (tidak bisa diturunkan), sedangkan cross-entropy halus dan memberi sinyal gradien: memberi peluang 0,6 ke jawaban benar lebih baik daripada 0,4, walau keduanya mungkin "salah" atau "benar" menurut akurasi.'],
          ['Label smoothing', 'Target one-hot membuat model didorong ke keyakinan 100% (loss baru nol jika peluang = 1). Label smoothing mengganti target menjadi mis. 0,9/0,05/0,05 agar model tidak terlalu percaya diri.'],
        ],
        mistakes: [
          ['Menghitung log(0) sehingga loss = inf/NaN.', 'Clip peluang atau hitung dari logits dengan fungsi stabil.'],
          ['Menganggap KL simetris.', 'KL(p‖q) ≠ KL(q‖p); arah menentukan perilaku (mis. di VAE vs distilasi).'],
        ],
        tips: ['Perplexity hanya bisa dibandingkan antar model dengan tokenizer yang sama.'],
        check: [
          ['Model memberi peluang 0,01 ke kelas yang benar. Berapa cross-entropy-nya (ln)?', '−ln(0,01) ≈ 4,6. Loss besar karena model sangat yakin pada jawaban yang salah.'],
        ],
      },
    },
  ],
  'data-science': [
    {
      after: 'ds-eda',
      id: 'ds-timeseries',
      title: 'Data deret waktu dengan Pandas',
      summary: 'Index tanggal, resample, rolling, lag, dan musiman.',
      explain: [
        'Data deret waktu (time series) adalah pengamatan berurutan menurut waktu: penjualan harian, suhu per jam, harga saham. Urutannya bermakna, sehingga tidak boleh diacak sembarangan.',
        'Pandas punya alat khusus: **DatetimeIndex**, `resample` (ubah frekuensi: harian → mingguan), `rolling` (rata-rata bergerak), `shift` (nilai sebelumnya/lag), `diff` (perubahan), dan aksesor `.dt` (hari, bulan, jam).',
        'Komponen umum: **tren** (naik/turun jangka panjang), **musiman** (pola berulang: mingguan, tahunan, Ramadan), dan **noise**. Memahami komponen ini adalah dasar forecasting.',
      ],
      uses: [
        'Laporan penjualan mingguan/bulanan dari data transaksi harian',
        'Membuat fitur lag & rolling untuk model prediksi permintaan',
        'Mendeteksi lonjakan tidak wajar (anomali) pada traffic server',
        'Analisis musiman: hari apa paling ramai?',
      ],
      examples: [
        {
          title: 'Resample, rolling, lag, dan pola musiman',
          code: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas
import matplotlib.pyplot as plt  # grafik

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
idx = pd.date_range("2024-01-01", "2024-12-31", freq="D")  # tanggal setiap hari tahun 2024
tren = np.linspace(100, 160, len(idx))  # tren naik
mingguan = np.where(idx.dayofweek >= 5, 40, 0)                 # akhir pekan ramai
# deret waktu = tren + pola mingguan + noise
s = pd.Series(tren + mingguan + rng.normal(0, 10, len(idx)), index=idx, name="penjualan")

print(s.resample("MS").sum().head(3).round(0))                # total per bulan
print("\nRata-rata per hari:")  # judul
# 3 hari tersibuk
print(s.groupby(s.index.day_name()).mean().round(1).sort_values(ascending=False).head(3))

df = pd.DataFrame({"y": s})  # tabel fitur
df["lag_1"] = df.y.shift(1)                                    # kemarin
df["lag_7"] = df.y.shift(7)                                    # seminggu lalu
df["rata7"] = df.y.shift(1).rolling(7).mean()                  # rata-rata 7 hari SEBELUMNYA
print("\n", df.dropna().head(3).round(1))  # lihat 3 baris pertama

fig, ax = plt.subplots(figsize=(9, 3.5))  # siapkan grafik
s.plot(ax=ax, alpha=0.4, label="harian")  # data harian (transparan)
s.rolling(28).mean().plot(ax=ax, label="rata-rata 28 hari (tren)")  # garis tren
ax.legend(); ax.set_title("Penjualan 2024"); plt.show()  # legenda, judul, tampilkan`,
        },
      ],
      exercise: {
        task: 'Dari data kunjungan per jam selama 2 minggu (buat sendiri dengan puncak pukul 19.00), hitung rata-rata kunjungan per jam dalam sehari dan tampilkan 3 jam tersibuk. Lalu resample ke total harian.',
        hint: '`pd.date_range(..., freq="h")`, buat pola dengan `np.exp(-(jam-19)**2/8)`, lalu `groupby(index.hour)` dan `resample("D").sum()`.',
        solution: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
idx = pd.date_range("2025-11-01", periods=24 * 14, freq="h")  # data per jam selama 14 hari
jam = idx.hour.to_numpy()  # jam dari setiap waktu
# kunjungan: puncak jam 19 + noise
kunjungan = pd.Series(50 + 200 * np.exp(-(jam - 19) ** 2 / 8) + rng.normal(0, 10, len(idx)), index=idx)
per_jam = kunjungan.groupby(kunjungan.index.hour).mean()  # rata-rata per jam
# 3 jam tersibuk
print("3 jam tersibuk:\n", per_jam.sort_values(ascending=False).head(3).round(0))
# total harian
print("\nTotal harian (3 hari pertama):\n", kunjungan.resample("D").sum().head(3).round(0))`,
      },
      steps: [
        ['Ubah kolom ke datetime', '`pd.to_datetime` dengan format eksplisit, lalu jadikan index.'],
        ['Cek kelengkapan waktu', 'Apakah ada tanggal yang hilang? `asfreq("D")` lalu isi atau tandai.'],
        ['Visualisasikan', 'Plot data mentah + rolling mean untuk melihat tren & musiman.'],
        ['Agregasi sesuai kebutuhan', '`resample` ke minggu/bulan untuk laporan.'],
        ['Buat fitur waktu', 'Lag, rolling (dari data sebelumnya saja), hari, bulan, libur.'],
        ['Split berdasarkan waktu', 'Latih di masa lalu, uji di masa depan.'],
      ],
      case: {
        title: 'Mendeteksi lonjakan pesanan yang tidak wajar',
        situation: 'Sebuah toko online ingin diberi tahu otomatis jika pesanan per jam melonjak atau anjlok jauh dari biasanya (indikasi promo viral atau sistem bermasalah).',
        steps: [
          'Data pesanan per jam dibuat dengan pola harian.',
          'Nilai "normal" dihitung dari rata-rata dan std 7 hari sebelumnya pada jam yang sama.',
          'Titik dengan z-score > 4 ditandai sebagai anomali.',
        ],
        code: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas

rng = np.random.default_rng(3)  # generator acak dengan seed tetap
idx = pd.date_range("2025-10-01", periods=24 * 30, freq="h")  # data per jam selama 30 hari
# pola harian: ramai siang, sepi malam
pola = 30 + 25 * np.sin((idx.hour.to_numpy() - 6) / 24 * 2 * np.pi).clip(0)
# jumlah pesanan acak mengikuti pola
s = pd.Series(rng.poisson(pola), index=idx, dtype=float)
s.iloc[500] *= 4          # promo viral
s.iloc[613] = 0           # sistem checkout down (siang hari)

df = pd.DataFrame({"y": s, "jam": s.index.hour})  # tabel + kolom jam
grup = df.groupby("jam")["y"]  # kelompokkan per jam yang sama
# normal = rata-rata 7 hari sebelumnya di jam yang sama
df["normal"] = grup.transform(lambda x: x.shift(1).rolling(7, min_periods=5).mean())
# sebaran normalnya
df["std"] = grup.transform(lambda x: x.shift(1).rolling(7, min_periods=5).std())
df["z"] = (df.y - df.normal) / df["std"].clip(lower=4)  # z-score: seberapa jauh dari normal
# tampilkan yang sangat tidak biasa
print(df[df.z.abs() > 5][["y", "normal", "z"]].round(1))`,
        result: 'Dua kejadian (lonjakan promo dan checkout yang mati) terdeteksi tepat pada jamnya, tanpa alarm palsu dari pola naik-turun harian yang normal.',
      },
      deep: {
        concepts: [
          ['Leakage di time series', '`rolling(7).mean()` tanpa `shift(1)` ikut memakai nilai hari ini, sehingga fitur "membocorkan" target. Selalu geser dulu agar fitur hanya memakai data yang tersedia saat prediksi.'],
          ['Anomali mencemari statistik "normal"', 'Lonjakan besar ikut masuk ke rata-rata dan std jendela berikutnya, sehingga anomali kedua di jam yang sama bisa lolos. Solusinya: pakai statistik robust (median & MAD) atau keluarkan titik yang sudah ditandai anomali dari perhitungan.'],
          ['Stasioneritas', 'Banyak model statistik klasik (ARIMA) mengasumsikan rata-rata dan variansi tetap. Tren dihilangkan dengan differencing (`diff`) atau transformasi log.'],
        ],
        mistakes: [
          ['Mengacak data sebelum split.', 'Gunakan split berdasarkan tanggal atau `TimeSeriesSplit`.'],
          ['Mengisi tanggal hilang dengan 0 padahal data memang tidak tercatat.', 'Bedakan "tidak ada penjualan" (0) dengan "tidak ada data" (NaN).'],
        ],
        tips: ['Library forecasting: statsmodels, Prophet, sktime, Darts, atau LightGBM dengan fitur lag.', 'Hari libur nasional Indonesia bisa diambil dari paket `holidays` (`holidays.Indonesia()`).'],
        check: [
          ['Kenapa fitur rolling harus memakai `shift(1)` sebelum `rolling`?', 'Agar rata-rata hanya dihitung dari data masa lalu; tanpa shift, nilai target hari ini ikut masuk ke fitur (leakage).'],
        ],
      },
    },
    {
      after: 'ds-pandas',
      id: 'ds-dataset',
      title: 'Mencari & membuat dataset',
      summary: 'Dari mana data berasal: dataset siap pakai, API, survei, foto, scraping yang etis, dan data sintetis.',
      explain: [
        'Model AI hanya sebaik datanya. Sebelum memilih algoritma, jawab dulu: **data apa yang dibutuhkan, dari mana mendapatkannya, dan bolehkah dipakai?**',
        'Ada dua jalan. **Pakai yang sudah ada**: dataset bawaan scikit-learn, Kaggle, Hugging Face, UCI, OpenML, atau data pemerintah seperti BPS dan Satu Data Indonesia. **Buat sendiri**: mencatat, survei (Google Forms), memotret/merekam, mengambil lewat API, web scraping yang etis, atau membuat data sintetis dengan kode.',
        'Dataset buatan sendiri sering paling berharga karena sesuai konteks Indonesia dan jarang dimiliki orang lain. Tetapi ada kewajibannya: minta persetujuan, jangan simpan data pribadi yang tidak perlu (ada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi), cek lisensi dan hak cipta, serta tulis dokumentasi asal-usul data.',
        'Apa pun sumbernya, **periksa kualitas sebelum dipakai**: jumlah baris, data kosong, duplikat, keseimbangan kelas, kolom yang membocorkan jawaban, dan apakah data mewakili orang/kondisi tempat model akan dipakai.',
      ],
      uses: [
        'Latihan cepat dengan dataset bawaan (Iris, Wine, Digits) tanpa internet',
        'Proyek portofolio dengan data khas Indonesia: survei, foto makanan, data BPS',
        'Membuat data sintetis untuk menguji kode atau mensimulasikan kondisi yang belum terjadi',
        'Mengumpulkan data rutin dari API (cuaca, gempa) untuk time series',
      ],
      examples: [
        {
          title: 'Dataset bawaan → tabel → file CSV',
          code: py`
from sklearn.datasets import load_wine  # dataset bawaan, tidak perlu internet
import io  # "file" di memori (di komputer cukup pakai nama file)

wine = load_wine(as_frame=True)  # muat sebagai DataFrame
df = wine.frame  # tabel fitur + kolom target
df["jenis"] = df["target"].map(dict(enumerate(wine.target_names)))  # angka -> nama kelas
print(df.shape)  # ukuran tabel
print(df["jenis"].value_counts())  # jumlah sampel per kelas

buf = io.StringIO()  # di komputer: df.to_csv("wine.csv", index=False)
df.to_csv(buf, index=False)  # simpan tanpa kolom indeks
print(buf.getvalue().splitlines()[0][:80], "...")  # baris judul CSV`,
        },
        {
          title: 'Membuat data survei tiruan lalu memeriksa kualitasnya',
          code: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(5)  # seed agar data selalu sama
n = 120  # jumlah "responden"
jam_tidur = rng.normal(6.5, 1.2, n).clip(3, 10).round(1)  # jam tidur per malam
fokus = (1 + 0.6 * (jam_tidur - 3) + rng.normal(0, 0.8, n)).clip(1, 5).round()  # skala fokus 1-5, makin cukup tidur makin fokus
waktu = pd.date_range("2026-03-02 08:00", periods=n, freq="7min")  # waktu kirim: pembeda tiap jawaban
df = pd.DataFrame({"waktu": waktu, "jam_tidur": jam_tidur, "fokus": fokus})  # tabel jawaban
df.loc[rng.choice(n, 6, replace=False), "fokus"] = np.nan  # 6 orang tidak menjawab
df = pd.concat([df, df.iloc[[0, 1]]], ignore_index=True)  # 2 jawaban terkirim dua kali (waktu kirim sama persis)

print("baris:", len(df), "| kosong:", df["fokus"].isna().sum(), "| duplikat:", df.duplicated().sum())  # duplikat = semua kolom sama, termasuk waktu
bersih = df.drop_duplicates().dropna()  # buang duplikat & yang kosong
print("setelah dibersihkan:", len(bersih), "baris")  # sisa data
print("korelasi tidur-fokus:", round(bersih["jam_tidur"].corr(bersih["fokus"]), 2))  # hubungan keduanya`,
        },
      ],
      exercise: {
        task: 'Buat dataset sintetis 200 siswa: `jam_belajar` acak 0–6 jam, `nilai` = 50 + 7 × jam_belajar + noise normal (simpangan 8), dibatasi 0–100. Kosongkan 5% nilai secara acak. Cetak jumlah data kosong dan korelasi jam belajar dengan nilai (setelah data kosong dibuang).',
        hint: '`rng.uniform(0, 6, 200)`, `rng.normal(0, 8, 200)`, `.clip(0, 100)`, `rng.choice(200, 10, replace=False)` untuk 5%, lalu `.dropna()` dan `.corr()`.',
        solution: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(0)  # seed
jam = rng.uniform(0, 6, 200).round(1)  # jam belajar 0-6
nilai = (50 + 7 * jam + rng.normal(0, 8, 200)).clip(0, 100).round()  # aturan + noise, dibatasi 0-100
df = pd.DataFrame({"jam_belajar": jam, "nilai": nilai})  # tabel
df.loc[rng.choice(200, 10, replace=False), "nilai"] = np.nan  # 5% = 10 baris dikosongkan
print("data kosong:", df["nilai"].isna().sum())  # harus 10
bersih = df.dropna()  # buang yang kosong
print("korelasi:", round(bersih["jam_belajar"].corr(bersih["nilai"]), 2))  # kuat dan positif`,
      },
      steps: [
        ['Tulis pertanyaan & kolom yang dibutuhkan', 'Termasuk kolom target dan kapan nilainya tersedia.'],
        ['Cari dataset yang sudah ada', 'Kaggle, Hugging Face, UCI, OpenML, BPS, Satu Data Indonesia.'],
        ['Cek kecocokan & lisensi', 'Bahasa, negara, tahun, dan izin pemakaian.'],
        ['Jika tidak ada, kumpulkan sendiri', 'Catat, survei, foto, API, scraping etis, atau sintetis.'],
        ['Periksa kualitas', 'Kosong, duplikat, imbalance, kebocoran, data pribadi.'],
        ['Dokumentasikan', 'README: sumber, tanggal, cara pengumpulan, arti kolom, keterbatasan.'],
      ],
      case: {
        title: 'Prediksi penjualan UMKM keripik tanpa dataset publik',
        situation: 'Mahasiswa ingin membantu UMKM keripik tetangganya memperkirakan produksi harian. Tidak ada dataset publik tentang UMKM itu, tetapi pemiliknya punya buku kas penjualan setahun terakhir.',
        steps: [
          'Minta izin pemilik dan sepakati data apa yang boleh dipakai (tanpa nama pembeli).',
          'Salin buku kas ke Google Sheets dengan kolom tetap: tanggal, porsi terjual, catatan.',
          'Tambah konteks dari luar: data hujan harian dari API Open-Meteo dan penanda akhir pekan.',
          'Gabungkan berdasarkan tanggal lalu periksa kualitas: hari kosong, duplikat, angka janggal.',
          'Tulis README: asal data, periode, perubahan yang dilakukan, keterbatasan.',
        ],
        code: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(11)  # seed (data di bawah adalah tiruan buku kas)
tgl = pd.date_range("2025-01-01", periods=60, freq="D")  # 60 hari pertama
hujan = rng.gamma(0.6, 8, 60).round(1)  # tiruan data hujan harian (mm) dari API cuaca
kas = pd.DataFrame({"tanggal": tgl, "porsi": rng.poisson(np.where(hujan > 5, 30, 42)).astype(float)})  # tiruan buku kas: hujan deras -> lebih sepi
kas.loc[[5, 17, 33], "porsi"] = np.nan  # hari yang lupa dicatat
kas = pd.concat([kas, kas.iloc[[20]]], ignore_index=True)  # satu hari tercatat dua kali
cuaca = pd.DataFrame({"tanggal": tgl, "hujan_mm": hujan})  # tabel cuaca terpisah, seperti hasil API

data = kas.drop_duplicates("tanggal").merge(cuaca, on="tanggal", how="left")  # buang duplikat, gabung per tanggal
data["akhir_pekan"] = data["tanggal"].dt.dayofweek >= 5  # fitur tambahan
print("baris:", len(data), "| hari kosong:", int(data["porsi"].isna().sum()))  # laporan kualitas
print(data.dropna().groupby(data["hujan_mm"] > 5)["porsi"].mean().round(1))  # porsi saat hujan deras vs tidak`,
        result: 'Dataset 60 hari yang bersih dan terdokumentasi, siap untuk baseline dan model. Hari yang kosong ditandai, bukan dikarang.',
      },
      deep: {
        concepts: [
          ['Bias pengambilan sampel', 'Survei yang hanya disebar di satu grup kampus menggambarkan grup itu, bukan semua mahasiswa. Model yang dilatih dari data seperti ini bisa gagal saat dipakai pada kelompok lain. Catat siapa yang terwakili dan siapa yang tidak.'],
          ['Kualitas label', 'Label yang dibuat manusia bisa tidak konsisten. Buat pedoman pelabelan dengan contoh, lalu minta dua orang melabeli sebagian data yang sama untuk mengukur kesepakatan. Jika mereka sering berbeda, perbaiki pedomannya dulu.'],
          ['Lisensi & hak cipta', 'Dataset publik punya lisensi: CC0 (bebas), CC BY (wajib menyebut sumber), CC BY-NC (tidak untuk komersial). Data yang "bisa diunduh" belum tentu boleh dipakai untuk produk.'],
          ['Data sintetis', 'Berguna untuk latihan, pengujian, dan simulasi karena kita tahu "jawaban benarnya". Kelemahannya: pola dunia nyata yang tidak kita tulis di rumus tidak akan pernah muncul.'],
        ],
        mistakes: [
          ['Langsung membersihkan file asli.', 'Simpan data mentah tanpa diubah; bersihkan lewat kode di salinan agar bisa diulang.'],
          ['Mengambil foto/teks dari internet tanpa melihat lisensi.', 'Pakai sumber berlisensi terbuka atau buat sendiri, dan catat sumbernya.'],
          ['Menyimpan nama, NIK, atau nomor HP responden "untuk jaga-jaga".', 'Kumpulkan hanya yang diperlukan; samarkan atau hapus data pribadi.'],
          ['Scraping ribuan halaman tanpa jeda.', 'Cek API resmi dulu, baca robots.txt, dan beri jeda antar permintaan.'],
        ],
        tips: [
          'Halaman 🛠️ Proyek → "Cara mendapatkan dataset" berisi daftar sumber, contoh kode, dan checklist lengkap.',
          'Mulai kecil: 100 baris yang bersih lebih berguna daripada 10.000 baris berantakan.',
          'Taruh folder data di `.gitignore`; tulis cara mengunduhnya di README.',
        ],
        check: [
          ['Kenapa data uji untuk model foto sebaiknya diambil dari sesi pemotretan yang berbeda?', 'Foto dari sesi yang sama sangat mirip (cahaya, latar, objek). Jika tersebar ke data latih dan uji, akurasi uji terlihat tinggi padahal model belum tentu bisa menangani foto baru.'],
          ['Sebuah dataset bisa diunduh gratis dari internet. Apakah otomatis boleh dipakai untuk aplikasi berbayar?', 'Belum tentu. Cek lisensinya: CC BY-NC melarang pemakaian komersial, dan dataset tanpa lisensi sebaiknya ditanyakan dulu ke pemiliknya.'],
        ],
      },
    },
  ],

  // ---------------- Mahir ----------------
  'machine-learning': [
    {
      after: 'ml-evaluasi',
      id: 'ml-imbalance',
      title: 'Data tidak seimbang',
      summary: 'Saat kelas penting sangat langka: penipuan, penyakit, churn.',
      explain: [
        'Data **tidak seimbang** (imbalanced) terjadi saat satu kelas jauh lebih sedikit, mis. 1 penipuan per 1.000 transaksi. Model cenderung menebak kelas mayoritas dan tetap mendapat akurasi tinggi, padahal tidak berguna.',
        'Tiga kelompok solusi: (1) **metrik yang tepat** (precision, recall, F1, PR-AUC), (2) **mengubah bobot/data**: `class_weight="balanced"`, undersampling mayoritas, oversampling minoritas (SMOTE), dan (3) **mengatur threshold** sesuai biaya kesalahan.',
        'Resampling harus dilakukan **hanya pada data latih** (di dalam cross-validation). Data validasi dan uji harus tetap mencerminkan proporsi nyata.',
      ],
      uses: [
        'Deteksi penipuan transaksi kartu kredit/e-wallet',
        'Skrining penyakit langka dari data medis',
        'Prediksi pelanggan berhenti (churn) atau gagal bayar',
        'Deteksi kerusakan mesin dari sensor (kerusakan jarang terjadi)',
      ],
      algos: ['logistic-regression', 'random-forest', 'gradient-boosting'],
      examples: [
        {
          title: 'Akurasi menipu vs class_weight vs threshold',
          code: py`
import numpy as np  # NumPy
from sklearn.datasets import make_classification  # pembuat data
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.linear_model import LogisticRegression  # regresi logistik
# metrik evaluasi
from sklearn.metrics import accuracy_score, recall_score, precision_score, average_precision_score

# 20 ribu data, hanya 1% positif
X, y = make_classification(n_samples=20000, n_features=12, n_informative=5, weights=[0.99], class_sep=2.0, random_state=1)
# 40% uji, proporsi kelas dijaga
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, stratify=y, random_state=0)
print(f"Proporsi positif: {y.mean():.2%}\n")  # cek proporsi kelas

def lapor(nama, pred, skor=None):  # cetak beberapa metrik sekaligus
    # susun teks laporan
    teks = f"{nama:30s} akurasi={accuracy_score(y_te, pred):.3f} recall={recall_score(y_te, pred):.2f} precision={precision_score(y_te, pred, zero_division=0):.2f}"
    # tambahkan PR-AUC jika ada skor
    print(teks + (f" PR-AUC={average_precision_score(y_te, skor):.2f}" if skor is not None else ""))

# baseline: akurasi tinggi tapi recall 0
lapor("Tebak selalu 'normal'", np.zeros_like(y_te))
biasa = LogisticRegression(max_iter=2000).fit(X_tr, y_tr)  # model biasa
lapor("Logistic biasa", biasa.predict(X_te), biasa.predict_proba(X_te)[:, 1])  # laporannya
# model dengan bobot kelas seimbang
seimbang = LogisticRegression(max_iter=2000, class_weight="balanced").fit(X_tr, y_tr)
# laporannya
lapor("Logistic class_weight=balanced", seimbang.predict(X_te), seimbang.predict_proba(X_te)[:, 1])
p = biasa.predict_proba(X_te)[:, 1]  # peluang dari model biasa
# turunkan threshold ke 0.1
lapor("Logistic biasa, threshold 0.1", (p >= 0.1).astype(int), p)
# kesimpulan
print("\nclass_weight menaikkan recall tetapi membanjiri alarm palsu; menurunkan threshold memberi kompromi.")
# catatan
print("PR-AUC tidak berubah oleh threshold karena mengukur kualitas URUTAN skor, bukan satu titik keputusan.")`,
        },
      ],
      exercise: {
        task: 'Implementasikan random oversampling sederhana: duplikasi acak sampel kelas minoritas di data latih sampai jumlahnya sama dengan mayoritas, lalu bandingkan recall-nya dengan model tanpa oversampling.',
        hint: 'Ambil indeks minoritas, `rng.choice(idx_min, size=n_maj - n_min, replace=True)`, gabungkan dengan `np.concatenate`. Jangan sentuh data uji.',
        solution: py`
import numpy as np  # NumPy
from sklearn.datasets import make_classification  # pembuat data
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.metrics import recall_score  # metrik recall

# data dengan 2% positif
X, y = make_classification(n_samples=10000, weights=[0.98], class_sep=0.8, random_state=0)
# bagi data
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, stratify=y, random_state=0)

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# indeks kelas minoritas & mayoritas
idx_min, idx_maj = np.where(y_tr == 1)[0], np.where(y_tr == 0)[0]
# ambil ulang minoritas sampai jumlahnya sama
tambahan = rng.choice(idx_min, size=len(idx_maj) - len(idx_min), replace=True)
# gabungkan dengan data latih (data uji tidak diubah)
X_os, y_os = np.concatenate([X_tr, X_tr[tambahan]]), np.concatenate([y_tr, y_tr[tambahan]])

# bandingkan kedua cara
for nama, (Xa, ya) in {"tanpa oversampling": (X_tr, y_tr), "dengan oversampling": (X_os, y_os)}.items():
    m = LogisticRegression(max_iter=2000).fit(Xa, ya)  # latih
    # recall di data uji
    print(f"{nama:20s}: recall={recall_score(y_te, m.predict(X_te)):.2f}")`,
      },
      steps: [
        ['Ukur ketidakseimbangan', '`y.value_counts(normalize=True)`.'],
        ['Tetapkan metrik & biaya', 'Berapa mahal FN vs FP? Pilih recall/precision/PR-AUC.'],
        ['Baseline dengan class_weight', 'Paling sederhana dan sering cukup.'],
        ['Coba resampling di dalam CV', 'Pakai `imblearn.pipeline.Pipeline` agar hanya data latih yang di-resample.'],
        ['Atur threshold', 'Pilih threshold di data validasi berdasarkan biaya.'],
        ['Evaluasi di data uji asli', 'Proporsi kelas tetap seperti dunia nyata.'],
      ],
      case: {
        title: 'Deteksi transaksi e-wallet mencurigakan dengan anggaran investigasi terbatas',
        situation: 'Tim anti-fraud hanya sanggup memeriksa 200 transaksi per hari dari 20.000 transaksi. Penipuan sekitar 0,5%. Mereka ingin model yang memaksimalkan penipuan yang tertangkap dalam 200 transaksi teratas.',
        steps: [
          'Model gradient boosting dilatih dengan data historis.',
          'Alih-alih threshold tetap, transaksi diurutkan berdasarkan skor risiko.',
          'Dihitung berapa penipuan yang tertangkap di 200 teratas (precision@200 dan recall@200).',
        ],
        code: py`
import numpy as np  # NumPy
from sklearn.datasets import make_classification  # pembuat data
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.ensemble import HistGradientBoostingClassifier  # gradient boosting cepat

# 60 ribu transaksi, 0.5% penipuan
X, y = make_classification(n_samples=60000, n_features=15, n_informative=6, weights=[0.995], class_sep=1.2, random_state=3)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=20000, stratify=y, random_state=0)   # 20.000 = satu hari
# latih dengan bobot kelas seimbang
model = HistGradientBoostingClassifier(class_weight="balanced", random_state=0).fit(X_tr, y_tr)

skor = model.predict_proba(X_te)[:, 1]  # skor risiko setiap transaksi
top = np.argsort(-skor)[:200]  # 200 transaksi paling mencurigakan
tertangkap = y_te[top].sum()  # berapa yang benar penipuan
print(f"Penipuan hari ini: {y_te.sum()}")  # total penipuan
# precision & recall di 200 teratas
print(f"Tertangkap di 200 teratas: {tertangkap} (precision@200={tertangkap / 200:.2f}, recall@200={tertangkap / y_te.sum():.2f})")
# pembanding: 200 transaksi acak
acak = np.random.default_rng(0).choice(len(y_te), 200, replace=False)
print(f"Jika 200 transaksi dipilih acak: {y_te[acak].sum()} penipuan")  # hasil pilihan acak`,
        result: 'Dengan mengurutkan berdasarkan skor risiko, tim menangkap sebagian besar penipuan hanya dengan memeriksa 1% transaksi, jauh lebih baik daripada pemeriksaan acak.',
      },
      deep: {
        concepts: [
          ['SMOTE', 'SMOTE membuat sampel minoritas sintetis dengan interpolasi antara dua tetangga minoritas. Bisa membantu model linear/KNN, tetapi untuk gradient boosting modern sering tidak lebih baik daripada `class_weight` + threshold tuning.'],
          ['Peluang setelah resampling', 'Oversampling/undersampling mengubah proporsi kelas yang dilihat model, sehingga `predict_proba` jadi terlalu tinggi untuk kelas minoritas. Jika peluang dipakai langsung (mis. menghitung ekspektasi kerugian), kalibrasi ulang.'],
        ],
        mistakes: [
          ['Melakukan SMOTE sebelum split.', 'Sampel sintetis bocor ke data uji dan skor jadi palsu. Resample di dalam pipeline CV.'],
          ['Menyeimbangkan data uji.', 'Data uji harus mencerminkan proporsi nyata agar precision yang dilaporkan jujur.'],
        ],
        tips: ['Library `imbalanced-learn` menyediakan SMOTE, undersampling, dan Pipeline yang aman.', 'Untuk anggaran investigasi tetap, laporkan precision@k / recall@k.'],
        check: [
          ['Kenapa model dengan akurasi 99% bisa tidak berguna pada data penipuan 1%?', 'Model bisa saja menebak "normal" untuk semua transaksi dan tetap 99% benar, tetapi tidak menangkap satu pun penipuan (recall 0).'],
        ],
      },
    },
    {
      after: 'ml-overfit',
      id: 'ml-tuning',
      title: 'Hyperparameter tuning',
      summary: 'Grid, random, dan Bayesian search dengan cross-validation.',
      explain: [
        '**Hyperparameter** adalah pengaturan model yang tidak dipelajari dari data (kedalaman tree, learning rate, C pada SVM). Tuning adalah mencari kombinasi terbaik berdasarkan skor **validasi**, bukan skor uji.',
        '**Grid search** mencoba semua kombinasi (mahal, jumlahnya meledak). **Random search** mencoba kombinasi acak; untuk anggaran yang sama biasanya lebih efisien karena tidak semua hyperparameter sama penting. **Bayesian optimization** (Optuna) memilih kombinasi berikutnya berdasarkan hasil sebelumnya.',
        'Untuk evaluasi akhir yang jujur saat tuning, pakai **nested cross-validation** atau pisahkan data uji yang tidak pernah disentuh selama tuning.',
      ],
      uses: [
        'Memeras performa tambahan setelah fitur dan model dasar sudah baik',
        'Menemukan pengaturan regularisasi yang tepat untuk mencegah overfitting',
        'Membandingkan model secara adil (masing-masing di-tuning dengan anggaran sama)',
      ],
      algos: ['random-forest', 'gradient-boosting', 'svm'],
      examples: [
        {
          title: 'Grid search vs random search dengan anggaran sama',
          code: py`
import time  # pengukur waktu
import numpy as np  # NumPy
from scipy.stats import loguniform, randint  # distribusi untuk random search
from sklearn.datasets import load_breast_cancer  # dataset kanker payudara
# grid search, random search, pembagi data
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier  # gradient boosting

X, y = load_breast_cancer(return_X_y=True)  # muat data
# 25% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)
model = HistGradientBoostingClassifier(random_state=0)  # model yang di-tuning

grid = {"learning_rate": [0.03, 0.1, 0.3], "max_depth": [2, 4, None], "min_samples_leaf": [5, 20]}     # 18 kombinasi
# ruang pencarian acak
acak = {"learning_rate": loguniform(0.01, 0.5), "max_depth": [2, 3, 4, 6, None],
        "min_samples_leaf": randint(2, 50), "l2_regularization": loguniform(1e-4, 1)}

# bandingkan grid & random dengan 18 percobaan
for nama, cari in [("Grid", GridSearchCV(model, grid, cv=5, scoring="roc_auc")),
                   ("Random", RandomizedSearchCV(model, acak, n_iter=18, cv=5, scoring="roc_auc", random_state=0))]:
    t = time.perf_counter(); cari.fit(X_tr, y_tr)  # mulai mengukur lalu cari
    # skor CV, skor uji, waktu
    print(f"{nama:6s}: CV AUC={cari.best_score_:.4f} | uji AUC={cari.score(X_te, y_te):.4f} | {time.perf_counter() - t:.1f}s")
    # parameter terbaik
    print("        terbaik:", {k: (round(float(v), 4) if isinstance(v, float) else v) for k, v in cari.best_params_.items()})`,
        },
      ],
      exercise: {
        task: 'Pakai `GridSearchCV` untuk mencari `C` terbaik (0.01, 0.1, 1, 10, 100) pada pipeline `StandardScaler` + `LogisticRegression` untuk dataset wine. Cetak skor CV setiap nilai C.',
        hint: 'Nama parameter dalam pipeline memakai format `namalangkah__parameter`, mis. `logisticregression__C`. Hasil per kombinasi ada di `cv_results_`.',
        solution: py`
from sklearn.datasets import load_wine  # dataset anggur
from sklearn.model_selection import GridSearchCV  # grid search
from sklearn.pipeline import make_pipeline  # merangkai langkah
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.linear_model import LogisticRegression  # regresi logistik

X, y = load_wine(return_X_y=True)  # muat data
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))  # pipeline
# coba 5 nilai C (nama_langkah__parameter)
gs = GridSearchCV(pipe, {"logisticregression__C": [0.01, 0.1, 1, 10, 100]}, cv=5).fit(X, y)
# pasangkan C & skornya
for c, s in zip(gs.cv_results_["param_logisticregression__C"], gs.cv_results_["mean_test_score"]):
    print(f"C={c:<6} CV akurasi={s:.4f}")  # cetak
print("Terbaik:", gs.best_params_)  # C terbaik`,
      },
      steps: [
        ['Pastikan pipeline & fitur sudah baik', 'Tuning tidak menyelamatkan fitur yang buruk.'],
        ['Pilih hyperparameter penting', 'Mis. learning_rate & max_depth untuk boosting, C & gamma untuk SVM.'],
        ['Tentukan rentang (skala log)', 'Learning rate 0.001–0.5, C 0.01–100.'],
        ['Random search / Optuna dengan CV', 'Mulai 20–50 percobaan.'],
        ['Persempit dan ulangi', 'Fokus di sekitar area terbaik.'],
        ['Evaluasi sekali di data uji', 'Laporkan skor uji dari model akhir.'],
      ],
      case: {
        title: 'Tuning model prediksi harga dengan Optuna-style search',
        situation: 'Analis properti ingin menurunkan error model harga rumah. Waktu komputasi terbatas, sehingga perlu pencarian yang efisien.',
        steps: [
          'Baseline dengan hyperparameter default dievaluasi dengan CV.',
          'Random search 25 percobaan pada rentang skala log.',
          'Model terbaik dilatih ulang dan dievaluasi sekali di data uji.',
        ],
        code: py`
import numpy as np  # NumPy
from scipy.stats import loguniform, randint  # distribusi untuk random search
# alat tuning & pembagi data
from sklearn.model_selection import RandomizedSearchCV, cross_val_score, train_test_split
# gradient boosting untuk regresi
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error  # metrik MAE

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 3000  # 3000 rumah
# luas, kamar, jarak, umur bangunan
X = np.column_stack([rng.uniform(30, 250, n), rng.integers(1, 6, n), rng.uniform(1, 40, n), rng.integers(0, 30, n)])
# harga dari fitur + noise
y = 6 * X[:, 0] + 40 * X[:, 1] - 8 * X[:, 2] - 3 * X[:, 3] + 0.02 * X[:, 0] ** 2 + rng.normal(0, 60, n)
# 20% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)

base = HistGradientBoostingRegressor(random_state=0)  # model default
# MAE baseline
print("Baseline CV MAE:", -cross_val_score(base, X_tr, y_tr, cv=5, scoring="neg_mean_absolute_error").mean().round(1))

# ruang pencarian
ruang = {"learning_rate": loguniform(0.01, 0.3), "max_leaf_nodes": randint(8, 64),
         "min_samples_leaf": randint(5, 80), "l2_regularization": loguniform(1e-3, 10)}
# 25 kombinasi acak
cari = RandomizedSearchCV(base, ruang, n_iter=25, cv=5, scoring="neg_mean_absolute_error", random_state=0).fit(X_tr, y_tr)
print("Tuned CV MAE   :", round(-cari.best_score_, 1))  # MAE setelah tuning
# MAE di data uji
print("MAE data uji   :", round(mean_absolute_error(y_te, cari.predict(X_te)), 1), "(juta rupiah)")`,
        result: 'Random search menurunkan error dibanding default dengan anggaran 25 percobaan, dan skor uji yang dilaporkan tetap jujur karena data uji tidak dipakai selama tuning.',
      },
      deep: {
        concepts: [
          ['Kenapa random search efisien', 'Jika hanya 1–2 dari 5 hyperparameter yang benar-benar berpengaruh, grid search membuang banyak percobaan untuk variasi yang tidak penting, sedangkan random search mencoba lebih banyak nilai berbeda pada hyperparameter penting.'],
          ['Nested cross-validation', 'Loop luar mengestimasi performa, loop dalam melakukan tuning. Ini mencegah skor yang terlalu optimis karena memilih hyperparameter terbaik dari banyak percobaan pada data yang sama.'],
          ['Early stopping sebagai tuning gratis', 'Untuk boosting dan neural network, jumlah iterasi/epoch bisa ditentukan otomatis dengan early stopping, tidak perlu dimasukkan ke grid.'],
        ],
        mistakes: [
          ['Tuning berdasarkan skor data uji.', 'Pakai CV pada data latih; data uji sekali di akhir.'],
          ['Rentang linear untuk learning rate (0.1, 0.2, 0.3...).', 'Pakai skala log (0.001, 0.01, 0.1).'],
          ['Menghabiskan berhari-hari tuning untuk peningkatan 0,1%.', 'Fokus ke data dan fitur yang biasanya memberi peningkatan jauh lebih besar.'],
        ],
        tips: ['Optuna: `study.optimize(objective, n_trials=50)` dengan pruning untuk menghentikan percobaan buruk lebih awal.', 'Set `n_jobs=-1` di komputer sendiri untuk memakai semua core CPU.'],
        check: [
          ['Kenapa skor CV terbaik dari search sedikit terlalu optimis?', 'Karena kita memilih yang terbaik dari banyak percobaan; sebagian keunggulannya adalah keberuntungan pada fold tersebut. Data uji terpisah atau nested CV memberi estimasi yang jujur.'],
        ],
      },
    },
    {
      after: 'ml-fitur',
      id: 'ml-interpretasi',
      title: 'Interpretasi model',
      summary: 'Menjelaskan kenapa model memprediksi sesuatu: importance, PDP, SHAP.',
      explain: [
        'Model yang akurat belum tentu bisa dipercaya. **Interpretasi** menjawab: fitur apa yang paling berpengaruh secara umum (global), dan kenapa prediksi untuk satu orang tertentu seperti itu (lokal).',
        '**Permutation importance** (global): acak satu fitur dan lihat seberapa turun skornya. **Partial Dependence Plot (PDP)** (global): bagaimana prediksi rata-rata berubah saat satu fitur diubah. **SHAP** (lokal & global): membagi prediksi menjadi kontribusi setiap fitur, berdasarkan teori permainan (Shapley value).',
        'Interpretasi menunjukkan apa yang dipelajari **model**, bukan sebab-akibat di dunia nyata. Tetapi ia sangat berguna untuk menemukan bug, leakage, dan bias, serta menjelaskan keputusan ke pengguna.',
      ],
      uses: [
        'Menjelaskan alasan penolakan kredit kepada nasabah (sering diwajibkan regulasi)',
        'Menemukan fitur bocor (leakage) yang terlalu dominan',
        'Mendapat insight bisnis: faktor apa yang mendorong churn',
        'Membangun kepercayaan dokter/pengguna terhadap model',
      ],
      algos: ['random-forest', 'gradient-boosting', 'linear-regression'],
      examples: [
        {
          title: 'Permutation importance, PDP, dan penjelasan lokal sederhana',
          code: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas
import matplotlib.pyplot as plt  # grafik
from sklearn.ensemble import HistGradientBoostingClassifier  # gradient boosting
# alat interpretasi
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.model_selection import train_test_split  # membagi data

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 4000  # 4000 nasabah
# tabel nasabah
df = pd.DataFrame({"umur": rng.integers(21, 65, n), "pendapatan": rng.lognormal(2.2, 0.4, n),
                   "rasio_utang": rng.uniform(0, 0.9, n), "lama_kerja": rng.integers(0, 30, n)}).astype(float)
# risiko naik oleh rasio utang, turun oleh lama kerja & pendapatan
logit = -1 + 5 * (df.rasio_utang - 0.4) - 0.08 * df.lama_kerja - 0.1 * (df.pendapatan - 9)
y = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)        # 1 = gagal bayar
# 30% untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(df, y, test_size=0.3, random_state=0)
model = HistGradientBoostingClassifier(random_state=0).fit(X_tr, y_tr)  # latih model

# permutation importance
imp = permutation_importance(model, X_te, y_te, scoring="roc_auc", n_repeats=5, random_state=0)
# urutkan dari terpenting
print(pd.Series(imp.importances_mean, index=df.columns).sort_values(ascending=False).round(3))

# Penjelasan lokal sederhana: ubah satu fitur ke nilai median, lihat perubahan peluang
p_uji = model.predict_proba(X_te)[:, 1]  # peluang setiap nasabah uji
nasabah = X_te.iloc[[int(np.argmin(np.abs(p_uji - 0.7)))]]        # nasabah dengan risiko ~70%
dasar = model.predict_proba(nasabah)[0, 1]  # peluang nasabah ini
print(f"\nPeluang gagal bayar nasabah ini: {dasar:.2f}")  # tampilkan
for f in df.columns:  # untuk setiap fitur
    x = nasabah.copy(); x[f] = X_tr[f].median()  # ganti satu fitur dengan median
    # berapa perubahan peluangnya
    print(f"  jika {f:12s} = median -> {model.predict_proba(x)[0, 1]:.2f} ({model.predict_proba(x)[0, 1] - dasar:+.2f})")

# grafik partial dependence
PartialDependenceDisplay.from_estimator(model, X_te, ["rasio_utang", "lama_kerja"])
# judul & tampilkan
plt.suptitle("Partial dependence: efek rata-rata fitur terhadap peluang gagal bayar"); plt.tight_layout(); plt.show()`,
        },
      ],
      exercise: {
        task: 'Latih `LinearRegression` pada `load_diabetes` dengan fitur yang sudah distandarkan, lalu tampilkan 3 fitur dengan koefisien absolut terbesar beserta tandanya. Bandingkan dengan permutation importance.',
        hint: 'Data load_diabetes sudah berskala; `np.argsort(-np.abs(model.coef_))[:3]`. Permutation importance dengan `permutation_importance(model, X, y)`.',
        solution: py`
import numpy as np  # NumPy
from sklearn.datasets import load_diabetes  # dataset diabetes
from sklearn.linear_model import LinearRegression  # regresi linear
from sklearn.inspection import permutation_importance  # permutation importance

d = load_diabetes()  # muat data
model = LinearRegression().fit(d.data, d.target)  # latih
print("Koefisien terbesar:")  # judul
for i in np.argsort(-np.abs(model.coef_))[:3]:  # 3 koefisien terbesar (nilai mutlak)
    print(f"  {d.feature_names[i]:4s} {model.coef_[i]:+.1f}")  # cetak
# permutation importance
imp = permutation_importance(model, d.data, d.target, n_repeats=10, random_state=0)
# 3 fitur terpenting
print("Permutation importance terbesar:", [d.feature_names[i] for i in np.argsort(-imp.importances_mean)[:3]])`,
      },
      steps: [
        ['Mulai dari model yang sudah dievaluasi', 'Interpretasi model buruk tidak bermakna.'],
        ['Importance global', 'Permutation importance pada data validasi/uji.'],
        ['Arah & bentuk pengaruh', 'PDP / ICE untuk fitur penting.'],
        ['Penjelasan lokal', 'SHAP untuk prediksi individu.'],
        ['Cek kewajaran dengan ahli domain', 'Apakah pola masuk akal? Ada tanda leakage atau bias?'],
        ['Komunikasikan dengan sederhana', '"Rasio utang tinggi menaikkan risiko paling besar."'],
      ],
      case: {
        title: 'Menemukan kebocoran data lewat interpretasi',
        situation: 'Model prediksi pasien rawat inap ulang mencapai AUC 0,99, terlalu bagus. Tim memeriksa fitur apa yang paling dipakai model.',
        steps: [
          'Permutation importance dihitung pada data uji.',
          'Ternyata fitur "jumlah_tagihan_lanjutan" paling dominan.',
          'Fitur itu baru tersedia setelah pasien dirawat ulang (bocor dari masa depan), lalu dihapus.',
        ],
        code: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas
from sklearn.ensemble import RandomForestClassifier  # random forest
from sklearn.inspection import permutation_importance  # permutation importance
from sklearn.model_selection import train_test_split  # membagi data
from sklearn.metrics import roc_auc_score  # metrik AUC

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
n = 3000  # 3000 pasien
# tabel pasien
df = pd.DataFrame({"umur": rng.integers(20, 90, n), "lama_rawat": rng.integers(1, 15, n),
                   "jumlah_obat": rng.integers(0, 12, n), "penyakit_kronis": rng.integers(0, 2, n)})
# risiko rawat ulang
logit = -3 + 0.03 * (df.umur - 50) + 0.15 * df.lama_rawat + 0.9 * df.penyakit_kronis
y = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)  # label
df["jumlah_tagihan_lanjutan"] = y * rng.integers(1, 5, n) + rng.integers(0, 2, n)   # BOCOR: dihitung setelah kejadian

# dengan & tanpa kolom bocor
for kolom in [list(df.columns), [c for c in df.columns if c != "jumlah_tagihan_lanjutan"]]:
    # bagi data
    X_tr, X_te, y_tr, y_te = train_test_split(df[kolom], y, test_size=0.3, random_state=0)
    m = RandomForestClassifier(200, random_state=0, n_jobs=1).fit(X_tr, y_tr)  # latih
    # importance
    imp = permutation_importance(m, X_te, y_te, scoring="roc_auc", n_repeats=3, random_state=0)
    top = pd.Series(imp.importances_mean, index=kolom).idxmax()  # fitur terpenting
    # kolom bocor membuat AUC palsu tinggi
    print(f"{len(kolom)} fitur: AUC={roc_auc_score(y_te, m.predict_proba(X_te)[:, 1]):.3f}, fitur terpenting: {top}")`,
        result: 'Setelah fitur bocor dihapus, AUC turun ke angka yang realistis dan fitur terpenting menjadi faktor klinis yang masuk akal. Model yang "kalah skor" ini justru yang layak dipakai.',
      },
      deep: {
        concepts: [
          ['SHAP secara intuitif', 'Bayangkan fitur sebagai pemain yang bekerja sama menghasilkan prediksi. Shapley value membagi "hasil" secara adil berdasarkan kontribusi rata-rata setiap pemain di semua urutan masuk. Hasilnya: prediksi = nilai dasar + Σ kontribusi fitur.'],
          ['Fitur berkorelasi', 'Jika dua fitur sangat berkorelasi (tinggi & berat), importance terbagi di antara keduanya atau berpindah-pindah, sehingga masing-masing tampak kurang penting. Kelompokkan fitur berkorelasi saat menafsirkan.'],
        ],
        mistakes: [
          ['Menafsirkan importance sebagai sebab-akibat.', 'Importance menunjukkan apa yang dipakai model; kausalitas butuh eksperimen atau analisis kausal.'],
          ['Menghitung importance di data latih.', 'Hitung di data validasi/uji agar mencerminkan generalisasi.'],
        ],
        tips: ['Library: `shap` (TreeExplainer sangat cepat untuk model tree), `sklearn.inspection`, `lime`.', 'Untuk model yang harus mudah dijelaskan secara regulasi, pertimbangkan model yang memang interpretable (regresi logistik, EBM).'],
        check: [
          ['Kenapa AUC 0,99 justru membuat curiga?', 'Untuk masalah dunia nyata yang sulit, skor hampir sempurna sering menandakan leakage; interpretasi membantu menemukan fitur yang bocor.'],
        ],
      },
    },
  ],
  'deep-learning': [
    {
      after: 'dl-regularisasi',
      id: 'dl-autoencoder',
      title: 'Autoencoder & deteksi anomali',
      summary: 'Jaringan yang belajar memampatkan data, dipakai untuk anomali dan denoising.',
      explain: [
        '**Autoencoder** terdiri dari **encoder** yang memampatkan input menjadi representasi kecil (*bottleneck/latent*), dan **decoder** yang merekonstruksi input dari representasi itu. Model dilatih agar output semirip mungkin dengan input, tanpa label.',
        'Karena bottleneck kecil, model terpaksa mempelajari pola penting dari data **normal**. Data aneh (anomali) sulit direkonstruksi sehingga **error rekonstruksinya besar**. Inilah dasar deteksi anomali tanpa label.',
        'Varian: **denoising autoencoder** (input diberi noise, target bersih), **variational autoencoder (VAE)** (latent berupa distribusi sehingga bisa membuat data baru), dan autoencoder yang menjadi bagian dari model generatif gambar modern (latent diffusion).',
      ],
      uses: [
        'Deteksi anomali: mesin rusak dari sensor, transaksi aneh, intrusi jaringan',
        'Menghilangkan noise dari gambar/audio',
        'Kompresi dan reduksi dimensi non-linear',
        'Dasar model generatif (VAE, latent diffusion)',
      ],
      algos: ['mlp', 'pca'],
      examples: [
        {
          title: 'Autoencoder dengan MLPRegressor untuk deteksi anomali sensor',
          code: py`
import numpy as np  # NumPy
from sklearn.neural_network import MLPRegressor  # neural network untuk regresi
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.metrics import roc_auc_score  # metrik AUC

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
# Data sensor mesin normal: 8 sensor yang saling berkorelasi (dikendalikan 2 faktor tersembunyi)
W = rng.normal(size=(2, 8))  # 2 faktor -> 8 sensor
def normal(n):  # buat n data normal
    # faktor tersembunyi x bobot + noise
    return rng.normal(size=(n, 2)) @ W + 0.1 * rng.normal(size=(n, 8))
latih = normal(3000)  # data latih: hanya normal
uji_normal = normal(500)  # data uji normal
uji_rusak = normal(25); uji_rusak[:, [2, 5]] += rng.normal(0, 1.5, (25, 2))   # korelasi sensor rusak

sc = StandardScaler().fit(latih)  # standarkan
# jaringan berleher sempit (2 neuron)
ae = MLPRegressor(hidden_layer_sizes=(6, 2, 6), activation="tanh", max_iter=2000, random_state=0)
ae.fit(sc.transform(latih), sc.transform(latih))            # input = target

def error_rekonstruksi(X):  # seberapa jauh hasil rekonstruksi dari aslinya
    Z = sc.transform(X)  # standarkan
    return ((ae.predict(Z) - Z) ** 2).mean(axis=1)  # error rata-rata per baris

batas = np.percentile(error_rekonstruksi(latih), 99)         # 1% data normal tertinggi sebagai batas
# error data uji
e_normal, e_rusak = error_rekonstruksi(uji_normal), error_rekonstruksi(uji_rusak)
# rata-rata error
print(f"Error rata-rata normal: {e_normal.mean():.3f} | rusak: {e_rusak.mean():.3f}")
# alarm palsu & deteksi
print(f"Alarm pada data normal: {(e_normal > batas).mean():.1%} | rusak terdeteksi: {(e_rusak > batas).mean():.0%}")
y = np.r_[np.zeros(500), np.ones(25)]  # label: 0 normal, 1 rusak
# AUC dari skor error
print(f"ROC-AUC deteksi anomali: {roc_auc_score(y, np.r_[e_normal, e_rusak]):.3f}")`,
        },
      ],
      exercise: {
        task: 'Bandingkan PCA (2 komponen) sebagai "autoencoder linear" dengan autoencoder MLP di atas: hitung error rekonstruksi PCA untuk data normal dan rusak, lalu ROC-AUC-nya.',
        hint: 'Rekonstruksi PCA: `pca.inverse_transform(pca.transform(Z))`. Gunakan data yang sudah distandarkan.',
        solution: py`
import numpy as np  # NumPy
from sklearn.decomposition import PCA  # PCA
from sklearn.preprocessing import StandardScaler  # penyeragam skala
from sklearn.metrics import roc_auc_score  # metrik AUC

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
W = rng.normal(size=(2, 8))  # data sama seperti contoh
def normal(n):  # buat data normal
    # faktor tersembunyi + noise
    return rng.normal(size=(n, 2)) @ W + 0.1 * rng.normal(size=(n, 8))
latih, uji_normal = normal(3000), normal(500)  # latih & uji normal
uji_rusak = normal(25); uji_rusak[:, [2, 5]] += rng.normal(0, 1.5, (25, 2))  # data rusak

sc = StandardScaler().fit(latih)  # standarkan
pca = PCA(2).fit(sc.transform(latih))  # PCA 2 komponen
def err(X):  # error rekonstruksi PCA
    Z = sc.transform(X)  # standarkan
    # kompres lalu kembalikan, ukur selisihnya
    return ((pca.inverse_transform(pca.transform(Z)) - Z) ** 2).mean(1)
y = np.r_[np.zeros(500), np.ones(25)]  # label
print(f"ROC-AUC PCA: {roc_auc_score(y, np.r_[err(uji_normal), err(uji_rusak)]):.3f}")  # AUC
# kesimpulan
print("Untuk data dengan hubungan linear, PCA sudah sangat baik; autoencoder unggul pada pola non-linear.")`,
      },
      steps: [
        ['Kumpulkan data normal', 'Autoencoder anomali dilatih hanya (atau sebagian besar) dengan data normal.'],
        ['Normalisasi', 'Standarkan fitur dengan statistik data latih.'],
        ['Rancang bottleneck', 'Lebih kecil dari input, tetapi cukup untuk merekonstruksi data normal.'],
        ['Latih input → input', 'Loss MSE rekonstruksi.'],
        ['Tentukan ambang', 'Persentil error pada data normal validasi (mis. 99%).'],
        ['Validasi dengan contoh anomali nyata', 'Jika ada sedikit label anomali, ukur recall dan alarm palsu.'],
      ],
      case: {
        title: 'Peringatan dini kerusakan pompa air PDAM',
        situation: 'Pompa memiliki sensor getaran, suhu, tekanan, dan arus listrik yang dicatat tiap menit. Data kerusakan sangat sedikit, tetapi data operasi normal melimpah.',
        steps: [
          'Autoencoder dilatih pada data operasi normal 3 bulan.',
          'Ambang error ditetapkan dari persentil 99,5 data normal validasi.',
          'Error rekonstruksi dipantau per jam; alarm jika melebihi ambang beberapa kali berturut-turut.',
        ],
        code: py`
import numpy as np  # NumPy
from sklearn.neural_network import MLPRegressor  # neural network
from sklearn.preprocessing import StandardScaler  # penyeragam skala

rng = np.random.default_rng(5)  # generator acak dengan seed tetap
def operasi(n, rusak=0.0):  # simulasi data operasi mesin
    beban = rng.uniform(0.3, 1.0, n)  # beban kerja
    # getaran (naik jika aus)
    getar = 2 + 3 * beban + rusak * np.linspace(0, 3, n) + rng.normal(0, 0.2, n)
    # suhu (naik jika aus)
    suhu = 40 + 20 * beban + rusak * np.linspace(0, 6, n) + rng.normal(0, 1, n)
    tekanan = 3 + 2 * beban + rng.normal(0, 0.1, n)  # tekanan
    arus = 10 + 15 * beban + rng.normal(0, 0.5, n)  # arus listrik
    return np.column_stack([getar, suhu, tekanan, arus])  # gabungkan 4 sensor

sc = StandardScaler().fit(operasi(4000))  # penyeragam skala dari data normal
latih = sc.transform(operasi(4000))  # data latih normal
# autoencoder kecil
ae = MLPRegressor(hidden_layer_sizes=(3, 1, 3), activation="tanh", max_iter=3000, random_state=0).fit(latih, latih)
# error rekonstruksi
err = lambda X: ((ae.predict(sc.transform(X)) - sc.transform(X)) ** 2).mean(1)
ambang = np.percentile(err(operasi(2000)), 99.5)  # ambang dari data normal

minggu_ini = operasi(168, rusak=1.0)               # 168 jam, bantalan mulai aus perlahan
alarm = err(minggu_ini) > ambang  # jam yang melewati ambang
# 3 jam berturut-turut di atas ambang
berturut = np.convolve(alarm, np.ones(3, int), "valid") == 3
# kapan alarm pertama
print(f"Alarm pertama (3 jam berturut-turut) pada jam ke-{np.argmax(berturut) + 2} dari 168")
# awal vs akhir minggu
print(f"Persentase jam di atas ambang: 24 jam pertama {alarm[:24].mean():.0%}, 24 jam terakhir {alarm[-24:].mean():.0%}")`,
        result: 'Kerusakan yang berkembang perlahan terdeteksi beberapa hari sebelum pompa benar-benar rusak, sehingga perawatan bisa dijadwalkan tanpa memutus layanan air mendadak.',
      },
      deep: {
        concepts: [
          ['Kenapa bottleneck penting', 'Tanpa bottleneck (latent sebesar input), autoencoder bisa belajar fungsi identitas: menyalin input apa pun termasuk anomali, sehingga error tetap kecil dan deteksi gagal.'],
          ['VAE dan ruang laten', 'VAE memaksa ruang laten mengikuti distribusi normal (lewat KL divergence), sehingga titik acak di ruang laten bisa didekode menjadi data baru yang masuk akal.'],
        ],
        mistakes: [
          ['Melatih autoencoder dengan data yang tercampur banyak anomali.', 'Model ikut belajar merekonstruksi anomali; bersihkan data latih semampunya.'],
          ['Memilih ambang tanpa memikirkan biaya alarm palsu.', 'Diskusikan dengan operator: berapa alarm palsu per minggu yang masih bisa diterima?'],
        ],
        tips: ['Untuk data tabel sederhana, bandingkan juga dengan Isolation Forest dan PCA sebagai baseline anomali.', 'Untuk gambar, pakai autoencoder konvolusi (Conv2d + ConvTranspose2d).'],
        check: [
          ['Kenapa error rekonstruksi bisa dipakai sebagai skor anomali?', 'Autoencoder hanya belajar pola data normal; data yang menyimpang dari pola itu tidak bisa direkonstruksi dengan baik sehingga error-nya besar.'],
        ],
      },
    },
  ],

  // ---------------- Ahli ----------------
  llm: [
    {
      after: 'llm-cara-kerja',
      id: 'llm-sampling',
      title: 'Strategi sampling: temperature, top-k, top-p',
      summary: 'Bagaimana LLM memilih token berikutnya dan cara mengatur kreativitasnya.',
      explain: [
        'Di setiap langkah, LLM menghasilkan **logits** untuk setiap token di kosakatanya. Logits diubah menjadi peluang dengan softmax, lalu satu token dipilih. Cara memilih inilah yang disebut **decoding** atau **sampling**.',
        '**Greedy** selalu memilih token berpeluang tertinggi (deterministik, tetapi bisa repetitif). **Temperature** membagi logits sebelum softmax: T < 1 membuat distribusi lebih tajam (fokus), T > 1 lebih rata (kreatif, berisiko ngawur).',
        '**Top-k** hanya mengambil k token teratas. **Top-p (nucleus)** mengambil token teratas sampai total peluangnya mencapai p (mis. 0,9), sehingga jumlah kandidat menyesuaikan tingkat keyakinan model. Ada juga *repetition penalty* untuk mengurangi pengulangan.',
        '**Catatan terbaru (Oktober 2026):** di Claude API versi `2026-10-21`, parameter `temperature`, `top_p`, dan `top_k` **sudah dihapus**: request yang mengirimnya akan ditolak (error 400). Konsistensi jawaban diatur lewat prompt yang jelas, **structured output** (format JSON yang dipaksa sesuai skema), dan **effort** (seberapa dalam model berpikir). Konsep sampling tetap penting untuk memahami cara LLM memilih kata, dan pengaturannya masih bisa dipakai saat menjalankan model open-source sendiri (mis. `generate()` di Hugging Face, Ollama, atau vLLM).',
      ],
      uses: [
        'Temperature rendah untuk ekstraksi data, klasifikasi, kode, jawaban faktual',
        'Temperature lebih tinggi untuk brainstorming, menulis cerita, variasi copywriting',
        'Membuat beberapa kandidat jawaban lalu memilih yang terbaik (best-of-n)',
      ],
      examples: [
        {
          title: 'Efek temperature, top-k, dan top-p pada distribusi token',
          code: py`
import numpy as np  # NumPy

# kandidat token berikutnya
token = ["kopi", "teh", "susu", "jus", "air", "sirup", "es", "bir"]
logits = np.array([3.2, 2.9, 1.8, 1.2, 1.0, 0.3, 0.1, -1.5])   # "Pagi ini saya minum ..."

def softmax(z):  # softmax stabil
    e = np.exp(z - z.max()); return e / e.sum()  # ubah logit menjadi peluang

def tampil(nama, p):  # cetak peluang yang > 0.5%
    # token:peluang
    print(f"{nama:22s}", " ".join(f"{t}:{x:.2f}" for t, x in zip(token, p) if x > 0.005))

for T in [0.3, 1.0, 2.0]:  # coba 3 temperature
    tampil(f"temperature={T}", softmax(logits / T))  # logit dibagi T sebelum softmax

def top_k(logits, k):  # top-k: hanya k token terbaik yang boleh dipilih
    # token lain diberi -inf
    z = np.full_like(logits, -np.inf); i = np.argsort(-logits)[:k]; z[i] = logits[i]; return softmax(z)

def top_p(logits, p):  # top-p: token terbaik sampai total peluang p
    prob = softmax(logits); urut = np.argsort(-prob)  # urutkan peluang
    kumulatif = np.cumsum(prob[urut])  # jumlah kumulatif
    simpan = urut[: np.searchsorted(kumulatif, p) + 1]  # ambil sampai melewati p
    # normalisasi ulang
    hasil = np.zeros_like(prob); hasil[simpan] = prob[simpan]; return hasil / hasil.sum()

tampil("top-k=3", top_k(logits, 3))  # hasil top-k
tampil("top-p=0.9", top_p(logits, 0.9))  # hasil top-p

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
for T in [0.3, 1.5]:  # T rendah vs tinggi
    pilihan = rng.choice(token, size=12, p=softmax(logits / T))  # ambil 12 sampel
    print(f"\n12 sampel T={T}: {' '.join(pilihan)}")  # T tinggi = lebih beragam`,
        },
      ],
      exercise: {
        task: 'Hitung entropi distribusi token di atas untuk temperature 0.2, 1, dan 3. Apa hubungan temperature dengan entropi (keragaman)?',
        hint: 'Entropi = −Σ p log p dari `softmax(logits / T)`.',
        solution: py`
import numpy as np  # NumPy

logits = np.array([3.2, 2.9, 1.8, 1.2, 1.0, 0.3, 0.1, -1.5])  # logit kandidat token
for T in [0.2, 1, 3]:  # coba 3 temperature
    z = logits / T; p = np.exp(z - z.max()); p /= p.sum()  # softmax dengan temperature
    # entropi = seberapa acak pilihannya
    print(f"T={T}: entropi={-(p * np.log(p)).sum():.3f} nats")
# kesimpulan
print("Makin tinggi temperature, makin tinggi entropi -> pilihan token makin beragam.")`,
      },
      steps: [
        ['Tentukan sifat tugas', 'Butuh jawaban tepat & konsisten, atau variasi kreatif?'],
        ['Pilih cara mengatur keragaman', 'Di model open-source: temperature 0–0,3 untuk tugas faktual, 0,7–1 untuk kreatif. Di Claude API terbaru: pakai structured output untuk hasil yang pasti, dan minta beberapa variasi di dalam prompt untuk hasil kreatif.'],
        ['Ubah satu hal saja', 'Ubah prompt, format output, atau satu parameter sampling (jika didukung) satu per satu agar tahu mana yang berpengaruh.'],
        ['Uji beberapa kali', 'Jalankan prompt yang sama 5–10 kali untuk melihat variasinya.'],
        ['Validasi output', 'Temperature rendah tidak menjamin benar; tetap periksa.'],
      ],
      case: {
        title: 'Memilih pengaturan untuk dua fitur di aplikasi yang sama',
        situation: 'Aplikasi UMKM punya dua fitur LLM: (1) ekstraksi data pesanan dari chat WhatsApp ke JSON, dan (2) pembuat 5 variasi caption Instagram. Tim bingung kenapa satu pengaturan tidak cocok untuk keduanya.',
        steps: [
          'Fitur ekstraksi: structured output (skema JSON) agar hasilnya stabil dan bisa diuji otomatis. Di model yang masih mendukung sampling, ditambah temperature 0.',
          'Fitur caption: minta 5 variasi yang berbeda gaya sekaligus di dalam prompt (di model open-source, bisa ditambah temperature ~0,9).',
          'Keduanya dievaluasi dengan cara berbeda: ekstraksi dengan akurasi field, caption dengan keragaman dan penilaian manusia.',
        ],
        code: py`
import numpy as np  # NumPy

rng = np.random.default_rng(1)  # generator acak dengan seed tetap
pembuka = ["Pagi", "Halo", "Sahabat", "Kabar", "Yuk", "Siapa"]  # kata pembuka kandidat
logits = np.array([2.0, 1.7, 1.2, 0.8, 0.9, 0.4])  # logit setiap kata

def sampel(T, n):  # ambil n sampel dengan temperature T
    if T == 0:  # T = 0
        return [pembuka[int(np.argmax(logits))]] * n          # greedy
    z = logits / T; p = np.exp(z - z.max()); p /= p.sum()  # softmax dengan temperature
    return [str(x) for x in rng.choice(pembuka, size=n, p=p)]  # pilih acak sesuai peluang

# tugas ekstraksi vs tugas kreatif
for nama, T in [("Ekstraksi (T=0)", 0), ("Caption (T=0.9)", 0.9)]:
    hasil = sampel(T, 5)  # 5 sampel
    print(f"{nama:16s}: {hasil} -> {len(set(hasil))} variasi unik")  # jumlah variasi unik`,
        result: 'Ekstraksi menjadi konsisten dan mudah dites, sedangkan caption bervariasi sehingga pengguna punya pilihan. Pengaturan sampling dipilih per fitur, bukan satu untuk semua.',
      },
      deep: {
        concepts: [
          ['Temperature 0 tidak selalu 100% deterministik', 'Perbedaan kecil pada hardware/batching bisa mengubah logits yang hampir seri, sehingga output kadang tetap sedikit berbeda. Jangan bergantung pada output identik; validasi dengan aturan.'],
          ['Beam search', 'Menyimpan beberapa urutan kandidat terbaik sekaligus; populer untuk terjemahan mesin, tetapi untuk chat cenderung menghasilkan teks datar dan repetitif.'],
        ],
        mistakes: [
          ['Menaikkan temperature untuk "membuat model lebih pintar".', 'Temperature hanya mengatur keragaman; kualitas penalaran tidak naik.'],
          ['Memakai temperature tinggi untuk output JSON.', 'Risiko format rusak naik; pakai temperature rendah + structured output.'],
        ],
        tips: ['Selalu cek dokumentasi penyedia: Claude API versi `2026-10-21` menolak `temperature`/`top_p`/`top_k`, sedangkan library open-source seperti Hugging Face masih memakainya.', 'Untuk hasil yang harus konsisten, andalkan structured output dan validasi, bukan pengaturan sampling.'],
        check: [
          ['Apa beda top-k dan top-p?', 'Top-k selalu mengambil k token teratas; top-p mengambil token teratas sampai peluang kumulatifnya mencapai p, sehingga jumlah kandidat menyesuaikan seberapa yakin model.'],
        ],
      },
    },
  ],
  'nlp-cv': [
    {
      after: 'cv-segmentasi',
      id: 'cv-generatif',
      title: 'Model generatif gambar: GAN & diffusion',
      summary: 'Cara AI membuat gambar baru, dari GAN sampai Stable Diffusion.',
      explain: [
        '**GAN** (Generative Adversarial Network) melatih dua jaringan yang bersaing: **generator** membuat gambar palsu dari noise, **discriminator** menebak asli atau palsu. Keduanya saling memperbaiki sampai gambar palsu sulit dibedakan. Hasilnya tajam, tetapi training sering tidak stabil.',
        '**Diffusion model** belajar membalik proses perusakan: gambar asli diberi noise sedikit demi sedikit sampai menjadi noise murni, lalu jaringan (biasanya U-Net atau Transformer) dilatih memprediksi noise yang ditambahkan. Saat membuat gambar, model mulai dari noise acak dan membersihkannya bertahap.',
        '**Text-to-image** (Stable Diffusion, DALL·E, Imagen) mengarahkan proses denoising dengan embedding teks (mis. dari CLIP). **Latent diffusion** melakukan proses ini di ruang laten autoencoder yang kecil agar jauh lebih hemat komputasi.',
      ],
      uses: [
        'Membuat ilustrasi, desain produk, dan materi pemasaran',
        'Augmentasi data sintetis saat data asli langka',
        'Image editing: inpainting (mengisi bagian gambar), upscaling, perubahan gaya',
        'Riset medis dan sains: membuat data sintetis yang menjaga privasi',
      ],
      examples: [
        {
          title: 'Proses forward diffusion: dari sinyal menjadi noise',
          code: py`
import numpy as np  # NumPy
import matplotlib.pyplot as plt  # grafik

# "Gambar" 2D sederhana: titik-titik membentuk lingkaran
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
sudut = rng.uniform(0, 2 * np.pi, 600)  # 600 sudut acak
x0 = np.column_stack([np.cos(sudut), np.sin(sudut)])  # titik-titik di lingkaran

T = 100  # jumlah langkah noise
beta = np.linspace(1e-4, 0.05, T)                    # jadwal noise
alpha_bar = np.cumprod(1 - beta)  # sisa sinyal di setiap langkah

def tambah_noise(x0, t):  # tambahkan noise langsung ke langkah t
    eps = rng.normal(size=x0.shape)  # noise acak
    # campuran sinyal & noise
    return np.sqrt(alpha_bar[t]) * x0 + np.sqrt(1 - alpha_bar[t]) * eps, eps

fig, ax = plt.subplots(1, 4, figsize=(12, 3))  # 4 grafik berjejer
for a, t in zip(ax, [0, 15, 40, 99]):  # 4 langkah berbeda
    xt, _ = tambah_noise(x0, t)  # beri noise
    # gambar titik & judul
    a.scatter(xt[:, 0], xt[:, 1], s=3); a.set_title(f"t={t}, sinyal={np.sqrt(alpha_bar[t]):.2f}")
    a.set_xlim(-3, 3); a.set_ylim(-3, 3); a.set_aspect("equal")  # batas sumbu
# judul besar
fig.suptitle("Forward diffusion: model belajar membalik proses ini (noise -> data)")
plt.tight_layout(); plt.show()  # rapikan & tampilkan

# Inti training: diberi x_t dan t, tebak noise eps. Contoh target untuk satu batch:
xt, eps = tambah_noise(x0[:4], 40)  # 4 titik pada langkah 40
print("x_t (input model):\n", xt.round(2))  # input model
print("eps (target yang harus ditebak model):\n", eps.round(2))  # target model`,
        },
        {
          title: 'Membuat gambar dengan Stable Diffusion (Colab GPU)',
          runnable: false,
          code: py`
# pip install diffusers transformers accelerate
import torch  # PyTorch
from diffusers import AutoPipelineForText2Image  # pipeline teks ke gambar

pipe = AutoPipelineForText2Image.from_pretrained(  # muat model SDXL-Turbo
    # presisi fp16 di GPU
    "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16").to("cuda")

# deskripsi gambar
prompt = "ilustrasi flat design warung kopi tradisional Indonesia, warna hangat, pagi hari"
# buat gambar dalam 2 langkah
gambar = pipe(prompt=prompt, num_inference_steps=2, guidance_scale=0.0,
              # seed agar hasil bisa diulang
              generator=torch.Generator("cuda").manual_seed(42)).images[0]
gambar.save("warung_kopi.png")  # simpan`,
        },
      ],
      exercise: {
        task: 'Dengan jadwal `beta = np.linspace(1e-4, 0.02, 1000)`, cari langkah t pertama ketika proporsi sinyal `sqrt(alpha_bar[t])` turun di bawah 0,5 dan di bawah 0,1.',
        hint: '`alpha_bar = np.cumprod(1 - beta)`, lalu `np.argmax(np.sqrt(alpha_bar) < 0.5)`.',
        solution: py`
import numpy as np  # NumPy

beta = np.linspace(1e-4, 0.02, 1000)  # jadwal noise 1000 langkah
sinyal = np.sqrt(np.cumprod(1 - beta))  # sisa sinyal di setiap langkah
# langkah pertama sinyal < 0.5
print("Sinyal < 0.5 mulai t =", int(np.argmax(sinyal < 0.5)))
# langkah pertama sinyal < 0.1
print("Sinyal < 0.1 mulai t =", int(np.argmax(sinyal < 0.1)))
print("Sinyal di t=999:", round(float(sinyal[-1]), 4))  # hampir semuanya noise`,
      },
      steps: [
        ['Pahami tujuan', 'Membuat gambar baru, mengedit, atau data sintetis?'],
        ['Pilih model & lisensi', 'Cek lisensi penggunaan komersial dan kebijakan konten.'],
        ['Tulis prompt deskriptif', 'Subjek, gaya, komposisi, pencahayaan, warna.'],
        ['Atur parameter', 'Jumlah langkah, guidance scale, seed untuk hasil yang bisa diulang.'],
        ['Kurasi & edit', 'Pilih hasil terbaik, perbaiki dengan inpainting.'],
        ['Tandai sebagai buatan AI', 'Transparan kepada audiens.'],
      ],
      case: {
        title: 'Data sintetis untuk melatih deteksi cacat produk',
        situation: 'Pabrik keramik hanya punya 40 foto cacat retak, sementara foto produk normal ribuan. Tim ingin menambah variasi contoh cacat untuk melatih model klasifikasi.',
        steps: [
          'Model diffusion di-fine-tune ringan (LoRA) pada foto cacat yang ada.',
          'Dibuat ratusan variasi cacat sintetis, lalu dikurasi manual oleh QC.',
          'Model klasifikasi dilatih dengan data asli + sintetis, dan dievaluasi HANYA pada foto asli.',
        ],
        code: py`
import numpy as np  # NumPy
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.metrics import recall_score  # metrik recall

# Simulasi: fitur gambar 2D, cacat = cluster kecil. "Generator" = sampel dari distribusi cacat yang dipelajari.
rng = np.random.default_rng(0)  # generator acak dengan seed tetap
normal = rng.normal([0, 0], 1.0, (2000, 2))  # 2000 contoh normal
cacat_asli = rng.normal([2.2, 2.2], 0.6, (40, 2))  # hanya 40 contoh cacat
# data uji asli
uji = np.r_[rng.normal([0, 0], 1.0, (500, 2)), rng.normal([2.2, 2.2], 0.6, (50, 2))]
y_uji = np.r_[np.zeros(500), np.ones(50)]  # label uji

mu, cov = cacat_asli.mean(0), np.cov(cacat_asli.T)  # pelajari pusat & sebaran data cacat
sintetis = rng.multivariate_normal(mu, cov, 400)            # pengganti model generatif

# tanpa & dengan data sintetis
for nama, cacat in [("hanya 40 asli", cacat_asli), ("40 asli + 400 sintetis", np.r_[cacat_asli, sintetis])]:
    # gabungkan data latih
    X = np.r_[normal, cacat]; y = np.r_[np.zeros(len(normal)), np.ones(len(cacat))]
    m = LogisticRegression().fit(X, y)  # latih
    # recall dinilai di data ASLI
    print(f"{nama:24s}: recall cacat di data uji ASLI = {recall_score(y_uji, m.predict(uji)):.2f}")`,
        result: 'Data sintetis menaikkan recall cacat di data uji asli. Kuncinya: evaluasi tetap memakai data asli, dan data sintetis dikurasi agar realistis.',
      },
      deep: {
        concepts: [
          ['Classifier-free guidance', 'Model diffusion dilatih dengan dan tanpa teks. Saat generasi, prediksi dengan teks "didorong" menjauh dari prediksi tanpa teks sebesar guidance scale. Scale tinggi = lebih patuh pada prompt tetapi variasi berkurang.'],
          ['Etika & hukum', 'Isu hak cipta data latih, deepfake, persetujuan orang yang wajahnya dipakai, dan bias representasi. Gunakan watermark/label konten AI dan patuhi kebijakan platform.'],
        ],
        mistakes: [
          ['Mengevaluasi model yang dilatih data sintetis dengan data sintetis juga.', 'Selalu evaluasi pada data asli.'],
          ['Memakai model tanpa mengecek lisensinya untuk produk komersial.', 'Baca lisensi model (mis. OpenRAIL, lisensi komersial).'],
        ],
        tips: ['Library: Hugging Face `diffusers`; antarmuka populer: ComfyUI, Automatic1111.', 'Simpan seed + prompt + parameter agar gambar bisa dibuat ulang.'],
        check: [
          ['Apa yang dipelajari jaringan pada diffusion model saat training?', 'Memprediksi noise yang ditambahkan pada gambar di langkah t, sehingga saat generasi noise bisa dikurangi bertahap dari noise murni menjadi gambar.'],
        ],
      },
    },
  ],

  // ---------------- Profesional ----------------
  deploy: [
    {
      after: 'dep-api',
      id: 'dep-optimasi',
      title: 'Optimasi model untuk produksi',
      summary: 'Membuat model lebih cepat, kecil, dan murah: kuantisasi, distilasi, batching, cache.',
      explain: [
        'Di produksi, yang penting bukan hanya akurasi tetapi juga **latensi** (berapa lama satu prediksi), **throughput** (berapa prediksi per detik), **ukuran** model, dan **biaya** server.',
        '**Kuantisasi** menyimpan bobot dengan presisi lebih rendah (float32 → int8 atau 4-bit) sehingga model 4–8× lebih kecil dan lebih cepat, dengan penurunan akurasi kecil. **Distilasi** melatih model kecil (student) untuk meniru model besar (teacher). **Pruning** membuang bobot yang hampir tidak berpengaruh.',
        'Di level sistem: **batching** (memproses banyak request sekaligus), **caching** (menyimpan hasil untuk input yang sama), runtime teroptimasi (**ONNX Runtime**, TensorRT, vLLM untuk LLM), dan memilih model sekecil mungkin yang masih memenuhi target kualitas.',
      ],
      uses: [
        'Menjalankan model di HP atau perangkat edge (kamera, IoT)',
        'Menurunkan biaya server/GPU untuk trafik tinggi',
        'Menjalankan LLM 7–8B di GPU konsumen dengan kuantisasi 4-bit',
        'Memenuhi target latensi aplikasi real-time (< 100 ms)',
      ],
      examples: [
        {
          title: 'Kuantisasi int8 manual, batching, dan cache',
          code: py`
import time, functools  # waktu & cache
import numpy as np  # NumPy

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
W = rng.normal(0, 0.05, (512, 512)).astype(np.float32)          # bobot satu layer

# Kuantisasi simetris per-tensor ke int8
skala = np.abs(W).max() / 127  # skala: nilai terbesar menjadi 127
W_int8 = np.round(W / skala).astype(np.int8)  # ubah ke bilangan bulat 8-bit
W_kembali = W_int8.astype(np.float32) * skala  # kembalikan ke desimal
x = rng.normal(size=(64, 512)).astype(np.float32)  # input contoh
# seberapa berubah outputnya
err = np.abs(x @ W - x @ W_kembali).mean() / np.abs(x @ W).mean()
# ukuran 4x lebih kecil, error kecil
print(f"Ukuran float32: {W.nbytes / 1024:.0f} KB | int8: {W_int8.nbytes / 1024:.0f} KB | error relatif output: {err:.2%}")

# Batching: 1.000 prediksi satu per satu vs sekaligus
data = rng.normal(size=(1000, 512)).astype(np.float32)  # 1000 data
# satu per satu
t = time.perf_counter(); _ = [d @ W for d in data]; satu = time.perf_counter() - t
t = time.perf_counter(); _ = data @ W; batch = time.perf_counter() - t  # sekaligus
# bandingkan
print(f"Satu per satu: {satu * 1000:.1f} ms | batch: {batch * 1000:.1f} ms ({satu / batch:.0f}x lebih cepat)")

# Cache untuk input yang sering berulang (mis. pertanyaan FAQ yang sama)
@functools.lru_cache(maxsize=1024)
def prediksi_mahal(teks):  # fungsi lambat
    time.sleep(0.01)                                           # anggap model butuh 10 ms
    return len(teks) % 3  # hasil tiruan
# 100 permintaan yang banyak berulang
permintaan = ["cara reset password", "jam buka", "cara reset password", "ongkir", "jam buka"] * 20
t = time.perf_counter(); [prediksi_mahal(p) for p in permintaan]  # jalankan semuanya
# cache membuat permintaan berulang instan
print(f"100 request dengan cache: {(time.perf_counter() - t) * 1000:.0f} ms | info cache: {prediksi_mahal.cache_info()}")`,
        },
        {
          title: 'Ekspor scikit-learn/PyTorch ke ONNX (komputer sendiri)',
          runnable: false,
          code: py`
# pip install skl2onnx onnxruntime
from skl2onnx import to_onnx  # pengubah ke format ONNX
import onnxruntime as ort  # runtime ONNX
import numpy as np  # NumPy

onx = to_onnx(pipe, X_train[:1].astype(np.float32))       # pipe = Pipeline scikit-learn yang sudah di-fit
with open("model.onnx", "wb") as f:  # simpan file model
    f.write(onx.SerializeToString())  # tulis isinya

sesi = ort.InferenceSession("model.onnx")  # muat model ONNX
nama_input = sesi.get_inputs()[0].name  # nama input model
pred = sesi.run(None, {nama_input: X_test.astype(np.float32)})[0]  # prediksi

# PyTorch:
# torch.onnx.export(model, contoh_input, "model.onnx", dynamic_axes={"input": {0: "batch"}})
# Kuantisasi dinamis PyTorch (CPU):
# model_q = torch.ao.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)`,
        },
      ],
      exercise: {
        task: 'Kuantisasi bobot acak (1000 nilai, normal std 0.1) ke 4-bit (nilai bulat −7 sampai 7) dan 8-bit (−127 sampai 127). Bandingkan rata-rata error absolut keduanya.',
        hint: 'skala = max(|W|) / batas; `np.round(W / skala).clip(-batas, batas) * skala`.',
        solution: py`
import numpy as np  # NumPy

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
W = rng.normal(0, 0.1, 1000)  # 1000 bobot
for bit, batas in [(8, 127), (4, 7)]:  # kuantisasi 8-bit & 4-bit
    skala = np.abs(W).max() / batas  # skala
    Wq = np.round(W / skala).clip(-batas, batas) * skala  # bulatkan, batasi, kembalikan
    # makin sedikit bit, makin besar error
    print(f"{bit}-bit: error rata-rata {np.abs(W - Wq).mean():.5f} | ukuran {1000 * bit // 8} byte (float32: 4000 byte)")`,
      },
      steps: [
        ['Ukur dulu', 'Latensi p50/p95, throughput, memori, biaya per 1.000 prediksi.'],
        ['Tetapkan target', 'Mis. p95 < 200 ms dengan 50 request/detik.'],
        ['Optimasi termurah dulu', 'Batching, cache, model lebih kecil, matikan perhitungan yang tidak perlu.'],
        ['Runtime teroptimasi', 'ONNX Runtime/TensorRT/vLLM.'],
        ['Kuantisasi / distilasi', 'Cek ulang akurasi di data uji setelah optimasi.'],
        ['Uji beban', 'Simulasikan trafik nyata (locust, k6) sebelum rilis.'],
      ],
      case: {
        title: 'Menurunkan biaya API klasifikasi tiket helpdesk',
        situation: 'Helpdesk memakai model besar untuk mengklasifikasikan 50.000 tiket per hari ke 12 kategori. Biayanya mahal dan latensinya 2 detik.',
        steps: [
          'Model besar dipakai sebagai teacher untuk memberi label 20.000 tiket lama.',
          'Model kecil (TF-IDF + regresi logistik) dilatih meniru label tersebut (distilasi).',
          'Tiket yang model kecil tidak yakin (< 0,6) tetap dikirim ke model besar.',
        ],
        code: py`
import numpy as np  # NumPy
from sklearn.datasets import make_classification  # pembuat data
from sklearn.linear_model import LogisticRegression  # regresi logistik (student)
from sklearn.model_selection import train_test_split  # membagi data

# data tiket 4 kategori
X, y_asli = make_classification(n_samples=30000, n_features=30, n_informative=12, n_classes=4,
                                n_clusters_per_class=1, class_sep=1.5, random_state=0)
# 10 ribu untuk uji
X_tr, X_te, y_tr, y_te = train_test_split(X, y_asli, test_size=10000, random_state=0)

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
label_teacher = np.where(rng.random(len(y_tr)) < 0.95, y_tr, rng.integers(0, 4, len(y_tr)))   # teacher 95% benar
# student belajar dari label teacher
student = LogisticRegression(max_iter=2000).fit(X_tr, label_teacher)

p = student.predict_proba(X_te)  # peluang tebakan student
yakin = p.max(1) >= 0.6  # student yakin jika peluang >= 0.6
pred = np.where(yakin, p.argmax(1), y_te)          # tidak yakin -> diteruskan ke teacher (anggap benar)
print(f"Ditangani model kecil: {yakin.mean():.0%} tiket")  # porsi yang ditangani student
# akurasi student vs sistem gabungan
print(f"Akurasi student saja: {(p.argmax(1) == y_te).mean():.3f} | sistem gabungan: {(pred == y_te).mean():.3f}")
print(f"Perkiraan penghematan biaya API: ~{yakin.mean():.0%}")  # penghematan`,
        result: 'Sebagian besar tiket ditangani model kecil yang hampir gratis dan cepat, sedangkan kasus sulit tetap ke model besar. Biaya turun drastis dengan akurasi sistem tetap tinggi.',
      },
      deep: {
        concepts: [
          ['Latensi p50 vs p95/p99', 'Rata-rata menyembunyikan request yang lambat. Pengguna merasakan ekor distribusi (p95, p99), jadi target latensi sebaiknya dinyatakan dalam persentil.'],
          ['Kuantisasi LLM', 'Format seperti GPTQ, AWQ, dan GGUF (llama.cpp) memungkinkan LLM 4-bit berjalan di laptop/GPU konsumen. Penurunan kualitas biasanya kecil pada 8-bit dan masih wajar pada 4-bit untuk banyak tugas.'],
        ],
        mistakes: [
          ['Mengoptimasi tanpa mengukur.', 'Profil dulu untuk menemukan bottleneck sebenarnya (sering di preprocessing atau I/O, bukan model).'],
          ['Kuantisasi lalu langsung rilis.', 'Evaluasi ulang akurasi; beberapa layer sensitif perlu tetap presisi tinggi.'],
        ],
        tips: ['Pola "cascade": model kecil dulu, eskalasi ke model besar hanya jika tidak yakin.', 'Untuk LLM, prompt caching dan memangkas konteks sering menghemat lebih banyak daripada mengganti hardware.'],
        check: [
          ['Kenapa batching mempercepat throughput?', 'Perkalian matriks untuk banyak input sekaligus memanfaatkan paralelisme CPU/GPU dan mengurangi overhead per panggilan.'],
        ],
      },
    },
  ],
  karier: [
    {
      after: 'kar-paper',
      id: 'kar-etika',
      title: 'Etika AI, bias & privasi',
      summary: 'Membangun AI yang adil, aman, dan menghormati privasi pengguna.',
      explain: [
        'Model belajar dari data historis, sehingga bisa mewarisi **bias** di dalamnya: model rekrutmen yang belajar dari keputusan masa lalu bisa merugikan kelompok tertentu walaupun kolom "gender" sudah dihapus, karena ada fitur pengganti (proxy) seperti nama sekolah atau hobi.',
        '**Fairness** diukur dengan membandingkan performa dan keputusan antar kelompok: tingkat persetujuan, recall, dan tingkat kesalahan per kelompok. Tidak ada satu definisi adil yang memuaskan semua; pilih sesuai konteks dan dampaknya.',
        '**Privasi**: kumpulkan data seminimal mungkin, anonimkan/pseudonimkan, batasi akses, dan patuhi regulasi. Di Indonesia ada **UU Pelindungan Data Pribadi (UU PDP No. 27/2022)**; di Eropa ada GDPR dan EU AI Act. Transparansi: beri tahu pengguna saat mereka berinteraksi dengan AI dan bagaimana keputusan dibuat.',
      ],
      uses: [
        'Audit fairness sebelum model kredit/rekrutmen dipakai',
        'Menyusun model card: tujuan, data, batasan, risiko',
        'Desain sistem yang patuh UU PDP (persetujuan, hak hapus data)',
        'Menjawab pertanyaan etika yang sering muncul di interview',
      ],
      examples: [
        {
          title: 'Audit fairness sederhana per kelompok',
          code: py`
import numpy as np  # NumPy
import pandas as pd  # Pandas
from sklearn.linear_model import LogisticRegression  # regresi logistik
from sklearn.model_selection import train_test_split  # membagi data

rng = np.random.default_rng(0)  # generator acak dengan seed tetap
n = 6000  # 6000 pelamar
kelompok = rng.choice(["A", "B"], n, p=[0.7, 0.3])  # kelompok A & B
kemampuan = rng.normal(0, 1, n)                                  # sama di kedua kelompok
# Data historis bias: kelompok B lebih jarang diterima pada kemampuan yang sama
diterima = (kemampuan + np.where(kelompok == "B", -0.8, 0) + rng.normal(0, 0.5, n) > 0.3).astype(int)
# Fitur proxy yang berkorelasi dengan kelompok (mis. asal kampus)
# 1 untuk sebagian besar kelompok B
proxy = np.where(kelompok == "B", 1, 0) * (rng.random(n) < 0.8)
X = np.column_stack([kemampuan + rng.normal(0, 0.3, n), proxy])   # kolom kelompok TIDAK dipakai

X_tr, X_te, y_tr, y_te, g_tr, g_te, k_tr, k_te = train_test_split(X, diterima, kelompok, kemampuan, test_size=0.4, random_state=0)
pred = LogisticRegression().fit(X_tr, y_tr).predict(X_te)  # latih & prediksi

layak = k_te > 0.3                                               # benar-benar layak berdasarkan kemampuan
df = pd.DataFrame({"kelompok": g_te, "pred": pred, "layak": layak})  # tabel hasil
ringkas = df.groupby("kelompok").apply(lambda d: pd.Series({  # ringkasan per kelompok
    "tingkat_diterima": d.pred.mean(),  # persentase diterima
    "recall_orang_layak": d[d.layak].pred.mean(),  # dari yang layak, berapa yang diterima
}), include_groups=False).round(3)
print(ringkas)  # tampilkan
r = ringkas.tingkat_diterima  # tingkat diterima
print(f"\nRasio tingkat diterima B/A: {r['B'] / r['A']:.2f} (aturan praktis 4/5: < 0.80 = indikasi disparitas)")
# kesimpulan
print("Model mewarisi bias historis lewat fitur proxy, walau kolom kelompok tidak dipakai.")`,
        },
      ],
      exercise: {
        task: 'Pseudonimkan kolom NIK dan email pada data pelanggan dengan hash SHA-256 + salt rahasia, sisakan hanya domain email, dan buang nomor HP, sehingga data aman dipakai untuk analisis.',
        hint: '`hashlib.sha256((SALT + nilai).encode()).hexdigest()[:12]`; domain email dengan `str.split("@").str[1]`.',
        solution: py`
import hashlib  # untuk hash
import pandas as pd  # Pandas

SALT = "ganti-dengan-rahasia-di-env"  # salt rahasia (simpan di environment variable)
df = pd.DataFrame({"nik": ["3273010101900001", "3171020202850002"],  # data pribadi contoh
                   "email": ["ani@gmail.com", "budi@kantor.co.id"],
                   "hp": ["08123456789", "08987654321"],
                   "total_belanja": [1_250_000, 890_000]})
anon = pd.DataFrame({  # data hasil anonimisasi
    # NIK diganti hash yang tidak bisa dibalik
    "id_pelanggan": df.nik.map(lambda x: hashlib.sha256((SALT + x).encode()).hexdigest()[:12]),
    "domain_email": df.email.str.split("@").str[1],  # simpan domain email saja
    "total_belanja": df.total_belanja,  # data non-pribadi tetap
})
print(anon)  # tampilkan`,
      },
      steps: [
        ['Identifikasi pemangku kepentingan', 'Siapa yang terdampak keputusan model, terutama kelompok rentan?'],
        ['Audit data', 'Representasi kelompok, label historis yang bias, fitur proxy.'],
        ['Ukur fairness per kelompok', 'Tingkat keputusan, recall, dan error per kelompok.'],
        ['Mitigasi', 'Perbaiki data, hapus/kurangi proxy, threshold per konteks, review manusia.'],
        ['Lindungi privasi', 'Minimalkan data, pseudonimkan, batasi akses, patuhi UU PDP.'],
        ['Dokumentasikan & pantau', 'Model card, jalur keberatan pengguna, audit berkala.'],
      ],
      case: {
        title: 'Audit model penyaringan CV sebelum dipakai HR',
        situation: 'Perusahaan ingin memakai model untuk menyaring ribuan lamaran. Tim data diminta memastikan model tidak merugikan pelamar dari daerah tertentu.',
        steps: [
          'Data lamaran historis dianalisis: kelulusan seleksi per daerah asal.',
          'Ditemukan fitur "nama kampus" menjadi proxy daerah asal.',
          'Model dilatih ulang tanpa fitur proxy, ditambah fitur keterampilan yang terukur, lalu diaudit ulang.',
          'Keputusan akhir tetap oleh manusia; model hanya membantu mengurutkan.',
        ],
        code: py`
import numpy as np  # NumPy
from sklearn.linear_model import LogisticRegression  # regresi logistik

rng = np.random.default_rng(2)  # generator acak dengan seed tetap
n = 5000  # 5000 pelamar
daerah_luar_jawa = rng.random(n) < 0.35  # 35% dari luar Jawa
skill = rng.normal(0, 1, n)  # kemampuan (sama di kedua daerah)
# peluang kampus top lebih kecil di luar Jawa
kampus_top = (rng.random(n) < np.where(daerah_luar_jawa, 0.15, 0.5)).astype(int)
lolos_historis = (skill + 0.9 * kampus_top + rng.normal(0, 0.6, n) > 0.8).astype(int)   # bias ke kampus top

# dengan & tanpa fitur kampus
for nama, X in [("dengan fitur kampus", np.column_stack([skill, kampus_top])), ("tanpa fitur kampus", skill.reshape(-1, 1))]:
    pred = LogisticRegression().fit(X, lolos_historis).predict(X)  # latih & prediksi
    # tingkat lolos per daerah
    a, b = pred[~daerah_luar_jawa].mean(), pred[daerah_luar_jawa].mean()
    # rasio mendekati 1 = lebih adil
    print(f"{nama:20s}: lolos Jawa={a:.2f}, luar Jawa={b:.2f}, rasio={b / a:.2f}")`,
        result: 'Rasio kelolosan antar daerah membaik setelah fitur proxy dihapus, dan proses dilengkapi review manusia serta audit berkala. Temuan ini didokumentasikan dalam model card.',
      },
      deep: {
        concepts: [
          ['Definisi fairness yang saling bertentangan', '**Demographic parity** (tingkat diterima sama), **equal opportunity** (recall sama untuk orang yang layak), dan **calibration** (skor berarti sama di semua kelompok) secara matematis tidak bisa dipenuhi bersamaan jika tingkat dasar antar kelompok berbeda. Pilihan definisi adalah keputusan nilai, bukan sekadar teknis.'],
          ['Pseudonimisasi ≠ anonimisasi', 'Hash NIK masih bisa dihubungkan kembali oleh pemilik salt dan kadang bisa ditebak (NIK punya pola). Data pseudonim tetap data pribadi menurut regulasi; tetap lindungi.'],
        ],
        mistakes: [
          ['"Kolom gender sudah dihapus, jadi model pasti adil."', 'Fitur proxy tetap membawa informasi kelompok; ukur hasilnya per kelompok.'],
          ['Menyimpan data pribadi "siapa tahu nanti berguna".', 'Kumpulkan seminimal mungkin dan tetapkan masa simpan.'],
        ],
        tips: ['Library: Fairlearn, AIF360 untuk metrik dan mitigasi fairness.', 'Buat model card dan datasheet untuk setiap model yang dirilis.'],
        check: [
          ['Kenapa menghapus kolom sensitif (gender, suku) tidak menjamin model adil?', 'Fitur lain (nama, kampus, alamat) bisa berkorelasi dengan atribut sensitif dan menjadi proxy, sehingga bias historis tetap terbawa.'],
        ],
      },
    },
  ],
}
