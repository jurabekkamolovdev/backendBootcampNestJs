import { Game } from 'src/modules/domain/game/model/game.model';

export interface IGameRepository {
  save(domainGame: Game): Promise<boolean>;

  findById(gameUuid: string): Promise<Game | null>;

  getAllFinishGames(playerUuid: string): Promise<Array<Game> | null>;
}

export const GAMES_REPOSITORY = Symbol('GAMES_REPOSITORY');
