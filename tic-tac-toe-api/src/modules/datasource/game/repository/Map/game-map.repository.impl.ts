import { Injectable } from '@nestjs/common';
import { GameDataMapper } from '../../mapper/game-data.mapper';
import { IGameRepositoryMap } from './game-map.repository.interface';
import { IGameEntity } from '../../model/interface/game.entity.interface';
import { Game } from 'src/modules/domain/game/model/game.model';

@Injectable()
export class GameRepositoryMapImpl implements IGameRepositoryMap {
  private readonly _db = new Map<string, IGameEntity>();
  private readonly _playerGame = new Set<string>();

  constructor(private readonly gameDataMapper: GameDataMapper) {}

  save(domainGame: Game, playerUuid: string): boolean {
    const entity: IGameEntity = this.gameDataMapper.toEntity(domainGame);
    if (!entity?.uuid) {
      throw new Error(`GameEntity UUID mavjud emas`);
    }

    if (this._db.has(entity.uuid)) {
      throw new Error(`O'yin allaqachon mavjud: ${entity.uuid}`);
    }

    this._db.set(entity.uuid, entity);
    this._playerGame.add(playerUuid);

    return true;
  }

  delete(domainGame: Game): void {
    const entity: IGameEntity = this.gameDataMapper.toEntity(domainGame);

    if (!this._db.has(entity.uuid)) {
      throw new Error(`O'yin mavjud emas: ${entity.uuid}`);
    }

    this._db.delete(entity.uuid);

    if (entity.playerO) {
      if (this._playerGame.has(entity.playerO.uuid))
        this._playerGame.delete(entity.playerO.uuid);
    }

    if (entity.playerX) {
      if (this._playerGame.has(entity.playerX.uuid))
        this._playerGame.delete(entity.playerX.uuid);
    }
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

  isPlayerInGame(playerUuid: string): boolean {
    return this._playerGame.has(playerUuid);
  }
}
