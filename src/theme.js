import { createTheme } from '@mui/material/styles'

/** Aligns with backend static UI + team MUI look (cyan / indigo). */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9', dark: '#075985' },
    secondary: { main: '#6366f1' },
    success: { main: '#16a34a' },
    error: { main: '#dc2626' },
    grey: { 600: '#64748b' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1rem', fontWeight: 800 },
    h3: { fontSize: '0.875rem', fontWeight: 800 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: 'rgba(15, 23, 42, 0.12)',
          boxShadow: '0 16px 40px rgba(2, 6, 23, 0.10)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 650 }
      }
    }
  }
})

export default theme
