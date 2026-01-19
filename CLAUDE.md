# PawFriends - Code Structure & Naming Conventions

## Project Overview

**PawFriends Web App** - React + Vite frontend application for pet-related services.

| Repository | Tech Stack | Path |
|------------|------------|------|
| Web App | React 19, Vite 7, SCSS, Zustand, **Javascript ONLY** | `/Users/lmph/Desktop/audruey/pawfriends` |
| API | Express 5, Node.js | `/Users/lmph/Desktop/audruey/pawfriends-api` |

## Folder Structure

```
src/
├── assets/              # Static assets (images, fonts, icons)
├── components/          # Reusable UI components
│   ├── common/          # Generic shared components (Button, Input, Modal)
│   └── layout/          # Layout components (Header, Footer, Sidebar)
├── pages/               # Page-level components (route views)
├── hooks/               # Custom React hooks
├── services/            # API calls and external service integrations
├── stores/              # Zustand stores
├── utils/               # Utility functions and helpers
├── styles/              # Global SCSS (variables, mixins, global styles)
├── constants/           # Application constants
├── __tests__/           # Test files (mirrors src structure)
├── App.jsx
├── main.jsx
└── index.scss
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.jsx | `UserProfile.jsx` |
| Hooks | camelCase with `use` prefix | `useAuth.js` |
| Services | camelCase + Service suffix | `authService.js` |
| Stores | camelCase + Store suffix | `userStore.js` |
| Utilities | camelCase | `formatDate.js` |
| Styles | Match component name | `UserProfile.scss` |
| Tests | ComponentName.test.jsx | `UserProfile.test.jsx` |
| Constants | camelCase | `apiEndpoints.js` |

## Component Conventions

- **PascalCase** for component names
- One component per file
- Default export for main component
- Named exports for sub-components if needed

```jsx
// UserProfile.jsx
export default function UserProfile({ user }) {
  return <div className="user-profile">...</div>
}
```

## Variable Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isLoading` |
| Functions | camelCase | `handleSubmit`, `fetchUsers` |
| Hooks | camelCase with `use` prefix | `useAuth`, `useDebounce` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Components | PascalCase | `UserProfile`, `NavBar` |
| Boolean | `is`/`has`/`can` prefix | `isActive`, `hasError`, `canEdit` |

## Zustand Store Conventions

- Store files in `src/stores/`
- Named `[feature]Store.js`
- Export as named hook `use[Feature]Store`

```javascript
// stores/authStore.js
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
```

## CSS/SCSS Conventions

- **BEM methodology** for class names: `block__element--modifier`
- Component-scoped SCSS files alongside components
- Global variables in `styles/_variables.scss`
- Global mixins in `styles/_mixins.scss`

```scss
// UserProfile.scss
.user-profile {
  &__avatar {
    // element
  }
  &__name {
    &--highlighted {
      // modifier
    }
  }
}
```

## Testing Conventions

- **Vitest** for unit/integration tests
- **React Testing Library** for component tests
- Test files alongside components or in `__tests__/`
- Name pattern: `[ComponentName].test.jsx`

```javascript
// UserProfile.test.jsx
import { render, screen } from '@testing-library/react'
import UserProfile from './UserProfile'

describe('UserProfile', () => {
  it('renders user name', () => {
    render(<UserProfile user={{ name: 'John' }} />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })
})
```

## API Service Pattern

```javascript
// services/userService.js
const API_BASE = import.meta.env.VITE_API_URL

export const userService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/users`)
    return response.json()
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`)
    return response.json()
  },
}
```

## Import Order

1. React and framework imports
2. Third-party libraries
3. Local components
4. Hooks
5. Services/stores
6. Utils/constants
7. Styles

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import { formatDate } from '@/utils/formatDate'

import './UserProfile.scss'
```
