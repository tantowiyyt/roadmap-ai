import {
  frame, makeRng, normal, blob, clamp, fmt, dist, sx, sy, XMAX, YMAX, PX, W,
  Grid, Mark, Marks, Seg, Line, Label, Star, Heat, Box, lineInBox,
} from './kit.jsx'

// ---------------------------------------------------------------- Regresi linear
export function linearRegression() {
  const r = makeRng(3)
  const pts = Array.from({ length: 14 }, () => {
    const x = 0.6 + r() * 8.8
    return { x, y: clamp(0.45 * x + 1 + normal(r) * 0.45, 0.3, YMAX - 0.3), c: 0 }
  })
  const mse = (w, b) => pts.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / pts.length
  const snaps = [0, 2, 6, 15, 40, 100, 250, 700]
  const hist = []
  let w = 0, b = 3.3
  for (let it = 0; it <= 700; it++) {
    if (snaps.includes(it)) hist.push({ it, w, b, e: mse(w, b) })
    let gw = 0, gb = 0
    for (const p of pts) { const e = w * p.x + b - p.y; gw += (2 * e * p.x) / pts.length; gb += (2 * e) / pts.length }
    w -= 0.012 * gw; b -= 0.012 * gb
  }
  const gambar = ({ w, b }, resid = true, extra = null) => (
    <>
      <Grid />
      {resid && pts.map((p, i) => <Seg key={i} a={[p.x, p.y]} b={[p.x, w * p.x + b]} cls="an-resid" />)}
      <Line a={w} b={-1} c={b} cls="an-line an-model" />
      <Marks pts={pts} />
      {extra}
    </>
  )
  const akhir = hist[hist.length - 1]
  const xBaru = 7.5, yBaru = akhir.w * xBaru + akhir.b
  return {
    legend: [{ c: 0, label: 'data (luas → harga)' }, { line: true, label: 'garis model' }, { dash: true, label: 'error (residual)' }],
    frames: [
      frame('Setiap titik = satu rumah: **luas** (sumbu datar) dan **harga** (sumbu tegak). Tujuan: mencari **garis lurus** yang paling dekat dengan semua titik.',
        <><Grid /><Marks pts={pts} /></>),
      frame(`Mulai dari garis tebakan (datar). Garis putus-putus = **error** tiap titik. Rata-rata kuadrat error (**MSE**) = ${fmt(hist[0].e)}.`, gambar(hist[0])),
      ...hist.slice(1).map((h) => frame(
        `Iterasi ${h.it}: **gradient descent** memutar dan menggeser garis ke arah yang menurunkan error. Kemiringan = ${fmt(h.w)}, MSE = ${fmt(h.e)}.`,
        gambar(h),
      )),
      frame(`Selesai: garis terbaik **y = ${fmt(akhir.w)}·x + ${fmt(akhir.b)}**. Untuk rumah baru seluas ${fmt(xBaru, 1)}, prediksinya dibaca dari garis: **${fmt(yBaru)}**.`,
        gambar(akhir, false, (
          <>
            <Seg a={[xBaru, 0]} b={[xBaru, yBaru]} cls="an-guide" />
            <Seg a={[0, yBaru]} b={[xBaru, yBaru]} cls="an-guide" />
            <Star x={sx(xBaru)} y={sy(yBaru)} cls="an-c1" />
            <Label x={sx(xBaru) + 10} y={sy(yBaru) + 18}>prediksi</Label>
          </>
        ))),
    ],
  }
}

// ---------------------------------------------------------------- Regresi logistik
export function logisticRegression() {
  const r = makeRng(11)
  const pts = [...blob(r, 18, 3, 2.3, 0.95, 0), ...blob(r, 18, 6.9, 4.3, 0.95, 1)]
  const sig = (z) => 1 / (1 + Math.exp(-z))
  const snaps = [1, 4, 12, 40, 150, 600]
  const hist = []
  let w1 = 0, w2 = 0, b = 0
  for (let it = 1; it <= 600; it++) {
    let g1 = 0, g2 = 0, gb = 0
    for (const p of pts) { const e = sig(w1 * p.x + w2 * p.y + b) - p.c; g1 += e * p.x; g2 += e * p.y; gb += e }
    w1 -= (0.08 * g1) / pts.length; w2 -= (0.08 * g2) / pts.length; b -= (0.08 * gb) / pts.length
    if (snaps.includes(it)) {
      const acc = pts.filter((p) => (sig(w1 * p.x + w2 * p.y + b) > 0.5 ? 1 : 0) === p.c).length / pts.length
      hist.push({ it, w1, w2, b, acc })
    }
  }
  const gambar = (h, extra) => (
    <>
      <Grid />
      <Heat fn={(x, y) => { const p = sig(h.w1 * x + h.w2 * y + h.b); return { c: p > 0.5 ? 1 : 0, a: Math.abs(p - 0.5) * 2 } }} />
      <Line a={h.w1} b={h.w2} c={h.b} cls="an-line an-model" />
      <Marks pts={pts} />
      {extra}
    </>
  )
  const akhir = hist[hist.length - 1]
  const q = { x: 5.2, y: 3.1 }
  const pq = sig(akhir.w1 * q.x + akhir.w2 * q.y + akhir.b)
  return {
    legend: [{ c: 0, label: 'tidak lulus' }, { c: 1, label: 'lulus' }, { line: true, label: 'batas keputusan (peluang 50%)' }],
    frames: [
      frame('Dua kelas: siswa **tidak lulus** (biru) dan **lulus** (oranye), berdasarkan dua nilai (jam belajar & kehadiran). Model akan mempelajari **peluang lulus**.',
        <><Grid /><Marks pts={pts} /></>),
      ...hist.map((h) => frame(
        `Iterasi ${h.it}: model menghitung skor linear lalu memasukkannya ke **sigmoid** sehingga menjadi peluang 0–1. Warna latar = peluang (makin pekat makin yakin). Akurasi ${Math.round(h.acc * 100)}%.`,
        gambar(h),
      )),
      frame(`Data baru (bintang) diberi peluang lulus **${fmt(pq)}** → ${pq > 0.5 ? 'diprediksi **lulus**' : 'diprediksi **tidak lulus**'}. Titik dekat garis batas = model ragu (peluang ~0,5).`,
        gambar(akhir, <Star x={sx(q.x)} y={sy(q.y)} cls={pq > 0.5 ? 'an-c1' : 'an-c0'} />)),
    ],
  }
}

// ---------------------------------------------------------------- KNN
export function knn() {
  const r = makeRng(7)
  const pts = [...blob(r, 15, 3.4, 2.6, 1.1, 0), ...blob(r, 15, 6.4, 4.0, 1.1, 1)]
  const q = { x: 5.0, y: 3.4 }
  const urut = pts.map((p, i) => ({ i, d: dist(p, q) })).sort((a, b) => a.d - b.d)
  const K = 5
  const latar = (extra) => <><Grid />{extra}</>
  const frames = [
    frame('Data latih berlabel: buah **jeruk** (biru) dan **mangga** (oranye), berdasarkan ukuran dan warna. KNN tidak "melatih" apa pun: ia hanya **menyimpan data**.',
      latar(<Marks pts={pts} />)),
    frame('Ada buah baru (bintang) yang belum diketahui jenisnya.',
      latar(<><Marks pts={pts} /><Star x={sx(q.x)} y={sy(q.y)} /></>)),
    frame('Langkah 1: hitung **jarak** buah baru ke **semua** data latih.',
      latar(<>{pts.map((p, i) => <Seg key={i} a={[q.x, q.y]} b={[p.x, p.y]} cls="an-faint" />)}<Marks pts={pts} /><Star x={sx(q.x)} y={sy(q.y)} /></>)),
  ]
  const hitung = [0, 0]
  for (let k = 1; k <= K; k++) {
    const n = urut[k - 1]
    hitung[pts[n.i].c]++
    const tetangga = new Set(urut.slice(0, k).map((u) => u.i))
    frames.push(frame(
      `Tetangga terdekat ke-${k}: **${pts[n.i].c ? 'mangga' : 'jeruk'}** (jarak ${fmt(n.d)}). Suara sementara: jeruk ${hitung[0]}, mangga ${hitung[1]}.`,
      latar(<>
        <circle className="an-radius" cx={sx(q.x)} cy={sy(q.y)} r={n.d * PX} />
        {urut.slice(0, k).map((u) => <Seg key={u.i} a={[q.x, q.y]} b={[pts[u.i].x, pts[u.i].y]} cls="an-line" />)}
        {pts.map((p, i) => <Mark key={i} p={p} faded={!tetangga.has(i)} ring={i === n.i} />)}
        <Star x={sx(q.x)} y={sy(q.y)} />
      </>),
    ))
  }
  const menang = hitung[1] > hitung[0] ? 1 : 0
  const prediksi = (x, y, k = K) => {
    const s = pts.map((p) => ({ c: p.c, d: Math.hypot(p.x - x, p.y - y) })).sort((a, b) => a.d - b.d).slice(0, k)
    const m = s.filter((v) => v.c === 1).length / k
    return { c: m > 0.5 ? 1 : 0, a: Math.abs(m - 0.5) * 2 }
  }
  frames.push(frame(
    `Voting ${K} tetangga: **${hitung[menang]} lawan ${hitung[1 - menang]}** → buah baru diprediksi **${menang ? 'mangga' : 'jeruk'}**.`,
    latar(<><Marks pts={pts} /><Star x={sx(q.x)} y={sy(q.y)} cls={`an-c${menang}`} /></>),
  ))
  frames.push(frame(
    `Jika dilakukan untuk setiap titik di bidang, terbentuk **wilayah keputusan** (k = ${K}). Makin besar k, batasnya makin halus; k kecil membuat batas berliku dan sensitif noise.`,
    latar(<><Heat fn={(x, y) => prediksi(x, y)} /><Marks pts={pts} /></>),
  ))
  return { legend: [{ c: 0, label: 'jeruk' }, { c: 1, label: 'mangga' }, { star: true, label: 'data baru' }], frames }
}

// ---------------------------------------------------------------- Naive Bayes
export function naiveBayes() {
  const latih = {
    spam: ['gratis hadiah klik link', 'menang hadiah gratis sekarang', 'klik link promo gratis', 'hadiah promo klik sekarang'],
    normal: ['rapat besok jam sembilan', 'kirim link dokumen rapat', 'makan siang besok yuk', 'hadiah ulang tahun ibu'],
  }
  const pesan = ['klik', 'link', 'hadiah', 'besok']
  const vocab = new Set(Object.values(latih).flat().join(' ').split(' '))
  const hitung = {}
  for (const [k, kal] of Object.entries(latih)) {
    const kata = kal.join(' ').split(' ')
    hitung[k] = { total: kata.length, n: (w) => kata.filter((x) => x === w).length }
  }
  const P = (k, w) => (hitung[k].n(w) + 1) / (hitung[k].total + vocab.size) // Laplace smoothing
  const maksP = Math.max(...pesan.flatMap((w) => [P('spam', w), P('normal', w)]))
  const CX = W / 2, Y0 = 70, ROW = 34, BAR = 105

  const tampil = (sampai, final = false) => {
    let skorS = 0.5, skorN = 0.5
    for (let i = 0; i < sampai; i++) { skorS *= P('spam', pesan[i]); skorN *= P('normal', pesan[i]) }
    const tot = skorS + skorN
    return (
      <>
        <Label x={CX} y={22} anchor="middle" cls="an-strong">Pesan: "{pesan.join(' ')}"</Label>
        <Label x={CX - 12} y={50} anchor="end" cls="an-muted">P(kata | spam)</Label>
        <Label x={CX + 12} y={50} cls="an-muted">P(kata | normal)</Label>
        {pesan.map((w, i) => {
          const aktif = i < sampai
          const ps = P('spam', w), pn = P('normal', w)
          const y = Y0 + i * ROW
          return (
            <g key={w} opacity={aktif ? 1 : 0.25}>
              <rect className="an-fill1 an-bar" x={CX - 36 - (ps / maksP) * BAR} y={y} width={(ps / maksP) * BAR} height={18} rx="3" />
              <rect className="an-fill0 an-bar" x={CX + 36} y={y} width={(pn / maksP) * BAR} height={18} rx="3" />
              <Label x={CX} y={y + 13} anchor="middle" cls="an-strong">{w}</Label>
              {aktif && <Label x={CX - 40 - (ps / maksP) * BAR} y={y + 13} anchor="end" cls="an-small">{fmt(ps, 3)}</Label>}
              {aktif && <Label x={CX + 40 + (pn / maksP) * BAR} y={y + 13} cls="an-small">{fmt(pn, 3)}</Label>}
            </g>
          )
        })}
        {sampai > 0 && (
          <g>
            <Label x={CX} y={226} anchor="middle" cls="an-muted">
              Skor spam = 0,5 × … = {skorS.toExponential(2).replace('.', ',')}   |   Skor normal = {skorN.toExponential(2).replace('.', ',')}
            </Label>
            {final && (
              <>
                <rect className="an-fill1" x={40} y={242} width={(skorS / tot) * 320} height={16} rx="3" />
                <rect className="an-fill0" x={40 + (skorS / tot) * 320 + 2} y={242} width={(skorN / tot) * 320 - 2} height={16} rx="3" />
                <Label x={W / 2} y={274} anchor="middle" cls="an-strong">P(spam | pesan) = {fmt(skorS / tot)}</Label>
              </>
            )}
          </g>
        )}
      </>
    )
  }
  const frames = [
    frame(`Model sudah "belajar" dari 8 SMS berlabel: berapa sering setiap kata muncul di **spam** dan di **normal**. Sekarang ada pesan baru yang ingin diklasifikasikan.`, tampil(0)),
  ]
  pesan.forEach((w, i) => {
    const ps = P('spam', w), pn = P('normal', w)
    frames.push(frame(
      `Kata **"${w}"**: peluangnya muncul di spam ${fmt(ps, 3)} vs di normal ${fmt(pn, 3)}. ${ps > pn ? 'Lebih khas spam' : ps < pn ? 'Lebih khas pesan normal' : 'Sama-sama netral'}. Skor tiap kelas **dikalikan** dengan angka ini (asumsi "naif": kata-kata dianggap independen).`,
      tampil(i + 1),
    ))
  })
  frames.push(frame('Kedua skor dinormalisasi agar totalnya 1 → **peluang spam**. Kata "besok" menarik ke normal, tetapi "klik", "link", "hadiah" lebih kuat menarik ke spam.', tampil(4, true)))
  return { legend: [{ c: 1, label: 'spam' }, { c: 0, label: 'normal' }], frames }
}

// ---------------------------------------------------------------- Decision tree & random forest (bersama)
function dataPohon(seed) {
  const r = makeRng(seed)
  return Array.from({ length: 70 }, () => {
    const x = 0.3 + r() * 9.4, y = 0.3 + r() * (YMAX - 0.6)
    let c = (x > 4.6 && y < 3.6) || (x < 2.8 && y > 4.6) ? 1 : 0
    if (r() < 0.07) c = 1 - c
    return { x, y, c }
  })
}
const gini = (ps) => {
  if (!ps.length) return 0
  const p = ps.filter((q) => q.c === 1).length / ps.length
  return 1 - p * p - (1 - p) * (1 - p)
}
const mayoritas = (ps) => (ps.filter((q) => q.c === 1).length * 2 > ps.length ? 1 : 0)

function splitTerbaik(ps, fitur) {
  let best = null
  for (const f of fitur) {
    const key = f === 0 ? 'x' : 'y'
    const v = [...new Set(ps.map((p) => p[key]))].sort((a, b) => a - b)
    for (let i = 0; i < v.length - 1; i++) {
      const t = (v[i] + v[i + 1]) / 2
      const L = ps.filter((p) => p[key] < t), R = ps.filter((p) => p[key] >= t)
      if (L.length < 3 || R.length < 3) continue
      const g = (L.length * gini(L) + R.length * gini(R)) / ps.length
      if (!best || g < best.g) best = { f, t, g, L, R }
    }
  }
  return best
}

// Bangun pohon secara melebar (BFS); simpan keadaan wilayah setelah setiap split
function bangunPohon(ps, maxDepth, pilihFitur = () => [0, 1]) {
  let daun = [{ ps, box: [0, 0, XMAX, YMAX], depth: 0 }]
  const riwayat = []
  const antrian = [daun[0]]
  while (antrian.length) {
    const node = antrian.shift()
    if (node.depth >= maxDepth || gini(node.ps) === 0 || node.ps.length < 6) continue
    const s = splitTerbaik(node.ps, pilihFitur())
    if (!s || s.g >= gini(node.ps) - 1e-9) continue
    const [x0, y0, x1, y1] = node.box
    const bL = s.f === 0 ? [x0, y0, s.t, y1] : [x0, y0, x1, s.t]
    const bR = s.f === 0 ? [s.t, y0, x1, y1] : [x0, s.t, x1, y1]
    const kiri = { ps: s.L, box: bL, depth: node.depth + 1 }
    const kanan = { ps: s.R, box: bR, depth: node.depth + 1 }
    daun = daun.flatMap((d) => (d === node ? [kiri, kanan] : [d]))
    antrian.push(kiri, kanan)
    riwayat.push({ split: s, node, garis: s.f === 0 ? [[s.t, y0], [s.t, y1]] : [[x0, s.t], [x1, s.t]], daun: [...daun] })
  }
  const prediksi = (x, y) => {
    const d = daun.find(({ box: [a, b, c, e] }) => x >= a && x < c + 1e-9 && y >= b && y < e + 1e-9)
    return d ? mayoritas(d.ps) : 0
  }
  return { riwayat, daun, prediksi }
}

const GambarDaun = ({ daun }) => daun.map((d, i) => <Box key={i} box={d.box} c={mayoritas(d.ps)} a={1 - gini(d.ps)} />)

export function decisionTree() {
  const pts = dataPohon(5)
  const { riwayat } = bangunPohon(pts, 3)
  const nama = (f) => (f === 0 ? 'x₁ (sumbu datar)' : 'x₂ (sumbu tegak)')
  const frames = [
    frame(`Data nasabah: **lancar** (biru) dan **macet** (oranye). Ketidakmurnian awal (Gini) = ${fmt(gini(pts))}. Pohon akan memotong bidang dengan pertanyaan ya/tidak.`,
      <><Grid /><Marks pts={pts} /></>),
  ]
  riwayat.forEach((h, k) => {
    frames.push(frame(
      `Pertanyaan ke-${k + 1}: **${nama(h.split.f)} < ${fmt(h.split.t, 1)}?** Dipilih dari semua kemungkinan potongan karena paling menurunkan ketidakmurnian (Gini ${fmt(gini(h.node.ps))} → ${fmt(h.split.g)}).`,
      <>
        <Grid /><GambarDaun daun={h.daun} />
        {riwayat.slice(0, k).map((s, i) => <Seg key={i} a={s.garis[0]} b={s.garis[1]} cls="an-split" />)}
        <Seg a={h.garis[0]} b={h.garis[1]} cls="an-split an-new" />
        <Marks pts={pts} />
      </>,
    ))
  })
  frames.push(frame('Selesai (kedalaman maksimum 3). Setiap kotak adalah **daun**: jalur pertanyaan dari atas ke daun = **satu aturan if-then** yang bisa dibaca manusia.',
    <><Grid /><GambarDaun daun={riwayat[riwayat.length - 1].daun} />{riwayat.map((s, i) => <Seg key={i} a={s.garis[0]} b={s.garis[1]} cls="an-split" />)}<Marks pts={pts} /></>))
  return { legend: [{ c: 0, label: 'lancar' }, { c: 1, label: 'macet' }, { line: true, label: 'pertanyaan (split)' }], frames }
}

export function randomForest() {
  const pts = dataPohon(5)
  const r = makeRng(21)
  const pohon = Array.from({ length: 25 }, () => {
    const idx = pts.map(() => Math.floor(r() * pts.length))
    const sampel = idx.map((i) => pts[i])
    const model = bangunPohon(sampel, 4, () => [r() < 0.5 ? 0 : 1])
    return { idx: new Set(idx), ...model }
  })
  const frames = [
    frame('Data yang sama seperti decision tree. Satu pohon mudah **overfit**; random forest melatih **banyak pohon yang berbeda-beda** lalu mengambil suara terbanyak.',
      <><Grid /><Marks pts={pts} /></>),
  ]
  pohon.slice(0, 3).forEach((p, t) => {
    frames.push(frame(`Pohon ${t + 1}: ambil sampel acak **dengan pengembalian** (bootstrap). Titik pudar = tidak terpilih; sebagian titik terpilih lebih dari sekali.`,
      <><Grid />{pts.map((q, i) => <Mark key={i} p={q} faded={!p.idx.has(i)} />)}</>))
    frames.push(frame(`Pohon ${t + 1} belajar hanya dari sampelnya, dan di setiap cabang hanya boleh memilih dari **sebagian fitur acak**. Hasilnya berbeda dari pohon lain.`,
      <><Grid /><GambarDaun daun={p.daun} />{p.riwayat.map((s, i) => <Seg key={i} a={s.garis[0]} b={s.garis[1]} cls="an-split" />)}<Marks pts={pts} /></>))
  })
  const vote = (x, y) => {
    const m = pohon.reduce((s, p) => s + p.prediksi(x, y), 0) / pohon.length
    return { c: m > 0.5 ? 1 : 0, a: Math.abs(m - 0.5) * 2 }
  }
  frames.push(frame('Gabungan **25 pohon** lewat voting: batasnya lebih halus dan stabil. Warna pekat = hampir semua pohon setuju; pudar = suara terbelah (model ragu).',
    <><Grid /><Heat fn={vote} /><Marks pts={pts} /></>))
  return { legend: [{ c: 0, label: 'lancar' }, { c: 1, label: 'macet' }], frames }
}

// ---------------------------------------------------------------- Gradient boosting (regresi 1 dimensi)
export function gradientBoosting() {
  const r = makeRng(13)
  const pts = Array.from({ length: 32 }, (_, i) => {
    const x = 0.3 + (i / 31) * 9.4
    return { x, y: clamp(3.3 + 1.9 * Math.sin(x * 0.8) + normal(r) * 0.3, 0.3, YMAX - 0.3), c: 0 }
  })
  const lr = 0.6
  const F0 = pts.reduce((s, p) => s + p.y, 0) / pts.length
  const stumps = []
  const prediksi = (x, n) => stumps.slice(0, n).reduce((s, st) => s + lr * (x < st.t ? st.l : st.r), F0)
  const mse = (n) => pts.reduce((s, p) => s + (p.y - prediksi(p.x, n)) ** 2, 0) / pts.length
  for (let m = 0; m < 7; m++) {
    const res = pts.map((p) => ({ x: p.x, e: p.y - prediksi(p.x, m) }))
    let best = null
    for (let i = 1; i < res.length; i++) {
      const t = (res[i - 1].x + res[i].x) / 2
      const L = res.filter((q) => q.x < t), R = res.filter((q) => q.x >= t)
      const l = L.reduce((s, q) => s + q.e, 0) / L.length, rr = R.reduce((s, q) => s + q.e, 0) / R.length
      const sse = L.reduce((s, q) => s + (q.e - l) ** 2, 0) + R.reduce((s, q) => s + (q.e - rr) ** 2, 0)
      if (!best || sse < best.sse) best = { t, l, r: rr, sse }
    }
    stumps.push(best)
  }
  const kurva = (n) => {
    const d = Array.from({ length: 201 }, (_, i) => { const x = (i / 200) * XMAX; return `${sx(x)},${sy(clamp(prediksi(x, n), 0, YMAX))}` })
    return <polyline className="an-line an-model" points={d.join(' ')} fill="none" />
  }
  const residual = (n) => pts.map((p, i) => <Seg key={i} a={[p.x, p.y]} b={[p.x, prediksi(p.x, n)]} cls="an-resid" />)
  const frames = [
    frame('Data penjualan bulanan yang naik-turun. Gradient boosting membangun model **sedikit demi sedikit**, masing-masing memperbaiki kesalahan sebelumnya.', <><Grid /><Marks pts={pts} /></>),
    frame(`Mulai dari tebakan paling sederhana: **rata-rata** semua data. MSE = ${fmt(mse(0))}.`, <><Grid />{kurva(0)}<Marks pts={pts} /></>),
  ]
  for (let m = 0; m < stumps.length; m++) {
    frames.push(frame(`Ronde ${m + 1}: hitung **residual** (garis putus-putus) = sisa error yang belum bisa dijelaskan model saat ini.`,
      <><Grid />{residual(m)}{kurva(m)}<Marks pts={pts} /></>))
    frames.push(frame(`Latih **pohon kecil** (1 cabang, potong di x = ${fmt(stumps[m].t, 1)}) untuk meniru residual itu, lalu tambahkan ×${fmt(lr, 1)} (learning rate). MSE ${fmt(mse(m))} → **${fmt(mse(m + 1))}**.`,
      <><Grid />{kurva(m + 1)}<Marks pts={pts} /></>))
  }
  frames.push(frame('Hasil akhir = rata-rata + jumlah semua pohon kecil. Dengan ratusan pohon (dan learning rate kecil), kurva bisa sangat pas; terlalu banyak → **overfit**, sehingga dipakai early stopping.',
    <><Grid />{kurva(stumps.length)}<Marks pts={pts} /></>))
  return { legend: [{ c: 0, label: 'data' }, { line: true, label: 'prediksi model' }, { dash: true, label: 'residual' }], frames }
}

// ---------------------------------------------------------------- SVM
export function svm() {
  const r = makeRng(31)
  let pts = [...blob(r, 14, 3.0, 2.0, 0.75, 0), ...blob(r, 14, 6.9, 4.6, 0.75, 1)]
  // Cari garis margin terlebar dengan mencoba semua arah (cukup untuk 2 dimensi)
  const coba = (deg) => {
    const a = Math.cos((deg * Math.PI) / 180), b = Math.sin((deg * Math.PI) / 180)
    const pr = pts.map((p) => a * p.x + b * p.y)
    const max0 = Math.max(...pr.filter((_, i) => pts[i].c === 0)), min1 = Math.min(...pr.filter((_, i) => pts[i].c === 1))
    return { deg, a, b, m: (min1 - max0) / 2, mid: (min1 + max0) / 2 }
  }
  const semua = Array.from({ length: 720 }, (_, i) => coba(i / 2)).filter((s) => s.m > 0)
  const terbaik = semua.reduce((x, y) => (y.m > x.m ? y : x))
  const sv = new Set(pts.map((p, i) => (Math.abs(terbaik.a * p.x + terbaik.b * p.y - terbaik.mid) <= terbaik.m + 0.02 ? i : -1)).filter((i) => i >= 0))
  const kandidat = [...semua].sort((x, y) => x.m - y.m).filter((_, i, arr) => i === Math.floor(arr.length * 0.08) || i === Math.floor(arr.length * 0.35))
  const pita = (s) => {
    const l1 = lineInBox(s.a, s.b, -(s.mid - s.m)), l2 = lineInBox(s.a, s.b, -(s.mid + s.m))
    if (!l1 || !l2) return null
    const pol = [...l1, ...l2.slice().reverse()].map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')
    return (
      <>
        <polygon className="an-band" points={pol} />
        <Line a={s.a} b={s.b} c={-(s.mid - s.m)} cls="an-guide" />
        <Line a={s.a} b={s.b} c={-(s.mid + s.m)} cls="an-guide" />
      </>
    )
  }
  const gambar = (s, opsi = {}) => (
    <><Grid />{pita(s)}<Line a={s.a} b={s.b} c={-s.mid} cls="an-line an-model" />
      {pts.map((p, i) => <Mark key={i} p={p} ring={opsi.sv && sv.has(i)} faded={opsi.fade && !sv.has(i)} />)}</>
  )
  return {
    legend: [{ c: 0, label: 'kelas A' }, { c: 1, label: 'kelas B' }, { line: true, label: 'garis pemisah' }, { band: true, label: 'margin' }],
    frames: [
      frame('Dua kelas yang bisa dipisahkan garis lurus. Tapi ada **tak terhingga** garis yang bisa memisahkannya. Mana yang terbaik?', <><Grid /><Marks pts={pts} /></>),
      ...kandidat.map((k) => frame(`Garis ini memang memisahkan, tetapi jarak ke titik terdekat (**margin**, pita abu-abu) hanya ${fmt(k.m * 2)}. Data baru yang sedikit bergeser bisa salah kelas.`, gambar(k))),
      frame(`SVM memilih garis dengan **margin terlebar** (${fmt(terbaik.m * 2)}): sejauh mungkin dari kedua kelas, sehingga paling tahan terhadap data baru.`, gambar(terbaik)),
      frame(`Titik yang menyentuh tepi margin (dilingkari) disebut **support vector**. Hanya ${sv.size} titik ini yang menentukan posisi garis.`, gambar(terbaik, { sv: true })),
      frame('Buktinya: titik lain bisa digeser atau dihapus tanpa mengubah garis sedikit pun. Untuk data yang tidak bisa dipisah garis lurus, **kernel** (mis. RBF) membuat batas melengkung.', gambar(terbaik, { sv: true, fade: true })),
    ],
  }
}
