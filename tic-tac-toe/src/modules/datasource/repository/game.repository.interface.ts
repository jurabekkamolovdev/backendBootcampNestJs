import { Game } from '../../domain/model/game.model';

export interface IGameRepository {
  save(game: Game): Promise<Game>;

  findById(id: string): Promise<Game | null>;

  delete(id: string): Promise<boolean>;
}
