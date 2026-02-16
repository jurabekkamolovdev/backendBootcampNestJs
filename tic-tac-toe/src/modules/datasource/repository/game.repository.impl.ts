import { Injectable } from '@nestjs/common';
import { IGameRepository } from './game.repository.interface';
import { GameStorage } from '../storage/game.storage';
import { Game } from '../../domain/model/game.model';
import { GameDataMapper } from '../mapper/game-data.mapper';

@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(
    private readonly gameStorage: GameStorage,
    private readonly gameDataMapper: GameDataMapper,
  ) {}

  async save(game: Game): Promise<Game> {
    const entity = this.gameDataMapper.toEntity(game);

    this.gameStorage.set(entity.id, entity);

    await Promise.resolve();

    return game;
  }

  async findById(id: string): Promise<Game | null> {
    const entity = this.gameStorage.get(id);

    if (!entity) {
      return null;
    }

    await Promise.resolve();

    return this.gameDataMapper.toDomain(entity);
  }

  async delete(id: string): Promise<boolean> {
    await Promise.resolve();
    return this.gameStorage.delete(id);
  }
}
