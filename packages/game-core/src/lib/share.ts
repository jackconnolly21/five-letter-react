import { getGuessScore } from './statuses'
import { MAX_CHALLENGES } from '../constants/settings'

export const generateShareText = (
  gameTitle: string,
  solutionIndex: number,
  guesses: string[],
  solution: string,
  lost: boolean
): string => {
  const header = `${gameTitle} #${solutionIndex}`
  const score = `${lost ? 'X' : guesses.length}/${MAX_CHALLENGES}`
  const emojis = guesses
    .map((guess) => {
      const s = getGuessScore(guess, solution)
      if (s === 0) return '🟥'
      if (s <= 3) return '🟨'
      if (s <= 5) return '🟩'
      return '🎉'
    })
    .join('')
  return `${header} ${score}\n${emojis}`
}
