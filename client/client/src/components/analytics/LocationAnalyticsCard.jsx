const FLAG_MAP = {
  US: '🇺🇸', IN: '🇮🇳', GB: '🇬🇧', CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵',
  AU: '🇦🇺', BR: '🇧🇷', KR: '🇰🇷', CN: '🇨🇳', RU: '🇷🇺', IT: '🇮🇹', ES: '🇪🇸',
  MX: '🇲🇽', NL: '🇳🇱', SE: '🇸🇪', SG: '🇸🇬', AE: '🇦🇪', ZA: '🇿🇦',
};

const COUNTRY_NAMES = {
  US: 'United States',
  IN: 'India',
  GB: 'United Kingdom',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  AU: 'Australia',
  BR: 'Brazil',
  KR: 'South Korea',
  CN: 'China',
  RU: 'Russia',
  IT: 'Italy',
  ES: 'Spain',
  MX: 'Mexico',
  NL: 'Netherlands',
  SE: 'Sweden',
  SG: 'Singapore',
  AE: 'United Arab Emirates',
  ZA: 'South Africa',
};

function getFlag(code) {
  if (!code) return '🌐';
  return FLAG_MAP[code.toUpperCase()] || '🌐';
}

function getCountryName(code) {
  if (!code) return 'Unknown';
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] || upper;
}

export default function LocationAnalyticsCard({ locationSummary }) {
  const hasCountries = locationSummary?.countries?.length > 0;

  if (!hasCountries) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-white">Top Countries</h3>
        <p className="text-sm text-slate-400">No country data available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <h3 className="mb-5 text-base font-semibold text-white">Top Countries</h3>
      <div className="space-y-2.5">
        {locationSummary.countries.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2 text-slate-200">
              <span className="text-base">{getFlag(c.name)}</span>
              <span className="font-medium">{getCountryName(c.name)}</span>
              {i === 0 && (
                <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">
                  Top
                </span>
              )}
            </span>
            <span className="font-semibold text-white">{c.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
