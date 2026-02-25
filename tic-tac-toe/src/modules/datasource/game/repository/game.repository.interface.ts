import { Game, IGame } from '../../../domain/game/model/game.model';

export interface IGameRepository {
  save(game: Game): Promise<Game>;

  findById(id: string): Promise<IGame | null>;

  findAll(): Promise<IGame[]>;
}
