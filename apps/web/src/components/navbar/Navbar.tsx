import {
  ChartBarIcon,
  ClockIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { GAME_TITLE } from '../../constants/strings'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsHistoryModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  isPlayingPastGame: boolean
  selectedDate: Date
  onBackToToday: () => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsHistoryModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  isPlayingPastGame,
  selectedDate,
  onBackToToday,
}: Props) => {
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="navbar">
      <div className="navbar-content px-5">
        <div className="left-icons">
          <InformationCircleIcon
            className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
            onClick={() => setIsInfoModalOpen(true)}
          />
        </div>
        <p className="text-xl ml-2.5 font-bold dark:text-white">{GAME_TITLE}</p>
        <div className="right-icons">
          <ClockIcon
            className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
            onClick={() => setIsHistoryModalOpen(true)}
          />
          <ChartBarIcon
            className="h-6 w-6 mr-3 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-6 w-6 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      {isPlayingPastGame && (
        <div className="flex items-center justify-center gap-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-sm">
          <span className="font-medium text-yellow-800 dark:text-yellow-200">
            Playing {formattedDate} Puzzle
          </span>
          <button
            onClick={onBackToToday}
            className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-100"
          >
            Back to Today
          </button>
        </div>
      )}
      <hr></hr>
    </div>
  )
}
