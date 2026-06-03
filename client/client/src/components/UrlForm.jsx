import { useState } from 'react'

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export default function UrlForm({ isAuthenticated, isSubmitting, onSubmit, onAuthRequired }) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedUrl = originalUrl.trim()

    if (!trimmedUrl) {
      setValidationError('Enter a URL to shorten.')
      return
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      setValidationError('Enter a valid http:// or https:// URL.')
      return
    }

    setValidationError('')

    if (!isAuthenticated) {
      onAuthRequired('Please sign in to continue')
      return
    }

    await onSubmit(trimmedUrl)
    setOriginalUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/40 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Create URL</h2>
        <p className="mt-1 text-sm text-slate-400">
          Shorten a long link in seconds.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex-1">
          <span className="sr-only">Long URL</span>
          <input
            type="url"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            disabled={isSubmitting}
            placeholder="https://example.com/your-long-link"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </div>

      {validationError ? (
        <p className="mt-3 text-sm text-rose-300">{validationError}</p>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          Supported: http:// and https://
        </p>
      )}
    </form>
  )
}
