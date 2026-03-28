export * from '@five-letter/game-core'

// Module-level convenience exports used by existing components (StatsModal, HistoryModal)
import { getWordOfDay } from '@five-letter/game-core'
export const { solution, solutionIndex, tomorrow } = getWordOfDay()
