// ==============================================
// PawFriends - Matching Page
// ==============================================

import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useDogStore } from '../stores/dogStore'
import { useNotificationStore } from '../stores/notificationStore'
import { ROUTES } from '../constants/routes'
import PetSelector from '../components/common/PetSelector'
import SwipeStack from '../components/common/SwipeStack'
import MatchModal from '../components/common/MatchModal'
import Button from '../components/common/Button'
import './Matching.scss'

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export default function Matching() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    myDogs,
    activeDog,
    candidates,
    isLoading,
    fetchMyDogs,
    setActiveDog,
    fetchCandidates,
    swipe,
  } = useDogStore()
  const { showError } = useNotificationStore()

  const [matchData, setMatchData] = useState(null)
  const [showMatchModal, setShowMatchModal] = useState(false)

  // Load user's dogs on mount
  useEffect(() => {
    if (user?.id) {
      fetchMyDogs(user.id)
    }
  }, [user?.id, fetchMyDogs])

  // Load candidates when active dog changes
  useEffect(() => {
    if (activeDog?.id) {
      fetchCandidates(activeDog.id)
    }
  }, [activeDog?.id, fetchCandidates])

  const handleSelectDog = (dog) => {
    setActiveDog(dog)
  }

  const handleSwipe = useCallback(
    async (swipedDogId, action) => {
      try {
        const match = await swipe(swipedDogId, action)

        // If it's a match, show the modal
        if (match) {
          setMatchData(match)
          setShowMatchModal(true)
        }

        // Fetch more candidates if running low
        if (candidates.length <= 2 && activeDog?.id) {
          fetchCandidates(activeDog.id)
        }
      } catch {
        showError('Something went wrong. Please try again.')
      }
    },
    [swipe, candidates.length, activeDog, fetchCandidates, showError]
  )

  const handleRefresh = () => {
    if (activeDog?.id) {
      fetchCandidates(activeDog.id)
    }
  }

  const handleViewMatches = () => {
    setShowMatchModal(false)
    navigate(ROUTES.MATCHES)
  }

  const handleKeepSwiping = () => {
    setShowMatchModal(false)
  }

  const activeDogs = myDogs.filter((dog) => dog.is_active)
  const hasNoDogs = myDogs.length === 0
  const hasNoActiveDogs = activeDogs.length === 0

  return (
    <div className="matching">
      <div className="matching__container">
        {/* Header */}
        <div className="matching__header">
          <h1 className="matching__title">Find Friends</h1>
          <p className="matching__subtitle">
            {activeDog
              ? `Swiping as ${activeDog.name}`
              : 'Select a pet to start matching'}
          </p>
        </div>

        {/* No pets state */}
        {hasNoDogs && (
          <div className="matching__empty">
            <h2>No pets yet</h2>
            <p>Add your first pet to start finding playmates!</p>
            <Link to={ROUTES.ADD_PET}>
              <Button variant="primary" icon={<PlusIcon />}>
                Add Your First Pet
              </Button>
            </Link>
          </div>
        )}

        {/* No active pets state */}
        {!hasNoDogs && hasNoActiveDogs && (
          <div className="matching__empty">
            <h2>No active pets</h2>
            <p>Activate at least one pet to start matching!</p>
            <Link to={ROUTES.MY_PETS}>
              <Button variant="primary">Manage Pets</Button>
            </Link>
          </div>
        )}

        {/* Matching interface */}
        {activeDogs.length > 0 && (
          <>
            {/* Pet selector */}
            <div className="matching__selector">
              <PetSelector
                dogs={myDogs}
                selectedDog={activeDog}
                onSelect={handleSelectDog}
                label="Swiping as:"
              />
            </div>

            {/* Swipe area */}
            <div className="matching__swipe-area">
              {activeDog ? (
                <SwipeStack
                  candidates={candidates}
                  onSwipe={handleSwipe}
                  onEmpty={handleRefresh}
                  isLoading={isLoading && candidates.length === 0}
                />
              ) : (
                <div className="matching__select-prompt">
                  <p>Select one of your pets above to start swiping!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        match={matchData}
        myDog={activeDog}
        onViewMatches={handleViewMatches}
        onKeepSwiping={handleKeepSwiping}
      />
    </div>
  )
}
