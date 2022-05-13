import { useState } from 'react'
import { MAX_CHALLENGES } from '../../constants/settings'
import {
  CharStatus,
  CharStatusDict,
  updateLetterStatus,
  updateLetterStatuses,
} from '../../lib/statuses'
import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  const textClasses = 'text-sm text-gray-500 dark:text-gray-300'
  const [statuses, setStatuses] = useState<CharStatusDict>(() => {
    const lettersInExamples = ['S', 'U', 'N', 'Y', 'V', 'A', 'G', 'E']
    return updateLetterStatuses({}, lettersInExamples, 'guessed')
  })

  const handleStatusChange = (char: string, status: CharStatus) => {
    setStatuses(updateLetterStatus(statuses, char, status))
  }

  const getExampleCell = (char: string, i: number) => {
    return (
      <Cell
        key={i}
        value={char}
        status={statuses[char]}
        handleStatusChange={handleStatusChange}
      />
    )
  }

  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className={textClasses}>
        Guess the word in {MAX_CHALLENGES} tries. After each guess, you will be
        told only the number of letters in common with the mystery word. Try
        clicking on letters to change their color and take notes!
      </p>

      <p className={`${textClasses} pt-4`}>
        For example, if the word is "VEGAN":
      </p>

      <div className="flex justify-center mb-2 mt-2">
        {getExampleCell('S', 0)}
        {getExampleCell('U', 1)}
        {getExampleCell('N', 2)}
        {getExampleCell('N', 3)}
        {getExampleCell('Y', 4)}
        <Cell key={5} value="1" resultStatus="medium" isResult />
      </div>
      <p className={textClasses}>
        Only the 'N' is in the mystery word. It only counts as one letter
        towards the score, regardless of how many 'N's are in your guess.
      </p>

      <div className="flex justify-center mb-2 mt-4">
        {getExampleCell('V', 0)}
        {getExampleCell('A', 1)}
        {getExampleCell('G', 2)}
        {getExampleCell('U', 3)}
        {getExampleCell('E', 4)}
        <Cell key={5} value="4" resultStatus="high" isResult />
      </div>
      <p className={textClasses}>
        There are 4 letters in common with the word - every letter except 'U'.
      </p>

      <h3 className="text-lg text-gray-500 dark:text-gray-300 pt-6">
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

      <div className="text-sm text-gray-500 dark:text-gray-300 mt-4">
        Created by Jack Connolly
      </div>
    </BaseModal>
  )
}
