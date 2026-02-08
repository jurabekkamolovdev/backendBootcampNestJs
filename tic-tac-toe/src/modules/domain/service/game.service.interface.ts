import { GameModel } from '../model/game.model';
export interface GameService {
  calculateNextMove(game: GameModel, player: number): [number, number];
  validateBoard(game: GameModel): boolean;
  isGameOver(game: GameModel): boolean;
}
