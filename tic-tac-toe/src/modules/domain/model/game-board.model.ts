export class GameBoard {
  private readonly SIZE = 3;
  private board: number[][];

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

  getCell(row: number, col: number) {
    this.validatePosition(row, col);
    return this.board[row][col];
  }

  setCell(row: number, col: number, value: number): void {
    this.validatePosition(row, col);
    this.validateValue(value);
    this.board[row][col] = value;
  }

  isEmpty(row: number, col: number): boolean {
    return this.board[row][col] === 0;
  }

  isFull(): boolean {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        if (this.board[i][j] === 0) {
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

  getSize(): number {
    return this.SIZE;
  }

  private validatePosition(row: number, col: number) {
    if (row < 0 || row >= this.SIZE || col < 0 || col >= this.SIZE) {
      throw new Error(`Siz noto'g'ri position yubordingiz ${row} ${col}`);
    }
  }

  private validateBoard(board: number[][]) {
    if (board.length !== this.SIZE) {
      throw new Error(
        `Board o'lchami xato u ${this.SIZE}x${this.SIZE} bo'lishi lozim`,
      );
    }
    for (const row of board) {
      if (!row || row.length !== this.SIZE) {
        throw new Error(
          `Board o'lchami xato u ${this.SIZE}x${this.SIZE} bo'lishi lozim`,
        );
      }
      for (const cell of row) {
        this.validateValue(cell);
      }
    }
  }

  private validateValue(value: number): void {
    if (value !== 0 && value !== 1 && value !== 2) {
      throw new Error(
        `Board ichidagi ${value} xato board ichida 0, 1, 2 bo'lishi kerak`,
      );
    }
  }
}
