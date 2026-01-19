// ==============================================
// PawFriends - Textarea Component
// ==============================================

import { forwardRef } from 'react'
import './Textarea.scss'

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    maxLength,
    showCount = false,
    fullWidth = true,
    className = '',
    id,
    value = '',
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(7)}`
  const currentLength = value?.length || 0

  const wrapperClasses = [
    'textarea-wrapper',
    fullWidth && 'textarea-wrapper--full-width',
    error && 'textarea-wrapper--error',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      <div className="textarea-wrapper__header">
        {label && (
          <label htmlFor={textareaId} className="textarea-wrapper__label">
            {label}
          </label>
        )}

        {showCount && maxLength && (
          <span
            className={`textarea-wrapper__count ${
              currentLength > maxLength ? 'textarea-wrapper__count--over' : ''
            }`}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        className="textarea-wrapper__textarea"
        rows={rows}
        maxLength={maxLength}
        value={value}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
        }
        {...props}
      />

      {error && (
        <span
          id={`${textareaId}-error`}
          className="textarea-wrapper__error"
          role="alert"
        >
          {error}
        </span>
      )}

      {hint && !error && (
        <span id={`${textareaId}-hint`} className="textarea-wrapper__hint">
          {hint}
        </span>
      )}
    </div>
  )
})

export default Textarea
