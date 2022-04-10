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
        Guess the word in {MAX_CHALLENGES} tries. After each guess, you will be
        told only the number of letters in common with the mystery word. Click
        on letters to change their color and take notes!
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell key={0} value="W" />
        <Cell key={1} value="E" />
        <Cell key={2} value="A" />
        <Cell key={3} value="R" />
        <Cell key={4} value="Y" />
        <Cell key={5} value="1" resultStatus="medium" isResult />
      </div>
      <p className={textClasses}>
        There is one letter in common with the word.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell key={0} value="V" />
        <Cell key={1} value="A" />
        <Cell key={2} value="G" />
        <Cell key={3} value="U" />
        <Cell key={4} value="E" />
        <Cell key={5} value="4" resultStatus="high" isResult />
      </div>
      <p className={textClasses}>
        There are 4 letters in common with the word.
      </p>

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
