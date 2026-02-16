import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GameWebMapper } from '../mapper/game-web.mapper';
import type { IGameService } from '../../domain/service/game.service.interface';
import { GameMoveRequest } from '../model/request/game-move.request.dto';
import { GameResponseDto } from '../model/response/game.response.dto';
import { Game } from '../../domain/model/game.model';
import { GameBoard } from '../../domain/model/game-board.model';

@Controller('game')
export class GameController {
  constructor(
    @Inject('IGameService')
    private gameService: IGameService,
    private gameWebMapper: GameWebMapper,
  ) {}

  @Post(':uuid')
  async makeMove(
    @Param('uuid') uuid: string,
    @Body() gameMoveDto: GameMoveRequest,
  ): Promise<GameResponseDto> {
    try {
      const newGame = this.gameWebMapper.requestToDomain(uuid, gameMoveDto);

      const previousGame = await this.gameService.getGameById(uuid);

      if (!previousGame) {
        return await this.handleNewGame(newGame);
      }

      const isValid = this.gameService.validateGameBoard(newGame, previousGame);

      if (!isValid) {
        throw new Error('Invalid game id');
      }

      const gameAfterComputerMove =
        await this.gameService.calculateNextMove(newGame);
      return this.gameWebMapper.domainToResponse(gameAfterComputerMove);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while processing your move',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleNewGame(game: Game): Promise<GameResponseDto> {
    const emptyBoard = new GameBoard();
    const emptyGame = new Game(game.getId(), emptyBoard);

    const isValid = this.gameService.validateGameBoard(game, emptyGame);

    if (!isValid) {
      throw new Error('Invalid game');
    }

    const gameAfterComputerMove =
      await this.gameService.calculateNextMove(game);

    return this.gameWebMapper.domainToResponse(gameAfterComputerMove);
  }
}
