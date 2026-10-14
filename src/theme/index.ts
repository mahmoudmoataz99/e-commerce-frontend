import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c9a86c',
      light: '#e0c48a',
      dark: '#a88b4a',
      contrastText: '#1a1a1a',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b6b6b',
    },
    divider: alpha('#1a1a1a', 0.08),
    neutral: {
      main: '#f5f5f5',
      light: '#fafafa',
      dark: '#e0e0e0',
      contrastText: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 4px rgba(0,0,0,0.04)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 6px 12px rgba(0,0,0,0.06)',
    '0 8px 16px rgba(0,0,0,0.06)',
    '0 12px 24px rgba(0,0,0,0.07)',
    '0 16px 32px rgba(0,0,0,0.08)',
    '0 20px 40px rgba(0,0,0,0.09)',
    '0 24px 48px rgba(0,0,0,0.1)',
    '0 1px 3px rgba(0,0,0,0.05)',
    '0 2px 6px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0,0,0,0.06)',
    '0 8px 20px rgba(0,0,0,0.07)',
    '0 12px 28px rgba(0,0,0,0.08)',
    '0 16px 36px rgba(0,0,0,0.09)',
    '0 20px 44px rgba(0,0,0,0.1)',
    '0 24px 52px rgba(0,0,0,0.11)',
    '0 28px 60px rgba(0,0,0,0.12)',
    '0 32px 68px rgba(0,0,0,0.13)',
    '0 36px 76px rgba(0,0,0,0.14)',
    '0 40px 84px rgba(0,0,0,0.15)',
    '0 44px 92px rgba(0,0,0,0.16)',
    '0 48px 100px rgba(0,0,0,0.17)',
    '0 52px 108px rgba(0,0,0,0.18)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 22px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#1a1a1a',
          '&:hover': {
            backgroundColor: '#333',
          },
        },
        outlined: {
          borderColor: alpha('#1a1a1a', 0.2),
          '&:hover': {
            borderColor: '#1a1a1a',
            backgroundColor: alpha('#1a1a1a', 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: alpha('#1a1a1a', 0.06),
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: alpha('#1a1a1a', 0.08),
        },
      },
    },
  },
});
