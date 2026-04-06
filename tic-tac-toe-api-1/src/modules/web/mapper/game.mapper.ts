import type { Game } from '../../domain/model/game.model';
import { assertValidSubmittedBoardShape } from '../../domain/service/game-rules';
import type { GameDto } from '../model/game.dto';

export function toDomain(dto: GameDto): Game {
  assertValidSubmittedBoardShape(dto.board);
  return {
    uuid: dto.uuid,
    board: dto.board,
    playerXUuid: dto.playerXUuid,
    playerOUuid: dto.playerOUuid,
    vsComputer: dto.vsComputer,
    state: dto.state,
  };
}

export function toDto(domain: Game): GameDto {
  return {
    uuid: domain.uuid,
    board: domain.board,
    playerXUuid: domain.playerXUuid,
    playerOUuid: domain.playerOUuid,
    vsComputer: domain.vsComputer,
    state: domain.state,
  };
}
