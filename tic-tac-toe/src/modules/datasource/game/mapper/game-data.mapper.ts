import { Injectable } from '@nestjs/common';
import { Game } from '../../../domain/game/model/game.model';
import { GameBoard } from '../../../domain/game/model/game-board.model';
import { GameModel } from '../model/game.entity';

@Injectable()
export class GameDataMapper {
  // toEntity(domainGame: Game): GameModel {
  //   const boardEntity = new GameBoardEntity(
  //     domainGame.getBoard().getBoard(),
  //     domainGame.getBoard().getSize(),
  //   );
  //
  //   // @ts-ignore
  //   return new GameModel(domainGame.getId(), boardEntity);
  // }

  toEntity(domainGame: Game): GameModel {
    return GameModel.build({
      uuid: domainGame.getId(),
      board: {
        cells: domainGame.getBoard().getBoard(),
        size: domainGame.getBoard().getSize(),
      },
    });
  }

  toDomain(entity: GameModel): Game {
    const domainBoard = new GameBoard(entity.board.cells);

    return new Game(entity.uuid, domainBoard);
  }
}
