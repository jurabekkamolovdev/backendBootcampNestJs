import { Injectable } from '@nestjs/common';
import { Game } from '../../domain/model/game.model';
import { GameBoard } from '../../domain/model/game-board.model';
import { GameEntity } from '../model/game.entity';
import { GameBoardEntity } from '../model/game-board.entity';

@Injectable()
export class GameDataMapper {
  toEntity(domainGame: Game): GameEntity {
    const boardEntity = new GameBoardEntity(
      domainGame.getBoard().getBoard(),
      domainGame.getBoard().getSize(),
    );

    return new GameEntity(domainGame.getId(), boardEntity);
  }

  toDomain(entity: GameEntity): Game {
    const domainBoard = new GameBoard(entity.board.cells);

    return new Game(entity.id, domainBoard);
  }
}
