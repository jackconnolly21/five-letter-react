# High Five

A daily word puzzle game built with React, TypeScript, and Tailwind CSS. Players get 15 attempts to guess a 5-letter mystery word, with feedback showing how many letters they have in common with the solution after each guess.

[**Play it live**](https://reactle.vercel.app/)

## How the Game Works

- Each day a new mystery word is selected (all letters are unique)
- Players guess any valid 5-letter word and receive a score (0-6) indicating how many letters are in common with the solution
- A score of 6 means a perfect match (win)
- Players can click on submitted letter cells to cycle through note statuses: guessed, absent, maybe, present -- helping track deductions
- Stats (win streaks, guess distribution) persist in localStorage
- Past 5 days' solutions are viewable in the info modal

## Project Structure

```
src/
  App.tsx                  # Main game orchestrator -- all core state lives here
  index.tsx                # Entry point, wraps App in AlertProvider
  context/
    AlertContext.tsx        # React Context for toast alerts (showSuccess/showError)
  components/
    navbar/Navbar.tsx       # Header bar with info/stats/settings icons
    grid/
      Grid.tsx             # Renders completed rows, current row, and empty rows
      Cell.tsx             # Single letter cell -- handles reveal animation + click-to-cycle notes
      CompletedRow.tsx     # A submitted guess row (5 letter cells + score cell)
      CurrentRow.tsx       # The row currently being typed
      EmptyRow.tsx         # Placeholder rows
    keyboard/
      Keyboard.tsx         # On-screen QWERTY keyboard
      Key.tsx              # Individual key with color status
    modals/
      BaseModal.tsx        # Reusable modal wrapper (uses @headlessui/react Dialog)
      InfoModal.tsx        # "How to play" instructions + past solutions
      StatsModal.tsx       # Game statistics + countdown to next word
      SettingsModal.tsx    # Dark mode toggle, clear notes
      SettingsToggle.tsx   # Toggle switch component
    stats/
      StatBar.tsx          # 4-stat summary bar (played, win%, streaks)
      Histogram.tsx        # Guess distribution chart
      Progress.tsx         # Individual histogram bar
    alerts/
      Alert.tsx            # Toast notification
      AlertContainer.tsx   # Positioned alert wrapper
  lib/
    words.ts               # Word validation, daily word selection (epoch-based), past solutions
    statuses.ts            # Guess scoring (letters in common), letter status tracking
    stats.ts               # Game statistics calculation and persistence
    localStorage.ts        # localStorage get/set helpers for game state, stats, theme
    share.ts               # Emoji grid generation + Web Share API / clipboard fallback
  constants/
    settings.ts            # MAX_WORD_LENGTH (5), MAX_CHALLENGES (15), timing constants
    strings.ts             # All UI text strings
    wordlist.ts            # ~1500 valid solution words
    validGuesses.ts        # ~13000 additional valid guess words
    mysteryOrder.ts        # Pseudo-random index order for daily word selection
  App.css                  # Dark mode background styles
  index.css                # Animations (cell-fill, cell-reveal, jiggle) + CSS variables
```

## Architecture

### State Management

- **App.tsx** owns all core game state via `useState`: `currentGuess`, `guesses`, `isGameWon`, `isGameLost`, `letterStatuses`, `isDarkMode`, `stats`, `isRevealing`
- **AlertContext** (React Context) provides `showSuccess()` / `showError()` to any component via `useAlert()` hook
- **localStorage** persists game state, statistics, letter note statuses, and theme preference across sessions
- No external state library -- just hooks and context

### Daily Word Selection

`lib/words.ts` > `getWordOfDay()`:
- Epoch date: April 1, 2022
- Calculates days since epoch, indexes into `MYSTERY_ORDER` array to get a word index
- Also computes `tomorrow` (next word reset time) for the countdown timer

### Scoring

`lib/statuses.ts` > `getGuessScore()`:
- Compares guess letters against solution letters
- Returns count of letters in common (0-5), or 6 for exact match

### Component Patterns

- Functional components with TypeScript prop interfaces
- `classnames` library for conditional Tailwind classes
- `@headlessui/react` for accessible modal Dialog/Transition
- `@heroicons/react` for icons
- Animations defined in `index.css`, triggered by class toggling with staggered delays

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 17 (CRA / react-scripts 5)   |
| Language    | TypeScript (strict mode, ES6 target)|
| Styling     | Tailwind CSS 3 + custom CSS animations |
| Modals      | @headlessui/react                   |
| Icons       | @heroicons/react                    |
| Formatting  | Prettier (no semis, single quotes)  |
| Git hooks   | Husky + lint-staged                 |

## Build and Run

### Local Development

```bash
npm install
npm start        # Starts dev server on http://localhost:3000
```

### Production Build

```bash
npm run build    # Outputs to build/
```

### Docker

**Development:**
```bash
docker build -t reactle:dev -f docker/Dockerfile .
docker run -d -p 3000:3000 --name reactle-dev reactle:dev
```

**Production (Nginx):**
```bash
docker build --target=prod -t reactle:prod -f docker/Dockerfile .
docker run -d -p 80:8080 --name reactle-prod reactle:prod
```

### Deployment

- **Primary:** Vercel (auto-deploys from GitHub)
- **Alternative:** Heroku via `heroku.yml` (Docker-based)
- **CI:** GitHub Actions runs Prettier check on PRs and pushes to main

## Code Style

- Prettier: no semicolons, single quotes, tab width 2, trailing commas (ES5)
- Pre-commit hook enforces formatting via Husky + lint-staged
- Run `npm run fix` to auto-format, `npm run lint` to check

## Environment Variables

Configured in `.env`:

| Variable                          | Purpose                        |
|-----------------------------------|--------------------------------|
| `REACT_APP_GAME_NAME`            | Game title ("High Five")       |
| `REACT_APP_GAME_DESCRIPTION`     | Meta description               |
| `REACT_APP_LOCALE_STRING`        | Locale for case conversion     |
| `REACT_APP_GOOGLE_MEASUREMENT_ID`| Google Analytics 4 tracking ID |

## Adding a New Feature

When adding features, follow these patterns:

1. **New component:** Create in `src/components/<category>/` with a TypeScript props interface. Use Tailwind for styling. Use `classnames` for conditional classes.
2. **New game logic:** Add to or create a file in `src/lib/`. Keep pure functions separate from React components.
3. **New UI text:** Add strings to `constants/strings.ts`.
4. **New settings/config:** Add constants to `constants/settings.ts`.
5. **New modal:** Extend `BaseModal` (see `InfoModal` for example pattern).
6. **State:** Add `useState` in `App.tsx` and pass down as props. Use localStorage helpers from `lib/localStorage.ts` for persistence.
7. **Alerts:** Use `useAlert()` hook to show toast notifications.
