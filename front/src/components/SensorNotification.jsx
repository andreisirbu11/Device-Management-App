import React from 'react'
import './SensorNotification.css'

const SensorNotification = ({notifications, setNotifications}) => {
  return (
    <div className="notification-stack">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification${notification.removing ? ' removing' : ''}`}>
          <div className="notification-content">
            <div className="notification-message">{notification.message}</div>
            <div className="notification-close" onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}>
              &times;
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SensorNotification