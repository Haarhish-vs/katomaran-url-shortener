import apiClient from './apiClient'

export async function fetchAnalytics(shortCode, params = {}) {
  const response = await apiClient.get(`/analytics/${shortCode}`, { params })
  return response.data.data
}

export async function fetchAnalyticsSummary(params = {}) {
  const response = await apiClient.get('/analytics/summary', { params })
  return response.data.data
}

export async function fetchUserAnalytics(params = {}) {
  const response = await apiClient.get('/analytics/user', { params })
  return response.data.data
}
