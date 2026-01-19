// ==============================================
// PawFriends - ToastContainer Component
// ==============================================

import { useNotificationStore } from '../../stores/notificationStore'
import Toast from './Toast'

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  )
}
