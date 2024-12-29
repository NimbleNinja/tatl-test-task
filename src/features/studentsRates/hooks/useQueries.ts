import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getColumns } from '../api/columnsApi'
import { getMockStudents, getStudents } from '../api/studentsApi'
import { ApiResponse, ParamsRate, ParamsUnRate } from '../api/types'
import { Column, Rate, Student } from '../types'
import { getRates, getStudentRatesById, rateStudent, unRateStudent } from '../api/ratesApi'
import { NotificationParams } from './types'
import { FETCH_LIMIT } from '../../../utils/mockData'

export const useColumnsQuery = () => {
  return useQuery<Column[]>({
    queryKey: ['Column'],
    queryFn: getColumns
  })
}

export const useStudentsQuery = () => {
  return useInfiniteQuery<ApiResponse<Student>>({
    queryKey: ['Schoolboy'],
    //queryFn: getMockStudents,
    queryFn: getStudents,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const pagesCount = Math.ceil(lastPage.Quantity / FETCH_LIMIT)
      // додаткова перевірка для некоректно працюючого роута (!пагінація)
      if (lastPage.Items.length === lastPage.Quantity) {
        return undefined
      }

      const formatedLastPage = Number(lastPageParam)
      if (formatedLastPage < pagesCount) {
        return formatedLastPage + 1
      }

      return undefined
    }
  })
}

export const useRatesQuery = () => {
  return useQuery<Rate[]>({
    queryKey: ['Rate'],
    queryFn: getRates
  })
}

export const useUnRateMutation = (addNotification: (notification: NotificationParams) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['Rate'],
    mutationFn: async (unRateParams: ParamsUnRate) => {
      await unRateStudent(unRateParams)
      return unRateParams
    },
    onMutate: async unRateParams => {
      await queryClient.cancelQueries({ queryKey: ['Rate'] })
      const previousRates = queryClient.getQueryData<Rate[]>(['Rate'])

      if (previousRates) {
        const newRatesArr = previousRates.filter(({ SchoolboyId, ColumnId }) => {
          return !(SchoolboyId === unRateParams.SchoolboyId && ColumnId === unRateParams.ColumnId)
        })
        queryClient.setQueryData(['Rate'], newRatesArr)
      }

      return { previousRates }
    },
    onError: (error, variables, context) => {
      if (context?.previousRates) {
        queryClient.setQueryData<Rate[]>(['Rate'], context.previousRates)
      }
      addNotification({ message: 'Помилка при оновленні!', severity: 'error' })
    },
    onSettled: async data => {
      if (!data) return

      try {
        const allStudentRates = await getStudentRatesById(data.SchoolboyId)
        const currentRate = allStudentRates.find(({ SchoolboyId, ColumnId }) => {
          return SchoolboyId === data.SchoolboyId && ColumnId === data.ColumnId
        })

        if (currentRate) {
          // якщо елемент не видалився, оновлюємо всі Rate
          addNotification({ message: 'Помилка оновлення, пробуємо ще раз...', severity: 'warning' })
          queryClient.invalidateQueries({ queryKey: ['Rate'] })
        } else {
          // якщо видалився оновлюю кеш без завантаження всіх Rate
          queryClient.setQueryData(['Rate'], (old: Rate[]) => {
            return old.filter(rate => !(rate.SchoolboyId === data.SchoolboyId && rate.ColumnId === data.ColumnId))
          })
          addNotification({ message: 'Дані успішно оновлено!', severity: 'success' })
        }
      } catch (error) {
        addNotification({ message: 'Помилка оновлення, пробуємо ще раз...', severity: 'warning' })
        queryClient.invalidateQueries({ queryKey: ['Rate'] })
      }
    }
  })
}

export const useRateMutation = (addNotification: (notification: NotificationParams) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['Rate'],
    mutationFn: async (rateParams: ParamsRate) => {
      await rateStudent(rateParams)
      return rateParams
    },
    onMutate: async rateParams => {
      await queryClient.cancelQueries({ queryKey: ['Rate'] })
      const previousRates = queryClient.getQueryData<Rate[]>(['Rate'])

      if (previousRates) {
        const newRatesArr = [...previousRates, { Id: new Date().getTime(), ...rateParams }]
        queryClient.setQueryData(['Rate'], newRatesArr)
      }

      return { previousRates }
    },
    onError: (error, variables, context) => {
      if (context?.previousRates) {
        queryClient.setQueryData<Rate[]>(['Rate'], context.previousRates)
      }
      addNotification({ message: 'Помилка при оновленні!', severity: 'error' })
    },
    onSettled: async data => {
      if (!data) return

      try {
        const allStudentRates = await getStudentRatesById(data.SchoolboyId)
        const currentRate = allStudentRates.find(({ SchoolboyId, ColumnId }) => {
          return SchoolboyId === data.SchoolboyId && ColumnId === data.ColumnId
        })

        if (!currentRate) {
          addNotification({ message: 'Помилка оновлення, пробуємо ще раз...', severity: 'warning' })
          queryClient.invalidateQueries({ queryKey: ['Rate'] })
          return
        }

        queryClient.setQueryData(['Rate'], (old: Rate[]) => {
          return old.map(rate => {
            if (rate.SchoolboyId === data.SchoolboyId && rate.ColumnId === data.ColumnId) {
              return currentRate
            }
            return rate
          })
        })

        addNotification({ message: 'Дані успішно оновлено!', severity: 'success' })
      } catch (error) {
        addNotification({ message: 'Помилка оновлення, пробуємо ще раз...', severity: 'warning' })
        queryClient.invalidateQueries({ queryKey: ['Rate'] })
      }
    }
  })
}
