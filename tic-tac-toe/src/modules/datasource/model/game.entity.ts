import { GameBoardEntity } from './game-board.entity';

export class GameEntity {
  id: string;
  board: GameBoardEntity;

  constructor(id: string, board: GameBoardEntity) {
    this.id = id;
    this.board = board;
  }
}
