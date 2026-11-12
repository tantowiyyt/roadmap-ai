import {
  frame, makeRng, normal, blob, clamp, fmt, dist, sx, sy, XMAX, YMAX, PX, W,
  Grid, Mark, Marks, Seg, Line, Label,
} from './kit.jsx'

// ---------------------------------------------------------------- K-Means
export function kmeans() {
  const r = makeRng(4)
  const pts = [...blob(r, 16, 2.4, 2.0, 0.65, null), ...blob(r, 16, 7.6, 2.2, 0.65, null), ...blob(r, 16, 5.0, 5.0, 0.65, null)]
  let pusat = [{ x: 4.2, y: 3.4 }, { x: 5.6, y: 3.0 }, { x: 6.4, y: 4.0 }]
  const Pusat = ({ ps, ghost }) => ps.map((c, k) => (
    <g key={`c${k}`}>
      {ghost && <circle className="an-ghost" cx={sx(ghost[k].x)} cy={sy(ghost[k].y)} r="9" />}
      {ghost && <Seg a={[ghost[k].x, ghost[k].y]} b={[c.x, c.y]} cls="an-arrow" />}
      <circle className={`an-centroid an-move an-fill${k}`} cx={sx(c.x)} cy={sy(c.y)} r="9" />
      <text className="an-centroid-x an-move" x={sx(c.x)} y={sy(c.y) + 4} textAnchor="middle">✕</text>
    </g>
  ))
  const inertia = (lab, ps) => pts.reduce((s, p, i) => s + dist(p, ps[lab[i]]) ** 2, 0)
  const frames = [
    frame('Data pelanggan **tanpa label** (abu-abu). Kita ingin membaginya menjadi **3 kelompok** yang mirip-mirip.', <><Grid /><Marks pts={pts} /></>),
    frame('Mulai: letakkan 3 **titik pusat** (centroid, tanda ✕) di posisi acak.', <><Grid /><Marks pts={pts} /><Pusat ps={pusat} /></>),
  ]
  let label = pts.map(() => -1)
  for (let it = 1; it <= 8; it++) {
    const baru = pts.map((p) => pusat.map((c) => dist(p, c)).reduce((bi, d, i, arr) => (d < arr[bi] ? i : bi), 0))
    const berubah = baru.filter((v, i) => v !== label[i]).length
    label = baru
    if (it > 1 && berubah === 0) {
      frames.push(frame(`Iterasi ${it}: tidak ada titik yang pindah kelompok → **konvergen**, selesai. Hasil: 3 segmen pelanggan.`,
        <><Grid />{pts.map((p, i) => <Mark key={i} p={p} cls={label[i]} />)}<Pusat ps={pusat} /></>))
      break
    }
    frames.push(frame(`Iterasi ${it}, langkah 1: setiap titik masuk ke kelompok **pusat terdekat** (${berubah} titik berganti kelompok).`,
      <><Grid />{pts.map((p, i) => <Seg key={`l${i}`} a={[p.x, p.y]} b={[pusat[label[i]].x, pusat[label[i]].y]} cls="an-faint" />)}
        {pts.map((p, i) => <Mark key={i} p={p} cls={label[i]} />)}<Pusat ps={pusat} /></>))
    const lama = pusat
    pusat = pusat.map((c, k) => {
      const ang = pts.filter((_, i) => label[i] === k)
      return ang.length ? { x: ang.reduce((s, p) => s + p.x, 0) / ang.length, y: ang.reduce((s, p) => s + p.y, 0) / ang.length } : c
    })
    frames.push(frame(`Iterasi ${it}, langkah 2: setiap pusat **pindah ke rata-rata** anggotanya. Total jarak kuadrat (inertia) = ${fmt(inertia(label, pusat), 1)}.`,
      <><Grid />{pts.map((p, i) => <Mark key={i} p={p} cls={label[i]} />)}<Pusat ps={pusat} ghost={lama} /></>))
  }
  return { legend: [{ c: 0, label: 'kelompok 1' }, { c: 1, label: 'kelompok 2' }, { c: 2, label: 'kelompok 3' }, { cross: true, label: 'pusat (centroid)' }], frames }
}

// ---------------------------------------------------------------- DBSCAN
export function dbscan() {
  const r = makeRng(9)
  const pts = []
  for (let i = 0; i < 38; i++) { const t = (i / 37) * Math.PI; pts.push({ x: 2.9 + 2.6 * Math.cos(t) + normal(r) * 0.12, y: 2.1 + 2.6 * Math.sin(t) * 0.95 + normal(r) * 0.12 }) }
  for (let i = 0; i < 38; i++) { const t = (i / 37) * Math.PI; pts.push({ x: 2.9 + 2.6 * (1 - Math.cos(t)) + normal(r) * 0.12, y: 2.1 + 2.6 * (0.45 - Math.sin(t)) * 0.95 + normal(r) * 0.12 }) }
  for (let i = 0; i < 7; i++) pts.push({ x: 0.5 + r() * 9, y: 0.4 + r() * (YMAX - 0.8) })
  pts.forEach((p) => { p.x = clamp(p.x, 0.2, XMAX - 0.2); p.y = clamp(p.y, 0.2, YMAX - 0.2); p.c = null })
  const EPS = 0.72, MIN = 4
  const tetangga = (i) => pts.map((q, j) => (j !== i && dist(pts[i], q) <= EPS ? j : -1)).filter((j) => j >= 0)
  const inti = pts.map((_, i) => tetangga(i).length >= MIN)
  const label = pts.map(() => null)
  const snapshot = []
  let klaster = 0
  for (let s = 0; s < pts.length; s++) {
    if (label[s] !== null || !inti[s]) continue
    label[s] = klaster
    let gelombang = [s], ke = 0
    while (gelombang.length) {
      const next = []
      for (const i of gelombang) {
        if (!inti[i]) continue
        for (const j of tetangga(i)) if (label[j] === null) { label[j] = klaster; next.push(j) }
      }
      ke++
      if (ke % 3 === 0 || !next.length) snapshot.push({ label: [...label], klaster, aktif: next.length ? next : gelombang, selesai: !next.length })
      gelombang = next
    }
    klaster++
  }
  const contoh = inti.findIndex((v, i) => v && i > 10)
  const frames = [
    frame('Data berbentuk dua **bulan sabit** + beberapa titik nyasar. K-Means akan gagal di sini karena kelompoknya tidak bulat.', <><Grid /><Marks pts={pts} /></>),
    frame(`Aturan DBSCAN: titik dengan **≥ ${MIN} tetangga** dalam radius ε (lingkaran) disebut **titik inti**. Titik ini punya ${tetangga(contoh).length} tetangga → inti.`,
      <><Grid /><circle className="an-radius" cx={sx(pts[contoh].x)} cy={sy(pts[contoh].y)} r={EPS * PX} />
        {pts.map((p, i) => <Mark key={i} p={p} ring={i === contoh} faded={i !== contoh && dist(p, pts[contoh]) > EPS} />)}</>),
  ]
  snapshot.forEach((s) => {
    frames.push(frame(
      s.selesai
        ? `Kelompok ${s.klaster + 1} berhenti tumbuh: tidak ada lagi titik inti di tepinya. Total anggota: ${s.label.filter((v) => v === s.klaster).length}.`
        : `Kelompok ${s.klaster + 1} **menjalar** dari titik inti ke tetangganya, lalu ke tetangga dari tetangga… (mengikuti kepadatan, bukan bentuk bulat).`,
      <><Grid />
        {s.aktif.map((i) => <circle key={`r${i}`} className="an-radius an-thin" cx={sx(pts[i].x)} cy={sy(pts[i].y)} r={EPS * PX} />)}
        {pts.map((p, i) => <Mark key={i} p={p} cls={s.label[i]} />)}</>,
    ))
  })
  const noise = label.filter((v) => v === null).length
  frames.push(frame(`Selesai: ${klaster} kelompok mengikuti bentuk bulan sabit, dan **${noise} titik** yang terpencil ditandai **noise (×)**, tidak dipaksa masuk kelompok mana pun.`,
    <><Grid />{pts.map((p, i) => (label[i] === null
      ? <text key={i} className="an-noise" x={sx(p.x)} y={sy(p.y) + 4} textAnchor="middle">×</text>
      : <Mark key={i} p={p} cls={label[i]} />))}</>))
  return { legend: [{ c: 0, label: 'kelompok 1' }, { c: 1, label: 'kelompok 2' }, { noise: true, label: 'noise' }], frames }
}

// ---------------------------------------------------------------- PCA
export function pca() {
  const r = makeRng(17)
  const sudut = (32 * Math.PI) / 180
  const pts = Array.from({ length: 40 }, () => {
    const t = normal(r) * 1.55, u = normal(r) * 0.42
    return { x: 5 + t * Math.cos(sudut) - u * Math.sin(sudut), y: 3.3 + t * Math.sin(sudut) + u * Math.cos(sudut), c: 0 }
  })
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length, my = pts.reduce((s, p) => s + p.y, 0) / pts.length
  const variasi = (deg) => {
    const a = Math.cos((deg * Math.PI) / 180), b = Math.sin((deg * Math.PI) / 180)
    return pts.reduce((s, p) => s + ((p.x - mx) * a + (p.y - my) * b) ** 2, 0) / pts.length
  }
  const total = variasi(0) + variasi(90)
  let terbaik = 0
  for (let d = 0; d < 180; d += 0.5) if (variasi(d) > variasi(terbaik)) terbaik = d
  const proyeksi = (p, deg) => {
    const a = Math.cos((deg * Math.PI) / 180), b = Math.sin((deg * Math.PI) / 180)
    const t = (p.x - mx) * a + (p.y - my) * b
    return { x: mx + t * a, y: my + t * b, c: 0 }
  }
  const sumbu = (deg, cls = 'an-line an-model') => {
    const a = Math.cos((deg * Math.PI) / 180), b = Math.sin((deg * Math.PI) / 180)
    return <Line a={-b} b={a} c={b * mx - a * my} cls={cls} />
  }
  const pusat = <><Seg a={[mx - 0.25, my]} b={[mx + 0.25, my]} cls="an-line" /><Seg a={[mx, my - 0.25]} b={[mx, my + 0.25]} cls="an-line" /></>
  const kandidat = (deg) => (
    <><Grid />{sumbu(deg)}{pts.map((p, i) => { const q = proyeksi(p, deg); return <Seg key={i} a={[p.x, p.y]} b={[q.x, q.y]} cls="an-resid" /> })}
      {pts.map((p, i) => <Mark key={`p${i}`} p={proyeksi(p, deg)} r={2.5} cls={1} />)}<Marks pts={pts} />{pusat}</>
  )
  const persen = (d) => Math.round((variasi(d) / total) * 100)
  return {
    legend: [{ c: 0, label: 'data asli (2 kolom)' }, { c: 1, label: 'hasil proyeksi' }, { line: true, label: 'sumbu yang dicoba' }],
    frames: [
      frame('Data dengan **2 kolom** (mis. tinggi & berat badan) yang saling berkaitan. Bisakah diringkas menjadi **1 kolom** tanpa banyak kehilangan informasi?', <><Grid /><Marks pts={pts} /></>),
      frame('Langkah 1: cari **titik tengah** data (rata-rata), lalu semua perhitungan diukur dari titik ini.', <><Grid /><Marks pts={pts} />{pusat}</>),
      ...[110, 160, 0].map((d) => frame(`Coba sebuah sumbu: proyeksikan setiap titik ke garis itu (titik oranye kecil). Sebaran titik di sepanjang garis = **${persen(d)}%** dari total variasi. Kurang lebar.`, kandidat(d))),
      frame(`Sumbu dengan sebaran **terbesar** (${persen(terbaik)}%) inilah **komponen utama 1 (PC1)**. Secara matematis ia adalah eigenvector matriks kovarians.`, kandidat(terbaik)),
      frame(`PC2 tegak lurus PC1 dan hanya menyimpan sisa **${100 - persen(terbaik)}%** variasi.`,
        <><Grid />{sumbu(terbaik)}{sumbu(terbaik + 90, 'an-line an-guide')}<Marks pts={pts} />{pusat}</>),
      frame(`Hasil: setiap titik diganti posisinya di PC1. **2 kolom → 1 kolom**, tetapi ${persen(terbaik)}% informasi tetap ada. Untuk data 64 kolom, cara yang sama bisa meringkas menjadi 2–10 kolom.`,
        <><Grid />{sumbu(terbaik, 'an-line an-guide')}{pts.map((p, i) => <Mark key={`p${i}`} p={proyeksi(p, terbaik)} cls={1} />)}{pusat}</>),
    ],
  }
}

// ---------------------------------------------------------------- Apriori
export function apriori() {
  const T = [['roti', 'susu', 'mentega'], ['roti', 'mentega'], ['roti', 'susu'], ['susu', 'kopi'],
    ['roti', 'susu', 'mentega', 'kopi'], ['roti', 'mentega', 'telur'], ['kopi', 'telur'], ['roti', 'susu', 'mentega']]
  const MIN = 3
  const ikon = { roti: '🍞', susu: '🥛', mentega: '🧈', kopi: '☕', telur: '🥚' }
  const support = (set) => T.filter((t) => set.every((i) => t.includes(i))).length
  const item1 = ['roti', 'susu', 'mentega', 'kopi', 'telur']
  const lolos1 = item1.filter((i) => support([i]) >= MIN)
  const pasang = []
  for (let i = 0; i < lolos1.length; i++) for (let j = i + 1; j < lolos1.length; j++) pasang.push([lolos1[i], lolos1[j]])
  const lolos2 = pasang.filter((p) => support(p) >= MIN)
  const tiga = [['roti', 'susu', 'mentega']]

  const ROWY = 30, RH = 27
  const daftarTransaksi = (sorot = []) => (
    <g>
      <Label x={14} y={18} cls="an-muted">Transaksi</Label>
      {T.map((t, i) => {
        const cocok = sorot.length && sorot.every((s) => t.includes(s))
        return (
          <g key={i}>
            {cocok ? <rect className="an-fill0" x={10} y={ROWY + i * RH - 2} width={150} height={RH - 4} rx="5" opacity="0.18" /> : null}
            <Label x={16} y={ROWY + i * RH + 15} cls="an-small an-muted">T{i + 1}</Label>
            <text x={42} y={ROWY + i * RH + 16} className="an-emoji">{t.map((x) => ikon[x]).join(' ')}</text>
          </g>
        )
      })}
    </g>
  )
  const BX = 190, BW = 150, BW_ATURAN = 100
  const batang = (sets, judul, buang = false) => (
    <g>
      <Label x={BX} y={18} cls="an-muted">{judul}</Label>
      <line className="an-guide" x1={BX + 64 + (MIN / T.length) * BW} x2={BX + 64 + (MIN / T.length) * BW} y1={26} y2={30 + sets.length * RH} />
      <Label x={BX + 64 + (MIN / T.length) * BW} y={42 + sets.length * RH} anchor="middle" cls="an-small an-muted">min. {MIN}</Label>
      {sets.map((s, i) => {
        const n = support(s)
        const gagal = buang && n < MIN
        return (
          <g key={s.join()} opacity={gagal ? 0.3 : 1}>
            <text x={BX} y={ROWY + i * RH + 16} className="an-emoji">{s.map((x) => ikon[x]).join('')}</text>
            <rect className={gagal ? 'an-fill1' : 'an-fill0'} x={BX + 64} y={ROWY + i * RH + 2} width={(n / T.length) * BW} height={16} rx="3" />
            <Label x={BX + 70 + (n / T.length) * BW} y={ROWY + i * RH + 15} cls="an-small">{n}{gagal ? ' ✗' : ''}</Label>
          </g>
        )
      })}
    </g>
  )
  const conf = (a, b) => support([...a, ...b]) / support(a)
  const aturan = [[['mentega'], ['roti']], [['roti'], ['mentega']], [['roti', 'susu'], ['mentega']]]
  return {
    legend: [{ c: 0, label: 'lolos (sering muncul)' }, { c: 1, label: 'dibuang' }],
    frames: [
      frame('8 transaksi di minimarket. Tujuan: menemukan barang yang **sering dibeli bersamaan**. Batas: harus muncul di **minimal 3 transaksi** (support).',
        <>{daftarTransaksi()}</>),
      frame('Langkah 1: hitung berapa transaksi yang memuat setiap **item tunggal**.', <>{daftarTransaksi()}{batang(item1.map((i) => [i]), 'Item tunggal')}</>),
      frame(`Buang item di bawah batas: **telur** hanya muncul ${support(['telur'])} kali. Prinsip Apriori: jika telur jarang, **semua** kombinasi yang memuat telur pasti juga jarang → tidak perlu dihitung.`,
        <>{daftarTransaksi()}{batang(item1.map((i) => [i]), 'Item tunggal', true)}</>),
      frame(`Langkah 2: bentuk **pasangan** hanya dari item yang lolos (${pasang.length} kandidat), lalu hitung. Contoh: transaksi yang disorot memuat 🍞+🧈.`,
        <>{daftarTransaksi(['roti', 'mentega'])}{batang(pasang, 'Pasangan')}</>),
      frame(`Pasangan yang lolos: ${lolos2.map((p) => p.map((x) => ikon[x]).join('+')).join(', ')}. Sisanya dibuang.`,
        <>{daftarTransaksi()}{batang(pasang, 'Pasangan', true)}</>),
      frame(`Langkah 3: kombinasi **3 item** dari pasangan yang lolos: 🍞🥛🧈 muncul ${support(tiga[0])} kali → lolos. Tidak ada kandidat 4 item lagi → berhenti.`,
        <>{daftarTransaksi(tiga[0])}{batang(tiga, '3 item', true)}</>),
      frame('Dari itemset yang sering muncul, dibuat **aturan** beserta **confidence** (seberapa sering aturan itu benar). Contoh: beli 🧈 → hampir pasti juga beli 🍞.',
        <>
          {daftarTransaksi()}
          <Label x={BX} y={18} cls="an-muted">Aturan asosiasi</Label>
          {aturan.map(([a, b], i) => (
            <g key={i}>
              <text x={BX} y={44 + i * 44} className="an-emoji">{a.map((x) => ikon[x]).join('')} → {b.map((x) => ikon[x]).join('')}</text>
              <rect className="an-fill0" x={BX} y={52 + i * 44} width={conf(a, b) * BW_ATURAN} height={10} rx="3" />
              <Label x={BX + conf(a, b) * BW_ATURAN + 6} y={61 + i * 44} cls="an-small">confidence {Math.round(conf(a, b) * 100)}%</Label>
            </g>
          ))}
          <Label x={W - 10} y={270} anchor="end" cls="an-small an-muted">Dipakai untuk tata letak rak & promo bundling</Label>
        </>),
    ],
  }
}
