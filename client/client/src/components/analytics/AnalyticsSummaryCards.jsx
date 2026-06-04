function formatMetricValue(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') return value.toLocaleString()
  return String(value)
}

function formatLastVisit(value) {
  if (!value) return 'Never'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const SUMMARY_CARD_CONFIG = [
  {
    key: 'totalClicks',
    label: 'Total Clicks',
    description: 'Clicks recorded during selected period',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
      </svg>
    ),
    format: formatMetricValue,
  },
  {
    key: 'totalUrls',
    label: 'Total URLs',
    description: 'Links created on your account',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    format: formatMetricValue,
  },
  {
    key: 'activeUrls',
    label: 'Active URLs',
    description: 'Links available for redirect right now',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    format: formatMetricValue,
  },
  {
    key: 'protectedUrls',
    label: 'Protected URLs',
    description: 'Links secured with password protection',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    format: formatMetricValue,
  },
  {
    key: 'expiredUrls',
    label: 'Expired URLs',
    description: 'Links past their expiry date',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    format: formatMetricValue,
  },
  {
    key: 'lastVisit',
    label: 'Last Visit',
    description: 'Most recent click in selected period',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    format: formatLastVisit,
  },
]

export function AnalyticsSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {SUMMARY_CARD_CONFIG.map((card) => (
        <article
          key={card.key}
          className="min-h-[9.5rem] rounded-3xl border border-white/10 bg-slate-900/60 p-5 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-slate-800" />
            <div className="h-4 w-16 rounded bg-slate-800" />
          </div>
          <div className="mt-4 h-8 w-20 rounded bg-slate-800" />
          <div className="mt-3 h-3 w-full rounded bg-slate-800" />
        </article>
      ))}
    </div>
  )
}

export default function AnalyticsSummaryCards({ summary, isEmpty }) {
  if (isEmpty) {
    return (
      <section className="rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center">
        <p className="text-base font-semibold text-white">No analytics data available for selected range.</p>
        <p className="mt-2 text-sm text-slate-400">
          Try a wider date range or share your links to start collecting visits.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {SUMMARY_CARD_CONFIG.map((card) => (
            <article
              key={card.key}
              className="min-h-[9.5rem] rounded-3xl border border-white/10 bg-slate-900/60 p-5 opacity-60"
            >
              <div className="flex items-center gap-3 text-cyan-400">{card.icon}</div>
              <p className="mt-4 text-sm font-medium text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-500">—</p>
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {SUMMARY_CARD_CONFIG.map((card) => (
        <article
          key={card.key}
          className="group min-h-[9.5rem] rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900/80"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 transition group-hover:border-cyan-400/40">
              {card.icon}
            </div>
          </div>
          <p
            className={`mt-4 font-semibold text-white ${card.key === 'lastVisit' ? 'text-xl leading-tight' : 'text-3xl'}`}
            title={card.key === 'lastVisit' ? formatLastVisit(summary?.[card.key]) : undefined}
          >
            {card.format(summary?.[card.key])}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-300">{card.label}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{card.description}</p>
        </article>
      ))}
    </div>
  )
}
