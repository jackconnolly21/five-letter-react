import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'
import { GameStats } from '../../lib/storage'

type Props = {
  gameStats: GameStats
  numberOfGuessesMade: number
  isGameWon: boolean
}

export const Histogram = ({
  gameStats,
  numberOfGuessesMade,
  isGameWon,
}: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  const maxValue = Math.max(...gameStats.winDistribution, 1)

  return (
    <View style={styles.container}>
      {gameStats.winDistribution.map((count, i) => {
        const isCurrentGuess = isGameWon && numberOfGuessesMade === i
        const barWidth = Math.max((count / maxValue) * 100, 8)

        return (
          <View key={i} style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>{i + 1}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${barWidth}%`,
                    backgroundColor: isCurrentGuess ? '#22c55e' : '#64748b',
                  },
                ]}
              >
                <Text style={styles.barText}>{count}</Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    width: 20,
    fontSize: 12,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
  },
  bar: {
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
    alignItems: 'flex-end',
  },
  barText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})
