export default function QuizCard({ question, index, value, onChange }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-card/90 p-5 shadow-glow">
      <p className="text-xs uppercase tracking-[0.28em] text-muted">
        Question {index + 1} | {question.topic} | {question.difficulty}
      </p>
      <h3 className="mt-3 text-lg font-semibold text-white">{question.question}</h3>
      <div className="mt-5 grid gap-3">
        {question.options.map((option) => (
          <label
            key={option.key}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
              value === option.key
                ? 'border-highlight bg-highlight/10 text-white'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.article_id}`}
              value={option.key}
              checked={value === option.key}
              onChange={() => onChange(question.article_id, option.key)}
              className="h-4 w-4 accent-[#f97316]"
            />
            <span className="text-sm">
              {option.key}. {option.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
