import { CellStatus, ResultStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { REVEAL_TIME_MS } from '../../constants/settings'
import { useState } from 'react'

type Props = {
  value?: string
  status?: CellStatus
  resultStatus?: ResultStatus
  isResult?: boolean
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
  isInvalid?: boolean
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
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`

  const [overrideStatus, setOverrideStatus] = useState<CellStatus>(
    status ?? 'none'
  )

  const handleClick = () => {
    // Only allow changes for completed normal cells
    if (value && !isResult) {
      switch (overrideStatus) {
        case 'none':
          setOverrideStatus('absent')
          break
        case 'absent':
          setOverrideStatus('maybe')
          break
        case 'maybe':
          setOverrideStatus('present')
          break
        case 'present':
          setOverrideStatus('none')
          break
      }
    }
  }

  const classes = classnames(
    'w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
    {
      'present shadowed bg-red-500 dark:bg-red-500 text-white border-red-500 dark:border-red-500':
        resultStatus === 'zero' || isInvalid,
      'present shadowed bg-yellow-500 dark:bg-yellow-500 text-white border-yellow-500 dark:border-yellow-500':
        overrideStatus === 'maybe' || resultStatus === 'medium',
      'present shadowed bg-green-500 dark:bg-green-500 text-white border-green-500 dark:border-green-500':
        overrideStatus === 'present' ||
        resultStatus === 'high' ||
        resultStatus === 'correct',
      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        overrideStatus === 'absent',
      'border-black dark:border-slate-100':
        (value && overrideStatus === 'none') || isResult,
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
