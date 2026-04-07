import { Game } from 'src/modules/domain/game/model/game.model';

export interface IGameRepositoryMap {
  save(domainGame: Game, playerUuid: string): boolean;

  update(domainGame: Game): boolean;

  delete(domainGame: Game): void;

  findById(gameUuid: string): Game | null;

  isPlayerInGame(playerUuid: string): boolean;
}

export const GAMES_REPOSITORY_MAP = Symbol('GAMES_REPOSITORY_MAP');
