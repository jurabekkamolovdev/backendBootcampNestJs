import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../model/user.entity';
import { type IUserRepository } from './user.repository.interface';
import { UserDataMapper } from '../mapper/user-data.mapper';
import { User } from 'src/modules/domain/user/model/user.model';
import { IUserEntity } from '../model/interface/user.entity.interface';
import { literal } from 'sequelize';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly users: typeof UserEntity,
    private readonly mapper: UserDataMapper,
  ) {}

  async save(domainUser: User): Promise<boolean> {
    const entity: IUserEntity = this.mapper.toEntity(domainUser);
    await this.users.upsert({
      id: entity.id,
      login: entity.login,
      passwordHash: entity.passwordHash,
      wins: entity.wins,
      draws: entity.draws,
      losses: entity.losses,
    });
    return true;
  }

  async findByLogin(userLogin: string): Promise<User | null> {
    const entity = await this.users.findOne({
      where: {
        login: userLogin,
      },
    });

    if (!entity) {
      throw new Error(`Bunday foydlanuvchi yoq: ${userLogin}`);
    }
    return this.mapper.toDomain(entity);
  }

  async findByUuid(userUuid: string): Promise<User | null> {
    const entity: UserEntity | null = await this.users.findOne({
      where: {
        id: userUuid,
      },
    });

    if (!entity) {
      return null;
    }

    const user: User = this.mapper.toDomain(entity);

    return user;
  }

  async getLeaderboard(
    limit: number,
  ): Promise<Array<{ playerUuid: string; winRatio: number }>> {
    const result = await this.users.findAll({
      attributes: [
        'id',
        'wins',
        'draws',
        'losses',
        [literal(`wins::float / NULLIF(draws + losses, 0)`), 'winRatio'],
      ],
      order: [[literal('wins::float / NULLIF(draws + losses, 0)'), 'DESC']],
      limit,
    });

    return result.map((user) => ({
      playerUuid: user.id,
      winRatio: (user.get('winRatio') as number) ?? 0,
    }));
  }

  async incrementWinAndLoss(
    winnerPlayerUuid: string,
    lossesPlayerUuid: string,
  ): Promise<void> {
    await this.users.increment(
      { wins: 1 },
      { where: { id: winnerPlayerUuid } },
    );

    await this.users.increment(
      { losses: 1 },
      { where: { id: lossesPlayerUuid } },
    );
  }

  async incrementDraws(
    playerUuid1: string,
    playerUuid2: string,
  ): Promise<void> {
    await this.users.increment(
      { draws: 1 },
      { where: { id: [playerUuid1, playerUuid2] } },
    );
  }
}
