import { AxiosError, AxiosResponse } from 'axios'

export type Notification = {
  id: string
  message: string
  severity: 'success' | 'warning' | 'error'
}

export type NotificationParams = Omit<Notification, 'id'>

export type ResponseStatusHandler = (data: AxiosError | AxiosResponse, params?: NotificationParams) => void
