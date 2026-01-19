// ==============================================
// PawFriends - ProtectedRoute Component
// ==============================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ROUTES } from '../../constants/routes'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="protected-route-loading__spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}
