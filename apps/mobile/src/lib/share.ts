import { Share } from 'react-native'
import { generateShareText } from '@five-letter/game-core'
import { GAME_TITLE } from '../constants/strings'

export const shareStatus = async (
  guesses: string[],
  solution: string,
  lost: boolean,
  solutionIndex: number,
  handleShareToClipboard: () => void
) => {
  const text = generateShareText(
    GAME_TITLE,
    solutionIndex,
    guesses,
    solution,
    lost
  )
  try {
    await Share.share({ message: text })
  } catch {
    handleShareToClipboard()
  }
}
