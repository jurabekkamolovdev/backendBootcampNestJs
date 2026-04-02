import type { GameBoard } from './game-board.model';

export type GameState =
  | { kind: 'waiting_for_players' }
  | { kind: 'turn'; userUuid: string }
  | { kind: 'draw' }
  | { kind: 'win'; userUuid: string };

export interface Game {
  uuid: string;
  board: GameBoard;
  playerXUuid: string;
  playerOUuid?: string;
  vsComputer: boolean;
  state: GameState;
}
