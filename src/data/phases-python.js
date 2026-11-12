import { py } from './py.js'

export const fondasi = {
  id: 'fondasi',
  title: 'Fondasi & Tools',
  duration: '1 minggu',
  description:
    'Siapkan "bengkel kerja" dulu: Python terpasang, editor siap, dan paham cara menyimpan kode dengan Git.',
  topics: [
    {
      id: 'install-python',
      title: 'Install Python & VS Code',
      summary: 'Memasang Python dan editor kode di komputer sendiri.',
      explain: [
        '**Python** adalah bahasa pemrograman yang paling banyak dipakai di dunia AI karena sintaksnya mudah dibaca dan library-nya sangat lengkap (NumPy, Pandas, scikit-learn, PyTorch).',
        '**VS Code** adalah editor kode gratis. Dengan ekstensi Python, VS Code bisa menjalankan, men-debug, dan memberi saran kode.',
        'Di aplikasi ini kamu sudah bisa mencoba Python langsung di browser. Tapi untuk proyek nyata (dan untuk PyTorch), kamu tetap perlu Python di komputer atau Google Colab.',
      ],
      uses: [
        'Menjalankan skrip Python di komputer sendiri',
        'Mengerjakan proyek besar dengan banyak file',
        'Debugging: menjalankan kode baris per baris untuk mencari kesalahan',
      ],
      examples: [
        {
          title: 'Cek instalasi di terminal',
          runnable: false,
          code: py`
# Windows: unduh dari https://www.python.org/downloads/
# Centang "Add Python to PATH" saat instalasi!

python --version      # contoh hasil: Python 3.14.x (angka versimu bisa berbeda)
pip --version         # pip = pengelola library Python

# Jalankan file Python
python hello.py  # jalankan file hello.py dengan Python`,
        },
        {
          title: 'Cek Python di browser (aplikasi ini)',
          code: py`
import sys  # modul bawaan berisi info tentang Python yang sedang dipakai
print("Halo! Python sudah jalan.")  # print() menampilkan teks ke layar
print("Versi:", sys.version)  # sys.version = versi Python yang menjalankan kode ini`,
        },
      ],
    },
    {
      id: 'terminal',
      title: 'Dasar terminal / command line',
      summary: 'Mengendalikan komputer lewat perintah teks.',
      explain: [
        '**Terminal** (Command Prompt/PowerShell di Windows, Terminal di Mac/Linux) adalah cara memberi perintah ke komputer lewat teks.',
        'Hampir semua tool AI dipakai lewat terminal: install library, menjalankan training, memakai Git, sampai deploy ke server.',
      ],
      uses: [
        'Install library dengan `pip install`',
        'Menjalankan skrip training model',
        'Mengakses server/cloud (server biasanya tidak punya tampilan grafis)',
      ],
      examples: [
        {
          title: 'Perintah yang paling sering dipakai',
          runnable: false,
          code: py`
pwd                 # tampilkan folder saat ini (PowerShell: Get-Location)
ls                  # lihat isi folder (cmd: dir)
cd belajar-ai       # masuk ke folder
cd ..               # naik satu folder
mkdir proyek1       # buat folder baru
python skrip.py     # jalankan file Python
pip install numpy   # install library`,
        },
      ],
    },
    {
      id: 'git',
      title: 'Git & GitHub',
      summary: 'Menyimpan riwayat perubahan kode dan membagikannya.',
      explain: [
        '**Git** mencatat setiap perubahan kode seperti "save point" di game. Kalau ada yang rusak, kamu bisa kembali ke versi sebelumnya.',
        '**GitHub** adalah tempat menyimpan repository Git secara online. Bagi calon AI engineer, GitHub berfungsi sebagai **portofolio**: perekrut sering melihatnya.',
      ],
      uses: [
        'Melacak perubahan kode dan kembali ke versi lama',
        'Kolaborasi dengan tim tanpa saling menimpa',
        'Menampilkan proyek sebagai portofolio',
        'Mengambil kode open-source (git clone)',
      ],
      examples: [
        {
          title: 'Alur kerja Git dasar',
          runnable: false,
          code: py`
git init                         # mulai melacak folder ini
git add .                        # siapkan semua perubahan
git commit -m "Tambah hello.py"  # simpan "save point"
git log --oneline                # lihat riwayat

# Hubungkan ke GitHub (buat repo kosong di github.com dulu)
# daftarkan alamat repo GitHub dengan nama 'origin'
git remote add origin https://github.com/USERNAME/belajar-ai.git
git push -u origin main  # kirim (upload) commit ke GitHub, cabang 'main'

git clone https://github.com/USERNAME/repo.git   # unduh repo`,
        },
      ],
    },
    {
      id: 'notebook',
      title: 'Jupyter Notebook & Google Colab',
      summary: 'Menulis kode, hasil, grafik, dan catatan dalam satu dokumen.',
      explain: [
        '**Notebook** terdiri dari sel-sel. Setiap sel bisa dijalankan sendiri-sendiri dan hasilnya (angka, tabel, grafik) langsung tampil di bawahnya. Cocok untuk eksperimen data.',
        '**Google Colab** adalah Jupyter Notebook online gratis dari Google, lengkap dengan **GPU gratis** untuk training deep learning. Kamu cukup login dengan akun Google.',
        'Editor di aplikasi ini mirip satu sel notebook: tulis kode, jalankan, lihat hasil.',
      ],
      uses: [
        'Eksplorasi data dan membuat grafik',
        'Training model deep learning dengan GPU gratis (Colab)',
        'Berbagi analisis lengkap dengan penjelasan',
      ],
      examples: [
        {
          title: 'Coba seperti sel notebook',
          code: py`
import matplotlib.pyplot as plt  # library untuk membuat grafik, disingkat plt

nilai = [70, 85, 60, 90, 75]  # list berisi nilai ujian
# list nama siswa, urutannya sama dengan nilai
nama = ["Ani", "Budi", "Citra", "Dodi", "Eka"]

# rata-rata = jumlah semua nilai dibagi banyaknya nilai
print("Rata-rata nilai:", sum(nilai) / len(nilai))

# grafik batang: sumbu datar = nama, tinggi batang = nilai
plt.bar(nama, nilai, color="skyblue")
plt.title("Nilai Ujian")  # judul grafik
plt.ylabel("Nilai")  # label sumbu tegak
plt.show()  # tampilkan grafiknya`,
        },
      ],
    },
  ],
  project: 'Buat repo GitHub "belajar-ai" dan push file hello.py pertamamu.',
  resources: [
    { label: 'Git Book (gratis, ada bahasa Indonesia)', url: 'https://git-scm.com/book/id/v2' },
    { label: 'Google Colab', url: 'https://colab.research.google.com/' },
    { label: 'VS Code + Python', url: 'https://code.visualstudio.com/docs/python/python-tutorial' },
  ],
  quiz: [
    {
      q: 'Apa kegunaan utama Git?',
      options: ['Menjalankan kode Python', 'Mencatat riwayat perubahan kode', 'Melatih model AI', 'Mengedit gambar'],
      answer: 1,
      why: 'Git adalah version control: mencatat setiap perubahan sehingga kamu bisa kembali ke versi sebelumnya.',
    },
    {
      q: 'Kenapa Google Colab populer untuk belajar deep learning?',
      options: ['Ada GPU gratis', 'Tidak perlu Python', 'Hanya untuk Java', 'Bisa jalan tanpa internet'],
      answer: 0,
      why: 'Training neural network jauh lebih cepat dengan GPU, dan Colab menyediakannya gratis.',
    },
  ],
}

export const pythonDasar = {
  id: 'python-dasar',
  title: 'Python Dasar',
  duration: '3–4 minggu',
  description: 'Bahasa utama di dunia AI. Fokus paham logika pemrograman, bukan menghafal sintaks.',
  topics: [
    {
      id: 'py-variabel',
      title: 'Variabel & tipe data',
      summary: 'Tempat menyimpan data, dan jenis-jenis data di Python.',
      explain: [
        '**Variabel** adalah "kotak berlabel" untuk menyimpan nilai. Di Python kamu tidak perlu menyebut tipenya, cukup `nama = "Budi"`.',
        'Tipe data dasar: `int` (bilangan bulat), `float` (desimal), `str` (teks), `bool` (True/False), dan `None` (kosong).',
        'Fungsi `type()` menunjukkan tipe sebuah nilai. Konversi tipe dilakukan dengan `int()`, `float()`, `str()`.',
      ],
      uses: [
        'Menyimpan data input pengguna, hasil hitungan, dan konfigurasi',
        'Di AI: menyimpan hyperparameter seperti `learning_rate = 0.01` atau `epochs = 10`',
        'Konversi tipe penting saat membaca data dari file/CSV (semuanya awalnya teks)',
      ],
      examples: [
        {
          title: 'Membuat variabel',
          code: py`
nama = "Budi"        # str
umur = 20            # int
tinggi = 170.5       # float
mahasiswa = True     # bool

print(nama, type(nama))  # type() menunjukkan tipe data sebuah nilai
print(umur, type(umur))
print(tinggi, type(tinggi))
print(mahasiswa, type(mahasiswa))

# Konversi tipe
angka_teks = "25"  # angka yang ditulis di dalam tanda kutip adalah teks (str)
print(int(angka_teks) + 5)     # 30
print(str(umur) + " tahun")    # 20 tahun`,
        },
      ],
      exercise: {
        task: 'Buat variabel `harga` (15000) dan `jumlah` (3), lalu cetak total harga dengan format "Total: Rp45000".',
        hint: 'Kalikan harga dan jumlah, lalu gabungkan dengan teks memakai str() atau f-string.',
        solution: py`
harga = 15000  # harga satu barang
jumlah = 3  # banyak barang yang dibeli
total = harga * jumlah  # operator * untuk perkalian
print("Total: Rp" + str(total))  # total harus diubah ke teks dulu sebelum digabung dengan +
print(f"Total: Rp{total}")   # cara lain dengan f-string`,
      },
    },
    {
      id: 'py-operator',
      title: 'Operator',
      summary: 'Simbol untuk menghitung, membandingkan, dan logika.',
      explain: [
        '**Aritmatika**: `+ - * /`, `//` (bagi bulat), `%` (sisa bagi/modulo), `**` (pangkat).',
        '**Perbandingan**: `== != > < >= <=` menghasilkan True/False.',
        '**Logika**: `and` (keduanya benar), `or` (salah satu benar), `not` (membalik).',
      ],
      uses: [
        '`%` untuk cek bilangan genap/ganjil (`x % 2 == 0`)',
        '`**` untuk menghitung kuadrat error di machine learning',
        'Operator logika untuk memfilter data: umur > 17 and kota == "Jakarta"',
      ],
      examples: [
        {
          title: 'Semua jenis operator',
          code: py`
a, b = 17, 5  # dua variabel diisi sekaligus: a = 17, b = 5
print("Tambah   :", a + b)  # penjumlahan
print("Kurang   :", a - b)  # pengurangan
print("Kali     :", a * b)  # perkalian
print("Bagi     :", a / b)     # 3.4
print("Bagi bulat:", a // b)   # 3
print("Sisa bagi :", a % b)    # 2
print("Pangkat   :", a ** 2)   # 289

print(a > b, a == b, a != b)  # operator perbandingan menghasilkan True/False

lulus, hadir = True, False  # dua nilai boolean
# and: keduanya benar | or: salah satu benar | not: membalik
print(lulus and hadir, lulus or hadir, not lulus)`,
        },
      ],
      exercise: {
        task: 'Tentukan apakah tahun 2024 adalah tahun kabisat. Aturannya: habis dibagi 4 dan tidak habis dibagi 100, ATAU habis dibagi 400.',
        hint: 'Gunakan %, ==, and, or.',
        solution: py`
tahun = 2024  # tahun yang ingin dicek
# % = sisa bagi; == 0 berarti habis dibagi
kabisat = (tahun % 4 == 0 and tahun % 100 != 0) or (tahun % 400 == 0)
print(tahun, "kabisat?", kabisat)  # hasilnya True (kabisat) atau False`,
      },
    },
    {
      id: 'py-kondisi',
      title: 'Percabangan (if / elif / else)',
      summary: 'Membuat program yang mengambil keputusan.',
      explain: [
        '`if` menjalankan blok kode hanya jika kondisinya True. `elif` mengecek kondisi lain, dan `else` menangani sisanya.',
        'Python memakai **indentasi** (4 spasi) untuk menandai blok kode. Salah indentasi akan menyebabkan error.',
        'Menariknya, model **Decision Tree** di machine learning pada dasarnya adalah kumpulan if-else yang dipelajari otomatis dari data!',
      ],
      uses: [
        'Validasi input (umur negatif → tolak)',
        'Memberi grade/kategori berdasarkan nilai',
        'Mengubah probabilitas model jadi keputusan: `if prob > 0.5: "spam"`',
      ],
      examples: [
        {
          title: 'Grade nilai',
          code: py`
nilai = 78  # nilai yang akan diberi grade

if nilai >= 85:  # dicek dari atas: kondisi pertama yang benar yang dipakai
    grade = "A"
elif nilai >= 70:  # elif = 'kalau tidak, cek kondisi ini'
    grade = "B"
elif nilai >= 55:
    grade = "C"
else:  # else = semua kondisi di atas salah
    grade = "D"

# f-string: {nilai} dan {grade} diganti isi variabelnya
print(f"Nilai {nilai} mendapat grade {grade}")`,
        },
        {
          title: 'Dengan input pengguna',
          code: py`
# input() membaca ketikan pengguna (teks), int() mengubahnya jadi angka
angka = int(input("Masukkan angka: "))
if angka % 2 == 0:  # habis dibagi 2 berarti genap
    print(angka, "adalah bilangan genap")
else:  # selain itu pasti ganjil
    print(angka, "adalah bilangan ganjil")`,
        },
      ],
      exercise: {
        task: 'Hitung BMI = berat / (tinggi_meter ** 2) lalu tampilkan kategori: < 18.5 Kurus, < 25 Normal, < 30 Gemuk, selain itu Obesitas.',
        hint: 'Gunakan if/elif/else berurutan dari batas terkecil.',
        solution: py`
berat = 68  # berat badan dalam kg
tinggi = 1.70  # tinggi badan dalam meter
bmi = berat / tinggi ** 2  # rumus BMI = berat / tinggi kuadrat (** = pangkat)

if bmi < 18.5:  # urutkan dari batas terkecil agar setiap rentang tertangkap benar
    kategori = "Kurus"
elif bmi < 25:
    kategori = "Normal"
elif bmi < 30:
    kategori = "Gemuk"
else:
    kategori = "Obesitas"

print(f"BMI = {bmi:.1f} ({kategori})")  # :.1f = tampilkan 1 angka di belakang koma`,
      },
    },
    {
      id: 'py-loop',
      title: 'Perulangan (for / while)',
      summary: 'Mengulang perintah tanpa menulis ulang kode.',
      explain: [
        '`for` mengulang untuk setiap item dalam urutan (list, string, `range`). `while` mengulang selama kondisinya True.',
        '`break` menghentikan loop, `continue` melompat ke putaran berikutnya.',
        'Di AI, proses **training** model adalah sebuah loop: untuk setiap epoch, model melihat data lalu memperbaiki dirinya sedikit demi sedikit.',
      ],
      uses: [
        'Memproses setiap baris data',
        'Training loop: `for epoch in range(100): ...`',
        'Simulasi dan perhitungan berulang',
      ],
      examples: [
        {
          title: 'for dan while',
          code: py`
for i in range(1, 6):  # range(1, 6) menghasilkan 1, 2, 3, 4, 5 (angka 6 tidak ikut)
    print("Perulangan ke-", i)  # baris yang menjorok ke dalam diulang setiap putaran

buah = ["apel", "jeruk", "mangga"]  # list berisi tiga buah
for b in buah:  # b berisi satu buah di setiap putaran
    print("Saya suka", b)

# while: menabung sampai 1 juta
tabungan = 0
bulan = 0
while tabungan < 1_000_000:  # ulangi selama tabungan masih kurang dari 1 juta
    tabungan += 150_000  # += artinya tambahkan ke nilai lama
    bulan += 1  # hitung berapa kali menabung
print(f"Butuh {bulan} bulan, tabungan = {tabungan:,}")  # :, = beri pemisah ribuan`,
        },
      ],
      exercise: {
        task: 'FizzBuzz: cetak angka 1–20. Jika habis dibagi 3 cetak "Fizz", habis dibagi 5 cetak "Buzz", habis dibagi keduanya cetak "FizzBuzz".',
        hint: 'Cek kondisi "habis dibagi 15" lebih dulu.',
        solution: py`
for i in range(1, 21):  # ulangi untuk angka 1 sampai 20
    if i % 15 == 0:  # habis dibagi 15 berarti habis dibagi 3 DAN 5, jadi dicek paling awal
        print("FizzBuzz")
    elif i % 3 == 0:  # habis dibagi 3
        print("Fizz")
    elif i % 5 == 0:  # habis dibagi 5
        print("Buzz")
    else:  # bukan kelipatan 3 maupun 5: cetak angkanya
        print(i)`,
      },
    },
    {
      id: 'py-koleksi',
      title: 'List, tuple, dictionary, set',
      summary: 'Struktur data untuk menyimpan banyak nilai.',
      explain: [
        '**list** `[1, 2, 3]`: urutan yang bisa diubah. Akses dengan index mulai dari 0; `x[-1]` adalah elemen terakhir; `x[1:3]` adalah slicing.',
        '**tuple** `(1, 2)`: seperti list tapi tidak bisa diubah. Cocok untuk data tetap seperti koordinat.',
        '**dict** `{"nama": "Ani"}`: pasangan kunci–nilai. Cocok untuk data berlabel, mirip JSON.',
        '**set** `{1, 2, 3}`: kumpulan nilai unik tanpa urutan. Cocok untuk menghapus duplikat.',
      ],
      uses: [
        'list: menyimpan dataset, riwayat loss saat training',
        'dict: konfigurasi model, data JSON dari API, kamus kata → index (vocabulary NLP)',
        'set: mencari kata unik dalam teks',
        'tuple: ukuran gambar `(224, 224)`, bentuk (shape) array',
      ],
      examples: [
        {
          title: 'Keempat struktur data',
          code: py`
# LIST
nilai = [80, 75, 90, 65]  # list ditulis dengan kurung siku, isinya berurutan
nilai.append(88)  # append() menambah elemen di akhir list
# indeks mulai dari 0; indeks -1 = elemen terakhir
print("List:", nilai, "| pertama:", nilai[0], "| terakhir:", nilai[-1])
print("Slicing [1:3]:", nilai[1:3])  # ambil elemen indeks 1 sampai sebelum 3
# sorted() mengurutkan tanpa mengubah list asli
print("Terurut:", sorted(nilai), "| maks:", max(nilai))

# TUPLE
ukuran_gambar = (224, 224)  # tuple ditulis dengan kurung biasa dan tidak bisa diubah
lebar, tinggi = ukuran_gambar     # unpacking
print("Tuple:", lebar, "x", tinggi)

# DICTIONARY
siswa = {"nama": "Ani", "umur": 17, "kelas": "XII"}  # dictionary: pasangan kunci -> nilai
siswa["nilai"] = 92  # menambah pasangan kunci-nilai baru
# .get() aman: jika kunci tidak ada, kembalikan nilai default '-'
print("Dict:", siswa["nama"], siswa.get("alamat", "-"))
for kunci, isi in siswa.items():  # .items() memberi pasangan (kunci, isi) satu per satu
    print("  ", kunci, "=>", isi)

# SET
# split() memecah kalimat menjadi list kata
kata = "saya suka makan dan saya suka minum".split()
print("Set kata unik:", set(kata))  # set otomatis membuang kata yang kembar`,
        },
      ],
      exercise: {
        task: 'Hitung berapa kali setiap kata muncul dalam kalimat "ai itu seru dan ai itu masa depan" menggunakan dictionary.',
        hint: 'Loop setiap kata; jika belum ada di dict set ke 0, lalu tambah 1. Atau pakai dict.get(kata, 0).',
        solution: py`
kalimat = "ai itu seru dan ai itu masa depan"  # kalimat yang akan dihitung kata-katanya
hitung = {}  # dictionary kosong untuk menyimpan jumlah tiap kata
for kata in kalimat.split():  # loop setiap kata
    # ambil jumlah lama (0 jika belum ada), lalu tambah 1
    hitung[kata] = hitung.get(kata, 0) + 1
print(hitung)  # hasil: {kata: jumlah kemunculan}`,
      },
    },
    {
      id: 'py-string',
      title: 'Olah string',
      summary: 'Memanipulasi teks — dasar dari NLP.',
      explain: [
        'String adalah teks. Python punya banyak method bawaan: `lower()`, `upper()`, `strip()`, `split()`, `join()`, `replace()`, `startswith()`.',
        '**f-string** `f"Halo {nama}"` adalah cara termudah menyisipkan variabel ke teks. Format angka: `f"{x:.2f}"` (2 desimal), `f"{x:,}"` (pemisah ribuan).',
      ],
      uses: [
        'Membersihkan teks sebelum diproses model NLP (huruf kecil, hapus spasi)',
        'Memecah kalimat jadi kata (tokenisasi sederhana)',
        'Membuat prompt untuk LLM dengan f-string',
      ],
      examples: [
        {
          title: 'Method string yang sering dipakai',
          code: py`
teks = "   Belajar AI Itu MENYENANGKAN!   "  # teks dengan spasi berlebih dan huruf campur
bersih = teks.strip().lower()  # strip() buang spasi di tepi, lower() jadikan huruf kecil
print(repr(bersih))  # repr() menampilkan teks lengkap dengan tanda kutipnya

kata = bersih.split()  # pecah menjadi list kata
print("Kata-kata:", kata, "| jumlah:", len(kata))  # len() = banyaknya elemen
# join() menggabungkan list kata dengan pemisah '-'
print("Gabung pakai '-':", "-".join(kata))
# replace(lama, baru) mengganti bagian teks
print("Ganti:", bersih.replace("menyenangkan", "seru"))
# startswith() cek awalan teks -> True/False
print("Diawali 'belajar'?", bersih.startswith("belajar"))

harga = 1250000.5  # angka desimal
print(f"Harga: Rp{harga:,.2f}")  # :,.2f = pemisah ribuan + 2 angka di belakang koma

# Membuat prompt untuk LLM
topik = "fotosintesis"  # topik yang akan dimasukkan ke prompt
# f-string memudahkan menyusun prompt dengan isi yang berubah-ubah
prompt = f"Jelaskan {topik} untuk anak SD dalam 3 kalimat."
print(prompt)`,
        },
      ],
    },
    {
      id: 'py-fungsi',
      title: 'Fungsi',
      summary: 'Membungkus kode agar bisa dipakai berulang.',
      explain: [
        'Fungsi dibuat dengan `def`, menerima **parameter**, dan mengembalikan hasil dengan `return`.',
        'Parameter bisa punya nilai default: `def sapa(nama="teman")`. `*args` menerima banyak argumen, `**kwargs` menerima argumen bernama.',
        'Prinsipnya: satu fungsi untuk satu tugas. Kode jadi rapi, mudah dites, dan bisa dipakai ulang.',
      ],
      uses: [
        'Fungsi preprocessing data yang dipakai berulang',
        'Fungsi menghitung metrik (akurasi, error)',
        'Semua library AI pada dasarnya adalah kumpulan fungsi dan class',
      ],
      examples: [
        {
          title: 'Membuat dan memanggil fungsi',
          code: py`
# def membuat fungsi bernama luas_persegi_panjang dengan 2 parameter
def luas_persegi_panjang(panjang, lebar):
    return panjang * lebar  # return mengembalikan hasil ke pemanggil

def sapa(nama="teman"):  # parameter dengan nilai default: dipakai jika tidak diisi
    return f"Halo, {nama}!"

def statistik(data):  # fungsi menerima list angka
    rata = sum(data) / len(data)  # hitung rata-rata
    return min(data), max(data), rata   # mengembalikan tuple

def total(*angka):  # *angka menampung berapa pun argumen sebagai tuple
    return sum(angka)  # sum() menjumlahkan semua isi

print(luas_persegi_panjang(5, 3))  # panggil fungsi: 5 x 3 = 15
print(sapa(), sapa("Rina"))  # tanpa argumen -> pakai default 'teman'
# tiga nilai yang dikembalikan langsung dipecah ke tiga variabel
mn, mx, avg = statistik([4, 8, 15, 16, 23, 42])
print(f"min={mn}, max={mx}, rata={avg:.2f}")  # :.2f = 2 angka di belakang koma
print(total(1, 2, 3, 4))  # bisa diberi 4 argumen sekaligus`,
        },
      ],
      exercise: {
        task: 'Buat fungsi `akurasi(prediksi, jawaban)` yang mengembalikan persentase prediksi yang benar. Contoh: akurasi([1,0,1,1], [1,1,1,0]) → 50.0',
        hint: 'Gunakan zip() untuk memasangkan kedua list, hitung yang sama, bagi dengan panjang list.',
        solution: py`
def akurasi(prediksi, jawaban):  # fungsi menghitung persentase tebakan yang benar
    # zip() memasangkan prediksi dan jawaban; hitung pasangan yang sama
    benar = sum(1 for p, j in zip(prediksi, jawaban) if p == j)
    return benar / len(jawaban) * 100  # ubah menjadi persen

print(akurasi([1, 0, 1, 1], [1, 1, 1, 0]))   # 50.0`,
      },
    },
    {
      id: 'py-file',
      title: 'Baca & tulis file',
      summary: 'Menyimpan dan membaca data dari file teks dan CSV.',
      explain: [
        'Gunakan `with open(nama_file, mode) as f:` agar file otomatis ditutup. Mode: `"r"` baca, `"w"` tulis (menimpa), `"a"` tambah.',
        '**CSV** (Comma-Separated Values) adalah format tabel paling umum untuk dataset. Modul `csv` bawaan Python bisa membacanya; nanti Pandas membuatnya jauh lebih mudah.',
      ],
      uses: [
        'Membaca dataset untuk training',
        'Menyimpan hasil prediksi atau log eksperimen',
        'Menyimpan konfigurasi',
      ],
      examples: [
        {
          title: 'Tulis lalu baca file CSV',
          code: py`
import csv  # modul bawaan untuk membaca/menulis file CSV

# Tulis
# baris pertama = judul kolom, sisanya data
data = [["nama", "nilai"], ["Ani", 90], ["Budi", 75], ["Citra", 82]]
# with menjamin file ditutup otomatis; 'w' = mode tulis
with open("nilai.csv", "w", newline="") as f:
    csv.writer(f).writerows(data)  # tulis semua baris sekaligus

# Baca sebagai teks biasa
with open("nilai.csv") as f:  # tanpa mode = baca ('r')
    print(f.read())  # read() membaca seluruh isi file sebagai teks

# Baca sebagai dictionary per baris
with open("nilai.csv") as f:  # buka lagi dari awal
    # DictReader membaca setiap baris sebagai dict {kolom: isi}
    for baris in csv.DictReader(f):
        # isi CSV selalu teks, jadi diubah dulu dengan int()
        print(baris["nama"], "->", int(baris["nilai"]) + 5)`,
        },
      ],
    },
    {
      id: 'py-error',
      title: 'Penanganan error',
      summary: 'Membuat program tidak langsung berhenti saat ada masalah.',
      explain: [
        'Error (exception) terjadi saat ada yang salah, misalnya membagi dengan nol atau mengubah "abc" jadi angka.',
        '`try` berisi kode yang mungkin error, `except` menangani error-nya, dan `finally` selalu dijalankan.',
        '**Membaca traceback** adalah skill penting: baris paling bawah memberi tahu jenis error dan penyebabnya.',
      ],
      uses: [
        'Menangani data rusak/kosong tanpa menghentikan seluruh proses',
        'Mencoba ulang request API yang gagal',
        'Memberi pesan yang ramah ke pengguna',
      ],
      examples: [
        {
          title: 'try / except',
          code: py`
def bagi(a, b):  # fungsi pembagian yang aman
    try:  # try: coba jalankan kode yang mungkin error
        return a / b  # jika b = 0, baris ini memicu ZeroDivisionError
    except ZeroDivisionError:  # tangkap error pembagian dengan nol
        print("Tidak bisa membagi dengan nol!")
        return None  # kembalikan None sebagai tanda gagal

print(bagi(10, 2))  # normal: 5.0
print(bagi(10, 0))  # error ditangkap, program tidak berhenti

data_mentah = ["10", "20", "abc", "40", ""]  # data mentah: ada yang bukan angka
angka = []  # tempat menyimpan angka yang valid
for x in data_mentah:  # proses satu per satu
    try:
        angka.append(int(x))  # int('abc') atau int('') akan memicu ValueError
    except ValueError:  # jika gagal diubah, lewati saja
        # !r menampilkan nilai lengkap dengan tanda kutip
        print(f"Lewati data tidak valid: {x!r}")
print("Data bersih:", angka)  # hanya berisi angka yang valid`,
        },
        {
          title: 'Coba baca traceback ini',
          code: py`
nilai = [1, 2, 3]  # list dengan 3 elemen (indeks 0, 1, 2)
print(nilai[5])   # IndexError: index di luar jangkauan`,
        },
      ],
    },
  ],
  project: 'Aplikasi to-do list di terminal yang menyimpan data ke file.',
  resources: [
    { label: 'Tutorial resmi Python', url: 'https://docs.python.org/3/tutorial/' },
    { label: 'Kaggle Learn: Python', url: 'https://www.kaggle.com/learn/python' },
    { label: 'Dicoding (kelas bahasa Indonesia)', url: 'https://www.dicoding.com/academies' },
    { label: 'W3Schools Python', url: 'https://www.w3schools.com/python/' },
  ],
  quiz: [
    {
      q: 'Apa hasil dari `17 % 5`?',
      options: ['3.4', '3', '2', '85'],
      answer: 2,
      why: '% adalah sisa bagi. 17 = 3×5 + 2, jadi sisanya 2.',
    },
    {
      q: 'Struktur data apa yang paling cocok untuk menyimpan {"nama": "Ani", "umur": 17}?',
      options: ['list', 'tuple', 'set', 'dictionary'],
      answer: 3,
      why: 'Dictionary menyimpan pasangan kunci–nilai.',
    },
    {
      q: 'Jika `x = [10, 20, 30, 40]`, apa nilai `x[-1]`?',
      options: ['10', '40', 'Error', '30'],
      answer: 1,
      why: 'Index negatif menghitung dari belakang; -1 adalah elemen terakhir.',
    },
  ],
}

export const pythonLanjut = {
  id: 'python-lanjut',
  title: 'Python Lanjutan',
  duration: '3 minggu',
  description: 'Teknik yang membuat kode rapi dan bisa dipakai ulang — sering muncul di kode AI.',
  topics: [
    {
      id: 'pyl-oop',
      title: 'OOP (class & object)',
      summary: 'Menggabungkan data dan perilaku dalam satu "cetakan".',
      explain: [
        '**Class** adalah cetakan, **object** adalah barang hasil cetakannya. Class berisi **atribut** (data) dan **method** (fungsi milik class).',
        '`__init__` dijalankan saat object dibuat. `self` merujuk ke object itu sendiri.',
        '**Inheritance** (pewarisan): class anak mewarisi semua kemampuan class induk lalu menambah atau mengubahnya. Di PyTorch, setiap model adalah class yang mewarisi `nn.Module`.',
      ],
      uses: [
        'Model PyTorch: `class ModelSaya(nn.Module)`',
        'Model scikit-learn adalah object: `model.fit()`, `model.predict()`',
        'Mengorganisir proyek besar agar rapi',
      ],
      examples: [
        {
          title: 'Class, object, dan inheritance',
          code: py`
class Rekening:  # class = cetakan untuk membuat objek rekening
    def __init__(self, pemilik, saldo=0):  # __init__ dijalankan otomatis saat objek dibuat
        self.pemilik = pemilik  # self.xxx = data yang disimpan di dalam objek
        self.saldo = saldo

    def setor(self, jumlah):  # method untuk menambah saldo
        self.saldo += jumlah

    def tarik(self, jumlah):  # method untuk mengambil uang
        if jumlah > self.saldo:  # cegah saldo menjadi minus
            print("Saldo tidak cukup!")
        else:
            self.saldo -= jumlah

    def __str__(self):  # __str__ menentukan tampilan objek saat di-print
        return f"{self.pemilik}: Rp{self.saldo:,}"


class Tabungan(Rekening):          # mewarisi Rekening
    # Tabungan punya semua kemampuan Rekening + bunga
    def __init__(self, pemilik, saldo=0, bunga=0.03):
        super().__init__(pemilik, saldo)  # super() menjalankan __init__ milik Rekening
        self.bunga = bunga  # atribut tambahan khusus Tabungan

    def tambah_bunga(self):  # method baru yang hanya dimiliki Tabungan
        # saldo bertambah sebesar persentase bunga
        self.saldo += int(self.saldo * self.bunga)


a = Rekening("Ani", 100_000)  # buat objek dari cetakan Rekening
a.setor(50_000)  # saldo jadi 150.000
a.tarik(500_000)  # lebih besar dari saldo -> ditolak
print(a)  # memanggil __str__ secara otomatis

t = Tabungan("Budi", 1_000_000)  # objek Tabungan dengan bunga default 3%
t.tambah_bunga()  # saldo 1.000.000 + 3% = 1.030.000
print(t)`,
        },
        {
          title: 'Pola yang sama dengan model scikit-learn',
          code: py`
class ModelRataRata:  # meniru gaya model scikit-learn: punya fit() dan predict()
    """Model paling sederhana: selalu menebak rata-rata data training."""
    def fit(self, y):  # fit = belajar dari data
        self.rata = sum(y) / len(y)  # yang 'dipelajari' hanyalah rata-rata
        return self  # return self agar bisa ditulis .fit(...).predict(...)

    def predict(self, n):  # predict = menebak untuk n data baru
        return [self.rata] * n  # tebakannya selalu rata-rata

model = ModelRataRata().fit([10, 20, 30])  # latih model dengan 3 data
print(model.predict(3))  # hasil: [20.0, 20.0, 20.0]`,
        },
      ],
    },
    {
      id: 'pyl-modul',
      title: 'Modul, package & pip',
      summary: 'Memakai kode orang lain (dan kode sendiri) lewat import.',
      explain: [
        '**Modul** adalah file `.py` berisi kode. **Package** adalah kumpulan modul. Pakai dengan `import`.',
        'Python punya banyak modul bawaan (`math`, `random`, `datetime`, `collections`). Library pihak ketiga seperti NumPy diinstall dengan **pip**: `pip install numpy`.',
        'Gaya import: `import numpy as np` (alias), `from math import sqrt` (ambil satu fungsi).',
      ],
      uses: [
        'Memakai library AI: numpy, pandas, sklearn, torch',
        'Memecah proyek menjadi beberapa file',
        '`random` untuk mengacak data, `datetime` untuk data waktu',
      ],
      examples: [
        {
          title: 'Modul bawaan Python',
          code: py`
import math  # fungsi matematika (akar, pi, log, ...)
import random  # angka dan pilihan acak
from datetime import date  # tanggal
from collections import Counter  # penghitung frekuensi

print("Akar 16:", math.sqrt(16), "| pi:", round(math.pi, 4))  # math.sqrt = akar kuadrat

random.seed(42)                       # supaya hasil acak bisa diulang
data = list(range(1, 11))  # list angka 1 sampai 10
random.shuffle(data)  # acak urutan list (mengubah list aslinya)
print("Data diacak:", data)
# ambil satu pilihan secara acak
print("Pilih acak:", random.choice(["batu", "gunting", "kertas"]))

print("Hari ini:", date.today())  # tanggal hari ini

warna = ["merah", "biru", "merah", "hijau", "merah", "biru"]
print(Counter(warna).most_common(2))  # 2 warna yang paling sering muncul`,
        },
      ],
    },
    {
      id: 'pyl-venv',
      title: 'Virtual environment',
      summary: 'Lingkungan terpisah untuk setiap proyek.',
      explain: [
        'Proyek A butuh `numpy 1.x`, proyek B butuh `numpy 2.x`. Tanpa virtual environment keduanya bentrok.',
        '**venv** membuat folder berisi Python dan library khusus untuk satu proyek. `requirements.txt` mencatat library apa saja yang dibutuhkan agar orang lain bisa memasang hal yang sama.',
      ],
      uses: [
        'Menghindari bentrok versi library',
        'Membuat proyek bisa dijalankan ulang di komputer lain atau server',
      ],
      examples: [
        {
          title: 'Membuat dan memakai venv',
          runnable: false,
          code: py`
python -m venv .venv              # buat environment

.venv\Scripts\activate            # aktifkan (Windows)
source .venv/bin/activate         # aktifkan (Mac/Linux)

pip install numpy pandas scikit-learn
pip freeze > requirements.txt     # catat library

# Di komputer lain:
pip install -r requirements.txt`,
        },
      ],
    },
    {
      id: 'pyl-comprehension',
      title: 'List / dict comprehension',
      summary: 'Membuat list atau dict dalam satu baris.',
      explain: [
        'Bentuknya `[ekspresi for item in data if kondisi]`. Lebih ringkas dan biasanya lebih cepat daripada loop biasa dengan `append`.',
        'Dict comprehension: `{kunci: nilai for item in data}`.',
      ],
      uses: [
        'Membersihkan atau mengubah data dalam satu baris',
        'Membuat vocabulary NLP: `{kata: i for i, kata in enumerate(daftar)}`',
        'Memfilter data',
      ],
      examples: [
        {
          title: 'Loop biasa vs comprehension',
          code: py`
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # data contoh

kuadrat = []  # cara biasa: siapkan list kosong
for x in angka:  # loop setiap angka
    kuadrat.append(x ** 2)  # tambahkan hasil kuadratnya
print(kuadrat)

print([x ** 2 for x in angka])            # sama, satu baris
print([x for x in angka if x % 2 == 0])   # filter genap

kata = ["saya", "belajar", "ai"]  # daftar kata
# dict comprehension: setiap kata diberi nomor (dasar tokenisasi NLP)
vocab = {k: i for i, k in enumerate(kata)}
print(vocab)

nilai = {"Ani": 90, "Budi": 55, "Citra": 72}  # nilai tiap siswa
# ubah setiap nilai menjadi status lulus/remedial
print({n: ("Lulus" if v >= 60 else "Remedial") for n, v in nilai.items()})`,
        },
      ],
      exercise: {
        task: 'Dari list suhu Celsius [0, 25, 30, 37, 100], buat list suhu Fahrenheit (F = C × 9/5 + 32) dengan list comprehension.',
        hint: '[rumus for c in suhu]',
        solution: py`
suhu = [0, 25, 30, 37, 100]  # suhu dalam Celsius
print([c * 9 / 5 + 32 for c in suhu])  # rumus F = C x 9/5 + 32 untuk setiap suhu`,
      },
    },
    {
      id: 'pyl-generator',
      title: 'Iterator, generator & lambda',
      summary: 'Memproses data satu per satu dan menulis fungsi singkat.',
      explain: [
        '**Generator** memakai `yield` untuk menghasilkan nilai satu per satu, tanpa menyimpan semuanya di memori. Sangat berguna untuk dataset besar.',
        '**lambda** adalah fungsi tanpa nama untuk tugas singkat: `lambda x: x * 2`. Sering dipakai bersama `sorted`, `map`, dan `filter`.',
      ],
      uses: [
        'Membaca dataset besar per batch (DataLoader PyTorch bekerja seperti ini)',
        'Mengurutkan data berdasarkan kriteria tertentu',
      ],
      examples: [
        {
          title: 'Generator batch data',
          code: py`
def batch(data, ukuran):  # generator: menghasilkan data sedikit demi sedikit
    for i in range(0, len(data), ukuran):  # loop melompat sebesar ukuran batch
        yield data[i:i + ukuran]  # yield memberi satu batch lalu 'berhenti sejenak'

data = list(range(1, 11))  # angka 1 sampai 10
for b in batch(data, 3):  # setiap putaran menerima satu batch
    print("Batch:", b)

siswa = [("Ani", 90), ("Budi", 75), ("Citra", 82)]  # list berisi pasangan (nama, nilai)
# lambda s: s[1] = urutkan berdasarkan nilai, dari terbesar
print(sorted(siswa, key=lambda s: s[1], reverse=True))

print(list(map(lambda x: x * 2, [1, 2, 3])))  # map: terapkan fungsi ke setiap elemen
# filter: ambil hanya elemen yang memenuhi syarat
print(list(filter(lambda x: x > 0, [-2, 5, -1, 8])))`,
        },
      ],
    },
    {
      id: 'pyl-decorator',
      title: 'Decorator & type hints',
      summary: 'Menambah kemampuan fungsi dan menulis tipe data.',
      explain: [
        '**Decorator** (`@nama`) membungkus fungsi untuk menambah perilaku tanpa mengubah isinya, misalnya mengukur waktu atau logging.',
        '**Type hints** seperti `def f(x: int) -> str:` membuat kode lebih jelas dan membantu editor memberi saran. FastAPI memakainya untuk validasi otomatis.',
      ],
      uses: [
        'FastAPI: `@app.get("/predict")` untuk membuat endpoint API',
        'PyTorch: `@torch.no_grad()` untuk mematikan perhitungan gradien',
        'Mengukur lama eksekusi fungsi',
      ],
      examples: [
        {
          title: 'Decorator pengukur waktu',
          code: py`
import time  # modul untuk mengukur waktu

def ukur_waktu(fungsi):  # decorator: fungsi yang menerima fungsi lain
    def pembungkus(*args, **kwargs):  # pembungkus menerima argumen apa pun
        mulai = time.perf_counter()  # catat waktu mulai
        hasil = fungsi(*args, **kwargs)  # jalankan fungsi aslinya
        # hitung lama waktu berjalan
        print(f"{fungsi.__name__} selesai dalam {time.perf_counter() - mulai:.4f} detik")
        return hasil  # kembalikan hasil fungsi asli
    return pembungkus  # kembalikan fungsi yang sudah dibungkus

@ukur_waktu  # pasang decorator: jumlah_kuadrat = ukur_waktu(jumlah_kuadrat)
def jumlah_kuadrat(n: int) -> int:  # type hint: n berupa int, hasil juga int
    return sum(i * i for i in range(n))  # jumlahkan i kuadrat dari 0 sampai n-1

print(jumlah_kuadrat(1_000_000))  # waktu otomatis dicetak oleh decorator`,
        },
      ],
    },
    {
      id: 'pyl-api',
      title: 'Request API & JSON',
      summary: 'Mengambil data dari internet dan membaca format JSON.',
      explain: [
        '**API** adalah "pintu" bagi program untuk meminta data atau layanan dari server, misalnya data cuaca atau jawaban LLM.',
        '**JSON** adalah format pertukaran data paling umum. Di Python, JSON berubah menjadi dict dan list.',
        'Library `requests` dipakai untuk memanggil API. Di browser ini, contoh JSON di bawah memakai data contoh.',
      ],
      uses: [
        'Memanggil API LLM (Claude, OpenAI, Gemini)',
        'Mengumpulkan data untuk dataset',
        'Menghubungkan model AI dengan aplikasi lain',
      ],
      examples: [
        {
          title: 'Membaca JSON',
          code: py`
import json  # modul bawaan untuk membaca/menulis JSON

# contoh respons API dalam bentuk teks JSON
respons = '''
{"kota": "Bandung", "suhu": 24.5,
 "prakiraan": [{"hari": "Senin", "cuaca": "Hujan"},
               {"hari": "Selasa", "cuaca": "Cerah"}]}
'''
data = json.loads(respons)          # teks JSON -> dict
print(data["kota"], data["suhu"], "°C")  # akses isi dict dengan kunci
for p in data["prakiraan"]:  # prakiraan berisi list; loop setiap item
    print("-", p["hari"], ":", p["cuaca"])

# dict -> teks JSON yang rapi (indent=2)
print(json.dumps({"model": "regresi", "akurasi": 0.92}, indent=2))`,
        },
        {
          title: 'Memanggil API sungguhan (di komputer sendiri)',
          runnable: false,
          code: py`
import requests  # library untuk request HTTP (pip install requests)

url = "https://api.open-meteo.com/v1/forecast"  # alamat API cuaca gratis
# parameter request: lokasi Jakarta
params = {"latitude": -6.2, "longitude": 106.8, "current_weather": True}
# kirim GET; timeout agar tidak menunggu selamanya
r = requests.get(url, params=params, timeout=10)
r.raise_for_status()  # berhenti dengan error jika status bukan 2xx
print(r.json()["current_weather"])  # ubah respons JSON menjadi dict`,
        },
      ],
    },
    {
      id: 'pyl-test',
      title: 'Testing dasar (pytest)',
      summary: 'Memastikan kode benar secara otomatis.',
      explain: [
        'Test adalah kode yang mengecek kode lain. `assert kondisi` akan error jika kondisinya False.',
        '**pytest** menjalankan semua fungsi berawalan `test_` secara otomatis. Jalankan dengan perintah `pytest` di terminal.',
      ],
      uses: [
        'Memastikan fungsi preprocessing data tidak rusak saat kode diubah',
        'Mengecek bentuk (shape) output model',
      ],
      examples: [
        {
          title: 'Test dengan assert',
          code: py`
def normalisasi(data):  # fungsi yang akan dites
    mn, mx = min(data), max(data)  # ambil nilai terkecil dan terbesar
    return [(x - mn) / (mx - mn) for x in data]  # ubah setiap nilai ke rentang 0 sampai 1

def test_normalisasi():  # fungsi test: namanya diawali test_
    # jalankan fungsi dengan input yang hasilnya kita tahu
    hasil = normalisasi([10, 20, 30])
    # assert: jika salah, program berhenti dengan AssertionError
    assert hasil == [0.0, 0.5, 1.0]
    assert min(hasil) == 0 and max(hasil) == 1  # cek sifat penting lainnya

test_normalisasi()  # jalankan test (pytest menjalankannya otomatis)
print("✅ Semua test lulus")  # hanya tercetak jika semua assert lolos

# Coba ubah rumusnya jadi salah, lalu jalankan lagi!`,
        },
      ],
    },
  ],
  project: 'Program yang mengambil data dari API publik (mis. cuaca) lalu menyimpannya ke CSV.',
  resources: [
    { label: 'Real Python', url: 'https://realpython.com/' },
    { label: 'Dokumentasi venv', url: 'https://docs.python.org/3/library/venv.html' },
    { label: 'pytest — Get Started', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
  ],
  quiz: [
    {
      q: 'Apa fungsi `self` di dalam class?',
      options: ['Nama class', 'Merujuk ke object itu sendiri', 'Kata kunci untuk import', 'Membuat loop'],
      answer: 1,
      why: 'self adalah referensi ke object yang sedang dipakai, sehingga method bisa mengakses atributnya.',
    },
    {
      q: 'Kenapa memakai virtual environment?',
      options: ['Agar kode lebih cepat', 'Agar library tiap proyek tidak bentrok', 'Wajib untuk print()', 'Untuk menghubungkan ke GitHub'],
      answer: 1,
      why: 'Setiap proyek punya library dan versinya sendiri-sendiri.',
    },
    {
      q: 'Hasil `[x*2 for x in [1,2,3] if x > 1]` adalah…',
      options: ['[2, 4, 6]', '[4, 6]', '[2, 3]', '[1, 2, 3]'],
      answer: 1,
      why: 'Hanya 2 dan 3 yang lolos filter, lalu masing-masing dikali 2.',
    },
  ],
}
