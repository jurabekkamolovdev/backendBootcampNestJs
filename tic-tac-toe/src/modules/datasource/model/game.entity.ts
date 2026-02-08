import { GameBoardEntity } from './game-board.entity';

/**
 * Game Entity
 * Database model for storing game data
 *
 * Bu - ma'lumotlar bazasida saqlanadigan o'yin modeli
 */
export class GameEntity {
  id: string; // UUID
  board: GameBoardEntity; // O'yin taxtasi

  constructor(id: string, board: GameBoardEntity) {
    this.id = id;
    this.board = board;
  }
}
