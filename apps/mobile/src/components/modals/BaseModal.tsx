import { ReactNode } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'

type Props = {
  title: string
  children: ReactNode
  isOpen: boolean
  handleClose: () => void
}

export const BaseModal = ({ title, children, isOpen, handleClose }: Props) => {
  const { isDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.body}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flexGrow: 0,
  },
})
