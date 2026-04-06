export class GameBoard {
  private readonly SIZE: number = 3;
  private readonly board: number[][];

  constructor(board?: number[][], value?: number) {
    if (board) {
      this.validateBoard(board, value);
      this.board = board;
    } else {
      this.board = Array(this.SIZE)
        .fill(null)
        .map(() => Array(this.SIZE).fill(0) as number[]);
    }
  }

  getSize(): number {
    return this.SIZE;
  }

  getCell(row: number, col: number): number {
    this.validatePosition(row, col);
    this.validateValue(this.board[row][col]);
    return this.board[row][col];
  }

  setCell(row: number, col: number, value: number) {
    this.validatePosition(row, col);
    this.validateValue(value);
    this.board[row][col] = value;
  }

  isEmpty(row: number, col: number): boolean {
    return this.board[row][col] === 0;
  }

  isFull(): boolean {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  getBoard(): number[][] {
    return this.board.map((row) => [...row]);
  }

  clone(): GameBoard {
    return new GameBoard(this.getBoard());
  }

  validatePosition(row: number, col: number) {
    if (row >= this.SIZE || row < 0 || col >= this.SIZE || col < 0) {
      throw new Error(`O'yin maydoning position xatosi!: ${row} - ${col}\n`);
    }
  }

  validateBoard(board: number[][], value?: number) {
    if (board.length !== this.SIZE) {
      throw new Error(`O'yin maydoning xatosi!: ${board.length}`);
    }

    for (const row of board) {
      if (!row || row.length !== this.SIZE) {
        throw new Error(`O'yin maydoning xatosi!: ${this.SIZE}`);
      }
      for (const cell of row) {
        this.validateValue(cell);

        if (value !== undefined && value !== cell) {
          throw new Error(
            `O'yin maydoning xatosi!: ${cell}\n!!!Boshlangish o'yinda bo'sh maydon bo'lish kerak!!!`,
          );
        }
      }
    }
  }

  validateValue(cell: number) {
    if (cell !== 0 && cell !== 1 && cell !== 2) {
      throw new Error(`O'yin maydonidagi elementlar xatosi!: ${cell}`);
    }
  }

  getWinner(): number | null {
    const b = this.board;

    for (let i = 0; i < 3; i++) {
      if (b[i][0] !== 0 && b[i][0] === b[i][1] && b[i][1] === b[i][2]) {
        return b[i][0];
      }
    }

    for (let i = 0; i < 3; i++) {
      if (b[0][i] !== 0 && b[0][i] === b[1][i] && b[1][i] === b[2][i]) {
        return b[0][i];
      }
    }

    if (b[0][0] !== 0 && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
      return b[0][0];
    }

    if (b[0][2] !== 0 && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
      return b[0][2];
    }

    return null;
  }
}
