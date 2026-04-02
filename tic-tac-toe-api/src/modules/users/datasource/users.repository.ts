import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDbModel } from './user.db-model';
import type { User } from '../domain/user.model';
import type { UsersRepository } from './users.repository.interface';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(
    @InjectModel(UserDbModel) private readonly users: typeof UserDbModel,
  ) {}

  async findByLogin(login: string): Promise<User | undefined> {
    const model = await this.users.findOne({ where: { login } });
    if (!model) return undefined;
    return {
      uuid: model.uuid,
      login: model.login,
      passwordHash: model.passwordHash,
    };
  }

  async findByUuid(uuid: string): Promise<User | undefined> {
    const model = await this.users.findByPk(uuid);
    if (!model) return undefined;
    return {
      uuid: model.uuid,
      login: model.login,
      passwordHash: model.passwordHash,
    };
  }

  async create(user: User): Promise<void> {
    await this.users.create({
      uuid: user.uuid,
      login: user.login,
      passwordHash: user.passwordHash,
    });
  }
}
