import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  GAME_SERVICE,
  type GameService,
} from '../../domain/service/game.service.interface';
import { toDto } from '../mapper/game.mapper';
import type { GameDto } from '../model/game.dto';
import {
  CreateGameRequestDto,
  MoveRequestDto,
} from '../model/game-requests.dto';
import type { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

@Controller()
export class GameController {
  constructor(
    @Inject(GAME_SERVICE) private readonly gameService: GameService,
  ) {}

  @Post('/games')
  async createGame(
    @Req() req: AuthRequest,
    @Body() body: CreateGameRequestDto,
  ): Promise<GameDto> {
    const userUuid = req.user?.userId as string;
    const opponent = body?.opponent ?? 'computer';
    const game = await this.gameService.createGame(userUuid, opponent);
    return toDto(game);
  }

  @Get('/games')
  async listGames(): Promise<GameDto[]> {
    const games = await this.gameService.listAvailableGames();
    return games.map(toDto);
  }

  @Post('/games/:uuid/join')
  async joinGame(
    @Req() req: AuthRequest,
    @Param('uuid') uuid: string,
  ): Promise<GameDto> {
    const userUuid = req.user?.userId as string;
    const game = await this.gameService.joinGame(uuid, userUuid);
    return toDto(game);
  }

  @Get('/games/:uuid')
  async getGame(@Param('uuid') uuid: string): Promise<GameDto> {
    const game = await this.gameService.getGame(uuid);
    return toDto(game);
  }

  @Post('/games/:uuid/move')
  async move(
    @Req() req: AuthRequest,
    @Param('uuid') uuid: string,
    @Body() body: MoveRequestDto,
  ): Promise<GameDto> {
    const userUuid = req.user?.userId as string;
    const game = await this.gameService.makeMove(
      uuid,
      userUuid,
      body.row,
      body.col,
    );
    return toDto(game);
  }

  // Backward-compatible aliases (previous week endpoint name)
  @Post('/game/:uuid/move')
  async moveLegacy(
    @Req() req: AuthRequest,
    @Param('uuid') uuid: string,
    @Body() body: MoveRequestDto,
  ): Promise<GameDto> {
    return this.move(req, uuid, body);
  }
}
