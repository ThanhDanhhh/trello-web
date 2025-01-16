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
    <FormControl size="small" sx={{ minWidth: '120px' }}>
      <InputLabel
        id="label-select-dark-light-mode"
        sx={{
          color: 'white',
          '&.Mui-focused': { color: 'white' }
        }}

      >Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': { bordercorlor: 'white' },
          '&:hover .MuiOutlinedInput-notchedOutline': { bordercorlor: 'white' },
          '&:Mui-focused .MuiOutlinedInput-notchedOutline': { bordercorlor: 'white' },
          '.MuiSvgIcon-root': { color: 'white' },
        }}
      >

        <MenuItem value="light">
          <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
            <LightModeIcon fontsize="small" />Light
          </Box>
        </MenuItem>

        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
            <DarkModeIcon fontsize="small" />Dark
          </Box>
        </MenuItem>

        <MenuItem value="system">
          <Box sx={{ display: 'flex', alighItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontsize="small" />System
          </Box>
        </MenuItem>

      </Select>
    </FormControl>
  );
}

export default ModeSelect
