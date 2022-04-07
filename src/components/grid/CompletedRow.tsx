import { getGuessScore } from '../../lib/statuses'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'
import { MAX_WORD_LENGTH } from '../../constants/settings'

type Props = {
  guess: string
  isRevealing?: boolean
}

export const CompletedRow = ({ guess, isRevealing }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const guessScore = getGuessScore(guess)
  const resultStatus =
    guessScore === 0 ? 'zero' : guessScore < 4 ? 'medium' : 'high'

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          value={letter}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
      <Cell
        key={MAX_WORD_LENGTH}
        value={guessScore.toString()}
        position={MAX_WORD_LENGTH}
        resultStatus={resultStatus}
        isCompleted
      />
    </div>
  )
}
