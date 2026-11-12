import { py } from './py.js'

// Pendalaman materi Fondasi, Python Dasar, dan Python Lanjutan.
// `deep`: konsep lebih dalam, contoh lanjutan, kesalahan umum, tips, cek pemahaman.
// `exercise`: hanya untuk materi yang belum punya latihan.

export const deepPython = {
  // ---------------- Fondasi & Tools ----------------
  'install-python': {
    deep: {
      concepts: [
        ['Apa yang sebenarnya terjadi saat menjalankan `python file.py`?', [
          'Python adalah bahasa **interpreted**: program `python` (interpreter) membaca kodemu, mengubahnya menjadi *bytecode* (file `.pyc` di folder `__pycache__`), lalu menjalankan bytecode itu baris demi baris.',
          'Karena itu, versi interpreter penting. Kode yang memakai fitur Python 3.12 bisa gagal di Python 3.8. Cek versimu dengan `python --version`.',
        ]],
        ['PATH: kenapa perintah `python` kadang "tidak dikenal"', [
          '**PATH** adalah daftar folder tempat sistem operasi mencari program. Jika folder instalasi Python tidak ada di PATH, terminal tidak menemukan perintah `python`.',
          'Di Windows, centang **"Add python.exe to PATH"** saat install. Jika lupa, install ulang atau pakai perintah `py` (Python Launcher).',
        ]],
        ['Satu komputer, banyak Python', 'Wajar punya beberapa Python (bawaan sistem, Anaconda, versi lain). Selalu pastikan VS Code memakai interpreter yang sama dengan terminal: klik versi Python di pojok kanan bawah VS Code → pilih interpreter.'],
      ],
      examples: [
        {
          title: 'Cek lingkungan Python yang sedang dipakai',
          code: py`
import sys, platform  # sys: info interpreter, platform: info sistem operasi

print("Versi Python :", sys.version.split()[0])  # versi Python yang sedang dipakai
print("Lokasi       :", sys.executable)   # interpreter mana yang menjalankan kode ini
# nama sistem operasi dan jenis prosesor
print("Sistem       :", platform.system(), platform.machine())
print("Folder pencarian modul (3 teratas):")
for p in sys.path[:3]:  # sys.path = daftar folder tempat Python mencari modul
    print("  ", p or "(folder saat ini)")`,
        },
      ],
      mistakes: [
        ['Mengetik `python` di terminal lalu muncul Microsoft Store (Windows).', 'Matikan "App execution aliases" untuk python di Settings, atau install dari python.org dengan opsi PATH.'],
        ['Install library dengan `pip install` tapi tetap `ModuleNotFoundError`.', 'pip dan python berasal dari instalasi berbeda. Pakai `python -m pip install nama` agar pasti masuk ke Python yang sama.'],
        ['Menamai file `numpy.py` atau `random.py`.', 'Nama file jangan sama dengan nama library, karena Python akan mengimpor file milikmu, bukan library-nya.'],
      ],
      tips: [
        'Pakai Python versi stabil terbaru dikurangi satu (mis. kalau versi terbaru 3.15, pakai 3.14) agar library AI sudah mendukung.',
        'Install ekstensi VS Code: Python, Pylance, Jupyter. Aktifkan "Format on Save" dengan Black atau Ruff.',
        'Simpan semua proyek di satu folder induk, mis. `~/proyek`, dan hindari spasi di nama folder.',
      ],
      check: [
        ['Apa bedanya `pip install x` dengan `python -m pip install x`?', 'Yang kedua menjamin pip milik interpreter `python` yang sama yang akan menjalankan kode, sehingga library pasti terpasang di tempat yang benar.'],
        ['Kenapa file `random.py` di folder proyekmu bisa membuat `import random` rusak?', 'Python mencari modul mulai dari folder saat ini (lihat `sys.path`), sehingga file milikmu ditemukan lebih dulu daripada modul bawaan.'],
      ],
    },
  },
  terminal: {
    deep: {
      concepts: [
        ['Path absolut vs relatif', [
          '**Absolut** dimulai dari akar: `C:\\Users\\budi\\proyek` atau `/home/budi/proyek`. **Relatif** dihitung dari folder saat ini: `data/latih.csv`, `../gambar`.',
          '`.` artinya folder saat ini, `..` folder induk, `~` folder home. Banyak error "file not found" terjadi karena program dijalankan dari folder yang berbeda dengan yang dikira.',
        ]],
        ['Stdin, stdout, stderr, dan pipe', 'Setiap program punya input (stdin), output (stdout), dan output error (stderr). Tanda `>` menyimpan output ke file (`python latih.py > log.txt`), dan `|` mengalirkan output satu program ke program lain (`cat data.csv | head`).'],
        ['Exit code', 'Program yang selesai normal mengembalikan kode 0; selain 0 berarti gagal. Script otomatis (CI, Docker) memakai angka ini untuk tahu apakah langkah sebelumnya berhasil.'],
      ],
      examples: [
        {
          title: 'Path relatif, absolut, dan folder kerja dari Python',
          code: py`
import os  # os: berinteraksi dengan sistem operasi
from pathlib import Path  # Path: cara modern mengolah alamat file/folder

print("Folder kerja saat ini:", os.getcwd())  # folder tempat program dijalankan
Path("data/mentah").mkdir(parents=True, exist_ok=True)   # seperti: mkdir -p data/mentah
# buat file CSV kecil berisi 2 baris
Path("data/mentah/contoh.csv").write_text("a,b\n1,2\n")

p = Path("data/mentah/contoh.csv")  # objek Path menunjuk ke file itu
print("Relatif :", p)  # alamat relatif (dari folder kerja)
print("Absolut :", p.resolve())  # alamat lengkap dari akar disk
# cek file ada & ukurannya
print("Ada?    :", p.exists(), "| ukuran:", p.stat().st_size, "byte")
# daftar isi folder
print("Isi folder data/mentah:", [f.name for f in Path("data/mentah").iterdir()])`,
        },
      ],
      mistakes: [
        ['Menjalankan `python src/latih.py` dari folder lain, lalu `open("data.csv")` gagal.', 'Path relatif dihitung dari folder kerja, bukan lokasi file script. Pakai `Path(__file__).parent / "data.csv"` atau jalankan dari folder proyek.'],
        ['Memakai `rm -rf` atau `del /s` tanpa mengecek folder.', 'Jalankan `ls`/`dir` dulu, dan jangan pernah menghapus dengan path yang dibuat dari variabel kosong.'],
        ['Path dengan spasi tanpa tanda kutip: `cd Data Saya`.', 'Beri kutip: `cd "Data Saya"`, atau hindari spasi di nama folder.'],
      ],
      tips: [
        'Tekan **Tab** untuk melengkapi nama file dan **↑** untuk perintah sebelumnya.',
        'Pakai terminal terintegrasi VS Code (Ctrl+`) agar folder kerja otomatis = folder proyek.',
        'Di Python, pakai `pathlib.Path` daripada menyambung string dengan `/` atau `\\`, agar jalan di Windows maupun Linux.',
      ],
      check: [
        ['Kamu berada di `/home/budi/proyek/src`. Ke mana `cd ../data` membawamu?', 'Ke `/home/budi/proyek/data`: naik satu tingkat ke `proyek`, lalu masuk `data`.'],
        ['Apa arti `python latih.py > hasil.txt`?', 'Menjalankan script dan menyimpan semua output `print` ke file `hasil.txt` alih-alih menampilkannya di layar.'],
      ],
    },
  },
  git: {
    deep: {
      concepts: [
        ['Tiga area Git', [
          '**Working directory** (file yang kamu edit) → `git add` → **staging area** (daftar perubahan yang akan disimpan) → `git commit` → **repository** (riwayat permanen).',
          'Staging memungkinkan kamu memilih perubahan mana yang masuk ke satu commit, sehingga satu commit = satu perubahan logis.',
        ]],
        ['Branch dan merge', 'Branch adalah "jalur" kerja terpisah. Kerjakan fitur di `fitur-x`, lalu gabungkan ke `main` dengan merge atau Pull Request. Konflik terjadi jika dua branch mengubah baris yang sama; Git menandainya dengan `<<<<<<<` dan kamu yang memilih isi akhirnya.'],
        ['Git untuk proyek AI', 'Git cocok untuk **kode**, bukan untuk data besar atau file model (ratusan MB). Masukkan `data/`, `*.pt`, `*.pkl` ke `.gitignore`, lalu simpan data di cloud storage atau pakai DVC / Git LFS.'],
      ],
      examples: [
        {
          title: 'Alur kerja branch sehari-hari',
          runnable: false,
          code: py`
# Mulai fitur baru di branch terpisah
git switch -c fitur-preprocessing  # buat branch baru dan langsung pindah ke sana

# ...edit file...
git status                 # lihat apa yang berubah
git diff                   # lihat detail perubahan
git add src/preprocess.py  # masukkan file ke staging
git commit -m "Tambah fungsi bersihkan_teks"  # simpan sebagai satu commit

# Kirim ke GitHub lalu buat Pull Request
git push -u origin fitur-preprocessing  # kirim branch ke GitHub

# Setelah PR di-merge, kembali ke main dan perbarui
git switch main  # kembali ke branch utama
git pull  # ambil perubahan terbaru dari GitHub

# Salah commit? Batalkan commit terakhir tapi simpan perubahannya
git reset --soft HEAD~1`,
        },
        {
          title: 'Contoh .gitignore untuk proyek AI',
          runnable: false,
          code: py`
# Lingkungan & cache
.venv/
__pycache__/
.ipynb_checkpoints/

# Data & model (terlalu besar untuk Git)
data/
models/
*.pt
*.pkl
*.h5

# Rahasia
.env`,
        },
      ],
      mistakes: [
        ['Commit file `.env` berisi API key ke GitHub publik.', 'Masukkan `.env` ke `.gitignore` sejak awal. Jika telanjur, segera **cabut (revoke) key-nya** — menghapus commit saja tidak cukup.'],
        ['Pesan commit "update" atau "fix" untuk semua perubahan.', 'Tulis apa yang berubah: "Perbaiki split data agar stratified".'],
        ['Commit dataset 500 MB.', 'GitHub menolak file >100 MB. Pakai `.gitignore`, Git LFS, atau simpan di Google Drive / Hugging Face Datasets.'],
      ],
      tips: [
        'Commit kecil dan sering. Lebih mudah dilacak dan dibatalkan.',
        'Jalankan `git status` sebelum dan sesudah setiap perintah sampai terbiasa.',
        'Untuk notebook, bersihkan output sebelum commit (`nbstripout`) agar diff tidak berantakan.',
      ],
      check: [
        ['Apa beda `git add` dan `git commit`?', '`git add` memasukkan perubahan ke staging (menyiapkan), `git commit` menyimpan isi staging menjadi satu titik di riwayat.'],
        ['Kenapa file model `.pt` sebaiknya tidak di-commit?', 'Ukurannya besar dan biner, sehingga repositori membengkak dan diff tidak berguna. Simpan di storage terpisah dan catat versinya.'],
      ],
    },
  },
  notebook: {
    deep: {
      concepts: [
        ['Kernel dan state tersembunyi', [
          'Notebook terhubung ke **kernel**: proses Python yang menyimpan semua variabel. Urutan eksekusi sel (angka `[5]`, `[12]`) bisa berbeda dengan urutan sel di layar.',
          'Akibatnya notebook bisa "jalan" di komputermu tetapi gagal saat dijalankan dari atas. Sebelum dibagikan, selalu **Restart & Run All**.',
        ]],
        ['Kapan notebook, kapan file .py?', 'Notebook untuk eksplorasi, visualisasi, dan laporan. File `.py` untuk kode yang dipakai ulang, dites, dan dijalankan otomatis. Pola umum: eksplorasi di notebook, lalu pindahkan fungsi yang sudah stabil ke `src/`.'],
        ['Colab: GPU gratis dengan batasan', 'Sesi Colab terhapus saat idle/selesai. Simpan hasil ke Google Drive (`drive.mount`) dan atur Runtime → Change runtime type → GPU untuk deep learning.'],
      ],
      examples: [
        {
          title: 'Mengukur waktu & mengecek variabel (mirip magic command)',
          code: py`
import time  # modul untuk mengukur waktu

def proses(n):  # fungsi yang akan diukur
    return sum(i * i for i in range(n))  # jumlah kuadrat 0 sampai n-1

mulai = time.perf_counter()  # catat waktu mulai
hasil = proses(1_000_000)  # jalankan fungsinya
# waktu sekarang - waktu mulai = lama proses
print(f"Hasil: {hasil} | waktu: {time.perf_counter() - mulai:.3f} detik")

# Di Jupyter, %timeit proses(10000) mengukur rata-rata dari banyak percobaan,
# dan %whos menampilkan semua variabel di kernel. Versi manualnya:
print({k: type(v).__name__ for k, v in dict(globals()).items() if not k.startswith("_") and k in ("hasil", "mulai", "proses")})`,
        },
      ],
      mistakes: [
        ['Menghapus sel yang mendefinisikan variabel, tapi notebook tetap jalan karena variabel masih ada di kernel.', 'Restart kernel lalu Run All secara berkala untuk memastikan notebook bisa dijalankan ulang dari nol.'],
        ['Menyimpan path `C:\\Users\\budi\\...` di notebook yang dibagikan.', 'Pakai path relatif terhadap folder proyek.'],
        ['Melatih model berjam-jam di Colab tanpa menyimpan checkpoint.', 'Simpan model ke Drive setiap beberapa epoch.'],
      ],
      tips: [
        'Beri judul dengan sel Markdown, tulis kesimpulan di akhir notebook.',
        'Letakkan semua `import` dan konfigurasi di sel pertama.',
        'Shortcut penting: Shift+Enter (jalankan), A/B (sel baru atas/bawah), M (ubah ke Markdown), DD (hapus sel).',
      ],
      check: [
        ['Notebook temanmu error di sel ke-3 saat kamu jalankan, padahal di komputernya aman. Penyebab paling mungkin?', 'Notebook bergantung pada state tersembunyi: ada sel yang dulu dijalankan (atau sudah dihapus) yang mendefinisikan variabel. Solusinya Restart & Run All sebelum dibagikan.'],
      ],
    },
    exercise: {
      task: 'Ukur waktu menjumlahkan angka 1 sampai 5 juta dengan dua cara: loop `for` biasa dan fungsi `sum(range(...))`. Mana yang lebih cepat?',
      hint: 'Pakai `time.perf_counter()` sebelum dan sesudah setiap cara.',
      solution: py`
import time  # modul untuk mengukur waktu

n = 5_000_000  # lima juta angka
t0 = time.perf_counter()  # mulai mengukur cara 1
total = 0  # wadah penjumlahan
for i in range(1, n + 1):  # cara 1: loop for biasa
    total += i  # tambahkan satu per satu
t1 = time.perf_counter()  # selesai cara 1, mulai cara 2
total2 = sum(range(1, n + 1))  # cara 2: fungsi bawaan sum()
t2 = time.perf_counter()  # selesai cara 2

print(f"Loop for : {t1 - t0:.3f} s, hasil {total}")  # lama cara 1
print(f"sum()    : {t2 - t1:.3f} s, hasil {total2}")  # lama cara 2
print("sum() lebih cepat karena perulangannya dijalankan di kode C.")`,
    },
  },

  // ---------------- Python Dasar ----------------
  'py-variabel': {
    deep: {
      concepts: [
        ['Variabel adalah label, bukan kotak', [
          'Di Python, nilai (objek) hidup di memori dan variabel hanyalah **nama yang menunjuk** ke objek itu. `a = [1, 2]; b = a` membuat dua nama untuk list yang **sama**, sehingga mengubah `b` juga mengubah `a`.',
          '`id(x)` menunjukkan identitas objek. `a is b` bertanya "objek yang sama?", sedangkan `a == b` bertanya "nilainya sama?".',
        ]],
        ['Mutable vs immutable', '`int`, `float`, `str`, `tuple`, `bool` **immutable**: tidak bisa diubah, operasi apa pun membuat objek baru. `list`, `dict`, `set` **mutable**: bisa diubah di tempat. Perbedaan ini menjelaskan banyak bug, terutama saat mengoper data ke fungsi.'],
        ['Float tidak selalu tepat', '`0.1 + 0.2` menghasilkan `0.30000000000000004` karena komputer menyimpan desimal dalam basis 2. Untuk membandingkan float pakai `math.isclose`, dan untuk uang pakai bilangan bulat (rupiah) atau `decimal.Decimal`.'],
      ],
      examples: [
        {
          title: 'Label vs salinan, dan jebakan float',
          code: py`
import math  # modul matematika

a = [1, 2, 3]  # list baru
b = a            # b menunjuk list yang SAMA
c = a.copy()     # c adalah salinan baru
b.append(4)  # mengubah b ternyata juga mengubah a
print("a:", a, "| b:", b, "| c:", c)  # c tidak ikut berubah
# is = objek yang sama? == = isinya sama?
print("a is b?", a is b, "| a is c?", a is c, "| a == c?", a == c)

x = 10  # angka bulat
y = x  # y menunjuk nilai yang sama dengan x
y += 1           # int immutable: y menunjuk objek baru, x tidak berubah
print("x:", x, "| y:", y)  # x tetap 10

print(0.1 + 0.2 == 0.3, "->", 0.1 + 0.2)  # False! hasilnya 0.30000000000000004
print("isclose:", math.isclose(0.1 + 0.2, 0.3))  # cara benar membandingkan angka desimal
print("Pembulatan bankir:", round(2.5), round(3.5))   # 2 dan 4!`,
        },
      ],
      mistakes: [
        ['`if x == None:`', 'Pakai `if x is None:` karena None adalah objek tunggal.'],
        ['`total = "10" + 5` → TypeError.', 'Konversi dulu: `int("10") + 5`. Python tidak mengubah tipe secara otomatis antara teks dan angka.'],
        ['Memakai nama bawaan sebagai variabel: `list = [1, 2]`, `sum = 0`.', 'Nama itu menimpa fungsi bawaan, sehingga `list(...)` / `sum(...)` setelahnya error. Pakai `angka`, `total`.'],
      ],
      tips: [
        'Gunakan nama deskriptif `snake_case`: `jumlah_siswa`, bukan `js` atau `x1`.',
        'Konstanta ditulis huruf besar: `LEARNING_RATE = 0.001`.',
        'Pakai f-string untuk mencetak: `f"{nama} berumur {umur} tahun"`, dan `{x:.2f}` untuk 2 angka desimal.',
      ],
      check: [
        ['`a = [1]; b = a; b.append(2)`. Apa isi `a`?', '`[1, 2]`, karena `a` dan `b` menunjuk list yang sama.'],
        ['Kenapa `0.1 + 0.2 == 0.3` bernilai False?', 'Karena 0.1 dan 0.2 tidak bisa direpresentasikan persis dalam biner, sehingga hasilnya sedikit meleset. Bandingkan dengan `math.isclose`.'],
      ],
    },
  },
  'py-operator': {
    deep: {
      concepts: [
        ['Urutan operasi (precedence)', '`**` dihitung paling dulu, lalu `* / // %`, lalu `+ -`, lalu perbandingan, lalu `not`, `and`, `or`. Contoh: `-2 ** 2` = **-4** (pangkat dulu). Jika ragu, pakai kurung.'],
        ['Short-circuit', '`and` berhenti di nilai pertama yang False, `or` berhenti di nilai pertama yang True. Ini dipakai untuk keamanan: `if daftar and daftar[0] > 0:` tidak akan error walau daftar kosong.'],
        ['Truthy dan falsy', 'Nilai yang dianggap False: `0`, `0.0`, `""`, `[]`, `{}`, `None`. Semua lainnya True. Jadi `if nama:` berarti "jika nama tidak kosong".'],
        ['Pembagian bulat dan modulo dengan bilangan negatif', '`//` membulatkan ke **bawah** (menuju minus tak hingga): `-7 // 2 = -4`, dan `-7 % 2 = 1`. Selalu berlaku `(a // b) * b + a % b == a`.'],
      ],
      examples: [
        {
          title: 'Precedence, short-circuit, dan operator berantai',
          code: py`
print(-2 ** 2, (-2) ** 2)           # -4 dan 4
print(2 + 3 * 4 ** 2)               # 2 + 3*16 = 50
print(-7 // 2, -7 % 2)              # -4 dan 1

skor = 75
print(60 <= skor < 80)              # perbandingan berantai, sama dengan 60<=skor and skor<80

data = []
print(data and data[0] > 0)         # aman: berhenti di data (kosong = False)
nama = "" or "Tanpa nama"           # nilai default dengan or
print(nama)

x = 10
x += 5; x *= 2; x //= 3
print("x =", x)                     # (10+5)*2//3 = 10`,
        },
      ],
      mistakes: [
        ['`if x = 5:`', '`=` adalah penugasan, untuk membandingkan pakai `==`.'],
        ['`if nilai > 50 and < 80:`', 'Tulis lengkap `nilai > 50 and nilai < 80`, atau `50 < nilai < 80`.'],
        ['`10 / 2` diharapkan `5` tapi hasilnya `5.0`.', '`/` selalu menghasilkan float. Pakai `//` jika perlu bilangan bulat.'],
      ],
      tips: [
        'Pakai kurung untuk keterbacaan meski secara aturan tidak perlu.',
        'Pakai `divmod(a, b)` untuk mendapat hasil bagi dan sisa sekaligus, mis. mengubah detik ke menit+detik.',
      ],
      check: [
        ['Berapa hasil `2 ** 3 ** 2`?', '512, karena `**` dihitung dari kanan: `3 ** 2 = 9`, lalu `2 ** 9 = 512`.'],
        ['Apa hasil `[] or "kosong"`?', '`"kosong"`, karena list kosong falsy sehingga `or` mengembalikan nilai kedua.'],
      ],
    },
  },
  'py-kondisi': {
    deep: {
      concepts: [
        ['Urutan kondisi menentukan hasil', 'Python mengecek `if`/`elif` dari atas dan berhenti di kondisi True pertama. Untuk rentang nilai, urutkan dari yang paling ketat (`>= 90`, lalu `>= 80`, ...), jika tidak, nilai 95 bisa tertangkap di cabang `>= 60`.'],
        ['Guard clause: kurangi if bersarang', 'Daripada `if` di dalam `if` di dalam `if`, tangani kasus tidak valid lebih dulu lalu `return`. Kode jadi datar dan mudah dibaca.'],
        ['Ekspresi kondisional & match', '`status = "lulus" if nilai >= 60 else "remedial"` untuk pilihan sederhana. Python 3.10+ punya `match`/`case` untuk mencocokkan banyak pola (mirip switch).'],
      ],
      examples: [
        {
          title: 'Guard clause, ternary, dan match-case',
          code: py`
def kategori_bmi(berat, tinggi_cm):  # fungsi kategori BMI
    # guard clause: tangani input aneh dulu
    if berat <= 0 or tinggi_cm <= 0:
        return "data tidak valid"
    bmi = berat / (tinggi_cm / 100) ** 2  # rumus BMI (tinggi diubah ke meter)
    if bmi < 18.5:  # cek dari batas terkecil
        return f"{bmi:.1f} kurus"
    elif bmi < 25:
        return f"{bmi:.1f} normal"
    elif bmi < 30:
        return f"{bmi:.1f} gemuk"
    return f"{bmi:.1f} obesitas"  # sisa: semua yang >= 30

# uji beberapa pasangan berat & tinggi
for b, t in [(50, 170), (68, 170), (85, 170), (0, 170)]:
    print(b, t, "->", kategori_bmi(b, t))  # cetak hasil setiap pasangan

nilai = 72  # nilai ujian
# ekspresi kondisional satu baris: A if syarat else B
print("Status:", "lulus" if nilai >= 60 else "remedial")

def perintah(cmd):  # match-case: mencocokkan pola perintah
    match cmd.split():  # pecah perintah menjadi list kata
        case ["latih", epoch]:  # cocok jika berbentuk ['latih', <angka>]
            return f"melatih {epoch} epoch"
        case ["prediksi", *file]:  # *file menampung sisa kata
            return f"memprediksi {len(file)} file"
        case _:  # _ = pola lain apa pun
            return "perintah tidak dikenal"

# uji tiga perintah
print(perintah("latih 10"), "|", perintah("prediksi a.jpg b.jpg"), "|", perintah("halo"))`,
        },
      ],
      mistakes: [
        ['`if nilai >= 60: ... elif nilai >= 80:` (cabang 80 tidak pernah tercapai).', 'Urutkan dari kondisi paling ketat ke paling longgar.'],
        ['`if pilihan == "a" or "b":` (selalu True).', 'Tulis `pilihan == "a" or pilihan == "b"`, atau lebih rapi `pilihan in ("a", "b")`.'],
        ['Indentasi campur spasi dan tab.', 'Pakai 4 spasi; editor modern melakukannya otomatis.'],
      ],
      tips: [
        'Pakai `in` untuk mengecek keanggotaan: `if kota in {"Jakarta", "Bandung"}`.',
        'Jika `if-elif` sangat panjang dan hanya memetakan nilai, ganti dengan dictionary: `harga = {"S": 10, "M": 12}[ukuran]`.',
      ],
      check: [
        ['Kenapa `if x == 1 or 2:` selalu True?', 'Python membacanya `(x == 1) or 2`, dan `2` adalah nilai truthy.'],
        ['Apa keuntungan guard clause?', 'Kasus tidak valid ditangani di awal, sehingga logika utama tidak perlu bersarang dalam dan lebih mudah dibaca.'],
      ],
    },
  },
  'py-loop': {
    deep: {
      concepts: [
        ['Iterable: apa yang bisa di-loop', '`for` bisa dipakai pada apa pun yang *iterable*: list, string, dict, range, file, hasil `zip`, dan banyak lagi. Python memanggil `iter()` lalu `next()` berulang sampai habis.'],
        ['enumerate dan zip', '`enumerate(daftar)` memberi indeks + nilai sekaligus (tidak perlu `range(len(...))`). `zip(a, b)` memasangkan elemen dua daftar, berhenti di yang paling pendek.'],
        ['else pada loop', 'Blok `else` setelah `for`/`while` dijalankan hanya jika loop **tidak** dihentikan `break`. Berguna untuk pencarian: "jika tidak ketemu, lakukan ini".'],
        ['Kompleksitas: loop di dalam loop', 'Dua loop bersarang atas n data = n×n langkah. Untuk 10.000 data itu 100 juta langkah dan bisa sangat lambat. Di data science, sebisa mungkin ganti loop dengan operasi vektor NumPy/Pandas.'],
      ],
      examples: [
        {
          title: 'enumerate, zip, break/else, dan perbandingan kecepatan',
          code: py`
import time  # modul untuk mengukur waktu

nama = ["Ani", "Budi", "Citra"]  # nama siswa
nilai = [88, 72, 95]  # nilai siswa (urutan sama)
# enumerate memberi nomor, zip memasangkan nama & nilai
for i, (n, v) in enumerate(zip(nama, nilai), start=1):
    print(f"{i}. {n:6s} {v}")  # :6s = rata kiri selebar 6 karakter

# break + else: cari bilangan prima pertama di atas 90
for kandidat in range(91, 200):  # coba setiap angka dari 91
    for pembagi in range(2, int(kandidat ** 0.5) + 1):  # cek pembagi sampai akar kuadratnya
        if kandidat % pembagi == 0:  # habis dibagi berarti bukan prima
            break                 # bukan prima, coba kandidat berikut
    else:  # else pada for: jalan jika loop TIDAK dihentikan break
        print("Prima pertama di atas 90:", kandidat)  # berarti kandidat ini prima
        break  # hentikan loop luar

# Loop Python vs operasi vektor NumPy
import numpy as np  # NumPy untuk operasi vektor
data = list(range(1_000_000))  # sejuta angka dalam list
# kalikan 2 dengan list comprehension, ukur waktunya
t = time.perf_counter(); hasil = [x * 2 for x in data]; t1 = time.perf_counter() - t
arr = np.arange(1_000_000)  # sejuta angka dalam array NumPy
# kalikan 2 sekaligus, ukur waktunya
t = time.perf_counter(); hasil2 = arr * 2; t2 = time.perf_counter() - t
# bandingkan (ms = milidetik)
print(f"Loop Python: {t1*1000:.1f} ms | NumPy: {t2*1000:.1f} ms")`,
        },
      ],
      mistakes: [
        ['Mengubah list (hapus elemen) sambil di-loop.', 'Loop di salinannya (`for x in daftar[:]`) atau buat list baru dengan comprehension.'],
        ['`while` yang lupa memperbarui variabel kondisi → loop tak berujung.', 'Pastikan ada baris yang mengubah kondisi, atau ada `break` yang pasti tercapai.'],
        ['`for i in range(len(daftar)): print(daftar[i])`', 'Lebih Pythonic: `for x in daftar:` atau `for i, x in enumerate(daftar):`.'],
      ],
      tips: [
        'Pakai `range(start, stop, step)`; ingat `stop` tidak ikut.',
        'Untuk progres loop panjang (training), library `tqdm` menampilkan progress bar.',
        'Pakai `continue` untuk melewati data yang tidak valid tanpa keluar dari loop.',
      ],
      check: [
        ['Kapan blok `else` pada `for` dijalankan?', 'Saat loop selesai normal tanpa `break`.'],
        ['Apa hasil `list(zip([1,2,3], "ab"))`?', '`[(1, "a"), (2, "b")]`, zip berhenti di daftar terpendek.'],
      ],
    },
  },
  'py-koleksi': {
    deep: {
      concepts: [
        ['Memilih struktur data yang tepat', [
          '**list**: berurutan, boleh duplikat, bisa diubah. **tuple**: seperti list tapi tidak bisa diubah, cocok untuk data tetap (koordinat, baris database). **dict**: pasangan kunci→nilai. **set**: kumpulan unik tanpa urutan.',
          'Mencari `x in list` harus memeriksa satu per satu (lambat untuk data besar), sedangkan `x in set` atau `x in dict` hampir instan karena memakai **hash table**.',
        ]],
        ['Slicing', '`daftar[awal:akhir:langkah]`. `a[-1]` elemen terakhir, `a[::-1]` dibalik, `a[:3]` tiga pertama. Slicing membuat salinan (dangkal).'],
        ['Shallow vs deep copy', '`.copy()` hanya menyalin lapisan luar. Jika isinya list/dict lagi, bagian dalam masih dipakai bersama. Untuk salinan penuh pakai `copy.deepcopy`.'],
        ['Modul collections', '`Counter` menghitung frekuensi, `defaultdict` membuat nilai awal otomatis, `deque` antrian cepat di kedua ujung. Sangat sering dipakai di NLP (menghitung kata).'],
      ],
      examples: [
        {
          title: 'set vs list, Counter, defaultdict, dan deepcopy',
          code: py`
import time, copy  # time untuk mengukur, copy untuk menyalin
# Counter menghitung, defaultdict membuat nilai awal otomatis
from collections import Counter, defaultdict

angka_list = list(range(200_000))  # 200 ribu angka dalam list
angka_set = set(angka_list)  # angka yang sama dalam set
# cari 200 angka di list (diperiksa satu per satu)
t = time.perf_counter(); [x in angka_list for x in range(199_000, 199_200)]; t1 = time.perf_counter() - t
# cari di set (langsung lewat hash)
t = time.perf_counter(); [x in angka_set for x in range(199_000, 199_200)]; t2 = time.perf_counter() - t
print(f"Cari di list: {t1*1000:.2f} ms | di set: {t2*1000:.3f} ms")  # set jauh lebih cepat

teks = "makan nasi makan ayam minum teh makan lagi"  # kalimat contoh
hitung = Counter(teks.split())  # hitung setiap kata
print("Kata terbanyak:", hitung.most_common(2))  # 2 kata terbanyak

per_huruf = defaultdict(list)          # tidak perlu cek "apakah kunci sudah ada"
for kata in teks.split():  # kelompokkan kata berdasarkan huruf awal
    per_huruf[kata[0]].append(kata)  # langsung append tanpa membuat list dulu
print(dict(per_huruf))  # tampilkan sebagai dict biasa

asli = {"nilai": [80, 90]}  # dict berisi list (berlapis)
dangkal = asli.copy(); dalam = copy.deepcopy(asli)  # salinan dangkal vs salinan dalam
asli["nilai"].append(100)  # ubah list di dalam dict asli
# salinan dangkal ikut berubah, deepcopy tidak
print("dangkal ikut berubah:", dangkal, "| deep copy aman:", dalam)

# [:3] tiga pertama, [-2:] dua terakhir, [::-2] mundur loncat 2
print("Slicing:", angka_list[:3], angka_list[-2:], [1, 2, 3, 4, 5][::-2])`,
        },
      ],
      mistakes: [
        ['`d["kunci"]` padahal kunci belum tentu ada → KeyError.', 'Pakai `d.get("kunci", nilai_default)`.'],
        ['Mengira set menjaga urutan.', 'Set tidak berurutan; jika butuh urutan unik, pakai `list(dict.fromkeys(daftar))`.'],
        ['`(5)` dikira tuple.', 'Tuple satu elemen butuh koma: `(5,)`.'],
      ],
      tips: [
        'Pakai unpacking: `x, y = titik`, `pertama, *sisa = daftar`.',
        'Gabungkan dict dengan `{**a, **b}` atau `a | b` (Python 3.9+).',
        'Urutkan berdasarkan kunci: `sorted(siswa, key=lambda s: s["nilai"], reverse=True)`.',
      ],
      check: [
        ['Struktur apa yang paling cocok untuk mengecek apakah sebuah kata termasuk daftar 50.000 stopword?', '`set`, karena pengecekan `in` hampir instan berkat hash table.'],
        ['Kenapa list tidak bisa jadi kunci dict, tetapi tuple bisa?', 'Kunci dict harus hashable (tidak berubah). List bisa diubah, tuple tidak.'],
      ],
    },
  },
  'py-string': {
    deep: {
      concepts: [
        ['String immutable', 'Setiap operasi string (`upper`, `replace`, `+`) membuat string baru. Menyambung ribuan string dengan `+` di loop lambat; kumpulkan di list lalu `"".join(list)`.'],
        ['Unicode dan encoding', 'String Python adalah teks Unicode (bisa emoji, aksara Jawa, huruf Arab). Saat disimpan ke file/jaringan, teks diubah ke byte memakai **encoding**, hampir selalu `utf-8`. Error `UnicodeDecodeError` berarti file dibaca dengan encoding yang salah.'],
        ['Format angka dengan f-string', '`{x:,}` pemisah ribuan, `{x:.2%}` persen, `{x:>8}` rata kanan 8 karakter, `{x:08.3f}` diisi nol. Sangat berguna untuk laporan hasil model.'],
      ],
      examples: [
        {
          title: 'Membersihkan teks ulasan (dasar NLP)',
          code: py`
import string  # berisi daftar tanda baca (string.punctuation)

ulasan = "  Produk BAGUS bgt!!! Pengiriman cepat :) 10/10, recommended   "  # ulasan mentah
bersih = ulasan.strip().lower()  # buang spasi tepi, jadikan huruf kecil
bersih = bersih.translate(str.maketrans("", "", string.punctuation))  # hapus tanda baca
kata = bersih.split()  # pecah menjadi kata
print(kata)  # lihat hasilnya

# kamus kata gaul -> kata baku
normalisasi = {"bgt": "banget", "recommended": "direkomendasikan"}
kata = [normalisasi.get(k, k) for k in kata]  # ganti kata yang ada di kamus, sisanya tetap
print(" ".join(kata))  # gabungkan lagi menjadi kalimat

# Format angka
akurasi, jumlah = 0.91234, 1234567  # dua angka contoh
# .2% = persen 2 desimal, :, = pemisah ribuan, :>6 = rata kanan 6 karakter
print(f"Akurasi: {akurasi:.2%} | Data: {jumlah:,} baris | [{'OK':>6}]")

# Encoding
teks = "Café ☕"  # teks berisi huruf beraksen dan emoji
b = teks.encode("utf-8")  # ubah teks menjadi byte
# jumlah karakter tidak sama dengan jumlah byte
print(b, "->", len(teks), "karakter,", len(b), "byte")
print(b.decode("utf-8"))  # ubah byte kembali menjadi teks`,
        },
      ],
      mistakes: [
        ['`teks.replace("a", "b")` lalu heran `teks` tidak berubah.', 'String immutable; simpan hasilnya: `teks = teks.replace("a", "b")`.'],
        ['Membuka CSV berbahasa Indonesia tanpa encoding lalu huruf rusak.', 'Tulis `open(f, encoding="utf-8")`, dan untuk file Excel Windows coba `encoding="utf-8-sig"` atau `"latin-1"`.'],
        ['`hasil += teks` di loop jutaan kali.', 'Kumpulkan ke list lalu `"".join(...)`.'],
      ],
      tips: [
        'Untuk pola kompleks (email, nomor HP), pakai regular expression (modul `re`).',
        'Method berguna: `startswith`, `endswith`, `find`, `count`, `zfill`, `title`, `isdigit`.',
      ],
      check: [
        ['Apa hasil `"a,b,,c".split(",")`?', '`["a", "b", "", "c"]`, string kosong tetap muncul di antara dua koma.'],
        ['Kenapa `len("é")` bisa 1, tetapi `len("é".encode())` 2?', 'Satu karakter Unicode bisa membutuhkan lebih dari satu byte dalam UTF-8.'],
      ],
    },
    exercise: {
      task: 'Diberi kalimat `"Saya suka AI. AI membantu saya belajar, dan saya suka belajar!"`, hitung 3 kata yang paling sering muncul (abaikan huruf besar/kecil dan tanda baca).',
      hint: 'lower() → hapus tanda baca dengan translate → split() → collections.Counter → most_common(3).',
      solution: py`
import string  # daftar tanda baca
from collections import Counter  # penghitung frekuensi

# kalimat yang akan dihitung
kalimat = "Saya suka AI. AI membantu saya belajar, dan saya suka belajar!"
# huruf kecil + buang tanda baca
bersih = kalimat.lower().translate(str.maketrans("", "", string.punctuation))
print(Counter(bersih.split()).most_common(3))  # 3 kata terbanyak`,
    },
  },
  'py-fungsi': {
    deep: {
      concepts: [
        ['Scope: LEGB', 'Python mencari nama variabel berurutan: **L**ocal (di fungsi) → **E**nclosing (fungsi luar) → **G**lobal (modul) → **B**uilt-in. Variabel yang dibuat di dalam fungsi hilang setelah fungsi selesai.'],
        ['Argumen fleksibel', '`def f(a, b=2, *args, key=None, **kwargs)`: parameter wajib, default, `*args` (sisa argumen posisi sebagai tuple), keyword-only, `**kwargs` (sisa argumen bernama sebagai dict). Ini pola yang sering kamu temui di library ML, mis. `model.fit(X, y, **params)`.'],
        ['Jebakan default mutable', 'Nilai default dibuat **sekali** saat fungsi didefinisikan. `def tambah(x, daftar=[])` akan memakai list yang sama di setiap panggilan. Pakai `daftar=None` lalu buat list baru di dalam.'],
        ['Fungsi adalah objek', 'Fungsi bisa disimpan di variabel, dimasukkan ke list, dan dikirim sebagai argumen (`sorted(data, key=fungsi)`). Ini dasar dari callback dan decorator.'],
      ],
      examples: [
        {
          title: '*args, **kwargs, default mutable, dan fungsi sebagai argumen',
          code: py`
def rata_rata(*angka, bulat=False):  # *angka: berapa pun argumen; bulat: parameter bernama
    if not angka:  # tidak ada angka sama sekali
        return 0  # kembalikan 0 agar tidak membagi dengan nol
    hasil = sum(angka) / len(angka)  # hitung rata-rata
    return round(hasil) if bulat else hasil  # bulatkan hanya jika diminta

# tiga cara memanggil fungsi yang sama
print(rata_rata(80, 90, 75), rata_rata(80, 90, 75, bulat=True), rata_rata())

def latih(model, **params):  # **params: menampung argumen bernama sebagai dict
    print(f"Melatih {model} dengan", params)  # params berisi semua argumen bernama
# mirip cara mengatur model di scikit-learn
latih("RandomForest", n_estimators=100, max_depth=5)

def tambah_salah(x, daftar=[]):  # default berupa list: dibuat SEKALI dan dipakai bersama
    daftar.append(x); return daftar  # list yang sama terus bertambah
print(tambah_salah(1), tambah_salah(2))      # [1, 2] [1, 2]  <- bug!

def tambah_benar(x, daftar=None):  # pakai None sebagai default
    daftar = [] if daftar is None else daftar  # buat list baru di setiap panggilan
    daftar.append(x); return daftar  # tambahkan lalu kembalikan
print(tambah_benar(1), tambah_benar(2))      # [1] [2]

def terapkan(fungsi, data):  # fungsi bisa dikirim sebagai argumen
    return [fungsi(x) for x in data]  # terapkan fungsi itu ke setiap data
# kirim lambda dan method bawaan
print(terapkan(lambda x: x ** 2, [1, 2, 3]), terapkan(str.upper, ["a", "b"]))`,
        },
      ],
      mistakes: [
        ['Fungsi mencetak hasil (`print`) padahal hasilnya dibutuhkan lagi.', 'Gunakan `return`; biarkan pemanggil yang memutuskan mencetak atau tidak.'],
        ['Mengubah variabel global dari dalam fungsi.', 'Kirim nilai lewat parameter dan kembalikan hasil lewat `return`. Fungsi tanpa efek samping lebih mudah dites.'],
        ['Satu fungsi 200 baris yang melakukan semuanya.', 'Pecah: satu fungsi = satu tugas (muat data, bersihkan, latih, evaluasi).'],
      ],
      tips: [
        'Tulis docstring singkat: apa input, apa output.',
        'Panggil dengan argumen bernama jika maknanya tidak jelas: `split(data, rasio_uji=0.2)`.',
        'Tambahkan type hint: `def luas(r: float) -> float:`.',
      ],
      check: [
        ['Kenapa `def f(x, hasil=[])` berbahaya?', 'List default dibuat sekali dan dipakai bersama oleh semua panggilan, sehingga data menumpuk antar panggilan.'],
        ['Apa isi `args` pada `def f(*args)` saat dipanggil `f(1, 2, 3)`?', 'Tuple `(1, 2, 3)`.'],
      ],
    },
  },
  'py-file': {
    deep: {
      concepts: [
        ['Context manager (`with`)', '`with open(...) as f:` menjamin file ditutup walaupun terjadi error di tengah jalan. File yang tidak ditutup bisa membuat data tidak tersimpan penuh atau terkunci.'],
        ['Mode file', '`"r"` baca, `"w"` tulis (menimpa!), `"a"` tambah di akhir, `"x"` buat baru (gagal jika sudah ada), tambahkan `"b"` untuk biner (gambar, model).'],
        ['Membaca file besar', '`f.read()` memuat seluruh file ke memori. Untuk file berukuran GB, iterasi per baris (`for baris in f:`) atau baca per potongan, misalnya `pd.read_csv(..., chunksize=10000)`.'],
        ['Format umum di AI', 'CSV (tabel), JSON (konfigurasi, respons API), JSONL (satu JSON per baris, populer untuk dataset LLM), Parquet (tabel besar, cepat dan terkompresi), pickle/joblib (objek Python, model).'],
      ],
      examples: [
        {
          title: 'CSV, JSON, dan JSONL dengan aman',
          code: py`
import csv, json  # csv & json bawaan Python
from pathlib import Path  # Path untuk alamat file

folder = Path("contoh_data"); folder.mkdir(exist_ok=True)  # buat folder jika belum ada

# CSV
# tulis CSV; newline='' mencegah baris kosong di Windows
with open(folder / "siswa.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["nama", "nilai"])  # penulis CSV yang menerima dict
    w.writeheader()  # tulis baris judul kolom
    # tulis semua baris data
    w.writerows([{"nama": "Ani", "nilai": 88}, {"nama": "Budi", "nilai": 72}])
with open(folder / "siswa.csv", encoding="utf-8") as f:  # baca kembali
    for baris in csv.DictReader(f):  # setiap baris menjadi dict
        # isi CSV berupa teks, jadi diubah int() dulu
        print(baris["nama"], int(baris["nilai"]) + 5)

# JSON (konfigurasi)
# konfigurasi eksperimen sebagai dict
konfig = {"model": "rf", "params": {"n_estimators": 100}, "fitur": ["umur", "gaji"]}
# simpan sebagai teks JSON yang rapi
(folder / "konfig.json").write_text(json.dumps(konfig, indent=2), encoding="utf-8")
# baca, ubah ke dict, lalu ambil bagian params
print(json.loads((folder / "konfig.json").read_text(encoding="utf-8"))["params"])

# JSONL (dataset LLM): satu objek per baris, bisa dibaca baris demi baris
# dua contoh data untuk melatih LLM
data = [{"prompt": "Ibukota Indonesia?", "jawaban": "Jakarta"},
        {"prompt": "2+2?", "jawaban": "4"}]
with open(folder / "data.jsonl", "w", encoding="utf-8") as f:  # tulis JSONL
    for d in data:  # untuk setiap data
        # satu objek JSON per baris; ensure_ascii=False agar huruf tetap utuh
        f.write(json.dumps(d, ensure_ascii=False) + "\n")
with open(folder / "data.jsonl", encoding="utf-8") as f:  # baca JSONL
    for i, baris in enumerate(f):  # baca baris demi baris (hemat memori)
        print(i, json.loads(baris))  # ubah setiap baris menjadi dict`,
        },
      ],
      mistakes: [
        ['Membuka dengan mode `"w"` padahal ingin menambah data.', '`"w"` mengosongkan file. Pakai `"a"` untuk menambah.'],
        ['`open()` tanpa `with` dan lupa `close()`.', 'Selalu pakai `with`.'],
        ['Membaca angka dari CSV lalu langsung dijumlah.', 'Semua isi CSV terbaca sebagai teks; konversi dulu dengan `int()`/`float()` atau pakai Pandas.'],
      ],
      tips: [
        'Selalu tulis `encoding="utf-8"` agar konsisten di semua OS.',
        'Untuk tabel, langsung pakai `pandas.read_csv` / `to_csv`.',
        'Jangan memuat pickle dari sumber yang tidak dipercaya: pickle bisa menjalankan kode berbahaya.',
      ],
      check: [
        ['Kenapa JSONL lebih cocok daripada satu file JSON besar untuk dataset jutaan baris?', 'JSONL bisa dibaca dan ditulis baris demi baris tanpa memuat semuanya ke memori, dan baris baru bisa ditambahkan dengan mudah.'],
      ],
    },
    exercise: {
      task: 'Tulis 5 baris log ke file `log.txt` (mode tambah), lalu baca kembali dan hitung berapa baris yang mengandung kata "ERROR".',
      hint: 'Pakai `with open("log.txt", "a")` untuk menulis, lalu loop setiap baris saat membaca dan cek `"ERROR" in baris`.',
      solution: py`
# isi log contoh
log = ["INFO mulai", "ERROR data kosong", "INFO latih", "ERROR GPU habis", "INFO selesai"]
with open("log.txt", "w", encoding="utf-8") as f:   # kosongkan dulu agar hasil konsisten
    pass
with open("log.txt", "a", encoding="utf-8") as f:  # 'a' = mode tambah di akhir file
    for baris in log:  # tulis setiap baris
        f.write(baris + "\n")  # \n = pindah baris

with open("log.txt", encoding="utf-8") as f:  # buka untuk dibaca
    # hitung baris yang mengandung kata ERROR
    jumlah_error = sum(1 for baris in f if "ERROR" in baris)
print("Baris ERROR:", jumlah_error)  # tampilkan hasilnya`,
    },
  },
  'py-error': {
    deep: {
      concepts: [
        ['Membaca traceback dari bawah', 'Baris **terakhir** traceback berisi jenis error dan pesannya (mis. `KeyError: "umur"`). Baris di atasnya menunjukkan urutan pemanggilan fungsi; cari baris paling bawah yang merupakan **file milikmu**, di situlah biasanya letak masalahnya.'],
        ['try / except / else / finally', '`try` berisi kode yang mungkin gagal, `except` menangani error tertentu, `else` jalan jika tidak ada error, `finally` **selalu** jalan (cocok untuk menutup koneksi atau membersihkan sumber daya).'],
        ['Tangkap error yang spesifik', '`except Exception:` atau `except:` menelan semua error, termasuk bug yang seharusnya terlihat. Tangkap hanya yang kamu tahu cara menanganinya, mis. `except FileNotFoundError:`.'],
        ['raise dan exception buatan sendiri', 'Gunakan `raise ValueError("pesan jelas")` untuk menolak input yang salah sedini mungkin. Untuk aplikasi besar, buat kelas error sendiri: `class DataTidakValid(Exception): pass`.'],
      ],
      examples: [
        {
          title: 'Validasi input, retry, dan finally',
          code: py`
import random  # untuk simulasi kegagalan acak

class DataTidakValid(Exception):  # membuat jenis error sendiri
    pass  # tidak perlu isi tambahan

def hitung_bmi(berat, tinggi_cm):  # fungsi yang menolak input tidak masuk akal
    if tinggi_cm <= 0:  # cek input lebih dulu
        # raise = lempar error dengan pesan jelas
        raise DataTidakValid(f"tinggi harus > 0, didapat {tinggi_cm}")
    return berat / (tinggi_cm / 100) ** 2  # rumus BMI jika input valid

# tiga data: normal, tinggi 0, dan tipe salah
for data in [(60, 170), (60, 0), ("enam puluh", 170)]:
    try:  # coba hitung
        bmi = hitung_bmi(*data)  # *data membongkar tuple menjadi dua argumen
    except DataTidakValid as e:  # tangkap error buatan kita
        print("Ditolak  :", e)
    except TypeError:  # tangkap error tipe (teks dibagi angka)
        print("Tipe salah:", data)
    else:  # else: jalan hanya jika TIDAK ada error
        print(f"BMI {bmi:.1f}")
    finally:  # finally: selalu jalan, error atau tidak
        print("  (selesai memproses", data, ")")

# Pola retry: coba ulang operasi yang kadang gagal (mis. request API)
random.seed(1)  # seed agar hasil acaknya sama setiap dijalankan
def panggil_api():  # API tiruan yang kadang gagal
    if random.random() < 0.6:  # 60% kemungkinan gagal
        raise ConnectionError("server sibuk")
    return "data OK"  # berhasil

for percobaan in range(1, 6):  # coba maksimal 5 kali
    try:
        print("Percobaan", percobaan, "->", panggil_api())  # jika berhasil, cetak hasilnya
        break  # lalu hentikan loop
    except ConnectionError as e:  # jika gagal, catat dan coba lagi
        print("Percobaan", percobaan, "gagal:", e)`,
        },
      ],
      mistakes: [
        ['`except: pass` di mana-mana.', 'Error jadi tersembunyi dan bug sulit dilacak. Minimal catat errornya, dan tangkap jenis spesifik.'],
        ['Membungkus 50 baris kode dalam satu `try`.', 'Bungkus hanya baris yang memang bisa gagal, agar jelas error dari mana.'],
        ['Pesan error tidak informatif: `raise Exception("error")`.', 'Sertakan konteks: nilai yang diterima dan yang diharapkan.'],
      ],
      tips: [
        'Error umum di AI: `ShapeError`/`ValueError` (dimensi tidak cocok), `KeyError` (kolom tidak ada), `MemoryError`, `CUDA out of memory`.',
        'Pakai `assert` untuk cek asumsi saat pengembangan: `assert X.shape[0] == len(y)`.',
        'Pakai modul `logging` alih-alih `print` untuk aplikasi yang berjalan lama.',
      ],
      check: [
        ['Kapan blok `finally` dijalankan?', 'Selalu, baik ada error maupun tidak, bahkan jika ada `return` di dalam `try`.'],
        ['Kenapa `except Exception:` yang terlalu luas berbahaya?', 'Ia juga menangkap bug yang tidak terduga (salah ketik nama variabel, dll.), sehingga program diam-diam berjalan dengan hasil salah.'],
      ],
    },
    exercise: {
      task: 'Buat fungsi `bagi_aman(a, b)` yang mengembalikan `a / b`, mengembalikan `None` dan mencetak pesan jika `b` nol, serta menolak input bukan angka dengan `TypeError` yang jelas.',
      hint: 'Cek tipe dengan `isinstance(x, (int, float))` lalu `raise TypeError(...)`; tangkap `ZeroDivisionError` dengan try/except.',
      solution: py`
def bagi_aman(a, b):  # fungsi pembagian yang memeriksa input
    for x in (a, b):  # cek kedua argumen
        if not isinstance(x, (int, float)):  # isinstance: apakah x berupa int atau float?
            raise TypeError(f"harus angka, didapat {x!r}")  # tolak dengan pesan yang jelas
    try:  # coba bagi
        return a / b
    except ZeroDivisionError:  # b = 0
        print("Tidak bisa membagi dengan nol")  # beri tahu pengguna
        return None  # kembalikan None sebagai tanda gagal

print(bagi_aman(10, 4))  # normal: 2.5
print(bagi_aman(10, 0))  # pembagian dengan nol ditangani
try:  # coba input yang salah tipe
    bagi_aman("10", 2)
except TypeError as e:  # tangkap TypeError yang kita lempar
    print("TypeError:", e)  # tampilkan pesannya`,
    },
  },

  // ---------------- Python Lanjutan ----------------
  'pyl-oop': {
    deep: {
      concepts: [
        ['Kenapa OOP penting di AI', 'Hampir semua library AI berbasis class: `model = RandomForestClassifier()` adalah object, `fit`/`predict` adalah method, dan di PyTorch kamu **membuat class sendiri** yang mewarisi `nn.Module`. Memahami OOP membuat kode library mudah dibaca.'],
        ['Pewarisan & override', 'Class anak mewarisi atribut dan method induk, lalu bisa mengganti (override) sebagian. `super().__init__()` memanggil konstruktor induk agar inisialisasinya tetap jalan.'],
        ['Dunder method', 'Method berawalan dan berakhiran `__` membuat object berperilaku seperti tipe bawaan: `__repr__` (tampilan), `__len__` (`len(obj)`), `__getitem__` (`obj[i]`), `__call__` (`obj(x)`). PyTorch `Dataset` memakai `__len__` dan `__getitem__`.'],
        ['dataclass', '`@dataclass` membuat `__init__`, `__repr__`, `__eq__` otomatis untuk class yang isinya terutama data, misalnya konfigurasi eksperimen.'],
      ],
      examples: [
        {
          title: 'Meniru pola scikit-learn & PyTorch: fit/predict, Dataset, dataclass',
          code: py`
from dataclasses import dataclass, field  # dataclass untuk class berisi data

class ModelDasar:  # class induk: kerangka umum sebuah model
    def fit(self, X, y):  # wajib diisi oleh class anak
        raise NotImplementedError  # lempar error jika lupa diisi
    def predict(self, X):
        raise NotImplementedError
    def score(self, X, y):  # score sama untuk semua model: bisa dipakai bersama
        pred = self.predict(X)  # tebak dulu
        # persentase tebakan yang benar
        return sum(p == t for p, t in zip(pred, y)) / len(y)

class TebakMayoritas(ModelDasar):          # baseline paling sederhana
    def fit(self, X, y):  # belajar: cari kelas yang paling sering muncul
        self.kelas_ = max(set(y), key=y.count)
        return self                          # agar bisa .fit(...).predict(...)
    def predict(self, X):  # tebak kelas yang sama untuk semua data
        return [self.kelas_] * len(X)
    def __repr__(self):  # tampilan saat objek di-print
        return f"TebakMayoritas(kelas={getattr(self, 'kelas_', '?')})"

X = [[1], [2], [3], [4], [5]]  # fitur (tidak dipakai oleh model ini)
y = ["ya", "ya", "tidak", "ya", "tidak"]  # label
m = TebakMayoritas().fit(X, y)  # latih lalu simpan objeknya
print(m, "| akurasi:", m.score(X, y))  # akurasi baseline

class DatasetAngka:                          # mirip torch.utils.data.Dataset
    def __init__(self, n):  # simpan data sebagai pasangan (angka, ganjil/genap)
        self.data = [(i, i % 2) for i in range(n)]
    def __len__(self):  # membuat len(ds) bekerja
        return len(self.data)
    def __getitem__(self, idx):  # membuat ds[i] bekerja
        return self.data[idx]

ds = DatasetAngka(6)  # buat dataset berisi 6 data
# dipakai seperti list biasa
print("Panjang:", len(ds), "| item ke-3:", ds[3], "| 2 pertama:", [ds[i] for i in range(2)])

@dataclass  # otomatis membuat __init__, __repr__, __eq__
class Konfig:  # konfigurasi eksperimen
    lr: float = 0.001  # learning rate dengan nilai default
    epoch: int = 10  # jumlah epoch
    # default berupa list harus memakai default_factory
    fitur: list = field(default_factory=lambda: ["umur", "gaji"])

k = Konfig(epoch=20)  # ubah epoch saja, sisanya default
print(k, "| sama?", k == Konfig(epoch=20))  # dua objek dengan isi sama dianggap sama`,
        },
      ],
      mistakes: [
        ['Lupa `self` sebagai parameter pertama method.', 'Setiap method instance butuh `self`: `def predict(self, X):`.'],
        ['Membuat class untuk segala hal, padahal cukup fungsi.', 'Pakai class jika ada **state** (data yang diingat) + perilaku. Jika hanya perhitungan, fungsi lebih sederhana.'],
        ['Lupa `super().__init__()` di class turunan.', 'Inisialisasi induk tidak jalan; di PyTorch ini membuat error saat menambah layer.'],
      ],
      tips: [
        'Atribut hasil training diberi akhiran `_` (konvensi scikit-learn): `coef_`, `classes_`.',
        'Kembalikan `self` dari `fit` agar bisa chaining.',
        'Implementasikan `__repr__` agar object mudah di-debug saat dicetak.',
      ],
      check: [
        ['Method dunder apa yang membuat `len(dataset)` dan `dataset[5]` bekerja?', '`__len__` dan `__getitem__`.'],
        ['Kenapa `fit` di scikit-learn mengembalikan `self`?', 'Agar bisa ditulis berantai: `model.fit(X, y).predict(X_baru)`.'],
      ],
    },
    exercise: {
      task: 'Buat class `Normalisasi` dengan method `fit(data)` yang menyimpan nilai min dan max, dan `transform(data)` yang mengubah data ke rentang 0–1. Uji dengan `[10, 20, 30, 40]`.',
      hint: 'Simpan `self.min_` dan `self.max_` di fit, lalu `(x - min) / (max - min)` di transform. Kembalikan `self` dari fit.',
      solution: py`
class Normalisasi:  # meniru gaya scikit-learn: fit lalu transform
    def fit(self, data):  # fit: pelajari min & max dari data latih
        # simpan sebagai atribut (akhiran _ = hasil belajar)
        self.min_, self.max_ = min(data), max(data)
        return self  # kembalikan objeknya agar bisa dirangkai
    def transform(self, data):  # transform: terapkan ke data mana pun
        rentang = self.max_ - self.min_ or 1   # cegah bagi nol
        # ubah setiap nilai ke rentang 0 sampai 1
        return [(x - self.min_) / rentang for x in data]

n = Normalisasi().fit([10, 20, 30, 40])  # pelajari dari data latih
print(n.transform([10, 20, 30, 40]))  # hasil: [0.0, 0.33, 0.67, 1.0]
print(n.transform([25, 50]))   # data baru memakai min/max dari data latih`,
    },
  },
  'pyl-modul': {
    deep: {
      concepts: [
        ['Bagaimana `import` bekerja', 'Python mencari modul di `sys.path` (folder script, lalu site-packages tempat pip memasang library). Modul hanya dijalankan **sekali**; import berikutnya memakai yang sudah tersimpan di `sys.modules`.'],
        ['`if __name__ == "__main__":`', 'Kode di bawah blok ini hanya jalan jika file dijalankan langsung (`python file.py`), tidak saat file di-import. Pola ini membuat file bisa sekaligus menjadi modul dan script.'],
        ['Struktur proyek AI yang umum', '`src/` (kode: data.py, model.py, train.py), `notebooks/`, `data/`, `models/`, `tests/`, `requirements.txt`, `README.md`. File `__init__.py` menandai folder sebagai package.'],
        ['Versi library', 'Library AI cepat berubah dan sering tidak kompatibel antarversi. Kunci versi di `requirements.txt` (`scikit-learn==1.5.2`) agar orang lain mendapat hasil yang sama.'],
      ],
      examples: [
        {
          title: 'Membuat package kecil dan mengimpornya',
          code: py`
import sys, importlib  # sys untuk daftar folder modul, importlib untuk memuat ulang
from pathlib import Path  # Path untuk membuat folder & file

# Buat struktur: alatku/__init__.py dan alatku/statistik.py
Path("alatku").mkdir(exist_ok=True)  # buat folder package
# __init__.py menandai folder sebagai package
Path("alatku/__init__.py").write_text('from .statistik import rata_rata\n__version__ = "0.1.0"\n')
# buat modul berisi fungsi
Path("alatku/statistik.py").write_text('''
def rata_rata(data):
    return sum(data) / len(data)

def _bantu():          # awalan _ = "internal", jangan dipakai dari luar
    return "rahasia"

if __name__ == "__main__":
    print("Dijalankan langsung")   # tidak muncul saat di-import
''')

sys.path.insert(0, ".")  # tambahkan folder saat ini ke daftar pencarian modul
importlib.invalidate_caches()  # pastikan Python melihat file yang baru dibuat
import alatku  # import package-nya
from alatku.statistik import rata_rata  # import satu fungsi dari modul di dalam package

print("Versi:", alatku.__version__)  # variabel yang didefinisikan di __init__.py
print("Rata-rata:", rata_rata([70, 80, 90]))  # pakai fungsinya
print("Nama modul:", alatku.statistik.__name__)  # nama lengkap modul

import numpy, sklearn  # setiap library menyimpan versinya di __version__
# cetak versi library
print("numpy", numpy.__version__, "| scikit-learn", sklearn.__version__)`,
        },
      ],
      mistakes: [
        ['`from modul import *`', 'Nama jadi tidak jelas asalnya dan bisa saling menimpa. Import yang dibutuhkan saja, atau `import numpy as np`.'],
        ['Import melingkar: a.py import b.py, b.py import a.py.', 'Pindahkan bagian bersama ke modul ketiga.'],
        ['`requirements.txt` tanpa versi.', 'Tulis versi dengan `pip freeze > requirements.txt` atau minimal batas versi utama.'],
      ],
      tips: [
        'Urutan import: library standar, library pihak ketiga, lalu modul milikmu (dipisah baris kosong).',
        'Alias standar komunitas: `np`, `pd`, `plt`, `sns`, `tf`, `torch.nn as nn`.',
      ],
      check: [
        ['Apa fungsi `if __name__ == "__main__":`?', 'Menjalankan blok kode hanya ketika file dijalankan langsung, bukan ketika diimpor sebagai modul.'],
      ],
    },
  },
  'pyl-venv': {
    deep: {
      concepts: [
        ['Masalah yang diselesaikan', 'Proyek A butuh `torch 2.1`, proyek B butuh `torch 2.4`. Tanpa virtual environment, keduanya berebut satu instalasi global. venv memberi setiap proyek folder library sendiri.'],
        ['Isi folder `.venv`', 'Berisi salinan/tautan interpreter Python dan folder `site-packages` tersendiri. "Mengaktifkan" venv hanya mengubah PATH agar `python` dan `pip` menunjuk ke folder itu.'],
        ['Alternatif: conda, uv, poetry', '**conda** juga mengelola library non-Python (CUDA), populer untuk data science. **uv** sangat cepat dan makin populer. **poetry** mengelola dependensi + packaging. Prinsipnya sama: lingkungan terisolasi per proyek.'],
      ],
      examples: [
        {
          title: 'Alur venv lengkap',
          runnable: false,
          code: py`
# Buat & aktifkan
python -m venv .venv  # buat virtual environment di folder .venv
.venv\Scripts\activate          # Windows
source .venv/bin/activate       # macOS / Linux

# Pasang library & kunci versinya
python -m pip install --upgrade pip  # perbarui pip
pip install numpy pandas scikit-learn  # pasang library
pip freeze > requirements.txt  # catat semua versi library ke file

# Di komputer lain / teman satu tim
python -m venv .venv  # buat venv baru
source .venv/bin/activate  # aktifkan
pip install -r requirements.txt  # pasang versi library yang sama persis

# Cek interpreter yang aktif
python -c "import sys; print(sys.prefix)"  # harus menunjuk ke folder .venv

# Alternatif cepat dengan uv
uv venv && uv pip install -r requirements.txt`,
        },
      ],
      mistakes: [
        ['Meng-commit folder `.venv` ke Git.', 'Masukkan `.venv/` ke `.gitignore`; cukup commit `requirements.txt`.'],
        ['Lupa mengaktifkan venv lalu install ke Python global.', 'Lihat prompt terminal: harus ada `(.venv)` di depan.'],
        ['VS Code memakai interpreter global walau venv sudah dibuat.', 'Pilih interpreter `.venv` lewat Command Palette → "Python: Select Interpreter".'],
      ],
      tips: [
        'Satu proyek, satu venv, simpan di folder proyek bernama `.venv`.',
        'Jika venv rusak, hapus folder `.venv` dan buat ulang dari `requirements.txt` — itulah gunanya file tersebut.',
      ],
      check: [
        ['Apa yang sebenarnya dilakukan perintah "activate"?', 'Mengubah PATH di sesi terminal agar `python` dan `pip` menunjuk ke interpreter dan library di folder venv.'],
      ],
    },
  },
  'pyl-comprehension': {
    deep: {
      concepts: [
        ['Empat jenis comprehension', 'List `[x for x in data]`, dict `{k: v for k, v in pasangan}`, set `{x for x in data}`, dan generator `(x for x in data)` yang tidak membuat list di memori.'],
        ['Filter vs transformasi bersyarat', '`[x for x in data if x > 0]` **menyaring** (ukuran bisa mengecil). `[x if x > 0 else 0 for x in data]` **mengubah** setiap elemen (ukuran tetap). Perhatikan posisi `if`.'],
        ['Batas keterbacaan', 'Comprehension bersarang lebih dari dua tingkat atau dengan logika rumit lebih baik ditulis sebagai loop biasa. Kode dibaca jauh lebih sering daripada ditulis.'],
      ],
      examples: [
        {
          title: 'Comprehension untuk menyiapkan data',
          code: py`
data = [{"nama": "Ani", "nilai": 88, "kelas": "A"},  # data siswa (Budi belum punya nilai)
        {"nama": "Budi", "nilai": None, "kelas": "B"},
        {"nama": "Citra", "nilai": 95, "kelas": "A"},
        {"nama": "Dodi", "nilai": 55, "kelas": "B"}]

valid = [d for d in data if d["nilai"] is not None]                    # filter
status = [("lulus" if d["nilai"] >= 60 else "remedial") for d in valid] # transformasi
print(status)  # ['lulus', 'lulus', 'remedial']

nilai_per_nama = {d["nama"]: d["nilai"] for d in valid}                 # dict
kelas_unik = {d["kelas"] for d in data}                                 # set
print(nilai_per_nama, kelas_unik)  # dict dan set hasil comprehension

# setiap kata unik diberi nomor
kata_ke_id = {k: i for i, k in enumerate(sorted({"aku", "suka", "ai", "aku"}))}
print("Vocabulary:", kata_ke_id)          # langkah awal tokenisasi NLP

matriks = [[1, 2, 3], [4, 5, 6]]  # matriks 2 baris x 3 kolom
# transpose: baris menjadi kolom
transpose = [[baris[j] for baris in matriks] for j in range(3)]
rata = [x for baris in matriks for x in baris]   # flatten
print(transpose, rata)  # hasil transpose dan versi rata (1 dimensi)

# tanpa kurung siku = generator, tidak membuat list besar
print("Total kuadrat (generator, hemat memori):", sum(x * x for x in range(1_000_000)))`,
        },
      ],
      mistakes: [
        ['`[x for x in data if x > 0 else 0]` → SyntaxError.', 'Jika memakai else, letakkan di depan: `[x if x > 0 else 0 for x in data]`.'],
        ['Memakai list comprehension hanya untuk efek samping: `[print(x) for x in data]`.', 'Pakai loop `for` biasa.'],
        ['`sum([x for x in range(10**8)])` membuat list raksasa.', 'Hilangkan kurung siku agar menjadi generator: `sum(x for x in ...)`.'],
      ],
      tips: [
        'Urutan `for` dalam comprehension bersarang sama dengan urutan loop biasa dari luar ke dalam.',
        'Untuk data besar, operasi vektor Pandas/NumPy tetap lebih cepat daripada comprehension.',
      ],
      check: [
        ['Apa beda `[x*2 for x in d]` dan `(x*2 for x in d)`?', 'Yang pertama langsung membuat list penuh di memori; yang kedua generator yang menghasilkan nilai satu per satu saat diminta.'],
      ],
    },
  },
  'pyl-generator': {
    deep: {
      concepts: [
        ['Lazy evaluation', 'Generator menghasilkan nilai **saat diminta** dengan `yield`, lalu "berhenti sejenak" dan melanjutkan dari titik yang sama pada permintaan berikutnya. Memori yang dipakai tetap kecil walau datanya tak terbatas.'],
        ['Generator di dunia AI', 'DataLoader PyTorch, `ImageDataGenerator` Keras, dan streaming dataset Hugging Face memakai konsep ini: data dibaca per **batch** dari disk alih-alih memuat semuanya ke RAM. Respons LLM yang muncul kata demi kata (streaming) juga generator.'],
        ['Generator hanya bisa dipakai sekali', 'Setelah habis, generator kosong. Jika butuh dua kali, buat ulang atau ubah menjadi list.'],
        ['itertools', 'Modul `itertools` berisi alat generator siap pakai: `islice` (ambil sebagian), `chain` (gabung), `product` (semua kombinasi, mis. grid hyperparameter), `batched` (Python 3.12+, potong per batch).'],
      ],
      examples: [
        {
          title: 'Batch generator dan grid hyperparameter',
          code: py`
import itertools, sys  # itertools: alat generator, sys: cek ukuran memori

def baca_batch(data, ukuran):  # generator batch
    """Menghasilkan data per batch, seperti DataLoader."""
    for i in range(0, len(data), ukuran):  # loncat sebesar ukuran batch
        yield data[i:i + ukuran]  # berikan satu batch lalu tunggu diminta lagi

data = list(range(10))  # angka 0 sampai 9
for nomor, batch in enumerate(baca_batch(data, 4)):  # setiap putaran mendapat satu batch
    print("batch", nomor, batch)  # cetak nomor & isi batch

gen = (x * x for x in range(1_000_000))  # generator: belum menghitung apa pun
lst = [x * x for x in range(1_000_000)]  # list: semua sejuta angka langsung disimpan
# bandingkan ukuran memorinya
print(f"Memori generator: {sys.getsizeof(gen)} byte | list: {sys.getsizeof(lst):,} byte")

def bilangan_fibonacci():          # generator tak terbatas
    a, b = 0, 1  # dua angka awal
    while True:  # tidak pernah berhenti sendiri
        yield a  # beri satu angka
        a, b = b, a + b  # geser ke pasangan berikutnya
# islice mengambil 10 angka pertama saja
print("10 Fibonacci pertama:", list(itertools.islice(bilangan_fibonacci(), 10)))

grid = {"lr": [0.01, 0.1], "depth": [3, 5, 7]}  # pilihan hyperparameter
# product membuat semua kombinasi (2 x 3 = 6)
kombinasi = [dict(zip(grid, nilai)) for nilai in itertools.product(*grid.values())]
print(len(kombinasi), "kombinasi, contoh:", kombinasi[:2])  # jumlah & contoh kombinasi

g = (x for x in range(3))  # generator kecil
print(list(g), list(g))            # kedua kalinya kosong!`,
        },
      ],
      mistakes: [
        ['Memakai generator dua kali dan heran hasil kedua kosong.', 'Buat generator baru atau simpan ke list jika data kecil.'],
        ['Lambda panjang yang sulit dibaca.', 'Lambda hanya untuk fungsi satu ekspresi singkat; selebihnya pakai `def`.'],
        ['`len(generator)` → TypeError.', 'Generator tidak tahu panjangnya; hitung saat iterasi atau pakai list.'],
      ],
      tips: [
        'Pakai `yield from sub_generator()` untuk meneruskan semua nilai dari generator lain.',
        'Lambda paling sering dipakai sebagai `key=` di `sorted`, `max`, `min`.',
      ],
      check: [
        ['Kenapa DataLoader membaca data per batch dengan generator, bukan memuat semuanya?', 'Dataset gambar/teks bisa berukuran puluhan GB, jauh melebihi RAM. Generator hanya menyimpan satu batch di memori pada satu waktu.'],
      ],
    },
    exercise: {
      task: 'Buat generator `potong_teks(teks, n)` yang menghasilkan potongan teks berisi `n` kata (seperti "chunking" pada RAG). Uji dengan kalimat 10 kata dan n=4.',
      hint: 'Split teks jadi list kata, lalu loop `range(0, len(kata), n)` dan `yield " ".join(kata[i:i+n])`.',
      solution: py`
def potong_teks(teks, n):  # generator pemotong teks per n kata
    kata = teks.split()  # pecah teks menjadi kata
    for i in range(0, len(kata), n):  # loncat n kata
        yield " ".join(kata[i:i + n])  # gabungkan n kata menjadi satu potongan

# kalimat 10 kata
kalimat = "AI membantu manusia menyelesaikan pekerjaan dengan lebih cepat dan lebih akurat"
for i, potong in enumerate(potong_teks(kalimat, 4)):  # ambil potongan satu per satu
    print(i, potong)  # cetak nomor & potongannya`,
    },
  },
  'pyl-decorator': {
    deep: {
      concepts: [
        ['Decorator = fungsi yang membungkus fungsi', '`@timer` di atas `def latih()` sama dengan `latih = timer(latih)`. Decorator menambahkan perilaku (mengukur waktu, mencatat log, mengulang saat gagal, cache) tanpa mengubah isi fungsi aslinya.'],
        ['Decorator yang sering kamu temui', '`@app.get("/prediksi")` (FastAPI), `@torch.no_grad()` (PyTorch), `@st.cache_data` (Streamlit), `@functools.lru_cache` (cache hasil), `@dataclass`, `@property`, `@staticmethod`.'],
        ['Type hints', 'Anotasi seperti `def latih(data: list[float], epoch: int = 10) -> float:` tidak mengubah cara kode berjalan, tetapi membantu editor memberi saran, mendeteksi kesalahan lewat `mypy`, dan dipakai FastAPI/Pydantic untuk validasi otomatis.'],
      ],
      examples: [
        {
          title: 'Decorator timer, retry, dan cache',
          code: py`
# time: ukur waktu, functools: alat decorator, random: simulasi gagal
import time, functools, random

def timer(fungsi):  # decorator pengukur waktu
    @functools.wraps(fungsi)          # menjaga nama & docstring fungsi asli
    def pembungkus(*args, **kwargs):  # pembungkus menerima argumen apa pun
        mulai = time.perf_counter()  # waktu mulai
        hasil = fungsi(*args, **kwargs)  # jalankan fungsi asli
        # cetak lama waktunya
        print(f"[{fungsi.__name__}] {time.perf_counter() - mulai:.4f} detik")
        return hasil  # kembalikan hasil fungsi asli
    return pembungkus  # kembalikan fungsi yang sudah dibungkus

def retry(kali: int = 3):             # decorator dengan parameter
    def dekor(fungsi):  # decorator sebenarnya
        @functools.wraps(fungsi)
        def pembungkus(*args, **kwargs):  # pembungkus
            for i in range(1, kali + 1):  # coba sampai 'kali' kali
                try:  # coba jalankan
                    return fungsi(*args, **kwargs)  # berhasil: langsung kembalikan hasil
                except ConnectionError as e:  # gagal karena koneksi
                    print(f"  percobaan {i} gagal: {e}")  # catat lalu coba lagi
            raise RuntimeError("semua percobaan gagal")  # semua percobaan habis
        return pembungkus  # kembalikan pembungkus
    return dekor  # kembalikan decorator

@timer  # pasang decorator timer
def jumlah_kuadrat(n: int) -> int:  # fungsi yang diukur waktunya
    return sum(i * i for i in range(n))  # jumlah kuadrat 0 sampai n-1

random.seed(3)  # seed agar hasil acak sama
@retry(kali=5)  # coba sampai 5 kali
def ambil_data() -> str:  # fungsi yang kadang gagal
    if random.random() < 0.5:  # 50% kemungkinan gagal
        raise ConnectionError("timeout")  # lempar error koneksi
    return "data diterima"  # berhasil

print(jumlah_kuadrat(500_000))  # waktu otomatis dicetak
print(ambil_data())  # otomatis diulang jika gagal

@functools.lru_cache(maxsize=None)  # lru_cache: simpan hasil yang sudah pernah dihitung
def fib(n: int) -> int:  # Fibonacci rekursif
    # tanpa cache sangat lambat; dengan cache instan
    return n if n < 2 else fib(n - 1) + fib(n - 2)
# ukur waktunya
t = time.perf_counter(); print("fib(80) =", fib(80), f"({(time.perf_counter() - t)*1000:.2f} ms dengan cache)")`,
        },
      ],
      mistakes: [
        ['Lupa `return hasil` di fungsi pembungkus → fungsi yang didekorasi selalu mengembalikan None.', 'Selalu kembalikan hasil pemanggilan fungsi asli.'],
        ['Tidak memakai `functools.wraps`.', 'Nama dan docstring fungsi hilang, menyulitkan debugging dan library seperti FastAPI.'],
        ['Mengira type hint memaksa tipe saat runtime.', 'Python tetap menerima tipe apa pun; validasi nyata dilakukan alat seperti mypy atau Pydantic.'],
      ],
      tips: [
        'Mulai dengan memakai decorator yang sudah ada sebelum menulis sendiri.',
        'Pakai `Optional[int]` atau `int | None` untuk nilai yang boleh kosong.',
      ],
      check: [
        ['Apa padanan `@timer` di atas `def f():` tanpa simbol @?', '`f = timer(f)`.'],
        ['Kenapa `fib(80)` dengan `lru_cache` sangat cepat?', 'Hasil setiap `fib(n)` disimpan, sehingga tiap nilai hanya dihitung sekali (dari eksponensial menjadi linear).'],
      ],
    },
    exercise: {
      task: 'Buat decorator `catat` yang mencetak nama fungsi dan argumennya setiap kali dipanggil, lalu pakai pada fungsi `kali(a, b)`.',
      hint: 'Di dalam pembungkus, cetak `fungsi.__name__`, `args`, `kwargs`, lalu panggil dan kembalikan `fungsi(*args, **kwargs)`.',
      solution: py`
import functools  # untuk functools.wraps

def catat(fungsi):  # decorator pencatat panggilan
    @functools.wraps(fungsi)  # jaga nama fungsi asli
    def pembungkus(*args, **kwargs):  # pembungkus
        # catat nama dan argumennya
        print(f"Memanggil {fungsi.__name__} args={args} kwargs={kwargs}")
        return fungsi(*args, **kwargs)  # jalankan fungsi asli dan kembalikan hasilnya
    return pembungkus  # kembalikan pembungkus

@catat  # pasang decorator
def kali(a, b):  # fungsi yang dicatat
    return a * b  # kalikan

print(kali(3, 4))  # argumen posisi
print(kali(2, b=5))  # argumen bernama tercatat di kwargs`,
    },
  },
  'pyl-api': {
    deep: {
      concepts: [
        ['Anatomi request HTTP', 'Setiap request punya **method** (GET ambil data, POST kirim data), **URL** + parameter, **header** (mis. `Authorization: Bearer <key>`, `Content-Type: application/json`), dan **body** (data JSON untuk POST). Respons membawa **status code** dan body.'],
        ['Status code', '`200` OK, `201` dibuat, `400` request salah, `401` belum login/key salah, `403` tidak berhak, `404` tidak ditemukan, `429` terlalu banyak request (rate limit), `500`/`503` server bermasalah. Kode 429 dan 5xx biasanya layak dicoba ulang dengan jeda.'],
        ['Exponential backoff', 'Saat dicoba ulang, jeda dinaikkan berlipat (1s, 2s, 4s, ...) plus sedikit acak, agar tidak membanjiri server yang sedang sibuk. Ini wajib saat memanggil API LLM dalam jumlah banyak.'],
        ['Keamanan API key', 'Simpan key di environment variable atau file `.env` (dibaca dengan `python-dotenv`), jangan di kode. Key yang bocor bisa dipakai orang lain dan tagihannya masuk ke kamu.'],
      ],
      examples: [
        {
          title: 'Mengolah respons JSON bersarang dan backoff',
          code: py`
import json, random  # json untuk membaca respons, random untuk simulasi

# Respons API tiruan (bentuknya mirip API cuaca/LLM sungguhan)
# teks JSON bertingkat
respons_teks = '''
{"status": "ok", "kota": "Bandung",
 "prakiraan": [{"jam": "09:00", "suhu": 22.5, "hujan": 0.1},
               {"jam": "12:00", "suhu": 27.1, "hujan": 0.6},
               {"jam": "15:00", "suhu": 25.3, "hujan": 0.8}],
 "usage": {"request_tersisa": 98}}'''
data = json.loads(respons_teks)  # ubah teks menjadi dict

# jam-jam dengan peluang hujan >= 0.5
hujan = [p["jam"] for p in data["prakiraan"] if p["hujan"] >= 0.5]
print(f"{data['kota']}: kemungkinan hujan pada jam {hujan}")  # akses data bertingkat
print("Suhu maks:", max(p["suhu"] for p in data["prakiraan"]))  # suhu tertinggi
# .get dengan nilai default jika kunci tidak ada
print("Kunci aman dengan .get:", data.get("peringatan", "tidak ada peringatan"))

# Backoff eksponensial (jeda disimulasikan, tidak benar-benar menunggu)
random.seed(2)  # seed agar hasil acak sama
def kirim():  # simulasi status HTTP
    return random.choice([429, 503, 200])  # acak: 429, 503, atau 200
for percobaan in range(6):  # coba maksimal 6 kali
    status = kirim()  # kirim request
    if status == 200:  # 200 = berhasil
        print("Berhasil pada percobaan", percobaan + 1); break  # berhenti
    # jeda dua kali lipat setiap gagal + sedikit acak, maksimal 30 detik
    jeda = min(2 ** percobaan + random.random(), 30)
    # tampilkan jeda yang akan ditunggu
    print(f"Status {status}, coba lagi dalam {jeda:.1f} detik")`,
        },
        {
          title: 'Request sungguhan dengan requests (jalankan di komputer sendiri)',
          runnable: false,
          code: py`
import os, time, requests  # os untuk membaca environment variable

API_KEY = os.environ["CUACA_API_KEY"]          # jangan tulis key di kode

def ambil_cuaca(kota, maks_coba=5):  # ambil cuaca dengan retry
    for i in range(maks_coba):  # coba beberapa kali
        r = requests.get("https://api.contoh.com/cuaca",  # kirim GET ke API
                         params={"q": kota},  # parameter query
                         # API key dikirim lewat header
                         headers={"Authorization": f"Bearer {API_KEY}"},
                         timeout=10)            # selalu beri timeout
        if r.status_code == 200:  # berhasil
            return r.json()  # ubah respons menjadi dict
        if r.status_code in (429, 500, 503):  # error sementara: layak dicoba ulang
            time.sleep(2 ** i)                  # backoff
            continue  # lanjut ke percobaan berikutnya
        r.raise_for_status()                    # error lain: langsung gagal
    raise RuntimeError("API tidak merespons")  # semua percobaan habis`,
        },
      ],
      mistakes: [
        ['`requests.get(url)` tanpa `timeout`.', 'Program bisa menggantung selamanya. Selalu beri `timeout=10` (atau sesuai kebutuhan).'],
        ['Langsung `r.json()` tanpa cek status.', 'Cek `r.status_code` atau panggil `r.raise_for_status()` dulu.'],
        ['Memanggil API dalam loop ribuan kali tanpa jeda.', 'Hormati rate limit: beri jeda, pakai batch endpoint, dan cache hasil yang sama.'],
      ],
      tips: [
        'Coba API dulu dengan curl atau Postman/Thunder Client sebelum menulis kode.',
        'Simpan respons mentah ke file saat eksperimen agar tidak perlu memanggil API berulang.',
      ],
      check: [
        ['API mengembalikan status 429. Apa artinya dan apa yang sebaiknya dilakukan?', 'Terlalu banyak request (rate limit). Tunggu lalu coba lagi dengan exponential backoff, dan kurangi laju request.'],
      ],
    },
    exercise: {
      task: 'Dari JSON `{"hasil": [{"produk": "Kopi", "terjual": 120}, {"produk": "Teh", "terjual": 80}, {"produk": "Susu", "terjual": 150}]}`, cetak produk terlaris dan total penjualan.',
      hint: '`json.loads` → ambil list `data["hasil"]` → `max(..., key=lambda x: x["terjual"])` dan `sum(...)`.',
      solution: py`
import json  # untuk membaca JSON

# respons JSON contoh
teks = '{"hasil": [{"produk": "Kopi", "terjual": 120}, {"produk": "Teh", "terjual": 80}, {"produk": "Susu", "terjual": 150}]}'
data = json.loads(teks)["hasil"]  # ubah ke dict lalu ambil list hasil
terlaris = max(data, key=lambda x: x["terjual"])  # produk dengan penjualan tertinggi
print("Terlaris:", terlaris["produk"], terlaris["terjual"])  # tampilkan
print("Total terjual:", sum(x["terjual"] for x in data))  # jumlahkan semua penjualan`,
    },
  },
  'pyl-test': {
    deep: {
      concepts: [
        ['Kenapa kode AI perlu dites', 'Bug di pipeline data sering **tidak menimbulkan error**: model tetap berlatih, hanya hasilnya diam-diam buruk (mis. kolom tertukar, data uji bocor ke data latih). Test kecil menangkap masalah seperti ini sejak awal.'],
        ['Apa yang dites di proyek ML', 'Fungsi preprocessing (input → output yang diharapkan), bentuk (shape) data, tidak ada nilai NaN setelah cleaning, model bisa overfit pada data kecil (tanda kode training benar), dan prediksi berada di rentang yang masuk akal.'],
        ['Struktur test: Arrange–Act–Assert', 'Siapkan data (arrange), jalankan fungsi (act), periksa hasil (assert). Satu test memeriksa satu perilaku, dan namanya menjelaskan perilaku itu: `test_normalisasi_menghasilkan_rentang_0_1`.'],
        ['Fixture dan parametrize', 'Di pytest, `@pytest.fixture` menyiapkan data yang dipakai banyak test, dan `@pytest.mark.parametrize` menjalankan satu test dengan banyak input sekaligus.'],
      ],
      examples: [
        {
          title: 'Test untuk fungsi preprocessing (tanpa pytest, pakai assert)',
          code: py`
import numpy as np  # NumPy untuk data

def bersihkan(nilai):  # fungsi yang akan dites
    """Ganti NaN dengan median, lalu normalisasi ke 0-1."""
    arr = np.array(nilai, dtype=float)  # ubah ke array desimal
    arr[np.isnan(arr)] = np.nanmedian(arr)  # ganti NaN dengan median nilai lainnya
    rentang = arr.max() - arr.min()  # jarak nilai terkecil ke terbesar
    # skala ke 0 sampai 1; jika semua sama, hasilnya nol
    return (arr - arr.min()) / rentang if rentang else np.zeros_like(arr)

def test_tidak_ada_nan():  # test 1: tidak boleh ada NaN
    # assert gagal jika ada NaN tersisa
    assert not np.isnan(bersihkan([1, np.nan, 3])).any()

def test_rentang_0_sampai_1():  # test 2: rentang hasil 0 sampai 1
    h = bersihkan([10, 20, 30])  # jalankan fungsi
    assert h.min() == 0 and h.max() == 1  # periksa batas bawah & atas

def test_nilai_sama_semua_tidak_error():  # test 3: kasus tepi (semua nilai sama)
    assert (bersihkan([5, 5, 5]) == 0).all()  # tidak error dan hasilnya nol

def test_panjang_tetap():  # test 4: jumlah data tidak berubah
    for data in ([1], [1, 2], list(range(100))):  # coba beberapa ukuran data
        assert len(bersihkan(data)) == len(data)  # panjang input = panjang output

lulus = 0  # penghitung test yang lulus
# jalankan semua test
for test in [test_tidak_ada_nan, test_rentang_0_sampai_1, test_nilai_sama_semua_tidak_error, test_panjang_tetap]:
    try:  # coba
        test(); lulus += 1; print("LULUS", test.__name__)  # lulus: tambah hitungan
    except AssertionError:  # assert gagal
        print("GAGAL", test.__name__)  # laporkan test yang gagal
print(f"{lulus}/4 test lulus")  # ringkasan`,
        },
        {
          title: 'Versi pytest dengan parametrize (jalankan di komputer: pytest -v)',
          runnable: false,
          code: py`
# tests/test_preprocess.py
import numpy as np  # NumPy untuk data
import pytest  # library testing
from src.preprocess import bersihkan  # fungsi yang dites, dari kode proyek

@pytest.fixture  # fixture: data yang bisa dipakai banyak test
def data_kotor():  # nama fixture menjadi nama parameter test
    return [10, np.nan, 30, 40]  # data dengan satu nilai kosong

def test_tidak_ada_nan(data_kotor):  # pytest otomatis mengisi data_kotor dari fixture
    assert not np.isnan(bersihkan(data_kotor)).any()  # tidak boleh ada NaN

# jalankan test yang sama dengan 3 pasang input
@pytest.mark.parametrize("data, panjang", [([1], 1), ([1, 2], 2), (list(range(50)), 50)])
def test_panjang_tetap(data, panjang):  # data & panjang diisi otomatis
    assert len(bersihkan(data)) == panjang  # periksa panjangnya

def test_input_kosong_error():  # test bahwa input kosong memang ditolak
    with pytest.raises(ValueError):  # lulus hanya jika ValueError dilempar
        bersihkan([])  # panggil dengan list kosong`,
        },
      ],
      mistakes: [
        ['Membandingkan float dengan `==`.', 'Pakai `pytest.approx` atau `np.allclose`.'],
        ['Test bergantung pada data acak tanpa seed.', 'Set seed (`np.random.seed(0)`) agar hasil test selalu sama.'],
        ['Test yang memakai dataset besar dan berjalan berjam-jam.', 'Pakai data kecil buatan; test harus cepat agar sering dijalankan.'],
      ],
      tips: [
        'Tes "sanity check" model: latih pada 10 data, harus bisa mencapai akurasi ~100% (overfit). Jika tidak, ada bug di kode training.',
        'Jalankan test otomatis di setiap push dengan GitHub Actions.',
      ],
      check: [
        ['Kenapa model yang tidak bisa overfit pada 10 data merupakan tanda bug?', 'Model yang benar seharusnya mampu menghafal data sekecil itu. Jika tidak bisa, kemungkinan ada kesalahan di label, loss, atau langkah update parameter.'],
      ],
    },
    exercise: {
      task: 'Tulis fungsi `split_data(data, rasio_uji)` yang membagi list menjadi data latih dan uji, lalu tulis 2 test: (1) total panjang tetap, (2) tidak ada elemen yang muncul di keduanya.',
      hint: 'Hitung `n_uji = int(len(data) * rasio_uji)`, ambil slicing. Untuk test kedua, cek `set(latih) & set(uji)` kosong.',
      solution: py`
import random  # untuk mengacak

def split_data(data, rasio_uji=0.2, seed=0):  # pembagi data latih & uji
    data = data[:]  # salin agar data asli tidak ikut teracak
    random.Random(seed).shuffle(data)  # acak dengan seed (hasil bisa diulang)
    n_uji = int(len(data) * rasio_uji)  # jumlah data uji
    return data[n_uji:], data[:n_uji]  # sisanya untuk latih

def test_total_tetap():  # test 1
    latih, uji = split_data(list(range(100)))  # bagi 100 data
    assert len(latih) + len(uji) == 100  # jumlah totalnya harus tetap 100

def test_tidak_bocor():  # test 2
    latih, uji = split_data(list(range(100)))  # bagi 100 data
    assert not set(latih) & set(uji)  # irisan himpunan harus kosong (tidak ada data bocor)

test_total_tetap(); test_tidak_bocor()  # jalankan kedua test
print("Semua test lulus")  # hanya tercetak jika semua lolos`,
    },
  },
}
