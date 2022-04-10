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
  return solution === word
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

export const getWordOfDay = () => {
  // April 1, 2022 Game Epoch
  const epochMs = new Date(2022, 3, 1).valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const orderIndex = Math.floor((now - epochMs) / msInDay)
  const nextday = (orderIndex + 1) * msInDay + epochMs
  const mysteryIndex = MYSTERY_ORDER[orderIndex]

  return {
    solution: localeAwareUpperCase(WORDS[mysteryIndex % WORDS.length]),
    solutionIndex: orderIndex,
    tomorrow: nextday,
  }
}

export const { solution, solutionIndex, tomorrow } = getWordOfDay()
