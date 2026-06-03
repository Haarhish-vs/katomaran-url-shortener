import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function ShortUrlRedirect() {
  const { shortCode } = useParams()

  useEffect(() => {
    if (shortCode) {
      // Direct the browser to the Render backend redirect route
      const backendUrl = import.meta.env.VITE_API_BASE_URL || ''
      const backendHost = backendUrl.replace('/api', '')
      window.location.href = `${backendHost}/${shortCode}`
    }
  }, [shortCode])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-4">
        <svg className="h-8 w-8 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-medium tracking-wide">Redirecting you to destination...</p>
      </div>
    </div>
  )
}
