import type { Game } from '../model/game.model';

export const GAME_SERVICE = Symbol('GAME_SERVICE');

export type GameResult = 'in_progress' | 'user_wins' | 'computer_wins' | 'draw';

export interface GameService {
  createGame(creatorUuid: string, opponent: 'computer' | 'user'): Promise<Game>;
  listAvailableGames(): Promise<Game[]>;
  joinGame(gameUuid: string, joinerUuid: string): Promise<Game>;
  getGame(gameUuid: string): Promise<Game>;
  makeMove(
    gameUuid: string,
    userUuid: string,
    row: number,
    col: number,
  ): Promise<Game>;
}
