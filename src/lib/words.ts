import { WORDS } from '../constants/wordlist'
import { VALID_GUESSES } from '../constants/validGuesses'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { MYSTERY_ORDER } from '../constants/mysteryOrder'

export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  )
}

export const isWinningWord = (word: string) => {
  return solution === word + '4'
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

// April 1, 2022 Game Epoch
const EPOCH_MS = new Date(2022, 3, 1).valueOf()
const MS_IN_DAY = 86400000
const getOrderIndex = (ms: number) => Math.floor((ms - EPOCH_MS) / MS_IN_DAY)

export const getWordOfDay = () => {
  const epoch = new Date(2022, 3, 1)
  const start = new Date(epoch)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let index = 0
  while (start < today) {
    index++
    start.setDate(start.getDate() + 1)
  }

  const nextDay = new Date(today)
  nextDay.setDate(today.getDate() + 1)

  const mysteryIndex = MYSTERY_ORDER[index]

  return {
    solution: localeAwareUpperCase(WORDS[mysteryIndex % WORDS.length]),
    solutionIndex: index,
    tomorrow: nextDay.valueOf(),
  }
}

export const getPastSolution = (d: Date) => {
  const orderIndex = getOrderIndex(d.valueOf())
  const mysteryIndex = MYSTERY_ORDER[orderIndex]
  return localeAwareUpperCase(WORDS[mysteryIndex % WORDS.length])
}

const formatDateString = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const getPastSolutions = (n: number) => {
  const dates = [...Array(5).keys()].map((i) => {
    const d = new Date()
    d.setDate(d.getDate() - i - 1)
    return d
  })
  return dates.map(
    (date) => `${formatDateString(date)}: ${getPastSolution(date)}`
  )
}

export const { solution, solutionIndex, tomorrow } = getWordOfDay()
