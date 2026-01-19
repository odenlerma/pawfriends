// ==============================================
// PawFriends - Modal Component
// ==============================================

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './Modal.scss'

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  className = '',
}) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose()
      }
    },
    [onClose]
  )

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlay && onClose) {
      onClose()
    }
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.body.style.overflow = originalStyle
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const modalClasses = ['modal__content', `modal__content--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal__overlay" onClick={handleOverlayClick}>
        <div className={modalClasses}>
          {(title || showClose) && (
            <div className="modal__header">
              {title && (
                <h2 id="modal-title" className="modal__title">
                  {title}
                </h2>
              )}
              {showClose && (
                <button
                  type="button"
                  className="modal__close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}
          <div className="modal__body">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Sub-components for composition
Modal.Header = function ModalHeader({ children, className = '' }) {
  return <div className={`modal__custom-header ${className}`}>{children}</div>
}

Modal.Body = function ModalBody({ children, className = '' }) {
  return <div className={`modal__custom-body ${className}`}>{children}</div>
}

Modal.Footer = function ModalFooter({ children, className = '' }) {
  return <div className={`modal__footer ${className}`}>{children}</div>
}
