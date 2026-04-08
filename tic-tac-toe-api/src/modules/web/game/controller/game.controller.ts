import {
  Body,
  Controller,
  Inject,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  type IGameService,
  GAME_SERVICE,
} from 'src/modules/domain/game/service/game.service.interface';
import { CreateGameRequestDto } from '../model/request/game-create.request';
import { MoveGameRequestDto } from '../model/request/game-move.request';
import {
  type CreateGameResult,
  type MakeMoveResult,
} from 'src/modules/domain/game/model/game-result';
import { JwtAuthGuard } from 'src/modules/infrastructure/jwt/jwt-auth.guard';
import { JwtPayload } from 'src/modules/infrastructure/jwt/jwt.strategy';

@Controller('game')
export class GameController {
  constructor(
    @Inject(GAME_SERVICE)
    private readonly gameService: IGameService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createNewGame(
    @Request() req: { user: JwtPayload },
    @Body() dto: CreateGameRequestDto,
  ): CreateGameResult {
    const resultDomain: CreateGameResult = this.gameService.createGame(
      dto.playerUuid,
      dto.opponent,
      dto.board,
    );

    return resultDomain;
  }

  @Post(':gameUuid/:playerUuid/move')
  async makeMove(
    @Param('gameUuid') gameUuid: string,
    @Param('playerUuid') playerUuid: string,
    @Body() dto: MoveGameRequestDto,
  ) {
    const resultDomain: MakeMoveResult = await this.gameService.makeMove(
      gameUuid,
      playerUuid,
      dto.newBoard,
    );

    return resultDomain;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gameUuid/join')
  joinGame(
    @Request() req: { user: JwtPayload },
    @Param('gameUuid') gameUuid: string,
  ) {
    return this.gameService.joinGame(gameUuid, req.user.uuid);
  }
}
