import { solution, unicodeSplit } from './words'

export type CharStatus = 'absent' | 'present' | 'correct' | 'guessed'
export type NewCharStatus = 'none' | 'invalid' | 'absent'
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

export const getGuessStatuses = (guess: string): CharStatus[] => {
  const splitSolution = unicodeSplit(solution)
  const splitGuess = unicodeSplit(guess)

  const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct'
      solutionCharsTaken[i] = true
      return
    }
  })

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = 'absent'
      return
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    )

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    } else {
      statuses[i] = 'absent'
      return
    }
  })

  return statuses
}
