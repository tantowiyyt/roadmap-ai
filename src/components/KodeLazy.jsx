import { lazy, Suspense } from 'react'

// Editor kode (CodeMirror) cukup besar, jadi dimuat terpisah saat pertama kali ada contoh kode di layar.
// Selama dimuat, kode tampil sebagai teks biasa agar tetap bisa dibaca.
const CodeRunner = lazy(() => import('./CodeRunner.jsx'))

export default function KodeLazy(props) {
  return (
    <Suspense fallback={<pre className="kode-memuat"><code>{props.code}</code></pre>}>
      <CodeRunner {...props} />
    </Suspense>
  )
}
