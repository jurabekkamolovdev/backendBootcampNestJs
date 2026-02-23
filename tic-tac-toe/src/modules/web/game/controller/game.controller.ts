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

  // @Post(':uuid')
  // async makeMove(
  //   @Param('uuid') uuid: string,
  //   @Body() gameMoveDto: GameMoveRequest,
  // ): Promise<GameResponseDto> {
  //   try {
  //     const newGame = this.gameWebMapper.requestToDomain(uuid, gameMoveDto);
  //
  //     const previousGame = await this.gameService.getGameById(uuid);
  //
  //     if (!previousGame) {
  //       return await this.handleNewGame(newGame);
  //     }
  //
  //     const isValid = this.gameService.validateGameBoard(newGame, previousGame);
  //
  //     if (!isValid) {
  //       throw new Error('Invalid game id');
  //     }
  //
  //     const gameAfterComputerMove =
  //       await this.gameService.calculateNextMove(newGame);
  //     return this.gameWebMapper.domainToResponse(gameAfterComputerMove);
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //
  //     throw new HttpException(
  //       'An error occurred while processing your move',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  //
  // async handleNewGame(game: Game): Promise<GameResponseDto> {
  //   const emptyBoard = new GameBoard();
  //   const emptyGame = new Game(game.getId(), emptyBoard);
  //
  //   const isValid = this.gameService.validateGameBoard(game, emptyGame);
  //
  //   if (!isValid) {
  //     throw new Error('Invalid game');
  //   }
  //
  //   const gameAfterComputerMove =
  //     await this.gameService.calculateNextMove(game);
  //
  //   return this.gameWebMapper.domainToResponse(gameAfterComputerMove);
  // }

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
    console.log(12);
    const game = await this.gameService.joinGame(req.user.id, gameId);

    if (!game) {
      return null;
    }

    console.log(game);
    return this.gameWebMapper.domainToResponse(game);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post(':gameId')
  // async makeMove(
  //   @Request() req: { user: { id: string } },
  //   @Param('gameId') gameId: string,
  //   @Body() gameDto: GameRequest,
  // ) {
  //   const game = await this.gameService.getGameById(gameId);
  //   console.log(gameDto);
  //   if (!game) {
  //     return null;
  //   }
  //
  //   if (game.getCurrentPlayer() !== req.user.id) {
  //     return null;
  //   }
  //
  //   return 'Hello';
  // }
}
