import { useEffect, useMemo, useState } from 'react'
import QuizCard from '../components/QuizCard'
import { fetchDailyDigest, fetchQuiz, getPdfExportUrl, submitQuiz } from '../services/api'

export default function ExamPrepPage() {
  const [userId, setUserId] = useState('guest')
  const [digest, setDigest] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [selectedArticleId, setSelectedArticleId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('Preparing exam prep mode...')

  useEffect(() => {
    loadDigest()
  }, [])

  useEffect(() => {
    loadQuiz()
  }, [userId])

  async function loadDigest() {
    setStatus('Preparing exam prep mode...')
    try {
      const nextDigest = await fetchDailyDigest()
      setDigest(nextDigest)
      setSelectedArticleId(nextDigest.items?.[0]?.article.id ?? null)
      setStatus('')
    } catch {
      setStatus('Unable to load article insights right now.')
    }
  }

  async function loadQuiz() {
    try {
      const nextQuiz = await fetchQuiz(userId)
      setQuiz(nextQuiz)
      setAnswers({})
      setResult(null)
    } catch {
      setQuiz(null)
    }
  }

  function updateAnswer(articleId, selectedAnswer) {
    setAnswers((current) => ({ ...current, [articleId]: selectedAnswer }))
  }

  async function handleSubmit() {
    const payload = {
      user_id: userId,
      answers: Object.entries(answers).map(([articleId, selected_answer]) => ({
        article_id: Number(articleId),
        selected_answer,
      })),
    }

    setResult(await submitQuiz(payload))
  }

  const selectedItem = useMemo(() => {
    return digest?.items?.find((item) => item.article.id === selectedArticleId) || digest?.items?.[0]
  }, [digest, selectedArticleId])

  const completion = quiz?.questions?.length
    ? Math.round((Object.keys(answers).length / quiz.questions.length) * 100)
    : 0

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="overflow-hidden rounded-xl border border-copy/10 bg-panel">
        <div className="flex flex-col lg:flex-row">
          <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 md:px-12 lg:px-16">
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-copy/45">
                <span>{selectedItem?.current_affairs.topic || 'Current Affairs'}</span>
                <span>›</span>
                <span>Exam Prep Mode</span>
              </div>

              <h1 className="font-headline text-3xl leading-tight text-copy sm:text-4xl lg:text-6xl">
                {selectedItem?.article.title || 'Your lead article analysis is getting ready.'}
              </h1>

              <div className="mb-12 mt-8 border-b border-copy/10 pb-8">
                <p className="text-sm font-semibold text-copy">NewsFusion Editorial Desk</p>
                <p className="mt-1 text-xs text-copy/45">12 min read • exam-focused insight</p>
              </div>

              <article className="space-y-6 font-headline text-lg leading-relaxed text-copy/90 sm:text-xl">
                <p>{selectedItem?.current_affairs.summary || 'The article summary will appear here once the daily digest is available.'}</p>
                {selectedItem?.current_affairs.key_points?.slice(0, 2).map((point) => (
                  <p key={point}>{point}</p>
                ))}
                <div className="my-10 rounded-xl border-l-4 border-accent bg-card p-6 italic text-copy/80 sm:p-8">
                  “{selectedItem?.current_affairs.key_points?.[0] || 'The key idea from this article will be highlighted here.'}”
                </div>
                {selectedItem?.current_affairs.key_points?.slice(2, 4).map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </article>
            </div>
          </section>

          <aside className="w-full border-t border-copy/10 bg-card lg:w-[400px] lg:border-l lg:border-t-0">
            <div className="space-y-8 p-5 sm:p-8">
              <div>
                <div className="mb-4 flex items-center gap-2 text-accent">
                  <h3 className="text-xs font-bold uppercase tracking-[0.28em]">AI Summary</h3>
                </div>
                <div className="rounded-lg border border-copy/10 bg-panelHi/60 p-5">
                  <p className="font-headline text-base italic leading-7 text-copy/80">
                    {selectedItem?.current_affairs.summary || 'A concise AI summary will appear here.'}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2 text-tertiary">
                  <h3 className="text-xs font-bold uppercase tracking-[0.28em]">Key Points</h3>
                </div>
                <ul className="space-y-4">
                  {(selectedItem?.current_affairs.key_points || []).map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary" />
                      <p className="text-sm leading-6 text-copy/75">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2 text-copy/60">
                  <h3 className="text-xs font-bold uppercase tracking-[0.28em]">Classification</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded border border-accent/20 bg-line px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    {selectedItem?.current_affairs.topic || 'Exam Topic'}
                  </span>
                  <span className="rounded border border-copy/10 bg-line px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-copy/60">
                    Current Affairs
                  </span>
                  <span className="rounded border border-tertiary/20 bg-line px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-tertiary">
                    Revision Ready
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="w-full rounded-xl bg-gradient-to-br from-accent to-highlight p-6 text-left text-[#1000a9] transition-transform active:scale-[0.98]"
                  onClick={() => document.getElementById('daily-quiz')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em]">Knowledge Check</p>
                  <h4 className="mt-1 text-xl font-bold">Take Quiz on this Topic</h4>
                </button>
                <p className="mt-4 text-center text-[11px] text-copy/45">Complete the live quiz section below for this study pack.</p>
              </div>

              <div className="rounded-xl border border-copy/10 bg-panel p-5">
                <label className="text-xs uppercase tracking-[0.24em] text-copy/45">Profile</label>
                <input
                  className="mt-3 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-[#1000a9]" onClick={loadQuiz}>
                    Refresh Quiz
                  </button>
                  <a
                    href={getPdfExportUrl(userId)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-line px-4 py-2 text-center text-sm text-copy/75"
                  >
                    Download PDF
                  </a>
                </div>
              </div>

              <div className="rounded-xl bg-panel p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-copy/45">More Digest Stories</p>
                <div className="mt-3 grid gap-2">
                  {(digest?.items || []).map((item) => (
                    <button
                      key={item.article.id}
                      type="button"
                      onClick={() => setSelectedArticleId(item.article.id)}
                      className={`rounded-lg px-3 py-3 text-left transition-colors ${
                        item.article.id === selectedArticleId ? 'bg-panelHi text-copy' : 'bg-surface text-copy/70 hover:bg-panelHi'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-copy/45">{item.current_affairs.topic}</p>
                      <p className="mt-1 text-sm font-medium">{item.article.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section id="daily-quiz" className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-copy/45">Current Module</p>
            <h2 className="font-headline text-3xl text-copy">{selectedItem?.current_affairs.topic || 'Daily Quiz'}</h2>
          </div>
          <div className="text-sm text-copy/70 sm:text-right">
            <p>{quiz?.questions?.length || 0} questions in this quiz</p>
            <p className="text-accent">{completion}% completed</p>
          </div>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-panelHi">
          <div className="h-full rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.4)]" style={{ width: `${completion}%` }} />
        </div>

        {quiz?.questions?.length ? (
          <div className="space-y-5 rounded-xl bg-card p-5 sm:p-8 md:p-12">
            {quiz.questions.map((question, index) => (
              <QuizCard
                key={question.article_id}
                question={question}
                index={index}
                value={answers[question.article_id]}
                onChange={updateAnswer}
              />
            ))}
            <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
              <button className="rounded-lg border border-accent/20 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10">
                AI Hint
              </button>
              <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
                <button className="flex-1 rounded-lg px-8 py-3 text-copy/60" onClick={loadQuiz}>
                  New Set
                </button>
                <button
                  className="flex-1 rounded-lg bg-gradient-to-br from-accent to-highlight px-10 py-3 font-bold text-[#1000a9] shadow-lg shadow-accent/10"
                  onClick={handleSubmit}
                >
                  Submit Answers
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-copy/60">{status}</p>
        )}

        {result ? (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-xl bg-card p-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent">AI Analyst Insight</h3>
              <p className="font-headline text-lg italic leading-7 text-copy/80">
                You scored {result.score} out of {result.total_questions}. Focus on the explanations below to convert
                this article set into a reliable exam concept.
              </p>
              <div className="mt-4 space-y-4">
                {result.results.map((item) => (
                  <div key={`${item.article_id}-${item.selected_answer}`} className="rounded-lg bg-panel p-4">
                    <p className="text-sm font-semibold text-copy">{item.topic}</p>
                    <p className="mt-2 text-sm leading-6 text-copy/70">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-panelHi p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-copy/45">Difficulty</p>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className={`h-1 flex-1 rounded-full ${index < 4 ? 'bg-tertiary' : 'bg-line'}`} />
                ))}
              </div>
              <p className="mt-4 text-xs text-copy/60">Accuracy: {result.accuracy}%</p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
