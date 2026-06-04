import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AnalyticsSummaryCards, { AnalyticsSummarySkeleton } from '../components/analytics/AnalyticsSummaryCards'
import AnalyticsSummaryError from '../components/analytics/AnalyticsSummaryError'
import AnalyticsTimelineChart, { AnalyticsTimelineSkeleton } from '../components/analytics/AnalyticsTimelineChart'
import DeviceAnalyticsCard from '../components/analytics/DeviceAnalyticsCard'
import BrowserAnalyticsCard from '../components/analytics/BrowserAnalyticsCard'
import LocationAnalyticsCard from '../components/analytics/LocationAnalyticsCard'
import { fetchAnalytics, fetchAnalyticsSummary } from '../services/analytics.api'

const FLAG_MAP = {
  US: '🇺🇸', IN: '🇮🇳', GB: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵',
  AU: '🇦🇺', BR: '🇧🇷', KR: '🇰🇷', CN: '🇨🇳', RU: '🇷🇺', IT: '🇮🇹', ES: '🇪🇸',
  MX: '🇲🇽', NL: '🇳🇱', SE: '🇸🇪', SG: '🇸🇬', AE: '🇦🇪', ZA: '🇿🇦',
};

function getFlag(countryCode) {
  if (!countryCode) return '🌐';
  return FLAG_MAP[countryCode.toUpperCase()] || '🌐';
}

const DEVICE_ICON = {
  Desktop: '🖥️',
  Mobile: '📱',
  Tablet: '📟',
};

function getDeviceIcon(deviceType) {
  return DEVICE_ICON[deviceType] || '❓';
}

function formatLocation(visit) {
  const parts = [];
  if (visit.city) parts.push(visit.city);
  if (visit.country) parts.push(visit.country);
  return parts.length > 0 ? parts.join(', ') : '—';
}

function formatDeviceBrowser(visit) {
  const browser = visit.browser && visit.browser !== 'Unknown' ? visit.browser : null;
  const os = visit.operatingSystem && visit.operatingSystem !== 'Unknown' ? visit.operatingSystem : null;
  if (browser && os) return `${browser} / ${os}`;
  if (browser) return browser;
  if (os) return os;
  return '—';
}

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

function buildFilterParams(dateFilter, customFrom, customTo) {
  if (dateFilter === 'custom') {
    return { from: customFrom, to: customTo }
  }
  return { range: dateFilter }
}

export default function Analytics() {
  const { shortCode } = useParams()

  const [data, setData] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [error, setError] = useState('')
  const [summaryError, setSummaryError] = useState('')
  const [dateFilter, setDateFilter] = useState('7d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [copied, setCopied] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [summaryRetryTrigger, setSummaryRetryTrigger] = useState(0)

  const shortUrl = `${window.location.origin}/${shortCode}`

  useEffect(() => {
    let isMounted = true

    async function loadSummary() {
      if (dateFilter === 'custom' && (!customFrom || !customTo)) {
        return
      }

      setSummaryLoading(true)
      setSummaryError('')

      try {
        const params = buildFilterParams(dateFilter, customFrom, customTo)
        const response = await fetchAnalyticsSummary(params)
        if (isMounted) {
          setSummary(response)
        }
      } catch (err) {
        if (isMounted) {
          setSummary(null)
          setSummaryError(err?.response?.data?.message || 'Unable to load analytics summary.')
        }
      } finally {
        if (isMounted) {
          setSummaryLoading(false)
        }
      }
    }

    if (shortCode) {
      loadSummary()
    }

    return () => {
      isMounted = false
    }
  }, [shortCode, dateFilter, customFrom, customTo, summaryRetryTrigger])

  useEffect(() => {
    let isMounted = true

    async function loadAnalytics() {
      if (dateFilter === 'custom' && (!customFrom || !customTo)) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const params = buildFilterParams(dateFilter, customFrom, customTo)
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

  const handleSummaryRetry = () => {
    setSummaryRetryTrigger((prev) => prev + 1)
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

  const isSummaryEmpty =
    summary &&
    summary.totalUrls === 0 &&
    summary.totalClicks === 0 &&
    !summary.lastVisit

  const isTimelineEmpty = 
    data && 
    (!data.timeline || data.timeline.length === 0 || data.timeline.every(d => d.clicks === 0))

  const showCustomRangePlaceholder = dateFilter === 'custom' && (!customFrom || !customTo)

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
              Insights and logs for <span className="font-mono font-semibold text-cyan-300">{shortCode}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="relative inline-block w-full sm:w-48">
              <select
                value={dateFilter}
                disabled={(summaryLoading || loading) && dateFilter !== 'custom'}
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

        {dateFilter === 'custom' && (
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Start Date</span>
              <input
                type="date"
                value={customFrom}
                disabled={summaryLoading || loading}
                onChange={(e) => setCustomFrom(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">End Date</span>
              <input
                type="date"
                value={customTo}
                disabled={summaryLoading || loading}
                onChange={(e) => setCustomTo(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
        )}

        <section aria-label="Analytics summary" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Account summary</h2>
            <span className="text-xs text-slate-500">Filtered by selected range where applicable</span>
          </div>

          {showCustomRangePlaceholder ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
              Select a start and end date to load analytics summary.
            </div>
          ) : summaryLoading ? (
            <AnalyticsSummarySkeleton />
          ) : summaryError ? (
            <AnalyticsSummaryError message={summaryError} onRetry={handleSummaryRetry} />
          ) : (
            <AnalyticsSummaryCards summary={summary} isEmpty={isSummaryEmpty} />
          )}
        </section>

        {showCustomRangePlaceholder ? null : loading ? (
          <div className="space-y-6 animate-pulse">
            <AnalyticsTimelineSkeleton />
            <div className="h-64 rounded-3xl border border-white/5 bg-slate-900/40" />
          </div>
        ) : error ? (
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
          <div className="space-y-6">
            <AnalyticsTimelineChart 
              data={data} 
              isEmpty={isTimelineEmpty} 
              onRetry={handleRetry} 
              error={error} 
            />

            <div className="grid gap-6 md:grid-cols-2">
              <DeviceAnalyticsCard deviceSummary={data?.deviceSummary} />
              <BrowserAnalyticsCard browserSummary={data?.browserSummary} />
            </div>

            <LocationAnalyticsCard locationSummary={data?.locationSummary} />
            
            <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold text-white">Recent visit history</h2>
              <span className="text-xs text-slate-400">
                {data?.totalClickCount ?? 0} clicks in range · showing last 10
              </span>
            </div>

            {!data?.recentVisitHistory || data.recentVisitHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <span className="text-4xl" role="img" aria-label="empty">📊</span>
                <h3 className="mt-4 text-base font-semibold text-white">No clicks recorded yet</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Share your short URL to start gathering visitor clicks and logs.
                </p>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="break-all font-mono text-xs text-cyan-300">{shortUrl}</p>
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
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-3 pr-4">Click #</th>
                      <th className="py-3 pr-4">Visited at</th>
                      <th className="py-3 pr-4">Location</th>
                      <th className="py-3">Device / Browser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.recentVisitHistory.map((visit, index) => (
                      <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 pr-4 font-mono font-medium text-cyan-300">
                          #{data.recentVisitHistory.length - index}
                        </td>
                        <td className="py-3.5 pr-4 text-slate-200 whitespace-nowrap">{formatDate(visit.clickedAt)}</td>
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <span className="mr-1.5">{getFlag(visit.country)}</span>
                          {formatLocation(visit)}
                        </td>
                        <td className="py-3.5 whitespace-nowrap">
                          <span className="mr-1.5">{getDeviceIcon(visit.deviceType)}</span>
                          {formatDeviceBrowser(visit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
