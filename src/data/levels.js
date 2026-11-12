// Urutan level belajar, dari paling dasar sampai siap kerja.
export const levels = [
  { id: 'pemula', color: '#16a34a', name: 'Pemula', en: 'Beginner', icon: '🌱', desc: 'Belum pernah ngoding. Mulai dari tools dan dasar Python.' },
  { id: 'menengah', color: '#0284c7', name: 'Menengah', en: 'Intermediate', icon: '🌿', desc: 'Sudah bisa Python dasar. Belajar kode rapi, matematika, dan mengolah data.' },
  { id: 'mahir', color: '#d97706', name: 'Mahir', en: 'Advanced', icon: '🌳', desc: 'Membuat model sendiri: machine learning dan deep learning.' },
  { id: 'ahli', color: '#e11d48', name: 'Ahli', en: 'Expert', icon: '🚀', desc: 'Spesialisasi: bahasa, gambar, dan LLM / Generative AI.' },
  { id: 'profesional', color: '#7c3aed', name: 'Profesional', en: 'Pro', icon: '💼', desc: 'Menjadikan model produk nyata dan membangun karier di AI.' },
]

export const levelById = Object.fromEntries(levels.map((l, i) => [l.id, { ...l, order: i + 1 }]))

// Level setiap tahap roadmap (urutan tahap di roadmap.js mengikuti urutan level ini)
export const phaseLevels = {
  fondasi: 'pemula',
  'python-dasar': 'pemula',
  'python-lanjut': 'menengah',
  matematika: 'menengah',
  'data-science': 'menengah',
  'machine-learning': 'mahir',
  'deep-learning': 'mahir',
  'nlp-cv': 'ahli',
  llm: 'ahli',
  deploy: 'profesional',
  karier: 'profesional',
}

// Tingkat kesulitan algoritma (untuk urutan & filter di Ensiklopedia Algoritma)
export const algoLevels = {
  'linear-regression': 'pemula',
  'logistic-regression': 'pemula',
  knn: 'pemula',
  'decision-tree': 'pemula',
  kmeans: 'pemula',
  'naive-bayes': 'menengah',
  'random-forest': 'menengah',
  pca: 'menengah',
  apriori: 'menengah',
  'a-star': 'menengah',
  'gradient-boosting': 'mahir',
  svm: 'mahir',
  dbscan: 'mahir',
  mlp: 'mahir',
  cnn: 'ahli',
  rnn: 'ahli',
  transformer: 'ahli',
  'q-learning': 'ahli',
}
