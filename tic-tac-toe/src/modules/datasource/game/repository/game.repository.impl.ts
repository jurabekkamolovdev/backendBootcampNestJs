import { Injectable } from '@nestjs/common';
import { IGameRepository } from './game.repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import { GameModel } from '../model/game.entity';
import {
  Game,
  IGame,
  GameStatus,
  GameMod,
} from '../../../domain/game/model/game.model';
import { GameDataMapper } from '../mapper/game-data.mapper';

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(
    @InjectModel(GameModel)
    private readonly gameModel: typeof GameModel,
    private readonly gameDataMapper: GameDataMapper,
  ) {}

  async save(game: Game): Promise<Game> {
    const entity = this.gameDataMapper.toEntity(game);
    await this.gameModel.upsert(entity.get());

    return game;
  }
  async findById(id: string): Promise<IGame | null> {
    const entity = await this.gameModel.findByPk(id);

    if (!entity) {
      return null;
    }

    return this.gameDataMapper.toDomain(entity);
  }

  async findAll(): Promise<IGame[]> {
    const entities = await this.gameModel.findAll({
      where: { status: GameStatus.WAITING, mode: GameMod.USER },
    });

    return entities.map((entity) => this.gameDataMapper.toDomain(entity));
  }
}
