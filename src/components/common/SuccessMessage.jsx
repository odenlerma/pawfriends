// ==============================================
// PawFriends - SuccessMessage Component
// ==============================================

import './SuccessMessage.scss'

const AnimatedCheck = () => (
  <svg
    className="success-message__check"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PawDecoration = ({ position }) => (
  <svg
    className={`success-message__paw success-message__paw--${position}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

export default function SuccessMessage({
  title,
  message,
  variant = 'card',
  showPaws = true,
  className = '',
  children,
}) {
  const classNames = [
    'success-message',
    `success-message--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} role="status" aria-live="polite">
      <div className="success-message__icon-container">
        <div className="success-message__icon-bg">
          <AnimatedCheck />
        </div>
        {showPaws && (
          <>
            <PawDecoration position="left" />
            <PawDecoration position="right" />
          </>
        )}
      </div>

      {title && <h3 className="success-message__title">{title}</h3>}
      {message && <p className="success-message__text">{message}</p>}
      {children && <div className="success-message__content">{children}</div>}
    </div>
  )
}
