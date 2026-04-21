import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 12000,
})

export async function fetchArticles(limit = 12) {
  const response = await api.get('/articles', { params: { limit } })
  return response.data
}

export async function fetchRecommendations(userId, articleId, count = 6) {
  const response = await api.get(`/recommend/${encodeURIComponent(userId)}/${articleId}`, {
    params: { count },
  })
  return response.data
}

export async function postInteraction(payload) {
  const response = await api.post('/interact', payload)
  return response.data
}

export async function fetchTrending(limit = 12) {
  const response = await api.get('/trending', {
    params: { limit },
  })
  return response.data
}

export async function fetchCurrentAffairs(articleId) {
  const response = await api.get(`/current-affairs/${articleId}`)
  return response.data
}

export async function fetchDailyDigest(limit = 5) {
  const response = await api.get('/daily-digest', { params: { limit } })
  return response.data
}

export async function fetchQuiz(userId, count = 5) {
  const response = await api.get(`/quiz/${encodeURIComponent(userId)}`, { params: { count } })
  return response.data
}

export async function submitQuiz(payload) {
  const response = await api.post('/quiz/submit', payload)
  return response.data
}

export async function fetchUserStats(userId) {
  const response = await api.get(`/user-stats/${encodeURIComponent(userId)}`)
  return response.data
}

export function getPdfExportUrl(userId) {
  return `${api.defaults.baseURL}/export/pdf/${encodeURIComponent(userId)}`
}
