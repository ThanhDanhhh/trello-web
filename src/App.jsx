import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box';



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

function ModeToggle() {
  const { mode, setMode } = useColorScheme()

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)')
  // console.log('prferesDarkMode', prefersDarkMode)
  // console.log('prferesLightMode', prefersLightMode)

  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeSelect />
      <hr />
      <ModeToggle />

      <hr />
      <div>TylerDangDev</div>
      <Typography variant="Body2" color="text.secondary" >Hello World</Typography>
      <Button variant="contained">Hello world</Button>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>

      <AccessAlarmIcon />
      <ThreeDRotation />
    </>
  )
}

export default App
