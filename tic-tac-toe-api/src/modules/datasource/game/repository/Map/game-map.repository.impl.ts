import { Injectable } from '@nestjs/common';
import { GameDataMapper } from '../../mapper/game-data.mapper';
import { IGameRepositoryMap } from './game-map.repository.interface';
import { IGameEntity } from '../../model/interface/game.entity.interface';
import { Game } from 'src/modules/domain/game/model/game.model';

@Injectable()
export class GameRepositoryMapImpl implements IGameRepositoryMap {
  private readonly _db = new Map<string, IGameEntity>();

  constructor(private readonly gameDataMapper: GameDataMapper) {}

  save(domainGame: Game): boolean {
    const entity: IGameEntity = this.gameDataMapper.toEntity(domainGame);
    if (!entity?.uuid) {
      throw new Error(`GameEntity UUID mavjud emas`);
    }

    if (this._db.has(entity.uuid)) {
      throw new Error(`O'yin allaqachon mavjud: ${entity.uuid}`);
    }

    this._db.set(entity.uuid, entity);
    return true;
  }

  update(domainGame: Game): boolean {
    const entity: IGameEntity = this.gameDataMapper.toEntity(domainGame);

    if (!this._db.has(entity.uuid)) {
      throw new Error(`O'yin topilmadi: ${entity.uuid}`);
    }

    this._db.set(entity.uuid, entity);
    return true;
  }

  findById(gameUuid: string): Game | null {
    const entity: IGameEntity | undefined = this._db.get(gameUuid);
    console.log(entity);
    if (!entity) {
      return null;
    }

    return this.gameDataMapper.toDomain(entity);
  }

  delete(gameUuid: string): boolean {
    if (!this._db.has(gameUuid)) {
      throw new Error(`O'yin topilmadi: ${gameUuid}`);
    }

    this._db.delete(gameUuid);
    return true;
  }
}
