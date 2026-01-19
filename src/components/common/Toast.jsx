// ==============================================
// PawFriends - Toast Component
// ==============================================

import './Toast.scss'

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

// Happy pup for success
const HappyPupIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    {/* Main head */}
    <ellipse cx="12" cy="12" rx="7" ry="6" />
    {/* Perky left ear */}
    <path d="M5 10 Q4 6 7 8 Q8 10 5 10" />
    {/* Perky right ear */}
    <path d="M19 10 Q20 6 17 8 Q16 10 19 10" />
    {/* Happy eyes (curved) */}
    <path d="M7.5 11 Q9 9.5 10.5 11" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13.5 11 Q15 9.5 16.5 11" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    {/* Nose */}
    <ellipse cx="12" cy="14" rx="1.5" ry="1" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
)

export default function Toast({ id, type = 'error', message, onDismiss }) {
  const Icon = type === 'success' ? HappyPupIcon : DroopyPupIcon

  return (
    <div
      className={`toast toast--${type}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast__icon">
        <Icon />
      </span>
      <span className="toast__message">{message}</span>
      <button
        type="button"
        className="toast__dismiss"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </div>
  )
}
