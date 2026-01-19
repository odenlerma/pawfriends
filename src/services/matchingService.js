// ==============================================
// PawFriends - Matching Service
// ==============================================

import { apiRequest } from './apiClient'

export const matchingService = {
  /**
   * Get swipe candidates for a dog (opposite gender, not yet swiped)
   * @param {string} dogId - Dog ID doing the swiping
   * @param {number} limit - Maximum number of candidates to return
   * @returns {Promise<Array>} Array of candidate dogs
   */
  getCandidates: async (dogId, limit = 10) => {
    return apiRequest(`/matching/candidates/${dogId}?limit=${limit}`)
  },

  /**
   * Record a swipe action (like or reject)
   * @param {string} swiperDogId - Dog doing the swiping
   * @param {string} swipedDogId - Dog being swiped on
   * @param {string} action - 'like' or 'reject'
   * @returns {Promise<Object>} Swipe result with potential match
   */
  swipe: async (swiperDogId, swipedDogId, action) => {
    const data = await apiRequest('/matching/swipe', {
      method: 'POST',
      body: JSON.stringify({
        swiperDogId,
        swipedDogId,
        action,
      }),
    })

    return {
      swipe: data.swipe,
      match: data.match,
    }
  },

  /**
   * Check if a match exists between two dogs
   * @param {string} dog1Id
   * @param {string} dog2Id
   * @returns {Promise<Object|null>} Match or null
   */
  checkForMatch: async (dog1Id, dog2Id) => {
    const data = await apiRequest(`/matching/check-match?dog1Id=${dog1Id}&dog2Id=${dog2Id}`)
    return data.match
  },

  /**
   * Get all matches for a user's dogs
   * @returns {Promise<Array>} Array of matches with dog details
   */
  getMatches: async () => {
    return apiRequest('/matching/matches')
  },

  /**
   * Get match count for a user
   * @returns {Promise<number>} Match count
   */
  getMatchCount: async () => {
    const data = await apiRequest('/matching/matches/count')
    return data.count
  },
}
