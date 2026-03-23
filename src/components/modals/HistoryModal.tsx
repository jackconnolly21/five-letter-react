import { BaseModal } from './BaseModal'
import { loadGameHistory, GameHistoryEntry } from '../../lib/localStorage'
import { getPastSolution, solution } from '../../lib/words'
import { HISTORY_TITLE, NOT_PLAYED_TEXT } from '../../constants/strings'
import { CheckIcon, XIcon } from '@heroicons/react/outline'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

const getLocalDateString = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const HistoryModal = ({ isOpen, handleClose }: Props) => {
  const history = loadGameHistory()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = getLocalDateString(today)
  const todayEntry = history.find((h: GameHistoryEntry) => h.date === todayStr)

  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i - 1)
    return d
  })

  const renderRow = (
    key: string,
    label: string,
    word: string,
    entry: GameHistoryEntry | undefined,
    isToday: boolean
  ) => (
    <div key={key} className="flex items-center justify-between py-3">
      <div className="text-sm dark:text-white w-24 text-left">{label}</div>
      {entry ? (
        <>
          <div className="text-sm font-bold dark:text-white">{word}</div>
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded text-white ${
              entry.won ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {entry.won ? (
              <>
                <CheckIcon className="h-4 w-4" />
                {entry.guesses} {entry.guesses === 1 ? 'guess' : 'guesses'}
              </>
            ) : (
              <>
                <XIcon className="h-4 w-4" />
                missed
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-sm dark:text-white">—</div>
          <span className="text-xs text-gray-400">
            {isToday ? 'In progress' : NOT_PLAYED_TEXT}
          </span>
        </>
      )}
    </div>
  )

  return (
    <BaseModal title={HISTORY_TITLE} isOpen={isOpen} handleClose={handleClose}>
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {renderRow(todayStr, 'Today', solution, todayEntry, true)}
        {pastDays.map((day) => {
          const dateStr = getLocalDateString(day)
          const entry = history.find((h: GameHistoryEntry) => h.date === dateStr)
          const word = getPastSolution(day)
          const label = day.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          return renderRow(dateStr, label, word, entry, false)
        })}
      </div>
      <p className="mt-3 text-xs text-gray-400 text-center">
        Only the last 7 days are shown
      </p>
    </BaseModal>
  )
}
