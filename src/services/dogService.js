// ==============================================
// PawFriends - Dog Service
// ==============================================

import { apiRequest } from './apiClient'

export const dogService = {
  /**
   * Get all dogs for the current user
   */
  getMyDogs: async () => {
    return apiRequest('/dogs/my')
  },

  /**
   * Get a single dog by ID
   */
  getDog: async (dogId) => {
    return apiRequest(`/dogs/${dogId}`)
  },

  /**
   * Create a new dog
   */
  createDog: async (dogData) => {
    return apiRequest('/dogs', {
      method: 'POST',
      body: JSON.stringify({
        name: dogData.name,
        breed: dogData.breed,
        ageYears: dogData.age_years,
        gender: dogData.gender,
        bio: dogData.bio,
        photoUrls: dogData.photo_urls,
      }),
    })
  },

  /**
   * Update an existing dog
   */
  updateDog: async (dogId, updates) => {
    const body = {}
    if (updates.name !== undefined) body.name = updates.name
    if (updates.breed !== undefined) body.breed = updates.breed
    if (updates.age_years !== undefined) body.ageYears = updates.age_years
    if (updates.gender !== undefined) body.gender = updates.gender
    if (updates.bio !== undefined) body.bio = updates.bio
    if (updates.photo_urls !== undefined) body.photoUrls = updates.photo_urls

    return apiRequest(`/dogs/${dogId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  /**
   * Delete a dog
   */
  deleteDog: async (dogId) => {
    return apiRequest(`/dogs/${dogId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Toggle dog active status
   */
  toggleActive: async (dogId, isActive) => {
    return apiRequest(`/dogs/${dogId}/toggle-active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    })
  },
}
