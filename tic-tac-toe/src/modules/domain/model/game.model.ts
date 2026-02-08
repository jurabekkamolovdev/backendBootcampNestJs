import { GameBoard } from './game-board.model';

/**
 * Game Model
 * Represents a single Tic-Tac-Toe game session
 *
 * Contains:
 * - Unique identifier (UUID)
 * - Game board (3x3 matrix)
 */
export class Game {
  private readonly id: string;
  private board: GameBoard;

  constructor(id: string, board?: GameBoard) {
    this.id = id;
    this.board = board || new GameBoard();
  }

  /**
   * Get game ID (UUID)
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get game board
   */
  getBoard(): GameBoard {
    return this.board;
  }

  /**
   * Set game board
   */
  setBoard(board: GameBoard): void {
    this.board = board;
  }

  /**
   * Clone the game
   */
  clone(): Game {
    const clonedGame = new Game(this.id, this.board.clone());
    return clonedGame;
  }
}
