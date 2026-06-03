import { useState } from 'react'

export default function PasswordProtectionSection({
  password,
  setPassword,
  isPasswordEnabled,
  setIsPasswordEnabled,
  passwordError,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
            <svg className={`h-4 w-4 transition-colors ${isPasswordEnabled ? 'text-cyan-400' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Password Protection</p>
            <p className="text-xs text-slate-500 mt-0.5">Require a password to access this link</p>
          </div>
        </div>
        <button
          id="create-link-password-toggle"
          type="button"
          onClick={() => {
            setIsPasswordEnabled(!isPasswordEnabled)
            if (isPasswordEnabled) {
              setPassword('')
              setShowPassword(false)
            }
          }}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isPasswordEnabled ? 'bg-cyan-400' : 'bg-slate-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
              isPasswordEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {isPasswordEnabled && (
        <div className="relative mt-4">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="create-link-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter link password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {passwordError && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2">
          <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-rose-400">{passwordError}</span>
        </div>
      )}
    </div>
  )
}
