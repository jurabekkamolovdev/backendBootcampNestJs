export type GameBoardCell = 0 | 1 | 2;
export type GameBoard = GameBoardCell[][];

export const BOARD_SIZE = 3 as const;

export function isGameBoard(board: unknown): board is GameBoard {
  if (!Array.isArray(board) || board.length !== BOARD_SIZE) return false;
  for (const row of board) {
    if (!Array.isArray(row) || row.length !== BOARD_SIZE) return false;
    for (const cell of row) {
      if (cell !== 0 && cell !== 1 && cell !== 2) return false;
    }
  }
  return true;
}
