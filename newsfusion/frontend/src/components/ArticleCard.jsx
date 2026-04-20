import { motion } from 'framer-motion'

function getCategory(article) {
  if (article.topic) {
    return article.topic
  }

  const source = (article.source || '').toLowerCase()
  if (source.includes('science') || source.includes('tech')) {
    return 'Science'
  }
  if (source.includes('business') || source.includes('econom')) {
    return 'Economy'
  }
  if (source.includes('world') || source.includes('bbc')) {
    return 'Current Affairs'
  }
  return 'Top Story'
}

export default function ArticleCard({ article, onAction, footer }) {
  const category = getCategory(article)

  return (
    <motion.article
      className="group flex h-full flex-col rounded-xl border border-transparent bg-card p-5 shadow-sm transition-all duration-300 hover:border-accent/15 hover:bg-panelHi hover:shadow-glow"
      layout
      whileHover={{ y: -4 }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="rounded bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          {category}
        </span>
        <span className="text-xs text-copy/45">{article.published || 'Recent'}</span>
      </div>

      <h2 className="font-headline text-2xl leading-snug text-copy transition-colors group-hover:text-accent">
        {article.title}
      </h2>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-copy/5 bg-surface/40 p-3">
        <span className="mt-0.5 text-xs font-bold uppercase tracking-[0.2em] text-tertiary">AI</span>
        <p className="text-xs leading-6 text-copy/70">{article.ai_summary || article.summary}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-copy/5 pt-4 text-xs text-muted">
        <span>{article.source || 'Archive'} brief</span>
        {typeof article.score === 'number' ? <span className="text-accent">{Math.round(article.score * 100)}% match</span> : null}
      </div>

      {footer}

      <div className="mt-4 flex items-center justify-between gap-3">
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-accent transition-colors hover:text-copy"
        >
          Read Full Story
        </a>

        {onAction ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onAction('save', article.id)}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/10"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => onAction('click', article.id)}
              className="rounded-lg border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/20"
            >
              Exam Prep
            </button>
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}
