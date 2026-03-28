import { CharStatus, ResultStatus } from './statuses'

// Centralized color definitions for the app
export const colors = {
  light: {
    background: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#94a3b8',
    borderActive: '#000000',
    // Cell colors
    cellDefault: '#ffffff',
    cellAbsent: '#94a3b8',
    cellGuessed: '#ffffff',
    cellPresent: '#22c55e',
    cellMaybe: '#eab308',
    cellZero: '#ef4444',
    cellMedium: '#eab308',
    cellHigh: '#22c55e',
    // Key colors
    keyDefault: '#cbd5e1',
    keyGuessed: '#64748b',
    keyAbsent: '#334155',
    keyPresent: '#22c55e',
    keyMaybe: '#eab308',
    keyText: '#1e293b',
    keyActiveText: '#ffffff',
    // Alert colors
    alertSuccess: '#22c55e',
    alertError: '#ef4444',
    // Navbar
    navbarBorder: '#e2e8f0',
  },
  dark: {
    background: '#0f172a',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#1e293b',
    borderActive: '#ffffff',
    // Cell colors
    cellDefault: '#0f172a',
    cellAbsent: '#334155',
    cellGuessed: '#0f172a',
    cellPresent: '#22c55e',
    cellMaybe: '#eab308',
    cellZero: '#ef4444',
    cellMedium: '#eab308',
    cellHigh: '#22c55e',
    // Key colors
    keyDefault: '#475569',
    keyGuessed: '#334155',
    keyAbsent: '#1e293b',
    keyPresent: '#22c55e',
    keyMaybe: '#eab308',
    keyText: '#f8fafc',
    keyActiveText: '#ffffff',
    // Alert colors
    alertSuccess: '#22c55e',
    alertError: '#ef4444',
    // Navbar
    navbarBorder: '#1e293b',
  },
}

export const getCellBackgroundColor = (
  isDark: boolean,
  status?: CharStatus,
  resultStatus?: ResultStatus,
  isInvalid?: boolean
) => {
  const theme = isDark ? colors.dark : colors.light

  if (isInvalid) return theme.cellZero
  if (resultStatus === 'zero') return theme.cellZero
  if (resultStatus === 'medium' || status === 'maybe') return theme.cellMaybe
  if (
    resultStatus === 'high' ||
    resultStatus === 'correct' ||
    status === 'present'
  )
    return theme.cellPresent
  if (status === 'absent') return theme.cellAbsent

  return theme.cellDefault
}

export const getCellBorderColor = (
  isDark: boolean,
  value?: string,
  status?: CharStatus,
  resultStatus?: ResultStatus,
  isResult?: boolean,
  isInvalid?: boolean
) => {
  const theme = isDark ? colors.dark : colors.light
  const bgColor = getCellBackgroundColor(
    isDark,
    status,
    resultStatus,
    isInvalid
  )

  // If the cell has a colored background, use that color as border
  if (bgColor !== theme.cellDefault) return bgColor

  // Active cells (with value or result cells) get a strong border
  if ((value && (status === 'none' || status === 'guessed')) || isResult) {
    return theme.borderActive
  }

  // Empty cells get a light border
  return theme.border
}

export const getCellTextColor = (
  isDark: boolean,
  status?: CharStatus,
  resultStatus?: ResultStatus,
  isInvalid?: boolean
) => {
  const theme = isDark ? colors.dark : colors.light
  const bgColor = getCellBackgroundColor(
    isDark,
    status,
    resultStatus,
    isInvalid
  )

  // Colored cells get white text
  if (bgColor !== theme.cellDefault) return '#ffffff'

  return theme.text
}

export const getKeyBackgroundColor = (isDark: boolean, status?: CharStatus) => {
  const theme = isDark ? colors.dark : colors.light

  if (status === 'present') return theme.keyPresent
  if (status === 'maybe') return theme.keyMaybe
  if (status === 'absent') return theme.keyAbsent
  if (status === 'guessed') return theme.keyGuessed

  return theme.keyDefault
}

export const getKeyTextColor = (isDark: boolean, status?: CharStatus) => {
  const theme = isDark ? colors.dark : colors.light

  if (status) return theme.keyActiveText
  return theme.keyText
}
