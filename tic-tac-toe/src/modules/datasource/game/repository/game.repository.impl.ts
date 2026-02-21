import { Injectable } from '@nestjs/common';
import { IGameRepository } from './game.repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import { GameModel } from '../model/game.entity';
import { Game } from '../../../domain/game/model/game.model';
import { GameDataMapper } from '../mapper/game-data.mapper';

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(
    // private readonly gameStorage: GameStorage,
    @InjectModel(GameModel)
    private readonly gameModel: typeof GameModel,
    private readonly gameDataMapper: GameDataMapper,
  ) {}

  // async save(game: Game): Promise<Game> {
  //   const entity = this.gameDataMapper.toEntity(game);
  //
  //   await entity.save();
  //
  //   await Promise.resolve();
  //
  //   return game;
  // }

  async save(game: Game): Promise<Game> {
    const entity = this.gameDataMapper.toEntity(game);
    await this.gameModel.upsert(entity.get());

    return game;
  }

  // async save(game: Game): Promise<Game> {
  //   const existing = await this.gameModel.findByPk(game.getId());
  //
  //   if (existing) {
  //     // Update
  //     await existing.update({
  //       board: {
  //         cells: game.getBoard().getBoard(),
  //         size: game.getBoard().getSize(),
  //       },
  //     });
  //   } else {
  //     // Create
  //     await this.gameModel.create({
  //       uuid: game.getId(),
  //       board: {
  //         cells: game.getBoard().getBoard(),
  //         size: game.getBoard().getSize(),
  //       },
  //     });
  //   }
  //
  //   return game;
  // }
  // async findById(id: string): Promise<Game | null> {
  //   const entity = await this.gameModel.findByPk(id);
  //
  //   if (!entity) {
  //     return null;
  //   }
  //
  //   await Promise.resolve();
  //
  //   return this.gameDataMapper.toDomain(entity);
  // }

  // async delete(id: string): Promise<boolean> {
  //   const deleted = await this.gameModel.destroy({ where: { uuid: id } });
  //   return deleted > 0;
  // }
}
