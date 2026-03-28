import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  GameStats,
  StoredGameState,
  Statuses,
  GameHistoryEntry,
} from '@five-letter/game-core'

export type { GameStats, StoredGameState, Statuses, GameHistoryEntry }

// ── Game State (date-keyed) ──────────────────────────────────────────────────

const allGameStatesKey = 'allGameStates'

const loadAllGameStates = async (): Promise<
  Record<string, StoredGameState>
> => {
  const raw = await AsyncStorage.getItem(allGameStatesKey)
  return raw ? (JSON.parse(raw) as Record<string, StoredGameState>) : {}
}

export const saveGameStateToStorage = async (
  dateString: string,
  gameState: StoredGameState
) => {
  const all = await loadAllGameStates()
  all[dateString] = gameState
  await AsyncStorage.setItem(allGameStatesKey, JSON.stringify(all))
}

export const loadGameStateFromStorage = async (
  dateString: string
): Promise<StoredGameState | null> => {
  return (await loadAllGameStates())[dateString] ?? null
}

// ── Stats ────────────────────────────────────────────────────────────────────

const gameStatsKey = 'gameStats'

export const saveStatsToStorage = async (gameStats: GameStats) => {
  await AsyncStorage.setItem(gameStatsKey, JSON.stringify(gameStats))
}

export const loadStatsFromStorage = async (): Promise<GameStats | null> => {
  const stats = await AsyncStorage.getItem(gameStatsKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

// ── Letter Statuses ──────────────────────────────────────────────────────────

const statusesKey = 'statuses'

export const saveStatusesToStorage = async (statuses: Statuses) => {
  await AsyncStorage.setItem(statusesKey, JSON.stringify(statuses))
}

export const loadStatusesFromStorage = async (): Promise<Statuses | null> => {
  const statuses = await AsyncStorage.getItem(statusesKey)
  return statuses ? (JSON.parse(statuses) as Statuses) : null
}

// ── Theme ────────────────────────────────────────────────────────────────────

const themeKey = 'theme'

export const saveThemeToStorage = async (theme: 'dark' | 'light') => {
  await AsyncStorage.setItem(themeKey, theme)
}

export const loadThemeFromStorage = async (): Promise<string | null> => {
  return AsyncStorage.getItem(themeKey)
}

// ── Game History ─────────────────────────────────────────────────────────────

const gameHistoryKey = 'gameHistory'

export const saveGameHistoryEntry = async (entry: GameHistoryEntry) => {
  const history = await loadGameHistory()
  const idx = history.findIndex((h) => h.date === entry.date)
  if (idx >= 0) {
    history[idx] = entry
  } else {
    history.push(entry)
  }
  await AsyncStorage.setItem(gameHistoryKey, JSON.stringify(history))
}

export const loadGameHistory = async (): Promise<GameHistoryEntry[]> => {
  const data = await AsyncStorage.getItem(gameHistoryKey)
  return data ? (JSON.parse(data) as GameHistoryEntry[]) : []
}
