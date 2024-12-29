import StudentsTable from './components/StudentsTable'
import { useNavigate } from 'react-router'
import { Alert, Box, Button, LinearProgress, Snackbar, Typography } from '@mui/material'
import { ParamsRate } from './api/types'
import { useCallback } from 'react'
import { useNotification } from './hooks/useNotification'
import {
  useColumnsQuery,
  useRateMutation,
  useRatesQuery,
  useStudentsQuery,
  useUnRateMutation
} from './hooks/useQueries'
import { useQueryClient } from '@tanstack/react-query'

function StudentsRates() {
  const navigation = useNavigate()
  const [notifications, addNotification] = useNotification()
  const queryClient = useQueryClient()

  const columnsQuery = useColumnsQuery()
  const studentsQuery = useStudentsQuery()
  const ratesQuery = useRatesQuery()
  const unRateMutation = useUnRateMutation(addNotification)
  const rateMutation = useRateMutation(addNotification)

  const navigateToStudentPage = (studentId: number) => {
    navigation(`student?SchoolboyId=${studentId}`)
  }

  const handleStudentRate = async (SchoolboyId: number, ColumnId: number, isUnRate: boolean) => {
    if (isUnRate) {
      unRateMutation.mutate({ SchoolboyId, ColumnId })
    } else {
      const newRate: ParamsRate = {
        SchoolboyId,
        ColumnId,
        Title: 'H'
      }

      rateMutation.mutate(newRate)
    }
  }

  const { hasNextPage, fetchNextPage } = studentsQuery
  const loadMoreStudents = useCallback(() => {
    if (hasNextPage) fetchNextPage()
  }, [fetchNextPage, hasNextPage])

  const isFetching =
    columnsQuery.isFetching ||
    studentsQuery.isFetching ||
    ratesQuery.isFetching ||
    unRateMutation.isPending ||
    rateMutation.isPending

  console.log(' columnsQuery.status: ', columnsQuery.status)

  return columnsQuery.error || studentsQuery.error || ratesQuery.error ? (
    <Box display="flex" flexDirection="column" alignItems="center" rowGap={4}>
      <Typography variant="h4">При завантаженні даних сталася помилка</Typography>
      <Button onClick={() => queryClient.refetchQueries()} variant="contained">
        Повторити
      </Button>
    </Box>
  ) : (
    <>
      <Box height={4}>{isFetching && <LinearProgress />}</Box>
      {ratesQuery.data?.length ? (
        <StudentsTable
          columns={columnsQuery.data || []}
          students={studentsQuery.data?.pages.flatMap(arr => arr.Items) || []}
          rates={ratesQuery.data}
          navigateToStudentPage={navigateToStudentPage}
          handleStudentRate={handleStudentRate}
          loadMoreStudents={loadMoreStudents}
        />
      ) : isFetching ? (
        <Typography>Дані завантажуються...</Typography>
      ) : (
        <Typography>Дані про учнів відсутні.</Typography>
      )}

      <Snackbar autoHideDuration={6000} open={!!notifications.length}>
        <Box>
          {notifications.map(({ message, severity, id }) => (
            <Alert key={id} severity={severity} variant="filled" sx={{ marginBottom: 1 }}>
              {message}
            </Alert>
          ))}
        </Box>
      </Snackbar>
    </>
  )

  //return (
  //  <>
  //    <Box height={4}>{isFetching && <LinearProgress />}</Box>
  //    <StudentsTable
  //      columns={columnsQuery.data || []}
  //      students={studentsQuery.data?.pages.flatMap(arr => arr.Items) || []}
  //      rates={ratesQuery.data || []}
  //      navigateToStudentPage={navigateToStudentPage}
  //      handleStudentRate={handleStudentRate}
  //      loadMoreStudents={loadMoreStudents}
  //    />
  //    <Snackbar autoHideDuration={6000} open={!!notifications.length}>
  //      <Box>
  //        {notifications.map(({ message, severity, id }) => (
  //          <Alert key={id} severity={severity} variant="filled" sx={{ marginBottom: 1 }}>
  //            {message}
  //          </Alert>
  //        ))}
  //      </Box>
  //    </Snackbar>
  //  </>
  //)
}

export default StudentsRates
