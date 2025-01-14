import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      backgroundColor: 'primary.main',
      wjidth: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.appbarHeight} - ${theme.trello.boardBarHeight})`,
      display: 'flex',
      alignItems: 'center',
    }}>
      Board conttent
    </Box>
  )
}

export default BoardContent
