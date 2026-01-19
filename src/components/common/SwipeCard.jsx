// ==============================================
// PawFriends - SwipeCard Component
// ==============================================

import { useState, useRef } from 'react'
import './SwipeCard.scss'

const MaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="14" r="6" />
    <line x1="14.5" y1="9.5" x2="21" y2="3" />
    <polyline points="15 3 21 3 21 9" />
  </svg>
)

const FemaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="9" r="6" />
    <line x1="12" y1="15" x2="12" y2="23" />
    <line x1="8" y1="19" x2="16" y2="19" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function SwipeCard({
  dog,
  onSwipe,
  isTop = false,
  className = '',
}) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const cardRef = useRef(null)

  const {
    name,
    breed,
    age_years,
    gender,
    bio,
    photo_urls,
    owner_display_name,
  } = dog

  const photos = photo_urls?.length ? photo_urls : [null]
  const currentPhoto = photos[photoIndex]
  const ageText = age_years === 0
    ? '< 1 year'
    : age_years === 1
      ? '1 year'
      : `${age_years} years`

  // Calculate swipe direction and progress
  const deltaX = currentX - startX
  const swipeProgress = Math.min(Math.abs(deltaX) / 150, 1)
  const isLikeDirection = deltaX > 0
  const swipeThreshold = 100

  const handleStart = (clientX) => {
    if (!isTop) return
    setStartX(clientX)
    setCurrentX(clientX)
    setIsDragging(true)
  }

  const handleMove = (clientX) => {
    if (!isDragging || !isTop) return
    setCurrentX(clientX)
  }

  const handleEnd = () => {
    if (!isDragging || !isTop) return
    setIsDragging(false)

    if (Math.abs(deltaX) > swipeThreshold) {
      onSwipe?.(isLikeDirection ? 'like' : 'reject')
    } else {
      setCurrentX(startX)
    }
  }

  // Touch handlers
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX)
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX)
  const handleTouchEnd = () => handleEnd()

  // Mouse handlers
  const handleMouseDown = (e) => handleStart(e.clientX)
  const handleMouseMove = (e) => {
    if (isDragging) handleMove(e.clientX)
  }
  const handleMouseUp = () => handleEnd()
  const handleMouseLeave = () => {
    if (isDragging) handleEnd()
  }

  // Photo navigation
  const nextPhoto = (e) => {
    e.stopPropagation()
    setPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = (e) => {
    e.stopPropagation()
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Button handlers
  const handleLike = () => onSwipe?.('like')
  const handleReject = () => onSwipe?.('reject')

  const cardStyle = isDragging
    ? {
        transform: `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`,
        transition: 'none',
      }
    : {}

  const cardClasses = [
    'swipe-card',
    isTop && 'swipe-card--top',
    isDragging && 'swipe-card--dragging',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Like/Reject indicators */}
      <div
        className="swipe-card__indicator swipe-card__indicator--like"
        style={{ opacity: isLikeDirection ? swipeProgress : 0 }}
      >
        LIKE
      </div>
      <div
        className="swipe-card__indicator swipe-card__indicator--nope"
        style={{ opacity: !isLikeDirection ? swipeProgress : 0 }}
      >
        NOPE
      </div>

      {/* Photo */}
      <div className="swipe-card__photo-container">
        {currentPhoto ? (
          <img src={currentPhoto} alt={name} className="swipe-card__photo" />
        ) : (
          <div className="swipe-card__photo-placeholder">
            {gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
          </div>
        )}

        {/* Photo navigation */}
        {photos.length > 1 && (
          <>
            <div className="swipe-card__photo-dots">
              {photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`swipe-card__photo-dot ${
                    idx === photoIndex ? 'swipe-card__photo-dot--active' : ''
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              className="swipe-card__photo-nav swipe-card__photo-nav--prev"
              onClick={prevPhoto}
              aria-label="Previous photo"
            />
            <button
              type="button"
              className="swipe-card__photo-nav swipe-card__photo-nav--next"
              onClick={nextPhoto}
              aria-label="Next photo"
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="swipe-card__gradient" />
      </div>

      {/* Info */}
      <div className="swipe-card__info">
        <div className="swipe-card__header">
          <h2 className="swipe-card__name">
            {name}
            <span className="swipe-card__age">, {ageText}</span>
          </h2>
          <span className={`swipe-card__gender swipe-card__gender--${gender}`}>
            {gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
          </span>
        </div>

        <p className="swipe-card__breed">{breed}</p>

        {bio && <p className="swipe-card__bio">{bio}</p>}

        {owner_display_name && (
          <p className="swipe-card__owner">Owner: {owner_display_name}</p>
        )}
      </div>

      {/* Action buttons */}
      {isTop && (
        <div className="swipe-card__actions">
          <button
            type="button"
            className="swipe-card__button swipe-card__button--reject"
            onClick={handleReject}
            aria-label="Reject"
          >
            <XIcon />
          </button>
          <button
            type="button"
            className="swipe-card__button swipe-card__button--like"
            onClick={handleLike}
            aria-label="Like"
          >
            <HeartIcon />
          </button>
        </div>
      )}
    </div>
  )
}
