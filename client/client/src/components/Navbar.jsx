import { useContext, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { shortCode } = useParams()
  const location = useLocation()
  const { isAuthenticated, signOut } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    signOut()
    setIsMenuOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 transition-colors hover:border-cyan-400/30 hover:text-white"
                aria-label="Open menu"
              >
                <span className="text-lg">☰</span>
              </button>
            )}

            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                K
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold tracking-[0.18em] text-cyan-200 uppercase">
                  Katomaran
                </p>
                <p className="text-xs text-slate-400">URL Shortener</p>
              </div>
            </Link>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:bg-white/5"
            >
              <span className="text-base leading-none" aria-hidden="true">
                ⎋
              </span>
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400/40 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hamburger Drawer Navigation (Rendered globally by Navbar for all authed pages) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <aside className={`fixed bottom-0 top-0 left-0 z-50 w-72 transform bg-slate-900 border-r border-white/10 p-6 shadow-2xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xs font-semibold text-cyan-200">
              K
            </span>
            <span className="text-sm font-semibold tracking-wider uppercase text-cyan-200">Katomaran</span>
          </div>
          <button 
            type="button" 
            onClick={() => setIsMenuOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${location.pathname === '/' ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-lg">⌂</span>
            Dashboard
          </Link>
          
          <Link 
            to="/analytics" 
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${location.pathname === '/analytics' ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-lg">📊</span>
            Analytics
          </Link>
          
          {shortCode && (
            <Link 
              to={`/analytics/${shortCode}`}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${location.pathname.startsWith('/analytics/') ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-lg">📊</span>
              Analytics
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
          >
            <span className="text-lg">⎋</span>
            Sign Out
          </button>
        </nav>
      </aside>
    </>
  )
}
