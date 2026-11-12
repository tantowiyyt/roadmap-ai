// Penghubung antara React dan py-worker.js. Hanya satu kode berjalan dalam satu waktu.
let worker = null
let nextId = 1
const pending = new Map()
let queue = Promise.resolve()

function ensureWorker() {
  if (worker) return worker
  worker = new Worker(import.meta.env.BASE_URL + 'py-worker.js')
  worker.onmessage = (e) => {
    const job = pending.get(e.data.id)
    if (!job) return
    if (e.data.type === 'done') {
      pending.delete(e.data.id)
      job.resolve({ images: e.data.images || [], error: e.data.error || null })
    } else {
      job.onEvent?.(e.data)
    }
  }
  worker.onerror = (e) => {
    for (const job of pending.values()) job.resolve({ images: [], error: 'Worker error: ' + e.message })
    pending.clear()
  }
  return worker
}

function send(payload, onEvent) {
  const run = () =>
    new Promise((resolve) => {
      const id = nextId++
      pending.set(id, { resolve, onEvent })
      ensureWorker().postMessage({ id, ...payload })
    })
  const p = queue.then(run, run)
  queue = p.catch(() => {})
  return p
}

export function runPython(code, stdin, onEvent) {
  return send({ code, stdin }, onEvent)
}

// Mulai unduh Python di latar belakang (dipanggil saat editor pertama kali tampil)
export function preloadPython() {
  if (!worker) send({ preload: true, code: '' })
}

// Hentikan kode yang berjalan (mis. infinite loop) dengan mematikan worker
export function stopPython() {
  if (!worker) return
  worker.terminate()
  worker = null
  for (const job of pending.values()) job.resolve({ images: [], error: '⏹ Eksekusi dihentikan.' })
  pending.clear()
  queue = Promise.resolve()
}
