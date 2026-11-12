import { py } from './py.js'

// Materi baru (gelombang 3): data besar (Parquet & Polars), deteksi anomali klasik, CI/CD & versi data.
// Format sama dengan topics-extra.js; diproses setelah topics-extra.js dan topics-baru.js.

export const topikBaru2 = {
  // ---------------- Menengah: Data Science ----------------
  'data-science': [
    {
      after: 'ds-sql',
      id: 'ds-data-besar',
      title: 'Data besar: hemat memori, Parquet & Polars',
      summary: 'Mengolah data yang lebih besar dari RAM laptop: tipe data hemat, baca per potongan, Parquet, Polars, dan DuckDB.',
      explain: [
        'Pandas memuat seluruh tabel ke memori (RAM). File CSV 2 GB bisa memakan 5–10 GB RAM setelah dibaca, sehingga laptop 8 GB kehabisan memori. Sebelum menyewa server mahal, ada banyak trik yang bisa dicoba.',
        '**Hemat tipe data**: kolom teks yang nilainya berulang (kota, kategori) jauh lebih kecil sebagai `category`; angka bisa diperkecil (`int64` → `int32`, `float64` → `float32`). **Baca seperlunya**: hanya kolom yang dipakai (`usecols`), atau per potongan (`chunksize`) lalu hasilnya digabung.',
        '**Parquet** adalah format file berbasis kolom yang terkompresi: biasanya 5–10× lebih kecil dari CSV, menyimpan tipe data, dan bisa membaca kolom tertentu saja tanpa membaca seluruh file. Hampir semua alat data modern (Pandas, Polars, DuckDB, Spark) mendukungnya.',
        '**Polars** adalah library tabel yang sangat cepat (multi-core) dengan mode **lazy**: kamu menyusun seluruh langkah dulu, lalu Polars mengoptimasi dan hanya membaca data yang perlu. **DuckDB** memungkinkan query SQL langsung ke file CSV/Parquet tanpa server database. Spark baru diperlukan jika data sudah benar-benar tidak muat di satu mesin.',
      ],
      uses: [
        'Menganalisis log transaksi/aplikasi berukuran puluhan GB di laptop',
        'Menyimpan dataset hasil olahan agar cepat dibaca ulang (Parquet)',
        'Menjalankan SQL langsung ke file tanpa memasang database',
        'Menyiapkan fitur ML dari data besar dengan pipeline yang cepat',
      ],
      examples: [
        {
          title: 'Hemat memori dengan tipe data yang tepat',
          code: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(0)  # seed
n = 300_000  # 300 ribu transaksi
df = pd.DataFrame({
    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar"], n),  # teks berulang
    "jumlah": rng.integers(1, 20, n),  # angka kecil, tapi disimpan int64
    "harga": rng.uniform(1_000, 500_000, n).round(0),  # float64
})
mb = lambda d: d.memory_usage(deep=True).sum() / 1e6  # ukuran tabel di memori (MB)
print(f"sebelum : {mb(df):.1f} MB", df.dtypes.astype(str).to_dict())  # tipe bawaan

hemat = df.assign(
    kota=df["kota"].astype("category"),  # teks berulang -> kode angka + kamus
    jumlah=pd.to_numeric(df["jumlah"], downcast="integer"),  # int64 -> int8 (cukup untuk 1-19)
    harga=df["harga"].astype("float32"),  # presisi cukup untuk rupiah bulat
)
print(f"sesudah : {mb(hemat):.1f} MB", hemat.dtypes.astype(str).to_dict())  # jauh lebih kecil
print(f"hemat   : {1 - mb(hemat) / mb(df):.0%}")  # persentase penghematan`,
        },
        {
          title: 'Membaca per potongan (chunk) lalu menggabungkan hasil',
          code: py`
import io, numpy as np, pandas as pd  # file di memori, angka, tabel

rng = np.random.default_rng(1)  # seed
besar = pd.DataFrame({"kota": rng.choice(["A", "B", "C"], 200_000), "omzet": rng.integers(10, 1000, 200_000)})  # tiruan file besar
csv = io.StringIO(besar.to_csv(index=False))  # di komputer: nama file CSV berukuran GB

total = {}  # hasil sementara per kota
for potong in pd.read_csv(csv, chunksize=50_000, usecols=["kota", "omzet"]):  # baca 50 ribu baris setiap kali
    for kota, nilai in potong.groupby("kota")["omzet"].sum().items():  # agregasi per potongan
        total[kota] = total.get(kota, 0) + nilai  # gabungkan ke hasil sementara
print("hasil per potongan :", total)  # memori yang dipakai hanya sebesar satu potongan
print("pembanding (sekali):", besar.groupby("kota")["omzet"].sum().to_dict())  # harus sama persis`,
        },
        {
          title: 'Parquet, Polars (lazy), dan DuckDB',
          runnable: false,
          note: 'Jalankan di komputer/Colab: pip install pandas pyarrow polars duckdb',
          code: py`
import pandas as pd, polars as pl, duckdb  # tiga alat untuk data besar

df = pd.read_csv("transaksi.csv")  # baca CSV sekali
df.to_parquet("transaksi.parquet", index=False)  # simpan sebagai Parquet: kecil, cepat, tipe tersimpan
kolom = pd.read_parquet("transaksi.parquet", columns=["kota", "jumlah"])  # baca 2 kolom saja

hasil = (
    pl.scan_parquet("transaksi.parquet")  # lazy: belum membaca apa pun
    .filter(pl.col("jumlah") > 0)  # buang retur/pembatalan
    .group_by("kota")  # kelompokkan per kota
    .agg(pl.col("jumlah").sum().alias("total"), pl.len().alias("transaksi"))  # total & banyaknya transaksi
    .sort("total", descending=True)  # urutkan
    .collect()  # baru dijalankan di sini, setelah dioptimasi
)
print(hasil)

print(duckdb.sql("SELECT kota, SUM(jumlah) AS total FROM 'transaksi.parquet' GROUP BY kota ORDER BY total DESC").df())  # SQL langsung ke file`,
        },
      ],
      exercise: {
        task: 'Buat DataFrame 200.000 baris berisi kolom `provinsi` (pilih acak dari 5 nama), `umur` (18–70), dan `skor` (desimal 0–100). Hitung memori sebelum dan sesudah optimasi tipe data, lalu tampilkan persentase penghematannya.',
        hint: '`astype("category")` untuk provinsi, `pd.to_numeric(..., downcast="integer")` untuk umur, `astype("float32")` untuk skor. Memori: `df.memory_usage(deep=True).sum()`.',
        solution: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(4)  # seed
n = 200_000  # jumlah baris
df = pd.DataFrame({
    "provinsi": rng.choice(["Aceh", "Jawa Barat", "Bali", "Papua", "Riau"], n),  # teks berulang
    "umur": rng.integers(18, 71, n),  # 18-70
    "skor": rng.uniform(0, 100, n),  # desimal
})
sebelum = df.memory_usage(deep=True).sum()  # byte sebelum
df["provinsi"] = df["provinsi"].astype("category")  # kategori
df["umur"] = pd.to_numeric(df["umur"], downcast="integer")  # jadi int8
df["skor"] = df["skor"].astype("float32")  # setengah ukuran float64
sesudah = df.memory_usage(deep=True).sum()  # byte sesudah
print(f"{sebelum / 1e6:.1f} MB -> {sesudah / 1e6:.1f} MB (hemat {1 - sesudah / sebelum:.0%})")  # hasil`,
      },
      steps: [
        ['Ukur dulu', '`df.memory_usage(deep=True)` dan ukuran file; jangan menebak.'],
        ['Baca seperlunya', '`usecols`, filter tanggal, atau `chunksize` untuk agregasi.'],
        ['Perbaiki tipe data', 'category untuk teks berulang, downcast angka, tanggal sebagai datetime.'],
        ['Simpan sebagai Parquet', 'Hasil olahan disimpan sekali, dibaca berkali-kali dengan cepat.'],
        ['Naik alat jika perlu', 'Polars/DuckDB di satu mesin; Spark/BigQuery jika benar-benar terlalu besar.'],
      ],
      case: {
        title: 'Log transaksi 5 GB di laptop RAM 8 GB',
        situation: 'Analis UMKM digital menerima log transaksi setahun (CSV 5 GB, 40 kolom) dan diminta total omzet per kota per bulan. `pd.read_csv` membuat laptopnya hang.',
        steps: [
          'Cek isi beberapa baris pertama dengan `nrows=1000` untuk memilih kolom yang benar-benar dibutuhkan (3 dari 40).',
          'Baca per potongan 1 juta baris dengan `usecols` dan tipe data hemat, agregasi per potongan.',
          'Simpan hasil bersih ke Parquet agar analisis berikutnya selesai dalam detik.',
          'Untuk pertanyaan lanjutan, pakai DuckDB/Polars langsung ke file Parquet.',
        ],
        code: py`
import io, numpy as np, pandas as pd  # file di memori, angka, tabel

rng = np.random.default_rng(9)  # seed (data di bawah adalah tiruan kecil dari file 5 GB)
n = 120_000  # jumlah baris tiruan
log = pd.DataFrame({
    "waktu": pd.Timestamp("2025-01-01") + pd.to_timedelta(rng.integers(0, 365 * 24 * 3600, n), unit="s"),  # waktu transaksi
    "kota": rng.choice(["Jakarta", "Bandung", "Surabaya"], n),  # kota
    "omzet": rng.integers(5_000, 300_000, n),  # rupiah
    **{f"kolom_lain_{i}": rng.random(n) for i in range(10)},  # kolom yang tidak dibutuhkan
})
csv = io.StringIO(log.to_csv(index=False))  # di komputer: "transaksi_2025.csv"

bagian = []  # hasil agregasi tiap potongan
for potong in pd.read_csv(csv, usecols=["waktu", "kota", "omzet"], parse_dates=["waktu"],  # 3 dari 13 kolom
                          dtype={"kota": "category", "omzet": "int32"}, chunksize=40_000):  # tipe hemat, per potongan
    potong["bulan"] = potong["waktu"].dt.to_period("M")  # bulan transaksi
    bagian.append(potong.groupby(["kota", "bulan"], observed=True)["omzet"].sum())  # agregasi kecil
rekap = pd.concat(bagian).groupby(level=[0, 1]).sum()  # gabungkan semua potongan
print(rekap.unstack(0).head(3))  # 3 bulan pertama, kolom = kota
# rekap.reset_index().to_parquet("rekap_omzet.parquet")  # di komputer: simpan hasil sebagai Parquet`,
        result: 'Hanya kolom yang dibutuhkan yang dibaca, dengan memori sebesar satu potongan. Rekap per kota per bulan selesai tanpa server tambahan, dan hasilnya disimpan ke Parquet untuk analisis berikutnya.',
      },
      deep: {
        concepts: [
          ['Format baris vs kolom', 'CSV menyimpan data per baris: untuk mengambil satu kolom, seluruh file tetap dibaca. Parquet menyimpan per kolom dan per kelompok baris, lengkap dengan statistik min/max, sehingga alat bisa melewati bagian yang tidak relevan (predicate pushdown).'],
          ['Lazy evaluation', 'Pada mode lazy (Polars, DuckDB, Spark), langkah-langkah hanya direncanakan. Saat `collect()`, mesin query menyusun ulang urutannya, misalnya menyaring dulu baru menggabung, dan hanya membaca kolom yang dipakai.'],
          ['Kapan perlu sistem terdistribusi', 'Jika data muat di disk satu mesin (puluhan–ratusan GB), Polars/DuckDB biasanya cukup dan jauh lebih sederhana. Spark/BigQuery dipakai saat data mencapai skala terabita atau dipakai bersama banyak tim.'],
        ],
        mistakes: [
          ['Membaca semua kolom lalu membuang sebagian.', 'Pilih kolom saat membaca (`usecols` / `columns=`).'],
          ['Menyimpan hasil olahan sebagai CSV lalu tipe tanggal/kategori hilang.', 'Simpan sebagai Parquet agar tipe data ikut tersimpan.'],
          ['Loop Python per baris pada jutaan data.', 'Gunakan operasi vektor (Pandas/Polars) atau SQL.'],
        ],
        tips: [
          'Dataset latihan berukuran besar: data perjalanan taksi New York (format Parquet per bulan) dari situs NYC TLC.',
          '`df.info(memory_usage="deep")` cepat menunjukkan kolom paling boros.',
          'Kolom kategori di Parquet sering memakai dictionary encoding otomatis, sehingga sangat kecil.',
        ],
        check: [
          ['Kenapa kolom "kota" dengan 5 nilai berbeda jauh lebih kecil sebagai category?', 'Setiap nilai disimpan sebagai kode angka kecil, sedangkan teksnya hanya disimpan sekali di kamus kategori, bukan diulang di setiap baris.'],
          ['Apa keuntungan utama Parquet dibanding CSV untuk analisis?', 'Lebih kecil karena terkompresi, menyimpan tipe data, dan bisa membaca kolom/bagian tertentu saja sehingga jauh lebih cepat.'],
        ],
      },
    },
    {
      after: 'ds-data-besar',
      id: 'ds-warehouse',
      title: 'Data warehouse, ETL & Spark',
      summary: 'Cara perusahaan menyimpan dan mengolah data skala besar: ETL/ELT, skema bintang (fact & dimension), partisi, dan Spark.',
      explain: [
        'Di perusahaan, data tersebar di banyak sistem: aplikasi kasir, situs web, CRM, gudang. Untuk dianalisis bersama, data itu dikumpulkan ke satu **data warehouse** (mis. BigQuery, Snowflake, Redshift, atau PostgreSQL untuk skala kecil), yang dirancang khusus untuk query analitik di atas jutaan sampai miliaran baris.',
        'Proses memindahkan data disebut **ETL** (extract → transform → load) atau **ELT** (data mentah dimuat dulu, lalu diolah dengan SQL di dalam warehouse). Pekerjaan ini biasanya dijadwalkan otomatis setiap jam/hari dengan alat orkestrasi seperti Airflow, dan transformasi SQL-nya sering dikelola dengan dbt.',
        'Warehouse biasanya memakai **skema bintang**: satu **tabel fakta** berisi kejadian yang bisa dihitung (setiap transaksi: jumlah, harga, tanggal, id produk, id toko), dikelilingi **tabel dimensi** berisi keterangan (produk, toko, tanggal, pelanggan). Query analitik jadi sederhana: gabungkan fakta dengan dimensi, lalu kelompokkan.',
        'Jika data terlalu besar untuk satu mesin, dipakai pemrosesan terdistribusi seperti **Apache Spark**: data dipecah menjadi banyak partisi yang diproses paralel di banyak komputer. API DataFrame Spark mirip Pandas/SQL dan juga bersifat lazy. Prinsipnya: pakai alat paling sederhana yang cukup, karena Spark menambah kerumitan dan biaya.',
      ],
      uses: [
        'Dashboard penjualan harian seluruh cabang dari satu sumber data yang dipercaya',
        'Menyiapkan tabel fitur untuk model ML dari data transaksi bertahun-tahun',
        'Laporan keuangan & operasional otomatis setiap pagi',
        'Mengolah log aplikasi berukuran terabita dengan Spark',
      ],
      examples: [
        {
          title: 'Skema bintang mini dengan SQLite (fakta + dimensi)',
          code: py`
import sqlite3, pandas as pd  # database bawaan Python & tabel

db = sqlite3.connect(":memory:")  # database sementara di memori (di komputer: "warehouse.db")
db.executescript("""
CREATE TABLE dim_produk (id_produk INTEGER PRIMARY KEY, nama TEXT, kategori TEXT);
CREATE TABLE dim_toko   (id_toko INTEGER PRIMARY KEY, kota TEXT);
CREATE TABLE fakta_jual (tanggal TEXT, id_produk INTEGER, id_toko INTEGER, jumlah INTEGER, harga INTEGER);
INSERT INTO dim_produk VALUES (1,'Kopi susu','Minuman'),(2,'Teh manis','Minuman'),(3,'Roti bakar','Makanan');
INSERT INTO dim_toko   VALUES (10,'Bandung'),(20,'Bogor');
INSERT INTO fakta_jual VALUES
 ('2026-01-05',1,10,30,18000),('2026-01-05',3,10,12,15000),('2026-01-06',2,20,40,8000),
 ('2026-02-02',1,20,25,18000),('2026-02-03',3,20,20,15000),('2026-02-03',1,10,35,18000);
""")  # 2 tabel dimensi + 1 tabel fakta

q = """
SELECT substr(f.tanggal, 1, 7) AS bulan, t.kota, p.kategori,
       SUM(f.jumlah * f.harga)  AS omzet
FROM fakta_jual f
JOIN dim_produk p ON p.id_produk = f.id_produk
JOIN dim_toko   t ON t.id_toko   = f.id_toko
GROUP BY bulan, t.kota, p.kategori
ORDER BY bulan, omzet DESC
"""  # fakta digabung dengan dimensi, lalu dikelompokkan
print(pd.read_sql(q, db))  # hasil query sebagai DataFrame`,
        },
        {
          title: 'ETL sederhana: data mentah berantakan → tabel fakta bersih',
          code: py`
import sqlite3, pandas as pd  # database & tabel

mentah = pd.DataFrame({  # EXTRACT: data mentah dari aplikasi kasir (format tidak rapi)
    "waktu": ["05/01/2026 09:12", "05/01/2026 10:40", "06/01/2026 08:05", "06/01/2026 08:05"],
    "produk": ["KOPI SUSU ", "roti bakar", "Kopi Susu", "Kopi Susu"],
    "qty": ["2", "1", "3", "3"],
    "total": ["36.000", "15.000", "54.000", "54.000"],
})
produk = {"kopi susu": 1, "roti bakar": 3}  # pemetaan nama -> id dari tabel dimensi

bersih = (mentah.drop_duplicates()  # TRANSFORM: buang baris ganda
    .assign(
        tanggal=lambda d: pd.to_datetime(d["waktu"], format="%d/%m/%Y %H:%M").dt.strftime("%Y-%m-%d"),  # format tanggal standar
        id_produk=lambda d: d["produk"].str.strip().str.lower().map(produk),  # rapikan nama lalu cari id
        jumlah=lambda d: d["qty"].astype(int),  # teks -> angka
        nilai=lambda d: d["total"].str.replace(".", "", regex=False).astype(int),  # "36.000" -> 36000
    )[["tanggal", "id_produk", "jumlah", "nilai"]])

db = sqlite3.connect(":memory:")  # gudang data
bersih.to_sql("fakta_jual", db, index=False)  # LOAD: simpan ke tabel fakta
print(pd.read_sql("SELECT tanggal, SUM(nilai) AS omzet FROM fakta_jual GROUP BY tanggal", db))  # siap dianalisis`,
        },
        {
          title: 'Apache Spark (PySpark): API DataFrame terdistribusi',
          runnable: false,
          note: 'Jalankan di Colab/komputer dengan Java: pip install pyspark. Di produksi biasanya di cluster (Databricks, Dataproc, EMR).',
          code: py`
from pyspark.sql import SparkSession, functions as F  # Spark & fungsi kolom

spark = SparkSession.builder.appName("omzet").getOrCreate()  # mulai sesi Spark
jual = spark.read.parquet("data/fakta_jual/")  # folder berisi banyak file Parquet (partisi)
produk = spark.read.parquet("data/dim_produk/")  # tabel dimensi

hasil = (jual.join(produk, "id_produk")  # gabung fakta & dimensi
    .withColumn("bulan", F.date_format("tanggal", "yyyy-MM"))  # kolom bulan
    .groupBy("bulan", "kategori")  # kelompokkan
    .agg(F.sum(F.col("jumlah") * F.col("harga")).alias("omzet"))  # total omzet
    .orderBy("bulan"))  # masih lazy: belum dihitung

hasil.show()  # baru dijalankan paralel di semua partisi
hasil.write.mode("overwrite").partitionBy("bulan").parquet("data/omzet_bulanan/")  # simpan per bulan`,
        },
      ],
      exercise: {
        task: 'Dengan skema bintang di contoh pertama, tulis query yang menampilkan **produk terlaris (berdasarkan jumlah terjual) di setiap kota**, beserta jumlahnya.',
        hint: 'Hitung dulu total jumlah per (kota, produk) dalam subquery/CTE, lalu ambil yang terbesar per kota. Bisa dengan `MAX` + JOIN, atau window function `ROW_NUMBER() OVER (PARTITION BY kota ORDER BY total DESC)`.',
        solution: py`
import sqlite3, pandas as pd  # database & tabel

db = sqlite3.connect(":memory:")  # database sementara
db.executescript("""
CREATE TABLE dim_produk (id_produk INTEGER PRIMARY KEY, nama TEXT, kategori TEXT);
CREATE TABLE dim_toko   (id_toko INTEGER PRIMARY KEY, kota TEXT);
CREATE TABLE fakta_jual (tanggal TEXT, id_produk INTEGER, id_toko INTEGER, jumlah INTEGER, harga INTEGER);
INSERT INTO dim_produk VALUES (1,'Kopi susu','Minuman'),(2,'Teh manis','Minuman'),(3,'Roti bakar','Makanan');
INSERT INTO dim_toko   VALUES (10,'Bandung'),(20,'Bogor');
INSERT INTO fakta_jual VALUES
 ('2026-01-05',1,10,30,18000),('2026-01-05',3,10,12,15000),('2026-01-06',2,20,40,8000),
 ('2026-02-02',1,20,25,18000),('2026-02-03',3,20,20,15000),('2026-02-03',1,10,35,18000);
""")  # data yang sama dengan contoh
q = """
WITH total AS (                                   -- jumlah terjual per kota & produk
  SELECT t.kota, p.nama, SUM(f.jumlah) AS terjual
  FROM fakta_jual f
  JOIN dim_produk p USING (id_produk)
  JOIN dim_toko   t USING (id_toko)
  GROUP BY t.kota, p.nama
), peringkat AS (                                 -- beri peringkat di dalam setiap kota
  SELECT *, ROW_NUMBER() OVER (PARTITION BY kota ORDER BY terjual DESC) AS urutan
  FROM total
)
SELECT kota, nama AS terlaris, terjual FROM peringkat WHERE urutan = 1
"""  # ambil peringkat pertama per kota
print(pd.read_sql(q, db))  # Bandung: Kopi susu 65, Bogor: Teh manis 40`,
      },
      steps: [
        ['Tentukan pertanyaan bisnis', 'Laporan apa yang dibutuhkan, seberapa sering, oleh siapa.'],
        ['Rancang skema bintang', 'Tabel fakta (kejadian + angka) dan dimensi (keterangan).'],
        ['Bangun ETL/ELT', 'Ekstrak dari sumber, bersihkan & samakan format, muat ke warehouse.'],
        ['Jadwalkan & uji', 'Jalankan otomatis; tes jumlah baris, duplikat, dan nilai kosong setiap kali.'],
        ['Skalakan bila perlu', 'Partisi per tanggal, Parquet, dan Spark/warehouse cloud saat data membesar.'],
      ],
      case: {
        title: 'Satu sumber kebenaran untuk UMKM tiga cabang',
        situation: 'Pemilik usaha kopi dengan 3 cabang menerima laporan Excel berbeda format dari setiap cabang, sehingga angka omzet sering tidak cocok. Ia ingin satu laporan bulanan yang selalu konsisten.',
        steps: [
          'Kumpulkan file dari setiap cabang (extract) apa adanya ke folder "mentah".',
          'Samakan format: tanggal, nama produk, angka rupiah, dan buang duplikat (transform).',
          'Muat ke tabel fakta & dimensi di satu database (load).',
          'Laporan bulanan dihitung dengan SQL yang sama setiap bulan, plus pemeriksaan otomatis.',
        ],
        code: py`
import sqlite3, pandas as pd  # database & tabel

cabang = {  # EXTRACT: format setiap cabang berbeda
    "Dago":   pd.DataFrame({"Tanggal": ["2026-03-01", "2026-03-02"], "Menu": ["Kopi Susu", "Roti"], "Omzet": [540000, 210000]}),
    "Bogor":  pd.DataFrame({"tgl": ["01/03/2026", "02/03/2026"], "item": ["kopi susu", "kopi susu"], "rp": ["612.000", "580.000"]}),
    "Depok":  pd.DataFrame({"date": ["2026-03-01"], "product": ["ROTI"], "sales_idr": [150000]}),
}
seragam = []  # TRANSFORM: samakan nama kolom & format
for nama, d in cabang.items():
    d = d.copy()
    d.columns = ["tanggal", "produk", "omzet"]  # nama kolom standar
    d["tanggal"] = pd.to_datetime(d["tanggal"], dayfirst=True, format="mixed").dt.strftime("%Y-%m-%d")  # format tanggal campuran
    d["produk"] = d["produk"].str.strip().str.lower()  # nama produk seragam
    d["omzet"] = d["omzet"].astype(str).str.replace(".", "", regex=False).astype(int)  # "612.000" -> 612000
    d["cabang"] = nama  # dimensi cabang
    seragam.append(d)

db = sqlite3.connect(":memory:")  # LOAD ke gudang data
pd.concat(seragam).to_sql("fakta_jual", db, index=False)
lap = pd.read_sql("SELECT cabang, produk, SUM(omzet) AS omzet FROM fakta_jual GROUP BY cabang, produk ORDER BY omzet DESC", db)
print(lap)  # laporan konsisten dari satu sumber
assert lap["omzet"].sum() == 540000 + 210000 + 612000 + 580000 + 150000, "total tidak cocok!"  # pemeriksaan otomatis
print("total cocok dengan data mentah ✓")`,
        result: 'Ketiga format berbeda menjadi satu tabel fakta yang seragam, dan laporan bulanan selalu dihitung dengan query yang sama. Pemeriksaan total otomatis memastikan tidak ada omzet yang hilang atau terhitung dua kali dalam proses ETL.',
      },
      deep: {
        concepts: [
          ['OLTP vs OLAP', 'Database aplikasi (OLTP) dioptimasi untuk banyak transaksi kecil (simpan pesanan satu per satu). Warehouse (OLAP) dioptimasi untuk query besar yang membaca jutaan baris sekaligus, biasanya dengan penyimpanan berbasis kolom.'],
          ['Partisi', 'Data dibagi berdasarkan kolom yang sering disaring, misalnya tanggal. Query "bulan Maret" hanya membaca partisi Maret, sehingga jauh lebih cepat dan murah (warehouse cloud sering menagih berdasarkan data yang dibaca).'],
          ['Data lake & lakehouse', 'Data lake menyimpan file mentah apa pun (CSV, JSON, Parquet, gambar) dengan murah. Lakehouse (mis. Delta Lake, Apache Iceberg) menambahkan fitur tabel seperti transaksi dan versi di atas file Parquet.'],
          ['Shuffle di Spark', 'Operasi seperti groupBy dan join memindahkan data antar mesin (shuffle), yang paling mahal. Kurangi dengan menyaring data lebih awal dan memilih kunci partisi yang tepat.'],
        ],
        mistakes: [
          ['Langsung memakai Spark untuk data beberapa GB.', 'Pandas dengan trik hemat memori, Polars, atau DuckDB biasanya cukup dan jauh lebih sederhana.'],
          ['ETL tanpa pemeriksaan jumlah baris & total.', 'Bandingkan jumlah baris dan total angka sebelum dan sesudah transformasi.'],
          ['Menyimpan semua kolom di satu tabel super lebar.', 'Pisahkan fakta dan dimensi agar mudah dirawat dan konsisten.'],
        ],
        tips: [
          'Untuk latihan gratis: BigQuery Sandbox punya banyak dataset publik yang bisa di-query dengan SQL.',
          'dbt membantu mengelola transformasi SQL sebagai kode (versi, tes, dokumentasi).',
        ],
        check: [
          ['Apa isi tabel fakta dan tabel dimensi pada skema bintang?', 'Tabel fakta berisi kejadian beserta angka yang dijumlahkan (jumlah, harga) dan kunci ke dimensi; tabel dimensi berisi keterangan seperti nama produk, kategori, kota, atau tanggal.'],
          ['Kapan sebaiknya beralih ke Spark?', 'Saat data atau komputasi sudah tidak muat/terlalu lambat di satu mesin walau sudah memakai Parquet, Polars, atau DuckDB.'],
        ],
      },
    },
  ],

  // ---------------- Mahir: Machine Learning ----------------
  'machine-learning': [
    {
      after: 'ml-imbalance',
      id: 'ml-anomali',
      title: 'Deteksi anomali klasik',
      summary: 'Menemukan data yang "tidak biasa" tanpa label: z-score, IQR, Isolation Forest, dan Local Outlier Factor.',
      explain: [
        '**Anomali** adalah data yang menyimpang jauh dari pola umum: transaksi janggal, sensor rusak, login mencurigakan, atau kesalahan input. Masalahnya, anomali jarang terjadi dan sering **tidak punya label**, jadi kita tidak bisa melatih klasifikasi biasa.',
        'Cara paling sederhana memakai statistik satu kolom: **z-score** (berapa simpangan baku dari rata-rata, mis. |z| > 3) atau aturan **IQR** (di luar Q1 − 1,5·IQR dan Q3 + 1,5·IQR). IQR lebih tahan terhadap outlier ekstrem karena memakai kuartil, bukan rata-rata.',
        '**Isolation Forest** bekerja dengan memotong data secara acak berulang kali. Data yang aneh lebih cepat "terisolasi" (butuh lebih sedikit potongan), sehingga mendapat skor anomali tinggi. Cepat dan bekerja baik untuk banyak kolom sekaligus.',
        '**Local Outlier Factor (LOF)** membandingkan kepadatan sekitar sebuah titik dengan kepadatan tetangganya. Cocok untuk anomali yang hanya aneh "secara lokal". Untuk data berurutan waktu, bandingkan dengan pola sebelumnya (mis. median bergerak). Untuk data kompleks seperti gambar, autoencoder (tahap Deep Learning) bisa dipakai.',
      ],
      uses: [
        'Menandai transaksi keuangan yang mencurigakan untuk diperiksa manusia',
        'Mendeteksi sensor/mesin yang mulai rusak',
        'Menemukan kesalahan input data sebelum dianalisis',
        'Memantau lalu lintas jaringan dan login yang tidak wajar',
      ],
      examples: [
        {
          title: 'Z-score vs IQR pada nominal transaksi',
          code: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(0)  # seed
nominal = np.concatenate([rng.normal(150_000, 40_000, 500), [1_900_000, 2_500_000, 3_000_000]])  # 500 normal + 3 sangat besar
s = pd.Series(nominal.round(-3))  # dibulatkan ke ribuan

z = (s - s.mean()) / s.std()  # z-score: jarak dari rata-rata dalam satuan simpangan baku
q1, q3 = s.quantile([0.25, 0.75])  # kuartil 1 & 3
iqr = q3 - q1  # rentang antar-kuartil
batas_atas = q3 + 1.5 * iqr  # aturan IQR

print("rata-rata & std ikut 'tertarik' outlier:", int(s.mean()), int(s.std()))  # dipengaruhi nilai ekstrem
print("anomali z-score (|z|>3):", int((z.abs() > 3).sum()))  # jumlah yang ditandai
print(f"anomali IQR (> {batas_atas:,.0f}):", int((s > batas_atas).sum()))  # bisa ikut menandai beberapa yang hanya agak besar`,
        },
        {
          title: 'Isolation Forest & LOF pada data 2 dimensi',
          code: py`
import numpy as np  # angka
from sklearn.ensemble import IsolationForest  # isolasi acak
from sklearn.neighbors import LocalOutlierFactor  # kepadatan lokal

rng = np.random.default_rng(2)  # seed
normal = np.vstack([rng.normal([2, 2], 0.4, (200, 2)), rng.normal([6, 5], 0.6, (200, 2))])  # dua kelompok normal
aneh = np.array([[4, 8], [9, 1], [0, 6], [4, 3.6], [7.5, 1.5]])  # 5 anomali yang kita tanam
X = np.vstack([normal, aneh])  # gabungkan
benar = np.r_[np.zeros(len(normal)), np.ones(len(aneh))]  # 1 = anomali (hanya untuk menilai)

iso = IsolationForest(contamination=0.02, random_state=0).fit(X)  # perkiraan 2% data anomali
skor_iso = -iso.score_samples(X)  # makin besar makin aneh
lof = LocalOutlierFactor(n_neighbors=20)  # bandingkan dengan 20 tetangga
lof.fit_predict(X)  # hitung faktor outlier
skor_lof = -lof.negative_outlier_factor_  # makin besar makin aneh

for nama, skor in [("Isolation Forest", skor_iso), ("LOF", skor_lof)]:  # nilai keduanya
    top = np.argsort(skor)[-5:]  # 5 skor tertinggi
    print(f"{nama:16s}: {int(benar[top].sum())}/5 anomali tanaman ada di 5 teratas")  # precision@5`,
        },
      ],
      exercise: {
        task: 'Sensor suhu mesin mencatat 500 bacaan per menit (sekitar 60 °C dengan pola naik-turun pelan dan noise). Sisipkan 4 lonjakan palsu (mis. +15 °C). Deteksi lonjakan dengan membandingkan setiap bacaan terhadap median bergerak 15 titik: tandai jika selisihnya lebih dari 6 × MAD (median absolute deviation) dari selisih tersebut. (6 × MAD kira-kira setara 4 simpangan baku, sehingga alarm palsu jarang.)',
        hint: '`s.rolling(15, center=True).median()`, selisih = s − median. MAD = median(|selisih − median(selisih)|).',
        solution: py`
import numpy as np, pandas as pd  # angka & tabel

rng = np.random.default_rng(6)  # seed
t = np.arange(500)  # menit ke-0 sampai 499
suhu = 60 + 3 * np.sin(t / 40) + rng.normal(0, 0.5, 500)  # pola pelan + noise
lonjakan = [80, 210, 333, 470]  # posisi kerusakan yang kita tanam
suhu[lonjakan] += 15  # lonjakan +15 °C
s = pd.Series(suhu)  # deret waktu

median_gerak = s.rolling(15, center=True, min_periods=1).median()  # pola "normal" di sekitar setiap titik
selisih = s - median_gerak  # seberapa jauh dari pola lokal
mad = (selisih - selisih.median()).abs().median()  # sebaran selisih yang tahan outlier
terdeteksi = list(s.index[(selisih - selisih.median()).abs() > 6 * mad])  # aturan 6 x MAD (≈ 4 simpangan baku)
print("terdeteksi:", terdeteksi)  # harus sama dengan posisi lonjakan
print("sesuai:", terdeteksi == lonjakan)`,
      },
      steps: [
        ['Definisikan "tidak biasa"', 'Bersama pakar domain: apa contoh anomali yang penting?'],
        ['Mulai dari aturan sederhana', 'z-score/IQR per kolom, median bergerak untuk deret waktu.'],
        ['Pakai model multi-kolom', 'Isolation Forest atau LOF setelah fitur di-scaling.'],
        ['Urutkan, jangan langsung blokir', 'Ambil N skor tertinggi untuk diperiksa manusia.'],
        ['Kumpulkan umpan balik', 'Hasil pemeriksaan menjadi label untuk evaluasi dan model supervised nanti.'],
      ],
      case: {
        title: 'Transaksi janggal di koperasi simpan pinjam',
        situation: 'Koperasi ingin petugas memeriksa 10 transaksi paling janggal setiap minggu. Tidak ada label "penipuan" sebelumnya. Fitur yang tersedia: nominal, jam transaksi, dan jumlah transaksi anggota di hari yang sama.',
        steps: [
          'Buat fitur dan lakukan scaling dengan RobustScaler (tahan outlier).',
          'Latih Isolation Forest pada transaksi satu bulan terakhir.',
          'Tampilkan 10 skor tertinggi beserta alasan yang mudah dibaca (nilai fitur yang ekstrem).',
          'Petugas menandai hasil pemeriksaan; catatan ini menjadi label untuk evaluasi berikutnya.',
        ],
        code: py`
import numpy as np, pandas as pd  # angka & tabel
from sklearn.ensemble import IsolationForest  # model anomali
from sklearn.preprocessing import RobustScaler  # scaling berbasis median & IQR

rng = np.random.default_rng(12)  # seed (data tiruan)
n = 2000  # transaksi sebulan
df = pd.DataFrame({
    "nominal": rng.lognormal(12, 0.6, n).round(-3),  # sebagian besar ratusan ribu
    "jam": rng.normal(11, 2.5, n).clip(7, 17).round(),  # jam kerja koperasi
    "transaksi_hari_itu": rng.poisson(1.2, n) + 1,  # biasanya 1-3 kali
})
df.loc[[100, 777, 1500], ["nominal", "jam", "transaksi_hari_itu"]] = [[9_500_000, 23, 1], [450_000, 3, 9], [7_200_000, 2, 6]]  # 3 kasus janggal

X = RobustScaler().fit_transform(df)  # samakan skala tanpa terpengaruh outlier
model = IsolationForest(n_estimators=300, random_state=0).fit(X)  # latih tanpa label
df["skor"] = -model.score_samples(X)  # makin besar makin janggal
periksa = df.sort_values("skor", ascending=False).head(10)  # daftar untuk petugas
print(periksa.round(3))  # 3 kasus tanaman seharusnya di urutan atas`,
        result: 'Tiga kasus janggal (nominal sangat besar di luar jam kerja, transaksi berulang dini hari) muncul di urutan teratas daftar periksa. Model membantu memilih apa yang diperiksa, sedangkan keputusan tetap di tangan petugas.',
      },
      deep: {
        concepts: [
          ['Parameter contamination', '`contamination` hanya menentukan ambang untuk label -1/1 (berapa persen yang dianggap anomali). Skor anomalinya sendiri tidak berubah. Dalam praktik, lebih aman memakai urutan skor dan kapasitas pemeriksaan (mis. 10 per minggu).'],
          ['Anomali ≠ penipuan', 'Data aneh bisa saja sah (pelanggan kaya, promo besar). Karena itu hasil deteksi anomali sebaiknya diperiksa manusia, bukan langsung memblokir.'],
          ['Evaluasi tanpa label', 'Tanam anomali sintetis untuk menguji, minta pakar menilai daftar teratas (precision@k), dan pantau berapa persen hasil yang ternyata benar-benar bermasalah.'],
        ],
        mistakes: [
          ['Memakai z-score pada data yang sangat miring (mis. nominal uang).', 'Transformasi log dulu, atau pakai IQR/MAD yang lebih tahan outlier.'],
          ['Lupa scaling sebelum LOF/KNN.', 'Fitur bersatuan besar (rupiah) akan mendominasi jarak.'],
          ['Langsung memblokir transaksi berdasarkan skor.', 'Gunakan sebagai prioritas pemeriksaan, dengan umpan balik manusia.'],
        ],
        tips: [
          'Library khusus: PyOD (puluhan algoritma deteksi anomali).',
          'Dataset latihan: Numenta Anomaly Benchmark (deret waktu berlabel) dan Credit Card Fraud (Kaggle).',
        ],
        check: [
          ['Kenapa Isolation Forest memberi skor tinggi pada data aneh?', 'Data aneh terletak di daerah yang jarang, sehingga cepat terpisah oleh potongan acak; jumlah potongan yang sedikit berarti skor anomali tinggi.'],
          ['Kapan IQR lebih baik daripada z-score?', 'Saat data miring atau sudah mengandung outlier besar, karena kuartil tidak ikut "tertarik" oleh nilai ekstrem seperti rata-rata dan simpangan baku.'],
        ],
      },
    },
  ],

  // ---------------- Profesional: Deploy & MLOps ----------------
  deploy: [
    {
      after: 'dep-tracking',
      id: 'dep-cicd',
      title: 'CI/CD, testing model & versi data (DVC)',
      summary: 'Setiap perubahan kode, data, atau model dites otomatis sebelum dipakai, dan setiap versi data bisa dilacak ulang.',
      explain: [
        '**CI (continuous integration)**: setiap kali kode di-push, server otomatis menjalankan tes. **CD (continuous delivery/deployment)**: jika tes lulus, versi baru otomatis disiapkan atau di-deploy. Contoh layanan: GitHub Actions, GitLab CI.',
        'Tes untuk proyek ML lebih dari tes kode biasa. Ada tiga lapis: **tes kode** (fungsi pra-proses benar), **tes data** (kolom lengkap, tipe benar, nilai dalam rentang wajar, tidak terlalu banyak kosong), dan **gerbang kualitas model** (akurasi minimal, dan tidak lebih buruk dari model yang sedang dipakai).',
        'Git tidak cocok untuk file data/model yang besar. **DVC (Data Version Control)** menyimpan file besar di penyimpanan terpisah (folder bersama, S3, Google Drive), sementara Git hanya menyimpan file kecil `.dvc` berisi "sidik jari" (hash) datanya. Hasilnya: setiap commit tahu persis versi data mana yang dipakai.',
        'Gabungan keduanya memberi **reproducibility**: siapa pun bisa `git checkout` sebuah versi, `dvc pull` datanya, menjalankan pipeline, dan mendapat model yang sama, sebuah syarat penting untuk audit dan debugging di produksi.',
      ],
      uses: [
        'Mencegah model yang lebih buruk ter-deploy tanpa sengaja',
        'Menangkap perubahan skema data (kolom berganti nama, tipe berubah) sebelum merusak prediksi',
        'Melacak versi data mana yang dipakai untuk melatih model tertentu',
        'Kolaborasi tim: setiap pull request otomatis dites',
      ],
      examples: [
        {
          title: 'Tes data & gerbang kualitas model (gaya pytest)',
          code: py`
import pandas as pd  # tabel
from sklearn.datasets import load_breast_cancer  # data contoh
from sklearn.model_selection import train_test_split  # pembagian data
from sklearn.pipeline import make_pipeline  # gabungan langkah
from sklearn.preprocessing import StandardScaler  # scaling
from sklearn.linear_model import LogisticRegression  # model

data = load_breast_cancer(as_frame=True)  # muat data
df = data.frame  # tabel fitur + target

def test_skema_data():  # tes data: kolom & nilai wajar
    assert "target" in df.columns, "kolom target hilang"  # kolom wajib ada
    assert df.isna().mean().max() < 0.05, "terlalu banyak data kosong"  # maks 5% kosong
    assert df["mean radius"].between(0, 50).all(), "radius di luar rentang wajar"  # cek rentang

def test_gerbang_kualitas():  # tes model: harus lulus batas minimal
    X_tr, X_te, y_tr, y_te = train_test_split(df.drop(columns="target"), df["target"], random_state=0, stratify=df["target"])  # split tetap
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)  # latih
    akurasi = model.score(X_te, y_te)  # nilai di data uji
    assert akurasi >= 0.93, f"akurasi {akurasi:.3f} di bawah batas 0.93"  # gerbang kualitas

for tes in [test_skema_data, test_gerbang_kualitas]:  # pytest menjalankan semua fungsi test_ otomatis
    try:
        tes(); print("PASS", tes.__name__)  # lulus
    except AssertionError as e:
        print("FAIL", tes.__name__, "-", e)  # gagal + alasannya`,
        },
        {
          title: 'GitHub Actions: jalankan tes setiap push',
          runnable: false,
          file: '.github/workflows/ci.yml',
          note: 'Simpan di repo sebagai .github/workflows/ci.yml; hasilnya terlihat di tab "Actions" GitHub.',
          code: py`
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest -q`,
        },
        {
          title: 'DVC: melacak versi data dengan Git',
          runnable: false,
          file: 'terminal',
          code: py`
pip install dvc
dvc init                                   # siapkan DVC di repo Git
dvc add data/transaksi.csv                 # lacak file besar -> membuat data/transaksi.csv.dvc
git add data/transaksi.csv.dvc data/.gitignore
git commit -m "Data transaksi v1"          # Git hanya menyimpan "sidik jari" data
dvc remote add -d gudang ../penyimpanan-dvc   # lokasi penyimpanan (folder bersama, S3, dll.)
dvc push                                   # unggah data ke penyimpanan

# di komputer lain / versi lama:
git checkout <commit-lama>
dvc pull                                   # ambil data yang sesuai commit itu`,
        },
      ],
      exercise: {
        task: 'Buat fungsi `boleh_deploy(model_baru, model_lama, X_uji, y_uji, toleransi=0.01)` yang hanya mengizinkan deploy jika akurasi model baru tidak lebih buruk dari model lama dikurangi toleransi. Uji dengan model lama = regresi logistik dan model baru = decision tree dengan `max_depth=1` (sengaja jelek) pada dataset `load_wine`.',
        hint: 'Hitung `model.score(X_uji, y_uji)` untuk keduanya. Kembalikan (boolean, pesan).',
        solution: py`
from sklearn.datasets import load_wine  # data
from sklearn.model_selection import train_test_split  # split
from sklearn.pipeline import make_pipeline  # pipeline
from sklearn.preprocessing import StandardScaler  # scaling
from sklearn.linear_model import LogisticRegression  # model lama
from sklearn.tree import DecisionTreeClassifier  # model baru

def boleh_deploy(baru, lama, X, y, toleransi=0.01):  # gerbang kualitas
    a_baru, a_lama = baru.score(X, y), lama.score(X, y)  # akurasi keduanya di data uji yang sama
    ok = a_baru >= a_lama - toleransi  # tidak boleh lebih buruk dari batas
    return ok, f"baru {a_baru:.3f} vs lama {a_lama:.3f} -> {'DEPLOY' if ok else 'TOLAK'}"  # keputusan

X, y = load_wine(return_X_y=True)  # data
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0, stratify=y)  # split tetap
lama = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000)).fit(X_tr, y_tr)  # model yang sedang dipakai
baru = DecisionTreeClassifier(max_depth=1, random_state=0).fit(X_tr, y_tr)  # kandidat (sengaja lemah)
print(boleh_deploy(baru, lama, X_te, y_te))  # harus ditolak`,
      },
      steps: [
        ['Tulis tes kode', 'Fungsi pra-proses & fitur dengan pytest.'],
        ['Tulis tes data', 'Skema, tipe, rentang nilai, persentase kosong.'],
        ['Pasang gerbang kualitas', 'Batas minimal + bandingkan dengan model produksi.'],
        ['Otomatiskan di CI', 'GitHub Actions menjalankan semuanya setiap push/pull request.'],
        ['Versikan data & model', 'DVC (atau registry model) agar setiap hasil bisa diulang.'],
      ],
      case: {
        title: 'Kolom berganti nama, prediksi diam-diam rusak',
        situation: 'Tim aplikasi mengganti nama kolom `luas_m2` menjadi `luas` pada data harian. Pipeline lama tetap berjalan tanpa error karena kolom yang hilang diisi 0, tetapi prediksi harga rumah menjadi kacau selama seminggu sebelum ada yang sadar.',
        steps: [
          'Tulis skema data yang diharapkan: nama kolom, tipe, dan rentang wajar.',
          'Jalankan validasi pada setiap data baru sebelum masuk model; gagal → berhenti dan beri tahu tim.',
          'Masukkan validasi ini ke CI dan ke pipeline harian.',
          'Tambahkan pemantauan distribusi (drift) sebagai pengaman kedua.',
        ],
        code: py`
import pandas as pd  # tabel

SKEMA = {  # kolom: (tipe yang diharapkan, minimum, maksimum)
    "luas_m2": ("float", 15, 2000),
    "kamar": ("int", 1, 10),
    "kota": ("object", None, None),
}

def validasi(df):  # kembalikan daftar masalah (kosong = aman)
    masalah = []
    for kolom, (tipe, lo, hi) in SKEMA.items():  # cek setiap kolom wajib
        if kolom not in df.columns:
            masalah.append(f"kolom '{kolom}' tidak ada"); continue  # nama kolom berubah/hilang
        if tipe != "object" and not pd.api.types.is_numeric_dtype(df[kolom]):
            masalah.append(f"kolom '{kolom}' bukan angka")  # tipe berubah
        elif lo is not None and not df[kolom].between(lo, hi).all():
            masalah.append(f"kolom '{kolom}' ada nilai di luar {lo}-{hi}")  # nilai tidak wajar
    lebih = set(df.columns) - set(SKEMA)  # kolom asing
    if lebih: masalah.append(f"kolom tidak dikenal: {sorted(lebih)}")  # petunjuk penggantian nama
    return masalah

kemarin = pd.DataFrame({"luas_m2": [72.0, 120.0], "kamar": [2, 3], "kota": ["Bogor", "Depok"]})  # format lama
hari_ini = pd.DataFrame({"luas": [90.0, 45.0], "kamar": [3, 2], "kota": ["Bekasi", "Bogor"]})  # kolom diganti nama
for nama, d in [("kemarin", kemarin), ("hari ini", hari_ini)]:
    m = validasi(d)  # jalankan pemeriksaan
    print(nama, "->", "AMAN" if not m else "STOP: " + "; ".join(m))  # hentikan pipeline jika ada masalah`,
        result: 'Validasi skema langsung menghentikan pipeline pada hari pertama perubahan dan bahkan memberi petunjuk penyebabnya (ada kolom baru "luas"), sehingga prediksi rusak tidak sempat dipakai selama seminggu.',
      },
      deep: {
        concepts: [
          ['Tes ML yang efektif', 'Selain akurasi total, uji perilaku: prediksi tidak berubah drastis untuk perubahan input kecil, monoton di tempat yang seharusnya (luas lebih besar → harga tidak turun), dan performa per kelompok penting tidak anjlok.'],
          ['Model registry', 'Layanan seperti MLflow Model Registry menyimpan versi model beserta status (staging, production), sehingga rollback ke versi sebelumnya cukup satu perintah.'],
          ['Pipeline DVC', '`dvc.yaml` mendefinisikan tahapan (siapkan data → latih → evaluasi) beserta input-outputnya. `dvc repro` hanya menjalankan ulang tahap yang inputnya berubah, mirip `make`.'],
        ],
        mistakes: [
          ['Tes model memakai data acak yang berbeda setiap kali.', 'Pakai split & seed tetap agar hasil tes stabil dan tidak "kadang lulus kadang gagal".'],
          ['Menyimpan file data/model besar langsung di Git.', 'Pakai DVC, Git LFS, atau penyimpanan model terpisah.'],
          ['Hanya mengetes kode, tidak mengetes data.', 'Kebanyakan masalah ML di produksi berasal dari data yang berubah.'],
        ],
        tips: [
          'Library validasi data: pandera, Great Expectations.',
          'Simpan metrik evaluasi sebagai file (mis. `metrics.json`) agar bisa dibandingkan antar commit (`dvc metrics diff`).',
        ],
        check: [
          ['Apa yang disimpan Git ketika memakai DVC untuk file data 3 GB?', 'Hanya file kecil `.dvc` berisi hash dan informasi file; datanya sendiri disimpan di penyimpanan DVC (remote).'],
          ['Kenapa gerbang kualitas membandingkan dengan model produksi, bukan hanya angka minimal?', 'Agar model baru tidak lebih buruk dari yang sedang dipakai, walaupun masih di atas batas minimal.'],
        ],
      },
    },
  ],
}
