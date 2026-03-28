import {
  addStatsForCompletedGame as _addStats,
  defaultStats,
  GameStats,
} from '@five-letter/game-core'
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

export const addStatsForCompletedGame = (
  gameStats: GameStats,
  count: number
) => {
  const stats = _addStats(gameStats, count)
  saveStatsToLocalStorage(stats)
  return stats
}

export const loadStats = (): GameStats => {
  return loadStatsFromLocalStorage() || defaultStats
}
