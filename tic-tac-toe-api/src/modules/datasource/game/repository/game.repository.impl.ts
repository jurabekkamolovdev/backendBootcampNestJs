import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameEntity } from '../model/game.entity';
import { IGameEntity } from '../model/interface/game.entity.interface';
import { GameDataMapper } from '../mapper/game-data.mapper';
import { Game } from 'src/modules/domain/game/model/game.model';
import { IGameRepository } from './game.repository.interface';
import { literal } from 'sequelize';

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(
    @InjectModel(GameEntity)
    private readonly games: typeof GameEntity,
    private readonly mapper: GameDataMapper,
  ) {}

  async save(domainGame: Game): Promise<boolean> {
    const entity: IGameEntity = this.mapper.toEntity(domainGame);
    await this.games.upsert({
      uuid: entity.uuid,
      board: entity.board,
      created_at: entity.created_at,
      opponent: entity.opponent,
      state: entity.state,
      playerX: entity.playerX,
      playerO: entity.playerO,
    });
    return true;
  }

  async findById(gameUuid: string): Promise<Game | null> {
    const dbModel = await this.games.findByPk(gameUuid);

    if (!dbModel) return null;

    console.log(dbModel);

    const entity: IGameEntity = {
      uuid: dbModel.uuid,
      created_at: dbModel.created_at,
      board: dbModel.board,
      opponent: dbModel.opponent,
      state: dbModel.state,
      playerX: dbModel.playerX,
      playerO: dbModel.playerO,
    };

    return this.mapper.toDomain(entity);
  }
  async update(domainGame: Game): Promise<boolean> {
    const entity: IGameEntity = this.mapper.toEntity(domainGame);

    const [affectedRows] = await this.games.update(
      {
        board: entity.board,
        opponent: entity.opponent,
        state: entity.state,
        playerX: entity.playerX,
        playerO: entity.playerO,
      },
      { where: { uuid: entity.uuid } },
    );

    return affectedRows > 0;
  }

  async getAllFinishGames(playerUuid: string): Promise<Array<Game> | null> {
    const games: Array<Game> = [];
    console.log(playerUuid);

    const entityGames: Array<GameEntity> = await this.games.findAll({
      where: literal(
        `(("playerX"->>'uuid' = '${playerUuid}') OR ("playerO"->>'uuid' = '${playerUuid}'))
        AND (("state"->>'status' = 'draw') OR ("state"->'winnerPlayer'->>'uuid' = '${playerUuid}'))
        `,
      ),
    });

    console.log(entityGames);

    if (entityGames.length === 0) {
      return null;
    }

    for (const entityGame of entityGames) {
      const game = this.mapper.toDomain(entityGame);

      games.push(game);
    }
    return games;
  }
}
