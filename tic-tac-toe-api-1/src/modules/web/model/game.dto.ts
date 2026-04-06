import type { GameBoardDto } from './game-board.dto';

export type GameStateDto =
  | { kind: 'waiting_for_players' }
  | { kind: 'turn'; userUuid: string }
  | { kind: 'draw' }
  | { kind: 'win'; userUuid: string };

export interface GameDto {
  uuid: string;
  board: GameBoardDto;
  playerXUuid: string;
  playerOUuid?: string;
  vsComputer: boolean;
  state: GameStateDto;
}
