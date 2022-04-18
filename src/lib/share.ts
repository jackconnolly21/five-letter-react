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
  const textHeader = `${GAME_TITLE} #${solutionIndex}`
  const textBody = lost
    ? `Lost in ${MAX_CHALLENGES} guesses.`
    : `I got it in ${numberToEmoji[guesses.length]} ${
        guesses.length === 1 ? 'guess' : 'guesses'
      }!`
  const textToShare = `${textHeader}\n${textBody}`

  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    copyToClipboard(textToShare)
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

const copyToClipboard = (textToCopy: string) => {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method
    return navigator.clipboard.writeText(textToCopy)
  } else {
    // text area method
    let textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // make the textarea out of viewport
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const result = document.execCommand('copy')
    if (result === false) {
      console.error('Failed to copy text.')
    }
    textArea.remove()
  }
}

const numberToEmoji: { [num: number]: string } = {
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  4: '4️⃣',
  5: '5️⃣',
  6: '6️⃣',
  7: '7️⃣',
  8: '8️⃣',
  9: '9️⃣',
  10: '1️⃣0️⃣',
  11: '1️⃣1️⃣',
  12: '1️⃣2️⃣',
  13: '1️⃣3️⃣',
  14: '1️⃣4️⃣',
  15: '1️⃣5️⃣',
}
