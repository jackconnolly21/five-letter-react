import { MAX_WORD_LENGTH } from '../../constants/settings'
import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'
import { VALID_GUESSES } from '../../constants/validGuesses'
import { NewCharStatus } from '../../lib/statuses'

type Props = {
  guess: string
  className: string
}

export const CurrentRow = ({ guess, className }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH - splitGuess.length))
  const classes = `flex justify-center mb-1 ${className}`

  const invalidWord = guess.length === 5 && !isInDictionary(guess)
  const status: NewCharStatus = invalidWord ? 'invalid' : 'none'

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} status={status} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
      <Cell key={MAX_WORD_LENGTH} />
    </div>
  )
}

const isInDictionary = (word: string) => {
  const index = VALID_GUESSES.findIndex((w) => w === word.toLocaleLowerCase())
  return index !== -1
}
