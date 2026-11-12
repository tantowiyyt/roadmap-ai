// Animasi mini untuk kartu di daftar algoritma.
// Murni SVG + animasi CSS (lihat bagian "Animasi mini kartu" di styles.css), tanpa JavaScript.
// Aturan: keadaan dasar setiap elemen = keadaan akhir, supaya saat animasi dimatikan
// (prefers-reduced-motion) gambarnya tetap utuh dan bermakna.
// Warna kelas sama dengan animasi besar: biru = lingkaran, oranye = kotak, hijau = segitiga.

// Semua animasi berputar dalam siklus 5 detik yang sama. Elemen yang "muncul pada detik ke-s lalu tetap
// tampil sampai akhir siklus" butuh keyframe sendiri per waktu muncul (animation-delay saja membuat urutan
// bergeser antar putaran). Keyframe itu dibuat otomatis di bawah: mp = muncul, mt = berubah warna,
// ms = sel dicek (A*), mx = batang memanjang, md = garis tergambar. Waktu dibulatkan ke 0,1 detik.
const SIKLUS = 5
const k = (s) => Math.round(s * 10)
const p = (s) => ({ animationName: `mp${k(s)}` })
const tint = (s) => ({ animationName: `mt${k(s)}` })
const seen = (s) => ({ animationName: `ms${k(s)}` })
const gx = (s) => ({ animationName: `mx${k(s)}` })
const dr = (s) => ({ animationName: `md${k(s)}` })
// Jeda biasa untuk animasi berdenyut yang tidak perlu sinkron dengan akhir siklus
const d = (s) => ({ animationDelay: `${s}s` })

function buatKeyframes() {
  const pct = (s) => +((s / SIKLUS) * 100).toFixed(2)
  let css = ''
  for (let i = 0; i <= 44; i++) {
    const a = pct(i / 10), b = Math.min(a + 6, 90)
    css += `@keyframes mp${i}{0%,${a}%{opacity:0;transform:scale(.6)}${b}%,92%{opacity:var(--fo,1);transform:scale(1)}97%,100%{opacity:0;transform:scale(1)}}`
    if (i > 30) continue
    css += `@keyframes mt${i}{0%,${a}%{fill:var(--m-off)}${b}%,92%{fill:var(--c)}100%{fill:var(--m-off)}}`
    css += `@keyframes ms${i}{0%,${a}%{fill:var(--m-cell)}${b}%,92%{fill:var(--m-seen)}100%{fill:var(--m-cell)}}`
    css += `@keyframes mx${i}{0%,${a}%{transform:scaleX(0)}${Math.min(a + 16, 90)}%,92%{transform:scaleX(1)}100%{transform:scaleX(0)}}`
    css += `@keyframes md${i}{0%,${a}%{stroke-dashoffset:100;opacity:1}${Math.min(a + 30, 90)}%,92%{stroke-dashoffset:0;opacity:1}97%,100%{stroke-dashoffset:0;opacity:0}}`
  }
  // CNN: jendela 2×2 bergeser ke 15 posisi (5 kolom × 3 baris), 0,3 detik per posisi
  let mk = ''
  for (let i = 0; i < 15; i++) mk += `${pct(i * 0.3 + 0.2)}%{transform:translate(${(i % 5) * 12}px,${Math.floor(i / 5) * 12}px)}`
  css += `@keyframes mk{0%{transform:translate(0,0)}${mk}92%{transform:translate(48px,24px)}100%{transform:translate(0,0)}}`
  return css
}
if (typeof document !== 'undefined' && !document.getElementById('mini-anim-css')) {
  const el = document.createElement('style')
  el.id = 'mini-anim-css'
  el.textContent = buatKeyframes()
  document.head.appendChild(el)
}
const B = ({ x, y, r = 3.6, cls = '', style }) => <circle className={`m-b ${cls}`} cx={x} cy={y} r={r} style={style} />
const O = ({ x, y, s = 6.4, cls = '', style }) => <rect className={`m-o ${cls}`} x={x - s / 2} y={y - s / 2} width={s} height={s} rx="1" style={style} />
const G = ({ x, y, s = 4.4, cls = '', style }) => (
  <path className={`m-g ${cls}`} d={`M${x} ${y - s} L${x + s} ${y + s * 0.8} L${x - s} ${y + s * 0.8} Z`} style={style} />
)
// Titik yang berubah dari abu-abu ke warna kelompoknya
const T = ({ x, y, c, delay = 0 }) => <circle className="m-tint" cx={x} cy={y} r="3.4" style={{ '--c': `var(--s${c})`, ...tint(delay) }} />

const LinearRegression = () => {
  const pts = [[18, 64], [36, 56], [50, 54], [68, 45], [86, 44], [104, 37], [122, 34], [140, 26], [160, 24], [180, 15]]
  return (
    <>
      <line className="m-axis" x1="8" y1="74" x2="194" y2="74" />
      <g className="m-lr">
        <line className="m-fit" x1="10" y1="40" x2="190" y2="40" />
      </g>
      {pts.map(([x, y]) => <B key={x} x={x} y={y} />)}
    </>
  )
}

const LogisticRegression = () => (
  <>
    <line className="m-axis" x1="8" y1="66" x2="194" y2="66" />
    <line className="m-axis dashed" x1="8" y1="14" x2="194" y2="14" />
    {[18, 34, 52, 70, 88].map((x) => <B key={x} x={x} y={66} />)}
    {[112, 130, 148, 166, 182].map((x) => <O key={x} x={x} y={14} />)}
    <path className="m-fit m-draw" pathLength="100" d="M8 64 C 70 64, 84 62, 100 40 S 130 16, 194 16" />
  </>
)

const Knn = () => (
  <>
    {[[42, 26], [58, 50], [68, 22], [80, 54], [34, 52], [54, 34]].map(([x, y]) => <B key={x} x={x} y={y} />)}
    {[[132, 26], [146, 50], [156, 22], [166, 44], [122, 60], [176, 30]].map(([x, y]) => <O key={x} x={x} y={y} />)}
    <circle className="m-ring m-grow" cx="90" cy="38" r="30" />
    <circle className="m-new" cx="90" cy="38" r="5" />
  </>
)

const NaiveBayes = () => (
  <>
    {['gratis', 'hadiah', 'klik!'].map((w, i) => (
      <g key={w} className="m-pop" style={p(i * 0.4)}>
        <rect className="m-chip" x={14 + i * 60} y="4" width="52" height="16" rx="8" />
        <text className="m-txt" x={40 + i * 60} y="15.5" textAnchor="middle">{w}</text>
      </g>
    ))}
    <text className="m-txt muted" x="12" y="43">spam</text>
    <text className="m-txt muted" x="12" y="67">aman</text>
    <rect className="m-track" x="50" y="34" width="140" height="12" rx="6" />
    <rect className="m-track" x="50" y="58" width="140" height="12" rx="6" />
    <rect className="m-bar-o m-growx" x="50" y="34" width="122" height="12" rx="6" style={gx(1.3)} />
    <rect className="m-bar-b m-growx" x="50" y="58" width="26" height="12" rx="6" style={gx(1.3)} />
  </>
)

const DecisionTree = () => (
  <>
    {[[100, 14, 56, 40], [100, 14, 144, 40], [56, 40, 30, 66], [56, 40, 82, 66], [144, 40, 124, 66], [144, 40, 170, 66]].map(([a, b, c, e], i) => (
      <line key={i} className="m-edge m-pop" x1={a} y1={b} x2={c} y2={e} style={p(i < 2 ? 0.3 : 0.9)} />
    ))}
    <rect className="m-node m-pop" x="84" y="6" width="32" height="16" rx="5" />
    <rect className="m-node m-pop" x="40" y="32" width="32" height="16" rx="5" style={p(0.6)} />
    <rect className="m-node m-pop" x="128" y="32" width="32" height="16" rx="5" style={p(0.6)} />
    <B x={30} y={68} r={6} cls="m-pop" style={p(1.2)} />
    <O x={82} y={68} s={11} cls="m-pop" style={p(1.3)} />
    <O x={124} y={68} s={11} cls="m-pop" style={p(1.4)} />
    <G x={170} y={68} s={6.5} cls="m-pop" style={p(1.5)} />
  </>
)

const MiniTree = ({ x, hasil, delay }) => (
  <g className="m-pop" style={p(delay)}>
    <line className="m-edge" x1={x} y1="14" x2={x - 12} y2="36" />
    <line className="m-edge" x1={x} y1="14" x2={x + 12} y2="36" />
    <circle className="m-node" cx={x} cy="14" r="6" />
    <circle className="m-node" cx={x - 12} cy="36" r="5" />
    <circle className="m-node" cx={x + 12} cy="36" r="5" />
    {hasil === 'b' ? <B x={x} y={62} r={5} /> : <O x={x} y={62} s={9} />}
  </g>
)
const RandomForest = () => (
  <>
    <MiniTree x={24} hasil="b" delay={0} />
    <MiniTree x={64} hasil="b" delay={0.3} />
    <MiniTree x={104} hasil="o" delay={0.6} />
    <path className="m-edge m-pop" d="M128 40 H 156" style={p(1.1)} />
    <path className="m-edge m-pop" d="M150 34 L 157 40 L 150 46" style={p(1.1)} />
    <B x={178} y={40} r={9} cls="m-pop" style={p(1.4)} />
    <text className="m-txt muted m-pop" x="178" y="70" textAnchor="middle" style={p(1.4)}>2 : 1</text>
  </>
)

const GradientBoosting = () => {
  const tinggi = [30, 44, 52, 56, 58]
  return (
    <>
      <line className="m-axis dashed" x1="8" y1="12" x2="160" y2="12" />
      <text className="m-txt muted" x="198" y="15" textAnchor="end">target</text>
      <line className="m-axis" x1="8" y1="74" x2="194" y2="74" />
      {tinggi.map((h, i) => {
        const lama = i ? tinggi[i - 1] : 0
        const x = 18 + i * 32
        return (
          <g key={i} className="m-pop" style={p(i * 0.4)}>
            <rect className="m-bar-b" x={x} y={74 - lama} width="20" height={lama} rx="2" />
            <rect className="m-bar-o" x={x} y={74 - h} width="20" height={h - lama} rx="2" />
          </g>
        )
      })}
    </>
  )
}

const Svm = () => (
  <>
    {[[30, 20], [44, 46], [58, 28], [36, 64], [70, 56], [74, 34]].map(([x, y]) => <B key={x} x={x} y={y} />)}
    {[[126, 46], [140, 20], [150, 60], [164, 36], [178, 52], [134, 70]].map(([x, y]) => <O key={x} x={x} y={y} />)}
    <g transform="rotate(14 100 40)">
      <line className="m-margin m-out-l" x1="100" y1="-10" x2="100" y2="90" />
      <line className="m-margin m-out-r" x1="100" y1="-10" x2="100" y2="90" />
      <line className="m-fit" x1="100" y1="-10" x2="100" y2="90" />
    </g>
  </>
)

const KMeans = () => {
  const kel = [
    { c: 1, cx: 40, cy: 26, pts: [[30, 18], [44, 16], [50, 30], [34, 34], [42, 26]] },
    { c: 2, cx: 150, cy: 22, pts: [[140, 14], [158, 16], [162, 28], [146, 30], [152, 22]] },
    { c: 3, cx: 98, cy: 60, pts: [[86, 56], [100, 52], [112, 62], [94, 68], [104, 64]] },
  ]
  const awal = [[60, 40], [-40, 30], [50, -30]]
  return (
    <>
      {kel.flatMap((k) => k.pts.map(([x, y], i) => <T key={`${k.c}-${i}`} x={x} y={y} c={k.c} delay={2.6} />))}
      {kel.map((k, i) => (
        <g key={k.c} className="m-move" style={{ '--fx': `${awal[i][0]}px`, '--fy': `${awal[i][1]}px` }}>
          <path className={`m-centroid c${k.c}`} d={`M${k.cx - 5} ${k.cy - 5} L${k.cx + 5} ${k.cy + 5} M${k.cx + 5} ${k.cy - 5} L${k.cx - 5} ${k.cy + 5}`} />
        </g>
      ))}
    </>
  )
}

const Dbscan = () => {
  const a = [[24, 20], [34, 28], [30, 40], [42, 44], [52, 36], [62, 46], [56, 58], [44, 60]]
  const b = [[126, 22], [138, 18], [150, 24], [160, 34], [168, 46], [158, 56], [146, 50]]
  return (
    <>
      <circle className="m-ring m-ripple" cx="34" cy="28" r="40" />
      <circle className="m-ring m-ripple" cx="138" cy="18" r="40" style={d(0.4)} />
      {a.map(([x, y], i) => <T key={`a${i}`} x={x} y={y} c={1} delay={i * 0.15} />)}
      {b.map(([x, y], i) => <T key={`b${i}`} x={x} y={y} c={2} delay={0.4 + i * 0.15} />)}
      <circle className="m-noise" cx="96" cy="16" r="3.4" />
      <circle className="m-noise" cx="100" cy="66" r="3.4" />
      <text className="m-txt muted" x="108" y="69">noise</text>
    </>
  )
}

const Pca = () => {
  const pts = [[40, 62], [52, 52], [60, 58], [70, 46], [80, 50], [90, 40], [100, 44], [112, 32], [120, 38], [132, 26], [144, 30], [156, 18], [164, 22]]
  return (
    <>
      {pts.map(([x, y]) => <B key={x} x={x} y={y} r={3.2} />)}
      <g className="m-rot" style={{ '--from': '35deg' }}>
        <line className="m-arrow" x1="102" y1="40" x2="170" y2="40" transform="rotate(-24 102 40)" />
        <line className="m-arrow thin" x1="102" y1="40" x2="102" y2="18" transform="rotate(-24 102 40)" />
      </g>
      <text className="m-txt muted" x="12" y="16">PC1 = arah sebaran terbesar</text>
    </>
  )
}

const Apriori = () => {
  const keranjang = ['🍞 🥛 🍌', '🍞 🥛 🧈', '🍳 🍞 🥛']
  return (
    <>
      {keranjang.map((isi, i) => (
        <g key={i}>
          <rect className="m-chip" x="8" y={4 + i * 25} width="96" height="21" rx="6" />
          <text className="m-emoji" x="16" y={19 + i * 25}>🛒 {isi}</text>
          <rect className="m-hl m-pop" x={i === 2 ? 56 : 40} y={6 + i * 25} width="34" height="17" rx="5" style={p(0.3 + i * 0.4)} />
        </g>
      ))}
      <g className="m-pop" style={p(1.6)}>
        <rect className="m-rule" x="118" y="24" width="76" height="30" rx="8" />
        <text className="m-emoji" x="156" y="44" textAnchor="middle">🍞 → 🥛</text>
      </g>
    </>
  )
}

const Mlp = () => {
  const lap = [[30, [20, 40, 60]], [82, [12, 32, 48, 68]], [134, [12, 32, 48, 68]], [180, [28, 52]]]
  const edges = []
  lap.slice(0, -1).forEach(([x, ys], i) => {
    const [x2, ys2] = lap[i + 1]
    ys.forEach((y) => ys2.forEach((y2) => edges.push([x, y, x2, y2, i])))
  })
  return (
    <>
      {edges.map(([a, b, c, e, i], k) => <line key={k} className="m-edge thin" x1={a} y1={b} x2={c} y2={e} />)}
      {edges.map(([a, b, c, e, i], k) => <line key={`f${k}`} className="m-flow" x1={a} y1={b} x2={c} y2={e} style={d(i * 0.5)} />)}
      {lap.map(([x, ys], i) => ys.map((y) => <circle key={`${x}-${y}`} className="m-neuron" cx={x} cy={y} r="5.5" style={d(i * 0.5)} />))}
    </>
  )
}

const Cnn = () => {
  const gelap = new Set(['1,0', '2,0', '1,1', '2,1', '3,1', '4,2', '2,2', '3,2', '1,3', '4,3'])
  return (
    <>
      {Array.from({ length: 24 }, (_, k) => {
        const c = k % 6, r = Math.floor(k / 6)
        return <rect key={k} className={gelap.has(`${c},${r}`) ? 'm-px on' : 'm-px'} x={14 + c * 12} y={16 + r * 12} width="12" height="12" />
      })}
      <g className="m-scan-y"><g className="m-scan-x"><rect className="m-kernel" x="14" y="16" width="24" height="24" rx="2" /></g></g>
      <path className="m-edge" d="M96 40 H 116 M110 34 L 117 40 L 110 46" />
      {Array.from({ length: 15 }, (_, k) => (
        <rect key={k} className="m-out m-pop" x={128 + (k % 5) * 12} y={22 + Math.floor(k / 5) * 12} width="11" height="11" rx="1.5"
          style={{ ...p(k * 0.3 + 0.4), '--fo': 0.35 + ((k * 7) % 5) * 0.15 }} />
      ))}
    </>
  )
}

const Rnn = () => {
  const kata = ['aku', 'suka', 'kopi', 'pagi']
  return (
    <>
      {kata.map((w, i) => {
        const x = 30 + i * 46
        return (
          <g key={w}>
            <rect className="m-chip" x={x - 19} y="54" width="38" height="18" rx="5" />
            <text className="m-txt" x={x} y="66.5" textAnchor="middle">{w}</text>
            <line className="m-edge" x1={x} y1="54" x2={x} y2="32" />
            <circle className="m-state" cx={x} cy="22" r="9" style={d(i * 0.55)} />
            {i < 3 && <path className="m-edge m-arrowhead" d={`M${x + 10} 22 H ${x + 35} M${x + 30} 18 L ${x + 36} 22 L ${x + 30} 26`} />}
          </g>
        )
      })}
    </>
  )
}

const Transformer = () => {
  const tok = [['kucing', 26], ['itu', 66], ['tidur', 102], ['karena', 142], ['ia', 178]]
  const bobot = [0.95, 0.25, 0.45, 0.15]
  return (
    <>
      {tok.map(([w, x], i) => (
        <g key={w}>
          <rect className={i === 4 ? 'm-chip active' : 'm-chip'} x={x - (w.length * 3 + 7)} y="56" width={w.length * 6 + 14} height="18" rx="5" />
          <text className="m-txt" x={x} y="68.5" textAnchor="middle">{w}</text>
        </g>
      ))}
      {tok.slice(0, 4).map(([, x], i) => (
        <path key={x} className="m-attn m-pulse" d={`M178 54 Q ${(178 + x) / 2} ${6 + i * 6} ${x} 54`}
          style={{ strokeWidth: 1 + bobot[i] * 4, '--o': bobot[i], ...d(i * 0.2) }} />
      ))}
    </>
  )
}

const AStar = () => {
  const dinding = ['4,0', '4,1', '4,2', '8,2', '8,3', '8,4']
  const dicek = ['1,4', '2,4', '1,3', '2,3', '3,3', '3,2', '3,1', '3,0', '2,2', '5,0', '6,0', '6,1', '7,1', '5,1']
  return (
    <>
      {Array.from({ length: 60 }, (_, k) => {
        const c = k % 12, r = Math.floor(k / 12)
        const key = `${c},${r}`
        const w = dinding.includes(key)
        const i = dicek.indexOf(key)
        return <rect key={k} className={w ? 'm-wall' : i >= 0 ? 'm-cell m-seen' : 'm-cell'} x={4 + c * 16} y={r * 16} width="15" height="15" rx="2"
          style={i >= 0 ? seen(i * 0.08) : undefined} />
      })}
      <path className="m-path m-draw" pathLength="100" d="M12 72 H 60 V 8 H 116 V 24 H 136 V 8 H 188" style={dr(1.2)} />
      <circle className="m-start" cx="12" cy="72" r="5" />
      <rect className="m-goal" x="181" y="1" width="14" height="14" rx="3" />
    </>
  )
}

const QLearning = () => {
  const panah = [[0, 2, '→'], [1, 2, '→'], [2, 2, '↑'], [2, 1, '→'], [3, 1, '→'], [4, 1, '↑'], [4, 0, '→']]
  return (
    <>
      {Array.from({ length: 18 }, (_, k) => {
        const c = k % 6, r = Math.floor(k / 6)
        return <rect key={k} className="m-cell" x={22 + c * 26} y={2 + r * 26} width="25" height="25" rx="3" />
      })}
      <rect className="m-pit" x="74" y="2" width="25" height="25" rx="3" />
      <text className="m-emoji" x="86.5" y="19.5" textAnchor="middle">⚡</text>
      <rect className="m-goal soft" x="152" y="2" width="25" height="25" rx="3" />
      <text className="m-emoji" x="164.5" y="19.5" textAnchor="middle">🏆</text>
      {panah.map(([c, r, a], i) => (
        <text key={i} className="m-txt m-q m-pop" x={34.5 + c * 26} y={19.5 + r * 26} textAnchor="middle" style={p(0.2 + i * 0.4)}>{a}</text>
      ))}
      <circle className="m-agent" r="6" style={{ offsetPath: "path('M34.5 66.5 H 86.5 V 40.5 H 138.5 V 14.5 H 164.5')" }} />
    </>
  )
}

const MINI = {
  'linear-regression': LinearRegression,
  'logistic-regression': LogisticRegression,
  knn: Knn,
  'naive-bayes': NaiveBayes,
  'decision-tree': DecisionTree,
  'random-forest': RandomForest,
  'gradient-boosting': GradientBoosting,
  svm: Svm,
  kmeans: KMeans,
  dbscan: Dbscan,
  pca: Pca,
  apriori: Apriori,
  mlp: Mlp,
  cnn: Cnn,
  rnn: Rnn,
  transformer: Transformer,
  'a-star': AStar,
  'q-learning': QLearning,
}

export default function MiniAnim({ id }) {
  const Isi = MINI[id]
  if (!Isi) return null
  return (
    <svg className="mini" viewBox="0 0 200 80" role="img" aria-hidden="true" focusable="false">
      <Isi />
    </svg>
  )
}
