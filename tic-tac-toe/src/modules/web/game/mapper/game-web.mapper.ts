import { Injectable } from '@nestjs/common';
import { GameRequest } from '../model/request/game-move.request.dto';
import {
  GameResponseDto,
  GameListItemResponseDto,
} from '../model/response/game.response.dto';
import { GameBoard } from '../../../domain/game/model/game-board.model';
import { Game, IGame } from '../../../domain/game/model/game.model';
import { User } from '../../../domain/user/model/user.model';

@Injectable()
export class GameWebMapper {
  requestToDomain(user: User, dto: GameRequest) {
    const gameBoard = new GameBoard(dto.board);
    return new Game(user, dto.mode, gameBoard);
  }

  domainToResponse(game: Game) {
    return new GameResponseDto(
      game.getId(),
      game.getBoard().getBoard(),
      game.getPlayerX()?.getId() ?? null,
      game.getPlayerO()?.getId() ?? null,
      game.getCurrentPlayerId(),
    );
  }

  requestToGameBoard(dto: GameRequest) {
    return new GameBoard(dto.board);
  }

  iGameToListItemResponse(games: IGame[]): GameListItemResponseDto[] {
    return games.map(
      (game) =>
        new GameListItemResponseDto(
          game.gameId,
          game.playerIdX,
          game.status,
          game.mode,
        ),
    );
  }
}
