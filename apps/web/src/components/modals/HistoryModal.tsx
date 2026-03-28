import { BaseModal } from './BaseModal'
import {
  loadGameHistory,
  loadGameStateFromLocalStorage,
  GameHistoryEntry,
} from '../../lib/localStorage'
import { getPastSolution, solution, getDateString } from '../../lib/words'
import { HISTORY_TITLE, NOT_PLAYED_TEXT } from '../../constants/strings'
import { CheckIcon, XIcon } from '@heroicons/react/outline'

type Props = {
  isOpen: boolean
  handleClose: () => void
  onSelectDate: (date: Date) => void
}

export const HistoryModal = ({ isOpen, handleClose, onSelectDate }: Props) => {
  const history = loadGameHistory()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = getDateString(today)
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
    isToday: boolean,
    date?: Date,
    dateStr?: string
  ) => {
    const hasInProgressGuesses =
      !isToday && !entry && dateStr
        ? (loadGameStateFromLocalStorage(dateStr)?.guesses.length ?? 0) > 0
        : false
    const isClickable = !isToday && !entry && date !== undefined

    return (
      <div
        key={key}
        className={`flex items-center justify-between py-3 ${
          isClickable
            ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-1 -mx-1'
            : ''
        }`}
        onClick={
          isClickable
            ? () => {
                onSelectDate(date)
                handleClose()
              }
            : undefined
        }
      >
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
            {isToday ? (
              <span className="text-xs text-gray-400">In progress</span>
            ) : hasInProgressGuesses ? (
              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-500">
                In progress
              </span>
            ) : isClickable ? (
              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-500 dark:text-blue-400">
                Play
              </span>
            ) : (
              <span className="text-xs text-gray-400">{NOT_PLAYED_TEXT}</span>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <BaseModal title={HISTORY_TITLE} isOpen={isOpen} handleClose={handleClose}>
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {renderRow(todayStr, 'Today', solution, todayEntry, true)}
        {pastDays.map((day) => {
          const dateStr = getDateString(day)
          const entry = history.find(
            (h: GameHistoryEntry) => h.date === dateStr
          )
          const word = getPastSolution(day)
          const label = day.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          return renderRow(dateStr, label, word, entry, false, day, dateStr)
        })}
      </div>
      <p className="mt-3 text-xs text-gray-400 text-center">
        Only the last 7 days are shown
      </p>
    </BaseModal>
  )
}
