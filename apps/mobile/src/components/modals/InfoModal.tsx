import { View, Text, StyleSheet } from 'react-native'
import { BaseModal } from './BaseModal'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  return (
    <BaseModal title="How To Play" isOpen={isOpen} handleClose={handleClose}>
      <View style={styles.container}>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          Guess the word in 15 tries. After each guess, you'll see a score
          showing how many letters your guess has in common with the mystery
          word.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.text }]}>Scoring</Text>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreBadge, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.scoreBadgeText}>0</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: theme.text }]}>
              No letters in common
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreBadge, { backgroundColor: '#eab308' }]}>
              <Text style={styles.scoreBadgeText}>1-3</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: theme.text }]}>
              Few letters in common
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <View style={[styles.scoreBadge, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.scoreBadgeText}>4-5</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: theme.text }]}>
              Most letters in common
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.partyEmoji}>🎉</Text>
            <Text style={[styles.scoreLabel, { color: theme.text }]}>
              You found the word!
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.text }]}>
            Note Taking
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Tap on letters in completed rows to cycle through note-taking
            colors. Use this to keep track of which letters you think might be
            in the mystery word.
          </Text>
        </View>
      </View>
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreBadge: {
    width: 40,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreLabel: {
    fontSize: 14,
  },
  partyEmoji: {
    fontSize: 24,
    width: 40,
    textAlign: 'center',
  },
})
