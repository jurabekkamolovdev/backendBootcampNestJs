import {
  Controller,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { IGameService } from '../../domain/service/game.service.interface';
import { GameMoveRequestDto } from '../model/request/game-move.request.dto';
import { GameResponseDto } from '../model/response/game.response.dto';
import { GameWebMapper } from '../mapper/game-web.mapper';
import { Game } from '../../domain/model/game.model';
import { GameBoard } from '../../domain/model/game-board.model';

/**
 * Game Controller
 * Handles HTTP requests for Tic-Tac-Toe game
 *
 * POST /game/:uuid - Foydalanuvchi yurishi va kompyuter javobi
 */
@Controller('game')
export class GameController {
  constructor(
    @Inject('IGameService')
    private readonly gameService: IGameService,
    private readonly gameWebMapper: GameWebMapper,
  ) {}

  /**
   * POST /game/:uuid
   *
   * Foydalanuvchidan yangilangan taxtani qabul qiladi,
   * validatsiya qiladi, kompyuter yuradi, javob qaytaradi
   *
   * @param uuid - O'yin UUID
   * @param gameMoveDto - Foydalanuvchi yuborgan taxta
   * @returns Kompyuter yurgandan keyingi holat
   */
  @Post(':uuid')
  async makeMove(
    @Param('uuid') uuid: string,
    @Body() gameMoveDto: GameMoveRequestDto,
  ): Promise<GameResponseDto> {
    try {
      // 1. Request DTO ni Domain modelga o'zgartirish
      const newGame = this.gameWebMapper.requestToDomain(uuid, gameMoveDto);

      // 2. Oldingi o'yin holatini olish
      const previousGame = await this.gameService.getGameById(uuid);

      // 3. Agar o'yin topilmasa, yangi o'yin yaratish
      if (!previousGame) {
        return await this.handleNewGame(newGame);
      }

      // 4. Foydalanuvchi yurishini validatsiya qilish
      const isValid = this.gameService.validateGameBoard(newGame, previousGame);

      if (!isValid) {
        throw new HttpException(
          'Invalid move detected. The board state has been tampered with.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 5. Kompyuter yurishini hisoblash (Minimax)
      const gameAfterComputerMove =
        await this.gameService.calculateNextMove(newGame);

      // 6. Response DTO ga o'zgartirish va qaytarish
      return this.gameWebMapper.domainToResponse(gameAfterComputerMove);
    } catch (error) {
      // Agar HttpException bo'lsa, o'sha xatoni qaytarish
      if (error instanceof HttpException) {
        throw error;
      }

      // Boshqa xatolar uchun
      throw new HttpException(
        'An error occurred while processing your move',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Yangi o'yinni boshqarish
   */
  private async handleNewGame(game: Game): Promise<GameResponseDto> {
    const emptyBoard = new GameBoard();
    const emptyGame = new Game(game.getId(), emptyBoard);

    // Foydalanuvchi yurishini validatsiya qilish
    const isValid = this.gameService.validateGameBoard(game, emptyGame);

    if (!isValid) {
      throw new HttpException(
        'Invalid first move detected',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Kompyuter yurishi
    const gameAfterComputerMove =
      await this.gameService.calculateNextMove(game);

    return this.gameWebMapper.domainToResponse(gameAfterComputerMove);
  }
}
