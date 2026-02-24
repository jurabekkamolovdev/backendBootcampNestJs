import { Inject, Injectable } from '@nestjs/common';
import type { IUserService } from '../../user/service/user.service.interface';
import { Game, GameMod, GameStatus, IGame } from '../model/game.model';
import { GameBoard } from '../model/game-board.model';
import type { IGameRepository } from '../../../datasource/game/repository/game.repository.interface';
import { IGameService } from './game.service.interface';
import {
  GameAlreadyStartedError,
  GameInvalidMoveError,
  GameMissingPlayerOError,
  GameMissingPlayerXError,
  GameNotFoundError,
  GameNotYourTurnError,
  GamePlayerNotFoundError,
} from '../common/errors/game.errors';

@Injectable()
export class GameServiceImpl implements IGameService {
  private PLAYER = 1;
  private COMPUTER = 2;
  private EMPTY = 0;

  constructor(
    @Inject('IGameRepository')
    private readonly gameRepository: IGameRepository,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  async getGameById(id: string): Promise<Game> {
    const iGame = await this.gameRepository.findById(id);

    if (!iGame) {
      throw new GameNotFoundError(id);
    }

    return this.toDomain(iGame, id);
  }

  async makeMove(
    gameId: string,
    newGameBoard: GameBoard,
    playerId: string,
  ): Promise<Game> {
    const iGame = await this.gameRepository.findById(gameId);
    if (!iGame) throw new GameNotFoundError(gameId);

    const game = await this.toDomain(iGame, gameId);

    if (game.getCurrentPlayerId() !== playerId) {
      throw new GameNotYourTurnError(playerId);
    }

    const isValid = this.validateGameBoard(
      newGameBoard.getBoard(),
      game.getBoard().getBoard(),
      game.getRole(),
    );
    if (!isValid) throw new GameInvalidMoveError();

    game.setBoard(newGameBoard);

    if (this.checkWinner(game.getBoard()) !== null) {
      game.setGameStatus(GameStatus.WIN);
      return this.gameRepository.save(game);
    }

    if (game.getBoard().isFull()) {
      game.setGameStatus(GameStatus.DRAW);
      return this.gameRepository.save(game);
    }

    if (game.getMode() === GameMod.COMPUTER) {
      const bestMove = this.getBestMove(game.getBoard());
      if (bestMove) {
        game.getBoard().setCell(bestMove.row, bestMove.col, this.COMPUTER);
      }

      if (this.checkWinner(game.getBoard()) !== null) {
        game.setGameStatus(GameStatus.WIN);
        return this.gameRepository.save(game);
      }

      if (game.getBoard().isFull()) {
        game.setGameStatus(GameStatus.DRAW);
        return this.gameRepository.save(game);
      }
    }

    if (game.getMode() === GameMod.USER) {
      game.switchPlayer();
    }

    return this.gameRepository.save(game);
  }
  private getBestMove(board: GameBoard): { row: number; col: number } | null {
    let bestScore = -Infinity;
    let bestMove: { row: number; col: number } | null = null;
    const size = board.getSize();

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board.isEmpty(i, j)) {
          const clonedBoard = board.clone();
          clonedBoard.setCell(i, j, this.COMPUTER);

          const score = this.minimax(clonedBoard, 0, false);

          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }

    return bestMove;
  }

  private minimax(
    board: GameBoard,
    depth: number,
    isMaximizing: boolean,
  ): number {
    const winner = this.checkWinner(board);

    if (winner === this.COMPUTER) {
      return 10 - depth;
    }
    if (winner === this.PLAYER) {
      return depth - 10;
    }
    if (board.isFull()) {
      return 0;
    }

    const size = board.getSize();

    if (isMaximizing) {
      let bestScore = -Infinity;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board.isEmpty(i, j)) {
            const clonedBoard = board.clone();
            clonedBoard.setCell(i, j, this.COMPUTER);
            const score = this.minimax(clonedBoard, depth + 1, false);
            bestScore = Math.max(score, bestScore);
          }
        }
      }

      return bestScore;
    } else {
      let bestScore = Infinity;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board.isEmpty(i, j)) {
            const clonedBoard = board.clone();
            clonedBoard.setCell(i, j, this.PLAYER);
            const score = this.minimax(clonedBoard, depth + 1, true);
            bestScore = Math.min(score, bestScore);
          }
        }
      }

      return bestScore;
    }
  }

  async createNewGame(game: Game): Promise<Game> {
    return this.gameRepository.save(game);
  }

  async joinGame(userId: string, gameId: string): Promise<Game> {
    const iGame = await this.gameRepository.findById(gameId);

    if (!iGame) {
      throw new GameNotFoundError(gameId);
    }

    if (iGame.playerIdO) {
      throw new GameAlreadyStartedError(gameId);
    }

    iGame.playerIdO = userId;

    const game = await this.toDomain(iGame, gameId);

    game.setStatus(GameStatus.IN_PROGRESS);

    return this.gameRepository.save(game);
  }

  private async toDomain(iGame: IGame, gameId: string): Promise<Game> {
    if (!iGame.playerIdX) {
      throw new GameMissingPlayerXError(gameId);
    }

    const playerX = await this.userService.getUserById(iGame.playerIdX);
    if (!playerX) {
      throw new GamePlayerNotFoundError(iGame.playerIdX);
    }

    const domain = new Game(playerX, iGame.mode, iGame.board, iGame.gameId);
    domain.setCurrentPlayer(iGame.currentPlayer.id, iGame.currentPlayer.role);

    if (iGame.mode === GameMod.USER) {
      if (!iGame.playerIdO) {
        throw new GameMissingPlayerOError(gameId);
      }
      const playerO = await this.userService.getUserById(iGame.playerIdO);
      if (!playerO) {
        throw new GamePlayerNotFoundError(iGame.playerIdO);
      }
      domain.setPlayerO(playerO);
    }

    return domain;
  }
  validateGameBoard(
    newBoard: number[][],
    oldBoard: number[][],
    role: 1 | 2,
  ): boolean {
    const size = 3;
    let differenceCount = 0;
    let moveRow = -1;
    let moveCol = -1;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newBoard[i][j] !== oldBoard[i][j]) {
          differenceCount++;
          moveRow = i;
          moveCol = j;
        }
      }
    }

    if (differenceCount !== 1) return false;
    if (oldBoard[moveRow][moveCol] !== this.EMPTY) return false;

    return newBoard[moveRow][moveCol] === role;
  }

  private checkWinner(board: GameBoard): number | null {
    const size = board.getSize();
    const b = board.getBoard();

    for (let i = 0; i < size; i++) {
      if (
        b[i][0] !== this.EMPTY &&
        b[i][0] === b[i][1] &&
        b[i][1] === b[i][2]
      ) {
        return b[i][0];
      }
    }

    for (let j = 0; j < size; j++) {
      if (
        b[0][j] !== this.EMPTY &&
        b[0][j] === b[1][j] &&
        b[1][j] === b[2][j]
      ) {
        return b[0][j];
      }
    }

    if (b[0][0] !== this.EMPTY && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
      return b[0][0];
    }

    if (b[0][2] !== this.EMPTY && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
      return b[0][2];
    }

    return null;
  }
}
