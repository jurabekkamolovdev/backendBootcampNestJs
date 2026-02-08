import { GameBoard } from './game-board.model';
import { v4 as uuidv4 } from 'uuid';

export class GameModel {
  board_ = GameBoard;
  gameUUID = uuidv4();
}
