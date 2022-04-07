import { NewCharStatus, ResultStatus } from '../../lib/statuses'
import classnames from 'classnames'
import { REVEAL_TIME_MS } from '../../constants/settings'

type Props = {
  key?: number
  value?: string
  status?: NewCharStatus
  resultStatus?: ResultStatus
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
}

export const Cell = ({
  key,
  value,
  status,
  resultStatus,
  isRevealing,
  isCompleted,
  position = 0,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`

  const classes = classnames(
    'w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
    {
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
        (!status && !resultStatus) || status == 'none',
      'border-black dark:border-slate-100': value && !status,
      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'absent',
      'present shadowed bg-red-500 text-white border-red-500':
        status === 'invalid' || resultStatus === 'zero',
      'present shadowed bg-yellow-500 text-white border-red-500':
        resultStatus === 'medium',
      'present shadowed bg-green-500 text-white border-red-500':
        resultStatus === 'high' || resultStatus === 'correct',
      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  return (
    <div className={classes} style={{ animationDelay }} key={key}>
      <div className="letter-container" style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}
