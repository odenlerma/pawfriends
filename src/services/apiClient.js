// ==============================================
// PawFriends - API Client
// ==============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Token storage keys
const ACCESS_TOKEN_KEY = 'pawfriends_access_token'
const REFRESH_TOKEN_KEY = 'pawfriends_refresh_token'

/**
 * Get stored access token
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Get stored refresh token
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Store tokens
 */
export function setTokens(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

/**
 * Clear tokens
 */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    clearTokens()
    throw new Error('Token refresh failed')
  }

  const data = await response.json()
  if (data.success && data.data.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken)
    return data.data.accessToken
  }

  throw new Error('Token refresh failed')
}

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/auth/user')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const accessToken = getAccessToken()
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle token expiration
  if (response.status === 401) {
    const errorData = await response.json()
    if (errorData.code === 'TOKEN_EXPIRED') {
      try {
        const newToken = await refreshAccessToken()
        headers.Authorization = `Bearer ${newToken}`
        response = await fetch(url, { ...options, headers })
      } catch {
        clearTokens()
        throw new Error('Session expired. Please sign in again.')
      }
    } else {
      // Non-token-expired 401 error (e.g., invalid credentials)
      const error = new Error(errorData.error || 'Authentication failed')
      error.code = errorData.code
      error.details = errorData.details
      throw error
    }
  }

  const data = await response.json()

  if (!data.success) {
    const error = new Error(data.error || 'Request failed')
    error.code = data.code
    error.details = data.details
    throw error
  }

  return data.data
}

/**
 * Make a multipart form data request (for file uploads)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @returns {Promise<Object>} Response data
 */
export async function uploadRequest(endpoint, formData) {
  const url = `${API_BASE_URL}/api${endpoint}`

  const headers = {}
  const accessToken = getAccessToken()
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  })

  const data = await response.json()

  if (!data.success) {
    const error = new Error(data.error || 'Upload failed')
    error.code = data.code
    throw error
  }

  return data.data
}

export default {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  apiRequest,
  uploadRequest,
}
