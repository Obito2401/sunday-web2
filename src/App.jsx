
import Button from '@mui/material/Button'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import { pink } from '@mui/material/colors'
import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Container from '@mui/material/Container'
import theme from './theme'

function SelectModeDarkLight() {

  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectMode = event.target.value
    setMode(selectMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-dark-night-mode">Mode</InputLabel>
      <Select
        labelId="label-dark-night-mode"
        id="dark-night-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value='light'>
          <div style={{ display:'flex', alignItems:'center', gap: '8px' }}>
            <LightModeIcon fontSize='small'/> Light
          </div>
        </MenuItem>
        <MenuItem value='dark'>
          <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
            <DarkModeOutlinedIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize='small'/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        backgroundColor: 'primary.light',
        display: 'flex',
        alignItems: 'center'
      }}>
        <SelectModeDarkLight/>
      </Box>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        backgroundColor: 'primary.dark',
        display: 'flex',
        alignItems: 'center'
      }}>
        board bar
      </Box>
      <Box sx={{
        width: '100%',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        backgroundColor: 'primary.main',
        display: 'flex',
        alignItems: 'center'
      }}>
        content bar
      </Box>
    </Container>
  )
}

export default App
