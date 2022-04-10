import { solution, unicodeSplit } from './words'

export type CharStatus = 'absent' | 'present' | 'correct' | 'guessed'
export type CellStatus = 'none' | 'absent' | 'maybe' | 'present'
export type ResultStatus = 'zero' | 'medium' | 'high' | 'correct'

export const getGuessScore = (guess: string) => {
  if (guess === solution) {
    return 6
  }

  const setSolution = new Set(unicodeSplit(solution))
  const setGuess = new Set(unicodeSplit(guess))

  return Array.from(setGuess).filter((c) => setSolution.has(c)).length
}

export const getStatuses = (
  guesses: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}
  const splitSolution = unicodeSplit(solution)

  guesses.forEach((word) => {
    unicodeSplit(word).forEach((c) => {
      if (charObj[c] !== 'absent') {
        charObj[c] = 'guessed'
      }
    })

    if (unicodeSplit(word).every((c) => !splitSolution.includes(c))) {
      unicodeSplit(word).forEach((c) => (charObj[c] = 'absent'))
    }
  })

  return charObj
}
