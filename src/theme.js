import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { deepOrange, teal, cyan, orange } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange


      }
    },
    dark: {
      palette: {
        primery: cyan,
        secondary: orange
      }
    }
  }
  // ...other properties
})

export default theme;