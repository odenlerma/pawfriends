// ==============================================
// PawFriends - Login Page
// ==============================================

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import FormError from '../components/common/FormError'
import SuccessMessage from '../components/common/SuccessMessage'
import './Login.scss'

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isLoading } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Validate
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      })
      // Show success briefly before redirect
      setShowSuccess(true)
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 500)
    } catch (error) {
      setSubmitError(error.message || 'Failed to sign in. Please try again.')
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        {/* Logo */}
        <Link to={ROUTES.LANDING} className="login__logo">
          <span className="login__logo-icon">
            <PawIcon />
          </span>
          <span className="login__logo-text">
            Paw<span>Friends</span>
          </span>
        </Link>

        {/* Card */}
        <div className={`login__card ${showSuccess ? 'login__card--success' : ''}`}>
          {showSuccess ? (
            <div className="login__success">
              <SuccessMessage
                title="Welcome back!"
                variant="inline"
                showPaws={false}
              />
            </div>
          ) : (
            <>
              <div className="login__header">
                <h1 className="login__title">Welcome back!</h1>
                <p className="login__subtitle">Sign in to continue to PawFriends</p>
              </div>

              <form onSubmit={handleSubmit} className="login__form">
                {submitError && (
                  <FormError
                    error={submitError}
                    tip="Try again or reset your password"
                  />
                )}

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={<EmailIcon />}
                  error={errors.email}
                  autoComplete="email"
                  autoFocus
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={<LockIcon />}
                  error={errors.password}
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  size="lg"
                >
                  Sign In
                </Button>
              </form>

              <div className="login__footer">
                <p>
                  Don't have an account?{' '}
                  <Link to={ROUTES.SIGNUP} className="login__link">
                    Sign up
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
