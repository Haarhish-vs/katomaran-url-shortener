export default function AnalyticsSummaryError({ message, onRetry }) {
  return (
    <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 text-center sm:p-8">
      <p className="text-base font-semibold text-rose-300">Unable to load analytics summary.</p>
      {message ? <p className="mt-2 text-sm text-slate-300">{message}</p> : null}
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
      >
        Retry
      </button>
    </section>
  )
}
