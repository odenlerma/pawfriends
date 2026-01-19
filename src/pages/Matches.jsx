// ==============================================
// PawFriends - Matches Page
// ==============================================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useDogStore } from '../stores/dogStore'
import { ROUTES } from '../constants/routes'
import MatchCard from '../components/common/MatchCard'
import Button from '../components/common/Button'
import './Matches.scss'

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
  </svg>
)

export default function Matches() {
  const { user } = useAuthStore()
  const { myDogs, matches, isLoading, fetchMyDogs, fetchMatches } = useDogStore()

  useEffect(() => {
    if (user?.id) {
      fetchMyDogs(user.id)
      fetchMatches(user.id)
    }
  }, [user?.id, fetchMyDogs, fetchMatches])

  const myDogIds = myDogs.map((d) => d.id)
  const hasNoMatches = matches.length === 0

  return (
    <div className="matches">
      <div className="matches__container">
        {/* Header */}
        <div className="matches__header">
          <h1 className="matches__title">My Matches</h1>
          <p className="matches__subtitle">
            {hasNoMatches
              ? "You don't have any matches yet"
              : `You have ${matches.length} match${matches.length !== 1 ? 'es' : ''}`}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && matches.length === 0 && (
          <div className="matches__loading">
            <div className="matches__loading-spinner" />
            <p>Loading matches...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && hasNoMatches && (
          <div className="matches__empty">
            <div className="matches__empty-icon">
              <HeartIcon />
            </div>
            <h2>No matches yet</h2>
            <p>
              Start swiping to find playmates for your pup!
              <br />
              When both dogs like each other, it's a match!
            </p>
            <Link to={ROUTES.MATCHING}>
              <Button variant="primary" size="lg" icon={<SparklesIcon />}>
                Find Friends
              </Button>
            </Link>
          </div>
        )}

        {/* Matches list */}
        {matches.length > 0 && (
          <div className="matches__list">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className="matches__item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MatchCard match={match} myDogIds={myDogIds} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
