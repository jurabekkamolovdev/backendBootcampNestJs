import {
  Body,
  Controller,
  Inject,
  Post,
  Param,
  UseGuards,
  Request,
  Get,
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
      req.user.uuid,
      dto.opponent,
      dto.board,
    );

    return resultDomain;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gameUuid/move')
  async makeMove(
    @Request() req: { user: JwtPayload },
    @Param('gameUuid') gameUuid: string,
    @Body() dto: MoveGameRequestDto,
  ) {
    const resultDomain: MakeMoveResult = await this.gameService.makeMove(
      gameUuid,
      req.user.uuid,
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

  @UseGuards(JwtAuthGuard)
  @Get()
  getAvailableGames(@Request() req: { user: JwtPayload }) {
    console.log(req.user);

    return this.gameService.getAvailableGames();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':gameUuid')
  async getGameById(
    @Request() req: { user: JwtPayload },
    @Param('gameUuid') gameUuid: string,
  ) {
    return await this.gameService.getGameById(gameUuid);
  }
}
