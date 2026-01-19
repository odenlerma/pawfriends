// ==============================================
// PawFriends - Header Component
// ==============================================

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useDogStore } from '../../stores/dogStore'
import { ROUTES, NAV_ROUTES } from '../../constants/routes'
import './Header.scss'

// Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
    <path d="M19 15L19.5 17L21.5 17.5L19.5 18L19 20L18.5 18L16.5 17.5L18.5 17L19 15Z" />
  </svg>
)

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const getIcon = (iconName) => {
  switch (iconName) {
    case 'home':
      return <HomeIcon />
    case 'heart':
      return <HeartIcon />
    case 'sparkles':
      return <SparklesIcon />
    case 'paw':
      return <PawIcon />
    default:
      return null
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { profile, signOut } = useAuthStore()
  const { matchCount, reset: resetDogStore } = useDogStore()

  const handleSignOut = async () => {
    try {
      await signOut()
      resetDogStore()
      navigate(ROUTES.LANDING)
    } catch {
      // Error handled in store
    }
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to={ROUTES.DASHBOARD} className="header__logo">
          <span className="header__logo-icon">
            <PawIcon />
          </span>
          <span className="header__logo-text">
            Paw<span>Friends</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav header__nav--desktop">
          {NAV_ROUTES.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              <span className="header__nav-icon">{getIcon(route.icon)}</span>
              <span className="header__nav-label">{route.label}</span>
              {route.path === ROUTES.MATCHES && matchCount > 0 && (
                <span className="header__nav-badge">{matchCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User menu (desktop) */}
        <div className="header__user header__user--desktop">
          <span className="header__user-name">{profile?.display_name}</span>
          <button
            type="button"
            className="header__user-logout"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="header__menu-toggle"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`header__mobile-menu ${menuOpen ? 'header__mobile-menu--open' : ''}`}>
        <nav className="header__nav header__nav--mobile">
          {NAV_ROUTES.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
              onClick={closeMenu}
            >
              <span className="header__nav-icon">{getIcon(route.icon)}</span>
              <span className="header__nav-label">{route.label}</span>
              {route.path === ROUTES.MATCHES && matchCount > 0 && (
                <span className="header__nav-badge">{matchCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="header__mobile-footer">
          <span className="header__user-name">{profile?.display_name}</span>
          <button
            type="button"
            className="header__sign-out-btn"
            onClick={() => {
              closeMenu()
              handleSignOut()
            }}
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
