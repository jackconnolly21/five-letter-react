import { View, StyleSheet } from 'react-native'
import { MAX_WORD_LENGTH } from '../../constants/settings'
import { Cell } from './Cell'
import { isWordInWordList, unicodeSplit } from '../../lib/words'
import { CharStatus, CharStatusDict } from '../../lib/statuses'

type Props = {
  guess: string
  className?: string
  letterStatuses: CharStatusDict
  setLetterStatus: (char: string, newStatus: CharStatus) => void
}

export const CurrentRow = ({
  guess,
  letterStatuses,
  setLetterStatus,
}: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH - splitGuess.length))

  const isInvalid = guess.length === 5 && !isWordInWordList(guess)

  return (
    <View style={styles.row}>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} isInvalid={isInvalid} />
      ))}
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
