import { createTheme } from '@mui/material/styles'

// Design tokens from Design.json
const theme = createTheme({
  palette: {
    primary: {
      main: '#7B5CFF',
      light: '#C39BFF',
      dark: '#6C63FF',
    },
    secondary: {
      main: '#6C63FF',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#FF6B6B',
    },
    warning: {
      main: '#FFB74D',
    },
    background: {
      default: '#F9F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C1E',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'SF Pro Display', 'Inter', sans-serif",
    h1: {
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#1C1C1E',
    },
    h2: {
      fontSize: 22,
      fontWeight: 600,
      color: '#1C1C1E',
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 500,
      color: '#1C1C1E',
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      color: '#1C1C1E',
    },
    body2: {
      fontSize: 12,
      fontWeight: 400,
      color: '#6B6B6B',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          height: 48,
          padding: '0 24px',
          boxShadow: '0 4px 10px rgba(123,92,255,0.3)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(123,92,255,0.4)',
          },
          '&:active': {
            transform: 'scale(0.96)',
            transitionDuration: '150ms',
          },
        },
        contained: {
          background: 'linear-gradient(to top right, #7B5CFF, #C39BFF)',
          '&:hover': {
            background: 'linear-gradient(to top right, #7B5CFF, #C39BFF)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          padding: 16,
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
})

export default theme

