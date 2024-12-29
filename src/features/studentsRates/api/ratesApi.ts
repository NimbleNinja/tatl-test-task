import { instance } from '../../../services/axiosConfig'
import { Rate } from '../types'
import { ApiResponse, ParamsRate, ParamsUnRate } from './types'

export const getRates = async () => {
  const response = await instance.get<ApiResponse<Rate>>('Rate')
  return response.data.Items
}

export const getStudentRatesById = async (SchoolboyId: number) => {
  const response = await instance.get<ApiResponse<Rate>>(`Rate?SchoolboyId=${SchoolboyId}`)
  return response.data.Items
}

export const rateStudent = async (data: ParamsRate) => {
  const response = await instance.post('Rate', data)
  return response.status
}

export const unRateStudent = async (data: ParamsUnRate) => {
  const response = await instance.post('UnRate', data)
  return response.status
}
