import { CharStatusDict } from './statuses'

export type StoredGameState = {
  guesses: string[]
}

export type Statuses = {
  statuses: CharStatusDict
  date?: string
}

export type GameHistoryEntry = {
  date: string
  guesses: number
  won: boolean
}
