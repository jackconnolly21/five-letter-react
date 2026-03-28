import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'
import { GameStats } from '../../lib/storage'
import {
  TOTAL_TRIES_TEXT,
  SUCCESS_RATE_TEXT,
  CURRENT_STREAK_TEXT,
  BEST_STREAK_TEXT,
} from '../../constants/strings'

type Props = {
  gameStats: GameStats
}

export const StatBar = ({ gameStats }: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  const items = [
    { label: TOTAL_TRIES_TEXT, value: gameStats.totalGames },
    { label: SUCCESS_RATE_TEXT, value: `${gameStats.successRate}%` },
    { label: CURRENT_STREAK_TEXT, value: gameStats.currentStreak },
    { label: BEST_STREAK_TEXT, value: gameStats.bestStreak },
  ]

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <Text style={[styles.value, { color: theme.text }]}>
            {item.value}
          </Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
})
