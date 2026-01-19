// ==============================================
// PawFriends - PetCard Component
// ==============================================

import { Link } from 'react-router-dom'
import { getEditPetRoute } from '../../constants/routes'
import './PetCard.scss'

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

export default function PetCard({
  dog,
  showActions = true,
  onDelete,
  onToggleActive,
  className = '',
}) {
  const {
    id,
    name,
    breed,
    age_years,
    gender,
    bio,
    photo_urls,
    is_active,
  } = dog

  const mainPhoto = photo_urls?.[0]
  const ageText = age_years === 0
    ? 'Less than 1 year'
    : age_years === 1
      ? '1 year old'
      : `${age_years} years old`

  const cardClasses = [
    'pet-card',
    !is_active && 'pet-card--inactive',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClasses}>
      {/* Photo */}
      <div className="pet-card__photo-container">
        {mainPhoto ? (
          <img src={mainPhoto} alt={name} className="pet-card__photo" />
        ) : (
          <div className="pet-card__photo-placeholder">
            <PawIcon />
          </div>
        )}

        {/* Gender badge */}
        <span className={`pet-card__gender pet-card__gender--${gender}`}>
          {gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
        </span>

        {/* Status badge */}
        {!is_active && (
          <span className="pet-card__status">Inactive</span>
        )}
      </div>

      {/* Content */}
      <div className="pet-card__content">
        <div className="pet-card__header">
          <h3 className="pet-card__name">{name}</h3>
          <span className="pet-card__age">{ageText}</span>
        </div>

        <p className="pet-card__breed">{breed}</p>

        {bio && (
          <p className="pet-card__bio">{bio}</p>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="pet-card__actions">
          <Link to={getEditPetRoute(id)} className="pet-card__action pet-card__action--edit">
            <EditIcon />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            className="pet-card__action pet-card__action--toggle"
            onClick={() => onToggleActive?.(id, !is_active)}
          >
            {is_active ? 'Deactivate' : 'Activate'}
          </button>

          <button
            type="button"
            className="pet-card__action pet-card__action--delete"
            onClick={() => onDelete?.(id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
