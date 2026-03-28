import {
  View,
  Text,
  Switch,
  Pressable,
  Linking,
  StyleSheet,
} from 'react-native'
import { BaseModal } from './BaseModal'
import { useTheme } from '../../context/ThemeContext'
import { colors } from '../../lib/colors'
import { CLEAR_NOTES_TEXT } from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleClose: () => void
  handleClearNotes: () => void
}

export const SettingsModal = ({
  isOpen,
  handleClose,
  handleClearNotes,
}: Props) => {
  const { isDarkMode, setIsDarkMode } = useTheme()
  const theme = isDarkMode ? colors.dark : colors.light

  return (
    <BaseModal title="Settings" isOpen={isOpen} handleClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#cbd5e1', true: '#22c55e' }}
          />
        </View>

        <View style={styles.divider} />

        <Pressable
          onPress={handleClearNotes}
          style={({ pressed }) => [
            styles.clearBtn,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.clearBtnText}>{CLEAR_NOTES_TEXT}</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          onPress={() =>
            Linking.openURL(
              'https://jackconnolly21.github.io/high-five-privacy/'
            )
          }
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.linkText, { color: theme.text }]}>
            Privacy Policy
          </Text>
        </Pressable>
      </View>
    </BaseModal>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  clearBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})
