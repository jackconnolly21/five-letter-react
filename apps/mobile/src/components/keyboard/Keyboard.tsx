import { View, StyleSheet, Dimensions } from 'react-native'
import { CharStatusDict } from '../../lib/statuses'
import { Key } from './Key'
import { ENTER_TEXT, DELETE_TEXT } from '../../constants/strings'

const screenWidth = Dimensions.get('window').width
const KEY_MARGIN = 3
const WIDE_KEY_WIDTH = Math.floor(
  ((screenWidth - 20 - KEY_MARGIN * 20) / 10) * 1.5
)

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  isRevealing?: boolean
  letterStatuses: CharStatusDict
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  isRevealing,
  letterStatuses,
}: Props) => {
  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={letterStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </View>
      <View style={styles.row}>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={letterStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
      </View>
      <View style={styles.row}>
        <Key width={WIDE_KEY_WIDTH} value="ENTER" onClick={onClick}>
          {ENTER_TEXT}
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={letterStatuses[key]}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={WIDE_KEY_WIDTH} value="DELETE" onClick={onClick}>
          {DELETE_TEXT}
        </Key>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
  },
})
