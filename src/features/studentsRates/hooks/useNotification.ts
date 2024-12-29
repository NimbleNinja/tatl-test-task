import { useState } from 'react'
import { Notification, NotificationParams } from './types'

export const useNotification = (): [Notification[], (notification: NotificationParams) => void] => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: NotificationParams) => {
    const newNotification: Notification = { ...notification, id: new Date().getTime().toString() }
    setNotifications(prev => [...prev, newNotification])

    setTimeout(() => {
      setNotifications(prev => {
        const [_, ...updatedNotifications] = prev
        return updatedNotifications
      })
    }, 3000)
  }

  return [notifications, addNotification]
}
