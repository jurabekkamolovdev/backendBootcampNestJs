import { Game } from 'src/modules/domain/game/model/game.model';

export interface IGameRepositoryMap {
  save(domainGame: Game): boolean;

  update(domainGame: Game): boolean;

  findById(gameUuid: string): Game | null;
}

export const GAMES_REPOSITORY = Symbol('GAMES_REPOSITORY');
