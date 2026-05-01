import { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native'
import analytics from '@react-native-firebase/analytics'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { HistoryModal } from './components/modals/HistoryModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { AlertContainer } from './components/alerts/AlertContainer'
import { Navbar } from './components/navbar/Navbar'
import { AlertProvider, useAlert } from './context/AlertContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useGameLoad } from './hooks/useGameState'
import { colors } from './lib/colors'
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
  CLEAR_NOTES_TEXT,
} from './constants/strings'
import {
  MAX_WORD_LENGTH,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  GAME_LOST_INFO_DELAY,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  isWordInWordList,
  isWinningWord,
  loadGameForDate,
  getDateString,
  getSolutionIndex,
  unicodeLength,
  unicodeSplit,
} from './lib/words'
import {
  addStatsForCompletedGame,
  defaultStats,
  GameStats,
} from '@five-letter/game-core'
import {
  loadGameStateFromStorage,
  saveGameStateToStorage,
  saveStatusesToStorage,
  saveStatsToStorage,
  saveGameHistoryEntry,
} from './lib/storage'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import {
  CharStatus,
  CharStatusDict,
  clearLetterStatuses,
  getGuessScore,
  updateLetterStatus,
  updateLetterStatuses,
} from './lib/statuses'

const GameScreen = () => {
  const { isDarkMode, setIsDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light
  const {
    isLoading,
    initialGuesses,
    initialGameWon,
    initialGameLost,
    initialLetterStatuses,
    initialStats,
    initialIsDarkMode,
    initialSolution,
  } = useGameLoad()

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayString = getDateString(today)

  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const [currentSolution, setCurrentSolution] = useState('')
  const currentSolutionIndex = getSolutionIndex(selectedDate)
  const dateString = getDateString(selectedDate)
  const isPlayingPastGame = dateString !== todayString

  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [letterStatuses, setLetterStatuses] = useState<CharStatusDict>({})
  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<string[]>([])
  const [stats, setStats] = useState<GameStats>(defaultStats)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from async storage once loaded
  useEffect(() => {
    if (!isLoading && !isInitialized) {
      setCurrentSolution(initialSolution)
      setGuesses(initialGuesses)
      setLetterStatuses(initialLetterStatuses)
      setStats(initialStats)
      setIsGameWon(initialGameWon)
      setIsGameLost(initialGameLost)
      setIsInitialized(true)

      if (initialIsDarkMode !== undefined) {
        setIsDarkMode(initialIsDarkMode)
      }

      if (initialGameLost) {
        showErrorAlert(CORRECT_WORD_MESSAGE(initialSolution), { persist: true })
      }

      if (initialGuesses.length === 0) {
        setTimeout(() => {
          setIsInfoModalOpen(true)
        }, WELCOME_INFO_MODAL_MS)
      }
    }
  }, [isLoading, isInitialized])

  // Save game state whenever guesses change
  useEffect(() => {
    if (isInitialized) {
      saveGameStateToStorage(dateString, { guesses })
    }
  }, [guesses, dateString, isInitialized])

  // Save letter statuses whenever they change
  useEffect(() => {
    if (isInitialized) {
      saveStatusesToStorage({ statuses: letterStatuses, date: dateString })
    }
  }, [letterStatuses, dateString, isInitialized])

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, GAME_LOST_INFO_DELAY)
    }
  }, [isGameWon, isGameLost, showSuccessAlert])

  const handleSelectDate = async (date: Date) => {
    // Save current game state before switching
    await saveGameStateToStorage(dateString, { guesses })

    const newDateString = getDateString(date)
    const loaded = await loadGameStateFromStorage(newDateString)
    const newGuesses = loaded?.guesses ?? []

    const {
      solution: newSolution,
      letterStatuses: newStatuses,
      isGameWon: gameWasWon,
      isGameLost: gameWasLost,
    } = loadGameForDate(date, newGuesses)

    setSelectedDate(date)
    setCurrentSolution(newSolution)
    setGuesses(newGuesses)
    setCurrentGuess('')
    setLetterStatuses(newStatuses)
    setIsGameWon(gameWasWon)
    setIsGameLost(gameWasLost)
    setIsHistoryModalOpen(false)
  }

  const handleBackToToday = () => {
    handleSelectDate(today)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    const letters = unicodeSplit(currentGuess)
    if (getGuessScore(currentGuess, currentSolution) === 0) {
      setLetterStatuses(updateLetterStatuses(letterStatuses, letters, 'absent'))
    } else if (isWinningWord(currentGuess, currentSolution)) {
      setLetterStatuses(
        updateLetterStatuses(letterStatuses, letters, 'present')
      )
    } else {
      const lettersToUpdate = letters.filter(
        (c) => !letterStatuses[c] || letterStatuses[c] === 'none'
      )
      setLetterStatuses(
        updateLetterStatuses(letterStatuses, lettersToUpdate, 'guessed')
      )
    }

    setIsRevealing(true)
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * (MAX_WORD_LENGTH + 1))

    const winningWord = isWinningWord(currentGuess, currentSolution)

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        saveGameHistoryEntry({
          date: dateString,
          guesses: guesses.length + 1,
          won: true,
        })
        const newStats = addStatsForCompletedGame(stats, guesses.length)
        setStats(newStats)
        saveStatsToStorage(newStats)
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        saveGameHistoryEntry({
          date: dateString,
          guesses: guesses.length + 1,
          won: false,
        })
        const newStats = addStatsForCompletedGame(stats, guesses.length + 1)
        setStats(newStats)
        saveStatsToStorage(newStats)
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(currentSolution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1,
        })
      }
    }
  }

  if (isLoading || !isInitialized) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsHistoryModalOpen={setIsHistoryModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        isPlayingPastGame={isPlayingPastGame}
        selectedDate={selectedDate}
        onBackToToday={handleBackToToday}
      />
      <View style={styles.gameArea}>
        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          solution={currentSolution}
          isRevealing={isRevealing}
          currentRowClassName={currentRowClass}
          letterStatuses={letterStatuses}
          setLetterStatus={(char: string, newStatus: CharStatus) =>
            setLetterStatuses(
              updateLetterStatus(letterStatuses, char, newStatus)
            )
          }
        />
      </View>
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        letterStatuses={letterStatuses}
        isRevealing={isRevealing}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        handleClose={() => setIsHistoryModalOpen(false)}
        onSelectDate={handleSelectDate}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        guesses={guesses}
        solution={currentSolution}
        solutionIndex={currentSolutionIndex}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
        numberOfGuessesMade={guesses.length}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        handleClose={() => setIsSettingsModalOpen(false)}
        handleClearNotes={() => {
          setLetterStatuses(clearLetterStatuses(guesses, currentSolution))
          setIsSettingsModalOpen(false)
          showSuccessAlert(CLEAR_NOTES_TEXT)
        }}
      />
      <AlertContainer />
    </SafeAreaView>
  )
}

export default function App() {
  useEffect(() => {
    analytics().logEvent('app_open')
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AlertProvider>
          <GameScreen />
        </AlertProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
})
