import { useEffect, useRef } from 'react'
import { isValidHttpUrl } from '../utils/createLinkValidation'

export default function DestinationStep({ url, setUrl, onCancel, onContinue }) {
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
    } catch { /* silently ignore */ }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault()
      onContinue()
    }
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
