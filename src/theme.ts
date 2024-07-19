// src/theme.ts

import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#001ADB',
    },
    secondary: {
      main: '#3074AF',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* custom font */
        @import url(https://fonts.googleapis.com/css?family=Roboto);

        /* basic reset */
        * {margin: 0; padding: 0;}

        body {
            font-family: Roboto, Arial, Verdana;
            text-align: center;
            padding: 20px 30px;
        }

        /* Add other global styles here */

        label {
          display: block;
          margin-bottom: 5px; /* Space between label and input */
        }
      `,
    },
  },
});

export default theme;