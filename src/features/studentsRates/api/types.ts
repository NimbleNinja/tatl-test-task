import { Rate } from '../types'

export type ApiResponse<T> = {
  Items: T[]
  Quantity: number
}

export type ParamsRate = Omit<Rate, 'Id'>
export type ParamsUnRate = Omit<Rate, 'Id' | 'Title'>
