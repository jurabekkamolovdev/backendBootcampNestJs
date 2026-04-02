import type { GameBoardEntity } from './game-board.entity';

export interface GameEntity {
  uuid: string;
  board: GameBoardEntity;
  playerXUuid: string;
  playerOUuid?: string;
  vsComputer: boolean;
  stateKind: 'waiting_for_players' | 'turn' | 'draw' | 'win';
  stateUserUuid?: string;
}
