// Perkakas bersama untuk animasi algoritma (SVG).
// Koordinat data: x 0..10, y 0..YMAX, dengan skala sama di kedua sumbu (1 satuan = 36 px).

export const W = 400
export const H = 280
const X0 = 20, X1 = 380, Y0 = 260, Y1 = 20
export const XMAX = 10
export const YMAX = ((Y0 - Y1) / (X1 - X0)) * XMAX // 6.667
export const PX = (X1 - X0) / XMAX
export const sx = (x) => X0 + (x / XMAX) * (X1 - X0)
export const sy = (y) => Y0 - (y / YMAX) * (Y0 - Y1)

// Satu frame animasi: keterangan + isi SVG
export const frame = (caption, el, ms) => ({ caption, el, ms })

// Angka acak yang bisa diulang (seed tetap → animasi selalu sama)
export function makeRng(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13; s >>>= 0
    s ^= s >>> 17
    s ^= s << 5; s >>>= 0
    return s / 4294967296
  }
}
export function normal(r) {
  let u = 0
  while (!u) u = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r())
}
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
export function blob(r, n, cx, cy, sd, c) {
  return Array.from({ length: n }, () => ({
    x: clamp(cx + normal(r) * sd, 0.3, XMAX - 0.3),
    y: clamp(cy + normal(r) * sd, 0.3, YMAX - 0.3),
    c,
  }))
}
export const fmt = (v, d = 2) => Number(v).toFixed(d).replace('.', ',')
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// Garis a·x + b·y + c = 0 yang dipotong ke kotak plot → [[x, y], [x, y]] atau null
export function lineInBox(a, b, c) {
  const pts = []
  const add = (x, y) => {
    if (x >= -1e-9 && x <= XMAX + 1e-9 && y >= -1e-9 && y <= YMAX + 1e-9 &&
        !pts.some((p) => Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6)) pts.push([x, y])
  }
  if (Math.abs(b) > 1e-12) { add(0, -c / b); add(XMAX, -(a * XMAX + c) / b) }
  if (Math.abs(a) > 1e-12) { add(-c / a, 0); add(-(b * YMAX + c) / a, YMAX) }
  return pts.length >= 2 ? pts.slice(0, 2) : null
}

// ---------- Elemen gambar ----------
export function Grid() {
  return (
    <g className="an-grid">
      {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={sx(i)} x2={sx(i)} y1={sy(0)} y2={sy(YMAX)} />)}
      {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={sx(0)} x2={sx(XMAX)} y1={sy(i)} y2={sy(i)} />)}
      <rect className="an-frame" x={sx(0)} y={sy(YMAX)} width={sx(XMAX) - sx(0)} height={sy(0) - sy(YMAX)} />
    </g>
  )
}

// Titik data: kelas 0 = lingkaran, 1 = kotak, 2 = segitiga, null = abu-abu (belum berlabel)
export function Mark({ p, r = 5, faded = false, ring = false, cls }) {
  const x = sx(p.x), y = sy(p.y)
  const c = cls ?? p.c
  const kelas = c == null ? 'an-cn' : `an-c${c}`
  const op = faded ? 0.22 : 1
  let shape
  if (c === 1) shape = <rect className={`an-mark ${kelas}`} x={x - r} y={y - r} width={2 * r} height={2 * r} rx="1.5" opacity={op} />
  else if (c === 2) shape = <polygon className={`an-mark ${kelas}`} points={`${x},${y - r * 1.25} ${x + r * 1.15},${y + r * 0.8} ${x - r * 1.15},${y + r * 0.8}`} opacity={op} />
  else shape = <circle className={`an-mark an-move ${kelas}`} cx={x} cy={y} r={r} opacity={op} />
  return (
    <g>
      {ring && <circle className="an-ring" cx={x} cy={y} r={r + 4} />}
      {shape}
    </g>
  )
}

export function Marks({ pts, ...rest }) {
  return <g>{pts.map((p, i) => <Mark key={i} p={p} {...rest} />)}</g>
}

export function Seg({ a, b, cls = 'an-line' }) {
  return <line className={cls} x1={sx(a[0])} y1={sy(a[1])} x2={sx(b[0])} y2={sy(b[1])} />
}

export function Line({ a, b, c, cls = 'an-line' }) {
  const s = lineInBox(a, b, c)
  return s ? <Seg a={s[0]} b={s[1]} cls={cls} /> : null
}

// Teks dengan "halo" agar tetap terbaca di atas titik dan garis
export function Label({ x, y, children, anchor = 'start', cls = '' }) {
  return <text className={`an-text ${cls}`} x={x} y={y} textAnchor={anchor}>{children}</text>
}

export function Star({ x, y, r = 9, cls = 'an-cn' }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 ? r * 0.45 : r
    return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`
  }).join(' ')
  return <polygon className={`an-mark ${cls}`} points={pts} />
}

// Bayangan wilayah keputusan: fn(x, y) → { c, a } (kelas & ketebalan 0..1)
export function Heat({ fn, nx = 40 }) {
  const step = XMAX / nx
  const ny = Math.round(YMAX / step)
  const cells = []
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const v = fn((i + 0.5) * step, (j + 0.5) * step)
      if (!v || v.a <= 0.01) continue
      cells.push(
        <rect key={`${i}-${j}`} className={`an-fill${v.c}`} x={sx(i * step)} y={sy((j + 1) * step)}
          width={step * PX} height={step * PX} opacity={0.32 * v.a} shapeRendering="crispEdges" />,
      )
    }
  }
  return <g>{cells}</g>
}

export function Box({ box, c, a = 1 }) {
  const [x0, y0, x1, y1] = box
  return <rect className={`an-fill${c}`} x={sx(x0)} y={sy(y1)} width={(x1 - x0) * PX} height={(y1 - y0) * PX} opacity={0.2 * a} />
}
