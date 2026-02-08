/**
 * Game Board Entity
 * Database model for storing game board data
 *
 * Bu - ma'lumotlar bazasida saqlanadigan taxta modeli
 */
export class GameBoardEntity {
  cells: number[][]; // 3x3 matrix
  size: number; // 3

  constructor(cells: number[][], size: number = 3) {
    this.cells = cells;
    this.size = size;
  }
}
