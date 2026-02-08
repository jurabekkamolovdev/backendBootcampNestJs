import { Game } from '../../domain/model/game.model';

/**
 * Game Repository Interface
 * Defines contract for game storage operations
 *
 * Bu - o'yinlarni saqlash operatsiyalari uchun interfeys
 */
export interface IGameRepository {
  /**
   * O'yinni saqlash
   * @param game - Saqlanadigan o'yin
   * @returns Saqlangan o'yin
   */
  save(game: Game): Promise<Game>;

  /**
   * O'yinni ID orqali olish
   * @param id - O'yin UUID
   * @returns Topilgan o'yin yoki null
   */
  findById(id: string): Promise<Game | null>;

  /**
   * O'yinni o'chirish
   * @param id - O'yin UUID
   * @returns true agar o'chirilgan bo'lsa
   */
  delete(id: string): Promise<boolean>;

  /**
   * Barcha o'yinlarni olish
   * @returns O'yinlar ro'yxati
   */
  findAll(): Promise<Game[]>;

  /**
   * O'yin mavjudligini tekshirish
   * @param id - O'yin UUID
   * @returns true agar mavjud bo'lsa
   */
  exists(id: string): Promise<boolean>;
}
