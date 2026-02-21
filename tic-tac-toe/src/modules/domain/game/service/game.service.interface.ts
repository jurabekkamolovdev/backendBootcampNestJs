import { Game } from '../model/game.model';

export interface IGameService {
  // calculateNextMove(game: Game): Promise<Game>;

  validateGameBoard(newGame: Game, previousGame: Game): boolean;

  isGameOver(game: Game): boolean;

  // getGameById(id: string): Promise<Game | null>;

  saveGame(game: Game): Promise<Game | null>;
}
