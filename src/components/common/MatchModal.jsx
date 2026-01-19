// ==============================================
// PawFriends - MatchModal Component
// ==============================================

import Modal from './Modal'
import Button from './Button'
import './MatchModal.scss'

// Pre-generate confetti data at module level (not during render)
const CONFETTI_COLORS = ['#FF6B35', '#FF8E9B', '#4ECDC4', '#FF6B6B', '#FFB347']
const CONFETTI_PIECES = Array.from({ length: 50 }).map(() => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 0.5}s`,
  backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
}))

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default function MatchModal({
  isOpen,
  onClose,
  match,
  myDog,
  onViewMatches,
  onKeepSwiping,
}) {
  // Confetti shows when modal is open (CSS handles the animation duration)
  const showConfetti = isOpen

  if (!match || !myDog) return null

  // Determine which dog in the match is the other dog
  const otherDog = match.dog1?.id === myDog.id ? match.dog2 : match.dog1
  const myDogPhoto = myDog.photo_urls?.[0]
  const otherDogPhoto = otherDog?.photo_urls?.[0]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showClose={false}
      className="match-modal"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="match-modal__confetti">
          {CONFETTI_PIECES.map((style, i) => (
            <div
              key={i}
              className="match-modal__confetti-piece"
              style={style}
            />
          ))}
        </div>
      )}

      <div className="match-modal__content">
        {/* Pulsing heart */}
        <div className="match-modal__heart">
          <HeartIcon />
        </div>

        {/* Title */}
        <h2 className="match-modal__title">It's a Match!</h2>
        <p className="match-modal__subtitle">
          {myDog.name} and {otherDog?.name} liked each other
        </p>

        {/* Dog photos */}
        <div className="match-modal__dogs">
          <div className="match-modal__dog">
            {myDogPhoto ? (
              <img src={myDogPhoto} alt={myDog.name} />
            ) : (
              <span className="match-modal__dog-fallback">{myDog.name.charAt(0)}</span>
            )}
            <span className="match-modal__dog-name">{myDog.name}</span>
          </div>

          <div className="match-modal__connector">
            <HeartIcon />
          </div>

          <div className="match-modal__dog">
            {otherDogPhoto ? (
              <img src={otherDogPhoto} alt={otherDog?.name} />
            ) : (
              <span className="match-modal__dog-fallback">
                {otherDog?.name?.charAt(0)}
              </span>
            )}
            <span className="match-modal__dog-name">{otherDog?.name}</span>
          </div>
        </div>

        {/* Owner info */}
        {otherDog?.owner && (
          <p className="match-modal__owner">
            {otherDog.name}'s owner: <strong>{otherDog.owner.display_name}</strong>
          </p>
        )}

        {/* Actions */}
        <div className="match-modal__actions">
          <Button variant="secondary" onClick={onKeepSwiping}>
            Keep Swiping
          </Button>
          <Button variant="primary" onClick={onViewMatches}>
            View Matches
          </Button>
        </div>
      </div>
    </Modal>
  )
}
