import { BadRequestException } from '@nestjs/common';
import {
  BOARD_SIZE,
  isGameBoard,
  type GameBoard,
  type GameBoardCell,
} from '../model/game-board.model';
import type { GameResult } from './game.service.interface';

export const USER: GameBoardCell = 1;
export const COMPUTER: GameBoardCell = 2;
export const EMPTY: GameBoardCell = 0;

export function assertValidSubmittedBoardShape(
  board: unknown,
): asserts board is GameBoard {
  if (!isGameBoard(board)) {
    throw new BadRequestException(
      `Invalid game board: expected ${BOARD_SIZE}x${BOARD_SIZE} matrix of 0/1/2`,
    );
  }
}

export function getGameResult(board: GameBoard): GameResult {
  const winner = getWinner(board);
  if (winner === USER) return 'user_wins';
  if (winner === COMPUTER) return 'computer_wins';
  if (isBoardFull(board)) return 'draw';
  return 'in_progress';
}

export function getWinnerCell(board: GameBoard): GameBoardCell | 0 {
  return getWinner(board);
}

export function validateBoardProgression(
  previousBoard: GameBoard,
  submittedBoard: GameBoard,
): void {
  // Basic shape already validated; now validate immutability of previous moves and a single user move progression.
  let userAdded = 0;
  let previousUser = 0;
  let previousComputer = 0;
  let submittedUser = 0;
  let submittedComputer = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const prev = previousBoard[r][c];
      const next = submittedBoard[r][c];

      if (prev === USER) previousUser++;
      if (prev === COMPUTER) previousComputer++;
      if (next === USER) submittedUser++;
      if (next === COMPUTER) submittedComputer++;

      if (prev !== EMPTY && prev !== next) {
        throw new BadRequestException(
          'Invalid game board: previous moves must not be altered',
        );
      }
      if (prev === EMPTY && next === USER) userAdded++;
      if (prev === EMPTY && next === COMPUTER) {
        throw new BadRequestException(
          'Invalid game board: user cannot place computer moves',
        );
      }
    }
  }

  if (userAdded !== 1) {
    throw new BadRequestException(
      'Invalid game board: expected exactly one new user move',
    );
  }
  if (submittedUser !== previousUser + 1) {
    throw new BadRequestException(
      'Invalid game board: user moves count mismatch',
    );
  }
  if (submittedComputer !== previousComputer) {
    throw new BadRequestException(
      'Invalid game board: computer moves count mismatch',
    );
  }

  // Extra safety: user must not play after game is already finished.
  const prevResult = getGameResult(previousBoard);
  if (prevResult !== 'in_progress') {
    throw new BadRequestException(
      `Invalid game board: game already finished (${prevResult})`,
    );
  }
}

export function applyComputerMove(board: GameBoard): GameBoard {
  const result = getGameResult(board);
  if (result !== 'in_progress') return board;

  const { row, col } = findBestMove(board);
  const next = cloneBoard(board);
  if (row !== -1 && col !== -1) {
    next[row][col] = COMPUTER;
  }
  return next;
}

function cloneBoard(board: GameBoard): GameBoard {
  return board.map((row) => row.slice()) as GameBoard;
}

function isBoardFull(board: GameBoard): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) return false;
    }
  }
  return true;
}

function getWinner(board: GameBoard): GameBoardCell | 0 {
  // rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (
      board[r][0] !== EMPTY &&
      board[r][0] === board[r][1] &&
      board[r][1] === board[r][2]
    )
      return board[r][0];
  }
  // cols
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (
      board[0][c] !== EMPTY &&
      board[0][c] === board[1][c] &&
      board[1][c] === board[2][c]
    )
      return board[0][c];
  }
  // diags
  if (
    board[0][0] !== EMPTY &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  )
    return board[0][0];
  if (
    board[0][2] !== EMPTY &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  )
    return board[0][2];
  return EMPTY;
}

function findBestMove(board: GameBoard): { row: number; col: number } {
  let bestScore = -Infinity;
  let bestMove = { row: -1, col: -1 };

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== EMPTY) continue;
      const next = cloneBoard(board);
      next[r][c] = COMPUTER;
      const score = minimax(next, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = { row: r, col: c };
      }
    }
  }
  return bestMove;
}

function minimax(
  board: GameBoard,
  depth: number,
  isMaximizing: boolean,
): number {
  const winner = getWinner(board);
  if (winner === COMPUTER) return 10 - depth;
  if (winner === USER) return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] !== EMPTY) continue;
        const next = cloneBoard(board);
        next[r][c] = COMPUTER;
        best = Math.max(best, minimax(next, depth + 1, false));
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] !== EMPTY) continue;
        const next = cloneBoard(board);
        next[r][c] = USER;
        best = Math.min(best, minimax(next, depth + 1, true));
      }
    }
    return best;
  }
}
