// Daftar animasi cara kerja algoritma: id algoritma → fungsi pembuat frame
import { linearRegression, logisticRegression, knn, naiveBayes, decisionTree, randomForest, gradientBoosting, svm } from './supervised.jsx'
import { kmeans, dbscan, pca, apriori } from './unsupervised.jsx'
import { mlp, cnn, rnn, transformer } from './deep.jsx'
import { aStar, qLearning } from './search.jsx'

export const animations = {
  'linear-regression': linearRegression,
  'logistic-regression': logisticRegression,
  knn,
  'naive-bayes': naiveBayes,
  'decision-tree': decisionTree,
  'random-forest': randomForest,
  'gradient-boosting': gradientBoosting,
  svm,
  kmeans,
  dbscan,
  pca,
  apriori,
  mlp,
  cnn,
  rnn,
  transformer,
  'a-star': aStar,
  'q-learning': qLearning,
}
