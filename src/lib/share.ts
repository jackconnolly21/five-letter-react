import { solutionIndex } from './words'
import { GAME_TITLE } from '../constants/strings'
import { MAX_CHALLENGES } from '../constants/settings'
import { UAParser } from 'ua-parser-js'
import { getGuessScore } from './statuses'

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
  const scoreHeader = `${lost ? 'X' : guesses.length}/${MAX_CHALLENGES}`
  const textBody = getGuessEmojis(guesses).join('')
  const textToShare = `${textHeader} ${scoreHeader}\n${textBody}`

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

const getGuessEmojis = (guesses: string[]) => {
  return guesses.map((guess) => {
    const score = getGuessScore(guess)
    if (score === 0) {
      return '🟥'
    }
    if (score <= 3) {
      return '🟨'
    }
    if (score <= 5) {
      return '🟩'
    }
    return '🎉'
  })
}
