import { useEffect, useRef, useState } from 'react'
import { Pressable, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import { CharStatus, ResultStatus } from '../../lib/statuses'
import { useTheme } from '../../context/ThemeContext'
import {
  getCellBackgroundColor,
  getCellBorderColor,
  getCellTextColor,
  colors as themeColors,
} from '../../lib/colors'
import { REVEAL_TIME_MS } from '../../constants/settings'

const screenWidth = Dimensions.get('window').width
const CELL_SIZE = Math.min(Math.floor((screenWidth - 80) / 6), 52)
const CELL_SIZE_SMALL = CELL_SIZE - 8

type Props = {
  value?: string
  status?: CharStatus
  resultStatus?: ResultStatus
  isResult?: boolean
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  isInvalid?: boolean
  isSmall?: boolean
  handleStatusChange?: (char: string, status: CharStatus) => void
}

export const Cell = ({
  value,
  status,
  resultStatus,
  isResult,
  isRevealing,
  isCompleted,
  position = 0,
  isInvalid,
  isSmall = false,
  handleStatusChange,
}: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? themeColors.dark : themeColors.light
  const isFilled = !!value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  // Cells loaded from storage are already revealed; new cells start unrevealed
  const alreadyRevealed = !!(isCompleted && !isRevealing)
  const [isColorRevealed, setIsColorRevealed] = useState(alreadyRevealed)

  const scaleAnim = useRef(new Animated.Value(1)).current
  const flipAnim = useRef(new Animated.Value(0)).current
  const jiggleAnim = useRef(new Animated.Value(0)).current

  // When a completed row is no longer actively revealing (e.g. loaded from storage),
  // immediately show the result color
  useEffect(() => {
    if (alreadyRevealed) setIsColorRevealed(true)
  }, [alreadyRevealed])

  // Fill animation when a letter is typed
  useEffect(() => {
    if (isFilled) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [value, isFilled])

  // Flip animation — color changes at the midpoint via setTimeout
  useEffect(() => {
    if (shouldReveal) {
      const delay = position * REVEAL_TIME_MS
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: REVEAL_TIME_MS,
          useNativeDriver: true,
        }),
      ]).start()
      const colorTimer = setTimeout(
        () => setIsColorRevealed(true),
        delay + REVEAL_TIME_MS / 2
      )
      return () => clearTimeout(colorTimer)
    } else if (!isCompleted) {
      flipAnim.setValue(0)
      setIsColorRevealed(false)
    }
  }, [shouldReveal])

  // Jiggle animation for invalid guesses
  useEffect(() => {
    if (isInvalid) {
      Animated.sequence([
        Animated.timing(jiggleAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(jiggleAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(jiggleAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(jiggleAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(jiggleAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isInvalid])

  const rotateX = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  })

  const backgroundColor = isColorRevealed
    ? getCellBackgroundColor(isDarkMode, status, resultStatus, isInvalid)
    : theme.cellDefault
  const borderColor = isColorRevealed
    ? getCellBorderColor(
        isDarkMode,
        value,
        status,
        resultStatus,
        isResult,
        isInvalid
      )
    : getCellBorderColor(
        isDarkMode,
        value,
        undefined,
        undefined,
        isResult,
        false
      )
  const textColor = isColorRevealed
    ? getCellTextColor(isDarkMode, status, resultStatus, isInvalid)
    : theme.text

  const size = isSmall ? CELL_SIZE_SMALL : CELL_SIZE

  const getNextStatus = (): CharStatus => {
    if (value && !isResult) {
      switch (status) {
        case 'guessed':
          return 'absent'
        case 'absent':
          return 'maybe'
        case 'maybe':
          return 'present'
        case 'present':
          return 'guessed'
      }
    }
    return 'guessed'
  }

  const handlePress = () => {
    if (handleStatusChange && value) {
      handleStatusChange(value, getNextStatus())
    }
  }

  return (
    <Pressable onPress={handlePress} disabled={!handleStatusChange}>
      <Animated.View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            backgroundColor,
            borderColor,
            transform: [
              { scale: scaleAnim },
              { translateX: jiggleAnim },
              { perspective: 1000 },
              { rotateX },
            ],
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: textColor, fontSize: isSmall ? 20 : 26 },
          ]}
        >
          {value}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  text: {
    fontWeight: 'bold',
  },
})
