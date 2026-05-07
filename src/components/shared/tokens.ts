// Design tokens — mirrored from the Confido production design system.
// Source: confido-repo/web/src/components/shared/tokens.ts

export const colorScale = {
  red: {
    100: '#FDE0E1',
    500: '#D4353A',
    600: '#A8161E',
    700: '#750E13',
  },
  orange: {
    100: '#FFE6D5',
    500: '#EE8236',
    700: '#B84D00',
  },
  green: {
    100: '#E6EFEA',
    200: '#C6DACE',
    400: '#85AF97',
    500: '#64997B',
    600: '#527E65',
    700: '#40634F',
  },
  blue: {
    50:  '#EEF1FC',
    100: '#DCE3F9',
    500: '#6F8FE6',
    700: '#224CBF',
  },
  charcoal: {
    50:  '#F2F2F2',
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
} as const

export const semanticColors = {
  bg: {
    beige:         '#FAF8F4',
    subtleDanger:  '#FDE0E1',
    subtleWarning: '#FFE6D5',
    subtleSuccess: '#E6EFEA',
    subtleInfo:    '#DCE3F9',
  },
  content: {
    danger:  '#750E13',
    warning: '#B84D00',
    success: '#40634F',
  },
  border: {
    default: '#DEDEDE',
    divider: '#DEDEDE',
  },
} as const

export const colors = {
  white:       '#FFFFFF',
  black:       '#191919',
  bgBeige:     '#FAF8F4',
  bgWhite:     '#FFFFFF',
  charcoal50:  colorScale.charcoal[50],
  charcoal100: colorScale.charcoal[100],
  charcoal200: colorScale.charcoal[200],
  charcoal300: colorScale.charcoal[300],
  charcoal400: colorScale.charcoal[400],
  charcoal500: colorScale.charcoal[500],
  charcoal600: colorScale.charcoal[600],
  charcoal700: colorScale.charcoal[700],
  charcoal800: colorScale.charcoal[800],
  charcoal900: colorScale.charcoal[900],
  green100:    colorScale.green[100],
  green500:    colorScale.green[500],
  green600:    colorScale.green[600],
  green700:    colorScale.green[700],
  blue50:      colorScale.blue[50],
  blue100:     colorScale.blue[100],
  blue500:     colorScale.blue[500],
  blue700:     colorScale.blue[700],
  red100:      colorScale.red[100],
  red500:      colorScale.red[500],
} as const
