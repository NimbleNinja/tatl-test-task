import { QueryFunctionContext } from '@tanstack/react-query'
import { instance } from '../../../services/axiosConfig'
import { Student } from '../types'
import { ApiResponse } from './types'
import { FETCH_LIMIT, mockStudents } from '../../../utils/mockData'

export const getStudents = async ({ pageParam = 1 }: QueryFunctionContext): Promise<ApiResponse<Student>> => {
  const response = await instance.get<ApiResponse<Student>>(`Schoolboy?page=${pageParam}&limit=${FETCH_LIMIT}`)
  return response.data
}

export const getMockStudents = async ({ pageParam = 1 }: QueryFunctionContext): Promise<ApiResponse<Student>> => {
  const page = Number(pageParam)
  const startSliceIndex = (page - 1) * FETCH_LIMIT
  const endSliceIndex = (page - 1) * FETCH_LIMIT + FETCH_LIMIT

  return {
    Items: mockStudents.Items.slice(startSliceIndex, endSliceIndex),
    Quantity: mockStudents.Quantity
  }
}
