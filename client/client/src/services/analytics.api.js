const API_BASE = process.env.VITE_API_BASE || '';

export async function fetchAnalytics(shortId) {
  return fetch(`${API_BASE}/analytics/${shortId}`).then(r => r.json());
}
