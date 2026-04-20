export default function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm transition-all hover:bg-panelHi">
      <p className="text-xs uppercase tracking-[0.24em] text-copy/50">{label}</p>
      <p className="mt-2 font-headline text-4xl text-copy">{value}</p>
      {hint ? <p className="mt-3 text-sm text-copy/70">{hint}</p> : null}
    </div>
  )
}
