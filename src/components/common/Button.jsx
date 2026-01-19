// ==============================================
// PawFriends - Button Component
// ==============================================

import './Button.scss'

const MiniPaw = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    icon && !children && 'btn--icon-only',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn__paws">
          <span className="btn__paw"><MiniPaw /></span>
          <span className="btn__paw"><MiniPaw /></span>
        </span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="btn__icon btn__icon--left">{icon}</span>
          )}
          {children && <span className="btn__text">{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="btn__icon btn__icon--right">{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
