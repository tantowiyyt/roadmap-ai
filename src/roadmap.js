// Isi roadmap ada di folder src/data/. Setiap `id` harus unik dan jangan diganti
// setelah dipakai, karena progres disimpan berdasarkan id.
import { fondasi, pythonDasar, pythonLanjut } from './data/phases-python.js'
import { matematika, dataScience } from './data/phases-data.js'
import { machineLearning, deepLearning } from './data/phases-ml.js'
import { nlpCv, llm, deploy, karier } from './data/phases-advanced.js'
import { extraTopics } from './data/topics-extra.js'
import { topikBaru } from './data/topics-baru.js'
import { topikBaru2 } from './data/topics-baru2.js'
import { kuisTambahan } from './data/kuis-extra.js'
import { levels, levelById, phaseLevels } from './data/levels.js'

// Isi panjang materi (langkah & kasus, pendalaman, bahasa bayi, latihan tambahan) TIDAK digabung di sini,
// tetapi dimuat terpisah saat materi dibuka: lihat src/materi-detail.js (dipanggil dari Lesson.jsx).

// Sisipkan materi tambahan tepat setelah materi `after` (atau di akhir tahap)
function withExtras(phase) {
  const topics = [...phase.topics]
  for (const { after, ...topic } of [...(extraTopics[phase.id] || []), ...(topikBaru[phase.id] || []), ...(topikBaru2[phase.id] || [])]) {
    const i = topics.findIndex((t) => t.id === after)
    topics.splice(i === -1 ? topics.length : i + 1, 0, topic)
  }
  return topics
}

export const roadmap = [
  fondasi, pythonDasar, pythonLanjut, matematika, dataScience,
  machineLearning, deepLearning, nlpCv, llm, deploy, karier,
].map((phase) => ({
  ...phase,
  level: levelById[phaseLevels[phase.id]],
  topics: withExtras(phase),
  quiz: [...(phase.quiz || []), ...(kuisTambahan[phase.id] || [])],
}))

// Tahap dikelompokkan per level, berurutan dari Pemula sampai Profesional
export const roadmapByLevel = levels
  .map((l) => ({ level: levelById[l.id], phases: roadmap.filter((p) => p.level.id === l.id) }))
  .filter((g) => g.phases.length > 0)

export const totalItems = roadmap.reduce((n, p) => n + p.topics.length + 1, 0)
