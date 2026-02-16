export class GameBoard {
  private readonly SIZE: number = 3;
  private readonly board: number[][];

  constructor(board?: number[][]) {
    if (board) {
      this.validateBoard(board);
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
      throw new Error('Invalid game board');
    }
  }

  validateBoard(board: number[][]) {
    if (board.length !== this.SIZE) {
      throw new Error(`The game board doesn't exist: ${board.length}`);
    }

    for (const row of board) {
      if (!row || row.length !== this.SIZE) {
        throw new Error(`The game board doesn't exist: ${this.SIZE}`);
      }
      for (const cell of row) {
        this.validateValue(cell);
      }
    }
  }

  validateValue(cell: number) {
    if (cell !== 0 && cell !== 1 && cell !== 2) {
      throw new Error(`The game board doesn't exist: ${this.SIZE}`);
    }
  }
}
