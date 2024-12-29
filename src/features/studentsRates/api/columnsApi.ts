import { instance } from '../../../services/axiosConfig'
import { Column } from '../types'
import { ApiResponse } from './types'

export const getColumns = async () => {
  const response = await instance.get<ApiResponse<Column>>('Column')
  return response.data.Items
}
