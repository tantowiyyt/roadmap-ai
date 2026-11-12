import { frame, makeRng, fmt } from './kit.jsx'

// ---------------------------------------------------------------- A* pada peta grid
export function aStar() {
  const peta = [
    '..................',
    '..........#.......',
    '...####...#.......',
    '......#...#..###..',
    '.S....#...#....#..',
    '......#...#....#G.',
    '...####...#....#..',
    '..........#..###..',
    '..................',
    '..........#.......',
  ]
  const R = peta.length, C = peta[0].length, SEL = 20, OX = 20, OY = 36
  let start, goal
  peta.forEach((row, i) => [...row].forEach((ch, j) => { if (ch === 'S') start = [i, j]; if (ch === 'G') goal = [i, j] }))
  const dinding = (i, j) => peta[i][j] === '#'
  const key = (i, j) => i * C + j
  const h = (i, j) => Math.abs(i - goal[0]) + Math.abs(j - goal[1])

  function cari(pakaiH) {
    const g = new Map([[key(...start), 0]])
    const asal = new Map()
    const open = new Map([[key(...start), start]])
    const closed = new Set()
    const langkah = []
    while (open.size) {
      let best = null
      for (const [k, [i, j]] of open) {
        const f = g.get(k) + (pakaiH ? h(i, j) : 0)
        if (!best || f < best.f || (f === best.f && h(i, j) < h(...best.p))) best = { k, p: [i, j], f }
      }
      open.delete(best.k); closed.add(best.k)
      langkah.push({ cur: best.p, open: new Set(open.keys()), closed: new Set(closed), f: best.f })
      if (best.p[0] === goal[0] && best.p[1] === goal[1]) break
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ni = best.p[0] + di, nj = best.p[1] + dj
        if (ni < 0 || nj < 0 || ni >= R || nj >= C || dinding(ni, nj) || closed.has(key(ni, nj))) continue
        const ng = g.get(best.k) + 1
        if (!g.has(key(ni, nj)) || ng < g.get(key(ni, nj))) { g.set(key(ni, nj), ng); asal.set(key(ni, nj), best.k); open.set(key(ni, nj), [ni, nj]) }
      }
      langkah[langkah.length - 1].open = new Set(open.keys())
    }
    const jalur = []
    let k = key(...goal)
    while (k !== undefined) { jalur.push([Math.floor(k / C), k % C]); k = asal.get(k) }
    return { langkah, jalur: jalur.reverse() }
  }
  const astar = cari(true)
  const dijkstra = cari(false)

  const gambar = (s, jalur = null) => (
    <>
      {peta.map((row, i) => [...row].map((ch, j) => {
        const k = key(i, j)
        let cls = 'an-cell'
        if (ch === '#') cls = 'an-wall'
        else if (s?.closed.has(k)) cls = 'an-closed'
        else if (s?.open.has(k)) cls = 'an-open'
        return <rect key={k} className={cls} x={OX + j * SEL} y={OY + i * SEL} width={SEL - 2} height={SEL - 2} rx="3" />
      }))}
      {s && <rect className="an-current" x={OX + s.cur[1] * SEL - 1} y={OY + s.cur[0] * SEL - 1} width={SEL} height={SEL} rx="4" />}
      {jalur && <polyline className="an-path" points={jalur.map(([i, j]) => `${OX + j * SEL + SEL / 2 - 1},${OY + i * SEL + SEL / 2 - 1}`).join(' ')} />}
      <text className="an-cell-big" x={OX + start[1] * SEL + SEL / 2 - 1} y={OY + start[0] * SEL + 14} textAnchor="middle">S</text>
      <text className="an-cell-big" x={OX + goal[1] * SEL + SEL / 2 - 1} y={OY + goal[0] * SEL + 14} textAnchor="middle">G</text>
    </>
  )
  const frames = [
    frame('Peta gudang: robot di **S** harus ke **G** tanpa menabrak rak (kotak gelap). Setiap langkah ke kotak sebelah = biaya 1.', gambar(null)),
  ]
  const L = astar.langkah
  const titik = [1, 3, 6, 10, 15, 21, 28, 36, 46, 58, L.length].filter((n, i, a) => n <= L.length && a.indexOf(n) === i)
  titik.forEach((n, idx) => {
    const s = L[n - 1]
    frames.push(frame(
      idx === 0
        ? 'A* memilih kotak dengan nilai **f = g + h** terkecil. g = langkah yang sudah ditempuh, h = perkiraan jarak lurus (Manhattan) ke G. Kotak kuning = kandidat (open), biru = sudah diperiksa.'
        : n === L.length
          ? `Tujuan tercapai setelah memeriksa **${L.length}** kotak.`
          : `Memeriksa kotak ke-${n} (f = ${s.f}). Pencarian condong **ke arah G** karena h menuntun; saat terhalang rak, A* mencari jalan memutar.`,
      gambar(s),
      idx === 0 ? 2600 : 900,
    ))
  })
  frames.push(frame(`Rute terpendek: **${astar.jalur.length - 1} langkah**. Sebagai perbandingan, pencarian tanpa heuristik (Dijkstra) harus memeriksa **${dijkstra.langkah.length}** kotak untuk hasil yang sama.`,
    gambar(L[L.length - 1], astar.jalur)))
  return { legend: [{ cell: 'an-open', label: 'kandidat (open)' }, { cell: 'an-closed', label: 'sudah diperiksa' }, { cell: 'an-wall', label: 'rintangan' }, { path: true, label: 'rute' }], frames }
}

// ---------------------------------------------------------------- Q-Learning pada grid world
export function qLearning() {
  const R = 4, C = 6, SEL = 54, OX = 38, OY = 30
  const start = [3, 0], goal = [0, 5]
  const lubang = [[1, 2], [3, 3], [1, 4], [2, 4]]
  const isLubang = (i, j) => lubang.some(([a, b]) => a === i && b === j)
  const aksi = [[-1, 0], [1, 0], [0, -1], [0, 1]] // atas, bawah, kiri, kanan
  const panah = ['↑', '↓', '←', '→']
  const Q = Array.from({ length: R }, () => Array.from({ length: C }, () => [0, 0, 0, 0]))
  const r = makeRng(42)
  const alpha = 0.5, gamma = 0.9, eps = 0.2
  const snaps = [1, 3, 10, 30, 80, 250]
  const hasil = []
  for (let ep = 1; ep <= 250; ep++) {
    let [i, j] = start, total = 0
    const jejak = [[i, j]]
    for (let t = 0; t < 60; t++) {
      const q = Q[i][j]
      const a = r() < eps ? Math.floor(r() * 4) : q.indexOf(Math.max(...q))
      const ni = Math.min(R - 1, Math.max(0, i + aksi[a][0])), nj = Math.min(C - 1, Math.max(0, j + aksi[a][1]))
      const selesai = (ni === goal[0] && nj === goal[1]) || isLubang(ni, nj)
      const rew = ni === goal[0] && nj === goal[1] ? 10 : isLubang(ni, nj) ? -10 : -1
      const target = rew + (selesai ? 0 : gamma * Math.max(...Q[ni][nj]))
      Q[i][j][a] += alpha * (target - Q[i][j][a])
      total += rew;[i, j] = [ni, nj]; jejak.push([i, j])
      if (selesai) break
    }
    if (snaps.includes(ep)) hasil.push({ ep, Q: Q.map((row) => row.map((q) => [...q])), jejak, total })
  }
  const kebijakan = (Qs) => {
    const jalur = [start]
    let [i, j] = start
    for (let t = 0; t < 20; t++) {
      const q = Qs[i][j]
      if (q.every((v) => v === 0)) break
      const a = q.indexOf(Math.max(...q))
      i = Math.min(R - 1, Math.max(0, i + aksi[a][0])); j = Math.min(C - 1, Math.max(0, j + aksi[a][1]))
      jalur.push([i, j])
      if ((i === goal[0] && j === goal[1]) || isLubang(i, j)) break
    }
    return jalur
  }
  const tengah = ([i, j]) => `${OX + j * SEL + SEL / 2},${OY + i * SEL + SEL / 2}`
  const gambar = (s, mode = 'jejak') => (
    <>
      {Array.from({ length: R }, (_, i) => Array.from({ length: C }, (_, j) => {
        const x = OX + j * SEL, y = OY + i * SEL
        const g = i === goal[0] && j === goal[1], l = isLubang(i, j)
        const q = s?.Q[i][j], v = q ? Math.max(...q) : 0
        const kelas = g ? 'an-goal' : l ? 'an-pit' : 'an-cell'
        return (
          <g key={`${i}${j}`}>
            <rect className={kelas} x={x} y={y} width={SEL - 3} height={SEL - 3} rx="6" />
            {!g && !l && s && q.some((u) => u !== 0) && (
              <>
                <rect className={`an-fill${v >= 0 ? 0 : 1}`} x={x} y={y} width={SEL - 3} height={SEL - 3} rx="6" opacity={Math.min(0.55, Math.abs(v) / 14)} />
                <text className="an-qarrow" x={x + SEL / 2 - 1} y={y + 26} textAnchor="middle">{panah[q.indexOf(v)]}</text>
                <text className="an-cell-text an-small" x={x + SEL / 2 - 1} y={y + 42} textAnchor="middle">{fmt(v, 1)}</text>
              </>
            )}
            {g && <text className="an-cell-big" x={x + SEL / 2 - 1} y={y + 32} textAnchor="middle">🏁 +10</text>}
            {l && <text className="an-cell-big" x={x + SEL / 2 - 1} y={y + 32} textAnchor="middle">🕳️ −10</text>}
          </g>
        )
      }))}
      {s && mode === 'jejak' && <polyline className="an-trail" points={s.jejak.map(tengah).join(' ')} />}
      {s && mode === 'kebijakan' && <polyline className="an-path" points={kebijakan(s.Q).map(tengah).join(' ')} />}
      <text className="an-cell-big" x={OX + start[1] * SEL + SEL / 2 - 1} y={OY + start[0] * SEL + 32} textAnchor="middle">🤖</text>
    </>
  )
  const akhir = hasil[hasil.length - 1]
  return {
    legend: [{ c: 0, label: 'nilai Q positif (tempat bagus)' }, { c: 1, label: 'nilai Q negatif' }, { trail: true, label: 'jejak episode' }],
    frames: [
      frame('Robot 🤖 harus mencapai 🏁 (+10) tanpa jatuh ke lubang 🕳️ (−10). Setiap langkah bernilai −1 agar robot memilih jalan pendek. Robot **tidak tahu peta**: ia belajar dari mencoba.', gambar(null)),
      ...hasil.map((s, k) => frame(
        k === 0
          ? `Episode 1: robot berjalan **acak** (garis putus-putus) sampai jatuh atau tiba. Total reward ${s.total}. Nilai Q hanya diperbarui di kotak yang dilewati.`
          : `Setelah ${s.ep} episode: nilai baik **merambat mundur** dari 🏁 (Q ← Q + α·(reward + γ·Q terbaik berikutnya − Q)). Panah = aksi terbaik menurut robot. Reward episode ini: ${s.total}.`,
        gambar(s),
      )),
      frame(`Kebijakan akhir: dari 🤖 cukup **ikuti panah** (garis tebal). Robot menemukan jalan aman yang memutari lubang tanpa pernah diberi peta. Inilah reinforcement learning.`, gambar(akhir, 'kebijakan')),
    ],
  }
}
