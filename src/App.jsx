// ==============================================
// PawFriends - App Component (Router Setup)
// ==============================================

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ROUTES } from './constants/routes'

// Layout
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import ToastContainer from './components/common/ToastContainer'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MyPets from './pages/MyPets'
import AddPet from './pages/AddPet'
import EditPet from './pages/EditPet'
import Matching from './pages/Matching'
import Matches from './pages/Matches'

export default function App() {
  const { initialize, setupAuthListener, isAuthenticated } = useAuthStore()

  // Initialize auth on mount
  useEffect(() => {
    initialize()
    const unsubscribe = setupAuthListener()
    return () => unsubscribe()
  }, [initialize, setupAuthListener])

  return (
    <>
      <ToastContainer />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Public routes */}
          <Route
            path={ROUTES.LANDING}
            element={
              isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Landing />
            }
          />
          <Route
            path={ROUTES.LOGIN}
            element={
              isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Signup />
            }
          />

          {/* Protected routes with MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.MY_PETS} element={<MyPets />} />
            <Route path={ROUTES.ADD_PET} element={<AddPet />} />
            <Route path={ROUTES.EDIT_PET} element={<EditPet />} />
            <Route path={ROUTES.MATCHING} element={<Matching />} />
            <Route path={ROUTES.MATCHES} element={<Matches />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
