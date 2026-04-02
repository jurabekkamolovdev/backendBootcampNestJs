import type { Game } from '../../domain/model/game.model';
import type { GameEntity } from '../model/game.entity';

export function toEntity(domain: Game): GameEntity {
  return {
    uuid: domain.uuid,
    board: domain.board,
    playerXUuid: domain.playerXUuid,
    playerOUuid: domain.playerOUuid,
    vsComputer: domain.vsComputer,
    stateKind: domain.state.kind,
    stateUserUuid:
      domain.state.kind === 'turn' || domain.state.kind === 'win'
        ? domain.state.userUuid
        : undefined,
  };
}

export function toDomain(entity: GameEntity): Game {
  const state =
    entity.stateKind === 'waiting_for_players'
      ? ({ kind: 'waiting_for_players' } as const)
      : entity.stateKind === 'draw'
        ? ({ kind: 'draw' } as const)
        : entity.stateKind === 'turn'
          ? ({ kind: 'turn', userUuid: entity.stateUserUuid ?? '' } as const)
          : ({ kind: 'win', userUuid: entity.stateUserUuid ?? '' } as const);

  return {
    uuid: entity.uuid,
    board: entity.board,
    playerXUuid: entity.playerXUuid,
    playerOUuid: entity.playerOUuid,
    vsComputer: entity.vsComputer,
    state,
  };
}
