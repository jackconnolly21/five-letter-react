export * from '@five-letter/game-core'

import { getWordOfDay } from '@five-letter/game-core'
export const { solution, solutionIndex, tomorrow } = getWordOfDay()
