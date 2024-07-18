import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // paleta clara
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        }
      : {
          // paleta oscura
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#f48fb1',
          },
          background: {
            default: '#121212',
            paper: '#1d1d1d',
          },
        }),
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));
