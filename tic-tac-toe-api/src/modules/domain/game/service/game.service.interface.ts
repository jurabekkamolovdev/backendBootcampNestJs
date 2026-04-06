import { Opponent } from '../model/game.model';
import { CreateGameResult, MakeMoveResult } from '../model/game-result';

export interface IGameService {
  createGame(
    playerUuid: string,
    opponent: Opponent,
    board: number[][],
  ): Promise<CreateGameResult>;

  makeMove(
    gameUuid: string,
    playerUuid: string,
    newBoard: number[][],
  ): Promise<MakeMoveResult>;
}

export const GAME_SERVICE = Symbol('GAME_SERVICE');
