import { Game } from '../model/game.model';

/**
 * Game Service Interface
 * Defines the contract for game business logic operations
 */
export interface IGameService {
  /**
   * Calculate the next move using the Minimax algorithm
   */
  calculateNextMove(game: Game): Promise<Game>;

  /**
   * Validate the game board
   * Ensures that previous moves haven't been altered
   */
  validateGameBoard(newGame: Game, previousGame: Game): boolean;

  /**
   * Check if the game is over
   */
  isGameOver(game: Game): boolean;

  /**
   * Get game by ID from repository
   */
  getGameById(id: string): Promise<Game | null>;

  /**
   * Save game to repository
   */
  saveGame(game: Game): Promise<Game>;
}
