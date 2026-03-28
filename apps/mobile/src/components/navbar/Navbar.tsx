import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'
import { GAME_TITLE } from '../../constants/strings'

type Props = {
  setIsInfoModalOpen: (open: boolean) => void
  setIsHistoryModalOpen: (open: boolean) => void
  setIsStatsModalOpen: (open: boolean) => void
  setIsSettingsModalOpen: (open: boolean) => void
  isPlayingPastGame: boolean
  selectedDate: Date
  onBackToToday: () => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsHistoryModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  isPlayingPastGame,
  selectedDate,
  onBackToToday,
}: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <View>
      <View
        style={[styles.container, { borderBottomColor: theme.navbarBorder }]}
      >
        <Pressable
          onPress={() => setIsInfoModalOpen(true)}
          style={styles.iconBtn}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.text}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx={12} cy={12} r={10} />
            <Line x1={12} y1={16} x2={12} y2={12} />
            <Line x1={12} y1={8} x2={12.01} y2={8} />
          </Svg>
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>{GAME_TITLE}</Text>
        <View style={styles.rightIcons}>
          <Pressable
            onPress={() => setIsHistoryModalOpen(true)}
            style={styles.iconBtn}
          >
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={10} />
              <Line x1={12} y1={8} x2={12} y2={12} />
              <Line x1={12} y1={12} x2={15} y2={14} />
            </Svg>
          </Pressable>
          <Pressable
            onPress={() => setIsStatsModalOpen(true)}
            style={styles.iconBtn}
          >
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1={18} y1={20} x2={18} y2={10} />
              <Line x1={12} y1={20} x2={12} y2={4} />
              <Line x1={6} y1={20} x2={6} y2={14} />
            </Svg>
          </Pressable>
          <Pressable
            onPress={() => setIsSettingsModalOpen(true)}
            style={styles.iconBtn}
          >
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx={12} cy={12} r={3} />
              <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </Svg>
          </Pressable>
        </View>
      </View>
      {isPlayingPastGame && (
        <View style={styles.pastGameBanner}>
          <Text style={styles.pastGameText}>
            Playing {formattedDate} Puzzle
          </Text>
          <Pressable onPress={onBackToToday}>
            <Text style={styles.backToTodayText}>Back to Today</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastGameBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
    backgroundColor: '#fefce8',
  },
  pastGameText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400e',
  },
  backToTodayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
    textDecorationLine: 'underline',
  },
})
