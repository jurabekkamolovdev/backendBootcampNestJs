import { Injectable } from '@nestjs/common';
import {
  Game,
  // GameMod,
  // GameStatus,
} from '../../../domain/game/model/game.model';
// import { GameBoard } from '../../../domain/game/model/game-board.model';
import { GameModel } from '../model/game.entity';

@Injectable()
export class GameDataMapper {
  toEntity(domainGame: Game): GameModel {
    return GameModel.build({
      uuid: domainGame.getId(),
      board: {
        cells: domainGame.getBoard().getBoard(),
        size: domainGame.getBoard().getSize(),
      },
      playerIdX: domainGame.getPlayerX()?.getId() ?? null,
      playerId0: domainGame.getPlayer0()?.getId() ?? null,
      status: domainGame.getStatus(),
      currentPlayerId: domainGame.getCurrentPlayer()?.getId() ?? null,
      winnerUserId: domainGame.getWinnerUser()?.getId() ?? null,
      mode: domainGame.getMode(),
    });
  }

  // toDomain(entity: GameModel): Game {
  //   const domainBoard = new GameBoard(entity.board.cells);
  //
  //   const game = new Game(entity.uuid, domainBoard);
  //   game.setStatusRaw(entity.status as GameStatus);
  //   game.setModeRaw(entity.mode as GameMod);
  //   game.setPlayerXId(entity.playerIdX);
  //   game.setPlayer0Id(entity.playerId0);
  //   game.setCurrentPlayerId(entity.currentPlayerId);
  //   game.setWinnerUserId(entity.winnerUserId);
  //
  //   return game;
  // }
}
