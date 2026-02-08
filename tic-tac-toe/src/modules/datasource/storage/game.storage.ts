import { Injectable } from '@nestjs/common';
import { GameEntity } from '../model/game.entity';

/**
 * Game Storage
 * In-memory storage for current games
 *
 * Bu - o'yinlarni xotirada saqlash uchun klass
 * Haqiqiy loyihada bu database bo'lishi mumkin (PostgreSQL, MongoDB va h.k.)
 */
@Injectable()
export class GameStorage {
  // Map: UUID -> GameEntity
  // Har bir o'yin UUID orqali saqlanadi
  private readonly games: Map<string, GameEntity> = new Map();

  /**
   * O'yinni saqlash
   * @param id - O'yin UUID
   * @param entity - O'yin entity
   */
  set(id: string, entity: GameEntity): void {
    this.games.set(id, entity);
  }

  /**
   * O'yinni olish
   * @param id - O'yin UUID
   * @returns GameEntity yoki undefined
   */
  get(id: string): GameEntity | undefined {
    return this.games.get(id);
  }

  /**
   * O'yinni o'chirish
   * @param id - O'yin UUID
   * @returns true agar o'chirilgan bo'lsa, aks holda false
   */
  delete(id: string): boolean {
    return this.games.delete(id);
  }

  /**
   * O'yin mavjudligini tekshirish
   * @param id - O'yin UUID
   * @returns true agar mavjud bo'lsa
   */
  has(id: string): boolean {
    return this.games.has(id);
  }

  /**
   * Barcha o'yinlarni o'chirish
   */
  clear(): void {
    this.games.clear();
  }

  /**
   * O'yinlar sonini olish
   * @returns O'yinlar soni
   */
  size(): number {
    return this.games.size;
  }

  /**
   * Barcha o'yin ID larini olish
   * @returns O'yin ID lari ro'yxati
   */
  getAllIds(): string[] {
    return Array.from(this.games.keys());
  }
}
