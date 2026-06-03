import apiClient from './apiClient'

export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data.data
}

export async function signup(data) {
  const response = await apiClient.post('/auth/signup', data)
  return response.data.data
}
