import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
} from '@nestjs/common';
import { GameWebMapper } from '../mapper/game-web.mapper';
import type { IGameService } from '../../../domain/game/service/game.service.interface';
import { GameRequest } from '../model/request/game-move.request.dto';
import { JwtAuthGuard } from '../../../domain/user/guard/jwt-auth.guard';
import type { IUserService } from '../../../domain/user/service/user.service.interface';
import {
  GameListItemResponseDto,
  GameResponseDto,
} from '../model/response/game.response.dto';

@Controller('game')
export class GameController {
  constructor(
    @Inject('IGameService')
    private gameService: IGameService,
    @Inject('IUserService')
    private userService: IUserService,
    private gameWebMapper: GameWebMapper,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewGame(
    @Request() req: { user: { id: string } },
    @Body() gameDto: GameRequest,
  ): Promise<GameResponseDto | null> {
    const user = await this.userService.getUserById(req.user.id);
    if (!user) {
      return null;
    }
    const domainGame = this.gameWebMapper.requestToDomain(user, gameDto);
    const game = await this.gameService.createNewGame(domainGame);
    return this.gameWebMapper.domainToResponse(game);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gameId/join')
  async joinGame(
    @Request() req: { user: { id: string } },
    @Param('gameId') gameId: string,
  ): Promise<GameResponseDto | null> {
    const game = await this.gameService.joinGame(req.user.id, gameId);

    if (!game) {
      console.log(12);
      return null;
    }

    console.log(game);
    return this.gameWebMapper.domainToResponse(game);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':gameId')
  async makeMove(
    @Request() req: { user: { id: string } },
    @Param('gameId') gameId: string,
    @Body() gameDto: GameRequest,
  ) {
    const newGameBoard = this.gameWebMapper.requestToGameBoard(gameDto);

    const game = await this.gameService.makeMove(
      gameId,
      newGameBoard,
      req.user.id,
    );

    if (!game) {
      return null;
    }
    const response = this.gameWebMapper.domainToResponse(game);
    return response.getDataResponse();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const games = await this.gameService.findAll();

    return this.gameWebMapper.iGameToListItemResponse(games);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':gameId')
  async getGameById(@Param('gameId') gameId: string) {
    const game = await this.gameService.getGameById(gameId);
    if (!game) {
      return null;
    }
    return new GameListItemResponseDto(
      game.gameId,
      game?.playerIdX,
      game.status,
      game.mode,
    );
  }
}
