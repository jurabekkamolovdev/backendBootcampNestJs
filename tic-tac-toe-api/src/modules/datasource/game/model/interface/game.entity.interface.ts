import {
  GameState,
  Opponent,
  Player,
} from 'src/modules/domain/game/model/game.model';

export interface IGameEntity {
  uuid: string;
  board: {
    cells: number[][];
    size: number;
  };
  opponent: Opponent;
  state: GameState;
  playerX?: Player | null;
  playerO?: Player | null;
}
