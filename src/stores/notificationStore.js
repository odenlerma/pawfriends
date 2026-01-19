// ==============================================
// PawFriends - Notification Store (Zustand)
// ==============================================

import { create } from 'zustand'

const AUTO_DISMISS_DELAY = 5000

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],

  // Actions
  addNotification: (notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: notification.type || 'error',
      message: notification.message,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-dismiss after delay
    setTimeout(() => {
      get().removeNotification(id)
    }, AUTO_DISMISS_DELAY)

    return id
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  // Convenience methods
  showError: (message) => {
    return get().addNotification({ type: 'error', message })
  },

  showSuccess: (message) => {
    return get().addNotification({ type: 'success', message })
  },

  clearAll: () => {
    set({ notifications: [] })
  },
}))
