import { todayString } from '../utils/createLinkValidation'

function DateField({ id, label, value, onChange, min }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="ml-2 text-xs text-slate-500 font-normal">(Optional)</span>
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          className="date-input w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-8 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-2.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={`Clear ${label}`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function DateRangeSection({ startDate, setStartDate, expiresAt, setExpiresAt, dateError }) {
  const today = todayString()
  const expiryMin = startDate || today

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-white">Link Schedule</p>
        <p className="text-xs text-slate-500 mt-0.5">Control when your link is active</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DateField
          id="create-link-start-date"
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          min={today}
        />
        <DateField
          id="create-link-expiry-date"
          label="Expiry Date"
          value={expiresAt}
          onChange={setExpiresAt}
          min={expiryMin}
        />
      </div>

      {dateError && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2">
          <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-rose-400">{dateError}</span>
        </div>
      )}
    </div>
  )
}
