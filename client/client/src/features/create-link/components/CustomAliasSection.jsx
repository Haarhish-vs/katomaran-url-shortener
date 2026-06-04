import { validateAlias } from '../utils/createLinkValidation'

export default function CustomAliasSection({ alias, setAlias, canCreate, onCreateLink, inputRef }) {
  const trimmedAlias = alias.trim()
  const aliasResult = validateAlias(trimmedAlias)

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <label className="block mb-3">
        <span className="text-sm font-semibold text-white">Custom Alias</span>
        <span className="ml-2 text-xs text-slate-500 font-normal">(Optional)</span>
      </label>

      <div className={`flex flex-col sm:flex-row sm:items-center rounded-xl border bg-slate-950 overflow-hidden transition-all duration-200 ${
        trimmedAlias && !aliasResult.valid
          ? 'border-rose-500/40 focus-within:border-rose-400/60 focus-within:ring-2 focus-within:ring-rose-500/15'
          : 'border-white/10 focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/20'
      }`}>
        <span className="flex items-center px-3 border-b sm:border-b-0 sm:border-r border-white/10 bg-white/5 text-xs text-slate-500 select-none font-mono truncate sm:whitespace-nowrap py-2 sm:py-2.5">
          {window.location.host}/
        </span>
        <input
          ref={inputRef}
          id="create-link-alias-input"
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canCreate) {
              e.preventDefault()
              onCreateLink()
            }
          }}
          placeholder="e.g. portfolio, resume, github"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-mono"
        />
      </div>

      <div className="mt-2 min-h-[20px]">
        {trimmedAlias && !aliasResult.valid ? (
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-rose-400">{aliasResult.message}</span>
          </div>
        ) : trimmedAlias && aliasResult.valid ? (
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-emerald-400 truncate break-all">{window.location.host}/{trimmedAlias}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-500">Leave empty to auto-generate a short code.</span>
        )}
      </div>
    </div>
  )
}
