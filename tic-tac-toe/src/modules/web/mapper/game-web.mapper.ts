import { Injectable } from '@nestjs/common';
import { Game } from '../../domain/model/game.model';
import { GameBoard } from '../../domain/model/game-board.model';
import { GameMoveRequestDto } from '../model/request/game-move.request.dto';
import { GameResponseDto } from '../model/response/game.response.dto';

/**
 * Game Web Mapper
 * Domain va Web modellarni o'zgartirish
 *
 * Web (DTO) ↔ Domain (Model)
 */
@Injectable()
export class GameWebMapper {
  /**
   * Request DTO ni Domain modelga o'zgartirish
   * GameMoveRequestDto → Game
   *
   * @param uuid - O'yin UUID
   * @param dto - Request DTO
   * @returns Domain Game modeli
   */
  requestToDomain(uuid: string, dto: GameMoveRequestDto): Game {
    // DTO dan board ni olish
    const boardData = dto.board;

    // GameBoard yaratish
    const gameBoard = new GameBoard(boardData);

    // Game yaratish
    const game = new Game(uuid, gameBoard);

    return game;
  }

  /**
   * Domain modelni Response DTO ga o'zgartirish
   * Game → GameResponseDto
   *
   * @param game - Domain Game modeli
   * @returns Response DTO
   */
  domainToResponse(game: Game): GameResponseDto {
    // Response DTO yaratish
    const responseDto = new GameResponseDto(
      game.getId(),
      game.getBoard().getBoard(),
    );

    return responseDto;
  }

  /**
   * Board massivni Domain GameBoard ga o'zgartirish
   * number[][] → GameBoard
   *
   * @param boardData - Taxta massivi
   * @returns GameBoard modeli
   */
  boardArrayToDomain(boardData: number[][]): GameBoard {
    return new GameBoard(boardData);
  }

  /**
   * Domain GameBoard ni massivga o'zgartirish
   * GameBoard → number[][]
   *
   * @param gameBoard - GameBoard modeli
   * @returns Taxta massivi
   */
  domainBoardToArray(gameBoard: GameBoard): number[][] {
    return gameBoard.getBoard();
  }
}
