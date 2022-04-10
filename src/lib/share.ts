import { solutionIndex } from './words'
import { GAME_TITLE } from '../constants/strings'
import { MAX_CHALLENGES } from '../constants/settings'
import { UAParser } from 'ua-parser-js'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const shareStatus = (
  guesses: string[],
  lost: boolean,
  handleShareToClipboard: () => void
) => {
  const textToShare = `${GAME_TITLE} #${solutionIndex} ${
    lost ? 'X' : guesses.length
  }/${MAX_CHALLENGES}\n\n`

  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    const attemptShareVal = attemptShare(shareData)
    alert(`Attempt share = ${attemptShareVal}`)
    if (attemptShareVal) {
      alert('Trying to share')
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    alert('Failed to share')
    shareSuccess = false
  }

  if (!shareSuccess) {
    alert('Trying to copy to clipboard')
    navigator.clipboard.writeText(textToShare)
    alert('Did copy to clipboard')
    handleShareToClipboard()
  }
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}
