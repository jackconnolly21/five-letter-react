import { View, Text, Pressable, StyleSheet } from 'react-native'
import { BaseModal } from './BaseModal'
import {
  getPastSolution,
  getDateString,
  GameHistoryEntry,
} from '@five-letter/game-core'
import { loadGameHistory, loadGameStateFromStorage } from '../../lib/storage'
import { HISTORY_TITLE, NOT_PLAYED_TEXT } from '../../constants/strings'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'
import { useState, useEffect } from 'react'

type Props = {
  isOpen: boolean
  handleClose: () => void
  onSelectDate: (date: Date) => void
}

export const HistoryModal = ({ isOpen, handleClose, onSelectDate }: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = getDateString(today)

  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i - 1)
    return d
  })

  const [history, setHistory] = useState<GameHistoryEntry[]>([])
  const [inProgressDates, setInProgressDates] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isOpen) return
    const load = async () => {
      const h = await loadGameHistory()
      setHistory(h)

      const inProgress = new Set<string>()
      await Promise.all(
        pastDays.map(async (day) => {
          const ds = getDateString(day)
          const state = await loadGameStateFromStorage(ds)
          if (state && state.guesses.length > 0) {
            inProgress.add(ds)
          }
        })
      )
      setInProgressDates(inProgress)
    }
    load()
  }, [isOpen])

  const renderRow = (
    key: string,
    label: string,
    word: string,
    entry: GameHistoryEntry | undefined,
    isToday: boolean,
    date?: Date,
    dateStr?: string
  ) => {
    const hasInProgressGuesses =
      !isToday && !entry && dateStr ? inProgressDates.has(dateStr) : false
    const isClickable = !isToday && !entry && date !== undefined

    return (
      <Pressable
        key={key}
        onPress={
          isClickable
            ? () => {
                onSelectDate(date)
                handleClose()
              }
            : undefined
        }
        style={[styles.row, isClickable && styles.rowClickable]}
      >
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {entry ? (
          <>
            <Text style={[styles.word, { color: theme.text }]}>{word}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: entry.won ? '#22c55e' : '#ef4444' },
              ]}
            >
              <Text style={styles.badgeText}>
                {entry.won
                  ? `${entry.guesses} ${
                      entry.guesses === 1 ? 'guess' : 'guesses'
                    }`
                  : 'missed'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.word, { color: theme.text }]}>—</Text>
            {isToday ? (
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                In progress
              </Text>
            ) : hasInProgressGuesses ? (
              <View style={[styles.badge, styles.badgeGray]}>
                <Text
                  style={[styles.badgeText, { color: theme.textSecondary }]}
                >
                  In progress
                </Text>
              </View>
            ) : isClickable ? (
              <View style={[styles.badge, styles.badgeBlue]}>
                <Text style={[styles.badgeText, { color: '#3b82f6' }]}>
                  Play
                </Text>
              </View>
            ) : (
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                {NOT_PLAYED_TEXT}
              </Text>
            )}
          </>
        )}
      </Pressable>
    )
  }

  const todayEntry = history.find((h) => h.date === todayStr)
  const todaySolution = getPastSolution(today)

  return (
    <BaseModal title={HISTORY_TITLE} isOpen={isOpen} handleClose={handleClose}>
      <View style={styles.divider} />
      {renderRow('today', 'Today', todaySolution, todayEntry, true)}
      {pastDays.map((day) => {
        const dateStr = getDateString(day)
        const entry = history.find((h) => h.date === dateStr)
        const word = getPastSolution(day)
        const label = day.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
        return renderRow(dateStr, label, word, entry, false, day, dateStr)
      })}
      <Text style={[styles.footnote, { color: theme.textSecondary }]}>
        Only the last 7 days are shown
      </Text>
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  rowClickable: {
    borderRadius: 6,
  },
  label: {
    fontSize: 13,
    width: 90,
  },
  word: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeGray: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  badgeBlue: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  statusText: {
    fontSize: 11,
  },
  footnote: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  },
})
