import { useMemo, useState } from 'react'
import { useTrending } from '../hooks/useArticles'

const windows = ['Last 24h', 'Week', 'Month']

export default function TrendingPage() {
  const { data, loading, error } = useTrending()
  const [activeWindow, setActiveWindow] = useState('Last 24h')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = useMemo(() => {
    const values = Array.from(new Set(data.map((article) => article.source || 'Archive')))
    return ['All', ...values.slice(0, 4)]
  }, [data])

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') {
      return data
    }
    return data.filter((article) => (article.source || 'Archive') === selectedCategory)
  }, [data, selectedCategory])

  const featured = filtered[0]
  const rising = filtered.slice(1, 3)
  const mostRead = filtered.slice(0, 3)
  const referenceShelf = filtered.slice(3, 6)
  const momentumCards = [
    { label: 'Stories Rising', value: `${filtered.length || 0}` },
    { label: 'Avg Saves', value: `${filtered.reduce((sum, item) => sum + (item.saves || 0), 0) || 0}` },
    { label: 'Avg Likes', value: `${filtered.reduce((sum, item) => sum + (item.likes || 0), 0) || 0}` },
    { label: 'Peak Window', value: activeWindow },
  ]

  return (
    <div className="space-y-12 pb-24 md:pb-8">
      <section>
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-headline text-4xl text-copy sm:text-5xl">Currently Trending</h1>
            <p className="mt-2 text-base italic text-copy/65 sm:text-lg">Insightful narratives rising from the collective curiosity.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-lg bg-card p-1 text-xs">
              {windows.map((window) => (
                <button
                  key={window}
                  className={`rounded-md px-4 py-2 ${activeWindow === window ? 'bg-panelHi font-bold text-accent' : 'text-copy/60'}`}
                  onClick={() => setActiveWindow(window)}
                >
                  {window}
                </button>
              ))}
            </div>
            <select
              className="rounded-lg border border-line bg-card px-4 py-2 text-sm text-copy/75 outline-none"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? <p className="text-copy/60">Loading trending archive...</p> : null}
        {error ? <p className="text-red-300">{error}</p> : null}

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="overflow-hidden rounded-xl bg-card lg:col-span-2">
            <div className="relative h-72 bg-panelHi p-6 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <div className="relative flex h-full flex-col justify-end">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-tertiary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">
                    {featured?.source || 'Top Story'}
                  </span>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    Rank #1
                  </span>
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-headline text-3xl text-tertiary">{featured?.score?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs uppercase tracking-[0.24em] text-copy/45">Engagement Score</span>
                </div>
                <h2 className="font-headline text-3xl leading-tight text-copy sm:text-4xl">
                  {featured?.title || 'The archive is gathering the strongest signal right now.'}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-copy/70">
                  {featured?.summary || 'A closer look at the stories commanding the most reading momentum, saves, and revision attention.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-panelHi p-6 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.28em] text-copy/55">Live Momentum</h3>
            <div className="grid grid-cols-2 gap-4">
              {momentumCards.map((card) => (
                <div key={card.label} className="rounded-lg bg-card p-4 transition-colors hover:bg-line">
                  <p className="text-xs text-copy/45">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-copy">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-2xl text-copy">Rising Discussions</h3>
              <span className="text-xs font-medium text-accent">{rising.length} stories</span>
            </div>
            {rising.map((article) => (
              <div key={article.id} className="flex gap-4 rounded-lg border border-transparent p-3 transition-all hover:border-line hover:bg-panelHi">
                <div className="h-20 w-20 shrink-0 rounded-lg bg-card" />
                <div className="flex flex-col justify-center">
                  <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">{article.source || 'Trending'}</span>
                  <h4 className="font-headline text-xl leading-snug text-copy">{article.title}</h4>
                  <div className="mt-2 flex gap-3 text-[10px] text-copy/45">
                    <span>{article.views || 0} views</span>
                    <span>{article.saves || 0} saves</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-12 border-t border-copy/10 pt-12 lg:grid-cols-2">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <h2 className="font-headline text-3xl text-copy">Most Read</h2>
          </div>
          <div className="space-y-6">
            {mostRead.map((article, index) => (
              <div key={article.id} className="group flex items-start gap-4 sm:gap-6">
                <span className="w-8 text-right font-headline text-4xl italic text-copy/15 transition-colors group-hover:text-accent/35 sm:text-5xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 border-b border-copy/10 pb-6">
                  <h3 className="font-headline text-xl leading-snug text-copy transition-colors group-hover:text-accent sm:text-2xl">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.18em] text-copy/45">
                    <span>{article.source || 'Archive'}</span>
                    <span>{article.views || 0} reads</span>
                    <span className="text-tertiary">{article.score?.toFixed(1) || '0.0'} momentum</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-copy/5 bg-panelHi p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-headline text-3xl text-copy">The Reference Shelf</h2>
            <span className="text-[10px] uppercase tracking-[0.24em] text-copy/45">Saved for Study</span>
          </div>
          <div className="space-y-4">
            {referenceShelf.map((article, index) => (
              <div key={article.id} className="rounded-xl bg-surface/40 p-4 transition-colors hover:bg-surface/60">
                <div className="mb-2 flex items-start justify-between">
                  <span className="rounded bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    {index === 0 ? 'Exam Prep' : index === 1 ? 'Long Form' : 'Essential'}
                  </span>
                </div>
                <h4 className="font-headline text-xl text-copy sm:text-2xl">{article.title}</h4>
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-copy/45">
                  <span>{article.source || 'Archive'}</span>
                  <span>{article.saves || 0} saves</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full rounded-lg border border-line px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] text-copy/70 transition-colors hover:bg-line">
            Explore Full Library
          </button>
        </div>
      </section>
    </div>
  )
}
