import { frame, makeRng, normal, fmt, Label } from './kit.jsx'

// Warna nilai bertanda: positif biru (kelas 0), negatif oranye (kelas 1), ketebalan = besar
const tanda = (v) => (v >= 0 ? 0 : 1)

// ---------------------------------------------------------------- MLP: forward & backprop
export function mlp() {
  const x = [0.8, 0.3], target = 1
  let W1 = [[0.6, -0.9, 0.4], [-0.5, 0.7, 0.9]] // [input][hidden]
  let b1 = [0.1, 0.0, -0.2]
  let W2 = [0.7, -0.6, 0.3]
  let b2 = -0.1
  const sig = (z) => 1 / (1 + Math.exp(-z))
  const maju = () => {
    const z1 = [0, 1, 2].map((j) => x[0] * W1[0][j] + x[1] * W1[1][j] + b1[j])
    const h = z1.map((v) => Math.max(0, v))
    const z2 = h.reduce((s, v, j) => s + v * W2[j], b2)
    return { z1, h, z2, y: sig(z2), loss: -Math.log(sig(z2)) }
  }
  const pos = { in: [[70, 105], [70, 185]], hid: [[200, 70], [200, 145], [200, 220]], out: [[330, 145]] }
  const gambar = ({ nilai = {}, sorot = '', grad = null, w1 = W1, w2 = W2, flow = '' }) => (
    <>
      <Label x={70} y={30} anchor="middle" cls="an-muted">input</Label>
      <Label x={200} y={30} anchor="middle" cls="an-muted">tersembunyi (ReLU)</Label>
      <Label x={330} y={30} anchor="middle" cls="an-muted">output (sigmoid)</Label>
      {pos.in.map((a, i) => pos.hid.map((b, j) => (
        <line key={`a${i}${j}`} className={`an-edge an-stroke${tanda(w1[i][j])} ${flow === 'maju1' ? 'an-flow' : ''} ${flow === 'mundur1' ? 'an-flow an-flow-back' : ''}`}
          x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth={1 + Math.abs(w1[i][j]) * 4} />
      )))}
      {pos.hid.map((a, j) => (
        <line key={`b${j}`} className={`an-edge an-stroke${tanda(w2[j])} ${flow === 'maju2' ? 'an-flow' : ''} ${flow === 'mundur2' ? 'an-flow an-flow-back' : ''}`}
          x1={a[0]} y1={a[1]} x2={pos.out[0][0]} y2={pos.out[0][1]} strokeWidth={1 + Math.abs(w2[j]) * 4} />
      ))}
      {grad && pos.hid.map((a, j) => (
        <Label key={`g${j}`} x={(a[0] + 330) / 2 + 6} y={(a[1] + 145) / 2 - 4} cls="an-small an-grad">∂={fmt(grad[j])}</Label>
      ))}
      {[...pos.in.map((p, i) => ['in', i, p]), ...pos.hid.map((p, i) => ['hid', i, p]), ...pos.out.map((p, i) => ['out', i, p])].map(([k, i, [cx, cy]]) => (
        <g key={`${k}${i}`}>
          <circle className={`an-node ${sorot === k ? 'an-node-on' : ''}`} cx={cx} cy={cy} r="21" />
          <text className="an-node-text" x={cx} y={cy + 4} textAnchor="middle">{nilai[k]?.[i] ?? ''}</text>
        </g>
      ))}
    </>
  )
  const f = maju()
  const awal = { y: f.y, loss: f.loss }
  // gradien (cross-entropy + sigmoid → dL/dz2 = y - target)
  const dz2 = f.y - target
  const gW2 = f.h.map((v) => dz2 * v)
  const dz1 = [0, 1, 2].map((j) => (f.z1[j] > 0 ? dz2 * W2[j] : 0))
  const lr = 1
  const W1lama = W1.map((r) => [...r]), W2lama = [...W2]
  const update = () => {
    const g = maju(), d2 = g.y - target
    const d1 = [0, 1, 2].map((j) => (g.z1[j] > 0 ? d2 * W2[j] : 0))
    W2 = W2.map((w, j) => w - lr * d2 * g.h[j]); b2 -= lr * d2
    W1 = W1.map((row, i) => row.map((w, j) => w - lr * d1[j] * x[i])); b1 = b1.map((b, j) => b - lr * d1[j])
  }
  update()
  const satu = maju()
  for (let i = 0; i < 8; i++) update()
  const akhir = maju()
  const v = (arr) => arr.map((a) => fmt(a))
  return {
    legend: [{ c: 0, label: 'bobot positif' }, { c: 1, label: 'bobot negatif' }, { node: true, label: 'neuron (isi = nilainya)' }],
    frames: [
      frame('Neural network kecil: **2 input → 3 neuron tersembunyi → 1 output**. Setiap garis adalah **bobot**: biru positif, oranye negatif, makin tebal makin besar.', gambar({})),
      frame(`Masukkan satu data: x₁ = ${fmt(x[0], 1)}, x₂ = ${fmt(x[1], 1)} (mis. jam belajar & tidur, sudah dinormalisasi). Targetnya: **1** (lulus).`,
        gambar({ nilai: { in: v(x) }, sorot: 'in' })),
      frame(`**Forward pass**: setiap neuron menjumlahkan input × bobot + bias. Hasil z = ${v(f.z1).join(' ; ')}.`,
        gambar({ nilai: { in: v(x), hid: v(f.z1) }, sorot: 'hid', flow: 'maju1' })),
      frame('Fungsi aktivasi **ReLU**: nilai negatif dijadikan 0, positif dibiarkan. Inilah yang membuat jaringan bisa mempelajari pola tidak lurus.',
        gambar({ nilai: { in: v(x), hid: v(f.h) }, sorot: 'hid' })),
      frame(`Output = sigmoid(Σ h × bobot + bias) = **${fmt(f.y)}** → model baru ${Math.round(f.y * 100)}% yakin "lulus".`,
        gambar({ nilai: { in: v(x), hid: v(f.h), out: [fmt(f.y)] }, sorot: 'out', flow: 'maju2' })),
      frame(`Bandingkan dengan target 1 → **loss** (cross-entropy) = ${fmt(awal.loss)}. Makin jauh dari target, makin besar loss.`,
        gambar({ nilai: { in: v(x), hid: v(f.h), out: [fmt(f.y)] }, sorot: 'out' })),
      frame(`**Backpropagation** dimulai dari belakang: seberapa besar tiap bobot output "ikut bersalah"? Gradien (∂) negatif → bobot perlu **dinaikkan**.`,
        gambar({ nilai: { in: v(x), hid: v(f.h), out: [fmt(f.y)] }, grad: gW2, flow: 'mundur2' })),
      frame(`Gradien diteruskan ke layer sebelumnya dengan **aturan rantai**: ∂ untuk neuron tersembunyi = ${v(dz1).join(' ; ')} (neuron yang ReLU-nya 0 tidak ikut disalahkan).`,
        gambar({ nilai: { in: v(x), hid: v(dz1), out: [fmt(f.y)] }, sorot: 'hid', flow: 'mundur1' })),
      frame(`Semua bobot diperbarui sedikit **berlawanan arah gradien** (learning rate ${lr}). Perhatikan ketebalan garis berubah. Output baru: ${fmt(f.y)} → **${fmt(satu.y)}**.`,
        gambar({ nilai: { in: v(x), out: [fmt(satu.y)] }, sorot: 'out', w1: W1lama.map((r, i) => r.map((_, j) => W1lama[i][j] - lr * dz1[j] * x[i])), w2: W2lama.map((w, j) => w - lr * gW2[j]) })),
      frame(`Ulangi forward → loss → backward → update berkali-kali. Setelah 8 langkah lagi: output **${fmt(akhir.y)}**, loss ${fmt(awal.loss)} → **${fmt(akhir.loss)}**. Itulah "belajar".`,
        gambar({ nilai: { in: v(x), hid: v(akhir.h), out: [fmt(akhir.y)] }, sorot: 'out' })),
    ],
  }
}

// ---------------------------------------------------------------- CNN: filter konvolusi bergeser
export function cnn() {
  const img = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]
  const K = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]
  const out = Array.from({ length: 4 }, (_, i) => Array.from({ length: 4 }, (_, j) => {
    let s = 0
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += img[i + a][j + b] * K[a][b]
    return s
  }))
  const C = 28, IX = 14, IY = 60, KX = 196, KY = 92, OX = 290, OY = 74, OC = 24
  const maksAbs = 3
  const gridGambar = (win) => (
    <g>
      <Label x={IX + 3 * C} y={IY - 12} anchor="middle" cls="an-muted">gambar 6×6 (1 = putih)</Label>
      {img.map((row, i) => row.map((v, j) => (
        <g key={`${i}${j}`}>
          <rect className={v ? 'an-px-on' : 'an-px-off'} x={IX + j * C} y={IY + i * C} width={C - 2} height={C - 2} rx="3" />
          <text className="an-cell-text" x={IX + j * C + C / 2 - 1} y={IY + i * C + C / 2 + 3} textAnchor="middle">{v}</text>
        </g>
      )))}
      {win && <rect className="an-window" x={IX + win[1] * C - 2} y={IY + win[0] * C - 2} width={3 * C + 2} height={3 * C + 2} rx="5" />}
    </g>
  )
  const gridFilter = (
    <g>
      <Label x={KX + 36} y={KY - 12} anchor="middle" cls="an-muted">filter 3×3</Label>
      {K.map((row, i) => row.map((v, j) => (
        <g key={`${i}${j}`}>
          <rect className={v === 0 ? 'an-px-mid' : `an-fill${tanda(v)}`} opacity={v === 0 ? 1 : 0.55} x={KX + j * 24} y={KY + i * 24} width="22" height="22" rx="3" />
          <text className="an-cell-text" x={KX + j * 24 + 11} y={KY + i * 24 + 15} textAnchor="middle">{v}</text>
        </g>
      )))}
      <Label x={KX + 36} y={KY + 92} anchor="middle" cls="an-small an-muted">pendeteksi tepi tegak</Label>
    </g>
  )
  const peta = (sampai, map = out, judul = 'feature map 4×4') => (
    <g>
      <Label x={OX + 2 * OC} y={OY - 12} anchor="middle" cls="an-muted">{judul}</Label>
      {map.map((row, i) => row.map((v, j) => {
        const n = i * map.length + j
        const isi = n < sampai
        return (
          <g key={`${i}${j}`}>
            <rect className={isi && v !== 0 ? `an-fill${tanda(v)}` : 'an-px-mid'} opacity={isi && v !== 0 ? 0.25 + 0.6 * Math.min(1, Math.abs(v) / maksAbs) : 1}
              x={OX + j * OC} y={OY + i * OC} width={OC - 2} height={OC - 2} rx="3" />
            {isi && <text className="an-cell-text" x={OX + j * OC + OC / 2 - 1} y={OY + i * OC + OC / 2 + 3} textAnchor="middle">{v}</text>}
          </g>
        )
      }))}
    </g>
  )
  const frames = [
    frame('Gambar kecil berisi **garis tegak putih**, dan sebuah **filter** 3×3. Angka di filter adalah bobot yang (pada CNN sungguhan) dipelajari saat training.',
      <>{gridGambar()}{gridFilter}{peta(0)}</>),
  ]
  for (let n = 0; n < 16; n++) {
    const i = Math.floor(n / 4), j = n % 4
    const detail = [0, 1, 2].map((a) => [0, 1, 2].map((b) => img[i + a][j + b] * K[a][b]).reduce((s, v) => s + v, 0))
    frames.push(frame(
      n === 0
        ? `Filter ditempel di pojok kiri atas. Kalikan setiap piksel dengan bobot filter di posisi yang sama, lalu **jumlahkan**: ${out[0][0]}.`
        : `Geser filter (posisi ${n + 1}/16). Jumlah perkalian = ${detail.join(' + ')} = **${out[i][j]}**. ${out[i][j] > 0 ? 'Positif: ada tepi gelap→terang.' : out[i][j] < 0 ? 'Negatif: tepi terang→gelap.' : 'Nol: tidak ada tepi tegak di sini.'}`,
      <>{gridGambar([i, j])}{gridFilter}{peta(n + 1)}</>,
      n < 3 ? 1800 : 700,
    ))
  }
  const relu = out.map((r) => r.map((v) => Math.max(0, v)))
  const pool = [[0, 1], [0, 1]].map((_, a) => [0, 1].map((b) => Math.max(relu[2 * a][2 * b], relu[2 * a][2 * b + 1], relu[2 * a + 1][2 * b], relu[2 * a + 1][2 * b + 1])))
  frames.push(frame('Hasilnya **feature map**: nilai besar tepat di tepi kiri garis. Satu filter = satu "pendeteksi pola". CNN sungguhan memakai puluhan sampai ratusan filter sekaligus.',
    <>{gridGambar()}{gridFilter}{peta(16)}</>))
  frames.push(frame('**ReLU**: nilai negatif dibuang (jadi 0). Tinggal sinyal "ada tepi kiri".',
    <>{gridGambar()}{gridFilter}{peta(16, relu, 'setelah ReLU')}</>))
  frames.push(frame('**Max pooling 2×2**: ambil nilai terbesar di setiap blok 2×2 → ukuran mengecil, pola tetap terdeteksi walau bergeser sedikit. Layer berikutnya mendeteksi pola yang lebih rumit dari pola-pola ini.',
    <>{gridGambar()}{gridFilter}{peta(4, pool, 'setelah max pooling 2×2')}</>))
  return { legend: [{ c: 0, label: 'nilai positif' }, { c: 1, label: 'nilai negatif' }], frames }
}

// ---------------------------------------------------------------- RNN: memori dibawa dari kata ke kata
export function rnn() {
  const r = makeRng(23)
  const kata = ['saya', 'minum', 'kopi', 'pagi']
  const emb = kata.map(() => [normal(r), normal(r), normal(r)].map((v) => v * 0.8))
  const Wx = Array.from({ length: 4 }, () => [normal(r), normal(r), normal(r)].map((v) => v * 0.6))
  const U = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => normal(r) * 0.5))
  const hs = [[0, 0, 0, 0]]
  for (let t = 0; t < kata.length; t++) {
    const prev = hs[hs.length - 1]
    hs.push([0, 1, 2, 3].map((i) => Math.tanh(Wx[i].reduce((s, w, k) => s + w * emb[t][k], 0) + U[i].reduce((s, u, k) => s + u * prev[k], 0))))
  }
  const X0 = 60, DX = 90, HY = 70, TY = 230
  const gambar = (t) => (
    <>
      <Label x={10} y={HY - 22} cls="an-muted">memori (hidden state)</Label>
      {kata.map((w, i) => {
        const x = X0 + i * DX
        const aktif = i < t
        return (
          <g key={w} opacity={aktif ? 1 : 0.3}>
            <rect className={i === t - 1 ? 'an-token an-token-on' : 'an-token'} x={x - 30} y={TY - 18} width="60" height="26" rx="6" />
            <text className="an-node-text" x={x} y={TY} textAnchor="middle">{w}</text>
            <line className={`an-edge ${i === t - 1 ? 'an-flow' : ''}`} x1={x} y1={TY - 20} x2={x} y2={HY + 108} />
            {hs[i + 1].map((v, k) => (
              <g key={k}>
                <rect className={aktif ? `an-fill${tanda(v)}` : 'an-px-mid'} opacity={aktif ? 0.2 + 0.75 * Math.abs(v) : 1}
                  x={x - 22} y={HY + k * 26} width="44" height="24" rx="4" />
                {aktif && <text className="an-cell-text" x={x} y={HY + k * 26 + 16} textAnchor="middle">{fmt(v)}</text>}
              </g>
            ))}
            {i > 0 && <line className={`an-edge an-arrowline ${i === t - 1 ? 'an-flow' : ''}`} x1={x - DX + 24} y1={HY + 52} x2={x - 26} y2={HY + 52} />}
          </g>
        )
      })}
    </>
  )
  const frames = [
    frame('Kalimat dibaca **satu kata per langkah**. Kotak berwarna di atas setiap kata adalah **memori** (hidden state) berisi 4 angka.', gambar(0)),
  ]
  kata.forEach((w, t) => {
    frames.push(frame(
      t === 0
        ? `Langkah 1: baca "**${w}**". Memori dihitung dari kata ini saja: h₁ = tanh(W·x₁ + U·h₀), dengan h₀ = semua nol.`
        : `Langkah ${t + 1}: baca "**${w}**". Memori baru dihitung dari kata ini **dan memori sebelumnya** (garis penghubung dari kiri): h${t + 1} = tanh(W·x${t + 1} + U·h${t}).`,
      gambar(t + 1),
    ))
  })
  frames.push(frame('Memori terakhir **merangkum seluruh kalimat** dan dipakai untuk prediksi: kata berikutnya, sentimen, dsb. Kelemahannya: informasi kata awal makin pudar pada kalimat panjang → diatasi **LSTM/GRU**, lalu **Transformer**.', gambar(4)))
  return { legend: [{ c: 0, label: 'nilai positif' }, { c: 1, label: 'nilai negatif' }], frames }
}

// ---------------------------------------------------------------- Transformer: self-attention
export function transformer() {
  const kata = ['kucing', 'itu', 'tidur', 'karena', 'ia', 'lelah']
  // Bobot attention ilustratif (setiap baris berjumlah 1), meniru pola yang dipelajari model terlatih
  const A = [
    [0.55, 0.20, 0.12, 0.03, 0.05, 0.05],
    [0.62, 0.25, 0.05, 0.02, 0.03, 0.03],
    [0.38, 0.07, 0.35, 0.08, 0.06, 0.06],
    [0.06, 0.03, 0.40, 0.25, 0.08, 0.18],
    [0.62, 0.08, 0.10, 0.05, 0.10, 0.05],
    [0.20, 0.03, 0.17, 0.10, 0.30, 0.20],
  ]
  const penjelasan = [
    '"kucing" paling memperhatikan dirinya sendiri dan "itu" (kata yang menerangkannya).',
    '"itu" melihat ke "kucing": ia penunjuk untuk kata benda tersebut.',
    '"tidur" memperhatikan **siapa** yang tidur: "kucing".',
    '"karena" menghubungkan dua kejadian: "tidur" dan "lelah".',
    '"ia" paling memperhatikan "**kucing**" (0,62): model memahami bahwa "ia" merujuk ke kucing.',
    '"lelah" memperhatikan "ia" dan "kucing": siapa yang lelah.',
  ]
  const xs = kata.map((_, i) => 40 + i * 64)
  const YQ = 60, YK = 200
  const gambar = (q) => (
    <>
      <Label x={10} y={30} cls="an-muted">kata yang "bertanya" (query)</Label>
      <Label x={10} y={252} cls="an-muted">semua kata yang bisa diperhatikan (key → value)</Label>
      {q != null && kata.map((_, k) => (
        <g key={k}>
          <line className="an-attn" x1={xs[q]} y1={YQ + 14} x2={xs[k]} y2={YK - 16} strokeWidth={1 + A[q][k] * 16} opacity={0.25 + A[q][k]} />
          <Label x={(xs[q] + xs[k]) / 2 + (k === q ? 8 : 0)} y={(YQ + YK) / 2 + (k - q) * 3} anchor="middle" cls="an-small">{fmt(A[q][k])}</Label>
        </g>
      ))}
      {kata.map((w, i) => (
        <g key={w}>
          <rect className={q === i ? 'an-token an-token-on' : 'an-token'} x={xs[i] - 30} y={YQ - 14} width="60" height="26" rx="6" />
          <text className="an-node-text" x={xs[i]} y={YQ + 4} textAnchor="middle">{w}</text>
          <rect className="an-token" x={xs[i] - 30} y={YK - 14} width="60" height="26" rx="6" opacity={q == null ? 1 : 0.4 + A[q][i]} />
          <text className="an-node-text" x={xs[i]} y={YK + 4} textAnchor="middle">{w}</text>
        </g>
      ))}
    </>
  )
  const CELL = 30, MX = 130, MY = 52
  const matriks = (
    <>
      <Label x={MX + 3 * CELL} y={30} anchor="middle" cls="an-muted">matriks attention (baris = query)</Label>
      {kata.map((w, i) => (
        <g key={w}>
          <Label x={MX - 6} y={MY + i * CELL + 19} anchor="end" cls="an-small">{w}</Label>
          <text className="an-small an-text" x={MX + i * CELL + CELL / 2} y={MY + 6 * CELL + 14} textAnchor="end" transform={`rotate(-40 ${MX + i * CELL + CELL / 2} ${MY + 6 * CELL + 14})`}>{w}</text>
          {kata.map((_, k) => (
            <g key={k}>
              <rect className="an-fill0" x={MX + k * CELL} y={MY + i * CELL} width={CELL - 2} height={CELL - 2} rx="3" opacity={0.08 + A[i][k] * 1.3} />
              <text className="an-cell-text an-small" x={MX + k * CELL + CELL / 2 - 1} y={MY + i * CELL + 19} textAnchor="middle">{Math.round(A[i][k] * 100)}</text>
            </g>
          ))}
        </g>
      ))}
    </>
  )
  return {
    legend: [{ attn: true, label: 'tebal garis = besar perhatian' }],
    frames: [
      frame('Kalimat: "kucing itu tidur karena **ia** lelah". Untuk memahami "ia", model perlu tahu "ia" merujuk ke apa. **Self-attention** membiarkan setiap kata melihat semua kata lain.', gambar(null)),
      ...kata.map((w, i) => frame(`Query "**${w}**" membandingkan dirinya dengan semua kata (skor Q·K, lalu softmax → total 1). ${penjelasan[i]}`, gambar(i), 2200)),
      frame('Semua sekaligus = **matriks attention** (angka dalam %). Dihitung **paralel** untuk semua kata, bukan satu per satu seperti RNN: itulah kenapa Transformer cepat dilatih di GPU dan menjadi dasar LLM.', matriks),
    ],
  }
}
