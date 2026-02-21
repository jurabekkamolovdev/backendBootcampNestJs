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
} from '@nestjs/common';
import { GameWebMapper } from '../mapper/game-web.mapper';
import type { IGameService } from '../../../domain/game/service/game.service.interface';
import {
  // GameMoveRequest,
  GameRequest,
} from '../model/request/game-move.request.dto';
// import { GameResponseDto } from '../model/response/game.response.dto';
import { Game } from '../../../domain/game/model/game.model';
// import { GameBoard } from '../../../domain/game/model/game-board.model';
import { JwtAuthGuard } from '../../../domain/user/guard/jwt-auth.guard';
import type { IUserService } from '../../../domain/user/service/user.service.interface';

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
    @Request() req: { user: { userId: string } },
    @Body() gameDto: GameRequest,
  ): Promise<Game | null> {
    console.log(req.user.userId);
    const user = await this.userService.getUserById(req.user.userId);
    console.log(user);
    const newGame = this.gameWebMapper.requestToDomain(user, gameDto);

    return await this.gameService.saveGame(newGame);
  }
}
