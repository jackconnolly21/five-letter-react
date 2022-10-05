import { CharStatus, ResultStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { REVEAL_TIME_MS } from '../../constants/settings'

type Props = {
  value?: string
  status?: CharStatus
  resultStatus?: ResultStatus
  isResult?: boolean
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  isInvalid?: boolean
  isSmall?: boolean
  handleStatusChange?: (char: string, status: CharStatus) => void
}

export const Cell = ({
  value,
  status,
  resultStatus,
  isResult,
  isRevealing,
  isCompleted,
  position = 0,
  isInvalid,
  isSmall = false,
  handleStatusChange,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`

  const getNextStatus = () => {
    // Only allow changes for completed normal cells
    if (value && !isResult) {
      switch (status) {
        case 'guessed':
          return 'absent'
        case 'absent':
          return 'maybe'
        case 'maybe':
          return 'present'
        case 'present':
          return 'guessed'
      }
    }

    // Should never get here
    throw new Error(`Status was ${status}, should never get here`)
  }

  const handleClick = () => {
    if (handleStatusChange !== undefined && value !== undefined) {
      const nextStatus = getNextStatus()
      handleStatusChange(value, nextStatus)
    }
  }

  const classes = classnames(
    'w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
    {
      'w-12 h-12': isSmall,
      'present shadowed bg-red-500 dark:bg-red-500 text-white border-red-500 dark:border-red-500':
        resultStatus === 'zero' || isInvalid,
      'present shadowed bg-yellow-500 dark:bg-yellow-500 text-white border-yellow-500 dark:border-yellow-500':
        status === 'maybe' || resultStatus === 'medium',
      'present shadowed bg-green-500 dark:bg-green-500 text-white border-green-500 dark:border-green-500':
        status === 'present' ||
        resultStatus === 'high' ||
        resultStatus === 'correct',
      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'absent',
      'border-black dark:border-white':
        (value && (status === 'none' || status === 'guessed')) || isResult,
      'border-slate-400 dark:border-slate-800': !value && !isResult,
      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  return (
    <button onClick={handleClick}>
      <div className={classes} style={{ animationDelay }}>
        <div className="letter-container" style={{ animationDelay }}>
          {value}
        </div>
      </div>
    </button>
  )
}
