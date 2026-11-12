import { useState } from 'react'
import CodeRunner from '../components/KodeLazy.jsx'
import { py } from '../data/py.js'

const STORAGE_KEY = 'roadmap-ai-playground'

const templates = {
  'Kosong': py`
# Tulis kode Python bebas di sini
print("Halo, dunia AI!")`,
  'Python dasar': py`
nama = input("Siapa namamu? ")
for i in range(3):
    print(f"{i + 1}. Semangat belajar AI, {nama}!")`,
  'NumPy & grafik': py`
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
plt.plot(x, np.sin(x), label="sin")
plt.plot(x, np.cos(x), label="cos")
plt.legend(); plt.grid(alpha=.3)
plt.show()`,
  'Pandas': py`
import pandas as pd

df = pd.DataFrame({
    "produk": ["Kopi", "Teh", "Roti", "Kopi", "Roti", "Teh"],
    "jumlah": [3, 5, 2, 4, 6, 1],
    "harga":  [15000, 8000, 12000, 15000, 12000, 8000],
})
df["total"] = df["jumlah"] * df["harga"]
print(df)
print(df.groupby("produk")["total"].sum().sort_values(ascending=False))`,
  'Machine learning': py`
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

X, y = load_wine(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)
model = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)
print("Akurasi:", model.score(X_te, y_te))`,
}

function loadSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export default function PlaygroundPage() {
  const [initial, setInitial] = useState(() => loadSaved() || templates['Kosong'])
  const [version, setVersion] = useState(0)

  const save = (code) => {
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // abaikan
    }
  }

  const pick = (name) => {
    if (!confirm(`Ganti isi editor dengan template "${name}"? Kode saat ini akan hilang.`)) return
    setInitial(templates[name])
    save(templates[name])
    setVersion((v) => v + 1)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h2>Playground Python</h2>
        <p className="muted">
          Tempat bebas bereksperimen. Python berjalan langsung di browser, dan library NumPy, Pandas,
          scikit-learn, matplotlib, serta SciPy sudah tersedia. Kodemu tersimpan otomatis.
        </p>
      </div>
      <div className="chips">
        <span className="small muted">Template:</span>
        {Object.keys(templates).map((t) => (
          <button key={t} className="chip" onClick={() => pick(t)}>{t}</button>
        ))}
      </div>
      <CodeRunner key={version} code={initial} minHeight="320px" onCodeChange={save} />
      <div className="card small muted">
        <strong>Catatan:</strong> library yang butuh GPU atau internet (PyTorch, TensorFlow, requests ke API)
        tidak bisa berjalan di browser. Gunakan Google Colab untuk itu. Pemuatan pertama mengunduh Python
        (~10 MB), setelah itu lebih cepat.
      </div>
    </div>
  )
}
