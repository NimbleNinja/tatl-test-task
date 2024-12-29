import StudentCard from '../features/studentsRates/components/StudentCard'
import { useNavigate, useSearchParams } from 'react-router'
import { Student } from '../features/studentsRates/types'
import { ApiResponse } from '../features/studentsRates/api/types'
import { Box, Button, Typography } from '@mui/material'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'

function StudentPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const SchoolboyId = searchParams.get('SchoolboyId')
  const data = queryClient.getQueryData<InfiniteData<ApiResponse<Student>>>(['Schoolboy'])

  if (!SchoolboyId || !data) {
    return (
      <Box>
        <Typography>Нажаль сторінку не знайдено...</Typography>
        <Button onClick={() => navigate('/')}>На головну</Button>
      </Box>
    )
  }

  const student = data.pages.flatMap(item => item.Items).find(student => student.Id.toString() === SchoolboyId)

  if (!student) {
    return (
      <Box>
        <Typography>Користувача не знайдено...</Typography>
        <Button onClick={() => navigate('/')}>На головну</Button>
      </Box>
    )
  }

  return <StudentCard student={student} />
}

export default StudentPage
