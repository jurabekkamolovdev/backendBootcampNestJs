import { Game } from '../model/game.model';

/**
 * Game Service Interface
 * Defines the contract for game business logic operations
 */
export interface IGameService {
  /**
   * Calculate the next move using the Minimax algorithm
   *
   * @param game - Current game state
   * @returns Updated game with computer's move
   */
  calculateNextMove(game: Game): Game;

  /**
   * Validate the game board
   * Ensures that previous moves haven't been altered
   *
   * @param newGame - New game state submitted by user
   * @param previousGame - Previous game state stored on server
   * @returns true if valid, false if invalid (cheating detected)
   */
  validateGameBoard(newGame: Game, previousGame: Game): boolean;

  /**
   * Check if the game is over
   * Game is over when:
   * - Someone won (3 in a row)
   * - Board is full (draw)
   *
   * @param game - Current game state
   * @returns true if game is over, false otherwise
   */
  isGameOver(game: Game): boolean;

  /**
   * Get the winner of the game
   *
   * @param game - Current game state
   * @returns 1 if player won, -1 if computer won, 0 if draw, null if game not over
   */
  getWinner(game: Game): number | null;
}
