// ==============================================
// PawFriends - Photo Service
// ==============================================

import { uploadRequest, apiRequest } from './apiClient'

export const photoService = {
  /**
   * Upload a photo to Cloudinary via API
   * @param {string} userId - User ID (not used in new API, but kept for compatibility)
   * @param {File} file - File to upload
   * @returns {Promise<string>} Photo URL
   */
  uploadPhoto: async (userId, file) => {
    const formData = new FormData()
    formData.append('photo', file)

    const data = await uploadRequest('/photos/upload', formData)
    return data.url
  },

  /**
   * Delete a photo from storage
   * @param {string} photoUrl - URL of the photo to delete
   */
  deletePhoto: async (photoUrl) => {
    if (!photoUrl) return

    await apiRequest('/photos', {
      method: 'DELETE',
      body: JSON.stringify({ url: photoUrl }),
    })
  },

  /**
   * Upload multiple photos and return array of URLs
   * @param {string} userId - User ID (not used in new API, but kept for compatibility)
   * @param {File[]} files - Files to upload
   * @returns {Promise<string[]>} Array of photo URLs
   */
  uploadMultiplePhotos: async (userId, files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('photos', file)
    })

    const data = await uploadRequest('/photos/upload-multiple', formData)
    return data.urls
  },

  /**
   * Delete multiple photos
   * @param {string[]} photoUrls - Array of URLs to delete
   */
  deleteMultiplePhotos: async (photoUrls) => {
    if (!photoUrls || photoUrls.length === 0) return

    await apiRequest('/photos/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ urls: photoUrls }),
    })
  },
}
