import { View, Text, Pressable, StyleSheet } from 'react-native'
import { BaseModal } from './BaseModal'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'
import { GameStats } from '../../lib/storage'
import { shareStatus } from '../../lib/share'
import { tomorrow, getPastSolutions } from '../../lib/words'
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  SHOW_PAST_WORDS_TEXT,
  HIDE_PAST_WORDS_TEXT,
} from '../../constants/strings'
import { useState, useEffect } from 'react'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  solution: string
  solutionIndex: number
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  numberOfGuessesMade: number
}

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  solution,
  solutionIndex,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  numberOfGuessesMade,
}: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light
  const [showPastWords, setShowPastWords] = useState(false)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = tomorrow - now
      if (diff <= 0) {
        setCountdown('00:00:00')
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const gameIsOver = isGameWon || isGameLost

  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />

      <Text style={[styles.heading, { color: theme.text }]}>
        {GUESS_DISTRIBUTION_TEXT}
      </Text>
      <Histogram
        gameStats={gameStats}
        numberOfGuessesMade={numberOfGuessesMade}
        isGameWon={isGameWon}
      />

      <View style={styles.footer}>
        <View style={styles.countdownSection}>
          <Text style={[styles.countdownLabel, { color: theme.text }]}>
            {NEW_WORD_TEXT}
          </Text>
          <Text style={[styles.countdown, { color: theme.text }]}>
            {countdown}
          </Text>
        </View>

        {gameIsOver && (
          <Pressable
            style={styles.shareBtn}
            onPress={() =>
              shareStatus(
                guesses,
                solution,
                isGameLost,
                solutionIndex,
                handleShareToClipboard
              )
            }
          >
            <Text style={styles.shareBtnText}>{SHARE_TEXT}</Text>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={() => setShowPastWords(!showPastWords)}
        style={styles.pastWordsBtn}
      >
        <Text style={[styles.pastWordsText, { color: theme.textSecondary }]}>
          {showPastWords ? HIDE_PAST_WORDS_TEXT : SHOW_PAST_WORDS_TEXT}
        </Text>
      </Pressable>

      {showPastWords && (
        <View style={styles.pastWordsList}>
          {getPastSolutions(5).map((entry, i) => (
            <Text key={i} style={[styles.pastWordEntry, { color: theme.text }]}>
              {entry}
            </Text>
          ))}
        </View>
      )}
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  countdownSection: {
    alignItems: 'center',
    flex: 1,
  },
  countdownLabel: {
    fontSize: 12,
  },
  countdown: {
    fontSize: 28,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  shareBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pastWordsBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  pastWordsText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  pastWordsList: {
    marginTop: 8,
    gap: 4,
  },
  pastWordEntry: {
    fontSize: 13,
    textAlign: 'center',
  },
})
