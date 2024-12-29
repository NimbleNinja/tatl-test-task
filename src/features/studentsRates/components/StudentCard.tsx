import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material'
import { Student } from '../types'
import { useNavigate } from 'react-router'

type Props = {
  student: Student
}

function StudentCard({ student }: Props) {
  const navigate = useNavigate()
  const { FirstName, LastName, SecondName } = student
  return (
    <Card elevation={10} sx={{ maxWidth: 345 }}>
      <CardHeader title="Учень" />
      <CardContent>
        {FirstName && <Typography variant="h6">Ім'я: {FirstName}</Typography>}
        {LastName && <Typography variant="h6">Прізвище: {LastName}</Typography>}
        {SecondName && <Typography variant="h6">По батькові: {SecondName}</Typography>}
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={() => navigate('/')}>
          Назад
        </Button>
      </CardActions>
    </Card>
  )
}

export default StudentCard
