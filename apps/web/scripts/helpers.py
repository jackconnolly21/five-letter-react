import random
from dictionaries.mysteryWords import MYSTERY_WORDS
from dictionaries.validGuesses import VALID_GUESSES

def generate_mystery_word():
  return random.choice(MYSTERY_WORDS)

def validate_guess(word):
  return word.lower() in VALID_GUESSES

def letters_in_common(word, otherWord):
  setSolution = set(word)
  setOtherGuess = set(otherWord)

  return len(setSolution.intersection(setOtherGuess))
