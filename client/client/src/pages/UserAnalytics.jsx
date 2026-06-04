import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AnalyticsSummaryCards, { AnalyticsSummarySkeleton } from '../components/analytics/AnalyticsSummaryCards';
import AnalyticsSummaryError from '../components/analytics/AnalyticsSummaryError';
import AnalyticsTimelineChart, { AnalyticsTimelineSkeleton } from '../components/analytics/AnalyticsTimelineChart';
import AnalyticsTopUrls from '../components/analytics/AnalyticsTopUrls';
import UserAnalyticsRecentActivity from '../components/analytics/UserAnalyticsRecentActivity';
import DeviceAnalyticsCard from '../components/analytics/DeviceAnalyticsCard';
import BrowserAnalyticsCard from '../components/analytics/BrowserAnalyticsCard';
import LocationAnalyticsCard from '../components/analytics/LocationAnalyticsCard';
import { fetchUserAnalytics } from '../services/analytics.api';

function formatDateLabel(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}

function buildFilterParams(dateFilter, customFrom, customTo) {
  if (dateFilter === 'custom') {
    return { from: customFrom, to: customTo };
  }
  return { range: dateFilter };
}

export default function UserAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('7d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadUserAnalytics() {
      if (dateFilter === 'custom' && (!customFrom || !customTo)) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const params = buildFilterParams(dateFilter, customFrom, customTo);
        const response = await fetchUserAnalytics(params);
        if (isMounted) {
          setData(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Unable to retrieve user analytics.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUserAnalytics();

    return () => {
      isMounted = false;
    };
  }, [dateFilter, customFrom, customTo, retryTrigger]);

  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1);
  };

  const getMockDateRange = () => {
    const today = new Date();
    const options = { month: 'short', day: '2-digit', year: 'numeric' };

    if (dateFilter === 'today') {
      return today.toLocaleDateString(undefined, options);
    }

    const pastDate = new Date();
    if (dateFilter === '7d') {
      pastDate.setDate(today.getDate() - 7);
    } else if (dateFilter === '30d') {
      pastDate.setDate(today.getDate() - 30);
    } else if (dateFilter === 'custom') {
      if (customFrom && customTo) {
        return `${formatDateLabel(customFrom)} → ${formatDateLabel(customTo)}`;
      }
      return 'Select custom start & end dates';
    }

    return `${pastDate.toLocaleDateString(undefined, options)} → ${today.toLocaleDateString(undefined, options)}`;
  };

  const isSummaryEmpty =
    data?.summary &&
    data.summary.totalUrls === 0 &&
    data.summary.totalClicks === 0 &&
    !data.summary.lastVisit;

  const isTimelineEmpty =
    data &&
    (!data.timeline || data.timeline.length === 0 || data.timeline.every((d) => d.clicks === 0));

  const showCustomRangePlaceholder = dateFilter === 'custom' && (!customFrom || !customTo);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Analytics Overview
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track performance of your shortened URLs and audience engagement.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="relative inline-block w-full sm:w-48">
              <select
                value={dateFilter}
                disabled={loading && dateFilter !== 'custom'}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  if (e.target.value !== 'custom') {
                    setCustomFrom('');
                    setCustomTo('');
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
                disabled={loading}
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
                disabled={loading}
                onChange={(e) => setCustomTo(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
        )}

        {showCustomRangePlaceholder ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            Select a start and end date to load analytics.
          </div>
        ) : loading ? (
          <div className="space-y-6">
            <AnalyticsSummarySkeleton />
            <AnalyticsTimelineSkeleton />
            <div className="h-64 rounded-3xl border border-white/5 bg-slate-900/40 animate-pulse" />
          </div>
        ) : error ? (
          <AnalyticsSummaryError message={error} onRetry={handleRetry} />
        ) : (
          <div className="space-y-6">
            <AnalyticsSummaryCards summary={data.summary} isEmpty={isSummaryEmpty} />
            
            <AnalyticsTimelineChart 
              data={data} 
              isEmpty={isTimelineEmpty} 
              onRetry={handleRetry} 
              error={error} 
            />

            <AnalyticsTopUrls urls={data.topUrls} />

            <div className="grid gap-6 md:grid-cols-2">
              <DeviceAnalyticsCard deviceSummary={data.deviceSummary} />
              <BrowserAnalyticsCard browserSummary={data.browserSummary} />
            </div>

            <LocationAnalyticsCard locationSummary={data.locationSummary} />
            
            <UserAnalyticsRecentActivity activities={data.recentActivity} />
          </div>
        )}
      </main>
    </div>
  );
}
