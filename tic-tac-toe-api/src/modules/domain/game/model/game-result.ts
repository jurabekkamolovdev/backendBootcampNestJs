import { GameState } from './game.model';

export interface CreateGameResult {
  gameUuid: string;
  playerState: 1 | 2;
  gameState: GameState;
  board: number[][];
}

export interface MakeMoveResult {
  gameUuid: string;
  playerState: 1 | 2;
  gameState: GameState;
  board: number[][];
}
