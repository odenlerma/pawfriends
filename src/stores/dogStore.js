// ==============================================
// PawFriends - Dog Store (Zustand)
// ==============================================

import { create } from 'zustand'
import { dogService } from '../services/dogService'
import { matchingService } from '../services/matchingService'
import { photoService } from '../services/photoService'

export const useDogStore = create((set, get) => ({
  // State
  myDogs: [],
  activeDog: null,
  candidates: [],
  matches: [],
  matchCount: 0,
  isLoading: false,
  error: null,

  // Dog CRUD Actions
  fetchMyDogs: async (userId) => {
    try {
      set({ isLoading: true, error: null })

      const dogs = await dogService.getMyDogs(userId)

      set({
        myDogs: dogs,
        isLoading: false,
        // Set first active dog as default if no active dog selected
        activeDog: get().activeDog || dogs.find((d) => d.is_active) || null,
      })

      return dogs
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  getDog: async (dogId) => {
    try {
      set({ isLoading: true, error: null })

      const dog = await dogService.getDog(dogId)

      set({ isLoading: false })

      return dog
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  createDog: async (dogData, photoFiles = []) => {
    try {
      set({ isLoading: true, error: null })

      // Upload photos first if provided
      let photoUrls = []
      if (photoFiles.length > 0) {
        photoUrls = await photoService.uploadMultiplePhotos(
          dogData.owner_id,
          photoFiles
        )
      }

      const dog = await dogService.createDog({
        ...dogData,
        photo_urls: photoUrls,
      })

      set((state) => ({
        myDogs: [dog, ...state.myDogs],
        isLoading: false,
      }))

      return dog
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateDog: async (dogId, updates, newPhotoFiles = [], removedPhotoUrls = []) => {
    try {
      set({ isLoading: true, error: null })

      const existingDog = get().myDogs.find((d) => d.id === dogId)

      // Delete removed photos
      if (removedPhotoUrls.length > 0) {
        await photoService.deleteMultiplePhotos(removedPhotoUrls)
      }

      // Upload new photos
      let newPhotoUrls = []
      if (newPhotoFiles.length > 0) {
        newPhotoUrls = await photoService.uploadMultiplePhotos(
          existingDog.owner_id,
          newPhotoFiles
        )
      }

      // Combine existing (minus removed) with new photos
      const existingUrls = (existingDog.photo_urls || []).filter(
        (url) => !removedPhotoUrls.includes(url)
      )
      const allPhotoUrls = [...existingUrls, ...newPhotoUrls]

      const dog = await dogService.updateDog(dogId, {
        ...updates,
        photo_urls: allPhotoUrls,
      })

      set((state) => ({
        myDogs: state.myDogs.map((d) => (d.id === dogId ? dog : d)),
        activeDog: state.activeDog?.id === dogId ? dog : state.activeDog,
        isLoading: false,
      }))

      return dog
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteDog: async (dogId) => {
    try {
      set({ isLoading: true, error: null })

      const dog = get().myDogs.find((d) => d.id === dogId)

      // Delete all photos
      if (dog?.photo_urls?.length > 0) {
        await photoService.deleteMultiplePhotos(dog.photo_urls)
      }

      await dogService.deleteDog(dogId)

      set((state) => ({
        myDogs: state.myDogs.filter((d) => d.id !== dogId),
        activeDog: state.activeDog?.id === dogId ? null : state.activeDog,
        isLoading: false,
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  toggleDogActive: async (dogId, isActive) => {
    try {
      const dog = await dogService.toggleActive(dogId, isActive)

      set((state) => ({
        myDogs: state.myDogs.map((d) => (d.id === dogId ? dog : d)),
        activeDog: state.activeDog?.id === dogId ? dog : state.activeDog,
      }))

      return dog
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Matching Actions
  setActiveDog: (dog) => {
    set({ activeDog: dog, candidates: [] })
  },

  fetchCandidates: async (dogId, limit = 10) => {
    if (!dogId) return []

    try {
      set({ isLoading: true, error: null })

      const candidates = await matchingService.getCandidates(dogId, limit)

      set({ candidates, isLoading: false })

      return candidates
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  swipe: async (swipedDogId, action) => {
    const { activeDog } = get()
    if (!activeDog) throw new Error('No active dog selected')

    try {
      const { match } = await matchingService.swipe(
        activeDog.id,
        swipedDogId,
        action
      )

      // Remove swiped dog from candidates
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== swipedDogId),
        matchCount: match ? state.matchCount + 1 : state.matchCount,
      }))

      // Return match if it was created (for showing match modal)
      return match
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  fetchMatches: async (userId) => {
    try {
      set({ isLoading: true, error: null })

      const matches = await matchingService.getMatches(userId)

      set({ matches, isLoading: false })

      return matches
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  fetchMatchCount: async (userId) => {
    try {
      const count = await matchingService.getMatchCount(userId)
      set({ matchCount: count })
      return count
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      myDogs: [],
      activeDog: null,
      candidates: [],
      matches: [],
      matchCount: 0,
      isLoading: false,
      error: null,
    }),
}))
