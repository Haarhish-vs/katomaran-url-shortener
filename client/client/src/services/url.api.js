const API_BASE = process.env.VITE_API_BASE || '';

export async function createShortUrl(payload) {
  return fetch(`${API_BASE}/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());
}

export async function getUserUrls() {
  return fetch(`${API_BASE}/url`).then(r => r.json());
}
