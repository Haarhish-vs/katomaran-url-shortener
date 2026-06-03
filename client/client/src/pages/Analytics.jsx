import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchAnalytics } from '../services/analytics.api'

function formatDate(value) {
  if (!value) return 'Never'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function Analytics() {
  const { shortCode } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAnalytics() {
      setLoading(true)
      setError('')
      try {
        const response = await fetchAnalytics(shortCode)
        if (isMounted) {
          setData(response)
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Unable to retrieve analytics data.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (shortCode) {
      loadAnalytics()
    }

    return () => {
      isMounted = false
    }
  }, [shortCode])

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              <span aria-hidden="true">←</span> Back to Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Link Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Detailed tracking data for short code:{' '}
              <span className="font-mono text-cyan-300 font-semibold">{shortCode}</span>
            </p>
          </div>
        </div>

        {loading ? (
          /* Loading State: Skeleton Loader */
          <div className="space-y-6 animate-pulse">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-32 rounded-3xl border border-white/5 bg-slate-900/40 p-5">
                <div className="h-4 w-24 rounded bg-slate-800"></div>
                <div className="mt-4 h-8 w-16 rounded bg-slate-800"></div>
                <div className="mt-2 h-4 w-32 rounded bg-slate-800"></div>
              </div>
              <div className="h-32 rounded-3xl border border-white/5 bg-slate-900/40 p-5">
                <div className="h-4 w-32 rounded bg-slate-800"></div>
                <div className="mt-4 h-8 w-48 rounded bg-slate-800"></div>
                <div className="mt-2 h-4 w-24 rounded bg-slate-800"></div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-5">
              <div className="h-6 w-36 rounded bg-slate-800"></div>
              <div className="mt-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-3">
                    <div className="h-4 w-20 rounded bg-slate-800"></div>
                    <div className="h-4 w-40 rounded bg-slate-800"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 text-center sm:p-8">
            <p className="text-base font-semibold text-rose-300">Analytics Error</p>
            <p className="mt-2 text-sm text-slate-300">{error}</p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
            >
              Return to dashboard
            </Link>
          </section>
        ) : (
          /* Loaded Content */
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-medium text-slate-400">Total clicks</p>
                <p className="mt-3 text-3xl font-semibold text-white">{data.totalClickCount}</p>
                <p className="mt-2 text-sm text-slate-500">Cumulative visits recorded</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-medium text-slate-400">Last visited</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {data.lastVisitedTime ? formatDate(data.lastVisitedTime) : 'Never'}
                </p>
                <p className="mt-2 text-sm text-slate-500">Most recent user click timestamp</p>
              </article>
            </div>

            {/* Recent Visits History */}
            <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-semibold text-white">Recent visit history</h2>
                <span className="text-xs text-slate-400">Showing last 10 clicks</span>
              </div>

              {!data.recentVisitHistory || data.recentVisitHistory.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No clicks recorded yet. Share this short URL to start gathering visitor analytics.
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="py-3 pr-4">Click #</th>
                        <th className="py-3">Visited at</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.recentVisitHistory.map((visit, index) => (
                        <tr key={visit.id}>
                          <td className="py-3.5 pr-4 font-mono font-medium text-cyan-300">
                            #{data.recentVisitHistory.length - index}
                          </td>
                          <td className="py-3.5 text-slate-200">
                            {formatDate(visit.clickedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
