import { Body, Controller, Inject, Post, Param } from '@nestjs/common';
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

@Controller('game')
export class GameController {
  constructor(
    @Inject(GAME_SERVICE)
    private readonly gameService: IGameService,
  ) {}

  @Post()
  async createNewGame(
    @Body() dto: CreateGameRequestDto,
  ): Promise<CreateGameResult> {
    const resultDomain: CreateGameResult = await this.gameService.createGame(
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
}
