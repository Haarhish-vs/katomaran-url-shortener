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

const DEVICE_COLORS = {
  Desktop: '#22d3ee',
  Mobile: '#a78bfa',
  Tablet: '#f59e0b',
  Unknown: '#64748b',
};

const DEVICE_ICONS = {
  Desktop: '🖥️',
  Mobile: '📱',
  Tablet: '📟',
  Unknown: '❓',
};

export default function DeviceAnalyticsCard({ deviceSummary }) {
  if (!deviceSummary || Object.keys(deviceSummary).length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-white">Device Analytics</h3>
        <p className="text-sm text-slate-400">No device data available yet.</p>
      </div>
    );
  }

  const total = Object.values(deviceSummary).reduce((a, b) => a + b, 0);
  const entries = Object.entries(deviceSummary).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <h3 className="mb-5 text-base font-semibold text-white">Device Analytics</h3>
      <div className="space-y-4">
        {entries.map(([device, count]) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
          return (
            <div key={device}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-200">
                  <span>{DEVICE_ICONS[device] || '❓'}</span>
                  {device}
                </span>
                <span className="font-semibold text-white">
                  {count.toLocaleString()} <span className="text-xs font-normal text-slate-400">({pct}%)</span>
                </span>
              </div>
              <PercentBar percent={Number(pct)} color={DEVICE_COLORS[device] || '#64748b'} />
            </div>
          );
        })}
      </div>
    </div>
  );
}


