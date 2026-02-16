export class GameBoardEntity {
  cells: number[][];
  size: number;

  constructor(cells: number[][], size: number) {
    this.cells = cells;
    this.size = size;
  }
}
