import apiClient from './apiClient'

export async function fetchAnalytics(shortCode) {
  const response = await apiClient.get(`/analytics/${shortCode}`)
  return response.data.data
}
