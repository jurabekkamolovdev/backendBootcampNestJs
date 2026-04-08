import { Injectable, Inject } from '@nestjs/common';
import { IGameService } from './game.service.interface';
import { Opponent, Player, Game, GameState } from '../model/game.model';
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

  // ─── CREATE ──────────────────────────────────────────────────────────────────

  createGame(
    playerUuid: string,
    opponent: Opponent,
    board: number[][],
  ): CreateGameResult {
    if (this.gameRepositoryMap.isPlayerInGame(playerUuid)) {
      throw new Error(`Siz allaqachon o'yindasiz`);
    }

    const gameBoard = new GameBoard(board, 0);
    const game = new Game(gameBoard, opponent);
    const playerState = this.getRandomState();

    if (opponent === 'computer') {
      return this.createGameVsComputer(game, playerUuid, playerState);
    } else {
      return this.createGameVsPlayer(game, playerUuid, playerState);
    }
  }

  // --- vs Computer ---

  private createGameVsComputer(
    game: Game,
    playerUuid: string,
    playerState: 1 | 2,
  ): CreateGameResult {
    const player: Player = { uuid: playerUuid, state: playerState };

    if (playerState === 1) {
      game.setPlayerX(player);
      game.setPlayerO({ uuid: 'computer', state: 2 });
    } else {
      game.setPlayerO(player);
      game.setPlayerX({ uuid: 'computer', state: 1 });
    }

    game.startGame();

    // Kompyuter birinchi bo'lib o'ynasa, minimax bilan eng yaxshi harakat qiladi
    if (playerState === 2) {
      const bestMove = game.getBestMove();
      if (bestMove) {
        game.setNewCell(bestMove);
        game.switchPlayer();
      }
    }

    this.gameRepositoryMap.save(game, playerUuid);

    return this.buildCreateResult(game, playerState);
  }

  // --- vs Player ---

  private createGameVsPlayer(
    game: Game,
    playerUuid: string,
    playerState: 1 | 2,
  ): CreateGameResult {
    const player: Player = { uuid: playerUuid, state: playerState };

    // Faqat creator qo'shiladi; ikkinchi o'yin joy joinGame orqali to'ldiriladi
    if (playerState === 1) {
      game.setPlayerX(player);
    } else {
      game.setPlayerO(player);
    }

    this.gameRepositoryMap.save(game, playerUuid);

    return this.buildCreateResult(game, playerState);
  }

  // ─── JOIN ────────────────────────────────────────────────────────────────────

  joinGame(gameUuid: string, playerUuid: string): CreateGameResult {
    if (this.gameRepositoryMap.isPlayerInGame(playerUuid)) {
      throw new Error(`Siz allaqachon o'yindasiz`);
    }

    const game: Game | null = this.gameRepositoryMap.findById(gameUuid);

    if (!game) {
      throw new Error(`O'yin topilmadi: ${gameUuid}`);
    }

    if (game.getOpponent() === 'computer') {
      throw new Error(`Bu o'yinga qo'shila olmaysiz`);
    }

    // Qaysi joy bo'sh bo'lsa, o'sha joyga qo'shamiz
    const playerState: 1 | 2 = this.resolveJoinSlot(game);
    const player: Player = { uuid: playerUuid, state: playerState };

    if (playerState === 1) {
      game.setPlayerX(player);
    } else {
      game.setPlayerO(player);
    }

    // Ikkala o'yinchi to'ldi — o'yinni boshlaymiz
    game.startGame();

    // Set ham yangilanadi (delete da tozalanishi uchun)
    this.gameRepositoryMap.saveSecondPlayer(game, playerUuid);

    return this.buildCreateResult(game, playerState);
  }

  private resolveJoinSlot(game: Game): 1 | 2 {
    const hasX = !!game.getPlayerX();
    const hasO = !!game.getPlayerO();

    if (!hasX && !hasO) throw new Error(`O'yin yaroqsiz holda`);
    if (hasX && hasO) throw new Error(`O'yin to'lgan`);

    return hasX ? 2 : 1;
  }

  // ─── MOVE ────────────────────────────────────────────────────────────────────

  async makeMove(
    gameUuid: string,
    playerUuid: string,
    newBoard: number[][],
  ): Promise<MakeMoveResult> {
    const game: Game | null = this.gameRepositoryMap.findById(gameUuid);

    if (!game) {
      throw new Error(`O'yin topilmadi: ${gameUuid}`);
    }

    // O'yin holati tekshiruvi
    this.assertGameIsActive(game, playerUuid);

    const newGameBoard = new GameBoard(newBoard);
    const move = game.validateGameBoard(newGameBoard);

    if (!move) {
      throw new Error(`Noto'g'ri harakat`);
    }

    // O'yinchi o'z qiymatini kiritayaptimi?
    this.assertCorrectValue(game, playerUuid, move.newCell);

    game.setNewCell(move);

    // O'yinchi harakatidan keyin o'yin tugadimi?
    if (game.checkGameOver()) {
      return await this.finishGame(game, move.newCell as 1 | 2);
    }

    // Kompyuter harakati
    if (game.getOpponent() === 'computer') {
      const bestMove = game.getBestMove();
      if (bestMove) {
        game.setNewCell(bestMove);
        if (game.checkGameOver()) {
          return await this.finishGame(game, move.newCell as 1 | 2);
        }
      }
    }

    // Navbatni almashtir
    game.switchPlayer();
    this.gameRepositoryMap.update(game);

    return this.buildMoveResult(game, move.newCell as 1 | 2);
  }

  // ─── YORDAMCHI METODLAR ───────────────────────────────────────────────────────

  private assertGameIsActive(game: Game, playerUuid: string): void {
    const state: GameState = game.getGameState();

    if (state.status === 'wait') {
      throw new Error(`O'yin hali boshlanmagan`);
    }

    if (state.status === 'win' || state.status === 'draw') {
      throw new Error(`O'yin allaqachon tugagan`);
    }

    if (state.status === 'game') {
      if (state.currentPlayer?.uuid !== playerUuid) {
        throw new Error(`Sizning navbatingiz emas`);
      }
    }
  }

  private assertCorrectValue(
    game: Game,
    playerUuid: string,
    cellValue: number,
  ): void {
    const playerX = game.getPlayerX();
    const playerO = game.getPlayerO();

    if (playerX?.uuid === playerUuid && cellValue !== 1) {
      throw new Error(`Siz faqat 1 (X) qiymati kirita olasiz`);
    }

    if (playerO?.uuid === playerUuid && cellValue !== 2) {
      throw new Error(`Siz faqat 2 (O) qiymati kirita olasiz`);
    }
  }

  private async finishGame(
    game: Game,
    playerState: 1 | 2,
  ): Promise<MakeMoveResult> {
    await this.gameRepository.save(game);
    this.gameRepositoryMap.delete(game);
    return this.buildMoveResult(game, playerState);
  }

  private buildCreateResult(game: Game, playerState: 1 | 2): CreateGameResult {
    return {
      gameUuid: game.getGameUuid(),
      playerState,
      gameState: game.getGameState(),
      board: game.getBoard(),
    };
  }

  private buildMoveResult(game: Game, playerState: 1 | 2): MakeMoveResult {
    return {
      gameUuid: game.getGameUuid(),
      playerState,
      gameState: game.getGameState(),
      board: game.getBoard(),
    };
  }

  private getRandomState(): 1 | 2 {
    return Math.random() < 0.5 ? 1 : 2;
  }
}
