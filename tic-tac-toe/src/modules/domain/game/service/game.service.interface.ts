import { Game } from '../model/game.model';
import { GameBoard } from '../model/game-board.model';

export interface IGameService {
  // calculateNextMove(game: Game): Promise<Game>;

  validateGameBoard(
    newBoard: number[][],
    oldBoard: number[][],
    role: 1 | 2,
  ): boolean;

  // isGameOver(game: Game): boolean;

  getGameById(id: string): Promise<Game | null>;

  createNewGame(game: Game): Promise<Game>;

  joinGame(userId: string, gameId: string): Promise<Game | null>;

  makeMove(
    gameId: string,
    newGameBoard: GameBoard,
    playerId: string,
  ): Promise<Game | null>;
}
