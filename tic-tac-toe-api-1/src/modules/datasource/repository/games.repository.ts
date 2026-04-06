import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import type { GameEntity } from '../model/game.entity';
import { toDomain, toEntity } from '../mapper/game.mapper';
import { GameDbModel } from '../model/game.db-model';
import type { Game } from '../../domain/model/game.model';
import type { GamesRepository } from './games.repository.interface';

@Injectable()
export class GamesRepositoryImpl implements GamesRepository {
  constructor(
    @InjectModel(GameDbModel) private readonly games: typeof GameDbModel,
  ) {}

  async save(game: Game): Promise<void> {
    const entity = toEntity(game);
    await this.games.upsert({
      uuid: entity.uuid,
      board: entity.board,
      playerXUuid: entity.playerXUuid,
      playerOUuid: entity.playerOUuid,
      vsComputer: entity.vsComputer,
      stateKind: entity.stateKind,
      stateUserUuid: entity.stateUserUuid,
    });
  }

  async get(uuid: string): Promise<Game | undefined> {
    const dbModel = await this.games.findByPk(uuid);
    if (!dbModel) return undefined;
    const entity: GameEntity = {
      uuid: dbModel.uuid,
      board: dbModel.board,
      playerXUuid: dbModel.playerXUuid,
      playerOUuid: dbModel.playerOUuid,
      vsComputer: dbModel.vsComputer,
      stateKind: dbModel.stateKind,
      stateUserUuid: dbModel.stateUserUuid,
    };
    return toDomain(entity);
  }

  async listWaitingForPlayers(): Promise<Game[]> {
    const models = await this.games.findAll({
      where: { stateKind: 'waiting_for_players' },
      order: [['uuid', 'ASC']],
    });
    return models.map((m) =>
      toDomain({
        uuid: m.uuid,
        board: m.board,
        playerXUuid: m.playerXUuid,
        playerOUuid: m.playerOUuid,
        vsComputer: m.vsComputer,
        stateKind: m.stateKind,
        stateUserUuid: m.stateUserUuid,
      }),
    );
  }
}
