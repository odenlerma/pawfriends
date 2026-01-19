// ==============================================
// PawFriends - Route Constants
// ==============================================

export const ROUTES = {
  // Public routes
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Protected routes
  DASHBOARD: '/dashboard',
  MY_PETS: '/my-pets',
  ADD_PET: '/my-pets/add',
  EDIT_PET: '/my-pets/:id/edit',
  MATCHING: '/matching',
  MATCHES: '/matches',
}

// Helper to generate edit pet route with ID
export const getEditPetRoute = (petId) => `/my-pets/${petId}/edit`

// Route groups for navigation
export const NAV_ROUTES = [
  { path: ROUTES.DASHBOARD, label: 'Home', icon: 'home' },
  { path: ROUTES.MATCHING, label: 'Find Friends', icon: 'heart' },
  { path: ROUTES.MATCHES, label: 'Matches', icon: 'sparkles' },
  { path: ROUTES.MY_PETS, label: 'My Pets', icon: 'paw' },
]

// Public routes (no auth required)
export const PUBLIC_ROUTES = [
  ROUTES.LANDING,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
]

// Check if route is public
export const isPublicRoute = (path) => PUBLIC_ROUTES.includes(path)
