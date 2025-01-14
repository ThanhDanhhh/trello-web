import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { deepOrange, teal, cyan, orange } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appbarHeight: '58px',
    boardBarHeight: '60px',
  },
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
      },
      // spacing: (factor) => `${0.25 * factor}rem`,
    }
  }
  // ...other properties
})

export default theme;