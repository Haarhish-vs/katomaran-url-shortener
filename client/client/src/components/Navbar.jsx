import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
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
      </div>
    </header>
  )
}
