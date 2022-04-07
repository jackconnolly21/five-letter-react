import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess the word in 12 tries. After each guess, the you will be told the
        number of letters in common with the mystery word.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell isRevealing={true} isCompleted={true} value="W" />
        <Cell value="E" />
        <Cell value="A" />
        <Cell value="R" />
        <Cell value="Y" />
        <Cell value="1" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The is one letter in common with the word.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="V" />
        <Cell value="A" />
        <Cell value="G" />
        <Cell value="U" />
        <Cell value="E" />
        <Cell value="3" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The are 3 letters in common with the word.
      </p>
    </BaseModal>
  )
}
