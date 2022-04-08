import { MAX_CHALLENGES } from '../../constants/settings'
import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  const textClasses = 'text-sm text-gray-500 dark:text-gray-300'

  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className={textClasses}>
        Guess the word in {MAX_CHALLENGES} tries. After each guess, the you will
        be told only the number of letters in common with the mystery word.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell isRevealing={true} isCompleted={true} value="W" />
        <Cell value="E" />
        <Cell value="A" />
        <Cell value="R" />
        <Cell value="Y" />
        <Cell value="1" resultStatus="medium" />
      </div>
      <p className={textClasses}>
        There is one letter in common with the word.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="V" />
        <Cell value="A" />
        <Cell value="G" />
        <Cell value="U" />
        <Cell value="E" />
        <Cell value="4" resultStatus="high" />
      </div>
      <p className={textClasses}>
        There are 4 letters in common with the word.
      </p>

      {/* If there are two of one letter in your guess, that would be
            equivalent to a score of one - i.e. TREES returns 1 if only e is in
            the mystery word */}

      <h3 className="text-lg text-gray-500 dark:text-gray-300 pt-8 pb-4">
        Some tips:
      </h3>

      <ul className="text-sm text-left text-gray-500 dark:text-gray-300">
        <li> • The mystery word will contain five unique letters</li>
        <li> • But feel free to use any five letter words to guess!</li>
        <li>
          • Sometimes zero letters in common is good! This allows you to narrow
          down the list of possible letters.
        </li>
        <li>
          • Try guessing words with repeated letters - it gives the same benefit
          as using letters you know aren't in the word.
        </li>
      </ul>
    </BaseModal>
  )
}
