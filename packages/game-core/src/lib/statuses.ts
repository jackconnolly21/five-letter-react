import { unicodeSplit } from './words'

export type CharStatus = 'none' | 'absent' | 'maybe' | 'present' | 'guessed'

export type ResultStatus = 'zero' | 'medium' | 'high' | 'correct'
export type CharStatusDict = { [char: string]: CharStatus }

export const getGuessScore = (guess: string, sol: string) => {
  if (guess === sol) {
    return 6
  }

  const setSolution = new Set(unicodeSplit(sol))
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

export const clearLetterStatuses = (guesses: string[], sol: string) => {
  const zeroLetters = guesses.reduce((acc, guess) => {
    if (getGuessScore(guess, sol) === 0) {
      unicodeSplit(guess).forEach((c) => acc.add(c))
    }
    return acc
  }, new Set<string>())

  const guessedLetters = guesses.reduce((acc, guess) => {
    unicodeSplit(guess).forEach((c) => acc.add(c))
    return acc
  }, new Set<string>())

  const guessedStatuses = updateLetterStatuses(
    {},
    Array.from(guessedLetters),
    'guessed'
  )

  return updateLetterStatuses(
    guessedStatuses,
    Array.from(zeroLetters),
    'absent'
  )
}
