// ==============================================
// PawFriends - ImageUpload Component
// ==============================================

import { useState, useRef } from 'react'
import './ImageUpload.scss'

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

export default function ImageUpload({
  images = [],
  onImagesChange,
  maxImages = 5,
  maxSizeMB = 5,
  label,
  hint,
  error,
  className = '',
}) {
  const [dragActive, setDragActive] = useState(false)
  const [previewError, setPreviewError] = useState(null)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    setPreviewError(null)

    const validFiles = []
    const maxSize = maxSizeMB * 1024 * 1024

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setPreviewError('Only image files are allowed')
        continue
      }

      // Check file size
      if (file.size > maxSize) {
        setPreviewError(`Files must be smaller than ${maxSizeMB}MB`)
        continue
      }

      // Check max images
      if (images.length + validFiles.length >= maxImages) {
        setPreviewError(`Maximum ${maxImages} images allowed`)
        break
      }

      // Create preview URL
      const preview = URL.createObjectURL(file)
      validFiles.push({ file, preview, isNew: true })
    }

    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files?.length) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleRemove = (index) => {
    const newImages = [...images]
    const removed = newImages.splice(index, 1)[0]

    // Revoke object URL if it was a new file
    if (removed.isNew && removed.preview) {
      URL.revokeObjectURL(removed.preview)
    }

    onImagesChange(newImages)
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const wrapperClasses = [
    'image-upload',
    dragActive && 'image-upload--drag-active',
    error && 'image-upload--error',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {label && <label className="image-upload__label">{label}</label>}

      <div className="image-upload__grid">
        {/* Image previews */}
        {images.map((image, index) => (
          <div key={index} className="image-upload__preview">
            <img
              src={image.preview || image.url || image}
              alt={`Upload ${index + 1}`}
              className="image-upload__image"
            />
            <button
              type="button"
              className="image-upload__remove"
              onClick={() => handleRemove(index)}
              aria-label="Remove image"
            >
              <TrashIcon />
            </button>
            {index === 0 && (
              <span className="image-upload__badge">Main</span>
            )}
          </div>
        ))}

        {/* Upload button */}
        {images.length < maxImages && (
          <button
            type="button"
            className="image-upload__dropzone"
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <span className="image-upload__dropzone-icon">
              {dragActive ? <PlusIcon /> : <CameraIcon />}
            </span>
            <span className="image-upload__dropzone-text">
              {dragActive ? 'Drop here' : 'Add photo'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="image-upload__input"
        aria-hidden="true"
      />

      {(error || previewError) && (
        <span className="image-upload__error">{error || previewError}</span>
      )}

      {hint && !error && !previewError && (
        <span className="image-upload__hint">{hint}</span>
      )}
    </div>
  )
}
