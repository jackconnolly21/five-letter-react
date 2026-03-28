import { createContext, ReactNode, useContext, useState } from 'react'
import { useColorScheme } from 'react-native'
import { saveThemeToStorage } from '../lib/storage'

type ThemeContextValue = {
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  isDarkMode: false,
  setIsDarkMode: () => {},
})

export const useTheme = () => useContext(ThemeContext)

type Props = {
  children: ReactNode
  initialTheme?: boolean
}

export const ThemeProvider = ({ children, initialTheme }: Props) => {
  const systemScheme = useColorScheme()
  const [isDarkMode, setIsDarkModeState] = useState(
    initialTheme ?? systemScheme === 'dark'
  )

  const setIsDarkMode = (isDark: boolean) => {
    setIsDarkModeState(isDark)
    saveThemeToStorage(isDark ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
