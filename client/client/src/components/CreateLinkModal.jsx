import { useEffect, useRef, useState, useCallback } from 'react'
import { createShortUrl } from '../services/url.api'

// ─── Constants ───────────────────────────────────────────────────────────────
const STEPS = ['Destination', 'Advanced', 'Creating', 'Complete']
const RESERVED_ALIASES = ['api', 'login', 'signup', 'analytics', 'assets', 'dashboard']

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function validateAlias(alias) {
  if (!alias) return { valid: true, message: '' }
  if (!/^[A-Za-z0-9\-_]+$/.test(alias))
    return { valid: false, message: 'Only letters, numbers, hyphens, and underscores allowed.' }
  if (alias.length < 3 || alias.length > 30)
    return { valid: false, message: 'Alias must be 3–30 characters.' }
  if (RESERVED_ALIASES.includes(alias.toLowerCase()))
    return { valid: false, message: 'This alias is reserved for system use.' }
  return { valid: true, message: '' }
}

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(value) {
  if (!value) return null
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ currentIndex }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1.5 mb-3">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i <= currentIndex
                ? '#22d3ee'           // cyan-400
                : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className="text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300"
            style={{ color: i <= currentIndex ? '#22d3ee' : 'rgba(255,255,255,0.2)' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Step 1: Destination ─────────────────────────────────────────────────────
function DestinationStep({ url, setUrl, onCancel, onContinue }) {
  const inputRef = useRef(null)
  const trimmed = url.trim()
  const isEmpty = !trimmed
  const isValid = !isEmpty && isValidHttpUrl(trimmed)
  const showError = !isEmpty && !isValid

  useEffect(() => { inputRef.current?.focus() }, [])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setUrl(text.trim())
    } catch { /* silently ignore */ }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) { e.preventDefault(); onContinue() }
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-white">Long URL</span>
        </label>

        <div className={`flex items-center gap-2 rounded-xl border bg-slate-950 px-3 py-2.5 transition-all duration-200 ${
          showError
            ? 'border-rose-500/40 focus-within:border-rose-400/60 focus-within:ring-2 focus-within:ring-rose-500/15'
            : 'border-white/10 focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/20'
        }`}>
          <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>

          <input
            ref={inputRef}
            id="create-link-url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/your-long-url"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.5 3a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h5zM5 1a2 2 0 00-2 2v1H2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H9V3a2 2 0 00-2-2H5zm0 1h2a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
            </svg>
            Paste
          </button>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 min-h-[20px]">
          {showError ? (
            <>
              <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-rose-400">Enter a valid http:// or https:// URL.</span>
            </>
          ) : isValid ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-emerald-400">URL looks good.</span>
            </>
          ) : (
            <span className="text-xs text-slate-500">We'll validate your destination before shortening.</span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </>
  )
}

// ─── Date Field ───────────────────────────────────────────────────────────────
function DateField({ id, label, value, onChange, min }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="ml-2 text-xs text-slate-500 font-normal">(Optional)</span>
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          className="date-input w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-8 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-2.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={`Clear ${label}`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Step 2: Advanced ────────────────────────────────────────────────────────
function AdvancedStep({ alias, setAlias, startDate, setStartDate, expiresAt, setExpiresAt, onBack, onCreateLink }) {
  const inputRef = useRef(null)
  const trimmedAlias = alias.trim()
  const aliasResult = validateAlias(trimmedAlias)

  const dateError =
    startDate && expiresAt && expiresAt <= startDate
      ? 'Expiry date must be after start date.'
      : null

  const canCreate = aliasResult.valid && !dateError

  useEffect(() => { inputRef.current?.focus() }, [])

  const today = todayString()
  const expiryMin = startDate || today

  return (
    <>
      {/* Custom Alias */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-white">Custom Alias</span>
          <span className="ml-2 text-xs text-slate-500 font-normal">(Optional)</span>
        </label>

        <div className={`flex items-center rounded-xl border bg-slate-950 overflow-hidden transition-all duration-200 ${
          trimmedAlias && !aliasResult.valid
            ? 'border-rose-500/40 focus-within:border-rose-400/60 focus-within:ring-2 focus-within:ring-rose-500/15'
            : 'border-white/10 focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/20'
        }`}>
          <span className="flex items-center px-3 border-r border-white/10 bg-white/5 text-xs text-slate-500 select-none font-mono whitespace-nowrap h-full py-2.5">
            {window.location.host}/
          </span>
          <input
            ref={inputRef}
            id="create-link-alias-input"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && canCreate) { e.preventDefault(); onCreateLink() } }}
            placeholder="e.g. portfolio, resume, github"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-mono"
          />
        </div>

        <div className="mt-2 min-h-[20px]">
          {trimmedAlias && !aliasResult.valid ? (
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-rose-400">{aliasResult.message}</span>
            </div>
          ) : trimmedAlias && aliasResult.valid ? (
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-emerald-400">{window.location.host}/{trimmedAlias}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Leave empty to auto-generate a short code.</span>
          )}
        </div>
      </div>

      {/* Link Schedule */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-white">Link Schedule</p>
          <p className="text-xs text-slate-500 mt-0.5">Control when your link is active</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateField
            id="create-link-start-date"
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            min={today}
          />
          <DateField
            id="create-link-expiry-date"
            label="Expiry Date"
            value={expiresAt}
            onChange={setExpiresAt}
            min={expiryMin}
          />
        </div>

        {dateError && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2">
            <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-rose-400">{dateError}</span>
          </div>
        )}
      </div>

      {/* Password Protection — Coming Soon */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 opacity-50 cursor-not-allowed select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Password Protection</p>
              <p className="text-xs text-slate-600">Require a password to access</p>
            </div>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          Back
        </button>
        <button
          id="create-link-submit-btn"
          type="button"
          onClick={onCreateLink}
          disabled={!canCreate}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Link
        </button>
      </div>
    </>
  )
}

// ─── Step 3: Creating ────────────────────────────────────────────────────────
function CreatingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin"
          style={{ borderTopColor: '#22d3ee', borderRightColor: '#22d3ee' }}
        />
      </div>
      <p className="mt-6 text-base font-semibold text-white">Creating Smart Link…</p>
      <p className="mt-2 text-sm text-slate-400">This will only take a moment.</p>
    </div>
  )
}

// ─── Step 4: Success ─────────────────────────────────────────────────────────
function SuccessStep({ result, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch { /* silently ignore */ }
  }

  const startDateFormatted = formatDate(result.startDate)
  const expiresAtFormatted = formatDate(result.expiresAt)

  return (
    <div className="flex flex-col items-center text-center py-4">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
        <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-bold text-white">Link Created!</h3>
      <p className="mt-1 text-sm text-slate-400">Your Smart Link is ready to share.</p>

      {/* Short URL */}
      <div className="mt-5 w-full rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Your Short Link</p>
        <p className="text-sm font-mono font-semibold text-cyan-300 break-all">{result.shortUrl}</p>
      </div>

      {/* Date metadata — only when set */}
      {(startDateFormatted || expiresAtFormatted) && (
        <div className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left space-y-2">
          {startDateFormatted && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Active from</span>
              <span className="text-xs font-medium text-slate-300">{startDateFormatted}</span>
            </div>
          )}
          {expiresAtFormatted && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Expires</span>
              <span className="text-xs font-medium text-slate-300">{expiresAtFormatted}</span>
            </div>
          )}
        </div>
      )}

      {/* Destination */}
      <div className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">Destination</p>
        <p className="text-xs text-slate-400 break-all truncate">{result.originalUrl}</p>
      </div>

      {/* Actions */}
      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-400/20 active:scale-[0.98]"
        >
          {copied ? (
            <><svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>Copied!</>
          ) : (
            <><svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>Copy URL</>
          )}
        </button>

        <button
          type="button"
          onClick={() => window.open(result.shortUrl, '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
          </svg>
          Open URL
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-3 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  )
}

// ─── Error View ──────────────────────────────────────────────────────────────
function ErrorView({ message, onRetry, onBack }) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-rose-400/20 bg-rose-500/10">
        <svg className="h-7 w-7 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">Unable to create link</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-xs">{message}</p>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          Go Back
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98]"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function CreateLinkModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(0)
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [startDate, setStartDate] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const backdropRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setStep(0); setUrl(''); setAlias('')
      setStartDate(''); setExpiresAt('')
      setResult(null); setError('')
    }
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape' && step !== 2) handleClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, step])

  const handleClose = useCallback(() => {
    if (step === 2) return
    if (result) onCreated?.(result)
    onClose()
  }, [step, result, onCreated, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current && step !== 2) handleClose()
  }

  const handleCreateLink = async () => {
    setStep(2)
    setError('')
    try {
      const payload = { originalUrl: url.trim() }
      const trimmedAlias = alias.trim()
      if (trimmedAlias) payload.customAlias = trimmedAlias
      if (startDate) payload.startDate = new Date(startDate).toISOString()
      if (expiresAt) {
        const exp = new Date(expiresAt)
        exp.setHours(23, 59, 59, 999)
        payload.expiresAt = exp.toISOString()
      }
      const created = await createShortUrl(payload)
      setResult(created)
      setStep(3)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  if (!isOpen) return null

  const progressIndex = error ? 2 : step

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
      style={{ animation: 'fadeIn 200ms ease-out' }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/50"
        style={{ animation: 'slideUp 300ms ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Smart Link Studio
              </span>
            </div>
            {step !== 2 && (
              <button
                type="button"
                onClick={handleClose}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Create Smart Link</h2>

          <div className="mt-5">
            <StepIndicator currentIndex={progressIndex} />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {error ? (
            <ErrorView message={error} onRetry={() => { setError(''); handleCreateLink() }} onBack={() => { setError(''); setStep(1) }} />
          ) : step === 0 ? (
            <DestinationStep url={url} setUrl={setUrl} onCancel={handleClose} onContinue={() => setStep(1)} />
          ) : step === 1 ? (
            <AdvancedStep
              alias={alias} setAlias={setAlias}
              startDate={startDate} setStartDate={setStartDate}
              expiresAt={expiresAt} setExpiresAt={setExpiresAt}
              onBack={() => setStep(0)}
              onCreateLink={handleCreateLink}
            />
          ) : step === 2 ? (
            <CreatingStep />
          ) : (
            <SuccessStep result={result} onClose={handleClose} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
          cursor: pointer;
          opacity: 0.5;
        }
        .date-input::-webkit-calendar-picker-indicator:hover { opacity: 0.9; }
      `}</style>
    </div>
  )
}
