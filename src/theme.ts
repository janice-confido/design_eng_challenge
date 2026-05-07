import { createTheme } from '@mui/material/styles'

// Design tokens — mirrors the Confido production palette
export const colorScale = {
  green: {
    100: '#E6EFEA',
    200: '#C6DACE',
    400: '#85AF97',
    500: '#64997B',
    600: '#527E65',
    700: '#40634F',
  },
  blue: {
    50: '#EEF1FC',
    100: '#DCE3F9',
    500: '#6F8FE6',
    700: '#224CBF',
  },
  charcoal: {
    50: '#F2F2F2',
    100: '#EBEBEB',
    200: '#DEDEDE',
    300: '#D0D0D0',
    400: '#C1C1C1',
    500: '#A4A4A4',
    600: '#888888',
    700: '#6C6C6C',
    800: '#4F4F4F',
    900: '#313131',
  },
  red: {
    100: '#FDE0E1',
    500: '#D4353A',
  },
  orange: {
    100: '#FFE6D5',
    500: '#EE8236',
  },
}

export const semanticColors = {
  bg: {
    beige: '#FAF9F7',
    subtleDanger: '#FDE0E1',
    subtleWarning: '#FFE6D5',
  },
  content: {
    danger: '#A8161E',
    warning: '#B84D00',
  },
}

const BORDER_DEFAULT = colorScale.charcoal[200]
const BORDER_FOCUS = colorScale.charcoal[500]

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colorScale.green[500],
      light: colorScale.green[200],
      dark: colorScale.green[700],
    },
    secondary: {
      main: colorScale.blue[500],
      dark: colorScale.blue[700],
    },
    background: {
      default: semanticColors.bg.beige,
    },
    text: {
      primary: '#000000',
      secondary: '#474747',
      disabled: '#9D9A9A',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#ED6C02',
    },
    success: {
      main: colorScale.green[500],
    },
  },
  typography: {
    fontFamily: ['"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          fontWeight: 500,
          borderRadius: 4,
          '&:hover': { boxShadow: 'none' },
        },
        sizeSmall: { height: 32, fontSize: 13 },
        sizeMedium: { height: 36, fontSize: 13 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: 13,
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_DEFAULT },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_DEFAULT },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER_FOCUS,
            borderWidth: 1,
          },
        },
        sizeSmall: { height: 36 },
      },
    },
    MuiInputBase: {
      styleOverrides: { root: { fontSize: 13 } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiSelect: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: 12,
            color: colorScale.charcoal[600],
            backgroundColor: colorScale.charcoal[50],
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 13,
          borderColor: colorScale.charcoal[100],
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontSize: 12 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 8 },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 6,
          border: `1px solid ${BORDER_DEFAULT}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginTop: 2,
        },
      },
    },
  },
})
