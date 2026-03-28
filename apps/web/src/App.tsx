import { useState, useEffect } from 'react'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { HistoryModal } from './components/modals/HistoryModal'
import { SettingsModal } from './components/modals/SettingsModal'
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
  solution,
  getPastSolution,
  getDateString,
  loadGameForDate,
  unicodeLength,
  unicodeSplit,
} from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  loadGameStateFromLocalStorage,
  loadStatusesFromLocalStorage,
  saveGameStateToLocalStorage,
  saveStatusesToLocalStorage,
  saveGameHistoryEntry,
  migrateGameState,
} from './lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import {
  CharStatus,
  CharStatusDict,
  clearLetterStatuses,
  getGuessScore,
  updateLetterStatus,
  updateLetterStatuses,
} from './lib/statuses'

const getToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )

  const today = getToday()
  const todayString = getDateString(today)

  // Run migration from old flat gameState key on first load
  migrateGameState(todayString)

  const [selectedDate, setSelectedDate] = useState<Date>(today)
  const currentSolution = getPastSolution(selectedDate)
  const dateString = getDateString(selectedDate)
  const isPlayingPastGame = dateString !== todayString

  const [letterStatuses, setLetterStatuses] = useState<CharStatusDict>(() => {
    const loaded = loadStatusesFromLocalStorage()
    if (loaded?.date === todayString && loaded.statuses !== undefined) {
      return loaded.statuses
    }
    // New day or no saved statuses — rebuild from today's guesses
    const todayGame = loadGameStateFromLocalStorage(todayString)
    if (!todayGame || todayGame.guesses.length === 0) {
      return {}
    }
    return loadGameForDate(today, todayGame.guesses).letterStatuses
  })

  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage(todayString)
    if (!loaded) {
      return []
    }
    const gameWasWon = loaded.guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true,
      })
    }
    return loaded.guesses
  })

  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    // if no game state on load, show the how-to info modal
    if (!loadGameStateFromLocalStorage(todayString)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage(dateString, { guesses })
  }, [guesses, dateString])

  useEffect(() => {
    saveStatusesToLocalStorage({ statuses: letterStatuses, date: dateString })
  }, [letterStatuses, dateString])

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

  const handleSelectDate = (date: Date) => {
    // Save current game state before switching
    saveGameStateToLocalStorage(dateString, { guesses })

    const newDateString = getDateString(date)
    const loaded = loadGameStateFromLocalStorage(newDateString)
    const newGuesses = loaded?.guesses ?? []

    const {
      letterStatuses: newStatuses,
      isGameWon: gameWasWon,
      isGameLost: gameWasLost,
    } = loadGameForDate(date, newGuesses)

    setSelectedDate(date)
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

    // Update status of guess
    // 1. Absent if 0 letters in common
    // 2. Present if winning word
    // 3. Guessed if status was None
    // 4. Otherwise don't change
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
    // turn this back off after all chars have been revealed
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
        setStats(addStatsForCompletedGame(stats, guesses.length))
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        saveGameHistoryEntry({
          date: dateString,
          guesses: guesses.length + 1,
          won: false,
        })
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(currentSolution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1,
        })
      }
    }
  }

  return (
    <div className="h-[90vh] flex flex-col">
      <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow h-4/5">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsHistoryModalOpen={setIsHistoryModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          isPlayingPastGame={isPlayingPastGame}
          selectedDate={selectedDate}
          onBackToToday={handleBackToToday}
        />
        <div className="pb-6 overflow-auto flex flex-col">
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
        </div>
        <div className="pt-1">
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            letterStatuses={letterStatuses}
            isRevealing={isRevealing}
          />
        </div>
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
          gameStats={stats}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          numberOfGuessesMade={guesses.length}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          handleClearNotes={() => {
            setLetterStatuses(clearLetterStatuses(guesses, currentSolution))
            setIsSettingsModalOpen(false)
            showSuccessAlert(CLEAR_NOTES_TEXT)
          }}
        />
        <AlertContainer />
      </div>
    </div>
  )
}

export default App
