import { Injectable } from '@nestjs/common';
import { Game } from '../../domain/model/game.model';
import { GameBoard } from '../../domain/model/game-board.model';
import { GameEntity } from '../model/game.entity';
import { GameBoardEntity } from '../model/game-board.entity';

/**
 * Game Data Mapper
 * Converts between Domain models and Datasource models
 *
 * Domain <-> Datasource o'zgartirgich
 */
@Injectable()
export class GameDataMapper {
  /**
   * Domain modelni Entity ga o'zgartirish
   * Game (Domain) → GameEntity (Datasource)
   *
   * @param domainGame - Domain qatlamidagi o'yin
   * @returns Datasource qatlamidagi entity
   */
  toEntity(domainGame: Game): GameEntity {
    // GameBoard ni GameBoardEntity ga o'zgartirish
    const boardEntity = new GameBoardEntity(
      domainGame.getBoard().getBoard(), // number[][]
      domainGame.getBoard().getSize(), // 3
    );

    // Game ni GameEntity ga o'zgartirish
    const gameEntity = new GameEntity(domainGame.getId(), boardEntity);

    return gameEntity;
  }

  /**
   * Entity ni Domain modelga o'zgartirish
   * GameEntity (Datasource) → Game (Domain)
   *
   * @param entity - Datasource qatlamidagi entity
   * @returns Domain qatlamidagi o'yin
   */
  toDomain(entity: GameEntity): Game {
    // GameBoardEntity ni GameBoard ga o'zgartirish
    const domainBoard = new GameBoard(entity.board.cells);

    // GameEntity ni Game ga o'zgartirish
    const domainGame = new Game(entity.id, domainBoard);

    return domainGame;
  }

  /**
   * Entity array ni Domain array ga o'zgartirish
   * GameEntity[] → Game[]
   *
   * @param entities - Entity'lar ro'yxati
   * @returns Domain modellar ro'yxati
   */
  toDomainArray(entities: GameEntity[]): Game[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  /**
   * Domain array ni Entity array ga o'zgartirish
   * Game[] → GameEntity[]
   *
   * @param domainGames - Domain modellar ro'yxati
   * @returns Entity'lar ro'yxati
   */
  toEntityArray(domainGames: Game[]): GameEntity[] {
    return domainGames.map((game) => this.toEntity(game));
  }
}
