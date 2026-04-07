import { Injectable, Inject } from '@nestjs/common';
import { IGameService } from './game.service.interface';
import { Opponent, Player, Game } from '../model/game.model';
import { GameBoard } from '../model/game-board.model';
import {
  type IGameRepository,
  GAMES_REPOSITORY,
} from 'src/modules/datasource/game/repository/game.repository.interface';
import {
  type IUserService,
  USER_SERVICE,
} from '../../user/service/user.service.interface';
import { CreateGameResult, MakeMoveResult } from '../model/game-result';
import {
  type IGameRepositoryMap,
  GAMES_REPOSITORY_MAP,
} from 'src/modules/datasource/game/repository/Map/game-map.repository.interface';

@Injectable()
export class GameServiceImpl implements IGameService {
  constructor(
    @Inject(GAMES_REPOSITORY)
    private readonly gameRepository: IGameRepository,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(GAMES_REPOSITORY_MAP)
    private readonly gameRepositoryMap: IGameRepositoryMap,
  ) {}

  createGame(
    playerUuid: string,
    opponent: Opponent,
    board: number[][],
  ): CreateGameResult {
    const isInGame = this.gameRepositoryMap.isPlayerInGame(playerUuid);

    if (isInGame) {
      throw new Error(`Siz allaqchon o'yindasiz!!!`);
    }
    const gameBoard = new GameBoard(board, 0);
    const game = new Game(gameBoard, opponent);

    const player: Player = {
      uuid: playerUuid,
      state: this.getRandomState(),
    };

    if (player.state === 1) {
      game.setPlayerX(player);
      if (opponent === 'computer') {
        game.setPlayerO({ uuid: 'computer', state: 2 });
      }
    } else {
      game.setPlayerO(player);
      game.setPlayerX({ uuid: 'computer', state: 1 });
    }

    game.startGame();

    if (opponent === 'computer' && player.state !== 1) {
      const row = this.getRandom(0, 2);
      const col = this.getRandom(0, 2);
      game.takeTurn(row, col, 1);
    }

    this.gameRepositoryMap.save(game, playerUuid);

    return {
      gameUuid: game.getGameUuid(),
      playerState: player.state,
      gameState: game.getGameState(),
      board: game.getBoard(),
    };
  }

  async makeMove(
    gameUuid: string,
    playerUuid: string,
    newBoard: number[][],
  ): Promise<MakeMoveResult> {
    const newGameBoard: GameBoard = new GameBoard(newBoard);

    const game: Game | null = this.gameRepositoryMap.findById(gameUuid);

    if (!game) {
      throw new Error(`Bunday o'yin mavjud emas: ${gameUuid}`);
    }

    const move = game.validateGameBoard(newGameBoard);

    if (!move) {
      throw new Error('Bir xil emas!');
    }

    game.setNewCell(move);

    if (game.checkGameOver()) {
      await this.gameRepository.save(game);
      this.gameRepositoryMap.delete(game);
      return {
        gameUuid: game.getGameUuid(),
        playerState: move.newCell as 1 | 2,
        gameState: game.getGameState(),
        board: game.getBoard(),
      };
    }

    if (game.getOpponent() === 'computer') {
      const bestMove = game.getBestMove();
      if (bestMove) {
        game.setNewCell(bestMove);
        game.checkGameOver();
      }
    }

    this.gameRepositoryMap.update(game);

    return {
      gameUuid: game.getGameUuid(),
      playerState: move.newCell as 1 | 2,
      gameState: game.getGameState(),
      board: game.getBoard(),
    };
  }

  private getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomState(): 1 | 2 {
    return Math.random() < 0.5 ? 1 : 2;
  }
}
