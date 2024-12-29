import { AppBar, Box, Container, Typography } from '@mui/material'
import { Outlet } from 'react-router'

function RootLayout() {
  return (
    <Box>
      <AppBar position="static">
        <Typography align="center" variant="h2" gutterBottom>
          ESCHOOL - Тестове завдання
        </Typography>
      </AppBar>
      <Container sx={{ paddingTop: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default RootLayout
