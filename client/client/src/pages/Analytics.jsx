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

function formatDateLabel(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString + 'T00:00:00')
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date)
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'No recent clicks'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function Analytics() {
  const { shortCode } = useParams()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFilter, setDateFilter] = useState('7d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [copied, setCopied] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Construct short URL path
  const shortUrl = `${window.location.origin}/${shortCode}`

  useEffect(() => {
    let isMounted = true

    async function loadAnalytics() {
      // Do not fetch custom range until both start and end dates are picked
      if (dateFilter === 'custom' && (!customFrom || !customTo)) {
        return
      }

      setLoading(true)
      setError('')
      try {
        const params = dateFilter === 'custom'
          ? { from: customFrom, to: customTo }
          : { range: dateFilter }

        const response = await fetchAnalytics(shortCode, params)
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
  }, [shortCode, dateFilter, customFrom, customTo, retryTrigger])

  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore clipboard failures silently
    }
  }

  // Helper mock range dates display helper
  const getMockDateRange = () => {
    const today = new Date()
    const options = { month: 'short', day: '2-digit', year: 'numeric' }
    
    if (dateFilter === 'today') {
      return today.toLocaleDateString(undefined, options)
    }
    
    const pastDate = new Date()
    if (dateFilter === '7d') {
      pastDate.setDate(today.getDate() - 7)
    } else if (dateFilter === '30d') {
      pastDate.setDate(today.getDate() - 30)
    } else if (dateFilter === 'custom') {
      if (customFrom && customTo) {
        return `${formatDateLabel(customFrom)} → ${formatDateLabel(customTo)}`
      }
      return 'Select custom start & end dates'
    }
    
    return `${pastDate.toLocaleDateString(undefined, options)} → ${today.toLocaleDateString(undefined, options)}`
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Header / Navbar (Contains Hamburger drawer navigation) */}
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Title Block & Date Filter Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Link Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Insights and logs for <span className="font-mono text-cyan-300 font-semibold">{shortCode}</span>
            </p>
          </div>

          {/* Date Filter selector dropdown */}
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="relative inline-block w-full sm:w-48">
              <select
                value={dateFilter}
                disabled={loading && dateFilter !== 'custom'}
                onChange={(e) => {
                  setDateFilter(e.target.value)
                  if (e.target.value !== 'custom') {
                    setCustomFrom('')
                    setCustomTo('')
                  }
                }}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <span className="text-xs">▼</span>
              </div>
            </div>
            
            <div className="text-xs font-semibold text-slate-400">
              Range: <span className="text-cyan-300">{getMockDateRange()}</span>
            </div>
          </div>
        </div>

        {/* Custom Range calendar pickers */}
        {dateFilter === 'custom' && (
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Start Date</span>
              <input 
                type="date"
                value={customFrom}
                disabled={loading}
                onChange={(e) => setCustomFrom(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60" 
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">End Date</span>
              <input 
                type="date" 
                value={customTo}
                disabled={loading}
                onChange={(e) => setCustomTo(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60" 
              />
            </label>
          </div>
        )}

        {loading ? (
          /* Loading State: Skeleton Loader + inline stability */
          <div className="space-y-6 animate-pulse">
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-3xl border border-white/5 bg-slate-900/40 p-5">
                  <div className="h-4 w-24 rounded bg-slate-800"></div>
                  <div className="mt-4 h-8 w-16 rounded bg-slate-800"></div>
                  <div className="mt-2 h-4 w-32 rounded bg-slate-800"></div>
                </div>
              ))}
            </div>
            <div className="h-64 rounded-3xl border border-white/5 bg-slate-900/40"></div>
          </div>
        ) : error ? (
          /* Error State with Retry option */
          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 text-center sm:p-8">
            <p className="text-base font-semibold text-rose-300">Analytics Error</p>
            <p className="mt-2 text-sm text-slate-300">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
              >
                Retry Request
              </button>
              <Link
                to="/"
                className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                Return to dashboard
              </Link>
            </div>
          </section>
        ) : (
          /* Loaded state content */
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-medium text-slate-400">Total clicks</p>
                <p className="mt-3 text-3xl font-semibold text-white">{data.totalClickCount}</p>
                <p className="mt-2 text-xs text-slate-500">Cumulative redirects processed</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-medium text-slate-400">Last visit</p>
                <p className="mt-3 text-2xl font-semibold text-white truncate" title={formatDate(data.lastVisitedTime)}>
                  {data.lastVisitedTime ? formatDate(data.lastVisitedTime) : 'Never'}
                </p>
                <p className="mt-2 text-xs text-slate-500">Exact date and time of latest visit</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-medium text-slate-400">Recent activity</p>
                <p className="mt-3 text-3xl font-semibold text-white truncate">
                  {data.lastVisitedTime ? formatRelativeTime(data.lastVisitedTime) : 'No activity'}
                </p>
                <p className="mt-2 text-xs text-slate-500">Time elapsed since latest click</p>
              </article>
            </div>

            {/* Visits History Data Section */}
            <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-semibold text-white">Recent visit history</h2>
                <span className="text-xs text-slate-400">Showing last 10 entries</span>
              </div>

              {!data.recentVisitHistory || data.recentVisitHistory.length === 0 ? (
                /* Empty state panel */
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <span className="text-4xl" role="img" aria-label="empty">📊</span>
                  <h3 className="mt-4 text-base font-semibold text-white">No clicks recorded yet</h3>
                  <p className="mt-1 max-w-sm text-sm text-slate-400">
                    Share your short URL to start gathering visitor clicks and logs.
                  </p>
                  
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <p className="font-mono text-xs text-cyan-300 break-all">{shortUrl}</p>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="rounded-full bg-cyan-400 px-6 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                      {copied ? 'Copied!' : 'Copy Short Link'}
                    </button>
                  </div>
                </div>
              ) : (
                /* History logs table */
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
