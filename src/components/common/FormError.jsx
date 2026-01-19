// ==============================================
// PawFriends - FormError Component
// ==============================================

import './FormError.scss'

// Droopy ear puppy silhouette - friendly error indicator
const DroopyPupIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    {/* Main head */}
    <ellipse cx="12" cy="12" rx="7" ry="6" />
    {/* Droopy left ear */}
    <path d="M5 10 Q3 8 4 14 Q5 16 6 14 Q7 12 5 10" />
    {/* Droopy right ear */}
    <path d="M19 10 Q21 8 20 14 Q19 16 18 14 Q17 12 19 10" />
    {/* Eyes */}
    <circle cx="9" cy="11" r="1.2" fill="white" />
    <circle cx="15" cy="11" r="1.2" fill="white" />
    <circle cx="9.3" cy="11.2" r="0.6" fill="currentColor" />
    <circle cx="15.3" cy="11.2" r="0.6" fill="currentColor" />
    {/* Nose */}
    <ellipse cx="12" cy="14" rx="1.5" ry="1" />
  </svg>
)

export default function FormError({ error, tip, className = '' }) {
  if (!error) return null

  const classNames = ['form-error', className].filter(Boolean).join(' ')

  return (
    <div className={classNames} role="alert">
      <span className="form-error__icon">
        <DroopyPupIcon />
      </span>
      <div className="form-error__content">
        <span className="form-error__message">{error}</span>
        {tip && <span className="form-error__tip">{tip}</span>}
      </div>
    </div>
  )
}
