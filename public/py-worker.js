// Web Worker yang menjalankan Python (Pyodide) di luar thread utama,
// supaya halaman tidak macet saat kode berjalan.
importScripts('https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js')

let pyPromise = null

function getPy() {
  if (!pyPromise) {
    pyPromise = loadPyodide().then(async (py) => {
      await py.runPythonAsync(`
import os, warnings
os.environ['MPLBACKEND'] = 'AGG'
warnings.filterwarnings('ignore', message='.*non-interactive.*')
warnings.filterwarnings('ignore', message='.*FigureCanvasAgg.*')
`)
      return py
    })
  }
  return pyPromise
}

const COLLECT_PLOTS = `
import sys as _sys
_imgs = []
if 'matplotlib.pyplot' in _sys.modules:
    import io as _io, base64 as _b64
    import matplotlib.pyplot as _plt
    for _n in _plt.get_fignums():
        _buf = _io.BytesIO()
        _plt.figure(_n).savefig(_buf, format='png', bbox_inches='tight', dpi=100)
        _imgs.append(_b64.b64encode(_buf.getvalue()).decode())
    _plt.close('all')
_imgs
`

// Buang baris traceback internal Pyodide agar pesan error mudah dibaca pemula
function cleanError(msg) {
  const lines = String(msg).split('\n')
  const start = lines.findIndex((l) => l.includes('File "<exec>"'))
  if (start === -1) return msg
  return ['Traceback (most recent call last):', ...lines.slice(start)].join('\n').trim()
}

self.onmessage = async (e) => {
  const { id, code, stdin, preload } = e.data
  const post = (msg) => self.postMessage({ id, ...msg })

  try {
    post({ type: 'status', text: 'Menyiapkan Python…' })
    const py = await getPy()
    if (preload) return post({ type: 'done', images: [] })

    post({ type: 'status', text: 'Memuat library…' })
    await py.loadPackagesFromImports(code, {
      messageCallback: (m) => post({ type: 'status', text: m }),
      errorCallback: (m) => post({ type: 'status', text: m }),
    })

    const lines = stdin && stdin.length ? stdin.split('\n') : []
    let i = 0
    py.setStdout({ batched: (text) => post({ type: 'stdout', text }) })
    py.setStderr({ batched: (text) => post({ type: 'stderr', text }) })
    py.setStdin({ stdin: () => (i < lines.length ? lines[i++] : undefined) })

    post({ type: 'status', text: 'Menjalankan…' })
    const ns = py.globals.get('dict')()
    let error = null
    try {
      await py.runPythonAsync(code, { globals: ns })
    } catch (err) {
      let msg = cleanError(err.message)
      if (msg.includes('EOFError')) {
        msg += '\n\n💡 Kode memakai input(). Isi nilainya di kotak "Input program" (satu baris per input()).'
      }
      error = msg
    }
    const images = py.runPython(COLLECT_PLOTS, { globals: ns }).toJs()
    ns.destroy()
    post({ type: 'done', images, error })
  } catch (err) {
    post({ type: 'done', images: [], error: 'Gagal memuat Python: ' + err.message })
  }
}
