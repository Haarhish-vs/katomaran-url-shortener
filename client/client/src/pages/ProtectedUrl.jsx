import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { verifyUrlPassword } from '../services/url.api'

export default function ProtectedUrl() {
  const { shortCode } = useParams()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setError('')
    setIsVerifying(true)

    try {
      const response = await verifyUrlPassword(shortCode, password)
      if (response.success && response.data?.originalUrl) {
        window.location.href = response.data.originalUrl
      } else {
        setError(response.message || 'Verification failed')
        setIsVerifying(false)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid password. Please try again.')
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl relative z-10"
        style={{ animation: 'slideUp 300ms ease-out' }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Smart Link Security
            </span>
          </div>

          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 mx-auto mb-4">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
            Protected Link
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            This link is password protected. Enter the password to access the destination.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-400 text-sm animate-shake">
            <svg className="h-5 w-5 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isVerifying}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-50"
              autoFocus
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isVerifying}
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isVerifying || !password.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isVerifying ? (
              <>
                <svg className="h-4 w-4 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </>
            ) : (
              'Unlock Link'
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 300ms ease-in-out;
        }
      `}</style>
    </div>
  )
}
