// ==============================================
// PawFriends - Auth Service
// ==============================================

import { apiRequest, setTokens, clearTokens, getAccessToken } from './apiClient'

export const authService = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async ({ email, password, displayName }) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    })

    setTokens(data.accessToken, data.refreshToken)
    return {
      user: data.user,
      session: { access_token: data.accessToken },
    }
  },

  /**
   * Sign in with email and password
   */
  signIn: async ({ email, password }) => {
    const data = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    setTokens(data.accessToken, data.refreshToken)
    return {
      user: data.user,
      session: { access_token: data.accessToken },
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    try {
      await apiRequest('/auth/signout', { method: 'POST' })
    } finally {
      clearTokens()
    }
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    const token = getAccessToken()
    if (!token) return null

    try {
      const data = await apiRequest('/auth/session')
      return {
        user: data.user,
        access_token: token,
      }
    } catch {
      return null
    }
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    const token = getAccessToken()
    if (!token) return null

    try {
      return await apiRequest('/auth/user')
    } catch {
      return null
    }
  },

  /**
   * Get user profile from profiles table
   */
  getProfile: async (userId) => {
    return apiRequest(`/profiles/${userId}`)
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId, updates) => {
    return apiRequest(`/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  /**
   * Subscribe to auth state changes
   * Note: REST API doesn't support real-time subscriptions
   * This is a compatibility shim that checks on initial load
   */
  onAuthStateChange: (callback) => {
    // Check current auth state immediately
    const checkAuth = async () => {
      const token = getAccessToken()
      if (token) {
        try {
          const session = await authService.getSession()
          if (session) {
            callback('SIGNED_IN', session)
          } else {
            callback('SIGNED_OUT', null)
          }
        } catch {
          callback('SIGNED_OUT', null)
        }
      } else {
        callback('SIGNED_OUT', null)
      }
    }

    checkAuth()

    // Return an unsubscribe function (no-op for REST API)
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (email) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },
}
