import { Injectable } from '@nestjs/common';
import { GameMoveRequest } from '../model/request/game-move.request.dto';
import { GameResponseDto } from '../model/response/game.response.dto';
import { GameBoard } from '../../../domain/game/model/game-board.model';
import { Game } from '../../../domain/game/model/game.model';

@Injectable()
export class GameWebMapper {
  requestToDomain(uuid: string, dto: GameMoveRequest) {
    const board = dto.board;

    const gameBoard = new GameBoard(board);

    return new Game(uuid, gameBoard);
  }

  domainToResponse(game: Game) {
    return new GameResponseDto(game.getId(), game.getBoard().getBoard());
  }
}
