import apiClient from './apiClient'

export async function getUserUrls() {
  const response = await apiClient.get('/urls')
  return response.data.data
}

export async function createShortUrl(payload) {
  const response = await apiClient.post('/urls', payload)
  return response.data.data
}

export async function deleteShortUrl(shortCode) {
  const response = await apiClient.delete(`/urls/${shortCode}`)
  return response.data.data
}
