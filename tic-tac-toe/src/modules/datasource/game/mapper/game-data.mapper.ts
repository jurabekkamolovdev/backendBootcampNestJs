import { Injectable } from '@nestjs/common';
import {
  Game,
  GameMod,
  GameStatus,
  IGame,
  // GameMod,
  // GameStatus,
} from '../../../domain/game/model/game.model';
import { GameBoard } from '../../../domain/game/model/game-board.model';
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

  toDomain(entity: GameModel): IGame {
    const gameBoard = new GameBoard(entity.board.cells);
    return {
      gameId: entity.uuid,
      board: gameBoard,
      playerX: entity.playerIdX,
      player0: null,
      status: entity.status as GameStatus,
      currentPlayer: entity.currentPlayerId,
      winnerUser: entity.winnerUserId,
      mode: entity.mode as GameMod,
    };
  }
}
