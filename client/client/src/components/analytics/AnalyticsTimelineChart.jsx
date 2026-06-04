import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function AnalyticsTimelineSkeleton() {
  return (
    <div className="h-72 w-full animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
      <div className="mb-6 h-5 w-48 rounded bg-white/10" />
      <div className="h-40 w-full rounded bg-white/5" />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(label + 'T00:00:00'));

    return (
      <div className="rounded-xl border border-white/10 bg-slate-900 p-3 shadow-xl">
        <p className="mb-1 text-xs font-medium text-slate-400">{formattedDate}</p>
        <p className="text-sm font-semibold text-cyan-400">
          {payload[0].value} {payload[0].value === 1 ? 'click' : 'clicks'}
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsTimelineChart({ data, isEmpty, onRetry, error }) {
  const timelineData = data?.timeline || [];

  const formattedData = useMemo(() => {
    return timelineData.map((item) => ({
      ...item,
      displayDate: new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
      }).format(new Date(item.date + 'T00:00:00')),
    }));
  }, [timelineData]);

  if (error) {
    return (
      <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 text-center sm:p-8">
        <p className="text-base font-semibold text-rose-300">Unable to load timeline analytics</p>
        <p className="mt-2 text-sm text-slate-300">{error}</p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-4xl" role="img" aria-label="empty">📈</span>
          <h3 className="mt-4 text-base font-semibold text-white">No click activity</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            No click activity found for selected range.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Clicks timeline</h2>
        <span className="text-xs text-slate-400">Chronological activity</span>
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
