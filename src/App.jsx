import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectMode = event.target.value
    setMode(selectMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >

        <MenuItem value="light">
          <div style={{ display: 'flex', alighItems: 'center', gap: '8px' }}>
            <LightModeIcon fontsize="small" />Light
          </div>
        </MenuItem>

        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
            <DarkModeIcon fontsize="small" />Dark
          </Box>
        </MenuItem>

        <MenuItem value="system">
          <Box sx={{ display: 'flex', alighItems: 'center', gap: 2 }}>
            <SettingsBrightnessIcon fontsize="small" />System
          </Box>
        </MenuItem>

      </Select>
    </FormControl>
  );
}

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trello.appbarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>
        <ModeSelect />
      </Box>
      <Box sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
      }}>Board bar</Box>
      <Box sx={{
        backgroundColor: 'primary.main',
        wjidth: '100%',
        height: (theme) => `calc(100vh - ${theme.trello.appbarHeight} - ${theme.trello.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center',
      }}>
        Board conttent
      </Box>
    </Container>
  )
}

export default App
