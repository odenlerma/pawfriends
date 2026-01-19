// ==============================================
// PawFriends - SwipeStack Component
// ==============================================

import { useState, useCallback, useEffect } from 'react'
import SwipeCard from './SwipeCard'
import LoadingPaws from './LoadingPaws'
import './SwipeStack.scss'

// Sleeping pup silhouette for empty state
const SleepingPupIcon = () => (
  <svg viewBox="0 0 48 48" fill="currentColor">
    {/* Body - curled up */}
    <ellipse cx="24" cy="30" rx="16" ry="10" opacity="0.9" />
    {/* Head */}
    <circle cx="14" cy="22" r="8" />
    {/* Ear */}
    <ellipse cx="8" cy="18" rx="4" ry="6" />
    {/* Closed eyes - sleeping */}
    <path d="M11 21 Q13 22 15 21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Nose */}
    <circle cx="10" cy="24" r="2" />
    {/* Tail curled */}
    <path d="M38 26 Q44 22 42 30 Q40 34 36 32" fill="currentColor" />
    {/* Zzz */}
    <text x="28" y="14" fontSize="8" fill="currentColor" opacity="0.6">z</text>
    <text x="33" y="10" fontSize="6" fill="currentColor" opacity="0.4">z</text>
    <text x="37" y="7" fontSize="4" fill="currentColor" opacity="0.3">z</text>
  </svg>
)

const LOADING_MESSAGES = [
  'Finding friends...',
  'Sniffing around...',
  'Almost there...',
]

export default function SwipeStack({
  candidates = [],
  onSwipe,
  onEmpty,
  isLoading = false,
  className = '',
}) {
  const [exitingCard, setExitingCard] = useState(null)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isLoading])

  const handleSwipe = useCallback(
    async (action) => {
      if (candidates.length === 0) return

      const swipedDog = candidates[0]
      setExitingCard({ dog: swipedDog, action })

      // Animate card exit
      setTimeout(async () => {
        setExitingCard(null)

        try {
          await onSwipe?.(swipedDog.id, action)
        } catch (error) {
          // Error handled in parent
        }
      }, 300)
    },
    [candidates, onSwipe]
  )

  // Show loading state
  if (isLoading) {
    return (
      <div className={`swipe-stack swipe-stack--loading ${className}`}>
        <div className="swipe-stack__loading">
          <LoadingPaws size="lg" label={LOADING_MESSAGES[loadingMessageIndex]} />
        </div>
      </div>
    )
  }

  // Show empty state
  if (candidates.length === 0 && !exitingCard) {
    return (
      <div className={`swipe-stack swipe-stack--empty ${className}`}>
        <div className="swipe-stack__empty">
          <div className="swipe-stack__empty-icon">
            <SleepingPupIcon />
          </div>
          <h3>All caught up!</h3>
          <p>No more pups nearby right now</p>
          {onEmpty && (
            <button
              type="button"
              className="swipe-stack__refresh"
              onClick={onEmpty}
            >
              Check again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Get visible cards (max 3)
  const visibleCards = candidates.slice(0, 3)

  return (
    <div className={`swipe-stack ${className}`}>
      <div className="swipe-stack__cards">
        {/* Exiting card animation */}
        {exitingCard && (
          <div
            className={`swipe-stack__exiting swipe-stack__exiting--${exitingCard.action}`}
          >
            <SwipeCard dog={exitingCard.dog} />
          </div>
        )}

        {/* Stack of cards */}
        {visibleCards.map((dog, index) => (
          <SwipeCard
            key={dog.id}
            dog={dog}
            isTop={index === 0 && !exitingCard}
            onSwipe={handleSwipe}
          />
        ))}
      </div>
    </div>
  )
}
