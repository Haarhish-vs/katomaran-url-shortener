function PercentBar({ percent, color }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(percent, 100)}%`, background: color }}
      />
    </div>
  );
}

const BROWSER_COLORS = {
  Chrome: '#4285F4',
  Safari: '#5AC8FA',
  Firefox: '#FF7139',
  Edge: '#0078D7',
  Opera: '#FF1B2D',
  Unknown: '#64748b',
};

const BROWSER_ICONS = {
  Chrome: '🌐',
  Safari: '🧭',
  Firefox: '🦊',
  Edge: '🔷',
  Opera: '🔴',
  Unknown: '❓',
};

export default function BrowserAnalyticsCard({ browserSummary }) {
  if (!browserSummary || Object.keys(browserSummary).length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-white">Browser Analytics</h3>
        <p className="text-sm text-slate-400">No browser data available yet.</p>
      </div>
    );
  }

  const total = Object.values(browserSummary).reduce((a, b) => a + b, 0);
  const entries = Object.entries(browserSummary).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <h3 className="mb-5 text-base font-semibold text-white">Browser Analytics</h3>
      <div className="space-y-4">
        {entries.map(([browser, count]) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
          return (
            <div key={browser}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-200">
                  <span>{BROWSER_ICONS[browser] || '🌐'}</span>
                  {browser}
                </span>
                <span className="font-semibold text-white">
                  {count.toLocaleString()} <span className="text-xs font-normal text-slate-400">({pct}%)</span>
                </span>
              </div>
              <PercentBar percent={Number(pct)} color={BROWSER_COLORS[browser] || '#64748b'} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
