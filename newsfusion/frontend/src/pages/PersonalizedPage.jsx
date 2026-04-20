import { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import MetricCard from '../components/MetricCard'
import { fetchRecommendations, postInteraction } from '../services/api'

export default function PersonalizedPage() {
  const [userId, setUserId] = useState('guest')
  const [articleId, setArticleId] = useState(0)
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('Loading your archive recommendations...')

  useEffect(() => {
    loadFeed()
  }, [])

  async function loadFeed() {
    setStatus('Loading your archive recommendations...')
    try {
      const nextArticles = await fetchRecommendations(userId, articleId, 8)
      setArticles(nextArticles)
      setStatus('')
    } catch {
      setStatus('Unable to load your personalized archive right now.')
    }
  }

  async function handleAction(action, targetArticleId) {
    await postInteraction({ user_id: userId, article_id: targetArticleId, action })
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <MetricCard label="Recommended Reads" value={articles.length} hint="Stories matched to your reading pattern." />
        <MetricCard label="Profile Name" value={userId} hint="Switch profiles to preview different reading trails." />
        <MetricCard label="Starting Story" value={articleId} hint="The recommendation chain begins from this article." />
      </section>

      <section className="rounded-2xl bg-panel p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-copy/45">Personalized Reading</p>
            <h1 className="mt-3 font-headline text-5xl leading-tight text-copy">A recommendation trail built from your archive habits.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-copy/70">
              Blend article similarity with engagement history to surface stories that feel connected, useful, and worth
              revisiting for revision.
            </p>
          </div>

          <div className="rounded-xl bg-card p-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.24em] text-copy/45">Profile Name</label>
              <input
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="reader123"
                className="mt-3 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
              />
            </div>
            <div className="mt-4">
              <label className="text-[10px] uppercase tracking-[0.24em] text-copy/45">Starting Article</label>
              <input
                type="number"
                min="0"
                value={articleId}
                onChange={(event) => setArticleId(Number(event.target.value))}
                className="mt-3 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
              />
            </div>
            <button
              type="button"
              onClick={loadFeed}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-accent to-highlight px-5 py-3 text-sm font-bold text-[#1000a9]"
            >
              Refresh Recommendations
            </button>
          </div>
        </div>
      </section>

      {status ? <p className="text-copy/60">{status}</p> : null}

      <section className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} onAction={handleAction} />
        ))}
      </section>
    </div>
  )
}
