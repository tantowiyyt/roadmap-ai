// Langkah-langkah praktis & contoh kasus untuk tahap Machine Learning dan Deep Learning.

export const guidesMl = {
  // ---------- MACHINE LEARNING ----------
  'ml-konsep': {
    steps: [
      ['Definisikan masalah', 'Apa yang ingin ditebak? Angka → regresi. Kategori → klasifikasi. Tidak ada label → clustering.'],
      ['Kumpulkan & siapkan data', 'Tentukan fitur (X) dan label (y), lalu bersihkan datanya.'],
      ['Bagi data', '`train_test_split`, biasanya 80% latih dan 20% uji. Data uji disimpan dan tidak boleh disentuh selama training.'],
      ['Buat baseline', 'Model paling sederhana (misalnya selalu menebak kelas terbanyak) sebagai pembanding minimum.'],
      ['Latih model', '`model.fit(X_train, y_train)`.'],
      ['Evaluasi & iterasi', '`model.score(X_test, y_test)`. Jika belum memuaskan, perbaiki data/fitur, coba model lain, atau tuning.'],
    ],
    case: {
      title: 'Memprediksi kelulusan mahasiswa tepat waktu',
      situation: 'Bagian akademik ingin mendeteksi sejak semester 2 mahasiswa mana yang berisiko lulus terlambat, agar bisa diberi pendampingan.',
      steps: [
        'Jenis masalah: klasifikasi (tepat waktu / terlambat).',
        'Fitur: IPK semester 1–2, jumlah SKS, kehadiran, status beasiswa. Label: data kelulusan 5 angkatan sebelumnya.',
        'Split 80/20, baseline "semua tepat waktu" mendapat akurasi 70%.',
        'Random forest mencapai akurasi 85% dan recall 78% untuk kelas "terlambat".',
      ],
      result: 'Setiap semester sistem menandai mahasiswa berisiko untuk diberi bimbingan. Ini alur ML yang lengkap: masalah → data → model → evaluasi → tindakan.',
    },
  },
  'ml-regresi': {
    steps: [
      ['Pastikan target berupa angka kontinu', 'Harga, suhu, durasi, jumlah penjualan.'],
      ['Lihat hubungan fitur dengan target', 'Scatter plot. Jika hubungannya lurus, regresi linear cocok.'],
      ['Siapkan fitur', 'One-hot encoding untuk kategori; scaling jika memakai regularisasi.'],
      ['Latih model', '`LinearRegression().fit(X_train, y_train)`.'],
      ['Evaluasi', 'MAE (rata-rata meleset berapa), RMSE, R². Bandingkan dengan baseline "selalu menebak rata-rata".'],
      ['Interpretasi koefisien', '`model.coef_` menunjukkan pengaruh setiap fitur terhadap target.'],
    ],
    case: {
      title: 'Estimasi harga rumah untuk agen properti',
      situation: 'Agen properti di Bekasi ingin memberi estimasi harga yang wajar kepada penjual rumah berdasarkan data 800 transaksi sebelumnya.',
      steps: [
        'Fitur: luas tanah, luas bangunan, jumlah kamar, jarak ke stasiun, kecamatan (one-hot).',
        'Scatter plot menunjukkan luas bangunan sangat berhubungan dengan harga.',
        'Hasil: MAE Rp85 juta dengan R² 0.82. Setiap 1 km lebih jauh dari stasiun, harga turun sekitar Rp40 juta.',
        'Rumah dengan error terbesar dicek ulang. Ternyata itu rumah di hook/pojok, sehingga ditambahkan fitur baru "posisi hook".',
      ],
      result: 'Agen memiliki estimasi harga yang konsisten dan bisa menjelaskan alasannya ke klien, misalnya "dekat stasiun menaikkan harga".',
    },
  },
  'ml-klasifikasi': {
    steps: [
      ['Cek keseimbangan kelas', '`y.value_counts()`. Jika timpang (misalnya 95:5), siapkan metrik dan strategi khusus.'],
      ['Split dengan stratify', '`train_test_split(..., stratify=y)` agar proporsi kelas sama di data latih dan uji.'],
      ['Scaling fitur', 'Wajib untuk KNN dan disarankan untuk regresi logistik: `StandardScaler`.'],
      ['Latih & dapatkan probabilitas', '`predict_proba` memberi peluang, tidak hanya label.'],
      ['Atur ambang keputusan', 'Default 0.5. Turunkan jika menangkap semua kasus positif lebih penting (recall).'],
      ['Evaluasi dengan confusion matrix', 'Lihat precision dan recall per kelas, bukan hanya akurasi.'],
    ],
    case: {
      title: 'Prediksi nasabah gagal bayar pinjaman',
      situation: 'Koperasi simpan pinjam ingin menilai risiko pemohon baru. Dari data historis, 12% nasabah gagal bayar.',
      steps: [
        'Fitur: penghasilan, rasio cicilan terhadap penghasilan, lama bekerja, riwayat terlambat bayar.',
        'Split dengan stratify dan scaling, lalu latih regresi logistik.',
        'Dengan ambang 0.5, recall hanya 45%. Ambang diturunkan ke 0.3 sehingga recall naik ke 72% (precision turun, tetapi masih dapat diterima).',
        'Koefisien terbesar adalah riwayat terlambat bayar, sehingga mudah dijelaskan kepada pengurus koperasi.',
      ],
      result: 'Pemohon berisiko tinggi ditinjau manual lebih teliti. Regresi logistik dipilih karena alasannya transparan, yang penting untuk keputusan keuangan.',
    },
  },
  'ml-tree': {
    steps: [
      ['Mulai dengan decision tree dangkal', '`max_depth=3` agar bisa divisualisasikan dan dipahami.'],
      ['Naik ke random forest', '`n_estimators=200–500`. Hampir tidak perlu tuning untuk mendapat hasil yang bagus.'],
      ['Coba gradient boosting', 'XGBoost/LightGBM dengan learning rate kecil (0.05) dan early stopping.'],
      ['Bandingkan dengan cross-validation', 'Gunakan fold yang sama untuk semua model agar perbandingannya adil.'],
      ['Lihat feature importance', 'Untuk memahami faktor yang paling berpengaruh dan menjelaskannya ke pihak bisnis.'],
    ],
    case: {
      title: 'Mendeteksi transaksi kartu kredit mencurigakan',
      situation: 'Bank memproses jutaan transaksi per hari, dan hanya 0,2% yang merupakan penipuan. Sistem aturan manual terlalu banyak salah alarm.',
      steps: [
        'Fitur: nominal, jam transaksi, jarak dari lokasi biasa, jumlah transaksi dalam 1 jam terakhir, kategori merchant.',
        'Decision tree dangkal memberi aturan yang mudah dipahami: "jarak > 500 km DAN nominal > 5 juta → curiga".',
        'Random forest dan LightGBM dibandingkan dengan 5-fold CV. LightGBM unggul dengan recall 88% pada precision 60%.',
        'Feature importance: "jumlah transaksi 1 jam terakhir" adalah fitur paling penting.',
      ],
      result: 'Salah alarm berkurang separuh dibanding sistem aturan lama. Model boosting kini menjadi standar industri untuk deteksi penipuan.',
    },
  },
  'ml-svm': {
    steps: [
      ['Scaling wajib', 'SVM sangat sensitif terhadap skala fitur. Pakai `StandardScaler` di dalam pipeline.'],
      ['Mulai dengan kernel linear', 'Cocok untuk data berdimensi tinggi seperti teks.'],
      ['Coba kernel RBF untuk pola melengkung', 'Lalu tuning `C` (toleransi kesalahan) dan `gamma` (seberapa jauh pengaruh satu titik).'],
      ['Gunakan GridSearchCV', 'Coba kombinasi seperti C=[0.1, 1, 10] dan gamma=["scale", 0.1, 0.01].'],
      ['Perhatikan ukuran data', 'Untuk lebih dari 100 ribu baris, SVM kernel menjadi lambat. Pertimbangkan LinearSVC atau model lain.'],
    ],
    case: {
      title: 'Klasifikasi kualitas biji kopi dari hasil uji lab',
      situation: 'Eksportir kopi punya 1.200 sampel dengan 15 hasil uji lab (kadar air, keasaman, dan lain-lain) yang dilabeli Grade 1 atau Grade 2 oleh ahli cupping.',
      steps: [
        'Pipeline: `StandardScaler` → `SVC`.',
        'Kernel linear mendapat akurasi 84%, kernel RBF 91%, karena hubungannya tidak lurus.',
        'GridSearch menemukan C=10, gamma=0.05 sebagai kombinasi terbaik.',
        'Validasi dengan 100 sampel baru: 90% sesuai penilaian ahli.',
      ],
      result: 'Penyaringan awal grade bisa dilakukan otomatis, sehingga ahli cupping cukup memeriksa sampel yang meragukan.',
    },
  },
  'ml-clustering': {
    steps: [
      ['Pilih fitur yang relevan', 'Misalnya untuk segmentasi pelanggan: frekuensi belanja, total belanja, dan berapa hari sejak belanja terakhir.'],
      ['Scaling', 'Wajib, karena clustering berbasis jarak.'],
      ['Tentukan jumlah cluster', 'Metode elbow (plot inertia) atau silhouette score untuk K = 2 sampai 10.'],
      ['Jalankan K-Means', '`KMeans(n_clusters=K, n_init=10)`.'],
      ['Beri makna setiap cluster', 'Lihat rata-rata fitur per cluster, lalu beri nama yang dipahami bisnis.'],
      ['Visualisasikan dengan PCA', 'Proyeksikan ke 2D untuk melihat apakah cluster terpisah dengan baik.'],
    ],
    case: {
      title: 'Segmentasi pelanggan minimarket untuk program promo (RFM)',
      situation: 'Minimarket punya data 20.000 member dan ingin promo yang berbeda untuk setiap tipe pelanggan, bukan promo yang sama untuk semua orang.',
      steps: [
        'Hitung RFM per member: Recency (hari sejak belanja terakhir), Frequency (jumlah kunjungan), Monetary (total belanja).',
        'Scaling, lalu metode elbow menyarankan K = 4.',
        'Profil cluster: "Loyal" (sering & besar), "Baru", "Hampir hilang" (lama tidak datang), "Hemat" (sering tetapi kecil).',
        'Strategi: loyal → poin ganda, hampir hilang → voucher comeback, hemat → promo bundling.',
      ],
      result: 'Promo menjadi lebih tepat sasaran. Tanpa label apa pun, clustering menemukan struktur alami dalam data pelanggan.',
    },
  },
  'ml-evaluasi': {
    steps: [
      ['Tentukan biaya kesalahan', 'Mana yang lebih merugikan: false positive (alarm palsu) atau false negative (kasus terlewat)?'],
      ['Pilih metrik utama', 'FN mahal → recall. FP mahal → precision. Seimbang → F1. Untuk ranking → ROC-AUC.'],
      ['Buat confusion matrix', 'Lihat langsung jumlah TP, FP, FN, TN.'],
      ['Bandingkan dengan baseline', 'Model harus jauh lebih baik daripada tebakan sederhana.'],
      ['Evaluasi pada data uji yang belum pernah dilihat', 'Dan sebaiknya juga per subkelompok (wilayah, gender) untuk mengecek keadilan model.'],
    ],
    case: {
      title: 'Memilih model skrining diabetes untuk puskesmas',
      situation: 'Dua model kandidat. Model A: akurasi 92%, recall 60%. Model B: akurasi 85%, recall 90%. Prevalensi diabetes di data adalah 10%.',
      steps: [
        'Biaya kesalahan: pasien diabetes yang terlewat (FN) bisa mengalami komplikasi serius. Pasien sehat yang ditandai (FP) hanya perlu tes lanjutan yang murah.',
        'Maka metrik utama adalah recall.',
        'Confusion matrix untuk 1.000 pasien: model A melewatkan 40 dari 100 penderita, model B hanya melewatkan 10.',
      ],
      result: 'Model B dipilih meskipun akurasinya lebih rendah. Metrik yang tepat bergantung pada konteks dan konsekuensi di dunia nyata.',
    },
  },
  'ml-overfit': {
    steps: [
      ['Bandingkan skor latih vs validasi', 'Latih jauh lebih tinggi → overfit. Keduanya rendah → underfit.'],
      ['Gunakan k-fold cross-validation', '`cross_val_score(model, X, y, cv=5)` memberi rata-rata dan variasi skor.'],
      ['Jika overfit', 'Sederhanakan model (kurangi depth/fitur), tambah regularisasi, tambah data, atau gunakan early stopping.'],
      ['Jika underfit', 'Gunakan model yang lebih kompleks, tambah fitur yang bermakna, atau kurangi regularisasi.'],
      ['Tuning hyperparameter dengan CV', '`GridSearchCV` atau `RandomizedSearchCV`. Data uji tetap hanya dipakai sekali di akhir.'],
    ],
    case: {
      title: 'Model prediksi penjualan yang "terlalu bagus"',
      situation: 'Tim data melaporkan R² = 0.99 untuk prediksi penjualan, tetapi saat dipakai bulan berikutnya prediksinya meleset jauh.',
      steps: [
        'Pengecekan: R² latih 0.99, tetapi cross-validation hanya 0.55. Ini overfitting.',
        'Penyebabnya: decision tree tanpa batas kedalaman, ditambah fitur "ID toko" yang membuat model menghafal.',
        'Perbaikan: buang ID, `max_depth=6`, lalu ganti dengan random forest.',
        'Hasil CV menjadi 0.81 dengan variasi kecil antar fold.',
      ],
      result: 'Skor latih lebih rendah tetapi prediksi di dunia nyata jauh lebih akurat. Yang dipercaya adalah skor validasi, bukan skor latih.',
    },
  },
  'ml-fitur': {
    steps: [
      ['Pahami domain', 'Fitur terbaik biasanya datang dari pemahaman bisnis, bukan dari algoritma.'],
      ['Ubah kategori menjadi angka', 'One-hot untuk kategori tanpa urutan, ordinal encoding untuk kategori berurutan (S/M/L).'],
      ['Buat fitur turunan', 'Rasio (harga/m²), selisih waktu (hari sejak daftar), agregat (rata-rata belanja per bulan), komponen tanggal (hari, bulan, akhir pekan).'],
      ['Scaling bila perlu', 'Penting untuk model berbasis jarak/gradien; tidak perlu untuk model berbasis tree.'],
      ['Bungkus dalam Pipeline', 'Agar preprocessing hanya "belajar" dari data latih, sehingga tidak terjadi data leakage.'],
      ['Ukur dampaknya', 'Bandingkan skor CV sebelum dan sesudah fitur baru ditambahkan.'],
    ],
    case: {
      title: 'Prediksi keterlambatan pengiriman paket',
      situation: 'Perusahaan logistik punya data pengiriman berisi tanggal pesan, kota asal-tujuan, berat, dan kurir. Model awal hanya mencapai F1 0.62.',
      steps: [
        'Dari tanggal: tambahkan fitur "hari dalam minggu", "apakah mendekati libur nasional", dan "bulan".',
        'Dari kota: tambahkan fitur "jarak km" dan "beda pulau (ya/tidak)".',
        'Dari riwayat: tambahkan "persentase keterlambatan kurir ini 30 hari terakhir".',
        'Semua dibungkus dalam Pipeline dengan ColumnTransformer.',
      ],
      result: 'F1 naik dari 0.62 ke 0.79 dengan algoritma yang sama. Feature engineering sering memberi lompatan terbesar.',
    },
  },

  // ---------- DEEP LEARNING ----------
  'dl-nn': {
    steps: [
      ['Tentukan input & output', 'Jumlah neuron input = jumlah fitur. Output: 1 neuron (regresi/biner) atau N neuron (N kelas).'],
      ['Tentukan hidden layer', 'Mulai sederhana: 1–2 layer dengan 32–128 neuron.'],
      ['Pilih aktivasi', 'ReLU untuk hidden layer; sigmoid/softmax/linear untuk output sesuai jenis tugas.'],
      ['Inisialisasi bobot secara acak', 'Library melakukannya otomatis dengan metode yang baik (Xavier/He).'],
      ['Forward pass', 'Data mengalir layer demi layer: `aktivasi(x @ W + b)`.'],
    ],
    case: {
      title: 'Merancang jaringan untuk mengenali angka tulisan tangan di formulir',
      situation: 'Kantor kelurahan ingin membaca otomatis kode pos tulisan tangan dari formulir yang dipindai (gambar 28×28 piksel per angka).',
      steps: [
        'Input: 784 neuron (28×28 piksel diratakan).',
        'Hidden: 128 neuron (ReLU) → 64 neuron (ReLU).',
        'Output: 10 neuron (softmax), satu untuk setiap angka 0–9.',
        'Total sekitar 109 ribu bobot yang akan dipelajari dari dataset MNIST.',
      ],
      result: 'Jaringan sederhana ini sudah mencapai akurasi sekitar 97%. Untuk hasil lebih baik, ganti dengan CNN.',
    },
  },
  'dl-backprop': {
    steps: [
      ['Forward pass', 'Hitung prediksi dari input dan simpan nilai di setiap layer.'],
      ['Hitung loss', 'Bandingkan prediksi dengan target (MSE atau cross-entropy).'],
      ['Backward pass', 'Mulai dari loss, hitung gradien mundur ke setiap layer dengan chain rule.'],
      ['Update bobot', '`W -= learning_rate * gradien`, atau gunakan optimizer seperti Adam.'],
      ['Ulangi per batch & epoch', 'Satu epoch = seluruh data dilihat satu kali. Pantau loss latih dan validasi.'],
    ],
    case: {
      title: 'Mendiagnosis training yang tidak belajar',
      situation: 'Loss jaringan 10 layer berhenti turun sejak epoch pertama, dan akurasinya tetap 10% (tebakan acak untuk 10 kelas).',
      steps: [
        'Cek besar gradien per layer: layer awal hampir nol. Ini vanishing gradient.',
        'Penyebab: semua layer memakai sigmoid, yang turunannya maksimal 0.25 sehingga mengecil ketika dikalikan berulang kali.',
        'Perbaikan: ganti dengan ReLU dan tambahkan batch normalization.',
        'Loss kembali turun dan akurasi naik ke 95%.',
      ],
      result: 'Memahami backpropagation membantu mendiagnosis masalah seperti ini, bukan sekadar mengganti hyperparameter secara acak.',
    },
  },
  'dl-aktivasi': {
    steps: [
      ['Hidden layer → ReLU', 'Default yang aman. Alternatifnya GELU (dipakai di Transformer) atau LeakyReLU.'],
      ['Output sesuai tugas', 'Regresi → linear (tanpa aktivasi). Biner → sigmoid. Multi-kelas → softmax.'],
      ['Loss sesuai output', 'Regresi → MSE/MAE. Biner → binary cross-entropy. Multi-kelas → categorical cross-entropy.'],
      ['Optimizer', 'Mulai dengan Adam (lr = 0.001). SGD dengan momentum kadang lebih baik untuk tahap akhir pada CNN.'],
      ['Learning rate schedule', 'Turunkan learning rate seiring waktu (cosine/step decay) untuk hasil yang lebih stabil.'],
    ],
    case: {
      title: 'Memilih komponen untuk tiga model berbeda',
      situation: 'Tim AI startup mengerjakan tiga proyek: (1) prediksi harga mobil bekas, (2) deteksi email phishing, (3) klasifikasi 5 jenis penyakit daun cabai.',
      steps: [
        'Harga mobil: output 1 neuron linear, loss MSE.',
        'Phishing: output 1 neuron sigmoid, loss binary cross-entropy.',
        'Penyakit daun: output 5 neuron softmax, loss categorical cross-entropy.',
        'Ketiganya memakai ReLU di hidden layer dan Adam lr = 0.001 sebagai titik awal.',
      ],
      result: 'Kombinasi output dan loss yang tepat adalah fondasi. Jika salah (misalnya softmax untuk regresi), model tidak akan belajar dengan benar.',
    },
  },
  'dl-pytorch': {
    steps: [
      ['Siapkan data', 'Ubah ke tensor, lalu bungkus dengan `Dataset` dan `DataLoader(batch_size=32, shuffle=True)`.'],
      ['Definisikan model', 'Class turunan `nn.Module` dengan `__init__` (layer) dan `forward` (alur data).'],
      ['Pilih loss & optimizer', '`nn.CrossEntropyLoss()`, `torch.optim.Adam(model.parameters(), lr=1e-3)`.'],
      ['Training loop', 'Untuk setiap batch: `zero_grad()` → forward → hitung loss → `backward()` → `step()`.'],
      ['Validasi', '`model.eval()` dan `with torch.no_grad():` untuk menghitung metrik pada data validasi.'],
      ['Simpan model terbaik', '`torch.save(model.state_dict(), "model.pt")` saat skor validasi membaik.'],
    ],
    case: {
      title: 'Klasifikasi sentimen tweet dengan PyTorch',
      situation: 'Mahasiswa ingin membuat model sentimen sendiri sebagai tugas akhir, dengan 10.000 tweet berlabel positif/negatif/netral.',
      steps: [
        'Teks diubah menjadi index kata, lalu dibuat `Dataset` dan `DataLoader` dengan batch 64.',
        'Model: `nn.Embedding` → rata-rata embedding → `nn.Linear(…, 3)`.',
        'Training 10 epoch dengan Adam. Skor validasi dicatat setiap epoch.',
        'Model terbaik (epoch 6, akurasi 78%) disimpan sebelum mulai overfitting.',
      ],
      result: 'Pipeline PyTorch lengkap berhasil dibangun. Struktur yang sama dipakai untuk model yang jauh lebih besar.',
    },
  },
  'dl-cnn': {
    steps: [
      ['Siapkan gambar', 'Seragamkan ukuran (misalnya 224×224), normalisasi piksel, dan bagi ke folder per kelas.'],
      ['Susun blok konvolusi', 'Conv → ReLU → Pooling, diulang 2–4 kali. Jumlah filter bertambah (32 → 64 → 128).'],
      ['Flatten & klasifikasi', 'Ratakan feature map lalu masukkan ke layer Linear untuk output kelas.'],
      ['Tambahkan augmentasi', 'Flip, rotasi, dan perubahan kecerahan agar model tahan terhadap variasi.'],
      ['Latih di GPU & evaluasi', 'Lihat confusion matrix untuk mengetahui kelas mana yang sering tertukar.'],
    ],
    case: {
      title: 'Deteksi penyakit daun padi untuk penyuluh pertanian',
      situation: 'Penyuluh ingin aplikasi yang mengenali 4 kondisi daun padi (sehat, blas, hawar daun, bercak coklat) dari foto HP.',
      steps: [
        'Kumpulkan 3.000 foto, lalu seragamkan ukurannya menjadi 224×224.',
        'CNN 3 blok konvolusi dengan augmentasi flip dan variasi kecerahan karena foto diambil di lapangan.',
        'Akurasi validasi 87%. Confusion matrix menunjukkan "blas" dan "bercak coklat" sering tertukar.',
        'Tambahkan 500 foto close-up untuk kedua kelas itu, sehingga akurasi naik menjadi 92%.',
      ],
      result: 'Penyuluh bisa mendiagnosis di lapangan dalam hitungan detik. Analisis confusion matrix menunjukkan data apa yang perlu ditambah.',
    },
  },
  'dl-rnn': {
    steps: [
      ['Bentuk data menjadi urutan', 'Untuk time series: jendela N langkah terakhir → target langkah berikutnya.'],
      ['Normalisasi', 'Skalakan nilai, misalnya ke 0–1, menggunakan statistik dari data latih saja.'],
      ['Split berdasarkan waktu', 'Data latih adalah masa lalu, data uji adalah masa depan. Jangan diacak, agar model tidak "mengintip" masa depan.'],
      ['Bangun model', '`nn.LSTM(input_size, hidden_size)` → `nn.Linear(hidden_size, 1)`.'],
      ['Evaluasi & bandingkan dengan baseline', 'Baseline sederhana "besok = hari ini" sering sulit dikalahkan.'],
    ],
    case: {
      title: 'Prediksi beban listrik harian untuk gardu',
      situation: 'Perusahaan listrik ingin memprediksi beban 24 jam ke depan berdasarkan data per jam selama 3 tahun.',
      steps: [
        'Jendela 168 jam (7 hari) dipakai untuk memprediksi 24 jam berikutnya, dengan fitur tambahan jam, hari, dan libur.',
        'Split waktu: 2 tahun pertama untuk latih, 6 bulan untuk validasi, 6 bulan terakhir untuk uji.',
        'Baseline "sama dengan minggu lalu" memiliki MAPE 8%. LSTM mencapai 4,5%.',
        'Error terbesar terjadi saat libur panjang, sehingga ditambahkan fitur kalender libur nasional.',
      ],
      result: 'Prediksi yang lebih akurat membantu mengatur pembangkit secara efisien. Membandingkan dengan baseline membuktikan model benar-benar berguna.',
    },
  },
  'dl-regularisasi': {
    steps: [
      ['Deteksi overfitting', 'Plot loss latih dan validasi per epoch. Jika validasi naik sementara latih terus turun, berarti overfit.'],
      ['Augmentasi data', 'Cara paling efektif. Untuk gambar: flip/rotate/crop. Untuk teks: parafrase atau back-translation.'],
      ['Tambahkan dropout', '`nn.Dropout(0.2–0.5)` di antara layer dense.'],
      ['Weight decay', 'Parameter `weight_decay=1e-4` di optimizer.'],
      ['Early stopping', 'Hentikan training jika skor validasi tidak membaik setelah N epoch, lalu pakai checkpoint terbaik.'],
    ],
    case: {
      title: 'Model klasifikasi batik dengan data terbatas',
      situation: 'Peneliti hanya punya 600 foto untuk 6 motif batik. Akurasi latih 99% tetapi validasi hanya 65%.',
      steps: [
        'Augmentasi: rotasi, flip, crop acak, dan variasi warna, sehingga setiap epoch model melihat variasi baru.',
        'Dropout 0.5 sebelum layer output dan weight decay 1e-4.',
        'Early stopping dengan patience 5 epoch.',
        'Hasil: akurasi latih 92%, validasi 84%. Jarak keduanya mengecil drastis.',
      ],
      result: 'Model lebih bisa digeneralisasi ke foto baru. Langkah berikutnya adalah transfer learning untuk hasil yang lebih tinggi lagi.',
    },
  },
  'dl-transfer': {
    steps: [
      ['Pilih model pretrained', 'ResNet, EfficientNet, ConvNeXt (gambar); BERT/IndoBERT (teks). Sesuaikan ukuran model dengan perangkat yang akan dipakai.'],
      ['Ganti layer terakhir', 'Sesuaikan jumlah output dengan jumlah kelasmu.'],
      ['Bekukan backbone, latih head', 'Beberapa epoch dengan learning rate normal (1e-3).'],
      ['Fine-tune seluruh model (opsional)', 'Buka semua layer dan latih dengan learning rate sangat kecil (1e-5) agar pengetahuan lama tidak rusak.'],
      ['Gunakan preprocessing yang sama', 'Normalisasi dan ukuran gambar harus sama seperti saat model asli dilatih.'],
    ],
    case: {
      title: 'Melanjutkan proyek batik dengan transfer learning',
      situation: 'Melanjutkan kasus sebelumnya: 600 foto batik, dengan CNN dari nol mentok di akurasi 84%.',
      steps: [
        'Pakai ResNet18 pretrained ImageNet, lalu ganti `fc` menjadi `Linear(512, 6)`.',
        'Bekukan backbone dan latih head 5 epoch: akurasi validasi 91%.',
        'Buka semua layer dan fine-tune 10 epoch dengan lr 1e-5: akurasi 96%.',
        'Total training di Colab kurang dari 15 menit.',
      ],
      result: 'Lompatan dari 84% ke 96% dengan data yang sama. Untuk data sedikit, transfer learning hampir selalu menjadi pilihan pertama.',
    },
  },
  'dl-gpu': {
    steps: [
      ['Aktifkan GPU', 'Colab: Runtime → Change runtime type → GPU. Cek dengan `torch.cuda.is_available()`.'],
      ['Pindahkan model & data ke GPU', '`model.to(device)` dan setiap batch `x.to(device)`.'],
      ['Atur batch size', 'Mulai dari 32. Jika muncul "CUDA out of memory", turunkan. Jika memori masih longgar, naikkan.'],
      ['Gunakan mixed precision', '`torch.autocast("cuda")` untuk mempercepat dan menghemat memori.'],
      ['Simpan checkpoint berkala', 'Sesi Colab bisa terputus. Simpan model ke Google Drive setiap epoch.'],
    ],
    case: {
      title: 'Training yang lambat di laptop',
      situation: 'Training CNN di CPU laptop butuh 40 menit per epoch, padahal perlu 20 epoch.',
      steps: [
        'Pindahkan notebook ke Colab, aktifkan GPU T4, lalu tambahkan `.to("cuda")`.',
        'Waktu turun menjadi 2 menit per epoch.',
        'Aktifkan mixed precision sehingga turun lagi ke 1 menit, dan batch size bisa dinaikkan dari 32 ke 64.',
        'Checkpoint disimpan ke Drive setiap epoch, karena sesi sempat terputus di epoch 14.',
      ],
      result: 'Training selesai dalam 20 menit, bukan 13 jam. Berkat checkpoint, tidak perlu mengulang dari awal saat sesi terputus.',
    },
  },
}
