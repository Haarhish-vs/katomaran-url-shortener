function formatDate(value) {
  if (!value) return 'Unknown date'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function UrlTable({
  urls,
  isAuthenticated,
  activeActionId,
  onCopy,
  onDelete,
  onOpenAnalytics,
  onAuthRequired,
}) {
  if (!isAuthenticated) {
    return (
      <section className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300 sm:p-8">
        <p className="text-base font-semibold text-white">URL management</p>
        <p className="mt-2 max-w-2xl text-slate-400">
          Sign in to view, copy, delete, and inspect your personal URLs.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onAuthRequired('Please sign in to continue')}
            className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
          >
            Signup to manage links
          </button>
          <button
            type="button"
            onClick={() => onAuthRequired('Please sign in to continue')}
            className="rounded-full border border-white/10 px-4 py-2 font-semibold text-white"
          >
            Login to continue
          </button>
        </div>
      </section>
    )
  }

  if (!urls.length) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300 sm:p-8">
        <p className="text-base font-semibold text-white">URL management</p>
        <p className="mt-2 text-slate-400">
          No links yet. Create your first short URL above.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">URL management</h2>
          <p className="mt-1 text-sm text-slate-400">Your latest links sorted by creation date.</p>
        </div>
        <p className="text-sm text-slate-500">{urls.length} active links</p>
      </div>

      <div className="mt-5 grid gap-4">
        {urls.map((url) => (
          <article key={url.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                  Original URL
                </p>
                <p className="mt-2 break-words text-sm text-slate-200" title={url.originalUrl}>
                  {url.originalUrl}
                </p>

                <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                  <div>
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">
                      Short URL
                    </span>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block break-all text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      {url.shortUrl}
                    </a>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">
                      Created
                    </span>
                    <p className="mt-1 text-slate-200">{formatDate(url.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="grid min-w-[220px] gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Clicks</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{url.totalClicks}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-start">
                  <button
                    type="button"
                    onClick={() => onCopy(url.shortUrl)}
                    className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAnalytics(url.shortCode)}
                    className="rounded-full border border-cyan-400/30 px-3 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/10"
                  >
                    Analytics
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(url)}
                    disabled={activeActionId === url.id}
                    className="rounded-full border border-rose-400/30 px-3 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {activeActionId === url.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
