import apiClient from './apiClient'

export async function getUserUrls() {
  const response = await apiClient.get('/urls')
  return response.data.data
}

export async function createShortUrl(payload) {
  const response = await apiClient.post('/urls', payload)
  return response.data.data
}

export async function deleteShortUrl(id) {
  const response = await apiClient.delete(`/urls/${id}`)
  return response.data.data
}
