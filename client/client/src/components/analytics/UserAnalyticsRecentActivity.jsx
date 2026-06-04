import { Link } from 'react-router-dom';

function formatDate(value) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function UserAnalyticsRecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Recent Visit History</h2>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <span className="text-4xl" role="img" aria-label="empty">🕒</span>
          <h3 className="mt-4 text-base font-semibold text-white">No recent activity</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Share your links to start tracking visits across your workspace.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold text-white">Recent Visit History</h2>
        <span className="text-xs text-slate-400">
          Showing latest clicks
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 pr-4">Time</th>
              <th className="py-3 pr-4">Short URL</th>
              <th className="py-3 pr-4">Original URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {activities.map((visit) => (
              <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 pr-4 text-slate-200 whitespace-nowrap">
                  {formatDate(visit.clickedAt)}
                </td>
                <td className="py-3.5 pr-4 font-mono font-medium text-cyan-300">
                  {visit.url ? (
                    <Link to={`/analytics/${visit.url.shortCode}`} className="hover:underline">
                      /{visit.url.shortCode}
                    </Link>
                  ) : (
                    <span className="text-slate-500">Deleted URL</span>
                  )}
                </td>
                <td className="py-3.5 pr-4">
                  <div className="max-w-[200px] truncate sm:max-w-xs md:max-w-md">
                    {visit.url?.originalUrl || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
