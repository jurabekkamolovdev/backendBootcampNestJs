import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameEntity } from '../model/game.entity';
import { IGameEntity } from '../model/interface/game.entity.interface';
import { GameDataMapper } from '../mapper/game-data.mapper';
import { Game } from 'src/modules/domain/game/model/game.model';
import { IGameRepository } from './game.repository.interface';

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

    const entity: IGameEntity = {
      uuid: dbModel.uuid,
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
}
