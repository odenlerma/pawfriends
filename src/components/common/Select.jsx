// ==============================================
// PawFriends - Select Component
// ==============================================

import { forwardRef, useId } from 'react'
import './Select.scss'

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    options = [],
    placeholder = 'Select an option',
    fullWidth = true,
    className = '',
    id,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const selectId = id || generatedId

  const wrapperClasses = [
    'select-wrapper',
    fullWidth && 'select-wrapper--full-width',
    error && 'select-wrapper--error',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={selectId} className="select-wrapper__label">
          {label}
        </label>
      )}

      <div className="select-wrapper__container">
        <select
          ref={ref}
          id={selectId}
          className="select-wrapper__select"
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="select-wrapper__icon">
          <ChevronIcon />
        </span>
      </div>

      {error && (
        <span id={`${selectId}-error`} className="select-wrapper__error" role="alert">
          {error}
        </span>
      )}

      {hint && !error && (
        <span id={`${selectId}-hint`} className="select-wrapper__hint">
          {hint}
        </span>
      )}
    </div>
  )
})

export default Select
