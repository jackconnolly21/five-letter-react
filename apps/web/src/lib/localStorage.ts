import { CharStatusDict } from './statuses'

export type StoredGameState = {
  guesses: string[]
}

const allGameStatesKey = 'allGameStates'

const loadAllGameStates = (): Record<string, StoredGameState> => {
  const raw = localStorage.getItem(allGameStatesKey)
  return raw ? (JSON.parse(raw) as Record<string, StoredGameState>) : {}
}

export const saveGameStateToLocalStorage = (
  dateString: string,
  gameState: StoredGameState
) => {
  const all = loadAllGameStates()
  all[dateString] = gameState
  localStorage.setItem(allGameStatesKey, JSON.stringify(all))
}

export const loadGameStateFromLocalStorage = (
  dateString: string
): StoredGameState | null => {
  return loadAllGameStates()[dateString] ?? null
}

// Migrate old storage formats into the single allGameStates dict
export const migrateGameState = (todayString: string) => {
  const all = loadAllGameStates()
  let dirty = false

  // Migrate old flat 'gameState' key
  const oldFlat = localStorage.getItem('gameState')
  if (oldFlat) {
    try {
      const parsed = JSON.parse(oldFlat) as {
        guesses: string[]
        solution?: string
      }
      if (parsed.guesses && !all[todayString]) {
        all[todayString] = { guesses: parsed.guesses }
        dirty = true
      }
    } catch {
      /* ignore */
    }
    localStorage.removeItem('gameState')
  }

  // Migrate any per-date 'gameState_YYYY-MM-DD' keys
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('gameState_')) {
      const dateStr = key.slice('gameState_'.length)
      try {
        const parsed = JSON.parse(localStorage.getItem(key)!) as StoredGameState
        if (parsed.guesses && !all[dateStr]) {
          all[dateStr] = { guesses: parsed.guesses }
          dirty = true
        }
      } catch {
        /* ignore */
      }
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))

  if (dirty) {
    localStorage.setItem(allGameStatesKey, JSON.stringify(all))
  }
}

const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

const statusStatKey = 'statuses'

export type Statuses = {
  statuses: CharStatusDict
  date?: string
}

export const saveStatusesToLocalStorage = (statuses: Statuses) => {
  localStorage.setItem(statusStatKey, JSON.stringify(statuses))
}

export const loadStatusesFromLocalStorage = () => {
  const statuses = localStorage.getItem(statusStatKey)
  return statuses ? (JSON.parse(statuses) as Statuses) : null
}

const gameHistoryKey = 'gameHistory'

export type GameHistoryEntry = {
  date: string
  guesses: number
  won: boolean
}

export const saveGameHistoryEntry = (entry: GameHistoryEntry) => {
  const history = loadGameHistory()
  const idx = history.findIndex((h) => h.date === entry.date)
  if (idx >= 0) {
    history[idx] = entry
  } else {
    history.push(entry)
  }
  localStorage.setItem(gameHistoryKey, JSON.stringify(history))
}

export const loadGameHistory = (): GameHistoryEntry[] => {
  const data = localStorage.getItem(gameHistoryKey)
  return data ? (JSON.parse(data) as GameHistoryEntry[]) : []
}
