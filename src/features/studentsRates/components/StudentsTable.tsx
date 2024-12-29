import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Column, Rate, Student } from '../types'
import { useCallback, useLayoutEffect, useRef } from 'react'
import { Typography, useTheme } from '@mui/material'

type Props = {
  columns: Column[]
  students: Student[]
  rates: Rate[]
  navigateToStudentPage: (studentId: number) => void
  handleStudentRate: (SchoolboyId: number, ColumnId: number, isUnRate: boolean) => void
  loadMoreStudents: () => void
}

function StudentsTable({
  columns,
  students,
  rates,
  navigateToStudentPage,
  handleStudentRate,
  loadMoreStudents
}: Props) {
  const tableRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()

  const scrollListener = useCallback(() => {
    if (!tableRef.current) return
    const { scrollHeight, scrollTop, clientHeight } = tableRef.current
    if (scrollTop + clientHeight >= scrollHeight) {
      loadMoreStudents()
    }
  }, [loadMoreStudents])

  useLayoutEffect(() => {
    if (!tableRef.current) return
    const tableEllement = tableRef.current
    tableEllement.addEventListener('scroll', scrollListener)
    return () => tableEllement.removeEventListener('scroll', scrollListener)
  }, [scrollListener])

  return (
    <Paper elevation={10}>
      <Typography variant="h5" align="center" sx={{ lineHeight: 2 }}>
        Таблиця відвідуваності
      </Typography>
      <TableContainer sx={{ maxHeight: 600 }} ref={tableRef}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{ marginBottom: 4 }}>
            <TableRow>
              <TableCell variant="head">№</TableCell>
              <TableCell variant="head">Ім'я</TableCell>
              {columns.map(column => (
                <TableCell variant="head" key={column.Id} align="center">
                  {column.Title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(({ Id, FirstName, LastName, SecondName }, index) => {
              let fullName = [FirstName || '', LastName || '', SecondName || ''].join(' ')
              const studentRates = rates.filter(rate => rate.SchoolboyId === Id)
              return (
                <TableRow tabIndex={-1} key={Id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell
                    onClick={() => navigateToStudentPage(Id)}
                    sx={{
                      ':hover': {
                        backgroundColor: theme.palette.action.hover,
                        cursor: 'pointer'
                      }
                    }}
                  >
                    {fullName.trim()}
                  </TableCell>
                  {columns.map(column => {
                    const title = studentRates.find(rate => rate.ColumnId === column.Id)?.Title || ''
                    return (
                      <TableCell
                        align="center"
                        onClick={() => handleStudentRate(Id, column.Id, !!title)}
                        key={column.Id}
                        sx={{
                          ':hover': {
                            backgroundColor: theme.palette.action.hover,
                            cursor: 'pointer'
                          }
                        }}
                      >
                        {title}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default StudentsTable
