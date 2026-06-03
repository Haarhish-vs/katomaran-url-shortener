import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import UrlTable from '../components/UrlTable'
import CreateLinkModal from '../components/CreateLinkModal'
import { AuthContext } from '../context/AuthContext'
import { deleteShortUrl, getUserUrls } from '../services/url.api'

function formatDateTime(value) {
  if (!value) return '—'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getApiMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage
}

function Toast({ toast, onClose }) {
  if (!toast) return null

  const toneClasses =
    toast.variant === 'error'
      ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
      : 'border-[#D4A843]/30 bg-[#D4A843]/10 text-amber-50'

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(92vw,24rem)] rounded-2xl border p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:right-6 sm:top-6">
      <div className={`rounded-xl border p-4 ${toneClasses}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{toast.title}</p>
            <p className="mt-1 text-sm text-white/90">{toast.message}</p>
            {toast.actions ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
                >
                  Signup
                </Link>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-2 py-1 text-xs text-inherit/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)
  const [urls, setUrls] = useState([])
  const [isLoadingUrls, setIsLoadingUrls] = useState(false)
  const [activeActionId, setActiveActionId] = useState(null)
  const [pendingDeleteUrl, setPendingDeleteUrl] = useState(null)
  const [toast, setToast] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const visibleUrls = isAuthenticated ? urls : []
  const totalClicks = visibleUrls.reduce((sum, url) => sum + (url.totalClicks || 0), 0)
  const latestUrl = visibleUrls[0] || null
  const mostClickedUrl =
    [...visibleUrls].sort((left, right) => (right.totalClicks || 0) - (left.totalClicks || 0))[0] || null

  const summaryCards = [
    {
      label: 'Total URLs',
      value: isAuthenticated ? urls.length : 'Locked',
      hint: isAuthenticated ? 'Your saved links' : 'Sign in to view your links',
    },
    {
      label: 'Total Clicks',
      value: isAuthenticated ? totalClicks : 'Locked',
      hint: isAuthenticated ? 'All-time activity' : 'Sign in to view click totals',
    },
    {
      label: 'Analytics Summary',
      value: isAuthenticated ? (mostClickedUrl?.totalClicks || 0) : 'Locked',
      hint: isAuthenticated
        ? mostClickedUrl
          ? `Top link: ${mostClickedUrl.shortCode}`
          : 'Create a URL to see top-performer analytics'
        : 'Sign in to view analytics',
    },
  ]

  const analyticsPreview = [
    {
      label: 'Latest link',
      value: latestUrl ? latestUrl.shortCode : 'No data',
      hint: latestUrl ? formatDateTime(latestUrl.createdAt) : 'Create your first link to preview analytics',
    },
    {
      label: 'Top performer',
      value: mostClickedUrl ? `${mostClickedUrl.totalClicks} clicks` : 'No data',
      hint: mostClickedUrl ? mostClickedUrl.shortCode : 'Track clicks on your most-used link',
    },
    {
      label: 'Recent activity',
      value: latestUrl ? formatDateTime(latestUrl.createdAt) : 'No data',
      hint: 'Latest URL creation time',
    },
  ]

  useEffect(() => {
    if (!isAuthenticated) return undefined

    let isMounted = true

    async function loadUrls() {
      setIsLoadingUrls(true)

      try {
        const response = await getUserUrls()
        if (isMounted) {
          setUrls(response.urls || [])
        }
      } catch (error) {
        if (isMounted) {
          setToast({
            title: 'Unable to load URLs',
            message: getApiMessage(error, 'Please try again in a moment.'),
            variant: 'error',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingUrls(false)
        }
      }
    }

    loadUrls()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!toast) return undefined

    const timeoutId = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const openAuthToast = (message = 'Please sign in to continue') => {
    setToast({
      title: 'Authentication required',
      message,
      variant: 'error',
      actions: true,
    })
  }

  const showSuccessToast = (message) => {
    setToast({
      title: 'Success',
      message,
      variant: 'success',
    })
  }

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      openAuthToast('Please sign in to create a Smart Link')
      return
    }
    setIsModalOpen(true)
  }

  // Called when the modal closes after a successful creation
  const handleModalCreated = (createdUrl) => {
    if (createdUrl) {
      setUrls((prev) => [
        {
          id: createdUrl.id,
          originalUrl: createdUrl.originalUrl,
          shortCode: createdUrl.shortCode,
          shortUrl: createdUrl.shortUrl,
          startDate: createdUrl.startDate ?? null,
          expiresAt: createdUrl.expiresAt ?? null,
          isPasswordProtected: createdUrl.isPasswordProtected,
          createdAt: new Date().toISOString(),
          totalClicks: 0,
        },
        ...prev,
      ])
      showSuccessToast('Smart Link created successfully.')
    }
    setIsModalOpen(false)
  }

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      showSuccessToast('Short URL copied to clipboard.')
    } catch {
      setToast({
        title: 'Copy failed',
        message: 'Your browser blocked clipboard access.',
        variant: 'error',
      })
    }
  }

  const handleDelete = (url) => {
    if (!isAuthenticated) {
      openAuthToast('Please sign in to continue')
      return
    }

    setPendingDeleteUrl(url)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteUrl) return

    setActiveActionId(pendingDeleteUrl.id)

    try {
      await deleteShortUrl(pendingDeleteUrl.id)
      const response = await getUserUrls()
      setUrls(response.urls || [])
      showSuccessToast('URL deleted successfully.')
    } catch (error) {
      setToast({
        title: 'Delete failed',
        message: getApiMessage(error, 'Unable to delete the selected URL.'),
        variant: 'error',
      })
    } finally {
      setActiveActionId(null)
      setPendingDeleteUrl(null)
    }
  }

  const cancelDelete = () => {
    if (activeActionId) return
    setPendingDeleteUrl(null)
  }

  const handleOpenAnalytics = (shortCode) => {
    if (!isAuthenticated) {
      openAuthToast('Please sign in to continue')
      return
    }

    navigate(`/analytics/${shortCode}`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Create Smart Link Modal */}
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleModalCreated}
      />

      {/* Delete confirmation dialog */}
      {pendingDeleteUrl ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/50">
            <h3 className="text-lg font-semibold text-white">Delete URL</h3>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to delete this short URL?
            </p>
            <p className="mt-2 break-all text-sm text-cyan-300">{pendingDeleteUrl.shortUrl}</p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={Boolean(activeActionId)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(activeActionId)}
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeActionId ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin text-rose-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete URL'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ── Hero Create Button ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
          {/* Subtle ambient glow — matches slate palette */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Smart Link Studio
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
                Create Smart Links
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Shorten, schedule, and track your links in seconds.
              </p>
            </div>

            <button
              id="open-create-modal-btn"
              type="button"
              onClick={handleOpenModal}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-400/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Create Smart Link
            </button>
          </div>
        </section>

        {/* ── Summary Cards ─────────────────────────────────────────────────── */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <article key={`${card.label}-stat`} className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-sm font-medium text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
            </article>
          ))}
        </section>

        {/* ── URL Table ─────────────────────────────────────────────────────── */}
        {isLoadingUrls ? (
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
            Loading your URLs...
          </section>
        ) : (
          <UrlTable
            urls={visibleUrls}
            isAuthenticated={isAuthenticated}
            activeActionId={activeActionId}
            onCopy={handleCopy}
            onDelete={handleDelete}
            onOpenAnalytics={handleOpenAnalytics}
            onAuthRequired={openAuthToast}
          />
        )}

        {/* ── Analytics Preview ─────────────────────────────────────────────── */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">Analytics preview</h2>
              <p className="mt-1 text-sm text-slate-400">
                A quick snapshot of your most useful link data.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {isAuthenticated ? 'Personal data enabled' : 'Sign in to unlock personal analytics'}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {analyticsPreview.map((card) => (
              <article key={card.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm font-medium text-slate-400">{card.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
