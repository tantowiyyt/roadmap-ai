// Penjelasan "bahasa bayi": versi paling sederhana dari setiap materi dan algoritma,
// memakai perumpamaan sehari-hari. `cerita` = penjelasan, `intinya` = satu kalimat ringkas.

const b = (cerita, intinya) => ({ cerita, intinya })

export const bayiMateri = {
  // ---------------- Fondasi & Tools ----------------
  'install-python': b(
    'Sebelum memasak, kita perlu dapur. **Python** adalah kompornya (yang menjalankan resep), dan **VS Code** adalah meja dapur yang rapi tempat kita menulis resep. Setelah keduanya terpasang, komputer siap diajak "memasak" program.',
    'Pasang Python (yang menjalankan kode) dan editor (tempat menulis kode).'),
  terminal: b(
    'Biasanya kita menyuruh komputer dengan menunjuk-nunjuk pakai mouse. **Terminal** adalah cara menyuruh komputer dengan **mengetik kalimat perintah**, seperti mengirim pesan singkat: "pindah ke folder ini", "jalankan program itu". Lebih cepat kalau sudah terbiasa.',
    'Terminal = menyuruh komputer dengan mengetik perintah.'),
  git: b(
    'Bayangkan main game yang punya tombol **simpan**. Setiap kali berhasil melewati level, kamu simpan. Kalau nanti kalah, tinggal kembali ke titik simpan terakhir. **Git** adalah tombol simpan untuk kode, dan **GitHub** adalah lemari online tempat menyimpan semua titik simpan itu supaya bisa dilihat teman.',
    'Git mencatat riwayat perubahan kode; GitHub menyimpannya online.'),
  notebook: b(
    'Notebook seperti **buku resep ajaib**: kamu menulis satu langkah resep, lalu hasil masakannya langsung muncul di bawahnya, bisa berupa angka, tabel, atau gambar. Lalu tulis langkah berikutnya, dan begitu seterusnya. **Google Colab** adalah buku ajaib yang sama, tapi dipinjamkan gratis lewat internet.',
    'Notebook = tulis kode dan langsung lihat hasilnya di bawahnya.'),

  // ---------------- Python Dasar ----------------
  'py-variabel': b(
    'Bayangkan toples-toples di dapur. Setiap toples diberi **stiker nama**: "gula", "garam", "umur". Isinya bisa diganti kapan saja. **Variabel** adalah stiker nama itu, dan **tipe data** adalah jenis isinya: angka bulat, angka desimal, tulisan, atau benar/salah.',
    'Variabel = nama untuk menyimpan nilai; tipe data = jenis nilainya.'),
  'py-operator': b(
    'Operator adalah **tombol-tombol kalkulator**: tambah, kurang, kali, bagi. Ada juga tombol untuk **membandingkan** ("apakah 5 lebih besar dari 3?" → ya) dan tombol **logika** ("hujan DAN tidak bawa payung" → basah).',
    'Operator = simbol untuk menghitung, membandingkan, dan menggabungkan syarat.'),
  'py-kondisi': b(
    'Seperti ibu yang bilang: "**Kalau** hujan, bawa payung. **Kalau tidak**, pakai topi." Program juga bisa memilih jalan berdasarkan keadaan. Itulah **if / elif / else**: komputer mengecek syaratnya dulu, baru memutuskan mau melakukan apa.',
    'if/else = program memilih tindakan berdasarkan syarat.'),
  'py-loop': b(
    'Kalau disuruh menulis "aku anak baik" 100 kali, tanganmu pegal. Komputer tidak pernah pegal: cukup bilang "**ulangi 100 kali**". **for** dipakai untuk "lakukan untuk setiap barang di keranjang", sedangkan **while** untuk "terus lakukan selama belum kenyang".',
    'Loop = mengulang perintah tanpa menulis ulang kodenya.'),
  'py-koleksi': b(
    'Ada empat jenis wadah. **List** seperti daftar belanja: urut dan bisa dicoret. **Tuple** seperti tanggal lahir: urut tapi tidak bisa diubah. **Dictionary** seperti buku telepon: cari nama, ketemu nomornya. **Set** seperti kumpulan stiker unik: tidak ada yang kembar.',
    'Pilih wadah sesuai kebutuhan: list, tuple, dict, atau set.'),
  'py-string': b(
    '**String** adalah tulisan, seperti untaian manik-manik huruf. Kita bisa memotongnya, membalik, mengganti huruf tertentu, membuat semuanya huruf kecil, atau mencari kata di dalamnya. Ini dasar penting untuk mengajari komputer memahami kalimat (NLP).',
    'String = teks; bisa dipotong, diganti, dan dicari.'),
  'py-fungsi': b(
    'Fungsi seperti **mesin jus**. Masukkan buah (input), tekan tombol, keluar jus (output). Mesin yang sama bisa dipakai berkali-kali untuk buah apa pun. Daripada menulis langkah yang sama berulang-ulang, bungkus saja jadi satu fungsi.',
    'Fungsi = kumpulan langkah bernama yang bisa dipakai ulang.'),
  'py-file': b(
    'Program biasanya lupa semuanya saat ditutup, seperti papan tulis yang dihapus. **Menyimpan ke file** sama dengan menulis di buku catatan: besok masih ada. Membaca file artinya membuka buku catatan itu lagi.',
    'Simpan data ke file supaya tidak hilang saat program ditutup.'),
  'py-error': b(
    'Error adalah komputer yang bilang "**aduh, ada yang salah!**", misalnya diminta membagi dengan nol. Pesan error memberi tahu apa dan di mana masalahnya. **try/except** seperti rencana cadangan: "coba lakukan ini; kalau gagal, lakukan itu saja".',
    'Baca pesan error dari bawah; pakai try/except untuk rencana cadangan.'),
  'py-modul-std': b(
    'Python datang membawa **kotak perkakas gratis**: ada alat menghitung (math), alat mengacak (random), kalender (datetime), dan penghitung (Counter). Sebelum membuat alat sendiri, cek dulu: jangan-jangan sudah ada di kotak perkakas.',
    'Banyak alat siap pakai sudah tersedia di Python tanpa install.'),

  // ---------------- Python Lanjutan ----------------
  'pyl-oop': b(
    '**Class** itu cetakan kue; **object** itu kue yang dicetak. Semua kue punya bentuk yang sama, tapi tiap kue bisa diberi topping berbeda (data), dan bisa "melakukan sesuatu" (method). Model AI juga object: `model.fit()` artinya "model, belajarlah!".',
    'Class = cetakan; object = benda hasil cetakan yang punya data & kemampuan.'),
  'pyl-modul': b(
    'Modul seperti **set LEGO tambahan**. Daripada membuat roda sendiri, beli saja set yang sudah ada rodanya. **pip** adalah toko tempat mengambil set-set itu. Kode kita sendiri juga bisa dibagi ke beberapa file supaya rapi.',
    'Modul = kode siap pakai; pip = cara memasangnya.'),
  'pyl-venv': b(
    'Kakak dan adik masing-masing punya **kotak mainan sendiri**, supaya mainan tidak tertukar atau rusak. Virtual environment adalah kotak mainan per proyek: library proyek A tidak mengganggu proyek B.',
    'Setiap proyek punya "kotak library" sendiri.'),
  'pyl-comprehension': b(
    'Ada cara singkat untuk membuat daftar baru dari daftar lama dalam **satu kalimat**: "ambil setiap buah, kupas, kalau sudah matang". Seperti menyaring dan mengolah sekaligus dalam satu gerakan.',
    'Comprehension = cara singkat membuat list/dict baru dalam satu baris.'),
  'pyl-generator': b(
    'Bayangkan **dispenser tisu**: tisunya keluar satu per satu saat ditarik, bukan langsung sekotak jatuh semua. Generator memberikan data satu per satu saat dibutuhkan, jadi hemat tempat walau datanya sangat banyak.',
    'Generator = memberi data sedikit demi sedikit, hemat memori.'),
  'pyl-decorator': b(
    'Decorator seperti **memasang casing pada HP**. HP-nya tetap sama, tapi sekarang punya kemampuan tambahan: tahan banting. Decorator menempelkan kemampuan tambahan (mis. mengukur waktu) ke fungsi tanpa mengubah isinya.',
    'Decorator = menambah kemampuan fungsi tanpa mengubah isinya.'),
  'pyl-regex': b(
    'Regex seperti **cetakan pencari**. Kamu bilang: "cari semua yang bentuknya 08 lalu angka-angka", dan komputer memungut semua nomor HP dari tumpukan teks. Bagus untuk mencari email, tanggal, atau harga yang tersebar di mana-mana.',
    'Regex = pola untuk mencari dan mengambil bagian teks.'),
  'pyl-api': b(
    'Di restoran, kamu tidak masuk ke dapur. Kamu cukup memesan lewat **pelayan**, lalu pelayan mengantar makanannya. **API** adalah pelayan itu: program kita memesan data (cuaca, jawaban AI) ke program lain lewat internet, lalu data dikirim kembali dalam bentuk **JSON**.',
    'API = cara program meminta data/layanan dari program lain.'),
  'pyl-test': b(
    'Koki selalu **mencicipi masakan** sebelum disajikan. Test adalah kode kecil yang mencicipi kode kita: "kalau diberi 2 dan 3, hasilnya harus 5". Kalau ada yang berubah rasa, test langsung memberi tahu.',
    'Test = pemeriksaan otomatis bahwa kode masih bekerja benar.'),

  // ---------------- Matematika ----------------
  'mat-vektor': b(
    'Bayangkan **kartu identitas berisi angka**: tinggi 150, berat 45, umur 12. Satu kartu itu disebut **vektor**. Kalau kartu satu kelas ditumpuk jadi tabel, itulah **matriks**. Komputer melihat foto, kata, dan data apa pun sebagai kumpulan angka seperti ini.',
    'Vektor = daftar angka; matriks = tabel angka. Bahasa dasar AI.'),
  'mat-aljabar': b(
    'Matriks bisa dipakai untuk **memutar, meregangkan, atau memipihkan** sekumpulan titik, seperti menarik adonan. Ada arah istimewa (**eigenvector**) yang tidak berbelok saat ditarik, hanya memanjang. Arah-arah ini dipakai untuk meringkas data (PCA).',
    'Matriks mengubah bentuk data; eigenvector = arah yang tetap lurus.'),
  'mat-turunan': b(
    'Kamu berdiri di bukit dengan mata tertutup. **Turunan** memberi tahu seberapa curam tanah di bawah kakimu dan ke arah mana menurunnya. Inilah cara AI tahu ke arah mana harus mengubah dirinya supaya kesalahannya berkurang.',
    'Turunan/gradien = petunjuk arah dan kecuraman.'),
  'mat-optimasi': b(
    'Masih di bukit gelap tadi, kamu ingin sampai ke **lembah paling bawah** (kesalahan paling kecil). Caranya: rasakan arah menurun, lalu melangkah sedikit, dan ulangi terus. Itulah **gradient descent**. Besar langkahnya disebut **learning rate**: terlalu besar bisa terpeleset, terlalu kecil lama sampainya.',
    'Gradient descent = melangkah sedikit-sedikit ke arah yang mengurangi error.'),
  'mat-prob': b(
    'Probabilitas adalah **seberapa yakin** sesuatu akan terjadi, dari 0 (mustahil) sampai 1 (pasti). Lalu **Teorema Bayes** mengajarkan cara mengubah keyakinan saat ada petunjuk baru: tadinya kira adik sudah tidur, lalu terdengar suara TV, maka keyakinanmu berubah.',
    'Peluang = tingkat keyakinan; Bayes = cara memperbaruinya dengan bukti.'),
  'mat-info': b(
    '**Entropi** mengukur seberapa banyak "kejutan". Kotak berisi permen satu rasa tidak ada kejutan; kotak berisi 10 rasa penuh kejutan. **Cross-entropy** mengukur seberapa kaget model saat melihat jawaban yang benar. Makin kaget, makin besar hukumannya, dan model belajar dari hukuman itu.',
    'Entropi = ketidakpastian; cross-entropy = hukuman saat model salah yakin.'),
  'mat-statistik': b(
    'Statistik adalah cara **meringkas banyak angka** jadi beberapa angka penting. **Rata-rata**: bagi rata. **Median**: anak yang berdiri paling tengah. **Standar deviasi**: apakah semua berdiri berdekatan atau berpencar. **Korelasi**: apakah dua hal naik-turun bersamaan.',
    'Statistik meringkas data: tengahnya di mana, sebarannya seberapa.'),
  'mat-inferensi': b(
    'Mau tahu rasa sepanci sayur, cukup **cicipi satu sendok** (sampel), tidak perlu menghabiskan sepanci (populasi). Statistik inferensial menjawab: seberapa yakin rasa satu sendok itu sama dengan rasa sepanci? Dan saat membandingkan dua resep, apakah bedanya nyata atau cuma kebetulan sendok yang diambil?',
    'Dari sampel kecil, tarik kesimpulan tentang yang besar, lengkap dengan seberapa yakin kita.'),

  // ---------------- Data Science Tools ----------------
  'ds-numpy': b(
    'Menghitung satu per satu itu lambat. **NumPy** seperti **mesin hitung massal**: berikan sejuta angka, dan semuanya dihitung sekaligus dalam sekejap, misalnya "kalikan semua harga dengan 2".',
    'NumPy = menghitung banyak angka sekaligus dengan sangat cepat.'),
  'ds-pandas': b(
    '**Pandas** adalah **Excel yang bisa diperintah dengan kode**. Kita bisa memilih kolom, menyaring baris ("hanya pelanggan dari Bandung"), mengelompokkan, dan menghitung total dengan beberapa baris kode saja.',
    'Pandas = alat mengolah tabel data dengan kode.'),
  'ds-dataset': b(
    'Mau belajar memasak, kita butuh **bahan**. Bahan bisa **dibeli jadi** di pasar (dataset siap pakai di Kaggle atau BPS), atau **ditanam sendiri** di kebun (survei, foto, catatan harian). Yang penting: bahannya segar, boleh dipakai, dan kita tahu asalnya.',
    'Dataset bisa diambil yang sudah ada atau dibuat sendiri; cek kualitas, izin, dan asal-usulnya.'),
  'ds-cleaning': b(
    'Sebelum dimasak, sayur harus **dicuci**: buang yang busuk, potong yang layu. Data juga begitu: ada yang kosong, ada yang dobel, ada yang salah ketik ("Jkt", "jakarta", "DKI Jakarta"). Membersihkan data adalah langkah paling penting sebelum membuat model.',
    'Data harus dibersihkan dulu: isi yang kosong, buang yang dobel, rapikan.'),
  'ds-viz': b(
    'Seribu angka di tabel bikin pusing, tapi **satu gambar** langsung terlihat polanya. Grafik garis untuk melihat naik-turun dari waktu ke waktu, batang untuk membandingkan, titik-titik untuk melihat hubungan dua hal.',
    'Visualisasi = mengubah angka jadi gambar agar polanya terlihat.'),
  'ds-eda': b(
    'Sebelum memasak, **lihat-lihat isi kulkas dulu**: ada bahan apa, mana yang hampir habis, mana yang aneh. EDA adalah tahap menjelajahi data dengan ringkasan dan grafik, supaya kita tahu ceritanya sebelum membuat model.',
    'EDA = kenali datamu dulu sebelum membuat model.'),
  'ds-timeseries': b(
    'Data deret waktu seperti **buku harian tinggi badan** yang dicatat tiap bulan, dan urutannya penting. Kita bisa melihat tren (makin tinggi), pola berulang (ramai tiap akhir pekan), dan memakai data kemarin untuk menebak besok.',
    'Time series = data berurutan waktu; perhatikan tren dan pola berulangnya.'),
  'ds-sql': b(
    'Data perusahaan disimpan di **gudang besar (database)**. **SQL** adalah bahasa untuk meminta tolong ke penjaga gudang: "ambilkan semua pesanan bulan ini, kelompokkan per kota, lalu jumlahkan". Penjaga gudang langsung mengambilkannya.',
    'SQL = bahasa untuk mengambil dan meringkas data dari database.'),
  'ds-data-besar': b(
    'Lemari kecil tidak muat semua baju sekaligus. Triknya: **lipat rapi** (tipe data hemat), **ambil yang perlu saja** (pilih kolom), atau **cuci sekeranjang demi sekeranjang** (baca per potongan). **Parquet** seperti lemari bersekat: mau ambil kaos saja, tidak perlu membongkar semua.',
    'Data besar diolah dengan hemat: ambil seperlunya, sedikit demi sedikit, dan simpan dalam format yang ringkas.'),
  'ds-warehouse': b(
    'Bayangkan **gudang pusat** sebuah toko waralaba: semua cabang mengirim barangnya ke sana, lalu barang **dirapikan dan diberi label yang sama** (ETL) sebelum ditata di rak. **Rak utama** mencatat setiap penjualan (tabel fakta), **papan keterangan** menjelaskan produk dan cabangnya (tabel dimensi). Kalau gudangnya raksasa, pekerjaan dibagi ke banyak pegawai sekaligus (Spark).',
    'Data warehouse = gudang data rapi untuk analisis; ETL = merapikan sebelum disimpan; Spark = kerja paralel untuk data raksasa.'),

  // ---------------- Machine Learning ----------------
  'ml-konsep': b(
    'Kita tidak mengajari anak mengenali kucing dengan aturan panjang. Kita cukup menunjukkan **banyak foto kucing**, dan lama-lama ia bisa sendiri. Machine learning sama: berikan banyak contoh beserta jawabannya, lalu komputer menemukan polanya sendiri. Nilainya diukur pakai **soal ujian yang belum pernah dilihat**.',
    'ML = komputer belajar pola dari contoh, lalu diuji di data baru.'),
  'ml-regresi': b(
    'Ada titik-titik di kertas: makin luas rumahnya, makin mahal harganya. **Regresi linear** menarik **satu garis lurus** yang paling dekat dengan semua titik. Lalu untuk rumah baru, cukup lihat garisnya untuk menebak harga.',
    'Regresi linear = garis lurus terbaik untuk menebak angka.'),
  'ml-klasifikasi': b(
    'Klasifikasi adalah **menebak "yang mana"**: email ini spam atau bukan? **Regresi logistik** memberi angka peluang (mis. 80% spam). **KNN** melihat teman-teman terdekat: "5 email yang paling mirip semuanya spam, berarti ini juga spam".',
    'Klasifikasi = menebak kategori; bisa lewat peluang atau tetangga terdekat.'),
  'ml-tree': b(
    '**Decision tree** seperti permainan tebak-tebakan: "Berkaki empat? Ya. Menggonggong? Ya → anjing!" **Random forest** bertanya ke **banyak pohon** lalu ambil suara terbanyak. **Gradient boosting** seperti les privat: setiap pohon baru fokus memperbaiki kesalahan pohon sebelumnya.',
    'Pohon = rangkaian pertanyaan ya/tidak; banyak pohon = lebih akurat.'),
  'ml-svm': b(
    'Ada dua kebun bersebelahan. Kita ingin membuat **jalan setapak di antaranya selebar mungkin**, supaya tidak menginjak tanaman siapa pun. SVM mencari garis pemisah yang jaraknya paling jauh dari kedua kelompok, sehingga paling aman untuk data baru.',
    'SVM = garis pemisah dengan "jalan" (margin) terlebar.'),
  'ml-clustering': b(
    'Kamu diberi sekantong kelereng tanpa petunjuk, lalu kamu **mengelompokkannya sendiri** berdasarkan warna dan ukuran. Itulah clustering. **PCA** seperti memotret patung 3D dari sudut terbaik: jadi gambar 2D, tapi bentuknya masih jelas dikenali.',
    'Clustering = mengelompokkan tanpa label; PCA = meringkas banyak kolom.'),
  'ml-evaluasi': b(
    'Bayangkan detektor maling. **Precision**: dari semua yang kamu tuduh, berapa yang benar-benar maling? (Jangan menuduh orang baik.) **Recall**: dari semua maling, berapa yang tertangkap? (Jangan ada yang lolos.) Akurasi saja bisa menipu kalau malingnya sangat sedikit.',
    'Pilih ukuran nilai yang sesuai dengan kesalahan mana yang paling mahal.'),
  'ml-imbalance': b(
    'Mencari **satu kelereng emas di antara seribu kelereng biasa**. Kalau asal tebak "biasa" terus, 99,9% benar, tapi emasnya tidak pernah ketemu. Data tidak seimbang butuh trik: beri bobot lebih ke kelas yang langka, dan ukur keberhasilan dengan recall/precision.',
    'Saat kelas penting sangat langka, jangan percaya akurasi saja.'),
  'ml-anomali': b(
    'Di antara ratusan bebek yang berenang searah, ada **satu yang berenang terbalik**. Mata kita langsung menemukannya tanpa ada yang memberi tahu. Deteksi anomali mengajari komputer menemukan "si bebek aneh" itu di data: transaksi janggal, mesin yang mulai rusak.',
    'Anomali = data yang beda sendiri dari kebanyakan; dicari tanpa perlu label.'),
  'ml-overfit': b(
    '**Overfitting** = menghafal kunci jawaban soal latihan nomor per nomor. Begitu soalnya diganti sedikit, langsung bingung. **Underfitting** = belajarnya terlalu sedikit. **Cross-validation** seperti try out berkali-kali dengan soal berbeda supaya nilainya adil.',
    'Model yang baik paham polanya, bukan menghafal contohnya.'),
  'ml-tuning': b(
    'Membuat kue enak perlu mencoba-coba **suhu oven dan lama memanggang**. Hyperparameter adalah pengaturan seperti itu. Tuning artinya mencoba banyak kombinasi pengaturan, lalu memilih yang hasilnya paling enak di try out (validasi).',
    'Tuning = mencari pengaturan model terbaik dengan mencoba-coba secara teratur.'),
  'ml-fitur': b(
    'Koki yang hebat tahu cara **mengolah bahan mentah jadi bumbu yang tepat**. Feature engineering adalah mengolah data mentah jadi petunjuk yang lebih jelas, misalnya dari "gaji" dan "cicilan" dibuat "rasio cicilan". **Pipeline** adalah jalur pabrik yang menjalankan semua langkah itu otomatis.',
    'Fitur yang bagus sering lebih penting daripada algoritma yang canggih.'),
  'ml-interpretasi': b(
    'Model yang bisa menebak saja tidak cukup; kita juga ingin tahu **alasannya**. Seperti detektif yang menjelaskan petunjuk mana yang paling membuatnya yakin. Ini membantu menemukan kesalahan dan menjelaskan keputusan ke orang lain.',
    'Interpretasi = mencari tahu kenapa model memutuskan begitu.'),
  'ml-rekomendasi': b(
    'Seperti **penjual langganan** yang hafal seleramu: "Kakak biasanya beli kopi susu, coba deh roti bakar ini, pelanggan lain yang suka kopi susu juga suka." Sistem rekomendasi mencari barang yang mirip dengan kesukaanmu, atau yang disukai orang yang seleranya mirip denganmu.',
    'Rekomendasi = menebak barang berikutnya yang kamu suka dari kebiasaanmu dan orang yang mirip denganmu.'),
  'ml-rl': b(
    'Seperti **belajar naik sepeda**: tidak ada yang memberi tahu jawaban persis, kita mencoba, jatuh (hukuman), seimbang sebentar (hadiah), lalu makin lama makin pintar. Kadang kita perlu **mencoba cara baru** (eksplorasi), kadang **memakai cara yang sudah terbukti** (eksploitasi).',
    'Reinforcement learning = belajar dari coba-coba dengan hadiah dan hukuman.'),

  // ---------------- Deep Learning ----------------
  'dl-nn': b(
    'Bayangkan **barisan anak-anak yang saling berbisik**. Barisan pertama mendengar data, menimbang mana yang penting (bobot), lalu membisikkan hasilnya ke barisan berikutnya, sampai barisan terakhir meneriakkan jawaban. Itulah neural network: banyak "neuron" kecil yang bekerja berlapis-lapis.',
    'Neural network = banyak neuron kecil berlapis yang mengoper hasil hitungan.'),
  'dl-backprop': b(
    'Setelah tim sepak bola kalah, pelatih **menelusuri mundur**: siapa yang salah oper, siapa yang telat lari. Lalu setiap pemain diberi koreksi sesuai kesalahannya. **Backpropagation** melakukan hal yang sama: menghitung mundur seberapa besar setiap bobot ikut menyebabkan kesalahan, lalu memperbaikinya sedikit.',
    'Backprop = menelusuri kesalahan dari belakang untuk memperbaiki setiap bobot.'),
  'dl-aktivasi': b(
    '**Fungsi aktivasi** seperti saklar pintar yang menentukan seberapa terang lampu menyala. **Loss** adalah angka "seberapa jauh dari sasaran", seperti skor lempar bola ke keranjang. **Optimizer** adalah gaya berjalan menuruni bukit untuk mengecilkan loss.',
    'Aktivasi menyalakan neuron, loss mengukur salah, optimizer memperbaiki.'),
  'dl-pytorch': b(
    '**PyTorch** adalah kotak perkakas untuk merakit neural network. Ia bisa menghitung turunan secara otomatis, jadi kita cukup menyusun lapisannya. Lalu kita ulangi resep latihan: tebak, hitung salahnya, perbaiki, ulangi.',
    'PyTorch = perkakas membuat dan melatih neural network.'),
  'dl-cnn': b(
    'CNN membaca gambar dengan **kaca pembesar kecil yang digeser** sedikit demi sedikit. Lapisan awal menemukan garis dan sudut, lapisan berikutnya menemukan bentuk (mata, roda), dan lapisan akhir mengenali benda utuh (kucing, mobil).',
    'CNN = mengenali gambar dengan filter kecil yang digeser.'),
  'dl-rnn': b(
    'RNN membaca kalimat **kata demi kata sambil mengingat** yang sudah dibaca, seperti mendengarkan cerita. Tapi ingatannya mudah pudar kalau ceritanya panjang. **LSTM** punya "buku catatan" supaya tidak cepat lupa.',
    'RNN = membaca berurutan sambil membawa ingatan.'),
  'dl-regularisasi': b(
    'Supaya murid tidak sekadar menghafal: **dropout** menyuruh beberapa pemain duduk secara acak saat latihan, supaya tim tidak bergantung pada satu bintang. **Augmentasi** menunjukkan kucing dari banyak gaya (miring, jauh, dekat). **Early stopping** berarti berhenti belajar sebelum mulai menghafal.',
    'Regularisasi = trik agar model paham, bukan menghafal.'),
  'dl-autoencoder': b(
    'Disuruh **meringkas cerita jadi 3 kata**, lalu menceritakan ulang dari 3 kata itu. Cerita yang biasa mudah diceritakan ulang; cerita yang aneh susah. Autoencoder memakai ini untuk menemukan data yang tidak biasa (anomali), misalnya mesin yang mulai rusak.',
    'Autoencoder = meringkas lalu membangun ulang; yang susah dibangun ulang berarti aneh.'),
  'dl-transfer': b(
    'Anak yang sudah **jago naik sepeda** lebih cepat belajar naik motor, karena keseimbangannya sudah terlatih. Transfer learning memakai model yang sudah belajar dari jutaan gambar, lalu cukup diajari sedikit lagi untuk tugas baru, sehingga hemat data dan waktu.',
    'Transfer learning = memakai ulang kemampuan model yang sudah terlatih.'),
  'dl-gpu': b(
    '**CPU** itu satu profesor jenius; **GPU** itu ribuan anak SD yang mengerjakan soal penjumlahan bersamaan. Melatih neural network butuh jutaan hitungan sederhana, jadi ribuan anak SD (GPU) jauh lebih cepat daripada satu profesor.',
    'GPU = ribuan prosesor kecil yang menghitung bersamaan.'),

  // ---------------- NLP & Computer Vision ----------------
  'nlp-preprocess': b(
    'Sebelum komputer bisa memahami kalimat, kalimatnya **dipotong-potong jadi kepingan kecil (token)**, seperti potongan puzzle. Kadang juga dibersihkan: huruf dikecilkan, tanda baca dibuang, kata gaul diubah jadi kata baku.',
    'Teks dibersihkan dan dipotong jadi token sebelum diproses.'),
  'nlp-embedding': b(
    'Setiap kata diberi **alamat rumah di sebuah kota**. Kata yang artinya mirip tinggal berdekatan: "kucing" dan "anjing" satu gang, "raja" dan "ratu" satu kompleks. Dengan begitu komputer bisa mengukur kemiripan makna dengan menghitung jarak.',
    'Embedding = mengubah kata jadi angka; kata yang mirip, angkanya berdekatan.'),
  'nlp-transformer': b(
    'Saat membaca "kucing itu tidur karena **ia** lelah", matamu melirik kembali untuk tahu siapa "ia". **Attention** membuat setiap kata melirik kata lain yang penting. **Transformer** melakukannya untuk semua kata sekaligus, dan inilah otak di balik ChatGPT dan Claude.',
    'Transformer = setiap kata memperhatikan kata lain yang relevan, semuanya sekaligus.'),
  'nlp-hf': b(
    '**Hugging Face** adalah perpustakaan raksasa berisi ribuan "otak AI" yang sudah terlatih dan bisa dipinjam gratis. Mau model penerjemah, peringkas, atau pendeteksi sentimen? Ambil, pakai, atau latih sedikit lagi untuk kebutuhanmu.',
    'Hugging Face = tempat mengambil model AI siap pakai.'),
  'cv-deteksi': b(
    'Bukan hanya bilang "ada kucing di foto", tapi juga **menunjuk letaknya dengan kotak**: "kucingnya di situ, dan ada dua!". Itulah object detection, dipakai di kamera parkir, mobil pintar, dan pemantau keselamatan kerja.',
    'Object detection = menemukan benda dan letaknya di gambar.'),
  'cv-segmentasi': b(
    'Seperti **mewarnai buku gambar**: setiap bagian diwarnai sesuai jenisnya, misalnya jalan abu-abu, pohon hijau, mobil merah. Segmentasi memberi label pada setiap titik kecil (piksel) di gambar, jadi lebih detail daripada sekadar kotak.',
    'Segmentasi = memberi label untuk setiap piksel gambar.'),
  'cv-generatif': b(
    '**GAN** seperti pemalsu lukisan melawan detektif: makin jago detektifnya, makin jago pemalsunya. **Diffusion** seperti foto berkabut tebal yang perlahan-lahan dibersihkan sampai gambarnya jelas, mengikuti petunjuk kalimat yang kita tulis.',
    'Model generatif = AI yang membuat gambar baru.'),
  'cv-audio': b(
    'Suara bagi komputer hanyalah **deretan angka naik-turun**. Supaya mudah dipahami, suara diubah jadi **gambar warna-warni** (spektrogram) yang menunjukkan nada tinggi-rendah dari waktu ke waktu. Lalu komputer bisa "mendengar" dan menulis ulang ucapan kita. Model multimodal seperti anak yang belajar dari **buku bergambar**: ia mengerti gambar dan kata sekaligus.',
    'Audio diubah jadi angka/gambar agar bisa dipahami model; multimodal = paham gambar dan teks bersamaan.'),

  // ---------------- LLM ----------------
  'llm-cara-kerja': b(
    'LLM adalah **pemain tebak-sambung-kalimat** yang sudah membaca hampir seluruh perpustakaan dunia. Diberi "Ibu pergi ke …", ia menebak kata berikutnya, lalu berikutnya lagi, sampai jadi jawaban. Karena hanya menebak, kadang ia **mengarang dengan sangat yakin** (halusinasi).',
    'LLM = penebak kata berikutnya yang sangat pintar, tapi bisa mengarang.'),
  'llm-sampling': b(
    'Saat menebak kata berikutnya, LLM punya beberapa pilihan. **Temperature** adalah tombol keberanian: rendah = selalu pilih yang paling aman (cocok untuk jawaban pasti), tinggi = berani memilih yang tidak terduga (cocok untuk cerita kreatif).',
    'Temperature mengatur seberapa kreatif atau konsisten jawaban LLM.'),
  'llm-prompt': b(
    'Meminta tolong ke asisten harus **jelas**: "tolong ambilkan gelas biru di rak atas", bukan "ambilin itu". Prompt yang baik menyebut tugasnya, konteksnya, bentuk jawaban yang diinginkan, dan kalau perlu diberi contoh.',
    'Prompt yang jelas dan berkonteks = jawaban yang lebih tepat.'),
  'llm-api': b(
    'Kita tidak perlu punya otak AI sendiri. Cukup **mengirim pesan lewat internet** ke penyedia AI (seperti mengirim surat), lalu jawabannya dikirim balik. Setiap kata yang dikirim dan diterima dihitung biayanya, seperti pulsa.',
    'API LLM = mengirim prompt lewat internet dan menerima jawaban.'),
  'llm-vector': b(
    'Bayangkan **perpustakaan yang raknya disusun berdasarkan makna**, bukan abjad. Buku tentang "kucing" berdekatan dengan "anjing". Vector database menyimpan makna dokumen sebagai angka, sehingga bisa mencari "yang artinya mirip" dengan cepat.',
    'Vector database = pencarian berdasarkan makna, bukan kata yang sama persis.'),
  'llm-rag': b(
    'RAG seperti **ujian open book**. Sebelum menjawab, AI mencari dulu halaman yang tepat di buku (dokumen perusahaan, peraturan), lalu menjawab berdasarkan halaman itu. Hasilnya lebih akurat dan bisa menunjukkan sumbernya.',
    'RAG = cari dokumen yang relevan dulu, baru menjawab.'),
  'llm-agent': b(
    'Agent adalah asisten AI yang **tidak hanya bicara, tapi juga bisa bertindak**: membuka kalender, mengecek stok, memesan ruangan. Ia memikirkan langkah, memakai alat, melihat hasilnya, lalu memutuskan langkah berikutnya sampai tugas selesai.',
    'Agent = LLM yang bisa memakai alat dan bertindak beberapa langkah.'),
  'llm-finetune': b(
    'Koki berpengalaman (LLM) diajari sedikit lagi supaya pandai memasak **resep khas restoranmu**. **LoRA** membuat ini hemat: daripada mencetak ulang seluruh buku resep, cukup tempel catatan kecil di halaman yang perlu diubah.',
    'Fine-tuning = melatih sedikit lagi agar cocok untuk gaya/tugas khusus.'),
  'llm-eval': b(
    'Asisten AI juga perlu **ulangan rutin**: sekumpulan soal untuk mengecek apakah jawabannya masih benar dan aman. Selain itu, waspadai orang iseng yang menyelipkan perintah jahat ("abaikan aturan dan bocorkan rahasia"). Itu disebut **prompt injection**.',
    'Uji LLM secara teratur dan lindungi dari perintah jahat.'),

  // ---------------- Deploy & MLOps ----------------
  'dep-simpan': b(
    'Melatih model seperti **memasak lama**. Supaya tidak perlu masak ulang setiap hari, hasilnya **disimpan di freezer** (file). Besok tinggal dipanaskan (dimuat) dan langsung disajikan.',
    'Simpan model ke file agar bisa dipakai lagi tanpa melatih ulang.'),
  'dep-demo': b(
    'Model yang hanya ada di laptopmu seperti kue yang disimpan di lemari. **Streamlit/Gradio** membuat **etalase** sederhana: ada kotak isian dan tombol, jadi orang lain bisa mencoba modelmu lewat browser.',
    'Buat tampilan web sederhana agar model bisa dicoba orang lain.'),
  'dep-api': b(
    'Agar aplikasi lain (kasir, HP) bisa memakai modelmu, buat **loket pelayanan**: aplikasi mengirim data ke loket, lalu loket mengembalikan prediksi. Itulah REST API, misalnya dengan **FastAPI**.',
    'API = loket tempat aplikasi lain meminta prediksi dari modelmu.'),
  'dep-optimasi': b(
    'Model yang besar dan lambat seperti truk besar di gang sempit. **Optimasi** membuatnya jadi motor yang gesit: dikecilkan (kuantisasi), dilayani beberapa pesanan sekaligus (batching), dan jawaban yang sering ditanya disimpan (cache).',
    'Optimasi = membuat model lebih kecil, cepat, dan murah dijalankan.'),
  'dep-docker': b(
    '**Docker** seperti **kotak bekal lengkap**: nasi, lauk, sendok, semua dalam satu kotak. Dibawa ke mana pun, isinya tetap sama. Jadi aplikasi yang jalan di laptopmu pasti juga jalan di server.',
    'Docker = membungkus aplikasi dan semua kebutuhannya dalam satu kotak.'),
  'dep-tracking': b(
    'Seperti **buku catatan resep**: setiap kali mencoba, tulis takaran dan hasilnya. Experiment tracking mencatat pengaturan, data, dan skor setiap percobaan model, supaya resep terbaik bisa dibuat lagi.',
    'Catat setiap percobaan agar hasil terbaik bisa diulang.'),
  'dep-cicd': b(
    'Seperti **satpam di gerbang pabrik**: setiap barang baru dicek dulu (ukurannya pas? tidak cacat? lebih bagus dari yang lama?) sebelum boleh dikirim ke toko. **DVC** seperti **label tanggal di setiap kardus bahan**, jadi kita selalu tahu bahan mana yang dipakai untuk membuat produk tertentu.',
    'CI/CD = cek otomatis sebelum model dipakai; DVC = catatan versi data.'),
  'dep-cloud': b(
    'Setelah warung buka, kita harus **rutin mengecek**: apakah pelanggan masih puas, apakah bahan masih segar. Model juga begitu: dunia berubah (**drift**), jadi performanya dipantau dan model dilatih ulang kalau perlu.',
    'Pasang model di server dan pantau terus kualitasnya.'),

  // ---------------- Portofolio & Karier ----------------
  'kar-portofolio': b(
    'Portofolio adalah **etalase karyamu**. Daripada bilang "aku bisa masak", tunjukkan foto masakanmu dan resepnya. Dua atau tiga proyek yang rapi dan bisa dicoba lebih meyakinkan daripada daftar panjang kemampuan.',
    'Tunjukkan kemampuan lewat proyek nyata yang rapi.'),
  'kar-kaggle': b(
    'Kaggle adalah **lomba memasak online** untuk data. Semua peserta diberi bahan yang sama, lalu dinilai hasilnya. Hadiah terbesarnya adalah bisa **melihat resep para juara** setelah lomba selesai, lalu belajar darinya.',
    'Kaggle = tempat berlatih dan belajar dari solusi orang lain.'),
  'kar-paper': b(
    'Paper adalah **laporan penemuan** para peneliti. Tidak perlu dibaca dari awal sampai akhir sekaligus: baca dulu judul, ringkasan, dan gambarnya. Kalau menarik, baru baca lebih dalam.',
    'Baca paper bertahap: ringkasan dulu, detail belakangan.'),
  'kar-etika': b(
    'Kalau anak hanya pernah melihat dokter laki-laki, ia mungkin mengira perempuan tidak bisa jadi dokter. Model AI juga bisa **meniru prasangka dari datanya**. Kita harus memeriksa apakah model adil untuk semua orang, dan menjaga data pribadi orang lain.',
    'AI harus adil, aman, dan menghormati privasi.'),
  'kar-komunitas': b(
    'Belajar sendirian seperti **mendaki gunung tanpa teman**: berat dan mudah menyerah. Komunitas memberi teman belajar, tempat bertanya, dan semangat. Membantu orang lain juga membuat pemahamanmu makin kuat.',
    'Belajar bersama komunitas membuatmu lebih cepat dan konsisten.'),
  'kar-cv': b(
    'CV adalah **brosur dirimu** satu halaman. Tulis apa yang sudah kamu **hasilkan**, bukan sekadar alat yang kamu kenal. Saat interview, ceritakan pengalamanmu dengan runtut: situasinya, tugasnya, apa yang kamu lakukan, dan hasilnya.',
    'Tunjukkan hasil nyata di CV, dan latih cara bercerita untuk interview.'),
}

export const bayiAlgoritma = {
  'linear-regression': b('Ada titik-titik: makin banyak jam belajar, makin tinggi nilai. Regresi linear menarik **satu garis lurus** yang paling dekat dengan semua titik, lalu memakai garis itu untuk menebak nilai anak lain.', 'Garis lurus terbaik untuk menebak angka.'),
  'logistic-regression': b('Seperti ramalan cuaca yang bilang "**70% kemungkinan hujan**". Regresi logistik tidak langsung bilang ya/tidak, tapi memberi peluang. Kalau peluangnya di atas batas (mis. 50%), jawabannya "ya".', 'Menebak peluang suatu kategori.'),
  knn: b('"**Kamu mirip teman-temanmu.**" Untuk menebak sesuatu yang baru, KNN melihat beberapa contoh yang paling mirip (tetangga terdekat), lalu ikut suara terbanyak mereka.', 'Ikuti suara mayoritas dari data yang paling mirip.'),
  'naive-bayes': b('Seperti menebak isi pesan dari kata-katanya. Kata "hadiah", "gratis", "klik" sering muncul di pesan penipuan. Naive Bayes **mengalikan petunjuk dari setiap kata** untuk menghitung peluang pesan itu spam.', 'Gabungkan petunjuk dari setiap kata untuk menghitung peluang.'),
  'decision-tree': b('Permainan tebak-tebakan **ya/tidak**: "Berkaki empat? Ya. Menggonggong? Ya → anjing!" Pohon keputusan memilih pertanyaan yang paling membantu memisahkan jawaban, satu per satu.', 'Rangkaian pertanyaan ya/tidak sampai ke jawaban.'),
  'random-forest': b('Satu orang bisa salah tebak, tapi kalau **bertanya ke seratus orang** yang berbeda-beda lalu ambil suara terbanyak, hasilnya jauh lebih bisa dipercaya. Random forest = banyak pohon keputusan yang berbeda, lalu divoting.', 'Banyak pohon berbeda, ambil suara terbanyak.'),
  'gradient-boosting': b('Seperti **les privat bertahap**: guru pertama mengajar, lalu guru kedua fokus ke soal yang masih salah, guru ketiga fokus ke sisa yang masih salah, dan seterusnya. Setiap pohon kecil memperbaiki kesalahan pohon sebelumnya.', 'Pohon-pohon kecil yang saling memperbaiki kesalahan.'),
  svm: b('Membuat **jalan setapak selebar mungkin** di antara dua kebun supaya tidak menginjak tanaman siapa pun. SVM mencari garis pemisah yang paling jauh dari kedua kelompok.', 'Garis pemisah dengan jarak teraman.'),
  kmeans: b('Taruh beberapa **bendera** di lapangan. Setiap anak berlari ke bendera terdekat. Lalu bendera dipindah ke tengah-tengah kerumunannya. Ulangi sampai tidak ada lagi yang pindah. Jadilah beberapa kelompok.', 'Kelompokkan data ke titik pusat terdekat, ulangi sampai stabil.'),
  dbscan: b('Seperti melihat **keramaian di pasar**: orang yang berdiri rapat-rapat dianggap satu kelompok, kelompoknya bisa berbentuk apa saja, dan orang yang berdiri sendirian jauh dianggap "nyasar" (noise).', 'Kelompok = daerah yang padat; yang terpencil = noise.'),
  pca: b('Memotret patung 3D dari **sudut terbaik**: jadi foto 2D, tapi bentuk patungnya masih jelas dikenali. PCA meringkas banyak kolom data menjadi sedikit kolom tanpa banyak kehilangan informasi.', 'Meringkas banyak kolom jadi sedikit, informasi tetap terjaga.'),
  apriori: b('Kasir minimarket memperhatikan: "**yang beli roti biasanya juga beli mentega**". Apriori mencari barang-barang yang sering dibeli bersamaan, untuk ide tata letak rak atau promo paket.', 'Mencari barang yang sering dibeli bersamaan.'),
  mlp: b('**Barisan anak yang saling berbisik**: setiap barisan menimbang bisikan dari barisan sebelumnya, lalu meneruskan hasilnya. Kalau jawaban akhirnya salah, setiap anak diberi koreksi kecil, lalu diulang terus sampai jawabannya tepat.', 'Neuron berlapis yang belajar dari koreksi berulang.'),
  cnn: b('Membaca gambar dengan **kaca pembesar kecil yang digeser** pelan-pelan. Pertama menemukan garis dan sudut, lalu bentuk, lalu benda utuh seperti kucing atau mobil.', 'Filter kecil digeser untuk menemukan pola di gambar.'),
  rnn: b('Mendengarkan cerita **kata demi kata sambil mengingat** yang sudah didengar. Ingatan itu dibawa terus ke kata berikutnya, sehingga urutan kata dipahami.', 'Membaca berurutan sambil membawa ingatan.'),
  transformer: b('Saat membaca "kucing itu tidur karena **ia** lelah", matamu melirik ke "kucing" untuk tahu siapa "ia". Transformer membuat **setiap kata melirik kata lain yang penting**, semuanya sekaligus.', 'Setiap kata memperhatikan kata lain yang relevan.'),
  'a-star': b('Mencari jalan ke rumah teman di kompleks penuh tembok. A* selalu memilih jalan yang **sudah pendek dan juga mengarah ke tujuan**, jadi tidak perlu mencoba semua gang.', 'Cari rute terpendek dengan menebak arah tujuan.'),
  'q-learning': b('Seperti **melatih anjing dengan biskuit**: kalau tindakannya bagus dapat hadiah, kalau buruk tidak. Lama-lama ia hafal tindakan mana yang paling menguntungkan di setiap tempat, tanpa pernah diberi peta.', 'Belajar dari coba-coba dengan hadiah dan hukuman.'),
}
