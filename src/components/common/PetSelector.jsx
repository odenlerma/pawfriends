// ==============================================
// PawFriends - PetSelector Component
// ==============================================

import './PetSelector.scss'

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
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

export default function PetSelector({
  dogs = [],
  selectedDog,
  onSelect,
  label = 'Select your pet',
  className = '',
}) {
  // Filter to only show active dogs
  const activeDogs = dogs.filter((dog) => dog.is_active)

  if (activeDogs.length === 0) {
    return (
      <div className={`pet-selector pet-selector--empty ${className}`}>
        <p className="pet-selector__empty-text">
          No active pets available. Add a pet to start matching!
        </p>
      </div>
    )
  }

  return (
    <div className={`pet-selector ${className}`}>
      {label && <label className="pet-selector__label">{label}</label>}

      <div className="pet-selector__list">
        {activeDogs.map((dog) => {
          const isSelected = selectedDog?.id === dog.id
          const mainPhoto = dog.photo_urls?.[0]

          return (
            <button
              key={dog.id}
              type="button"
              className={`pet-selector__item ${
                isSelected ? 'pet-selector__item--selected' : ''
              }`}
              onClick={() => onSelect(dog)}
              aria-pressed={isSelected}
            >
              <div className="pet-selector__avatar">
                {mainPhoto ? (
                  <img src={mainPhoto} alt={dog.name} />
                ) : (
                  <span className="pet-selector__avatar-fallback">
                    {dog.name.charAt(0)}
                  </span>
                )}

                {isSelected && (
                  <span className="pet-selector__check">
                    <CheckIcon />
                  </span>
                )}
              </div>

              <div className="pet-selector__info">
                <span className="pet-selector__name">{dog.name}</span>
                <span className="pet-selector__breed">{dog.breed}</span>
              </div>

              <span
                className={`pet-selector__gender pet-selector__gender--${dog.gender}`}
              >
                {dog.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
