import { getPastSolution, unicodeSplit } from './words'
import {
  clearLetterStatuses,
  updateLetterStatuses,
  CharStatusDict,
} from './statuses'
import { MAX_CHALLENGES } from '../constants/settings'

export const loadGameForDate = (
  date: Date,
  storedGuesses: string[]
): {
  solution: string
  letterStatuses: CharStatusDict
  isGameWon: boolean
  isGameLost: boolean
} => {
  const solution = getPastSolution(date)
  const isGameWon = storedGuesses.includes(solution)
  const isGameLost = storedGuesses.length >= MAX_CHALLENGES && !isGameWon
  let letterStatuses = clearLetterStatuses(storedGuesses, solution)
  if (isGameWon) {
    letterStatuses = updateLetterStatuses(
      letterStatuses,
      unicodeSplit(solution),
      'present'
    )
  }
  return { solution, letterStatuses, isGameWon, isGameLost }
}
