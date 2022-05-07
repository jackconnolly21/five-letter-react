import { BaseModal } from './BaseModal'
import { SettingsToggle } from './SettingsToggle'

type Props = {
  isOpen: boolean
  handleClose: () => void
  isDarkMode: boolean
  handleDarkMode: Function
  handleClearNotes: () => void
}

export const SettingsModal = ({
  isOpen,
  handleClose,
  isDarkMode,
  handleDarkMode,
  handleClearNotes,
}: Props) => {
  return (
    <BaseModal title="Settings" isOpen={isOpen} handleClose={handleClose}>
      <div className="flex flex-col mt-2 divide-y">
        <SettingsToggle
          settingName="Dark Mode"
          flag={isDarkMode}
          handleFlag={handleDarkMode}
        />
        <div className="flex justify-between py-3">
          <div className="text-gray-500 dark:text-gray-300 mt-2 text-left">
            <p className="leading-none">Clear Notes</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={handleClearNotes}
          >
            Clear
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
