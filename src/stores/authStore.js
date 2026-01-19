// ==============================================
// PawFriends - Auth Store (Zustand)
// ==============================================

import { create } from 'zustand'
import { authService } from '../services/authService'
import { setTokens } from '../services/apiClient'

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Actions
  initialize: async () => {
    try {
      set({ isLoading: true, error: null })

      // Check for Supabase auth tokens in URL hash (email confirmation redirect)
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken) {
          // Store tokens and clear hash from URL
          setTokens(accessToken, refreshToken)
          window.history.replaceState(null, '', window.location.pathname)
        }
      }

      const session = await authService.getSession()

      if (session?.user) {
        const profile = await authService.getProfile(session.user.id)
        set({
          user: session.user,
          profile,
          session,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({
          user: null,
          profile: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  },

  signUp: async ({ email, password, displayName }) => {
    try {
      set({ isLoading: true, error: null })

      const data = await authService.signUp({ email, password, displayName })

      // User may need to confirm email, so don't set as authenticated yet
      set({ isLoading: false })

      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  signIn: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null })

      const data = await authService.signIn({ email, password })

      if (data.user) {
        const profile = await authService.getProfile(data.user.id)
        set({
          user: data.user,
          profile,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        })
      }

      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null })

      await authService.signOut()

      set({
        user: null,
        profile: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) throw new Error('Not authenticated')

    try {
      set({ isLoading: true, error: null })

      const profile = await authService.updateProfile(user.id, updates)

      set({ profile, isLoading: false })

      return profile
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  // Handle auth state changes (call this from App.jsx)
  setupAuthListener: () => {
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const profile = await authService.getProfile(session.user.id)
            set({
              user: session.user,
              profile,
              session,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch {
            set({
              user: session.user,
              session,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            profile: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          set({ session })
        }
      }
    )

    return () => subscription.unsubscribe()
  },
}))
