import type { Game } from '../../domain/model/game.model';

export const GAMES_REPOSITORY = Symbol('GAMES_REPOSITORY');

export interface GamesRepository {
  get(uuid: string): Promise<Game | undefined>;
  save(game: Game): Promise<void>;
  listWaitingForPlayers(): Promise<Game[]>;
}
