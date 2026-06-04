import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { login } from '../services/auth.api'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase())
}

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage
}

function Toast({ toast, onClose }) {
  if (!toast) return null

  const toneClasses =
    toast.variant === 'error'
      ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
      : 'border-cyan-400/30 bg-cyan-500/10 text-cyan-50'

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(92vw,24rem)] rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:right-6 sm:top-6">
      <div className={`rounded-xl border p-4 ${toneClasses}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{toast.title}</p>
            <p className="mt-1 text-sm text-white/90">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return undefined

    const timeoutId = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const clearError = () => {
    if (formError) setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setFormError('Email and password are required.')
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setFormError('Enter a valid email address.')
      return
    }

    setFormError('')
    setLoading(true)

    try {
      const result = await login({ email: trimmedEmail, password })
      signIn(result.token)
      setToast({
        title: 'Login successful',
        message: 'Redirecting you to the dashboard.',
        variant: 'success',
      })

      window.setTimeout(() => {
        navigate('/', { replace: true })
      }, 1200)
    } catch (error) {
      setToast({
        title: 'Login failed',
        message: getErrorMessage(error, 'Please check your credentials and try again.'),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.9fr_1fr]">
          <div className="flex flex-col justify-center gap-8 border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Katomaran URL Shortener
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Sign in to manage your dashboard and protected links.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Access your saved URLs, delete links, and view personal analytics from a secure workspace.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Login</h2>
              <p className="mt-1 text-sm text-slate-400">
                Use your account credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    clearError()
                  }}
                  disabled={loading}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    clearError()
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>

              <p className="text-sm text-slate-400">
                New here?{' '}
                <Link to="/signup" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
