// ==============================================
// PawFriends - MyPets Page
// ==============================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useDogStore } from '../stores/dogStore'
import { useNotificationStore } from '../stores/notificationStore'
import { ROUTES } from '../constants/routes'
import Button from '../components/common/Button'
import PetCard from '../components/common/PetCard'
import Modal from '../components/common/Modal'
import './MyPets.scss'

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-8-8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm16 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-12-6c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm8 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z" transform="translate(0, -4)" />
  </svg>
)

export default function MyPets() {
  const { user } = useAuthStore()
  const { myDogs, isLoading, fetchMyDogs, deleteDog, toggleDogActive } = useDogStore()
  const { showError } = useNotificationStore()

  const [deleteModal, setDeleteModal] = useState({ open: false, dogId: null, dogName: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchMyDogs(user.id)
    }
  }, [user?.id, fetchMyDogs])

  const handleDeleteClick = (dogId) => {
    const dog = myDogs.find((d) => d.id === dogId)
    setDeleteModal({ open: true, dogId, dogName: dog?.name || '' })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.dogId) return

    try {
      setIsDeleting(true)
      await deleteDog(deleteModal.dogId)
      setDeleteModal({ open: false, dogId: null, dogName: '' })
    } catch {
      showError('Failed to delete pet. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async (dogId, isActive) => {
    try {
      await toggleDogActive(dogId, isActive)
    } catch {
      showError('Failed to update pet status.')
    }
  }

  const hasNoDogs = myDogs.length === 0

  return (
    <div className="my-pets">
      <div className="my-pets__container">
        {/* Header */}
        <div className="my-pets__header">
          <div>
            <h1 className="my-pets__title">My Pets</h1>
            <p className="my-pets__subtitle">
              {hasNoDogs
                ? 'Add your first pet to get started'
                : `You have ${myDogs.length} pet${myDogs.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <Link to={ROUTES.ADD_PET}>
            <Button variant="primary" icon={<PlusIcon />}>
              Add Pet
            </Button>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && myDogs.length === 0 && (
          <div className="my-pets__loading">
            <div className="my-pets__loading-spinner" />
            <p>Loading your pets...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && hasNoDogs && (
          <div className="my-pets__empty">
            <div className="my-pets__empty-icon">
              <PawIcon />
            </div>
            <h2>No pets yet</h2>
            <p>Add your first furry friend to start finding playmates!</p>
            <Link to={ROUTES.ADD_PET}>
              <Button variant="primary" size="lg" icon={<PlusIcon />}>
                Add Your First Pet
              </Button>
            </Link>
          </div>
        )}

        {/* Pets grid */}
        {myDogs.length > 0 && (
          <div className="my-pets__grid">
            {myDogs.map((dog, index) => (
              <div
                key={dog.id}
                className="my-pets__card-wrapper"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <PetCard
                  dog={dog}
                  onDelete={handleDeleteClick}
                  onToggleActive={handleToggleActive}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, dogId: null, dogName: '' })}
        title="Delete Pet"
        size="sm"
      >
        <div className="my-pets__delete-modal">
          <p>
            Are you sure you want to delete <strong>{deleteModal.dogName}</strong>?
            This action cannot be undone.
          </p>
          <Modal.Footer>
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, dogId: null, dogName: '' })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  )
}
