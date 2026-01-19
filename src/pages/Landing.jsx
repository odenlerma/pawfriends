// ==============================================
// PawFriends - Landing Page
// ==============================================

import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { ROUTES } from '../constants/routes'
import Button from '../components/common/Button'
import './Landing.scss'

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const features = [
  {
    icon: '1',
    title: 'Add Your Pup',
    description: 'Create a profile for your furry friend with photos and details',
  },
  {
    icon: '2',
    title: 'Swipe & Match',
    description: 'Find compatible pups in your area with our fun swiping feature',
  },
  {
    icon: '3',
    title: 'Make Friends',
    description: 'Connect with other pet parents and arrange playdates',
  },
]

export default function Landing() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing__header">
        <div className="landing__header-container">
          <Link to={ROUTES.LANDING} className="landing__logo">
            <span className="landing__logo-icon">
              <PawIcon />
            </span>
            <span className="landing__logo-text">
              Paw<span>Friends</span>
            </span>
          </Link>

          <nav className="landing__nav">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="landing__nav-link">
                  Login
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-content">
          <h1 className="landing__title">
            Find the <span className="landing__title-highlight">Perfect</span>
            <br />
            Playmate for Your Pup
          </h1>
          <p className="landing__subtitle">
            Connect with other dog owners and help your furry friend find their
            new best friend. Swipe, match, and set up playdates!
          </p>

          <div className="landing__cta">
            <Link to={ROUTES.SIGNUP}>
              <Button variant="primary" size="xl">
                Get Started Free
              </Button>
            </Link>
            <p className="landing__cta-note">No credit card required</p>
          </div>
        </div>

        <div className="landing__hero-visual">
          <div className="landing__card landing__card--1">
            <div className="landing__card-img" style={{ backgroundColor: '#FFE5DC' }}>
              <PawIcon />
            </div>
            <span className="landing__card-name">Buddy</span>
          </div>
          <div className="landing__card landing__card--2">
            <div className="landing__card-img" style={{ backgroundColor: '#DCF5F3' }}>
              <PawIcon />
            </div>
            <span className="landing__card-name">Luna</span>
          </div>
          <div className="landing__match-heart">
            <HeartIcon />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing__features">
        <h2 className="landing__features-title">How It Works</h2>
        <div className="landing__features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="landing__feature"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="landing__feature-icon">{feature.icon}</span>
              <h3 className="landing__feature-title">{feature.title}</h3>
              <p className="landing__feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing__cta-section">
        <h2>Ready to Find Your Pup's BFF?</h2>
        <p>Join thousands of happy pet parents on PawFriends</p>
        <Link to={ROUTES.SIGNUP}>
          <Button variant="secondary" size="lg">
            Sign Up Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-content">
          <div className="landing__logo landing__logo--small">
            <span className="landing__logo-icon">
              <PawIcon />
            </span>
            <span className="landing__logo-text">
              Paw<span>Friends</span>
            </span>
          </div>
          <p className="landing__footer-text">
            Made with love for dogs everywhere
          </p>
        </div>
      </footer>
    </div>
  )
}
