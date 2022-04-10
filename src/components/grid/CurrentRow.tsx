import { MAX_WORD_LENGTH } from '../../constants/settings'
import { Cell } from './Cell'
import { isWordInWordList, unicodeSplit } from '../../lib/words'

type Props = {
  guess: string
  className: string
}

export const CurrentRow = ({ guess, className }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH - splitGuess.length))
  const classes = `flex justify-center mb-1 ${className}`

  const isInvalid = guess.length === 5 && !isWordInWordList(guess)

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} isInvalid={isInvalid} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
      <Cell key={MAX_WORD_LENGTH} isResult />
    </div>
  )
}
