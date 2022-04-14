import { solution, unicodeSplit } from './words'

export type CharStatus = 'none' | 'absent' | 'maybe' | 'present' | 'guessed'

export type ResultStatus = 'zero' | 'medium' | 'high' | 'correct'
export type CharStatusDict = { [char: string]: CharStatus }

export const getGuessScore = (guess: string) => {
  if (guess === solution) {
    return 6
  }

  const setSolution = new Set(unicodeSplit(solution))
  const setGuess = new Set(unicodeSplit(guess))

  return Array.from(setGuess).filter((c) => setSolution.has(c)).length
}

// Responsibility of caller for priority logic
export const updateLetterStatuses = (
  letterStatuses: CharStatusDict,
  letters: string[],
  newStatus: CharStatus
) => {
  const newLetterStatuses = { ...letterStatuses }
  letters.forEach((c) => (newLetterStatuses[c] = newStatus))
  return newLetterStatuses
}

export const updateLetterStatus = (
  letterStatuses: CharStatusDict,
  letter: string,
  newStatus: CharStatus
) => {
  return updateLetterStatuses(letterStatuses, [letter], newStatus)
}
