import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { useArticles } from '../hooks/useArticles'
import { fetchCurrentAffairs, postInteraction } from '../services/api'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: articles, loading, error } = useArticles(8)
  const [selectedPack, setSelectedPack] = useState(null)
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [userId, setUserId] = useState('guest')

  useEffect(() => {
    if (!articles.length || featuredArticle) {
      return
    }
    setFeaturedArticle(articles[0])
  }, [articles, featuredArticle])

  useEffect(() => {
    if (!featuredArticle) {
      return
    }
    fetchCurrentAffairs(featuredArticle.id).then(setSelectedPack).catch(() => setSelectedPack(null))
  }, [featuredArticle])

  async function handleAction(action, articleId) {
    await postInteraction({ user_id: userId, article_id: articleId, action })
  }

  async function openFeature(route) {
    if (featuredArticle) {
      await postInteraction({ user_id: userId, article_id: featuredArticle.id, action: 'click' })
    }
    navigate(route)
  }

  const archiveTopics = useMemo(() => {
    return articles.slice(0, 4).map((article, index) => ({
      label: `#${(selectedPack?.topic || article.source || `Topic${index + 1}`).replace(/[^a-z0-9]+/gi, '')}`,
      detail: `${Math.max(3, 12 - index * 2)}.${index + 1}k prep sessions`,
    }))
  }, [articles, selectedPack?.topic])

  const curatedArticles = articles.slice(1)

  return (
    <div className="space-y-10 pb-24 md:pb-8">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-copy/5 bg-panel p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-center">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-tertiary">
                  Daily Digest
                  <span className="text-copy/35">•</span>
                  <span className="text-copy/60">Today</span>
                </div>
                <h1 className="max-w-3xl font-headline text-3xl leading-tight text-copy sm:text-4xl md:text-6xl">
                  {featuredArticle?.title || 'The archive is preparing your front page.'}
                </h1>
                <p className="mt-5 max-w-2xl font-headline text-lg italic leading-8 text-copy/75">
                  {selectedPack?.summary ||
                    'A deep, exam-ready reading stream built from current affairs, fast summaries, and revision-first insights.'}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-[#1000a9] transition-opacity hover:opacity-90"
                    onClick={() => openFeature('/personalized')}
                  >
                    Read Full Analysis
                  </button>
                  <button
                    className="rounded-lg border border-accent/20 px-6 py-3 text-sm font-bold text-accent transition-colors hover:bg-accent/10"
                    onClick={() => openFeature('/exam-prep')}
                  >
                    Prep for Exam
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-panelHi p-6 shadow-glow">
                <p className="text-xs uppercase tracking-[0.24em] text-copy/45">Profile</p>
                <input
                  className="mt-4 w-full rounded-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="Your profile"
                />
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-copy/45">Focus Topic</p>
                    <p className="mt-1 font-headline text-2xl text-accent">{selectedPack?.topic || 'Current Affairs'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-copy/45">Key Takeaway</p>
                    <p className="mt-1 text-sm leading-6 text-copy/75">
                      {selectedPack?.key_points?.[0] || 'Open any story below to turn it into notes, takeaways, and objective practice.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-headline text-3xl text-copy sm:text-4xl">Curated for You</h2>
              <p className="mt-2 text-sm italic text-copy/60">Personalized reading shaped by your archive activity.</p>
            </div>
            <div className="hidden flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.24em] text-copy/45 md:flex">
              <span className="border-b-2 border-accent pb-1 text-accent">All</span>
              <span>Polity</span>
              <span>Economy</span>
              <span>Science</span>
            </div>
          </div>

          {loading ? <p className="text-copy/60">Loading curated stories...</p> : null}
          {error ? <p className="text-red-300">{error}</p> : null}

          <div className="grid gap-6 md:grid-cols-2">
            {curatedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onAction={handleAction}
                footer={
                  <button
                    type="button"
                    onClick={() => setFeaturedArticle(article)}
                    className="mt-5 rounded-lg border border-copy/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-copy/70 transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    Open Study Note
                  </button>
                }
              />
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-2xl bg-panelHi p-6 shadow-glow">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.28em] text-copy/55">Daily Streak</h3>
              <span className="text-accent">12 days</span>
            </div>
            <div className="mb-4">
              <p className="font-headline text-5xl text-copy">12</p>
              <p className="text-xs text-copy/45">Days active</p>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-1 flex-1 rounded-full bg-line">
                  <div className={`h-full rounded-full ${index < 5 ? 'bg-tertiary' : index === 5 ? 'w-1/2 bg-tertiary' : ''}`} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-copy/45">2 more days to reach Expert Curator status.</p>
          </div>

          <div className="space-y-3">
            <h3 className="px-2 text-sm font-bold uppercase tracking-[0.28em] text-copy/55">Trending in Archive</h3>
            <div className="rounded-2xl bg-panel p-3">
              {archiveTopics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => navigate('/trending')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors hover:bg-card"
                >
                  <div>
                    <p className="text-sm font-bold text-accent">{topic.label}</p>
                    <p className="text-[11px] text-copy/45">{topic.detail}</p>
                  </div>
                  <span className="text-copy/35">›</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-card p-6">
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.24em] text-copy/45">Focus Mode</p>
              <h4 className="mt-3 font-headline text-2xl text-copy">Enter Focus Mode</h4>
              <p className="mt-3 text-sm leading-6 text-copy/70">
                Strip away the noise and stay with the article, the summary, and the questions that matter.
              </p>
              <button
                className="mt-5 text-sm font-bold text-accent underline underline-offset-4"
                onClick={() => navigate('/exam-prep')}
              >
                Activate Now
              </button>
            </div>
            <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
          </div>
        </aside>
      </section>
    </div>
  )
}
