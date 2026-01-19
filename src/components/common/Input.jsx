// ==============================================
// PawFriends - Input Component
// ==============================================

import { forwardRef } from 'react'
import './Input.scss'

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    iconPosition = 'left',
    fullWidth = true,
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`

  const wrapperClasses = [
    'input-wrapper',
    fullWidth && 'input-wrapper--full-width',
    error && 'input-wrapper--error',
    icon && `input-wrapper--has-icon-${iconPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="input-wrapper__label">
          {label}
        </label>
      )}

      <div className="input-wrapper__container">
        {icon && iconPosition === 'left' && (
          <span className="input-wrapper__icon input-wrapper__icon--left">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className="input-wrapper__input"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <span className="input-wrapper__icon input-wrapper__icon--right">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <span id={`${inputId}-error`} className="input-wrapper__error" role="alert">
          {error}
        </span>
      )}

      {hint && !error && (
        <span id={`${inputId}-hint`} className="input-wrapper__hint">
          {hint}
        </span>
      )}
    </div>
  )
})

export default Input
