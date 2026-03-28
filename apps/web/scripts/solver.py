import random
from dictionaries.mysteryWords import MYSTERY_WORDS
from game import Game
from helpers import letters_in_common

def solve_game(game):
  while not game.is_win:
    possible_words = get_possible_words(game)
    guess = random.choice(possible_words)
    game.guess_word(guess)

  return game

def get_possible_words(game):
  possible_words = MYSTERY_WORDS

  for guess in game.guesses:
    possible_words = [word for word in possible_words if is_word_possible(game, word, guess)]

  return possible_words

def is_word_possible(game, word, guess):
  guess_score = game.guess_score(guess)
  common_letters = letters_in_common(word, guess)

  return guess_score == common_letters

if __name__ == '__main__':
  game = Game()
  game.generate_mystery_word()
  solved_game = solve_game(game)
  
  print(f'Score: {len(solved_game.guesses)}')
  print(game.guesses)