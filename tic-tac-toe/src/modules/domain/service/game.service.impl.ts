import { Injectable, Inject } from '@nestjs/common';
import { IGameService } from './game.service.interface';
import { Game } from '../model/game.model';
import { GameBoard } from '../model/game-board.model';
import type { IGameRepository } from '../../datasource/repository/game.repository.interface';

@Injectable()
export class GameServiceImpl implements IGameService {
  private readonly PLAYER = 1; // Player (X)
  private readonly COMPUTER = 2; // Computer (O)
  private readonly EMPTY = 0;

  constructor(
    @Inject('IGameRepository')
    private readonly gameRepository: IGameRepository,
  ) {}

  async calculateNextMove(game: Game): Promise<Game> {
    const board = game.getBoard();
    const bestMove = this.getBestMove(board);

    if (bestMove) {
      const cloneBoard = board.clone();
      cloneBoard.setCell(bestMove.row, bestMove.col, this.COMPUTER);

      const updatedGame = game.clone();
      updatedGame.setBoard(cloneBoard);
      // await Promise.resolve();
      await this.gameRepository.save(updatedGame);
      return updatedGame;
    }

    return game;
  }

  async getGameById(id: string): Promise<Game | null> {
    // await Promise.resolve(id);
    return await this.gameRepository.findById(id);
  }

  async saveGame(game: Game): Promise<Game | null> {
    // await Promise.resolve(game);

    return await this.gameRepository.save(game);
  }

  isGameOver(game: Game): boolean {
    const board = game.getBoard();

    if (this.checkWinner(board) !== null) {
      return true;
    }

    return board.isFull();
  }

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

  validateGameBoard(newGame: Game, previousGame: Game): boolean {
    const newBoard = newGame.getBoard().getBoard();
    const oldBoard = previousGame.getBoard().getBoard();
    const size = 3;

    let differenceCount = 0;
    let moveRow = -1;
    let moveCol = -1;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          differenceCount++;
          moveRow = i;
          moveCol = j;
        }
      }
    }

    if (differenceCount !== 1) {
      return false;
    }

    if (oldBoard[moveRow][moveCol] !== this.EMPTY) {
      return false;
    }

    return newBoard[moveRow][moveCol] === this.PLAYER;
  }
}
