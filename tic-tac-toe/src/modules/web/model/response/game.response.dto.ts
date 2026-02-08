/**
 * Game Response DTO
 * Serverdan qaytadigan o'yin holati
 *
 * Kompyuter yurgandan keyingi holat
 */
export class GameResponseDto {
  /**
   * O'yin UUID
   */
  uuid: string;

  /**
   * Yangilangan o'yin taxtasi (kompyuter yurishi bilan)
   *
   * Qiymatlar:
   *  0 = bo'sh
   *  1 = foydalanuvchi (X)
   *  2 = kompyuter (O)
   */
  board: number[][];

  constructor(uuid: string, board: number[][]) {
    this.uuid = uuid;
    this.board = board;
  }
}
