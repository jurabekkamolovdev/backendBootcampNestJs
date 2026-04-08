import { Opponent } from '../model/game.model';
import { CreateGameResult, MakeMoveResult } from '../model/game-result';
import { Game } from '../model/game.model';

export interface IGameService {
  createGame(
    playerUuid: string,
    opponent: Opponent,
    board: number[][],
  ): CreateGameResult;

  makeMove(
    gameUuid: string,
    playerUuid: string,
    newBoard: number[][],
  ): Promise<MakeMoveResult>;

  joinGame(gameUuid: string, playerUuid: string): CreateGameResult;

  getAvailableGames(): Array<Game>;

  getGameById(gameUuid: string): Promise<Game | null>;
}

export const GAME_SERVICE = Symbol('GAME_SERVICE');
