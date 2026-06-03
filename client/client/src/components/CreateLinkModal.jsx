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
  if (!/^[A-Za-z0-9\-_]+$/.test(alias)) {
    return { valid: false, message: 'Only letters, numbers, hyphens, and underscores allowed.' }
  }
  if (alias.length < 3 || alias.length > 30) {
    return { valid: false, message: 'Alias must be 3–30 characters.' }
  }
  if (RESERVED_ALIASES.includes(alias.toLowerCase())) {
    return { valid: false, message: 'This alias is reserved for system use.' }
  }
  return { valid: true, message: '' }
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ currentIndex }) {
  return (
    <div className="mb-8">
      {/* Progress bars */}
      <div className="flex gap-1.5 mb-3">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i <= currentIndex
                ? 'linear-gradient(90deg, #D4A843, #C4983A)'
                : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
      {/* Labels */}
      <div className="flex justify-between">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className="text-[11px] font-semibold tracking-wider uppercase transition-colors duration-300"
            style={{ color: i <= currentIndex ? '#D4A843' : 'rgba(255,255,255,0.25)' }}
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

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setUrl(text.trim())
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault()
      onContinue()
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-white">Long URL</span>
        </label>

        <div
          className={`flex items-center gap-2 rounded-xl border bg-[#0A0908] px-3 py-2.5 transition-all duration-200 ${
            showError
              ? 'border-rose-500/40 focus-within:border-rose-400/60 focus-within:ring-2 focus-within:ring-rose-500/15'
              : 'border-white/[0.08] focus-within:border-[#D4A843]/40 focus-within:ring-2 focus-within:ring-[#D4A843]/10'
          }`}
        >
          {/* Link icon */}
          <svg
            className="h-4 w-4 shrink-0"
            style={{ color: showError ? '#f87171' : '#D4A843' }}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>

          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/your-long-url"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
          />

          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4A843]/10 px-3 py-1.5 text-xs font-semibold text-[#D4A843] transition-all hover:bg-[#D4A843]/20 active:scale-95"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.5 3a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h5zM5 1a2 2 0 00-2 2v1H2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H9V3a2 2 0 00-2-2H5zm0 1h2a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
            </svg>
            Paste
          </button>
        </div>

        {/* Validation feedback */}
        <div className="mt-2.5 flex items-center gap-1.5 min-h-[20px]">
          {showError ? (
            <>
              <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-rose-300">Enter a valid http:// or https:// URL.</span>
            </>
          ) : isValid ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-emerald-300">URL is valid and ready to shorten.</span>
            </>
          ) : (
            <span className="text-xs text-white/25">We'll validate your destination before shortening.</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
          className="rounded-xl px-5 py-3 text-sm font-bold text-[#0D0B08] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: isValid
              ? 'linear-gradient(135deg, #D4A843, #C4983A)'
              : 'rgba(212, 168, 67, 0.3)',
          }}
        >
          Continue
        </button>
      </div>
    </>
  )
}

// ─── Step 2: Advanced ────────────────────────────────────────────────────────
function AdvancedStep({ alias, setAlias, onBack, onCreateLink }) {
  const inputRef = useRef(null)
  const trimmedAlias = alias.trim()
  const aliasResult = validateAlias(trimmedAlias)
  const canCreate = aliasResult.valid

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canCreate) {
      e.preventDefault()
      onCreateLink()
    }
  }

  return (
    <>
      {/* Custom Alias */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-white">Custom Alias</span>
          <span className="ml-2 text-xs text-white/30 font-normal">(Optional)</span>
        </label>

        <div
          className={`flex items-center rounded-xl border bg-[#0A0908] overflow-hidden transition-all duration-200 ${
            trimmedAlias && !aliasResult.valid
              ? 'border-rose-500/40 focus-within:border-rose-400/60 focus-within:ring-2 focus-within:ring-rose-500/15'
              : 'border-white/[0.08] focus-within:border-[#D4A843]/40 focus-within:ring-2 focus-within:ring-[#D4A843]/10'
          }`}
        >
          <span className="flex items-center px-3 border-r border-white/[0.05] bg-white/[0.03] text-xs text-white/30 select-none font-mono whitespace-nowrap h-full py-2.5">
            {window.location.host}/
          </span>
          <input
            ref={inputRef}
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. portfolio, resume, github"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none font-mono"
          />
        </div>

        <div className="mt-2.5 min-h-[20px]">
          {trimmedAlias && !aliasResult.valid ? (
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-rose-300">{aliasResult.message}</span>
            </div>
          ) : trimmedAlias && aliasResult.valid ? (
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-emerald-300">
                Your link: {window.location.host}/{trimmedAlias}
              </span>
            </div>
          ) : (
            <span className="text-xs text-white/25">Leave empty to auto-generate a short code.</span>
          )}
        </div>
      </div>

      {/* Future features — Coming Soon */}
      <div className="mt-4 space-y-3">
        {/* Expiry Date placeholder */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4 opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
                <svg className="h-4 w-4 text-white/30" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white/40">Expiry Date</p>
                <p className="text-[11px] text-white/20">Set an expiration for your link</p>
              </div>
            </div>
            <span className="rounded-full border border-[#D4A843]/20 bg-[#D4A843]/5 px-2.5 py-1 text-[10px] font-semibold text-[#D4A843]/60 uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Password Protection placeholder */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4 opacity-50 cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
                <svg className="h-4 w-4 text-white/30" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white/40">Password Protection</p>
                <p className="text-[11px] text-white/20">Require a password to access</p>
              </div>
            </div>
            <span className="rounded-full border border-[#D4A843]/20 bg-[#D4A843]/5 px-2.5 py-1 text-[10px] font-semibold text-[#D4A843]/60 uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onCreateLink}
          disabled={!canCreate}
          className="rounded-xl px-5 py-3 text-sm font-bold text-[#0D0B08] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: canCreate
              ? 'linear-gradient(135deg, #D4A843, #C4983A)'
              : 'rgba(212, 168, 67, 0.3)',
          }}
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
      {/* Animated spinner */}
      <div className="relative h-16 w-16">
        <div
          className="absolute inset-0 rounded-full border-[3px] border-white/[0.06]"
        />
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin"
          style={{ borderTopColor: '#D4A843', borderRightColor: '#D4A843' }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <svg className="h-6 w-6 text-[#D4A843]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>
        </div>
      </div>

      <p className="mt-6 text-base font-semibold text-white">Creating your Smart Link…</p>
      <p className="mt-2 text-sm text-white/30">This will only take a moment.</p>
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
    } catch {
      // silently ignore
    }
  }

  const handleOpen = () => {
    window.open(result.shortUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col items-center text-center py-6">
      {/* Success checkmark */}
      <div
        className="grid h-16 w-16 place-items-center rounded-full"
        style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(196,152,58,0.08))' }}
      >
        <svg className="h-8 w-8 text-[#D4A843]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
      </div>

      <h3 className="mt-5 text-lg font-bold text-white">Link Created Successfully!</h3>
      <p className="mt-1.5 text-sm text-white/35">Your Smart Link is ready to share.</p>

      {/* Short URL display */}
      <div className="mt-6 w-full rounded-xl border border-[#D4A843]/20 bg-[#D4A843]/[0.04] px-4 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D4A843]/60 mb-1.5">Your Short Link</p>
        <p className="text-base font-mono font-semibold text-[#D4A843] break-all">{result.shortUrl}</p>
      </div>

      {/* Original URL preview */}
      <div className="mt-3 w-full rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/25 mb-1">Destination</p>
        <p className="text-xs text-white/40 break-all truncate">{result.originalUrl}</p>
      </div>

      {/* Action buttons */}
      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4A843]/30 bg-[#D4A843]/[0.06] px-4 py-3 text-sm font-semibold text-[#D4A843] transition-all hover:bg-[#D4A843]/[0.12] active:scale-[0.98]"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
              Copy URL
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
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
        className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-bold text-[#0D0B08] transition-all active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #D4A843, #C4983A)' }}
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
      <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-500/10">
        <svg className="h-7 w-7 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">Unable to create link</h3>
      <p className="mt-2 text-sm text-white/40 max-w-xs">{message}</p>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
        >
          Go Back
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl px-5 py-3 text-sm font-bold text-[#0D0B08] transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #D4A843, #C4983A)' }}
        >
          Retry
        </button>
      </div>
    </div>
  )
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function CreateLinkModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(0) // 0=Destination, 1=Advanced, 2=Creating, 3=Complete
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const backdropRef = useRef(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(0)
      setUrl('')
      setAlias('')
      setResult(null)
      setError('')
    }
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key to close (only when not in creating step)
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e) => {
      if (e.key === 'Escape' && step !== 2) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, step])

  const handleClose = useCallback(() => {
    if (step === 2) return // block close during creation
    if (result) {
      onCreated?.(result)
    }
    onClose()
  }, [step, result, onCreated, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current && step !== 2) {
      handleClose()
    }
  }

  const handleCreateLink = async () => {
    setStep(2)
    setError('')

    try {
      const payload = { originalUrl: url.trim() }
      const trimmedAlias = alias.trim()
      if (trimmedAlias) {
        payload.customAlias = trimmedAlias
      }

      const created = await createShortUrl(payload)
      setResult(created)
      setStep(3)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    }
  }

  const handleRetry = () => {
    setError('')
    handleCreateLink()
  }

  const handleErrorBack = () => {
    setError('')
    setStep(1)
  }

  if (!isOpen) return null

  // Determine the visual step index for the progress bar
  const progressIndex = error ? 2 : step

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      style={{ animation: 'fadeIn 200ms ease-out' }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/[0.07] shadow-2xl shadow-black/60"
        style={{
          background: 'linear-gradient(180deg, #141210 0%, #0D0B08 100%)',
          animation: 'slideUp 300ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-6 pt-6 pb-0">
          {/* Badge + close */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="inline-flex items-center gap-1.5">
              <span className="text-[#D4A843] text-sm">✦</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A843]">
                Premium Link Studio
              </span>
            </div>
            {step !== 2 && (
              <button
                type="button"
                onClick={handleClose}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white"
                aria-label="Close modal"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Create Smart Link</h2>

          {/* Step indicator */}
          <div className="mt-5">
            <StepIndicator currentIndex={progressIndex} />
          </div>
        </div>

        {/* Modal body */}
        <div className="px-6 pb-6">
          {error ? (
            <ErrorView message={error} onRetry={handleRetry} onBack={handleErrorBack} />
          ) : step === 0 ? (
            <DestinationStep
              url={url}
              setUrl={setUrl}
              onCancel={handleClose}
              onContinue={() => setStep(1)}
            />
          ) : step === 1 ? (
            <AdvancedStep
              alias={alias}
              setAlias={setAlias}
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

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
