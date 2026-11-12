import { useMemo, useState } from 'react'
import { proyek, caraDataset } from '../data/proyek.js'
import {
  alurDataset, sumberSiap, sumberIndonesia, kodeAmbil, caraBuat, kodeBuat, checklistDataset, formatSimpan,
} from '../data/dataset-guide.js'
import { roadmap } from '../roadmap.js'
import { levels } from '../data/levels.js'
import { algorithms } from '../data/algorithms.js'
import CodeRunner from '../components/KodeLazy.jsx'
import RichText from '../components/RichText.jsx'
import { Steps } from '../components/Guide.jsx'
import { LingkupIstilah } from '../components/Istilah.jsx'
import { catatProyek } from '../aktivitas.js'

// Status "sudah dikerjakan" disimpan terpisah dari progres roadmap, hanya di browser ini
const KUNCI = 'roadmap-ai-proyek-selesai'
const bacaSelesai = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KUNCI)) || []) } catch { return new Set() }
}
const simpanSelesai = (set) => {
  try { localStorage.setItem(KUNCI, JSON.stringify([...set])) } catch { /* penyimpanan diblokir: abaikan */ }
}

const tahapById = Object.fromEntries(roadmap.map((p) => [p.id, p]))
const algoById = Object.fromEntries(algorithms.map((a) => [a.id, a]))
// Urutan proyek mengikuti urutan tahap di roadmap
const urutTahap = Object.fromEntries(roadmap.map((p, i) => [p.id, i]))
const semua = proyek
  .map((p) => ({ ...p, phase: tahapById[p.tahap] }))
  .sort((a, b) => urutTahap[a.tahap] - urutTahap[b.tahap])
const byId = Object.fromEntries(semua.map((p) => [p.id, p]))

export const jumlahProyekTahap = (phaseId) => semua.filter((p) => p.tahap === phaseId).length

const CaraBadge = ({ cara }) => (
  <span className={`cara-badge cara-${cara}`}>{caraDataset[cara].icon} {caraDataset[cara].label}</span>
)
const LevelTag = ({ level }) => (
  <span className="tag level-tag" style={{ '--lvl': level.color }}>{level.icon} {level.name}</span>
)

export default function ProyekPage({ param, onOpenTopic }) {
  const [selesai, setSelesai] = useState(bacaSelesai)
  const toggle = (id) => {
    catatProyek(id, !selesai.has(id))  // 📊 statistik harian
    setSelesai((lama) => {
      const baru = new Set(lama)
      baru.has(id) ? baru.delete(id) : baru.add(id)
      simpanSelesai(baru)
      return baru
    })
  }

  const p = byId[param]
  return (
    <div className="page proyek">
      {!p && (
        <div className="page-head">
          <h2>🛠️ Bank Proyek</h2>
          <p className="muted">
            {semua.length} ide proyek dari level Pemula sampai Profesional. Setiap proyek menjelaskan
            <strong> dari mana datanya didapat</strong> atau <strong>bagaimana membuatnya sendiri</strong>.
          </p>
        </div>
      )}
      {!p && (
        <nav className="subtabs" aria-label="Bagian halaman proyek">
          <a href="#/proyek" className={param !== 'dataset' ? 'active' : ''}>🗂️ Daftar proyek</a>
          <a href="#/proyek/dataset" className={param === 'dataset' ? 'active' : ''}>📦 Cara mendapatkan dataset</a>
        </nav>
      )}
      {p ? (
        <ProyekDetail p={p} selesai={selesai.has(p.id)} onToggle={() => toggle(p.id)} onOpenTopic={onOpenTopic} />
      ) : param === 'dataset' ? (
        <PanduanDataset />
      ) : (
        <DaftarProyek tahapAwal={tahapById[param] ? param : null} selesai={selesai} />
      )}
    </div>
  )
}

function DaftarProyek({ tahapAwal, selesai }) {
  const [cari, setCari] = useState('')
  const [lvl, setLvl] = useState(tahapAwal ? tahapById[tahapAwal].level.id : 'semua')
  const [cara, setCara] = useState('semua')
  const [tahap, setTahap] = useState(tahapAwal)

  const daftar = useMemo(() => {
    const q = cari.trim().toLowerCase()
    return semua.filter((p) =>
      (!tahap || p.tahap === tahap) &&
      (lvl === 'semua' || p.phase.level.id === lvl) &&
      (cara === 'semua' || p.dataset.cara === cara) &&
      (!q || [p.judul, p.ringkas, p.dataset.nama, ...p.skill].join(' ').toLowerCase().includes(q)))
  }, [cari, lvl, cara, tahap])

  // Kelompokkan per tahap agar urutan belajar terlihat
  const kelompok = useMemo(() => {
    const m = new Map()
    for (const p of daftar) {
      if (!m.has(p.tahap)) m.set(p.tahap, [])
      m.get(p.tahap).push(p)
    }
    return [...m]
  }, [daftar])

  const nSelesai = semua.filter((p) => selesai.has(p.id)).length

  return (
    <>
      <div className="filters">
        <input type="search" placeholder="Cari proyek… (mis. cuaca, gambar, survei, SQL)" value={cari} onChange={(e) => setCari(e.target.value)} />
        <div className="chips">
          <button className={`chip ${lvl === 'semua' ? 'active' : ''}`} onClick={() => { setLvl('semua'); setTahap(null) }}>Semua level</button>
          {levels.map((l) => (
            <button key={l.id} className={`chip ${lvl === l.id ? 'active' : ''}`} onClick={() => { setLvl(l.id); setTahap(null) }}>
              {l.icon} {l.name}
            </button>
          ))}
        </div>
        <div className="chips">
          <span className="muted small">Data dari:</span>
          <button className={`chip ${cara === 'semua' ? 'active' : ''}`} onClick={() => setCara('semua')}>Semua</button>
          {Object.entries(caraDataset).map(([k, v]) => (
            <button key={k} className={`chip ${cara === k ? 'active' : ''}`} onClick={() => setCara(k)}>{v.icon} {v.label}</button>
          ))}
        </div>
        <p className="muted small proyek-info">
          {tahap && <>Tahap <strong>{tahapById[tahap].title}</strong> · <button className="link" onClick={() => setTahap(null)}>tampilkan semua tahap</button> · </>}
          Menampilkan {daftar.length} proyek · {nSelesai} sudah kamu kerjakan
        </p>
      </div>

      {daftar.length === 0 && <p className="muted">Tidak ada proyek yang cocok. Coba ubah filter.</p>}

      {kelompok.map(([tahapId, isi]) => {
        const ph = tahapById[tahapId]
        return (
          <section key={tahapId} className="proyek-grup" style={{ '--lvl': ph.level.color }}>
            <h3 className="proyek-grup-judul">
              <span className="proyek-grup-lvl">{ph.level.icon} {ph.level.name}</span> {ph.title}
            </h3>
            <div className="proyek-grid">
              {isi.map((p) => (
                <a key={p.id} href={`#/proyek/${p.id}`} className={`proyek-kartu ${selesai.has(p.id) ? 'selesai' : ''}`}>
                  <strong className="proyek-judul">{selesai.has(p.id) && <span className="proyek-cek" aria-label="sudah dikerjakan">✓</span>}{p.judul}</strong>
                  <span className="muted small">{p.ringkas}</span>
                  <span className="proyek-data small"><span className="muted">Data:</span> {p.dataset.nama.replace(/`/g, '')}</span>
                  <span className="proyek-meta">
                    <CaraBadge cara={p.dataset.cara} />
                    <span className="muted small">⏱ {p.durasi}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}

function KodeContoh({ kode, judul }) {
  return (
    <div className="proyek-kode">
      {judul && <span className="case-label">{judul}</span>}
      <CodeRunner code={kode.code} runnable={kode.runnable} note={kode.note} />
    </div>
  )
}

function Sumber({ sumber }) {
  if (!sumber?.length) return null
  return (
    <ul className="sumber-list">
      {sumber.map(([label, url]) => (
        <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>
      ))}
    </ul>
  )
}

function ProyekDetail({ p, selesai, onToggle, onOpenTopic }) {
  const satuTahap = semua.filter((x) => x.tahap === p.tahap)
  const i = semua.indexOf(p)
  const prev = semua[i - 1]
  const next = semua[i + 1]
  const metode = caraBuat.find((c) => c.cara === p.dataset.cara)

  const lainnya = satuTahap.filter((x) => x.id !== p.id)

  return (
    <>
      <a className="back" href="#/proyek">← Semua proyek</a>
      <article className="card proyek-detail" style={{ '--lvl': p.phase.level.color }}>
        <header className="proyek-hero">
          <span className="proyek-hero-tags">
            <LevelTag level={p.phase.level} />
            <span className="proyek-hero-tahap">Tahap {roadmap.indexOf(p.phase) + 1} · {p.phase.title}</span>
          </span>
          <h2>{p.judul}</h2>
          <p className="lead">{p.ringkas}</p>
        </header>

        <div className="proyek-body">
          {/* Kolom utama: data → langkah → hasil → tantangan */}
          <div className="proyek-main">
            <LingkupIstilah>
              <section className="proyek-sec">
                <h3 className="proyek-h">📦 Dataset</h3>
                <div className="dataset-box">
                  <div className="dataset-head">
                    <strong className="dataset-nama"><RichText text={p.dataset.nama} /></strong>
                    <CaraBadge cara={p.dataset.cara} />
                  </div>
                  <p className="dataset-petunjuk"><RichText text={p.dataset.petunjuk} /></p>
                  {p.dataset.sumber?.length > 0 && (
                    <div className="dataset-sumber">
                      <span className="case-label">Sumber</span>
                      <Sumber sumber={p.dataset.sumber} />
                    </div>
                  )}
                  {p.dataset.kode && <KodeContoh kode={p.dataset.kode} judul={p.dataset.kode.runnable ? 'Kode (bisa dijalankan)' : 'Contoh'} />}
                  {metode && (
                    <a className="dataset-more" href="#/proyek/dataset">
                      Panduan lengkap: {caraDataset[p.dataset.cara].icon} {metode.judul} →
                    </a>
                  )}
                </div>
              </section>

              <section className="proyek-sec">
                <h3 className="proyek-h">🧭 Langkah pengerjaan</h3>
                <ol className="step-list">
                  {p.langkah.map(([judul, isi], k) => (
                    <li key={k}>
                      <span className="step-num">{k + 1}</span>
                      <div>
                        <strong><RichText text={judul} /></strong>
                        <p className="muted"><RichText text={isi} /></p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </LingkupIstilah>

            <section className="proyek-sec">
              <h3 className="proyek-h">🎯 Hasil akhir</h3>
              <p className="proyek-hasil"><RichText text={p.hasil} /></p>
            </section>

            {p.tantangan?.length > 0 && (
              <section className="proyek-sec">
                <h3 className="proyek-h">🚀 Tantangan tambahan</h3>
                <ul className="check-list">{p.tantangan.map((t, k) => <li key={k}><RichText text={t} /></li>)}</ul>
              </section>
            )}
          </div>

          {/* Panel samping: ringkasan & aksi */}
          <aside className="proyek-side" aria-label="Ringkasan proyek">
            <dl className="proyek-info-list">
              <div><dt>Level</dt><dd>{p.phase.level.icon} {p.phase.level.name}</dd></div>
              <div><dt>Durasi</dt><dd>⏱ {p.durasi}</dd></div>
              <div><dt>Data</dt><dd>{caraDataset[p.dataset.cara].icon} {caraDataset[p.dataset.cara].label}</dd></div>
            </dl>
            <div className="proyek-side-sec">
              <span className="case-label">Keterampilan</span>
              <div className="chips">{p.skill.map((s) => <span key={s} className="chip static">{s}</span>)}</div>
            </div>
            <div className="proyek-side-sec">
              <span className="case-label">Bekal dari roadmap</span>
              <ul className="proyek-bekal">
                <li><button className="link" onClick={() => onOpenTopic(p.phase.id)}>{p.phase.level.icon} Tahap {p.phase.title} →</button></li>
                {p.algo?.map((id) => algoById[id] && (
                  <li key={id}><a href={`#/algoritma/${id}`}>🧠 {algoById[id].name} →</a></li>
                ))}
              </ul>
            </div>
            <label className={`proyek-selesai ${selesai ? 'on' : ''}`}>
              <input type="checkbox" checked={selesai} onChange={onToggle} />
              <span>{selesai ? 'Sudah dikerjakan ✓' : 'Tandai sudah dikerjakan'}</span>
            </label>
          </aside>
        </div>
      </article>

      {lainnya.length > 0 && (
        <section className="proyek-lain">
          <h3 className="proyek-h">Proyek lain di tahap {p.phase.title}</h3>
          <div className="proyek-lain-grid" style={{ '--lvl': p.phase.level.color }}>
            {lainnya.map((x) => (
              <a key={x.id} className="proyek-kartu kecil" href={`#/proyek/${x.id}`}>
                <strong className="proyek-judul">{x.judul}</strong>
                <span className="proyek-meta">
                  <CaraBadge cara={x.dataset.cara} />
                  <span className="muted small">⏱ {x.durasi}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="pager">
        {prev ? <a className="btn" href={`#/proyek/${prev.id}`}>← {prev.judul}</a> : <span />}
        {next && <a className="btn" href={`#/proyek/${next.id}`}>{next.judul} →</a>}
      </div>
    </>
  )
}

function PanduanDataset() {
  const proyekPerCara = (cara) => semua.filter((p) => p.dataset.cara === cara)
  return (
    <LingkupIstilah>
      <div className="card panduan-dataset">
        <Steps steps={alurDataset} title="🧭 Alur mencari dataset" />

        <section>
          <h4>📦 Sumber dataset siap pakai</h4>
          <div className="sumber-grid">
            {sumberSiap.map((s) => (
              <a key={s.nama} className="sumber-kartu" href={s.url} target="_blank" rel="noopener noreferrer">
                <span className="sumber-icon" aria-hidden>{s.icon}</span>
                <strong>{s.nama} ↗</strong>
                <span className="small">{s.cocok}</span>
                <span className="muted small"><RichText text={s.cara} /></span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h4>🇮🇩 Sumber data Indonesia</h4>
          <ul className="sumber-indo">
            {sumberIndonesia.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer"><strong>{s.nama} ↗</strong></a>
                <span className="muted small">{s.isi}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4>⬇️ Contoh kode mengambil dataset</h4>
          {kodeAmbil.map((k) => <KodeContoh key={k.judul} kode={k} judul={k.judul} />)}
        </section>

        <section>
          <h4>✍️ Kalau belum ada: buat datasetmu sendiri</h4>
          <div className="buat-grid">
            {caraBuat.map((c) => {
              const contoh = proyekPerCara(c.cara)
              return (
                <div key={c.cara} className="buat-kartu">
                  <h5>{caraDataset[c.cara].icon} {c.judul}</h5>
                  <p className="small"><strong>Kapan dipakai:</strong> <RichText text={c.kapan} /></p>
                  <ol className="small">{c.langkah.map((l, k) => <li key={k}><RichText text={l} /></li>)}</ol>
                  {c.alat && <p className="small muted"><strong>Alat:</strong> {c.alat.map((a, k) => <span key={k}>{k > 0 && ', '}<RichText text={a} /></span>)}</p>}
                  <div className="buat-awas small">
                    <strong>⚠️ Perhatikan</strong>
                    <ul>{c.awas.map((a, k) => <li key={k}><RichText text={a} /></li>)}</ul>
                  </div>
                  {contoh.length > 0 && (
                    <p className="small buat-contoh">
                      Contoh proyek: {contoh.slice(0, 3).map((p, k) => (
                        <span key={p.id}>{k > 0 && ' · '}<a href={`#/proyek/${p.id}`}>{p.judul}</a></span>
                      ))}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h4>🧪 Coba langsung: membuat & memeriksa dataset</h4>
          {kodeBuat.map((k) => <KodeContoh key={k.judul} kode={k} judul={k.judul} />)}
        </section>

        <section>
          <h4>✅ Checklist sebelum dataset dipakai</h4>
          <ol className="step-list">
            {checklistDataset.map(([judul, isi], k) => (
              <li key={k}>
                <span className="step-num">✓</span>
                <div>
                  <strong>{judul}</strong>
                  <p className="muted"><RichText text={isi} /></p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h4>💾 Format & tempat menyimpan</h4>
          <ul className="format-list">
            {formatSimpan.map(([judul, isi]) => (
              <li key={judul}><strong>{judul}</strong> <span className="muted"><RichText text={isi} /></span></li>
            ))}
          </ul>
        </section>
      </div>
    </LingkupIstilah>
  )
}
