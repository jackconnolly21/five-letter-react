import { useState } from 'react'
import Countdown from 'react-countdown'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'
import { GameStats } from '../../lib/localStorage'
import { shareStatus } from '../../lib/share'
import { getPastSolutions, tomorrow } from '../../lib/words'
import { BaseModal } from './BaseModal'
import {
  STATISTICS_TITLE,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  AVERAGE_TEXT,
  SHOW_PAST_WORDS_TEXT,
  HIDE_PAST_WORDS_TEXT,
} from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  numberOfGuessesMade: number
}

export const StatsModal = ({
  isOpen,
  handleClose,
  guesses,
  gameStats,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  numberOfGuessesMade,
}: Props) => {
  const [showPastWords, setShowPastWords] = useState(false)

  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats} />
      </BaseModal>
    )
  }

  const totalGuesses = gameStats.winDistribution
    .map((value, i) => value * (i + 1))
    .reduce((total, num) => total + num, 0)
  const totalWins = gameStats.totalGames - gameStats.gamesFailed
  const avgGuessesText =
    totalGuesses > 0
      ? ` (${AVERAGE_TEXT} ${(totalGuesses / totalWins).toFixed(1)})`
      : ''

  const pastWords = getPastSolutions(10)

  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
      <h4 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
        {avgGuessesText}
      </h4>
      <Histogram
        gameStats={gameStats}
        numberOfGuessesMade={
          isGameLost ? numberOfGuessesMade + 1 : numberOfGuessesMade
        }
      />
      {(isGameLost || isGameWon) && (
        <div className="mt-5 sm:mt-6 columns-2 dark:text-white">
          <div>
            <h5>{NEW_WORD_TEXT}</h5>
            <Countdown
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              date={tomorrow}
              daysInHours={true}
            />
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => {
              shareStatus(guesses, isGameLost, handleShareToClipboard)
            }}
          >
            {SHARE_TEXT}
          </button>
        </div>
      )}
      <div className="mt-2 w-full">
        <button
          type="button"
          className="mt-2 text-base font-medium dark:text-white sm:text-sm"
          onClick={() => {
            setShowPastWords(!showPastWords)
          }}
        >
          {showPastWords ? HIDE_PAST_WORDS_TEXT : SHOW_PAST_WORDS_TEXT}
        </button>
      </div>
      {showPastWords && (
        <div className="mt-2 text-base dark:text-white font-medium sm:text-sm">
          {pastWords.map((word) => (
            <div key={word}>{word}</div>
          ))}
        </div>
      )}

      <a
        className="mt-2 text-base font-medium dark:text-white sm:text-sm no-underline"
        href="https://www.buymeacoffee.com/jackconnolly"
        target="_blank"
        rel="noreferrer"
      >
        Buy Me A Coffee ☕
      </a>
    </BaseModal>
  )
}
