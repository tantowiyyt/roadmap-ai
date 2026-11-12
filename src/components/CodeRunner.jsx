import { useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { keymap, EditorView } from '@codemirror/view'
import { Prec } from '@codemirror/state'
import { preloadPython, runPython, stopPython } from '../python/runner.js'
import { catatKode } from '../aktivitas.js'
import { temaEditor } from './editorTheme.js'

// Ikon tab berdasarkan nama file
function ikonFile(nama) {
  if (nama.endsWith('.py')) return '🐍'
  if (nama === 'terminal') return '⌨️'
  if (nama.endsWith('.md')) return '📝'
  if (nama.endsWith('.json')) return '🗂️'
  if (nama.endsWith('.csv')) return '📄'
  if (nama === 'Dockerfile') return '🐳'
  return '📄'
}

// Nama "file" untuk tab editor: dari prop `file`, atau ditebak dari isi kodenya.
// Pewarnaan Python hanya dipakai untuk file .py.
function namaFile(code, runnable, paksa) {
  if (paksa) return { nama: paksa, ikon: ikonFile(paksa) }
  if (runnable) return { nama: 'main.py', ikon: '🐍' }
  const awal = code.trimStart()
  if (/^(pip|kaggle|python|git|npm|docker|curl|uvicorn|streamlit|\$)\b/m.test(awal.split('\n')[0])) return { nama: 'terminal', ikon: '⌨️' }
  if (/^[[{]/.test(awal)) return { nama: 'data.json', ikon: '🗂️' }
  if (/^[\w ]+(,[\w ]+){2,}\n/.test(awal) && !/[()=]/.test(awal.split('\n')[0])) return { nama: 'data.csv', ikon: '📄' }
  if (/^[\w-]+\/\s*\n/.test(awal)) return { nama: 'struktur folder', ikon: '📁' }
  if (/^FROM /m.test(awal)) return { nama: 'Dockerfile', ikon: '🐳' }
  return { nama: 'contoh.py', ikon: '🐍' }
}

const formatDetik = (ms) => (ms < 1000 ? `${Math.round(ms)} md` : `${(ms / 1000).toFixed(1).replace('.', ',')} dtk`)
const PAKAI_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/**
 * Editor Python yang bisa dijalankan di browser.
 * runnable=false → kode hanya ditampilkan (untuk kode yang butuh komputer sendiri/Colab).
 */
export default function CodeRunner({ code: initialCode, runnable = true, note, minHeight, onCodeChange, file: paksaFile }) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState([])
  const [images, setImages] = useState([])
  const [status, setStatus] = useState('')
  const [running, setRunning] = useState(false)
  const [hasil, setHasil] = useState(null) // { ok, ms } setelah selesai dijalankan
  const [stdin, setStdin] = useState('')
  const [copied, setCopied] = useState(false)
  const usesInput = /\binput\s*\(/.test(code)
  const file = namaFile(initialCode, runnable, paksaFile)
  const isPython = file.nama.endsWith('.py')

  useEffect(() => setCode(initialCode), [initialCode])
  useEffect(() => {
    if (runnable) preloadPython()
  }, [runnable])

  const run = async () => {
    if (running) return
    setRunning(true)
    setOutput([])
    setImages([])
    setHasil(null)
    setStatus('Menyiapkan Python… (pertama kali butuh beberapa detik)')
    const mulai = performance.now()
    const lines = []
    const result = await runPython(code, stdin, (ev) => {
      if (ev.type === 'status') setStatus(ev.text)
      else {
        lines.push({ type: ev.type, text: ev.text })
        setOutput([...lines])
      }
    })
    if (result.error) lines.push({ type: 'stderr', text: result.error })
    if (!lines.length && !result.images.length) lines.push({ type: 'info', text: '(Selesai tanpa output. Gunakan print() untuk menampilkan hasil.)' })
    setOutput([...lines])
    setImages(result.images)
    setHasil({ ok: !result.error, ms: performance.now() - mulai })
    catatKode()  // 📊 statistik harian
    setStatus('')
    setRunning(false)
  }

  // Ctrl/Cmd+Enter menjalankan kode; pakai ref agar extension tidak dibuat ulang setiap render
  const runRef = useRef(run)
  runRef.current = run
  const extensions = useMemo(
    () => [python(), temaEditor, Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => (runRef.current(), true) }]))],
    [],
  )
  const extensionsBaca = useMemo(() => [...(isPython ? [python()] : []), temaEditor, EditorView.editable.of(false)], [isPython])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard tidak tersedia
    }
  }
  const reset = () => { setCode(initialCode); onCodeChange?.(initialCode); setOutput([]); setImages([]); setHasil(null) }
  const bersihkan = () => { setOutput([]); setImages([]); setHasil(null) }

  const kepala = (
    <div className="runner-head">
      <span className="runner-dots" aria-hidden><i /><i /><i /></span>
      <span className="runner-tab"><span aria-hidden>{file.ikon}</span> {file.nama}</span>
      <span className="runner-head-aksi">
        {runnable && code !== initialCode && !running && (
          <button className="runner-ghost" onClick={reset} title="Kembalikan kode awal">↺ Reset</button>
        )}
        <button className="runner-ghost" onClick={copy} title="Salin kode">{copied ? '✓ Tersalin' : '⧉ Salin'}</button>
      </span>
    </div>
  )

  if (!runnable) {
    return (
      <div className="runner statis">
        {kepala}
        <CodeMirror
          value={initialCode}
          editable={false}
          readOnly
          theme="none"
          extensions={extensionsBaca}
          basicSetup={{ foldGutter: false, highlightActiveLine: false, highlightActiveLineGutter: false }}
        />
        <div className="runner-bar">
          <span className="runner-note">💻 {note || 'Contoh ini dijalankan di komputer sendiri atau Google Colab, bukan di browser.'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="runner">
      {kepala}
      <CodeMirror
        value={code}
        onChange={(v) => { setCode(v); onCodeChange?.(v) }}
        theme="none"
        extensions={extensions}
        minHeight={minHeight}
        basicSetup={{ foldGutter: false }}
      />
      {usesInput && (
        <label className="stdin">
          <span>⌨️ Input program (satu baris untuk setiap <code>input()</code>):</span>
          <textarea rows={2} value={stdin} onChange={(e) => setStdin(e.target.value)} placeholder="contoh: 7" />
        </label>
      )}
      <div className="runner-bar">
        <button className="runner-run" onClick={run} disabled={running}>
          {running ? <><span className="runner-spin" aria-hidden /> Berjalan…</> : '▶ Jalankan'}
        </button>
        {running && <button className="runner-ghost" onClick={stopPython}>⏹ Stop</button>}
        <span className="runner-note">
          {status || <>atau tekan <kbd>{PAKAI_MAC ? '⌘' : 'Ctrl'}</kbd> + <kbd>Enter</kbd> · kodenya boleh diubah</>}
        </span>
      </div>
      {(output.length > 0 || images.length > 0) && (
        <div className="output-wrap">
          <div className="output-head">
            <span>Keluaran</span>
            {hasil && (
              <span className={`output-status ${hasil.ok ? 'ok' : 'gagal'}`}>
                {hasil.ok ? '✓ Selesai' : '✗ Error'} · {formatDetik(hasil.ms)}
              </span>
            )}
            {!running && <button className="runner-ghost" onClick={bersihkan}>Bersihkan</button>}
          </div>
          <div className="output" aria-live="polite">
            {output.map((l, i) => (
              <div key={i} className={l.type === 'stderr' ? 'err' : l.type === 'info' ? 'muted' : ''}>{l.text}</div>
            ))}
            {images.map((src, i) => (
              <img key={i} src={`data:image/png;base64,${src}`} alt={`Grafik ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
