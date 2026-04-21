import { useEffect, useState } from 'react'
import { fetchArticles, fetchRecommendations, fetchTrending } from '../services/api'

export function useRecommendations(userId, baseId) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId || baseId === null) {
      return
    }

    setLoading(true)
    fetchRecommendations(userId, baseId)
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [userId, baseId])

  return { data, loading, error }
}

export function useArticles(limit = 12) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchArticles(limit)
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [limit])

  return { data, loading, error }
}

export function useTrending() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchTrending()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
