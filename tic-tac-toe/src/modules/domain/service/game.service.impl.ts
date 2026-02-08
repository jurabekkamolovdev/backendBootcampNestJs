import { Injectable } from '@nestjs/common';
import { IGameService } from './game.service.interface';
import { Game } from '../model/game.model';
import { GameBoard } from '../model/game-board.model';

/**
 * Game Service Implementation
 * Implements the game business logic using Minimax algorithm
 */
@Injectable()
export class GameServiceImpl implements IGameService {
  private readonly PLAYER = 1; // Player (X)
  private readonly COMPUTER = -1; // Computer (O)
  private readonly EMPTY = 0;

  /**
   * Calculate the next move using Minimax algorithm
   */
  calculateNextMove(game: Game): Game {
    const board = game.getBoard();
    const bestMove = this.getBestMove(board);

    if (bestMove) {
      const newBoard = board.clone();
      newBoard.setCell(bestMove.row, bestMove.col, this.COMPUTER);

      const updatedGame = game.clone();
      updatedGame.setBoard(newBoard);

      return updatedGame;
    }

    return game;
  }

  /**
   * Validate the game board
   * Checks that:
   * 1. Only ONE move was added
   * 2. The move was made on an empty cell
   * 3. Previous moves weren't altered
   * 4. Only player's symbol (1) was added
   */
  validateGameBoard(newGame: Game, previousGame: Game): boolean {
    const newBoard = newGame.getBoard().getBoard();
    const oldBoard = previousGame.getBoard().getBoard();
    const size = 3;

    let differenceCount = 0;
    let moveRow = -1;
    let moveCol = -1;

    // Count differences
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          differenceCount++;
          moveRow = i;
          moveCol = j;
        }
      }
    }

    // Check 1: Exactly one difference
    if (differenceCount !== 1) {
      return false;
    }

    // Check 2: Previous cell was empty
    if (oldBoard[moveRow][moveCol] !== this.EMPTY) {
      return false;
    }

    // Check 3 & 4: New cell contains player's symbol
    if (newBoard[moveRow][moveCol] !== this.PLAYER) {
      return false;
    }

    return true;
  }

  /**
   * Check if the game is over
   */
  isGameOver(game: Game): boolean {
    const board = game.getBoard();

    // Check if someone won
    if (this.checkWinner(board) !== null) {
      return true;
    }

    // Check if board is full
    if (board.isFull()) {
      return true;
    }

    return false;
  }

  /**
   * Get the winner
   */
  getWinner(game: Game): number | null {
    const board = game.getBoard();
    const winner = this.checkWinner(board);

    if (winner !== null) {
      return winner;
    }

    // If board is full but no winner, it's a draw
    if (board.isFull()) {
      return 0;
    }

    return null;
  }

  /**
   * Get the best move using Minimax algorithm
   */
  private getBestMove(board: GameBoard): { row: number; col: number } | null {
    let bestScore = -Infinity;
    let bestMove: { row: number; col: number } | null = null;
    const size = board.getSize();

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board.isEmpty(i, j)) {
          const clonedBoard = board.clone();
          clonedBoard.setCell(i, j, this.COMPUTER);

          const score = this.minimax(clonedBoard, 0, false);

          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }

    return bestMove;
  }

  /**
   * Minimax algorithm implementation
   *
   * @param board - Current board state
   * @param depth - Current depth in the game tree
   * @param isMaximizing - True if maximizing (computer), false if minimizing (player)
   * @returns Score of the board state
   */
  private minimax(
    board: GameBoard,
    depth: number,
    isMaximizing: boolean,
  ): number {
    const winner = this.checkWinner(board);

    // Terminal states
    if (winner === this.COMPUTER) {
      return 10 - depth; // Computer wins (prefer faster wins)
    }
    if (winner === this.PLAYER) {
      return depth - 10; // Player wins (prefer slower losses)
    }
    if (board.isFull()) {
      return 0; // Draw
    }

    const size = board.getSize();

    if (isMaximizing) {
      // Computer's turn (maximize)
      let bestScore = -Infinity;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board.isEmpty(i, j)) {
            const clonedBoard = board.clone();
            clonedBoard.setCell(i, j, this.COMPUTER);
            const score = this.minimax(clonedBoard, depth + 1, false);
            bestScore = Math.max(score, bestScore);
          }
        }
      }

      return bestScore;
    } else {
      // Player's turn (minimize)
      let bestScore = Infinity;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board.isEmpty(i, j)) {
            const clonedBoard = board.clone();
            clonedBoard.setCell(i, j, this.PLAYER);
            const score = this.minimax(clonedBoard, depth + 1, true);
            bestScore = Math.min(score, bestScore);
          }
        }
      }

      return bestScore;
    }
  }

  /**
   * Check if there's a winner
   *
   * @returns 1 (player), -1 (computer), or null (no winner)
   */
  private checkWinner(board: GameBoard): number | null {
    const size = board.getSize();
    const b = board.getBoard();

    // Check rows
    for (let i = 0; i < size; i++) {
      if (
        b[i][0] !== this.EMPTY &&
        b[i][0] === b[i][1] &&
        b[i][1] === b[i][2]
      ) {
        return b[i][0];
      }
    }

    // Check columns
    for (let j = 0; j < size; j++) {
      if (
        b[0][j] !== this.EMPTY &&
        b[0][j] === b[1][j] &&
        b[1][j] === b[2][j]
      ) {
        return b[0][j];
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (b[0][0] !== this.EMPTY && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
      return b[0][0];
    }

    // Check diagonal (top-right to bottom-left)
    if (b[0][2] !== this.EMPTY && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
      return b[0][2];
    }

    return null;
  }
}
