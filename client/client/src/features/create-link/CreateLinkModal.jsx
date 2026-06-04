import { useEffect, useRef, useCallback } from 'react'
import useCreateLink from './hooks/useCreateLink'
import DestinationStep from './components/DestinationStep'
import AdvancedStep from './components/AdvancedStep'
import LoadingStep from './components/LoadingStep'
import SuccessStep from './components/SuccessStep'

// ─── Constants ───────────────────────────────────────────────────────────────
const STEPS = ['Destination', 'Advanced', 'Creating', 'Complete']

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
  const {
    step,
    setStep,
    url,
    setUrl,
    alias,
    setAlias,
    startDate,
    setStartDate,
    expiresAt,
    setExpiresAt,
    password,
    setPassword,
    isPasswordEnabled,
    setIsPasswordEnabled,
    result,
    error,
    setError,
    handleCreateLink,
  } = useCreateLink()

  const backdropRef = useRef(null)

  const handleClose = useCallback(() => {
    if (step === 2) return
    if (result) onCreated?.(result)
    onClose()
  }, [step, result, onCreated, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current && step !== 2) handleClose()
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape' && step !== 2) handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, step, handleClose])

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
        className="relative w-full max-w-lg max-h-[100dvh] sm:max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/50"
        style={{ animation: 'slideUp 300ms ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-0 shrink-0">
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
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 overflow-y-auto overflow-x-hidden">
          {error ? (
            <ErrorView
              message={error}
              onRetry={() => {
                setError('')
                handleCreateLink()
              }}
              onBack={() => {
                setError('')
                setStep(1)
              }}
            />
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
              startDate={startDate}
              setStartDate={setStartDate}
              expiresAt={expiresAt}
              setExpiresAt={setExpiresAt}
              password={password}
              setPassword={setPassword}
              isPasswordEnabled={isPasswordEnabled}
              setIsPasswordEnabled={setIsPasswordEnabled}
              onBack={() => setStep(0)}
              onCreateLink={handleCreateLink}
            />
          ) : step === 2 ? (
            <LoadingStep />
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
