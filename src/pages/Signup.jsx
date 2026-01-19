// ==============================================
// PawFriends - Signup Page
// ==============================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { ROUTES } from '../constants/routes'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import FormError from '../components/common/FormError'
import SuccessMessage from '../components/common/SuccessMessage'
import './Signup.scss'

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

const signupSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, isLoading } = useAuthStore()

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Validate
    const result = signupSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      })
      setSuccess(true)
    } catch (error) {
      setSubmitError(error.message || 'Failed to create account. Please try again.')
    }
  }

  // Success state
  if (success) {
    return (
      <div className="signup">
        <div className="signup__container">
          <Link to={ROUTES.LANDING} className="signup__logo">
            <span className="signup__logo-icon">
              <PawIcon />
            </span>
            <span className="signup__logo-text">
              Paw<span>Friends</span>
            </span>
          </Link>

          <div className="signup__card signup__card--success">
            <div className="signup__confetti" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="signup__confetti-piece" />
              ))}
            </div>

            <SuccessMessage
              title="Check your email!"
              message={`We've sent a confirmation link to ${formData.email}. Please click the link to activate your account.`}
              variant="card"
            >
              <Link to={ROUTES.LOGIN}>
                <Button variant="teal" size="lg">
                  Go to Login
                </Button>
              </Link>
            </SuccessMessage>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="signup">
      <div className="signup__container">
        {/* Logo */}
        <Link to={ROUTES.LANDING} className="signup__logo">
          <span className="signup__logo-icon">
            <PawIcon />
          </span>
          <span className="signup__logo-text">
            Paw<span>Friends</span>
          </span>
        </Link>

        {/* Card */}
        <div className="signup__card">
          <div className="signup__header">
            <h1 className="signup__title">Create an account</h1>
            <p className="signup__subtitle">Join PawFriends and find playmates for your pup</p>
          </div>

          <form onSubmit={handleSubmit} className="signup__form">
            {submitError && (
              <FormError
                error={submitError}
                tip="Check your details and try again"
              />
            )}

            <Input
              label="Display Name"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your name"
              icon={<UserIcon />}
              error={errors.displayName}
              autoComplete="name"
              autoFocus
            />

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
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              icon={<LockIcon />}
              error={errors.password}
              hint="Min 8 chars with uppercase, lowercase, and number"
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={<LockIcon />}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="signup__footer">
            <p>
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="signup__link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
