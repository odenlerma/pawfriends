// ==============================================
// PawFriends - LoadingPaws Component
// ==============================================

import './LoadingPaws.scss'

const PawPrint = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

export default function LoadingPaws({
  size = 'md',
  label,
  pawCount = 4,
  className = '',
}) {
  const classNames = [
    'loading-paws',
    `loading-paws--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} role="status" aria-label={label || 'Loading'}>
      <div className="loading-paws__track">
        {Array.from({ length: pawCount }).map((_, index) => (
          <span
            key={index}
            className="loading-paws__paw"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <PawPrint />
          </span>
        ))}
      </div>
      {label && <span className="loading-paws__label">{label}</span>}
    </div>
  )
}
