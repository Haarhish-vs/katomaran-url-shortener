import { useState } from 'react'
import { formatDate } from '../utils/createLinkValidation'
import QRCodeSection from './QRCodeSection'

export default function SuccessStep({ result, onClose }) {
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
    <div className="flex flex-col items-center text-center py-4 font-sans">
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
        <p className="text-sm font-mono font-semibold text-cyan-300 break-all select-all">{result.shortUrl}</p>
      </div>

      {/* QR Code Preview */}
      <QRCodeSection qrCode={result.qrCode} />

      {/* Date and Protection metadata */}
      {(startDateFormatted || expiresAtFormatted || result.isPasswordProtected) && (
        <div className="mt-3.5 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left space-y-2">
          {result.isPasswordProtected && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Security</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Password Protected
              </span>
            </div>
          )}
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
      <div className="mt-5 grid w-full gap-3 grid-cols-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-2 py-3.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-400/20 active:scale-[0.98]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          type="button"
          onClick={() => window.open(result.shortUrl, '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-3.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          Open
        </button>

        {result.qrCode ? (
          <a
            href={result.qrCode}
            download={`qrcode-${result.shortCode}.png`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-2 py-3.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-400/20 active:scale-[0.98]"
          >
            Download
          </a>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98]"
      >
        Close
      </button>
    </div>
  )
}
