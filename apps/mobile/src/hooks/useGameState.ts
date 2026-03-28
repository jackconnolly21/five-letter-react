import { useState, useEffect } from 'react'
import {
  loadGameForDate,
  getDateString,
  defaultStats,
  GameStats,
  CharStatusDict,
} from '@five-letter/game-core'
import {
  loadGameStateFromStorage,
  loadStatusesFromStorage,
  loadStatsFromStorage,
  loadThemeFromStorage,
} from '../lib/storage'
import { MAX_CHALLENGES } from '../constants/settings'

type GameLoadState = {
  isLoading: boolean
  initialGuesses: string[]
  initialGameWon: boolean
  initialGameLost: boolean
  initialLetterStatuses: CharStatusDict
  initialStats: GameStats
  initialIsDarkMode: boolean | undefined
  initialSolution: string
}

export const useGameLoad = (): GameLoadState => {
  const [isLoading, setIsLoading] = useState(true)
  const [initialGuesses, setInitialGuesses] = useState<string[]>([])
  const [initialGameWon, setInitialGameWon] = useState(false)
  const [initialGameLost, setInitialGameLost] = useState(false)
  const [initialLetterStatuses, setInitialLetterStatuses] =
    useState<CharStatusDict>({})
  const [initialStats, setInitialStats] = useState<GameStats>(defaultStats)
  const [initialIsDarkMode, setInitialIsDarkMode] = useState<
    boolean | undefined
  >(undefined)
  const [initialSolution, setInitialSolution] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dateString = getDateString(today)

        const [gameState, statusesState, statsState, themeState] =
          await Promise.all([
            loadGameStateFromStorage(dateString),
            loadStatusesFromStorage(),
            loadStatsFromStorage(),
            loadThemeFromStorage(),
          ])

        const storedGuesses = gameState?.guesses ?? []
        const { solution, letterStatuses, isGameWon, isGameLost } =
          loadGameForDate(today, storedGuesses)

        setInitialSolution(solution)
        setInitialGuesses(storedGuesses)
        setInitialGameWon(isGameWon)
        setInitialGameLost(isGameLost)

        // Use stored statuses if they match today, otherwise use computed
        const resolvedStatuses =
          statusesState?.date === dateString && statusesState.statuses
            ? statusesState.statuses
            : letterStatuses
        setInitialLetterStatuses(resolvedStatuses)

        if (statsState) {
          setInitialStats(statsState)
        }

        if (themeState) {
          setInitialIsDarkMode(themeState === 'dark')
        }
      } catch (error) {
        console.error('Error loading game state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  return {
    isLoading,
    initialGuesses,
    initialGameWon,
    initialGameLost,
    initialLetterStatuses,
    initialStats,
    initialIsDarkMode,
    initialSolution,
  }
}
