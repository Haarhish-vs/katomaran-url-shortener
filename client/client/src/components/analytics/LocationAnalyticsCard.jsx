const FLAG_MAP = {
  US: '🇺🇸', IN: '🇮🇳', GB: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵',
  AU: '🇦🇺', BR: '🇧🇷', KR: '🇰🇷', CN: '🇨🇳', RU: '🇷🇺', IT: '🇮🇹', ES: '🇪🇸',
  MX: '🇲🇽', NL: '🇳🇱', SE: '🇸🇪', SG: '🇸🇬', AE: '🇦🇪', ZA: '🇿🇦',
};

function getFlag(code) {
  if (!code) return '🌐';
  return FLAG_MAP[code.toUpperCase()] || '🌐';
}

export default function LocationAnalyticsCard({ locationSummary }) {
  const hasCountries = locationSummary?.countries?.length > 0;
  const hasCities = locationSummary?.cities?.length > 0;

  if (!hasCountries && !hasCities) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-white">Top Locations</h3>
        <p className="text-sm text-slate-400">No location data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <h3 className="mb-5 text-base font-semibold text-white">Top Locations</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Countries */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Top Countries</h4>
          {hasCountries ? (
            <div className="space-y-2.5">
              {locationSummary.countries.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span className="text-base">{getFlag(c.name)}</span>
                    <span className="font-medium">{c.name}</span>
                    {i === 0 && <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">Top</span>}
                  </span>
                  <span className="font-semibold text-white">{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No country data</p>
          )}
        </div>

        {/* Cities */}
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Top Cities</h4>
          {hasCities ? (
            <div className="space-y-2.5">
              {locationSummary.cities.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span className="text-base">📍</span>
                    <span className="font-medium">{c.name}</span>
                    {i === 0 && <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">Top</span>}
                  </span>
                  <span className="font-semibold text-white">{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No city data</p>
          )}
        </div>
      </div>
    </div>
  );
}
