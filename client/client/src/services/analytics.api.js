import apiClient from './apiClient'

export async function fetchAnalytics(shortCode, params = {}) {
  const response = await apiClient.get(`/analytics/${shortCode}`, { params })
  return response.data.data
}
