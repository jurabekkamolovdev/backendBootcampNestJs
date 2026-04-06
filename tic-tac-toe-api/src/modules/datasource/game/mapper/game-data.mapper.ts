import { Injectable } from '@nestjs/common';
import { Game } from 'src/modules/domain/game/model/game.model';
import { IGameEntity } from '../model/interface/game.entity.interface';
import { GameBoard } from 'src/modules/domain/game/model/game-board.model';

@Injectable()
export class GameDataMapper {
  toEntity(domainGame: Game): IGameEntity {
    return {
      uuid: domainGame.getGameUuid(),
      board: {
        cells: domainGame.getBoard(),
        size: 3,
      },
      opponent: domainGame.getOpponent(),
      state: domainGame.getGameState(),
      playerX: domainGame.getPlayerX(),
      playerO: domainGame.getPlayerO(),
    };
  }

  toDomain(entity: IGameEntity): Game {
    const gameBoard = new GameBoard(entity.board.cells);

    const game: Game = new Game(gameBoard, entity.opponent, entity.uuid);

    game.setState(entity.state);
    game.setPlayerX(entity.playerX!);
    game.setPlayerO(entity.playerO!);

    return game;
  }
}
