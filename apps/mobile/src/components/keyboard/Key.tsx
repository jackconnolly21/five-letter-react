import { ReactNode } from 'react'
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native'
import { CharStatus } from '../../lib/statuses'
import { useTheme } from '../../context/ThemeContext'
import { getKeyBackgroundColor, getKeyTextColor } from '../../lib/colors'
import * as Haptics from 'expo-haptics'

const screenWidth = Dimensions.get('window').width
const KEY_HEIGHT = 52
const KEY_MARGIN = 3

type Props = {
  children?: ReactNode
  value: string
  width?: number
  status?: CharStatus
  onClick: (value: string) => void
  isRevealing?: boolean
}

export const Key = ({
  children,
  status,
  width,
  value,
  onClick,
  isRevealing,
}: Props) => {
  const { isDarkMode } = useTheme()

  const backgroundColor = getKeyBackgroundColor(isDarkMode, status)
  const textColor = getKeyTextColor(isDarkMode, status)

  // Calculate key width: default keys split the screen evenly (10 per row)
  const defaultKeyWidth = Math.floor((screenWidth - 20 - KEY_MARGIN * 20) / 10)
  const keyWidth = width || defaultKeyWidth

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onClick(value)
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.key,
        {
          width: keyWidth,
          backgroundColor,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[styles.text, { color: textColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {children || value}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  key: {
    height: KEY_HEIGHT,
    borderRadius: 4,
    marginHorizontal: KEY_MARGIN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
  },
})
