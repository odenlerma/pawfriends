// ==============================================
// PawFriends - Dashboard Page
// ==============================================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useDogStore } from '../stores/dogStore'
import { ROUTES } from '../constants/routes'
import Button from '../components/common/Button'
import './Dashboard.scss'

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
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
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export default function Dashboard() {
  const { user, profile } = useAuthStore()
  const { myDogs, matchCount, fetchMyDogs, fetchMatchCount } = useDogStore()

  useEffect(() => {
    if (user?.id) {
      fetchMyDogs(user.id)
      fetchMatchCount(user.id)
    }
  }, [user?.id, fetchMyDogs, fetchMatchCount])

  const activeDogs = myDogs.filter((dog) => dog.is_active)
  const hasNoDogs = myDogs.length === 0

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        {/* Welcome Section */}
        <section className="dashboard__welcome">
          <h1 className="dashboard__greeting">
            Hello, {profile?.display_name || 'friend'}!
          </h1>
          <p className="dashboard__subtitle">
            {hasNoDogs
              ? "Let's add your first furry friend!"
              : `You have ${activeDogs.length} active pup${activeDogs.length !== 1 ? 's' : ''} ready to make friends`}
          </p>
        </section>

        {/* Stats Cards */}
        <section className="dashboard__stats">
          <div className="dashboard__stat-card">
            <span className="dashboard__stat-icon dashboard__stat-icon--paw">
              <PawIcon />
            </span>
            <div className="dashboard__stat-content">
              <span className="dashboard__stat-value">{myDogs.length}</span>
              <span className="dashboard__stat-label">My Pets</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <span className="dashboard__stat-icon dashboard__stat-icon--heart">
              <HeartIcon />
            </span>
            <div className="dashboard__stat-content">
              <span className="dashboard__stat-value">{matchCount}</span>
              <span className="dashboard__stat-label">Matches</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <span className="dashboard__stat-icon dashboard__stat-icon--sparkles">
              <SparklesIcon />
            </span>
            <div className="dashboard__stat-content">
              <span className="dashboard__stat-value">{activeDogs.length}</span>
              <span className="dashboard__stat-label">Active</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard__actions">
          <h2 className="dashboard__section-title">Quick Actions</h2>

          <div className="dashboard__action-grid">
            {hasNoDogs ? (
              <Link to={ROUTES.ADD_PET} className="dashboard__action-card dashboard__action-card--primary">
                <span className="dashboard__action-icon">
                  <PlusIcon />
                </span>
                <h3>Add Your First Pet</h3>
                <p>Create a profile for your furry friend to start matching</p>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.MATCHING} className="dashboard__action-card dashboard__action-card--primary">
                  <span className="dashboard__action-icon">
                    <HeartIcon />
                  </span>
                  <h3>Find Friends</h3>
                  <p>Swipe through profiles and find playmates for your pup</p>
                </Link>

                <Link to={ROUTES.MATCHES} className="dashboard__action-card">
                  <span className="dashboard__action-icon">
                    <SparklesIcon />
                  </span>
                  <h3>View Matches</h3>
                  <p>
                    {matchCount > 0
                      ? `You have ${matchCount} match${matchCount !== 1 ? 'es' : ''} waiting!`
                      : 'See your matched pets here'}
                  </p>
                </Link>

                <Link to={ROUTES.MY_PETS} className="dashboard__action-card">
                  <span className="dashboard__action-icon">
                    <PawIcon />
                  </span>
                  <h3>Manage Pets</h3>
                  <p>Edit profiles, add photos, or add more pets</p>
                </Link>

                <Link to={ROUTES.ADD_PET} className="dashboard__action-card">
                  <span className="dashboard__action-icon">
                    <PlusIcon />
                  </span>
                  <h3>Add Another Pet</h3>
                  <p>Got more furry friends? Add them too!</p>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* My Pets Preview */}
        {myDogs.length > 0 && (
          <section className="dashboard__pets-preview">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">My Pets</h2>
              <Link to={ROUTES.MY_PETS} className="dashboard__view-all">
                View All
              </Link>
            </div>

            <div className="dashboard__pets-grid">
              {myDogs.slice(0, 4).map((dog) => (
                <div
                  key={dog.id}
                  className={`dashboard__pet-card ${!dog.is_active ? 'dashboard__pet-card--inactive' : ''}`}
                >
                  <div className="dashboard__pet-photo">
                    {dog.photo_urls?.[0] ? (
                      <img src={dog.photo_urls[0]} alt={dog.name} />
                    ) : (
                      <span className="dashboard__pet-fallback">
                        {dog.name.charAt(0)}
                      </span>
                    )}
                    {!dog.is_active && (
                      <span className="dashboard__pet-badge">Inactive</span>
                    )}
                  </div>
                  <span className="dashboard__pet-name">{dog.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
