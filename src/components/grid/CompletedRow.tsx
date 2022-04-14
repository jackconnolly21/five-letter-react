import { CharStatus, CharStatusDict, getGuessScore } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'
import { MAX_WORD_LENGTH } from '../../constants/settings'

type Props = {
  guess: string
  isRevealing?: boolean
  letterStatuses: CharStatusDict
  setLetterStatus: (char: string, newStatus: CharStatus) => void
}

export const CompletedRow = ({
  guess,
  isRevealing,
  letterStatuses,
  setLetterStatus,
}: Props) => {
  const splitGuess = unicodeSplit(guess)
  const guessScore = getGuessScore(guess)

  // Need to update on 0 or 6
  const resultStatus =
    guessScore === 0 ? 'zero' : guessScore < 4 ? 'medium' : 'high'
  const guessResultString = guessScore === 6 ? '🎉' : guessScore.toString()

  // If row is 0 or winning, don't allow updating
  const setCellStatus =
    guessScore === 0 || guessScore === 6
      ? () => {
          return
        }
      : setLetterStatus

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          position={i}
          status={letterStatuses[letter]}
          handleStatusChange={setCellStatus}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
      <Cell
        key={MAX_WORD_LENGTH}
        value={isRevealing ? '' : guessResultString}
        position={MAX_WORD_LENGTH}
        resultStatus={resultStatus}
        isRevealing={isRevealing}
        isCompleted
        isResult
      />
    </div>
  )
}
