import { View, StyleSheet } from 'react-native'
import { MAX_WORD_LENGTH } from '../../constants/settings'
import { Cell } from './Cell'

export const EmptyRow = () => {
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH))

  return (
    <View style={styles.row}>
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
      <Cell key={MAX_WORD_LENGTH} isResult />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
})
