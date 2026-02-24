import {
  Body,
  Controller,
  Inject,
  // Param,
  Post,
  // HttpStatus,
  UseGuards,
  // HttpException,
  Request,
  Param,
} from '@nestjs/common';
import { GameWebMapper } from '../mapper/game-web.mapper';
import type { IGameService } from '../../../domain/game/service/game.service.interface';
import {
  // GameMoveRequest,
  GameRequest,
} from '../model/request/game-move.request.dto';
// import { GameResponseDto } from '../model/response/game.response.dto';
// import { Game } from '../../../domain/game/model/game.model';
// import { GameBoard } from '../../../domain/game/model/game-board.model';
import { JwtAuthGuard } from '../../../domain/user/guard/jwt-auth.guard';
import type { IUserService } from '../../../domain/user/service/user.service.interface';
import { GameResponseDto } from '../model/response/game.response.dto';

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
}
