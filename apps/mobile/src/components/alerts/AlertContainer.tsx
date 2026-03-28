import { Animated, View, Text, StyleSheet } from 'react-native'
import { useEffect, useRef } from 'react'
import { useAlert } from '../../context/AlertContext'

export const AlertContainer = () => {
  const { message, isVisible } = useAlert()
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isVisible])

  if (!message) return null

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <View style={styles.alert}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  alert: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: 300,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
