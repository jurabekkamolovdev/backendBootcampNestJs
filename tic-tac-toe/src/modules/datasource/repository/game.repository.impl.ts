import { Injectable } from '@nestjs/common';
import { IGameRepository } from './game.repository.interface';
import { Game } from '../../domain/model/game.model';
import { GameStorage } from '../storage/game.storage';
import { GameDataMapper } from '../mapper/game-data.mapper';

/**
 * Game Repository Implementation
 * Implements game storage operations using Storage and Mapper
 *
 * Bu - repository implementatsiyasi
 * Storage va Mapper dan foydalanadi
 */
@Injectable()
export class GameRepositoryImpl implements IGameRepository {
  constructor(
    private readonly gameStorage: GameStorage, // Saqlash uchun
    private readonly gameDataMapper: GameDataMapper, // O'zgartirish uchun
  ) {}

  /**
   * O'yinni saqlash
   * Domain model → Entity → Storage
   */
  async save(game: Game): Promise<Game> {
    // 1. Domain modelni Entity ga o'zgartirish
    const entity = this.gameDataMapper.toEntity(game);

    // 2. Entity ni storage ga saqlash
    this.gameStorage.set(entity.id, entity);

    // 3. Saqlangan o'yinni qaytarish
    await Promise.resolve();
    return game;
  }

  /**
   * O'yinni ID orqali olish
   * Storage → Entity → Domain model
   */
  async findById(id: string): Promise<Game | null> {
    // 1. Storage dan entity ni olish
    const entity = this.gameStorage.get(id);

    // 2. Agar topilmasa, null qaytarish
    if (!entity) {
      return null;
    }

    // 3. Entity ni Domain modelga o'zgartirish
    const domainGame = this.gameDataMapper.toDomain(entity);
    await Promise.resolve();
    return domainGame;
  }

  /**
   * O'yinni o'chirish
   */
  async delete(id: string): Promise<boolean> {
    await Promise.resolve();
    return this.gameStorage.delete(id);
  }

  /**
   * Barcha o'yinlarni olish
   */
  async findAll(): Promise<Game[]> {
    // 1. Barcha ID larni olish
    const ids = this.gameStorage.getAllIds();

    // 2. Har bir ID uchun entity olish
    const entities = ids
      .map((id) => this.gameStorage.get(id))
      .filter((entity) => entity !== undefined) as any[];

    // 3. Entity larni Domain modelga o'zgartirish
    const domainGames = this.gameDataMapper.toDomainArray(entities);
    await Promise.resolve();

    return domainGames;
  }

  /**
   * O'yin mavjudligini tekshirish
   */
  async exists(id: string): Promise<boolean> {
    await Promise.resolve();
    return this.gameStorage.has(id);
  }
}
