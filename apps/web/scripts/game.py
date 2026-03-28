from helpers import generate_mystery_word, letters_in_common, validate_guess

class Game:
  def __init__(self, mystery_word=None):
    self.mystery_word = mystery_word
    self.guesses = []
    self.is_win = False

  def generate_mystery_word(self):
    self.mystery_word = generate_mystery_word()

  def guess_word(self, guess):
    guess = guess.lower()
    if validate_guess(guess) and not self.is_win:
      self.guesses.append(guess)
      if guess == self.mystery_word:
        self.is_win = True

  def guess_score(self, guess):
    return letters_in_common(self.mystery_word, guess)
