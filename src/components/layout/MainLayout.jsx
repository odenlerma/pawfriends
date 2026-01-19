// ==============================================
// PawFriends - MainLayout Component
// ==============================================

import { Outlet } from 'react-router-dom'
import Header from './Header'
import './MainLayout.scss'

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
