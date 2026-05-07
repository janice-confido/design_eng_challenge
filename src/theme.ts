import { createTheme } from '@mui/material/styles'
import { colorScale } from './components/shared/tokens'

// Re-export for any legacy imports
export { colorScale }

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:         '#64997B', 
      light:        '#CAE3D5',  
      dark:         '#496F59',  
      contrastText: '#ffffff',
    },
    secondary: {
      main:  '#6F8FE6',   
      dark:  '#264085',  
      light: '#96AEED',   
    },
    background: {
      default: '#FAF8F4',  
      paper:   '#ffffff',
    },
    text: {
      primary:   '#000000',   
      secondary: '#474747',  
      disabled:  '#9D9A9A',   
    },
    error: {
      main:  '#D32F2F',
      light: '#E57373',
      dark:  '#A82424',
    },
    warning: {
      main:  '#ED6C02',
      light: '#FD8F35',
      dark:  '#DE6502',
    },
    info: {
      main:  '#6F8FE6',
      light: '#96AEED',
      dark:  '#264085',
    },
    success: {
      main:  '#64997B',
      light: '#CAE3D5',
      dark:  '#496F59',
    },
  },
  typography: {
    fontFamily: ['"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow:     'none',
          fontWeight:    500,
        },
        contained: {
          '&:hover, &:active, &.Mui-focusVisible': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 8 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiSelect: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#64997B',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 8, padding: 0 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: 20, fontWeight: 500, paddingBottom: 8 },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { paddingTop: '16px !important' },
      },
    },
  },
})
