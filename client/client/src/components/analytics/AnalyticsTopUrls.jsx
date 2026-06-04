import { Link } from 'react-router-dom';

function formatDate(value) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AnalyticsTopUrls({ urls }) {
  if (!urls || urls.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Top Performing URLs</h2>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <span className="text-4xl" role="img" aria-label="empty">🏆</span>
          <h3 className="mt-4 text-base font-semibold text-white">No URLs with clicks found</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Share your links to see your top performers.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold text-white">Top Performing URLs</h2>
        <span className="text-xs text-slate-400">
          Ranked by clicks
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 pr-4">Short URL</th>
              <th className="py-3 pr-4">Original URL</th>
              <th className="py-3 pr-4 text-right">Total Clicks</th>
              <th className="py-3 pr-4">Created Date</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {urls.map((url) => (
              <tr key={url.shortCode} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 pr-4 font-mono text-cyan-300">
                  <Link to={`/analytics/${url.shortCode}`} className="hover:underline">
                    /{url.shortCode}
                  </Link>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="max-w-[200px] truncate sm:max-w-xs md:max-w-md">
                    {url.originalUrl}
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-right font-semibold text-white">
                  {url.clicks.toLocaleString()}
                </td>
                <td className="py-3.5 pr-4 text-slate-400">
                  {formatDate(url.createdAt).split('at')[0]}
                </td>
                <td className="py-3.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      url.status === 'active'
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : url.status === 'scheduled'
                        ? 'bg-amber-400/10 text-amber-400'
                        : 'bg-rose-400/10 text-rose-400'
                    }`}
                  >
                    {url.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
