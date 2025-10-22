import Box from '@mui/material/Box'
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone'
function BoardContent() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      backgroundColor: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Box sx={{textAlign:'center'}}>
        Anh yeu em lắm 
        <FavoriteTwoToneIcon fontSize='large'/>
      </Box>
    </Box>
  )
}

export default BoardContent
