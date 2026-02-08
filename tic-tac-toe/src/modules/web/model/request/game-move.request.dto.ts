import { IsArray, IsNotEmpty } from 'class-validator';

/**
 * Game Move Request DTO
 * Foydalanuvchi yuboradigan o'yin holati
 *
 * POST /game/:uuid body si
 */
export class GameMoveRequestDto {
  /**
   * O'yin taxtasi (3x3 matrix)
   *
   * Qiymatlar:
   *  0 = bo'sh
   *  1 = foydalanuvchi (X)
   *  2 = kompyuter (O)
   */
  @IsArray()
  @IsNotEmpty()
  board: number[][];
}
