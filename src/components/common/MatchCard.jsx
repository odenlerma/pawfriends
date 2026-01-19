// ==============================================
// PawFriends - MatchCard Component
// ==============================================

import './MatchCard.scss'

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

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

export default function MatchCard({ match, myDogIds = [], className = '' }) {
  const { dog1, dog2, created_at } = match

  // Determine which is my dog and which is the match
  const isMyDog1 = myDogIds.includes(dog1?.id)
  const myDog = isMyDog1 ? dog1 : dog2
  const otherDog = isMyDog1 ? dog2 : dog1

  const myDogPhoto = myDog?.photo_urls?.[0]
  const otherDogPhoto = otherDog?.photo_urls?.[0]

  // Format match date
  const matchDate = new Date(created_at)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: matchDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })

  const cardClasses = ['match-card', className].filter(Boolean).join(' ')

  return (
    <div className={cardClasses}>
      {/* Photos */}
      <div className="match-card__photos">
        <div className="match-card__photo match-card__photo--mine">
          {myDogPhoto ? (
            <img src={myDogPhoto} alt={myDog?.name} />
          ) : (
            <span className="match-card__photo-fallback">
              {myDog?.name?.charAt(0)}
            </span>
          )}
        </div>

        <div className="match-card__heart">
          <HeartIcon />
        </div>

        <div className="match-card__photo match-card__photo--other">
          {otherDogPhoto ? (
            <img src={otherDogPhoto} alt={otherDog?.name} />
          ) : (
            <span className="match-card__photo-fallback">
              {otherDog?.name?.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="match-card__info">
        <div className="match-card__names">
          <span className="match-card__name match-card__name--mine">
            {myDog?.name}
          </span>
          <span className="match-card__and">&</span>
          <span className="match-card__name match-card__name--other">
            {otherDog?.name}
            <span
              className={`match-card__gender match-card__gender--${otherDog?.gender}`}
            >
              {otherDog?.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
            </span>
          </span>
        </div>

        <p className="match-card__breed">{otherDog?.breed}</p>

        {otherDog?.owner && (
          <p className="match-card__owner">
            Owner: {otherDog.owner.display_name}
          </p>
        )}

        <span className="match-card__date">Matched {formattedDate}</span>
      </div>
    </div>
  )
}
